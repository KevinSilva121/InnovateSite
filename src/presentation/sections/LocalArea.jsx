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
            eyebrow="De Taubaté para o Vale"
            title="Perto o bastante para sentar e conversar"
            lead="Atendemos presencialmente em Taubaté e nas cidades do Vale do Paraíba e Litoral Norte. Para o restante do Brasil, trabalhamos remotamente com o mesmo processo."
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
