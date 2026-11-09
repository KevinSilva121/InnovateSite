import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { CONSENT_KEY } from '../../src/config/site.js';

// Executa public/tag-google.js de verdade, como o navegador faria, com um
// <script data-id> fazendo o papel de document.currentScript.
const codigo = readFileSync('public/tag-google.js', 'utf8');

function executar(id = 'GTM-TESTE', analytics = '') {
  const proprio = document.createElement('script');
  if (id) proprio.setAttribute('data-id', id);
  if (analytics) proprio.setAttribute('data-analytics', analytics);
  Object.defineProperty(document, 'currentScript', { value: proprio, configurable: true });
  new Function(codigo)();
}

const comandos = () => window.dataLayer.map((args) => Array.from(args));

describe('public/tag-google.js', () => {
  beforeEach(() => {
    delete window.dataLayer;
    delete window.gtag;
    window.localStorage.clear();
    document.head.innerHTML = '';
  });
  afterEach(() => {
    delete document.currentScript;
  });

  it('reads the same storage key the consent banner writes', () => {
    expect(codigo).toContain(`'${CONSENT_KEY}'`);
  });

  it('starts with consent denied, then loads the container from googletagmanager.com', () => {
    executar('GTM-P2BGH4B5');
    const [consent, js] = comandos();
    expect(consent).toEqual(['consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
    }]);
    expect(js[0]).toBe('js');
    expect(typeof window.gtag).toBe('function');
    const carregado = document.head.querySelector('script[src^="https://www.googletagmanager.com/"]');
    expect(carregado.src).toBe('https://www.googletagmanager.com/gtm.js?id=GTM-P2BGH4B5');
    expect(carregado.async).toBe(true);
  });

  it('remembers an earlier acceptance', () => {
    window.localStorage.setItem(CONSENT_KEY, 'aceito');
    executar();
    expect(comandos()[0][2].analytics_storage).toBe('granted');
    expect(comandos()[0][2].ad_storage).toBe('granted');
  });

  it('configures Google Analytics with the same dataLayer and consent, and loads both tools', () => {
    executar('GTM-P2BGH4B5', 'G-4QRX8269FX');
    const lista = comandos();
    expect(lista[0][0]).toBe('consent');
    expect(lista.find((c) => c[0] === 'config')).toEqual(['config', 'G-4QRX8269FX']);
    const srcs = [...document.head.querySelectorAll('script')].map((s) => s.src);
    expect(srcs).toEqual([
      'https://www.googletagmanager.com/gtag/js?id=G-4QRX8269FX',
      'https://www.googletagmanager.com/gtm.js?id=GTM-P2BGH4B5',
    ]);
  });

  it('works with Analytics alone', () => {
    executar('', 'G-4QRX8269FX');
    expect(document.head.querySelectorAll('script')).toHaveLength(1);
    expect(comandos().find((c) => c[0] === 'config')).toEqual(['config', 'G-4QRX8269FX']);
  });

  it('does nothing without any id', () => {
    executar('');
    expect(window.dataLayer).toBeUndefined();
    expect(document.head.querySelector('script')).toBeNull();
  });
});
