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

- E-mail em `src/config/site.js`
- Link do Trama na App Store, se existir, em `ProjectRepository.js`
- Instagram/LinkedIn em `site.js`
- Domínio → variável `CUSTOM_DOMAIN`
