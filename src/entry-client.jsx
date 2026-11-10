// O CSS global vem antes de App: assim o bundle põe tokens, base e utilitários
// primeiro e o CSS de cada componente depois, e um ajuste num componente
// (ex.: a cor de .eyebrow no hero) ganha da regra global de mesma especificidade.
import './presentation/styles/index.css';
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

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
