/* VidSpark AI — Service Worker
   Strategy: network-first for HTML (always fresh dashboard/auth state),
   cache-first for static assets (css/js/icons/fonts) for instant repeat loads.
   Never touches API calls (anything not same-origin static file). */

const CACHE_VERSION = "vidspark-v3";
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const PRECACHE_URLS = [
  "/css/tokens.css",
  "/css/responsive.css",
  "/outils/tools.css",
  "/js/i18n.js",
  "/js/i18n-labels.js",
  "/js/plans-config.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|svg|webp|woff2?|ico)$/i.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never intercept API/CDN calls

  if (isStaticAsset(url)) {
    // Stale-while-revalidate: serve cached copy instantly, refresh in background
    // so edits to CSS/JS show up on the next load instead of staying stuck forever.
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request, { cache: "no-store" })
            .then((response) => {
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    // Network-first for pages so auth/dashboard data is never stale
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match("/index.html")))
    );
  }
});
