import { sameAsLinks } from '../config/site.js';

export const absolute = (site, path) => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;

const businessId = (site) => `${site.url}/#business`;

const cityNodes = (site) => site.areaServed.map((name) => ({ '@type': 'City', name }));

export function localBusiness(site) {
  const node = {
    '@type': 'LocalBusiness',
    '@id': businessId(site),
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/logo/mark-512.png`,
    image: `${site.url}/og/default.png`,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: cityNodes(site),
    sameAs: sameAsLinks(site),
  };
  if (site.whatsapp) node.telephone = `+${site.whatsapp}`;
  if (site.email) node.email = site.email;
  return node;
}

export function webSite(site) {
  return { '@type': 'WebSite', name: site.name, url: `${site.url}/`, inLanguage: 'pt-BR' };
}

export function breadcrumb(site, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(site, it.path) })),
  };
}

export function faqPage(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function service(site, svc) {
  return {
    '@type': 'Service',
    name: svc.name,
    serviceType: svc.seo.serviceType,
    description: svc.seo.description,
    url: absolute(site, svc.path),
    provider: { '@id': businessId(site) },
    areaServed: cityNodes(site),
  };
}

// O ícone é servido pelo próprio site; a URL da imagem precisa ser absoluta no schema.
const publicIconUrl = (site, app) => `${site.url}/apps/${app.slug}.webp`;

export function softwareAppList(site, apps) {
  return {
    '@type': 'ItemList',
    itemListElement: apps.map((app, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: app.title,
        description: app.tagline,
        applicationCategory: 'BusinessApplication',
        operatingSystem: app.platforms.join(', '),
        installUrl: [app.stores.play, app.stores.appStore].filter(Boolean),
        image: publicIconUrl(site, app),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
        author: { '@id': businessId(site) },
      },
    })),
  };
}

export const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });
