import { useEffect, useState } from 'react';
import { CONSENT_KEY } from '../../config/site.js';
import Button from './Button.jsx';
import styles from './CookieConsent.module.css';

// Evento que o link "Preferências de cookies" do rodapé dispara para reabrir o aviso.
export const OPEN_CONSENT_EVENT = 'cookies:preferencias';

const lerEscolha = () => {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};

const gravarEscolha = (valor) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, valor);
  } catch {
    // Armazenamento bloqueado: a escolha vale só para esta visita.
  }
};

const sinais = (estado) => ({
  ad_storage: estado,
  ad_user_data: estado,
  ad_personalization: estado,
  analytics_storage: estado,
});

// Aviso de cookies (LGPD). Só aparece quando a tag do Google está carregada, o
// que acontece apenas no site publicado, e enquanto a pessoa não escolheu.
// Aceitar e recusar têm o mesmo peso visual: a escolha precisa ser livre.
export default function CookieConsent() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (typeof window.gtag !== 'function') return undefined;
    if (!lerEscolha()) setAberto(true);
    const reabrir = () => setAberto(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reabrir);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reabrir);
  }, []);

  if (!aberto) return null;

  const escolher = (aceitou) => {
    gravarEscolha(aceitou ? 'aceito' : 'recusado');
    window.gtag('consent', 'update', sinais(aceitou ? 'granted' : 'denied'));
    setAberto(false);
  };

  return (
    <section className={styles.aviso} aria-labelledby="aviso-cookies-titulo">
      <p id="aviso-cookies-titulo" className={styles.titulo}>Cookies</p>
      <p className={styles.texto}>
        Usamos cookies do Google para medir as visitas e o resultado dos nossos anúncios.
        Eles só são gravados se você aceitar.
      </p>
      <div className={styles.acoes}>
        <Button size="sm" onClick={() => escolher(true)}>Aceitar</Button>
        <Button size="sm" variant="secondary" onClick={() => escolher(false)}>Recusar</Button>
      </div>
    </section>
  );
}
