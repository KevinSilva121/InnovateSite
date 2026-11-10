// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { statSync, readdirSync, readFileSync } from 'node:fs';

// Três papéis tipográficos: títulos, texto e etiquetas mono.
const FONTES = ['special-gothic-condensed-one', 'ibm-plex-sans', 'jetbrains-mono'];

describe('local fonts', () => {
  it.each(FONTES)('public/fonts/%s.woff2 exists and is not empty', (name) => {
    expect(statSync(`public/fonts/${name}.woff2`).size).toBeGreaterThan(10_000);
  });

  it('ships only the fonts in use, each one declared in fonts.css', () => {
    expect(readdirSync('public/fonts').sort()).toEqual(FONTES.map((f) => `${f}.woff2`).sort());
    const css = readFileSync('src/presentation/styles/fonts.css', 'utf8');
    for (const f of FONTES) expect(css).toContain(`/fonts/${f}.woff2`);
  });
});
