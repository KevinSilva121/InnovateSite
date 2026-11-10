import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Faq.module.css';

// <details> nativo: acessível, indexável e sem JS. Título fixo à esquerda e as
// perguntas à direita; o "+" que vira "−" vem do CSS, para o texto do <summary>
// continuar sendo só a pergunta.
export default function Faq({ items, eyebrow = 'Perguntas frequentes', title = 'O que costumam nos perguntar', id = 'faq' }) {
  return (
    <Section id={id} tone="paper2">
      <div className={styles.layout}>
        <div className={styles.side}>
          <SectionHeading eyebrow={eyebrow} title={title} />
        </div>
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.summary}>{item.q}</summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
