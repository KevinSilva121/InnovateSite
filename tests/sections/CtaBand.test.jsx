import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CtaBand from '../../src/presentation/sections/CtaBand.jsx';
import { DEFAULT_WHATSAPP_MESSAGE } from '../../src/config/site.js';

afterEach(() => vi.resetModules());

describe('CtaBand', () => {
  it('uses the configured contact target', () => {
    render(<MemoryRouter><CtaBand /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/projeto/);
    expect(screen.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/5512991077249?text=' + encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)
    );
  });

  it('falls back to /contato/ with "Fale com a gente" when whatsapp is empty', async () => {
    vi.doMock('../../src/config/site.js', async (importOriginal) => {
      const mod = await importOriginal();
      return { ...mod, site: { ...mod.site, whatsapp: '' } };
    });
    const { default: CtaBandMocked } = await import('../../src/presentation/sections/CtaBand.jsx');
    render(<MemoryRouter><CtaBandMocked /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Fale com a gente' })).toHaveAttribute('href', '/contato/');
  });
});
