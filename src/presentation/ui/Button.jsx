import { Link } from 'react-router';
import styles from './Button.module.css';

const EXTERNAL = /^(https?:|mailto:|tel:)/;

// Botão reto, texto mono em maiúsculas e "›" no fim. O sinal vem do CSS
// (::after), e não do texto: o nome acessível continua sendo só o rótulo.
// `icon` é aceito por compatibilidade com quem ainda passa um ícone; o visual novo não usa.
// eslint-disable-next-line no-unused-vars
export default function Button({ href, variant = 'primary', size = 'md', icon: _icon, className = '', children, ...rest }) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  const content = <span>{children}</span>;
  if (!href) return <button type="button" className={cls} {...rest}>{content}</button>;
  if (EXTERNAL.test(href)) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{content}</a>;
  return <Link to={href} className={cls} {...rest}>{content}</Link>;
}
