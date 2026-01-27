'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TouchButton } from './mobile-first-patterns';
import { ChevronLeft, Menu, Search, Bell, User } from 'lucide-react';

// Mobile-first container with proper margins and padding
interface MobileContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function MobileContainer({
  children,
  size = 'lg',
  padding = 'md',
  className = '',
}: MobileContainerProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  const paddings = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 py-4 sm:px-6 sm:py-6',
    lg: 'px-4 py-6 sm:px-8 sm:py-8',
  };

  return (
    <div className={`mx-auto w-full ${sizes[size]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized header with touch-friendly navigation
interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuToggle?: () => void;
  showSearch?: boolean;
  onSearch?: () => void;
  showNotifications?: boolean;
  onNotifications?: () => void;
  notificationCount?: number;
  showProfile?: boolean;
  onProfile?: () => void;
  actions?: Array<{
    icon: ReactNode;
    onClick: () => void;
    label: string;
  }>;
  className?: string;
}

export function MobileHeader({
  title,
  showBack = false,
  onBack,
  showMenu = false,
  onMenuToggle,
  showSearch = false,
  onSearch,
  showNotifications = false,
  onNotifications,
  notificationCount = 0,
  showProfile = false,
  onProfile,
  actions = [],
  className = '',
}: MobileHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-30 ${className}`}>
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left section */}
        <div className="flex items-center space-x-2">
          {showBack && (
            <TouchButton
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </TouchButton>
          )}
          
          {showMenu && (
            <TouchButton
              onClick={onMenuToggle}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <Menu className="w-6 h-6" />
            </TouchButton>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          )}
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Custom actions */}
          {actions.map((action, index) => (
            <TouchButton
              key={index}
              onClick={action.onClick}
              variant="ghost"
              size="sm"
              className="p-2"
              aria-label={action.label}
            >
              {action.icon}
            </TouchButton>
          ))}
          
          {/* Search */}
          {showSearch && (
            <TouchButton
              onClick={onSearch}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <Search className="w-6 h-6" />
            </TouchButton>
          )}
          
          {/* Notifications */}
          {showNotifications && (
            <TouchButton
              onClick={onNotifications}
              variant="ghost"
              size="sm"
              className="p-2 relative"
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </TouchButton>
          )}
          
          {/* Profile */}
          {showProfile && (
            <TouchButton
              onClick={onProfile}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <User className="w-6 h-6" />
            </TouchButton>
          )}
        </div>
      </div>
    </header>
  );
}

// Mobile-optimized bottom navigation
interface MobileBottomNavProps {
  items: Array<{
    icon: ReactNode;
    activeIcon?: ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    badge?: string | number;
    active?: boolean;
  }>;
  className?: string;
}

export function MobileBottomNav({ items, className = '' }: MobileBottomNavProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 ${className}`}>
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={item.onClick}
            className={`
              flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-lg
              min-w-[60px] min-h-[48px] relative transition-colors duration-200
              ${item.active 
                ? 'text-agricultural-primary bg-agricultural-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="relative">
              {item.active && item.activeIcon ? item.activeIcon : item.icon}
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium truncate max-w-[60px]">
              {item.label}
            </span>
          </a>
        ))}
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}

// Mobile-optimized section with proper spacing
interface MobileSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MobileSection({
  children,
  title,
  subtitle,
  action,
  spacing = 'md',
  className = '',
}: MobileSectionProps) {
  const spacingClasses = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {action && (
            <TouchButton
              onClick={action.onClick}
              variant="ghost"
              size="sm"
              className="text-agricultural-primary"
            >
              {action.label}
            </TouchButton>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Mobile-optimized sticky action bar
interface MobileStickyActionBarProps {
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export function MobileStickyActionBar({
  children,
  position = 'bottom',
  className = '',
}: MobileStickyActionBarProps) {
  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
  };

  return (
    <div className={`
      fixed left-0 right-0 ${positionClasses[position]} z-20
      bg-white border-t border-gray-200 p-4
      ${position === 'bottom' ? 'pb-safe-area-inset-bottom' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Mobile-optimized card grid
interface MobileCardGridProps {
  children: ReactNode;
  cols?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MobileCardGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
}: MobileCardGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div className={`
      grid
      ${gridCols[cols.mobile || 1]}
      ${cols.tablet ? `sm:${gridCols[cols.tablet]}` : ''}
      ${cols.desktop ? `lg:${gridCols[cols.desktop]}` : ''}
      ${gapClasses[gap]}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Mobile-optimized page layout
interface MobilePageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  bottomNav?: ReactNode;
  stickyActions?: ReactNode;
  className?: string;
}

export function MobilePageLayout({
  children,
  header,
  bottomNav,
  stickyActions,
  className = '',
}: MobilePageLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      {header}
      
      {/* Main content */}
      <main className={`
        flex-1
        ${header ? 'pt-0' : ''}
        ${bottomNav && isMobile ? 'pb-20' : ''}
        ${stickyActions ? 'pb-20' : ''}
      `}>
        {children}
      </main>
      
      {/* Sticky actions */}
      {stickyActions && (
        <MobileStickyActionBar>
          {stickyActions}
        </MobileStickyActionBar>
      )}
      
      {/* Bottom navigation */}
      {bottomNav}
    </div>
  );
}

// Mobile-optimized list with proper touch targets
interface MobileListProps {
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    badge?: string | number;
    onClick?: () => void;
    href?: string;
  }>;
  dividers?: boolean;
  className?: string;
}

export function MobileList({
  items,
  dividers = true,
  className = '',
}: MobileListProps) {
  return (
    <div className={`bg-white rounded-organic overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <div key={item.id}>
          <a
            href={item.href}
            onClick={item.onClick}
            className={`
              flex items-center space-x-4 p-4 min-h-[60px]
              hover:bg-gray-50 active:bg-gray-100
              transition-colors duration-150
              ${item.onClick || item.href ? 'cursor-pointer' : ''}
            `}
          >
            {/* Icon */}
            {item.icon && (
              <div className="flex-shrink-0 w-6 h-6 text-gray-400">
                {item.icon}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-sm text-gray-600 truncate">{item.subtitle}</p>
              )}
            </div>
            
            {/* Badge */}
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </a>
          
          {/* Divider */}
          {dividers && index < items.length - 1 && (
            <div className="border-b border-gray-200 ml-4" />
          )}
        </div>
      ))}
    </div>
  );
}

// Mobile-optimized tabs
interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    badge?: string | number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function MobileTabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: MobileTabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="relative">
        {/* Tab buttons */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 min-h-[48px] whitespace-nowrap
                font-medium text-sm transition-colors duration-200
                ${activeTab === tab.id
                  ? 'text-agricultural-primary'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[16px] text-center">
                  {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Active indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-agricultural-primary transition-all duration-300"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    </div>
  );
}