import { useEffect, useRef, useState } from 'react';
import styles from './PhoneShowcase.module.css';

const base = import.meta.env.BASE_URL;

// Telas reais dos projetos, geradas por scripts/assets/showcase.mjs a partir das
// capturas do cliente. Ordem definida por ele: site da Alice, Contador, Prazzo, Trama.
// Cada arquivo sai em 360, 540 e 810 px de largura, sempre na proporção 9/19.5.
// Ao mudar o número de telas, ajuste os atrasos em PhoneShowcase.module.css.
const frames = [
  '01-advalice1',
  '02-advalice2',
  '03-contador1',
  '04-contador2',
  '05-prazzo1',
  '06-prazzo2',
  '07-prazzo3',
  '08-prazzo4',
  '09-trama1',
  '10-trama2',
  '11-trama3',
  '12-trama4',
];

// Quantas telas já vão no HTML. As outras entram depois do load: como todas
// ocupam o mesmo retângulo, o navegador considera as doze visíveis e baixaria
// tudo de uma vez, atrasando a primeira pintura.
const IMEDIATAS = 1;

export default function PhoneShowcase() {
  const [carregarResto, setCarregarResto] = useState(false);
  const palcoRef = useRef(null);

  // A pausa ao passar o mouse era feita com `.stage:hover .frame`, o que prendia
  // as doze telas ao recálculo de :hover que o navegador faz a cada movimento do
  // ponteiro na página inteira. Com um atributo, o recálculo acontece duas vezes
  // (ao entrar e ao sair) em vez de sessenta vezes por segundo.
  const pausar = (valor) => {
    if (palcoRef.current) palcoRef.current.dataset.pausado = valor ? 'true' : 'false';
  };

  useEffect(() => {
    let cancelado = false;
    const ativar = () => { if (!cancelado) setCarregarResto(true); };
    // Espera o navegador ficar ocioso: no celular, baixar as dez telas junto com a
    // primeira pintura atrasa o título, que é o maior elemento da tela.
    const agendar = () => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(ativar, { timeout: 4000 });
      else setTimeout(ativar, 2000);
    };
    if (document.readyState === 'complete') agendar();
    else window.addEventListener('load', agendar, { once: true });
    return () => {
      cancelado = true;
      window.removeEventListener('load', agendar);
    };
  }, []);

  return (
    <div
      ref={palcoRef}
      className={[styles.stage, carregarResto ? styles.rodando : ''].filter(Boolean).join(' ')}
      data-pausado="false"
      onPointerEnter={() => pausar(true)}
      onPointerLeave={() => pausar(false)}
      role="img"
      aria-label="Telas de aplicativos e sites desenvolvidos pela Innovate Apps"
    >
      <div className={styles.phone}>
        <span className={styles.island} aria-hidden="true" />
        <div className={styles.screen}>
          {/* Cada tela é uma camada do tamanho do visor: pequena o bastante para a
              GPU animar sozinha, sem depender da thread principal. */}
          {frames.map((stem, i) => {
            const mostrar = i < IMEDIATAS || carregarResto;
            return (
              <div className={styles.frame} key={stem}>
                {mostrar ? (
                  <img
                    src={`${base}showcase/${stem}-540.webp`}
                    srcSet={`${base}showcase/${stem}-360.webp 360w, ${base}showcase/${stem}-540.webp 540w, ${base}showcase/${stem}-810.webp 810w`}
                    sizes="272px"
                    alt=""
                    width="540"
                    height="1170"
                    loading={i < IMEDIATAS ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
