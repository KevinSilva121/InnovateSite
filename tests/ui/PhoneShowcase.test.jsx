import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhoneShowcase from '../../src/presentation/ui/PhoneShowcase.jsx';

const sources = () => [...document.querySelectorAll('img')].map((i) => i.getAttribute('src'));

describe('PhoneShowcase', () => {
  it('exposes one accessible name for the whole composition, not one per screen', () => {
    render(<PhoneShowcase />);
    expect(screen.getByRole('img', { name: 'Telas de aplicativos e sites desenvolvidos pela Innovate Apps' })).toBeInTheDocument();
    for (const img of document.querySelectorAll('img')) {
      expect(img).toHaveAttribute('alt', '');
    }
  });

  it('repeats only the first screen at the end so the loop closes without a jump', () => {
    render(<PhoneShowcase />);
    const list = sources();
    expect(list).toHaveLength(5);
    expect(new Set(list).size).toBe(4);
    expect(list[4]).toBe(list[0]);
    expect(list.slice(0, 4)).toEqual([...new Set(list)]);
  });

  it('gives every frame the phone screen ratio so each step lands on one screen', () => {
    render(<PhoneShowcase />);
    for (const img of document.querySelectorAll('img')) {
      expect(img).toHaveAttribute('width', '540');
      expect(img).toHaveAttribute('height', '1170');
    }
  });

  it('loads the first frame eagerly and defers the rest', () => {
    render(<PhoneShowcase />);
    const imgs = [...document.querySelectorAll('img')];
    expect(imgs[0]).toHaveAttribute('loading', 'eager');
    expect(imgs.slice(1).every((i) => i.getAttribute('loading') === 'lazy')).toBe(true);
  });
});
