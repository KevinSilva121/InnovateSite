import styles from './SectionHeading.module.css';

// Cabeçalho de seção. Três arranjos, para as seções não repetirem o mesmo
// empilhado (etiqueta + título + parágrafo) uma atrás da outra:
//   stack  empilhado (padrão)
//   split  título grande à esquerda, etiqueta e parágrafo numa coluna à direita
//   rule   etiqueta numa linha de régua acima de um título largo
// A ordem no HTML é sempre etiqueta, título, parágrafo (é como se lê no celular);
// o arranjo "split" reposiciona no desktop com áreas de grid.
// compacto: o título e o espaço abaixo dele acompanham a altura da tela, para
// seções que precisam caber inteiras numa tela.
export default function SectionHeading({ eyebrow, title, lead, as: Tag = 'h2', align = 'start', layout = 'stack', compacto = false, id }) {
  const cls = [styles.heading, styles[layout], align === 'center' ? styles.center : '', compacto ? styles.compacto : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {eyebrow ? <p className={['eyebrow', styles.eyebrow].join(' ')}>{eyebrow}</p> : null}
      <Tag id={id} className={styles.title}>{title}</Tag>
      {lead ? <p className={['lede', styles.lead].join(' ')}>{lead}</p> : null}
    </div>
  );
}
