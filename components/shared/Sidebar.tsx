'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Users, Truck, Sprout, BarChart2,
  Wallet, User, Settings, LogOut, X, ChevronRight, ChevronDown,
  MessageSquare, Menu, Package, Plus, Heart, Bell,
} from '@/lib/icons';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigationWithLoading } from '@/lib/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProps, UserRole } from '@/types';
import { imageUrl } from '@/lib/utils';
import {
  ADMIN_SIDEBAR_NAV,
  ADMIN_SIDEBAR_ACCOUNT,
  BUYER_SIDEBAR_NAV,
  BUYER_SIDEBAR_ACCOUNT,
  SELLER_SIDEBAR_NAV,
  SELLER_SIDEBAR_ACCOUNT,
  ROUTES,
  isNavLinkActive,
  getProfileMenuLinks,
  type AdminNavItem,
} from '@/lib/routes';
import DashboardTopbar from './DashboardTopbar';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  matchPrefix?: boolean;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV_ICONS: Record<string, React.ReactNode> = {
  Browse: <Package size={16} />,
  Dashboard: <LayoutDashboard size={16} />,
  'My Orders': <Truck size={16} />,
  Negotiations: <MessageSquare size={16} />,
  Saved: <Heart size={16} />,
  'My Listings': <Sprout size={16} />,
  'Add Listing': <Plus size={16} />,
  Users: <Users size={16} />,
  Orders: <Truck size={16} />,
  Products: <Sprout size={16} />,
  Wallets: <Wallet size={16} />,
  Analytics: <BarChart2 size={16} />,
  Wallet: <Wallet size={16} />,
  Profile: <User size={16} />,
  Notifications: <Bell size={16} />,
  Settings: <Settings size={16} />,
};

function mapNavItems(items: AdminNavItem[]): NavItem[] {
  return items.map((item) => ({
    icon: NAV_ICONS[item.label] ?? <LayoutDashboard size={16} />,
    label: item.label,
    href: item.href,
    matchPrefix: item.matchPrefix,
  }));
}

function getNavGroups(role: UserRole): NavGroup[] {
  switch (role) {
    case UserRole.ADMIN:
      return [
        { label: 'Administration', items: mapNavItems(ADMIN_SIDEBAR_NAV) },
        { label: 'Account', items: mapNavItems(ADMIN_SIDEBAR_ACCOUNT) },
      ];
    case UserRole.SELLER:
      return [
        { label: 'Marketplace', items: mapNavItems(SELLER_SIDEBAR_NAV) },
        { label: 'Account', items: mapNavItems(SELLER_SIDEBAR_ACCOUNT) },
      ];
    case UserRole.BUYER:
    default:
      return [
        { label: 'Marketplace', items: mapNavItems(BUYER_SIDEBAR_NAV) },
        { label: 'Account', items: mapNavItems(BUYER_SIDEBAR_ACCOUNT) },
      ];
  }
}

const ROLE_BADGE: Record<UserRole, { bg: string; text: string; dot: string; label: string }> = {
  [UserRole.SELLER]: { bg: 'bg-emerald-500/15', text: 'text-emerald-500', dot: 'bg-emerald-400', label: 'Seller' },
  [UserRole.BUYER]: { bg: 'bg-blue-500/15', text: 'text-blue-500', dot: 'bg-blue-400', label: 'Buyer' },
  [UserRole.ADMIN]: { bg: 'bg-rose-500/15', text: 'text-rose-500', dot: 'bg-rose-400', label: 'Admin' },
};

const PROFILE_MENU_ICONS: Record<string, React.ReactNode> = {
  Profile: <User size={15} />,
  Dashboard: <LayoutDashboard size={15} />,
  'Seller Dashboard': <LayoutDashboard size={15} />,
  'Admin Dashboard': <LayoutDashboard size={15} />,
  'Become a Seller': <Sprout size={15} />,
  Wallet: <Wallet size={15} />,
  'Platform Wallets': <Wallet size={15} />,
  Notifications: <Bell size={15} />,
  Settings: <Settings size={15} />,
  'Admin Settings': <Settings size={15} />,
};

function ProfileMenuLink({
  label,
  href,
  icon,
  onSelect,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  onSelect: (href: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(href)}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
    >
      <span className="text-foreground/50">{icon}</span>
      {label}
    </button>
  );
}

export default function Sidebar({ userType, hideTopbar = false }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { navigate } = useNavigationWithLoading();
  const { user, logout } = useAuth();

  const role = (user?.role ?? userType ?? UserRole.BUYER) as UserRole;
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const initials = fullName !== 'User'
    ? fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'UL';
  const email = user?.email || '';
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE[UserRole.BUYER];
  const groups = getNavGroups(role);
  const profileLinks = getProfileMenuLinks(role);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleNav = (item: NavItem) => {
    setMobileOpen(false);
    navigate(item.href);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
    navigate(ROUTES.signIn);
  };

  const handleProfileNav = (href: string) => {
    setProfileOpen(false);
    setMobileOpen(false);
    navigate(href);
  };

  const SidebarBody = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
          <img src="/logo.png" alt="UmuhinziLink" className="w-10 h-10 object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] text-foreground leading-tight">UmuhinziLink</p>
          <span className={`inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${badge.bg} ${badge.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-hide">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const isActive = isNavLinkActive(pathname, item.href, item.matchPrefix);
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNav(item)}
                      className={`
                        group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl
                        text-left text-[13px] font-medium transition-all duration-150 relative
                        ${isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/70 hover:text-foreground hover:bg-accent'}
                      `}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-foreground/60 rounded-r-full" />
                      )}
                      <span className={`shrink-0 ${isActive ? 'text-primary-foreground' : 'text-foreground/50 group-hover:text-foreground'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && <ChevronRight size={13} className="shrink-0 ml-auto text-primary-foreground/70" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-3">
        <div ref={profileRef} className="relative">
          {profileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg z-50">
              <div className="border-b border-border px-3 py-2.5">
                <p className="text-[12px] font-semibold text-foreground truncate">{fullName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{email}</p>
              </div>
              <div className="py-1">
                {profileLinks.map((link) => (
                  <ProfileMenuLink
                    key={link.href}
                    label={link.label}
                    href={link.href}
                    icon={PROFILE_MENU_ICONS[link.label] ?? <User size={15} />}
                    onSelect={handleProfileNav}
                  />
                ))}
              </div>
              <div className="border-t border-border py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={15} />
                  Log out
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex flex-1 min-w-0 items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left hover:bg-accent transition-colors"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                  {user?.profilePicture
                    ? <img src={imageUrl(user.profilePicture)} alt={fullName} className="w-8 h-8 object-cover" />
                    : <span className="text-[11px] font-semibold text-primary-foreground">{initials}</span>}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-background rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-foreground truncate leading-tight">{fullName}</p>
                <p className="text-[11px] text-muted-foreground truncate leading-tight">{email}</p>
              </div>
              <ChevronDown
                size={14}
                className={`shrink-0 text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!hideTopbar && (
        <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />
      )}

      {hideTopbar && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-3 left-3 z-40 p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>
      )}

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-60
        flex flex-col h-screen bg-card border-r border-border
        transition-transform duration-250 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3.5 right-3.5 p-1 text-muted-foreground hover:text-foreground rounded-lg"
        >
          <X size={16} />
        </button>

        <SidebarBody />
      </aside>
    </>
  );
}
