import Link from 'next/link';

import {
    LayoutGrid,
    BarChart2,
    Bell,
    LogOut,
    User as UserIcon,
    Settings,
    Search,
    ChevronDown,
    TrendingUp,
    Package,
    ShoppingCart,
    Tractor,
    DollarSign,
    Loader2,
    Edit,
    Trash2,
    CheckCircle2,
    X,
} from 'lucide-react';
import { GovernmentPages } from '@/types';

type MenuItem = {
    label: string;
    page: GovernmentPages;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
    { label: 'Dashboard', page: GovernmentPages.DASHBOARD, href: '/government/dashboard', icon: LayoutGrid },
    { label: 'Farmers Produce', page: GovernmentPages.FARMERS_PRODUCE, href: '/government/farmer/s-produce', icon: Tractor },
    { label: 'Suppliers Produce', page: GovernmentPages.SUPPLIERS_PRODUCE, href: '/government/suppliers-produce', icon: Package },
    { label: 'Notifications', page: GovernmentPages.NOTIFICATIONS, href: '/government/notifications', icon: Bell },
    { label: 'Profile', page: GovernmentPages.PROFILE, href: '/government/profile', icon: UserIcon },
    { label: 'Settings', page: GovernmentPages.SETTINGS, href: '/government/settings', icon: Settings },
];

interface Props {
    activePage: GovernmentPages;
    handleLogout: () => void
    logoutPending: boolean
}

export default function GovernmentSidebar({ activePage, handleLogout, logoutPending }: Props) {
    return (
        <aside
            className="w-64 bg-[#00A63E] border-r flex flex-col fixed left-0 top-0 h-screen overflow-y-auto"
            aria-label="Sidebar"
        >
            <div className="flex items-center px-6 py-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-bold text-xl text-white">FarmLink</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {MENU_ITEMS.map((item, index) => {
                    const isActive = item.page === activePage;
                    const Icon = item.icon;
                    const showDivider = index === 4;

                    return (
                        <div key={item.label}>
                            {item.isLogout ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={logoutPending}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-white ${logoutPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                                        }`}
                                >
                                    {logoutPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                                            <span>Logging out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon className="w-5 h-5 text-white" />
                                            <span>{item.label}</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link href={item.href} className="block">
                                    <div
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium ${isActive
                                            ? 'bg-white text-green-600 shadow-sm'
                                            : 'text-white hover:bg-green-700'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-white'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                </Link>
                            )}
                            {showDivider && <div className="border-t border-gray-200 my-2 mx-4" />}
                        </div>
                    );
                })}
            </nav>
        </aside>

    )
}