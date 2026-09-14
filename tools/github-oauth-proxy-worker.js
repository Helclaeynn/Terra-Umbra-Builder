const DEFAULT_ALLOWED_ORIGINS=[
  'https://helclaeynn.github.io',
  'https://raw.githack.com',
  'https://rawcdn.githack.com'
];

function allowedOrigins(env){
  const custom=String(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  return new Set(custom.length?custom:DEFAULT_ALLOWED_ORIGINS);
}
function cors(origin){
  return {
    'Access-Control-Allow-Origin':origin,
    'Access-Control-Allow-Methods':'POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type,Accept',
    'Access-Control-Max-Age':'86400',
    'Vary':'Origin',
    'Cache-Control':'no-store'
  };
}
function reply(body,status,origin,extra={}){
  return new Response(body,{status,headers:{...cors(origin),'Content-Type':'application/json; charset=utf-8',...extra}});
}

export default {
  async fetch(request,env){
    const origin=request.headers.get('Origin')||'';
    if(!allowedOrigins(env).has(origin))return new Response('Origin not allowed',{status:403});
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
    if(request.method!=='POST')return reply(JSON.stringify({error:'method_not_allowed'}),405,origin);

    const routes={
      '/device/code':'https://github.com/login/device/code',
      '/oauth/access_token':'https://github.com/login/oauth/access_token'
    };
    const url=new URL(request.url),target=routes[url.pathname];
    if(!target)return reply(JSON.stringify({error:'not_found'}),404,origin);

    let body;
    try{body=new URLSearchParams(await request.text());}catch{return reply(JSON.stringify({error:'invalid_body'}),400,origin);}
    const expectedClientId=String(env.GITHUB_CLIENT_ID||'').trim();
    if(!expectedClientId)return reply(JSON.stringify({error:'proxy_not_configured'}),500,origin);
    if(body.get('client_id')!==expectedClientId)return reply(JSON.stringify({error:'invalid_client_id'}),403,origin);

    const allowed=url.pathname==='/device/code'
      ?new Set(['client_id'])
      :new Set(['client_id','device_code','grant_type','repository_id','refresh_token']);
    for(const key of [...body.keys()])if(!allowed.has(key))body.delete(key);

    if(url.pathname==='/oauth/access_token'){
      const grant=body.get('grant_type');
      if(grant!=='urn:ietf:params:oauth:grant-type:device_code'&&grant!=='refresh_token'){
        return reply(JSON.stringify({error:'unsupported_grant_type'}),400,origin);
      }
    }

    const upstream=await fetch(target,{
      method:'POST',
      headers:{'Accept':'application/json','Content-Type':'application/x-www-form-urlencoded'},
      body:body.toString()
    });
    const text=await upstream.text();
    return reply(text,upstream.status,origin);
  }
};
