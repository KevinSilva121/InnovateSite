// Blog da Innovate Apps. Conteúdo escrito à mão, sem CMS: para publicar um artigo
// novo, acrescente um objeto no topo de `posts` e pronto — rota, sitemap, JSON-LD,
// listagem e "leia também" saem daqui automaticamente.
//
// Campos:
//   slug        vira a URL /blog/<slug>/. Só minúsculas, números e hífen.
//   title       título da página (H1). Pode ser longo.
//   seo.title   título curto da aba e do Google. Máx. 41 caracteres: o site
//               prefixa "InnovateApps Co. | " e o limite total é 60.
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
    related: ['velocidade-do-site-e-dinheiro', 'whatsapp-nao-e-sistema'],
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
    related: ['site-proprio-ou-so-instagram', 'planilha-ate-onde-vai'],
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
    related: ['sistema-sob-medida-ou-assinatura', 'whatsapp-nao-e-sistema'],
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
    related: ['whatsapp-nao-e-sistema', 'planilha-ate-onde-vai'],
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
    related: ['planilha-ate-onde-vai', 'velocidade-do-site-e-dinheiro'],
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
