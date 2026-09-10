export class GetProjects {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  execute({ type } = {}) {
    const all = this.projectRepository.getProjects();
    return type ? all.filter((p) => p.type === type) : all;
  }
}
