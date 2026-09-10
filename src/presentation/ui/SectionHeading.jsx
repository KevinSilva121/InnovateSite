import styles from './SectionHeading.module.css';

export default function SectionHeading({ eyebrow, title, lead, as: Tag = 'h2', align = 'start', id }) {
  return (
    <div className={[styles.heading, align === 'center' ? styles.center : ''].join(' ')}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag id={id}>{title}</Tag>
      {lead ? <p className="lede">{lead}</p> : null}
    </div>
  );
}
