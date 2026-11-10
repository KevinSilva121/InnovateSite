import { useEffect } from 'react';

// Progresso (0 a 1) de um elemento conforme a página rola, escrito em --p no
// próprio elemento a cada quadro de rolagem. Direto no DOM, sem estado do React:
// nada renderiza de novo enquanto a página rola.
//
// O progresso começa quando o topo do elemento passa pela linha `marcador`
// (fração da altura da tela, de cima para baixo) e anda uma distância de
// rolagem igual ao maior entre `faixa` × altura da tela e `porAltura` × a altura
// do próprio elemento. Assim, um bloco baixo completa num trecho fixo de
// rolagem, e uma lista alta (passos em coluna no celular) acompanha a leitura.
//
// Marca também data-completo (progresso em 1) e data-ativo (perto da tela), para
// o CSS ligar animações de repouso só quando faz sentido.
//
// Suavidade: o valor mostrado não pula para a posição da rolagem; ele a persegue
// com um leve atraso (aproximação exponencial, `suavidade` em segundos). A roda
// do mouse anda aos saltos (~100 px por clique) e, sem isso, as peças saltariam
// junto; com isso, cada salto vira um deslizar contínuo que assenta sozinho.
//
// Com "reduzir movimento", fica em 1. Sem JS, o CSS deve usar 1 como padrão.
export function useProgressoRolagem(ref, { marcador = 0.95, faixa = 0.6, porAltura = 0, suavidade = 0.28 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const marcar = (p) => {
      el.style.setProperty('--p', p.toFixed(4));
      if (p >= 0.999) el.dataset.completo = '';
      else delete el.dataset.completo;
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      marcar(1);
      return undefined;
    }

    const alvoAgora = () => {
      const caixa = el.getBoundingClientRect();
      const h = window.innerHeight;
      const distancia = Math.max(h * faixa, caixa.height * porAltura, 1);
      return Math.min(1, Math.max(0, (h * marcador - caixa.top) / distancia));
    };
    let atual = alvoAgora();
    let ultimo = 0;
    let quadro = 0;
    marcar(atual);

    // Um quadro da perseguição: chega mais perto do alvo e, se ainda falta,
    // agenda o próximo. Parado (alvo alcançado), não gasta nada.
    const passo = (agora) => {
      quadro = 0;
      const alvo = alvoAgora();
      const dt = ultimo ? Math.min(0.1, (agora - ultimo) / 1000) : 1 / 60;
      ultimo = agora;
      atual += (alvo - atual) * (1 - Math.exp(-dt / suavidade));
      if (Math.abs(alvo - atual) < 0.0008) atual = alvo;
      marcar(atual);
      if (atual !== alvo) quadro = requestAnimationFrame(passo);
      else ultimo = 0;
    };
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(passo); };
    // Fora da área de interesse: vai direto ao estado final, sem perseguir.
    const medir = () => {
      if (quadro) cancelAnimationFrame(quadro);
      quadro = 0;
      ultimo = 0;
      atual = alvoAgora();
      marcar(atual);
    };

    // Só acompanha a rolagem enquanto o elemento está perto da tela.
    let ouvindo = false;
    const ouvir = (sim) => {
      if (sim === ouvindo) return;
      ouvindo = sim;
      if (sim) {
        window.addEventListener('scroll', agendar, { passive: true });
        window.addEventListener('resize', agendar);
        agendar();
      } else {
        window.removeEventListener('scroll', agendar);
        window.removeEventListener('resize', agendar);
        medir(); // fixa o estado final (completo acima, zerado abaixo)
      }
    };
    const perto = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([e]) => {
        ouvir(e.isIntersecting);
        if (e.isIntersecting) el.dataset.ativo = '';
        else delete el.dataset.ativo;
      }, { rootMargin: '20% 0px 20% 0px' })
      : null;
    if (perto) perto.observe(el);
    else ouvir(true);

    return () => {
      perto?.disconnect();
      ouvir(false);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [ref, marcador, faixa, porAltura, suavidade]);
}
