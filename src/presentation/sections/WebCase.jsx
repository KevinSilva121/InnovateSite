import { webCases } from '../../data/content/cases.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import { BrowserFrame, PhoneFrame } from '../ui/DeviceFrame.jsx';
import { CaseShot } from '../ui/Screen.jsx';
import styles from './WebCase.module.css';

const host = (url) => new URL(url).host;

// Case de site: capturas reais (desktop e celular) do site no ar, em molduras
// de navegador e de celular, sobre um painel nas cores do escritório.
export default function WebCase({ project }) {
  const visual = webCases[project.slug] ?? {};
  return (
    <Section id="case" cabe>
      <SectionHeading compacto layout="rule" eyebrow="Case" title="Um site que precisa transmitir autoridade" lead="Escritório de advocacia. Paleta sóbria, tipografia forte e contato a um toque." />
      <div
        className={styles.grid}
        style={{ '--case': visual.cor, '--case-tag': visual.etiqueta, '--case-ink': visual.tinta }}
      >
        <div className={styles.copy} data-reveal>
          <p className={styles.category}>{project.category}</p>
          <h3>{project.title}</h3>
          <p className={styles.desc}>{project.desc}</p>
          <Button href={project.url} variant="secondary">Visitar o site</Button>
        </div>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.stage} aria-label={`Abrir ${project.title} em nova aba`} data-reveal>
          <BrowserFrame host={host(project.url)} className={styles.browser}>
            <CaseShot slug={project.slug} formato="desktop" sizes="(min-width: 64rem) 46rem, 92vw" />
          </BrowserFrame>
          <PhoneFrame className={styles.phone}>
            <CaseShot slug={project.slug} formato="mobile" sizes="(min-width: 64rem) 13rem, 34vw" />
          </PhoneFrame>
        </a>
      </div>
    </Section>
  );
}
