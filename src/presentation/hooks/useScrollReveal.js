import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Animações de entrada ao rolar, em duas camadas:
//
// 1. Marcadas à mão: [data-reveal] (fade + subida) e [data-draw] (traços de SVG
//    se desenhando) recebem a classe "is-in" ao entrar na tela. Seções com
//    animação própria (cases, processo...) usam isso.
//
// 2. Automáticas, em todas as seções de todas as páginas: os blocos de cada
//    <section> do <main> (título, parágrafos, cada item de lista ou card) sobem
//    e aparecem ao entrar na tela, em cascata dentro do mesmo grupo. Só entram
//    nessa os blocos que estão ABAIXO da tela quando a página abre: o que já
//    aparece na primeira tela nunca é escondido (não atrasa a primeira pintura).
//    Blocos que já têm animação própria (camada 1) ficam de fora.
//    A animação é feita com a Web Animations API, e não com transição de CSS:
//    assim não briga com as transições que os componentes já têm (hover etc.).
//
// Sem IntersectionObserver, ou com "reduzir movimento", tudo fica visível.
// [data-rolagem]: animação presa à rolagem (useProgressoRolagem), também própria.
// [data-sem-entrada]: fica de fora de propósito (ex.: o mapa, que já nasce pronto).
const PROPRIA = '[data-reveal], [data-draw], [data-rolagem], [data-sem-entrada]';
const ATRASO = 90; // ms entre um item e o seguinte do mesmo grupo
const MAX_ATRASO = 5 * ATRASO;

// Divide uma seção em blocos animáveis: filhos diretos do container; um bloco
// que seja lista, grade ou o cabeçalho da seção é dividido nos seus itens.
function blocosDaSecao(secao) {
  const raiz = secao.querySelector(':scope > .container') ?? secao;
  const grupos = [];
  for (const bloco of raiz.children) {
    if (bloco.matches(PROPRIA) || bloco.querySelector(PROPRIA)) continue;
    const filhos = [...bloco.children].filter((f) => !f.matches('script, style, template'));
    const display = getComputedStyle(bloco).display;
    const divide = filhos.length >= 2 && (bloco.matches('ul, ol, dl') || /grid|flex/.test(display));
    grupos.push(divide ? filhos : [bloco]);
  }
  return grupos;
}

function revelar(el) {
  const atraso = Number(el.dataset.surge) || 0;
  delete el.dataset.surge;
  if (typeof el.animate !== 'function') return;
  el.animate(
    [
      { opacity: 0, translate: '0 28px' },
      { opacity: 1, translate: '0 0' },
    ],
    { duration: 800, delay: atraso, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' },
  );
}

export function useScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const semObservador = !('IntersectionObserver' in window);
    const parado = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    // Camada 1.
    const marcadas = Array.from(document.querySelectorAll('[data-reveal]:not(.is-in), [data-draw]:not(.is-in)'));
    if (semObservador) {
      marcadas.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    marcadas.forEach((el) => io.observe(el));

    // Camada 2.
    let auto = null;
    if (!parado) {
      const alturaTela = window.innerHeight;
      const alvos = [];
      for (const secao of document.querySelectorAll('main section')) {
        for (const grupo of blocosDaSecao(secao)) {
          let i = 0;
          for (const el of grupo) {
            if (el.getBoundingClientRect().top < alturaTela) continue; // já na tela: fica como está
            el.dataset.surge = String(Math.min(i * ATRASO, MAX_ATRASO));
            alvos.push(el);
            i += 1;
          }
        }
      }
      if (alvos.length) {
        auto = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                revelar(e.target);
                auto.unobserve(e.target);
              }
            }
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
        );
        alvos.forEach((el) => auto.observe(el));
      }
    }

    return () => {
      io.disconnect();
      auto?.disconnect();
      // Ao trocar de página, nada fica escondido para trás.
      document.querySelectorAll('[data-surge]').forEach((el) => delete el.dataset.surge);
    };
  }, [pathname]);
}
