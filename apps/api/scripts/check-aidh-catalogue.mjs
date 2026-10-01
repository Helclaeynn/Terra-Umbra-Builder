import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const read=p=>JSON.parse(readFileSync(root+p,'utf8'));
const unpack=s=>JSON.parse(gunzipSync(Buffer.from(s.replace(/\s/g,''),'base64')));
const source=unpack(readFileSync(root+'compendium/source/verite-catalog-v6.json.gz.b64','utf8'));
const manifest=read('compendium/data/manifest-v3.json');
const spec=manifest.datasets.find(x=>x.id==='verite-catalogue');
const packed=Array.from({length:spec.parts},(_,i)=>readFileSync(root+`compendium/data/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').trim()).join('');
assert.equal(createHash('sha256').update(packed).digest('hex'),spec.sha256);
const articles=unpack(packed);
const nav=read('compendium/data/navigation-v1.json').entries;
const revision=read('compendium/source/aidh-catalogue-revision-20261001.json');
const {truthEquipmentCatalog:equipment}=await import('../dist/rules/truth/equipment.js');
assert.equal(articles.length,231);assert.equal(source.entryCount,231);assert.equal(equipment.length,231);
assert.equal(new Set(equipment.map(e=>e.id)).size,231);
assert.equal(revision.items.length,25);
for(const item of revision.items){
 const article=articles.find(a=>a.id===item.id);
 assert.ok(article,item.id);assert.equal(article.illustration.src,item.src);
 assert.equal(createHash('sha256').update(readFileSync(root+'compendium/'+item.src)).digest('hex'),item.sha256,item.id);
 const entry=equipment.find(e=>e.compendiumId===item.id);assert.ok(entry,item.id);
 assert.ok(nav.some(e=>e.id===item.id),item.id+' navigation');
 const rows=article.sections.find(s=>s.id==='proprietes').blocks.find(b=>b.type==='table').rows;
 for(const property of entry.properties)assert.ok(rows.some(r=>r[0]===property.label&&r[1]===property.value),item.id+' '+property.label);
}
const defensor=equipment.find(e=>e.name==='Defensor');
assert.match(defensor.lore,/Pistolet lourd semi-automatique/);assert.doesNotMatch(JSON.stringify(defensor),/revolver|barillet/i);
assert.ok(defensor.properties.some(p=>p.label==='Profil'&&p.value.includes('DGT 14')));
for(const [name,protection] of [['Second Skin','4'],['Vesper Recon','5'],['Urgent Matter','8'],['Bastion','10']]){
 assert.ok(equipment.find(e=>e.name===name).properties.some(p=>p.label==='Profil'&&p.value===`Armure ${protection}.`),name+' unchanged armour');
}
for(const id of revision.approvedEquipment){
 const entry=equipment.find(e=>e.compendiumId===id);assert.equal(entry.requiresMj,false);
 assert.ok(entry.properties.some(p=>p.label==='Statut éditorial'&&p.value.includes('validés par l’auteur')));
}
console.log('AIDH CATALOGUE OK — 25 illustrations, 231 stable IDs, 2 author-approved profiles, unchanged existing combat values, Builder/Compendium/navigation aligned');
