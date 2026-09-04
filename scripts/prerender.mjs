// Etapa final do build: transforma o bundle SSR em um index.html por rota, mais 404, sitemap e robots.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { outFileFor, sitemapXml, robotsTxt, injectTemplate } from './lib/prerender-utils.mjs';

const dist = path.resolve('dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const server = await import(pathToFileURL(path.join(dist, 'server', 'entry-server.js')).href);

for (const route of server.routePaths) {
  const file = path.join(dist, outFileFor(route));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, injectTemplate(template, server.render(route)));
  console.log('prerender', route, '->', path.relative(dist, file));
}

await writeFile(path.join(dist, '404.html'), injectTemplate(template, server.renderNotFound()));
await writeFile(path.join(dist, 'sitemap.xml'), sitemapXml(server.routePaths, server.siteUrl, new Date()));
await writeFile(path.join(dist, 'robots.txt'), robotsTxt(server.siteUrl));
await rm(path.join(dist, 'server'), { recursive: true, force: true });
console.log('prerender concluído:', server.routePaths.length, 'rotas +', '404.html, sitemap.xml, robots.txt');
