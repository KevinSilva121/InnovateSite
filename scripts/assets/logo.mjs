// Separa a marca (creme) do fundo navy do PNG original e gera favicons e ícones.
// alpha = (luminância − fundo) / (marca − fundo); a cor final é o creme do logo (#E9E6DE).
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'src/presentation/assets/logo-ai.png';
const CREAM = [233, 230, 222];
const NAVY = '#010D33';

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const lum = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
const bg = lum(0);
let fg = 0;
for (let i = 0; i < data.length; i += 3) fg = Math.max(fg, lum(i));

const out = Buffer.alloc(info.width * info.height * 4);
for (let p = 0, i = 0; i < data.length; i += 3, p += 4) {
  const a = Math.min(1, Math.max(0, (lum(i) - bg) / (fg - bg)));
  out[p] = CREAM[0]; out[p + 1] = CREAM[1]; out[p + 2] = CREAM[2]; out[p + 3] = Math.round(a * 255);
}

mkdirSync('public/logo', { recursive: true });
const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer();
await sharp(trimmed).resize({ height: 256 }).png().toFile('public/logo/mark.png');

async function squareIcon(size, file) {
  const mark = await sharp(trimmed).resize({ width: Math.round(size * 0.6), height: Math.round(size * 0.6), fit: 'inside' }).toBuffer();
  const bgSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="${NAVY}"/></svg>`);
  await sharp(bgSvg).composite([{ input: mark, gravity: 'centre' }]).png().toFile(file);
  console.log('ícone:', file);
}
await squareIcon(512, 'public/logo/mark-512.png');
await squareIcon(512, 'public/icon-512.png');
await squareIcon(192, 'public/icon-192.png');
await squareIcon(180, 'public/apple-touch-icon.png');
await squareIcon(32, 'public/favicon-32.png');

const markB64 = (await sharp(trimmed).resize({ width: 160, height: 160, fit: 'inside' }).png().toBuffer()).toString('base64');
writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="13" fill="${NAVY}"/><image href="data:image/png;base64,${markB64}" x="13" y="13" width="38" height="38" preserveAspectRatio="xMidYMid meet"/></svg>\n`,
);
console.log('marca e favicons gerados');
