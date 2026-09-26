import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const decode=(prefix,parts)=>JSON.parse(gunzipSync(Buffer.from(Array.from({length:parts},(_,i)=>readFileSync('compendium/data/'+prefix+'-'+String(i).padStart(2,'0')+'.b64part','utf8').trim()).join(''),'base64')).toString('utf8'));
const spec=read('compendium/data/manifest-v3.json').datasets.find(x=>x.id==='bestiaire');
const current=decode(spec.prefix,spec.parts);
const previous=decode('v3-bestiaire-v16-enriched-263',30);
assert.deepEqual(current.slice(0,263),previous,'Les 263 fiches précédentes doivent rester intactes');
const additions=read('compendium/source/bestiary-classification-additions-v17.json').items;
assert.equal(additions.length,18);
const expected=['goule','kitsune','huldre','amazone','dryade','hydriade','ouranie','lampade','cyberiade','boggart','farfadet','chichiga','gnome','argileux','marionnette','homoncule','armurem','technolem'];
assert.deepEqual(additions.map(x=>x.key).sort(),expected.sort());
for(const entry of additions){
 const row=current.find(x=>x.id==='bestiaire-v17-'+entry.key);
 assert.ok(row,entry.key);
 assert.equal(entry.stats.length,9,entry.key);
 assert.ok(entry.stats.every(x=>Number.isFinite(x)&&x>=0),entry.key);
 assert.ok(entry.stats[1]>=1&&entry.stats[1]<=4,entry.key+' PA');
 assert.ok(entry.attacks.length&&entry.abilities.length&&entry.weaknesses.length,entry.key);
 const mj=row.sections.find(x=>x.id==='dossier-mj');
 assert.equal(mj.audience,'mj');
 assert.ok(mj.blocks.some(x=>x.text.includes('ACTIONS '+entry.stats[1]+' PA')));
 assert.ok(!row.sections.find(x=>x.id==='description').blocks.some(x=>/1d10e|DGT|PV |PA\b/.test(x.text)));
 assert.deepEqual(row.aliases,entry.aliases);
 assert.ok(existsSync('compendium/'+row.illustration.src),entry.key+' illustration absente');
}
console.log('OK: 18 ajouts illustrés, profils MJ, alias et 263 fiches originales préservées.');
