const V='panel-v19';
const CORE=['./','index.html','manifest.json','jspdf.umd.min.js','web-inv.js','icon-192.png','icon-512.png','img/paloma-celeste.jpg','img/paloma-rosa.jpg','img/cuna-celeste.jpg','img/cuna-rosa.jpg','img/boda1.jpg','img/boda2.jpg','img/boda3.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // primero internet (para recibir mejoras), si no hay conexión usa lo guardado
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
