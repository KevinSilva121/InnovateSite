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
