'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Bell,
  MessageCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { TouchOptimizedButton } from './responsive-layout';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

interface MobileNavigationProps {
  userType: 'farmer' | 'buyer' | 'supplier' | 'admin' | 'government';
  className?: string;
}

export function MobileNavigation({ userType, className = '' }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [messages, setMessages] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  // Don't render on desktop
  if (!isMobile) return null;

  const getNavItems = (): MobileNavItem[] => {
    const baseItems: MobileNavItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        href: `/${userType}/dashboard`,
      },
    ];

    switch (userType) {
      case 'farmer':
        return [
          ...baseItems,
          {
            id: 'products',
            label: 'Products',
            icon: ShoppingCart,
            href: '/farmer/products',
          },
          {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            href: '/farmer/orders',
          },
          {
            id: 'messages',
            label: 'Messages',
            icon: MessageCircle,
            href: '/farmer/message',
            badge: messages,
          },
        ];

      case 'buyer':
        return [
          ...baseItems,
          {
            id: 'products',
            label: 'Browse',
            icon: Search,
            href: '/buyer/product',
          },
          {
            id: 'purchases',
            label: 'Purchases',
            icon: ShoppingCart,
            href: '/buyer/purchases',
          },
          {
            id: 'messages',
            label: 'Messages',
            icon: MessageCircle,
            href: '/buyer/message',
            badge: messages,
          },
        ];

      case 'supplier':
        return [
          ...baseItems,
          {
            id: 'products',
            label: 'Products',
            icon: ShoppingCart,
            href: '/supplier/products',
          },
          {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            href: '/supplier/orders',
          },
          {
            id: 'messages',
            label: 'Messages',
            icon: MessageCircle,
            href: '/supplier/message',
            badge: messages,
          },
        ];

      case 'admin':
        return [
          ...baseItems,
          {
            id: 'users',
            label: 'Users',
            icon: User,
            href: '/admin/users',
          },
          {
            id: 'products',
            label: 'Products',
            icon: ShoppingCart,
            href: '/admin/products',
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: Search,
            href: '/admin/analytics',
          },
        ];

      case 'government':
        return [
          ...baseItems,
          {
            id: 'farmers-produce',
            label: 'Farmers',
            icon: User,
            href: '/government/farmers-produce',
          },
          {
            id: 'suppliers-produce',
            label: 'Suppliers',
            icon: ShoppingCart,
            href: '/government/suppliers-produce',
          },
        ];

      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}>
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <TouchOptimizedButton
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                variant="ghost"
                className={`flex flex-col items-center justify-center space-y-1 h-full rounded-none relative ${
                  isActive ? 'text-green-600 bg-green-50' : 'text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </TouchOptimizedButton>
            );
          })}

          {/* Menu Button */}
          <TouchOptimizedButton
            onClick={() => setIsMenuOpen(true)}
            variant="ghost"
            className="flex flex-col items-center justify-center space-y-1 h-full rounded-none text-gray-600 relative"
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications > 99 ? '99+' : notifications}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Menu</span>
          </TouchOptimizedButton>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.names?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.names || 'User'}</p>
                <p className="text-sm text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
            <TouchOptimizedButton
              onClick={() => setIsMenuOpen(false)}
              variant="ghost"
              size="sm"
            >
              <X className="w-6 h-6" />
            </TouchOptimizedButton>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* All Navigation Items */}
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <TouchOptimizedButton
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    variant="ghost"
                    className={`w-full justify-start space-x-3 h-12 ${
                      isActive ? 'bg-green-50 text-green-600' : 'text-gray-700'
                    }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </TouchOptimizedButton>
                );
              })}

              {/* Additional Menu Items */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <TouchOptimizedButton
                  onClick={() => handleNavigation(`/${userType}/profile`)}
                  variant="ghost"
                  className="w-full justify-start space-x-3 h-12 text-gray-700"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </TouchOptimizedButton>

                <TouchOptimizedButton
                  onClick={() => handleNavigation(`/${userType}/settings`)}
                  variant="ghost"
                  className="w-full justify-start space-x-3 h-12 text-gray-700"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </TouchOptimizedButton>

                <TouchOptimizedButton
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start space-x-3 h-12 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-16" />
    </>
  );
}

// Hook to manage mobile navigation state
export function useMobileNavigation() {
  const [bottomNavHeight, setBottomNavHeight] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setBottomNavHeight(64); // 16 * 4 = 64px (h-16)
    } else {
      setBottomNavHeight(0);
    }
  }, [isMobile]);

  return {
    bottomNavHeight,
    isMobile,
  };
}