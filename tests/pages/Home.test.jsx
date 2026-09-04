import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from '../../src/presentation/pages/Home.jsx';

describe('Home', () => {
  it('has one H1 and every section anchor in order', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const ids = ['servicos', 'apps', 'case', 'como-funciona', 'regiao', 'faq'].map((id) => document.getElementById(id));
    expect(ids.every(Boolean)).toBe(true);
    const order = ids.map((el) => Array.from(document.querySelectorAll('section')).indexOf(el));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(document.querySelectorAll('details')).toHaveLength(6);
  });
});
