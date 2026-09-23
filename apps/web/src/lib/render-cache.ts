/** Bounded, component-local memoization; never persisted across readers/accounts. */
export function createRenderCache(maxEntries=600,maxChars=1_000_000){
  const entries=new Map<string,string>();
  let chars=0;
  return {
    get(key:string,render:()=>string){
      const cached=entries.get(key);
      if(cached!==undefined)return cached;
      const value=render(),size=key.length+value.length;
      if(size>maxChars)return value;
      while(entries.size && (entries.size>=maxEntries || chars+size>maxChars)){
        const oldest=entries.keys().next().value!;
        chars-=oldest.length+entries.get(oldest)!.length;entries.delete(oldest);
      }
      entries.set(key,value);chars+=size;
      return value;
    },
    clear(){entries.clear();chars=0;}
  };
}
