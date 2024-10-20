self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('music-bookmark').then(function(cache) {
            return cache.addAll([
                './index.html', 
            ]);
        })
    );

    console.log('Service Worker installed.');
});


self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
});


self.addEventListener('fetch', function(event) {
    console.log('Fetching:', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {

            // prendo l'url a cui voglio redirectare, prendendone l'url parameter chiamato 'url'
            // questa risposta non ha bisogno di connessione internet
            {
                const urlParams = new URLSearchParams(event.request.url.split('?')[1]);
                const redirectUrl = urlParams.get('url');
                if (redirectUrl) {
                    return Response.redirect(redirectUrl); // redirecto all'URL trovato
                }
            }

            // se non riesco con la prima strategia, rispondo con la pagina cachata
            if (response) {
                return response;
            } 

            // altrimenti, rispondo con la pagina vera, presa dal network
            return fetch(event.request).catch(function() {
                return new Response('No internet connection and no redirect URL found.');
            });

        })
    );
});

// Add this new event listener to cache the image from the URL parameter
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'CACHE_IMAGE') {
        event.waitUntil(
            caches.open('music-bookmark').then(function(cache) {
                return cache.add(event.data.url);
            })
        );
    }
});



