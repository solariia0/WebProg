const CACHE_NAME = 'webprog';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      './',
      'index.html',
      'index.js',
      'stylesheet.css',
      './screens/error.inc',
      './screens/homepage.inc',
      './screens/live-tracking.inc',
      './screens/stopwatch.inc',
    ]);
  })());
});