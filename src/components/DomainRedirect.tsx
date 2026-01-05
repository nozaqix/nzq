'use client';

import { useEffect } from 'react';

export default function DomainRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'nzq.pages.dev' || hostname.startsWith('nzq.pages.dev')) {
        const newUrl = 'https://nozaqi.work' + window.location.pathname + window.location.search + window.location.hash;
        window.location.replace(newUrl);
      }
    }
  }, []);

  return null;
}

