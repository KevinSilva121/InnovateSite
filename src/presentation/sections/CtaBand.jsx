import { site, contactHref, contactLabel } from '../../config/site.js';
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import styles from './CtaBand.module.css';

// Chamada final: bloco inteiro em azul, título grande à esquerda, texto e
// botões à direita.
export default function CtaBand({
  title = 'Vamos conversar sobre o seu projeto?',
  text = 'Conte o que a sua empresa precisa. Em uma conversa curta a gente já consegue dizer por onde começar, quanto tempo leva e uma faixa de investimento.',
}) {
  return (
    <Section tone="blue" className={styles.band}>
      <div className={styles.inner}>
        <h2>{title}</h2>
        <div className={styles.side}>
          <p>{text}</p>
          <div className={styles.actions}>
            <Button href={contactHref(site)} variant="light" size="lg">{contactLabel(site)}</Button>
            <Button href="/contato/" variant="onBlue" size="lg">Ver formas de contato</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
