import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Hero from '../../src/presentation/sections/Hero.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { site, contactHref, contactLabel } from '../../src/config/site.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('Hero', () => {
  it('renders the H1, both CTAs and the app count', () => {
    render(<MemoryRouter><Hero apps={apps} /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/sob medida para a sua empresa/);
    expect(screen.getByRole('link', { name: contactLabel(site) })).toHaveAttribute('href', contactHref(site));
    expect(screen.getByRole('link', { name: contactLabel(site) }).getAttribute('href').startsWith('https://wa.me/5512991077249')).toBe(true);
    expect(screen.getByRole('link', { name: 'Ver apps publicados' })).toHaveAttribute('href', '/#apps');
    expect(screen.getByText(`${apps.length} apps`)).toBeInTheDocument();
  });

  it('shows the phone feed with the delivered screens', () => {
    render(<MemoryRouter><Hero apps={apps} /></MemoryRouter>);
    expect(screen.getByRole('img', { name: /Telas de aplicativos e sites/ })).toBeInTheDocument();
  });
});
