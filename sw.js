const APP_VERSION = '1.7.85';
const CACHE_NAME = `knowlet-${APP_VERSION}`;
const IGNORE_PARAMS_FOR = '/navigator';
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/about',
    '/legal/declaration',
    '/legal/privacy-policy',
    '/legal/terms-and-conditions',

    '/index',
    '/favourite',
    '/history',
    '/profile',
    '/login_signup',
    '/profile_complition_form',
    '/search',
    '/navigator',

    '/assets/styles/style.css',
    '/assets/styles/favourite.css',
    '/assets/styles/history.css',
    '/assets/styles/profile.css',
    '/assets/styles/login_signup.css',
    '/assets/styles/profile_complition_form.css',
    '/assets/styles/search.css',
    '/assets/styles/navigator.css',

    '/assets/scripts/script.js',
    '/assets/scripts/favourite.js',
    '/assets/scripts/history.js',
    '/assets/scripts/profile.js',
    '/assets/scripts/login_signup.js',
    '/assets/scripts/profile_complition_form.js',
    '/assets/scripts/search.js',
    '/assets/scripts/navigator.js',

    '/assets/styles/units.css',
    '/assets/scripts/units.js',

    '/assets/notes.json',
    '/assets/pyq.json'
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

    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    let fetchRequest = event.request;

    if (url.origin === self.location.origin && url.pathname === IGNORE_PARAMS_FOR) {
        url.search = '';
        fetchRequest = new Request('/navigator');
    }

    event.respondWith(
        caches.match(fetchRequest).then(cachedResponse => {

            // Start network fetch in the background
            const networkResponse = fetch(fetchRequest)
                .then(res => {

                    // Update cache with latest response
                    if ( res && res.status === 200 && fetchRequest.url.startsWith(self.location.origin)) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(fetchRequest, res.clone());
                        });
                    }

                    return res;
                })
                .catch(() => {
                    // If network fails and it's a page navigation, show offline page
                    if (fetchRequest.mode === 'navigate') {
                        return caches.match('/offline');
                    }
                });

            // If cached version exists, return it immediately; network fetch updates cache in background
            return cachedResponse || networkResponse;

        })
    );
});
