import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrustStrip from '../../src/presentation/sections/TrustStrip.jsx';

describe('TrustStrip', () => {
  it('links to both developer pages and shows the app count', () => {
    render(<TrustStrip appCount={4} />);
    expect(screen.getByRole('link', { name: 'Innovate Apps no Google Play' })).toHaveAttribute('href', expect.stringContaining('developer?id='));
    expect(screen.getByRole('link', { name: 'Innovate Apps na App Store' })).toHaveAttribute('href', expect.stringContaining('apps.apple.com'));
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText(/apps publicados/)).toBeInTheDocument();
  });
});
