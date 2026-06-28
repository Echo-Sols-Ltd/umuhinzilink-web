export const NAVBAR_OFFSET_PX = 71;

/** Landing page section ids used for in-page navigation. */
export const HOME_SECTION_IDS = ['why', 'who', 'features', 'agribusiness', 'lenders', 'contact'] as const;

export function getScrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined') return 'auto';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

/** Parse `/path#section` — normalizes accidental multi-hash URLs. */
export function parseHashHref(href: string): { path: string; hash: string | null } {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return { path: href || '/', hash: null };

  const path = href.slice(0, hashIndex) || '/';
  const rawHash = href.slice(hashIndex + 1);
  const hash = rawHash.split('#').filter(Boolean)[0] ?? null;

  return { path, hash: hash || null };
}

export function scrollToSection(sectionId: string, behavior?: ScrollBehavior): boolean {
  if (typeof window === 'undefined') return false;

  const el = document.getElementById(sectionId);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET_PX - 8;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: behavior ?? getScrollBehavior(),
  });

  return true;
}

export function scrollToHomeHashFromUrl(): void {
  const hash = window.location.hash.replace(/^#/, '').split('#').filter(Boolean)[0];
  if (!hash) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToSection(hash);
    });
  });
}
