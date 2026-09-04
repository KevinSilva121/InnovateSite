// Uso: node scripts/dev/screenshot.mjs http://localhost:4173 / /sites/ /aplicativos/
// Gera screenshots/<rota>-desktop.png (1440x1000) e -mobile.png (390x844) com o Chrome headless.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [base, ...routes] = process.argv.slice(2);
if (!base) throw new Error('informe a URL base, ex.: http://localhost:4173');
mkdirSync('screenshots', { recursive: true });

const sizes = { desktop: '1440,1000', mobile: '390,844' };
for (const route of routes.length ? routes : ['/']) {
  const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  for (const [label, size] of Object.entries(sizes)) {
    const out = resolve('screenshots', `${name}-${label}.png`);
    execFileSync(chrome, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${size}`,
      '--virtual-time-budget=5000', `--screenshot=${out}`, `${base}${route}`,
    ], { stdio: 'ignore' });
    console.log('screenshot:', out);
  }
}
