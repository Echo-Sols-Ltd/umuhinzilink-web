'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  ShoppingBag,
  DollarSign,
  Users,
  Calendar,
  Award,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

export interface PerformanceMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description?: string;
}

export interface FarmerPerformanceMetricsProps {
  metrics: {
    rating: number;
    totalSales: number;
    completedOrders: number;
    responseTime: number; // in hours
    monthlyRevenue?: number;
    customerSatisfaction?: number;
    repeatCustomers?: number;
    averageOrderValue?: number;
    onTimeDelivery?: number;
    productViews?: number;
  };
  period?: 'week' | 'month' | 'quarter' | 'year';
  showTrends?: boolean;
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}

export const FarmerPerformanceMetrics = React.forwardRef<HTMLDivElement, FarmerPerformanceMetricsProps>(
  ({ 
    metrics, 
    period = 'month',
    showTrends = true,
    variant = 'grid',
    className,
    ...props 
  }, ref) => {
    const {
      rating,
      totalSales,
      completedOrders,
      responseTime,
      monthlyRevenue = 0,
      customerSatisfaction = 0,
      repeatCustomers = 0,
      averageOrderValue = 0,
      onTimeDelivery = 0,
      productViews = 0
    } = metrics;

    // Calculate performance metrics with trends
    const performanceMetrics: PerformanceMetric[] = [
      {
        label: 'Overall Rating',
        value: rating.toFixed(1),
        change: showTrends ? 0.2 : undefined,
        trend: 'up',
        icon: <Star className="w-5 h-5" />,
        color: 'text-harvest-gold',
        bgColor: 'bg-harvest-gold/10',
        description: 'Average customer rating'
      },
      {
        label: 'Total Sales',
        value: `${totalSales.toLocaleString()} RWF`,
        change: showTrends ? 15.3 : undefined,
        trend: 'up',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'text-agricultural-primary',
        bgColor: 'bg-agricultural-primary/10',
        description: 'Total revenue generated'
      },
      {
        label: 'Completed Orders',
        value: completedOrders,
        change: showTrends ? 8.7 : undefined,
        trend: 'up',
        icon: <ShoppingBag className="w-5 h-5" />,
        color: 'text-sky-blue',
        bgColor: 'bg-sky-blue/10',
        description: 'Successfully completed orders'
      },
      {
        label: 'Response Time',
        value: `${responseTime}h`,
        change: showTrends ? -12.5 : undefined,
        trend: 'up', // Lower response time is better
        icon: <Clock className="w-5 h-5" />,
        color: 'text-earth-ochre',
        bgColor: 'bg-earth-ochre/10',
        description: 'Average response time to inquiries'
      },
      {
        label: 'Monthly Revenue',
        value: `${monthlyRevenue.toLocaleString()} RWF`,
        change: showTrends ? 22.1 : undefined,
        trend: 'up',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-growth-success',
        bgColor: 'bg-growth-success/10',
        description: 'Revenue for current month'
      },
      {
        label: 'Customer Satisfaction',
        value: `${customerSatisfaction}%`,
        change: showTrends ? 5.2 : undefined,
        trend: 'up',
        icon: <Users className="w-5 h-5" />,
        color: 'text-sunrise-orange',
        bgColor: 'bg-sunrise-orange/10',
        description: 'Customer satisfaction rate'
      },
      {
        label: 'Repeat Customers',
        value: `${repeatCustomers}%`,
        change: showTrends ? 18.9 : undefined,
        trend: 'up',
        icon: <Target className="w-5 h-5" />,
        color: 'text-soil-rich',
        bgColor: 'bg-soil-rich/10',
        description: 'Percentage of returning customers'
      },
      {
        label: 'Avg Order Value',
        value: `${averageOrderValue.toLocaleString()} RWF`,
        change: showTrends ? -3.1 : undefined,
        trend: 'down',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'text-earth-clay',
        bgColor: 'bg-earth-clay/10',
        description: 'Average value per order'
      },
      {
        label: 'On-Time Delivery',
        value: `${onTimeDelivery}%`,
        change: showTrends ? 7.8 : undefined,
        trend: 'up',
        icon: <Calendar className="w-5 h-5" />,
        color: 'text-agricultural-primary-light',
        bgColor: 'bg-agricultural-primary-light/10',
        description: 'Percentage of on-time deliveries'
      },
      {
        label: 'Product Views',
        value: productViews.toLocaleString(),
        change: showTrends ? 31.4 : undefined,
        trend: 'up',
        icon: <Activity className="w-5 h-5" />,
        color: 'text-sky-blue',
        bgColor: 'bg-sky-blue/10',
        description: 'Total product page views'
      }
    ];

    // Filter out metrics with zero values for cleaner display
    const displayMetrics = performanceMetrics.filter(metric => {
      if (typeof metric.value === 'string') {
        return !metric.value.startsWith('0 ') && metric.value !== '0%';
      }
      return metric.value !== 0;
    });

    const renderTrendIndicator = (change?: number, trend?: 'up' | 'down' | 'neutral') => {
      if (!change || !trend) return null;

      const isPositive = trend === 'up';
      const TrendIcon = isPositive ? TrendingUp : TrendingDown;
      
      return (
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium',
          isPositive ? 'text-growth-success' : 'text-alert-red'
        )}>
          <TrendIcon className="w-3 h-3" />
          <span>{Math.abs(change)}%</span>
        </div>
      );
    };

    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {displayMetrics.slice(0, 4).map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-full', metric.bgColor)}>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
                <div>
                  <p className="font-medium">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </div>
              {renderTrendIndicator(metric.change, metric.trend)}
            </div>
          ))}
        </div>
      );
    }

    if (variant === 'list') {
      return (
        <Card ref={ref} className={cn('agricultural-card', className)} {...props}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-agricultural-primary" />
              Performance Metrics
              <Badge variant="secondary" size="sm" className="ml-auto">
                {period}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('p-3 rounded-full', metric.bgColor)}>
                      <div className={metric.color}>
                        {metric.icon}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      {metric.description && (
                        <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                      )}
                    </div>
                  </div>
                  {renderTrendIndicator(metric.change, metric.trend)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    // Default grid variant
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-agricultural-primary" />
            Performance Metrics
          </h2>
          <Badge variant="secondary" className="bg-agricultural-primary/10 text-agricultural-primary">
            {period.charAt(0).toUpperCase() + period.slice(1)}ly
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayMetrics.map((metric, index) => (
            <Card
              key={index}
              className="agricultural-card hover:shadow-agricultural-md transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('p-3 rounded-full', metric.bgColor)}>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                  {renderTrendIndicator(metric.change, metric.trend)}
                </div>
                
                <div>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{metric.label}</p>
                  {metric.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
);

FarmerPerformanceMetrics.displayName = 'FarmerPerformanceMetrics';