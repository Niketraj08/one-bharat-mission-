/**
 * OneBharat Civic Core Service Worker
 */

const CACHE_NAME = "onebharat-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/assets/images/onebharat_logo_1782755871364.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Only intercept HTTP/HTTPS schemes
  if (event.request.url.startsWith("http")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
  }
});
