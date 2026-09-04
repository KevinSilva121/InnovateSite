# Innovate Apps Co. — site institucional

Site da Innovate Apps (Taubaté – SP): sites, sistemas web e aplicativos Android/iOS.
React 18 + Vite 5, multi-página com HTML pré-renderizado. Publicado no Firebase Hosting.

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
| Artigos do blog | `src/data/content/posts.js` |
| Apps e cases | `src/data/repositories/ProjectRepository.js` |
| Título/descrição de cada página | `src/seo/pages.js` |
| Cores, fontes, espaçamentos | `src/presentation/styles/tokens.css` |
| Cache e cabeçalhos do servidor | `firebase.json` |

WhatsApp em `site.js` vai no formato E.164 sem `+` (ex.: `5512999999999`). Enquanto estiver vazio, os botões de contato levam para `/contato/`.

Para publicar um artigo novo, acrescente um objeto no topo de `posts` em `src/data/content/posts.js`. Rota, sitemap, JSON-LD, listagem e "leia também" saem daí sozinhos. O cabeçalho do arquivo explica cada campo.

## Deploy (Firebase Hosting)

### Uma vez, na primeira máquina

```bash
npx firebase-tools login       # abre o navegador
npx firebase-tools use --add   # escolha o projeto e grava em .firebaserc
```

`.firebaserc` vem com `SEU-PROJETO-FIREBASE` de exemplo; o `use --add` troca por você. Sem isso o deploy para com um aviso, de propósito.

### Toda vez

```bash
npm run deploy                  # testa, constrói e publica
npm run deploy -- --conferir    # só mostra projeto e URL, sem enviar nada
npm run deploy -- --canal previa  # publica num canal de teste, com URL temporária
```

O script existe por um motivo específico: o `canonical`, o `sitemap.xml` e o JSON-LD precisam apontar para o endereço em que o site vai responder. Rodar `npm run build` solto usa a URL de reserva e publicaria endereços errados, que é um erro caro e silencioso. O script resolve a URL, mostra na tela e passa para o build. Ordem: `VITE_SITE_URL` do ambiente → `.env.production` → `https://<projeto>.web.app`.

### Deploy automático a cada push

`.github/workflows/firebase.yml` faz o mesmo no push para `main`. Precisa de uma coisa só:

```bash
npx firebase-tools init hosting:github
```

Ele cria a conta de serviço e grava o secret `FIREBASE_SERVICE_ACCOUNT` no repositório. Se ele oferecer para escrever um workflow, recuse — já existe um aqui, e é ele que usa o build com as URLs certas.

> **Antes de ligar isto, desative o deploy do GitHub Pages.** Os dois workflows publicam a mesma `main` em endereços diferentes, e o Google acabaria com duas cópias indexadas do site disputando entre si. Apague `.github/workflows/deploy.yml`, ou troque o `on:` dele para só `workflow_dispatch`.

### Domínio próprio

1. No console do Firebase: **Hosting → Adicionar domínio personalizado**, e siga os registros DNS que ele mostrar.
2. Crie `.env.production` na raiz com o domínio (o arquivo é ignorado pelo git, então cada máquina tem o seu):

   ```
   VITE_SITE_URL=https://innovateapps.com.br
   ```

3. Para o deploy automático, crie a variável `SITE_URL` em **Settings → Secrets and variables → Actions → Variables** com o mesmo valor.
4. Rode `npm run deploy` de novo. O `canonical`, o `sitemap.xml` e o JSON-LD passam a usar o domínio.
5. Cadastre `https://seudominio.com.br/sitemap.xml` no Google Search Console.

### O que o `firebase.json` já resolve

- **Sem rewrite pega-tudo.** Endereço inexistente recebe o `404.html` com status 404 de verdade, e não a home com status 200 (que o Google trata como "soft 404").
- **Barra no fim.** As URLs canônicas terminam em `/`, e `trailingSlash: true` faz o servidor concordar com isso em vez de gerar redirecionamento à toa.
- **Cache.** `assets/` (nomes com hash) por um ano e imutável; fontes, imagens e ícones por 30 dias; páginas sempre revalidadas, para um deploy aparecer na hora.
- **Cabeçalhos de segurança** em toda resposta, incluindo uma CSP restrita. Ela funciona porque o site não carrega nada de terceiros e não tem `<script>` com código embutido — há um teste em `tests/build/dist.test.js` que falha se isso mudar.

Depois do primeiro deploy vale conferir:

```bash
curl -I https://seudominio.com.br/            # Cache-Control: max-age=0, CSP presente
curl -I https://seudominio.com.br/assets/     # Cache-Control: ... immutable
curl -sI https://seudominio.com.br/nao-existe | head -1   # HTTP/2 404
```

HSTS ficou de fora de propósito: é um caminho sem volta pelo tempo do `max-age`, e o Firebase já serve só HTTPS. Se quiser, é uma linha em `firebase.json`.

## Assets gerados

Ícones dos apps, badges das lojas, marca, favicons e imagem OG estão em `public/` e são commitados.
Para regenerar: `npm run assets` (fontes, ícones, marca) e `node scripts/assets/og.mjs` (imagem OG; usa o Chrome — defina `CHROME_PATH` se necessário).

## Pendências (preencher quando tiver)

- Projeto do Firebase em `.firebaserc` (`firebase use --add`)
- Link do Trama na App Store, se existir, em `ProjectRepository.js`
- Instagram/LinkedIn em `site.js`
- Domínio → `.env.production` e variável `SITE_URL` no GitHub
