'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { LoadingSpinner, Skeleton } from './loading-states';
import { ChevronDown, ChevronUp, Menu, X, Wifi, WifiOff, Signal } from 'lucide-react';

// Touch-friendly button with adequate tap targets (≥44px)
interface TouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
}

export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  loading = false,
}: TouchButtonProps) {
  const variants = {
    primary: 'bg-agricultural-primary text-white hover:bg-agricultural-600 active:bg-agricultural-700',
    secondary: 'bg-agricultural-200 text-agricultural-800 hover:bg-agricultural-300 active:bg-agricultural-400',
    outline: 'border-2 border-agricultural-primary text-agricultural-primary hover:bg-agricultural-50 active:bg-agricultural-100',
    ghost: 'text-agricultural-primary hover:bg-agricultural-50 active:bg-agricultural-100',
  };

  const sizes = {
    sm: 'min-h-[44px] px-4 py-2 text-sm',
    md: 'min-h-[48px] px-6 py-3 text-base',
    lg: 'min-h-[52px] px-8 py-4 text-lg',
    xl: 'min-h-[56px] px-10 py-5 text-xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-organic font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-agricultural-primary focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98] transform
        touch-manipulation
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Thumb-reach zone optimized layout
interface ThumbReachLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ThumbReachLayout({ children, className = '' }: ThumbReachLayoutProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Primary action zone - bottom 75% of screen, easily reachable by thumb */}
      <div className="min-h-screen flex flex-col">
        {/* Header zone - top 25% */}
        <div className="flex-shrink-0">
          {React.Children.toArray(children).slice(0, 1)}
        </div>
        
        {/* Content zone - middle area */}
        <div className="flex-1 overflow-y-auto">
          {React.Children.toArray(children).slice(1, -1)}
        </div>
        
        {/* Action zone - bottom 25%, thumb-friendly */}
        <div className="flex-shrink-0 pb-safe-area-inset-bottom">
          {React.Children.toArray(children).slice(-1)}
        </div>
      </div>
    </div>
  );
}

// Progressive loading component for slow networks
interface ProgressiveContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
}

export function ProgressiveContent({
  children,
  fallback,
  priority = 'medium',
  className = '',
}: ProgressiveContentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isSlowConnection } = useNetworkStatus();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: priority === 'high' ? '200px' : priority === 'medium' ? '100px' : '50px'
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isVisible) {
      // Simulate loading delay based on connection speed and priority
      const delay = isSlowConnection 
        ? (priority === 'high' ? 100 : priority === 'medium' ? 300 : 500)
        : (priority === 'high' ? 0 : priority === 'medium' ? 100 : 200);

      const timer = setTimeout(() => setIsLoaded(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isSlowConnection, priority]);

  return (
    <div ref={ref} className={className}>
      {isLoaded ? children : (fallback || <Skeleton className="h-20 w-full" />)}
    </div>
  );
}

// Offline capability indicator
interface OfflineCapabilityProps {
  children: ReactNode;
  offlineMessage?: string;
  className?: string;
}

export function OfflineCapability({
  children,
  offlineMessage = "This feature requires an internet connection",
  className = '',
}: OfflineCapabilityProps) {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  return (
    <div className={`relative ${className}`}>
      {/* Connection status indicator */}
      {(!isOnline || isSlowConnection) && (
        <div className={`
          absolute top-0 left-0 right-0 z-10 p-2 text-center text-sm
          ${!isOnline 
            ? 'bg-red-100 text-red-800 border-b border-red-200' 
            : 'bg-yellow-100 text-yellow-800 border-b border-yellow-200'
          }
        `}>
          <div className="flex items-center justify-center space-x-2">
            {!isOnline ? (
              <>
                <WifiOff className="w-4 h-4" />
                <span>{offlineMessage}</span>
              </>
            ) : (
              <>
                <Signal className="w-4 h-4" />
                <span>Slow connection - some features may be limited</span>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Content with offline overlay */}
      <div className={`${(!isOnline || isSlowConnection) ? 'pt-10' : ''}`}>
        <div className={!isOnline ? 'opacity-50 pointer-events-none' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Collapsible mobile navigation
interface MobileNavigationProps {
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
    badge?: string | number;
  }>;
  className?: string;
}

export function MobileNavigation({ items, className = '' }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <nav className={`flex space-x-4 ${className}`}>
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={item.onClick}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-agricultural-primary hover:bg-agricultural-50"
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <div className={className}>
      {/* Mobile menu button */}
      <TouchButton
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </TouchButton>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <TouchButton
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-5 h-5" />
                </TouchButton>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {items.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-agricultural-50 transition-colors min-h-[48px]"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

// Expandable content for mobile
interface ExpandableContentProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function ExpandableContent({
  title,
  children,
  defaultExpanded = false,
  className = '',
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 rounded-organic overflow-hidden ${className}`}>
      <TouchButton
        onClick={() => setIsExpanded(!isExpanded)}
        variant="ghost"
        className="w-full justify-between p-4 text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </TouchButton>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

// Mobile-optimized card component
interface MobileCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
}

export function MobileCard({
  children,
  className = '',
  padding = 'md',
  shadow = true,
  border = true,
}: MobileCardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        bg-white rounded-organic
        ${paddingClasses[padding]}
        ${shadow ? 'shadow-green-sm hover:shadow-green-md' : ''}
        ${border ? 'border border-gray-200' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Swipe gesture handler
interface SwipeHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export function SwipeHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
}: SwipeHandlerProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isUpSwipe = distanceY > threshold;
    const isDownSwipe = distanceY < -threshold;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      // Vertical swipe
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }
  };

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

// Mobile-first grid system
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = '',
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
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
    <div
      className={`
        grid
        ${gridCols[cols.mobile || 1]}
        ${cols.tablet ? `sm:${gridCols[cols.tablet]}` : ''}
        ${cols.desktop ? `lg:${gridCols[cols.desktop]}` : ''}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}