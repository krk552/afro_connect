// Service Worker for Makna.io - Performance Optimization
const CACHE_NAME = 'makna-v1.2.0';
const API_CACHE_NAME = 'makna-api-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png',
  '/og-image.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/rest/v1/businesses',
  '/rest/v1/categories',
  '/rest/v1/featured'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('❌ Failed to cache static assets:', err);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch Event - Implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Cache with network first strategy
  if (url.pathname.includes('/rest/v1/') || url.pathname.includes('/auth/v1/')) {
    event.respondWith(
      networkFirstStrategy(request, API_CACHE_NAME, 5000) // 5 second timeout
    );
    return;
  }

  // Static assets - Cache first strategy
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_NAME)
    );
    return;
  }

  // HTML pages - Network first with fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      networkFirstStrategy(request, CACHE_NAME, 3000) // 3 second timeout
    );
    return;
  }
});

// Network First Strategy (for API calls and HTML)
async function networkFirstStrategy(request, cacheName, timeout = 5000) {
  try {
    // Try network with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📡 Network failed, trying cache:', error.message);
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('💾 Serving from cache:', request.url);
    return cachedResponse;
  }

  // Return network error if no cache available
  return new Response('Offline - No cached version available', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Cache First Strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('💾 Serving from cache:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Failed to fetch:', request.url, error);
    return new Response('Resource not available', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Background sync for analytics and non-critical data
self.addEventListener('sync', event => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(sendAnalytics());
  }
});

async function sendAnalytics() {
  // Send cached analytics data when back online
  console.log('📊 Sending background analytics...');
}

// Push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.png',
        badge: '/favicon.svg',
        data: data.url
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

console.log('🚀 Makna Service Worker loaded successfully'); 