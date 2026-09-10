import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Breadcrumb from '../../src/presentation/ui/Breadcrumb.jsx';

describe('Breadcrumb', () => {
  it('links all but the last item, which is the current page', () => {
    render(<MemoryRouter><Breadcrumb items={[{ name: 'Início', path: '/' }, { name: 'Sites', path: '/sites/' }]} /></MemoryRouter>);
    expect(screen.getByRole('navigation', { name: 'Navegação estrutural' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/');
    expect(screen.getByText('Sites')).toHaveAttribute('aria-current', 'page');
  });
});
