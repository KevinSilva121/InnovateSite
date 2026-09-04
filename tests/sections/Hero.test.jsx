import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Hero from '../../src/presentation/sections/Hero.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { site, contactHref, contactLabel } from '../../src/config/site.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('Hero', () => {
  it('renders the H1, both CTAs and one tile per app', () => {
    render(<MemoryRouter><Hero apps={apps} /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Vale do Paraíba/);
    expect(screen.getByRole('link', { name: contactLabel(site) })).toHaveAttribute('href', contactHref(site));
    expect(screen.getByRole('link', { name: 'Ver apps publicados' })).toHaveAttribute('href', '/#apps');
    expect(screen.getAllByRole('img').filter((i) => i.getAttribute('alt'))).toHaveLength(4);
    expect(screen.getByRole('img', { name: 'Ícone do app CalcFrete' })).toHaveAttribute('width', '72');
  });
});
