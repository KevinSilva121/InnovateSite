// Uso: node scripts/dev/screenshot.mjs http://localhost:4173 / /sites/ /aplicativos/
// Gera screenshots/<rota>-desktop.png (1440 largura) e -mobile.png (390 largura), altura de página inteira,
// via CDP com emulação real de viewport (não apenas corte de imagem).
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [base, ...routes] = process.argv.slice(2);
if (!base) throw new Error('informe a URL base, ex.: http://localhost:4173');
mkdirSync('screenshots', { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const viewports = {
  desktop: { width: 1440, height: 1000, mobile: false },
  mobile: { width: 390, height: 844, mobile: true },
};

const userDataDir = mkdtempSync(resolve(tmpdir(), 'chrome-shot-'));
const port = 9222;

const child = spawn(
  chrome,
  ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, 'about:blank'],
  { stdio: 'ignore' }
);

let exiting = false;
const cleanup = () => {
  if (exiting) return;
  exiting = true;
  try { child.kill(); } catch { /* noop */ }
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch { /* noop */ }
};
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });

async function waitForTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch { /* retry */ }
    await sleep(250);
  }
  throw new Error('Chrome não respondeu na porta de depuração remota a tempo.');
}

async function main() {
  const target = await waitForTarget();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    ws.addEventListener('open', () => resolveOpen(), { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
    if (m.method) for (const fn of listeners) fn(m);
  });
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const waitForEvent = (method, timeoutMs = 15000) =>
    new Promise((res) => {
      const timer = setTimeout(() => {
        listeners.delete(fn);
        res(null);
      }, timeoutMs);
      const fn = (m) => {
        if (m.method === method) {
          clearTimeout(timer);
          listeners.delete(fn);
          res(m);
        }
      };
      listeners.add(fn);
    });

  await send('Page.enable');
  await send('Runtime.enable');

  const evalJs = async (expression) =>
    (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result
      ?.value;

  for (const route of routes.length ? routes : ['/']) {
    const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    for (const [label, vp] of Object.entries(viewports)) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      const loadEvent = waitForEvent('Page.loadEventFired');
      await send('Page.navigate', { url: `${base}${route}` });
      await loadEvent;
      await sleep(800); // fontes e animações de reveal

      // Sonda de overflow horizontal antes de recompor a viewport para a captura de página inteira.
      const overflow = await evalJs(`(() => {
        const vw = window.innerWidth;
        const sw = document.documentElement.scrollWidth;
        if (sw <= vw) return { overflow: false };
        let offender = null;
        let maxRight = vw;
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > maxRight) {
            maxRight = r.right;
            offender = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : '');
          }
        }
        return { overflow: true, scrollWidth: sw, viewportWidth: vw, offender };
      })()`);
      if (overflow && overflow.overflow) {
        console.log(
          `overflow [${name}-${label}]: scrollWidth=${overflow.scrollWidth} viewportWidth=${overflow.viewportWidth} offender=${overflow.offender}`
        );
      } else {
        console.log(`overflow [${name}-${label}]: none`);
      }

      const metrics = await send('Page.getLayoutMetrics');
      const contentHeight = Math.ceil(metrics.result.cssContentSize.height);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: contentHeight,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });
      // Expandir para a altura total do conteúdo torna tudo "visível" de uma vez, o que
      // reaciona o IntersectionObserver de [data-reveal] para as seções que ainda não tinham
      // entrado na viewport original; aguarda o observer disparar e a transição CSS (0.6s) terminar.
      await sleep(900);

      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      const out = resolve('screenshots', `${name}-${label}.png`);
      writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
      console.log('screenshot:', out);
    }
  }

  ws.close();
}

try {
  await main();
} finally {
  cleanup();
}
