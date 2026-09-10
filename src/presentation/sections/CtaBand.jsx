import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import styles from './CtaBand.module.css';

export default function CtaBand({
  title = 'Vamos conversar sobre o seu projeto?',
  text = 'Conte o que a sua empresa precisa. Em uma conversa curta a gente já consegue dizer por onde começar, quanto tempo leva e uma faixa de investimento.',
}) {
  return (
    <Section tone="navy" className={styles.band}>
      <div className={styles.inner}>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className={styles.actions}>
          <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
          <Button href="/contato/" variant="onNavy" size="lg">Ver formas de contato</Button>
        </div>
      </div>
    </Section>
  );
}
