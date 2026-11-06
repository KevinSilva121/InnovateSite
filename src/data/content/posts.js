// Blog da Innovate Apps. Conteúdo escrito à mão, sem CMS: para publicar um artigo
// novo, acrescente um objeto no topo de `posts` e pronto — rota, sitemap, JSON-LD,
// listagem e "leia também" saem daqui automaticamente.
//
// Campos:
//   slug        vira a URL /blog/<slug>/. Só minúsculas, números e hífen.
//   title       título da página (H1). Pode ser longo.
//   seo.title   título curto da aba e do Google, com o assunto que a pessoa
//               pesquisaria. Máx. 49 caracteres: o site acrescenta
//               " | Innovate Apps" no fim e o limite total é 65.
//   seo.description  resumo do Google. Entre 61 e 155 caracteres.
//   date        publicação, no formato AAAA-MM-DD.
//   updated     opcional; use quando revisar um texto já publicado.
//   category    um dos rótulos de `categories` abaixo.
//   excerpt     chamada da listagem, 1 ou 2 frases.
//   body        blocos na ordem em que aparecem (tipos abaixo).
//   sources     opcional; aparece no rodapé do artigo como "Onde conferir".
//   related     opcional; slugs de 2 artigos. Sem isso, o site usa os mais recentes.
//
// Tipos de bloco aceitos em `body`:
//   { t: 'h2',    text }              subtítulo
//   { t: 'p',     text }              parágrafo
//   { t: 'ul',    items: [] }         lista com marcador
//   { t: 'ol',    items: [] }         lista numerada
//   { t: 'note',  title, text }       destaque em caixa (use com moderação)
//   { t: 'quote', text }              frase de efeito

export const categories = ['Sites', 'Sistemas web', 'Aplicativos'];

export const posts = [
  {
    slug: 'quanto-custa-um-site-profissional',
    title: 'Quanto custa um site profissional: o que entra no preço e o que fica de fora',
    seo: {
      title: 'Quanto custa um site profissional',
      description: 'O que forma o preço de um site profissional, os custos que continuam depois da entrega e as perguntas que evitam surpresa no orçamento.',
    },
    date: '2026-11-06',
    category: 'Sites',
    excerpt: 'Orçamentos de site variam muito, e quase sempre pelo mesmo motivo: cada proposta inclui coisas diferentes. Como comparar sem cair no barato que sai caro.',
    body: [
      { t: 'p', text: 'É a primeira pergunta de quase toda conversa sobre site, e a mais difícil de responder sem contexto. Peça orçamento a três fornecedores e é bem possível receber três valores muito distantes entre si. Nem sempre alguém está cobrando caro demais: na maioria das vezes, cada proposta está entregando uma coisa diferente com o mesmo nome.' },
      { t: 'p', text: 'Por isso, antes de olhar o número, vale entender o que forma o preço. Com isso na mão, dá para comparar propostas de igual para igual e saber exatamente pelo que você está pagando.' },

      { t: 'h2', text: 'O que forma o preço de um site' },
      { t: 'p', text: 'Quatro coisas pesam mais que todo o resto:' },
      { t: 'ol', items: [
        'Quantidade de páginas com conteúdo próprio. Uma landing page de serviço único é um projeto; um site institucional com uma página para cada serviço é outro; um catálogo com dezenas de produtos é um terceiro.',
        'Quem produz o conteúdo. Texto escrito para aparecer no Google, fotos do trabalho real e organização das informações dão mais trabalho que o código. Se você entrega tudo pronto, o preço cai. Se o fornecedor escreve, ele sobe, e costuma valer a pena.',
        'Design próprio ou modelo pronto. Template adaptado é mais barato e serve para muita gente. Design próprio custa mais e faz diferença quando a aparência precisa passar confiança, como em clínica, escritório de advocacia e indústria.',
        'Integrações. Agenda online, área do cliente, catálogo com busca, pagamento e formulário ligado a outro sistema são funcionalidades, e não páginas. Cada uma é orçada à parte.',
      ] },

      { t: 'h2', text: 'Os custos que continuam depois da entrega' },
      { t: 'p', text: 'O valor do projeto é só uma parte da conta. Todo site tem custos recorrentes, e eles precisam aparecer na proposta desde o começo:' },
      { t: 'ul', items: [
        'Domínio: o .com.br custa R$ 40 por ano direto no Registro.br. É pouco, mas precisa estar registrado no CNPJ da sua empresa, e não no nome de quem fez o site.',
        'Hospedagem: vai de quase nada, para sites leves e estáticos, até algumas centenas de reais por mês, para lojas virtuais e sistemas com muito acesso.',
        'Manutenção: atualização de conteúdo, correções de segurança e pequenos ajustes. Pode ser mensal ou sob demanda, mas alguém precisa ser o responsável.',
        'E-mail profissional, quando contratado junto, costuma ser cobrado por caixa de e-mail.',
      ] },
      { t: 'quote', text: 'O site barato que fica preso ao fornecedor costuma ser o mais caro de todos. Só que a conta chega depois.' },

      { t: 'h2', text: 'Sinais de que o barato vai sair caro' },
      { t: 'ul', items: [
        'O domínio ou a hospedagem ficam no nome do fornecedor, e não da sua empresa.',
        'Não existe proposta por escrito dizendo quantas páginas, quantas rodadas de revisão e o que não está incluso.',
        'O fornecedor não mostra sites que estão no ar hoje, para você abrir no celular e testar.',
        'Você não recebe nenhum acesso: nem ao painel, nem ao código, nem à hospedagem.',
        'Ninguém fala em Google, velocidade ou celular, só em deixar bonito.',
      ] },
      { t: 'p', text: 'Nenhum desses pontos muda o preço do projeto em si. Eles mostram como o fornecedor trabalha, e é isso que define se o seu site vai continuar funcionando, e sendo seu, daqui a três anos.' },

      { t: 'h2', text: 'Como pedir um orçamento que dá para comparar' },
      { t: 'p', text: 'Mande a mesma lista para todos os fornecedores. Assim as propostas voltam respondendo às mesmas perguntas:' },
      { t: 'ol', items: [
        'Quais serviços você quer que apareçam, um por linha. Cada um tende a virar uma página.',
        'Se você já tem textos, fotos e logo, ou se precisa que isso seja produzido.',
        'Dois ou três sites de que você gosta, e o que exatamente gosta em cada um.',
        'Que ação o visitante deve fazer: chamar no WhatsApp, ligar, pedir orçamento, agendar.',
        'Em que cidades você quer ser encontrado. Uma empresa de Taubaté que atende todo o Vale do Paraíba precisa de uma estrutura diferente da de quem atende só o próprio bairro.',
      ] },
      { t: 'note', title: 'Peça o que não está incluso', text: 'Uma boa proposta diz o que entrega e também o que fica de fora. Se essa parte não existir, pergunte. É nela que mora a maior parte das cobranças extras no meio do projeto.' },

      { t: 'h2', text: 'E quanto custa, afinal?' },
      { t: 'p', text: 'Um site institucional enxuto, com poucas páginas e conteúdo fornecido pela empresa, costuma ter valor fechado e ficar pronto em duas a quatro semanas. Catálogos, áreas restritas e integrações são orçados pelo escopo, porque a diferença entre um projeto e outro é grande demais para caber numa tabela de preços.' },
      { t: 'p', text: 'O caminho mais curto para um número realista é uma conversa de meia hora com a lista acima em mãos. Aqui na Innovate Apps, a proposta sai por escrito, com escopo, prazo e valor fechado, e o domínio e a hospedagem ficam no nome da sua empresa desde o primeiro dia.' },
    ],
    sources: [
      { name: 'Registro.br — Valores de registro de domínio', url: 'https://registro.br/dominio/valores/' },
      { name: 'Google Search Central — Guia de SEO para iniciantes', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=pt-br' },
    ],
    related: ['como-aparecer-no-google-maps', 'velocidade-do-site-e-dinheiro'],
  },

  {
    slug: 'como-aparecer-no-google-maps',
    title: 'Como fazer a sua empresa aparecer no Google Maps quando procuram na sua cidade',
    seo: {
      title: 'Como aparecer no Google Maps na sua cidade',
      description: 'Como o Google escolhe as empresas que aparecem no mapa, o que preencher no Perfil da Empresa e os erros que podem derrubar o seu perfil.',
    },
    date: '2026-11-06',
    category: 'Sites',
    excerpt: 'Quando alguém procura um serviço com o nome da cidade, o Google mostra primeiro um mapa com três empresas. Entrar nessa lista depende de um perfil gratuito que muita empresa deixa pela metade.',
    body: [
      { t: 'p', text: 'Faça o teste: procure no Google pelo seu serviço junto com o nome da sua cidade, algo como "contabilidade em Taubaté" ou "oficina mecânica em São José dos Campos". Antes da lista de sites, aparece um mapa com três empresas. Para muita gente, a escolha termina ali, sem rolar a página.' },
      { t: 'p', text: 'Quem decide essa lista é o Perfil da Empresa no Google, o antigo Google Meu Negócio. Ele é gratuito, e muita empresa tem um perfil criado anos atrás e nunca mais mexeu nele. É uma das melhorias com mais retorno por hora de trabalho que existem.' },

      { t: 'h2', text: 'Como o Google escolhe quem aparece no mapa' },
      { t: 'p', text: 'O próprio Google explica que o resultado local depende de três fatores:' },
      { t: 'ul', items: [
        'Relevância: o quanto o perfil corresponde ao que a pessoa procurou. Perfil completo, com a categoria certa e os serviços descritos, ganha aqui.',
        'Distância: a proximidade entre a empresa e quem está pesquisando, ou o local que a pessoa digitou na busca.',
        'Destaque: o quanto a empresa é conhecida, medido por avaliações, notas, links de outros sites e presença na internet em geral.',
      ] },
      { t: 'p', text: 'A distância você não controla. Os outros dois, sim, e é neles que está o trabalho. O Google também deixa claro que não existe forma de pagar para subir no resultado local. Anúncio aparece marcado como anúncio, separado do resto.' },

      { t: 'h2', text: 'O que preencher, por ordem de importância' },
      { t: 'ol', items: [
        'Categoria principal. É o campo que mais pesa. Escolha a que descreve exatamente o que você faz, e não a mais genérica. As categorias secundárias complementam.',
        'Endereço ou área de atendimento. Se o cliente vai até você, mostre o endereço. Se é você que vai até o cliente, ou se a empresa funciona num endereço residencial, oculte o endereço e informe as cidades que atende.',
        'Horário, telefone e site. O link do site deve levar para a página que fala do seu serviço principal, e não para uma página genérica.',
        'Serviços e descrição. Escreva do jeito que o cliente fala, citando os serviços de verdade, sem lista de palavras-chave.',
        'Fotos reais e recentes: fachada, equipe, trabalho entregue. Perfil sem foto parece abandonado.',
      ] },
      { t: 'p', text: 'Depois disso, mantenha o perfil vivo: horário de feriado atualizado, fotos novas de tempos em tempos e resposta às perguntas que os clientes deixam por lá.' },
      { t: 'note', title: 'Não coloque a cidade no nome', text: 'É tentador cadastrar a empresa como "Oficina do João Taubaté Centro". As diretrizes do Google proíbem: o nome do perfil precisa ser o nome real da empresa, sem cidade, slogan ou palavra-chave. Perfis assim podem ser suspensos, e a suspensão custa bem mais do que qualquer ganho.' },

      { t: 'h2', text: 'Avaliação é o fator que você mais consegue mexer' },
      { t: 'p', text: 'Quantidade, nota e frequência de avaliações contam para o destaque. A regra prática é simples: peça avaliação a todo cliente satisfeito, no momento em que ele está satisfeito. Um link direto mandado pelo WhatsApp logo depois da entrega funciona muito melhor que um pedido genérico na rede social.' },
      { t: 'p', text: 'Responda a todas, inclusive às negativas. A resposta é lida por quem está decidindo se vai te contratar, então escreva para essa pessoa: reconheça o problema, explique o que foi feito e ofereça um canal para resolver. Nunca compre avaliação nem ofereça desconto em troca de nota. Além de ser contra as regras, o Google remove as avaliações e pode restringir o perfil.' },

      { t: 'h2', text: 'Onde o site entra nessa história' },
      { t: 'p', text: 'O perfil e o site trabalham juntos. O Google confere se nome, endereço e telefone batem entre o perfil, o site e outros cadastros na internet, e informação desencontrada tira confiança do resultado. Vale revisar se o telefone do rodapé do site é o mesmo do perfil e se o nome da empresa está escrito igual em todo lugar.' },
      { t: 'p', text: 'O site também sustenta a relevância: uma página para cada serviço, citando a cidade e a região que você atende, dá ao Google mais motivos para mostrar a sua empresa naquela busca. E os links que outros sites fazem para o seu, como associação comercial, fornecedores e clientes, somam no destaque.' },
      { t: 'p', text: 'Para empresas de Taubaté e do Vale do Paraíba, um bom primeiro passo é conferir se a empresa está no Perfil da Empresa, no cadastro da associação comercial da cidade e nos principais guias locais, sempre com os mesmos dados.' },
    ],
    sources: [
      { name: 'Ajuda do Perfil da Empresa — Como melhorar a classificação local', url: 'https://support.google.com/business/answer/7091?hl=pt-BR' },
      { name: 'Diretrizes para representar sua empresa no Google', url: 'https://support.google.com/business/answer/3038177?hl=pt-BR' },
    ],
    related: ['site-proprio-ou-so-instagram', 'quanto-custa-um-site-profissional'],
  },

  {
    slug: 'como-escolher-empresa-de-software',
    title: 'Como escolher uma empresa de software: perguntas para fazer antes de fechar contrato',
    seo: {
      title: 'Como escolher uma empresa de software',
      description: 'As perguntas que separam a empresa de software que entrega da que some no meio do projeto, e o que conferir sobre código, dados e contrato.',
    },
    date: '2026-11-06',
    category: 'Sistemas web',
    excerpt: 'Portfólio bonito e preço bom não bastam. As perguntas que mostram como o fornecedor trabalha, de quem fica o código e o que acontece se a parceria acabar.',
    body: [
      { t: 'p', text: 'Contratar uma empresa de software é diferente de comprar um produto pronto. Você está contratando um jeito de trabalhar por meses, às vezes por anos, e boa parte do que importa só aparece no meio do projeto. A boa notícia é que dá para antecipar quase tudo com as perguntas certas na primeira conversa.' },
      { t: 'p', text: 'Separamos as perguntas em dois grupos: as que mostram como o fornecedor trabalha e as que garantem que o que for construído fica com a sua empresa.' },

      { t: 'h2', text: 'Perguntas sobre o jeito de trabalhar' },
      { t: 'ul', items: [
        'Posso ver projetos que estão no ar hoje? Site você abre no celular, app você baixa na loja, sistema você pede uma demonstração. Print de tela não vale.',
        'Quem vai programar? Pergunte se é a mesma equipe da conversa ou se o trabalho é repassado para terceiros. Repassar não é proibido, mas você precisa saber com quem está tratando.',
        'Com que frequência eu vejo o andamento? A resposta boa é: entregas a cada uma ou duas semanas, num ambiente em que você mesmo testa.',
        'O que acontece quando eu pedir uma mudança no meio do caminho? Mudança sempre acontece. O que importa é existir uma regra clara para avaliar o prazo e o custo de cada uma.',
      ] },

      { t: 'h2', text: 'Perguntas sobre o que fica com a sua empresa' },
      { t: 'ul', items: [
        'De quem é o código no final? A resposta tem que ser da sua empresa, e isso precisa estar no contrato.',
        'Em nome de quem ficam domínio, hospedagem, banco de dados e contas nas lojas? Tudo deveria estar no CNPJ da sua empresa, com você tendo acesso de administrador.',
        'Se a parceria acabar, o que eu recebo? Código, documentação mínima e todos os acessos. Outro fornecedor precisa conseguir continuar o trabalho sem começar do zero.',
        'Como os dados dos meus clientes serão tratados? Quando o sistema guarda dados pessoais, o fornecedor normalmente atua como operador desses dados na LGPD, e o contrato deve dizer o que ele pode e não pode fazer com eles.',
      ] },
      { t: 'note', title: 'Propriedade do código no contrato', text: 'A Lei do Software (Lei 9.609/1998) trata de quem é o dono de um programa feito sob contrato, mas a própria lei abre espaço para o que as partes combinarem. Não dependa de interpretação: escreva no contrato, com todas as letras, que o código-fonte e os direitos sobre ele são da sua empresa.' },

      { t: 'h2', text: 'Sinais de alerta' },
      { t: 'ul', items: [
        'Preço fechado para um sistema complexo sem nenhuma conversa sobre o seu processo. Ou o escopo está vago, ou a conta vai chegar depois.',
        'Proposta sem a lista do que não está incluso.',
        'Pagamento integral adiantado, sem marcos de entrega.',
        'Resistência em colocar contas e hospedagem no nome da sua empresa.',
        'Nenhuma pergunta sobre como a sua empresa funciona. Quem não pergunta vai entregar o que imaginou, e não o que você precisa.',
      ] },

      { t: 'h2', text: 'Estar perto faz diferença?' },
      { t: 'p', text: 'Para site, quase nenhuma: tudo se resolve bem por vídeo. Para sistema, ajuda bastante. O levantamento rende mais quando alguém passa uma manhã vendo a operação acontecer, e os ajustes do dia a dia saem mais rápido quando dá para sentar junto com quem usa.' },
      { t: 'p', text: 'Por isso, se a sua empresa está em Taubaté, São José dos Campos ou em outra cidade do Vale do Paraíba, vale considerar um fornecedor da região, desde que ele passe nas perguntas acima. Proximidade é vantagem, não critério único.' },

      { t: 'h2', text: 'Como comparar as propostas' },
      { t: 'p', text: 'Coloque as propostas lado a lado e compare o que cada uma entrega, e não só o valor final. Para cada fornecedor, anote:' },
      { t: 'ol', items: [
        'O que está incluso e o que ficou de fora, item por item.',
        'O prazo da primeira versão utilizável, e não só o do projeto completo.',
        'O custo mensal depois da entrega: hospedagem, suporte e licenças.',
        'O que acontece com código, dados e acessos ao final do contrato.',
      ] },
      { t: 'p', text: 'Quase sempre, a proposta mais barata é a que deixou mais coisas de fora. Às vezes ela é a escolha certa mesmo assim, mas essa é uma decisão que precisa ser tomada sabendo disso.' },
    ],
    sources: [
      { name: 'Lei do Software (Lei 9.609/1998)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9609.htm' },
      { name: 'Lei Geral de Proteção de Dados (Lei 13.709/2018)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm' },
    ],
    related: ['como-funciona-a-criacao-de-um-sistema', 'sistema-sob-medida-ou-assinatura'],
  },

  {
    slug: 'como-funciona-a-criacao-de-um-sistema',
    title: 'Como funciona a criação de um sistema sob medida, da conversa à entrega',
    seo: {
      title: 'Como funciona a criação de um sistema',
      description: 'As etapas da criação de um sistema web sob medida, o que a sua empresa precisa fazer em cada uma e os erros que atrasam o projeto.',
    },
    date: '2026-11-06',
    category: 'Sistemas web',
    excerpt: 'Mandar fazer um sistema assusta menos quando você sabe o que acontece em cada etapa, quanto tempo leva e o que vão pedir da sua equipe no caminho.',
    body: [
      { t: 'p', text: 'Quem nunca contratou o desenvolvimento de um sistema costuma imaginar uma de duas cenas: uma reunião e, meses depois, o sistema pronto, ou um projeto que nunca termina. Nenhuma das duas precisa acontecer. A criação de um sistema sob medida bem conduzida passa por etapas previsíveis, e em quase todas a sua empresa vê algo funcionando.' },
      { t: 'p', text: 'Este é o caminho que seguimos aqui. Ele serve também de régua para avaliar a proposta de qualquer fornecedor.' },

      { t: 'h2', text: 'Etapa 1: levantamento do processo' },
      { t: 'p', text: 'Antes de qualquer tela, é preciso entender como o trabalho acontece hoje: quem lança o quê, onde o papel ainda circula, qual planilha é a oficial, onde o trabalho trava e o que acontece quando alguém erra. O ideal é ver a operação acontecendo, e não só ouvir a descrição dela numa reunião.' },
      { t: 'p', text: 'O resultado dessa etapa é um mapa do processo real e uma lista do que mais dói. É dali que sai a primeira versão do sistema, e não de uma lista de desejos.' },

      { t: 'h2', text: 'Etapa 2: escopo por escrito e protótipo' },
      { t: 'p', text: 'Com o processo mapeado, o escopo vira documento: o que entra na primeira versão, o que fica para depois, prazo e valor. É também aqui que se define quem pode ver quais dados, uma exigência da LGPD que é muito mais fácil de resolver no papel do que depois do sistema pronto.' },
      { t: 'p', text: 'Junto com o escopo vem um protótipo navegável das telas principais, para a equipe clicar e dizer "não é assim que a gente faz" antes de existir uma linha de código. Mudar um protótipo custa minutos. Mudar um sistema pronto custa semanas.' },

      { t: 'h2', text: 'Etapa 3: desenvolvimento em entregas curtas' },
      { t: 'p', text: 'O sistema é construído em ciclos de uma ou duas semanas. A cada ciclo, uma parte nova fica disponível para testar num ambiente separado, com dados de exemplo. É o oposto de sumir por três meses e voltar com tudo pronto, e o motivo é prático: quanto mais cedo alguém da operação usa, mais cedo aparecem os detalhes que ninguém lembrou de contar.' },
      { t: 'ul', items: [
        'Cadastros e permissões costumam vir primeiro, porque todo o resto depende deles.',
        'Em seguida, o fluxo principal: o pedido, a ordem de serviço, o atendimento, o que for o coração da operação.',
        'Relatórios e painéis vêm por último, quando já existe dado de verdade para mostrar.',
      ] },

      { t: 'h2', text: 'Etapa 4: migração, treinamento e virada' },
      { t: 'p', text: 'Sistema que começa vazio parece retrocesso para quem vai usar. Por isso o histórico que está nas planilhas é importado antes da virada. Depois vem um treinamento curto com cada perfil de usuário e um período rodando em paralelo com o jeito antigo, até a data combinada para desligar a planilha.' },
      { t: 'note', title: 'Marque a data de desligar o jeito antigo', text: 'Sem uma data, a equipe mantém a planilha só por garantia durante meses, e o sistema nunca vira a fonte oficial. Essa data é decisão da direção da empresa, e não da equipe de desenvolvimento.' },

      { t: 'h2', text: 'Etapa 5: suporte e evolução' },
      { t: 'p', text: 'Depois que entra em produção, o sistema passa a ser usado de verdade, e é nessa fase que aparecem as melhores ideias de melhoria. O suporte cobre correções e pequenos ajustes; a evolução cobre funções novas, sempre priorizadas pelo que a operação mais precisa naquele momento.' },

      { t: 'h2', text: 'O que a sua empresa precisa fazer' },
      { t: 'p', text: 'Um projeto de sistema não dá para terceirizar por completo. Do lado do cliente, três coisas fazem toda a diferença:' },
      { t: 'ol', items: [
        'Uma pessoa responsável, com tempo reservado na agenda e autonomia para decidir as dúvidas do dia a dia.',
        'Acesso a quem faz o trabalho, e não só a quem gerencia. É quem está na ponta que sabe onde o processo falha.',
        'Disposição para testar cada entrega na semana em que ela chega, enquanto o assunto ainda está fresco.',
      ] },
      { t: 'p', text: 'Quanto ao prazo, uma primeira versão utilizável costuma levar de seis a doze semanas. Prazo bem menor que isso normalmente significa um escopo menor, e não um atalho.' },
      { t: 'p', text: 'Para empresas de Taubaté e da região, fazemos o levantamento presencialmente, porque ver a operação de perto encurta todas as etapas seguintes. Para o resto do Brasil, o mesmo processo funciona por vídeo.' },
    ],
    sources: [
      { name: 'Manifesto para Desenvolvimento Ágil de Software', url: 'https://agilemanifesto.org/iso/ptbr/manifesto.html' },
      { name: 'Lei Geral de Proteção de Dados (Lei 13.709/2018)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm' },
    ],
    related: ['planilha-ate-onde-vai', 'como-escolher-empresa-de-software'],
  },

  {
    slug: 'quanto-custa-criar-um-aplicativo',
    title: 'Quanto custa criar um aplicativo: o que entra na conta além do desenvolvimento',
    seo: {
      title: 'Quanto custa criar um aplicativo',
      description: 'O que define o custo de criar um aplicativo, as taxas das lojas, a atualização obrigatória todo ano e como começar com uma versão que cabe no orçamento.',
    },
    date: '2026-11-06',
    category: 'Aplicativos',
    excerpt: 'O preço de um app depende menos do número de telas e mais do que existe por trás delas. E há custos fixos que muita proposta esquece de citar.',
    body: [
      { t: 'p', text: 'Perguntar quanto custa um aplicativo é parecido com perguntar quanto custa uma casa. Depende do tamanho, do acabamento e, principalmente, do que existe por baixo e ninguém vê. Dois apps com a mesma quantidade de telas podem ter custos muito diferentes.' },
      { t: 'p', text: 'O que dá para fazer é mostrar o que pesa na conta, quais custos são fixos e como começar sem apostar o orçamento inteiro numa versão que ninguém testou.' },

      { t: 'h2', text: 'O que mais pesa no desenvolvimento' },
      { t: 'ul', items: [
        'Login e contas de usuário. Cadastro, recuperação de senha e perfis diferentes, como cliente, funcionário e administrador, parecem detalhe e são uma parte relevante do trabalho.',
        'Servidor e banco de dados. Se o app precisa guardar informação na nuvem, compartilhar dados entre pessoas ou receber dados do escritório, existe um sistema por trás dele, e esse sistema também é construído.',
        'Painel de gestão. Quase todo app de empresa precisa de uma tela no computador para alguém cadastrar, aprovar e acompanhar o que acontece no celular.',
        'Integrações com pagamento, emissão de nota, mapas ou ERP. Cada uma tem regras próprias e entra no orçamento à parte.',
        'Funcionamento offline. Guardar dados no aparelho e sincronizar depois, sem perder nem duplicar nada, é das partes mais trabalhosas, e das mais valiosas para quem trabalha em campo.',
      ] },
      { t: 'p', text: 'A boa notícia é que hoje um único projeto gera as versões Android e iOS. O que antes eram dois aplicativos, com duas equipes, virou um.' },

      { t: 'h2', text: 'Os custos fixos das lojas' },
      { t: 'p', text: 'Estes valores não dependem de quem desenvolve e deveriam aparecer em qualquer proposta:' },
      { t: 'ul', items: [
        'Google Play: taxa única de US$ 25 para abrir a conta de desenvolvedor. Contas pessoais novas precisam cumprir requisitos de teste antes de publicar, por isso vale abrir a conta já como organização, no nome da empresa.',
        'App Store: US$ 99 por ano no Apple Developer Program. Se a anuidade vencer, o app deixa de estar disponível na loja.',
        'Servidor: se o app tem um sistema por trás, existe um custo mensal de hospedagem, que cresce junto com o número de usuários.',
      ] },
      { t: 'p', text: 'As contas nas lojas devem ficar no nome da sua empresa. App publicado na conta do desenvolvedor é um app que não é seu, e transferir depois dá trabalho.' },

      { t: 'h2', text: 'A manutenção que não é opcional' },
      { t: 'p', text: 'Aplicativo não fica pronto e pronto. Todo ano, Android e iOS ganham versão nova, e as lojas passam a exigir que os apps acompanhem. No Google Play, desde 31 de agosto de 2026, apps novos e atualizações precisam ter como alvo o Android 16. Apps que ficam para trás deixam de aparecer para quem tem um aparelho mais novo.' },
      { t: 'p', text: 'Na prática, isso significa reservar no orçamento pelo menos uma atualização técnica por ano, mesmo que nenhuma função nova seja adicionada. Proposta que não fala disso está deixando a conta para depois.' },
      { t: 'quote', text: 'O app mais caro é o que foi pago inteiro e ninguém usa.' },

      { t: 'h2', text: 'Comece pela versão que resolve uma coisa' },
      { t: 'p', text: 'A forma mais segura de controlar o custo é não construir tudo de uma vez. A primeira versão deve fazer bem a tarefa que mais dói, ir para a loja e ser usada por gente de verdade. O que o uso mostrar define a segunda versão.' },
      { t: 'ol', items: [
        'Liste tudo o que o app deveria fazer.',
        'Marque o que, se faltar, impede o app de ser útil. Só isso entra na primeira versão.',
        'Defina como vai medir se deu certo: pedidos feitos pelo app, ordens de serviço fechadas, horas economizadas.',
        'Planeje a segunda versão só depois de algumas semanas de uso real.',
      ] },
      { t: 'note', title: 'Às vezes a resposta é um site', text: 'Se o público acessa de vez em quando e não precisa de câmera, GPS ou funcionamento sem internet, um site bem feito para celular resolve por uma fração do custo, sem taxa de loja e sem atualização obrigatória.' },

      { t: 'h2', text: 'Prazo e próximo passo' },
      { t: 'p', text: 'Projetos enxutos costumam levar de quatro a oito semanas até a publicação, contando o tempo de revisão das lojas. Para chegar a um valor, o caminho é uma conversa curta sobre o que o app precisa fazer e para quem. A partir dela, a proposta sai com escopo, prazo, valor e os custos fixos já listados.' },
      { t: 'p', text: 'Os nossos próprios apps, como o CalcFrete e o Prazzo, estão publicados na Google Play e na App Store e seguem as mesmas regras de atualização descritas aqui. É o mesmo processo que usamos nos projetos de clientes, em Taubaté, no Vale do Paraíba e no resto do Brasil.' },
    ],
    sources: [
      { name: 'Google Play Console — Taxa de registro da conta de desenvolvedor', url: 'https://support.google.com/googleplay/android-developer/answer/6112435?hl=pt-BR' },
      { name: 'Apple Developer Program', url: 'https://developer.apple.com/programs/' },
      { name: 'Android Developers — Requisito de nível desejado da API', url: 'https://developer.android.com/google/play/requirements/target-sdk?hl=pt-br' },
    ],
    related: ['aplicativo-proprio-para-equipe-em-campo', 'como-escolher-empresa-de-software'],
  },

  {
    slug: 'site-proprio-ou-so-instagram',
    title: 'Site próprio ou só Instagram: o que a sua empresa perde sem endereço na internet',
    seo: {
      title: 'Site próprio ou só Instagram?',
      description: 'Rede social é aluguel, site é endereço. O que muda para a empresa que só existe no Instagram e como sair disso sem virar um projeto gigante.',
    },
    date: '2026-08-28',
    category: 'Sites',
    excerpt: 'Quase toda empresa conectada está numa rede social, mas uma fatia bem menor tem site próprio. A diferença aparece na hora em que alguém procura pelo que você vende.',
    body: [
      { t: 'p', text: 'A pesquisa TIC Empresas, do Cetic.br, repete o mesmo retrato há anos: praticamente toda empresa brasileira conectada mantém perfil em alguma rede social, e uma parcela bem menor tem site próprio. Faz sentido. Abrir um perfil leva dez minutos e não custa nada. Só que os dois não fazem o mesmo trabalho.' },
      { t: 'p', text: 'Rede social é onde as pessoas passam o tempo. Site é onde elas vão quando já decidiram procurar. São dois momentos diferentes da mesma venda, e a maioria das empresas só ocupa o primeiro.' },

      { t: 'h2', text: 'O perfil é terreno alugado' },
      { t: 'p', text: 'Tudo que você publica numa rede social fica sob as regras de outra empresa. Quem enxerga o seu post é o algoritmo que decide. Se a conta for restringida por engano, e isso acontece, você perde o histórico, os comentários e o contato de quem te seguia, sem ninguém para reclamar. Não existe suporte por telefone.' },
      { t: 'p', text: 'No site, o endereço é seu, o conteúdo é seu e a lista de quem entrou em contato é sua. Se amanhã a rede social da vez mudar, o site continua no lugar.' },

      { t: 'h2', text: 'Ninguém pesquisa no Instagram por "conserto de ar-condicionado"' },
      { t: 'p', text: 'Esse é o ponto que mais custa dinheiro. Quando o cliente tem um problema agora, ele abre o Google e digita o que precisa junto com a cidade. Quem aparece nesse resultado é quem tem página indexada respondendo àquela busca. Perfil de rede social quase nunca aparece ali, e quando aparece é sem contexto, sem preço e sem prova.' },
      { t: 'p', text: 'Essa busca com intenção de compra é a mais barata que existe: o cliente já quer contratar. Você só precisa estar na lista.' },

      { t: 'h2', text: 'O combo que funciona' },
      { t: 'p', text: 'Para empresa local, o que dá resultado é a soma de três coisas, e não uma só:' },
      { t: 'ul', items: [
        'Perfil da Empresa no Google preenchido de verdade: horário, endereço, fotos recentes e avaliações respondidas. É o que aparece no mapa.',
        'Site próprio com uma página por serviço, cada uma respondendo a uma busca específica, em vez de uma página genérica falando de tudo.',
        'Rede social para manter presença e mostrar rotina, apontando de volta para o site.',
      ] },
      { t: 'p', text: 'O Google cruza as três informações. Quando nome, endereço e telefone batem nos três lugares, a sua empresa ganha confiança no resultado local.' },

      { t: 'h2', text: 'O mínimo que um site precisa ter' },
      { t: 'p', text: 'Site institucional não precisa ser grande. Precisa responder rápido a cinco perguntas de quem chega:' },
      { t: 'ol', items: [
        'O que vocês fazem, em uma frase que um leigo entenda.',
        'Para quem, para o visitante saber em dois segundos se é o caso dele.',
        'Qual a prova de que funciona: clientes, fotos do trabalho, números, avaliações.',
        'Quanto custa, ou pelo menos a faixa e como o orçamento é feito.',
        'Como falar com você agora, com o botão à vista em qualquer altura da página.',
      ] },
      { t: 'p', text: 'Se o seu site já responde a essas cinco, ele está fazendo o trabalho dele. O resto é melhoria.' },

      { t: 'note', title: 'Um teste rápido', text: 'Abra o seu site no celular, com dados móveis e não no Wi-Fi. Conte quantos segundos até dar para ler alguma coisa e quantos toques até chegar no contato. Se passar de três segundos ou de dois toques, é aí que está o vazamento.' },

      { t: 'h2', text: 'Por onde começar sem virar um projeto de seis meses' },
      { t: 'p', text: 'A armadilha comum é querer lançar o site completo, com blog, área do cliente e catálogo inteiro. Ele nunca fica pronto. O caminho mais rápido é publicar quatro páginas boas, uma para cada serviço principal, com contato direto, e ir crescendo a partir do que as pessoas realmente procuram.' },
      { t: 'p', text: 'A partir do momento em que o site está no ar, o Google Search Console mostra de graça por quais termos você já aparece. Essa lista costuma ser a melhor pauta possível para as próximas páginas.' },
    ],
    sources: [
      { name: 'Cetic.br — Pesquisa TIC Empresas', url: 'https://cetic.br/pesquisa/empresas/' },
      { name: 'Google — Dados estruturados para empresas locais', url: 'https://developers.google.com/search/docs/appearance/structured-data/local-business' },
    ],
    related: ['como-aparecer-no-google-maps', 'velocidade-do-site-e-dinheiro'],
  },

  {
    slug: 'velocidade-do-site-e-dinheiro',
    title: 'Meio segundo a mais e o cliente já foi: velocidade de site vira dinheiro',
    seo: {
      title: 'Velocidade de site vira dinheiro',
      description: 'O que a lentidão de um site custa em vendas, como medir isso com ferramentas gratuitas e quais são as três causas que aparecem em quase todo caso.',
    },
    date: '2026-08-14',
    category: 'Sites',
    excerpt: 'Estudos do Google mostram décimos de segundo mexendo na taxa de conversão. Como medir a velocidade do seu site sem chutar e o que costuma estar pesando.',
    body: [
      { t: 'p', text: 'Velocidade de site parece assunto técnico, dessas coisas que ficam para depois. Só que ela aparece direto no faturamento, e é das poucas melhorias em que dá para medir antes e depois com ferramenta gratuita.' },
      { t: 'p', text: 'O estudo Milliseconds Make Millions, que o Google publicou com a Deloitte em 2020, acompanhou dezenas de marcas por meses. Melhorias de apenas 0,1 segundo no carregamento em celular vieram acompanhadas de aumento de conversão na casa de 8% no varejo e de 10% em viagens. Décimo de segundo. Uma pesquisa anterior do próprio Google, com a SOASTA, mostrou que a chance de a pessoa desistir e voltar cresce cerca de 32% quando o carregamento vai de 1 para 3 segundos.' },
      { t: 'quote', text: 'A pessoa não pensa "esse site está lento". Ela só volta e clica no concorrente logo abaixo.' },

      { t: 'h2', text: 'As três métricas que o Google usa' },
      { t: 'p', text: 'Desde 2021 o Google avalia páginas por um conjunto chamado Core Web Vitals. São três medidas, com metas públicas:' },
      { t: 'ul', items: [
        'LCP, quanto tempo até o maior elemento da tela aparecer. Meta: até 2,5 segundos.',
        'INP, quanto o site demora para responder quando a pessoa toca ou clica. Meta: até 200 milissegundos.',
        'CLS, o quanto a página pula sozinha enquanto carrega. Meta: até 0,1.',
      ] },
      { t: 'p', text: 'O CLS é o mais subestimado dos três. É aquele efeito de você ir tocar num botão, a propaganda carregar acima e o dedo acertar outra coisa. Some junto com a paciência do visitante.' },

      { t: 'h2', text: 'Como medir sem chutar' },
      { t: 'p', text: 'Abra o PageSpeed Insights e cole o endereço de uma página interna, não só o da home. A ferramenta devolve duas coisas diferentes, e vale saber separar: os dados de laboratório, que são um teste simulado, e os dados de campo, que vêm de visitantes reais no Chrome nos últimos 28 dias. Os de campo são os que contam para o Google.' },
      { t: 'p', text: 'Se a sua página não tem dados de campo, é porque tem pouco tráfego. Nesse caso vale acompanhar o laboratório e repetir o teste sempre no mesmo horário, porque a medição varia bastante entre execuções.' },

      { t: 'note', title: 'Uma medição serve para pouca coisa', text: 'Rode o teste três vezes e use a mediana. Um resultado isolado, bom ou ruim, quase sempre é sorte ou azar da rede naquele instante.' },

      { t: 'h2', text: 'O que costuma estar pesando' },
      { t: 'p', text: 'Em site de empresa, quase sempre é uma dessas três, nessa ordem:' },
      { t: 'ol', items: [
        'Imagem grande demais. Foto de 4 MB saída da câmera, exibida num espaço de 400 pixels. Converter para WebP e gerar tamanhos diferentes para celular e desktop costuma cortar mais de 80% do peso sem diferença visível.',
        'Excesso de plugins e scripts de terceiros. Cada chat, pixel de anúncio, mapa e player carrega o próprio pacote de código. Some quanto isso pesa antes de instalar mais um.',
        'Fonte personalizada mal configurada. Sem o ajuste certo, o texto fica invisível enquanto a fonte baixa, e o visitante encara uma tela em branco com a conexão ruim.',
      ] },

      { t: 'h2', text: 'Dá para ficar rápido de verdade' },
      { t: 'p', text: 'Este site que você está lendo tira 99 de 100 no Lighthouse em desktop e mantém o CLS em zero, com as fontes hospedadas aqui mesmo, imagens em WebP em três tamanhos e as páginas geradas prontas no build, sem esperar o navegador montar tudo. Não é mágica nem ferramenta cara: é decisão de projeto tomada antes de a primeira linha ser escrita.' },
      { t: 'p', text: 'Se o seu site já está no ar e lento, a ordem que dá mais resultado por hora de trabalho é: comprimir as imagens, remover o que não é usado e só depois discutir troca de hospedagem.' },
    ],
    sources: [
      { name: 'Think with Google — Milliseconds Make Millions (2020)', url: 'https://www.thinkwithgoogle.com/' },
      { name: 'web.dev — Core Web Vitals', url: 'https://web.dev/articles/vitals' },
      { name: 'PageSpeed Insights', url: 'https://pagespeed.web.dev/' },
    ],
    related: ['quanto-custa-um-site-profissional', 'site-proprio-ou-so-instagram'],
  },

  {
    slug: 'planilha-ate-onde-vai',
    title: 'Até onde a planilha aguenta: quando trocar o Excel por um sistema',
    seo: {
      title: 'Até onde a planilha aguenta',
      description: 'Planilha resolve muita coisa até parar de resolver. Os sinais de que a sua empresa passou do ponto e como migrar sem parar a operação no meio.',
    },
    date: '2026-07-31',
    category: 'Sistemas web',
    excerpt: 'Planilha é ferramenta boa e barata. O problema começa quando ela vira o sistema oficial da empresa sem nunca ter sido projetada para isso.',
    body: [
      { t: 'p', text: 'Vale começar reconhecendo o óbvio: planilha é uma das melhores ferramentas já inventadas. É rápida de montar, todo mundo sabe mexer e resolve problema de verdade. Boa parte das empresas que atendemos deveria continuar usando planilha para várias coisas.' },
      { t: 'p', text: 'O problema é outro. É quando a planilha deixa de ser rascunho e vira, sem ninguém decidir isso, o sistema oficial da empresa. A partir daí ela passa a ser cobrada por algo que nunca foi projetada para fazer.' },

      { t: 'h2', text: 'Os sinais de que passou do ponto' },
      { t: 'ul', items: [
        'Existe mais de uma versão do arquivo circulando, e alguém precisa dizer qual é a certa.',
        'Uma pessoa só entende as fórmulas. Quando ela sai de férias, a empresa trava.',
        'O mesmo dado é digitado duas ou três vezes, em lugares diferentes, por pessoas diferentes.',
        'Ninguém consegue dizer quem alterou aquele número, nem quando.',
        'Não dá para dar acesso parcial: ou a pessoa vê tudo, ou não vê nada.',
        'Fechar o mês virou um trabalho de dois dias de recortar, colar e conferir.',
      ] },
      { t: 'p', text: 'Um sinal isolado não quer dizer nada. Três ou quatro juntos significam que a planilha já está custando mais caro que um sistema, só que o custo aparece em hora de trabalho e em erro, e não numa fatura.' },

      { t: 'h2', text: 'O que um sistema entrega que a planilha não entrega' },
      { t: 'p', text: 'Não é tela bonita. São quatro coisas estruturais:' },
      { t: 'ol', items: [
        'Um dado, um lugar. Todo mundo lê e escreve na mesma base, ao mesmo tempo, sem versão paralela.',
        'Regras que impedem o erro na entrada. O campo não aceita data inválida, o pedido não fecha sem cliente, o estoque não fica negativo.',
        'Permissão por pessoa. O vendedor vê os clientes dele, o financeiro vê os valores, o dono vê tudo.',
        'Histórico. Fica registrado quem mudou o quê e quando, e isso resolve discussão em vez de criar.',
      ] },
      { t: 'p', text: 'A consequência prática é que o relatório deixa de ser uma tarefa. Ele passa a existir o tempo todo, porque os dados já estão organizados no formato certo.' },

      { t: 'note', title: 'Não comece pelo sistema inteiro', text: 'Escolha o processo que mais dói hoje e resolva só ele. Um sistema que faz uma coisa bem e entra em uso em seis semanas vale mais que um projeto completo que ninguém usa porque ainda está sendo feito.' },

      { t: 'h2', text: 'Como migrar sem parar a empresa' },
      { t: 'p', text: 'A migração é a parte que dá medo, com razão. O caminho que funciona é sempre o mesmo:' },
      { t: 'ol', items: [
        'Mapear o processo como ele é hoje, e não como deveria ser. Sistema que automatiza um processo idealizado não é usado.',
        'Importar o histórico da planilha já na primeira versão. Sistema que começa vazio parece um retrocesso para quem usa.',
        'Rodar em paralelo por algumas semanas, com a planilha ainda de pé como rede de segurança.',
        'Desligar a planilha numa data combinada. Sem essa data, a empresa fica anos mantendo os dois.',
      ] },

      { t: 'h2', text: 'E quando a planilha continua sendo a resposta' },
      { t: 'p', text: 'Se o cálculo muda toda semana, se é você sozinho que usa, se é análise pontual e não rotina, fique com a planilha. Sistema serve para processo repetido, com mais de uma pessoa envolvida e com consequência quando erra. Fora disso, é gastar dinheiro para engessar algo que funcionava solto.' },
    ],
    sources: [
      { name: 'Sebrae — Gestão e tecnologia para pequenas empresas', url: 'https://sebrae.com.br/' },
    ],
    related: ['como-funciona-a-criacao-de-um-sistema', 'sistema-sob-medida-ou-assinatura'],
  },

  {
    slug: 'aplicativo-proprio-para-equipe-em-campo',
    title: 'Aplicativo próprio deixou de ser coisa de startup',
    seo: {
      title: 'App próprio para equipe em campo',
      description: 'Onde um aplicativo próprio se paga numa empresa comum: equipe em campo, trabalho sem sinal e dados que hoje chegam por foto no WhatsApp.',
    },
    date: '2026-07-17',
    category: 'Aplicativos',
    excerpt: 'A conta de um app fechou quando ele deixou de ser vitrine e passou a ser ferramenta de trabalho da equipe que está na rua.',
    body: [
      { t: 'p', text: 'Por muito tempo, aplicativo próprio era decisão de empresa grande ou de startup com investidor. O custo não fechava para o resto. Isso mudou por um motivo bem prático: hoje um mesmo código gera as versões Android e iOS, e o que antes eram dois projetos virou um.' },
      { t: 'p', text: 'Mas a mudança mais importante não foi de custo. Foi de finalidade. O app que se paga numa empresa comum quase nunca é o app de vitrine, aquele que só repete o site. É o app que a equipe usa para trabalhar.' },

      { t: 'h2', text: 'Onde a conta fecha' },
      { t: 'p', text: 'Os casos em que o aplicativo se paga rápido têm quase sempre uma característica em comum: alguém trabalha fora do escritório e hoje manda informação por foto no WhatsApp.' },
      { t: 'ul', items: [
        'Técnico em visita: ordem de serviço, checklist, foto do antes e do depois e assinatura do cliente na tela, tudo num registro só.',
        'Motorista e transporte: rota, despesa, comprovante e cálculo de frete lançados na hora, sem papel para digitar depois.',
        'Vistoria e inspeção: formulário com foto obrigatória, data e localização que ninguém consegue preencher errado depois.',
        'Vendedor externo: catálogo atualizado, pedido que já entra no sistema e histórico do cliente na mão.',
      ] },
      { t: 'p', text: 'Em todos, o ganho não é o app em si. É a informação chegar estruturada, em vez de chegar como mensagem solta que alguém no escritório vai transcrever.' },

      { t: 'h2', text: 'Offline é o que separa app de site' },
      { t: 'p', text: 'Essa é a pergunta que mais define se vale um aplicativo ou se um site que funciona bem no celular já resolve. Se a equipe trabalha em galpão, estrada, subsolo ou zona rural, o site simplesmente não abre quando o sinal cai. O app guarda no aparelho e sincroniza sozinho quando a conexão volta.' },
      { t: 'p', text: 'É exatamente o que o CalcFrete faz para motorista autônomo e o que o Prazzo faz com os prazos: o trabalho não para porque a internet parou. Os dois são produtos nossos, publicados nas lojas, e servem de laboratório para o que entregamos em projeto de cliente.' },
      { t: 'p', text: 'A outra diferença prática é o acesso ao aparelho: câmera com foto marcada, GPS, leitura de código de barras, notificação que chega mesmo com o app fechado e biometria para entrar. Site no celular faz parte disso, mas com limite.' },

      { t: 'note', title: 'Quando o site basta', text: 'Se ninguém trabalha sem sinal, se não precisa de câmera nem GPS e se a pessoa acessa uma vez por mês, um site responsivo entrega o mesmo por uma fração do custo, sem loja e sem atualização para instalar.' },

      { t: 'h2', text: 'O que muita gente esquece de somar' },
      { t: 'p', text: 'Publicar não é o fim do projeto. Entram na conta, todo ano: as contas de desenvolvedor nas duas lojas, a atualização obrigatória quando Android e iOS sobem de versão, e a revisão das lojas antes de cada envio, que leva de um a sete dias e precisa entrar no planejamento de qualquer data de lançamento.' },
      { t: 'p', text: 'Nada disso é impeditivo. Só precisa estar no orçamento desde o começo, e não aparecer como surpresa seis meses depois.' },

      { t: 'h2', text: 'Comece pequeno de propósito' },
      { t: 'p', text: 'A versão que vai para a loja primeiro deve fazer uma coisa só, a que mais dói. Ela entra em uso, a equipe reclama do que falta, e essa reclamação vale mais que qualquer reunião de levantamento de requisitos. A partir daí você constrói o que as pessoas realmente pedem, e não o que foi imaginado antes de existir uso.' },
    ],
    sources: [
      { name: 'Google Play Console — Publicação e revisão', url: 'https://play.google.com/console/about/' },
      { name: 'Apple — App Review Guidelines', url: 'https://developer.apple.com/app-store/review/guidelines/' },
    ],
    related: ['quanto-custa-criar-um-aplicativo', 'whatsapp-nao-e-sistema'],
  },

  {
    slug: 'whatsapp-nao-e-sistema',
    title: 'O WhatsApp resolve o primeiro contato. Não resolve a operação',
    seo: {
      title: 'WhatsApp não é sistema',
      description: 'O WhatsApp é o melhor canal de entrada que uma empresa brasileira tem. O problema aparece quando ele também vira o cadastro, a agenda e o histórico.',
    },
    date: '2026-07-03',
    category: 'Sistemas web',
    excerpt: 'Atender pelo WhatsApp é certo. Guardar a operação inteira dentro dele é o que faz pedido sumir, cliente ficar sem resposta e histórico ir embora com o celular do vendedor.',
    body: [
      { t: 'p', text: 'No Brasil, o WhatsApp está instalado em praticamente todo celular com internet. Nenhum outro canal chega perto disso. Empresa que atende por lá está certa, e quem insiste em obrigar o cliente a preencher formulário de dez campos está perdendo venda por teimosia.' },
      { t: 'p', text: 'A confusão é outra: o WhatsApp é ótimo como porta de entrada e péssimo como sistema. E é muito fácil ele virar sistema sem que ninguém tenha decidido isso.' },

      { t: 'h2', text: 'Onde a conversa começa a custar caro' },
      { t: 'ul', items: [
        'O pedido está no meio de uma conversa de 200 mensagens. Achar de novo leva dez minutos, e às vezes não acha.',
        'O histórico do cliente mora no celular de quem atendeu. Se essa pessoa sai da empresa, sai com tudo.',
        'Ninguém consegue dizer quantos orçamentos foram enviados no mês, quantos fecharam e quanto tempo levou a resposta.',
        'Dois atendentes respondem coisas diferentes ao mesmo cliente, porque nenhum viu o que o outro escreveu.',
        'Dado pessoal de cliente espalhado por aparelhos particulares é um problema concreto de LGPD, e não teoria.',
      ] },
      { t: 'p', text: 'Nada disso é culpa do WhatsApp. Ele foi feito para conversa entre pessoas, e faz isso muito bem. Só não foi feito para ser cadastro, agenda e relatório ao mesmo tempo.' },

      { t: 'quote', text: 'Se a informação só existe dentro de uma conversa, ela não existe para a empresa.' },

      { t: 'h2', text: 'O arranjo que funciona' },
      { t: 'p', text: 'A ideia não é tirar o cliente do WhatsApp. É deixar o WhatsApp como porta e colocar algo atrás dela.' },
      { t: 'ol', items: [
        'O link do site já chega identificado. Um botão por página leva a mensagem pronta dizendo de onde a pessoa veio, e você para de perguntar "como chegou até nós".',
        'Pedido e orçamento saem da conversa e entram numa tela. Pode ser um formulário curto que você mesmo preenche enquanto conversa. O importante é o registro nascer estruturado.',
        'A conta vira WhatsApp Business, e não número pessoal. Isso permite mais de um atendente no mesmo número, com histórico compartilhado.',
        'O sistema avisa. Confirmação de pedido, lembrete de agendamento e aviso de status saem automáticos, e o atendente sobra para o que exige gente.',
      ] },

      { t: 'note', title: 'Comece pelo mais barato', text: 'Antes de qualquer integração, coloque no site um botão de WhatsApp por serviço, cada um com mensagem própria. Você passa a saber qual página gera contato. É meia hora de trabalho e responde a uma pergunta que a maioria das empresas não sabe responder.' },

      { t: 'h2', text: 'Quanto disso vale a pena para a sua empresa' },
      { t: 'p', text: 'Se você atende cinco clientes por semana e fecha tudo na conversa, deixe como está. A partir de umas dezenas de atendimentos por mês, ou de duas pessoas atendendo o mesmo número, a conta vira em poucas semanas, porque o que se ganha não é conforto: é pedido que deixa de sumir.' },
    ],
    sources: [
      { name: 'Lei Geral de Proteção de Dados (Lei 13.709/2018)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm' },
      { name: 'WhatsApp Business — Recursos para empresas', url: 'https://business.whatsapp.com/' },
    ],
    related: ['planilha-ate-onde-vai', 'aplicativo-proprio-para-equipe-em-campo'],
  },

  {
    slug: 'sistema-sob-medida-ou-assinatura',
    title: 'Sistema sob medida ou assinatura: como comparar de verdade',
    seo: {
      title: 'Sob medida ou assinatura?',
      description: 'A comparação certa não é preço de entrada contra mensalidade. É custo total em cinco anos, encaixe no seu processo e o que custa sair depois.',
    },
    date: '2026-06-19',
    category: 'Sistemas web',
    excerpt: 'Software pronto quase sempre parece mais barato na primeira planilha. O que muda a resposta é justamente o que ninguém coloca nela.',
    body: [
      { t: 'p', text: 'A pergunta chega quase sempre no mesmo formato: "vale mais a pena assinar um sistema pronto ou mandar fazer um do meu jeito?". A resposta honesta é que depende de três coisas, e nenhuma delas é o preço de entrada.' },

      { t: 'h2', text: 'Primeira: o processo é seu diferencial ou é igual ao de todo mundo?' },
      { t: 'p', text: 'Emissão fiscal, folha de pagamento e contabilidade são iguais em toda empresa, porque a lei é a mesma para todo mundo. Mandar fazer isso sob medida é gastar dinheiro para reinventar algo que já existe pronto, testado e atualizado quando a legislação muda. Assine.' },
      { t: 'p', text: 'Agora, se o jeito como você calcula preço, monta rota, controla produção ou atende cliente é o que faz a sua empresa ganhar do concorrente, encaixar isso num sistema genérico significa abrir mão justamente do que te diferencia. Aí o sob medida se paga.' },

      { t: 'h2', text: 'Segunda: como o preço cresce' },
      { t: 'p', text: 'Assinatura quase sempre cobra por usuário por mês. É ótimo com cinco pessoas e passa a incomodar com trinta. Faça a conta com o número de usuários que você espera ter daqui a três anos, e não com o de hoje.' },
      { t: 'p', text: 'Um exemplo simples: R$ 60 por usuário, com 25 usuários, dá R$ 18 mil por ano. Em cinco anos, R$ 90 mil, sem contar reajuste. Isso muda bastante a leitura de um projeto sob medida, com custo de desenvolvimento uma vez e manutenção anual. Os números da sua empresa vão ser outros, mas a conta é essa.' },

      { t: 'h2', text: 'Terceira: o que custa sair' },
      { t: 'p', text: 'Essa é a que ninguém coloca na planilha. Antes de assinar, pergunte ao fornecedor: consigo exportar todos os meus dados, em formato aberto, quando quiser? Existe API? Se a resposta for vaga, o custo de sair é alto, e daqui a três anos você vai negociar reajuste sem ter para onde ir.' },
      { t: 'p', text: 'No sob medida, isso se resolve por contrato: código, banco e hospedagem no nome da sua empresa. É uma cláusula, não uma negociação anual.' },

      { t: 'note', title: 'O custo escondido dos dois lados', text: 'Assinatura tem implantação, integração com o que você já usa, treinamento e o preço por usuário subindo. Sob medida tem manutenção, hospedagem e evolução. Comparar só mensalidade contra orçamento de projeto sempre dá a resposta errada.' },

      { t: 'h2', text: 'A resposta que mais aparece na prática' },
      { t: 'p', text: 'Na maioria das empresas que atendemos, a saída não é escolher um lado. É assinar o que é padrão e mandar fazer o que é seu, com os dois conversando por integração. O sistema fiscal continua sendo o de sempre; o que roda a sua operação é feito para ela.' },
      { t: 'p', text: 'Se quiser testar essa hipótese sem risco, faça a lista dos sistemas que a empresa paga hoje e marque quais o time abre todo dia e quais ninguém abre. Essa lista costuma responder sozinha por onde começar.' },
    ],
    sources: [
      { name: 'Sebrae — Custos e gestão para pequenas empresas', url: 'https://sebrae.com.br/' },
    ],
    related: ['como-escolher-empresa-de-software', 'planilha-ate-onde-vai'],
  },
];

// Âncora de cada subtítulo. NFD + remoção de acentos dá o mesmo resultado no
// Node do prerender e no navegador, então o id do HTML e o do link sempre batem.
export function headingId(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Subtítulos do artigo, na ordem, prontos para virar sumário.
export const outline = (post) => post.body.filter((b) => b.t === 'h2').map((b) => ({ id: headingId(b.text), text: b.text }));

export const postPath = (slug) => `/blog/${slug}/`;

export const postBySlug = (slug) => posts.find((p) => p.slug === slug);

// Do mais novo para o mais antigo, independente da ordem em que foram escritos.
export const postsByDate = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));

const WORDS_PER_MINUTE = 200;

export function postText(post) {
  return post.body
    .flatMap((b) => [b.text, b.title, ...(b.items ?? [])])
    .filter(Boolean)
    .join(' ');
}

export function wordCount(post) {
  return postText(post).split(/\s+/).filter(Boolean).length;
}

export const readingMinutes = (post) => Math.max(1, Math.round(wordCount(post) / WORDS_PER_MINUTE));

// "28 de agosto de 2026" — Intl resolveria isso, mas o resultado precisa ser
// idêntico no prerender (Node) e no navegador, então a tabela fica explícita.
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function formatDate(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}

// Artigos sugeridos no fim da página: os declarados em `related` e, se faltar,
// completa com os mais recentes que não sejam o próprio.
export function relatedPosts(post, quantidade = 2) {
  const escolhidos = (post.related ?? []).map(postBySlug).filter(Boolean);
  const resto = postsByDate().filter((p) => p.slug !== post.slug && !escolhidos.includes(p));
  return [...escolhidos, ...resto].slice(0, quantidade);
}
