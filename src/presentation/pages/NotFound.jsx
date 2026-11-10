import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import styles from './NotFound.module.css';

// Começa escura como as outras páginas: o header fixo nasce branco no topo.
export default function NotFound() {
  return (
    <Section tone="navy" className={styles.pagina}>
      <p className="eyebrow">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p className="lede">O endereço que você acessou não existe ou mudou de lugar.</p>
      <p><Button href="/">Voltar para o início</Button></p>
    </Section>
  );
}
