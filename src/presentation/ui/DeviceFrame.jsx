import styles from './DeviceFrame.module.css';

// Molduras desenhadas só com CSS: celular (aro escuro e ilha) e navegador
// (barra com três pontos e endereço). Nada de imagem de aparelho.
export function PhoneFrame({ children, className = '', style }) {
  return (
    <div className={[styles.phone, className].filter(Boolean).join(' ')} style={style}>
      <span className={styles.island} aria-hidden="true" />
      <div className={styles.screen}>{children}</div>
    </div>
  );
}

export function BrowserFrame({ host, children, className = '' }) {
  return (
    <div className={[styles.browser, className].filter(Boolean).join(' ')}>
      <span className={styles.chrome} aria-hidden="true">
        <i /><i /><i />
        <span className={styles.address}>{host}</span>
      </span>
      <div className={styles.viewport}>{children}</div>
    </div>
  );
}
