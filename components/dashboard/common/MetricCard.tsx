'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from '@/lib/icons';
import { MetricCardProps } from '@/types';
import { cn } from '@/lib/utils';

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  trend = true,
  format = 'number' 
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'RWF',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const getTrendIcon = () => {
    if (!trend || change === undefined) return null;
    
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    if (!trend || change === undefined) return '';
    
    switch (changeType) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </p>
        
        {trend && change !== undefined && (
          <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
            <span>
              {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
              {change}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}
