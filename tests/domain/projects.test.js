import { describe, it, expect } from 'vitest';
import { Project } from '../../src/domain/entities/Project.js';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { GetProjects } from '../../src/domain/usecases/GetProjects.js';

describe('Project', () => {
  it('derives platforms from stores', () => {
    const both = new Project({ id: 1, slug: 'a', title: 'A', type: 'app', stores: { play: 'p', appStore: 's' } });
    const android = new Project({ id: 2, slug: 'b', title: 'B', type: 'app', stores: { play: 'p' } });
    expect(both.platforms).toEqual(['Android', 'iOS']);
    expect(android.platforms).toEqual(['Android']);
    expect(android.stores.appStore).toBeNull();
  });
});

describe('ProjectRepository + GetProjects', () => {
  const useCase = new GetProjects(new ProjectRepository());

  it('returns five apps with icons and Play Store links', () => {
    const apps = useCase.execute({ type: 'app' });
    expect(apps.map((a) => a.slug)).toEqual(['calcfrete', 'contador-de-cantos', 'prazzo', 'trama', 'cascata']);
    for (const app of apps) {
      // O "?v=N" no fim força quem tem o ícone antigo em cache a baixar o novo.
      expect(app.icon).toMatch(/\/apps\/[a-z-]+\.webp(\?v=\d+)?$/);
      expect(app.stores.play).toContain('play.google.com/store/apps/details?id=');
      expect(app.tagline.length).toBeLessThanOrEqual(90);
    }
  });

  it('only Trama lacks an App Store link', () => {
    const apps = useCase.execute({ type: 'app' });
    expect(apps.filter((a) => !a.stores.appStore).map((a) => a.slug)).toEqual(['trama']);
  });

  it('returns Alice Camargo as the single web case', () => {
    const web = useCase.execute({ type: 'web' });
    expect(web).toHaveLength(1);
    expect(web[0].url).toBe('https://advalicecamargo.com.br/');
  });

  it('marks the two games as GameApplication for the schema', () => {
    const apps = useCase.execute({ type: 'app' });
    expect(apps.filter((a) => a.appCategory === 'GameApplication').map((a) => a.slug)).toEqual(['trama', 'cascata']);
    expect(apps.find((a) => a.slug === 'calcfrete').appCategory).toBe('BusinessApplication');
  });

  it('returns everything without a filter', () => {
    expect(useCase.execute()).toHaveLength(6);
  });
});
