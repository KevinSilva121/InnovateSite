import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './presentation/styles/index.css';

document.documentElement.classList.add('js');

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
const root = document.getElementById('root');
const tree = (
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Em produção o HTML já vem pré-renderizado (hidrata); no `vite dev` o root está vazio (monta do zero).
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
