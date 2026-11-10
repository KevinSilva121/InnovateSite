import { MapPin } from 'lucide-react';
import { cities } from '../../data/content/cities.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import ValeMap from '../ui/ValeMap.jsx';
import styles from './LocalArea.module.css';

// Texto e lista de cidades em colunas à esquerda; mapa esquemático à direita.
export default function LocalArea() {
  return (
    <Section id="regiao">
      <div className={styles.grid}>
        <div className={styles.text}>
          <SectionHeading
            eyebrow="Onde atendemos"
            title="Empresa de software no Vale do Paraíba"
            lead="A sede fica em Taubaté e atendemos presencialmente empresas de São José dos Campos, Pindamonhangaba, Jacareí e de todo o Vale do Paraíba e Litoral Norte. Para o resto do Brasil, trabalhamos remotamente, com reuniões por vídeo e entregas frequentes."
          />
          <p className={styles.note}><MapPin size={16} aria-hidden="true" /> Sede em Taubaté – SP</p>
          <ul className={styles.cities} aria-label="Cidades atendidas">
            {cities.map((city, i) => (
              <li key={city} className={i === 0 ? styles.hq : undefined}>
                <span>{city}</span>{i === 0 ? <small>sede</small> : null}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.map}>
          <ValeMap />
        </div>
      </div>
    </Section>
  );
}
