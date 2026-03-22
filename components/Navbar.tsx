'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserType } from '@/types';

// redirect logged-in users to their role dashboard
function dashboardHref(role?: string) {
  switch (role) {
    case UserType.FARMER: return '/farmer/dashboard';
    case UserType.BUYER: return '/buyer/dashboard';
    case UserType.SUPPLIER: return '/supplier/dashboard';
    case UserType.ADMIN: return '/admin/dashboard';
    case UserType.GOVERNMENT: return '/government/dashboard';
    default: return '/dashboard';
  }
}

export default function Navbar() {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <nav className="
            w-full fixed top-0 left-0 right-0 z-50 h-16
            flex items-center
            bg-card/80 backdrop-blur-md border-b border-border/40
        ">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold text-primary">Umuhinzi</span>
          <span className="text-xl font-extrabold text-foreground">Link</span>
        </Link>

        {/* centre links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: t('landing.nav.marketplace') || 'Products', href: '/buyer/products' },
            { label: t('landing.nav.aboutUs') || 'About Us', href: '/about' },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* right CTA */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link href={dashboardHref(user.role)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary/20 transition-colors">
              {t('common.dashboard') || 'Dashboard'}
            </Link>
          ) : (
            <>
              <Link href="/auth/signin"
                className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors">
                {t('auth.signIn.signIn') || 'Sign in'}
              </Link>
              <Link href="/auth/signup"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}