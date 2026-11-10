import manifesto from '../../data/generated/screens.json';

const base = import.meta.env.BASE_URL;
const PHONE = 19.5 / 9;

// <picture> com AVIF e WebP responsivos, gerados por scripts/assets/screens.mjs.
// `src` é o caminho sem largura nem extensão; `widths` vem do índice gerado.
function Picture({ src, widths, ratio, alt, sizes, eager }) {
  const set = (ext) => widths.map((w) => `${src}-${w}.${ext} ${w}w`).join(', ');
  const menor = widths[0];
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={`${src}-${widths.at(-1)}.webp`}
        srcSet={set('webp')}
        sizes={sizes}
        alt={alt}
        width={menor}
        height={Math.round(menor * ratio)}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}

// Tela de app (proporção de celular).
export function AppScreen({ app, id, alt, sizes = '(min-width: 64rem) 240px, 40vw', eager = false }) {
  const tela = manifesto.apps[app]?.find((t) => t.id === id);
  if (!tela) return null;
  return <Picture src={`${base}img/apps/${app}/${id}`} widths={tela.widths} ratio={PHONE} alt={alt} sizes={sizes} eager={eager} />;
}

// Captura de case: `formato` é 'desktop' (16:10) ou 'mobile' (celular).
export function CaseShot({ slug, formato, alt = '', sizes }) {
  const widths = manifesto.cases[slug]?.[formato];
  if (!widths) return null;
  const ratio = formato === 'desktop' ? 900 / 1440 : PHONE;
  return <Picture src={`${base}img/cases/${slug}-${formato}`} widths={widths} ratio={ratio} alt={alt} sizes={sizes} />;
}

export const hasScreens = (app) => Boolean(manifesto.apps[app]?.length);
