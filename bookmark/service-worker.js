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
                    const htmlContent = getRedirectPage(redirectUrl);
                    
                    // ritorno html di una pagina che fa il redirect
                    return new Response(htmlContent, {
                        headers: { 'Content-Type': 'text/html' }
                    });
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




// ritorna l'html di una pagina che fa il redirect a musicUrl
function getRedirectPage(musicUrl) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MusiHome is redirecting...</title>
        <script>
            // Funzione per il redirect
            function redirectToMusicApp() {
                window.location.href = "${musicUrl}";
            }

            redirectToMusicApp();

            // redirect anche se riapri la pagina 
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    redirectToMusicApp();
                }
            });

        </script>
        <style>
            body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                color: #333;
                padding: 30px;
            }
            h1 {
                font-size: 1.7em;
                margin: 0.5em 0;
            }
            p {
                font-size: 1.3em;
                color: #666;
            }
            
            #logo {
                font-size: 2.5em;
            }

            #fallback-link {
                margin-top: 20px;
                font-size: 1.1em;
                color: #007BFF;
                text-decoration: underline;
            }

        </style>
    </head>
    <body>
        <h1 id="logo">🎵</h1>
        <h1>We are opening your music app...</h1>
        <p>powered by MusiHome</p>
        <br />
        <a id="fallback-link" href="${musicUrl}">If nothing happens, click here</a>
    </body>
    </html>
    `;

    return htmlContent;
}

