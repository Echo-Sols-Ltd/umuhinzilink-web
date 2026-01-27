'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Lightbulb,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  User,
  Phone,
  Settings,
  LogOut,
  Sprout,
  Wheat,
  Apple,
  Tractor,
  CloudRain,
  TrendingUp,
  Users,
  MapPin,
  Bell,
  Wallet,
  Heart,
  Calendar,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
}

interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

interface AgriculturalSidebarProps {
  userRole: 'farmer' | 'buyer' | 'supplier' | 'admin';
  notifications?: {
    messages: number;
    orders: number;
    alerts: number;
  };
}

const farmerNavigation: NavigationGroup[] = [
  {
    label: 'Farm Management',
    items: [
      {
        title: 'Dashboard',
        url: '/farmer/dashboard',
        icon: LayoutDashboard,
        description: 'Overview of your farm activities',
      },
      {
        title: 'My Products',
        url: '/farmer/products',
        icon: Sprout,
        description: 'Manage your crops and produce',
      },
      {
        title: 'Crop Planning',
        url: '/farmer/planning',
        icon: Calendar,
        description: 'Plan your planting and harvest',
      },
      {
        title: 'Farm Analytics',
        url: '/farmer/analytics',
        icon: BarChart3,
        description: 'Track your farm performance',
      },
    ],
  },
  {
    label: 'Market & Sales',
    items: [
      {
        title: 'Orders',
        url: '/farmer/orders',
        icon: ShoppingCart,
        description: 'Manage incoming orders',
      },
      {
        title: 'Market Prices',
        url: '/farmer/market_analysis',
        icon: TrendingUp,
        description: 'Current market trends',
      },
      {
        title: 'Messages',
        url: '/farmer/message',
        icon: MessageSquare,
        description: 'Communicate with buyers',
      },
    ],
  },
  {
    label: 'Resources',
    items: [
      {
        title: 'Input Requests',
        url: '/farmer/new_request',
        icon: CreditCard,
        description: 'Request seeds, fertilizers, tools',
      },
      {
        title: 'AI Farm Assistant',
        url: '/farmer/ai',
        icon: Lightbulb,
        description: 'Get farming tips and advice',
      },
      {
        title: 'Weather',
        url: '/farmer/weather',
        icon: CloudRain,
        description: 'Weather forecasts and alerts',
      },
    ],
  },
];

const buyerNavigation: NavigationGroup[] = [
  {
    label: 'Marketplace',
    items: [
      {
        title: 'Dashboard',
        url: '/buyer/dashboard',
        icon: LayoutDashboard,
        description: 'Your buying overview',
      },
      {
        title: 'Browse Products',
        url: '/buyer/product',
        icon: Apple,
        description: 'Find fresh produce',
      },
      {
        title: 'Saved Items',
        url: '/buyer/saved',
        icon: Heart,
        description: 'Your favorite products',
      },
      {
        title: 'Purchase History',
        url: '/buyer/purchases',
        icon: FileText,
        description: 'View past orders',
      },
    ],
  },
  {
    label: 'Communication',
    items: [
      {
        title: 'Messages',
        url: '/buyer/message',
        icon: MessageSquare,
        description: 'Chat with farmers',
      },
      {
        title: 'Farmers Network',
        url: '/buyer/farmers',
        icon: Users,
        description: 'Connect with suppliers',
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Wallet',
        url: '/buyer/wallet',
        icon: Wallet,
        description: 'Manage payments',
      },
    ],
  },
];

const supplierNavigation: NavigationGroup[] = [
  {
    label: 'Supply Management',
    items: [
      {
        title: 'Dashboard',
        url: '/supplier/dashboard',
        icon: LayoutDashboard,
        description: 'Supply chain overview',
      },
      {
        title: 'Inventory',
        url: '/supplier/inventory',
        icon: Package,
        description: 'Manage your supplies',
      },
      {
        title: 'Equipment',
        url: '/supplier/equipment',
        icon: Tractor,
        description: 'Agricultural tools and machinery',
      },
    ],
  },
  {
    label: 'Orders & Sales',
    items: [
      {
        title: 'Orders',
        url: '/supplier/orders',
        icon: ShoppingCart,
        description: 'Process supply orders',
      },
      {
        title: 'Analytics',
        url: '/supplier/analytics',
        icon: BarChart3,
        description: 'Supply chain metrics',
      },
    ],
  },
];

const getNavigationForRole = (role: string): NavigationGroup[] => {
  switch (role) {
    case 'farmer':
      return farmerNavigation;
    case 'buyer':
      return buyerNavigation;
    case 'supplier':
      return supplierNavigation;
    default:
      return farmerNavigation;
  }
};

export function AgriculturalSidebar({ userRole, notifications }: AgriculturalSidebarProps) {
  const pathname = usePathname();
  const navigationGroups = getNavigationForRole(userRole);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'bg-agricultural-primary text-white';
      case 'buyer':
        return 'bg-sky-blue text-white';
      case 'supplier':
        return 'bg-earth-brown text-white';
      default:
        return 'bg-agricultural-primary text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer':
        return Wheat;
      case 'buyer':
        return ShoppingCart;
      case 'supplier':
        return Tractor;
      default:
        return Wheat;
    }
  };

  const RoleIcon = getRoleIcon(userRole);

  return (
    <Sidebar className="border-r border-agricultural-green-200 bg-gradient-to-b from-agricultural-green-50 to-white dark:from-agricultural-green-900 dark:to-gray-900">
      <SidebarHeader className="p-4 border-b border-agricultural-green-200">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img 
              src="/favicon.png" 
              alt="UmuhinziLink Logo" 
              className="h-10 w-10 rounded-lg shadow-agricultural-sm group-hover:shadow-agricultural-md transition-shadow" 
            />
            <div className="absolute -bottom-1 -right-1">
              <Badge className={cn('text-xs px-1.5 py-0.5', getRoleBadgeColor(userRole))}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {userRole}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-agricultural-primary dark:text-agricultural-primary-light">
              UmuhinziLink
            </span>
            <span className="text-xs text-agricultural-green-600 dark:text-agricultural-green-400 capitalize">
              {userRole} Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label} className="mb-6">
            <SidebarGroupLabel className="text-agricultural-green-700 dark:text-agricultural-green-300 font-semibold text-sm mb-2 px-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  const hasNotification = item.title === 'Messages' && notifications?.messages;
                  const hasOrderNotification = item.title === 'Orders' && notifications?.orders;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          'w-full justify-start rounded-organic-md p-3 mb-1 transition-all duration-200 group',
                          'hover:bg-agricultural-green-100 hover:text-agricultural-green-800 hover:shadow-agricultural-sm',
                          'dark:hover:bg-agricultural-green-800 dark:hover:text-agricultural-green-200',
                          isActive && [
                            'bg-agricultural-primary text-white shadow-agricultural-md',
                            'dark:bg-agricultural-primary-light dark:text-white',
                            'border-l-4 border-harvest-gold'
                          ]
                        )}
                        tooltip={item.description}
                      >
                        <Link href={item.url} className="flex items-center w-full">
                          <item.icon className={cn(
                            'mr-3 h-5 w-5 transition-colors',
                            isActive 
                              ? 'text-white' 
                              : 'text-agricultural-green-600 group-hover:text-agricultural-green-800 dark:text-agricultural-green-400'
                          )} />
                          <span className="font-medium">{item.title}</span>
                          {hasNotification && (
                            <SidebarMenuBadge className="ml-auto bg-sunrise-orange text-white">
                              {notifications?.messages}
                            </SidebarMenuBadge>
                          )}
                          {hasOrderNotification && (
                            <SidebarMenuBadge className="ml-auto bg-harvest-gold text-agricultural-primary">
                              {notifications?.orders}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3 border-t border-agricultural-green-200">
        {/* Notifications Summary */}
        {(notifications?.messages || notifications?.orders || notifications?.alerts) && (
          <div className="bg-agricultural-green-50 dark:bg-agricultural-green-900 rounded-organic-md p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-agricultural-green-700 dark:text-agricultural-green-300 font-medium">
                Notifications
              </span>
              <Bell className="h-4 w-4 text-agricultural-green-600" />
            </div>
            <div className="flex gap-2 mt-2">
              {notifications.messages > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {notifications.messages} messages
                </Badge>
              )}
              {notifications.orders > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {notifications.orders} orders
                </Badge>
              )}
              {notifications.alerts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {notifications.alerts} alerts
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-agricultural-green-600 dark:text-agricultural-green-400 font-medium">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-agricultural-green-700 hover:text-agricultural-green-800 hover:bg-agricultural-green-100 dark:text-agricultural-green-300 dark:hover:bg-agricultural-green-800 rounded-organic-md"
            asChild
          >
            <Link href={`/${userRole}/profile`}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-agricultural-green-700 hover:text-agricultural-green-800 hover:bg-agricultural-green-100 dark:text-agricultural-green-300 dark:hover:bg-agricultural-green-800 rounded-organic-md"
            asChild
          >
            <Link href={`/${userRole}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-agricultural-green-700 hover:text-agricultural-green-800 hover:bg-agricultural-green-100 dark:text-agricultural-green-300 dark:hover:bg-agricultural-green-800 rounded-organic-md"
            asChild
          >
            <Link href="/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-organic-md"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}