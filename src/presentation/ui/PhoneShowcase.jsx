import styles from './PhoneShowcase.module.css';

const base = import.meta.env.BASE_URL;

// Telas reais dos projetos, geradas por scripts/assets/showcase.mjs a partir das
// capturas do cliente. Ordem definida por ele: site da Alice, Contador, Prazzo, Trama.
// Cada arquivo sai em 540x1170 (a proporção exata da tela do aparelho) e em 360x780.
// Ao mudar esta lista, ajuste também os passos em PhoneShowcase.module.css.
const frames = [
  '01-advalice1',
  '02-advalice2',
  '03-contador1',
  '04-contador2',
  '05-prazzo1',
  '06-prazzo2',
  '07-prazzo3',
  '08-prazzo4',
  '09-trama1',
  '10-trama2',
  '11-trama3',
  '12-trama4',
];

// A primeira tela é repetida no fim: a animação termina sobre a cópia e recomeça
// do original, então a volta ao topo não aparece.
const reel = [...frames, frames[0]];

export default function PhoneShowcase() {
  return (
    <div
      className={styles.stage}
      role="img"
      aria-label="Telas de aplicativos e sites desenvolvidos pela Innovate Apps"
    >
      <div className={styles.phone}>
        <span className={styles.island} aria-hidden="true" />
        <div className={styles.screen}>
          <div className={styles.reel}>
            {reel.map((stem, i) => (
              <img
                key={`${stem}-${i}`}
                src={`${base}showcase/${stem}.webp`}
                srcSet={`${base}showcase/${stem}-360.webp 360w, ${base}showcase/${stem}.webp 540w`}
                sizes="272px"
                alt=""
                width="540"
                height="1170"
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
