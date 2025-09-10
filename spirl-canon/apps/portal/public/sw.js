self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { self.clients.claim(); });

const PRECACHE = [
  '/', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png',
];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (PRECACHE.includes(url.pathname)) {
    event.respondWith(caches.open('spirl-shell').then(async c => {
      const cached = await c.match(event.request);
      if (cached) return cached;
      const fresh = await fetch(event.request);
      c.put(event.request, fresh.clone());
      return fresh;
    }));
  }
});
