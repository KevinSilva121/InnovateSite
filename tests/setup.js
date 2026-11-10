import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Sem `globals: true` a testing-library não registra o cleanup sozinha.
afterEach(cleanup);

// O jsdom não toca mídia (play/load/pause só avisam "Not implemented"): aqui
// viram operações vazias, como num navegador que ainda não carregou o vídeo.
// Os testes de ambiente node (sem DOM) também passam por aqui, por isso a checagem.
if (typeof HTMLMediaElement !== 'undefined') {
  HTMLMediaElement.prototype.play = function play() { return Promise.resolve(); };
  HTMLMediaElement.prototype.pause = function pause() {};
  HTMLMediaElement.prototype.load = function load() {};
}
