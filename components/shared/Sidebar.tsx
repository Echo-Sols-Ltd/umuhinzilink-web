'use client';

import { useState, useEffect } from 'react';
import {
    Home,
    Calendar,
    Map,
    Bell,
    Video,
    CreditCard,
    HelpCircle,
    MessageSquare,
    X,
    Settings,
    Menu,
    User,
    LogOut,
    AlertCircle,
    CheckCircle,
    LayoutGrid,
    FilePlus,
    Package,
    BarChart2,
    Mail,
    Tractor,
    ShoppingCart,
    Heart,
    Wallet,
    ArrowUpDown,
    Users,
    Clock,
    TrendingUp,
    Phone,
    LayoutDashboard,
    Shield,
    Truck,
    Sprout
} from 'lucide-react';
import { useNavigationWithLoading } from '@/lib/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProps, SidebarItem, UserType } from '@/types';

export default function Sidebar({ activeItem = 'Home', userType }: SidebarProps) {
    const [currentActive, setCurrentActive] = useState(activeItem);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [showNewUserGuide, setShowNewUserGuide] = useState(false);
    // Dev toggle for new user simulation (for development only)
    const [devNewUserMode, setDevNewUserMode] = useState(false);

    // Initialize dev mode from localStorage
    useEffect(() => {
        const savedDevMode = localStorage.getItem('devNewUserMode') === 'true';
        setDevNewUserMode(savedDevMode);
    }, []);
    const { navigate } = useNavigationWithLoading();
    const { user, logout } = useAuth();

    // Use user data from context, fallback to prop
    const currentUserType = (user?.role || userType) as UserType;
    const userName = user?.names || 'User';
    const userEmail = user?.email || 'user@umuhinzilink.rw';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

    // Get completion status for new user steps
    const getNewUserSteps = () => {
        const hasProfileComplete = localStorage.getItem('profileComplete');
        const hasAddedProduct = localStorage.getItem('hasAddedProduct');

        return [
            {
                id: 'profile',
                label: 'Complete Profile',
                completed: !!hasProfileComplete,
                href: '/farmer/profile',
                description: 'Provide your farm details'
            },
            {
                id: 'product',
                label: 'Add First Product',
                completed: !!hasAddedProduct,
                href: '/farmer/products',
                description: 'List your produce for sale'
            }
        ];
    };

    // Check if user is new and what steps they've completed
    useEffect(() => {
        const newUserFlag = localStorage.getItem('isNewUser');
        const hasProfileComplete = localStorage.getItem('profileComplete');

        if ((newUserFlag === 'true' || devNewUserMode) && currentUserType === UserType.FARMER) {
            setIsNewUser(true);
            setShowNewUserGuide(!hasProfileComplete);
        } else {
            setIsNewUser(false);
            setShowNewUserGuide(false);
        }
    }, [currentUserType, devNewUserMode]);

    // Update current active when prop changes
    useEffect(() => {
        setCurrentActive(activeItem);
    }, [activeItem]);

    const handleLogout = async () => {
        await logout();
        navigate('/auth/signin');
    };

    // Define navigation items based on user type
    const getNavigationItems = (): SidebarItem[] => {
        switch (currentUserType) {
            case UserType.FARMER:
                return [
                    {
                        icon: <LayoutGrid className="w-5 h-5" />,
                        label: 'Dashboard',
                        href: '/farmer/dashboard',
                    },
                    {
                        icon: <Package className="w-5 h-5" />,
                        label: 'Products',
                        href: '/farmer/products',
                    },
                    {
                        icon: <FilePlus className="w-5 h-5" />,
                        label: 'Input Request',
                        href: '/farmer/requests',
                    },
                    {
                        icon: <MessageSquare className="w-5 h-5" />,
                        label: 'AI Tips',
                        href: '/farmer/ai',
                    },
                    {
                        icon: <BarChart2 className="w-5 h-5" />,
                        label: 'Market Analytics',
                        href: '/farmer/market_analysis',
                    },
                    {
                        icon: <Mail className="w-5 h-5" />,
                        label: 'Messages',
                        href: '/farmer/message',
                    },
                    {
                        icon: <Bell className="w-5 h-5" />,
                        label: 'Notifications',
                        href: '/farmer/notifications',
                    },
                    {
                        icon: <User className="w-5 h-5" />,
                        label: 'Profile',
                        href: '/farmer/profile',
                    },
                    {
                        icon: <ShoppingCart className="w-5 h-5" />,
                        label: 'Orders',
                        href: '/farmer/orders',
                    },
                    {
                        icon: <Wallet className="w-5 h-5" />,
                        label: 'My Wallet',
                        href: '/farmer/wallet',
                    },
                    {
                        icon: <Settings className="w-5 h-5" />,
                        label: 'Settings',
                        href: '/farmer/settings',
                    }
                ];
            case UserType.BUYER:
                return [
                    {
                        icon: <CheckCircle className="w-5 h-5" />,
                        label: 'Dashboard',
                        href: '/buyer/dashboard',
                    },
                    {
                        icon: <ShoppingCart className="w-5 h-5" />,
                        label: 'My Purchase',
                        href: '/buyer/purchases',
                    },
                    {
                        icon: <FilePlus className="w-5 h-5" />,
                        label: 'Browse Product',
                        href: '/buyer/product',
                    },
                    {
                        icon: <Heart className="w-5 h-5" />,
                        label: 'Saved Items',
                        href: '/buyer/saved',
                    },
                    {
                        icon: <Wallet className="w-5 h-5" />,
                        label: 'My Wallet',
                        href: '/buyer/wallet',
                    },
                    {
                        icon: <Mail className="w-5 h-5" />,
                        label: 'Message',
                        href: '/buyer/message',
                    },
                    {
                        icon: <User className="w-5 h-5" />,
                        label: 'Profile',
                        href: '/buyer/profile',
                    },
                    {
                        icon: <Phone className="w-5 h-5" />,
                        label: 'Contact',
                        href: '/buyer/contact',
                    },
                    {
                        icon: <Settings className="w-5 h-5" />,
                        label: 'Settings',
                        href: '/buyer/settings',
                    }
                ];
            case UserType.SUPPLIER:
                return [
                    {
                        icon: <CheckCircle className="w-5 h-5" />,
                        label: 'Dashboard',
                        href: '/supplier/dashboard',
                    },
                    {
                        icon: <LayoutGrid className="w-5 h-5" />,
                        label: 'My Inputs',
                        href: '/supplier/products',
                    },
                    {
                        icon: <FilePlus className="w-5 h-5" />,
                        label: 'Farmer Request',
                        href: '/supplier/requests',
                    },
                    {
                        icon: <ShoppingCart className="w-5 h-5" />,
                        label: 'Orders',
                        href: '/supplier/orders',
                    },
                    {
                        icon: <Mail className="w-5 h-5" />,
                        label: 'Message',
                        href: '/supplier/message',
                    },
                    {
                        icon: <User className="w-5 h-5" />,
                        label: 'Profile',
                        href: '/supplier/profile',
                    },
                    {
                        icon: <Phone className="w-5 h-5" />,
                        label: 'Contact',
                        href: '/supplier/contact',
                    },
                    {
                        icon: <Wallet className="w-5 h-5" />,
                        label: 'My Wallet',
                        href: '/supplier/wallet',
                    },
                    {
                        icon: <Settings className="w-5 h-5" />,
                        label: 'Settings',
                        href: '/supplier/settings',
                    }
                ];
            case UserType.ADMIN:
                return [
                    {
                        icon: <LayoutDashboard className="w-5 h-5" />,
                        label: 'Dashboard',
                        href: '/admin/dashboard',
                    },
                    {
                        icon: <Wallet className="w-5 h-5" />,
                        label: 'Wallets',
                        href: '/admin/wallets',
                    },
                    {
                        icon: <Users className="w-5 h-5" />,
                        label: 'Users',
                        href: '/admin/users',
                    },
                    {
                        icon: <Tractor className="w-5 h-5" />,
                        label: 'Farmer Orders',
                        href: '/admin/orders/farmer',
                    },
                    {
                        icon: <Truck className="w-5 h-5" />,
                        label: 'Supplier Orders',
                        href: '/admin/orders/supplier',
                    },
                    {
                        icon: <Sprout className="w-5 h-5" />,
                        label: 'Farmer Products',
                        href: '/admin/products/farmer',
                    },
                    {
                        icon: <Package className="w-5 h-5" />,
                        label: 'Supplier Products',
                        href: '/admin/products/supplier',
                    },
                    {
                        icon: <BarChart2 className="w-5 h-5" />,
                        label: 'Analytics',
                        href: '/admin/analytics',
                    },
                    {
                        icon: <AlertCircle className="w-5 h-5" />,
                        label: 'Reports',
                        href: '/admin/reports',
                    },
                    {
                        icon: <Shield className="w-5 h-5" />,
                        label: 'Security',
                        href: '/admin/security',
                    },
                    {
                        icon: <Settings className="w-5 h-5" />,
                        label: 'Settings',
                        href: '/admin/settings',
                    }
                ];
            case UserType.GOVERNMENT:
                return [
                    {
                        icon: <LayoutGrid className="w-5 h-5" />,
                        label: 'Dashboard',
                        href: '/government/dashboard',
                    },
                    {
                        icon: <Tractor className="w-5 h-5" />,
                        label: 'Farmers Produce',
                        href: '/government/farmers-produce',
                    },
                    {
                        icon: <Package className="w-5 h-5" />,
                        label: 'Suppliers Produce',
                        href: '/government/suppliers-produce',
                    },
                    {
                        icon: <Bell className="w-5 h-5" />,
                        label: 'Notifications',
                        href: '/government/notifications',
                    },
                    {
                        icon: <User className="w-5 h-5" />,
                        label: 'Profile',
                        href: '/government/profile',
                    },
                    {
                        icon: <Settings className="w-5 h-5" />,
                        label: 'Settings',
                        href: '/government/settings',
                    }
                ];
            default:
                return [
                    {
                        icon: <Home className="w-5 h-5" />,
                        label: 'Home',
                        href: '/',
                    },
                    {
                        icon: <Settings className="w-5 h-5" />,
                        label: 'Settings',
                        href: '/settings',
                    }
                ];
        }
    };

    const sidebarItems = getNavigationItems();

    // Get user type display info
    const getUserTypeInfo = () => {
        switch (currentUserType) {
            case UserType.FARMER:
                return {
                    displayName: 'Farmer',
                    progressLabel: 'Harvest Progress',
                    progressValue: 80,
                    renewLabel: 'Manage Products',
                    renewHref: '/farmer/products'
                };
            case UserType.BUYER:
                return {
                    displayName: 'Buyer',
                    progressLabel: 'Active Orders',
                    progressValue: 65,
                    renewLabel: 'Browse Market',
                    renewHref: '/buyer/product'
                };
            case UserType.SUPPLIER:
                return {
                    displayName: 'Supplier',
                    progressLabel: 'Stock Level',
                    progressValue: 85,
                    renewLabel: 'Manage Inputs',
                    renewHref: '/supplier/products'
                };
            case UserType.ADMIN:
                return {
                    displayName: 'Administrator',
                    progressLabel: 'System Health',
                    progressValue: 95,
                    renewLabel: 'Admin Panel',
                    renewHref: '/admin/dashboard'
                };
            case UserType.GOVERNMENT:
                return {
                    displayName: 'Gov Official',
                    progressLabel: 'Active Reports',
                    progressValue: 70,
                    renewLabel: 'View Data',
                    renewHref: '/government/dashboard'
                };
            default:
                return {
                    displayName: 'Member',
                    progressLabel: 'Profile Strength',
                    progressValue: 50,
                    renewLabel: 'Complete Profile',
                    renewHref: '/profile'
                };
        }
    };

    const userInfo = getUserTypeInfo();

    const handleNavigation = (item: SidebarItem) => {
        setCurrentActive(item.label);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
        navigate(item.href);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64  bg-gray-900 text-white flex flex-col h-screen overflow-y-scroll
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo */}
                <div className="p-4 lg:p-8 border-b border-gray-800/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0">
                            <Tractor className="w-7 h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-lg text-white leading-tight truncate">UmuhinziLink</div>
                            <div className="text-xs font-medium text-gray-400 mt-0.5 uppercase tracking-wider">{userInfo.displayName}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 lg:p-4">
                    <ul className="space-y-1 lg:space-y-2">
                        {sidebarItems.map((item) => (
                            <li key={item.label}>
                                <button
                                    onClick={() => handleNavigation(item)}
                                    className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors text-sm lg:text-base ${currentActive === item.label
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Progress Circle - Hidden on mobile */}
                <div className="hidden lg:block p-6 border-t border-gray-800">
                    <div className="relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center">
                            <div className="relative w-16 h-16 mb-4">
                                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#374151"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#059669"
                                        strokeWidth="2"
                                        strokeDasharray={`${userInfo.progressValue}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-green-500">{userInfo.progressValue}%</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="font-semibold text-white">{userInfo.progressLabel}</div>
                                <div className="text-sm text-gray-400 mt-1">
                                    Keep your profile updated to get the best experience
                                </div>
                                <div className="flex items-center gap-2 mt-3 justify-center">
                                    <a
                                        href={userInfo.renewHref}
                                        className="text-sm text-green-500 hover:text-green-400 font-medium"
                                    >
                                        {userInfo.renewLabel}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dev Toggle & New User Guide */}
                {currentUserType === UserType.FARMER && (
                    <div className="p-3 lg:p-4 border-t border-gray-800">
                        {/* Dev Toggle */}
                        <div className="mb-4">
                            <button
                                onClick={() => {
                                    const newDevMode = !devNewUserMode;
                                    setDevNewUserMode(newDevMode);

                                    // Store in localStorage
                                    localStorage.setItem('devNewUserMode', newDevMode.toString());

                                    // Dispatch event for student dashboard to listen
                                    window.dispatchEvent(new CustomEvent('devModeChanged', {
                                        detail: { isDevMode: newDevMode }
                                    }));

                                    if (newDevMode) {
                                        // Reset all progress when enabling dev mode
                                        localStorage.removeItem('profileComplete');
                                        localStorage.removeItem('hasAddedProduct');
                                        localStorage.setItem('isNewUser', 'true');
                                    }
                                }}
                                className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${devNewUserMode
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                            >
                                DEV: {devNewUserMode ? 'New Farmer Mode ON' : 'New Farmer Mode OFF'}
                            </button>
                        </div>

                        {/* New User Guide */}
                        {showNewUserGuide && (
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-white">Finish Account Setup</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Complete your profile to start selling your produce</p>
                                <button
                                    onClick={() => navigate('/farmer/profile')}
                                    className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                                >
                                    Complete Setup
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* User Profile */}
                <div className="p-3 lg:p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-xs lg:text-sm font-medium text-white">{userInitials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-white text-sm lg:text-base truncate">{userName}</div>
                            <div className="text-xs lg:text-sm text-gray-400 truncate">{userEmail}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="text-gray-400 hover:text-white p-1">
                                <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-red-400 p-1"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}