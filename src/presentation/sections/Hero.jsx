import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import Button from '../ui/Button.jsx';
import PhoneShowcase from '../ui/PhoneShowcase.jsx';
import { usePointerGlow } from '../hooks/usePointerGlow.js';
import styles from './Hero.module.css';

export default function Hero({ apps }) {
  const secaoRef = useRef(null);
  const haloRef = useRef(null);
  usePointerGlow(secaoRef, haloRef);

  return (
    <section className={styles.hero} aria-labelledby="hero-title" ref={secaoRef}>
      {/* Fundo em três luzes: duas que vagam sozinhas, no compositor, e uma
          terceira presa ao cursor. */}
      <span className={styles.glowA} aria-hidden="true" />
      <span className={styles.glowB} aria-hidden="true" />
      <span className={styles.glowC} aria-hidden="true" data-aceso="false" ref={haloRef} />

      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.copy}>
          <p className="eyebrow">Desenvolvimento de software sob medida</p>
          <h1 id="hero-title">
            Sites, sistemas e <span className={styles.accent}>aplicativos</span> sob medida para a sua empresa
          </h1>
          <p className={styles.lead}>
            Seu site atraindo cliente, seu sistema organizando a operação e seu app na mão de
            quem importa. A gente constrói, coloca no ar e continua junto depois.
          </p>
          <div className={styles.actions}>
            <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
            <Button href="/#apps" variant="onNavy" size="lg">Ver apps publicados</Button>
          </div>
          <p className={styles.proof}>
            <strong className="tabular">{apps.length} apps</strong> publicados nas duas lojas · atendimento em todo o Brasil
          </p>
        </div>

        <PhoneShowcase />
      </div>
    </section>
  );
}
