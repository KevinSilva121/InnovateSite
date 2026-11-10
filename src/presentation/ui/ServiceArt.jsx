import { useRef } from 'react';
import { useProgressoRolagem } from '../hooks/useProgressoRolagem.js';
import styles from './ServiceArt.module.css';

// Ilustrações isométricas em linha (wireframe) dos três serviços, desenhadas por
// código: cada cena é montada com caixas e planos em coordenadas 3D e projetada
// em isometria (30°). Nada de imagem: é SVG puro, leve e nítido em qualquer tela.
//
// Eixos: x vai para a direita e para baixo, y para a esquerda e para baixo, z para
// cima. As faces visíveis de uma caixa são a de cima (+z), a direita (+x) e a
// esquerda (+y). Faces "sólidas" são pintadas com a cor do fundo e escondem o que
// está atrás; por isso as cenas desenham do fundo para a frente.
//
// Animação:
// 1. Montagem presa à rolagem: a cena é dividida em peças (chão, aparelho,
//    conteúdo da tela, peças soltas) que começam espalhadas, como numa vista
//    explodida, e se encaixam conforme a página rola, até a cena ficar completa.
//    Rolando para cima, desmontam. Cada peça tem a sua janela de rolagem e o seu
//    ponto de partida em 3D (de), convertido para a tela na mesma isometria.
// 2. Montada e na tela: as peças soltas flutuam, os fios tracejados "correm"
//    como dados, o LED do servidor pisca e o gráfico se redesenha.
// Sem JS, ou com "reduzir movimento", a cena fica montada e parada.
const U = 13;
const CX = Math.cos(Math.PI / 6) * U;
const SY = Math.sin(Math.PI / 6) * U;
const fmt = (n) => n.toFixed(1);
const naTela = ([x, y, z]) => [(x - y) * CX, (x + y) * SY - z * U];

function montar(desenho) {
  const grupos = [];
  let atual = null;
  const pontos = [];
  const P = (x, y, z) => {
    const p = naTela([x, y, z]);
    pontos.push(p);
    return p;
  };
  const caminho = (pts, fechar = true) => `M${pts.map(([a, b]) => `${fmt(a)} ${fmt(b)}`).join('L')}${fechar ? 'Z' : ''}`;
  const add = (d, o) => atual.formas.push({ d, tipo: o?.tipo ?? 'linha', acento: Boolean(o?.acento), efeito: o?.efeito });

  const api = {
    // Tudo o que é desenhado dentro de fn monta junto.
    //   janela: trecho da rolagem (0 a 1) em que a peça entra
    //   de: de onde ela vem, em unidades 3D ([0, 0, 4] = 4 unidades acima)
    //   repouso: 'flutua' depois de montada; fase desencontra as que flutuam
    grupo: (fn, { janela = [0, 1], de = [0, 0, 0], repouso, fase = 0 } = {}) => {
      const [dx, dy] = naTela(de);
      atual = { formas: [], janela, dx, dy, repouso, fase };
      grupos.push(atual);
      fn();
    },
    planoX: (x, y0, z0, y1, z1, o) => add(caminho([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x, y0, z1)]), o),
    planoY: (y, x0, z0, x1, z1, o) => add(caminho([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)]), o),
    planoZ: (z, x0, y0, x1, y1, o) => add(caminho([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]), o),
    linha: (pts, o) => add(caminho(pts.map(([x, y, z]) => P(x, y, z)), false), o),
    caixa: (x, y, z, w, d, h, o) => {
      const s = { tipo: 'solido', ...o };
      api.planoX(x + w, y, z, y + d, z + h, s);
      api.planoY(y + d, x, z, x + w, z + h, s);
      api.planoZ(z + h, x, y, x + w, y + d, s);
    },
  };
  desenho(api);

  const xs = pontos.map((p) => p[0]);
  const ys = pontos.map((p) => p[1]);
  const m = 6; // folga para as peças que flutuam não encostarem na borda
  const x0 = Math.min(...xs) - m;
  const y0 = Math.min(...ys) - m;
  return { grupos, viewBox: `${fmt(x0)} ${fmt(y0)} ${fmt(Math.max(...xs) - x0 + m)} ${fmt(Math.max(...ys) - y0 + m)}` };
}

// Site: janela de navegador em pé, com cabeçalho, bloco principal, imagem e
// três cartões; um componente "solto" na frente, como se saísse da página.
const sites = montar(({ grupo, caixa, planoY, planoZ, linha }) => {
  grupo(() => planoZ(0, -1.5, -1, 18.5, 6.5, { tipo: 'chao' }), { janela: [0, 0.3] });
  const y = 0.5;
  // A janela do navegador desce até o chão.
  grupo(() => {
    caixa(0, 0, 0, 12, 0.5, 8.4);
    linha([[0, y, 7.3], [12, y, 7.3]]);
    planoY(y, 0.5, 7.65, 0.9, 8.05, { tipo: 'cheio', acento: true });
    planoY(y, 1.2, 7.65, 1.6, 8.05);
    planoY(y, 1.9, 7.65, 2.3, 8.05);
    planoY(y, 3.2, 7.6, 9.6, 8.05);
  }, { janela: [0.08, 0.45], de: [0, 0, 6] });
  // O conteúdo da página sai da tela, na direção de quem olha, e se assenta.
  grupo(() => {
    linha([[0.9, y, 6.4], [6.2, y, 6.4]]);
    linha([[0.9, y, 5.8], [5.2, y, 5.8]]);
    linha([[0.9, y, 5.2], [4.3, y, 5.2]]);
    planoY(y, 0.9, 3.9, 3.5, 4.55, { tipo: 'cheio', acento: true });
  }, { janela: [0.32, 0.62], de: [0, 4, 0] });
  grupo(() => {
    planoY(y, 7, 3.7, 11.2, 6.6);
    linha([[7, y, 3.7], [11.2, y, 6.6]]);
    linha([[7, y, 6.6], [11.2, y, 3.7]]);
  }, { janela: [0.38, 0.68], de: [0, 4, 0] });
  grupo(() => {
    planoY(y, 0.9, 0.8, 3.8, 3.0);
    planoY(y, 4.55, 0.8, 7.45, 3.0);
    planoY(y, 8.2, 0.8, 11.1, 3.0);
  }, { janela: [0.44, 0.74], de: [0, 4, 0] });
  grupo(() => linha([[14.8, 3.6, 0], [14.8, 3.6, 3.2]], { tipo: 'guia' }), { janela: [0.62, 0.8] });
  // O componente solto chega por último, de cima e da direita.
  grupo(() => {
    caixa(13, 2.2, 3.2, 3.6, 2.8, 0.45, { acento: true });
    linha([[13.6, 2.8, 3.65], [16, 2.8, 3.65]]);
    linha([[13.6, 3.6, 3.65], [15.2, 3.6, 3.65]]);
    linha([[13.6, 4.4, 3.65], [14.6, 4.4, 3.65]]);
  }, { janela: [0.6, 0.95], de: [4, 0, 5], repouso: 'flutua' });
});

// App: celular em pé com grade de ícones, notificação flutuando e dois blocos
// (ícones) soltos ao lado.
const aplicativos = montar(({ grupo, caixa, planoY, planoZ, linha }) => {
  grupo(() => planoZ(0, -1.5, -1.5, 11.5, 6.5, { tipo: 'chao' }), { janela: [0, 0.3] });
  const y = 0.55;
  grupo(() => {
    caixa(0, 0, 0, 4.4, 0.55, 9);
    planoY(y, 0.35, 0.6, 4.05, 8.4);
    planoY(y, 1.6, 7.85, 2.8, 8.1, { tipo: 'cheio' });
  }, { janela: [0.08, 0.45], de: [0, 0, 7] });
  // Os ícones saem da tela e se encaixam na grade, uma fileira de cada vez.
  for (let linhaGrade = 0; linhaGrade < 3; linhaGrade += 1) {
    grupo(() => {
      for (let coluna = 0; coluna < 3; coluna += 1) {
        const x0 = 0.75 + coluna * 1.15;
        const z0 = 6.3 - linhaGrade * 1.2;
        const destaque = linhaGrade === 0 && coluna === 1;
        planoY(y, x0, z0, x0 + 0.8, z0 + 0.8, destaque ? { tipo: 'cheio', acento: true, efeito: 'pisca' } : undefined);
      }
    }, { janela: [0.32 + linhaGrade * 0.06, 0.6 + linhaGrade * 0.06], de: [0, 3.5, 0] });
  }
  grupo(() => {
    linha([[0.35, y, 1.7], [4.05, y, 1.7]]);
    planoY(y, 1.75, 0.95, 2.65, 1.35);
  }, { janela: [0.5, 0.75], de: [0, 3.5, 0] });
  grupo(() => linha([[4.4, 0.25, 6.3], [5.6, 1.4, 6.3]], { tipo: 'guia' }), { janela: [0.66, 0.82] });
  grupo(() => {
    caixa(5.6, 1.2, 6.1, 4.6, 2.1, 0.32, { acento: true });
    planoZ(6.42, 6.0, 1.55, 6.7, 2.25, { tipo: 'cheio', acento: true });
    linha([[7.1, 1.6, 6.42], [9.7, 1.6, 6.42]]);
    linha([[7.1, 2.2, 6.42], [8.8, 2.2, 6.42]]);
  }, { janela: [0.58, 0.9], de: [4, 0, 3], repouso: 'flutua' });
  grupo(() => caixa(6.4, 3.6, 2.4, 1.3, 1.3, 1.3), { janela: [0.64, 0.94], de: [0, 0, 6], repouso: 'flutua', fase: 1 });
  grupo(() => caixa(8.6, 3.2, 0.6, 1.0, 1.0, 1.0, { acento: true }), { janela: [0.7, 1], de: [0, 0, 8], repouso: 'flutua', fase: 2 });
});

// Sistema: pilha de servidores com indicadores, painel com gráfico de barras e
// linha, e o fio que liga os dois.
const sistemas = montar(({ grupo, caixa, planoX, planoY, planoZ, linha }) => {
  grupo(() => planoZ(0, -1.5, -4, 16.5, 7, { tipo: 'chao' }), { janela: [0, 0.3] });
  const y = -2.6;
  // O painel desliza para o lugar; as barras sobem; a linha do gráfico vem depois.
  grupo(() => caixa(7.5, -3, 0, 7.5, 0.4, 6.2), { janela: [0.08, 0.42], de: [5, 0, 0] });
  grupo(() => {
    [[8.2, 2.6], [9.5, 3.8], [10.8, 3.1], [12.1, 4.6], [13.4, 2.2]].forEach(([x0, topo], i) => {
      planoY(y, x0, 0.8, x0 + 0.8, topo, i === 2 ? { tipo: 'cheio', acento: true } : undefined);
    });
  }, { janela: [0.34, 0.62], de: [0, 3, 0] });
  grupo(() => {
    linha([[8.2, y, 4.9], [9.6, y, 5.4], [11, y, 5.0], [12.4, y, 5.65], [14.3, y, 5.3]], { acento: true, efeito: 'grafico' });
  }, { janela: [0.5, 0.72], de: [0, 3, 0] });
  // Os três servidores descem e se empilham, um de cada vez.
  [0, 1.5, 3.0].forEach((z, i) => {
    grupo(() => {
      caixa(0, 0, z, 5.5, 5.5, 1.1);
      planoX(5.5, 0.6, z + 0.35, 1.0, z + 0.75, z === 3.0 ? { tipo: 'cheio', acento: true, efeito: 'pisca' } : undefined);
      planoX(5.5, 1.3, z + 0.35, 1.7, z + 0.75);
      linha([[5.5, 2.4, z + 0.55], [5.5, 4.8, z + 0.55]]);
    }, { janela: [0.14 + i * 0.14, 0.46 + i * 0.14], de: [0, 0, 7 + i * 1.5] });
  });
  grupo(() => linha([[5.5, 2.75, 4.1], [6.5, 1.0, 4.1], [7.5, -1.2, 3.4]], { tipo: 'guia' }), { janela: [0.74, 0.9] });
  grupo(() => planoZ(4.1, 1.2, 1.2, 4.3, 4.3), { janela: [0.76, 0.96], de: [0, 0, 2] });
});

const CENAS = { sites, aplicativos, 'sistemas-web': sistemas };

// A cena monta enquanto o topo da ilustração vai de 95% a 35% da altura da tela.
const ROLAGEM = { marcador: 0.95, faixa: 0.6 };

export default function ServiceArt({ kind, className = '' }) {
  const ref = useRef(null);
  useProgressoRolagem(ref, ROLAGEM);
  const cena = CENAS[kind];
  if (!cena) return null;
  return (
    <svg
      ref={ref}
      className={[styles.art, className].filter(Boolean).join(' ')}
      viewBox={cena.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      {cena.grupos.map((g, i) => (
        <g
          key={i}
          className={styles.peca}
          // Janela alongada: cada peça começa um pouco antes e termina mais tarde
          // que o trecho nominal, então uma entra enquanto a anterior ainda assenta.
          style={{ '--ini': Math.max(0, g.janela[0] - 0.05), '--fim': Math.min(1, g.janela[1] + 0.14), '--dx': g.dx.toFixed(1), '--dy': g.dy.toFixed(1) }}
        >
          <g className={g.repouso ? styles[g.repouso] : undefined} style={g.repouso ? { '--fase': g.fase } : undefined}>
            {g.formas.map((f, j) => (
              <path
                key={j}
                d={f.d}
                pathLength={f.efeito === 'grafico' ? 1 : undefined}
                className={[styles[f.tipo], f.acento ? styles.acento : '', f.efeito ? styles[f.efeito] : ''].filter(Boolean).join(' ')}
              />
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}
