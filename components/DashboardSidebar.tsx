'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
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
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Products',
    url: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Input Request',
    url: '/dashboard/credit',
    icon: CreditCard,
  },
  {
    title: 'AI Tips',
    url: '/dashboard/ai-tips',
    icon: Lightbulb,
  },
  {
    title: 'Market Analytics',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Message',
    url: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Contact',
    url: '/dashboard/contact',
    icon: Phone,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/favicon.png" alt="UmuhinziLink Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-green-600">UmuhinziLink</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={cn(
                  'w-full justify-start',
                  pathname === item.url &&
                    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                )}
              >
                <Link href={item.url}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
