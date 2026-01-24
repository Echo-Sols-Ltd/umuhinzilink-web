'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  ShoppingCart,
  MoreHorizontal,
  ChevronRight,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TouchRipple, PullToRefresh } from './mobile-touch-interactions';

// Enhanced Mobile Dashboard Card
interface MobileDashboardCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: React.ReactNode;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

export const MobileDashboardCard: React.FC<MobileDashboardCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'green',
  onClick,
  className,
  loading = false
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      accent: 'bg-green-600'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      accent: 'bg-blue-600'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      accent: 'bg-purple-600'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400',
      accent: 'bg-orange-600'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-600 dark:text-red-400',
      accent: 'bg-red-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <TouchRipple>
      <motion.div
        onClick={onClick}
        className={cn(
          'relative p-4 rounded-xl border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-900',
          'shadow-sm hover:shadow-md',
          'transition-all duration-200',
          'touch-manipulation',
          onClick && 'cursor-pointer',
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center z-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Accent Bar */}
        <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-xl', colors.accent)} />

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {value}
            </p>
            
            {change && (
              <div className="flex items-center space-x-1">
                {change.type === 'increase' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {change.period}
                </span>
              </div>
            )}
          </div>

          <div className={cn(
            'p-3 rounded-lg',
            colors.bg
          )}>
            <div className={colors.icon}>
              {icon}
            </div>
          </div>
        </div>

        {onClick && (
          <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-gray-400" />
        )}
      </motion.div>
    </TouchRipple>
  );
};

// Mobile Dashboard Grid
interface MobileDashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MobileDashboardGrid: React.FC<MobileDashboardGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2'
  };

  return (
    <div className={cn(
      'grid',
      columnClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Mobile Quick Actions
interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'green' | 'blue' | 'purple' | 'orange';
}

interface MobileQuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export const MobileQuickActions: React.FC<MobileQuickActionsProps> = ({
  actions,
  className
}) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700'
  };

  return (
    <div className={cn('flex space-x-3 overflow-x-auto pb-2', className)}>
      {actions.map((action) => (
        <TouchRipple key={action.id}>
          <motion.button
            onClick={action.onClick}
            className={cn(
              'flex flex-col items-center justify-center',
              'min-w-[80px] h-20 px-3 py-2',
              'rounded-xl text-white',
              'touch-manipulation',
              'transition-colors duration-200',
              colorClasses[action.color || 'green']
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="mb-1">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-center leading-tight">
              {action.label}
            </span>
          </motion.button>
        </TouchRipple>
      ))}
    </div>
  );
};

// Mobile Dashboard Header
interface MobileDashboardHeaderProps {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
  onRefresh?: () => Promise<void>;
  className?: string;
}

export const MobileDashboardHeader: React.FC<MobileDashboardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  actions,
  onRefresh,
  className
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-between p-4',
      'bg-white dark:bg-gray-900',
      'border-b border-gray-200 dark:border-gray-700',
      className
    )}>
      <div className="flex items-center space-x-3">
        {avatar && (
          <div className="flex-shrink-0">
            {avatar}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ 
                duration: 1, 
                repeat: isRefreshing ? Infinity : 0, 
                ease: 'linear' 
              }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
};

// Mobile Dashboard Section
interface MobileDashboardSectionProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const MobileDashboardSection: React.FC<MobileDashboardSectionProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      <div 
        className={cn(
          'flex items-center justify-between p-4',
          collapsible && 'cursor-pointer touch-manipulation'
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className="text-green-600 hover:text-green-700"
            >
              {action.label}
            </Button>
          )}
          
          {collapsible && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Dashboard with Pull to Refresh
interface MobileDashboardProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  className?: string;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  children,
  onRefresh,
  className
}) => {
  if (onRefresh) {
    return (
      <PullToRefresh onRefresh={onRefresh} className={cn('min-h-screen', className)}>
        <div className="space-y-4 p-4">
          {children}
        </div>
      </PullToRefresh>
    );
  }

  return (
    <div className={cn('min-h-screen space-y-4 p-4', className)}>
      {children}
    </div>
  );
};

export default {
  MobileDashboardCard,
  MobileDashboardGrid,
  MobileQuickActions,
  MobileDashboardHeader,
  MobileDashboardSection,
  MobileDashboard
};