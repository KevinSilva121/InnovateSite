import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { appCases } from '../../data/content/cases.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import StoreBadges from '../ui/StoreBadges.jsx';
import { PhoneFrame } from '../ui/DeviceFrame.jsx';
import { AppScreen, hasScreens } from '../ui/Screen.jsx';
import styles from './AppsShowcase.module.css';

// Telas de um app. No desktop: os iPhones lado a lado, o do meio (a tela
// principal) um pouco mais alto. No celular: um iPhone por vez, que se arrasta
// para o lado (rolagem com encaixe), começando pela tela principal, com setas
// dos lados e pontos embaixo mostrando em qual tela está.
// É a mesma lista nos dois casos, só rearranjada pelo CSS: nenhuma imagem a mais.
function Telas({ app, telas }) {
  const ref = useRef(null);
  const [atual, setAtual] = useState(0);
  const [mexeu, setMexeu] = useState(false);
  const total = telas.length;

  // Distância de uma tela para a próxima (largura do iPhone + espaço entre eles).
  const passo = () => {
    const el = ref.current;
    const celular = el?.querySelector(`.${styles.phone}`);
    if (!el || !celular) return 0;
    return celular.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      const p = passo();
      if (!p) return;
      setAtual(Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / p))));
      if (el.scrollLeft > 4) setMexeu(true);
    };
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(medir); };
    el.addEventListener('scroll', agendar, { passive: true });
    return () => {
      el.removeEventListener('scroll', agendar);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [total]);

  const ir = (direcao) => {
    setMexeu(true);
    ref.current?.scrollBy({ left: direcao * passo(), behavior: 'smooth' });
  };

  return (
    <div className={styles.galeria} data-mexeu={mexeu ? '' : undefined}>
      <div className={styles.stage} ref={ref} data-reveal data-telas={total}>
        {telas.map((t) => (
          <PhoneFrame key={t.id} className={styles.phone}>
            <AppScreen app={app.slug} id={t.id} alt={t.alt} />
          </PhoneFrame>
        ))}
      </div>
      {total > 1 ? (
        <>
          <button type="button" className={styles.seta} data-lado="anterior" aria-label={`Tela anterior do ${app.title}`} hidden={atual === 0} onClick={() => ir(-1)}>
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button type="button" className={styles.seta} data-lado="proxima" aria-label={`Próxima tela do ${app.title}`} hidden={atual >= total - 1} onClick={() => ir(1)}>
            <ChevronRight size={22} aria-hidden="true" />
          </button>
          <div className={styles.pontos} aria-hidden="true">
            {telas.map((t, i) => <span key={t.id} data-ativo={i === atual ? '' : undefined} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}

// Apps publicados em formato de case: à esquerda o produto (ícone, nome,
// etiqueta mono na cor dele, descrição, plataformas e lojas); à direita, as telas
// reais em molduras de celular sobre um painel na cor do produto. Os lados
// alternam a cada app.
export default function AppsShowcase({
  apps,
  id = 'apps',
  tone = 'navy',
  eyebrow = 'Apps publicados',
  title = 'Produtos nossos, no ar nas duas lojas',
  lead = 'Cada um nasceu de um problema real de quem trabalha. É o mesmo processo que usamos nos projetos de clientes.',
}) {
  return (
    <Section id={id} tone={tone} className={styles[tone]}>
      <SectionHeading layout="split" eyebrow={eyebrow} title={title} lead={lead} />
      <div className={styles.cases}>
        {apps.map((app, i) => {
          const visual = appCases[app.slug];
          const telas = visual && hasScreens(app.slug) ? visual.telas : [];
          return (
            <article
              key={app.slug}
              className={[styles.case, i % 2 ? styles.reverse : ''].filter(Boolean).join(' ')}
              style={visual ? { '--case': visual.cor, '--case-ink': visual.tinta } : undefined}
            >
              <div className={styles.info} data-reveal>
                <div className={styles.head}>
                  <img src={app.icon} alt="" width="72" height="72" loading="lazy" className={styles.icon} />
                  <h3>{app.title}</h3>
                </div>
                <p className={styles.category}>{app.category}</p>
                <p className={styles.tagline}>{app.tagline}</p>
                <ul className={styles.platforms} aria-label="Plataformas">
                  {app.platforms.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <StoreBadges name={app.title} stores={app.stores} size="sm" />
              </div>
              {telas.length ? <Telas app={app} telas={telas} /> : null}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
