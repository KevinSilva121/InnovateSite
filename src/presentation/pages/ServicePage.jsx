import Section from '../ui/Section.jsx';
import Breadcrumb from '../ui/Breadcrumb.jsx';

export default function ServicePage({ service }) {
  return (
    <Section tone="navy">
      <Breadcrumb items={[{ name: 'Início', path: '/' }, { name: service.shortName, path: service.path }]} />
      <h1>{service.hero.title}</h1>
      <p className="lede">{service.hero.lead}</p>
    </Section>
  );
}
