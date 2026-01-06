import { FarmerPages } from '@/types';
import {
    LayoutGrid,
    FilePlus,
    BarChart2,
    MessageSquare,
    LogOut,
    ShoppingCart,
    User as UserIcon,
    Settings,
    CloudSun,
    Mail,
    Leaf,
    Package,
    Search,
    Bell,
    ChevronDown,
    TrendingUp,
    Users as UsersIcon,
    Clock,
    DollarSign,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';

type MenuItem = {
    label: string;
    page: FarmerPages;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    isLogout?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
    { label:'Dashboard',page: FarmerPages.DASHBOARD, href: '/farmer/dashboard', icon: LayoutGrid },
    { label:'Products',page: FarmerPages.PRODUCTS, href: '/farmer/products', icon: Package },
    { label:'Input Request',page: FarmerPages.INPUT_REQUEST, href: '/farmer/requests', icon: FilePlus },
    { label:'AI Tips',page: FarmerPages.AI_TIPS, href: '/farmer/ai', icon: MessageSquare },
    { label:'Market Analytics',page: FarmerPages.MARKET_ANALYTICS, href: '/farmer/market_analysis', icon: BarChart2 },
    { label:'Messages',page: FarmerPages.MESSAGES, href: '/farmer/message', icon: Mail },
    { label:'Notifications',page: FarmerPages.NOTIFICATIONS, href: '/farmer/notifications', icon: Bell },
    { label:'Profile',page: FarmerPages.PROFILE, href: '/farmer/profile', icon: UserIcon },
    { label:'Orders',page: FarmerPages.ORDERS, href: '/farmer/orders', icon: ShoppingCart },
    { label:'Settings',page: FarmerPages.SETTINGS, href: '/farmer/settings', icon: Settings },
    { label:'Logout',page: FarmerPages.LOGOUT, href: '#', icon: LogOut, isLogout: true },
];

interface Props {
    activePage: FarmerPages
    logoutPending: boolean
    handleLogout: () => void
}


export default function FarmerSidebar({ activePage,logoutPending, handleLogout }: Props) {
    return (
        <aside
            className="w-64 bg-[#00A63E] border-r flex flex-col fixed left-0 top-0 h-screen overflow-y-auto"
            aria-label="Sidebar"
        >
            <div className="flex items-center px-6 py-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-bold text-xl text-white">UmuhinziLink</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {MENU_ITEMS.map((item, index) => {
                    const isActive = item.page === activePage;
                    const Icon = item.icon;
                    const showDivider = index === 4 || index === 9;

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