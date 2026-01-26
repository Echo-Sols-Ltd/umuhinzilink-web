'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Leaf,
  Tractor,
  Store,
  Building2,
  Globe,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  variant?: 'default' | 'gradient' | 'minimal' | 'featured';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const iconMap = {
  revenue: DollarSign,
  orders: ShoppingCart,
  products: Package,
  users: Users,
  pending: Clock,
  completed: CheckCircle,
  warning: AlertTriangle,
  analytics: BarChart3,
  farming: Leaf,
  tractor: Tractor,
  store: Store,
  building: Building2,
  globe: Globe,
  activity: Activity,
};

export function EnhancedMetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  trend = 'neutral',
  loading = false,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (trend === 'up' || changeType === 'increase') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    if (trend === 'down' || changeType === 'decrease') {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600';
    if (changeType === 'decrease') return 'text-red-600';
    return 'text-gray-600';
  };

  const cardVariants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    gradient: 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md',
    minimal: 'bg-gray-50 border-0 shadow-none hover:bg-gray-100',
    featured: 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl',
  };

  const sizeVariants = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const iconSizeVariants = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const valueSizeVariants = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  if (loading) {
    return (
      <div className={cn(
        'rounded-xl transition-all duration-200',
        cardVariants[variant],
        sizeVariants[size],
        className
      )}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className={cn('bg-gray-200 rounded-full', iconSizeVariants[size])}></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl transition-all duration-200 cursor-pointer',
        cardVariants[variant],
        sizeVariants[size],
        onClick && 'hover:cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium mb-1',
            variant === 'featured' ? 'text-green-100' : 'text-gray-600'
          )}>
            {title}
          </p>
          <div className="flex items-center space-x-2">
            <p className={cn(
              'font-bold',
              valueSizeVariants[size],
              variant === 'featured' ? 'text-white' : 'text-gray-900'
            )}>
              {formatValue(value)}
            </p>
            {getTrendIcon()}
          </div>
        </div>
        
        {icon && (
          <div className={cn(
            'rounded-full flex items-center justify-center flex-shrink-0',
            iconSizeVariants[size],
            variant === 'featured' 
              ? 'bg-white/20 text-white' 
              : variant === 'gradient'
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600'
          )}>
            {icon}
          </div>
        )}
      </div>

      {(description || change !== undefined) && (
        <div className="space-y-1">
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <span className={cn('text-sm font-medium', getChangeColor())}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className={cn(
                'text-xs',
                variant === 'featured' ? 'text-green-100' : 'text-gray-500'
              )}>
                vs last period
              </span>
            </div>
          )}
          {description && (
            <p className={cn(
              'text-xs',
              variant === 'featured' ? 'text-green-100' : 'text-gray-500'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export interface MetricGridProps {
  metrics: MetricCardProps[];
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  loading?: boolean;
}

export function MetricGrid({ 
  metrics, 
  columns = 4, 
  className,
  loading = false 
}: MetricGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {loading ? (
        Array.from({ length: columns }).map((_, index) => (
          <EnhancedMetricCard
            key={index}
            title=""
            value=""
            loading={true}
          />
        ))
      ) : (
        metrics.map((metric, index) => (
          <EnhancedMetricCard
            key={index}
            {...metric}
          />
        ))
      )}
    </div>
  );
}

// Predefined metric card configurations for different user roles
export const farmerMetrics = {
  totalRevenue: (value: number, change?: number): MetricCardProps => ({
    title: 'Total Revenue',
    value: `RWF ${value.toLocaleString()}`,
    change,
    changeType: change && change > 0 ? 'increase' : change && change < 0 ? 'decrease' : 'neutral',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'All-time earnings',
    variant: 'featured',
  }),
  
  activeProducts: (value: number, total: number): MetricCardProps => ({
    title: 'Active Products',
    value,
    icon: <Package className="w-6 h-6" />,
    description: `${total} total listings`,
    variant: 'gradient',
  }),
  
  totalOrders: (value: number, pending: number): MetricCardProps => ({
    title: 'Total Orders',
    value,
    icon: <ShoppingCart className="w-6 h-6" />,
    description: `${pending} pending`,
  }),
  
  customers: (value: number): MetricCardProps => ({
    title: 'Customers',
    value,
    icon: <Users className="w-6 h-6" />,
    description: 'Unique buyers',
  }),
};

export const buyerMetrics = {
  totalSpent: (value: number, change?: number): MetricCardProps => ({
    title: 'Total Spent',
    value: `RWF ${value.toLocaleString()}`,
    change,
    changeType: change && change > 0 ? 'increase' : change && change < 0 ? 'decrease' : 'neutral',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'All purchases',
    variant: 'featured',
  }),
  
  totalOrders: (value: number, completed: number): MetricCardProps => ({
    title: 'Total Orders',
    value,
    icon: <ShoppingCart className="w-6 h-6" />,
    description: `${completed} completed`,
    variant: 'gradient',
  }),
  
  savedProducts: (value: number): MetricCardProps => ({
    title: 'Saved Products',
    value,
    icon: <Package className="w-6 h-6" />,
    description: 'Wishlist items',
  }),
  
  suppliers: (value: number): MetricCardProps => ({
    title: 'Suppliers',
    value,
    icon: <Store className="w-6 h-6" />,
    description: 'Connected sellers',
  }),
};

export const supplierMetrics = {
  totalRevenue: (value: number, change?: number): MetricCardProps => ({
    title: 'Total Revenue',
    value: `RWF ${value.toLocaleString()}`,
    change,
    changeType: change && change > 0 ? 'increase' : change && change < 0 ? 'decrease' : 'neutral',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'All-time earnings',
    variant: 'featured',
  }),
  
  inventory: (value: number, lowStock: number): MetricCardProps => ({
    title: 'Inventory Items',
    value,
    icon: <Package className="w-6 h-6" />,
    description: `${lowStock} low stock`,
    variant: 'gradient',
  }),
  
  orders: (value: number, pending: number): MetricCardProps => ({
    title: 'Orders',
    value,
    icon: <ShoppingCart className="w-6 h-6" />,
    description: `${pending} pending`,
  }),
  
  customers: (value: number): MetricCardProps => ({
    title: 'Customers',
    value,
    icon: <Users className="w-6 h-6" />,
    description: 'Active buyers',
  }),
};

export const adminMetrics = {
  totalUsers: (value: number, change?: number): MetricCardProps => ({
    title: 'Total Users',
    value,
    change,
    changeType: change && change > 0 ? 'increase' : change && change < 0 ? 'decrease' : 'neutral',
    icon: <Users className="w-6 h-6" />,
    description: 'Platform users',
    variant: 'featured',
  }),
  
  totalProducts: (value: number, active: number): MetricCardProps => ({
    title: 'Total Products',
    value,
    icon: <Package className="w-6 h-6" />,
    description: `${active} active`,
    variant: 'gradient',
  }),
  
  totalOrders: (value: number, completed: number): MetricCardProps => ({
    title: 'Total Orders',
    value,
    icon: <ShoppingCart className="w-6 h-6" />,
    description: `${completed} completed`,
  }),
  
  revenue: (value: number): MetricCardProps => ({
    title: 'Platform Revenue',
    value: `RWF ${value.toLocaleString()}`,
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Total transactions',
  }),
};

export const governmentMetrics = {
  totalUsers: (value: number, change?: number): MetricCardProps => ({
    title: 'Total Users',
    value,
    change,
    changeType: change && change > 0 ? 'increase' : change && change < 0 ? 'decrease' : 'neutral',
    icon: <Users className="w-6 h-6" />,
    description: 'Platform participants',
    variant: 'featured',
  }),
  
  farmersCount: (value: number): MetricCardProps => ({
    title: 'Farmers',
    value,
    icon: <Tractor className="w-6 h-6" />,
    description: 'Registered farmers',
    variant: 'gradient',
  }),
  
  suppliersCount: (value: number): MetricCardProps => ({
    title: 'Suppliers',
    value,
    icon: <Building2 className="w-6 h-6" />,
    description: 'Input suppliers',
  }),
  
  marketActivity: (value: number): MetricCardProps => ({
    title: 'Market Activity',
    value,
    icon: <Activity className="w-6 h-6" />,
    description: 'Active transactions',
  }),
};