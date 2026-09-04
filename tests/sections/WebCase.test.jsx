import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WebCase from '../../src/presentation/sections/WebCase.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';

const [web] = new ProjectRepository().getProjects().filter((p) => p.type === 'web');

describe('WebCase', () => {
  it('shows the case and links to the live site', () => {
    render(<WebCase project={web} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Advalice Camargo');
    expect(screen.getByRole('link', { name: /Visitar o site/ })).toHaveAttribute('href', 'https://advalicecamargo.com.br/');
    expect(screen.getAllByText('advalicecamargo.com.br').length).toBeGreaterThanOrEqual(1);
  });
});
