// Copia as fontes (subset latin, que cobre os acentos do português) dos pacotes
// fontsource para public/fonts. Roda uma vez (npm run assets); os arquivos são commitados.
//
// Três papéis tipográficos:
//   títulos   Special Gothic Condensed One (peso único, condensada e alta)
//   texto     IBM Plex Sans (variável, 100–700)
//   etiquetas JetBrains Mono (variável, 100–800): menus, botões, números
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const fonts = [
  ['@fontsource/special-gothic-condensed-one/files/special-gothic-condensed-one-latin-400-normal.woff2', 'special-gothic-condensed-one.woff2'],
  ['@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2', 'ibm-plex-sans.woff2'],
  ['@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', 'jetbrains-mono.woff2'],
];

mkdirSync('public/fonts', { recursive: true });
// Remove fontes que não estão mais na lista, para não publicar arquivo morto.
const manter = new Set(fonts.map(([, out]) => out));
for (const arquivo of readdirSync('public/fonts')) {
  if (!manter.has(arquivo)) rmSync(resolve('public/fonts', arquivo));
}
for (const [src, out] of fonts) {
  copyFileSync(resolve('node_modules', src), resolve('public/fonts', out));
  console.log('fonte copiada:', out);
}
