export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${escapeHtml(value)}">`;

// Gera as tags do <head> de uma página. Puro: recebe meta da rota e o site, devolve string.
// Páginas de artigo declaram `article` e ganham og:type article mais as datas.
export function buildHead(page, site) {
  const canonical = page.path ? `${site.url}${page.path}` : null;
  const image = `${site.url}/og/default.png`;
  const art = page.article ?? null;
  const lines = [
    `<title>${escapeHtml(page.title)}</title>`,
    meta('name', 'description', page.description),
    meta('name', 'robots', page.robots ?? 'index, follow'),
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : null,
    meta('property', 'og:type', art ? 'article' : 'website'),
    art ? meta('property', 'article:published_time', art.published) : null,
    art ? meta('property', 'article:modified_time', art.modified ?? art.published) : null,
    art?.section ? meta('property', 'article:section', art.section) : null,
    art ? meta('property', 'article:author', site.name) : null,
    meta('property', 'og:title', page.title),
    meta('property', 'og:description', page.description),
    canonical ? meta('property', 'og:url', canonical) : null,
    meta('property', 'og:image', image),
    meta('property', 'og:locale', 'pt_BR'),
    meta('property', 'og:site_name', site.name),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', page.title),
    meta('name', 'twitter:description', page.description),
    meta('name', 'twitter:image', image),
    meta('name', 'theme-color', '#010D33'),
    `<script type="application/ld+json">${JSON.stringify(page.jsonLd()).replace(/<\/script/gi, '<\\/script')}</script>`,
  ];
  return lines.filter(Boolean).join('\n    ');
}
