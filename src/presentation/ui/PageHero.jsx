import Breadcrumb from './Breadcrumb.jsx';
import styles from './PageHero.module.css';

// Cabeçalho navy das páginas internas: breadcrumb, eyebrow, H1 (único da página), lead e ações opcionais.
export default function PageHero({ id, eyebrow, title, lead, breadcrumb, children }) {
  return (
    <section className={styles.hero} aria-labelledby={id}>
      <div className="container">
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 id={id}>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children ? <div className={styles.actions}>{children}</div> : null}
      </div>
    </section>
  );
}
