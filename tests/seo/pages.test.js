import { describe, it, expect } from 'vitest';
import { pages, pageByPath } from '../../src/seo/pages.js';

describe('pages meta', () => {
  const indexable = Object.values(pages).filter((p) => p.path);

  it('has six indexable pages plus notFound', () => {
    expect(indexable.map((p) => p.path)).toEqual(['/', '/aplicativos/', '/sites/', '/sistemas-web/', '/sobre/', '/contato/']);
    expect(pages.notFound.path).toBeNull();
    expect(pages.notFound.robots).toBe('noindex, nofollow');
  });

  it.each(Object.values(pages))('$key respects title/description limits', (p) => {
    expect(p.title.length).toBeLessThanOrEqual(60);
    expect(p.title).toMatch(/^InnovateApps Co\. \| /);
    expect(p.description.length).toBeLessThanOrEqual(155);
    expect(p.description.length).toBeGreaterThan(60);
  });

  it.each(indexable)('$key jsonLd is a schema.org graph with LocalBusiness', (p) => {
    const ld = p.jsonLd();
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@graph'].some((n) => n['@type'] === 'LocalBusiness')).toBe(true);
  });

  it('service pages carry Service, BreadcrumbList and FAQPage; home carries ItemList and FAQPage', () => {
    const types = (p) => p.jsonLd()['@graph'].map((n) => n['@type']);
    for (const key of ['aplicativos', 'sites', 'sistemasWeb']) {
      expect(types(pages[key])).toEqual(expect.arrayContaining(['Service', 'BreadcrumbList', 'FAQPage']));
    }
    expect(types(pages.home)).toEqual(expect.arrayContaining(['ItemList', 'FAQPage']));
    expect(types(pages.aplicativos)).toContain('ItemList');
  });

  it('pageByPath tolerates a missing trailing slash and falls back to notFound', () => {
    expect(pageByPath('/sites')).toBe(pages.sites);
    expect(pageByPath('/sites/')).toBe(pages.sites);
    expect(pageByPath('/')).toBe(pages.home);
    expect(pageByPath('/nada/')).toBe(pages.notFound);
  });
});
