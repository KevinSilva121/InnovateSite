import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Blog from '../../src/presentation/pages/Blog.jsx';
import { postsByDate, postPath, formatDate } from '../../src/data/content/posts.js';

const r = () => render(<MemoryRouter><Blog /></MemoryRouter>);

describe('Blog', () => {
  it('has a single H1 and a breadcrumb ending on Blog', () => {
    r();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    const trilha = screen.getByRole('navigation', { name: 'Navegação estrutural' });
    expect(trilha).toHaveTextContent(/Início/);
    expect(trilha).toHaveTextContent(/Blog/);
  });

  it('links every post exactly once, newest first', () => {
    r();
    const artigos = postsByDate();
    const hrefs = artigos.map((post) => screen.getByRole('link', { name: post.title }).getAttribute('href'));
    expect(hrefs).toEqual(artigos.map((post) => postPath(post.slug)));
  });

  it('shows the newest post as the featured heading and the rest below it', () => {
    r();
    const [destaque, ...restante] = postsByDate();
    expect(screen.getByRole('heading', { level: 2, name: destaque.title })).toBeInTheDocument();
    for (const post of restante) {
      expect(screen.getByRole('heading', { level: 3, name: post.title })).toBeInTheDocument();
    }
  });

  it('shows category, machine-readable date and reading time for each post', () => {
    r();
    for (const post of postsByDate()) {
      const data = screen.getAllByText(formatDate(post.date))[0];
      expect(data.tagName).toBe('TIME');
      expect(data).toHaveAttribute('datetime', post.date);
      expect(screen.getAllByText(post.category).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText(/min de leitura/).length).toBe(postsByDate().length);
  });
});
