const CACHE_NAME = 'knowlet-cache-v1.1.0';

const urlsToCache = [
    '/',
    '/index.html',
    '/assets/android-chrome-192x192.png',
    '/assets/android-chrome-512x512.png'
];

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activate (remove old caches)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch (stale while revalidate)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {

            const fetchPromise = fetch(event.request)
                .then(networkResponse => {

                    if (
                        networkResponse &&
                        networkResponse.status === 200 &&
                        event.request.method === 'GET'
                    ) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }

                    return networkResponse;
                })
                .catch(() => cachedResponse); // offline fallback

            return cachedResponse || fetchPromise;
        })
    );
});