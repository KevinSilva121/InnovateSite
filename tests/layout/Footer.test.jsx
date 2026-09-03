import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Footer from '../../src/presentation/layout/Footer.jsx';

describe('Footer', () => {
  it('shows the city, the store links and no empty contact rows', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText(/Taubaté – SP/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Google Play' })).toHaveAttribute('href', expect.stringContaining('developer?id='));
    expect(screen.getByRole('link', { name: 'App Store' })).toHaveAttribute('href', expect.stringContaining('apps.apple.com'));
    expect(screen.queryByRole('link', { name: /@/ })).toBeNull();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
