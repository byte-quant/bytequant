/* ByteQuant service worker: same-origin application shell caching only.
   Tool inputs and generated outputs are never persisted by this worker. */
const CACHE = "bytequant-shell-v6";
const SHELL = ["/", "/en/", "/de/", "/zh/", "/offline.html", "/favicon.png", "/app-icon.svg", "/app-icon-maskable.svg", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("bytequant-") && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const pageKey = url.pathname;
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            // Store only the path. Query strings can contain sensitive values
            // and must never become persistent cache keys.
            caches.open(CACHE).then((cache) => cache.put(pageKey, copy));
          }
          return response;
        })
        .catch(() => caches.match(pageKey).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  if (["script", "style", "image", "font"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const update = fetch(request).then((response) => {
          if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        }).catch(() => cached);
        return cached || update;
      })
    );
  }
});
