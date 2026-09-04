import { services } from './data/content/services.js';
import { postsByDate, postPath } from './data/content/posts.js';
import { postKey } from './seo/pages.js';
import Home from './presentation/pages/Home.jsx';
import ServicePage from './presentation/pages/ServicePage.jsx';
import Blog from './presentation/pages/Blog.jsx';
import BlogPost from './presentation/pages/BlogPost.jsx';
import Sobre from './presentation/pages/Sobre.jsx';
import Contato from './presentation/pages/Contato.jsx';

const pageKey = { aplicativos: 'aplicativos', sites: 'sites', 'sistemas-web': 'sistemasWeb' };

// Tabela única de rotas. `page` aponta para a chave em seo/pages.js.
// A ordem tem de bater com a ordem das páginas indexáveis lá.
export const routes = [
  { path: '/', page: 'home', Component: Home },
  ...services.map((service) => ({ path: service.path, page: pageKey[service.slug], Component: ServicePage, service })),
  { path: '/blog/', page: 'blog', Component: Blog },
  ...postsByDate().map((post) => ({ path: postPath(post.slug), page: postKey(post.slug), Component: BlogPost, post })),
  { path: '/sobre/', page: 'sobre', Component: Sobre },
  { path: '/contato/', page: 'contato', Component: Contato },
];
