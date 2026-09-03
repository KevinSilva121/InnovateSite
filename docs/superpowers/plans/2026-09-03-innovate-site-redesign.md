# Innovate Apps Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-page neon site with a multi-page, prerendered, SEO-optimized institutional site for Innovate Apps Co. (Taubaté-SP), styled from the logo (navy + cream + amber).

**Architecture:** React 18 + Vite 5 with `react-router` v7. `npm run build` runs a client build, an SSR build, and `scripts/prerender.mjs`, which writes one fully rendered `index.html` per route into `dist/` (plus `404.html`, `sitemap.xml`, `robots.txt`). Content is static data under `src/data/`; SEO head/JSON-LD are pure functions under `src/seo/`; UI is CSS Modules + global tokens. GitHub Actions deploys `dist/` to GitHub Pages; two repository variables switch to a custom domain later.

**Tech Stack:** React 18, Vite 5, react-router 7, vitest 3 + @testing-library/react, CSS Modules, lucide-react, sharp (asset scripts only), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-03-innovate-site-redesign-design.md` — read it first. All copy is Brazilian Portuguese; the executor writes code and commit messages in the style of the existing repo.

## Global Constraints

- Repo root for all commands: `InnovateSite/` (the folder that contains `package.json`). Branch: `redesign/site-2026-09`.
- Node 24 / npm 11. Windows host: npm scripts run in cmd.exe — no shell globs, no `&&` chains inside scripts beyond what is written here.
- `base` must be `process.env.VITE_BASE ?? '/'` — never `'./'`.
- No runtime requests to `fonts.googleapis.com`; fonts are local woff2 in `public/fonts/`.
- No `framer-motion`, no inline `style=` props, no gradients, no colored shadows, no custom cursor.
- Palette tokens (exact): `--navy-900:#010D33`, `--navy-700:#152352`, `--ink:#0B1230`, `--ink-muted:#4A5273`, `--paper:#F3F0E8`, `--paper-2:#E9E6DE`, `--amber:#F0A030`, `--amber-ink:#3A2300`.
- Fonts: headings `Bricolage Grotesque`, body `Instrument Sans`.
- Exactly one `<h1>` per page. `<html lang="pt-BR">`.
- Titles ≤ 60 chars ending in `| Innovate Apps`; descriptions ≤ 155 chars.
- Internal route paths carry a trailing slash (`/aplicativos/`) so canonicals match what GitHub Pages serves (deviation from spec §6, which said "no trailing slash": GH Pages 301-redirects `/x` → `/x/`, so the slash form is the canonical one).
- Copy tone: direct PT-BR, "você", no "transformação digital"/"vanguarda"/"disruptivo". Mention Taubaté and Vale do Paraíba naturally.
- Contact fields (`whatsapp`, `email`, `social.instagram`, `social.linkedin`) start empty. Empty WhatsApp ⇒ CTAs link to `/contato/`. Empty fields never render and never enter JSON-LD.
- Commit after every task with a conventional-commit message; end each commit body with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Verified facts (do not re-probe): `react-router@7.18.x` exports `StaticRouter`, `BrowserRouter`, `NavLink`, `Link`, `Routes`, `Route`, `useLocation`. Fontsource files: `node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2`, `node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2`. Badge URLs and Play icon CDN in Task 11 return HTTP 200.

## File Structure

| Path | Responsibility |
|---|---|
| `index.html` | HTML shell: lang, favicons, font preloads, `<!--app-head-->`, `<div id="root"><!--app-html--></div>` |
| `vite.config.js` | plugins, `base` from env, vitest config |
| `src/config/site.js` | single source of company data + `contactHref()`, `sameAsLinks()` |
| `src/data/content/cities.js` | ordered list of cities served (Taubaté first) |
| `src/data/content/services.js` | 3 services: copy, bullets, audience, deliverables, FAQ, SEO fields |
| `src/data/content/process.js` | 4 process steps |
| `src/data/content/faq.js` | home FAQ (6 items) |
| `src/domain/entities/Project.js` | `Project` (app or web case) with `platforms` getter |
| `src/domain/usecases/GetProjects.js` | sync use case with `{ type }` filter |
| `src/data/repositories/ProjectRepository.js` | static data: 4 apps + Advalice |
| `src/seo/jsonld.js` | pure builders: `localBusiness`, `webSite`, `breadcrumb`, `faqPage`, `service`, `softwareAppList`, `graph` |
| `src/seo/pages.js` | per-route meta: `pages` map + `pageByPath()` |
| `src/seo/buildHead.js` | `buildHead(meta, site)` → `<head>` tag string |
| `src/routes.jsx` | route table: `{ path, page, Component }` |
| `src/App.jsx` | `<Layout><Routes/></Layout>` |
| `src/entry-client.jsx` | hydrate/createRoot + `js` class |
| `src/entry-server.jsx` | `render(path)`, `renderNotFound()`, `routePaths`, `siteUrl` |
| `src/presentation/styles/{fonts,tokens,base,utilities,index}.css` | global CSS |
| `src/presentation/ui/*` | `Button`, `Section`, `SectionHeading`, `Breadcrumb`, `StoreBadges` |
| `src/presentation/hooks/{useDocumentMeta,useScrollReveal}.js` | client behaviors |
| `src/presentation/layout/{Navbar,Footer,Layout}.jsx` | chrome |
| `src/presentation/sections/*` | `Hero`, `TrustStrip`, `ServicesGrid`, `AppsShowcase`, `WebCase`, `Process`, `LocalArea`, `Faq`, `CtaBand` |
| `src/presentation/pages/*` | `Home`, `ServicePage`, `Sobre`, `Contato`, `NotFound` |
| `scripts/lib/prerender-utils.mjs` | pure helpers: `outFileFor`, `sitemapXml`, `robotsTxt` |
| `scripts/prerender.mjs` | build step that writes `dist/**/index.html`, `404.html`, `sitemap.xml`, `robots.txt` |
| `scripts/assets/{fonts,app-icons,logo,og}.mjs` | one-off asset generators (outputs committed) |
| `scripts/dev/screenshot.mjs` | headless-Chrome screenshot helper for verification |
| `tests/**` | vitest suites (see tasks) |
| `.github/workflows/deploy.yml` | GitHub Pages deploy |
| `README.md` | run/test/deploy/domain docs |

Deleted in Task 1: `src/main.jsx`, `src/presentation/App.jsx`, `src/presentation/components/**`, `src/presentation/assets/index.css`, and the five AI-render PNGs (`blurred_hologram_bg.png`, `galaxy_bg.png`, `hero_3d_rings.png`, `it_tech_bg.png`, `services_tech.png`). Keep `src/presentation/assets/logo-ai.png` (source for Task 11).

---

### Task 1: Tooling foundation

**Files:**
- Modify: `package.json`, `vite.config.js`, `.gitignore`
- Create: `tests/setup.js`, `tests/smoke.test.js`
- Delete: files listed under "Deleted in Task 1"

**Interfaces:**
- Produces: `npm test` (vitest, jsdom, excludes `tests/build/**`), `npm run test:build`, `npm run build` (three-stage; the prerender script is created in Task 10, so `build` fails until then — expected), `import.meta.env.BASE_URL` respected everywhere.

- [ ] **Step 1: Swap dependencies**

```bash
cd InnovateSite
npm uninstall framer-motion
npm i react-router@7
npm i -D vitest@3 jsdom@26 @testing-library/react@16 @testing-library/jest-dom@6 sharp@0.34 @fontsource-variable/bricolage-grotesque @fontsource-variable/instrument-sans
```

- [ ] **Step 2: Replace the `scripts` block in `package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build && vite build --ssr src/entry-server.jsx --outDir dist/server && node scripts/prerender.mjs",
  "preview": "vite preview",
  "test": "vitest run --exclude tests/build/**",
  "test:watch": "vitest --exclude tests/build/**",
  "test:build": "vitest run tests/build",
  "assets": "node scripts/assets/fonts.mjs && node scripts/assets/app-icons.mjs && node scripts/assets/logo.mjs"
}
```

Also set `"version": "1.0.0"`.

- [ ] **Step 3: Write `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: false,
  },
});
```

- [ ] **Step 4: Test setup and a smoke test**

`tests/setup.js`:
```js
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Sem `globals: true` a testing-library não registra o cleanup sozinha.
afterEach(cleanup);
```

`tests/smoke.test.js`:
```js
import { describe, it, expect } from 'vitest';

describe('toolchain', () => {
  it('runs vitest with jsdom', () => {
    expect(typeof document).toBe('object');
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `npm test`
Expected: `1 passed`.

- [ ] **Step 6: Delete the old presentation layer**

```bash
git rm -r src/main.jsx src/presentation/App.jsx src/presentation/components src/presentation/assets/index.css
git rm src/presentation/assets/blurred_hologram_bg.png src/presentation/assets/galaxy_bg.png src/presentation/assets/hero_3d_rings.png src/presentation/assets/it_tech_bg.png src/presentation/assets/services_tech.png
```

Append to `.gitignore`:
```
# vitest / lighthouse output
coverage
lighthouse-*.json
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: vitest, react-router, fontsource; remove framer-motion and old UI"
```

---

### Task 2: Site config and cities

**Files:**
- Create: `src/data/content/cities.js`, `src/config/site.js`
- Test: `tests/config/site.test.js`

**Interfaces:**
- Produces: `site` object `{ name, shortName, url, description, whatsapp, email, address:{locality,region,country}, areaServed:string[], social:{instagram,linkedin,github}, stores:{play,appStore}, founder }`; `contactHref(site, message?) → string` (wa.me URL or `/contato/`); `sameAsLinks(site) → string[]`; `cities: string[]`.

- [ ] **Step 1: Write the failing tests**

`tests/config/site.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { site, contactHref, sameAsLinks } from '../../src/config/site.js';
import { cities } from '../../src/data/content/cities.js';

describe('site config', () => {
  it('has the required identity fields', () => {
    expect(site.name).toBe('Innovate Apps Co.');
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith('/')).toBe(false);
    expect(site.address).toEqual({ locality: 'Taubaté', region: 'SP', country: 'BR' });
  });

  it('serves Taubaté first and at least 8 cities', () => {
    expect(cities[0]).toBe('Taubaté');
    expect(cities.length).toBeGreaterThanOrEqual(8);
    expect(site.areaServed).toBe(cities);
  });

  it('whatsapp, when set, is E.164 digits without plus', () => {
    if (site.whatsapp) expect(site.whatsapp).toMatch(/^55\d{10,11}$/);
  });

  it('contactHref falls back to /contato/ when whatsapp is empty', () => {
    expect(contactHref({ ...site, whatsapp: '' })).toBe('/contato/');
  });

  it('contactHref builds a wa.me link with encoded message', () => {
    const href = contactHref({ ...site, whatsapp: '5512999999999' }, 'Olá, quero um orçamento');
    expect(href).toBe('https://wa.me/5512999999999?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento');
  });

  it('sameAsLinks skips empty social fields', () => {
    const links = sameAsLinks({ ...site, social: { instagram: '', linkedin: '', github: 'https://github.com/x' } });
    expect(links).toEqual([site.stores.play, site.stores.appStore, 'https://github.com/x']);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/config`
Expected: FAIL — cannot resolve `src/config/site.js`.

- [ ] **Step 3: Implement**

`src/data/content/cities.js`:
```js
// Ordem importa: Taubaté é a sede e aparece primeiro em todo lugar.
export const cities = [
  'Taubaté',
  'São José dos Campos',
  'Pindamonhangaba',
  'Caçapava',
  'Jacareí',
  'Tremembé',
  'Guaratinguetá',
  'Lorena',
  'Campos do Jordão',
  'Ubatuba',
  'Caraguatatuba',
];
```

`src/config/site.js`:
```js
import { cities } from '../data/content/cities.js';

const FALLBACK_URL = 'https://kevinsilva121.github.io/InnovateSite';

export const site = {
  name: 'Innovate Apps Co.',
  shortName: 'Innovate Apps',
  url: (import.meta.env.VITE_SITE_URL || FALLBACK_URL).replace(/\/$/, ''),
  description:
    'Desenvolvimento de sites, sistemas web e aplicativos Android e iOS em Taubaté, SP, para empresas do Vale do Paraíba.',
  whatsapp: '', // E.164 sem "+", ex.: "5512999999999"
  email: '',
  address: { locality: 'Taubaté', region: 'SP', country: 'BR' },
  areaServed: cities,
  social: {
    instagram: '',
    linkedin: '',
    github: 'https://github.com/kevinsilva121',
  },
  stores: {
    play: 'https://play.google.com/store/apps/developer?id=InnovateApps+Co.',
    appStore: 'https://apps.apple.com/br/developer/kevin-silva/id6797971217',
  },
  founder: 'Kevin Silva',
};

export const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Innovate Apps e quero conversar sobre um projeto.';

export function contactHref(config, message = DEFAULT_WHATSAPP_MESSAGE) {
  if (!config.whatsapp) return '/contato/';
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function sameAsLinks(config) {
  return [config.stores.play, config.stores.appStore, config.social.github, config.social.instagram, config.social.linkedin].filter(Boolean);
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- tests/config`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add src/config src/data/content/cities.js tests/config
git commit -m "feat: site config with contact helpers and cities served"
```

---

### Task 3: Project entity, repository, use case

**Files:**
- Modify: `src/domain/entities/Project.js`, `src/domain/usecases/GetProjects.js`, `src/data/repositories/ProjectRepository.js`
- Test: `tests/domain/projects.test.js`

**Interfaces:**
- Produces: `new Project({...})` with fields `id, slug, title, type:'app'|'web', category, tagline, desc, url, icon, stores:{play,appStore}` and getter `platforms → ('Android'|'iOS')[]`; `new ProjectRepository().getProjects()` (sync, returns `Project[]`); `new GetProjects(repo).execute({ type }?)` (sync).
- Icon paths: `${import.meta.env.BASE_URL}apps/<slug>.webp` — files created in Task 11.

- [ ] **Step 1: Write the failing tests**

`tests/domain/projects.test.js`:
```js
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

  it('returns four apps with icons and Play Store links', () => {
    const apps = useCase.execute({ type: 'app' });
    expect(apps.map((a) => a.slug)).toEqual(['calcfrete', 'contador-de-cantos', 'prazzo', 'trama']);
    for (const app of apps) {
      expect(app.icon).toMatch(/\/apps\/[a-z-]+\.webp$/);
      expect(app.stores.play).toContain('play.google.com/store/apps/details?id=');
      expect(app.tagline.length).toBeLessThanOrEqual(90);
    }
  });

  it('only Trama lacks an App Store link', () => {
    const apps = useCase.execute({ type: 'app' });
    expect(apps.filter((a) => !a.stores.appStore).map((a) => a.slug)).toEqual(['trama']);
  });

  it('returns Advalice as the single web case', () => {
    const web = useCase.execute({ type: 'web' });
    expect(web).toHaveLength(1);
    expect(web[0].url).toBe('https://advalicecamargo.com.br/');
  });

  it('returns everything without a filter', () => {
    expect(useCase.execute()).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/domain`
Expected: FAIL (`platforms` undefined; `execute` returns a Promise).

- [ ] **Step 3: Implement**

`src/domain/entities/Project.js`:
```js
export class Project {
  constructor({ id, slug, title, type, category = '', tagline = '', desc = '', url = null, icon = null, stores = {} }) {
    this.id = id;
    this.slug = slug;
    this.title = title;
    this.type = type; // 'app' | 'web'
    this.category = category;
    this.tagline = tagline;
    this.desc = desc;
    this.url = url;
    this.icon = icon;
    this.stores = { play: stores.play ?? null, appStore: stores.appStore ?? null };
  }

  get platforms() {
    const list = [];
    if (this.stores.play) list.push('Android');
    if (this.stores.appStore) list.push('iOS');
    return list;
  }
}
```

`src/domain/usecases/GetProjects.js`:
```js
export class GetProjects {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  execute({ type } = {}) {
    const all = this.projectRepository.getProjects();
    return type ? all.filter((p) => p.type === type) : all;
  }
}
```

`src/data/repositories/ProjectRepository.js`:
```js
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
```

- [ ] **Step 4: Run tests**

Run: `npm test -- tests/domain`
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add src/domain src/data/repositories tests/domain
git commit -m "feat: sync project repository with published apps and web case"
```

---
### Task 4: Static content (services, process, FAQ)

**Files:**
- Create: `src/data/content/services.js`, `src/data/content/process.js`, `src/data/content/faq.js`
- Test: `tests/content/content.test.js`

**Interfaces:**
- Produces: `services: Service[]` where `Service = { slug, path, number, name, shortName, summary, bullets:string[3], hero:{title,lead}, audience:{name,text}[], deliverables:{title,text}[], proof:'apps'|'web', faq:{q,a}[], seo:{title,description,serviceType} }`; `serviceBySlug(slug)`; `processSteps: {number,title,text}[]`; `homeFaq: {q,a}[]`.

- [ ] **Step 1: Write the failing test**

`tests/content/content.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { services, serviceBySlug } from '../../src/data/content/services.js';
import { processSteps } from '../../src/data/content/process.js';
import { homeFaq } from '../../src/data/content/faq.js';

const BANNED = /transforma[çc][ãa]o digital|vanguarda|disruptiv/i;

describe('services content', () => {
  it('has the three services in order with trailing-slash paths', () => {
    expect(services.map((s) => s.slug)).toEqual(['aplicativos', 'sites', 'sistemas-web']);
    expect(services.map((s) => s.path)).toEqual(['/aplicativos/', '/sites/', '/sistemas-web/']);
    expect(services.map((s) => s.number)).toEqual(['01', '02', '03']);
  });

  it.each(services)('$slug is complete and within SEO limits', (s) => {
    expect(s.bullets).toHaveLength(3);
    expect(s.audience.length).toBeGreaterThanOrEqual(3);
    expect(s.deliverables.length).toBeGreaterThanOrEqual(4);
    expect(s.faq.length).toBeGreaterThanOrEqual(4);
    expect(['apps', 'web']).toContain(s.proof);
    expect(s.seo.title.length).toBeLessThanOrEqual(60);
    expect(s.seo.title).toMatch(/\| Innovate Apps$/);
    expect(s.seo.description.length).toBeLessThanOrEqual(155);
    expect(s.hero.title).toMatch(/Taubaté|Vale do Paraíba|sua empresa/);
    const text = JSON.stringify(s);
    expect(text).not.toMatch(BANNED);
  });

  it('serviceBySlug finds and misses', () => {
    expect(serviceBySlug('sites').name).toMatch(/Sites/);
    expect(serviceBySlug('nope')).toBeUndefined();
  });
});

describe('process and faq', () => {
  it('has four numbered steps', () => {
    expect(processSteps.map((p) => p.number)).toEqual(['01', '02', '03', '04']);
  });
  it('home FAQ has six items with non-empty answers', () => {
    expect(homeFaq).toHaveLength(6);
    for (const item of homeFaq) expect(item.a.length).toBeGreaterThan(40);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/content`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/data/content/services.js`**

```js
export const services = [
  {
    slug: 'aplicativos',
    path: '/aplicativos/',
    number: '01',
    name: 'Aplicativos Android e iOS',
    shortName: 'Aplicativos',
    summary: 'Do primeiro rascunho à publicação na Google Play e na App Store. Já fizemos isso com os nossos próprios apps.',
    bullets: ['Android e iOS com um só código', 'Publicação nas duas lojas incluída', 'Funciona offline quando precisa'],
    hero: {
      title: 'Desenvolvimento de aplicativos Android e iOS em Taubaté',
      lead: 'Criamos apps para empresas do Vale do Paraíba que precisam colocar um produto na mão do cliente ou da equipe — e cuidamos da publicação nas lojas.',
    },
    audience: [
      { name: 'Comércio e serviços', text: 'Pedidos, agendamento, fidelidade e catálogo no celular do cliente.' },
      { name: 'Transportadoras e autônomos', text: 'Cálculo de frete, controle de viagens e financeiro na estrada, como o CalcFrete.' },
      { name: 'Equipes em campo', text: 'Checklists, ordens de serviço e fotos sincronizadas quando a internet volta.' },
      { name: 'Quem tem uma ideia de app', text: 'Validação rápida, versão inicial enxuta e evolução conforme o uso real.' },
    ],
    deliverables: [
      { title: 'App nas duas lojas', text: 'Um único projeto gera as versões Android e iOS. Cuidamos das contas de desenvolvedor, ícones, capturas e revisão.' },
      { title: 'Design pensado para o uso', text: 'Telas simples, fluxo curto e componentes nativos. Nada de manual de instruções.' },
      { title: 'Offline e sincronização', text: 'Dados guardados no aparelho e sincronizados quando há conexão, como no Prazzo e no CalcFrete.' },
      { title: 'Painel web quando faz sentido', text: 'Um sistema web para a gestão ver o que acontece no app, com o mesmo banco de dados.' },
      { title: 'Manutenção e novas versões', text: 'Atualizações de sistema, novas funções e acompanhamento das avaliações nas lojas.' },
    ],
    proof: 'apps',
    faq: [
      { q: 'Quanto custa desenvolver um aplicativo?', a: 'Depende do que o app precisa fazer. Um app enxuto, com poucas telas e sem painel web, é bem diferente de um sistema completo. Depois de uma conversa de 30 minutos conseguimos dar uma faixa de valor e prazo.' },
      { q: 'Quanto tempo leva até estar nas lojas?', a: 'Projetos simples levam de 4 a 8 semanas até a publicação. A revisão da Apple e do Google leva de 1 a 7 dias e já entra no planejamento.' },
      { q: 'Vocês publicam o app no meu nome?', a: 'Sim. Criamos ou usamos as contas de desenvolvedor da sua empresa na Google Play e na App Store, para que o app seja seu.' },
      { q: 'O app funciona sem internet?', a: 'Quando faz sentido para o uso, sim. Nossos próprios apps guardam os dados no aparelho e sincronizam depois.' },
      { q: 'Vocês atendem fora de Taubaté?', a: 'Sim. Atendemos presencialmente no Vale do Paraíba e remotamente em todo o Brasil.' },
    ],
    seo: {
      title: 'Desenvolvimento de Aplicativos em Taubaté | Innovate Apps',
      description: 'Desenvolvimento de aplicativos Android e iOS em Taubaté e Vale do Paraíba. Publicação nas lojas incluída. Apps publicados na Google Play e App Store.',
      serviceType: 'Desenvolvimento de aplicativos móveis',
    },
  },
  {
    slug: 'sites',
    path: '/sites/',
    number: '02',
    name: 'Sites profissionais',
    shortName: 'Sites',
    summary: 'Site rápido, bonito e feito para aparecer no Google quando alguém da região procura o que você faz.',
    bullets: ['Otimizado para busca local', 'Carrega rápido no celular', 'Você recebe o acesso e o código'],
    hero: {
      title: 'Criação de sites profissionais em Taubaté',
      lead: 'Sites para empresas do Vale do Paraíba que precisam ser encontradas no Google e passar confiança no primeiro clique.',
    },
    audience: [
      { name: 'Escritórios e clínicas', text: 'Advocacia, contabilidade, odontologia e consultórios que vivem de indicação e busca.' },
      { name: 'Comércio e prestadores', text: 'Loja, oficina, salão, assistência técnica: quem precisa aparecer em "perto de mim".' },
      { name: 'Indústria e B2B', text: 'Catálogo de produtos, certificações e canal de contato para compradores.' },
    ],
    deliverables: [
      { title: 'SEO local desde o início', text: 'Estrutura, títulos, textos e dados estruturados pensados para buscas como "em Taubaté" e "no Vale do Paraíba".' },
      { title: 'Design próprio', text: 'Sem template pronto. Identidade visual da sua empresa aplicada com cuidado em tipografia, cores e imagens.' },
      { title: 'Performance', text: 'Páginas leves, imagens otimizadas e notas altas no Google PageSpeed — no celular também.' },
      { title: 'Contato direto', text: 'WhatsApp, telefone e mapa em destaque. O site existe para gerar conversa.' },
      { title: 'Hospedagem e domínio', text: 'Configuramos domínio, hospedagem e certificado. Você fica com todos os acessos.' },
    ],
    proof: 'web',
    faq: [
      { q: 'Quanto custa um site profissional?', a: 'Um site institucional de poucas páginas tem um valor fechado. Sites com catálogo, área do cliente ou integrações são orçados por escopo. Passamos o valor depois de entender o que você precisa.' },
      { q: 'Em quanto tempo o site fica pronto?', a: 'Sites institucionais ficam prontos em 2 a 4 semanas, contando a produção de textos e imagens.' },
      { q: 'O site vai aparecer no Google?', a: 'O site nasce preparado para isso: estrutura correta, textos com as buscas certas e dados para o Google entender sua empresa e sua região. O posicionamento cresce com o tempo e com conteúdo.' },
      { q: 'Posso atualizar o site sozinho?', a: 'Sim. Definimos juntos o que você vai editar e entregamos uma forma simples de fazer isso, ou cuidamos das atualizações por você.' },
    ],
    seo: {
      title: 'Criação de Sites em Taubaté | Innovate Apps',
      description: 'Criação de sites profissionais em Taubaté e Vale do Paraíba, otimizados para o Google e rápidos no celular. Design próprio, sem template.',
      serviceType: 'Criação de sites',
    },
  },
  {
    slug: 'sistemas-web',
    path: '/sistemas-web/',
    number: '03',
    name: 'Sistemas web sob medida',
    shortName: 'Sistemas web',
    summary: 'Cadastro, pedidos, ordens de serviço, financeiro: o sistema que a sua operação precisa, sem pagar por função que não usa.',
    bullets: ['Feito para o seu processo', 'Acesso de qualquer lugar', 'Integra com o que você já usa'],
    hero: {
      title: 'Sistemas web sob medida para a sua empresa',
      lead: 'Desenvolvemos sistemas web em Taubaté para empresas do Vale do Paraíba que cresceram além da planilha e do caderno.',
    },
    audience: [
      { name: 'Operação e serviços', text: 'Ordens de serviço, agenda, controle de equipe e histórico por cliente.' },
      { name: 'Vendas e financeiro', text: 'Pedidos, estoque, contas a receber e relatórios que a gestão consegue ler.' },
      { name: 'Indústria e logística', text: 'Apontamento de produção, expedição e rastreio de entregas.' },
      { name: 'Quem já tem sistema', text: 'Integrações, automações e substituição gradual de sistemas antigos.' },
    ],
    deliverables: [
      { title: 'Levantamento do processo', text: 'Entendemos como o trabalho acontece hoje antes de desenhar qualquer tela.' },
      { title: 'Sistema web responsivo', text: 'Funciona no computador, no tablet e no celular, com acesso por usuário e permissão.' },
      { title: 'Integrações', text: 'WhatsApp, e-mail, emissão de notas, meios de pagamento e APIs de terceiros.' },
      { title: 'Automação com IA quando ajuda', text: 'Leitura de documentos, classificação de mensagens e respostas automáticas — só onde economiza tempo de verdade.' },
      { title: 'Suporte e evolução', text: 'Correções, ajustes e novas funções conforme a operação muda.' },
    ],
    proof: 'web',
    faq: [
      { q: 'Sistema sob medida ou software pronto?', a: 'Se um software pronto resolve, indicamos ele. Sob medida vale a pena quando o processo é específico, quando o pronto cobra por usuário demais ou quando as integrações não existem.' },
      { q: 'Quanto tempo leva um sistema web?', a: 'Uma primeira versão utilizável costuma levar de 6 a 12 semanas. Entregamos por etapas para você usar o sistema enquanto ele evolui.' },
      { q: 'Onde o sistema fica hospedado?', a: 'Em nuvem, em conta da sua empresa, com backup automático. Você é dono dos dados e do código.' },
      { q: 'Vocês integram com o meu ERP ou sistema atual?', a: 'Sim, desde que ele ofereça alguma forma de integração (API, banco de dados ou exportação). Avaliamos isso no levantamento.' },
    ],
    seo: {
      title: 'Sistemas Web sob Medida em Taubaté | Innovate Apps',
      description: 'Desenvolvimento de sistemas web sob medida em Taubaté e Vale do Paraíba: pedidos, ordens de serviço, financeiro e integrações. Feito para o seu processo.',
      serviceType: 'Desenvolvimento de sistemas web',
    },
  },
];

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug);
```

- [ ] **Step 4: Write `src/data/content/process.js` and `src/data/content/faq.js`**

`process.js`:
```js
export const processSteps = [
  { number: '01', title: 'Conversa', text: 'Uma reunião curta, presencial em Taubaté ou por vídeo, para entender o problema e o que você espera do resultado.' },
  { number: '02', title: 'Proposta', text: 'Escopo por escrito, prazo e valor fechado. Sem surpresa no meio do caminho.' },
  { number: '03', title: 'Desenvolvimento', text: 'Entregas a cada uma ou duas semanas para você testar e ajustar cedo.' },
  { number: '04', title: 'Publicação e suporte', text: 'Site no ar, app nas lojas, sistema em produção. E a gente continua por perto.' },
];
```

`faq.js`:
```js
export const homeFaq = [
  { q: 'Que tipo de empresa vocês atendem?', a: 'Pequenas e médias empresas do Vale do Paraíba: comércio, serviços, clínicas, escritórios, transportadoras e indústria. Atendemos presencialmente na região e remotamente no restante do Brasil.' },
  { q: 'Vocês fazem só o app ou também o sistema por trás?', a: 'Os dois. Muitos projetos têm um app para o cliente ou para a equipe e um painel web para a gestão, no mesmo banco de dados.' },
  { q: 'Como funciona o orçamento?', a: 'Depois de uma conversa inicial, enviamos uma proposta com escopo, prazo e valor fechado. Projetos maiores são divididos em etapas.' },
  { q: 'Quanto tempo leva um projeto?', a: 'Sites levam de 2 a 4 semanas; aplicativos, de 4 a 8 semanas; sistemas web, de 6 a 12 semanas para a primeira versão utilizável.' },
  { q: 'Os apps de vocês estão publicados nas lojas?', a: 'Sim. CalcFrete, Contador de Cantos e Prazzo estão na Google Play e na App Store; Trama está na Google Play. São produtos próprios, feitos com o mesmo processo que usamos nos projetos de clientes.' },
  { q: 'Depois da entrega, vocês dão suporte?', a: 'Sim. Oferecemos manutenção mensal ou suporte sob demanda para correções, atualizações de sistema e novas funções.' },
];
```

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/content`
Expected: all passed.

- [ ] **Step 6: Commit**

```bash
git add src/data/content tests/content
git commit -m "feat: services, process and FAQ content"
```

---

### Task 5: JSON-LD builders

**Files:**
- Create: `src/seo/jsonld.js`
- Test: `tests/seo/jsonld.test.js`

**Interfaces:**
- Consumes: `site` (Task 2), `Project` (Task 3), `Service` (Task 4).
- Produces: `localBusiness(site)`, `webSite(site)`, `breadcrumb(site, items:{name,path}[])`, `faqPage(items:{q,a}[])`, `service(site, svc)`, `softwareAppList(site, apps:Project[])`, `graph(...nodes) → { '@context', '@graph' }`, `absolute(site, path)`.

- [ ] **Step 1: Write the failing tests**

`tests/seo/jsonld.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { site } from '../../src/config/site.js';
import { services } from '../../src/data/content/services.js';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';
import { absolute, localBusiness, webSite, breadcrumb, faqPage, service, softwareAppList, graph } from '../../src/seo/jsonld.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('absolute', () => {
  it('joins site url and path', () => {
    expect(absolute(site, '/')).toBe(`${site.url}/`);
    expect(absolute(site, '/sites/')).toBe(`${site.url}/sites/`);
  });
});

describe('localBusiness', () => {
  it('describes Taubaté and cities served', () => {
    const lb = localBusiness(site);
    expect(lb['@type']).toBe('LocalBusiness');
    expect(lb['@id']).toBe(`${site.url}/#business`);
    expect(lb.address).toEqual({ '@type': 'PostalAddress', addressLocality: 'Taubaté', addressRegion: 'SP', addressCountry: 'BR' });
    expect(lb.areaServed[0]).toEqual({ '@type': 'City', name: 'Taubaté' });
    expect(lb.sameAs).toContain(site.stores.play);
    expect(lb.logo).toBe(`${site.url}/logo/mark-512.png`);
  });

  it('omits telephone and email when empty, includes them when set', () => {
    expect(localBusiness({ ...site, whatsapp: '', email: '' })).not.toHaveProperty('telephone');
    const lb = localBusiness({ ...site, whatsapp: '5512999999999', email: 'a@b.c' });
    expect(lb.telephone).toBe('+5512999999999');
    expect(lb.email).toBe('a@b.c');
  });
});

describe('page-level nodes', () => {
  it('webSite carries name and url', () => {
    expect(webSite(site)).toMatchObject({ '@type': 'WebSite', name: site.name, url: `${site.url}/` });
  });

  it('breadcrumb positions items from 1', () => {
    const b = breadcrumb(site, [{ name: 'Início', path: '/' }, { name: 'Sites', path: '/sites/' }]);
    expect(b.itemListElement[1]).toEqual({ '@type': 'ListItem', position: 2, name: 'Sites', item: `${site.url}/sites/` });
  });

  it('faqPage maps q/a to Question/Answer', () => {
    const f = faqPage([{ q: 'P?', a: 'R.' }]);
    expect(f.mainEntity[0]).toEqual({ '@type': 'Question', name: 'P?', acceptedAnswer: { '@type': 'Answer', text: 'R.' } });
  });

  it('service links provider by id and lists cities', () => {
    const s = service(site, services[0]);
    expect(s).toMatchObject({ '@type': 'Service', name: services[0].name, serviceType: services[0].seo.serviceType, url: `${site.url}/aplicativos/` });
    expect(s.provider).toEqual({ '@id': `${site.url}/#business` });
    expect(s.areaServed).toHaveLength(site.areaServed.length);
  });

  it('softwareAppList marks OS per store availability', () => {
    const list = softwareAppList(site, apps);
    expect(list['@type']).toBe('ItemList');
    const [calc, , , trama] = list.itemListElement.map((i) => i.item);
    expect(calc.operatingSystem).toBe('Android, iOS');
    expect(calc.installUrl).toEqual([apps[0].stores.play, apps[0].stores.appStore]);
    expect(trama.operatingSystem).toBe('Android');
    expect(trama.installUrl).toEqual([apps[3].stores.play]);
    expect(calc.image).toBe(`${site.url}/apps/calcfrete.webp`);
    expect(calc.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'BRL' });
  });

  it('graph wraps nodes with schema.org context', () => {
    expect(graph({ a: 1 }, { b: 2 })).toEqual({ '@context': 'https://schema.org', '@graph': [{ a: 1 }, { b: 2 }] });
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/seo/jsonld`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/seo/jsonld.js`**

```js
import { sameAsLinks } from '../config/site.js';

export const absolute = (site, path) => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;

const businessId = (site) => `${site.url}/#business`;

const cityNodes = (site) => site.areaServed.map((name) => ({ '@type': 'City', name }));

export function localBusiness(site) {
  const node = {
    '@type': 'LocalBusiness',
    '@id': businessId(site),
    name: site.name,
    url: `${site.url}/`,
    logo: `${site.url}/logo/mark-512.png`,
    image: `${site.url}/og/default.png`,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: cityNodes(site),
    sameAs: sameAsLinks(site),
  };
  if (site.whatsapp) node.telephone = `+${site.whatsapp}`;
  if (site.email) node.email = site.email;
  return node;
}

export function webSite(site) {
  return { '@type': 'WebSite', name: site.name, url: `${site.url}/`, inLanguage: 'pt-BR' };
}

export function breadcrumb(site, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(site, it.path) })),
  };
}

export function faqPage(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function service(site, svc) {
  return {
    '@type': 'Service',
    name: svc.name,
    serviceType: svc.seo.serviceType,
    description: svc.seo.description,
    url: absolute(site, svc.path),
    provider: { '@id': businessId(site) },
    areaServed: cityNodes(site),
  };
}

// O ícone é servido pelo próprio site; a URL da imagem precisa ser absoluta no schema.
const publicIconUrl = (site, app) => `${site.url}/apps/${app.slug}.webp`;

export function softwareAppList(site, apps) {
  return {
    '@type': 'ItemList',
    itemListElement: apps.map((app, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: app.title,
        description: app.tagline,
        applicationCategory: 'BusinessApplication',
        operatingSystem: app.platforms.join(', '),
        installUrl: [app.stores.play, app.stores.appStore].filter(Boolean),
        image: publicIconUrl(site, app),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
        author: { '@id': businessId(site) },
      },
    })),
  };
}

export const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });
```

- [ ] **Step 4: Run tests**

Run: `npm test -- tests/seo/jsonld`
Expected: all passed.

- [ ] **Step 5: Commit**

```bash
git add src/seo/jsonld.js tests/seo/jsonld.test.js
git commit -m "feat: JSON-LD builders for LocalBusiness, services, apps and FAQ"
```

---

### Task 6: Page meta table and head builder

**Files:**
- Create: `src/seo/pages.js`, `src/seo/buildHead.js`
- Test: `tests/seo/pages.test.js`, `tests/seo/buildHead.test.js`

**Interfaces:**
- Produces: `pages` = `{ home, aplicativos, sites, sistemasWeb, sobre, contato, notFound }`, each `{ key, path, title, description, robots?, jsonLd: () => object }`; `pageByPath(path)`; `buildHead(meta, site) → string` and `escapeHtml(s)`.

- [ ] **Step 1: Write the failing tests**

`tests/seo/pages.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { pages, pageByPath } from '../../src/seo/pages.js';

describe('pages meta', () => {
  const indexable = Object.values(pages).filter((p) => p.path);

  it('has six indexable pages plus notFound', () => {
    expect(indexable.map((p) => p.path)).toEqual(['/', '/aplicativos/', '/sites/', '/sistemas-web/', '/sobre/', '/contato/']);
    expect(pages.notFound.path).toBeNull();
    expect(pages.notFound.robots).toBe('noindex, nofollow');
  });

  it.each(Object.values(pages))('$key respects title/description limits', (p) => {
    expect(p.title.length).toBeLessThanOrEqual(60);
    expect(p.title).toMatch(/\| Innovate Apps$/);
    expect(p.description.length).toBeLessThanOrEqual(155);
    expect(p.description.length).toBeGreaterThan(60);
  });

  it.each(indexable)('$key jsonLd is a schema.org graph with LocalBusiness', (p) => {
    const ld = p.jsonLd();
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@graph'].some((n) => n['@type'] === 'LocalBusiness')).toBe(true);
  });

  it('service pages carry Service, BreadcrumbList and FAQPage; home carries ItemList and FAQPage', () => {
    const types = (p) => p.jsonLd()['@graph'].map((n) => n['@type']);
    for (const key of ['aplicativos', 'sites', 'sistemasWeb']) {
      expect(types(pages[key])).toEqual(expect.arrayContaining(['Service', 'BreadcrumbList', 'FAQPage']));
    }
    expect(types(pages.home)).toEqual(expect.arrayContaining(['ItemList', 'FAQPage']));
    expect(types(pages.aplicativos)).toContain('ItemList');
  });

  it('pageByPath tolerates a missing trailing slash and falls back to notFound', () => {
    expect(pageByPath('/sites')).toBe(pages.sites);
    expect(pageByPath('/sites/')).toBe(pages.sites);
    expect(pageByPath('/')).toBe(pages.home);
    expect(pageByPath('/nada/')).toBe(pages.notFound);
  });
});
```

`tests/seo/buildHead.test.js`:
```js
import { describe, it, expect } from 'vitest';
import { buildHead, escapeHtml } from '../../src/seo/buildHead.js';

const site = { url: 'https://example.com', name: 'Innovate Apps Co.' };
const meta = { path: '/sites/', title: 'Sites | Innovate Apps', description: 'Desc "x" & y', jsonLd: () => ({ '@context': 'https://schema.org', '@graph': [] }) };

describe('buildHead', () => {
  const head = buildHead(meta, site);

  it('emits title, description, canonical and robots', () => {
    expect(head).toContain('<title>Sites | Innovate Apps</title>');
    expect(head).toContain('<meta name="description" content="Desc &quot;x&quot; &amp; y">');
    expect(head).toContain('<link rel="canonical" href="https://example.com/sites/">');
    expect(head).toContain('<meta name="robots" content="index, follow">');
  });

  it('emits Open Graph and Twitter tags', () => {
    expect(head).toContain('<meta property="og:type" content="website">');
    expect(head).toContain('<meta property="og:url" content="https://example.com/sites/">');
    expect(head).toContain('<meta property="og:image" content="https://example.com/og/default.png">');
    expect(head).toContain('<meta property="og:locale" content="pt_BR">');
    expect(head).toContain('<meta property="og:site_name" content="Innovate Apps Co.">');
    expect(head).toContain('<meta name="twitter:card" content="summary_large_image">');
    expect(head).toContain('<meta name="theme-color" content="#010D33">');
  });

  it('embeds JSON-LD and escapes closing script tags', () => {
    const evil = { ...meta, jsonLd: () => ({ x: '</script><b>' }) };
    const out = buildHead(evil, site);
    expect(out).toContain('<script type="application/ld+json">');
    expect(out).toContain('<\\/script>');
    expect(out).not.toContain('</script><b>');
  });

  it('noindex pages get no canonical', () => {
    const out = buildHead({ ...meta, path: null, robots: 'noindex, nofollow' }, site);
    expect(out).toContain('content="noindex, nofollow"');
    expect(out).not.toContain('rel="canonical"');
  });

  it('escapeHtml handles the five characters', () => {
    expect(escapeHtml(`<a href="x">'&`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/seo`
Expected: FAIL — `pages.js`/`buildHead.js` not found.

- [ ] **Step 3: Implement `src/seo/pages.js`**

```js
import { site } from '../config/site.js';
import { services } from '../data/content/services.js';
import { homeFaq } from '../data/content/faq.js';
import { ProjectRepository } from '../data/repositories/ProjectRepository.js';
import { GetProjects } from '../domain/usecases/GetProjects.js';
import { graph, localBusiness, webSite, breadcrumb, faqPage, service, softwareAppList } from './jsonld.js';

const apps = () => new GetProjects(new ProjectRepository()).execute({ type: 'app' });
const base = () => [localBusiness(site), webSite(site)];
const crumbs = (name, path) => breadcrumb(site, [{ name: 'Início', path: '/' }, { name, path }]);

const servicePage = (key, slug, extra = () => []) => {
  const svc = services.find((s) => s.slug === slug);
  return {
    key,
    path: svc.path,
    title: svc.seo.title,
    description: svc.seo.description,
    jsonLd: () => graph(...base(), service(site, svc), crumbs(svc.shortName, svc.path), faqPage(svc.faq), ...extra()),
  };
};

export const pages = {
  home: {
    key: 'home',
    path: '/',
    title: 'Sites, sistemas e apps em Taubaté | Innovate Apps',
    description: 'Empresa de tecnologia em Taubaté, SP. Criamos sites, sistemas web e aplicativos Android e iOS para empresas do Vale do Paraíba. Apps publicados nas lojas.',
    jsonLd: () => graph(...base(), softwareAppList(site, apps()), faqPage(homeFaq)),
  },
  aplicativos: servicePage('aplicativos', 'aplicativos', () => [softwareAppList(site, apps())]),
  sites: servicePage('sites', 'sites'),
  sistemasWeb: servicePage('sistemasWeb', 'sistemas-web'),
  sobre: {
    key: 'sobre',
    path: '/sobre/',
    title: 'Sobre nós, tecnologia em Taubaté | Innovate Apps',
    description: 'Empresa de desenvolvimento de software em Taubaté, SP. Sites, sistemas web e aplicativos para empresas do Vale do Paraíba, feitos por quem programa.',
    jsonLd: () => graph(...base(), crumbs('Sobre', '/sobre/')),
  },
  contato: {
    key: 'contato',
    path: '/contato/',
    title: 'Contato em Taubaté | Innovate Apps',
    description: 'Fale com a Innovate Apps em Taubaté, SP. Orçamento de sites, sistemas web e aplicativos para empresas do Vale do Paraíba por WhatsApp ou e-mail.',
    jsonLd: () => graph(...base(), crumbs('Contato', '/contato/')),
  },
  notFound: {
    key: 'notFound',
    path: null,
    title: 'Página não encontrada | Innovate Apps',
    description: 'A página que você procurou não existe. Volte para o início e conheça os sites, sistemas e aplicativos da Innovate Apps em Taubaté.',
    robots: 'noindex, nofollow',
    jsonLd: () => graph(...base()),
  },
};

const withSlash = (p) => (p.endsWith('/') ? p : `${p}/`);

export function pageByPath(path) {
  const wanted = withSlash(path || '/');
  return Object.values(pages).find((p) => p.path === wanted) ?? pages.notFound;
}
```

- [ ] **Step 4: Implement `src/seo/buildHead.js`**

```js
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${escapeHtml(value)}">`;

// Gera as tags do <head> de uma página. Puro: recebe meta da rota e o site, devolve string.
export function buildHead(page, site) {
  const canonical = page.path ? `${site.url}${page.path}` : null;
  const image = `${site.url}/og/default.png`;
  const lines = [
    `<title>${escapeHtml(page.title)}</title>`,
    meta('name', 'description', page.description),
    meta('name', 'robots', page.robots ?? 'index, follow'),
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : null,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:title', page.title),
    meta('property', 'og:description', page.description),
    canonical ? meta('property', 'og:url', canonical) : null,
    meta('property', 'og:image', image),
    meta('property', 'og:locale', 'pt_BR'),
    meta('property', 'og:site_name', site.name),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', page.title),
    meta('name', 'twitter:description', page.description),
    meta('name', 'twitter:image', image),
    meta('name', 'theme-color', '#010D33'),
    `<script type="application/ld+json">${JSON.stringify(page.jsonLd()).replace(/<\/script/gi, '<\\/script')}</script>`,
  ];
  return lines.filter(Boolean).join('\n    ');
}
```

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/seo`
Expected: all passed.

- [ ] **Step 6: Commit**

```bash
git add src/seo tests/seo
git commit -m "feat: per-page SEO meta table and head builder"
```

---
### Task 7: Fonts, design tokens, global CSS, HTML shell

**Files:**
- Create: `scripts/assets/fonts.mjs`, `src/presentation/styles/fonts.css`, `src/presentation/styles/tokens.css`, `src/presentation/styles/base.css`, `src/presentation/styles/utilities.css`, `src/presentation/styles/index.css`, `public/.nojekyll`
- Modify: `index.html`
- Test: `tests/assets/fonts.test.js`, `tests/shell/index-html.test.js`

**Interfaces:**
- Produces: CSS custom properties listed in Global Constraints plus derived ones below; global classes `.container`, `.eyebrow`, `.lede`, `.visually-hidden`, `.skip-link`; reveal contract: any element with `data-reveal` is hidden (only when `<html class="js">`) until it gets class `is-in`.
- `index.html` placeholders `<!--app-head-->` and `<!--app-html-->` consumed by Task 10.

- [ ] **Step 1: Write the failing tests**

`tests/assets/fonts.test.js`:
```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { statSync } from 'node:fs';

describe('local fonts', () => {
  it.each(['bricolage-grotesque', 'instrument-sans'])('public/fonts/%s.woff2 exists and is not empty', (name) => {
    expect(statSync(`public/fonts/${name}.woff2`).size).toBeGreaterThan(10_000);
  });
});
```

`tests/shell/index-html.test.js`:
```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');

describe('index.html shell', () => {
  it('declares pt-BR, placeholders and font preloads', () => {
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain('<!--app-head-->');
    expect(html).toContain('<div id="root"><!--app-html--></div>');
    expect(html).toContain('%BASE_URL%fonts/bricolage-grotesque.woff2');
    expect(html).toContain('%BASE_URL%fonts/instrument-sans.woff2');
    expect(html).toContain('src="/src/entry-client.jsx"');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('<title>');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/assets tests/shell`
Expected: FAIL (fonts missing; index.html still has Google Fonts and `<title>`).

- [ ] **Step 3: Font copy script and run it**

`scripts/assets/fonts.mjs`:
```js
// Copia as fontes variáveis (subset latin) dos pacotes fontsource para public/fonts.
// Roda uma vez (npm run assets); os arquivos gerados são commitados.
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const fonts = [
  ['@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2', 'bricolage-grotesque.woff2'],
  ['@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2', 'instrument-sans.woff2'],
];

mkdirSync('public/fonts', { recursive: true });
for (const [src, out] of fonts) {
  copyFileSync(resolve('node_modules', src), resolve('public/fonts', out));
  console.log('fonte copiada:', out);
}
```

Run: `node scripts/assets/fonts.mjs` — expected: two "fonte copiada" lines. Create an empty `public/.nojekyll`.

- [ ] **Step 4: Write the stylesheets**

`src/presentation/styles/fonts.css`:
```css
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 200 800;
  font-display: swap;
  src: url('/fonts/bricolage-grotesque.woff2') format('woff2-variations');
}
@font-face {
  font-family: 'Instrument Sans';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/instrument-sans.woff2') format('woff2-variations');
}
```

`src/presentation/styles/tokens.css`:
```css
:root {
  --navy-900: #010D33;
  --navy-700: #152352;
  --navy-600: #24346B;
  --ink: #0B1230;
  --ink-muted: #4A5273;
  --paper: #F3F0E8;
  --paper-2: #E9E6DE;
  --amber: #F0A030;
  --amber-hover: #E29320;
  --amber-ink: #3A2300;

  --on-navy: #F3F0E8;
  --on-navy-muted: rgba(243, 240, 232, 0.72);
  --line: rgba(11, 18, 48, 0.14);
  --line-on-navy: rgba(243, 240, 232, 0.16);

  --font-heading: 'Bricolage Grotesque', 'Arial Narrow', Arial, sans-serif;
  --font-body: 'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --text-xs: 0.8125rem;
  --text-sm: 0.9375rem;
  --text-md: 1.0625rem;
  --text-lg: 1.25rem;
  --text-xl: clamp(1.375rem, 2.2vw, 1.75rem);
  --display-2: clamp(2rem, 4.2vw, 3.25rem);
  --display-1: clamp(2.5rem, 6vw, 4.75rem);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --section-y: clamp(4.5rem, 9vw, 7.5rem);

  --container: 72rem;
  --gutter: clamp(1.25rem, 4vw, 2.5rem);
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --shadow-sm: 0 1px 2px rgba(11, 18, 48, 0.06), 0 1px 1px rgba(11, 18, 48, 0.04);
  --shadow-md: 0 10px 28px rgba(11, 18, 48, 0.10);
  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --dur: 240ms;
  --header-h: 4.25rem;
}
```

`src/presentation/styles/base.css`:
```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html {
  color-scheme: light;
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--header-h) + 1rem);
  -webkit-text-size-adjust: 100%;
}
body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.6;
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
img, svg, video { display: block; max-width: 100%; height: auto; }
button, input, select, textarea { font: inherit; color: inherit; }
button { background: none; border: 0; padding: 0; cursor: pointer; }
a { color: inherit; text-decoration-thickness: 1px; text-underline-offset: 0.15em; }
ul[class], ol[class] { list-style: none; padding: 0; }
p { text-wrap: pretty; }

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
  color: inherit;
}
h1 { font-size: var(--display-1); font-weight: 800; letter-spacing: -0.03em; }
h2 { font-size: var(--display-2); }
h3 { font-size: var(--text-xl); letter-spacing: -0.01em; }
h4 { font-size: var(--text-lg); }
strong { font-weight: 600; }
::selection { background: var(--amber); color: var(--amber-ink); }

:focus-visible { outline: 3px solid var(--amber); outline-offset: 3px; border-radius: 2px; }
:focus:not(:focus-visible) { outline: none; }

.skip-link {
  position: absolute; left: 1rem; top: -100%;
  z-index: 100; padding: 0.75rem 1rem;
  background: var(--amber); color: var(--amber-ink);
  font-weight: 600; border-radius: var(--radius-sm);
}
.skip-link:focus { top: 1rem; }

/* Reveal ao rolar: o HTML pré-renderizado nasce visível; só com JS ("html.js") escondemos até entrar na tela. */
[data-reveal] { transition: opacity 0.6s var(--ease), transform 0.6s var(--ease); }
html.js [data-reveal]:not(.is-in) { opacity: 0; transform: translateY(14px); }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { transition: none; }
  html.js [data-reveal]:not(.is-in) { opacity: 1; transform: none; }
}
```

`src/presentation/styles/utilities.css`:
```css
.container { width: min(100% - 2 * var(--gutter), var(--container)); margin-inline: auto; }
.eyebrow {
  font-family: var(--font-body); font-size: var(--text-xs); font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted);
}
.lede { font-size: var(--text-lg); line-height: 1.5; color: var(--ink-muted); max-width: 40rem; }
.visually-hidden {
  position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
.tabular { font-variant-numeric: tabular-nums; }
```

`src/presentation/styles/index.css`:
```css
@import './fonts.css';
@import './tokens.css';
@import './base.css';
@import './utilities.css';
```

- [ ] **Step 5: Rewrite `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="%BASE_URL%favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="%BASE_URL%favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="%BASE_URL%apple-touch-icon.png" />
    <link rel="manifest" href="%BASE_URL%site.webmanifest" />
    <link rel="preload" href="%BASE_URL%fonts/bricolage-grotesque.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="%BASE_URL%fonts/instrument-sans.woff2" as="font" type="font/woff2" crossorigin />
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Run tests**

Run: `npm test -- tests/assets tests/shell`
Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add scripts/assets/fonts.mjs public/fonts public/.nojekyll src/presentation/styles index.html tests/assets tests/shell
git commit -m "feat: local variable fonts, design tokens, base styles and HTML shell"
```

---

### Task 8: UI primitives

**Files:**
- Create: `src/presentation/ui/Button.jsx` + `Button.module.css`, `Section.jsx` + `Section.module.css`, `SectionHeading.jsx` + `SectionHeading.module.css`, `Breadcrumb.jsx` + `Breadcrumb.module.css`, `StoreBadges.jsx` + `StoreBadges.module.css`
- Modify: `src/config/site.js` (add `contactLabel`)
- Test: `tests/ui/Button.test.jsx`, `tests/ui/StoreBadges.test.jsx`, `tests/ui/Breadcrumb.test.jsx`

**Interfaces:**
- Produces: `<Button href variant='primary'|'secondary'|'ghost'|'onNavy' size='md'|'sm'|'lg' icon={LucideIcon}>` (internal href → react-router `Link`; `http/mailto/tel` → `<a target=_blank rel=noopener noreferrer>`; no href → `<button>`); `<Section id tone='paper'|'paper2'|'navy' className>`; `<SectionHeading eyebrow title lead as='h2' align='start'|'center'>`; `<Breadcrumb items=[{name,path}]>`; `<StoreBadges stores={{play,appStore}} size='md'|'sm' name>`; `contactLabel(site) → 'Falar no WhatsApp' | 'Fale com a gente'`.
- Badge images: `public/badges/google-play-pt-br.png` (646×250) and `public/badges/app-store-pt-br.svg` (119.66×40) — created in Task 11.

- [ ] **Step 1: Write the failing tests**

`tests/ui/Button.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Button from '../../src/presentation/ui/Button.jsx';

const r = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Button', () => {
  it('renders an internal Link for site paths', () => {
    r(<Button href="/contato/">Contato</Button>);
    const a = screen.getByRole('link', { name: 'Contato' });
    expect(a).toHaveAttribute('href', '/contato/');
    expect(a).not.toHaveAttribute('target');
  });

  it('renders a safe external anchor for http links', () => {
    r(<Button href="https://wa.me/55">Zap</Button>);
    const a = screen.getByRole('link', { name: 'Zap' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a button when there is no href', () => {
    r(<Button onClick={() => {}}>Abrir</Button>);
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveAttribute('type', 'button');
  });
});
```

`tests/ui/StoreBadges.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StoreBadges from '../../src/presentation/ui/StoreBadges.jsx';

describe('StoreBadges', () => {
  it('renders both stores when both links exist', () => {
    render(<StoreBadges name="CalcFrete" stores={{ play: 'https://p', appStore: 'https://a' }} />);
    expect(screen.getByRole('link', { name: 'CalcFrete no Google Play' })).toHaveAttribute('href', 'https://p');
    expect(screen.getByRole('link', { name: 'CalcFrete na App Store' })).toHaveAttribute('href', 'https://a');
  });

  it('hides the App Store badge when the link is missing', () => {
    render(<StoreBadges name="Trama" stores={{ play: 'https://p', appStore: null }} />);
    expect(screen.queryByRole('link', { name: /App Store/ })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('badge images have explicit dimensions', () => {
    render(<StoreBadges name="X" stores={{ play: 'https://p', appStore: 'https://a' }} />);
    for (const img of screen.getAllByRole('img')) {
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
    }
  });
});
```

`tests/ui/Breadcrumb.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Breadcrumb from '../../src/presentation/ui/Breadcrumb.jsx';

describe('Breadcrumb', () => {
  it('links all but the last item, which is the current page', () => {
    render(<MemoryRouter><Breadcrumb items={[{ name: 'Início', path: '/' }, { name: 'Sites', path: '/sites/' }]} /></MemoryRouter>);
    expect(screen.getByRole('navigation', { name: 'Navegação estrutural' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/');
    expect(screen.getByText('Sites')).toHaveAttribute('aria-current', 'page');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/ui`
Expected: FAIL — components not found.

- [ ] **Step 3: Implement `Button`**

`src/presentation/ui/Button.jsx`:
```jsx
import { Link } from 'react-router';
import styles from './Button.module.css';

const EXTERNAL = /^(https?:|mailto:|tel:)/;

export default function Button({ href, variant = 'primary', size = 'md', icon: Icon, className = '', children, ...rest }) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ');
  const content = (
    <>
      <span>{children}</span>
      {Icon ? <Icon className={styles.icon} size={18} strokeWidth={2.25} aria-hidden="true" /> : null}
    </>
  );
  if (!href) return <button type="button" className={cls} {...rest}>{content}</button>;
  if (EXTERNAL.test(href)) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{content}</a>;
  return <Link to={href} className={cls} {...rest}>{content}</Link>;
}
```

`src/presentation/ui/Button.module.css`:
```css
.button {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  min-height: 2.75rem; padding: 0 1.25rem;
  border-radius: var(--radius-sm); border: 1.5px solid transparent;
  font-weight: 600; font-size: var(--text-sm); line-height: 1; text-decoration: none;
  white-space: nowrap; transition: background-color var(--dur) var(--ease), border-color var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.button:active { transform: translateY(1px); }
.icon { flex: none; transition: transform var(--dur) var(--ease); }
.button:hover .icon { transform: translateX(2px); }

.primary { background: var(--amber); color: var(--amber-ink); }
.primary:hover { background: var(--amber-hover); }
.secondary { background: transparent; color: var(--ink); border-color: var(--ink); }
.secondary:hover { background: var(--paper-2); }
.ghost { background: transparent; color: var(--ink); padding-inline: 0.5rem; }
.ghost:hover { text-decoration: underline; }
.onNavy { background: transparent; color: var(--on-navy); border-color: var(--line-on-navy); }
.onNavy:hover { border-color: var(--on-navy); }

.sm { min-height: 2.375rem; padding: 0 1rem; font-size: var(--text-xs); }
.lg { min-height: 3.25rem; padding: 0 1.75rem; font-size: var(--text-md); }
```

- [ ] **Step 4: Implement `Section`, `SectionHeading`, `Breadcrumb`**

`src/presentation/ui/Section.jsx`:
```jsx
import styles from './Section.module.css';

export default function Section({ id, tone = 'paper', className = '', children, ...rest }) {
  return (
    <section id={id} className={[styles.section, styles[tone], className].filter(Boolean).join(' ')} {...rest}>
      <div className="container">{children}</div>
    </section>
  );
}
```

`src/presentation/ui/Section.module.css`:
```css
.section { padding-block: var(--section-y); }
.paper { background: var(--paper); color: var(--ink); }
.paper2 { background: var(--paper-2); color: var(--ink); }
.navy { background: var(--navy-900); color: var(--on-navy); }
.navy :global(.eyebrow) { color: var(--amber); }
.navy :global(.lede) { color: var(--on-navy-muted); }
```

`src/presentation/ui/SectionHeading.jsx`:
```jsx
import styles from './SectionHeading.module.css';

export default function SectionHeading({ eyebrow, title, lead, as: Tag = 'h2', align = 'start', id }) {
  return (
    <div className={[styles.heading, align === 'center' ? styles.center : ''].join(' ')}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag id={id}>{title}</Tag>
      {lead ? <p className="lede">{lead}</p> : null}
    </div>
  );
}
```

`src/presentation/ui/SectionHeading.module.css`:
```css
.heading { display: grid; gap: var(--space-4); margin-bottom: var(--space-7); max-width: 46rem; }
.center { margin-inline: auto; text-align: center; }
.center :global(.lede) { margin-inline: auto; }
```

`src/presentation/ui/Breadcrumb.jsx`:
```jsx
import { Link } from 'react-router';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Navegação estrutural" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((it, i) =>
          i < items.length - 1 ? (
            <li key={it.path}><Link to={it.path}>{it.name}</Link></li>
          ) : (
            <li key={it.path}><span aria-current="page">{it.name}</span></li>
          ),
        )}
      </ol>
    </nav>
  );
}
```

`src/presentation/ui/Breadcrumb.module.css`:
```css
.nav { font-size: var(--text-xs); margin-bottom: var(--space-5); }
.list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.list li + li::before { content: '/'; margin-right: 0.5rem; opacity: 0.5; }
.list a { text-decoration: none; opacity: 0.8; }
.list a:hover { text-decoration: underline; opacity: 1; }
.list span { font-weight: 600; }
```

- [ ] **Step 5: Implement `StoreBadges` and `contactLabel`**

`src/presentation/ui/StoreBadges.jsx`:
```jsx
import styles from './StoreBadges.module.css';

const base = import.meta.env.BASE_URL;

// Badges oficiais pt-BR das lojas (Task 11 baixa os arquivos). Sem link, o badge não aparece.
export default function StoreBadges({ stores, name, size = 'md' }) {
  const h = size === 'sm' ? 36 : 44;
  return (
    <div className={styles.row}>
      {stores.play ? (
        <a href={stores.play} target="_blank" rel="noopener noreferrer" aria-label={`${name} no Google Play`}>
          <img src={`${base}badges/google-play-pt-br.png`} alt="" width={Math.round(h * 2.584)} height={h} loading="lazy" />
        </a>
      ) : null}
      {stores.appStore ? (
        <a href={stores.appStore} target="_blank" rel="noopener noreferrer" aria-label={`${name} na App Store`}>
          <img src={`${base}badges/app-store-pt-br.svg`} alt="" width={Math.round(h * 2.99)} height={h} loading="lazy" />
        </a>
      ) : null}
    </div>
  );
}
```

`src/presentation/ui/StoreBadges.module.css`:
```css
.row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
.row a { display: inline-block; border-radius: 6px; }
.row img { height: auto; }
```

Append to `src/config/site.js`:
```js
export const contactLabel = (config) => (config.whatsapp ? 'Falar no WhatsApp' : 'Fale com a gente');
```

- [ ] **Step 6: Run tests**

Run: `npm test -- tests/ui`
Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add src/presentation/ui src/config/site.js tests/ui
git commit -m "feat: Button, Section, SectionHeading, Breadcrumb and StoreBadges primitives"
```

---

### Task 9: Layout chrome — Navbar, Footer, Layout, client hooks

**Files:**
- Create: `src/presentation/hooks/useDocumentMeta.js`, `src/presentation/hooks/useScrollReveal.js`, `src/presentation/layout/Navbar.jsx` + `Navbar.module.css`, `src/presentation/layout/Footer.jsx` + `Footer.module.css`, `src/presentation/layout/Layout.jsx` + `Layout.module.css`
- Test: `tests/layout/Navbar.test.jsx`, `tests/layout/Footer.test.jsx`

**Interfaces:**
- Consumes: `services`, `site`, `contactHref`, `contactLabel`, `sameAsLinks`, `Button`, `pageByPath`.
- Produces: `<Layout>{children}</Layout>` (skip link → `#conteudo`, `<main id="conteudo">`); `useDocumentMeta()` (title/description/scroll on route change); `useScrollReveal()` (adds `is-in` to `[data-reveal]`).
- Logo asset `public/logo/mark.png` (transparent cream mark, 256 px tall) is created in Task 11; reference it now.

- [ ] **Step 1: Write the failing tests**

`tests/layout/Navbar.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Navbar from '../../src/presentation/layout/Navbar.jsx';

const r = () => render(<MemoryRouter initialEntries={['/sites/']}><Navbar /></MemoryRouter>);

describe('Navbar', () => {
  it('has a primary navigation with the three services and Sobre', () => {
    r();
    const nav = screen.getByRole('navigation', { name: 'Principal' });
    for (const name of ['Aplicativos', 'Sites', 'Sistemas web', 'Sobre']) {
      expect(nav.querySelector(`a[href]`)).toBeTruthy();
      expect(screen.getAllByRole('link', { name }).length).toBeGreaterThan(0);
    }
  });

  it('marks the current page link', () => {
    r();
    const current = screen.getAllByRole('link', { name: 'Sites' }).find((a) => a.getAttribute('aria-current') === 'page');
    expect(current).toBeTruthy();
  });

  it('toggles the mobile menu with aria state', () => {
    r();
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'menu-mobile');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('menu-mobile')).not.toHaveAttribute('hidden');
  });

  it('falls back to /contato/ when whatsapp is empty', () => {
    r();
    expect(screen.getAllByRole('link', { name: 'Fale com a gente' })[0]).toHaveAttribute('href', '/contato/');
  });
});
```

`tests/layout/Footer.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Footer from '../../src/presentation/layout/Footer.jsx';

describe('Footer', () => {
  it('shows the city, the store links and no empty contact rows', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText(/Taubaté – SP/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Google Play' })).toHaveAttribute('href', expect.stringContaining('developer?id='));
    expect(screen.getByRole('link', { name: 'App Store' })).toHaveAttribute('href', expect.stringContaining('apps.apple.com'));
    expect(screen.queryByRole('link', { name: /@/ })).toBeNull();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/layout`
Expected: FAIL — modules not found.

- [ ] **Step 3: Hooks**

`src/presentation/hooks/useDocumentMeta.js`:
```js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { pageByPath } from '../../seo/pages.js';

// Mantém title/description corretos na navegação SPA e reposiciona a rolagem.
export function useDocumentMeta() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const page = pageByPath(pathname);
    document.title = page.title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = page.description;

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else if (!first.current) {
      window.scrollTo(0, 0);
    }
    first.current = false;
  }, [pathname, hash]);
}
```

`src/presentation/hooks/useScrollReveal.js`:
```js
import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Revela [data-reveal] ao entrar na viewport. Sem IntersectionObserver, mostra tudo.
export function useScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]:not(.is-in)'));
    if (!els.length) return undefined;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
}
```

- [ ] **Step 4: Navbar**

`src/presentation/layout/Navbar.jsx`:
```jsx
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X, ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import Button from '../ui/Button.jsx';
import styles from './Navbar.module.css';

const links = [...services.map((s) => ({ name: s.shortName, path: s.path })), { name: 'Sobre', path: '/sobre/' }];
const mark = `${import.meta.env.BASE_URL}logo/mark.png`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const items = links.map((l) => (
    <li key={l.path}>
      <NavLink to={l.path} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {l.name}
      </NavLink>
    </li>
  ));

  return (
    <header className={styles.header}>
      <div className={['container', styles.bar].join(' ')}>
        <Link to="/" className={styles.brand} aria-label="Innovate Apps Co. — página inicial">
          <img src={mark} alt="" width="32" height="32" />
          <span>Innovate Apps <small>Co.</small></span>
        </Link>

        <nav aria-label="Principal" className={styles.desktop}>
          <ul className={styles.links}>{items}</ul>
        </nav>

        <div className={styles.actions}>
          <Button href={contactHref(site)} size="sm" icon={ArrowRight}>{contactLabel(site)}</Button>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="menu-mobile" className={styles.mobile} hidden={!open}>
        <nav aria-label="Principal (celular)" className="container">
          <ul className={styles.mobileLinks}>
            {items}
            <li><NavLink to="/contato/">Contato</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

`src/presentation/layout/Navbar.module.css`:
```css
.header {
  position: sticky; top: 0; z-index: 50;
  background: var(--navy-900); color: var(--on-navy);
  border-bottom: 1px solid var(--line-on-navy);
}
.bar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-5); min-height: var(--header-h); }
.brand { display: inline-flex; align-items: center; gap: 0.6rem; text-decoration: none; font-family: var(--font-heading); font-weight: 700; font-size: 1.125rem; letter-spacing: -0.01em; }
.brand small { font-weight: 500; opacity: 0.7; font-size: 0.8em; }
.desktop { display: none; }
.links { display: flex; gap: var(--space-5); }
.links a { text-decoration: none; font-weight: 500; font-size: var(--text-sm); color: var(--on-navy-muted); padding-block: 0.25rem; border-bottom: 2px solid transparent; }
.links a:hover, .links a:focus-visible { color: var(--on-navy); }
.links a.active { color: var(--on-navy); border-bottom-color: var(--amber); }
.actions { display: flex; align-items: center; gap: var(--space-3); }
.actions > a { display: none; }
.toggle { display: inline-flex; padding: 0.5rem; color: var(--on-navy); border-radius: var(--radius-sm); }
.mobile { border-top: 1px solid var(--line-on-navy); background: var(--navy-900); }
.mobileLinks { display: grid; padding-block: var(--space-4); }
.mobileLinks a { display: block; padding: 0.875rem 0; font-family: var(--font-heading); font-size: 1.375rem; font-weight: 600; text-decoration: none; border-bottom: 1px solid var(--line-on-navy); }
.mobileLinks a.active { color: var(--amber); }

@media (min-width: 64rem) {
  .desktop { display: block; }
  .actions > a { display: inline-flex; }
  .toggle, .mobile { display: none; }
}
```

- [ ] **Step 5: Footer and Layout**

`src/presentation/layout/Footer.jsx`:
```jsx
import { Link } from 'react-router';
import { Instagram, Linkedin, Github, Mail, MessageCircle } from 'lucide-react';
import { site, contactHref } from '../../config/site.js';
import { services } from '../../data/content/services.js';
import styles from './Footer.module.css';

const mark = `${import.meta.env.BASE_URL}logo/mark.png`;
const socials = [
  ['instagram', Instagram, 'Instagram'],
  ['linkedin', Linkedin, 'LinkedIn'],
  ['github', Github, 'GitHub'],
].filter(([key]) => site.social[key]);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.brand}>
          <img src={mark} alt="" width="40" height="40" />
          <p className={styles.name}>{site.name}</p>
          <p className={styles.tagline}>Sites, sistemas web e aplicativos para empresas do Vale do Paraíba.</p>
          <p className={styles.address}>Taubaté – SP · Atendimento presencial no Vale e remoto em todo o Brasil</p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className={styles.colTitle}>Navegação</h2>
          <ul className={styles.list}>
            <li><Link to="/">Início</Link></li>
            {services.map((s) => <li key={s.path}><Link to={s.path}>{s.name}</Link></li>)}
            <li><Link to="/sobre/">Sobre</Link></li>
            <li><Link to="/contato/">Contato</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className={styles.colTitle}>Nossos apps</h2>
          <ul className={styles.list}>
            <li><a href={site.stores.play} target="_blank" rel="noopener noreferrer">Google Play</a></li>
            <li><a href={site.stores.appStore} target="_blank" rel="noopener noreferrer">App Store</a></li>
          </ul>
        </div>

        <div>
          <h2 className={styles.colTitle}>Contato</h2>
          <ul className={styles.list}>
            {site.whatsapp ? <li><a href={contactHref(site)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a></li> : null}
            {site.email ? <li><a href={`mailto:${site.email}`}><Mail size={16} aria-hidden="true" /> {site.email}</a></li> : null}
            <li><Link to="/contato/">Página de contato</Link></li>
          </ul>
          {socials.length ? (
            <ul className={styles.social} aria-label="Redes sociais">
              {socials.map(([key, Icon, label]) => (
                <li key={key}><a href={site.social[key]} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={20} aria-hidden="true" /></a></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={['container', styles.bottom].join(' ')}>
        <p>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
        <p>Feito em Taubaté, SP.</p>
      </div>
    </footer>
  );
}
```

`src/presentation/layout/Footer.module.css`:
```css
.footer { background: var(--navy-900); color: var(--on-navy); padding-block: var(--space-8) var(--space-6); border-top: 1px solid var(--line-on-navy); }
.grid { display: grid; gap: var(--space-7); }
.brand { display: grid; gap: var(--space-3); max-width: 24rem; }
.name { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); }
.tagline { color: var(--on-navy-muted); }
.address { font-size: var(--text-sm); color: var(--on-navy-muted); }
.colTitle { font-family: var(--font-body); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--amber); margin-bottom: var(--space-4); }
.list { display: grid; gap: 0.625rem; }
.list a { display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; color: var(--on-navy-muted); }
.list a:hover { color: var(--on-navy); text-decoration: underline; }
.social { display: flex; gap: var(--space-3); margin-top: var(--space-5); }
.social a { display: inline-flex; padding: 0.5rem; border: 1px solid var(--line-on-navy); border-radius: var(--radius-sm); color: var(--on-navy); }
.social a:hover { border-color: var(--on-navy); }
.bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-3); margin-top: var(--space-8); padding-top: var(--space-5); border-top: 1px solid var(--line-on-navy); font-size: var(--text-xs); color: var(--on-navy-muted); }

@media (min-width: 48rem) { .grid { grid-template-columns: 1.4fr 1fr 1fr 1fr; } }
```

`src/presentation/layout/Layout.jsx`:
```jsx
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  useDocumentMeta();
  useScrollReveal();
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo" className={styles.main}>{children}</main>
      <Footer />
    </>
  );
}
```

`src/presentation/layout/Layout.module.css`:
```css
.main { min-height: 60vh; }
```

- [ ] **Step 6: Run tests**

Run: `npm test -- tests/layout`
Expected: all passed (the Navbar test's `aria-current` assertion relies on `NavLink`, which sets it automatically on the active route).

- [ ] **Step 7: Commit**

```bash
git add src/presentation/hooks src/presentation/layout tests/layout
git commit -m "feat: navbar, footer, layout shell and client hooks"
```

---
### Task 10: Routing, entry points and the prerender pipeline

**Files:**
- Create: `src/routes.jsx`, `src/App.jsx`, `src/entry-client.jsx`, `src/entry-server.jsx`, `src/presentation/pages/Home.jsx`, `src/presentation/pages/ServicePage.jsx`, `src/presentation/pages/Sobre.jsx`, `src/presentation/pages/Contato.jsx`, `src/presentation/pages/NotFound.jsx`, `scripts/lib/prerender-utils.mjs`, `scripts/prerender.mjs`
- Test: `tests/routes.test.jsx`, `tests/scripts/prerender-utils.test.js`

**Interfaces:**
- Produces: `routes: { path, page, Component, service? }[]` (paths with trailing slash; `Component` receives `service` prop for service routes); `entry-server` exports `render(path) → { html, head }`, `renderNotFound() → { html, head }`, `routePaths: string[]`, `siteUrl: string`; helpers `outFileFor(route)`, `sitemapXml(routes, siteUrl, date)`, `robotsTxt(siteUrl)`, `injectTemplate(template, { head, html })`.
- Pages in this task render only their H1 and lead; Tasks 15–17 fill them in without changing their exports.

- [ ] **Step 1: Write the failing tests**

`tests/routes.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { routes } from '../src/routes.jsx';
import { pages } from '../src/seo/pages.js';

describe('routes', () => {
  it('matches the indexable pages one-to-one', () => {
    const pagePaths = Object.values(pages).filter((p) => p.path).map((p) => p.path);
    expect(routes.map((r) => r.path)).toEqual(pagePaths);
    for (const r of routes) {
      expect(pages[r.page].path).toBe(r.path);
      expect(typeof r.Component).toBe('function');
    }
  });

  it('service routes carry their service object', () => {
    const svc = routes.filter((r) => r.service);
    expect(svc.map((r) => r.service.slug)).toEqual(['aplicativos', 'sites', 'sistemas-web']);
  });
});
```

`tests/scripts/prerender-utils.test.js`:
```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { outFileFor, sitemapXml, robotsTxt, injectTemplate } from '../../scripts/lib/prerender-utils.mjs';

describe('prerender utils', () => {
  it('maps routes to dist files', () => {
    expect(outFileFor('/')).toBe('index.html');
    expect(outFileFor('/sites/')).toBe('sites/index.html');
    expect(outFileFor('/sistemas-web/')).toBe('sistemas-web/index.html');
  });

  it('writes a sitemap with absolute urls and lastmod', () => {
    const xml = sitemapXml(['/', '/sites/'], 'https://example.com', new Date('2026-09-03T12:00:00Z'));
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/sites/</loc>');
    expect(xml).toContain('<lastmod>2026-09-03</lastmod>');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('writes robots with the absolute sitemap url', () => {
    expect(robotsTxt('https://example.com')).toBe('User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n');
  });

  it('injects head and html without interpreting $ patterns', () => {
    const out = injectTemplate('<head><!--app-head--></head><div id="root"><!--app-html--></div>', { head: '<title>$&</title>', html: '<p>$1</p>' });
    expect(out).toBe('<head><title>$&</title></head><div id="root"><p>$1</p></div>');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/routes tests/scripts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Minimal pages**

`src/presentation/pages/Home.jsx`:
```jsx
import Section from '../ui/Section.jsx';

export default function Home() {
  return (
    <Section tone="navy">
      <h1>Sites, sistemas e aplicativos para empresas do Vale do Paraíba</h1>
    </Section>
  );
}
```

`src/presentation/pages/ServicePage.jsx`:
```jsx
import Section from '../ui/Section.jsx';
import Breadcrumb from '../ui/Breadcrumb.jsx';

export default function ServicePage({ service }) {
  return (
    <Section tone="navy">
      <Breadcrumb items={[{ name: 'Início', path: '/' }, { name: service.shortName, path: service.path }]} />
      <h1>{service.hero.title}</h1>
      <p className="lede">{service.hero.lead}</p>
    </Section>
  );
}
```

`src/presentation/pages/Sobre.jsx`:
```jsx
import Section from '../ui/Section.jsx';

export default function Sobre() {
  return (
    <Section tone="navy">
      <h1>Uma empresa de tecnologia de Taubaté</h1>
    </Section>
  );
}
```

`src/presentation/pages/Contato.jsx`:
```jsx
import Section from '../ui/Section.jsx';

export default function Contato() {
  return (
    <Section tone="navy">
      <h1>Fale com a Innovate Apps</h1>
    </Section>
  );
}
```

`src/presentation/pages/NotFound.jsx`:
```jsx
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';

export default function NotFound() {
  return (
    <Section>
      <p className="eyebrow">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p className="lede">O endereço que você acessou não existe ou mudou de lugar.</p>
      <p><Button href="/">Voltar para o início</Button></p>
    </Section>
  );
}
```

- [ ] **Step 4: Routes and App**

`src/routes.jsx`:
```jsx
import { services } from './data/content/services.js';
import Home from './presentation/pages/Home.jsx';
import ServicePage from './presentation/pages/ServicePage.jsx';
import Sobre from './presentation/pages/Sobre.jsx';
import Contato from './presentation/pages/Contato.jsx';

const pageKey = { aplicativos: 'aplicativos', sites: 'sites', 'sistemas-web': 'sistemasWeb' };

// Tabela única de rotas. `page` aponta para a chave em seo/pages.js.
export const routes = [
  { path: '/', page: 'home', Component: Home },
  ...services.map((service) => ({ path: service.path, page: pageKey[service.slug], Component: ServicePage, service })),
  { path: '/sobre/', page: 'sobre', Component: Sobre },
  { path: '/contato/', page: 'contato', Component: Contato },
];
```

`src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router';
import Layout from './presentation/layout/Layout.jsx';
import NotFound from './presentation/pages/NotFound.jsx';
import { routes } from './routes.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        {routes.map(({ path, Component, service }) => (
          <Route key={path} path={path.replace(/\/$/, '') || '/'} element={<Component service={service} />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
```

- [ ] **Step 5: Entry points**

`src/entry-client.jsx`:
```jsx
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './presentation/styles/index.css';

document.documentElement.classList.add('js');

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
const root = document.getElementById('root');
const tree = (
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Em produção o HTML já vem pré-renderizado (hidrata); no `vite dev` o root está vazio (monta do zero).
if (root.firstElementChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
```

`src/entry-server.jsx`:
```jsx
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { routes } from './routes.jsx';
import { pages, pageByPath } from './seo/pages.js';
import { buildHead } from './seo/buildHead.js';
import { site } from './config/site.js';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function renderAt(path, page) {
  const html = renderToString(
    <StaticRouter location={basename + path} basename={basename}>
      <App />
    </StaticRouter>,
  );
  return { html, head: buildHead(page, site) };
}

export const render = (path) => renderAt(path, pageByPath(path));
export const renderNotFound = () => renderAt('/pagina-inexistente/', pages.notFound);
export const routePaths = routes.map((r) => r.path);
export const siteUrl = site.url;
```

- [ ] **Step 6: Prerender helpers and script**

`scripts/lib/prerender-utils.mjs`:
```js
export function outFileFor(route) {
  return route === '/' ? 'index.html' : `${route.replace(/^\/|\/$/g, '')}/index.html`;
}

export function sitemapXml(routes, siteUrl, date) {
  const lastmod = date.toISOString().slice(0, 10);
  const urls = routes.map((r) => `  <url>\n    <loc>${siteUrl}${r}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

// Replacer em função para que "$&" e afins no conteúdo não sejam interpretados.
export function injectTemplate(template, { head, html }) {
  return template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
}
```

`scripts/prerender.mjs`:
```js
// Etapa final do build: transforma o bundle SSR em um index.html por rota, mais 404, sitemap e robots.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { outFileFor, sitemapXml, robotsTxt, injectTemplate } from './lib/prerender-utils.mjs';

const dist = path.resolve('dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const server = await import(pathToFileURL(path.join(dist, 'server', 'entry-server.js')).href);

for (const route of server.routePaths) {
  const file = path.join(dist, outFileFor(route));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, injectTemplate(template, server.render(route)));
  console.log('prerender', route, '->', path.relative(dist, file));
}

await writeFile(path.join(dist, '404.html'), injectTemplate(template, server.renderNotFound()));
await writeFile(path.join(dist, 'sitemap.xml'), sitemapXml(server.routePaths, server.siteUrl, new Date()));
await writeFile(path.join(dist, 'robots.txt'), robotsTxt(server.siteUrl));
await rm(path.join(dist, 'server'), { recursive: true, force: true });
console.log('prerender concluído:', server.routePaths.length, 'rotas +', '404.html, sitemap.xml, robots.txt');
```

- [ ] **Step 7: Run unit tests, then a real build**

Run: `npm test`
Expected: all suites pass (routes + prerender utils included).

Run: `npm run build`
Expected: three stages succeed; console lists 6 `prerender` lines; `dist/` contains `index.html`, `aplicativos/index.html`, `sites/index.html`, `sistemas-web/index.html`, `sobre/index.html`, `contato/index.html`, `404.html`, `sitemap.xml`, `robots.txt`, and no `server/` folder.

Run: `grep -c "<h1>" dist/sites/index.html` → `1`; `grep -o '<link rel="canonical" href="[^"]*"' dist/sites/index.html` → ends with `/sites/`.

Then smoke the hydrated app: `npm run preview` in a second terminal, open `http://localhost:4173/sites/`, confirm the page renders with the navy header and that clicking "Sobre" navigates without a full reload (no flash of empty page) and the tab title changes.

- [ ] **Step 8: Commit**

```bash
git add src/routes.jsx src/App.jsx src/entry-client.jsx src/entry-server.jsx src/presentation/pages scripts tests/routes.test.jsx tests/scripts
git commit -m "feat: react-router routes, SSR entry and static prerender pipeline"
```

---

### Task 11: Brand and store assets (one-off generators)

**Files:**
- Create: `scripts/assets/app-icons.mjs`, `scripts/assets/logo.mjs`, `scripts/assets/og-template.html`, `scripts/assets/og.mjs`, `public/site.webmanifest`
- Generated (commit them): `public/apps/{calcfrete,contador-de-cantos,prazzo,trama}.webp`, `public/badges/google-play-pt-br.png`, `public/badges/app-store-pt-br.svg`, `public/logo/mark.png`, `public/logo/mark-512.png`, `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/og/default.png`
- Test: `tests/assets/generated.test.js`

**Interfaces:**
- Consumes: `src/presentation/assets/logo-ai.png` (477×390 RGB, mark in cream on navy).
- Produces the public files listed above; `mark.png` is cream `#E9E6DE` on transparent, trimmed, 256 px tall.

- [ ] **Step 1: Write the failing test**

`tests/assets/generated.test.js`:
```js
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

const meta = (p) => sharp(p).metadata();

describe('generated brand and store assets', () => {
  it.each(['calcfrete', 'contador-de-cantos', 'prazzo', 'trama'])('public/apps/%s.webp is a 192px webp', async (slug) => {
    const m = await meta(`public/apps/${slug}.webp`);
    expect(m.format).toBe('webp');
    expect([m.width, m.height]).toEqual([192, 192]);
  });

  it('has both official store badges', () => {
    expect(existsSync('public/badges/google-play-pt-br.png')).toBe(true);
    expect(readFileSync('public/badges/app-store-pt-br.svg', 'utf8')).toContain('<svg');
  });

  it('logo mark is transparent and 256px tall', async () => {
    const m = await meta('public/logo/mark.png');
    expect(m.hasAlpha).toBe(true);
    expect(m.height).toBe(256);
  });

  it.each([
    ['public/favicon-32.png', 32],
    ['public/apple-touch-icon.png', 180],
    ['public/icon-192.png', 192],
    ['public/icon-512.png', 512],
    ['public/logo/mark-512.png', 512],
  ])('%s is %ipx square', async (file, size) => {
    const m = await meta(file);
    expect([m.width, m.height]).toEqual([size, size]);
  });

  it('favicon.svg embeds the mark and og image is 1200x630', async () => {
    expect(readFileSync('public/favicon.svg', 'utf8')).toMatch(/<image [^>]*data:image\/png;base64,/);
    const m = await meta('public/og/default.png');
    expect([m.width, m.height]).toEqual([1200, 630]);
  });

  it('webmanifest uses relative icon paths', () => {
    const manifest = JSON.parse(readFileSync('public/site.webmanifest', 'utf8'));
    expect(manifest.start_url).toBe('./');
    for (const icon of manifest.icons) expect(icon.src.startsWith('/')).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/assets/generated`
Expected: FAIL — files missing.

- [ ] **Step 3: Store assets script**

`scripts/assets/app-icons.mjs`:
```js
// Baixa os ícones oficiais dos apps (CDN da Play Store) e os badges das lojas. Roda uma vez; saída commitada.
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const icons = {
  calcfrete: 'https://play-lh.googleusercontent.com/e9pN90OowNdPlu5tPwr09d89yhz0sVngDFJNAwePJcdSEQDF60Wh-deaW1dNjhbUxrodT643Yb2RAFoji14WRw=s512',
  'contador-de-cantos': 'https://play-lh.googleusercontent.com/rrjPWwiHTpusMQcubqoH7o8lKfMsQPg_3uVqDJVdOSZ3dPJKWNuqVnqm-8oagi7suh7zkTdLVpAMTcVaSwLyEqY=s512',
  prazzo: 'https://play-lh.googleusercontent.com/eb8llslzPPn7l7W3H_vHoHdh6PCurmKLebTvPumLdZFHNUfoLv3G_qhsS9e_KJl-qzk2vkecyTU3D1NI-DkS=s512',
  trama: 'https://play-lh.googleusercontent.com/i5wdMEJqoLpv5bdBKkWq2wO-GW4dm-04OfouxuhfekmkmsTKYePtvmakJD2dxnHHIrAT0SqywlNAcPXexz9mrw=s512',
};

const badges = {
  'google-play-pt-br.png': 'https://play.google.com/intl/pt-BR/badges/static/images/badges/pt-br_badge_web_generic.png',
  'app-store-pt-br.svg': 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/pt-br?size=250x83&releaseDate=1276560000',
};

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ao baixar ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

mkdirSync('public/apps', { recursive: true });
mkdirSync('public/badges', { recursive: true });

for (const [slug, url] of Object.entries(icons)) {
  const png = await fetchBuffer(url);
  await sharp(png).resize(192, 192).webp({ quality: 86 }).toFile(`public/apps/${slug}.webp`);
  console.log('ícone:', slug);
}
for (const [file, url] of Object.entries(badges)) {
  writeFileSync(`public/badges/${file}`, await fetchBuffer(url));
  console.log('badge:', file);
}
```

Run: `node scripts/assets/app-icons.mjs` — expected: 4 "ícone" + 2 "badge" lines.

- [ ] **Step 4: Logo script (background removal + icons)**

`scripts/assets/logo.mjs`:
```js
// Separa a marca (creme) do fundo navy do PNG original e gera favicons e ícones.
// alpha = (luminância − fundo) / (marca − fundo); a cor final é o creme do logo (#E9E6DE).
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'src/presentation/assets/logo-ai.png';
const CREAM = [233, 230, 222];
const NAVY = '#010D33';

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const lum = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
const bg = lum(0);
let fg = 0;
for (let i = 0; i < data.length; i += 3) fg = Math.max(fg, lum(i));

const out = Buffer.alloc(info.width * info.height * 4);
for (let p = 0, i = 0; i < data.length; i += 3, p += 4) {
  const a = Math.min(1, Math.max(0, (lum(i) - bg) / (fg - bg)));
  out[p] = CREAM[0]; out[p + 1] = CREAM[1]; out[p + 2] = CREAM[2]; out[p + 3] = Math.round(a * 255);
}

mkdirSync('public/logo', { recursive: true });
const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toBuffer();
await sharp(trimmed).resize({ height: 256 }).png().toFile('public/logo/mark.png');

async function squareIcon(size, file) {
  const mark = await sharp(trimmed).resize({ width: Math.round(size * 0.6), height: Math.round(size * 0.6), fit: 'inside' }).toBuffer();
  const bgSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="${NAVY}"/></svg>`);
  await sharp(bgSvg).composite([{ input: mark, gravity: 'centre' }]).png().toFile(file);
  console.log('ícone:', file);
}
await squareIcon(512, 'public/logo/mark-512.png');
await squareIcon(512, 'public/icon-512.png');
await squareIcon(192, 'public/icon-192.png');
await squareIcon(180, 'public/apple-touch-icon.png');
await squareIcon(32, 'public/favicon-32.png');

const markB64 = (await sharp(trimmed).resize({ width: 160, height: 160, fit: 'inside' }).png().toBuffer()).toString('base64');
writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="13" fill="${NAVY}"/><image href="data:image/png;base64,${markB64}" x="13" y="13" width="38" height="38" preserveAspectRatio="xMidYMid meet"/></svg>\n`,
);
console.log('marca e favicons gerados');
```

Run: `node scripts/assets/logo.mjs`. Open `public/logo/mark.png` and `public/icon-512.png` and confirm the mark has clean edges and no navy halo. If a faint halo remains, raise the floor: replace `(lum(i) - bg)` with `(lum(i) - bg - 6)` and rerun.

- [ ] **Step 5: Web manifest and OG image**

`public/site.webmanifest`:
```json
{
  "name": "Innovate Apps Co.",
  "short_name": "Innovate Apps",
  "start_url": "./",
  "display": "browser",
  "background_color": "#F3F0E8",
  "theme_color": "#010D33",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`scripts/assets/og-template.html`:
```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Bricolage Grotesque'; font-weight: 200 800; src: url('../../public/fonts/bricolage-grotesque.woff2') format('woff2-variations'); }
  @font-face { font-family: 'Instrument Sans'; font-weight: 400 700; src: url('../../public/fonts/instrument-sans.woff2') format('woff2-variations'); }
  html, body { margin: 0; width: 1200px; height: 630px; background: #010D33; color: #F3F0E8; font-family: 'Instrument Sans', sans-serif; }
  .wrap { position: relative; height: 630px; padding: 72px 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 20px; font-family: 'Bricolage Grotesque'; font-weight: 700; font-size: 34px; }
  .brand img { height: 56px; }
  h1 { font-family: 'Bricolage Grotesque'; font-weight: 800; font-size: 78px; line-height: 1.02; letter-spacing: -0.03em; margin: 0; max-width: 980px; }
  h1 em { font-style: normal; color: #F0A030; }
  .meta { display: flex; gap: 32px; font-size: 24px; color: rgba(243,240,232,.75); }
  .meta b { color: #F3F0E8; font-weight: 600; }
  .rule { position: absolute; left: 80px; right: 80px; bottom: 150px; height: 2px; background: rgba(243,240,232,.16); }
</style>
</head>
<body>
<div class="wrap">
  <div class="brand"><img src="../../public/logo/mark.png" alt=""> Innovate Apps Co.</div>
  <h1>Sites, sistemas e <em>aplicativos</em> para empresas do Vale do Paraíba</h1>
  <div class="rule"></div>
  <div class="meta"><span><b>Taubaté – SP</b></span><span>Apps publicados na Google Play e App Store</span></div>
</div>
</body>
</html>
```

`scripts/assets/og.mjs`:
```js
// Gera public/og/default.png (1200x630) a partir do template, com o Chrome headless.
// Defina CHROME_PATH se o Chrome não estiver no caminho padrão do Windows.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = resolve('public/og/default.png');
mkdirSync('public/og', { recursive: true });
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${out}`,
  pathToFileURL(resolve('scripts/assets/og-template.html')).href,
], { stdio: 'ignore' });
console.log('og image:', out);
```

Run: `node scripts/assets/og.mjs`, then open `public/og/default.png` and confirm the fonts rendered (Bricolage headline, not Arial) and the mark is visible.

- [ ] **Step 6: Run tests and the build**

Run: `npm test -- tests/assets`
Expected: all passed.

Run: `npm run build` then `npm run preview`, open `http://localhost:4173/` and confirm the tab shows the favicon and the header shows the cream mark next to "Innovate Apps Co.".

- [ ] **Step 7: Commit**

```bash
git add scripts/assets public tests/assets/generated.test.js
git commit -m "feat: app icons, store badges, logo mark, favicons, manifest and OG image"
```

---
### Task 12: Home sections — Hero and TrustStrip

**Files:**
- Create: `src/presentation/sections/Hero.jsx` + `Hero.module.css`, `src/presentation/sections/TrustStrip.jsx` + `TrustStrip.module.css`
- Test: `tests/sections/Hero.test.jsx`, `tests/sections/TrustStrip.test.jsx`

**Interfaces:**
- Consumes: `site`, `contactHref`, `contactLabel`, `Button`, `Section`, `StoreBadges`, `Project` (via `GetProjects`).
- Produces: `<Hero apps={Project[]} />` (renders the page's only `<h1>`), `<TrustStrip appCount={number} />`.

- [ ] **Step 1: Write the failing tests**

`tests/sections/Hero.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Hero from '../../src/presentation/sections/Hero.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('Hero', () => {
  it('renders the H1, both CTAs and one tile per app', () => {
    render(<MemoryRouter><Hero apps={apps} /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Vale do Paraíba/);
    expect(screen.getByRole('link', { name: 'Fale com a gente' })).toHaveAttribute('href', '/contato/');
    expect(screen.getByRole('link', { name: 'Ver apps publicados' })).toHaveAttribute('href', '/#apps');
    expect(screen.getAllByRole('img').filter((i) => i.getAttribute('alt'))).toHaveLength(4);
    expect(screen.getByRole('img', { name: 'Ícone do app CalcFrete' })).toHaveAttribute('width', '72');
  });
});
```

`tests/sections/TrustStrip.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrustStrip from '../../src/presentation/sections/TrustStrip.jsx';

describe('TrustStrip', () => {
  it('links to both developer pages and shows the app count', () => {
    render(<TrustStrip appCount={4} />);
    expect(screen.getByRole('link', { name: 'Innovate Apps no Google Play' })).toHaveAttribute('href', expect.stringContaining('developer?id='));
    expect(screen.getByRole('link', { name: 'Innovate Apps na App Store' })).toHaveAttribute('href', expect.stringContaining('apps.apple.com'));
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText(/apps publicados/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/sections`
Expected: FAIL — modules not found.

- [ ] **Step 3: Hero**

`src/presentation/sections/Hero.jsx`:
```jsx
import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import Button from '../ui/Button.jsx';
import styles from './Hero.module.css';

export default function Hero({ apps }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={['container', styles.grid].join(' ')}>
        <div className={styles.copy}>
          <p className="eyebrow">Taubaté – SP · Vale do Paraíba</p>
          <h1 id="hero-title">
            Sites, sistemas e <span className={styles.accent}>aplicativos</span> para empresas do Vale do Paraíba
          </h1>
          <p className={styles.lead}>
            Somos uma empresa de tecnologia de Taubaté. Desenvolvemos o site, o sistema web e o app que a sua
            empresa precisa — e já publicamos os nossos na Google Play e na App Store.
          </p>
          <div className={styles.actions}>
            <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
            <Button href="/#apps" variant="onNavy" size="lg">Ver apps publicados</Button>
          </div>
          <p className={styles.proof}>
            <strong className="tabular">{apps.length} apps</strong> publicados nas duas lojas · atendimento presencial no Vale e remoto no Brasil
          </p>
        </div>

        <ul className={styles.cluster} aria-label="Apps desenvolvidos pela Innovate Apps">
          {apps.map((app, i) => (
            <li key={app.slug} className={styles.tile} data-index={i}>
              <img src={app.icon} alt={`Ícone do app ${app.title}`} width="72" height="72" loading={i < 2 ? 'eager' : 'lazy'} />
              <span className={styles.tileName}>{app.title}</span>
              <span className={styles.tileMeta}>{app.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

`src/presentation/sections/Hero.module.css`:
```css
.hero { background: var(--navy-900); color: var(--on-navy); padding-block: clamp(3.5rem, 8vw, 7rem) clamp(4rem, 9vw, 7.5rem); overflow: hidden; }
.hero :global(.eyebrow) { color: var(--amber); }
.grid { display: grid; gap: var(--space-8); align-items: center; }
.copy { display: grid; gap: var(--space-5); max-width: 40rem; }
.accent { color: var(--amber); }
.lead { font-size: var(--text-lg); line-height: 1.55; color: var(--on-navy-muted); max-width: 34rem; }
.actions { display: flex; flex-wrap: wrap; gap: var(--space-3); }
.proof { font-size: var(--text-sm); color: var(--on-navy-muted); }
.proof strong { color: var(--on-navy); }

.cluster { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); max-width: 30rem; }
.tile {
  display: grid; gap: 0.35rem; padding: var(--space-5);
  background: var(--navy-700); border: 1px solid var(--line-on-navy); border-radius: var(--radius-lg);
  transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.tile:hover { transform: translateY(-3px); border-color: rgba(243, 240, 232, 0.35); }
.tile img { border-radius: 18px; margin-bottom: var(--space-2); box-shadow: var(--shadow-md); }
.tileName { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); }
.tileMeta { font-size: var(--text-xs); color: var(--on-navy-muted); }
/* Escalonamento leve: as duas tiles da direita descem um pouco. Leitura de "prateleira", não de grade. */
.tile[data-index='1'], .tile[data-index='3'] { transform: translateY(1.5rem); }
.tile[data-index='1']:hover, .tile[data-index='3']:hover { transform: translateY(calc(1.5rem - 3px)); }

@media (min-width: 64rem) {
  .grid { grid-template-columns: 1.15fr 0.85fr; gap: var(--space-8); }
  .cluster { justify-self: end; }
}
```

- [ ] **Step 4: TrustStrip**

`src/presentation/sections/TrustStrip.jsx`:
```jsx
import { site } from '../../config/site.js';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './TrustStrip.module.css';

export default function TrustStrip({ appCount }) {
  return (
    <section className={styles.strip} aria-label="Prova de publicação nas lojas">
      <div className={['container', styles.row].join(' ')}>
        <div className={styles.text}>
          <p className={styles.title}>Publicados na Google Play e na App Store</p>
          <p className={styles.sub}>Produtos nossos, no ar, com usuários reais. O mesmo cuidado vai para o seu projeto.</p>
        </div>
        <StoreBadges name="Innovate Apps" stores={site.stores} />
        <dl className={styles.stats}>
          <div><dt>apps publicados</dt><dd className="tabular">{appCount}</dd></div>
          <div><dt>lojas</dt><dd className="tabular">2</dd></div>
          <div><dt>sede</dt><dd>Taubaté – SP</dd></div>
        </dl>
      </div>
    </section>
  );
}
```

`src/presentation/sections/TrustStrip.module.css`:
```css
.strip { background: var(--paper-2); border-block: 1px solid var(--line); padding-block: var(--space-6); }
.row { display: grid; gap: var(--space-5); align-items: center; }
.text { display: grid; gap: 0.25rem; }
.title { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); letter-spacing: -0.01em; }
.sub { color: var(--ink-muted); font-size: var(--text-sm); max-width: 32rem; }
.stats { display: flex; flex-wrap: wrap; gap: var(--space-6); }
.stats div { display: flex; flex-direction: column-reverse; }
.stats dt { font-size: var(--text-xs); color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.stats dd { font-family: var(--font-heading); font-weight: 700; font-size: 1.75rem; line-height: 1; }
@media (min-width: 64rem) { .row { grid-template-columns: 1.2fr auto auto; gap: var(--space-8); } }
```

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/sections`
Expected: all passed.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/sections/Hero.jsx src/presentation/sections/Hero.module.css src/presentation/sections/TrustStrip.jsx src/presentation/sections/TrustStrip.module.css tests/sections
git commit -m "feat: hero with real app tiles and store trust strip"
```

---

### Task 13: Home sections — ServicesGrid, AppsShowcase, WebCase

**Files:**
- Create: `src/presentation/sections/ServicesGrid.jsx` + `.module.css`, `AppsShowcase.jsx` + `.module.css`, `WebCase.jsx` + `.module.css`
- Test: `tests/sections/ServicesGrid.test.jsx`, `tests/sections/AppsShowcase.test.jsx`, `tests/sections/WebCase.test.jsx`

**Interfaces:**
- Produces: `<ServicesGrid />` (reads `services`), `<AppsShowcase apps id='apps' tone='navy' eyebrow title lead />`, `<WebCase project />`.

- [ ] **Step 1: Write the failing tests**

`tests/sections/ServicesGrid.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ServicesGrid from '../../src/presentation/sections/ServicesGrid.jsx';

describe('ServicesGrid', () => {
  it('renders three numbered service cards linking to their pages', () => {
    render(<MemoryRouter><ServicesGrid /></MemoryRouter>);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver aplicativos/ })).toHaveAttribute('href', '/aplicativos/');
    expect(screen.getByRole('link', { name: /Ver sistemas web/ })).toHaveAttribute('href', '/sistemas-web/');
  });
});
```

`tests/sections/AppsShowcase.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppsShowcase from '../../src/presentation/sections/AppsShowcase.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';

const apps = new ProjectRepository().getProjects().filter((p) => p.type === 'app');

describe('AppsShowcase', () => {
  it('renders one card per app with platforms and store links', () => {
    render(<AppsShowcase apps={apps} />);
    expect(document.getElementById('apps')).not.toBeNull();
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Trama no Google Play' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Trama na App Store' })).toBeNull();
    expect(screen.getAllByText('Android')).toHaveLength(4);
    expect(screen.getAllByText('iOS')).toHaveLength(3);
  });
});
```

`tests/sections/WebCase.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WebCase from '../../src/presentation/sections/WebCase.jsx';
import { ProjectRepository } from '../../src/data/repositories/ProjectRepository.js';

const [web] = new ProjectRepository().getProjects().filter((p) => p.type === 'web');

describe('WebCase', () => {
  it('shows the case and links to the live site', () => {
    render(<WebCase project={web} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Advalice Camargo');
    expect(screen.getByRole('link', { name: /Visitar o site/ })).toHaveAttribute('href', 'https://advalicecamargo.com.br/');
    expect(screen.getAllByText('advalicecamargo.com.br').length).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/sections`
Expected: FAIL for the three new suites.

- [ ] **Step 3: ServicesGrid**

`src/presentation/sections/ServicesGrid.jsx`:
```jsx
import { ArrowRight, Check } from 'lucide-react';
import { services } from '../../data/content/services.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import styles from './ServicesGrid.module.css';

export default function ServicesGrid() {
  return (
    <Section id="servicos">
      <SectionHeading
        eyebrow="O que fazemos"
        title="Três frentes, um mesmo jeito de trabalhar"
        lead="Escopo por escrito, entregas frequentes e o código é seu no final. Escolha por onde começar."
      />
      <div className={styles.grid}>
        {services.map((s) => (
          <article key={s.slug} className={styles.card} data-reveal>
            <span className={styles.number} aria-hidden="true">{s.number}</span>
            <h3>{s.name}</h3>
            <p className={styles.summary}>{s.summary}</p>
            <ul className={styles.bullets}>
              {s.bullets.map((b) => (
                <li key={b}><Check size={16} aria-hidden="true" /> {b}</li>
              ))}
            </ul>
            <Button href={s.path} variant="ghost" icon={ArrowRight}>Ver {s.shortName.toLowerCase()}</Button>
          </article>
        ))}
      </div>
    </Section>
  );
}
```

`src/presentation/sections/ServicesGrid.module.css`:
```css
.grid { display: grid; gap: var(--space-5); }
.card {
  display: grid; gap: var(--space-4); align-content: start;
  padding: var(--space-6); background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg);
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.number { font-family: var(--font-heading); font-weight: 800; font-size: 2.5rem; line-height: 1; color: var(--amber); letter-spacing: -0.04em; }
.summary { color: var(--ink-muted); }
.bullets { display: grid; gap: 0.5rem; font-size: var(--text-sm); }
.bullets li { display: flex; align-items: center; gap: 0.5rem; }
.bullets svg { color: var(--amber-hover); flex: none; }
.card > a { justify-self: start; margin-top: auto; }
@media (min-width: 48rem) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

- [ ] **Step 4: AppsShowcase**

`src/presentation/sections/AppsShowcase.jsx`:
```jsx
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './AppsShowcase.module.css';

export default function AppsShowcase({
  apps,
  id = 'apps',
  tone = 'navy',
  eyebrow = 'Apps publicados',
  title = 'Produtos nossos, no ar nas duas lojas',
  lead = 'Cada um nasceu de um problema real de quem trabalha. É o mesmo processo que usamos nos projetos de clientes.',
}) {
  return (
    <Section id={id} tone={tone} className={tone === 'navy' ? '' : styles.paperTone}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <div className={styles.grid}>
        {apps.map((app) => (
          <article key={app.slug} className={styles.card} data-reveal>
            <img src={app.icon} alt="" width="72" height="72" loading="lazy" className={styles.icon} />
            <div className={styles.body}>
              <p className={styles.category}>{app.category}</p>
              <h3>{app.title}</h3>
              <p className={styles.tagline}>{app.tagline}</p>
              <ul className={styles.platforms} aria-label="Plataformas">
                {app.platforms.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <StoreBadges name={app.title} stores={app.stores} size="sm" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
```

`src/presentation/sections/AppsShowcase.module.css`:
```css
.grid { display: grid; gap: var(--space-5); }
.card {
  display: grid; grid-template-columns: auto 1fr; gap: var(--space-5); align-items: start;
  padding: var(--space-6); border: 1px solid var(--line-on-navy); border-radius: var(--radius-lg);
  background: var(--navy-700);
}
.icon { border-radius: 18px; box-shadow: var(--shadow-md); }
.body { display: grid; gap: var(--space-3); }
.category { font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--amber); }
.tagline { color: var(--on-navy-muted); }
.platforms { display: flex; gap: 0.5rem; }
.platforms li { font-size: var(--text-xs); font-weight: 600; padding: 0.2rem 0.6rem; border: 1px solid var(--line-on-navy); border-radius: 999px; }
@media (min-width: 48rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
```

The `paper` tone (used by service pages in Task 16) restyles the cards — this block is part of the same file:
```css
.paperTone .card { background: #fff; border-color: var(--line); }
.paperTone .tagline { color: var(--ink-muted); }
.paperTone .platforms li { border-color: var(--line); }
.paperTone .category { color: var(--amber-hover); }
```

- [ ] **Step 5: WebCase**

`src/presentation/sections/WebCase.jsx`:
```jsx
import { ArrowUpRight } from 'lucide-react';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Button from '../ui/Button.jsx';
import styles from './WebCase.module.css';

const host = (url) => new URL(url).host;

export default function WebCase({ project }) {
  return (
    <Section id="case">
      <SectionHeading eyebrow="Case" title="Um site que precisa transmitir autoridade" lead="Escritório de advocacia em Taubaté. Paleta sóbria, tipografia forte e contato a um toque." />
      <div className={styles.grid} data-reveal>
        <div className={styles.copy}>
          <p className="eyebrow">{project.category}</p>
          <h3>{project.title}</h3>
          <p className={styles.desc}>{project.desc}</p>
          <Button href={project.url} variant="secondary" icon={ArrowUpRight}>Visitar o site</Button>
        </div>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.frame} aria-label={`Abrir ${project.title} em nova aba`}>
          <span className={styles.chrome} aria-hidden="true"><i /><i /><i /><span>{host(project.url)}</span></span>
          <span className={styles.canvas} aria-hidden="true">
            <span className={styles.wordmark}>{project.title.split(' ').slice(0, 2).join(' ')}</span>
            <span className={styles.domain}>{host(project.url)}</span>
          </span>
        </a>
      </div>
    </Section>
  );
}
```

`src/presentation/sections/WebCase.module.css`:
```css
.grid { display: grid; gap: var(--space-6); align-items: center; }
.copy { display: grid; gap: var(--space-4); max-width: 30rem; }
.desc { color: var(--ink-muted); }
.copy > a { justify-self: start; }
.frame { display: block; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow-md); text-decoration: none; background: #fff; }
.chrome { display: flex; align-items: center; gap: 0.4rem; padding: 0.6rem 0.9rem; background: var(--paper-2); border-bottom: 1px solid var(--line); font-size: var(--text-xs); color: var(--ink-muted); }
.chrome i { width: 9px; height: 9px; border-radius: 50%; background: var(--line); }
.chrome span { margin-left: 0.5rem; }
.canvas { display: grid; place-content: center; gap: 0.5rem; min-height: 16rem; padding: var(--space-6); background: var(--navy-900); color: var(--on-navy); text-align: center; }
.wordmark { font-family: var(--font-heading); font-weight: 800; font-size: clamp(1.75rem, 4vw, 2.75rem); letter-spacing: -0.02em; }
.domain { font-size: var(--text-sm); color: var(--amber); }
@media (min-width: 64rem) { .grid { grid-template-columns: 0.9fr 1.1fr; gap: var(--space-8); } }
```

- [ ] **Step 6: Run tests**

Run: `npm test -- tests/sections`
Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add src/presentation/sections tests/sections
git commit -m "feat: services grid, apps showcase and web case sections"
```

---

### Task 14: Home sections — Process, LocalArea, Faq, CtaBand

**Files:**
- Create: `src/presentation/sections/Process.jsx` + `.module.css`, `LocalArea.jsx` + `.module.css`, `Faq.jsx` + `.module.css`, `CtaBand.jsx` + `.module.css`
- Test: `tests/sections/Faq.test.jsx`, `tests/sections/CtaBand.test.jsx`, `tests/sections/LocalArea.test.jsx`

**Interfaces:**
- Produces: `<Process />`, `<LocalArea />`, `<Faq items eyebrow title id />`, `<CtaBand title text />`.

- [ ] **Step 1: Write the failing tests**

`tests/sections/Faq.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Faq from '../../src/presentation/sections/Faq.jsx';

describe('Faq', () => {
  it('renders native details/summary per item, first one open', () => {
    render(<Faq items={[{ q: 'A?', a: 'a.' }, { q: 'B?', a: 'b.' }]} />);
    const details = document.querySelectorAll('details');
    expect(details).toHaveLength(2);
    expect(details[0]).toHaveAttribute('open');
    expect(details[1]).not.toHaveAttribute('open');
    expect(screen.getByText('A?').tagName).toBe('SUMMARY');
    expect(screen.getByText('b.')).toBeInTheDocument();
  });
});
```

`tests/sections/CtaBand.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CtaBand from '../../src/presentation/sections/CtaBand.jsx';

describe('CtaBand', () => {
  it('uses the contact fallback when whatsapp is empty', () => {
    render(<MemoryRouter><CtaBand /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/projeto/);
    expect(screen.getByRole('link', { name: 'Fale com a gente' })).toHaveAttribute('href', '/contato/');
  });
});
```

`tests/sections/LocalArea.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LocalArea from '../../src/presentation/sections/LocalArea.jsx';
import { cities } from '../../src/data/content/cities.js';

describe('LocalArea', () => {
  it('lists every city served, Taubaté marked as HQ', () => {
    render(<LocalArea />);
    const list = screen.getByRole('list', { name: 'Cidades atendidas' });
    expect(list.querySelectorAll('li')).toHaveLength(cities.length);
    expect(screen.getByText('Taubaté').closest('li')).toHaveTextContent('sede');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/sections/Faq tests/sections/CtaBand tests/sections/LocalArea`
Expected: FAIL — modules not found.

- [ ] **Step 3: Process and LocalArea**

`src/presentation/sections/Process.jsx`:
```jsx
import { processSteps } from '../../data/content/process.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Process.module.css';

export default function Process() {
  return (
    <Section id="como-funciona" tone="paper2">
      <SectionHeading eyebrow="Como funciona" title="Do primeiro contato à entrega, sem surpresa" />
      <ol className={styles.steps}>
        {processSteps.map((step) => (
          <li key={step.number} className={styles.step} data-reveal>
            <span className={styles.number} aria-hidden="true">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

`src/presentation/sections/Process.module.css`:
```css
.steps { display: grid; gap: var(--space-5); counter-reset: step; }
.step { display: grid; gap: var(--space-3); padding-top: var(--space-4); border-top: 2px solid var(--ink); }
.number { font-family: var(--font-heading); font-weight: 800; font-size: var(--text-sm); letter-spacing: 0.1em; color: var(--amber-hover); }
.step p { color: var(--ink-muted); font-size: var(--text-sm); }
@media (min-width: 48rem) { .steps { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-6); } }
```

`src/presentation/sections/LocalArea.jsx`:
```jsx
import { MapPin } from 'lucide-react';
import { cities } from '../../data/content/cities.js';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './LocalArea.module.css';

export default function LocalArea() {
  return (
    <Section id="regiao">
      <div className={styles.grid}>
        <div>
          <SectionHeading
            eyebrow="De Taubaté para o Vale"
            title="Perto o bastante para sentar e conversar"
            lead="Atendemos presencialmente em Taubaté e nas cidades do Vale do Paraíba e Litoral Norte. Para o restante do Brasil, trabalhamos remotamente com o mesmo processo."
          />
          <p className={styles.note}><MapPin size={18} aria-hidden="true" /> Sede em Taubaté – SP</p>
        </div>
        <ul className={styles.cities} aria-label="Cidades atendidas" data-reveal>
          {cities.map((city, i) => (
            <li key={city} className={i === 0 ? styles.hq : undefined}>
              <span>{city}</span>{i === 0 ? <small>sede</small> : null}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
```

`src/presentation/sections/LocalArea.module.css`:
```css
.grid { display: grid; gap: var(--space-6); align-items: start; }
.note { display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600; }
.cities { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.cities li { padding: 0.55rem 0.95rem; border: 1px solid var(--line); border-radius: 999px; background: #fff; font-size: var(--text-sm); font-weight: 500; }
.hq { background: var(--navy-900) !important; color: var(--on-navy); border-color: var(--navy-900) !important; }
.hq small { color: var(--amber); font-weight: 600; margin-left: 0.35rem; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.7em; }
@media (min-width: 64rem) { .grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); } }
```

- [ ] **Step 4: Faq and CtaBand**

`src/presentation/sections/Faq.jsx`:
```jsx
import { ChevronDown } from 'lucide-react';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Faq.module.css';

// <details> nativo: acessível, indexável e sem JS. A primeira pergunta abre para mostrar o padrão.
export default function Faq({ items, eyebrow = 'Perguntas frequentes', title = 'O que costumam nos perguntar', id = 'faq' }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className={styles.list}>
        {items.map((item, i) => (
          <details key={item.q} className={styles.item} open={i === 0 || undefined}>
            <summary className={styles.summary}>
              {item.q}
              <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
            </summary>
            <p className={styles.answer}>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
```

`src/presentation/sections/Faq.module.css`:
```css
.list { display: grid; max-width: 46rem; border-top: 1px solid var(--line); }
.item { border-bottom: 1px solid var(--line); }
.summary {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  padding: 1.1rem 0; cursor: pointer; list-style: none;
  font-family: var(--font-heading); font-weight: 600; font-size: var(--text-lg); letter-spacing: -0.01em;
}
.summary::-webkit-details-marker { display: none; }
.chevron { flex: none; transition: transform var(--dur) var(--ease); }
.item[open] .chevron { transform: rotate(180deg); }
.answer { padding-bottom: 1.25rem; color: var(--ink-muted); max-width: 40rem; }
```

`src/presentation/sections/CtaBand.jsx`:
```jsx
import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import styles from './CtaBand.module.css';

export default function CtaBand({
  title = 'Vamos conversar sobre o seu projeto?',
  text = 'Conte o que a sua empresa precisa. Em uma conversa curta a gente já consegue dizer por onde começar, quanto tempo leva e uma faixa de investimento.',
}) {
  return (
    <Section tone="navy" className={styles.band}>
      <div className={styles.inner}>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className={styles.actions}>
          <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
          <Button href="/contato/" variant="onNavy" size="lg">Ver formas de contato</Button>
        </div>
      </div>
    </Section>
  );
}
```

`src/presentation/sections/CtaBand.module.css`:
```css
.band { padding-block: clamp(3.5rem, 7vw, 5.5rem); }
.inner { display: grid; gap: var(--space-5); max-width: 44rem; }
.inner p { color: var(--on-navy-muted); font-size: var(--text-lg); }
.actions { display: flex; flex-wrap: wrap; gap: var(--space-3); }
```

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/sections`
Expected: all passed.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/sections tests/sections
git commit -m "feat: process, local area, FAQ and CTA band sections"
```

---
### Task 15: Home page assembly and screenshot helper

**Files:**
- Modify: `src/presentation/pages/Home.jsx`, `.gitignore`
- Create: `scripts/dev/screenshot.mjs`
- Test: `tests/pages/Home.test.jsx`

**Interfaces:**
- Consumes: every section from Tasks 12–14, `homeFaq`, `GetProjects`.
- Produces: the final `Home` page; `node scripts/dev/screenshot.mjs <baseUrl> [routes...]` writes `screenshots/<route>-<desktop|mobile>.png`.

- [ ] **Step 1: Write the failing test**

`tests/pages/Home.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from '../../src/presentation/pages/Home.jsx';

describe('Home', () => {
  it('has one H1 and every section anchor in order', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const ids = ['servicos', 'apps', 'case', 'como-funciona', 'regiao', 'faq'].map((id) => document.getElementById(id));
    expect(ids.every(Boolean)).toBe(true);
    const order = ids.map((el) => Array.from(document.querySelectorAll('section')).indexOf(el));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(document.querySelectorAll('details')).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/pages/Home`
Expected: FAIL — the stub Home has no `#servicos`.

- [ ] **Step 3: Assemble the page**

`src/presentation/pages/Home.jsx`:
```jsx
import Hero from '../sections/Hero.jsx';
import TrustStrip from '../sections/TrustStrip.jsx';
import ServicesGrid from '../sections/ServicesGrid.jsx';
import AppsShowcase from '../sections/AppsShowcase.jsx';
import WebCase from '../sections/WebCase.jsx';
import Process from '../sections/Process.jsx';
import LocalArea from '../sections/LocalArea.jsx';
import Faq from '../sections/Faq.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import { homeFaq } from '../../data/content/faq.js';
import { ProjectRepository } from '../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../domain/usecases/GetProjects.js';

const projects = new GetProjects(new ProjectRepository());
const apps = projects.execute({ type: 'app' });
const [webCase] = projects.execute({ type: 'web' });

export default function Home() {
  return (
    <>
      <Hero apps={apps} />
      <TrustStrip appCount={apps.length} />
      <ServicesGrid />
      <AppsShowcase apps={apps} />
      <WebCase project={webCase} />
      <Process />
      <LocalArea />
      <Faq items={homeFaq} />
      <CtaBand />
    </>
  );
}
```

- [ ] **Step 4: Screenshot helper**

`scripts/dev/screenshot.mjs`:
```js
// Uso: node scripts/dev/screenshot.mjs http://localhost:4173 / /sites/ /aplicativos/
// Gera screenshots/<rota>-desktop.png (1440x1000) e -mobile.png (390x844) com o Chrome headless.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [base, ...routes] = process.argv.slice(2);
if (!base) throw new Error('informe a URL base, ex.: http://localhost:4173');
mkdirSync('screenshots', { recursive: true });

const sizes = { desktop: '1440,1000', mobile: '390,844' };
for (const route of routes.length ? routes : ['/']) {
  const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  for (const [label, size] of Object.entries(sizes)) {
    const out = resolve('screenshots', `${name}-${label}.png`);
    execFileSync(chrome, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${size}`,
      '--virtual-time-budget=5000', `--screenshot=${out}`, `${base}${route}`,
    ], { stdio: 'ignore' });
    console.log('screenshot:', out);
  }
}
```

Append `screenshots/` to `.gitignore`.

- [ ] **Step 5: Run tests, build, look at the page**

Run: `npm test` → all pass.
Run: `npm run build`, then start `npm run preview` in the background, wait until `curl -s -o /dev/null -w "%{http_code}" http://localhost:4173/` prints `200`, then `node scripts/dev/screenshot.mjs http://localhost:4173 /`.

Open `screenshots/home-desktop.png` and `screenshots/home-mobile.png` and check, against the spec: navy hero with cream H1 and amber "aplicativos", four app tiles with real icons, cream sections, one amber accent only, no gradients, Bricolage headings (tall, slightly condensed — if you see Arial, the font preload path is wrong). On mobile the hero stacks and the tiles form a 2-column grid. Fix anything off before committing. Stop the preview server.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/pages/Home.jsx scripts/dev/screenshot.mjs .gitignore tests/pages/Home.test.jsx
git commit -m "feat: assemble home page; add headless screenshot helper"
```

---

### Task 16: Service pages

**Files:**
- Modify: `src/presentation/pages/ServicePage.jsx`
- Create: `src/presentation/pages/ServicePage.module.css`, `src/presentation/sections/Audience.jsx` + `.module.css`, `src/presentation/sections/Deliverables.jsx` + `.module.css`
- Test: `tests/pages/ServicePage.test.jsx`

**Interfaces:**
- Consumes: `Service` (Task 4), `AppsShowcase`, `WebCase`, `Process`, `Faq`, `CtaBand`, `Breadcrumb`, `Button`.
- Produces: `<ServicePage service />`, `<Audience items />`, `<Deliverables items />`.

- [ ] **Step 1: Write the failing test**

`tests/pages/ServicePage.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ServicePage from '../../src/presentation/pages/ServicePage.jsx';
import { services } from '../../src/data/content/services.js';

const r = (svc) => render(<MemoryRouter initialEntries={[svc.path]}><ServicePage service={svc} /></MemoryRouter>);

describe('ServicePage', () => {
  it.each(services)('$slug renders hero, audience, deliverables, faq and CTA', (svc) => {
    r(svc);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(svc.hero.title);
    expect(screen.getByText(svc.shortName, { selector: '[aria-current="page"]' })).toBeInTheDocument();
    for (const a of svc.audience) expect(screen.getByText(a.name)).toBeInTheDocument();
    for (const d of svc.deliverables) expect(screen.getByText(d.title)).toBeInTheDocument();
    expect(document.querySelectorAll('details')).toHaveLength(svc.faq.length);
    expect(screen.getAllByRole('link', { name: 'Fale com a gente' }).length).toBeGreaterThanOrEqual(2);
    document.body.innerHTML = '';
  });

  it('aplicativos proves with the app showcase; sites and sistemas-web with the web case', () => {
    r(services[0]);
    expect(document.getElementById('apps')).not.toBeNull();
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(4);
    document.body.innerHTML = '';
    r(services[1]);
    expect(document.getElementById('apps')).toBeNull();
    expect(screen.getByRole('link', { name: /Visitar o site/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/pages/ServicePage`
Expected: FAIL — no audience/deliverables/FAQ yet.

- [ ] **Step 3: Audience and Deliverables sections**

`src/presentation/sections/Audience.jsx`:
```jsx
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Audience.module.css';

export default function Audience({ items }) {
  return (
    <Section id="para-quem">
      <SectionHeading eyebrow="Para quem é" title="Situações em que isso resolve" />
      <ul className={styles.grid}>
        {items.map((it) => (
          <li key={it.name} className={styles.card} data-reveal>
            <h3>{it.name}</h3>
            <p>{it.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

`src/presentation/sections/Audience.module.css`:
```css
.grid { display: grid; gap: var(--space-4); }
.card { display: grid; gap: var(--space-2); padding: var(--space-5); border: 1px solid var(--line); border-radius: var(--radius-md); background: #fff; }
.card h3 { font-size: var(--text-lg); }
.card p { color: var(--ink-muted); font-size: var(--text-sm); }
@media (min-width: 48rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
```

`src/presentation/sections/Deliverables.jsx`:
```jsx
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import styles from './Deliverables.module.css';

export default function Deliverables({ items }) {
  return (
    <Section id="entregamos" tone="paper2">
      <SectionHeading eyebrow="O que entregamos" title="O que está incluído" />
      <dl className={styles.list}>
        {items.map((it, i) => (
          <div key={it.title} className={styles.row} data-reveal>
            <span className={styles.index} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <dt>{it.title}</dt>
            <dd>{it.text}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
```

`src/presentation/sections/Deliverables.module.css`:
```css
.list { display: grid; border-top: 1px solid var(--line); max-width: 52rem; }
.row { display: grid; grid-template-columns: 3rem 1fr; gap: 0 var(--space-4); padding: var(--space-5) 0; border-bottom: 1px solid var(--line); }
.index { grid-row: span 2; font-family: var(--font-heading); font-weight: 800; color: var(--amber-hover); font-size: var(--text-lg); }
.row dt { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); letter-spacing: -0.01em; }
.row dd { color: var(--ink-muted); margin-top: 0.35rem; }
```

- [ ] **Step 4: Full ServicePage**

`src/presentation/pages/ServicePage.jsx`:
```jsx
import { ArrowRight } from 'lucide-react';
import { site, contactHref, contactLabel } from '../../config/site.js';
import { ProjectRepository } from '../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../domain/usecases/GetProjects.js';
import Breadcrumb from '../ui/Breadcrumb.jsx';
import Button from '../ui/Button.jsx';
import Audience from '../sections/Audience.jsx';
import Deliverables from '../sections/Deliverables.jsx';
import Process from '../sections/Process.jsx';
import AppsShowcase from '../sections/AppsShowcase.jsx';
import WebCase from '../sections/WebCase.jsx';
import Faq from '../sections/Faq.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import styles from './ServicePage.module.css';

const projects = new GetProjects(new ProjectRepository());
const apps = projects.execute({ type: 'app' });
const [webCase] = projects.execute({ type: 'web' });

export default function ServicePage({ service }) {
  return (
    <>
      <section className={styles.hero} aria-labelledby="service-title">
        <div className="container">
          <Breadcrumb items={[{ name: 'Início', path: '/' }, { name: service.shortName, path: service.path }]} />
          <p className="eyebrow">{service.number} · {service.shortName}</p>
          <h1 id="service-title">{service.hero.title}</h1>
          <p className={styles.lead}>{service.hero.lead}</p>
          <div className={styles.actions}>
            <Button href={contactHref(site)} size="lg" icon={ArrowRight}>{contactLabel(site)}</Button>
            <Button href="#entregamos" variant="onNavy" size="lg">O que está incluído</Button>
          </div>
        </div>
      </section>

      <Audience items={service.audience} />
      <Deliverables items={service.deliverables} />
      <Process />
      {service.proof === 'apps' ? (
        <AppsShowcase apps={apps} tone="paper" eyebrow="Prova" title="Apps que já publicamos" lead="Os nossos próprios produtos, na Google Play e na App Store." />
      ) : (
        <WebCase project={webCase} />
      )}
      <Faq items={service.faq} title={`Dúvidas sobre ${service.shortName.toLowerCase()}`} />
      <CtaBand title={`Precisa de ${service.shortName.toLowerCase()} para a sua empresa?`} />
    </>
  );
}
```

`src/presentation/pages/ServicePage.module.css`:
```css
.hero { background: var(--navy-900); color: var(--on-navy); padding-block: var(--space-6) clamp(3.5rem, 8vw, 6rem); }
.hero :global(.eyebrow) { color: var(--amber); margin-bottom: var(--space-4); }
.hero h1 { max-width: 44rem; font-size: var(--display-2); font-weight: 800; }
.lead { margin-top: var(--space-4); max-width: 38rem; font-size: var(--text-lg); color: var(--on-navy-muted); }
.actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-6); }
```

Note: `href="#entregamos"` is an in-page anchor, so `Button` renders it as a react-router `Link` to `#entregamos`; react-router resolves it to the current path plus hash and `useDocumentMeta` scrolls to it.

- [ ] **Step 5: Run tests, build, screenshots**

Run: `npm test` → all pass.
Run: `npm run build`, start `npm run preview` in the background, then `node scripts/dev/screenshot.mjs http://localhost:4173 /aplicativos/ /sites/ /sistemas-web/`. Check `screenshots/aplicativos-desktop.png`: breadcrumb, navy hero with the H1 at `display-2` size, cream "Para quem é" cards, `paper2` deliverables list, apps showcase on cream (white cards). Stop the preview.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/pages/ServicePage.jsx src/presentation/pages/ServicePage.module.css src/presentation/sections/Audience.jsx src/presentation/sections/Audience.module.css src/presentation/sections/Deliverables.jsx src/presentation/sections/Deliverables.module.css tests/pages/ServicePage.test.jsx
git commit -m "feat: service pages with audience, deliverables, proof and FAQ"
```

---

### Task 17: Sobre, Contato and NotFound pages

**Files:**
- Modify: `src/presentation/pages/Sobre.jsx`, `src/presentation/pages/Contato.jsx`
- Create: `src/presentation/pages/Sobre.module.css`, `src/presentation/pages/Contato.module.css`
- Test: `tests/pages/Sobre.test.jsx`, `tests/pages/Contato.test.jsx`, `tests/pages/NotFound.test.jsx`

**Interfaces:**
- Consumes: `site`, `cities`, `AppsShowcase`, `LocalArea`, `CtaBand`, `Breadcrumb`, `Button`, `StoreBadges`.

- [ ] **Step 1: Write the failing tests**

`tests/pages/Sobre.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Sobre from '../../src/presentation/pages/Sobre.jsx';

describe('Sobre', () => {
  it('tells the story, the founder and the facts', () => {
    render(<MemoryRouter><Sobre /></MemoryRouter>);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Taubaté/);
    expect(screen.getAllByText('Kevin Silva').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('list', { name: 'Cidades atendidas' })).toBeInTheDocument();
    expect(document.getElementById('apps')).not.toBeNull();
  });
});
```

`tests/pages/Contato.test.jsx`:
```jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

afterEach(() => vi.resetModules());

const load = async (overrides) => {
  vi.doMock('../../src/config/site.js', async (importOriginal) => {
    const mod = await importOriginal();
    return { ...mod, site: { ...mod.site, ...overrides } };
  });
  const { default: Contato } = await import('../../src/presentation/pages/Contato.jsx');
  render(<MemoryRouter><Contato /></MemoryRouter>);
};

describe('Contato', () => {
  it('without channels configured, shows hours, city and stores but no WhatsApp/email rows', async () => {
    await load({ whatsapp: '', email: '' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Fale com a Innovate Apps/);
    expect(screen.queryByRole('link', { name: /WhatsApp/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /@/ })).toBeNull();
    expect(screen.getByText(/Segunda a sexta/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Cidades atendidas' })).toBeInTheDocument();
  });

  it('with channels configured, shows a WhatsApp button and a mailto link', async () => {
    await load({ whatsapp: '5512999999999', email: 'oi@innovateapps.com.br' });
    expect(screen.getByRole('link', { name: 'Chamar no WhatsApp' })).toHaveAttribute('href', expect.stringContaining('wa.me/5512999999999'));
    expect(screen.getByRole('link', { name: 'oi@innovateapps.com.br' })).toHaveAttribute('href', 'mailto:oi@innovateapps.com.br');
  });
});
```

`tests/pages/NotFound.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NotFound from '../../src/presentation/pages/NotFound.jsx';

describe('NotFound', () => {
  it('has an H1 and a way home', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Página não encontrada');
    expect(screen.getByRole('link', { name: 'Voltar para o início' })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/pages`
Expected: Sobre and Contato FAIL; NotFound passes already.

- [ ] **Step 3: Sobre**

`src/presentation/pages/Sobre.jsx`:
```jsx
import { site } from '../../config/site.js';
import { ProjectRepository } from '../../data/repositories/ProjectRepository.js';
import { GetProjects } from '../../domain/usecases/GetProjects.js';
import Breadcrumb from '../ui/Breadcrumb.jsx';
import Section from '../ui/Section.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import AppsShowcase from '../sections/AppsShowcase.jsx';
import LocalArea from '../sections/LocalArea.jsx';
import CtaBand from '../sections/CtaBand.jsx';
import styles from './Sobre.module.css';

const apps = new GetProjects(new ProjectRepository()).execute({ type: 'app' });

const values = [
  { title: 'Escopo por escrito', text: 'Antes de começar, você sabe o que vai receber, quando e por quanto.' },
  { title: 'O código é seu', text: 'Repositório, hospedagem e contas nas lojas ficam no nome da sua empresa.' },
  { title: 'Perto de você', text: 'Reunião presencial em Taubaté e região, ou por vídeo quando for mais prático.' },
];

export default function Sobre() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="sobre-title">
        <div className="container">
          <Breadcrumb items={[{ name: 'Início', path: '/' }, { name: 'Sobre', path: '/sobre/' }]} />
          <p className="eyebrow">Sobre a {site.shortName}</p>
          <h1 id="sobre-title">Uma empresa de tecnologia de Taubaté</h1>
          <p className={styles.lead}>Desenvolvemos sites, sistemas web e aplicativos para empresas do Vale do Paraíba — e publicamos os nossos próprios apps para provar que o processo funciona.</p>
        </div>
      </section>

      <Section id="historia">
        <div className={styles.story}>
          <div className={styles.text}>
            <SectionHeading eyebrow="Quem está por trás" title="Feita por quem programa" />
            <p>A Innovate Apps foi fundada por <strong>{site.founder}</strong>, desenvolvedor de software com experiência em aplicativos Android e iOS, sistemas web e integrações. A empresa nasceu em Taubaté, SP, para atender empresas que precisam de tecnologia sob medida sem contratar uma equipe inteira.</p>
            <p>Além dos projetos para clientes, mantemos produtos próprios nas lojas: CalcFrete, Contador de Cantos, Prazzo e Trama. Cada um passou pelo mesmo caminho que oferecemos a você — conversa, proposta, desenvolvimento por etapas e publicação.</p>
            <p>Trabalhamos com poucas frentes ao mesmo tempo, de propósito. Quem conversa com você no orçamento é quem escreve o código.</p>
          </div>
          <dl className={styles.facts}>
            <div><dt>Sede</dt><dd>Taubaté – SP</dd></div>
            <div><dt>Fundador</dt><dd>{site.founder}</dd></div>
            <div><dt>Apps publicados</dt><dd className="tabular">{apps.length}</dd></div>
            <div><dt>Atendimento</dt><dd>Presencial no Vale, remoto no Brasil</dd></div>
          </dl>
        </div>
      </Section>

      <Section id="como-trabalhamos" tone="paper2">
        <SectionHeading eyebrow="Como trabalhamos" title="Três combinados que não mudam" />
        <ul className={styles.values}>
          {values.map((v) => (
            <li key={v.title} data-reveal>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <AppsShowcase apps={apps} tone="paper" eyebrow="Produtos próprios" title="O que já publicamos" lead="Na Google Play e na App Store." />
      <LocalArea />
      <CtaBand />
    </>
  );
}
```

`src/presentation/pages/Sobre.module.css`:
```css
.hero { background: var(--navy-900); color: var(--on-navy); padding-block: var(--space-6) clamp(3.5rem, 8vw, 6rem); }
.hero :global(.eyebrow) { color: var(--amber); margin-bottom: var(--space-4); }
.hero h1 { max-width: 40rem; font-size: var(--display-2); font-weight: 800; }
.lead { margin-top: var(--space-4); max-width: 38rem; font-size: var(--text-lg); color: var(--on-navy-muted); }
.story { display: grid; gap: var(--space-7); align-items: start; }
.text { display: grid; gap: var(--space-4); max-width: 40rem; }
.text p { color: var(--ink-muted); }
.facts { display: grid; gap: var(--space-4); padding: var(--space-6); background: var(--navy-900); color: var(--on-navy); border-radius: var(--radius-lg); }
.facts dt { font-size: var(--text-xs); letter-spacing: 0.1em; text-transform: uppercase; color: var(--amber); }
.facts dd { font-family: var(--font-heading); font-weight: 700; font-size: var(--text-lg); }
.values { display: grid; gap: var(--space-5); }
.values li { display: grid; gap: var(--space-2); padding-top: var(--space-4); border-top: 2px solid var(--ink); }
.values p { color: var(--ink-muted); }
@media (min-width: 64rem) { .story { grid-template-columns: 1.4fr 0.8fr; gap: var(--space-8); } .values { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

- [ ] **Step 4: Contato**

`src/presentation/pages/Contato.jsx`:
```jsx
import { MessageCircle, Mail, Clock, MapPin } from 'lucide-react';
import { site, contactHref } from '../../config/site.js';
import { cities } from '../../data/content/cities.js';
import Breadcrumb from '../ui/Breadcrumb.jsx';
import Section from '../ui/Section.jsx';
import Button from '../ui/Button.jsx';
import StoreBadges from '../ui/StoreBadges.jsx';
import styles from './Contato.module.css';

// Aviso interno: enquanto os canais não forem preenchidos em src/config/site.js, a página mostra só horário, cidade e lojas.
if (import.meta.env.DEV && !site.whatsapp && !site.email) {
  console.warn('[Innovate Apps] Preencha whatsapp e email em src/config/site.js');
}

export default function Contato() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="contato-title">
        <div className="container">
          <Breadcrumb items={[{ name: 'Início', path: '/' }, { name: 'Contato', path: '/contato/' }]} />
          <p className="eyebrow">Contato</p>
          <h1 id="contato-title">Fale com a Innovate Apps</h1>
          <p className={styles.lead}>Conte o que a sua empresa precisa. Respondemos em horário comercial e marcamos uma conversa presencial em Taubaté ou por vídeo.</p>
        </div>
      </section>

      <Section id="canais">
        <div className={styles.grid}>
          <div className={styles.channels}>
            {site.whatsapp ? (
              <div className={styles.card}>
                <MessageCircle size={24} aria-hidden="true" />
                <h2>WhatsApp</h2>
                <p>O jeito mais rápido de falar com a gente.</p>
                <Button href={contactHref(site)} size="lg">Chamar no WhatsApp</Button>
              </div>
            ) : null}
            {site.email ? (
              <div className={styles.card}>
                <Mail size={24} aria-hidden="true" />
                <h2>E-mail</h2>
                <p>Para propostas, documentos e orçamentos detalhados.</p>
                <a href={`mailto:${site.email}`} className={styles.link}>{site.email}</a>
              </div>
            ) : null}
            <div className={styles.card}>
              <Clock size={24} aria-hidden="true" />
              <h2>Horário</h2>
              <p>Segunda a sexta, das 9h às 18h.</p>
            </div>
            <div className={styles.card}>
              <MapPin size={24} aria-hidden="true" />
              <h2>Onde estamos</h2>
              <p>Taubaté – SP. Atendimento presencial no Vale do Paraíba e remoto em todo o Brasil.</p>
            </div>
          </div>

          <aside className={styles.aside}>
            <h2>Cidades atendidas</h2>
            <ul className={styles.cities} aria-label="Cidades atendidas">
              {cities.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <h2>Nossos apps</h2>
            <StoreBadges name="Innovate Apps" stores={site.stores} />
          </aside>
        </div>
      </Section>
    </>
  );
}
```

`src/presentation/pages/Contato.module.css`:
```css
.hero { background: var(--navy-900); color: var(--on-navy); padding-block: var(--space-6) clamp(3.5rem, 8vw, 6rem); }
.hero :global(.eyebrow) { color: var(--amber); margin-bottom: var(--space-4); }
.hero h1 { font-size: var(--display-2); font-weight: 800; }
.lead { margin-top: var(--space-4); max-width: 38rem; font-size: var(--text-lg); color: var(--on-navy-muted); }
.grid { display: grid; gap: var(--space-7); align-items: start; }
.channels { display: grid; gap: var(--space-4); }
.card { display: grid; gap: var(--space-2); padding: var(--space-5); background: #fff; border: 1px solid var(--line); border-radius: var(--radius-md); }
.card svg { color: var(--amber-hover); }
.card h2 { font-size: var(--text-lg); }
.card p { color: var(--ink-muted); }
.card > a { justify-self: start; margin-top: var(--space-2); }
.link { font-weight: 600; }
.aside { display: grid; gap: var(--space-4); }
.aside h2 { font-size: var(--text-md); font-family: var(--font-body); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted); }
.cities { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.cities li { padding: 0.45rem 0.85rem; border: 1px solid var(--line); border-radius: 999px; font-size: var(--text-sm); background: #fff; }
@media (min-width: 64rem) { .grid { grid-template-columns: 1.2fr 0.8fr; gap: var(--space-8); } .channels { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
```

- [ ] **Step 5: Run tests, build, screenshots**

Run: `npm test` → all pass.
Run: `npm run build`; start `npm run preview` in the background; `node scripts/dev/screenshot.mjs http://localhost:4173 /sobre/ /contato/ /nao-existe/`. Check the three desktop screenshots: Sobre shows the navy facts panel beside the story; Contato shows two cards (Horário, Onde estamos) and the city chips; `/nao-existe/` shows the 404 page inside the normal chrome. Stop the preview.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/pages tests/pages
git commit -m "feat: sobre and contato pages"
```

---
### Task 18: Build-output verification suite

**Files:**
- Create: `tests/build/dist.test.js`

**Interfaces:**
- Consumes: `dist/` produced by `npm run build`; `pages` (Task 6).
- Produces: `npm run test:build` — the gate the deploy workflow runs after building.

- [ ] **Step 1: Write the test (it is the deliverable; it must fail on a stale or missing dist)**

`tests/build/dist.test.js`:
```js
// @vitest-environment node
// Roda depois de `npm run build`. Verifica o HTML final que o GitHub Pages vai servir.
import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { pages } from '../../src/seo/pages.js';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://kevinsilva121.github.io/InnovateSite').replace(/\/$/, '');
const indexable = Object.values(pages).filter((p) => p.path);
const fileFor = (path) => (path === '/' ? 'dist/index.html' : `dist${path}index.html`);
const read = (f) => readFileSync(f, 'utf8');

beforeAll(() => {
  if (!existsSync('dist/index.html')) throw new Error('dist/ não existe — rode `npm run build` antes de `npm run test:build`');
});

describe('prerendered pages', () => {
  it.each(indexable)('$path has full HTML, one H1, correct head and JSON-LD', (page) => {
    const html = read(fileFor(page.path));
    expect(html).toContain('<html lang="pt-BR">');
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain(`<title>${page.title}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}${page.path}">`);
    expect(html).toContain('<meta name="robots" content="index, follow">');
    expect(html).toContain('<meta property="og:locale" content="pt_BR">');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('<!--app-html-->');
    expect(html).not.toContain('<!--app-head-->');

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    expect(blocks.length).toBeGreaterThanOrEqual(1);
    const types = blocks.flatMap((b) => b['@graph'].map((n) => n['@type']));
    expect(types).toContain('LocalBusiness');
    if (page.key !== 'home' && page.key !== 'notFound') expect(types).toContain('BreadcrumbList');

    // Conteúdo visível sem JS: nada nasce com a classe de "revelado" e o H1 está no HTML.
    expect(html).not.toContain('is-in');
    expect(html).toContain('id="conteudo"');
  });

  it('service pages and home embed the FAQ as native details', () => {
    for (const key of ['home', 'aplicativos', 'sites', 'sistemasWeb']) {
      expect(read(fileFor(pages[key].path))).toContain('<details');
    }
  });
});

describe('site files', () => {
  it('404.html is a real page marked noindex', () => {
    const html = read('dist/404.html');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
    expect(html).toContain('Página não encontrada');
    expect(html).not.toContain('rel="canonical"');
  });

  it('sitemap lists every indexable route and robots points to it', () => {
    const xml = read('dist/sitemap.xml');
    for (const p of indexable) expect(xml).toContain(`<loc>${SITE_URL}${p.path}</loc>`);
    expect((xml.match(/<url>/g) || []).length).toBe(indexable.length);
    expect(read('dist/robots.txt')).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it('ships fonts, favicons, badges, app icons and no server bundle', () => {
    for (const f of ['dist/.nojekyll', 'dist/fonts/bricolage-grotesque.woff2', 'dist/fonts/instrument-sans.woff2', 'dist/favicon.svg', 'dist/favicon-32.png', 'dist/apple-touch-icon.png', 'dist/site.webmanifest', 'dist/og/default.png', 'dist/logo/mark.png', 'dist/badges/google-play-pt-br.png', 'dist/badges/app-store-pt-br.svg']) {
      expect(existsSync(f), f).toBe(true);
    }
    expect(readdirSync('dist/apps')).toHaveLength(4);
    expect(existsSync('dist/server')).toBe(false);
  });

  it('CSS references local fonts with the configured base', () => {
    const cssFile = readdirSync('dist/assets').find((f) => f.endsWith('.css'));
    const css = read(`dist/assets/${cssFile}`);
    expect(css).toMatch(/url\([^)]*fonts\/bricolage-grotesque\.woff2\)/);
    expect(css).not.toContain('googleapis');
  });
});
```

- [ ] **Step 2: Run it against a fresh build**

Run: `npm run build` then `npm run test:build`
Expected: all passed. If the CSS assertion fails because Vite inlined or renamed the font URL, print the CSS `url(` matches and adjust only the regex, not the fonts.

- [ ] **Step 3: Confirm `npm test` still excludes it**

Run: `npm test` — the output must not list `tests/build/dist.test.js`.

- [ ] **Step 4: Commit**

```bash
git add tests/build
git commit -m "test: verify prerendered dist output, sitemap, robots and assets"
```

---

### Task 19: GitHub Pages deploy workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Consumes: repository variable `CUSTOM_DOMAIN` (optional).
- Produces: automatic deploy of `dist/` on push to `main`; `CNAME` written only when `CUSTOM_DOMAIN` is set.

- [ ] **Step 1: Workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy no GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      CUSTOM_DOMAIN: ${{ vars.CUSTOM_DOMAIN }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - name: Definir base e URL do site
        run: |
          if [ -n "$CUSTOM_DOMAIN" ]; then
            echo "VITE_BASE=/" >> "$GITHUB_ENV"
            echo "VITE_SITE_URL=https://$CUSTOM_DOMAIN" >> "$GITHUB_ENV"
          else
            REPO="${GITHUB_REPOSITORY#*/}"
            echo "VITE_BASE=/$REPO/" >> "$GITHUB_ENV"
            echo "VITE_SITE_URL=https://${GITHUB_REPOSITORY_OWNER}.github.io/$REPO" >> "$GITHUB_ENV"
          fi
      - run: npm run build
      - run: npm run test:build
      - name: CNAME para domínio próprio
        if: env.CUSTOM_DOMAIN != ''
        run: echo "$CUSTOM_DOMAIN" > dist/CNAME
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: README**

`README.md`:
```markdown
# Innovate Apps Co. — site institucional

Site da Innovate Apps (Taubaté – SP): sites, sistemas web e aplicativos Android/iOS para empresas do Vale do Paraíba.
React 18 + Vite 5, multi-página com HTML pré-renderizado, publicado no GitHub Pages.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unitários e de componentes
npm run build      # cliente + SSR + pré-render em dist/
npm run test:build # verifica o dist/ gerado
npm run preview    # serve dist/ em http://localhost:4173
```

## Onde mudar o quê

| Quero mudar… | Arquivo |
|---|---|
| WhatsApp, e-mail, redes, endereço | `src/config/site.js` |
| Cidades atendidas | `src/data/content/cities.js` |
| Textos dos serviços, FAQ, processo | `src/data/content/*.js` |
| Apps e cases | `src/data/repositories/ProjectRepository.js` |
| Título/descrição de cada página | `src/seo/pages.js` |
| Cores, fontes, espaçamentos | `src/presentation/styles/tokens.css` |

WhatsApp em `site.js` vai no formato E.164 sem `+` (ex.: `5512999999999`). Enquanto estiver vazio, os botões de contato levam para `/contato/`.

## Deploy (GitHub Pages)

1. Em **Settings → Pages**, escolha **Source: GitHub Actions**.
2. Todo push na `main` roda `.github/workflows/deploy.yml`: testa, faz o build e publica `dist/`.
3. Sem domínio próprio o site fica em `https://<usuario>.github.io/<repositorio>/` — o workflow ajusta `base` e as URLs canônicas sozinho.

### Domínio próprio

1. Em **Settings → Secrets and variables → Actions → Variables**, crie `CUSTOM_DOMAIN` com o domínio (ex.: `innovateapps.com.br`).
2. No DNS do domínio: registros `A` para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` e um `CNAME` de `www` para `<usuario>.github.io`.
3. Em **Settings → Pages → Custom domain**, informe o domínio e ative **Enforce HTTPS** depois que o certificado for emitido.
4. Faça um push (ou rode o workflow manualmente). O build passa a usar `base=/`, URLs canônicas com o domínio e gera o `CNAME`.

## Assets gerados

Ícones dos apps, badges das lojas, marca, favicons e imagem OG estão em `public/` e são commitados.
Para regenerar: `npm run assets` (fontes, ícones, marca) e `node scripts/assets/og.mjs` (imagem OG; usa o Chrome — defina `CHROME_PATH` se necessário).

## Pendências (preencher quando tiver)

- WhatsApp e e-mail em `src/config/site.js`
- Link do Trama na App Store, se existir, em `ProjectRepository.js`
- Instagram/LinkedIn em `site.js`
- Domínio → variável `CUSTOM_DOMAIN`
```

- [ ] **Step 3: Validate the YAML locally**

Run: `node -e "const y=require('fs').readFileSync('.github/workflows/deploy.yml','utf8'); if(!/upload-pages-artifact@v3/.test(y)) throw new Error('workflow incompleto'); console.log('ok')"`
Expected: `ok`. Also run the build once with the subpath configuration to prove the base switch works end-to-end:

```bash
VITE_BASE=/InnovateSite/ VITE_SITE_URL=https://kevinsilva121.github.io/InnovateSite npm run build && VITE_SITE_URL=https://kevinsilva121.github.io/InnovateSite npm run test:build
```
(PowerShell: `$env:VITE_BASE='/InnovateSite/'; $env:VITE_SITE_URL='https://kevinsilva121.github.io/InnovateSite'; npm run build; npm run test:build; Remove-Item Env:VITE_BASE, Env:VITE_SITE_URL`.)
Expected: passes; `grep -o 'src="/InnovateSite/assets/[^"]*"' dist/index.html` shows prefixed asset URLs. Rebuild without the env vars afterwards.

- [ ] **Step 4: Commit**

```bash
git add .github README.md
git commit -m "ci: GitHub Pages deploy with custom-domain switch; README"
```

---

### Task 20: Final verification — screenshots, Lighthouse, fixes

**Files:**
- Modify: whatever the audits point at (CSS/markup only; no new features).

**Interfaces:**
- Consumes: `scripts/dev/screenshot.mjs`, `npm run preview`, `npx lighthouse`.
- Produces: a site that meets spec §1 success criteria; a short report for the user.

- [ ] **Step 1: Full test run and clean build**

Run: `npm test && npm run build && npm run test:build`
Expected: everything green.

- [ ] **Step 2: Screenshots of every page, both viewports**

Start `npm run preview` in the background; wait for HTTP 200 on `http://localhost:4173/`; then:

```bash
node scripts/dev/screenshot.mjs http://localhost:4173 / /aplicativos/ /sites/ /sistemas-web/ /sobre/ /contato/ /nao-existe/
```

Open each of the 14 files and check, per the spec: one amber accent only; navy/cream only otherwise; Bricolage headings rendered; nothing overflows horizontally on mobile (a horizontal scrollbar or clipped text means a fixed-width element — fix it); footer columns collapse on mobile; app icons crisp (not upscaled); badges legible; 404 inside the normal chrome.

- [ ] **Step 3: Lighthouse (desktop and mobile) on home and one service page**

```bash
npx --yes lighthouse@12 http://localhost:4173/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=lighthouse-home-desktop.json --quiet
npx --yes lighthouse@12 http://localhost:4173/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=lighthouse-home-mobile.json --quiet
npx --yes lighthouse@12 http://localhost:4173/aplicativos/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=lighthouse-apps-mobile.json --quiet
node -e "for (const f of ['lighthouse-home-desktop.json','lighthouse-home-mobile.json','lighthouse-apps-mobile.json']) { const r=JSON.parse(require('fs').readFileSync(f)); console.log(f, Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k, Math.round(v.score*100)]))); }"
```

Expected: SEO, Accessibility, Performance ≥ 90 in all three. If a category is below 90, list the failing audits:

```bash
node -e "const r=JSON.parse(require('fs').readFileSync('lighthouse-home-mobile.json')); for (const a of Object.values(r.audits)) if (a.score!==null && a.score<0.9) console.log(a.id, a.score, a.displayValue||'')"
```

Typical fixes, in order of likelihood: (a) color-contrast → darken `--ink-muted` or lighten `--on-navy-muted`; (b) image size → the hero tiles must request the 192px webp at 72px display, which is fine, but check no `<img>` lacks `width`/`height`; (c) `render-blocking` → confirm the two font preloads are present and nothing else is preloaded; (d) `unused-css` warnings are informational and do not gate. Re-run after each fix.

- [ ] **Step 4: Stop the preview server and commit the fixes**

```bash
git add -A
git commit -m "fix: lighthouse and visual polish from final verification"
```

- [ ] **Step 5: Report**

Tell the user: what changed, the Lighthouse scores, where the screenshots are, and the pending items from spec §10 (WhatsApp/e-mail, Trama App Store link, logo vector, social links, domain). Do not merge or push — that is the user's call.

---

## Self-review notes (already applied)

- Spec §6 asked for canonicals without a trailing slash; this plan uses trailing slashes throughout (routes, canonicals, sitemap) because GitHub Pages serves `dist/<route>/index.html` at `/<route>/` and 301-redirects the slash-less form. Spec §6 also listed a separate `Organization` node; `LocalBusiness` is an `Organization` subtype, so one node carries both roles.
- Spec §3 said "badges oficiais" in the trust strip; the plan uses the official badges everywhere (compact size on app cards) rather than mixing official and custom store buttons.
- Spec §5 listed `robots.txt` under `public/`; the prerender script generates it in `dist/` instead so the `Sitemap:` line carries the absolute site URL derived from `VITE_SITE_URL`.
- Every route, section, hook, script and test named in the File Structure has a task; every spec section (identity, pages, prerender, base/deploy, SEO head, JSON-LD, artifacts, performance/a11y, config, tests, pending items) maps to Tasks 2–20.
