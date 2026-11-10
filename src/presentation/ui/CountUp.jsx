import { useEffect, useRef } from 'react';

// Número que conta de 0 até o valor quando entra na tela. O HTML já nasce com o
// valor final (é o que o Google e quem está sem JS veem); a contagem só roda
// no navegador, uma vez, e não roda com prefers-reduced-motion.
// `prefix` (ex.: "+") e `suffix` (ex.: "%") ficam fora da contagem e não piscam.
// O número sai no formato brasileiro, com ponto no milhar (10.000).
const formatar = (n) => n.toLocaleString('pt-BR');

export default function CountUp({ value, prefix = '', suffix = '', duration = 1100, className = 'tabular' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== 'function') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return undefined;

    let quadro = 0;
    const escrever = (n) => { el.textContent = `${prefix}${formatar(n)}${suffix}`; };
    const contar = () => {
      let inicio = 0;
      const passo = (t) => {
        if (!inicio) inicio = t;
        const p = Math.min(1, (t - inicio) / duration);
        escrever(Math.round(value * (1 - (1 - p) ** 3)));
        if (p < 1) quadro = requestAnimationFrame(passo);
      };
      escrever(0);
      quadro = requestAnimationFrame(passo);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        contar();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (quadro) cancelAnimationFrame(quadro);
      escrever(value);
    };
  }, [value, prefix, suffix, duration]);

  return <span ref={ref} className={className}>{`${prefix}${formatar(value)}${suffix}`}</span>;
}
