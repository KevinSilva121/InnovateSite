import { site } from '../../config/site.js';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './TrustStrip.module.css';

export default function TrustStrip({ appCount }) {
  return (
    <section className={styles.strip} aria-label="Prova de publicação nas lojas">
      <div className={['container', styles.row].join(' ')}>
        <div className={styles.text}>
          <p className={styles.title}>Publicados na Google Play e na App Store</p>
          <p className={styles.sub}>Produtos nossos, no ar, com usuários reais. O mesmo cuidado vai para o seu projeto.</p>
        </div>
        <StoreBadges name="Innovate Apps" stores={site.stores} />
        <dl className={styles.stats}>
          <div><dt>apps publicados</dt><dd className="tabular">{appCount}</dd></div>
          <div><dt>lojas</dt><dd className="tabular">2</dd></div>
          <div><dt>sede</dt><dd>Taubaté – SP</dd></div>
        </dl>
      </div>
    </section>
  );
}
