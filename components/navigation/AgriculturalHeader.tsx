'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  MessageSquare,
  ShoppingCart,
  AlertTriangle,
  MapPin,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface Notification {
  id: string;
  type: 'message' | 'order' | 'alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  urgent?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'supplier' | 'admin';
  avatar?: string;
  location?: string;
  verified?: boolean;
}

interface AgriculturalHeaderProps {
  user: UserProfile;
  notifications?: Notification[];
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
  isOnline?: boolean;
  className?: string;
}

export function AgriculturalHeader({ 
  user, 
  notifications = [], 
  onSearch,
  showSearch = true,
  title,
  subtitle,
  isOnline = true,
  className 
}: AgriculturalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, setTheme } = useTheme();

  const unreadNotifications = notifications.filter(n => !n.read);
  const urgentNotifications = notifications.filter(n => n.urgent && !n.read);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      case 'order':
        return ShoppingCart;
      case 'alert':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'text-agricultural-primary bg-agricultural-green-100';
      case 'buyer':
        return 'text-sky-blue bg-sky-blue/10';
      case 'supplier':
        return 'text-earth-brown bg-earth-brown/10';
      default:
        return 'text-agricultural-primary bg-agricultural-green-100';
    }
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b border-agricultural-green-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60',
      'dark:border-agricultural-green-700 dark:bg-gray-900/95 dark:supports-backdrop-filter:bg-gray-900/60',
      'shadow-agricultural-sm',
      className
    )}>
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Sidebar Trigger & Title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-agricultural-primary hover:bg-agricultural-green-100 dark:text-agricultural-green-300 dark:hover:bg-agricultural-green-800" />
          
          {(title || subtitle) && (
            <div className="hidden md:block">
              {title && (
                <h1 className="text-lg font-semibold text-agricultural-primary dark:text-agricultural-green-300">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-agricultural-green-600 dark:text-agricultural-green-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-agricultural-green-500" />
              <Input
                type="search"
                placeholder="Search products, farmers, or orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  'pl-10 pr-4 py-2 w-full rounded-organic-md border-agricultural-green-200',
                  'focus:border-agricultural-primary focus:ring-2 focus:ring-agricultural-primary/20',
                  'dark:border-agricultural-green-700 dark:bg-gray-800',
                  isSearchFocused && 'shadow-agricultural-md'
                )}
              />
            </form>
          </div>
        )}

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Connection Status */}
          <div className="hidden sm:flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 text-growth-success">
                <Wifi className="h-4 w-4" />
                <span className="text-xs font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-alert-red">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs font-medium">Offline</span>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-agricultural-green-600 hover:bg-agricultural-green-100 dark:text-agricultural-green-400 dark:hover:bg-agricultural-green-800"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-agricultural-green-600 hover:bg-agricultural-green-100 dark:text-agricultural-green-400 dark:hover:bg-agricultural-green-800"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <Badge 
                    className={cn(
                      'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs',
                      urgentNotifications.length > 0 
                        ? 'bg-alert-red text-white' 
                        : 'bg-sunrise-orange text-white'
                    )}
                  >
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadNotifications.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadNotifications.length} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-agricultural-green-600">
                  No notifications yet
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => {
                    const NotificationIcon = getNotificationIcon(notification.type);
                    return (
                      <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
                        <div className={cn(
                          'p-1.5 rounded-full',
                          notification.urgent ? 'bg-alert-red/10' : 'bg-agricultural-green-100'
                        )}>
                          <NotificationIcon className={cn(
                            'h-4 w-4',
                            notification.urgent ? 'text-alert-red' : 'text-agricultural-primary'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-medium',
                            !notification.read && 'text-agricultural-primary'
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-agricultural-green-600 truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-agricultural-green-500 mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-sunrise-orange rounded-full flex-shrink-0 mt-2" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}
              
              {notifications.length > 5 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="text-center text-sm text-agricultural-primary">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto">
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border-2 border-agricultural-green-200"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-agricultural-primary text-white flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-agricultural-primary dark:text-agricultural-green-300">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-xs px-1.5 py-0.5 capitalize', getRoleColor(user.role))}>
                        {user.role}
                      </Badge>
                      {user.verified && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-agricultural-green-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-agricultural-green-600">{user.email}</p>
                  {user.location && (
                    <div className="flex items-center gap-1 text-xs text-agricultural-green-500">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href={`/${user.role}/profile`} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/${user.role}/settings`} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}