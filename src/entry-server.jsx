import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { routes } from './routes.jsx';
import { pages, pageByPath } from './seo/pages.js';
import { buildHead } from './seo/buildHead.js';
import { site } from './config/site.js';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function renderAt(path, page) {
  const html = renderToString(
    <StaticRouter location={basename + path} basename={basename}>
      <App />
    </StaticRouter>,
  );
  return { html, head: buildHead(page, site) };
}

export const render = (path) => renderAt(path, pageByPath(path));
export const renderNotFound = () => renderAt('/pagina-inexistente/', pages.notFound);
export const routePaths = routes.map((r) => r.path);
export const siteUrl = site.url;
