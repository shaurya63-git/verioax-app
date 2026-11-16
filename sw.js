// Minimal service worker: caches the small wrapper page so the app opens with a loading screen even when offline.
// Scans always go to the live Verioax server; nothing you scan is stored here.
const CACHE = "verioax-shell-v1";
const SHELL = ["./", "index.html", "manifest.json", "privacy.html", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;          // the Streamlit app itself is never cached
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
