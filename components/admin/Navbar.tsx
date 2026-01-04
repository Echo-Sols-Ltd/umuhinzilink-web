import {
    LayoutGrid,
    Users,
    ArrowUpDown,
    Bell,
    User as UserIcon,
    Settings,
    X,
} from 'lucide-react';
import Link from 'next/link';
interface MenuItem {
    label: string;
    href: string;
    icon: any;
}


const MENU_ITEMS: MenuItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Orders', href: '/admin/orders', icon: ArrowUpDown },
    { label: 'Notifications', href: '/admin/reports', icon: Bell },
];

const MENU_ITEMS_BOTTOM: MenuItem[] = [
    { label: 'Profile', href: '/admin/settings', icon: UserIcon },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface NavbarPros {
    sidebarOpen: boolean
    setSidebarOpen: (data: boolean) => void
}

export default function AdminNavbar({ sidebarOpen, setSidebarOpen }: NavbarPros) {
    return (
        <div
            className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-green-600 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-white">umuhinziLink</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {MENU_ITEMS.map(item => {
                    const isActive = item.label === 'Dashboard';
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white text-green-600' : 'text-white hover:bg-green-700'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}

                <div className="border-t border-green-500 my-4"></div>

                {MENU_ITEMS_BOTTOM.map(item => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-white hover:bg-green-700"
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    )
}