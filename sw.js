const C='trip-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  const ok=u.origin===location.origin||['www.gstatic.com','fonts.gstatic.com','fonts.googleapis.com'].includes(u.hostname);
  if(!ok)return;
  e.respondWith(caches.open(C).then(async c=>{
    const m=await c.match(r,{ignoreSearch:true});
    try{
      const res=await Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,m?3500:30000))]);
      if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());
      return res;
    }catch(err){if(m)return m;throw err}
  }));
});
