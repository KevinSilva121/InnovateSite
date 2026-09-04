// @vitest-environment node
// Roda depois de `npm run build`. Verifica o HTML final que o GitHub Pages vai servir.
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { pages, postKey } from '../../src/seo/pages.js';
import { postsByDate, postPath } from '../../src/data/content/posts.js';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://kevinsilva121.github.io/InnovateSite').replace(/\/$/, '');
const BASE = process.env.VITE_BASE || '/';
const indexable = Object.values(pages).filter((p) => p.path);
const fileFor = (path) => (path === '/' ? 'dist/index.html' : `dist${path}index.html`);
const read = (f) => readFileSync(f, 'utf8');

beforeAll(() => {
  if (!existsSync('dist/index.html')) throw new Error('dist/ não existe — rode `npm run build` antes de `npm run test:build`');
});

describe('prerendered pages', () => {
  it.each(indexable)('$path has full HTML, one H1, correct head and JSON-LD', (page) => {
    const html = read(fileFor(page.path));
    expect(html).toContain('<html lang="pt-BR">');
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain(`<title>${page.title}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}${page.path}">`);
    expect(html).toContain('<meta name="robots" content="index, follow">');
    expect(html).toContain('<meta property="og:locale" content="pt_BR">');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('<!--app-html-->');
    expect(html).not.toContain('<!--app-head-->');

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    expect(blocks.length).toBeGreaterThanOrEqual(1);
    const types = blocks.flatMap((b) => b['@graph'].map((n) => n['@type']));
    expect(types).toContain('LocalBusiness');
    if (page.key !== 'home' && page.key !== 'notFound') expect(types).toContain('BreadcrumbList');

    // Conteúdo visível sem JS: nada nasce com a classe de "revelado" e o H1 está no HTML.
    expect(html).not.toContain('is-in');
    expect(html).toContain('id="conteudo"');
  });

  it('service pages and home embed the FAQ as native details', () => {
    for (const key of ['home', 'aplicativos', 'sites', 'sistemasWeb']) {
      expect(read(fileFor(pages[key].path))).toContain('<details');
    }
  });
});

describe('blog', () => {
  const artigos = postsByDate();

  it('the index links every article', () => {
    const html = read(fileFor(pages.blog.path));
    for (const post of artigos) expect(html).toContain(`href="${postPath(post.slug)}"`);
  });

  it.each(artigos)('$slug ships as an article page with dates and BlogPosting', (post) => {
    const html = read(fileFor(pages[postKey(post.slug)].path));
    expect(html).toContain('<meta property="og:type" content="article">');
    expect(html).toContain(`<meta property="article:published_time" content="${post.date}">`);
    expect(html).toContain(`<meta property="article:section" content="${post.category}">`);
    const types = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .flatMap((m) => JSON.parse(m[1])['@graph'].map((n) => n['@type']));
    expect(types).toContain('BlogPosting');
    // O corpo do artigo está no HTML, sem depender de JS. O React escapa aspas no
    // texto, então desfazemos as entidades antes de comparar.
    const texto = html.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&');
    for (const bloco of post.body.filter((b) => b.t === 'h2')) expect(texto).toContain(bloco.text);
  });
});

describe('site files', () => {
  it('404.html is a real page marked noindex', () => {
    const html = read('dist/404.html');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(html).toContain('Página não encontrada');
    expect(html).not.toContain('rel="canonical"');
  });

  it('sitemap lists every indexable route and robots points to it', () => {
    const xml = read('dist/sitemap.xml');
    for (const p of indexable) expect(xml).toContain(`<loc>${SITE_URL}${p.path}</loc>`);
    expect((xml.match(/<url>/g) || []).length).toBe(indexable.length);
    expect(read('dist/robots.txt')).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it('ships fonts, favicons, badges, app icons and no server bundle', () => {
    for (const f of ['dist/.nojekyll', 'dist/fonts/bricolage-grotesque.woff2', 'dist/fonts/instrument-sans.woff2', 'dist/favicon.svg', 'dist/favicon-32.png', 'dist/apple-touch-icon.png', 'dist/site.webmanifest', 'dist/og/default.png', 'dist/logo/mark.png', 'dist/badges/google-play-pt-br.png', 'dist/badges/app-store-pt-br.svg']) {
      expect(existsSync(f), f).toBe(true);
    }
    expect(readdirSync('dist/apps')).toHaveLength(4);
    expect(existsSync('dist/server')).toBe(false);
  });

  it('every page loads its module script from the configured base', () => {
    const pattern = new RegExp(`<script type="module"[^>]*src="${BASE.replace(/\//g, '\\/')}assets\\/`);
    for (const p of indexable) expect(read(fileFor(p.path))).toMatch(pattern);
  });

  it('ships with text and image selection turned off, except in form fields', () => {
    const cssFile = readdirSync('dist/assets').find((f) => f.endsWith('.css'));
    const css = read(`dist/assets/${cssFile}`).replace(/\s+/g, '');
    expect(css).toContain('body{-webkit-user-select:none;user-select:none');
    expect(css).toMatch(/input,textarea,select,\[contenteditable\]\{-webkit-user-select:text;user-select:text/);
    expect(css).toContain('-webkit-user-drag:none');
  });

  it('CSS references local fonts with the configured base', () => {
    const cssFile = readdirSync('dist/assets').find((f) => f.endsWith('.css'));
    const css = read(`dist/assets/${cssFile}`);
    expect(css).toMatch(/url\([^)]*fonts\/bricolage-grotesque\.woff2\)/);
    expect(css).not.toContain('googleapis');
  });
});
