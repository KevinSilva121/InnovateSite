import { Routes, Route } from 'react-router';
import Layout from './presentation/layout/Layout.jsx';
import NotFound from './presentation/pages/NotFound.jsx';
import { routes } from './routes.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        {routes.map(({ path, Component, service, post }) => (
          <Route key={path} path={path.replace(/\/$/, '') || '/'} element={<Component service={service} post={post} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
