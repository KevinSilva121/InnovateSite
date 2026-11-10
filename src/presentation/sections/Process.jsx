import { useRef } from 'react';
import { processSteps } from '../../data/content/process.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { useProgressoRolagem } from '../hooks/useProgressoRolagem.js';
import styles from './Process.module.css';

// Os quatro passos numa linha, com numeração mono e um fio que liga um ao outro.
// No celular a linha fica na vertical, à esquerda.
//
// Animação presa à rolagem: conforme a página rola, o fio se enche de azul e
// cada passo "carrega" quando o fio chega nele, do 1 ao 4 (o quadrado se enche,
// o número acende, título e texto sobem). Rolando para cima, volta.
// No desktop o progresso começa assim que a lista aparece embaixo (92% da
// altura da tela) e completa quando ela chega a 60%: com a seção na tela, os
// quatro passos já estão carregados. No celular, com os passos em coluna, a
// distância acompanha a altura da lista.
const ROLAGEM = { marcador: 0.92, faixa: 0.32, porAltura: 0.75 };

export default function Process() {
  const ref = useRef(null);
  useProgressoRolagem(ref, ROLAGEM);
  const total = processSteps.length;
  return (
    <Section id="como-funciona" tone="paper2">
      <SectionHeading layout="rule" eyebrow="Como funciona" title="Do primeiro contato à entrega, sem surpresa" />
      <ol className={styles.steps} ref={ref} data-rolagem="">
        {processSteps.map((step, i) => (
          // Janela de rolagem do passo: começa quando o fio chega nele.
          <li key={step.number} className={styles.step} style={{ '--ini': (i / total) * 0.9, '--fim': (i / total) * 0.9 + 0.16 }}>
            <span className={styles.number} aria-hidden="true">{step.number}</span>
            <span className={styles.node} aria-hidden="true" />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
