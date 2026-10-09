'use client';

import Link from 'next/link';
import Image from 'next/image';
import NavAnchorLink from '@/components/NavAnchorLink';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  Sprout,
  Wallet,
  Settings,
} from '@/lib/icons';
import { getNavbarLinks, isNavLinkActive, ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';

const GUEST_LINK_KEYS: { labelKey: string; href: string }[] = [
  { labelKey: 'landing.nav.whoIsItFor', href: ROUTES.homeWho },
  { labelKey: 'landing.nav.features', href: ROUTES.homeFeatures },
  { labelKey: 'landing.nav.becomeSeller', href: ROUTES.becomeSeller },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const isSeller = user?.role === UserRole.SELLER;
  const isAdmin = user?.role === UserRole.ADMIN;

  const guestLinks = GUEST_LINK_KEYS.map(({ labelKey, href }) => ({
    label: t(labelKey),
    href,
  }));

  const appLinks = getNavbarLinks(user?.role).map((link) => ({
    label: t(link.labelKey),
    href: link.href,
  }));
  const navLinks = user ? appLinks : guestLinks;

  const navLinkCls = (href: string) =>
    cn(
      'nav-link whitespace-nowrap text-[15px] font-medium leading-none transition-colors',
      isNavLinkActive(pathname, href)
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground',
    );

  return (
    <div className="navbar-w fixed top-0 left-0 right-0 z-50">
      <nav className="navbar w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="navbar-container mx-auto flex h-[71px] w-full max-w-[1460px] items-center gap-4 px-4 sm:px-8 lg:gap-6 lg:px-[70px]">
          <Link
            href={ROUTES.home}
            className="nav-logo-link flex shrink-0 items-center"
            aria-label="UmuhinziLink home"
          >
            <div className="nav-logo-embed relative h-6 w-[130px]">
              <Image
                src="/logo.png"
                alt="UmuhinziLink"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div
            className="nav-logo-divider hidden h-6 w-px shrink-0 bg-border lg:block"
            aria-hidden
          />

          <NavLinksScroll
            links={navLinks}
            navLinkCls={navLinkCls}
            className="hidden min-w-0 flex-1 lg:flex"
          />

          {/* Right cluster: auth / account */}
          <div className="nav-right ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
            {user ? (
              <>
                <Link
                  href={ROUTES.notifications}
                  className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAvatarOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {user.firstName?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="hidden max-w-[96px] truncate text-sm font-medium text-foreground sm:block">
                      {user.firstName}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>

                  {avatarOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAvatarOpen(false)}
                        aria-hidden
                      />
                      <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
                        <div className="border-b border-border px-4 py-3">
                          <p className="text-sm font-semibold text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>

                        <div className="py-1">
                          {isAdmin ? (
                            <>
                              <DropdownLink
                                href={ROUTES.admin.dashboard}
                                icon={<LayoutDashboard size={15} />}
                                label={t('nav.adminDashboard')}
                                onClick={() => setAvatarOpen(false)}
                              />
                              <DropdownLink
                                href={ROUTES.admin.wallets}
                                icon={<Wallet size={15} />}
                                label={t('nav.platformWallets')}
                                onClick={() => setAvatarOpen(false)}
                              />
                              <DropdownLink
                                href={ROUTES.admin.settings}
                                icon={<Settings size={15} />}
                                label={t('nav.adminSettings')}
                                onClick={() => setAvatarOpen(false)}
                              />
                            </>
                          ) : (
                            <>
                              <DropdownLink
                                href={ROUTES.profile}
                                icon={<User size={15} />}
                                label={t('nav.profile')}
                                onClick={() => setAvatarOpen(false)}
                              />
                              {isSeller ? (
                                <DropdownLink
                                  href={ROUTES.dashboard}
                                  icon={<LayoutDashboard size={15} />}
                                  label={t('nav.sellerDashboard')}
                                  onClick={() => setAvatarOpen(false)}
                                />
                              ) : (
                                <>
                                  <DropdownLink
                                    href={ROUTES.dashboard}
                                    icon={<LayoutDashboard size={15} />}
                                    label={t('nav.dashboard')}
                                    onClick={() => setAvatarOpen(false)}
                                  />
                                  <DropdownLink
                                    href={ROUTES.becomeSeller}
                                    icon={<Sprout size={15} />}
                                    label={t('nav.becomeSeller')}
                                    onClick={() => setAvatarOpen(false)}
                                  />
                                </>
                              )}
                              <DropdownLink
                                href={ROUTES.wallet}
                                icon={<Wallet size={15} />}
                                label={t('nav.wallet')}
                                onClick={() => setAvatarOpen(false)}
                              />
                              <DropdownLink
                                href={ROUTES.settings}
                                icon={<Settings size={15} />}
                                label={t('nav.settings')}
                                onClick={() => setAvatarOpen(false)}
                              />
                            </>
                          )}
                        </div>

                        <div className="border-t border-border py-1">
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setAvatarOpen(false);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <LogOut size={15} />
                            {t('nav.logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.signIn}
                  className="hidden text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                >
                  {t('landing.nav.signIn')}
                </Link>
                <Link
                  href={ROUTES.signUp}
                  className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t('landing.nav.getStarted')}
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg p-2 transition-colors hover:bg-accent lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-b border-border bg-background px-4 py-4 shadow-lg lg:hidden">
          <div className="nav-links-list flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <NavAnchorLink
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(navLinkCls(href), 'rounded-lg px-3 py-2.5')}
              >
                {label}
              </NavAnchorLink>
            ))}
          </div>

          {!user && (
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <Link
                href={ROUTES.signIn}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-center text-[15px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                {t('landing.nav.signIn')}
              </Link>
              <Link
                href={ROUTES.signUp}
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {t('landing.nav.getStarted')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NavLinksScroll({
  links,
  navLinkCls,
  className,
}: {
  links: { label: string; href: string }[];
  navLinkCls: (href: string) => string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    requestAnimationFrame(() => {
      if (!mountedRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2);
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    updateScrollState();

    const el = scrollRef.current;
    if (!el) {
      return () => {
        mountedRef.current = false;
      };
    }

    el.addEventListener('scroll', updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      mountedRef.current = false;
      el.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, [links, updateScrollState]);

  const scrollBy = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -180 : 180,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn('nav-links relative items-center', className)}>
      {canScrollLeft && (
        <div
          className="nav-links-fade-left pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-background via-background/80 to-transparent"
          aria-hidden
        />
      )}

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy('left')}
          className="nav-scroll-btn absolute left-0 z-[2] flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/95 text-muted-foreground shadow-sm transition-colors hover:border-border hover:text-foreground"
          aria-label="Scroll links left"
        >
          <ChevronLeft size={14} strokeWidth={2.25} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="nav-links-list-w nav-scrollbar-hide min-w-0 flex-1 overflow-x-auto overflow-y-hidden scroll-smooth"
      >
        <nav className="nav-links-list flex w-max items-center gap-7 px-1 py-0.5" aria-label="Main navigation">
          {links.map(({ label, href }) => (
            <NavAnchorLink key={href} href={href} className={cn(navLinkCls(href), 'inline-flex py-2')}>
              {label}
            </NavAnchorLink>
          ))}
        </nav>
      </div>

      {canScrollRight && (
        <div
          className="nav-links-fade-right pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-gradient-to-l from-background via-background/80 to-transparent"
          aria-hidden
        />
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy('right')}
          className="nav-scroll-btn absolute right-0 z-[2] flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-background/95 text-muted-foreground shadow-sm transition-colors hover:border-border hover:text-foreground"
          aria-label="Scroll links right"
        >
          <ChevronRight size={14} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Link>
  );
}
