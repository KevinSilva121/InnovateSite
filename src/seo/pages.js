import { site } from '../config/site.js';
import { services } from '../data/content/services.js';
import { homeFaq } from '../data/content/faq.js';
import { postsByDate, postPath } from '../data/content/posts.js';
import { ProjectRepository } from '../data/repositories/ProjectRepository.js';
import { GetProjects } from '../domain/usecases/GetProjects.js';
import { graph, localBusiness, webSite, breadcrumb, faqPage, service, softwareAppList, blog, blogPosting } from './jsonld.js';

const apps = () => new GetProjects(new ProjectRepository()).execute({ type: 'app' });
const base = () => [localBusiness(site), webSite(site)];
const crumbs = (name, path) => breadcrumb(site, [{ name: 'Início', path: '/' }, { name, path }]);
const BRAND = 'InnovateApps Co.';

// Cada artigo do blog vira uma página indexável. A chave leva o slug para que
// routes.jsx e o teste de rotas continuem casando um-para-um com `pages`.
export const postKey = (slug) => `post:${slug}`;

const postPage = (post) => ({
  key: postKey(post.slug),
  path: postPath(post.slug),
  title: `${BRAND} | ${post.seo.title}`,
  description: post.seo.description,
  article: { published: post.date, modified: post.updated ?? post.date, section: post.category },
  jsonLd: () =>
    graph(
      ...base(),
      blogPosting(site, post),
      breadcrumb(site, [{ name: 'Início', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: post.seo.title, path: postPath(post.slug) }]),
    ),
});

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
    title: 'InnovateApps Co. | Sites, sistemas e aplicativos',
    description: 'Criamos sites, sistemas web e aplicativos Android e iOS sob medida para a sua empresa. Apps próprios publicados na Google Play e na App Store.',
    jsonLd: () => graph(...base(), softwareAppList(site, apps()), faqPage(homeFaq)),
  },
  aplicativos: servicePage('aplicativos', 'aplicativos', () => [softwareAppList(site, apps())]),
  sites: servicePage('sites', 'sites'),
  sistemasWeb: servicePage('sistemasWeb', 'sistemas-web'),
  blog: {
    key: 'blog',
    path: '/blog/',
    title: `${BRAND} | Blog`,
    description: 'Artigos sobre sites, sistemas web e aplicativos para quem toca uma empresa: o que investir em tecnologia muda na prática e por onde começar.',
    jsonLd: () => graph(...base(), blog(site, postsByDate()), crumbs('Blog', '/blog/')),
  },
  // Espalhados aqui um por artigo, na mesma ordem em que routes.jsx os registra.
  ...Object.fromEntries(postsByDate().map((post) => [postKey(post.slug), postPage(post)])),
  sobre: {
    key: 'sobre',
    path: '/sobre/',
    title: 'InnovateApps Co. | Sobre nós',
    description: 'Somos uma empresa de desenvolvimento de software. Sites, sistemas web e aplicativos feitos por quem programa, do primeiro rascunho à publicação.',
    jsonLd: () => graph(...base(), crumbs('Sobre', '/sobre/')),
  },
  contato: {
    key: 'contato',
    path: '/contato/',
    title: 'InnovateApps Co. | Contato',
    description: 'Fale com a Innovate Apps por WhatsApp ou e-mail. Orçamento de sites, sistemas web e aplicativos Android e iOS para a sua empresa.',
    jsonLd: () => graph(...base(), crumbs('Contato', '/contato/')),
  },
  notFound: {
    key: 'notFound',
    path: null,
    title: 'InnovateApps Co. | Página não encontrada',
    description: 'A página que você procurou não existe. Volte para o início e conheça os sites, sistemas e aplicativos da Innovate Apps.',
    robots: 'noindex, nofollow',
    jsonLd: () => graph(...base()),
  },
};

const withSlash = (p) => (p.endsWith('/') ? p : `${p}/`);

export function pageByPath(path) {
  const wanted = withSlash(path || '/');
  return Object.values(pages).find((p) => p.path === wanted) ?? pages.notFound;
}
