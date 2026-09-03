import styles from './Section.module.css';

export default function Section({ id, tone = 'paper', className = '', children, ...rest }) {
  return (
    <section id={id} className={[styles.section, styles[tone], className].filter(Boolean).join(' ')} {...rest}>
      <div className="container">{children}</div>
    </section>
  );
}
