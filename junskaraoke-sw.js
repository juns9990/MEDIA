// 준스가라오케 Service Worker — v0.1.3
// 셸 파일만 캐시 (no-backend, GitHub Pages 정적 PWA)

const CACHE = 'junskaraoke-v0.1.3';
const SHELL = [
  './junskaraoke-prototype.html',
  './junskaraoke-manifest.json',
  './junskaraoke-icon.svg',
  './junskaraoke/js/player-interface.js',
  './junskaraoke/js/yt-adapter.js',
  './junskaraoke/js/mp3-adapter.js',
  './junskaraoke/js/lrc-parser.js',
  './junskaraoke/js/search.js',
  './junskaraoke/js/catalog.js',
  './junskaraoke/data/songs.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k.startsWith('junskaraoke-') && k !== CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 외부(YouTube, fonts) 요청은 통과
  if (url.origin !== self.location.origin) return;

  // 셸: cache-first, 그 외: network-first(with cache fallback)
  if (SHELL.some((p) => url.pathname.endsWith(p.replace('./', '')))) {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
    return;
  }

  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
