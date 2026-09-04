import { useEffect } from 'react';

/**
 * Prende um halo de luz ao ponteiro dentro de uma seção.
 *
 * O halo fica exatamente sob o cursor, sem interpolação: a pessoa pediu o foco
 * junto do mouse, e não atrás dele.
 *
 * Aqui não existe parallax nas luzes de fundo, e a ausência é de propósito.
 * Medido com tracing, mexer duas luzes do tamanho de meia tela junto com o
 * ponteiro custava algo entre 30 e 40 ms de thread principal por segundo, porque
 * cada destino novo mantinha uma transição em curso, e transição em curso é
 * resolvida na thread principal a cada quadro. Isso disputava espaço com a
 * animação do feed do iPhone ao lado. O halo sozinho custa uma fração disso.
 *
 * O que sobra por quadro é uma escrita de transform num elemento que já é camada
 * própria: sem layout, sem repintura, e o laço morre assim que o mouse para.
 *
 * O halo é desenhado na metade do tamanho e ampliado aqui. É um gradiente: não há
 * detalhe para perder, e a textura que a GPU recompõe a cada quadro cai a um
 * quarto. O CSS declara o tamanho reduzido; a ampliação precisa vir junto do
 * deslocamento porque as duas moram na mesma propriedade.
 *
 * @param {object} areaRef  seção que captura o ponteiro
 * @param {object} haloRef  elemento que segue o cursor
 */
// Combina com o tamanho reduzido de .glowC em Hero.module.css.
const ESCALA = 2;

export function usePointerGlow(areaRef, haloRef) {
  useEffect(() => {
    const area = areaRef.current;
    const halo = haloRef.current;
    if (!area || !halo) return undefined;

    const fina = window.matchMedia?.('(pointer: fine)');
    const menosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!fina?.matches || menosMovimento?.matches) return undefined;

    let caixa = area.getBoundingClientRect();
    let ponteiroX = caixa.width * 0.72;
    let ponteiroY = caixa.height * 0.32;
    let quadro = 0;
    let escrito = '';

    // Um único quadro por lote de eventos, e nada é reagendado depois: quando o
    // mouse para, o laço para junto.
    const desenhar = () => {
      quadro = 0;
      const t = `translate3d(${ponteiroX.toFixed(1)}px, ${ponteiroY.toFixed(1)}px, 0) scale(${ESCALA})`;
      if (t === escrito) return;
      halo.style.transform = t;
      escrito = t;
    };

    const mover = (evento) => {
      ponteiroX = evento.clientX - caixa.left;
      ponteiroY = evento.clientY - caixa.top;
      if (!quadro) quadro = requestAnimationFrame(desenhar);
    };

    const acender = () => { halo.dataset.aceso = 'true'; };
    const apagar = () => { halo.dataset.aceso = 'false'; };

    // A posição da seção muda ao rolar e ao redimensionar; relemos fora do
    // pointermove para não fazer leitura de layout a cada movimento do mouse.
    const remedir = () => { caixa = area.getBoundingClientRect(); };

    desenhar();
    area.addEventListener('pointermove', mover, { passive: true });
    area.addEventListener('pointerenter', acender);
    area.addEventListener('pointerleave', apagar);
    window.addEventListener('blur', apagar);
    window.addEventListener('scroll', remedir, { passive: true });
    window.addEventListener('resize', remedir, { passive: true });

    return () => {
      area.removeEventListener('pointermove', mover);
      area.removeEventListener('pointerenter', acender);
      area.removeEventListener('pointerleave', apagar);
      window.removeEventListener('blur', apagar);
      window.removeEventListener('scroll', remedir);
      window.removeEventListener('resize', remedir);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [areaRef, haloRef]);
}
