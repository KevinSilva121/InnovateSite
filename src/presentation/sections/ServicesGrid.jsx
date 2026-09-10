import { ArrowRight, Check } from 'lucide-react';
import { services } from '../../data/content/services.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import styles from './ServicesGrid.module.css';

export default function ServicesGrid() {
  return (
    <Section id="servicos">
      <SectionHeading
        eyebrow="O que fazemos"
        title="Três frentes, um mesmo jeito de trabalhar"
        lead="Escopo por escrito, entregas frequentes e o código é seu no final. Escolha por onde começar."
      />
      <div className={styles.grid}>
        {services.map((s) => (
          <article key={s.slug} className={styles.card} data-reveal>
            <h3>{s.name}</h3>
            <p className={styles.summary}>{s.summary}</p>
            <ul className={styles.bullets}>
              {s.bullets.map((b) => (
                <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
              ))}
            </ul>
            <Button href={s.path} variant="ghost" icon={ArrowRight}>Ver {s.shortName.toLowerCase()}</Button>
          </article>
        ))}
      </div>
    </Section>
  );
}
