'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, Variants } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Settings, 
  Bell,
  Search,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Enhanced Mobile Navigation with smooth animations and touch gestures
interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number;
  children?: MobileNavItem[];
}

interface EnhancedMobileNavigationProps {
  items: MobileNavItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  className?: string;
  variant?: 'slide' | 'push' | 'overlay';
}

const slideVariants = {
  closed: { 
    x: '-100%',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  },
  open: { 
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30
    }
  }
};

const overlayVariants = {
  closed: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  },
  open: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

const itemVariants: Variants = {
  closed: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2
    }
  },
  open: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

const staggerContainer = {
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const EnhancedMobileNavigation: React.FC<EnhancedMobileNavigationProps> = ({
  items,
  isOpen,
  onToggle,
  onClose,
  className,
  variant = 'slide'
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  // Handle swipe to close
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < 0) {
      setDragOffset(info.offset.x);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      onClose();
    }
    setDragOffset(0);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const renderNavItem = (item: MobileNavItem, level: number = 0) => (
    <motion.div
      key={item.id}
      variants={itemVariants}
      className={cn(
        'relative',
        level > 0 && 'ml-4 border-l border-gray-200 dark:border-gray-700 pl-4'
      )}
    >
      <button
        onClick={() => {
          if (item.children) {
            setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
          } else {
            item.onClick?.();
            onClose();
          }
        }}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          'active:bg-gray-100 dark:active:bg-gray-700',
          'transition-colors duration-200',
          'touch-manipulation',
          'min-h-[48px]', // Minimum touch target size
          level === 0 && 'border-b border-gray-100 dark:border-gray-800'
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            {item.icon}
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {item.label}
          </span>
          {item.badge && (
            <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        
        {item.children && (
          <motion.div
            animate={{ rotate: activeSubmenu === item.id ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        )}
      </button>

      {/* Submenu */}
      <AnimatePresence>
        {item.children && activeSubmenu === item.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-gray-25 dark:bg-gray-850"
          >
            {item.children.map(child => renderNavItem(child, level + 1))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={slideVariants}
            initial="closed"
            animate="open"
            exit="closed"
            drag="x"
            dragConstraints={{ left: -300, right: 0 }}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed top-0 left-0 h-full w-80 max-w-[85vw]',
              'bg-white dark:bg-gray-900',
              'border-r border-gray-200 dark:border-gray-800',
              'shadow-2xl z-50 lg:hidden',
              'flex flex-col',
              className
            )}
            style={{
              transform: dragOffset < 0 ? `translateX(${dragOffset}px)` : undefined
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Menu
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <motion.div
              variants={staggerContainer}
              initial="closed"
              animate="open"
              className="flex-1 overflow-y-auto"
            >
              {items.map(item => renderNavItem(item))}
            </motion.div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Swipe left to close
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile Navigation Toggle Button
interface MobileNavToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const MobileNavToggle: React.FC<MobileNavToggleProps> = ({
  isOpen,
  onToggle,
  className
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        'p-2 lg:hidden',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'active:bg-gray-200 dark:active:bg-gray-700',
        'transition-colors duration-200',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </motion.div>
    </Button>
  );
};

// Mobile Bottom Navigation
interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number;
  active?: boolean;
}

interface MobileBottomNavigationProps {
  items: BottomNavItem[];
  className?: string;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  items,
  className
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-white dark:bg-gray-900',
      'border-t border-gray-200 dark:border-gray-800',
      'px-2 py-1',
      'lg:hidden',
      className
    )}>
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => {
              setActiveItem(item.id);
              item.onClick?.();
            }}
            className={cn(
              'flex flex-col items-center justify-center',
              'p-2 rounded-lg',
              'min-w-[64px] min-h-[48px]',
              'transition-colors duration-200',
              'touch-manipulation',
              item.active 
                ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            )}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 px-1 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center"
                >
                  {item.badge}
                </motion.span>
              )}
            </div>
            <span className="text-xs font-medium mt-1 leading-none">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default {
  EnhancedMobileNavigation,
  MobileNavToggle,
  MobileBottomNavigation
};