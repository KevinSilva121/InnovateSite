import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppsShowcase from '../../src/presentation/sections/AppsShowcase.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('AppsShowcase', () => {
  it('renders one card per app with platforms and store links', () => {
    render(<AppsShowcase apps={apps} />);
    expect(document.getElementById('apps')).not.toBeNull();
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Trama no Google Play' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Trama na App Store' })).toBeNull();
    expect(screen.getAllByText('Android')).toHaveLength(4);
    expect(screen.getAllByText('iOS')).toHaveLength(3);
  });
});
