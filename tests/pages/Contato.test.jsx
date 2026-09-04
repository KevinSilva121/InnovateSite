import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

afterEach(() => vi.resetModules());

const load = async (overrides) => {
  vi.doMock('../../src/config/site.js', async (importOriginal) => {
    const mod = await importOriginal();
    return { ...mod, site: { ...mod.site, ...overrides } };
  });
  const { default: Contato } = await import('../../src/presentation/pages/Contato.jsx');
  render(<MemoryRouter><Contato /></MemoryRouter>);
};

describe('Contato', () => {
  it('without channels configured, shows hours, city and stores but no WhatsApp/email rows', async () => {
    await load({ whatsapp: '', email: '' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Fale com a Innovate Apps/);
    expect(screen.queryByRole('link', { name: /WhatsApp/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /@/ })).toBeNull();
    expect(screen.getByText(/Segunda a sexta/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Cidades atendidas' })).toBeInTheDocument();
  });

  it('with channels configured, shows a WhatsApp button and a mailto link', async () => {
    await load({ whatsapp: '5512999999999', email: 'oi@innovateapps.com.br' });
    expect(screen.getByRole('link', { name: 'Chamar no WhatsApp' })).toHaveAttribute('href', expect.stringContaining('wa.me/5512999999999'));
    expect(screen.getByRole('link', { name: 'oi@innovateapps.com.br' })).toHaveAttribute('href', 'mailto:oi@innovateapps.com.br');
  });
});
