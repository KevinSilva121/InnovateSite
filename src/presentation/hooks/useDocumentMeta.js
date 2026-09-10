import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { pageByPath } from '../../seo/pages.js';
import { site } from '../../config/site.js';

// Mantém title/description/robots/canonical corretos na navegação SPA e reposiciona a rolagem.
export function useDocumentMeta() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    const page = pageByPath(pathname);
    document.title = page.title;

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.name = 'description';
      document.head.appendChild(descTag);
    }
    descTag.content = page.description;

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.name = 'robots';
      document.head.appendChild(robotsTag);
    }
    robotsTag.content = page.robots ?? 'index, follow';

    let canonicalTag = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = page.path ? `${site.url}${page.path}` : null;
    if (canonicalUrl) {
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.href = canonicalUrl;
    } else if (canonicalTag) {
      canonicalTag.remove();
    }

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else if (!first.current) {
      window.scrollTo(0, 0);
    }
    first.current = false;
  }, [pathname, hash]);
}

