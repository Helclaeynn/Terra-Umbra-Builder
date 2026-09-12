const PREVIEW_PREFIX=new URL('./preview/compendium-editor/',self.location.href).pathname;
const RAW_ROOT='https://raw.githubusercontent.com/Helclaeynn/Terra-Umbra-Builder/preview/compendium-editor/';

const MIME={
  html:'text/html; charset=utf-8',
  js:'text/javascript; charset=utf-8',
  mjs:'text/javascript; charset=utf-8',
  css:'text/css; charset=utf-8',
  json:'application/json; charset=utf-8',
  b64part:'text/plain; charset=utf-8',
  txt:'text/plain; charset=utf-8',
  md:'text/plain; charset=utf-8',
  svg:'image/svg+xml',
  webp:'image/webp',
  png:'image/png',
  jpg:'image/jpeg',
  jpeg:'image/jpeg',
  gif:'image/gif',
  ico:'image/x-icon',
  woff:'font/woff',
  woff2:'font/woff2',
  ttf:'font/ttf',
  pdf:'application/pdf'
};

function contentType(path,upstream){
  const ext=(path.split('.').pop()||'').toLowerCase();
  return MIME[ext]||upstream.headers.get('content-type')||'application/octet-stream';
}

self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(PREVIEW_PREFIX))return;
  event.respondWith((async()=>{
    let path=decodeURIComponent(url.pathname.slice(PREVIEW_PREFIX.length));
    if(!path||path.endsWith('/'))path+='index.html';
    const parts=path.split('/');
    if(parts.some(part=>part==='..'))return new Response('Chemin preview invalide',{status:400});
    const rawUrl=RAW_ROOT+parts.map(encodeURIComponent).join('/');
    try{
      const upstream=await fetch(rawUrl,{cache:'no-store'});
      if(!upstream.ok)return new Response(`Preview: ${path} · HTTP ${upstream.status}`,{status:upstream.status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
      return new Response(upstream.body,{status:upstream.status,statusText:upstream.statusText,headers:{'Content-Type':contentType(path,upstream),'Cache-Control':'no-store','X-TUC-Preview-Branch':'preview/compendium-editor'}});
    }catch(error){
      return new Response(`Preview indisponible: ${error?.message||error}`,{status:502,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
    }
  })());
});
