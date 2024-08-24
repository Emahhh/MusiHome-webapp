self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('music-bookmark').then(function(cache) {
            return cache.addAll([
                '/',  // Cache the root URL
                '/index.html',  // Cache the HTML file
                // Optionally cache other static assets here
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});