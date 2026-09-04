import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LocalArea from '../../src/presentation/sections/LocalArea.jsx';
import { cities } from '../../src/data/content/cities.js';

describe('LocalArea', () => {
  it('lists every city served, Taubaté marked as HQ', () => {
    render(<LocalArea />);
    const list = screen.getByRole('list', { name: 'Cidades atendidas' });
    expect(list.querySelectorAll('li')).toHaveLength(cities.length);
    expect(screen.getByText('Taubaté').closest('li')).toHaveTextContent('sede');
  });
});
