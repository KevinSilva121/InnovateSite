import { useEffect, useRef } from 'react';
import { heroFundo } from '../../config/heroFundo.js';
import styles from './HeroBackground.module.css';

// Fundo do hero: vídeo em loop (arquivos e motivos em src/config/heroFundo.js).
//
// - O HTML já traz a capa (primeiro quadro do loop, 3 KB), então o hero nasce
//   pintado. O vídeo não está no HTML: só começa a baixar depois que a página
//   terminou de carregar e o navegador ficou livre, para não disputar rede nem
//   processamento com o texto, as fontes e o JS.
// - Celular em pé baixa o recorte vertical, mais leve; o resto, o deitado.
// - WebM primeiro, MP4 de reserva. Se o aparelho só toca WebM em software (sem
//   decodificação em hardware: aparelho antigo ou fraco), vai direto para o MP4.
// - Fica só a capa com "reduzir movimento", economia de dados ou conexão 2G.
// - Pausa fora da tela e com a aba em segundo plano.

// Abaixo desta proporção (celular em pé) usa o recorte vertical.
const TELA_VERTICAL = '(max-aspect-ratio: 3/5)';

export function deveFicarParado(janela = window) {
  if (janela.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return true;
  const conexao = janela.navigator?.connection;
  return Boolean(conexao?.saveData || /2g$/.test(conexao?.effectiveType || ''));
}

// Ordem final das fontes. Sem a API de capacidades, fica a ordem da config e o
// navegador pega a primeira que sabe tocar.
export async function escolherFontes(formato, capacidades = globalThis.navigator?.mediaCapabilities) {
  const [principal, ...reservas] = formato.fontes;
  try {
    const info = await capacidades?.decodingInfo?.({
      type: 'file',
      video: { contentType: principal.tipo, width: formato.largura, height: formato.altura, bitrate: 400000, framerate: 30 },
    });
    if (info && (!info.supported || !info.powerEfficient)) return reservas;
  } catch {
    /* navegador sem suporte à consulta: segue a ordem da config */
  }
  return formato.fontes;
}

export default function HeroBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof video.play !== 'function' || deveFicarParado()) return undefined;

    let cancelado = false;
    let pronto = false;
    let naTela = true;
    let espera = 0;

    const tocar = () => {
      if (!pronto || !naTela || document.hidden) return;
      video.play()?.catch?.(() => {});
    };
    const pausar = () => { if (!video.paused) video.pause(); };

    const iniciar = async () => {
      const vertical = Boolean(window.matchMedia?.(TELA_VERTICAL)?.matches);
      const formato = vertical ? heroFundo.vertical : heroFundo.horizontal;
      const fontes = await escolherFontes(formato);
      if (cancelado) return;
      for (const fonte of fontes) {
        const source = document.createElement('source');
        source.src = fonte.src;
        source.type = fonte.tipo;
        video.append(source);
      }
      video.muted = true; // exigido para tocar sozinho
      video.preload = 'auto';
      pronto = true;
      video.load();
      tocar();
    };

    const depoisDaPagina = () => {
      const ocioso = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 300));
      espera = ocioso(() => { if (!cancelado) iniciar(); }, { timeout: 3000 });
    };
    if (document.readyState === 'complete') depoisDaPagina();
    else window.addEventListener('load', depoisDaPagina, { once: true });

    const observador = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([e]) => { naTela = e.isIntersecting; if (naTela) tocar(); else pausar(); })
      : null;
    observador?.observe(video);
    const aba = () => { if (document.hidden) pausar(); else tocar(); };
    document.addEventListener('visibilitychange', aba);

    return () => {
      cancelado = true;
      window.removeEventListener('load', depoisDaPagina);
      (window.cancelIdleCallback ?? clearTimeout)(espera);
      observador?.disconnect();
      document.removeEventListener('visibilitychange', aba);
      pausar();
    };
  }, []);

  return (
    <div className={styles.fundo} aria-hidden="true" style={{ '--grao': heroFundo.grao }}>
      <video
        ref={ref}
        className={styles.video}
        poster={heroFundo.capa}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      />
    </div>
  );
}
