'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToHomeHashFromUrl } from '@/lib/scroll-to-section';

/** Smooth-scrolls to `#section` when landing on `/` or when the hash changes. */
export default function HomeScrollAnchor() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    scrollToHomeHashFromUrl();
    const timeout = window.setTimeout(scrollToHomeHashFromUrl, 120);

    const onHashChange = () => scrollToHomeHashFromUrl();
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
