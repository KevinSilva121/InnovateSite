import styles from './ValeMap.module.css';

// Mapa esquemático do Vale do Paraíba e do Litoral Norte. As cidades ficam nas
// coordenadas reais (lat/long projetadas com correção de cos(lat)); rio e costa
// são traçados simplificados. É decorativo: a lista de cidades ao lado é a
// versão acessível, então o SVG inteiro fica aria-hidden.
const OESTE = -46.08;
const NORTE = -22.62;
const ESCALA = 440;
const COS = Math.cos((23.2 * Math.PI) / 180);
const xy = (lat, lon) => [(lon - OESTE) * COS * ESCALA, (NORTE - lat) * ESCALA];
const f = (n) => n.toFixed(1);
const linha = (pts) => `M${pts.map(([lat, lon]) => xy(lat, lon).map(f).join(' ')).join('L')}`;

// [nome, lat, lon, posição do rótulo]
const CIDADES = [
  ['Taubaté', -23.026, -45.556, 'sede'],
  ['Tremembé', -22.958, -45.549, 'esquerda'],
  ['São José dos Campos', -23.179, -45.887, 'abaixo-direita'],
  ['Pindamonhangaba', -22.924, -45.462, 'direita'],
  ['Caçapava', -23.101, -45.707, 'abaixo'],
  ['Jacareí', -23.305, -45.966, 'direita'],
  ['Guaratinguetá', -22.816, -45.193, 'direita'],
  ['Lorena', -22.731, -45.124, 'esquerda-acima'],
  ['Campos do Jordão', -22.739, -45.591, 'acima'],
  ['Ubatuba', -23.434, -45.083, 'esquerda-acima'],
  ['Caraguatatuba', -23.62, -45.413, 'esquerda'],
];

const ROTULO = {
  sede: { dx: 14, dy: 20, anchor: 'start' },
  esquerda: { dx: -11, dy: 4, anchor: 'end' },
  'esquerda-acima': { dx: -9, dy: -8, anchor: 'end' },
  direita: { dx: 11, dy: 4, anchor: 'start' },
  acima: { dx: 0, dy: -12, anchor: 'middle' },
  abaixo: { dx: 0, dy: 20, anchor: 'middle' },
  'abaixo-direita': { dx: 10, dy: 18, anchor: 'start' },
};

const RIO = [[-23.33, -46.02], [-23.29, -45.96], [-23.21, -45.91], [-23.15, -45.86], [-23.1, -45.76], [-23.07, -45.7], [-23.02, -45.6], [-22.97, -45.53], [-22.92, -45.46], [-22.89, -45.37], [-22.85, -45.25], [-22.8, -45.19], [-22.74, -45.11], [-22.68, -45.0]];
const COSTA = [[-23.74, -45.55], [-23.66, -45.43], [-23.6, -45.36], [-23.52, -45.2], [-23.45, -45.07], [-23.38, -44.95]];
const MERIDIANOS = [-46, -45.75, -45.5, -45.25, -45];
const PARALELOS = [-22.75, -23, -23.25, -23.5, -23.75];
const grau = (v, hemi) => {
  const a = Math.abs(v);
  const g = Math.floor(a);
  const m = Math.round((a - g) * 60);
  return `${g}°${String(m).padStart(2, '0')}'${hemi}`;
};

const [L, A] = [470, 502];

export default function ValeMap({ className = '' }) {
  return (
    <svg className={[styles.map, className].filter(Boolean).join(' ')} viewBox={`0 0 ${L} ${A}`} aria-hidden="true" focusable="false" data-sem-entrada="">
      <g className={styles.grade}>
        {MERIDIANOS.map((lon) => {
          const [x] = xy(NORTE, lon);
          return (
            <g key={lon}>
              <line x1={f(x)} y1="0" x2={f(x)} y2={A} />
              <text x={f(x + 4)} y="12">{grau(lon, 'O')}</text>
            </g>
          );
        })}
        {PARALELOS.map((lat) => {
          const [, y] = xy(lat, OESTE);
          return (
            <g key={lat}>
              <line x1="0" y1={f(y)} x2={L} y2={f(y)} />
              <text x="4" y={f(y - 4)}>{grau(lat, 'S')}</text>
            </g>
          );
        })}
      </g>

      <path className={styles.costa} d={linha(COSTA)} />
      <path className={styles.rio} d={linha(RIO)} />

      {/* Legenda no canto vazio, em vez de rótulos sobre os traços. */}
      <g className={styles.legenda}>
        <line className={styles.rio} x1="14" y1="430" x2="40" y2="430" />
        <text x="48" y="433">Rio Paraíba do Sul</text>
        <line className={styles.costa} x1="14" y1="450" x2="40" y2="450" />
        <text x="48" y="453">Litoral Norte</text>
        <rect className={styles.marcaSede} x="22" y="465" width="10" height="10" />
        <text x="48" y="474">Sede</text>
      </g>

      {CIDADES.map(([nome, lat, lon, pos]) => {
        const [x, y] = xy(lat, lon);
        const r = ROTULO[pos];
        const sede = pos === 'sede';
        return (
          <g key={nome} className={sede ? styles.sede : styles.cidade}>
            {sede ? <rect className={styles.pulso} x={f(x - 9)} y={f(y - 9)} width="18" height="18" /> : null}
            <rect x={f(x - (sede ? 5 : 3.5))} y={f(y - (sede ? 5 : 3.5))} width={sede ? 10 : 7} height={sede ? 10 : 7} />
            <text x={f(x + r.dx)} y={f(y + r.dy)} textAnchor={r.anchor}>{sede ? `${nome} · sede` : nome}</text>
          </g>
        );
      })}
    </svg>
  );
}
