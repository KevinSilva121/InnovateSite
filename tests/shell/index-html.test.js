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
