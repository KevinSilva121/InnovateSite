import { cities } from '../data/content/cities.js';

const FALLBACK_URL = 'https://innovateapps.com.br';

export const site = {
  name: 'Innovate Apps Co.',
  shortName: 'Innovate Apps',
  // Outras grafias com que a marca aparece (Play Store, crédito nos sites de clientes).
  // Vão no schema para o Google entender que é tudo a mesma empresa.
  alternateNames: ['Innovate Apps', 'InnovateApps Co.', 'InnovateApps'],
  url: (import.meta.env.VITE_SITE_URL || FALLBACK_URL).replace(/\/$/, ''),
  description:
    'Empresa de software em Taubaté – SP. Desenvolvimento de sites, sistemas web e aplicativos Android e iOS sob medida para empresas do Vale do Paraíba e de todo o Brasil.',
  whatsapp: '5512991077249', // E.164 sem "+", ex.: "5512999999999"
  email: 'innovateappsco@gmail.com',
  copyrightYear: 2026, // atualizar quando virar o ano, ou no próximo deploy
  address: { locality: 'Taubaté', region: 'SP', country: 'BR' },
  areaServed: cities,
  // Horário de atendimento: aparece na página de contato e no schema LocalBusiness.
  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
    label: 'Segunda a sexta, das 9h às 18h.',
  },
  social: {
    instagram: 'https://www.instagram.com/innovateappsco/',
    linkedin: 'https://www.linkedin.com/company/innovateapps-co/',
  },
  stores: {
    play: 'https://play.google.com/store/apps/developer?id=InnovateApps+Co.',
    appStore: 'https://apps.apple.com/br/developer/kevin-silva/id6797971217',
  },
  founder: 'Kevin Silva',
  // Contêiner da tag do Google (Google Ads). Entra só no HTML de produção, gerado
  // pelo prerender. Com este e googleAnalyticsId vazios, saem também o aviso de
  // cookies e o link do rodapé.
  googleTagId: 'GTM-P2BGH4B5',
  // Google Analytics 4: visitas, páginas e origem do público. Mesma regra: vazio desliga.
  googleAnalyticsId: 'G-4QRX8269FX',
};

// Há alguma ferramenta do Google ligada? Controla o aviso de cookies e o link do rodapé.
export const hasGoogleTags = (config) => Boolean(config.googleTagId || config.googleAnalyticsId);

// Chave em que a escolha do aviso de cookies fica guardada no navegador.
// public/tag-google.js lê a mesma chave antes de carregar o Google: se mudar
// aqui, mude lá também.
export const CONSENT_KEY = 'consentimento-cookies';

export const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Innovate Apps e quero conversar sobre um projeto.';

export function contactHref(config, message = DEFAULT_WHATSAPP_MESSAGE) {
  if (!config.whatsapp) return '/contato/';
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function sameAsLinks(config) {
  return [config.stores.play, config.stores.appStore, config.social.instagram, config.social.linkedin].filter(Boolean);
}

export const contactLabel = (config) => (config.whatsapp ? 'Falar no WhatsApp' : 'Fale com a gente');
