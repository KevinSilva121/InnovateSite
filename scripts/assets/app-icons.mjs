// Baixa os ícones oficiais dos apps (CDN da Play Store) e os badges das lojas. Roda uma vez; saída commitada.
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const icons = {
  calcfrete: 'https://play-lh.googleusercontent.com/e9pN90OowNdPlu5tPwr09d89yhz0sVngDFJNAwePJcdSEQDF60Wh-deaW1dNjhbUxrodT643Yb2RAFoji14WRw=s512',
  'contador-de-cantos': 'https://play-lh.googleusercontent.com/rrjPWwiHTpusMQcubqoH7o8lKfMsQPg_3uVqDJVdOSZ3dPJKWNuqVnqm-8oagi7suh7zkTdLVpAMTcVaSwLyEqY=s512',
  prazzo: 'https://play-lh.googleusercontent.com/eb8llslzPPn7l7W3H_vHoHdh6PCurmKLebTvPumLdZFHNUfoLv3G_qhsS9e_KJl-qzk2vkecyTU3D1NI-DkS=s512',
  trama: 'https://play-lh.googleusercontent.com/i5wdMEJqoLpv5bdBKkWq2wO-GW4dm-04OfouxuhfekmkmsTKYePtvmakJD2dxnHHIrAT0SqywlNAcPXexz9mrw=s512',
};

const badges = {
  'google-play-pt-br.png': 'https://play.google.com/intl/pt-BR/badges/static/images/badges/pt-br_badge_web_generic.png',
  'app-store-pt-br.svg': 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/pt-br?size=250x83&releaseDate=1276560000',
};

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ao baixar ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

mkdirSync('public/apps', { recursive: true });
mkdirSync('public/badges', { recursive: true });

for (const [slug, url] of Object.entries(icons)) {
  const png = await fetchBuffer(url);
  await sharp(png).resize(192, 192).webp({ quality: 86 }).toFile(`public/apps/${slug}.webp`);
  console.log('ícone:', slug);
}
for (const [file, url] of Object.entries(badges)) {
  writeFileSync(`public/badges/${file}`, await fetchBuffer(url));
  console.log('badge:', file);
}
