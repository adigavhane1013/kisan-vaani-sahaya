// Project Kisan Service Worker
const CACHE_NAME = 'kisan-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Cache market prices and FAQ data
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_DATA') {
    const { key, data } = event.data;
    caches.open('kisan-data-v1').then((cache) => {
      cache.put(key, new Response(JSON.stringify(data)));
    });
  }
});