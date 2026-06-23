// Service worker mínimo do Oi Coreia.
// O app já funciona 100% offline depois de carregado uma vez (todo o vocabulário
// e a lógica estão no próprio HTML), então não precisamos de uma estratégia de
// cache complexa — só registrar o service worker já é suficiente pra o navegador
// considerar o site "instalável" como PWA.

const CACHE_NAME = 'oi-coreia-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
