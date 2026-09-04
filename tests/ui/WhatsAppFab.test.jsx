import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { site, contactHref, DEFAULT_WHATSAPP_MESSAGE } from '../../src/config/site.js';

afterEach(() => vi.resetModules());

describe('WhatsAppFab', () => {
  it('renders a safe external link to the configured WhatsApp', async () => {
    const { default: WhatsAppFab } = await import('../../src/presentation/ui/WhatsAppFab.jsx');
    render(<WhatsAppFab />);
    const link = screen.getByRole('link', { name: 'Conversar no WhatsApp' });
    expect(link).toHaveAttribute('href', `https://wa.me/5512991077249?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`);
    expect(link).toHaveAttribute('href', contactHref(site, DEFAULT_WHATSAPP_MESSAGE));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders nothing when no WhatsApp is configured', async () => {
    vi.doMock('../../src/config/site.js', async (importOriginal) => {
      const mod = await importOriginal();
      return { ...mod, site: { ...mod.site, whatsapp: '' } };
    });
    const { default: WhatsAppFab } = await import('../../src/presentation/ui/WhatsAppFab.jsx');
    const { container } = render(<WhatsAppFab />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
