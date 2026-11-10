import { site } from '../../config/site.js';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './AppsBand.module.css';

// Faixa azul logo abaixo do hero: o texto de prova (que antes ficava na faixa de
// confiança) e os selos das lojas, com os links. A esteira com os ícones dos apps
// fica no pé do hero (ui/AppsTicker.jsx), para aparecer já na primeira tela.
export default function AppsBand() {
  return (
    <section className={styles.band} aria-label="Prova de publicação nas lojas">
      <div className={['container', styles.row].join(' ')}>
        <div className={styles.text}>
          <p className={styles.title}>Publicados na Google Play e na App Store</p>
          <p className={styles.sub}>Produtos nossos, no ar, com usuários reais. O mesmo cuidado vai para o seu projeto.</p>
        </div>
        <StoreBadges name="Innovate Apps" stores={site.stores} />
      </div>
    </section>
  );
}
