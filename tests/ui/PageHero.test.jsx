import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PageHero from '../../src/presentation/ui/PageHero.jsx';

describe('PageHero', () => {
  it('renders breadcrumb, eyebrow, the H1 with its id, lead and actions', () => {
    render(
      <MemoryRouter>
        <PageHero id="t" eyebrow="01 · Teste" title="Título" lead="Lead." breadcrumb={[{ name: 'Início', path: '/' }, { name: 'Teste', path: '/teste/' }]}>
          <a href="/x/">Ação</a>
        </PageHero>
      </MemoryRouter>,
    );
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('id', 't');
    expect(h1).toHaveTextContent('Título');
    expect(screen.getByText('Teste', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    expect(screen.getByText('01 · Teste')).toBeInTheDocument();
    expect(screen.getByText('Lead.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ação' })).toBeInTheDocument();
  });
  it('omits optional parts', () => {
    render(<MemoryRouter><PageHero id="t" title="Só título" /></MemoryRouter>);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByText('Lead.')).toBeNull();
  });
});
