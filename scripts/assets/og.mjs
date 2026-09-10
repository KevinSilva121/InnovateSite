// Gera public/og/default.png (1200x630) a partir do template, com o Chrome headless.
// Defina CHROME_PATH se o Chrome não estiver no caminho padrão do Windows.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = resolve('public/og/default.png');
mkdirSync('public/og', { recursive: true });
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${out}`,
  pathToFileURL(resolve('scripts/assets/og-template.html')).href,
], { stdio: 'ignore' });
console.log('og image:', out);
