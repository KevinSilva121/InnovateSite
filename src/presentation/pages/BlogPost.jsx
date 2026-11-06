import { Link } from 'react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { site } from '../../config/site.js';
import { postPath, formatDate, readingMinutes, relatedPosts, outline } from '../../data/content/posts.js';
import { serviceByCategory } from '../../data/content/services.js';
import PageHero from '../ui/PageHero.jsx';
import Section from '../ui/Section.jsx';
import PostBody from '../ui/PostBody.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import styles from './BlogPost.module.css';

export default function BlogPost({ post }) {
  const sugestoes = relatedPosts(post);
  const sumario = outline(post);
  const servico = serviceByCategory(post.category);

  return (
    <>
      <PageHero
        id="post-title"
        breadcrumb={[
          { name: 'Início', path: '/' },
          { name: 'Blog', path: '/blog/' },
          { name: post.seo.title, path: postPath(post.slug) },
        ]}
        eyebrow={post.category}
        title={post.title}
        meta={
          <>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="sep" aria-hidden="true">·</span>
            <span>{readingMinutes(post)} min de leitura</span>
          </>
        }
      />

      <Section id="artigo">
        <div className={styles.layout}>
          <article className={styles.article}>
            <PostBody blocks={post.body} />

            {post.sources?.length ? (
              <aside className={styles.sources} aria-labelledby="fontes">
                <h2 id="fontes" className={styles.sourcesTitle}>Onde conferir</h2>
                <ul className={styles.sourcesList}>
                  {post.sources.map((fonte) => (
                    <li key={fonte.url}>
                      <a href={fonte.url} target="_blank" rel="noopener noreferrer">
                        {fonte.name}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            {/* O link para a página do serviço é o que liga o artigo ao que vendemos:
                passa relevância para a página que deve aparecer na busca. */}
            <p className={styles.by}>
              Escrito pela equipe da {site.shortName}, empresa de software em Taubaté – SP que desenvolve
              sites, sistemas web e aplicativos para empresas do Vale do Paraíba e de todo o Brasil.
              {servico ? (
                <>
                  {' '}Veja como trabalhamos com{' '}
                  <Link to={servico.path}>{servico.hero.title.charAt(0).toLowerCase() + servico.hero.title.slice(1)}</Link>.
                </>
              ) : null}
            </p>

            <p className={styles.back}>
              <Link to="/blog/"><ArrowLeft size={16} aria-hidden="true" /> Ver todos os artigos</Link>
            </p>
          </article>

          {/* Sumário fixo: aproveita a coluna vazia e dá ao leitor uma noção do
              tamanho do texto antes de começar. Some no celular. */}
          {sumario.length >= 3 ? (
            <nav className={styles.sumario} aria-labelledby="sumario-titulo">
              <p className={styles.sumarioTitle} id="sumario-titulo">Neste artigo</p>
              <ol className={styles.sumarioList}>
                {sumario.map((item) => (
                  <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>
                ))}
              </ol>
            </nav>
          ) : null}
        </div>
      </Section>

      {sugestoes.length ? (
        <Section id="leia-tambem" tone="paper2">
          <h2 className={styles.alsoTitle}>Leia também</h2>
          <ul className={styles.also}>
            {sugestoes.map((sugestao) => (
              <li key={sugestao.slug} className={styles.alsoCard} data-reveal>
                <p className={styles.alsoMeta}>
                  <span className={styles.chip}>{sugestao.category}</span>
                  <time dateTime={sugestao.date}>{formatDate(sugestao.date)}</time>
                </p>
                <h3 className={styles.alsoHeading}>
                  <Link to={postPath(sugestao.slug)} className={styles.alsoLink}>{sugestao.title}</Link>
                </h3>
                <p className={styles.alsoExcerpt}>{sugestao.excerpt}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
