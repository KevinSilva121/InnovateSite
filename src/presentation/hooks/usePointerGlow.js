import { useEffect } from 'react';

// Prende um halo ao ponteiro dentro de uma área.
// Escreve direto em style.transform (composto pela GPU) em vez de propriedades que
// forcem recálculo de layout. O requestAnimationFrame só junta vários eventos do
// mesmo quadro: a posição é a do cursor, sem interpolação nem atraso.
export function usePointerGlow(areaRef, glowRef) {
  useEffect(() => {
    const area = areaRef.current;
    const glow = glowRef.current;
    if (!area || !glow) return undefined;

    const fina = window.matchMedia?.('(pointer: fine)');
    const menosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!fina?.matches || menosMovimento?.matches) return undefined;

    let caixa = area.getBoundingClientRect();
    let x = caixa.width * 0.72;
    let y = caixa.height * 0.32;
    let quadro = 0;
    let agendado = false;

    const desenhar = () => {
      agendado = false;
      glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };

    const mover = (evento) => {
      x = evento.clientX - caixa.left;
      y = evento.clientY - caixa.top;
      if (!agendado) {
        agendado = true;
        quadro = requestAnimationFrame(desenhar);
      }
    };

    // A posição da seção muda ao rolar e ao redimensionar; relemos fora do
    // pointermove para não fazer leitura de layout a cada movimento do mouse.
    const remedir = () => { caixa = area.getBoundingClientRect(); };

    desenhar();
    area.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('scroll', remedir, { passive: true });
    window.addEventListener('resize', remedir, { passive: true });

    return () => {
      area.removeEventListener('pointermove', mover);
      window.removeEventListener('scroll', remedir);
      window.removeEventListener('resize', remedir);
      cancelAnimationFrame(quadro);
    };
  }, [areaRef, glowRef]);
}
