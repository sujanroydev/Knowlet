const APP_VERSION = "1.7.56";
const CACHE_NAME = `knowlet-${APP_VERSION}`;
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/index',
    '/favourite',
    '/history',
    '/profile',
    '/login_signup',
    '/profile_complition_form',
    '/search',
    '/notes',

    '/assets/styles/style.css',
    '/assets/styles/favourite.css',
    '/assets/styles/history.css',
    '/assets/styles/profile.css',
    '/assets/styles/login_signup.css',
    '/assets/styles/profile_complition_form.css',
    '/assets/styles/search.css',
    '/assets/styles/notes.css',

    '/assets/scripts/script.js',
    '/assets/scripts/favourite.js',
    '/assets/scripts/history.js',
    '/assets/scripts/profile.js',
    '/assets/scripts/login_signup.js',
    '/assets/scripts/profile_complition_form.js',
    '/assets/scripts/search.js',
    '/assets/scripts/notes.js',

    '/assets/notes.json'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // activate immediately

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => {
            // Force all open pages to reload under the new service worker
            return self.clients.matchAll({ type: 'window' }).then(clients =>
                clients.forEach(client => client.navigate(client.url))
            );
        })
    );

    self.clients.claim(); // take control immediately
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {

            // Start network fetch in the background
            const networkFetch = fetch(event.request)
                .then(networkResponse => {
                    // Update cache with latest response
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    // If network fails and it's a page navigation, show offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline');
                    }
                });

            // If cached version exists, return it immediately; network fetch updates cache in background
            return cachedResponse || networkFetch;

        })
    );
});