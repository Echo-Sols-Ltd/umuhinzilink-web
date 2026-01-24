'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { LoadingSpinner, Skeleton } from './loading-states';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  lowQualitySrc?: string;
  placeholder?: React.ReactNode;
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  lowQualitySrc,
  placeholder,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const { isSlowConnection } = useNetworkStatus();

  useEffect(() => {
    const img = new Image();
    
    // Use low quality image for slow connections
    const targetSrc = isSlowConnection && lowQualitySrc ? lowQualitySrc : src;
    
    img.onload = () => {
      setCurrentSrc(targetSrc);
      setIsLoaded(true);
      setIsError(false);
    };
    
    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };
    
    img.src = targetSrc;
  }, [src, lowQualitySrc, isSlowConnection]);

  if (isError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  if (!isLoaded) {
    return placeholder || <Skeleton className={className} />;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      loading="lazy"
    />
  );
}

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function LazyComponent({
  children,
  fallback = <LoadingSpinner />,
  threshold = 0.1,
  rootMargin = '50px',
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return (
    <div ref={setRef}>
      {isVisible ? children : fallback}
    </div>
  );
}

interface AdaptiveContentProps {
  children: React.ReactNode;
  mobileContent?: React.ReactNode;
  tabletContent?: React.ReactNode;
  desktopContent?: React.ReactNode;
}

export function AdaptiveContent({
  children,
  mobileContent,
  tabletContent,
  desktopContent,
}: AdaptiveContentProps) {
  return (
    <>
      {/* Mobile Content */}
      <div className="block sm:hidden">
        {mobileContent || children}
      </div>
      
      {/* Tablet Content */}
      <div className="hidden sm:block lg:hidden">
        {tabletContent || children}
      </div>
      
      {/* Desktop Content */}
      <div className="hidden lg:block">
        {desktopContent || children}
      </div>
    </>
  );
}

interface ProgressiveDataLoaderProps<T> {
  loadData: () => Promise<T>;
  renderData: (data: T) => React.ReactNode;
  renderSkeleton: () => React.ReactNode;
  renderError: (error: Error) => React.ReactNode;
  cacheKey?: string;
  refreshInterval?: number;
}

export function ProgressiveDataLoader<T>({
  loadData,
  renderData,
  renderSkeleton,
  renderError,
  cacheKey,
  refreshInterval,
}: ProgressiveDataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isSlowConnection } = useNetworkStatus();

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check cache first
        if (cacheKey && typeof window !== 'undefined') {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            const isStale = Date.now() - timestamp > (isSlowConnection ? 300000 : 60000); // 5min for slow, 1min for fast
            
            if (!isStale && mounted) {
              setData(cachedData);
              setLoading(false);
              return;
            }
          }
        }

        const result = await loadData();
        
        if (mounted) {
          setData(result);
          setLoading(false);
          
          // Cache the result
          if (cacheKey && typeof window !== 'undefined') {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              data: result,
              timestamp: Date.now(),
            }));
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchData();

    // Set up refresh interval if specified
    if (refreshInterval && !isSlowConnection) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [loadData, cacheKey, refreshInterval, isSlowConnection]);

  if (loading) return <>{renderSkeleton()}</>;
  if (error) return <>{renderError(error)}</>;
  if (data) return <>{renderData(data)}</>;
  
  return null;
}

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className = '' }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 ${className}`}>
      <p className="text-sm font-medium">
        You're currently offline. Some features may not be available.
      </p>
    </div>
  );
}

// Hook for managing offline functionality
export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<Array<() => Promise<void>>>([]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      
      // Process offline queue
      if (offlineQueue.length > 0) {
        for (const action of offlineQueue) {
          try {
            await action();
          } catch (error) {
            console.error('Failed to process offline action:', error);
          }
        }
        setOfflineQueue([]);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue]);

  const queueAction = (action: () => Promise<void>) => {
    if (isOnline) {
      return action();
    } else {
      setOfflineQueue(prev => [...prev, action]);
      return Promise.resolve();
    }
  };

  return {
    isOnline,
    queueAction,
    offlineQueueLength: offlineQueue.length,
  };
}