// Publica o site no Firebase Hosting.
//
// O que este script existe para garantir: a URL usada no canonical, no sitemap e
// no JSON-LD precisa ser a mesma em que o site vai responder. Rodar `vite build`
// solto usa a URL de reserva do GitHub Pages e publica endereços errados, que é
// um erro caro e silencioso. Aqui a URL é resolvida, mostrada na tela e passada
// para o build.
//
//   npm run deploy                 publica no ar
//   npm run deploy -- --canal qa   publica num canal de teste, com URL temporária
//   npm run deploy -- --sem-teste  pula a suíte (use só quando já rodou)
//   npm run deploy -- --conferir   só mostra projeto e URL, sem build nem envio
//
// Ordem de resolução da URL do site:
//   1. VITE_SITE_URL no ambiente
//   2. VITE_SITE_URL em .env.production (é onde o domínio próprio deve morar)
//   3. https://<projeto>.web.app, lido de .firebaserc
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const PLACEHOLDER = 'SEU-PROJETO-FIREBASE';

const args = process.argv.slice(2);
const valorDe = (nome) => {
  const i = args.indexOf(nome);
  return i >= 0 ? args[i + 1] : undefined;
};
const canal = valorDe('--canal');
const pularTestes = args.includes('--sem-teste');
const soConferir = args.includes('--conferir');

function erro(mensagem, comoResolver) {
  console.error(`\n  ${mensagem}\n`);
  if (comoResolver) console.error(`  ${comoResolver}\n`);
  process.exit(1);
}

// --- projeto ---------------------------------------------------------------
const arquivoRc = path.join(raiz, '.firebaserc');
if (!existsSync(arquivoRc)) {
  erro('.firebaserc não existe.', 'Rode: npx firebase-tools use --add');
}
let projeto;
try {
  projeto = JSON.parse(readFileSync(arquivoRc, 'utf8'))?.projects?.default;
} catch {
  erro('.firebaserc não é um JSON válido.');
}
if (!projeto || projeto === PLACEHOLDER) {
  erro(
    `Falta dizer qual é o projeto do Firebase (.firebaserc ainda está com "${PLACEHOLDER}").`,
    'Rode `npx firebase-tools use --add` e escolha o projeto, ou troque o valor à mão.',
  );
}

// --- URL pública -----------------------------------------------------------
function doEnvProduction() {
  const arquivo = path.join(raiz, '.env.production');
  if (!existsSync(arquivo)) return undefined;
  for (const linha of readFileSync(arquivo, 'utf8').split('\n')) {
    const m = linha.match(/^\s*VITE_SITE_URL\s*=\s*(.+?)\s*$/);
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return undefined;
}

const doAmbiente = process.env.VITE_SITE_URL;
const doArquivo = doEnvProduction();
const url = (doAmbiente || doArquivo || `https://${projeto}.web.app`).replace(/\/$/, '');
const origem = doAmbiente ? 'variável de ambiente' : doArquivo ? '.env.production' : '.firebaserc (padrão do Firebase)';

if (!/^https:\/\//.test(url)) {
  erro(`A URL do site precisa começar com https:// (recebi "${url}").`);
}

console.log('');
console.log('  projeto ..... ' + projeto);
console.log('  URL ......... ' + url + '   (de ' + origem + ')');
console.log('  destino ..... ' + (canal ? `canal de teste "${canal}"` : 'produção'));
console.log('');
if (!doAmbiente && !doArquivo) {
  console.log('  Quando o domínio próprio estiver no ar, crie .env.production com');
  console.log('  VITE_SITE_URL=https://seudominio.com.br para o canonical apontar para ele.');
  console.log('');
}

if (soConferir) {
  console.log('  (--conferir: nada foi construído nem enviado)');
  console.log('');
  process.exit(0);
}

// --- execução --------------------------------------------------------------
function rodar(comando, argumentos, env = {}) {
  console.log('> ' + [comando, ...argumentos].join(' '));
  const r = spawnSync(comando, argumentos, {
    cwd: raiz,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  });
  if (r.status !== 0) {
    erro(`"${comando} ${argumentos.join(' ')}" falhou com código ${r.status ?? 'desconhecido'}.`);
  }
}

if (!pularTestes) rodar('npm', ['test']);
rodar('npm', ['run', 'build'], { VITE_BASE: '/', VITE_SITE_URL: url });
rodar('npm', ['run', 'test:build'], { VITE_SITE_URL: url });

const alvo = canal
  ? ['hosting:channel:deploy', canal, '--project', projeto]
  : ['deploy', '--only', 'hosting', '--project', projeto];
rodar('npx', ['--yes', 'firebase-tools', ...alvo]);

console.log('\n  Publicado. Confira os cabeçalhos com:');
console.log(`  curl -I ${url}/assets/  (deve trazer Cache-Control: ... immutable)\n`);
