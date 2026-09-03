import { Link } from 'react-router';
import styles from './Button.module.css';

const EXTERNAL = /^(https?:|mailto:|tel:)/;

export default function Button({ href, variant = 'primary', size = 'md', icon: Icon, className = '', children, ...rest }) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  const content = (
    <>
      <span>{children}</span>
      {Icon ? <Icon className={styles.icon} size={18} strokeWidth={2.25} aria-hidden="true" /> : null}
    </>
  );
  if (!href) return <button type="button" className={cls} {...rest}>{content}</button>;
  if (EXTERNAL.test(href)) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{content}</a>;
  return <Link to={href} className={cls} {...rest}>{content}</Link>;
}
