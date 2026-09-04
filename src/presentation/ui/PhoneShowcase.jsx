import styles from './PhoneShowcase.module.css';

const base = import.meta.env.BASE_URL;

// Telas reais de projetos entregues, geradas por scripts/assets/showcase.mjs.
// Todas saem em 540x1170, o formato exato da tela do celular, para o feed
// avançar exatamente uma tela por vez.
const frames = [
  '01-site-alice-camargo.webp',
  '02-calcfrete-financas.webp',
  '03-contador-cronometro.webp',
  '04-calcfrete-receita.webp',
];

// A primeira tela é repetida no fim: a animação termina sobre a cópia e
// recomeça do original, então a volta ao topo não aparece.
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
            {reel.map((file, i) => (
              <img
                key={`${file}-${i}`}
                src={`${base}showcase/${file}`}
                alt=""
                width="540"
                height="1170"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
