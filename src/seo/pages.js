import { site } from '../config/site.js';
import { services } from '../data/content/services.js';
import { homeFaq } from '../data/content/faq.js';
import { ProjectRepository } from '../data/repositories/ProjectRepository.js';
import { GetProjects } from '../domain/usecases/GetProjects.js';
import { graph, localBusiness, webSite, breadcrumb, faqPage, service, softwareAppList } from './jsonld.js';

const apps = () => new GetProjects(new ProjectRepository()).execute({ type: 'app' });
const base = () => [localBusiness(site), webSite(site)];
const crumbs = (name, path) => breadcrumb(site, [{ name: 'Início', path: '/' }, { name, path }]);

const servicePage = (key, slug, extra = () => []) => {
  const svc = services.find((s) => s.slug === slug);
  return {
    key,
    path: svc.path,
    title: svc.seo.title,
    description: svc.seo.description,
    jsonLd: () => graph(...base(), service(site, svc), crumbs(svc.shortName, svc.path), faqPage(svc.faq), ...extra()),
  };
};

export const pages = {
  home: {
    key: 'home',
    path: '/',
    title: 'Sites, sistemas e apps em Taubaté | Innovate Apps',
    description: 'Empresa de tecnologia em Taubaté, SP. Criamos sites, sistemas web e aplicativos Android e iOS para empresas do Vale do Paraíba. Apps publicados nas lojas.',
    jsonLd: () => graph(...base(), softwareAppList(site, apps()), faqPage(homeFaq)),
  },
  aplicativos: servicePage('aplicativos', 'aplicativos', () => [softwareAppList(site, apps())]),
  sites: servicePage('sites', 'sites'),
  sistemasWeb: servicePage('sistemasWeb', 'sistemas-web'),
  sobre: {
    key: 'sobre',
    path: '/sobre/',
    title: 'Sobre nós, tecnologia em Taubaté | Innovate Apps',
    description: 'Empresa de desenvolvimento de software em Taubaté, SP. Sites, sistemas web e aplicativos para empresas do Vale do Paraíba, feitos por quem programa.',
    jsonLd: () => graph(...base(), crumbs('Sobre', '/sobre/')),
  },
  contato: {
    key: 'contato',
    path: '/contato/',
    title: 'Contato em Taubaté | Innovate Apps',
    description: 'Fale com a Innovate Apps em Taubaté, SP. Orçamento de sites, sistemas web e aplicativos para empresas do Vale do Paraíba por WhatsApp ou e-mail.',
    jsonLd: () => graph(...base(), crumbs('Contato', '/contato/')),
  },
  notFound: {
    key: 'notFound',
    path: null,
    title: 'Página não encontrada | Innovate Apps',
    description: 'A página que você procurou não existe. Volte para o início e conheça os sites, sistemas e aplicativos da Innovate Apps em Taubaté.',
    robots: 'noindex, nofollow',
    jsonLd: () => graph(...base()),
  },
};

const withSlash = (p) => (p.endsWith('/') ? p : `${p}/`);

export function pageByPath(path) {
  const wanted = withSlash(path || '/');
  return Object.values(pages).find((p) => p.path === wanted) ?? pages.notFound;
}
