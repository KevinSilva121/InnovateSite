import { cities } from '../data/content/cities.js';

const FALLBACK_URL = 'https://kevinsilva121.github.io/InnovateSite';

export const site = {
  name: 'Innovate Apps Co.',
  shortName: 'Innovate Apps',
  url: (import.meta.env.VITE_SITE_URL || FALLBACK_URL).replace(/\/$/, ''),
  description:
    'Desenvolvimento de sites, sistemas web e aplicativos Android e iOS em Taubaté, SP, para empresas do Vale do Paraíba.',
  whatsapp: '', // E.164 sem "+", ex.: "5512999999999"
  email: '',
  address: { locality: 'Taubaté', region: 'SP', country: 'BR' },
  areaServed: cities,
  social: {
    instagram: '',
    linkedin: '',
    github: 'https://github.com/kevinsilva121',
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
  return [config.stores.play, config.stores.appStore, config.social.github, config.social.instagram, config.social.linkedin].filter(Boolean);
}
