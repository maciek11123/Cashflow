const CACHE='cashflow-v5';
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll([
      '/Cashflow/manifest.json',
      '/Cashflow/icon-192.png',
      '/Cashflow/icon-512.png'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Always fetch index fresh — never cache it
  if(url.pathname==='/Cashflow/'||url.pathname==='/Cashflow/index.html'){
    e.respondWith(fetch(e.request,{cache:'no-store'}));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
