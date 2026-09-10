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
