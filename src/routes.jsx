import { services } from './data/content/services.js';
import Home from './presentation/pages/Home.jsx';
import ServicePage from './presentation/pages/ServicePage.jsx';
import Sobre from './presentation/pages/Sobre.jsx';
import Contato from './presentation/pages/Contato.jsx';

const pageKey = { aplicativos: 'aplicativos', sites: 'sites', 'sistemas-web': 'sistemasWeb' };

// Tabela única de rotas. `page` aponta para a chave em seo/pages.js.
export const routes = [
  { path: '/', page: 'home', Component: Home },
  ...services.map((service) => ({ path: service.path, page: pageKey[service.slug], Component: ServicePage, service })),
  { path: '/sobre/', page: 'sobre', Component: Sobre },
  { path: '/contato/', page: 'contato', Component: Contato },
];
