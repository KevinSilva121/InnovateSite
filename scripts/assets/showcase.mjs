// Gera as telas do feed do hero (public/showcase) a partir das capturas do cliente.
// Fonte padrão: ../imagens (fora do repositório, são os originais do cliente).
// Sobrescreva com SHOWCASE_SRC=/caminho/para/pasta.
//
// As imagens de origem já vêm na proporção 9/19.5 do aparelho; aqui só reduzimos
// para o tamanho servido e convertemos para WebP.
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = process.env.SHOWCASE_SRC || join(process.cwd(), '..', 'imagens');
const OUT = 'public/showcase';
const WIDTH = 540;
const HEIGHT = Math.round((WIDTH * 19.5) / 9); // 1170

// Ordem do feed, definida pelo cliente: site da Alice, Contador, Prazzo, Trama.
// Dentro de cada produto, a ordem numérica dos arquivos.
const ORDER = ['advalice', 'contador', 'prazzo', 'trama'];

const rank = (file) => {
  const i = ORDER.findIndex((p) => file.toLowerCase().startsWith(p));
  const n = Number(file.match(/(\d+)/)?.[1] ?? 0);
  return [i === -1 ? ORDER.length : i, n];
};

const files = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => {
    const [ga, na] = rank(a);
    const [gb, nb] = rank(b);
    return ga - gb || na - nb || a.localeCompare(b);
  });

if (files.length === 0) throw new Error(`nenhuma imagem encontrada em ${SRC}`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Duas larguras: aparelhos de densidade baixa baixam a menor via srcset.
const SIZES = [
  { w: WIDTH, h: HEIGHT, suffix: '' },
  { w: 360, h: Math.round((360 * 19.5) / 9), suffix: '-360' },
];

let total = 0;
for (const [i, file] of files.entries()) {
  const slug = file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const stem = `${String(i + 1).padStart(2, '0')}-${slug}`;
  for (const size of SIZES) {
    const info = await sharp(join(SRC, file))
      .resize(size.w, size.h, { fit: 'cover', position: 'top' })
      .webp({ quality: 72, effort: 6 })
      .toFile(join(OUT, `${stem}${size.suffix}.webp`));
    total += info.size;
  }
  console.log('tela:', stem);
}
console.log(`peso total: ${(total / 1024).toFixed(0)} KB em ${files.length * SIZES.length} arquivos`);

console.log(`\n${files.length} telas geradas. Atualize a lista em src/presentation/ui/PhoneShowcase.jsx.`);
