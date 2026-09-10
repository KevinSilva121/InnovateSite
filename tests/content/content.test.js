import { describe, it, expect } from 'vitest';
import { services, serviceBySlug } from '../../src/data/content/services.js';
import { processSteps } from '../../src/data/content/process.js';
import { homeFaq } from '../../src/data/content/faq.js';

const BANNED = /transforma[çc][ãa]o digital|vanguarda|disruptiv/i;

describe('services content', () => {
  it('has the three services in order with trailing-slash paths', () => {
    expect(services.map((s) => s.slug)).toEqual(['aplicativos', 'sites', 'sistemas-web']);
    expect(services.map((s) => s.path)).toEqual(['/aplicativos/', '/sites/', '/sistemas-web/']);
  });

  it.each(services)('$slug is complete and within SEO limits', (s) => {
    expect(s.bullets).toHaveLength(3);
    expect(s.audience.length).toBeGreaterThanOrEqual(3);
    expect(s.deliverables.length).toBeGreaterThanOrEqual(4);
    expect(s.faq.length).toBeGreaterThanOrEqual(4);
    expect(['apps', 'web']).toContain(s.proof);
    expect(s.seo.title.length).toBeLessThanOrEqual(60);
    expect(s.seo.title).toMatch(/^InnovateApps Co\. \| /);
    expect(s.seo.description.length).toBeLessThanOrEqual(155);
    expect(s.hero.title).toMatch(/aplicativos|sites|sistemas web/i);
    const text = JSON.stringify(s);
    expect(text).not.toMatch(BANNED);
  });

  it('serviceBySlug finds and misses', () => {
    expect(serviceBySlug('sites').name).toMatch(/Sites/);
    expect(serviceBySlug('nope')).toBeUndefined();
  });
});

describe('process and faq', () => {
  it('has four numbered steps', () => {
    expect(processSteps.map((p) => p.number)).toEqual(['01', '02', '03', '04']);
  });
  it('home FAQ has six items with non-empty answers', () => {
    expect(homeFaq).toHaveLength(6);
    for (const item of homeFaq) expect(item.a.length).toBeGreaterThan(40);
  });
});
