import { Project } from '../../domain/entities/Project.js';

const icon = (slug) => `${import.meta.env.BASE_URL}apps/${slug}.webp`;
const play = (id) => `https://play.google.com/store/apps/details?id=${id}&hl=pt_BR`;

// Dados estáticos: os apps publicados e o case web. Sem API por enquanto.
export class ProjectRepository {
  getProjects() {
    return [
      {
        id: 1,
        slug: 'calcfrete',
        title: 'CalcFrete',
        type: 'app',
        category: 'Gestão para motoristas',
        tagline: 'Calcula quanto cobrar no frete e organiza o financeiro do motorista autônomo.',
        desc: 'Considera combustível, pedágio, desgaste e comissão para mostrar o valor certo da viagem. Funciona sem internet.',
        icon: icon('calcfrete'),
        stores: {
          play: play('com.kevinramon122.appMotorista'),
          appStore: 'https://apps.apple.com/br/app/calcfrete-gest%C3%A3o-do-motorista/id6798275256',
        },
      },
      {
        id: 2,
        slug: 'contador-de-cantos',
        title: 'Contador de Cantos',
        type: 'app',
        category: 'Criadores de pássaros',
        tagline: 'Contador preciso para quem treina e disputa torneios de canto.',
        desc: 'Cronômetro e marcação de cantos com histórico, feito para criadores que levam o torneio a sério.',
        icon: icon('contador-de-cantos'),
        stores: {
          play: play('com.kevinramon122.Contador'),
          appStore: 'https://apps.apple.com/br/app/contador-de-cantos/id6797971215',
        },
      },
      {
        id: 3,
        slug: 'prazzo',
        title: 'Prazzo',
        type: 'app',
        category: 'Carnê e fiado',
        tagline: 'Controle de fiado, carnê, clientes e estoque para quem vende parcelado.',
        desc: 'Mostra quem deve, quanto e quando. Substitui o caderno e a planilha, sem depender de internet.',
        icon: icon('prazzo'),
        stores: {
          play: play('com.kevinramon122.prazzo'),
          appStore: 'https://apps.apple.com/br/app/prazzo-gestor-de-carn%C3%AA-e-fiado/id6800428986',
        },
      },
      {
        id: 4,
        slug: 'trama',
        title: 'Trama',
        type: 'app',
        category: 'Palavras cruzadas',
        tagline: 'Palavras cruzadas em português, leves e para jogar offline.',
        desc: 'Jogo de palavras cruzadas em português com novos desafios e interface limpa.',
        icon: icon('trama'),
        stores: { play: play('com.trama.kevinramon122') },
      },
      {
        id: 5,
        slug: 'advalice-camargo',
        title: 'Advalice Camargo Advocacia',
        type: 'web',
        category: 'Site institucional',
        tagline: 'Site para escritório de advocacia que precisa transmitir autoridade.',
        desc: 'Site institucional com paleta sóbria, microinterações e estrutura pensada para converter contato.',
        url: 'https://advalicecamargo.com.br/',
      },
    ].map((data) => new Project(data));
  }
}
