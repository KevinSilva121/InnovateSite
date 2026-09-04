import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Sobre from '../../src/presentation/pages/Sobre.jsx';

describe('Sobre', () => {
  it('tells the story, the founder and the facts', () => {
    render(<MemoryRouter><Sobre /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Taubaté/);
    expect(screen.getAllByText('Kevin Silva').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('list', { name: 'Cidades atendidas' })).toBeInTheDocument();
    expect(document.getElementById('apps')).not.toBeNull();
  });
});
