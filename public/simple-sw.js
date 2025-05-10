// Simple service worker that caches the manifest
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-essentials').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/images/icons/icon-192x192.png',
        '/images/icons/icon-512x512.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
