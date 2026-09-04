import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CtaBand from '../../src/presentation/sections/CtaBand.jsx';

describe('CtaBand', () => {
  it('uses the contact fallback when whatsapp is empty', () => {
    render(<MemoryRouter><CtaBand /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/projeto/);
    expect(screen.getByRole('link', { name: 'Fale com a gente' })).toHaveAttribute('href', '/contato/');
  });
});
