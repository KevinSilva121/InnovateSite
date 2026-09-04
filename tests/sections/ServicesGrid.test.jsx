import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ServicesGrid from '../../src/presentation/sections/ServicesGrid.jsx';

describe('ServicesGrid', () => {
  it('renders three numbered service cards linking to their pages', () => {
    render(<MemoryRouter><ServicesGrid /></MemoryRouter>);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver aplicativos/ })).toHaveAttribute('href', '/aplicativos/');
    expect(screen.getByRole('link', { name: /Ver sistemas web/ })).toHaveAttribute('href', '/sistemas-web/');
  });
});
