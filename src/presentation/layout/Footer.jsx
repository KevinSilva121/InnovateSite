import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { site, contactHref, hasGoogleTags } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import { OPEN_CONSENT_EVENT } from '../ui/CookieConsent.jsx';
import styles from './Footer.module.css';

const socials = [
  ['instagram', Instagram, 'Instagram'],
  ['linkedin', Linkedin, 'LinkedIn'],
].filter(([key]) => site.social[key]);

// Rodapé "por trás do site" (envelope abrindo): quando cabe na tela, fica parado
// no fundo dela, por baixo do conteúdo, e o fim da página sobe e o descobre de
// baixo para cima (CSS: [data-revela]). Ele mesmo não se mexe.
// Mais alto que a tela (celular baixo), segue o fluxo normal: preso no fundo, a
// parte de cima nunca apareceria. No celular o rodapé é compacto para caber.
//
// A decisão (cabe ou não) é refeita ao abrir, quando CSS e fontes chegam, quando
// a tela ou o rodapé mudam de tamanho e também durante a rolagem, mas só
// enquanto o fim da página ainda está longe: a altura da tela no celular muda
// com a barra de endereço, e assim, quando o rodapé começa a aparecer, a decisão
// já está certa e não muda no meio da revelação.
function useRodapeRevelado(ref) {
  useEffect(() => {
    const rodape = ref.current;
    if (!rodape) return undefined;
    const conteudo = document.getElementById('conteudo');
    const medir = () => {
      if (rodape.offsetHeight <= window.innerHeight - 24) rodape.dataset.revela = '';
      else delete rodape.dataset.revela;
    };
    let quadro = 0;
    const rolar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(() => {
        quadro = 0;
        if (!conteudo || conteudo.getBoundingClientRect().bottom > window.innerHeight + 80) medir();
      });
    };
    medir();
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
    window.addEventListener('scroll', rolar, { passive: true });
    document.fonts?.ready?.then(medir).catch(() => {});
    const depois = setTimeout(medir, 600);
    const tamanho = typeof ResizeObserver === 'function' ? new ResizeObserver(medir) : null;
    tamanho?.observe(rodape);
    return () => {
      window.removeEventListener('resize', medir);
      window.removeEventListener('load', medir);
      window.removeEventListener('scroll', rolar);
      clearTimeout(depois);
      if (quadro) cancelAnimationFrame(quadro);
      tamanho?.disconnect();
    };
  }, [ref]);
}

export default function Footer() {
  const ref = useRef(null);
  useRodapeRevelado(ref);
  return (
    <footer className={styles.footer} ref={ref}>
      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.brand}>
          <span className={styles.glyph} aria-hidden="true" />
          <p className={styles.name}>{site.name}</p>
          <p className={styles.tagline}>Empresa de software no Vale do Paraíba: sites, sistemas web e aplicativos sob medida.</p>
          <p className={styles.address}>Taubaté – SP · Atendimento presencial no Vale e remoto em todo o Brasil</p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className={styles.colTitle}>Navegação</h2>
          <ul className={styles.list}>
            <li><Link to="/">Início</Link></li>
            {services.map((s) => <li key={s.path}><Link to={s.path}>{s.name}</Link></li>)}
            <li><Link to="/blog/">Blog</Link></li>
            <li><Link to="/sobre/">Sobre</Link></li>
            <li><Link to="/contato/">Contato</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className={styles.colTitle}>Nossos apps</h2>
          <ul className={styles.list}>
            <li><a href={site.stores.play} target="_blank" rel="noopener noreferrer">Google Play</a></li>
            <li><a href={site.stores.appStore} target="_blank" rel="noopener noreferrer">App Store</a></li>
          </ul>
        </div>

        <div>
          <h2 className={styles.colTitle}>Contato</h2>
          <ul className={styles.list}>
            {site.whatsapp ? <li><a href={contactHref(site)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a></li> : null}
            {site.email ? <li><a href={`mailto:${site.email}`}><Mail size={16} aria-hidden="true" /> {site.email}</a></li> : null}
            <li><Link to="/contato/">Página de contato</Link></li>
          </ul>
          {socials.length ? (
            <ul className={styles.social} aria-label="Redes sociais">
              {socials.map(([key, Icon, label]) => (
                <li key={key}><a href={site.social[key]} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={20} aria-hidden="true" /></a></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={['container', styles.bottom].join(' ')}>
        {/* O nome já termina em ponto ("Co."); sem isto o texto sairia "Co.. Todos". */}
        <p>© {site.copyrightYear} {site.name.replace(/\.$/, '')}. Todos os direitos reservados.</p>
        {/* Reabre o aviso de cookies: quem aceitou precisa conseguir voltar atrás. */}
        {hasGoogleTags(site) ? (
          <button type="button" className={styles.cookies} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
            Preferências de cookies
          </button>
        ) : null}
      </div>
    </footer>
  );
}
