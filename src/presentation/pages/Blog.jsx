import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { postsByDate, postPath, formatDate, readingMinutes } from '../../data/content/posts.js';
import PageHero from '../ui/PageHero.jsx';
import Section from '../ui/Section.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import styles from './Blog.module.css';

// Linha de apoio de cada artigo: categoria, data e tempo de leitura.
function Meta({ post }) {
  return (
    <p className={styles.meta}>
      <span className={styles.chip}>{post.category}</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{readingMinutes(post)} min de leitura</span>
    </p>
  );
}

export default function Blog() {
  const [destaque, ...restante] = postsByDate();

  return (
    <>
      <PageHero
        id="blog-title"
        breadcrumb={[{ name: 'Início', path: '/' }, { name: 'Blog', path: '/blog/' }]}
        eyebrow="Blog"
        title="O que investir em tecnologia muda numa empresa"
        lead="Textos sobre sites, sistemas web e aplicativos escritos para quem decide, não para quem programa. Sem jargão e sem receita mágica."
      />

      <Section id="artigos">
        {/* O mais recente ocupa a largura toda; os outros viram uma lista de sumário. */}
        <article className={styles.featured} data-reveal>
          <Meta post={destaque} />
          <h2 className={styles.featuredTitle}>
            <Link to={postPath(destaque.slug)} className={styles.link}>{destaque.title}</Link>
          </h2>
          <p className={styles.excerpt}>{destaque.excerpt}</p>
          <span className={styles.more} aria-hidden="true">
            Ler o artigo <ArrowRight size={17} strokeWidth={2.25} />
          </span>
        </article>

        <ol className={styles.list}>
          {restante.map((post) => (
            <li key={post.slug} data-reveal>
              <article className={styles.row}>
                <Meta post={post} />
                <div className={styles.rowBody}>
                  <h3 className={styles.rowTitle}>
                    <Link to={postPath(post.slug)} className={styles.link}>{post.title}</Link>
                  </h3>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="Algum desses textos parece a sua empresa?"
        text="Se um deles descreveu um problema que você vive hoje, conte a situação para a gente. Em uma conversa curta já dá para dizer o que resolve e por onde começar."
      />
    </>
  );
}
