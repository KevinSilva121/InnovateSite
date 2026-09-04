import { describe, it, expect } from 'vitest';
import {
  posts, categories, postBySlug, postPath, postsByDate,
  readingMinutes, wordCount, formatDate, relatedPosts, headingId, outline,
} from '../../src/data/content/posts.js';

const BANNED = /transforma[çc][ãa]o digital|vanguarda|disruptiv|solu[çc][õo]es inovadoras/i;
const TIPOS = ['h2', 'p', 'ul', 'ol', 'note', 'quote'];

describe('blog posts', () => {
  it('has at least six posts with unique, url-safe slugs', () => {
    expect(posts.length).toBeGreaterThanOrEqual(6);
    const slugs = posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('sorts newest first regardless of declaration order', () => {
    const datas = postsByDate().map((p) => p.date);
    expect([...datas].sort((a, b) => b.localeCompare(a))).toEqual(datas);
  });

  it.each(posts)('$slug is complete and within SEO limits', (post) => {
    expect(`InnovateApps Co. | ${post.seo.title}`.length).toBeLessThanOrEqual(60);
    expect(post.seo.description.length).toBeGreaterThan(60);
    expect(post.seo.description.length).toBeLessThanOrEqual(155);
    expect(post.title.length).toBeLessThanOrEqual(110); // limite do headline no schema.org
    expect(post.excerpt.length).toBeGreaterThan(40);
    expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(categories).toContain(post.category);
    expect(JSON.stringify(post)).not.toMatch(BANNED);
  });

  it.each(posts)('$slug has a well-formed body with headings and enough text', (post) => {
    expect(post.body.length).toBeGreaterThanOrEqual(6);
    expect(post.body.filter((b) => b.t === 'h2').length).toBeGreaterThanOrEqual(2);
    for (const block of post.body) {
      expect(TIPOS).toContain(block.t);
      if (block.t === 'ul' || block.t === 'ol') {
        expect(block.items.length).toBeGreaterThanOrEqual(2);
        for (const item of block.items) expect(item.trim().length).toBeGreaterThan(0);
      } else {
        expect(block.text.trim().length).toBeGreaterThan(0);
      }
      if (block.t === 'note') expect(block.title.trim().length).toBeGreaterThan(0);
    }
    expect(wordCount(post)).toBeGreaterThan(350);
    expect(readingMinutes(post)).toBeGreaterThanOrEqual(1);
  });

  it.each(posts)('$slug points to sources over https and to real related posts', (post) => {
    for (const fonte of post.sources ?? []) {
      expect(fonte.url).toMatch(/^https:\/\//);
      expect(fonte.name.trim().length).toBeGreaterThan(0);
    }
    for (const slug of post.related ?? []) {
      expect(slug).not.toBe(post.slug);
      expect(postBySlug(slug)).toBeDefined();
    }
  });

  it('relatedPosts always returns two other posts', () => {
    for (const post of posts) {
      const sugestoes = relatedPosts(post);
      expect(sugestoes).toHaveLength(2);
      expect(sugestoes.map((s) => s.slug)).not.toContain(post.slug);
      expect(new Set(sugestoes.map((s) => s.slug)).size).toBe(2);
    }
  });

  it('postBySlug finds and misses; postPath builds a trailing-slash url', () => {
    expect(postBySlug(posts[0].slug)).toBe(posts[0]);
    expect(postBySlug('nao-existe')).toBeUndefined();
    expect(postPath('abc')).toBe('/blog/abc/');
  });

  it('headingId strips accents and punctuation into a url-safe anchor', () => {
    expect(headingId('O perfil é terreno alugado')).toBe('o-perfil-e-terreno-alugado');
    expect(headingId('Ninguém pesquisa por "ar-condicionado"')).toBe('ninguem-pesquisa-por-ar-condicionado');
    expect(headingId('  Três frentes!  ')).toBe('tres-frentes');
  });

  it.each(posts)('$slug has an outline with unique anchors', (post) => {
    const itens = outline(post);
    expect(itens.length).toBe(post.body.filter((b) => b.t === 'h2').length);
    const ids = itens.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('formatDate writes the date in Portuguese without relying on the locale', () => {
    expect(formatDate('2026-08-28')).toBe('28 de agosto de 2026');
    expect(formatDate('2026-01-05')).toBe('5 de janeiro de 2026');
    expect(formatDate('2026-12-31')).toBe('31 de dezembro de 2026');
  });
});
