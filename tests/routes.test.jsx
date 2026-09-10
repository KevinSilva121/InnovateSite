import { describe, it, expect } from 'vitest';
import { routes } from '../src/routes.jsx';
import { pages } from '../src/seo/pages.js';

describe('routes', () => {
  it('matches the indexable pages one-to-one', () => {
    const pagePaths = Object.values(pages).filter((p) => p.path).map((p) => p.path);
    expect(routes.map((r) => r.path)).toEqual(pagePaths);
    for (const r of routes) {
      expect(pages[r.page].path).toBe(r.path);
      expect(typeof r.Component).toBe('function');
    }
  });

  it('service routes carry their service object', () => {
    const svc = routes.filter((r) => r.service);
    expect(svc.map((r) => r.service.slug)).toEqual(['aplicativos', 'sites', 'sistemas-web']);
  });
});
