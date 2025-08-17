const CACHE = 'sp1rl-overrides';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE));
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('message', async e => {
  const data = e.data || {};
  const cache = await caches.open(CACHE);
  if (data.op === 'put') {
    await cache.put(data.path, new Response(data.blob, {
      headers: { 'Content-Type': 'text/javascript' }
    }));
  } else if (data.op === 'delete') {
    await cache.delete(data.path);
  } else if (data.op === 'clear') {
    await caches.delete(CACHE);
  }
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/sp1rl-overrides/')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(url.pathname).then(r => r || fetch(e.request))));
  }
});
