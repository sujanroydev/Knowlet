const CACHE_NAME = 'knowlet-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});