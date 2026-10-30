import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('src/lib/atlas-data.json',root),'utf8'));
const backlinks=JSON.parse(await readFile(new URL('src/lib/atlas-article-maps.json',root),'utf8'));
// Nginx tries directories before SPA fallback: the /atlas route must not be an asset directory.
await assert.rejects(stat(new URL('public/atlas',root)),{code:'ENOENT'});
const ids=new Set();
for(const f of data.features){
 assert(!ids.has(f.id),`Duplicate feature ${f.id}`);ids.add(f.id);
 assert(!/[ÃÂ�]/.test(f.name),`Broken encoding: ${f.name}`);
 for(const [view,p] of Object.entries(f.positions)){
  assert(data.views.some(v=>v.id===view));assert(p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=1));
 }
 // Every LA point must invert to the same master coordinate from every zoom.
 if(f.id.startsWith('la-')){
  const restored=Object.entries(f.positions).map(([id,[x,y]])=>{const c=data.views.find(v=>v.id===id).crop;return[c[0]+x*(c[2]-c[0]),c[1]+y*(c[3]-c[1])];});
  for(const p of restored)assert(p.every((n,i)=>Math.abs(n-restored[0][i])<1e-9),`Crop drift: ${f.name}`);
 }
}
const mannan=data.features.find(f=>f.name==='Fermes Mannan');assert.equal(mannan.articleId,'realite-v9-crawlers-enders-fermes-mannan');
assert(data.features.some(f=>f.name==='Palais de la Cour suprême'&&f.articleId==='realite-v9-cour-supreme'));
for(const [article,links] of Object.entries(backlinks))for(const link of links){assert(data.views.some(v=>v.id===link.map));if(link.spot)assert(data.features.some(f=>f.id===link.spot&&f.articleId===article&&f.positions[link.map]));}
for(const asset of new Set([...data.views.flatMap(v=>[v.image,v.poster,v.thumb]),...data.gallery.flatMap(v=>[v.image,v.thumb])])){
 assert(asset.startsWith('/map-assets/v1/'));const info=await stat(new URL('public'+asset,root));assert(info.size>1000&&info.size<100_000_000);
}
assert.equal(data.views.length,7);assert.equal(data.gallery.length,7);
console.log(`Atlas: ${data.features.length} valid points; exact LA crop anchors, Mannan/justice links, ${Object.keys(backlinks).length} article back-links and all assets verified.`);
