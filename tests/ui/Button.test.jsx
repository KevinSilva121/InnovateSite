import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Button from '../../src/presentation/ui/Button.jsx';

const r = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Button', () => {
  it('renders an internal Link for site paths', () => {
    r(<Button href="/contato/">Contato</Button>);
    const a = screen.getByRole('link', { name: 'Contato' });
    expect(a).toHaveAttribute('href', '/contato/');
    expect(a).not.toHaveAttribute('target');
  });

  it('renders a safe external anchor for http links', () => {
    r(<Button href="https://wa.me/55">Zap</Button>);
    const a = screen.getByRole('link', { name: 'Zap' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a button when there is no href', () => {
    r(<Button onClick={() => {}}>Abrir</Button>);
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveAttribute('type', 'button');
  });
});
