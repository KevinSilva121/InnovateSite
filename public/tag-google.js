// Ferramentas do Google (Google Ads e Google Analytics 4), carregadas como
// arquivo do próprio site.
//
// Os snippets que o Google entrega vêm com um <script> de código embutido no
// HTML. A CSP do site não aceita isso (script-src sem 'unsafe-inline'), então o
// mesmo código mora aqui. Os ids chegam por atributos, que o prerender escreve a
// partir de src/config/site.js:
//   data-id         contêiner do Tag Manager criado pelo Google Ads (GTM-...)
//   data-analytics  Google Analytics 4 (G-...)
//
// Consentimento (LGPD): até a pessoa aceitar no aviso de cookies, nada grava
// cookie de análise ou de anúncio; o Google recebe só sinais anônimos, que usa
// para estimar visitas e conversões. A escolha fica em localStorage, na chave
// 'consentimento-cookies' (a mesma de CONSENT_KEY em src/config/site.js).
(function () {
  var este = document.currentScript;
  var conteiner = este && este.getAttribute('data-id');
  var analytics = este && este.getAttribute('data-analytics');
  if (!conteiner && !analytics) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var escolha = null;
  try {
    escolha = window.localStorage.getItem('consentimento-cookies');
  } catch (e) {
    // Navegador com armazenamento bloqueado: segue como "não aceito".
  }
  var estado = escolha === 'aceito' ? 'granted' : 'denied';
  gtag('consent', 'default', {
    ad_storage: estado,
    ad_user_data: estado,
    ad_personalization: estado,
    analytics_storage: estado,
  });

  gtag('js', new Date());

  function carregar(src) {
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = src;
    document.head.appendChild(tag);
  }

  if (analytics) {
    gtag('config', analytics);
    carregar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(analytics));
  }
  if (conteiner) {
    carregar('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(conteiner));
  }
})();
