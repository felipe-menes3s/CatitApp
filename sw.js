// Offline support: the 6 AM gym may have weak signal.
// - App files (same origin): network first, so updates arrive; cache when offline.
// - Libraries and fonts (esm.sh, Google Fonts) and GIFs: cache first; they never change for a given URL.
// Bump CACHE whenever a GIF changes under the same name (GIFs are cache-first).
const CACHE = 'catitapp-v4';
const NETWORK_TIMEOUT_MS = 3000; // weak gym signal: fall back to the cache instead of hanging

const APP_SHELL = [
  './', 'index.html', 'manifest.json', 'css/app.css',
  'js/main.js', 'js/lib.js', 'js/themes.js', 'js/storage.js', 'js/session.js', 'js/ui.js',
  'js/data/exercises.js', 'js/data/routines.js',
  'js/screens/Today.js', 'js/screens/Workout.js', 'js/screens/Settings.js', 'js/screens/Progress.js', 'js/screens/DayCard.js',
  'js/weight.js', 'js/data/nutrition.js', 'brand/mark.svg', 'icon-512.png',
  'icon-192.png', 'apple-touch-icon.png',
  // All exercise images, so every routine works offline from the first launch.
  'gifs/arm_circles.gif', 'gifs/bench_bridge.gif', 'gifs/bench_squat.gif', 'gifs/bird_dog.jpg', 'gifs/calf_stretch.gif', 'gifs/curl_up.gif', 'gifs/db_row.gif', 'gifs/dead_bug.gif', 'gifs/farmer_carry.gif', 'gifs/glute_bridge.gif', 'gifs/goblet_squat.gif', 'gifs/hip_circles.gif', 'gifs/hip_flexor_stretch.gif', 'gifs/incline_pushup.gif', 'gifs/incline_walk.gif', 'gifs/march.gif', 'gifs/pelvic_breath.png', 'gifs/quad_stretch.gif', 'gifs/rear_delt_side.gif', 'gifs/side_plank.gif', 'gifs/split_squat.gif', 'gifs/stairmaster.gif', 'gifs/walk_easy.jpg',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  // 'no-cache' revalidates with the server, so old and new JS modules are never mixed after an update.
  const network = fetch(request, { cache: 'no-cache' }).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  network.catch(() => {}); // if the timer wins and the network fails later, that is fine
  const timeout = new Promise(resolve => setTimeout(resolve, NETWORK_TIMEOUT_MS, null));
  try {
    const response = await Promise.race([network, timeout]);
    if (response) return response;
  } catch { /* offline: use the cache below */ }
  const cached = await cache.match(request, { ignoreSearch: true });
  return cached || network.catch(() => Response.error());
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin && !url.pathname.includes('/gifs/')) event.respondWith(networkFirst(request));
  else if (!sameOrigin && !/esm\.sh|fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) return;
  else event.respondWith(cacheFirst(request));
});
