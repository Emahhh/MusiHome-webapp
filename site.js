(() => {
  'use strict';
  const config = window.MUSIHOME_CONFIG || {};
  let storeURL;
  try {
    const candidate = new URL(config.appStoreUrl);
    if (candidate.protocol === 'https:' && candidate.hostname === 'apps.apple.com' && /\/id\d+(?:\/|$)/.test(candidate.pathname) && !candidate.username && !candidate.password) storeURL = candidate;
  } catch { /* Keep pre-release links usable without a store URL. */ }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  if (storeURL) {
    document.querySelectorAll('[data-download]').forEach(link => {
      link.href = storeURL.href;
      link.textContent = 'Download on the App Store ↗';
    });
    document.querySelectorAll('[data-availability]').forEach(el => { el.textContent = 'For iPhone'; });
    document.querySelectorAll('[data-release-answer]').forEach(el => { el.textContent = 'MusiHome is available on the App Store. Use any download link on this website to open the listing.'; });
    const launchHeading = document.querySelector('[data-launch-heading]');
    if (launchHeading) launchHeading.textContent = 'Make yourself at home.';
    const launchCopy = document.querySelector('[data-launch-copy]');
    if (launchCopy) launchCopy.textContent = 'MusiHome is available for iPhone. Browse the listing for compatibility, the latest release, and localized pricing.';
    const storeID = storeURL.pathname.match(/\/id(\d+)/)[1];
    const banner = document.createElement('meta');
    banner.name = 'apple-itunes-app'; banner.content = `app-id=${storeID}`;
    document.head.append(banner);
  }
  const slides = [
    ['pop','A MusiHome collection with favorite pop albums on warm paper'],
    ['taylor','A Taylor Swift collection with a pink wallpaper'],
    ['indie','An indie collection with a sage wallpaper'],
    ['club','A dance music collection in MusiHome'],
    ['classics','A classic albums collection in MusiHome'],
    ['bts','A BTS collection in MusiHome']
  ];
  const image = document.getElementById('collection-image');
  const dots = [...document.querySelectorAll('[data-slide]')];
  const showcase = document.querySelector('.hero-showcase');
  const toggle = document.querySelector('.slideshow-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0, paused = reducedMotion.matches, inView = true, hovered = false, focused = false, request = 0;
  function updateToggle() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', paused ? 'Play screenshot slideshow' : 'Pause screenshot slideshow');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
  }
  async function showSlide(index) {
    if (!image || !slides[index]) return;
    const generation = ++request;
    const [name, alt] = slides[index];
    const src = `/assets/site/wall-${name}.webp`;
    const preload = new Image(); preload.src = src;
    try { await preload.decode(); } catch { return; }
    if (generation !== request) return;
    image.src = src; image.alt = alt; currentSlide = index;
    dots.forEach((dot, i) => {
      dot.classList.toggle('selected', i === index);
      dot.setAttribute('aria-pressed', String(i === index));
    });
  }
  dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); }));
  if (showcase && image && toggle) {
    updateToggle();
    toggle.addEventListener('click', () => { paused = !paused; updateToggle(); });
    showcase.addEventListener('mouseenter', () => { hovered = true; });
    showcase.addEventListener('mouseleave', () => { hovered = false; });
    showcase.addEventListener('focusin', () => { focused = true; });
    showcase.addEventListener('focusout', event => { focused = showcase.contains(event.relatedTarget); });
    reducedMotion.addEventListener('change', event => { paused = event.matches; updateToggle(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }).observe(showcase);
    }
    window.setInterval(() => {
      if (!paused && !hovered && !focused && inView && !document.hidden) showSlide((currentSlide + 1) % slides.length);
    }, 3000);
  }
  const dialog = document.getElementById('film-dialog');
  const video = document.getElementById('product-film');
  let filmTrigger;
  if (dialog && typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-film]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault(); filmTrigger = link; dialog.showModal();
      document.body.classList.add('dialog-open');
      video.play().catch(() => { /* Native play controls remain available. */ });
    }));
    dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      video.pause(); document.body.classList.remove('dialog-open'); filmTrigger?.focus();
    });
  }
})();
