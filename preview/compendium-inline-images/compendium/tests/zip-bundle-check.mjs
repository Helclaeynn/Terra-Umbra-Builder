import assert from 'node:assert/strict';
import {buildZip,mergePublicationEntries} from '../editor/zip-bundle.js';

const committed={version:1,entries:[
  {articleId:'a',baseHash:'a'.repeat(64),updatedAt:'2026-09-12T00:00:00Z',operations:[{op:'replace',path:'/title',value:'A'}]},
  {articleId:'b',baseHash:'b'.repeat(64),updatedAt:'2026-09-12T00:00:00Z',operations:[{op:'replace',path:'/title',value:'B ancien'}]},
]};
const drafts=[
  {articleId:'b',baseHash:'b'.repeat(64),updatedAt:'2026-09-12T01:00:00Z',operations:[{op:'replace',path:'/title',value:'B nouveau'}]},
  {articleId:'c',baseHash:'c'.repeat(64),updatedAt:'2026-09-12T01:00:00Z',operations:[{op:'replace',path:'/title',value:'C'}]},
];
const merged=mergePublicationEntries(committed,drafts);
assert.deepEqual(merged.entries.map(entry=>entry.articleId),['a','b','c']);
assert.equal(merged.entries.find(entry=>entry.articleId==='b').operations[0].value,'B nouveau');

const zip=await buildZip([
  {name:'compendium/data/manual-overrides.json',data:JSON.stringify(merged)},
  {name:'compendium/images/manual/demo.webp',data:new Uint8Array([1,2,3,4,5])},
],{date:new Date('2026-09-12T12:34:56Z')});
const bytes=new Uint8Array(await zip.arrayBuffer()),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
assert.equal(view.getUint32(0,true),0x04034b50,'Signature de fichier ZIP locale invalide');
assert.equal(view.getUint32(bytes.length-22,true),0x06054b50,'Fin de central directory absente');
assert.equal(view.getUint16(bytes.length-14,true),2,'Nombre de fichiers ZIP incorrect');
const text=new TextDecoder().decode(bytes);
assert.ok(text.includes('compendium/data/manual-overrides.json'));
assert.ok(text.includes('compendium/images/manual/demo.webp'));
assert.ok(text.includes('B nouveau'));

await assert.rejects(()=>buildZip([{name:'../escape.txt',data:'x'}]),/Chemin ZIP invalide/);
await assert.rejects(()=>buildZip([{name:'a.txt',data:'x'},{name:'a.txt',data:'y'}]),/dupliqué/);

console.log(`Publication ZIP builder OK: ${bytes.length} octets, fusion d'overrides validée.`);
