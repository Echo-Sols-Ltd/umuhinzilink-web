'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Truck, Sprout, BarChart2,
  Wallet, User, Settings, LogOut, X, ChevronRight,
  MessageSquare, Menu,
} from '@/lib/icons';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigationWithLoading } from '@/lib/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProps, UserRole } from '@/types';
import { imageUrl } from '@/lib/utils';
import { ADMIN_SIDEBAR_NAV, ROUTES, isNavLinkActive, type AdminNavItem } from '@/lib/routes';
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

const ADMIN_NAV_ICONS: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard size={16} />,
  Users: <Users size={16} />,
  Orders: <Truck size={16} />,
  Products: <Sprout size={16} />,
  Wallets: <Wallet size={16} />,
  Analytics: <BarChart2 size={16} />,
  Settings: <Settings size={16} />,
};

function getAdminNavGroups(): NavGroup[] {
  const adminItems: NavItem[] = ADMIN_SIDEBAR_NAV.map((item: AdminNavItem) => ({
    icon: ADMIN_NAV_ICONS[item.label] ?? <LayoutDashboard size={16} />,
    label: item.label,
    href: item.href,
    matchPrefix: item.matchPrefix,
  }));

  return [
    { label: 'Administration', items: adminItems },
    {
      label: 'Account',
      items: [
        { icon: <MessageSquare size={16} />, label: 'Negotiations', href: ROUTES.negotiations },
        { icon: <User size={16} />, label: 'Profile', href: ROUTES.profile },
        { icon: <Settings size={16} />, label: 'Settings', href: ROUTES.settings },
      ],
    },
  ];
}

const ROLE_BADGE: Record<UserRole, { bg: string; text: string; dot: string; label: string }> = {
  [UserRole.SELLER]: { bg: 'bg-emerald-500/15', text: 'text-emerald-500', dot: 'bg-emerald-400', label: 'Seller' },
  [UserRole.BUYER]: { bg: 'bg-blue-500/15', text: 'text-blue-500', dot: 'bg-blue-400', label: 'Buyer' },
  [UserRole.ADMIN]: { bg: 'bg-rose-500/15', text: 'text-rose-500', dot: 'bg-rose-400', label: 'Admin' },
};

export default function Sidebar({ userType, hideTopbar = false }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { navigate } = useNavigationWithLoading();
  const { user, logout } = useAuth();

  const role = (user?.role ?? userType ?? UserRole.ADMIN) as UserRole;
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const initials = fullName !== 'User'
    ? fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'UL';
  const email = user?.email || '';
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE[UserRole.ADMIN];
  const groups = getAdminNavGroups();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = (item: NavItem) => {
    setMobileOpen(false);
    navigate(item.href);
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.signIn);
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
                  <li key={item.label}>
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

      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
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
          <div className="flex items-center gap-0.5 shrink-0">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
            >
              <LogOut size={15} />
            </button>
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
