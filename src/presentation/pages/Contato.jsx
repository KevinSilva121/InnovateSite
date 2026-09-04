import { MessageCircle, Mail, Clock, MapPin } from 'lucide-react';
import { site, contactHref } from '../../config/site.js';
import { cities } from '../../data/content/cities.js';
import PageHero from '../ui/PageHero.jsx';
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './Contato.module.css';

// Aviso interno: enquanto os canais não forem preenchidos em src/config/site.js, a página mostra só horário, cidade e lojas.
if (import.meta.env.DEV && !site.whatsapp && !site.email) {
  console.warn('[Innovate Apps] Preencha whatsapp e email em src/config/site.js');
}

export default function Contato() {
  return (
    <>
      <PageHero
        id="contato-title"
        breadcrumb={[{ name: 'Início', path: '/' }, { name: 'Contato', path: '/contato/' }]}
        eyebrow="Contato"
        title="Fale com a Innovate Apps"
        lead="Conte o que a sua empresa precisa. Respondemos em horário comercial e marcamos uma conversa por vídeo ou presencial."
      />

      <Section id="canais">
        <div className={styles.grid}>
          <div className={styles.channels}>
            {site.whatsapp ? (
              <div className={styles.card}>
                <MessageCircle size={24} aria-hidden="true" />
                <h2>WhatsApp</h2>
                <p>O jeito mais rápido de falar com a gente.</p>
                <Button href={contactHref(site)} size="lg">Chamar no WhatsApp</Button>
              </div>
            ) : null}
            {site.email ? (
              <div className={styles.card}>
                <Mail size={24} aria-hidden="true" />
                <h2>E-mail</h2>
                <p>Para propostas, documentos e orçamentos detalhados.</p>
                <a href={`mailto:${site.email}`} className={styles.link}>{site.email}</a>
              </div>
            ) : null}
            <div className={styles.card}>
              <Clock size={24} aria-hidden="true" />
              <h2>Horário</h2>
              <p>Segunda a sexta, das 9h às 18h.</p>
            </div>
            <div className={styles.card}>
              <MapPin size={24} aria-hidden="true" />
              <h2>Onde estamos</h2>
              <p>Taubaté – SP. Atendimento presencial no Vale do Paraíba e remoto em todo o Brasil.</p>
            </div>
          </div>

          <aside className={styles.aside}>
            <h2>Cidades atendidas</h2>
            <ul className={styles.cities} aria-label="Cidades atendidas">
              {cities.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <h2>Nossos apps</h2>
            <StoreBadges name="Innovate Apps" stores={site.stores} />
          </aside>
        </div>
      </Section>
    </>
  );
}
