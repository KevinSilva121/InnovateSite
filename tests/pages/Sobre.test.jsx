import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Sobre from '../../src/presentation/pages/Sobre.jsx';

describe('Sobre', () => {
  it('tells the story, the founder and the facts', () => {
    render(<MemoryRouter><Sobre /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/tecnologia/);
    expect(screen.getAllByText('Kevin Silva').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('list', { name: 'Cidades atendidas' })).toBeInTheDocument();
    expect(document.getElementById('apps')).not.toBeNull();
  });

  it('links each service page with descriptive text', () => {
    render(<MemoryRouter><Sobre /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'criação de sites' })).toHaveAttribute('href', '/sites/');
    expect(screen.getByRole('link', { name: 'sistemas web sob medida' })).toHaveAttribute('href', '/sistemas-web/');
    expect(screen.getByRole('link', { name: 'aplicativos Android e iOS' })).toHaveAttribute('href', '/aplicativos/');
  });
});
