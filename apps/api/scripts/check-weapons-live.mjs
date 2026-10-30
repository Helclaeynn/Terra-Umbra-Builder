import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const base=(process.env.TUC_WEAPON_BASE_URL||'https://dev.terra-umbra.fr').replace(/\/$/,'');
const readJson=async path=>JSON.parse(await readFile(root+path,'utf8'));
const get=async path=>{
  const response=await fetch(base+path,{signal:AbortSignal.timeout(30000),cache:'no-store'});
  assert.equal(response.status,200,path);
  return response;
};
const source=await readJson('compendium/source/sharp-weapons-restoration-v1.json');
const expected=(await readJson('compendium/source/current-equipment-catalog-v1.json')).catalog.entries.filter(item=>item.category.startsWith('Armes — '));
// CI supplies the response fetched with its temporary player's session.
// The public Compendium pages and images below are still checked anonymously.
const reality=process.env.TUC_WEAPON_REALITY_RESPONSE
  ? JSON.parse(await readFile(process.env.TUC_WEAPON_REALITY_RESPONSE,'utf8'))
  : await (await get('/api/rulesets/terra-umbra/reality')).json();
const actual=reality.equipment.filter(item=>item.sourceCategory.startsWith('Armes — '));
assert.equal(actual.length,124,'Le site doit charger les 124 armes, sans données serveur périmées.');
assert.deepEqual(actual.map(item=>item.id).sort(),expected.map(item=>item.id).sort());
for(const item of expected){
  const live=actual.find(row=>row.id===item.id);
  assert.equal(live.price,item.price??item.priceMin??null,item.name);
  assert.equal(live.priceLabel,item.priceLabel,item.name);
  assert.deepEqual(live.data,item.data,item.name);
}
const manifest=await readJson('compendium/data/manifest-v3.json');
const dataset=manifest.datasets.find(item=>item.id==='equipement');
const chunks=await Promise.all(Array.from({length:dataset.parts},(_,index)=>readFile(root+'compendium/data/'+dataset.prefix+'-'+String(index).padStart(2,'0')+'.b64part','utf8')));
const pages=JSON.parse(gunzipSync(Buffer.from(chunks.join('').replace(/\s/g,''),'base64')).toString('utf8')).filter(page=>page.catalog?.category?.startsWith('Armes — '));
assert.equal(pages.length,124);
// Small batches keep this read-only live check from creating a traffic burst.
for(let offset=0;offset<pages.length;offset+=4){
  await Promise.all(pages.slice(offset,offset+4).map(async expectedPage=>{
    const {article}=await (await get('/api/compendium/articles/'+expectedPage.id)).json();
    assert.equal(article.id,expectedPage.id);
    assert.equal(article.catalog.id,expectedPage.catalog.id);
    const expectedRows=expectedPage.sections.find(section=>section.id==='proprietes').blocks.find(block=>block.type==='table').rows;
    const rows=article.sections.find(section=>section.id==='proprietes')?.blocks.find(block=>block.type==='table')?.rows;
    // The API presents reviewed editorial families instead of storage categories.
    // Compare every mechanical row without conflating those two category labels.
    const mechanical=values=>values?.filter(row=>row[0]!=='Catégorie');
    assert.deepEqual(mechanical(rows),mechanical(expectedRows),expectedPage.title+': règles déployées différentes');
    assert.ok((article.illustration??article.image)?.src&&!/placeholder/.test((article.illustration??article.image).src),expectedPage.title+': image manquante');
  }));
}
for(const item of source.entries.filter(entry=>entry.disposition==='add')){
  const response=await get('/api/compendium/media/'+item.illustration.src);
  assert.match(response.headers.get('content-type'),/image\/webp/);
  const bytes=Buffer.from(await response.arrayBuffer());
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.illustration.sha256,item.name);
}
console.log('WEAPONS LIVE OK — 124 armes et leurs règles/prix concordent sur le site, 11 nouvelles illustrations vérifiées par empreinte.');
