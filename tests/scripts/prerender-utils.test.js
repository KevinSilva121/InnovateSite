// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { outFileFor, sitemapXml, robotsTxt, injectTemplate } from '../../scripts/lib/prerender-utils.mjs';

describe('prerender utils', () => {
  it('maps routes to dist files', () => {
    expect(outFileFor('/')).toBe('index.html');
    expect(outFileFor('/sites/')).toBe('sites/index.html');
    expect(outFileFor('/sistemas-web/')).toBe('sistemas-web/index.html');
  });

  it('writes a sitemap with absolute urls and lastmod', () => {
    const xml = sitemapXml(['/', '/sites/'], 'https://example.com', new Date('2026-09-03T12:00:00Z'));
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/sites/</loc>');
    expect(xml).toContain('<lastmod>2026-09-03</lastmod>');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('writes robots with the absolute sitemap url', () => {
    expect(robotsTxt('https://example.com')).toBe('User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n');
  });

  it('injects head and html without interpreting $ patterns', () => {
    const out = injectTemplate('<head><!--app-head--></head><div id="root"><!--app-html--></div>', { head: '<title>$&</title>', html: '<p>$1</p>' });
    expect(out).toBe('<head><title>$&</title></head><div id="root"><p>$1</p></div>');
  });
});
