import Hero from '../sections/Hero.jsx';
import TrustStrip from '../sections/TrustStrip.jsx';
import ServicesGrid from '../sections/ServicesGrid.jsx';
import AppsShowcase from '../sections/AppsShowcase.jsx';
import WebCase from '../sections/WebCase.jsx';
import Process from '../sections/Process.jsx';
import LocalArea from '../sections/LocalArea.jsx';
import Faq from '../sections/Faq.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import { homeFaq } from '../../data/content/faq.js';
import { ProjectRepository } from '../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../domain/usecases/GetProjects.js';

const projects = new GetProjects(new ProjectRepository());
const apps = projects.execute({ type: 'app' });
const [webCase] = projects.execute({ type: 'web' });

export default function Home() {
  return (
    <>
      <Hero apps={apps} />
      <TrustStrip appCount={apps.length} />
      <ServicesGrid />
      <AppsShowcase apps={apps} />
      <WebCase project={webCase} />
      <Process />
      <LocalArea />
      <Faq items={homeFaq} />
      <CtaBand />
    </>
  );
}
