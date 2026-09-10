# Innovate Apps Co. — Redesign do site institucional

**Data:** 2026-09-03
**Status:** aprovado em conversa, aguardando revisão do spec
**Repositório:** `InnovateSite/` (React 18 + Vite 5)

## 1. Objetivo

Substituir o site atual (página única, visual roxo/ciano neon, sem SEO) por um site
institucional multi-página, pré-renderizado, com identidade derivada do logo e
otimizado para busca local no Vale do Paraíba.

**Sucesso significa:**

- Cada serviço (apps, sites, sistemas web) tem URL, título, H1 e schema próprios,
  com o conteúdo completo dentro do HTML servido pelo GitHub Pages.
- Lighthouse ≥ 90 em SEO, Acessibilidade e Performance (desktop e mobile) em `vite preview`.
- O visual não lembra template de IA: sem neon, sem gradiente animado, sem cursor
  customizado, sem render 3D stock. Prova social real (apps publicados) em destaque.
- Trocar contato ou domínio depois não exige tocar em componente: um arquivo de
  config e duas variáveis do repositório.

## 2. Contexto

| Item | Valor |
|---|---|
| Empresa | Innovate Apps Co. — Taubaté, SP |
| Serviços | Aplicativos Android/iOS, sites, sistemas web |
| Público | PMEs do Vale do Paraíba (comércio, serviços, clínicas, transportadoras, indústria) |
| Hospedagem | GitHub Pages; domínio próprio via DNS depois |
| Contato | WhatsApp e e-mail serão fornecidos depois (placeholders) |
| Nome na Play Store | "InnovateApps Co." — `https://play.google.com/store/apps/developer?id=InnovateApps+Co.` |
| Nome na App Store | "Kevin Silva" — `https://apps.apple.com/br/developer/kevin-silva/id6797971217` |

### Apps publicados (dados reais das lojas)

| App | Google Play (id) | App Store (id) | Uma linha |
|---|---|---|---|
| CalcFrete: Gestão do Motorista | `com.kevinramon122.appMotorista` | `6798275256` | Calcula frete e organiza o financeiro do motorista autônomo, offline. |
| Contador de Cantos | `com.kevinramon122.Contador` | `6797971215` | Contador preciso para criadores que treinam e disputam torneios de canto. |
| Prazzo: Gestor de Carnê e Fiado | `com.kevinramon122.prazzo` | `6800428986` | Controle de fiado, carnê, clientes e estoque para quem vende parcelado. |
| Trama: Palavras Cruzadas | `com.trama.kevinramon122` | — (não localizado; slot fica vazio) | Palavras cruzadas em português, leve e offline. |

Ícones: URL `og:image` do Play Store com sufixo `=s192-rw` (WebP 192 px).

### Case web

- Advalice Camargo — site para escritório de advocacia, `https://advalicecamargo.com.br/`.
- O "Kevin Silva Portfolio" **sai** do site da empresa (site pessoal enfraquece o posicionamento).

## 3. Identidade visual

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `--navy-900` | `#010D33` (fundo do logo) | Navbar, hero, painel dos apps, footer |
| `--navy-700` | derivado (~`#152352`) | Superfícies elevadas sobre navy |
| `--ink` | `#0B1230` | Texto principal sobre creme |
| `--ink-muted` | derivado (~`#4A5273`) | Texto secundário |
| `--paper` | `#F3F0E8` | Fundo das seções de conteúdo |
| `--paper-2` | `#E9E6DE` (marca do logo) | Cartões, faixas, bordas suaves |
| `--amber` | `#F0A030` | Botão primário, numeração, sublinhado de destaque |
| `--amber-ink` | `#3A2300` | Texto sobre âmbar |

Regras: um acento só; sem gradientes; sem sombras coloridas; sombras neutras e curtas.
Contraste AA mínimo em todo par texto/fundo (checar âmbar sobre creme — usar só em
elementos grandes ou com texto `--ink`).

### Tipografia (auto-hospedada via `@fontsource-variable`)

- Títulos: **Bricolage Grotesque** (variável). H1 em `clamp(2.5rem, 6vw, 4.75rem)`, peso 700–800, tracking levemente negativo.
- Texto: **Instrument Sans**. 16–18 px, line-height 1.6.
- Numerais tabulares em métricas e numeração de seções.
- `preload` do woff2 das duas famílias.

### Movimento

- Reveal ao rolar: CSS (`opacity` + `translateY(12px)`) disparado por `IntersectionObserver`, uma vez.
- HTML pré-renderizado nasce visível. A classe `js` no `<html>` (adicionada pelo cliente) é a única
  coisa que esconde elementos antes do reveal. Sem JS ou para crawlers, tudo aparece.
- `prefers-reduced-motion: reduce` desliga transições.
- Sem framer-motion (removido das dependências).

## 4. Estrutura de páginas

| Rota | H1 (direção) | Busca-alvo |
|---|---|---|
| `/` | Sites, sistemas e aplicativos para empresas do Vale do Paraíba | empresa de tecnologia Taubaté; desenvolvimento de software Vale do Paraíba |
| `/aplicativos` | Desenvolvimento de aplicativos Android e iOS em Taubaté | desenvolvimento de aplicativos Taubaté / Vale do Paraíba |
| `/sites` | Criação de sites profissionais em Taubaté | criação de sites Taubaté |
| `/sistemas-web` | Sistemas web sob medida para a sua empresa | sistema web sob medida Vale do Paraíba |
| `/sobre` | Uma empresa de tecnologia de Taubaté | Innovate Apps Taubaté |
| `/contato` | Fale com a Innovate Apps | contato |
| `404` | Página não encontrada | `noindex` |

### Home — seções em ordem

1. **Navbar** (navy): logo + wordmark; links Aplicativos · Sites · Sistemas Web · Sobre; botão "Falar no WhatsApp". Mobile: menu em painel com `aria-expanded`/`aria-controls`.
2. **Hero** (navy): H1, subtítulo citando Taubaté e o Vale, CTA primário (WhatsApp) e secundário ("Ver apps publicados" → `#apps`). À direita, composição com os 4 ícones reais dos apps.
3. **Faixa de confiança** (creme): "Publicados na Google Play e na App Store" + badges oficiais + contadores simples (4 apps · 2 lojas · Taubaté-SP).
4. **Serviços** (creme): três cartões numerados 01/02/03 (Aplicativos, Sites, Sistemas Web), três bullets cada, link para a página do serviço.
5. **Apps publicados** (navy): grade com ícone, nome, uma linha, botões Play/App Store (App Store oculto quando não houver link).
6. **Case web** (creme): Advalice Camargo — descrição curta, link externo.
7. **Como funciona** (creme): Conversa → Proposta → Desenvolvimento → Publicação e suporte.
8. **De Taubaté para o Vale** (creme/`--paper-2`): cidades atendidas (Taubaté, São José dos Campos, Pindamonhangaba, Caçapava, Jacareí, Tremembé, Guaratinguetá, Lorena, Campos do Jordão, Ubatuba, Caraguatatuba), atendimento presencial e remoto.
9. **FAQ** (creme): 6 perguntas de PME em `<details>/<summary>`.
10. **CTA final + Footer** (navy): WhatsApp, e-mail, "Taubaté – SP", links das páginas, links das lojas, redes, copyright.

### Páginas de serviço (`/aplicativos`, `/sites`, `/sistemas-web`)

Hero (H1 + subtítulo + CTA) → Para quem é (segmentos) → O que entregamos → Como funciona →
Prova (apps ou case relevantes) → FAQ específica (4–5 perguntas) → CTA final. Breadcrumb visual e em schema.

### `/sobre`

História curta, Kevin Silva como fundador e desenvolvedor, o que a empresa faz, localização e área de atendimento, CTA.

### `/contato`

WhatsApp em destaque (botão grande), e-mail, cidades atendidas, horário de atendimento. Sem formulário
(GitHub Pages não tem backend). Enquanto `site.whatsapp` estiver vazio, mostra e-mail e um aviso interno de placeholder.

### Tom do texto

Português direto, "você", frases curtas. Sem "transformação digital", "vanguarda", "soluções disruptivas".
Cada página menciona Taubaté e Vale do Paraíba de forma natural (não repetitiva).

## 5. Arquitetura técnica

### Dependências

- Adicionar: `react-router` (v7), `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/instrument-sans`,
  `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.
- Manter: `react`, `react-dom`, `lucide-react`, `vite`, `@vitejs/plugin-react`.
- Remover: `framer-motion`.

### Estrutura de pastas

```
src/
  config/site.js                 # nome, SITE_URL, whatsapp, email, endereço, cidades, redes, lojas
  domain/entities/Project.js     # + type ('app'|'web'), stores {play, appStore}, icon, tagline
  domain/usecases/GetProjects.js # aceita filtro por type
  data/repositories/ProjectRepository.js  # 4 apps + Advalice
  data/content/{services,faq,process,cities,segments}.js
  seo/pages.js                   # meta por rota: title, description, path, jsonLd()
  seo/buildHead.js               # (meta, site) -> string de tags <head>
  seo/jsonld.js                  # localBusiness(), webSite(), service(), breadcrumb(), faq(), appList()
  routes.jsx                     # tabela única: path, page, metaKey
  App.jsx                        # Layout + <Routes>
  entry-client.jsx               # hydrateRoot + BrowserRouter + classe 'js'
  entry-server.jsx               # render(url) -> { html, meta }
  presentation/
    styles/{tokens.css, base.css, utilities.css}
    ui/{Button, Container, Section, SectionHeading, StoreBadges, Reveal, Breadcrumb}
    layout/{Navbar, Footer, Layout}
    sections/{Hero, TrustStrip, ServicesGrid, AppsShowcase, WebCase, Process, LocalArea, Faq, CtaBand}
    pages/{Home, Aplicativos, Sites, SistemasWeb, Sobre, Contato, NotFound}
scripts/
  prerender.mjs                  # gera dist/<rota>/index.html, 404.html, sitemap.xml
  fetch-assets.mjs               # one-off: baixa ícones dos apps e badges das lojas
  og-image.mjs                   # one-off: gera public/og/default.png via Chrome headless
public/
  apps/*.webp  badges/*  logo/*  og/default.png  favicon.svg  favicon-32.png  apple-touch-icon.png
  site.webmanifest  robots.txt  .nojekyll
tests/
  seo/buildHead.test.js  seo/jsonld.test.js  config/site.test.js  routes.test.js
  components/{Navbar,Faq,StoreBadges}.test.jsx
  build/dist.test.js             # roda após build; checa HTML gerado
.github/workflows/deploy.yml
README.md
```

Estilo: CSS Modules por componente; tokens globais em `tokens.css`. Sem estilos inline.

### Pré-render

```
npm run build =
  vite build                                   # cliente -> dist/
  vite build --ssr src/entry-server.jsx --outDir dist/server
  node scripts/prerender.mjs
```

`prerender.mjs`:

1. Lê `dist/index.html` (template com `<!--app-head-->` e `<!--app-html-->`).
2. Importa `dist/server/entry-server.js`; para cada rota em `src/routes.jsx`, chama `render(path)`,
   injeta `buildHead(meta, site)` e o HTML, grava `dist/<path>/index.html` (`/` → `dist/index.html`).
3. Renderiza `NotFound` em `dist/404.html` com `noindex`.
4. Gera `dist/sitemap.xml` (todas as rotas, `lastmod` = data do build) e confere `robots.txt`.
5. Remove `dist/server`.

Cliente: `hydrateRoot`; ao navegar via SPA, um hook atualiza `document.title` e `meta[name=description]`
a partir de `seo/pages.js`.

### `base` e URL do site

`vite.config.js`: `base: process.env.VITE_BASE ?? '/'`. `SITE_URL` vem de `VITE_SITE_URL`
(fallback em `site.js`). Nunca usar `base: './'` (quebra em rotas aninhadas).

### Deploy (`.github/workflows/deploy.yml`)

- Dispara em push na `main`. `npm ci`, `npm test`, `npm run build`, `actions/deploy-pages`.
- Variável do repositório `CUSTOM_DOMAIN`:
  - vazia → `VITE_BASE=/<repo>/`, `VITE_SITE_URL=https://<owner>.github.io/<repo>`
  - preenchida → `VITE_BASE=/`, `VITE_SITE_URL=https://<domínio>`, grava `dist/CNAME`
- README documenta: ativar Pages (source: GitHub Actions), definir `CUSTOM_DOMAIN`, apontar DNS.

## 6. SEO

### Por página (via `buildHead`)

`<title>` (≤ 60 caracteres, termina em "| Innovate Apps"), `meta description` (≤ 155),
`link rel=canonical` (SITE_URL + path, sem barra final exceto `/`), `meta robots`,
Open Graph (`type`, `title`, `description`, `url`, `image`, `locale=pt_BR`, `site_name`),
Twitter `summary_large_image`, `theme-color` (navy). `<html lang="pt-BR">`.

### JSON-LD

- **Global** (todas as páginas): `LocalBusiness` (name, url, logo, image, description, `address`
  com `addressLocality: Taubaté`, `addressRegion: SP`, `addressCountry: BR`, `areaServed` = lista de
  `City`, `sameAs` = Play Store dev, App Store dev, GitHub, Instagram, LinkedIn; `telephone` e `email`
  só quando preenchidos), `WebSite` (name, url) e `Organization`.
- **Home e `/aplicativos`**: `ItemList` de `SoftwareApplication` (name, operatingSystem `Android, iOS`
  ou `Android`, applicationCategory, `installUrl`/`downloadUrl` das lojas, `offers` price 0 BRL, image).
- **Serviços**: `Service` (name, provider = LocalBusiness, areaServed, serviceType), `BreadcrumbList`, `FAQPage`.
- **Home**: `FAQPage` também.

### Artefatos

`sitemap.xml`, `robots.txt` (`Allow: /`, `Sitemap:` absoluto), `404.html` com `noindex`, `.nojekyll`,
`site.webmanifest`, favicons, OG image padrão 1200×630 na marca.

### Performance e acessibilidade

- Fontes locais com `preload`; sem requisição a fontes externas.
- Imagens com `width`/`height` explícitos; `loading="lazy"` abaixo da dobra; ícones dos apps ≤ 192 px WebP.
- Skip link, landmarks (`header/nav/main/footer`), um H1 por página, hierarquia H2/H3 coerente,
  `:focus-visible` visível, menu mobile com aria, contraste AA.

## 7. Configuração de contato (`src/config/site.js`)

```js
export const site = {
  name: 'Innovate Apps Co.',
  shortName: 'Innovate Apps',
  url: import.meta.env.VITE_SITE_URL ?? 'https://kevinsilva121.github.io/InnovateSite',
  whatsapp: '',          // E.164 sem '+', ex: '5512999999999' — TODO
  email: '',             // TODO
  address: { locality: 'Taubaté', region: 'SP', country: 'BR' },
  areaServed: [/* cidades */],
  social: { instagram: '', linkedin: '', github: 'https://github.com/kevinsilva121' },
  stores: { play: '...developer?id=InnovateApps+Co.', appStore: '...developer/kevin-silva/id6797971217' },
};
```

Comportamento com campos vazios: CTA de WhatsApp aponta para `/contato`; e-mail e telefone
não entram no schema nem no footer; links sociais vazios não renderizam.

## 8. Testes

- **Unitários (vitest):** `buildHead` (title, canonical, OG completos; description truncada), `jsonld`
  (estrutura, `areaServed`, apps com/sem App Store, telefone omitido quando vazio), `site.js`
  (campos obrigatórios, formato E.164 quando preenchido), `routes` ↔ `seo/pages` (mesmo conjunto de paths).
- **Componentes (testing-library):** Navbar (toggle mobile, aria), Faq (`details` com pergunta/resposta),
  StoreBadges (oculta App Store sem link), CtaBand (fallback para `/contato` sem WhatsApp).
- **Build (`npm run test:build`, após `npm run build`):** para cada rota, `dist/<rota>/index.html` contém
  exatamente um `<h1>`, `<title>` esperado, canonical, ao menos um `<script type="application/ld+json">`
  parseável; `sitemap.xml` lista todas as rotas; `404.html` existe com `noindex`; nenhum HTML referencia
  `fonts.googleapis.com`.
- **Verificação manual final:** screenshots via Chrome headless (desktop e 390 px), Lighthouse em
  `vite preview` (meta ≥ 90 SEO/A11y/Perf).

TDD durante a implementação: teste antes do código em `seo/`, `config/`, `scripts/prerender` e componentes com lógica.

## 9. Fora de escopo

- Formulário de contato com backend, blog, i18n, analytics, CMS.
- Página individual por app (pode vir depois como `/apps/<slug>`).
- Registro do domínio e configuração de DNS (documentado, não executado).

## 10. Pendências do cliente (não bloqueiam)

1. Número do WhatsApp e e-mail → `src/config/site.js`.
2. Link do Trama na App Store (se existir) → `ProjectRepository`.
3. Logo em vetor (SVG/AI), se houver — senão usa a versão PNG com fundo removido.
4. Instagram/LinkedIn da empresa, se houver.
5. Domínio, quando registrado → variável `CUSTOM_DOMAIN` no GitHub.
