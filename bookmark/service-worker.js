self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('music-bookmark').then(function(cache) {
            return cache.addAll([
                '../bookmark/index.html',
                // We'll cache the image dynamically in the fetch event
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    
    if (url.pathname === '/bookmark/') {
        event.respondWith(
            caches.match('/bookmark/').then(function(response) {
                return response || fetch(event.request);
            })
        );
    } else if (url.searchParams.get('img')) {
        // Cache the image if it's requested with the 'img' parameter
        event.respondWith(
            caches.open('music-bookmark').then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    return response || fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});