import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import BlogPost from '../../src/presentation/pages/BlogPost.jsx';
import { postsByDate, postPath, formatDate, readingMinutes, relatedPosts, outline } from '../../src/data/content/posts.js';

const artigos = postsByDate();
const r = (post) => render(<MemoryRouter><BlogPost post={post} /></MemoryRouter>);

describe('BlogPost', () => {
  it.each(artigos)('$slug renders one H1 with the title and the article meta', (post) => {
    r(post);
    const titulos = document.querySelectorAll('h1');
    expect(titulos).toHaveLength(1);
    expect(titulos[0]).toHaveTextContent(post.title);
    expect(screen.getByText(formatDate(post.date))).toHaveAttribute('datetime', post.date);
    expect(screen.getByText(`${readingMinutes(post)} min de leitura`)).toBeInTheDocument();
  });

  it.each(artigos)('$slug turns every body block into real markup', (post) => {
    r(post);
    const artigo = document.querySelector('article');
    for (const bloco of post.body) {
      if (bloco.t === 'ul' || bloco.t === 'ol') {
        for (const item of bloco.items) expect(within(artigo).getByText(item)).toBeInTheDocument();
      } else {
        expect(within(artigo).getByText(bloco.text)).toBeInTheDocument();
      }
    }
    const subtitulos = [...artigo.querySelectorAll('h2')].map((h) => h.textContent);
    for (const bloco of post.body.filter((b) => b.t === 'h2')) expect(subtitulos).toContain(bloco.text);
  });

  it.each(artigos)('$slug opens its sources in a new tab, safely', (post) => {
    r(post);
    for (const fonte of post.sources ?? []) {
      const link = screen.getByRole('link', { name: new RegExp(fonte.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) });
      expect(link).toHaveAttribute('href', fonte.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it.each(artigos)('$slug suggests two other posts and links back to the index', (post) => {
    r(post);
    for (const sugestao of relatedPosts(post)) {
      expect(screen.getByRole('link', { name: sugestao.title })).toHaveAttribute('href', postPath(sugestao.slug));
    }
    expect(screen.getByRole('link', { name: /Ver todos os artigos/ })).toHaveAttribute('href', '/blog/');
  });

  it.each(artigos)('$slug builds a table of contents whose anchors exist in the text', (post) => {
    r(post);
    const sumario = screen.getByRole('navigation', { name: 'Neste artigo' });
    const itens = outline(post);
    expect(within(sumario).getAllByRole('link')).toHaveLength(itens.length);
    for (const item of itens) {
      expect(within(sumario).getByRole('link', { name: item.text })).toHaveAttribute('href', `#${item.id}`);
      expect(document.getElementById(item.id)?.tagName).toBe('H2');
    }
  });

  it('puts the shortened title at the end of the breadcrumb', () => {
    const post = artigos[0];
    r(post);
    const trilha = screen.getByRole('navigation', { name: 'Navegação estrutural' });
    expect(within(trilha).getByText(post.seo.title)).toHaveAttribute('aria-current', 'page');
    expect(within(trilha).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
  });
});
