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
                    const htmlContent = getInstallPlusRedirectPage(redirectUrl);
                    
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




function getInstallPlusRedirectPage(musicUrl) {
    const redirectPageContent = getInstallAndRedirectPage(musicUrl);
    const installPageContent = getInstallPage(musicUrl);

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Install or Redirect Page</title>
        </head>
        <body>
            <script>
                const redirectPageContent = \`${redirectPageContent}\`;
                const installPageContent = \`${installPageContent}\`;

                function displayContent(content) {
                    document.body.innerHTML = content;
                }

                if(!window) {
                    console.log("no window");
                }

                if (("standalone" in window.navigator) && window.navigator.standalone) {
                    console.log("standalone detected")
                    displayContent(redirectPageContent);
                } else {
                    displayContent(installPageContent);
                }
            </script>
        </body>
        </html>
    `;
}




// ritorna l'html di una pagina che fa il redirect a musicUrl
function getInstallAndRedirectPage(musicUrl) {
    const htmlContent = `
    <h1>getRedirectPage</h1>
    `;

    return htmlContent;
}



function getInstallPage() {
    const htmlContent = `
    <h1>getInstallPage</h1>
    `;

    return htmlContent;
}


