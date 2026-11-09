import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useContactTracking, contactEventFor, CONTACT_EVENTS, ANALYTICS_LEAD_EVENT } from '../../src/presentation/hooks/useContactTracking.js';
import { site } from '../../src/config/site.js';

function Pagina() {
  useContactTracking();
  return (
    <>
      <a href="https://wa.me/5512991077249?text=Ol%C3%A1" aria-label="Conversar no WhatsApp"><svg data-testid="icone" /></a>
      <a href="mailto:oi@exemplo.com">oi@exemplo.com</a>
      <a href="/sites/">Sites</a>
    </>
  );
}

// O jsdom não navega: sem isso, cada clique em link imprime "Not implemented: navigation".
const semNavegar = (evento) => evento.preventDefault();

describe('contact tracking', () => {
  beforeEach(() => {
    window.dataLayer = [];
    document.addEventListener('click', semNavegar);
  });
  afterEach(() => {
    delete window.dataLayer;
    document.removeEventListener('click', semNavegar);
  });

  it('classifies contact links', () => {
    expect(contactEventFor('https://wa.me/5512991077249')).toBe(CONTACT_EVENTS.whatsapp);
    expect(contactEventFor('mailto:a@b.c')).toBe(CONTACT_EVENTS.email);
    expect(contactEventFor('/contato/')).toBeNull();
    expect(contactEventFor(null)).toBeNull();
  });

  it('pushes clique_whatsapp even when the click lands on the icon inside the link', () => {
    render(<Pagina />);
    fireEvent.click(screen.getByTestId('icone'));
    expect(window.dataLayer).toEqual([{ event: 'clique_whatsapp', pagina: '/', botao: 'Conversar no WhatsApp' }]);
  });

  it('pushes clique_email for mailto and ignores ordinary links', () => {
    render(<Pagina />);
    fireEvent.click(screen.getByText('Sites'));
    fireEvent.click(screen.getByText('oi@exemplo.com'));
    expect(window.dataLayer).toEqual([{ event: 'clique_email', pagina: '/', botao: 'oi@exemplo.com' }]);
  });

  it('also sends generate_lead to Google Analytics only, under a different name', () => {
    window.gtag = vi.fn();
    render(<Pagina />);
    fireEvent.click(screen.getByTestId('icone'));
    expect(window.gtag).toHaveBeenCalledWith('event', ANALYTICS_LEAD_EVENT, {
      method: 'whatsapp', page_path: '/', link_text: 'Conversar no WhatsApp', send_to: site.googleAnalyticsId,
    });
    expect(ANALYTICS_LEAD_EVENT).not.toBe(CONTACT_EVENTS.whatsapp);
    delete window.gtag;
  });

  it('stays quiet when the Google tag is not loaded', () => {
    delete window.dataLayer;
    render(<Pagina />);
    expect(() => fireEvent.click(screen.getByTestId('icone'))).not.toThrow();
    expect(window.dataLayer).toBeUndefined();
  });
});
