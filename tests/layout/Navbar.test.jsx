import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navbar from '../../src/presentation/layout/Navbar.jsx';
import { site, contactHref, contactLabel } from '../../src/config/site.js';
import { services } from '../../src/data/content/services.js';

const r = (path = '/sites/') => render(<MemoryRouter initialEntries={[path]}><Navbar /></MemoryRouter>);
const gatilho = () => screen.getAllByRole('button', { name: /Serviços/ })[0];

describe('Navbar', () => {
  it('has Início, Serviços, Blog, Sobre and Contato at the top level (no Cases)', () => {
    r();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    for (const name of ['Início', 'Blog', 'Sobre', 'Contato']) {
      expect(within(nav).getByRole('link', { name })).toBeInTheDocument();
    }
    // "Cases" saiu do header a pedido; os cases continuam na home (#apps).
    expect(within(nav).queryByRole('link', { name: 'Cases' })).toBeNull();
    expect(screen.queryAllByRole('link', { name: 'Cases' })).toHaveLength(0);
    expect(within(nav).getByRole('button', { name: /Serviços/ })).toBeInTheDocument();
    // Enquanto o painel está fechado, nenhum serviço aparece na navegação.
    expect(screen.queryByRole('navigation', { name: 'Serviços' })).toBeNull();
  });

  it('reveals the three services inside the Serviços panel, with their hint text', () => {
    r();
    fireEvent.click(gatilho());
    const painel = screen.getByRole('navigation', { name: 'Serviços' });
    for (const service of services) {
      const link = within(painel).getByRole('link', { name: new RegExp(`^${service.shortName} `) });
      expect(link).toHaveAttribute('href', service.path);
      expect(link.closest('#menu-servicos')).not.toBeNull();
      expect(link).toHaveTextContent(service.navHint);
    }
  });

  it('starts transparent at the top and turns solid when the Serviços panel opens', () => {
    r('/');
    const header = document.querySelector('header');
    expect(header).toHaveAttribute('data-topo', 'true');
    expect(header).toHaveAttribute('data-aberto', 'false');
    fireEvent.click(gatilho());
    expect(header).toHaveAttribute('data-aberto', 'true');
  });

  it('toggles the Serviços panel with aria state', () => {
    r('/');
    const painel = document.getElementById('menu-servicos');
    expect(gatilho()).toHaveAttribute('aria-expanded', 'false');
    expect(gatilho()).toHaveAttribute('aria-controls', 'menu-servicos');
    expect(painel).toHaveAttribute('hidden');
    fireEvent.click(gatilho());
    expect(gatilho()).toHaveAttribute('aria-expanded', 'true');
    expect(painel).not.toHaveAttribute('hidden');
    fireEvent.click(gatilho());
    expect(painel).toHaveAttribute('hidden');
  });

  it('closes the Serviços panel on Escape and returns focus to the trigger', () => {
    r('/');
    fireEvent.click(gatilho());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.getElementById('menu-servicos')).toHaveAttribute('hidden');
    expect(document.activeElement).toBe(gatilho());
  });

  it('marks Serviços as the current section on a service page, and the service inside it', () => {
    r('/sites/');
    expect(gatilho()).toHaveAttribute('data-current', 'page');
    fireEvent.click(gatilho());
    expect(screen.getByRole('link', { name: /^Sites / })).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark Serviços on pages outside the section', () => {
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

  it('keeps Serviços closed in the mobile menu until it is clicked', () => {
    r('/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    const grupo = within(mobile).getByRole('button', { name: /Serviços/ });
    const lista = document.getElementById('servicos-mobile');

    expect(grupo).toHaveAttribute('aria-expanded', 'false');
    expect(grupo).toHaveAttribute('aria-controls', 'servicos-mobile');
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

  it('reopens the mobile menu with Serviços collapsed', () => {
    r('/');
    const hamburguer = () => screen.getByRole('button', { name: /menu/ });
    fireEvent.click(hamburguer());
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    fireEvent.click(within(mobile).getByRole('button', { name: /Serviços/ }));
    expect(document.getElementById('servicos-mobile')).toHaveAttribute('data-aberto', 'true');

    fireEvent.click(hamburguer()); // fecha o menu
    fireEvent.click(hamburguer()); // abre de novo
    expect(document.getElementById('servicos-mobile')).toHaveAttribute('data-aberto', 'false');
  });

  it('marks the mobile Serviços as current on a service page', () => {
    r('/sistemas-web/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const mobile = screen.getByRole('navigation', { name: 'Principal (celular)' });
    const grupo = within(mobile).getByRole('button', { name: /Serviços/ });
    fireEvent.click(grupo);
    expect(within(mobile).getByRole('link', { name: /^Sistemas web / })).toHaveAttribute('aria-current', 'page');
  });

  describe('ao rolar', () => {
    const rolarPara = (y) => {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
      fireEvent.scroll(window);
    };
    afterEach(() => rolarPara(0));

    it('hides when scrolling down and comes back when scrolling up', () => {
      r('/');
      const header = document.querySelector('header');
      expect(header).toHaveAttribute('data-escondido', 'false');

      rolarPara(400);
      expect(header).toHaveAttribute('data-escondido', 'true');
      expect(header).toHaveAttribute('data-topo', 'false');
      expect(document.documentElement.dataset.header).toBe('escondido');

      rolarPara(300);
      expect(header).toHaveAttribute('data-escondido', 'false');
      expect(document.documentElement.dataset.header).toBe('visivel');

      rolarPara(800);
      expect(header).toHaveAttribute('data-escondido', 'true');
      rolarPara(0);
      expect(header).toHaveAttribute('data-escondido', 'false');
      expect(header).toHaveAttribute('data-topo', 'true');
    });

    it('ignores tiny scroll jitters', () => {
      r('/');
      const header = document.querySelector('header');
      rolarPara(400);
      rolarPara(396);
      expect(header).toHaveAttribute('data-escondido', 'true');
    });

    it('stays visible while the Serviços panel or the mobile menu is open', () => {
      r('/');
      const header = document.querySelector('header');
      fireEvent.click(gatilho());
      rolarPara(600);
      expect(header).toHaveAttribute('data-escondido', 'false');
      fireEvent.click(gatilho());

      fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
      rolarPara(1200);
      expect(header).toHaveAttribute('data-escondido', 'false');
    });

    it('reappears when a menu opens', () => {
      r('/');
      const header = document.querySelector('header');
      rolarPara(600);
      expect(header).toHaveAttribute('data-escondido', 'true');
      fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
      expect(header).toHaveAttribute('data-escondido', 'false');
    });
  });

  it('uses the configured contact target for the CTA', () => {
    r();
    expect(screen.getAllByRole('link', { name: contactLabel(site) })[0]).toHaveAttribute('href', contactHref(site));
  });
});
