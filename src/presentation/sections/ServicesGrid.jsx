import { services } from '../../data/content/services.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import ServiceArt from '../ui/ServiceArt.jsx';
import styles from './ServicesGrid.module.css';

// Três blocos sem cartão: ilustração isométrica, título, resumo e tópicos,
// separados por réguas finas. Sem numeração, por decisão anterior.
export default function ServicesGrid() {
  return (
    <Section id="servicos" cabe>
      <SectionHeading
        compacto
        layout="split"
        eyebrow="O que fazemos"
        title="Três frentes, um mesmo jeito de trabalhar"
        lead="Desenvolvimento de software sob medida: criação de sites, sistemas web e aplicativos. Escopo por escrito, entregas frequentes e o código é seu no final."
      />
      <div className={styles.grid}>
        {services.map((s) => (
          <article key={s.slug} className={styles.block} data-reveal>
            <div className={styles.art}><ServiceArt kind={s.slug} /></div>
            <h3>{s.name}</h3>
            <p className={styles.summary}>{s.summary}</p>
            <ul className={styles.bullets}>
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <Button href={s.path} variant="ghost">Ver {s.shortName.toLowerCase()}</Button>
          </article>
        ))}
      </div>
    </Section>
  );
}
