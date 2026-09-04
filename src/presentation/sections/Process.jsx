import { processSteps } from '../../data/content/process.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Process.module.css';

export default function Process() {
  return (
    <Section id="como-funciona" tone="paper2">
      <SectionHeading eyebrow="Como funciona" title="Do primeiro contato à entrega, sem surpresa" />
      <ol className={styles.steps}>
        {processSteps.map((step) => (
          <li key={step.number} className={styles.step} data-reveal>
            <span className={styles.number} aria-hidden="true">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
