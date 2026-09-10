import { site } from '../../config/site.js';
import { ProjectRepository } from '../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../domain/usecases/GetProjects.js';
import PageHero from '../ui/PageHero.jsx';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import AppsShowcase from '../sections/AppsShowcase.jsx';
import LocalArea from '../sections/LocalArea.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import styles from './Sobre.module.css';

const apps = new GetProjects(new ProjectRepository()).execute({ type: 'app' });

const values = [
  { title: 'Escopo por escrito', text: 'Antes de começar, você sabe o que vai receber, quando e por quanto.' },
  { title: 'O código é seu', text: 'Repositório, hospedagem e contas nas lojas ficam no nome da sua empresa.' },
  { title: 'Perto de você', text: 'Reunião presencial em Taubaté e região, ou por vídeo quando for mais prático.' },
];

export default function Sobre() {
  return (
    <>
      <PageHero
        id="sobre-title"
        breadcrumb={[{ name: 'Início', path: '/' }, { name: 'Sobre', path: '/sobre/' }]}
        eyebrow={`Sobre a ${site.shortName}`}
        title="Uma empresa de tecnologia feita por quem programa"
        lead="Desenvolvemos sites, sistemas web e aplicativos para empresas de todo o Brasil — e publicamos os nossos próprios apps para provar que o processo funciona."
      />

      <Section id="historia">
        <div className={styles.story}>
          <div className={styles.text}>
            <SectionHeading eyebrow="Quem está por trás" title="Feita por quem programa" />
            <p>A Innovate Apps foi fundada por <strong>{site.founder}</strong>, desenvolvedor de software com experiência em aplicativos Android e iOS, sistemas web e integrações. A empresa nasceu em Taubaté, SP, para atender empresas que precisam de tecnologia sob medida sem contratar uma equipe inteira.</p>
            <p>Além dos projetos para clientes, mantemos produtos próprios nas lojas: CalcFrete, Contador de Cantos, Prazzo e Trama. Cada um passou pelo mesmo caminho que oferecemos a você — conversa, proposta, desenvolvimento por etapas e publicação.</p>
            <p>Trabalhamos com poucas frentes ao mesmo tempo, de propósito. Quem conversa com você no orçamento é quem escreve o código.</p>
          </div>
          <dl className={styles.facts}>
            <div><dt>Sede</dt><dd>Taubaté – SP</dd></div>
            <div><dt>Fundador</dt><dd>{site.founder}</dd></div>
            <div><dt>Apps publicados</dt><dd className="tabular">{apps.length}</dd></div>
            <div><dt>Atendimento</dt><dd>Presencial no Vale, remoto no Brasil</dd></div>
          </dl>
        </div>
      </Section>

      <Section id="como-trabalhamos" tone="paper2">
        <SectionHeading eyebrow="Como trabalhamos" title="Três combinados que não mudam" />
        <ul className={styles.values}>
          {values.map((v) => (
            <li key={v.title} data-reveal>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <AppsShowcase apps={apps} tone="paper" eyebrow="Produtos próprios" title="O que já publicamos" lead="Na Google Play e na App Store." />
      <LocalArea />
      <CtaBand />
    </>
  );
}
