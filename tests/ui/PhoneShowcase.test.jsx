import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import PhoneShowcase from '../../src/presentation/ui/PhoneShowcase.jsx';

const imgs = () => [...document.querySelectorAll('img')];

afterEach(() => vi.useRealTimers());

describe('PhoneShowcase', () => {
  it('exposes one accessible name for the whole composition, not one per screen', () => {
    render(<PhoneShowcase />);
    expect(screen.getByRole('img', { name: 'Telas de aplicativos e sites desenvolvidos pela Innovate Apps' })).toBeInTheDocument();
    for (const img of imgs()) expect(img).toHaveAttribute('alt', '');
  });

  it('reserves one layer per screen so the GPU animates each one alone', () => {
    render(<PhoneShowcase />);
    const screenEl = document.querySelector('img').parentElement.parentElement;
    expect(screenEl.children).toHaveLength(12);
    for (const child of screenEl.children) expect(child.tagName).toBe('DIV');
  });

  it('ships only the first screen up front, the rest once the browser is idle', () => {
    vi.useFakeTimers();
    render(<PhoneShowcase />);
    expect(imgs()).toHaveLength(1);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(imgs()).toHaveLength(12);
  });

  it('runs the screens once each, in the order the client asked for', () => {
    vi.useFakeTimers();
    render(<PhoneShowcase />);
    act(() => { vi.advanceTimersByTime(2500); });
    const list = imgs().map((i) => i.getAttribute('src'));
    expect(new Set(list).size).toBe(12);
    expect(list.map((s) => s.match(/\d\d-([a-z]+)\d/)[1])).toEqual([
      'advalice', 'advalice',
      'contador', 'contador',
      'prazzo', 'prazzo', 'prazzo', 'prazzo',
      'trama', 'trama', 'trama', 'trama',
    ]);
  });

  it('offers three widths so each screen density downloads only what it needs', () => {
    vi.useFakeTimers();
    render(<PhoneShowcase />);
    act(() => { vi.advanceTimersByTime(2500); });
    for (const img of imgs()) {
      const srcset = img.getAttribute('srcset');
      expect(srcset).toMatch(/-360\.webp 360w/);
      expect(srcset).toMatch(/-540\.webp 540w/);
      expect(srcset).toMatch(/-810\.webp 810w/);
      expect(img.getAttribute('src')).toMatch(/-540\.webp$/);
      expect(img).toHaveAttribute('sizes', '272px');
      expect(img).toHaveAttribute('width', '540');
      expect(img).toHaveAttribute('height', '1170');
      expect(img).toHaveAttribute('decoding', 'async');
    }
  });

  it('loads the first frame eagerly and defers the rest', () => {
    vi.useFakeTimers();
    render(<PhoneShowcase />);
    act(() => { vi.advanceTimersByTime(2500); });
    const list = imgs();
    expect(list[0]).toHaveAttribute('loading', 'eager');
    expect(list.slice(1).every((i) => i.getAttribute('loading') === 'lazy')).toBe(true);
  });
});
