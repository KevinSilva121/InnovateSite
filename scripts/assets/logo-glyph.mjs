// Extrai o símbolo "ai" da logo (public/logo/mark-512.png, símbolo claro sobre o
// quadrado marinho) e gera uma máscara: branco com transparência, sem o quadrado.
// O site usa a máscara com CSS (mask-image + background-color: currentColor),
// então o símbolo assume a cor do texto ao redor: branco no header escuro,
// azul sobre fundo claro.
//
// Saída: public/logo/glyph-mask.png (commitado). Roda uma vez: npm run assets.
import sharp from 'sharp';

const ORIGEM = 'public/logo/mark-512.png';
const SAIDA = 'public/logo/glyph-mask.png';

const { data, info } = await sharp(ORIGEM).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const lum = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

// Referências de cor: o fundo marinho (canto do quadrado, por dentro da borda
// arredondada) e o símbolo (o pixel mais claro da imagem).
const fundo = lum(((Math.round(height * 0.2) * width) + Math.round(width * 0.5)) * 3);
let simbolo = 0;
for (let i = 0; i < data.length; i += 3) simbolo = Math.max(simbolo, lum(i));

const alfa = Buffer.alloc(width * height);
let [x0, y0, x1, y1] = [width, height, 0, 0];
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const t = (lum((y * width + x) * 3) - fundo) / (simbolo - fundo);
    const a = Math.round(Math.min(1, Math.max(0, t)) * 255);
    // Fora do quadrado arredondado a imagem original é transparente/preta: ignora.
    alfa[y * width + x] = a;
    if (a > 24) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y);
      x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
  }
}

const branco = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i += 1) {
  branco[i * 4] = 255; branco[i * 4 + 1] = 255; branco[i * 4 + 2] = 255; branco[i * 4 + 3] = alfa[i];
}
const margem = 2;
await sharp(branco, { raw: { width, height, channels: 4 } })
  .extract({ left: x0 - margem, top: y0 - margem, width: x1 - x0 + 1 + 2 * margem, height: y1 - y0 + 1 + 2 * margem })
  .png({ compressionLevel: 9 })
  .toFile(SAIDA);
console.log(`símbolo: ${SAIDA} (${x1 - x0 + 1 + 2 * margem}×${y1 - y0 + 1 + 2 * margem})`);
