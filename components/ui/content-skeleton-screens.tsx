'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { EnhancedSkeleton, SkeletonImage } from './enhanced-skeleton';

// ===== DASHBOARD SKELETON SCREENS =====

interface CompleteDashboardSkeletonProps {
  variant?: 'farmer' | 'buyer' | 'supplier' | 'admin' | 'government';
  className?: string;
}

function CompleteDashboardSkeleton({ variant = 'farmer', className }: CompleteDashboardSkeletonProps) {
  const renderFarmerDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg bg-card space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-4 w-24" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-16" />
              </div>
              <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
            </div>
            <EnhancedSkeleton variant="shimmer" className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-32 mb-4" />
          <EnhancedSkeleton variant="shimmer" className="h-64 w-full rounded-lg" />
        </div>

        {/* Recent Orders */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-28 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-3/4" />
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-1/2" />
                </div>
                <EnhancedSkeleton variant="shimmer" className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="border rounded-lg p-6 bg-card">
        <EnhancedSkeleton variant="shimmer" className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <SkeletonImage aspectRatio="4:3" />
              <EnhancedSkeleton variant="shimmer" className="h-4 w-3/4" />
              <div className="flex justify-between items-center">
                <EnhancedSkeleton variant="shimmer" className="h-5 w-16" />
                <EnhancedSkeleton variant="shimmer" className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderBuyerDashboard = () => (
    <>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <EnhancedSkeleton variant="shimmer" className="h-12 w-full rounded-lg" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EnhancedSkeleton key={i} variant="shimmer" className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-8">
        <EnhancedSkeleton variant="shimmer" className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-card space-y-4">
              <SkeletonImage aspectRatio="4:3" />
              <div className="space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-5 w-3/4" />
                <EnhancedSkeleton variant="shimmer" className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between items-center">
                <EnhancedSkeleton variant="shimmer" className="h-6 w-20" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <EnhancedSkeleton variant="shimmer" className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center space-y-3">
              <EnhancedSkeleton variant="shimmer" className="h-16 w-16 rounded-full mx-auto" />
              <EnhancedSkeleton variant="shimmer" className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border rounded-lg p-6 bg-card">
        <EnhancedSkeleton variant="shimmer" className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <SkeletonImage aspectRatio="1:1" className="w-16 h-16" />
              <div className="flex-1 space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-4 w-3/4" />
                <EnhancedSkeleton variant="shimmer" className="h-3 w-1/2" />
                <EnhancedSkeleton variant="shimmer" className="h-3 w-1/3" />
              </div>
              <div className="text-right space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-5 w-16" />
                <EnhancedSkeleton variant="shimmer" className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderSupplierDashboard = () => (
    <>
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg bg-card space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-4 w-28" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-20" />
              </div>
              <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
            </div>
            <EnhancedSkeleton variant="shimmer" className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Inventory Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Stock Levels */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-md" />
                  <div className="space-y-1">
                    <EnhancedSkeleton variant="shimmer" className="h-4 w-24" />
                    <EnhancedSkeleton variant="shimmer" className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-12" />
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-36 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-3/4" />
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-1/2" />
                </div>
                <EnhancedSkeleton variant="shimmer" className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supply Chain Analytics */}
      <div className="border rounded-lg p-6 bg-card">
        <EnhancedSkeleton variant="shimmer" className="h-6 w-44 mb-4" />
        <EnhancedSkeleton variant="shimmer" className="h-64 w-full rounded-lg" />
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg bg-card space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-4 w-20" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-16" />
              </div>
              <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex items-center space-x-2">
              <EnhancedSkeleton variant="shimmer" className="h-3 w-3 rounded-full" />
              <EnhancedSkeleton variant="shimmer" className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics and User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Platform Analytics */}
        <div className="lg:col-span-2 border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-36 mb-4" />
          <EnhancedSkeleton variant="shimmer" className="h-64 w-full rounded-lg" />
        </div>

        {/* Recent Activity */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-full" />
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-2/3" />
                  <EnhancedSkeleton variant="shimmer" className="h-2 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex justify-between items-center mb-4">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-32" />
          <EnhancedSkeleton variant="shimmer" className="h-8 w-24 rounded-md" />
        </div>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-2 border-b">
            {Array.from({ length: 5 }).map((_, i) => (
              <EnhancedSkeleton key={i} variant="shimmer" className="h-4 w-full" />
            ))}
          </div>
          {/* Table Rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 py-2">
              <div className="flex items-center space-x-2">
                <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-full" />
                <EnhancedSkeleton variant="shimmer" className="h-4 w-20" />
              </div>
              <EnhancedSkeleton variant="shimmer" className="h-4 w-full" />
              <EnhancedSkeleton variant="shimmer" className="h-4 w-16" />
              <EnhancedSkeleton variant="shimmer" className="h-6 w-20 rounded-full" />
              <EnhancedSkeleton variant="shimmer" className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderGovernmentDashboard = () => (
    <>
      {/* Policy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg bg-card space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-4 w-32" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-20" />
              </div>
              <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
            </div>
            <EnhancedSkeleton variant="shimmer" className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Regional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Market Trends */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-32 mb-4" />
          <EnhancedSkeleton variant="shimmer" className="h-64 w-full rounded-lg" />
        </div>

        {/* Regional Distribution */}
        <div className="border rounded-lg p-6 bg-card">
          <EnhancedSkeleton variant="shimmer" className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <EnhancedSkeleton variant="shimmer" className="h-6 w-6 rounded-full" />
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <EnhancedSkeleton variant="shimmer" className="h-2 w-20 rounded-full" />
                  <EnhancedSkeleton variant="shimmer" className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Impact Reports */}
      <div className="border rounded-lg p-6 bg-card">
        <EnhancedSkeleton variant="shimmer" className="h-6 w-44 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <EnhancedSkeleton variant="shimmer" className="h-5 w-3/4" />
              <EnhancedSkeleton variant="shimmer" className="h-16 w-full rounded-md" />
              <div className="flex justify-between items-center">
                <EnhancedSkeleton variant="shimmer" className="h-4 w-16" />
                <EnhancedSkeleton variant="shimmer" className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'farmer': return renderFarmerDashboard();
      case 'buyer': return renderBuyerDashboard();
      case 'supplier': return renderSupplierDashboard();
      case 'admin': return renderAdminDashboard();
      case 'government': return renderGovernmentDashboard();
      default: return renderFarmerDashboard();
    }
  };

  return (
    <div className={cn('space-y-8 animate-fade-in', className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <EnhancedSkeleton variant="shimmer" className="h-8 w-48" />
          <EnhancedSkeleton variant="shimmer" className="h-4 w-32" />
        </div>
        <div className="flex space-x-3">
          <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
          <EnhancedSkeleton variant="shimmer" className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {renderVariant()}
    </div>
  );
}

// ===== PRODUCT LISTING SKELETON =====

interface ProductListingSkeletonProps {
  layout?: 'grid' | 'list';
  itemCount?: number;
  showFilters?: boolean;
  className?: string;
}

function ProductListingSkeleton({
  layout = 'grid',
  itemCount = 12,
  showFilters = true,
  className
}: ProductListingSkeletonProps) {
  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <EnhancedSkeleton variant="shimmer" className="h-8 w-48" />
          <EnhancedSkeleton variant="shimmer" className="h-4 w-32" />
        </div>
        <div className="flex space-x-3">
          <EnhancedSkeleton variant="shimmer" className="h-10 w-32 rounded-md" />
          <EnhancedSkeleton variant="shimmer" className="h-10 w-24 rounded-md" />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 pb-4 border-b">
          {Array.from({ length: 8 }).map((_, i) => (
            <EnhancedSkeleton key={i} variant="shimmer" className="h-8 w-20 rounded-full" />
          ))}
        </div>
      )}

      {/* Products */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-card space-y-4">
              <SkeletonImage aspectRatio="4:3" />
              <div className="space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-5 w-3/4" />
                <EnhancedSkeleton variant="shimmer" className="h-4 w-1/2" />
              </div>
              <div className="flex items-center space-x-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <EnhancedSkeleton key={j} variant="shimmer" className="h-4 w-4 rounded-sm" />
                ))}
                <EnhancedSkeleton variant="shimmer" className="h-4 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <EnhancedSkeleton variant="shimmer" className="h-6 w-20" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg bg-card">
              <SkeletonImage aspectRatio="1:1" className="w-20 h-20" />
              <div className="flex-1 space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-5 w-3/4" />
                <EnhancedSkeleton variant="shimmer" className="h-4 w-1/2" />
                <div className="flex items-center space-x-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <EnhancedSkeleton key={j} variant="shimmer" className="h-3 w-3 rounded-sm" />
                  ))}
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-10" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <EnhancedSkeleton variant="shimmer" className="h-6 w-20" />
                <EnhancedSkeleton variant="shimmer" className="h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== MESSAGE/CHAT SKELETON =====

interface MessageSkeletonProps {
  messageCount?: number;
  showHeader?: boolean;
  className?: string;
}

function MessageSkeleton({
  messageCount = 8,
  showHeader = true,
  className
}: MessageSkeletonProps) {
  return (
    <div className={cn('space-y-4 animate-fade-in', className)}>
      {/* Chat Header */}
      {showHeader && (
        <div className="flex items-center space-x-3 p-4 border-b">
          <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <EnhancedSkeleton variant="shimmer" className="h-4 w-32" />
            <EnhancedSkeleton variant="shimmer" className="h-3 w-20" />
          </div>
          <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-full" />
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4 p-4">
        {Array.from({ length: messageCount }).map((_, i) => {
          const isOwnMessage = i % 3 === 0;
          return (
            <div key={i} className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'flex space-x-2 max-w-xs lg:max-w-md',
                isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              )}>
                {!isOwnMessage && (
                  <EnhancedSkeleton variant="shimmer" className="h-8 w-8 rounded-full flex-shrink-0" />
                )}
                <div className={cn(
                  'p-3 rounded-lg space-y-2',
                  isOwnMessage ? 'bg-primary/10' : 'bg-muted'
                )}>
                  <EnhancedSkeleton 
                    variant="shimmer" 
                    className={cn(
                      'h-4',
                      i % 4 === 0 ? 'w-32' : i % 4 === 1 ? 'w-24' : i % 4 === 2 ? 'w-40' : 'w-28'
                    )} 
                  />
                  {i % 5 === 0 && (
                    <EnhancedSkeleton variant="shimmer" className="h-4 w-20" />
                  )}
                  <EnhancedSkeleton variant="shimmer" className="h-3 w-16" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <EnhancedSkeleton variant="shimmer" className="h-10 flex-1 rounded-lg" />
          <EnhancedSkeleton variant="shimmer" className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export {
  CompleteDashboardSkeleton,
  ProductListingSkeleton,
  MessageSkeleton
};