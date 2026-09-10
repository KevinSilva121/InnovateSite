import Breadcrumb from './Breadcrumb.jsx';
import styles from './PageHero.module.css';

// Cabeçalho navy das páginas internas: breadcrumb, eyebrow, H1 (único da página),
// linha de apoio opcional (`meta`, usada pelos artigos), lead e ações.
export default function PageHero({ id, eyebrow, title, meta, lead, breadcrumb, children }) {
  return (
    <section className={styles.hero} aria-labelledby={id}>
      <div className="container">
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 id={id}>{title}</h1>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children ? <div className={styles.actions}>{children}</div> : null}
      </div>
    </section>
  );
}
