import { useEffect } from 'react';

/**
 * Liga o fundo do hero ao ponteiro.
 *
 * - O halo principal fica exatamente sob o cursor, sem interpolação.
 * - As camadas de fundo deslocam no sentido contrário, com inércia própria: é o
 *   atraso entre os planos que cria a sensação de profundidade.
 * - Tudo é escrito em style.transform, composto pela GPU, sem tocar em layout.
 *
 * @param {object} areaRef  seção que captura o ponteiro
 * @param {object} haloRef  elemento que segue o cursor
 * @param {Array<{ref: object, forca: number}>} camadas  fundos com parallax;
 *   `forca` em pixels, sinais opostos afastam os planos entre si
 */
export function usePointerGlow(areaRef, haloRef, camadas = []) {
  useEffect(() => {
    const area = areaRef.current;
    const halo = haloRef.current;
    if (!area || !halo) return undefined;

    const fina = window.matchMedia?.('(pointer: fine)');
    const menosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!fina?.matches || menosMovimento?.matches) return undefined;

    const planos = camadas
      .map(({ ref, forca }) => ({ el: ref.current, forca, x: 0, y: 0 }))
      .filter((p) => p.el);

    let caixa = area.getBoundingClientRect();
    let ponteiroX = caixa.width * 0.72;
    let ponteiroY = caixa.height * 0.32;
    let quadro = 0;
    let rodando = false;

    const desenhar = () => {
      halo.style.transform = `translate3d(${ponteiroX.toFixed(1)}px, ${ponteiroY.toFixed(1)}px, 0)`;

      // Posição do cursor de -1 a 1 a partir do centro da seção.
      const nx = caixa.width ? (ponteiroX / caixa.width - 0.5) * 2 : 0;
      const ny = caixa.height ? (ponteiroY / caixa.height - 0.5) * 2 : 0;

      let faltando = false;
      for (const plano of planos) {
        const alvoX = -nx * plano.forca;
        const alvoY = -ny * plano.forca;
        plano.x += (alvoX - plano.x) * 0.06;
        plano.y += (alvoY - plano.y) * 0.06;
        plano.el.style.transform = `translate3d(${plano.x.toFixed(2)}px, ${plano.y.toFixed(2)}px, 0)`;
        if (Math.abs(alvoX - plano.x) > 0.1 || Math.abs(alvoY - plano.y) > 0.1) faltando = true;
      }

      if (faltando) {
        quadro = requestAnimationFrame(desenhar);
      } else {
        rodando = false;
      }
    };

    const agendar = () => {
      if (rodando) return;
      rodando = true;
      quadro = requestAnimationFrame(desenhar);
    };

    const mover = (evento) => {
      ponteiroX = evento.clientX - caixa.left;
      ponteiroY = evento.clientY - caixa.top;
      // O halo acompanha no quadro seguinte; os planos continuam convergindo.
      agendar();
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
      cancelAnimationFrame(quadro);
    };
  }, [areaRef, haloRef, camadas]);
}
