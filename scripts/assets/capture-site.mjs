// Captura a primeira dobra de um site em desktop e celular, para os cases.
// Uso: node scripts/assets/capture-site.mjs <url> <pasta-de-saída>
// Gera desktop.png (1440×900, densidade 1) e mobile.png (390×844, densidade 3).
// Usa o Chrome instalado via protocolo de depuração (CDP), sem dependência nova.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const [url, saida] = process.argv.slice(2);
if (!url || !saida) throw new Error('uso: node scripts/assets/capture-site.mjs <url> <pasta-de-saída>');
mkdirSync(saida, { recursive: true });

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9241;
const perfil = mkdtempSync(join(tmpdir(), 'captura-'));
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${perfil}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const encerrar = () => {
  try { proc.kill(); } catch { /* já saiu */ }
  try { rmSync(perfil, { recursive: true, force: true }); } catch { /* arquivos presos */ }
};
process.on('exit', encerrar);

let alvo;
for (let i = 0; i < 60 && !alvo; i++) {
  try { alvo = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch { /* ainda subindo */ }
  if (!alvo) await sleep(250);
}
if (!alvo) throw new Error('o Chrome não respondeu');

const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let n = 0;
const pendentes = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m); pendentes.delete(m.id); }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++n; pendentes.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
const formatos = [
  { nome: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  { nome: 'mobile', width: 390, height: 844, deviceScaleFactor: 3, mobile: true },
];
for (const f of formatos) {
  await send('Emulation.setDeviceMetricsOverride', { width: f.width, height: f.height, deviceScaleFactor: f.deviceScaleFactor, mobile: f.mobile });
  await send('Emulation.setUserAgentOverride', {
    userAgent: f.mobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  });
  await send('Page.navigate', { url });
  // Tempo para fontes, imagens e animações de entrada terminarem.
  await sleep(6000);
  const { result } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const arquivo = resolve(saida, `${f.nome}.png`);
  writeFileSync(arquivo, Buffer.from(result.data, 'base64'));
  console.log('captura:', arquivo);
}
ws.close();
encerrar();
process.exit(0);
