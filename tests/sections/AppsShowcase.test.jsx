import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import AppsShowcase from '../../src/presentation/sections/AppsShowcase.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { appCases } from '../../src/data/content/cases.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('AppsShowcase', () => {
  it('renders one case per app with category, platforms and store links', () => {
    render(<AppsShowcase apps={apps} />);
    expect(document.getElementById('apps')).not.toBeNull();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Trama no Google Play' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Trama na App Store' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Cascata na App Store' })).toBeInTheDocument();
    expect(screen.getAllByText('Android')).toHaveLength(5);
    expect(screen.getAllByText('iOS')).toHaveLength(4);
    for (const app of apps) expect(screen.getByText(app.category)).toBeInTheDocument();
  });

  it('shows the real screens of each app with descriptive alt text, lazily loaded', () => {
    render(<AppsShowcase apps={apps} />);
    for (const [i, app] of apps.entries()) {
      const caso = within(screen.getAllByRole('article')[i]);
      for (const tela of appCases[app.slug].telas) {
        const img = caso.getByAltText(tela.alt);
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(img.getAttribute('srcset')).toMatch(new RegExp(`/img/apps/${app.slug}/${tela.id}-\\d+\\.webp \\d+w`));
      }
    }
  });
});
