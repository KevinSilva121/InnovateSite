import { headingId } from '../../data/content/posts.js';
import styles from './PostBody.module.css';

// Renderiza o corpo de um artigo a partir dos blocos declarados em
// data/content/posts.js. Nada de HTML em string: cada tipo vira um elemento real.
export default function PostBody({ blocks }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, i) => {
        const key = `${block.t}-${i}`;
        switch (block.t) {
          case 'h2':
            return <h2 key={key} id={headingId(block.text)}>{block.text}</h2>;
          case 'ul':
            return <ul key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
          case 'ol':
            return <ol key={key}>{block.items.map((item) => <li key={item}>{item}</li>)}</ol>;
          case 'note':
            return (
              <aside key={key} className={styles.note}>
                <p className={styles.noteTitle}>{block.title}</p>
                <p>{block.text}</p>
              </aside>
            );
          case 'quote':
            return <blockquote key={key} className={styles.quote}><p>{block.text}</p></blockquote>;
          case 'p':
            return <p key={key}>{block.text}</p>;
          default:
            return null;
        }
      })}
    </div>
  );
}
