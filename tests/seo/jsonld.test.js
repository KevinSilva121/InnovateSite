import { describe, it, expect } from 'vitest';
import { site } from '../../src/config/site.js';
import { services } from '../../src/data/content/services.js';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { absolute, localBusiness, webSite, breadcrumb, faqPage, service, softwareAppList, graph } from '../../src/seo/jsonld.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('absolute', () => {
  it('joins site url and path', () => {
    expect(absolute(site, '/')).toBe(`${site.url}/`);
    expect(absolute(site, '/sites/')).toBe(`${site.url}/sites/`);
  });
});

describe('localBusiness', () => {
  it('describes Taubaté and cities served', () => {
    const lb = localBusiness(site);
    expect(lb['@type']).toBe('LocalBusiness');
    expect(lb['@id']).toBe(`${site.url}/#business`);
    expect(lb.address).toEqual({ '@type': 'PostalAddress', addressLocality: 'Taubaté', addressRegion: 'SP', addressCountry: 'BR' });
    expect(lb.areaServed[0]).toEqual({ '@type': 'City', name: 'Taubaté' });
    expect(lb.sameAs).toContain(site.stores.play);
    expect(lb.logo).toBe(`${site.url}/logo/mark-512.png`);
  });

  it('omits telephone and email when empty, includes them when set', () => {
    expect(localBusiness({ ...site, whatsapp: '', email: '' })).not.toHaveProperty('telephone');
    const lb = localBusiness({ ...site, whatsapp: '5512999999999', email: 'a@b.c' });
    expect(lb.telephone).toBe('+5512999999999');
    expect(lb.email).toBe('a@b.c');
  });
});

describe('page-level nodes', () => {
  it('webSite carries name and url', () => {
    expect(webSite(site)).toMatchObject({ '@type': 'WebSite', name: site.name, url: `${site.url}/` });
  });

  it('breadcrumb positions items from 1', () => {
    const b = breadcrumb(site, [{ name: 'Início', path: '/' }, { name: 'Sites', path: '/sites/' }]);
    expect(b.itemListElement[1]).toEqual({ '@type': 'ListItem', position: 2, name: 'Sites', item: `${site.url}/sites/` });
  });

  it('faqPage maps q/a to Question/Answer', () => {
    const f = faqPage([{ q: 'P?', a: 'R.' }]);
    expect(f.mainEntity[0]).toEqual({ '@type': 'Question', name: 'P?', acceptedAnswer: { '@type': 'Answer', text: 'R.' } });
  });

  it('service links provider by id and lists cities', () => {
    const s = service(site, services[0]);
    expect(s).toMatchObject({ '@type': 'Service', name: services[0].name, serviceType: services[0].seo.serviceType, url: `${site.url}/aplicativos/` });
    expect(s.provider).toEqual({ '@id': `${site.url}/#business` });
    expect(s.areaServed).toHaveLength(site.areaServed.length);
  });

  it('softwareAppList marks OS per store availability', () => {
    const list = softwareAppList(site, apps);
    expect(list['@type']).toBe('ItemList');
    const [calc, , , trama] = list.itemListElement.map((i) => i.item);
    expect(calc.operatingSystem).toBe('Android, iOS');
    expect(calc.installUrl).toEqual([apps[0].stores.play, apps[0].stores.appStore]);
    expect(trama.operatingSystem).toBe('Android');
    expect(trama.installUrl).toEqual([apps[3].stores.play]);
    expect(calc.image).toBe(`${site.url}/apps/calcfrete.webp`);
    expect(calc.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'BRL' });
  });

  it('graph wraps nodes with schema.org context', () => {
    expect(graph({ a: 1 }, { b: 2 })).toEqual({ '@context': 'https://schema.org', '@graph': [{ a: 1 }, { b: 2 }] });
  });
});
