import { Project } from '../../domain/entities/Project.js';

// In a real application, this would fetch from an API or Database
// For this portfolio, we return static data.
export class ProjectRepository {
  async getProjects() {
    const rawData = [
      {
        id: 1,
        title: 'Contador de Cantos',
        category: 'Google Play App',
        url: 'https://play.google.com/store/apps/details?id=com.kevinramon122.Contador&hl=pt_BR',
        desc: 'Um aplicativo utilitário desenvolvido para precisão em monitoramento avícola. UI/UX minimalista e funcional com mais de 10k downloads.',
        color: 'rgba(56, 189, 248, 0.1)'
      },
      {
        id: 2,
        title: 'Kevin Silva Portfolio',
        category: 'Website Pessoal',
        url: 'https://kevinsilva121.github.io/Portfolio/',
        desc: 'Landing page para desenvolvedor experiente. Design premium focado em demonstração de resultados técnicos.',
        color: 'rgba(251, 146, 60, 0.1)'
      },
      {
        id: 3,
        title: 'Advalice Camargo',
        category: 'Plataforma Corporativa',
        url: 'https://advalicecamargo.com.br/',
        desc: 'Portal sofisticado desenvolvido para a advocacia. Transmite autoridade com elementos dinâmicos, paleta premium e microinterações.',
        color: 'rgba(242, 239, 233, 0.1)'
      }
    ];

    return rawData.map(data => new Project(data));
  }
}
