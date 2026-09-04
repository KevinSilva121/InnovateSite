import { describe, it, expect } from 'vitest';
import { site, contactHref, sameAsLinks } from '../../src/config/site.js';
import { cities } from '../../src/data/content/cities.js';

describe('site config', () => {
  it('has the required identity fields', () => {
    expect(site.name).toBe('Innovate Apps Co.');
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith('/')).toBe(false);
    expect(site.address).toEqual({ locality: 'Taubaté', region: 'SP', country: 'BR' });
  });

  it('serves Taubaté first and at least 8 cities', () => {
    expect(cities[0]).toBe('Taubaté');
    expect(cities.length).toBeGreaterThanOrEqual(8);
    expect(site.areaServed).toBe(cities);
  });

  it('whatsapp, when set, is E.164 digits without plus', () => {
    if (site.whatsapp) expect(site.whatsapp).toMatch(/^55\d{10,11}$/);
  });

  it('has the confirmed business WhatsApp', () => {
    expect(site.whatsapp).toBe('5512991077249');
  });

  it('contactHref falls back to /contato/ when whatsapp is empty', () => {
    expect(contactHref({ ...site, whatsapp: '' })).toBe('/contato/');
  });

  it('contactHref builds a wa.me link with encoded message', () => {
    const href = contactHref({ ...site, whatsapp: '5512999999999' }, 'Olá, quero um orçamento');
    expect(href).toBe('https://wa.me/5512999999999?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento');
  });

  it('sameAsLinks skips empty social fields', () => {
    const links = sameAsLinks({ ...site, social: { instagram: '', linkedin: '', github: 'https://github.com/x' } });
    expect(links).toEqual([site.stores.play, site.stores.appStore, 'https://github.com/x']);
  });
});
