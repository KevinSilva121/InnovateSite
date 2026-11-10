import styles from './AppsTicker.module.css';

// Esteira dos apps publicados, no pé do hero: ícone, nome e categoria, com bastante
// espaço entre um app e outro. Decorativa (aria-hidden): os mesmos apps estão na
// seção #apps, com descrição e links das lojas.
//
// Duas cópias lado a lado andando -50% em laço: quando a primeira sai inteira, a
// segunda está exatamente onde ela começou, então não há emenda. O espaço entre os
// apps fica dentro de cada item (padding dos dois lados), e não no gap da lista,
// para a distância ser a mesma também na passagem de uma cópia para a outra.
export default function AppsTicker({ apps }) {
  const copia = (chave) => (
    <ul className={styles.track} key={chave}>
      {apps.map((app) => (
        <li key={app.slug} className={styles.item}>
          <img src={app.icon} alt="" width="40" height="40" decoding="async" />
          <span className={styles.texto}>
            <strong>{app.title}</strong>
            <small>{app.category}</small>
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.belt}>
        {copia('a')}
        {copia('b')}
      </div>
    </div>
  );
}
