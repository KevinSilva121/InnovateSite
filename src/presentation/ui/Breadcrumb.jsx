import { Link } from 'react-router';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Navegação estrutural" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((it, i) =>
          i < items.length - 1 ? (
            <li key={it.path}><Link to={it.path}>{it.name}</Link></li>
          ) : (
            <li key={it.path}><span aria-current="page">{it.name}</span></li>
          ),
        )}
      </ol>
    </nav>
  );
}
