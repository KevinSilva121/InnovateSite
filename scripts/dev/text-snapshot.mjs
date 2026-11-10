// Retrato do texto e do SEO de cada página gerada em dist/, para garantir que um
// redesenho não mude conteúdo sem querer.
//
//   node scripts/dev/text-snapshot.mjs salvar  <arquivo.json>   grava o retrato atual
//   node scripts/dev/text-snapshot.mjs comparar <arquivo.json>   compara com um retrato salvo
//
// O texto visível é separado em blocos (parágrafo, título, item de lista, botão...)
// e comparado como conjunto: mudar a ordem ou o layout não conta, só texto que
// some ou aparece. As tags de SEO (title, description, canonical, robots, Open
// Graph e JSON-LD) precisam ser idênticas.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const [acao, arquivo] = process.argv.slice(2);
if (!['salvar', 'comparar'].includes(acao) || !arquivo) {
  console.error('uso: node scripts/dev/text-snapshot.mjs salvar|comparar <arquivo.json>');
  process.exit(1);
}

const rotas = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
const arquivoDe = (rota) => (rota === '/' ? 'dist/index.html' : `dist${rota}index.html`);

// Elementos que não quebram o bloco de texto: o texto deles se junta ao do pai.
const INLINE = new Set(['A', 'ABBR', 'B', 'BR', 'CODE', 'EM', 'I', 'S', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TIME', 'U', 'MARK', 'LABEL', 'BUTTON']);
const IGNORAR = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'TEMPLATE']);

function blocosDeTexto(raiz) {
  const blocos = [];
  const visitar = (no, buffer) => {
    for (const filho of no.childNodes) {
      if (filho.nodeType === 3) buffer.push(filho.textContent);
      else if (filho.nodeType === 1) {
        if (IGNORAR.has(filho.tagName.toUpperCase())) continue;
        if (INLINE.has(filho.tagName.toUpperCase())) visitar(filho, buffer);
        else {
          fechar(buffer);
          const novo = [];
          visitar(filho, novo);
          fechar(novo);
        }
      }
    }
  };
  const fechar = (buffer) => {
    const texto = buffer.join('').replace(/\s+/g, ' ').trim();
    if (texto) blocos.push(texto);
    buffer.length = 0;
  };
  const inicial = [];
  visitar(raiz, inicial);
  fechar(inicial);
  return blocos;
}

function retratoDa(html) {
  const { document } = new JSDOM(html).window;
  const attr = (sel, nome = 'content') => document.querySelector(sel)?.getAttribute(nome) ?? null;
  const seo = {
    title: document.title,
    description: attr('meta[name="description"]'),
    robots: attr('meta[name="robots"]'),
    canonical: attr('link[rel="canonical"]', 'href'),
    og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"]')]
      .map((m) => [m.getAttribute('property') || m.getAttribute('name'), m.getAttribute('content')])),
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)),
  };
  const root = document.getElementById('root');
  return {
    seo,
    texto: blocosDeTexto(root).sort(),
    alt: [...root.querySelectorAll('img')].map((i) => i.getAttribute('alt') ?? '(sem alt)').sort(),
  };
}

const atual = Object.fromEntries([...rotas, '/404'].map((rota) => {
  const f = rota === '/404' ? 'dist/404.html' : arquivoDe(rota);
  return [rota, retratoDa(readFileSync(f, 'utf8'))];
}));

if (acao === 'salvar') {
  writeFileSync(arquivo, JSON.stringify(atual, null, 2));
  const blocos = Object.values(atual).reduce((n, p) => n + p.texto.length, 0);
  console.log(`retrato salvo: ${Object.keys(atual).length} páginas, ${blocos} blocos de texto -> ${arquivo}`);
  process.exit(0);
}

if (!existsSync(arquivo)) throw new Error(`retrato não encontrado: ${arquivo}`);
const antes = JSON.parse(readFileSync(arquivo, 'utf8'));

// Diferença entre multiconjuntos: o que está em `a` e não em `b`, respeitando repetições.
const menos = (a, b) => {
  const resto = [...b];
  return a.filter((x) => {
    const i = resto.indexOf(x);
    if (i === -1) return true;
    resto.splice(i, 1);
    return false;
  });
};

let problemas = 0;
for (const rota of new Set([...Object.keys(antes), ...Object.keys(atual)])) {
  const a = antes[rota];
  const d = atual[rota];
  if (!a || !d) {
    console.log(`\n${rota}: página ${a ? 'removida' : 'nova'}`);
    problemas += a ? 1 : 0;
    continue;
  }
  const seoMudou = JSON.stringify(a.seo) !== JSON.stringify(d.seo);
  const sumiu = menos(a.texto, d.texto);
  const entrou = menos(d.texto, a.texto);
  const altSumiu = menos(a.alt, d.alt);
  const altEntrou = menos(d.alt, a.alt);
  if (!seoMudou && !sumiu.length && !entrou.length && !altSumiu.length && !altEntrou.length) continue;
  console.log(`\n=== ${rota}`);
  if (seoMudou) {
    problemas += 1;
    for (const chave of Object.keys(a.seo)) {
      if (JSON.stringify(a.seo[chave]) !== JSON.stringify(d.seo[chave])) console.log(`  SEO MUDOU: ${chave}`);
    }
  }
  for (const t of sumiu) console.log(`  - texto que sumiu: ${t}`);
  for (const t of entrou) console.log(`  + texto novo:      ${t}`);
  for (const t of altSumiu) console.log(`  - alt que sumiu:   ${t}`);
  for (const t of altEntrou) console.log(`  + alt novo:        ${t}`);
  problemas += sumiu.length;
}
console.log(problemas ? `\n${problemas} diferença(s) que precisam de revisão.` : '\nNenhum texto sumiu e o SEO está idêntico.');
