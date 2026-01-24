'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const enhancedSkeletonVariants = cva(
  'animate-pulse rounded-md bg-muted relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        shimmer: 'bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200px_100%] animate-shimmer',
        wave: 'bg-muted relative overflow-hidden',
        pulse: 'bg-muted animate-pulse',
      },
      size: {
        xs: 'h-3',
        sm: 'h-4',
        default: 'h-6',
        lg: 'h-8',
        xl: 'h-12',
        '2xl': 'h-16',
      },
    },
    defaultVariants: {
      variant: 'shimmer',
      size: 'default',
    },
  }
);

export interface EnhancedSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedSkeletonVariants> {
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
}

function EnhancedSkeleton({ 
  className, 
  variant, 
  size, 
  width, 
  height, 
  aspectRatio,
  style,
  ...props 
}: EnhancedSkeletonProps) {
  return (
    <div
      data-slot="enhanced-skeleton"
      className={cn(enhancedSkeletonVariants({ variant, size }), className)}
      style={{
        width,
        height,
        aspectRatio,
        ...style,
      }}
      {...props}
    >
      {variant === 'wave' && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer-wave bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

// Specialized Enhanced Skeleton Components

export interface SkeletonImageProps {
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | string;
  className?: string;
  showShimmer?: boolean;
}

function SkeletonImage({ aspectRatio = '16:9', className, showShimmer = true }: SkeletonImageProps) {
  return (
    <EnhancedSkeleton
      variant={showShimmer ? 'shimmer' : 'default'}
      aspectRatio={aspectRatio}
      className={cn('w-full rounded-lg', className)}
    />
  );
}

export interface SkeletonProductCardProps {
  showImage?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  showActions?: boolean;
  className?: string;
}

function SkeletonProductCard({ 
  showImage = true, 
  showPrice = true, 
  showRating = true,
  showActions = true,
  className 
}: SkeletonProductCardProps) {
  return (
    <div className={cn('p-4 space-y-4 border rounded-lg bg-card', className)}>
      {/* Product Image */}
      {showImage && (
        <SkeletonImage aspectRatio="4:3" />
      )}
      
      {/* Product Title */}
      <div className="space-y-2">
        <EnhancedSkeleton variant="shimmer" className="h-5 w-3/4" />
        <EnhancedSkeleton variant="shimmer" className="h-4 w-1/2" />
      </div>
      
      {/* Rating */}
      {showRating && (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <EnhancedSkeleton key={i} variant="shimmer" className="h-4 w-4 rounded-sm" />
            ))}
          </div>
          <EnhancedSkeleton variant="shimmer" className="h-4 w-12" />
        </div>
      )}
      
      {/* Price */}
      {showPrice && (
        <div className="flex items-center justify-between">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-20" />
          <EnhancedSkeleton variant="shimmer" className="h-4 w-16" />
        </div>
      )}
      
      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2 pt-2">
          <EnhancedSkeleton variant="shimmer" className="h-9 flex-1 rounded-md" />
          <EnhancedSkeleton variant="shimmer" className="h-9 w-9 rounded-md" />
        </div>
      )}
    </div>
  );
}

export interface SkeletonDashboardMetricProps {
  showIcon?: boolean;
  showTrend?: boolean;
  className?: string;
}

function SkeletonDashboardMetric({ 
  showIcon = true, 
  showTrend = true, 
  className 
}: SkeletonDashboardMetricProps) {
  return (
    <div className={cn('p-6 border rounded-lg bg-card space-y-4', className)}>
      {/* Header with icon */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <EnhancedSkeleton variant="shimmer" className="h-4 w-24" />
          <EnhancedSkeleton variant="shimmer" className="h-8 w-16" />
        </div>
        {showIcon && (
          <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
        )}
      </div>
      
      {/* Trend indicator */}
      {showTrend && (
        <div className="flex items-center space-x-2">
          <EnhancedSkeleton variant="shimmer" className="h-4 w-4 rounded-sm" />
          <EnhancedSkeleton variant="shimmer" className="h-3 w-20" />
        </div>
      )}
    </div>
  );
}

export interface SkeletonSearchResultsProps {
  items?: number;
  showFilters?: boolean;
  className?: string;
}

function SkeletonSearchResults({ 
  items = 6, 
  showFilters = true, 
  className 
}: SkeletonSearchResultsProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Search header */}
      <div className="flex items-center justify-between">
        <EnhancedSkeleton variant="shimmer" className="h-6 w-48" />
        <EnhancedSkeleton variant="shimmer" className="h-10 w-32" />
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <EnhancedSkeleton key={i} variant="shimmer" className="h-8 w-20 rounded-full" />
          ))}
        </div>
      )}
      
      {/* Search results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: items }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </div>
  );
}

export interface SkeletonListItemProps {
  showAvatar?: boolean;
  showActions?: boolean;
  showStatus?: boolean;
  className?: string;
}

function SkeletonListItem({ 
  showAvatar = true, 
  showActions = true,
  showStatus = false,
  className 
}: SkeletonListItemProps) {
  return (
    <div className={cn('flex items-center space-x-4 p-4 border rounded-lg', className)}>
      {/* Avatar */}
      {showAvatar && (
        <EnhancedSkeleton variant="shimmer" className="h-12 w-12 rounded-full" />
      )}
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <EnhancedSkeleton variant="shimmer" className="h-4 w-3/4" />
        <EnhancedSkeleton variant="shimmer" className="h-3 w-1/2" />
        {showStatus && (
          <EnhancedSkeleton variant="shimmer" className="h-3 w-16 rounded-full" />
        )}
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-md" />
          <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-md" />
        </div>
      )}
    </div>
  );
}

export interface SkeletonProgressBarProps {
  showPercentage?: boolean;
  showLabel?: boolean;
  className?: string;
}

function SkeletonProgressBar({ 
  showPercentage = true, 
  showLabel = true,
  className 
}: SkeletonProgressBarProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Label and percentage */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center">
          {showLabel && (
            <EnhancedSkeleton variant="shimmer" className="h-4 w-24" />
          )}
          {showPercentage && (
            <EnhancedSkeleton variant="shimmer" className="h-4 w-12" />
          )}
        </div>
      )}
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <EnhancedSkeleton 
          variant="shimmer" 
          className="h-full w-3/4 rounded-full bg-primary/20" 
        />
      </div>
    </div>
  );
}

export interface SkeletonChartProps {
  type?: 'line' | 'bar' | 'pie' | 'area';
  showLegend?: boolean;
  className?: string;
}

function SkeletonChart({ 
  type = 'line', 
  showLegend = true, 
  className 
}: SkeletonChartProps) {
  return (
    <div className={cn('p-6 border rounded-lg bg-card space-y-4', className)}>
      {/* Chart title */}
      <div className="flex justify-between items-center">
        <EnhancedSkeleton variant="shimmer" className="h-6 w-40" />
        <EnhancedSkeleton variant="shimmer" className="h-8 w-24 rounded-md" />
      </div>
      
      {/* Chart area */}
      <div className="relative">
        {type === 'pie' ? (
          <div className="flex justify-center">
            <EnhancedSkeleton variant="shimmer" className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <EnhancedSkeleton variant="shimmer" className="h-64 w-full rounded-lg" />
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <EnhancedSkeleton variant="shimmer" className="h-3 w-3 rounded-full" />
              <EnhancedSkeleton variant="shimmer" className="h-3 w-16" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface SkeletonPageTransitionProps {
  className?: string;
}

function SkeletonPageTransition({ className }: SkeletonPageTransitionProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header */}
      <div className="border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <EnhancedSkeleton variant="shimmer" className="h-8 w-32" />
          <div className="flex space-x-4">
            <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-full" />
            <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <EnhancedSkeleton variant="shimmer" className="h-12 w-64" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <EnhancedSkeleton variant="shimmer" className="h-6 w-48" />
                <div className="space-y-2">
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-full" />
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-3/4" />
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <EnhancedSkeleton variant="shimmer" className="h-5 w-32" />
                <EnhancedSkeleton variant="shimmer" className="h-32 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  EnhancedSkeleton,
  SkeletonImage,
  SkeletonProductCard,
  SkeletonDashboardMetric,
  SkeletonSearchResults,
  SkeletonListItem,
  SkeletonProgressBar,
  SkeletonChart,
  SkeletonPageTransition,
  enhancedSkeletonVariants,
};