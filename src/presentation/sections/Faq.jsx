import { ChevronDown } from 'lucide-react';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Faq.module.css';

// <details> nativo: acessível, indexável e sem JS. A primeira pergunta abre para mostrar o padrão.
export default function Faq({ items, eyebrow = 'Perguntas frequentes', title = 'O que costumam nos perguntar', id = 'faq' }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className={styles.list}>
        {items.map((item, i) => (
          <details key={item.q} className={styles.item} open={i === 0 || undefined}>
            <summary className={styles.summary}>
              {item.q}
              <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
            </summary>
            <p className={styles.answer}>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
