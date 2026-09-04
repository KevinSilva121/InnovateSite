import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navbar from '../../src/presentation/layout/Navbar.jsx';
import { site, contactHref, contactLabel } from '../../src/config/site.js';
import { services } from '../../src/data/content/services.js';

const r = (path = '/sites/') => render(<MemoryRouter initialEntries={[path]}><Navbar /></MemoryRouter>);
const gatilho = () => screen.getAllByRole('button', { name: /Produtos/ })[0];

describe('Navbar', () => {
  it('has Início, Produtos, Blog and Sobre at the top level', () => {
    r();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    for (const name of ['Início', 'Blog', 'Sobre']) {
      expect(within(nav).getByRole('link', { name })).toBeInTheDocument();
    }
    expect(within(nav).getByRole('button', { name: /Produtos/ })).toBeInTheDocument();
    // Enquanto o painel está fechado, nenhum serviço aparece na navegação.
    for (const name of ['Aplicativos', 'Sites', 'Sistemas web']) {
      expect(within(nav).queryByRole('link', { name: new RegExp(name) })).toBeNull();
    }
  });

  it('reveals the three services inside the Produtos panel, with their hint text', () => {
    r();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    fireEvent.click(gatilho());
    for (const service of services) {
      const link = within(nav).getByRole('link', { name: new RegExp(`^${service.shortName} `) });
      expect(link).toHaveAttribute('href', service.path);
      expect(link.closest('#menu-produtos')).not.toBeNull();
      expect(link).toHaveTextContent(service.navHint);
    }
  });

  it('toggles the Produtos panel with aria state', () => {
    r('/');
    const painel = document.getElementById('menu-produtos');
    expect(gatilho()).toHaveAttribute('aria-expanded', 'false');
    expect(gatilho()).toHaveAttribute('aria-controls', 'menu-produtos');
    expect(painel).toHaveAttribute('hidden');
    fireEvent.click(gatilho());
    expect(gatilho()).toHaveAttribute('aria-expanded', 'true');
    expect(painel).not.toHaveAttribute('hidden');
    fireEvent.click(gatilho());
    expect(painel).toHaveAttribute('hidden');
  });

  it('closes the Produtos panel on Escape and returns focus to the trigger', () => {
    r('/');
    fireEvent.click(gatilho());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.getElementById('menu-produtos')).toHaveAttribute('hidden');
    expect(document.activeElement).toBe(gatilho());
  });

  it('marks Produtos as the current section on a service page, and the service inside it', () => {
    r('/sites/');
    expect(gatilho()).toHaveAttribute('data-current', 'page');
    fireEvent.click(gatilho());
    expect(screen.getByRole('link', { name: /^Sites / })).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark Produtos on pages outside the section', () => {
    r('/blog/');
    expect(gatilho()).not.toHaveAttribute('data-current');
    expect(screen.getAllByRole('link', { name: 'Blog' })[0]).toHaveAttribute('aria-current', 'page');
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

  it('lists the top-level links and Contato inside the mobile menu', () => {
    r();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    for (const name of ['Início', 'Blog', 'Sobre', 'Contato']) {
      expect(within(mobile).getByRole('link', { name })).toBeInTheDocument();
    }
  });

  it('keeps Produtos closed in the mobile menu until it is clicked', () => {
    r('/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    const grupo = within(mobile).getByRole('button', { name: /Produtos/ });
    const lista = document.getElementById('produtos-mobile');

    expect(grupo).toHaveAttribute('aria-expanded', 'false');
    expect(grupo).toHaveAttribute('aria-controls', 'produtos-mobile');
    expect(lista).toHaveAttribute('data-aberto', 'false');

    fireEvent.click(grupo);
    expect(grupo).toHaveAttribute('aria-expanded', 'true');
    expect(lista).toHaveAttribute('data-aberto', 'true');
    for (const service of services) {
      const link = within(lista).getByRole('link', { name: new RegExp(`^${service.shortName} `) });
      expect(link).toHaveAttribute('href', service.path);
      expect(link).toHaveTextContent(service.navHint);
    }

    fireEvent.click(grupo);
    expect(lista).toHaveAttribute('data-aberto', 'false');
  });

  it('reopens the mobile menu with Produtos collapsed', () => {
    r('/');
    const hamburguer = () => screen.getByRole('button', { name: /menu/ });
    fireEvent.click(hamburguer());
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    fireEvent.click(within(mobile).getByRole('button', { name: /Produtos/ }));
    expect(document.getElementById('produtos-mobile')).toHaveAttribute('data-aberto', 'true');

    fireEvent.click(hamburguer()); // fecha o menu
    fireEvent.click(hamburguer()); // abre de novo
    expect(document.getElementById('produtos-mobile')).toHaveAttribute('data-aberto', 'false');
  });

  it('marks the mobile Produtos as current on a service page', () => {
    r('/sistemas-web/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    const grupo = within(mobile).getByRole('button', { name: /Produtos/ });
    fireEvent.click(grupo);
    expect(within(mobile).getByRole('link', { name: /^Sistemas web / })).toHaveAttribute('aria-current', 'page');
  });

  it('uses the configured contact target for the CTA', () => {
    r();
    expect(screen.getAllByRole('link', { name: contactLabel(site) })[0]).toHaveAttribute('href', contactHref(site));
  });
});
