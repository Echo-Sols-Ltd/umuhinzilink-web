'use client';

import { useState, useEffect } from 'react';
import {
    Home,
    Bell,
    MessageSquare,
    X,
    Settings,
    Menu,
    User,
    LogOut,
    LayoutGrid,
    FilePlus,
    Package,
    BarChart2,
    Mail,
    Tractor,
    ShoppingCart,
    Heart,
    Wallet,
    Users,
    TrendingUp,
    Phone,
    LayoutDashboard,
    Shield,
    Truck,
    Sprout,
    Leaf,
    AlertCircle,
    ChevronRight,
    Store,
} from 'lucide-react';
import { useNavigationWithLoading } from '@/lib/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProps, SidebarItem, UserType } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────
interface NavGroup {
    label?: string;
    items: SidebarItem[];
}

// ─── Navigation config ───────────────────────────────────────────────────────
function getNavGroups(userType: UserType): NavGroup[] {
    switch (userType) {
        case UserType.FARMER:
            return [
                {
                    label: 'Core',
                    items: [
                        { icon: <LayoutGrid className="w-4.5 h-4.5" />, label: 'Dashboard', href: '/farmer/dashboard' },
                        { icon: <Package className="w-4.5 h-4.5" />, label: 'Products', href: '/farmer/products' },
                        { icon: <FilePlus className="w-4.5 h-4.5" />, label: 'Input Request', href: '/farmer/requests' },
                        { icon: <ShoppingCart className="w-4.5 h-4.5" />, label: 'Orders', href: '/farmer/orders' },
                        { icon: <Store className="w-4.5 h-4.5" />, label: 'Supplier Orders', href: '/farmer/supplier-orders' },
                        { icon: <Truck className="w-4.5 h-4.5" />, label: 'Deliveries', href: '/farmer/delivery' },
                        { icon: <BarChart2 className="w-4.5 h-4.5" />, label: 'Market Analytics', href: '/farmer/market_analysis' },
                        { icon: <MessageSquare className="w-4.5 h-4.5" />, label: 'AI Tips', href: '/farmer/ai' },
                    ],
                },
                {
                    label: 'Communicate',
                    items: [
                        { icon: <Mail className="w-4.5 h-4.5" />, label: 'Messages', href: '/chat' },
                        { icon: <Bell className="w-4.5 h-4.5" />, label: 'Notifications', href: '/notifications' },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        { icon: <Wallet className="w-4.5 h-4.5" />, label: 'My Wallet', href: '/farmer/wallet' },
                        { icon: <User className="w-4.5 h-4.5" />, label: 'Profile', href: '/farmer/profile' },
                        { icon: <Settings className="w-4.5 h-4.5" />, label: 'Settings', href: '/farmer/settings' },
                    ],
                },
            ];

        case UserType.BUYER:
            return [
                {
                    label: 'Core',
                    items: [
                        { icon: <LayoutGrid className="w-4.5 h-4.5" />, label: 'Dashboard', href: '/buyer/dashboard' },
                        { icon: <FilePlus className="w-4.5 h-4.5" />, label: 'Browse Products', href: '/buyer/product' },
                        { icon: <ShoppingCart className="w-4.5 h-4.5" />, label: 'My Purchases', href: '/buyer/purchases' },
                        { icon: <Truck className="w-4.5 h-4.5" />, label: 'Delivery Tracking', href: '/buyer/delivery' },
                        { icon: <Heart className="w-4.5 h-4.5" />, label: 'Saved Items', href: '/buyer/saved' },
                    ],
                },
                {
                    label: 'Communicate',
                    items: [
                        { icon: <Mail className="w-4.5 h-4.5" />, label: 'Messages', href: '/chat' },
                        { icon: <Bell className="w-4.5 h-4.5" />, label: 'Notifications', href: '/notifications' },
                        { icon: <Phone className="w-4.5 h-4.5" />, label: 'Contact', href: '/buyer/contact' },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        { icon: <Wallet className="w-4.5 h-4.5" />, label: 'My Wallet', href: '/buyer/wallet' },
                        { icon: <User className="w-4.5 h-4.5" />, label: 'Profile', href: '/buyer/profile' },
                        { icon: <Settings className="w-4.5 h-4.5" />, label: 'Settings', href: '/buyer/settings' },
                    ],
                },
            ];

        case UserType.SUPPLIER:
            return [
                {
                    label: 'Core',
                    items: [
                        { icon: <LayoutGrid className="w-4.5 h-4.5" />, label: 'Dashboard', href: '/supplier/dashboard' },
                        { icon: <Package className="w-4.5 h-4.5" />, label: 'My Inputs', href: '/supplier/products' },
                        { icon: <FilePlus className="w-4.5 h-4.5" />, label: 'Farmer Requests', href: '/supplier/requests' },
                        { icon: <ShoppingCart className="w-4.5 h-4.5" />, label: 'Orders', href: '/supplier/orders' },
                        { icon: <Wallet className="w-4.5 h-4.5" />, label: 'My Wallet', href: '/supplier/wallet' },
                    ],
                },
                {
                    label: 'Communicate',
                    items: [
                        { icon: <Mail className="w-4.5 h-4.5" />, label: 'Messages', href: '/chat' },
                        { icon: <Bell className="w-4.5 h-4.5" />, label: 'Notifications', href: '/notifications' },
                        { icon: <Phone className="w-4.5 h-4.5" />, label: 'Contact', href: '/supplier/contact' },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        { icon: <User className="w-4.5 h-4.5" />, label: 'Profile', href: '/supplier/profile' },
                        { icon: <Settings className="w-4.5 h-4.5" />, label: 'Settings', href: '/supplier/settings' },
                    ],
                },
            ];

        case UserType.ADMIN:
            return [
                {
                    label: 'Core',
                    items: [
                        { icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: 'Dashboard', href: '/admin/dashboard' },
                        { icon: <Users className="w-4.5 h-4.5" />, label: 'Users', href: '/admin/users' },
                        { icon: <Truck className="w-4.5 h-4.5" />, label: 'Orders', href: '/admin/orders' },
                        { icon: <Sprout className="w-4.5 h-4.5" />, label: 'Products', href: '/admin/products' },
                        { icon: <BarChart2 className="w-4.5 h-4.5" />, label: 'Analytics', href: '/admin/analytics' },
                        { icon: <AlertCircle className="w-4.5 h-4.5" />, label: 'Reports', href: '/admin/reports' },
                        { icon: <Shield className="w-4.5 h-4.5" />, label: 'Security', href: '/admin/security' },
                        { icon: <Wallet className="w-4.5 h-4.5" />, label: 'Wallets', href: '/admin/wallets' },
                    ],
                },
                {
                    label: 'Communicate',
                    items: [
                        { icon: <Mail className="w-4.5 h-4.5" />, label: 'Messages', href: '/chat' },
                        { icon: <Bell className="w-4.5 h-4.5" />, label: 'Notifications', href: '/notifications' },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        { icon: <Settings className="w-4.5 h-4.5" />, label: 'Settings', href: '/admin/settings' },
                    ],
                },
            ];

        case UserType.GOVERNMENT:
            return [
                {
                    label: 'Core',
                    items: [
                        { icon: <LayoutGrid className="w-4.5 h-4.5" />, label: 'Dashboard', href: '/government/dashboard' },
                        { icon: <Tractor className="w-4.5 h-4.5" />, label: 'Farmers Produce', href: '/government/farmers-produce' },
                        { icon: <Package className="w-4.5 h-4.5" />, label: 'Suppliers Produce', href: '/government/suppliers-produce' },
                    ],
                },
                {
                    label: 'Communicate',
                    items: [
                        { icon: <Mail className="w-4.5 h-4.5" />, label: 'Messages', href: '/chat' },
                        { icon: <Bell className="w-4.5 h-4.5" />, label: 'Notifications', href: '/notifications' },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        { icon: <User className="w-4.5 h-4.5" />, label: 'Profile', href: '/government/profile' },
                        { icon: <Settings className="w-4.5 h-4.5" />, label: 'Settings', href: '/government/settings' },
                    ],
                },
            ];

        default:
            return [
                {
                    items: [
                        { icon: <Home className="w-4.5 h-4.5" />, label: 'Home', href: '/' },
                        { icon: <Settings className="w-4.5 h-4.5" />, label: 'Settings', href: '/settings' },
                    ],
                },
            ];
    }
}

// ─── Role badge colours ───────────────────────────────────────────────────────
const ROLE_BADGE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    FARMER: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Farmer' },
    BUYER: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', label: 'Buyer' },
    SUPPLIER: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Supplier' },
    ADMIN: { bg: 'bg-rose-500/15', text: 'text-rose-400', dot: 'bg-rose-400', label: 'Administrator' },
    GOVERNMENT: { bg: 'bg-violet-500/15', text: 'text-violet-400', dot: 'bg-violet-400', label: 'Gov. Official' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ activeItem = 'Home', userType }: SidebarProps) {
    const [currentActive, setCurrentActive] = useState(activeItem);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { navigate } = useNavigationWithLoading();
    const { user, logout } = useAuth();

    const currentUserType = (user?.role || userType) as UserType;
    const userName = user?.names || 'User';
    const userEmail = user?.email || 'user@umuhinzilink.rw';
    const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const badge = ROLE_BADGE[currentUserType] ?? ROLE_BADGE.FARMER;
    const navGroups = getNavGroups(currentUserType);

    useEffect(() => { setCurrentActive(activeItem); }, [activeItem]);

    const handleLogout = async () => {
        await logout();
        navigate('/auth/signin');
    };

    const handleNavigation = (item: SidebarItem) => {
        setCurrentActive(item.label);
        setIsMobileMenuOpen(false);
        navigate(item.href);
    };

    return (
        <>
            {/* ── Mobile hamburger ─────────────────────────────────── */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation"
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* ── Mobile backdrop ───────────────────────────────────── */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Sidebar panel ─────────────────────────────────────── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64
                    flex flex-col h-screen
                    bg-[#0a1628] text-white
                    transform transition-transform duration-300 ease-in-out
                    lg:transform-none
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >

                {/* Mobile close */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ── Logo / Brand ─────────────────────────────────── */}
                <div className="px-5 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-green-900/40 shrink-0">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-10 h-10 object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-[15px] text-white leading-tight tracking-tight">UmuhinziLink</p>
                            {/* Role badge */}
                            <span className={`inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {badge.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Navigation (scrollable) ───────────────────────── */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-hide">
                    {navGroups.map((group, gi) => (
                        <div key={gi}>
                            {group.label && (
                                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 select-none">
                                    {group.label}
                                </p>
                            )}
                            <ul className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = currentActive === item.label;
                                    return (
                                        <li key={item.label}>
                                            <button
                                                onClick={() => handleNavigation(item)}
                                                className={`
                                                    group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm
                                                    transition-all duration-150 relative
                                                    ${isActive
                                                        ? 'bg-green-600/20 text-green-400 font-semibold'
                                                        : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                                                    }
                                                `}
                                            >
                                                {/* Active left bar */}
                                                {isActive && (
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-green-400 rounded-r-full" />
                                                )}
                                                <span className={`shrink-0 transition-colors ${isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="truncate">{item.label}</span>
                                                {isActive && (
                                                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-green-500 opacity-60" />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* ── User profile footer ───────────────────────────── */}
                <div className="shrink-0 border-t border-white/5 px-4 py-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-green-500 to-emerald-700 flex items-center justify-center text-xs font-bold text-white shadow-md">
                                {userInitials}
                            </div>
                            {/* Online dot */}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-[#0a1628] rounded-full" />
                        </div>

                        {/* Name / Email */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate leading-tight">{userName}</p>
                            <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">{userEmail}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 shrink-0">
                            <button
                                onClick={() => navigate(
                                    currentUserType === UserType.FARMER ? '/farmer/settings' :
                                        currentUserType === UserType.BUYER ? '/buyer/settings' :
                                            currentUserType === UserType.SUPPLIER ? '/supplier/settings' :
                                                currentUserType === UserType.ADMIN ? '/admin/settings' :
                                                    '/settings'
                                )}
                                title="Settings"
                                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/8 rounded-lg transition-all"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleLogout}
                                title="Sign out"
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}