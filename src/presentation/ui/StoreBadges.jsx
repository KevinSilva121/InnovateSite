import styles from './StoreBadges.module.css';

const base = import.meta.env.BASE_URL;

// Badges oficiais pt-BR das lojas (Task 11 baixa os arquivos). Sem link, o badge não aparece.
export default function StoreBadges({ stores, name, size = 'md' }) {
  const h = size === 'sm' ? 36 : 44;
  return (
    <div className={styles.row}>
      {stores.play ? (
        <a href={stores.play} target="_blank" rel="noopener noreferrer" aria-label={`${name} no Google Play`}>
          <img src={`${base}badges/google-play-pt-br.png`} alt="Google Play" width={Math.round(h * 2.584)} height={h} loading="lazy" />
        </a>
      ) : null}
      {stores.appStore ? (
        <a href={stores.appStore} target="_blank" rel="noopener noreferrer" aria-label={`${name} na App Store`}>
          <img src={`${base}badges/app-store-pt-br.svg`} alt="App Store" width={Math.round(h * 2.99)} height={h} loading="lazy" />
        </a>
      ) : null}
    </div>
  );
}
