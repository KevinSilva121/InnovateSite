import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import styles from './Navbar.module.css';

// useLayoutEffect avisa no prerender (não roda no servidor); no cliente ele evita
// que o ponto do item atual apareça fora do lugar por um frame.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Header fixo e transparente no topo da página, com o texto branco sobre o fundo
// escuro. Depois de rolar, ou com o painel de Serviços aberto, vira uma barra azul
// sólida. Some ao rolar para baixo e volta ao rolar para cima.
const emServicos = (pathname) => services.some((s) => pathname === s.path || pathname === s.path.replace(/\/$/, ''));

// Até aqui (px) conta como topo: header transparente e sempre visível.
const TOPO = 24;
// Rolagens menores que isso não escondem nem mostram o header.
const FOLGA = 8;

const primeiro = { name: 'Início', path: '/', end: true };
const depois = [
  { name: 'Blog', path: '/blog/' },
  { name: 'Sobre', path: '/sobre/' },
  { name: 'Contato', path: '/contato/' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicos, setServicos] = useState(false);
  // O menu do celular tem o seu próprio estado: os dois nunca aparecem juntos, e
  // compartilhar deixaria um aria-expanded mentindo no que está escondido.
  const [servicosMob, setServicosMob] = useState(false);
  const [topo, setTopo] = useState(true);
  const [escondido, setEscondido] = useState(false);
  const aberto = useRef(false);
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const servicosRef = useRef(null);
  const painelRef = useRef(null);
  const gatilhoRef = useRef(null);
  const firstMeasure = useRef(true);
  const passaMouse = useRef(false);
  const fecharDepois = useRef(0);
  const naSecao = emServicos(pathname);

  useEffect(() => {
    setOpen(false);
    setServicos(false);
    setServicosMob(false);
  }, [pathname]);

  // Transparente só no topo da página. Rolando para baixo o header sobe e some;
  // rolando para cima ele volta. Uma folga ignora tremidas de poucos pixels, e
  // com um dos menus aberto ele não some.
  useEffect(() => {
    let ultimoY = Math.max(0, window.scrollY);
    const medir = () => {
      // O "elástico" do iPhone passa do fim e volta: isso não é rolar para cima.
      const fim = document.documentElement.scrollHeight - window.innerHeight;
      let y = Math.max(0, window.scrollY);
      if (fim > 0) y = Math.min(y, fim);
      setTopo(y < TOPO);
      if (y < TOPO) {
        setEscondido(false);
        ultimoY = y;
        return;
      }
      if (Math.abs(y - ultimoY) < FOLGA) return;
      if (!aberto.current) setEscondido(y > ultimoY);
      ultimoY = y;
    };
    medir();
    window.addEventListener('scroll', medir, { passive: true });
    return () => window.removeEventListener('scroll', medir);
  }, []);

  useEffect(() => {
    aberto.current = servicos || open;
    if (aberto.current) setEscondido(false);
  }, [servicos, open]);
  useEffect(() => { setEscondido(false); }, [pathname]);

  // Elementos fixos na rolagem (sumário do artigo, título do FAQ) sobem junto
  // quando o header some, sem deixar o vão dele.
  useEffect(() => {
    document.documentElement.dataset.header = escondido ? 'escondido' : 'visivel';
  }, [escondido]);
  useEffect(() => () => { delete document.documentElement.dataset.header; }, []);

  // No desktop o painel abre ao passar o mouse, como na referência; clique e
  // teclado continuam funcionando para quem não usa mouse.
  useEffect(() => {
    passaMouse.current = Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches);
    return () => clearTimeout(fecharDepois.current);
  }, []);
  const abrirAoPassar = () => {
    if (!passaMouse.current) return;
    clearTimeout(fecharDepois.current);
    setServicos(true);
  };
  const fecharAoSair = () => {
    if (!passaMouse.current) return;
    clearTimeout(fecharDepois.current);
    fecharDepois.current = setTimeout(() => setServicos(false), 180);
  };

  // Esc devolve o foco ao gatilho; clique fora só fecha.
  useEffect(() => {
    if (!servicos) return undefined;
    const foraDaqui = (evento) => {
      const dentro = servicosRef.current?.contains(evento.target) || painelRef.current?.contains(evento.target);
      if (!dentro) setServicos(false);
    };
    const tecla = (evento) => {
      if (evento.key !== 'Escape') return;
      setServicos(false);
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
  }, [servicos]);

  // Ponto sob o item da página atual. Mede o item e desliza até ele; a largura
  // muda com o texto e com a fonte, por isso remedimos ao trocar de página, ao
  // redimensionar e quando as fontes carregam.
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
    wrap.style.setProperty('--ind-x', `${alvo.left - base.left + alvo.width / 2}px`);
    wrap.dataset.ready = 'true';
    if (firstMeasure.current) {
      firstMeasure.current = false;
      requestAnimationFrame(() => {
        if (navRef.current) delete navRef.current.dataset.init;
      });
    }
  }, []);

  // A lista do painel começa exatamente embaixo de "Serviços": mede o gatilho
  // quando o painel abre (o menu é centralizado, então não dá para fixar no CSS).
  useIsomorphicLayoutEffect(() => {
    const grade = painelRef.current?.firstElementChild;
    const gatilho = gatilhoRef.current;
    if (!servicos || !grade || !gatilho) return;
    const x = gatilho.getBoundingClientRect().left - grade.getBoundingClientRect().left;
    grade.style.setProperty('--panel-x', `${Math.max(0, x)}px`);
  }, [servicos]);

  useIsomorphicLayoutEffect(() => {
    placeIndicator();
    window.addEventListener('resize', placeIndicator);
    document.fonts?.ready?.then(placeIndicator).catch(() => {});
    return () => window.removeEventListener('resize', placeIndicator);
  }, [pathname, placeIndicator]);

  const linkItem = (l) => (
    <li key={l.path} onPointerEnter={fecharAoSair}>
      {l.ancora ? (
        <Link to={l.path} data-nav-item="">{l.name}</Link>
      ) : (
        <NavLink to={l.path} end={l.end} data-nav-item="" className={({ isActive }) => (isActive ? styles.active : undefined)}>
          {l.name}
        </NavLink>
      )}
    </li>
  );

  return (
    <header
      className={styles.header}
      data-topo={topo}
      data-escondido={escondido}
      data-aberto={servicos || open}
      onPointerLeave={fecharAoSair}
    >
      <div className={['container', styles.bar].join(' ')}>
        <Link to="/" className={styles.brand} aria-label="Innovate Apps Co. — página inicial">
          <span className={styles.glyph} aria-hidden="true" />
          <span>Innovate Apps <small>Co.</small></span>
        </Link>

        <nav aria-label="Principal" className={styles.desktop}>
          <div className={styles.linksWrap} ref={navRef}>
            <ul className={styles.links}>
              {linkItem(primeiro)}

              <li className={styles.servicos} ref={servicosRef} onPointerEnter={abrirAoPassar}>
                <button
                  type="button"
                  ref={gatilhoRef}
                  className={[styles.trigger, naSecao ? styles.active : ''].filter(Boolean).join(' ')}
                  aria-expanded={servicos}
                  aria-controls="menu-servicos"
                  data-nav-item=""
                  data-current={naSecao ? 'page' : undefined}
                  onClick={() => setServicos((v) => !v)}
                >
                  Serviços
                  <ChevronDown size={14} strokeWidth={2.25} aria-hidden="true" className={styles.chevron} />
                </button>
              </li>

              {depois.map(linkItem)}
            </ul>
            <span className={styles.indicator} aria-hidden="true" />
          </div>
        </nav>

        <div className={styles.actions}>
          <a href={contactHref(site)} className={styles.cta} target="_blank" rel="noopener noreferrer">
            <span className={styles.ctaTexto}>{contactLabel(site)}</span>
          </a>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => { setOpen((v) => !v); setServicosMob(false); }}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Painel de Serviços: o header inteiro vira um bloco azul e os serviços
          aparecem grandes, alinhados embaixo do menu. Links normais, sem
          semântica de menu de aplicativo. */}
      <div id="menu-servicos" className={styles.panel} hidden={!servicos} ref={painelRef} onPointerEnter={abrirAoPassar}>
        <nav aria-label="Serviços" className="container">
          <ul className={styles.panelList}>
            {services.map((s) => (
              <li key={s.path}>
                <NavLink to={s.path} className={({ isActive }) => (isActive ? styles.panelActive : undefined)}>
                  <strong>{s.shortName}</strong>
                  <small>{s.navHint}</small>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div id="menu-mobile" className={styles.mobile} hidden={!open}>
        <nav aria-label="Principal (celular)" className="container">
          <ul className={styles.mobileLinks}>
            <li><NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>Início</NavLink></li>
            {/* No celular Serviços abre só no clique, deslizando. */}
            <li className={styles.mobileItem}>
              <button
                type="button"
                className={[styles.mobileGroup, naSecao ? styles.active : ''].filter(Boolean).join(' ')}
                aria-expanded={servicosMob}
                aria-controls="servicos-mobile"
                onClick={() => setServicosMob((v) => !v)}
              >
                Serviços
                <ChevronDown size={22} strokeWidth={2.25} aria-hidden="true" className={styles.chevron} />
              </button>
              <div id="servicos-mobile" className={styles.mobileSub} data-aberto={servicosMob}>
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
            {depois.map((l) => (
              <li key={l.path}>
                {l.ancora ? <Link to={l.path}>{l.name}</Link> : <NavLink to={l.path} className={({ isActive }) => (isActive ? styles.active : undefined)}>{l.name}</NavLink>}
              </li>
            ))}
          </ul>
          <a href={contactHref(site)} className={styles.mobileCta} target="_blank" rel="noopener noreferrer">{contactLabel(site)}</a>
        </nav>
      </div>
    </header>
  );
}
