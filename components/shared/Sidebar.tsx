'use client';

import { useState, useEffect } from 'react';
import {
    LayoutGrid, Package, ShoppingCart, Store, BarChart2,
    MessageSquare, Mail, Bell, Wallet, User, Settings,
    LogOut, Menu, X, ChevronRight, LayoutDashboard,
    Users, Truck, Sprout, AlertCircle, Shield, Tractor,
    Heart, FilePlus, Home,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNavigationWithLoading } from '@/lib/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { SidebarProps, UserType } from '@/types';
import { imageUrl } from '@/lib/utils';
import DashboardTopbar from './DashboardTopbar';

// ─── types ────────────────────────────────────────────────────────
interface NavItem { icon: React.ReactNode; label: string; href: string; badge?: number | string }
interface NavGroup { label?: string; items: NavItem[] }

// ─── nav config ───────────────────────────────────────────────────
function getNavGroups(role: UserType): NavGroup[] {
    switch (role) {
        case UserType.FARMER: return [
            {
                label: 'Sell', items: [
                    { icon: <LayoutGrid size={16} />, label: 'Dashboard',        href: '/farmer/dashboard' },
                    { icon: <Package     size={16} />, label: 'My Products',     href: '/farmer/products' },
                    { icon: <ShoppingCart size={16}/>, label: 'Customer Orders', href: '/farmer/orders' },
                    { icon: <MessageSquare size={16}/>,label: 'Negotiations',    href: '/farmer/negotiations' },
                ],
            },
            {
                label: 'Buy', items: [
                    { icon: <Store       size={16} />, label: 'Supply Market',   href: '/farmer/requests' },
                    { icon: <ShoppingCart size={16}/>, label: 'Supply Orders',   href: '/farmer/supplier-orders' },
                ],
            },
            {
                label: 'Insights', items: [
                    { icon: <BarChart2   size={16} />, label: 'Market Prices',   href: '/farmer/market_analysis' },
                    { icon: <MessageSquare size={16}/>, label: 'AI Tips',        href: '/farmer/ai' },
                ],
            },
            {
                label: 'Account', items: [
                    { icon: <Wallet      size={16} />, label: 'Wallet',          href: '/farmer/wallet' },
                    { icon: <Mail        size={16} />, label: 'Messages',        href: '/chat' },
                    { icon: <User        size={16} />, label: 'Profile',         href: '/farmer/profile' },
                    { icon: <Settings    size={16} />, label: 'Settings',        href: '/settings' },
                ],
            },
        ];

        case UserType.BUYER: return [
            {
                label: 'Shop', items: [
                    { icon: <LayoutGrid  size={16} />, label: 'Dashboard',       href: '/buyer/dashboard' },
                    { icon: <FilePlus    size={16} />, label: 'Browse Products', href: '/buyer/products' },
                    { icon: <ShoppingCart size={16}/>, label: 'My Orders',       href: '/buyer/purchases' },
                    { icon: <MessageSquare size={16}/>, label: 'Negotiations',   href: '/buyer/negotiations' },
                    { icon: <Heart       size={16} />, label: 'Saved',           href: '/buyer/saved' },
                ],
            },
            {
                label: 'Account', items: [
                    { icon: <Wallet      size={16} />, label: 'Wallet',          href: '/buyer/wallet' },
                    { icon: <Mail        size={16} />, label: 'Messages',        href: '/chat' },
                    { icon: <User        size={16} />, label: 'Profile',         href: '/buyer/profile' },
                    { icon: <Settings    size={16} />, label: 'Settings',        href: '/settings' },
                ],
            },
        ];

        case UserType.SUPPLIER: return [
            {
                label: 'Sell', items: [
                    { icon: <LayoutGrid  size={16} />, label: 'Dashboard',       href: '/supplier/dashboard' },
                    { icon: <Package     size={16} />, label: 'My Products',     href: '/supplier/products' },
                    { icon: <ShoppingCart size={16}/>, label: 'Orders',          href: '/supplier/orders' },
                    { icon: <MessageSquare size={16}/>, label: 'Negotiations',   href: '/supplier/negotiations' },
                ],
            },
            {
                label: 'Account', items: [
                    { icon: <Wallet      size={16} />, label: 'Wallet',          href: '/supplier/wallet' },
                    { icon: <Mail        size={16} />, label: 'Messages',        href: '/chat' },
                    { icon: <User        size={16} />, label: 'Profile',         href: '/supplier/profile' },
                    { icon: <Settings    size={16} />, label: 'Settings',        href: '/settings' },
                ],
            },
        ];

        case UserType.ADMIN: return [
            {
                label: 'Administration', items: [
                    { icon: <LayoutDashboard size={16}/>, label: 'Dashboard',    href: '/admin/dashboard' },
                    { icon: <Users       size={16} />, label: 'Users',           href: '/admin/users' },
                    { icon: <Truck       size={16} />, label: 'Orders',          href: '/admin/orders' },
                    { icon: <Sprout      size={16} />, label: 'Products',        href: '/admin/products' },
                    { icon: <Wallet      size={16} />, label: 'Wallets',         href: '/admin/wallets' },
                    { icon: <BarChart2   size={16} />, label: 'Analytics',       href: '/admin/analytics' },
                    { icon: <AlertCircle size={16} />, label: 'Reports',         href: '/admin/reports' },
                    { icon: <Shield      size={16} />, label: 'Security',        href: '/admin/security' },
                ],
            },
            {
                label: 'Account', items: [
                    { icon: <Mail        size={16} />, label: 'Messages',        href: '/chat' },
                    { icon: <User        size={16} />, label: 'Profile',         href: '/admin/profile' },
                    { icon: <Settings    size={16} />, label: 'Settings',        href: '/admin/settings' },
                ],
            },
        ];

        case UserType.GOVERNMENT: return [
            {
                label: 'Monitoring', items: [
                    { icon: <LayoutGrid  size={16} />, label: 'Overview',               href: '/government/dashboard' },
                    { icon: <Tractor     size={16} />, label: 'Farmer Output',          href: '/government/farmers-produce' },
                    { icon: <Package     size={16} />, label: 'Input Supply',           href: '/government/suppliers-produce' },
                ],
            },
            {
                label: 'Account', items: [
                    { icon: <Bell        size={16} />, label: 'Alerts',                 href: '/government/notifications' },
                    { icon: <User        size={16} />, label: 'Profile',                href: '/government/profile' },
                    { icon: <Settings    size={16} />, label: 'Settings',               href: '/government/settings' },
                ],
            },
        ];

        default: return [{
            items: [
                { icon: <Home        size={16} />, label: 'Home',     href: '/' },
                { icon: <Settings    size={16} />, label: 'Settings', href: '/settings' },
            ],
        }];
    }
}

// ─── role badge ───────────────────────────────────────────────────
const ROLE_BADGE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    FARMER:     { bg: 'bg-emerald-500/15', text: 'text-emerald-500', dot: 'bg-emerald-400', label: 'Farmer' },
    BUYER:      { bg: 'bg-blue-500/15',    text: 'text-blue-500',    dot: 'bg-blue-400',    label: 'Buyer' },
    SUPPLIER:   { bg: 'bg-amber-500/15',   text: 'text-amber-500',   dot: 'bg-amber-400',   label: 'Supplier' },
    ADMIN:      { bg: 'bg-rose-500/15',    text: 'text-rose-500',    dot: 'bg-rose-400',    label: 'Admin' },
    GOVERNMENT: { bg: 'bg-violet-500/15',  text: 'text-violet-500',  dot: 'bg-violet-400',  label: 'Government' },
};

// ─── component ────────────────────────────────────────────────────
export default function Sidebar({ activeItem = 'Dashboard', userType }: SidebarProps) {
    const [currentActive, setCurrentActive] = useState(activeItem);
    const [mobileOpen, setMobileOpen]       = useState(false);

    const { navigate }    = useNavigationWithLoading();
    const { user, logout } = useAuth();
    const { t }           = useI18n();

    const role      = (user?.role || userType) as UserType;
    const firstName = user?.firstName || '';
    const lastName  = user?.lastName  || '';
    const fullName  = `${firstName} ${lastName}`.trim() || 'User';
    const initials  = fullName !== 'User'
        ? fullName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'UL';
    const email     = user?.email || '';
    const badge     = ROLE_BADGE[role] ?? ROLE_BADGE.FARMER;
    const groups    = getNavGroups(role);

    useEffect(() => { setCurrentActive(activeItem); }, [activeItem]);

    // lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleNav = (item: NavItem) => {
        setCurrentActive(item.label);
        setMobileOpen(false);
        navigate(item.href);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/auth/signin');
    };

    // ── sidebar body (shared between mobile + desktop) ─────────────
    const SidebarBody = () => (
        <div className="flex flex-col h-full">

            {/* brand */}
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

            {/* nav */}
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
                                const isActive = currentActive === item.label;
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
                                            {item.badge !== undefined && (
                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                                                    ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-destructive/10 text-destructive'}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isActive && <ChevronRight size={13} className="shrink-0 ml-auto text-primary-foreground/70" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* user footer */}
            <div className="shrink-0 border-t border-border px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                            {user?.avatar
                                ? <img src={imageUrl(user.avatar)} alt={fullName} className="w-8 h-8 object-cover" />
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
            {/* ── dashboard topbar (replaces Navbar inside dashboard) ─ */}
            <DashboardTopbar onMenuClick={() => setMobileOpen(true)} />

            {/* ── mobile backdrop ───────────────────────────────────── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── sidebar panel ─────────────────────────────────────── */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-60
                flex flex-col h-screen bg-card border-r border-border
                transition-transform duration-250 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* mobile close button */}
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