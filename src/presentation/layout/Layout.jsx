import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import WhatsAppFab from '../ui/WhatsAppFab.jsx';
import CookieConsent from '../ui/CookieConsent.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContactTracking } from '../hooks/useContactTracking.js';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  useDocumentMeta();
  useScrollReveal();
  useContactTracking();
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo" className={styles.main}>{children}</main>
      <Footer />
      <WhatsAppFab />
      <CookieConsent />
    </>
  );
}
