import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ServicePage from '../../src/presentation/pages/ServicePage.jsx';
import { services } from '../../src/data/content/services.js';
import { site, contactLabel } from '../../src/config/site.js';

const r = (svc) => render(<MemoryRouter initialEntries={[svc.path]}><ServicePage service={svc} /></MemoryRouter>);

describe('ServicePage', () => {
  it.each(services)('$slug renders hero, audience, deliverables, faq and CTA', (svc) => {
    r(svc);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(svc.hero.title);
    expect(screen.getByText(svc.shortName, { selector: '[aria-current="page"]' })).toBeInTheDocument();
    for (const a of svc.audience) expect(screen.getByText(a.name)).toBeInTheDocument();
    for (const d of svc.deliverables) expect(screen.getByText(d.title)).toBeInTheDocument();
    expect(document.querySelectorAll('details')).toHaveLength(svc.faq.length);
    expect(screen.getAllByRole('link', { name: contactLabel(site) }).length).toBeGreaterThanOrEqual(2);
    document.body.innerHTML = '';
  });

  it('aplicativos proves with the app showcase; sites and sistemas-web with the web case', () => {
    r(services[0]);
    expect(document.getElementById('apps')).not.toBeNull();
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(4);
    document.body.innerHTML = '';
    r(services[1]);
    expect(document.getElementById('apps')).toBeNull();
    expect(screen.getByRole('link', { name: /Visitar o site/ })).toBeInTheDocument();
  });
});
