// Visual dos cases: cor do painel (tirada da identidade de cada produto), cor do
// texto sobre ela e quais telas reais aparecem, na ordem. As telas são as geradas
// por scripts/assets/screens.mjs (ids "01", "02"... na ordem dos originais).
//
// `tinta` é a cor do texto da etiqueta sobre `cor`, escolhida pelo contraste
// (AA, ≥ 4,5:1): branco nos tons escuros, grafite no laranja.
export const appCases = {
  calcfrete: {
    cor: '#1E63E9',
    tinta: '#FFFFFF',
    telas: [
      { id: '02', alt: 'Ferramentas do CalcFrete: calculadora de frete, combustível, checklist e diário de bordo' },
      { id: '01', alt: 'Tela de entrada do CalcFrete' },
      { id: '03', alt: 'Ações rápidas do CalcFrete: receita, despesa, abastecimento, pedágio e lembrete' },
    ],
  },
  'contador-de-cantos': {
    cor: '#E85A1B',
    tinta: '#0E0F13',
    telas: [
      { id: '02', alt: 'Cronômetro e contagem de cantos no Contador de Cantos' },
      { id: '01', alt: 'Tela de abertura do Contador de Cantos' },
    ],
  },
  prazzo: {
    cor: '#5A4FE0',
    tinta: '#FFFFFF',
    telas: [
      { id: '02', alt: 'Lista de pagamentos a receber no Prazzo' },
      { id: '01', alt: 'Painel do Prazzo com valores a receber e vencidos' },
      { id: '04', alt: 'Lista de clientes no Prazzo' },
    ],
  },
  trama: {
    cor: '#557559',
    tinta: '#FFFFFF',
    telas: [
      { id: '03', alt: 'Partida em andamento no Trama, com palavras cruzadas na tela' },
      { id: '01', alt: 'Tela inicial do Trama' },
      { id: '02', alt: 'Escolha do modo de jogo no Trama' },
    ],
  },
  cascata: {
    cor: '#3A2BB5',
    tinta: '#FFFFFF',
    telas: [
      { id: '02', alt: 'Tabuleiro de uma partida do Cascata' },
      { id: '01', alt: 'Tela inicial do Cascata' },
      { id: '03', alt: 'Escolha do modo de jogo no Cascata' },
    ],
  },
};

// Case de site: cores do próprio escritório (marinho e dourado).
export const webCases = {
  'advalice-camargo': { cor: '#141B2D', etiqueta: '#C9A43A', tinta: '#0E0F13' },
};
