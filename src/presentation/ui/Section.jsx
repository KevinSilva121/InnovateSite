import styles from './Section.module.css';

// cabe: no desktop a seção inteira cabe na altura da tela (o respiro em cima e
// embaixo acompanha a altura, e não a largura).
export default function Section({ id, tone = 'paper', cabe = false, className = '', children, ...rest }) {
  return (
    <section id={id} className={[styles.section, styles[tone], cabe ? styles.cabe : '', className].filter(Boolean).join(' ')} {...rest}>
      <div className="container">{children}</div>
    </section>
  );
}
