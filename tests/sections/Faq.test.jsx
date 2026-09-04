import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Faq from '../../src/presentation/sections/Faq.jsx';

describe('Faq', () => {
  it('renders native details/summary per item, first one open', () => {
    render(<Faq items={[{ q: 'A?', a: 'a.' }, { q: 'B?', a: 'b.' }]} />);
    const details = document.querySelectorAll('details');
    expect(details).toHaveLength(2);
    expect(details[0]).toHaveAttribute('open');
    expect(details[1]).not.toHaveAttribute('open');
    expect(screen.getByText('A?').tagName).toBe('SUMMARY');
    expect(screen.getByText('b.')).toBeInTheDocument();
  });
});
