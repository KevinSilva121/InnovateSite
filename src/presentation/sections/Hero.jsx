import { site, contactHref, contactLabel } from '../../config/site.js';
import { cities } from '../../data/content/cities.js';
import Button from '../ui/Button.jsx';
import HeroBackground from '../ui/HeroBackground.jsx';
import CountUp from '../ui/CountUp.jsx';
import AppsTicker from '../ui/AppsTicker.jsx';
import styles from './Hero.module.css';

// Hero: etiqueta, título, parágrafo, dois botões e três números grandes, sobre o
// fundo em vídeo (loop do Mesh Gradient; arquivos e regras em src/config/heroFundo.js).
//
// SEO: a etiqueta, o H1, o parágrafo e a linha "sede em Taubaté…" são os textos
// originais do site, que carregam os termos do SEO local (Taubaté, Vale do
// Paraíba, sites, sistemas e aplicativos). Não mudar sem conferir o SEO.
export default function Hero({ apps }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <HeroBackground />
      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.top}>
          <p className={['eyebrow', styles.eyebrow].join(' ')}>Empresa de software em Taubaté – SP</p>
          <h1 id="hero-title">Sites, sistemas e aplicativos sob medida no Vale do Paraíba</h1>
        </div>
        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={styles.lead}>
              Seu site atraindo cliente, seu sistema organizando a operação e seu app na mão de
              quem importa. A gente constrói, coloca no ar e continua junto depois.
            </p>
            <div className={styles.actions}>
              <Button href={contactHref(site)} size="lg">{contactLabel(site)}</Button>
              <Button href="/#apps" variant="onNavy" size="lg">Ver apps publicados</Button>
            </div>
          </div>
          <div className={styles.numeros}>
            {/* dt antes de dd, como o HTML exige; o CSS mostra o número em cima. */}
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>apps publicados</dt>
                <dd><CountUp value={apps.length} className={styles.number} /></dd>
              </div>
              <div className={styles.stat}>
                <dt>cidades atendidas</dt>
                <dd><CountUp value={cities.length} className={styles.number} /></dd>
              </div>
              <div className={styles.stat}>
                <dt>downloads</dt>
                <dd><CountUp value={10000} prefix="+" className={styles.number} /></dd>
              </div>
            </dl>
            <p className={styles.proof}>Publicados nas duas lojas · sede em Taubaté, atendimento em todo o Brasil</p>
          </div>
        </div>
      </div>
      {/* Esteira dos apps no pé do hero: aparece já na primeira tela. */}
      <AppsTicker apps={apps} />
    </section>
  );
}
