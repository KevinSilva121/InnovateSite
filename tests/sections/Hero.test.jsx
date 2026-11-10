import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Hero from '../../src/presentation/sections/Hero.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { site, contactHref, contactLabel } from '../../src/config/site.js';
import { cities } from '../../src/data/content/cities.js';
import { heroFundo } from '../../src/config/heroFundo.js';
import { existsSync, readFileSync } from 'node:fs';
import { deveFicarParado, escolherFontes } from '../../src/presentation/ui/HeroBackground.jsx';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');
const r = () => render(<MemoryRouter><Hero apps={apps} /></MemoryRouter>);

describe('Hero', () => {
  it('keeps the original SEO texts: eyebrow, H1, lead and the Taubaté line, with one WhatsApp CTA', () => {
    r();
    // Textos originais do site (os mesmos do site no ar antes do redesenho): não mudar sem conferir o SEO.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sites, sistemas e aplicativos sob medida no Vale do Paraíba');
    expect(screen.getByText('Empresa de software em Taubaté – SP')).toBeInTheDocument();
    expect(screen.getByText(/sede em Taubaté, atendimento em todo o Brasil/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver apps publicados' })).toHaveAttribute('href', '/#apps');
    expect(screen.getByText(/Seu site atraindo cliente, seu sistema organizando a operação e seu app na mão de\s+quem importa\. A gente constrói, coloca no ar e continua junto depois\./)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: contactLabel(site) });
    expect(cta).toHaveAttribute('href', contactHref(site));
    expect(cta.getAttribute('href').startsWith('https://wa.me/5512991077249')).toBe(true);
  });

  it('shows the numbers in a definition list, with the final values already in the HTML', () => {
    r();
    const termos = [...document.querySelectorAll('dl dt')].map((dt) => dt.textContent);
    const valores = [...document.querySelectorAll('dl dd')].map((dd) => dd.textContent);
    expect(termos).toEqual(['apps publicados', 'cidades atendidas', 'downloads']);
    expect(valores).toEqual([String(apps.length), String(cities.length), '+10.000']);
  });

  it('ends with the apps ticker: decorative, two identical copies with every app', () => {
    r();
    const hero = document.querySelector('section[aria-labelledby="hero-title"]');
    const esteira = hero.lastElementChild;
    expect(esteira).toHaveAttribute('aria-hidden', 'true');
    const copias = esteira.querySelectorAll('ul');
    expect(copias).toHaveLength(2);
    for (const copia of copias) {
      const itens = [...copia.querySelectorAll('li')];
      expect(itens).toHaveLength(apps.length);
      apps.forEach((app, i) => {
        expect(itens[i]).toHaveTextContent(app.title);
        expect(itens[i]).toHaveTextContent(app.category);
        expect(itens[i].querySelector('img')).toHaveAttribute('src', app.icon);
        expect(itens[i].querySelector('img')).toHaveAttribute('alt', '');
      });
    }
  });

  it('keeps the ticker moving under the mouse and still for reduced motion', () => {
    const css = readFileSync('src/presentation/ui/AppsTicker.module.css', 'utf8');
    expect(css).not.toMatch(/:hover/);
    expect(css).not.toMatch(/animation-play-state/);
    expect(css).toMatch(/animation: rolar \d+s linear infinite/);
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.belt \{ animation: none; \}/);
  });

  it('renders a decorative, muted, looping video that starts with the poster and no source in the HTML', () => {
    r();
    const fundo = document.querySelector('section > [aria-hidden="true"]');
    const video = fundo.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('poster', heroFundo.capa);
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video.muted).toBe(true);
    // O vídeo só entra depois que a página carrega: nada para baixar no HTML.
    expect(video.querySelector('source')).toBeNull();
    expect(video).not.toHaveAttribute('src');
  });

  it('lists WebM first and MP4 as the fallback, for both formats, with existing files', () => {
    for (const formato of [heroFundo.horizontal, heroFundo.vertical]) {
      expect(formato.fontes.map((f) => f.tipo.split(';')[0])).toEqual(['video/webm', 'video/mp4']);
      expect(formato.largura).toBeGreaterThan(0);
      expect(formato.altura).toBeGreaterThan(0);
      for (const f of formato.fontes) expect(existsSync(`public${f.src}`), f.src).toBe(true);
    }
    expect(existsSync(`public${heroFundo.capa}`)).toBe(true);
    expect(heroFundo.grao).toBeGreaterThanOrEqual(0);
    expect(heroFundo.grao).toBeLessThanOrEqual(1);
  });

  it('goes straight to MP4 when WebM is unsupported or only decodes in software', async () => {
    const consulta = (info) => ({ decodingInfo: async () => info });
    const f = heroFundo.horizontal;
    expect(await escolherFontes(f, consulta({ supported: true, powerEfficient: true }))).toEqual(f.fontes);
    expect(await escolherFontes(f, consulta({ supported: true, powerEfficient: false }))).toEqual(f.fontes.slice(1));
    expect(await escolherFontes(f, consulta({ supported: false, powerEfficient: false }))).toEqual(f.fontes.slice(1));
    // Sem a API, ou se ela falhar: ordem da config.
    expect(await escolherFontes(f, undefined)).toEqual(f.fontes);
    expect(await escolherFontes(f, { decodingInfo: async () => { throw new Error('x'); } })).toEqual(f.fontes);
  });

  it('keeps only the poster with reduced motion, data saver or a 2G connection', () => {
    const janela = ({ reduz = false, conexao } = {}) => ({
      matchMedia: (q) => ({ matches: reduz && q.includes('reduced-motion') }),
      navigator: { connection: conexao },
    });
    expect(deveFicarParado(janela())).toBe(false);
    expect(deveFicarParado(janela({ conexao: { effectiveType: '4g' } }))).toBe(false);
    expect(deveFicarParado(janela({ reduz: true }))).toBe(true);
    expect(deveFicarParado(janela({ conexao: { saveData: true, effectiveType: '4g' } }))).toBe(true);
    expect(deveFicarParado(janela({ conexao: { effectiveType: '2g' } }))).toBe(true);
    expect(deveFicarParado(janela({ conexao: { effectiveType: 'slow-2g' } }))).toBe(true);
  });
});
