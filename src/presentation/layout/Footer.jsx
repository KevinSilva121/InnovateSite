import { Link } from 'react-router';
import { Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { site, contactHref } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import styles from './Footer.module.css';

const mark = `${import.meta.env.BASE_URL}logo/mark.png`;
const socials = [
  ['instagram', Instagram, 'Instagram'],
  ['linkedin', Linkedin, 'LinkedIn'],
].filter(([key]) => site.social[key]);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.brand}>
          <img src={mark} alt="" width="40" height="40" />
          <p className={styles.name}>{site.name}</p>
          <p className={styles.tagline}>Sites, sistemas web e aplicativos sob medida para a sua empresa.</p>
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
      </div>
    </footer>
  );
}
