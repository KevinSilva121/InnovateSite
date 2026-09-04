import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X, ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import Button from '../ui/Button.jsx';
import styles from './Navbar.module.css';

const links = [
  { name: 'Início', path: '/', end: true },
  ...services.map((s) => ({ name: s.shortName, path: s.path })),
  { name: 'Sobre', path: '/sobre/' },
];
const mark = `${import.meta.env.BASE_URL}logo/mark.png`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const items = links.map((l) => (
    <li key={l.path}>
      <NavLink to={l.path} end={l.end} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {l.name}
      </NavLink>
    </li>
  ));

  return (
    <header className={styles.header}>
      <div className={['container', styles.bar].join(' ')}>
        <Link to="/" className={styles.brand} aria-label="Innovate Apps Co. — página inicial">
          <img src={mark} alt="" width="32" height="32" />
          <span>Innovate Apps <small>Co.</small></span>
        </Link>

        <nav aria-label="Principal" className={styles.desktop}>
          <ul className={styles.links}>{items}</ul>
        </nav>

        <div className={styles.actions}>
          <Button href={contactHref(site)} size="sm" icon={ArrowRight}>{contactLabel(site)}</Button>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="menu-mobile" className={styles.mobile} hidden={!open}>
        <nav aria-label="Principal (celular)" className="container">
          <ul className={styles.mobileLinks}>
            {items}
            <li><NavLink to="/contato/">Contato</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
