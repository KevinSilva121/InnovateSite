import { MapPin } from 'lucide-react';
import { cities } from '../../data/content/cities.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './LocalArea.module.css';

export default function LocalArea() {
  return (
    <Section id="regiao">
      <div className={styles.grid}>
        <div>
          <SectionHeading
            eyebrow="Onde atendemos"
            title="Atendemos empresas em todo o Brasil"
            lead="Trabalhamos remotamente com todo o país, com reuniões por vídeo e entregas frequentes. No Vale do Paraíba e no Litoral Norte, também atendemos presencialmente."
          />
          <p className={styles.note}><MapPin size={18} aria-hidden="true" /> Sede em Taubaté – SP</p>
        </div>
        <ul className={styles.cities} aria-label="Cidades atendidas" data-reveal>
          {cities.map((city, i) => (
            <li key={city} className={i === 0 ? styles.hq : undefined}>
              <span>{city}</span>{i === 0 ? <small>sede</small> : null}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
