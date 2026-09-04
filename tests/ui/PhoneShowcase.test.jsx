import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhoneShowcase from '../../src/presentation/ui/PhoneShowcase.jsx';

const imgs = () => [...document.querySelectorAll('img')];
const sources = () => imgs().map((i) => i.getAttribute('src'));

describe('PhoneShowcase', () => {
  it('exposes one accessible name for the whole composition, not one per screen', () => {
    render(<PhoneShowcase />);
    expect(screen.getByRole('img', { name: 'Telas de aplicativos e sites desenvolvidos pela Innovate Apps' })).toBeInTheDocument();
    for (const img of imgs()) expect(img).toHaveAttribute('alt', '');
  });

  it('runs the screens in the order the client asked for', () => {
    render(<PhoneShowcase />);
    const order = [...new Set(sources())].map((s) => s.match(/\d\d-([a-z]+)\d/)[1]);
    expect(order).toEqual([
      'advalice', 'advalice',
      'contador', 'contador',
      'prazzo', 'prazzo', 'prazzo', 'prazzo',
      'trama', 'trama', 'trama', 'trama',
    ]);
  });

  it('repeats only the first screen at the end so the loop closes without a jump', () => {
    render(<PhoneShowcase />);
    const list = sources();
    expect(list).toHaveLength(13);
    expect(new Set(list).size).toBe(12);
    expect(list[12]).toBe(list[0]);
  });

  it('offers a smaller file to low-density screens and states the rendered size', () => {
    render(<PhoneShowcase />);
    for (const img of imgs()) {
      expect(img.getAttribute('srcset')).toMatch(/-360\.webp 360w, .+\.webp 540w$/);
      expect(img).toHaveAttribute('sizes', '272px');
      expect(img).toHaveAttribute('width', '540');
      expect(img).toHaveAttribute('height', '1170');
      expect(img).toHaveAttribute('decoding', 'async');
    }
  });

  it('loads the first two frames eagerly and defers the rest', () => {
    render(<PhoneShowcase />);
    const list = imgs();
    expect(list.slice(0, 2).every((i) => i.getAttribute('loading') === 'eager')).toBe(true);
    expect(list.slice(2).every((i) => i.getAttribute('loading') === 'lazy')).toBe(true);
  });
});
