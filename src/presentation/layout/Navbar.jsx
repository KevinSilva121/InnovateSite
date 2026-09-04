import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X, ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import Button from '../ui/Button.jsx';
import styles from './Navbar.module.css';

// useLayoutEffect avisa no prerender (não roda no servidor); no cliente ele evita
// que a linha apareça fora do lugar por um frame.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const links = [
  { name: 'Início', path: '/', end: true },
  ...services.map((s) => ({ name: s.shortName, path: s.path })),
  { name: 'Sobre', path: '/sobre/' },
];
const mark = `${import.meta.env.BASE_URL}logo/mark.png`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const firstMeasure = useRef(true);
  useEffect(() => setOpen(false), [pathname]);

  // Mede o link ativo e move a linha até ele. A largura muda com o texto e com a fonte,
  // por isso remedimos ao trocar de página, ao redimensionar e quando as fontes carregam.
  const placeIndicator = useCallback(() => {
    const wrap = navRef.current;
    if (!wrap) return;
    const active = wrap.querySelector('a[aria-current="page"]');
    if (!active) {
      wrap.dataset.ready = 'false';
      return;
    }
    if (firstMeasure.current) wrap.dataset.init = 'true';
    wrap.style.setProperty('--ind-x', `${active.offsetLeft}px`);
    wrap.style.setProperty('--ind-w', `${active.offsetWidth}px`);
    wrap.dataset.ready = 'true';
    if (firstMeasure.current) {
      firstMeasure.current = false;
      // A primeira posição não anima: só as trocas de página deslizam.
      requestAnimationFrame(() => {
        if (navRef.current) delete navRef.current.dataset.init;
      });
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    placeIndicator();
    window.addEventListener('resize', placeIndicator);
    document.fonts?.ready?.then(placeIndicator).catch(() => {});
    return () => window.removeEventListener('resize', placeIndicator);
  }, [pathname, placeIndicator]);

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
          <div className={styles.linksWrap} ref={navRef}>
            <ul className={styles.links}>{items}</ul>
            <span className={styles.indicator} aria-hidden="true" />
          </div>
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
