/* Alerta Campus Colombia — service worker
   Desarrollada por Vibras Positivas HM — Derechos de Autor Reservados */

const CACHE = 'alerta-campus-v2';
const BASE = [
  './',
  './index.html',
  './politica.html',
  './og-image.png',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(BASE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Consolidado nacional y API: red primero, caché como respaldo
  if (url.pathname.endsWith('/datos/reportes.json') || url.pathname.includes('/api/')) {
    e.respondWith(
      fetch(req)
        .then(r => {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put(req, copia));
          return r;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Teselas del mapa: caché primero, con guardado progresivo
  if (url.hostname.includes('arcgisonline.com') || url.hostname.includes('tile.openstreetmap.org')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
        return r;
      }).catch(() => new Response('', { status: 504 })))
    );
    return;
  }

  // Todo lo demás: caché primero
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok && (url.origin === location.origin || url.hostname.includes('unpkg.com') || url.hostname.includes('fonts.'))) {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
