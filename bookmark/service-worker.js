self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('music-bookmark').then(function(cache) {
            return cache.addAll([
                '../bookmark/index.html',  // Cache the root URL
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
    } else if (url.searchParams.get('img')) {
        const imgUrl = url.searchParams.get('img');
        event.respondWith(
            caches.match(imgUrl).then(function(response) {
                if (response) {
                    return response;
                }
                
                return fetch(imgUrl).then(function(networkResponse) {
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open('music-bookmark').then(function(cache) {
                            cache.put(imgUrl, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(function() {
                    // Return a placeholder image or handle the error as needed
                    return new Response('Image not available', { status: 404, headers: { 'Content-Type': 'text/plain' } });
                });
            })
        );
    }
});