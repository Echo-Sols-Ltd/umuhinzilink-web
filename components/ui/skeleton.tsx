import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        shimmer: 'shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted',
        wave: 'bg-muted animate-pulse',
      },
      size: {
        sm: 'h-4',
        default: 'h-6',
        lg: 'h-8',
        xl: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'shimmer',
      size: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

function Skeleton({ 
  className, 
  variant, 
  size, 
  width, 
  height, 
  style,
  ...props 
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant, size }), className)}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

// Specialized Skeleton Components

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="shimmer"
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      variant="shimmer"
      className={cn('rounded-full', sizeClasses[size], className)}
    />
  );
}

export interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
}

function SkeletonCard({ 
  showAvatar = false, 
  showImage = false, 
  lines = 3, 
  className 
}: SkeletonCardProps) {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      {/* Image */}
      {showImage && (
        <Skeleton variant="shimmer" className="h-48 w-full rounded-lg" />
      )}
      
      {/* Header with avatar */}
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <SkeletonAvatar size="md" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="shimmer" className="h-4 w-1/4" />
            <Skeleton variant="shimmer" className="h-3 w-1/3" />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton variant="shimmer" className="h-6 w-3/4" />
        <SkeletonText lines={lines} />
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="shimmer" className="h-8 w-20" />
        <Skeleton variant="shimmer" className="h-8 w-16" />
      </div>
    </div>
  );
}

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  showHeader = true, 
  className 
}: SkeletonTableProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="shimmer" className="h-4 flex-1" />
          ))}
        </div>
      )}
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="shimmer" 
              className={cn(
                'h-6 flex-1',
                colIndex === 0 && 'w-1/4',
                colIndex === columns - 1 && 'w-1/6'
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface SkeletonListProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

function SkeletonList({ items = 5, showAvatar = true, className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          {showAvatar && <SkeletonAvatar size="sm" />}
          <div className="space-y-2 flex-1">
            <Skeleton variant="shimmer" className="h-4 w-3/4" />
            <Skeleton variant="shimmer" className="h-3 w-1/2" />
          </div>
          <Skeleton variant="shimmer" className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export interface SkeletonDashboardProps {
  className?: string;
}

function SkeletonDashboard({ className }: SkeletonDashboardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton variant="shimmer" className="h-8 w-48" />
        <Skeleton variant="shimmer" className="h-10 w-32" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton variant="shimmer" className="h-4 w-20" />
                <Skeleton variant="shimmer" className="h-8 w-16" />
              </div>
              <Skeleton variant="shimmer" className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton variant="shimmer" className="h-3 w-24" />
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="border rounded-lg p-6">
        <Skeleton variant="shimmer" className="h-6 w-32 mb-4" />
        <Skeleton variant="shimmer" className="h-64 w-full rounded" />
      </div>
      
      {/* Table */}
      <div className="border rounded-lg p-6">
        <Skeleton variant="shimmer" className="h-6 w-40 mb-4" />
        <SkeletonTable rows={6} columns={5} />
      </div>
    </div>
  );
}

export interface SkeletonFormProps {
  fields?: number;
  showSubmit?: boolean;
  className?: string;
}

function SkeletonForm({ fields = 4, showSubmit = true, className }: SkeletonFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="shimmer" className="h-4 w-24" />
          <Skeleton variant="shimmer" className="h-10 w-full rounded-lg" />
        </div>
      ))}
      
      {showSubmit && (
        <div className="flex justify-end space-x-3 pt-4">
          <Skeleton variant="shimmer" className="h-10 w-20 rounded-lg" />
          <Skeleton variant="shimmer" className="h-10 w-24 rounded-lg" />
        </div>
      )}
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  SkeletonDashboard,
  SkeletonForm,
  skeletonVariants,
};
