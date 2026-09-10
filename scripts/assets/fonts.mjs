// Copia as fontes variáveis (subset latin) dos pacotes fontsource para public/fonts.
// Roda uma vez (npm run assets); os arquivos gerados são commitados.
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const fonts = [
  ['@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2', 'bricolage-grotesque.woff2'],
  ['@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2', 'instrument-sans.woff2'],
];

mkdirSync('public/fonts', { recursive: true });
for (const [src, out] of fonts) {
  copyFileSync(resolve('node_modules', src), resolve('public/fonts', out));
  console.log('fonte copiada:', out);
}
