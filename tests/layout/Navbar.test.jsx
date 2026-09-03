import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navbar from '../../src/presentation/layout/Navbar.jsx';

const r = () => render(<MemoryRouter initialEntries={['/sites/']}><Navbar /></MemoryRouter>);

describe('Navbar', () => {
  it('has a primary navigation with the three services and Sobre', () => {
    r();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    for (const name of ['Aplicativos', 'Sites', 'Sistemas web', 'Sobre']) {
      expect(nav.querySelector(`a[href]`)).toBeTruthy();
      expect(screen.getAllByRole('link', { name }).length).toBeGreaterThan(0);
    }
  });

  it('marks the current page link', () => {
    r();
    const current = screen.getAllByRole('link', { name: 'Sites' }).find((a) => a.getAttribute('aria-current') === 'page');
    expect(current).toBeTruthy();
  });

  it('toggles the mobile menu with aria state', () => {
    r();
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'menu-mobile');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('menu-mobile')).not.toHaveAttribute('hidden');
  });

  it('falls back to /contato/ when whatsapp is empty', () => {
    r();
    expect(screen.getAllByRole('link', { name: 'Fale com a gente' })[0]).toHaveAttribute('href', '/contato/');
  });
});
