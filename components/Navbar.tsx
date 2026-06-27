'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useI18n } from '@/contexts/I18nContext';
import { UserRole } from '@/types';
import { useMemo, useState } from 'react';
import { Bell, ChevronDown, Menu, X, LayoutDashboard, LogOut, User, Settings, Sprout, Wallet } from 'lucide-react';
import { ADMIN_TOP_NAV_LINKS, isAdminNavActive } from '@/config/adminNav';
import { getAdminHomePath } from '@/lib/appPaths';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const isSeller = user?.role === UserRole.SELLER;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isActive = (href: string) =>
    isAdmin ? isAdminNavActive(pathname, href) : pathname === href;

  const guestLinks = useMemo(
    () => [
      { label: t('nav.browse'), href: '/products' },
      { label: t('nav.howItWorks'), href: '/about#features' },
    ],
    [t],
  );

  const buyerLinks = useMemo(
    () => [
      { label: t('nav.browse'), href: '/products' },
      { label: t('nav.aiAssistant'), href: '/assistant' },
      { label: t('nav.myOrders'), href: '/orders' },
      { label: t('nav.negotiations'), href: '/negotiations' },
    ],
    [t],
  );

  const sellerLinks = useMemo(
    () => [
      { label: t('nav.browse'), href: '/products' },
      { label: t('nav.aiAssistant'), href: '/assistant' },
      { label: t('nav.myListings'), href: '/products/seller' },
      { label: t('nav.myOrders'), href: '/orders' },
      { label: t('nav.negotiations'), href: '/negotiations' },
    ],
    [t],
  );

  const adminLinks = useMemo(
    () => ADMIN_TOP_NAV_LINKS.map(({ labelKey, href }) => ({ label: t(labelKey), href })),
    [t],
  );

  const navLinks = !user
    ? guestLinks
    : isAdmin
      ? adminLinks
      : isSeller
        ? sellerLinks
        : buyerLinks;

  const homeHref = isAdmin ? getAdminHomePath() : '/';

  const linkCls = (href: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(href)
      ? 'text-primary bg-primary/10'
      : 'text-foreground/70 hover:text-foreground hover:bg-accent'
    }`;

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-card/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        <Link href={homeHref} className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-extrabold text-primary">Umuhinzi</span>
          <span className="text-xl font-extrabold text-foreground">Link</span>
          {isAdmin && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-rose-500/15 text-rose-600">
              {t('nav.adminBadge')}
            </span>
          )}
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={linkCls(href)}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/notifications"
                className="relative p-2 rounded-full hover:bg-accent transition-colors">
                <Bell size={18} className="text-foreground/70" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setAvatarOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:bg-accent transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {user.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.firstName}
                  </span>
                  <ChevronDown size={14} className="text-foreground/50" />
                </button>

                {avatarOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setAvatarOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <DropdownLink
                          href="/profile"
                          icon={<User size={15} />}
                          label={t('nav.profile')}
                          onClick={() => setAvatarOpen(false)}
                        />

                        {isAdmin ? (
                          <>
                            <DropdownLink
                              href="/admin/dashboard"
                              icon={<LayoutDashboard size={15} />}
                              label={t('nav.adminConsole')}
                              onClick={() => setAvatarOpen(false)}
                            />
                            <DropdownLink
                              href="/admin/settings"
                              icon={<Settings size={15} />}
                              label={t('nav.systemSettings')}
                              onClick={() => setAvatarOpen(false)}
                            />
                          </>
                        ) : isSeller ? (
                          <DropdownLink
                            href="/seller/dashboard"
                            icon={<LayoutDashboard size={15} />}
                            label={t('nav.sellerDashboard')}
                            onClick={() => setAvatarOpen(false)}
                          />
                        ) : (
                          <DropdownLink
                            href="/become-seller"
                            icon={<Sprout size={15} />}
                            label={t('nav.becomeSeller')}
                            onClick={() => setAvatarOpen(false)}
                          />
                        )}

                        {!isAdmin && (
                          <DropdownLink
                            href="/wallet"
                            icon={<Wallet size={15} />}
                            label={t('nav.wallet')}
                            onClick={() => setAvatarOpen(false)}
                          />
                        )}

                        {!isAdmin && (
                          <DropdownLink
                            href="/settings"
                            icon={<Settings size={15} />}
                            label={t('nav.settings')}
                            onClick={() => setAvatarOpen(false)}
                          />
                        )}
                      </div>

                      <div className="border-t border-border py-1">
                        <button
                          onClick={() => { logout(); setAvatarOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
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
                href="/auth/signin"
                className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors">
                {t('nav.signIn')}
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                {t('nav.getStarted')}
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors ml-1">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={linkCls(href)}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
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
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Link>
  );
}
