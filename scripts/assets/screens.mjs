// Gera as telas dos cases a partir dos originais, em AVIF e WebP responsivos.
//
// Originais (fora do repositório): ../midia/site_telas, ou TELAS_SRC=/caminho.
//   <slug-do-app>/01.png, 02.webp...   telas de celular, na ordem do arquivo
//   advalice-camargo/desktop.png         captura 1440×900 (scripts/assets/capture-site.mjs)
//   advalice-camargo/mobile.png          captura 390×844 em densidade 3
//
// Saída commitada:
//   public/img/apps/<slug>/<nn>-<largura>.{avif,webp}
//   public/img/cases/<slug>-{desktop,mobile}-<largura>.{avif,webp}
//   src/data/generated/screens.json      larguras disponíveis, lidas pelos componentes
//
// Nenhuma imagem é ampliada: se o original é menor que a maior largura pedida,
// a maior saída fica com a largura do original.
import { mkdirSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = process.env.TELAS_SRC || join(process.cwd(), '..', 'midia', 'site_telas');
const CASES = ['advalice-camargo'];
const PHONE = 19.5 / 9; // altura / largura da tela de celular
const PHONE_WIDTHS = [280, 420, 560]; // a moldura mostra a tela com ~260–280 px CSS
const DESKTOP_WIDTHS = [640, 960, 1440];

if (!existsSync(SRC)) throw new Error(`pasta de originais não encontrada: ${SRC}`);

const larguras = (pedidas, original) => {
  const cabem = pedidas.filter((w) => w <= original);
  const maior = Math.floor(original / 2) * 2;
  if (cabem.length < pedidas.length && !cabem.includes(maior)) cabem.push(maior);
  return cabem;
};

// Captura mais "baixa" que a tela de um iPhone (sem a barra de status, ou de outro
// aparelho): em vez de cortar as laterais para preencher a moldura (o que dá
// efeito de zoom), completa o topo com uma barra de status de iPhone (hora,
// sinal, Wi-Fi e bateria) na cor do cabeçalho do app. A tela entra inteira e a
// ilha da moldura fica sobre a barra, como num aparelho de verdade.
// Medidas de um iPhone de 393 pt de largura; barra com ~13,5% da largura.
// forcar: põe a barra mesmo numa captura que já tem a proporção do iPhone (as
// capturas de site, tiradas pelo navegador, não têm barra de status).
async function comBarraDeStatus(origem, { forcar = false } = {}) {
  const meta = await sharp(origem).metadata();
  if (!forcar && meta.height / meta.width >= PHONE - 0.03) return origem;
  // Essas capturas costumam vir recortadas de um print maior: as primeiras linhas
  // trazem resto do que havia em cima. Sai 1% do topo antes de pôr a barra.
  const corte = Math.round(meta.height * 0.01);
  const limpa = await sharp(origem).extract({ left: 0, top: corte, width: meta.width, height: meta.height - corte }).png().toBuffer();
  const w = meta.width;
  const h = meta.height - corte;
  const barra = Math.round(Math.max(w * PHONE - h, w * 0.135));
  const { data } = await sharp(limpa).extract({ left: 0, top: 0, width: w, height: 2 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const media = [0, 1, 2].map((c) => {
    let soma = 0;
    for (let i = c; i < data.length; i += 3) soma += data[i];
    return Math.round(soma / (data.length / 3));
  });
  const [r, g, b] = media;
  const tinta = 0.2126 * r + 0.7152 * g + 0.0722 * b > 140 ? '#000' : '#fff';
  const s = w / 393;
  const cy = barra * 0.56; // linha do meio dos ícones
  const n = (v) => (v * s).toFixed(2);
  const sinal = [4, 6, 8.5, 11].map((alt, i) => `<rect x="${n(287 + i * 4.6)}" y="${(cy + 5.5 * s - alt * s).toFixed(2)}" width="${n(3)}" height="${n(alt)}" rx="${n(0.8)}"/>`).join('');
  const wx = 318 * s;
  const wy = cy + 5 * s;
  const arco = (raio) => `<path d="M${(wx - raio * s * 0.71).toFixed(2)} ${(wy - raio * s * 0.71).toFixed(2)} A${n(raio)} ${n(raio)} 0 0 1 ${(wx + raio * s * 0.71).toFixed(2)} ${(wy - raio * s * 0.71).toFixed(2)}" fill="none" stroke="${tinta}" stroke-width="${n(2.1)}" stroke-linecap="round"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${barra}">
    <rect width="100%" height="100%" fill="rgb(${r},${g},${b})"/>
    <text x="${n(54)}" y="${(cy + 5.5 * s).toFixed(2)}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="600" font-size="${n(16)}" fill="${tinta}">9:41</text>
    <g fill="${tinta}">${sinal}</g>
    ${arco(4.5)}${arco(8.5)}<circle cx="${wx.toFixed(2)}" cy="${(wy - 0.6 * s).toFixed(2)}" r="${n(1.6)}" fill="${tinta}"/>
    <rect x="${n(334)}" y="${(cy - 6 * s).toFixed(2)}" width="${n(25)}" height="${n(12)}" rx="${n(3.5)}" fill="none" stroke="${tinta}" stroke-opacity="0.4" stroke-width="${n(1)}"/>
    <rect x="${n(336)}" y="${(cy - 4 * s).toFixed(2)}" width="${n(21)}" height="${n(8)}" rx="${n(2)}" fill="${tinta}"/>
    <rect x="${n(360)}" y="${(cy - 2 * s).toFixed(2)}" width="${n(1.6)}" height="${n(4)}" rx="${n(0.8)}" fill="${tinta}" fill-opacity="0.45"/>
  </svg>`;
  return sharp({ create: { width: w, height: h + barra, channels: 3, background: { r, g, b } } })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: await sharp(limpa).removeAlpha().toBuffer(), top: barra, left: 0 },
    ])
    .png()
    .toBuffer();
}

async function gerar(origem, destinoSemExt, widths, proporcao) {
  for (const w of widths) {
    const h = Math.round(w * proporcao);
    const base = sharp(origem).resize(w, h, { fit: 'cover', position: 'top' });
    await base.clone().avif({ quality: 55, effort: 5 }).toFile(`${destinoSemExt}-${w}.avif`);
    await base.clone().webp({ quality: 80, effort: 6 }).toFile(`${destinoSemExt}-${w}.webp`);
  }
}

rmSync('public/img', { recursive: true, force: true });
mkdirSync('public/img/cases', { recursive: true });
const manifesto = { apps: {}, cases: {} };

for (const slug of readdirSync(SRC).filter((d) => !CASES.includes(d)).sort()) {
  const arquivos = readdirSync(join(SRC, slug)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  mkdirSync(`public/img/apps/${slug}`, { recursive: true });
  manifesto.apps[slug] = [];
  for (const [i, arquivo] of arquivos.entries()) {
    const origem = join(SRC, slug, arquivo);
    const { width } = await sharp(origem).metadata();
    const nn = String(i + 1).padStart(2, '0');
    const widths = larguras(PHONE_WIDTHS, width);
    await gerar(await comBarraDeStatus(origem), `public/img/apps/${slug}/${nn}`, widths, PHONE);
    manifesto.apps[slug].push({ id: nn, widths });
    console.log(`tela: ${slug}/${nn} (${widths.join(', ')})`);
  }
}

for (const slug of CASES) {
  const pasta = join(SRC, slug);
  if (!existsSync(pasta)) continue;
  const desktop = join(pasta, 'desktop.png');
  const mobile = join(pasta, 'mobile.png');
  const dw = larguras(DESKTOP_WIDTHS, (await sharp(desktop).metadata()).width);
  const mw = larguras(PHONE_WIDTHS, (await sharp(mobile).metadata()).width);
  await gerar(desktop, `public/img/cases/${slug}-desktop`, dw, 900 / 1440);
  await gerar(await comBarraDeStatus(mobile, { forcar: true }), `public/img/cases/${slug}-mobile`, mw, PHONE);
  manifesto.cases[slug] = { desktop: dw, mobile: mw };
  console.log(`case: ${slug} (desktop ${dw.join(', ')} · celular ${mw.join(', ')})`);
}

mkdirSync('src/data/generated', { recursive: true });
writeFileSync('src/data/generated/screens.json', `${JSON.stringify(manifesto, null, 2)}\n`);
console.log('índice: src/data/generated/screens.json');
