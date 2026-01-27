'use client';

import { useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { initializeBundleOptimizations, loadResourcesBasedOnConnection } from '@/lib/bundle-optimizer';

export function BundleOptimizationScript() {
  const { effectiveType, isSlowConnection } = useNetworkStatus();

  useEffect(() => {
    // Initialize bundle optimizations on mount
    initializeBundleOptimizations();

    // Add JS class to enable progressive enhancement
    document.documentElement.classList.add('js');

    // Apply connection-based optimizations
    loadResourcesBasedOnConnection(effectiveType);

    // Update connection class on body
    if (isSlowConnection) {
      document.documentElement.classList.add('slow-connection');
      if (effectiveType === 'slow-2g') {
        document.documentElement.classList.add('very-slow-connection');
      }
    } else {
      document.documentElement.classList.remove('slow-connection', 'very-slow-connection');
    }

    // Remove initial loading class after hydration
    const timer = setTimeout(() => {
      document.body.classList.remove('initial-loading');
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [effectiveType, isSlowConnection]);

  // This component doesn't render anything visible
  return null;
}

// Additional client-side optimization script
export function ClientOptimizationScript() {
  useEffect(() => {
    // Optimize images based on connection
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const isSlowConnection = document.documentElement.classList.contains('slow-connection');
      
      images.forEach((img) => {
        const element = img as HTMLImageElement;
        const src = element.dataset.src;
        const lowQualitySrc = element.dataset.lowQualitySrc;
        
        if (src) {
          element.src = isSlowConnection && lowQualitySrc ? lowQualitySrc : src;
          element.removeAttribute('data-src');
          element.setAttribute('data-loaded', 'true');
        }
      });
    };

    // Intersection Observer for lazy loading
    const observeImages = () => {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.dataset.src;
              
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.setAttribute('data-loaded', 'true');
                imageObserver.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    };

    // Initialize optimizations
    optimizeImages();
    observeImages();

    // Monitor performance
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', (entry as any).processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            console.log('CLS:', (entry as any).value);
          }
        });
      });

      try {
        perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support all entry types
        console.log('Performance monitoring not fully supported');
      }
    }

    // Cleanup function
    return () => {
      // Cleanup observers if needed
    };
  }, []);

  return null;
}

// Network status indicator component
export function NetworkStatusIndicator() {
  const { isOnline, isSlowConnection, effectiveType } = useNetworkStatus();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div className={`network-indicator ${!isOnline ? 'offline' : 'slow'}`}>
      {!isOnline ? (
        '📡 You are currently offline'
      ) : (
        `🐌 Slow connection detected (${effectiveType})`
      )}
    </div>
  );
}

// Service worker registration component
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          console.log('Service Worker registered:', registration);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  showUpdateNotification();
                }
              });
            }
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              console.log('Cache updated:', event.data.url);
            }
          });

        } catch (error) {
          console.warn('Service Worker registration failed:', error);
        }
      });
    }
  }, []);

  const showUpdateNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <strong>Update Available</strong>
          <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; opacity: 0.9;">
            A new version of UmuhinziLink is available.
          </p>
        </div>
        <button 
          onclick="window.location.reload()" 
          style="
            background: rgba(255,255,255,0.2); 
            border: 1px solid rgba(255,255,255,0.3); 
            color: white; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            cursor: pointer;
            margin-left: 1rem;
          "
        >
          Update
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  };

  return null;
}

// Main bundle optimization component that includes all optimizations
export function BundleOptimizations() {
  return (
    <>
      <BundleOptimizationScript />
      <ClientOptimizationScript />
      <NetworkStatusIndicator />
      <ServiceWorkerRegistration />
    </>
  );
}