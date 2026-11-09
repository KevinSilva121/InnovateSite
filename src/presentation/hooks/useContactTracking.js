import { useEffect } from 'react';
import { site } from '../../config/site.js';

// Nomes dos eventos que chegam ao Google quando alguém clica para falar com a
// empresa. No Google Tag Manager, um acionador "Evento personalizado" com um
// desses nomes vira a conversão do Google Ads.
export const CONTACT_EVENTS = { whatsapp: 'clique_whatsapp', email: 'clique_email' };

// No Google Analytics o mesmo clique vira `generate_lead`, o evento que o GA4
// recomenda para contato. O nome é outro de propósito: assim um acionador do
// Tag Manager para o Google Ads nunca dispara duas vezes pelo mesmo clique.
export const ANALYTICS_LEAD_EVENT = 'generate_lead';
const METODO = { [CONTACT_EVENTS.whatsapp]: 'whatsapp', [CONTACT_EVENTS.email]: 'email' };

export function contactEventFor(href) {
  if (!href) return null;
  if (href.startsWith('https://wa.me/')) return CONTACT_EVENTS.whatsapp;
  if (/^mailto:/i.test(href)) return CONTACT_EVENTS.email;
  return null;
}

// Um só ouvinte no documento cobre todos os botões de contato (topo, hero,
// faixa de chamada, botão flutuante, rodapé, contato), inclusive os que vierem
// depois. Sem a tag do Google na página (`vite dev`, testes), não faz nada.
export function useContactTracking() {
  useEffect(() => {
    const aoClicar = (evento) => {
      if (!window.dataLayer) return;
      const link = evento.target.closest?.('a[href]');
      const nome = contactEventFor(link?.getAttribute('href'));
      if (!nome) return;
      const pagina = window.location.pathname;
      const botao = (link.getAttribute('aria-label') || link.textContent || '').trim().slice(0, 60);
      window.dataLayer.push({ event: nome, pagina, botao });
      if (site.googleAnalyticsId && typeof window.gtag === 'function') {
        window.gtag('event', ANALYTICS_LEAD_EVENT, {
          method: METODO[nome],
          page_path: pagina,
          link_text: botao,
          send_to: site.googleAnalyticsId,
        });
      }
    };
    document.addEventListener('click', aoClicar, true);
    return () => document.removeEventListener('click', aoClicar, true);
  }, []);
}
