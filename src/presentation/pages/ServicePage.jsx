import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { ProjectRepository } from '../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../domain/usecases/GetProjects.js';
import Button from '../ui/Button.jsx';
import PageHero from '../ui/PageHero.jsx';
import Audience from '../sections/Audience.jsx';
import Deliverables from '../sections/Deliverables.jsx';
import Process from '../sections/Process.jsx';
import AppsShowcase from '../sections/AppsShowcase.jsx';
import WebCase from '../sections/WebCase.jsx';
import Faq from '../sections/Faq.jsx';
import CtaBand from '../sections/CtaBand.jsx';

const projects = new GetProjects(new ProjectRepository());
const apps = projects.execute({ type: 'app' });
const [webCase] = projects.execute({ type: 'web' });

export default function ServicePage({ service }) {
  return (
    <>
      <PageHero
        id="service-title"
        breadcrumb={[{ name: 'Início', path: '/' }, { name: service.shortName, path: service.path }]}
        eyebrow={`${service.number} · ${service.shortName}`}
        title={service.hero.title}
        lead={service.hero.lead}
      >
        <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
        <Button href="#entregamos" variant="onNavy" size="lg">O que está incluído</Button>
      </PageHero>

      <Audience items={service.audience} />
      <Deliverables items={service.deliverables} />
      <Process />
      {service.proof === 'apps' ? (
        <AppsShowcase apps={apps} tone="paper" eyebrow="Prova" title="Apps que já publicamos" lead="Os nossos próprios produtos, na Google Play e na App Store." />
      ) : (
        <WebCase project={webCase} />
      )}
      <Faq items={service.faq} title={`Dúvidas sobre ${service.shortName.toLowerCase()}`} />
      <CtaBand title={`Precisa de ${service.shortName.toLowerCase()} para a sua empresa?`} />
    </>
  );
}
