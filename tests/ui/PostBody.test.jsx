import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostBody from '../../src/presentation/ui/PostBody.jsx';

const blocks = [
  { t: 'p', text: 'Primeiro parágrafo.' },
  { t: 'h2', text: 'Um subtítulo' },
  { t: 'ul', items: ['um', 'dois'] },
  { t: 'ol', items: ['passo 1', 'passo 2'] },
  { t: 'note', title: 'Atenção', text: 'Texto do destaque.' },
  { t: 'quote', text: 'Uma frase.' },
  { t: 'desconhecido', text: 'Não deve aparecer.' },
];

describe('PostBody', () => {
  it('renders each block as its own element and ignores unknown types', () => {
    const { container } = render(<PostBody blocks={blocks} />);
    expect(screen.getByText('Primeiro parágrafo.').tagName).toBe('P');
    expect(screen.getByRole('heading', { level: 2, name: 'Um subtítulo' })).toBeInTheDocument();
    expect(container.querySelectorAll('ul li')).toHaveLength(2);
    expect(container.querySelectorAll('ol li')).toHaveLength(2);
    expect(screen.getByText('Atenção').tagName).toBe('P');
    expect(container.querySelector('aside')).toHaveTextContent('Texto do destaque.');
    expect(container.querySelector('blockquote')).toHaveTextContent('Uma frase.');
    expect(screen.queryByText('Não deve aparecer.')).toBeNull();
  });

  it('keeps the declared order', () => {
    const { container } = render(<PostBody blocks={blocks} />);
    const tags = [...container.firstChild.children].map((el) => el.tagName);
    expect(tags).toEqual(['P', 'H2', 'UL', 'OL', 'ASIDE', 'BLOCKQUOTE']);
  });
});
