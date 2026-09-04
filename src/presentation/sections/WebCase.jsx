import { ArrowUpRight } from 'lucide-react';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import styles from './WebCase.module.css';

const host = (url) => new URL(url).host;

export default function WebCase({ project }) {
  return (
    <Section id="case">
      <SectionHeading eyebrow="Case" title="Um site que precisa transmitir autoridade" lead="Escritório de advocacia. Paleta sóbria, tipografia forte e contato a um toque." />
      <div className={styles.grid} data-reveal>
        <div className={styles.copy}>
          <p className="eyebrow">{project.category}</p>
          <h3>{project.title}</h3>
          <p className={styles.desc}>{project.desc}</p>
          <Button href={project.url} variant="secondary" icon={ArrowUpRight}>Visitar o site</Button>
        </div>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.frame} aria-label={`Abrir ${project.title} em nova aba`}>
          <span className={styles.chrome} aria-hidden="true"><i /><i /><i /><span>{host(project.url)}</span></span>
          <span className={styles.canvas} aria-hidden="true">
            <span className={styles.wordmark}>{project.title.split(' ').slice(0, 2).join(' ')}</span>
            <span className={styles.domain}>{host(project.url)}</span>
          </span>
        </a>
      </div>
    </Section>
  );
}
