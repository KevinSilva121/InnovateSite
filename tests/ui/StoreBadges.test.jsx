import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StoreBadges from '../../src/presentation/ui/StoreBadges.jsx';

describe('StoreBadges', () => {
  it('renders both stores when both links exist', () => {
    render(<StoreBadges name="CalcFrete" stores={{ play: 'https://p', appStore: 'https://a' }} />);
    expect(screen.getByRole('link', { name: 'CalcFrete no Google Play' })).toHaveAttribute('href', 'https://p');
    expect(screen.getByRole('link', { name: 'CalcFrete na App Store' })).toHaveAttribute('href', 'https://a');
  });

  it('hides the App Store badge when the link is missing', () => {
    render(<StoreBadges name="Trama" stores={{ play: 'https://p', appStore: null }} />);
    expect(screen.queryByRole('link', { name: /App Store/ })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('badge images have explicit dimensions', () => {
    render(<StoreBadges name="X" stores={{ play: 'https://p', appStore: 'https://a' }} />);
    for (const img of document.querySelectorAll('img')) {
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
    }
  });
});
