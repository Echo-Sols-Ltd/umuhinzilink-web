/**
 * Bundle optimization utilities for rural connectivity
 */

// Dynamic import helper with error handling
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: T,
  retries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      
      // Wait before retry (exponential backoff)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }

  if (fallback !== undefined) {
    console.warn('Dynamic import failed, using fallback:', lastError);
    return fallback;
  }

  throw lastError;
}

// Preload critical resources
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return;

  // Preload critical CSS
  const criticalStyles = [
    '/styles/agricultural-design-system.css',
    '/styles/mobile-first-responsive.css',
  ];

  criticalStyles.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical fonts
  const criticalFonts = [
    '/_next/static/media/poppins-latin-400-normal.woff2',
    '/_next/static/media/poppins-latin-600-normal.woff2',
  ];

  criticalFonts.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = href;
    document.head.appendChild(link);
  });
}

// Lazy load non-critical resources
export function lazyLoadNonCritical() {
  if (typeof window === 'undefined') return;

  // Lazy load non-critical resources after initial load
  setTimeout(() => {
    console.log('Non-critical resources loading deferred for better performance');
  }, 3000);
}

// Resource hints for better performance
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//api.umuhinzi-backend.echo-solution.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];

  hints.forEach(({ rel, href, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  });
}

// Optimize images for different connection speeds
export function getOptimalImageQuality(connectionType?: string): number {
  switch (connectionType) {
    case 'slow-2g':
      return 20;
    case '2g':
      return 30;
    case '3g':
      return 50;
    case '4g':
      return 75;
    default:
      return 85;
  }
}

// Get optimal image sizes for responsive loading
export function getResponsiveImageSizes(isSlowConnection: boolean): string {
  if (isSlowConnection) {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
  
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';
}

// Bundle size monitoring
export function monitorBundleSize() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

  // Monitor performance entries
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        console.log('Bundle load time:', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
      }
    });
  });

  observer.observe({ entryTypes: ['navigation'] });

  // Monitor resource loading
  const resourceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name.includes('_next/static')) {
        console.log('Resource:', entry.name, 'Size:', (entry as any).transferSize, 'bytes');
      }
    });
  });

  resourceObserver.observe({ entryTypes: ['resource'] });
}

// Critical CSS inlining helper
export function inlineCriticalCSS() {
  if (typeof window === 'undefined') return;

  const criticalCSS = `
    /* Critical agricultural design system styles */
    :root {
      --agricultural-primary: #2D5016;
      --agricultural-primary-light: #4A7C59;
      --earth-brown: #8B4513;
      --harvest-gold: #FFD700;
      --growth-success: #32CD32;
    }
    
    .font-primary {
      font-family: 'Poppins', system-ui, -apple-system, sans-serif;
    }
    
    .touch-optimized {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
}

// Service worker registration for offline support
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  });
}

// Memory management for low-end devices
export function optimizeMemoryUsage() {
  if (typeof window === 'undefined') return;

  // Clean up unused resources periodically
  setInterval(() => {
    // Force garbage collection if available (Chrome DevTools)
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Clear unused image caches
    const images = document.querySelectorAll('img[data-loaded="true"]');
    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isVisible && img.getAttribute('data-priority') !== 'high') {
        // Remove src to free memory for off-screen images
        img.removeAttribute('src');
        img.removeAttribute('data-loaded');
      }
    });
  }, 30000); // Every 30 seconds
}

// Network-aware resource loading
export function loadResourcesBasedOnConnection(connectionType?: string) {
  const isSlowConnection = connectionType === '2g' || connectionType === 'slow-2g';
  
  if (isSlowConnection) {
    // Disable non-essential features
    document.documentElement.classList.add('slow-connection');
    
    // Reduce animation and transitions
    const style = document.createElement('style');
    style.textContent = `
      .slow-connection * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      .slow-connection .animate-pulse {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  } else {
    document.documentElement.classList.remove('slow-connection');
  }
}

// Initialize all optimizations
export function initializeBundleOptimizations() {
  preloadCriticalResources();
  addResourceHints();
  inlineCriticalCSS();
  registerServiceWorker();
  optimizeMemoryUsage();
  monitorBundleSize();
  
  // Lazy load non-critical resources after initial load
  setTimeout(lazyLoadNonCritical, 2000);
}