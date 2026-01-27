'use client';

import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function EnhancedSkeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const { isSlowConnection } = useNetworkStatus();

  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  // Reduce animation on slow connections to save battery
  const effectiveAnimation = isSlowConnection ? 'pulse' : animation;

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[effectiveAnimation]} ${className}`}
      style={style}
    />
  );
}

interface ProductCardSkeletonProps {
  showImage?: boolean;
  showPrice?: boolean;
  showFarmer?: boolean;
  className?: string;
}

export function ProductCardSkeleton({
  showImage = true,
  showPrice = true,
  showFarmer = true,
  className = '',
}: ProductCardSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      {showImage && (
        <EnhancedSkeleton
          variant="rounded"
          className="w-full h-48 mb-4"
        />
      )}
      
      <div className="space-y-3">
        {/* Product name */}
        <EnhancedSkeleton
          variant="text"
          className="h-5 w-3/4"
        />
        
        {/* Product description */}
        <div className="space-y-2">
          <EnhancedSkeleton variant="text" className="h-3 w-full" />
          <EnhancedSkeleton variant="text" className="h-3 w-2/3" />
        </div>
        
        {showPrice && (
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="text" className="h-6 w-20" />
            <EnhancedSkeleton variant="text" className="h-4 w-16" />
          </div>
        )}
        
        {showFarmer && (
          <div className="flex items-center space-x-2 pt-2 border-t">
            <EnhancedSkeleton variant="circular" width={32} height={32} />
            <div className="flex-1">
              <EnhancedSkeleton variant="text" className="h-3 w-24 mb-1" />
              <EnhancedSkeleton variant="text" className="h-2 w-16" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FarmerProfileSkeletonProps {
  showAvatar?: boolean;
  showStats?: boolean;
  className?: string;
}

export function FarmerProfileSkeleton({
  showAvatar = true,
  showStats = true,
  className = '',
}: FarmerProfileSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <EnhancedSkeleton variant="circular" width={80} height={80} />
        )}
        
        <div className="flex-1 space-y-3">
          <EnhancedSkeleton variant="text" className="h-6 w-48" />
          <EnhancedSkeleton variant="text" className="h-4 w-32" />
          <EnhancedSkeleton variant="text" className="h-3 w-64" />
          
          {showStats && (
            <div className="grid grid-cols-3 gap-4 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <EnhancedSkeleton variant="text" className="h-6 w-12 mx-auto mb-1" />
                  <EnhancedSkeleton variant="text" className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DashboardSkeletonProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  showMetrics?: boolean;
  showChart?: boolean;
  className?: string;
}

export function DashboardSkeleton({
  showHeader = true,
  showSidebar = true,
  showMetrics = true,
  showChart = true,
  className = '',
}: DashboardSkeletonProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showHeader && (
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <EnhancedSkeleton variant="text" className="h-8 w-48" />
            <div className="flex items-center space-x-4">
              <EnhancedSkeleton variant="circular" width={40} height={40} />
              <EnhancedSkeleton variant="text" className="h-4 w-24" />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex">
        {showSidebar && (
          <div className="w-64 bg-white border-r p-4">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <EnhancedSkeleton variant="rectangular" width={20} height={20} />
                  <EnhancedSkeleton variant="text" className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex-1 p-6">
          {showMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <EnhancedSkeleton variant="text" className="h-4 w-20 mb-2" />
                      <EnhancedSkeleton variant="text" className="h-8 w-16" />
                    </div>
                    <EnhancedSkeleton variant="circular" width={48} height={48} />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showChart && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <EnhancedSkeleton variant="text" className="h-6 w-32 mb-6" />
              <EnhancedSkeleton variant="rounded" className="w-full h-80" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ListSkeleton({
  items = 5,
  showAvatar = true,
  showActions = true,
  className = '',
}: ListSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4">
            {showAvatar && (
              <EnhancedSkeleton variant="circular" width={48} height={48} />
            )}
            
            <div className="flex-1 space-y-2">
              <EnhancedSkeleton variant="text" className="h-4 w-3/4" />
              <EnhancedSkeleton variant="text" className="h-3 w-1/2" />
            </div>
            
            {showActions && (
              <div className="flex space-x-2">
                <EnhancedSkeleton variant="rounded" width={80} height={32} />
                <EnhancedSkeleton variant="rounded" width={80} height={32} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
}: TableSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
      {showHeader && (
        <div className="border-b p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <EnhancedSkeleton key={index} variant="text" className="h-4 w-20" />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <EnhancedSkeleton key={colIndex} variant="text" className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add shimmer animation to global CSS
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }
`;