export class ApiError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(status:number, code:string, body:Record<string, unknown>) {
    super(code);
    this.name="ApiError";
    this.status=status;
    this.body=body;
  }
}

// Only invariant catalogues may use their existing server cache policy.
// Article bodies, search/index (MJ permissions), accounts and characters always reload.
const cacheableCatalogues=new Set([
  '/api/rulesets/terra-umbra/creation',
  '/api/rulesets/terra-umbra/truth',
  '/api/rulesets/terra-umbra/reality',
  '/api/compendium/meta',
  '/api/compendium/onboarding'
]);
export async function api<T>(path:string, options:RequestInit={}): Promise<T> {
  const headers=new Headers(options.headers??{});
  if(options.body!==undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type","application/json");
  }

  const response=await fetch(path,{
    ...options,
    credentials:"same-origin",
    cache:(!options.method || options.method.toUpperCase()==="GET") && cacheableCatalogues.has(path) ? "default" : "no-store",
    headers
  });

  const body=await response.json().catch(()=>({})) as Record<string, unknown>;
  if(!response.ok) {
    throw new ApiError(response.status,String(body.error??`http_${response.status}`),body);
  }

  return body as T;
}
