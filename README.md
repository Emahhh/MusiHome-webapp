# MusiHome website

Static, dependency-free website for `musihome.emanuele.click`. Serve the repository root; no build is required.

## Preview

Run `python3 -m http.server 4173` and open http://localhost:4173. Root-relative URLs require an HTTP server rather than opening the HTML directly.

## Release link

Set `appStoreUrl` in `config.js` to MusiHome’s exact HTTPS App Store product URL (`https://apps.apple.com/app/id…`). Leave it empty until the listing is live. The site defaults to an honest coming-soon page. Configuring a valid URL updates download buttons, availability copy, the download page, and Safari’s Smart App Banner.

## Bookmark compatibility

The entire `bookmark/` directory and all original `assets/` files are retained unchanged. Do not replace them with the native app’s assets. Existing `/bookmark/?name=…&url=…&img=…` links and their service worker retain their original behavior. If changing `bookmark/index.html` later, also update the embedded page returned by `getInstallAndRedirectPage()` in its service worker, as the original repository requires.

New website assets live exclusively in `assets/site/`. The homepage does not register a service worker or change bookmark routing.

## Content and assets

The design takes inspiration from the supplied Apple-style reference and uses current MusiHome branding, optimized native app captures, and the existing silent product film. Captures are example collections and Screenshots rotate automatically, respect reduced motion, pause while hovered or focused, and include manual navigation and a pause button. Third-party music artwork belongs to its respective owners. No remote fonts, analytics, signup backend, or new API is required.

Support, privacy, terms, and download pages are included. Public contact details come from the previous site. Review these pages whenever the shipping app’s behavior changes.

## Checks

Run `python3 scripts/check_site.py` for local asset/link checks and bookmark integrity. Run `node --check site.js` and `node --check config.js` for JavaScript syntax. `scripts/bookmark-baseline.json` records the original bookmark files and shared assets.
