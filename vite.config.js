import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-html-head',
      apply: 'serve',
      transformIndexHtml(html) {
        const devHead = [
          '<title>Innovate Apps Co. | Sites, Sistemas Web e Aplicativos</title>',
          '<meta name="robots" content="index, follow" />',
          '<link rel="canonical" href="https://innovateapps.com.br/" />',
        ].join('\n    ');
        return html.replace('<!--app-head-->', devHead);
      },
    },
  ],
  base: process.env.VITE_BASE ?? '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: false,
  },
});

