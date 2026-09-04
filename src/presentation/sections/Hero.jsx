import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import Button from '../ui/Button.jsx';
import styles from './Hero.module.css';

export default function Hero({ apps }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.copy}>
          <p className="eyebrow">Taubaté – SP · Vale do Paraíba</p>
          <h1 id="hero-title">
            Sites, sistemas e <span className={styles.accent}>aplicativos</span> para empresas do Vale do Paraíba
          </h1>
          <p className={styles.lead}>
            Somos uma empresa de tecnologia de Taubaté. Desenvolvemos o site, o sistema web e o app que a sua
            empresa precisa — e já publicamos os nossos na Google Play e na App Store.
          </p>
          <div className={styles.actions}>
            <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
            <Button href="/#apps" variant="onNavy" size="lg">Ver apps publicados</Button>
          </div>
          <p className={styles.proof}>
            <strong className="tabular">{apps.length} apps</strong> publicados nas duas lojas · atendimento presencial no Vale e remoto no Brasil
          </p>
        </div>

        <ul className={styles.cluster} aria-label="Apps desenvolvidos pela Innovate Apps">
          {apps.map((app, i) => (
            <li key={app.slug} className={styles.tile} data-index={i}>
              <img src={app.icon} alt={`Ícone do app ${app.title}`} width="72" height="72" loading={i < 2 ? 'eager' : 'lazy'} />
              <span className={styles.tileName}>{app.title}</span>
              <span className={styles.tileMeta}>{app.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
