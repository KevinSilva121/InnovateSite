import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import Button from '../ui/Button.jsx';
import styles from './Navbar.module.css';

// useLayoutEffect avisa no prerender (não roda no servidor); no cliente ele evita
// que a linha apareça fora do lugar por um frame.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Os três serviços saíram do primeiro nível e viram o menu "Produtos".
const links = [
  { name: 'Início', path: '/', end: true },
  { name: 'Blog', path: '/blog/' },
  { name: 'Sobre', path: '/sobre/' },
];
const mark = `${import.meta.env.BASE_URL}logo/mark.png`;
const emProdutos = (pathname) => services.some((s) => pathname === s.path || pathname === s.path.replace(/\/$/, ''));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [produtos, setProdutos] = useState(false);
  // O menu do celular tem o seu próprio estado: os dois nunca aparecem juntos, e
  // compartilhar deixaria um aria-expanded mentindo no que está escondido.
  const [produtosMob, setProdutosMob] = useState(false);
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const produtosRef = useRef(null);
  const gatilhoRef = useRef(null);
  const firstMeasure = useRef(true);
  const naSecao = emProdutos(pathname);

  useEffect(() => {
    setOpen(false);
    setProdutos(false);
    setProdutosMob(false);
  }, [pathname]);

  // Esc devolve o foco ao gatilho; clique fora só fecha.
  useEffect(() => {
    if (!produtos) return undefined;
    const foraDaqui = (evento) => {
      if (!produtosRef.current?.contains(evento.target)) setProdutos(false);
    };
    const tecla = (evento) => {
      if (evento.key !== 'Escape') return;
      setProdutos(false);
      gatilhoRef.current?.focus();
    };
    document.addEventListener('pointerdown', foraDaqui);
    document.addEventListener('focusin', foraDaqui);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', foraDaqui);
      document.removeEventListener('focusin', foraDaqui);
      document.removeEventListener('keydown', tecla);
    };
  }, [produtos]);

  // Mede o item ativo e move a linha até ele. A largura muda com o texto e com a fonte,
  // por isso remedimos ao trocar de página, ao redimensionar e quando as fontes carregam.
  // Usamos retângulos, e não offsetLeft: o item de "Produtos" tem posicionamento próprio
  // para ancorar o painel, o que muda o offsetParent do gatilho.
  const placeIndicator = useCallback(() => {
    const wrap = navRef.current;
    if (!wrap) return;
    const active = wrap.querySelector('[data-nav-item][aria-current="page"], [data-nav-item][data-current="page"]');
    if (!active) {
      wrap.dataset.ready = 'false';
      return;
    }
    if (firstMeasure.current) wrap.dataset.init = 'true';
    const base = wrap.getBoundingClientRect();
    const alvo = active.getBoundingClientRect();
    wrap.style.setProperty('--ind-x', `${alvo.left - base.left}px`);
    wrap.style.setProperty('--ind-w', `${alvo.width}px`);
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

  const linkItem = (l) => (
    <li key={l.path}>
      <NavLink
        to={l.path}
        end={l.end}
        data-nav-item=""
        className={({ isActive }) => (isActive ? styles.active : undefined)}
      >
        {l.name}
      </NavLink>
    </li>
  );

  const [inicio, ...demais] = links;

  return (
    <header className={styles.header}>
      <div className={['container', styles.bar].join(' ')}>
        <Link to="/" className={styles.brand} aria-label="Innovate Apps Co. — página inicial">
          <img src={mark} alt="" width="32" height="32" />
          <span>Innovate Apps <small>Co.</small></span>
        </Link>

        <nav aria-label="Principal" className={styles.desktop}>
          <div className={styles.linksWrap} ref={navRef}>
            <ul className={styles.links}>
              {linkItem(inicio)}

              <li className={styles.produtos} ref={produtosRef}>
                <button
                  type="button"
                  ref={gatilhoRef}
                  className={[styles.trigger, naSecao ? styles.active : ''].filter(Boolean).join(' ')}
                  aria-expanded={produtos}
                  aria-controls="menu-produtos"
                  data-nav-item=""
                  data-current={naSecao ? 'page' : undefined}
                  onClick={() => setProdutos((v) => !v)}
                >
                  Produtos
                  <ChevronDown size={16} strokeWidth={2.25} aria-hidden="true" className={styles.chevron} />
                </button>

                {/* Abre só no clique. Links normais, sem semântica de menu de aplicativo. */}
                <div id="menu-produtos" className={styles.panel} hidden={!produtos}>
                  <ul className={styles.panelList}>
                    {services.map((s) => (
                      <li key={s.path}>
                        <NavLink to={s.path} className={({ isActive }) => (isActive ? styles.panelActive : undefined)}>
                          <span className={styles.panelText}>
                            <strong>{s.shortName}</strong>
                            <small>{s.navHint}</small>
                          </span>
                          <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" className={styles.panelArrow} />
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {demais.map(linkItem)}
            </ul>
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
            onClick={() => { setOpen((v) => !v); setProdutosMob(false); }}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="menu-mobile" className={styles.mobile} hidden={!open}>
        <nav aria-label="Principal (celular)" className="container">
          <ul className={styles.mobileLinks}>
            {linkItem(inicio)}
            {/* No celular "Produtos" também abre só no clique. A lista fica
                fechada por padrão e desliza, em vez de já nascer aberta. */}
            <li className={styles.mobileItem}>
              <button
                type="button"
                className={[styles.mobileGroup, naSecao ? styles.active : ''].filter(Boolean).join(' ')}
                aria-expanded={produtosMob}
                aria-controls="produtos-mobile"
                onClick={() => setProdutosMob((v) => !v)}
              >
                Produtos
                <ChevronDown size={20} strokeWidth={2.25} aria-hidden="true" className={styles.chevron} />
              </button>
              <div id="produtos-mobile" className={styles.mobileSub} data-aberto={produtosMob}>
                <ul className={styles.mobileSubInner}>
                  {services.map((s) => (
                    <li key={s.path}>
                      <NavLink to={s.path} className={({ isActive }) => (isActive ? styles.subAtivo : undefined)}>
                        <strong>{s.shortName}</strong>
                        <small>{s.navHint}</small>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {demais.map(linkItem)}
            <li><NavLink to="/contato/">Contato</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
