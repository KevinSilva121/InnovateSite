import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Footer from '../../src/presentation/layout/Footer.jsx';
import { site } from '../../src/config/site.js';

describe('Footer', () => {
  it('shows the city, the store links, the blog and the configured e-mail', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText(/Taubaté – SP/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Google Play' })).toHaveAttribute('href', expect.stringContaining('developer?id='));
    expect(screen.getByRole('link', { name: 'App Store' })).toHaveAttribute('href', expect.stringContaining('apps.apple.com'));
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog/');
    expect(screen.getByText(new RegExp(`© ${site.copyrightYear}`))).toBeInTheDocument();
  });
});
