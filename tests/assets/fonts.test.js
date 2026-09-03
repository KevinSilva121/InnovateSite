// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { statSync } from 'node:fs';

describe('local fonts', () => {
  it.each(['bricolage-grotesque', 'instrument-sans'])('public/fonts/%s.woff2 exists and is not empty', (name) => {
    expect(statSync(`public/fonts/${name}.woff2`).size).toBeGreaterThan(10_000);
  });
});
