import { describe, it, expect } from 'vitest';
import { pages, pageByPath, postKey } from '../../src/seo/pages.js';
import { postsByDate, postPath } from '../../src/data/content/posts.js';

describe('pages meta', () => {
  const indexable = Object.values(pages).filter((p) => p.path);
  const artigos = postsByDate();

  it('lists the fixed pages, the blog and one page per post, in route order', () => {
    expect(indexable.map((p) => p.path)).toEqual([
      '/',
      '/aplicativos/',
      '/sites/',
      '/sistemas-web/',
      '/blog/',
      ...artigos.map((post) => postPath(post.slug)),
      '/sobre/',
      '/contato/',
    ]);
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

  it('the blog index carries a Blog node listing every post', () => {
    const node = pages.blog.jsonLd()['@graph'].find((n) => n['@type'] === 'Blog');
    expect(node.blogPost.map((b) => b.url)).toEqual(artigos.map((post) => expect.stringContaining(postPath(post.slug))));
  });

  it.each(artigos)('post $slug is an article page with BlogPosting and a three-level breadcrumb', (post) => {
    const page = pages[postKey(post.slug)];
    expect(page.path).toBe(postPath(post.slug));
    expect(page.article).toEqual({ published: post.date, modified: post.date, section: post.category });
    const graph = page.jsonLd()['@graph'];
    const posting = graph.find((n) => n['@type'] === 'BlogPosting');
    expect(posting.headline).toBe(post.title);
    expect(posting.datePublished).toBe(post.date);
    expect(posting.wordCount).toBeGreaterThan(100);
    const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList');
    expect(crumbs.itemListElement.map((i) => i.name)).toEqual(['Início', 'Blog', post.seo.title]);
  });

  it('pageByPath tolerates a missing trailing slash and falls back to notFound', () => {
    expect(pageByPath('/sites')).toBe(pages.sites);
    expect(pageByPath('/sites/')).toBe(pages.sites);
    expect(pageByPath('/')).toBe(pages.home);
    expect(pageByPath('/blog/')).toBe(pages.blog);
    expect(pageByPath(postPath(artigos[0].slug))).toBe(pages[postKey(artigos[0].slug)]);
    expect(pageByPath('/nada/')).toBe(pages.notFound);
  });
});
