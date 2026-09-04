// Gera as telas do feed do hero (public/showcase). Roda uma vez; a saída é commitada.
// Fontes: capturas oficiais das fichas da Google Play e uma captura do site entregue ao cliente.
// As telas do Prazzo foram descartadas de propósito: as da loja estão em inglês e com listas vazias.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

// Todas as telas saem no formato exato da tela do iPhone do hero (9 / 19.5).
// Isso é obrigatório para o feed avançar exatamente uma tela por vez.
const WIDTH = 540; // ~270 px na tela, com folga para telas 2x
const HEIGHT = Math.round((WIDTH * 19.5) / 9); // 1170
const OUT = 'public/showcase';

// Recorta a barra de navegação do Android antes de enquadrar: um iPhone não mostra
// os botões do Android. Fração da altura da imagem original.
const NAV_CROP = { '02-calcfrete-financas': 0.062, '04-calcfrete-receita': 0.062 };

async function frame(buffer, name) {
  const cut = NAV_CROP[name] ?? 0;
  let img = sharp(buffer);
  if (cut > 0) {
    const meta = await img.metadata();
    const keep = Math.round(meta.height * (1 - cut));
    img = sharp(await img.extract({ left: 0, top: 0, width: meta.width, height: keep }).toBuffer());
  }
  await img
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' })
    .webp({ quality: 78 })
    .toFile(`${OUT}/${name}.webp`);
  console.log('tela:', name);
}

// Ordem do feed: alterna site e apps para não repetir o mesmo produto em sequência.
const playShots = [
  ['02-calcfrete-financas', 'GGdw-F9MSefTtFKaP0tATOkRUGiktjXPDl68fJnrKSxpwPhjUFzgk6QV0-hbXxHgXQCsORfXKtjS0ANTW2HmiQ'],
  ['03-contador-cronometro', 'BihA9_MYnEgeR6rs1KzW42PO3nmwloG0fy7-frS08cKnfmo5Czk-w3twe2ymbb6mHDCdzX31YFRpBIvEgRk8Dw'],
  ['04-calcfrete-receita', 'DX7S4Agnlt3GN_ehgU_uypjmkg7qObaViqcx5y09WkyrT_CZn_tHNwtow_bp7HBoYosP4c1JKWbYeIZhNAQ-'],
];

const SITE_URL = 'https://advalicecamargo.com.br/';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function captureSite() {
  const dir = mkdtempSync(join(tmpdir(), 'showcase-'));
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--remote-debugging-port=9455', `--user-data-dir=${dir}`, 'about:blank',
  ], { stdio: 'ignore' });
  chrome.on('error', (err) => {
    console.error('não foi possível iniciar o Chrome em', CHROME, '-', err.message);
    process.exit(1);
  });
  const cleanup = () => {
    try { chrome.kill(); } catch { /* já encerrado */ }
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* já removido */ }
  };
  try {
    let ws;
    for (let i = 0; i < 40 && !ws; i += 1) {
      try {
        const targets = await (await fetch('http://127.0.0.1:9455/json/list')).json();
        const page = targets.find((t) => t.type === 'page');
        if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
      } catch { /* Chrome ainda subindo */ }
      if (!ws) await sleep(300);
    }
    if (!ws) throw new Error('Chrome não respondeu na porta de depuração');
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    });
    const send = (method, params = {}) => new Promise((res) => {
      const i = (id += 1); pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params }));
    });
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: SITE_URL });
    await sleep(7000);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    return Buffer.from(shot.result.data, 'base64');
  } finally {
    cleanup();
  }
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ao baixar ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

mkdirSync(OUT, { recursive: true });

await frame(await captureSite(), '01-site-alice-camargo');

for (const [name, id] of playShots) {
  await frame(await fetchBuffer(`https://play-lh.googleusercontent.com/${id}=w720`), name);
}
