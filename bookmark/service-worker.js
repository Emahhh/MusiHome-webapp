self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('music-bookmark').then(function(cache) {
            return cache.addAll([
                '/bookmark/',  // Cache the root URL
                '/bookmark/index.html',  // Cache the index explicitly
                // TODO: cache della foto? è necessario?
                // TODO: Optionally cache other static assets here
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    
    // Check if the request is for the /bookmark/ path, so that it is fetched from the cache for ANY query parameters
    if (url.pathname === '/bookmark/') {
        event.respondWith(
            caches.match('/bookmark/').then(function(response) {
                // Return the cached page if available, or fetch from the network
                return response || fetch(event.request);
            })
        );
    }
});