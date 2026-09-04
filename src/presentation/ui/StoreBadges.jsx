import styles from './StoreBadges.module.css';

const base = import.meta.env.BASE_URL;

// Badges oficiais pt-BR das lojas (Task 11 baixa os arquivos). Sem link, o badge não aparece.
export default function StoreBadges({ stores, name, size = 'md' }) {
  const h = size === 'sm' ? 36 : 44;
  // Proporções dos assets já aparados: os dois badges ficam com a mesma altura visível.
  const playRatio = 646 / 192;
  const appleRatio = 119.66407 / 40;
  return (
    <div className={styles.row}>
      {stores.play ? (
        <a href={stores.play} target="_blank" rel="noopener noreferrer" aria-label={`${name} no Google Play`}>
          <img src={`${base}badges/google-play-pt-br.png`} alt="" width={Math.round(h * playRatio)} height={h} loading="lazy" />
        </a>
      ) : null}
      {stores.appStore ? (
        <a href={stores.appStore} target="_blank" rel="noopener noreferrer" aria-label={`${name} na App Store`}>
          <img src={`${base}badges/app-store-pt-br.svg`} alt="" width={Math.round(h * appleRatio)} height={h} loading="lazy" />
        </a>
      ) : null}
    </div>
  );
}
