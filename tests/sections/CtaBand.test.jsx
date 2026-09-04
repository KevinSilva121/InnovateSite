import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CtaBand from '../../src/presentation/sections/CtaBand.jsx';
import { site, contactHref, contactLabel } from '../../src/config/site.js';

describe('CtaBand', () => {
  it('uses the configured contact target', () => {
    render(<MemoryRouter><CtaBand /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/projeto/);
    expect(screen.getByRole('link', { name: contactLabel(site) })).toHaveAttribute('href', contactHref(site));
  });
});
