'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Sprout,
  ShoppingCart,
  MessageSquare,
  User,
  Settings,
  Bell,
  Search,
} from 'lucide-react';

interface MobileNavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: MobileNavItem[];
}

interface MobileNavigationProps {
  userRole: 'farmer' | 'buyer' | 'supplier' | 'admin';
  notifications?: {
    messages: number;
    orders: number;
    alerts: number;
  };
  className?: string;
}

const mobileNavItems: Record<string, MobileNavItem[]> = {
  farmer: [
    {
      title: 'Dashboard',
      url: '/farmer/dashboard',
      icon: Home,
    },
    {
      title: 'Farm Management',
      url: '#',
      icon: Sprout,
      children: [
        { title: 'My Products', url: '/farmer/products', icon: Sprout },
        { title: 'Crop Planning', url: '/farmer/planning', icon: Sprout },
        { title: 'Analytics', url: '/farmer/analytics', icon: Sprout },
      ],
    },
    {
      title: 'Orders',
      url: '/farmer/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Messages',
      url: '/farmer/message',
      icon: MessageSquare,
    },
  ],
  buyer: [
    {
      title: 'Dashboard',
      url: '/buyer/dashboard',
      icon: Home,
    },
    {
      title: 'Browse Products',
      url: '/buyer/product',
      icon: Search,
    },
    {
      title: 'Orders',
      url: '/buyer/purchases',
      icon: ShoppingCart,
    },
    {
      title: 'Messages',
      url: '/buyer/message',
      icon: MessageSquare,
    },
  ],
  supplier: [
    {
      title: 'Dashboard',
      url: '/supplier/dashboard',
      icon: Home,
    },
    {
      title: 'Inventory',
      url: '/supplier/inventory',
      icon: Sprout,
    },
    {
      title: 'Orders',
      url: '/supplier/orders',
      icon: ShoppingCart,
    },
  ],
};

export function MobileNavigation({ userRole, notifications, className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  
  const navItems = mobileNavItems[userRole] || mobileNavItems.farmer;

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: MobileNavItem, depth = 0) => {
    const isActive = pathname === item.url;
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const hasNotification = item.title === 'Messages' && notifications?.messages;

    if (hasChildren) {
      return (
        <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpanded(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-between p-4 h-auto text-left',
                'hover:bg-agricultural-green-100 dark:hover:bg-agricultural-green-800',
                depth > 0 && 'pl-8'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-agricultural-green-600" />
                <span className="font-medium">{item.title}</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-agricultural-green-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-agricultural-green-500" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children?.map(child => renderNavItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.title}
        variant="ghost"
        asChild
        className={cn(
          'w-full justify-start p-4 h-auto',
          'hover:bg-agricultural-green-100 dark:hover:bg-agricultural-green-800',
          isActive && 'bg-agricultural-primary text-white hover:bg-agricultural-primary/90',
          depth > 0 && 'pl-8'
        )}
        onClick={() => setIsOpen(false)}
      >
        <Link href={item.url} className="flex items-center gap-3 w-full">
          <item.icon className={cn(
            'h-5 w-5',
            isActive ? 'text-white' : 'text-agricultural-green-600'
          )} />
          <span className="font-medium flex-1">{item.title}</span>
          {hasNotification && (
            <Badge className="bg-sunrise-orange text-white text-xs">
              {notifications?.messages}
            </Badge>
          )}
        </Link>
      </Button>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'md:hidden text-agricultural-primary hover:bg-agricultural-green-100',
            'dark:text-agricultural-green-300 dark:hover:bg-agricultural-green-800',
            className
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-80 p-0 bg-gradient-to-b from-agricultural-green-50 to-white dark:from-agricultural-green-900 dark:to-gray-900"
      >
        <SheetHeader className="p-6 border-b border-agricultural-green-200">
          <div className="flex items-center gap-3">
            <img 
              src="/favicon.png" 
              alt="UmuhinziLink Logo" 
              className="h-10 w-10 rounded-lg shadow-agricultural-sm" 
            />
            <div>
              <SheetTitle className="text-agricultural-primary dark:text-agricultural-green-300">
                UmuhinziLink
              </SheetTitle>
              <SheetDescription className="text-agricultural-green-600 dark:text-agricultural-green-400 capitalize">
                {userRole} Portal
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <nav className="flex-1 py-4">
            <div className="space-y-1">
              {navItems.map(item => renderNavItem(item))}
            </div>
          </nav>
          
          <div className="border-t border-agricultural-green-200 p-4 space-y-2">
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start hover:bg-agricultural-green-100 dark:hover:bg-agricultural-green-800"
              onClick={() => setIsOpen(false)}
            >
              <Link href={`/${userRole}/profile`} className="flex items-center gap-3">
                <User className="h-5 w-5 text-agricultural-green-600" />
                <span className="font-medium">Profile</span>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start hover:bg-agricultural-green-100 dark:hover:bg-agricultural-green-800"
              onClick={() => setIsOpen(false)}
            >
              <Link href={`/${userRole}/settings`} className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-agricultural-green-600" />
                <span className="font-medium">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}