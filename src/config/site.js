import { cities } from '../data/content/cities.js';

const FALLBACK_URL = 'https://kevinsilva121.github.io/InnovateSite';

export const site = {
  name: 'Innovate Apps Co.',
  shortName: 'Innovate Apps',
  url: (import.meta.env.VITE_SITE_URL || FALLBACK_URL).replace(/\/$/, ''),
  description:
    'Desenvolvimento de sites, sistemas web e aplicativos Android e iOS sob medida para a sua empresa.',
  whatsapp: '5512991077249', // E.164 sem "+", ex.: "5512999999999"
  email: 'innovateappsco@gmail.com',
  copyrightYear: 2026, // atualizar quando virar o ano, ou no próximo deploy
  address: { locality: 'Taubaté', region: 'SP', country: 'BR' },
  areaServed: cities,
  social: {
    instagram: 'https://www.instagram.com/innovateappsco/',
    linkedin: '',
  },
  stores: {
    play: 'https://play.google.com/store/apps/developer?id=InnovateApps+Co.',
    appStore: 'https://apps.apple.com/br/developer/kevin-silva/id6797971217',
  },
  founder: 'Kevin Silva',
};

export const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Innovate Apps e quero conversar sobre um projeto.';

export function contactHref(config, message = DEFAULT_WHATSAPP_MESSAGE) {
  if (!config.whatsapp) return '/contato/';
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function sameAsLinks(config) {
  return [config.stores.play, config.stores.appStore, config.social.instagram, config.social.linkedin].filter(Boolean);
}

export const contactLabel = (config) => (config.whatsapp ? 'Falar no WhatsApp' : 'Fale com a gente');
