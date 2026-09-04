import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './AppsShowcase.module.css';

export default function AppsShowcase({
  apps,
  id = 'apps',
  tone = 'navy',
  eyebrow = 'Apps publicados',
  title = 'Produtos nossos, no ar nas duas lojas',
  lead = 'Cada um nasceu de um problema real de quem trabalha. É o mesmo processo que usamos nos projetos de clientes.',
}) {
  return (
    <Section id={id} tone={tone} className={tone === 'navy' ? '' : styles.paperTone}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <div className={styles.grid}>
        {apps.map((app) => (
          <article key={app.slug} className={styles.card} data-reveal>
            <img src={app.icon} alt="" width="72" height="72" loading="lazy" className={styles.icon} />
            <div className={styles.body}>
              <p className={styles.category}>{app.category}</p>
              <h3>{app.title}</h3>
              <p className={styles.tagline}>{app.tagline}</p>
              <ul className={styles.platforms} aria-label="Plataformas">
                {app.platforms.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <StoreBadges name={app.title} stores={app.stores} size="sm" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
