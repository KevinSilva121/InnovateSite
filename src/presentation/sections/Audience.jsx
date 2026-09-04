import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Audience.module.css';

export default function Audience({ items }) {
  return (
    <Section id="para-quem">
      <SectionHeading eyebrow="Para quem é" title="Situações em que isso resolve" />
      <ul className={styles.grid}>
        {items.map((it) => (
          <li key={it.name} className={styles.card} data-reveal>
            <h3>{it.name}</h3>
            <p>{it.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
