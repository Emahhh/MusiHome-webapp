self.addEventListener('install', function(event) {
    // event.waitUntil(
    //     caches.open('music-bookmark').then(function(cache) {
    //         return cache.addAll([
    //             './index.html', 
    //         ]);
    //     })
    // );

    console.log('Service Worker installed.');
});


self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
});


self.addEventListener('fetch', function(event) {
    const requestURL = new URL(event.request.url);
    console.log('Fetching:', requestURL);

    event.respondWith((async function() {
        // SE LA RICHIESTA È PER BOOKMARK, RISPONDO CON HTML PRESO DA FUNZIONE
        // questa risposta non ha bisogno di connessione internet, e nemmeno di cache
        // perché prendo html dalla funzione e non dalla cache? perché Safari è infame e ti cancella subito la cache
        if (requestURL.pathname.startsWith('/bookmark/')) {
            const htmlContent = getInstallAndRedirectPage();
            
            // ritorno html di una pagina che fa il redirect
            return new Response(htmlContent, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // altrimenti, ritorno la risposta normale presa da internet
        return fetch(event.request);
    })());
});



// ritorna una stringa contenente l'html di una pagina
// REMEMBER: mettere qua dentro l'HTML di index.html, ma togliendo il js che installa il service worker (perché già installato!)
function getInstallAndRedirectPage() {

const htmlContent = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Favicon. Non specificare Apple Touch Icon, percé lo fa il js dopo. -->
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="shortcut icon" href="/assets/favicon.ico" />

    <!-- iOS Standalone Mode -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">

    <title id="page-title">MusiHome Bookmark</title>
    <style>

        #instructions-container {
            display: none;
        }

        body {
            font-family: -apple-system, Helvetica, Arial, sans-serif;
            background-color: #f2f2f7;
            margin: 0;
            padding: 0;
            color: #1c1c1e;
            line-height: 1.5;
        }

        .container {
            padding: 5vh 5vw;
            min-height: 100vh;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: 800px;
            margin: 0 auto;
        }

        #adhs-title {
            font-size: clamp(24px, 8vw, 48px);
            font-weight: 700;
            margin-bottom: 5vh;
            text-align: center;
            color: #007aff;
        }

        .instruction {
            display: flex;
            align-items: flex-start;
            margin-bottom: 5vh;
        }

        .step {
            background-color: #007aff;
            color: #fff;
            font-size: clamp(18px, 5vw, 24px);
            font-weight: 600;
            width: clamp(40px, 10vw, 60px);
            height: clamp(40px, 10vw, 60px);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 4vw;
            flex-shrink: 0;
        }

        .text {
            flex: 1;
            font-size: clamp(16px, 4vw, 20px);
        }

        .text-header {
            display: flex;
            align-items: center;
            margin-bottom: 1vh;
        }

        .text span {
            font-weight: 600;
            color: #007aff;
        }

        .image-share,
        .image-home {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            padding: 6px;
        }

        .image-share {
            height: clamp(24px, 6vw, 36px);
            margin-left: 2vw;
        }

        .image-home {
            height: clamp(32px, 8vw, 48px);
            margin-left: 2vw;
        }

        @media (min-width: 768px) {
            .container {
                padding: 5vh 10vw;
            }

            .instruction {
                margin-bottom: 6vh;
            }

            .step {
                margin-right: 3vw;
            }
        }

        #redirect {
            display: none;
            text-align: center;
            background-color: #ffffff99;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 32px;
            max-width: 400px;
            max-height: 900px;
            margin: 0 auto;
        }

        #bookmark-name {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px;
            color: #007aff;
        }

        #redirect h2 {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 16px;
            color: #8e8e93;
        }

        #redirect p {
            font-size: 14px;
            margin: 0;
            color: #3a3a3c;
        }

        #open-link {
            font-size: 14px;
            color: #8e8e93;
        }
    </style>
</head>

<body>

    <div id="redirect" class="container">
        <h1 id="bookmark-name">MusiHome</h1>
        <h2>Powered by MusiHome</h2>
        <p>We are opening your music app...</p>
        <a href="#" id="open-link">If nothing happens, click here</a>
    </div>
    
    <div class="container" id="instructions-container">
        <div class="container">
            <div id="adhs-title"></div>
    
            <div class="instruction">
                <div class="step">1</div>
                <div class="text">
                    <div class="text-header">
                        <span id="title-1"></span>
                        <img id="image-share" class="image-share"
                            src="../assets/share.svg"
                            alt="Share Button">
                    </div>
                    <div id="detail-1"></div>
                </div>
            </div>
    
            <div class="instruction">
                <div class="step">2</div>
                <div class="text">
                    <span id="title-2"></span>
                    <img id="image-home" class="image-home"
                    src="../assets/add-home.svg"
                        alt="Add to Home Screen Button">
                    <div id="detail-2"></div>
                </div>
            </div>
    
            <div class="instruction">
                <div class="step">3</div>
                <div class="text">
                    <span id="title-3"></span>
                    <div id="detail-3"></div>
                </div>
            </div>
        </div>
    </div>



    <script>

        window.onload = function () {

            // URL PARAMETERS
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get('url');
            const name = params.get('name');
            const img = params.get('img');

            // PRENDI I PARAMETRI DALL'URL, E USALI
            if (name) {
                document.getElementById('bookmark-name').innerText = name;
                document.getElementById('page-title').innerText = name;

                // Set the iOS bookmark name
                document.title = name;
            }
            if (img) {

                // Dynamically create apple-touch-icon link
                let link = document.createElement('link');
                link.rel = 'apple-touch-icon';
                link.href = img;
                document.head.appendChild(link);
            }

            if (!redirectUrl) {
                console.error('No redirect URL provided');
            }

            document.getElementById('open-link').href = redirectUrl;

            // Check if the app is running as a standalone (full screen webapp) or just in safari
            if (("standalone" in window.navigator) && window.navigator.standalone) {
                // FAI AVVENIRE IL REDIRECT

                // hide instructions and show redirect
                document.getElementById('redirect').style.display = 'block';
                document.getElementById('instructions-container').style.display = 'none';

                // redirect
                redirect(redirectUrl);

                // redirect anche se riapri la pagina 
                document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === 'visible') {
                        redirect(redirectUrl);
                    }
                });
                
            } else {
                // MOSTRA ISTRUZIONI
                // hide redirect and show instructions
                document.getElementById('redirect').style.display = 'none';
                document.getElementById('instructions-container').style.display = 'block';
            }
        };

        function redirect(destUrl) {
            window.open(destUrl, '_blank');
            window.location.href = destUrl;
        }

        // INSTRUCTIONS CODE: codice necessario per mostrare le istruzioni per aggiungere la pagina alla home screen
        {

            const translations = {
                en: {
                    title: "Add this page to your home screen to continue",
                    title1: "Tap the share button ",
                    detail1: 'It should be located at the bottom of your screen.',
                    title2: 'Select "Add to home screen" ',
                    detail2: 'You may need to scroll down to find this menu item.',
                    title3: "Done!",
                    detail3: ""
                },
            };

            function updateContent(language) {
                document.getElementById("adhs-title").textContent = translations[language].title;
                document.getElementById("title-1").textContent = translations[language].title1;
                document.getElementById("detail-1").textContent = translations[language].detail1;
                document.getElementById("title-2").textContent = translations[language].title2;
                document.getElementById("detail-2").textContent = translations[language].detail2;
                document.getElementById("title-3").textContent = translations[language].title3;
                document.getElementById("detail-3").textContent = translations[language].detail3;
            }

            document.addEventListener("DOMContentLoaded", function () {
                // Detect the browser's default language
                const userLang = navigator.language || navigator.userLanguage;
                const langCode = userLang.split('-')[0]; // Extract the language code, e.g., 'en' from 'en-US'

                // Check if the detected language is available in the translations
                const languageToUse = translations[langCode] ? langCode : 'en'; // Default to English if the language is not available

                // Update the content with the selected language
                updateContent(languageToUse);
            });
        }
    </script>
</body>
</html>
`;

    return htmlContent;
}

