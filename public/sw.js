// Service Worker for UmuhinziLink - Rural Connectivity Optimization
const CACHE_NAME = 'umuhinzilink-v1';
const STATIC_CACHE = 'umuhinzilink-static-v1';
const DYNAMIC_CACHE = 'umuhinzilink-dynamic-v1';
const IMAGE_CACHE = 'umuhinzilink-images-v1';

// Critical resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  // Critical CSS and JS will be added by Next.js automatically
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.umuhinzi-backend\.echo-solution\.com\/api\/v1\/products/,
  /^https:\/\/api\.umuhinzi-backend\.echo-solution\.com\/api\/v1\/farmers/,
  /^https:\/\/api\.umuhinzi-backend\.echo-solution\.com\/api\/v1\/buyers/,
];

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  /^https:\/\/api\.umuhinzi-backend\.echo-solution\.com\/api\/v1\/public/,
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImage(request)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE, '/offline'));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache-first strategy (for static assets and images)
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background for images
      if (isImage(request)) {
        updateCacheInBackground(request, cache);
      }
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response before caching
      const responseClone = networkResponse.clone();
      
      // Cache with size limits
      if (isImage(request)) {
        await cacheWithSizeLimit(cache, request, responseClone, 50); // 50 images max
      } else {
        await cache.put(request, responseClone);
      }
    }

    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    
    // Return cached version if available
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for images
    if (isImage(request)) {
      return new Response(
        '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280">Image unavailable offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    throw error;
  }
}

// Network-first strategy (for API requests and pages)
async function networkFirst(request, cacheName, fallbackUrl = null) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseClone = networkResponse.clone();
      
      // Cache API responses with TTL
      if (isAPIRequest(request)) {
        await cacheWithTTL(cache, request, responseClone, 5 * 60 * 1000); // 5 minutes
      } else {
        await cache.put(request, responseClone);
      }
    }

    return networkResponse;
  } catch (error) {
    console.error('Network-first strategy failed:', error);
    
    // Try cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cached API response is still valid
      if (isAPIRequest(request)) {
        const cacheTime = await getCacheTime(cache, request);
        const now = Date.now();
        const ttl = 5 * 60 * 1000; // 5 minutes
        
        if (cacheTime && (now - cacheTime) > ttl) {
          // Cache expired, but return it anyway with a header indicating it's stale
          const response = cachedResponse.clone();
          response.headers.set('X-Cache-Status', 'stale');
          return response;
        }
      }
      
      return cachedResponse;
    }

    // Return fallback for navigation requests
    if (fallbackUrl && isNavigationRequest(request)) {
      const fallbackCache = await caches.open(STATIC_CACHE);
      const fallbackResponse = await fallbackCache.match(fallbackUrl);
      
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    // Return offline page for navigation
    if (isNavigationRequest(request)) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>UmuhinziLink - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              background: #f9fafb;
              color: #374151;
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .icon { font-size: 3rem; margin-bottom: 1rem; }
            h1 { color: #2D5016; margin-bottom: 1rem; }
            p { margin-bottom: 1rem; line-height: 1.6; }
            .retry-btn {
              background: #2D5016;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              font-size: 1rem;
            }
            .retry-btn:hover { background: #4A7C59; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🌾</div>
            <h1>You're Offline</h1>
            <p>UmuhinziLink is not available right now. Please check your internet connection and try again.</p>
            <p>Some cached content may still be available.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
        </html>`,
        { 
          headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          } 
        }
      );
    }

    throw error;
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff');
}

function isImage(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Update cache in background
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Cache with size limit
async function cacheWithSizeLimit(cache, request, response, maxItems) {
  await cache.put(request, response);
  
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Cache with TTL
async function cacheWithTTL(cache, request, response, ttl) {
  const cacheKey = `${request.url}#timestamp`;
  const timestampResponse = new Response(Date.now().toString());
  
  await Promise.all([
    cache.put(request, response),
    cache.put(cacheKey, timestampResponse)
  ]);
}

// Get cache time
async function getCacheTime(cache, request) {
  const cacheKey = `${request.url}#timestamp`;
  const timestampResponse = await cache.match(cacheKey);
  
  if (timestampResponse) {
    const timestamp = await timestampResponse.text();
    return parseInt(timestamp, 10);
  }
  
  return null;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get offline actions from IndexedDB or localStorage
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, action.options);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions for offline action management
async function getOfflineActions() {
  // Implementation would use IndexedDB to store offline actions
  return [];
}

async function removeOfflineAction(id) {
  // Implementation would remove action from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: data.data,
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action) {
    // Handle action clicks
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

function handleNotificationAction(action, data) {
  switch (action) {
    case 'view':
      clients.openWindow(data?.url || '/');
      break;
    case 'dismiss':
      // Just close the notification
      break;
    default:
      clients.openWindow('/');
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}