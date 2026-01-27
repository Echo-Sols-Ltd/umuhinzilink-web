'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { EnhancedSkeleton } from './enhanced-skeleton';
import { LoadingSpinner } from './loading-states';

interface BandwidthAwareComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  lowBandwidthFallback?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  defer?: boolean;
  className?: string;
}

export function BandwidthAwareComponent({
  children,
  fallback,
  lowBandwidthFallback,
  priority = 'medium',
  defer = false,
  className = '',
}: BandwidthAwareComponentProps) {
  const { isSlowConnection, effectiveType, isOnline } = useNetworkStatus();
  const [shouldLoad, setShouldLoad] = useState(!defer);
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  // Intersection observer for deferred loading
  useEffect(() => {
    if (!defer || !ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: isSlowConnection ? '100px' : '50px', // Load earlier on slow connections
      }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, defer, isSlowConnection]);

  // Priority-based loading decisions
  const shouldLoadComponent = () => {
    if (!isOnline) return false;
    if (!shouldLoad) return false;

    switch (priority) {
      case 'high':
        return true; // Always load high priority components
      case 'medium':
        return !isSlowConnection || effectiveType !== 'slow-2g';
      case 'low':
        return effectiveType === '4g' || effectiveType === 'fast';
      default:
        return true;
    }
  };

  const renderContent = () => {
    if (!shouldLoadComponent()) {
      if (lowBandwidthFallback) {
        return lowBandwidthFallback;
      }
      
      // Default low bandwidth fallback based on priority
      switch (priority) {
        case 'low':
          return (
            <div className="text-center py-4 text-gray-500 text-sm">
              Feature disabled for slow connections
            </div>
          );
        default:
          return fallback || <EnhancedSkeleton variant="rounded" className="w-full h-32" />;
      }
    }

    return children;
  };

  if (defer && !isVisible) {
    return (
      <div ref={setRef} className={className}>
        {fallback || <EnhancedSkeleton variant="rounded" className="w-full h-32" />}
      </div>
    );
  }

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
}

interface LazyChartProps {
  chartType: 'line' | 'bar' | 'pie' | 'area';
  data: any;
  options?: any;
  className?: string;
}

export function LazyChart({ chartType, data, options, className = '' }: LazyChartProps) {
  const { isSlowConnection } = useNetworkStatus();
  
  // Lazy load chart components
  const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
  const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
  const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
  const AreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));

  const chartComponents = {
    line: LineChart,
    bar: BarChart,
    pie: PieChart,
    area: AreaChart,
  };

  const ChartComponent = chartComponents[chartType];

  // Simplified chart for slow connections
  if (isSlowConnection) {
    return (
      <div className={`bg-white border rounded-lg p-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">📊</div>
          <p className="text-sm text-gray-600">Chart data available</p>
          <p className="text-xs text-gray-500 mt-1">
            Simplified view for slow connections
          </p>
        </div>
      </div>
    );
  }

  return (
    <BandwidthAwareComponent
      priority="low"
      defer
      fallback={<EnhancedSkeleton variant="rounded" className="w-full h-64" />}
      className={className}
    >
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <ChartComponent data={data} {...options} />
      </Suspense>
    </BandwidthAwareComponent>
  );
}

interface ProgressiveFeatureProps {
  feature: 'messaging' | 'analytics' | 'maps' | 'video' | 'notifications';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function ProgressiveFeature({
  feature,
  children,
  fallback,
  className = '',
}: ProgressiveFeatureProps) {
  const { isSlowConnection, effectiveType, isOnline } = useNetworkStatus();

  // Feature priority mapping
  const featurePriority = {
    messaging: 'high',
    analytics: 'medium',
    maps: 'low',
    video: 'low',
    notifications: 'high',
  } as const;

  // Feature-specific fallbacks
  const getFeatureFallback = () => {
    if (fallback) return fallback;

    const fallbacks = {
      messaging: (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 text-sm">💬 Messaging available</p>
          <p className="text-blue-600 text-xs mt-1">Tap to load full interface</p>
        </div>
      ),
      analytics: (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-700 text-sm">📈 Analytics data ready</p>
          <p className="text-green-600 text-xs mt-1">Loading optimized for your connection</p>
        </div>
      ),
      maps: (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-700 text-sm">🗺️ Location services</p>
          <p className="text-gray-600 text-xs mt-1">Maps disabled for slow connections</p>
        </div>
      ),
      video: (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-purple-700 text-sm">🎥 Video content available</p>
          <p className="text-purple-600 text-xs mt-1">Disabled to save bandwidth</p>
        </div>
      ),
      notifications: (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-700 text-sm">🔔 Notifications active</p>
          <p className="text-yellow-600 text-xs mt-1">Basic notifications enabled</p>
        </div>
      ),
    };

    return fallbacks[feature];
  };

  return (
    <BandwidthAwareComponent
      priority={featurePriority[feature]}
      lowBandwidthFallback={getFeatureFallback()}
      className={className}
    >
      {children}
    </BandwidthAwareComponent>
  );
}

interface AdaptiveImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  className?: string;
}

export function AdaptiveImageGallery({ images, className = '' }: AdaptiveImageGalleryProps) {
  const { isSlowConnection, effectiveType } = useNetworkStatus();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Limit images on slow connections
  const maxImages = isSlowConnection ? 3 : images.length;
  const displayImages = images.slice(0, maxImages);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  if (effectiveType === 'slow-2g') {
    return (
      <div className={`bg-gray-50 border rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600 text-sm">🖼️ {images.length} images available</p>
        <p className="text-gray-500 text-xs mt-1">Gallery disabled for very slow connections</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {displayImages.map((image, index) => (
        <BandwidthAwareComponent
          key={index}
          priority="low"
          defer
          fallback={<EnhancedSkeleton variant="rounded" className="aspect-square" />}
        >
          <div className="relative aspect-square">
            <img
              src={isSlowConnection && image.thumbnail ? image.thumbnail : image.src}
              alt={image.alt}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
              onLoad={() => handleImageLoad(index)}
            />
            {!loadedImages.has(index) && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
            )}
          </div>
        </BandwidthAwareComponent>
      ))}
      
      {images.length > maxImages && (
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-sm">+{images.length - maxImages}</p>
            <p className="text-gray-500 text-xs">more images</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SmartDataTableProps {
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  className?: string;
}

export function SmartDataTable({ data, columns, className = '' }: SmartDataTableProps) {
  const { isSlowConnection } = useNetworkStatus();

  // Filter columns based on connection speed
  const visibleColumns = columns.filter(column => {
    if (isSlowConnection) {
      return column.priority === 'high';
    }
    return true;
  });

  // Limit rows on slow connections
  const maxRows = isSlowConnection ? 10 : data.length;
  const displayData = data.slice(0, maxRows);

  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {visibleColumns.map(column => (
                <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {visibleColumns.map(column => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > maxRows && (
        <div className="bg-gray-50 px-4 py-3 text-center border-t">
          <p className="text-sm text-gray-600">
            Showing {maxRows} of {data.length} items
            {isSlowConnection && (
              <span className="text-gray-500 ml-1">(limited for slow connection)</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}