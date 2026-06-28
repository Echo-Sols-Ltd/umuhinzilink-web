'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { parseHashHref, scrollToSection } from '@/lib/scroll-to-section';

type NavAnchorLinkProps = React.ComponentProps<typeof Link>;

export default function NavAnchorLink({ href, onClick, ...props }: NavAnchorLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const hrefStr = typeof href === 'string' ? href : href.pathname ?? '';
    const { path, hash } = parseHashHref(hrefStr);
    if (!hash) return;

    const targetPath = path || '/';
    const onHome = pathname === '/' && targetPath === '/';

    if (onHome) {
      e.preventDefault();
      scrollToSection(hash);
      window.history.pushState(null, '', `#${hash}`);
      return;
    }

    if (targetPath === '/') {
      e.preventDefault();
      router.push(`/#${hash}`);
    }
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
