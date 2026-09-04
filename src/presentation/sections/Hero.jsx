import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import Button from '../ui/Button.jsx';
import PhoneShowcase from '../ui/PhoneShowcase.jsx';
import styles from './Hero.module.css';

export default function Hero({ apps }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Fundo: dois halos desfocados que se movem devagar, para o navy não ficar chapado. */}
      <span className={styles.glowA} aria-hidden="true" />
      <span className={styles.glowB} aria-hidden="true" />

      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.copy}>
          <p className="eyebrow">Desenvolvimento de software sob medida</p>
          <h1 id="hero-title">
            Sites, sistemas e <span className={styles.accent}>aplicativos</span> sob medida para a sua empresa
          </h1>
          <p className={styles.lead}>
            Desenvolvemos o site, o sistema web e o app que a sua empresa precisa, do primeiro rascunho à
            publicação — e já publicamos os nossos na Google Play e na App Store.
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
