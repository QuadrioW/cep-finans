const CACHE='cep-finans-v47';
const ASSETS=['./','./index.html','./style.css?v=4','./app.js?v=44','./finance-core.js?v=6','./manifest.webmanifest?v=4','./icon.svg?v=3'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('cep-finans-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const request=event.request;
  const isAppAsset=new URL(request.url).origin===self.location.origin;
  if(!isAppAsset)return;
  event.respondWith(fetch(request).then(response=>{if(response.ok&&response.type==='basic'){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request,{ignoreSearch:true}).then(hit=>hit||caches.match('./'))));
});
