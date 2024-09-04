self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('music-bookmark').then(function(cache) {
            return cache.addAll([
                './index.html', 
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Clone the request because it's a stream and can only be consumed once
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(function(response) {
                // Check if we received a valid response
                if(!response || response.status === 404 || response.type !== 'basic') {
                    // For 404 errors, try to return the cached version if available
                    return caches.match(event.request);
                }

                // Clone the response because it's a stream and can only be consumed once
                var responseToCache = response.clone();

                caches.open('music-bookmark').then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(function() {
                // Network error, try to return the cached version
                return caches.match(event.request);
            });
        })
    );
});