export function outFileFor(route) {
  return route === '/' ? 'index.html' : `${route.replace(/^\/|\/$/g, '')}/index.html`;
}

export function sitemapXml(routes, siteUrl, date) {
  const lastmod = date.toISOString().slice(0, 10);
  const urls = routes.map((r) => `  <url>\n    <loc>${siteUrl}${r}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

// Replacer em função para que "$&" e afins no conteúdo não sejam interpretados.
export function injectTemplate(template, { head, html }) {
  return template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
}
