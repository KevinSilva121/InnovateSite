import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Deliverables.module.css';

export default function Deliverables({ items }) {
  return (
    <Section id="entregamos" tone="paper2">
      <SectionHeading eyebrow="O que entregamos" title="O que está incluído" />
      <dl className={styles.list}>
        {items.map((it, i) => (
          <div key={it.title} className={styles.row} data-reveal>
            <span className={styles.index} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <dt>{it.title}</dt>
            <dd>{it.text}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
