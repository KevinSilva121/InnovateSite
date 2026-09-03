import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { pageByPath } from '../../seo/pages.js';

// Mantém title/description corretos na navegação SPA e reposiciona a rolagem.
export function useDocumentMeta() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const page = pageByPath(pathname);
    document.title = page.title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = page.description;

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else if (!first.current) {
      window.scrollTo(0, 0);
    }
    first.current = false;
  }, [pathname, hash]);
}
