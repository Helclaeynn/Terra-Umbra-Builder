import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SOURCE='compendium/source/verite-catalog-v6.json';
const manifest=JSON.parse(fs.readFileSync(SOURCE,'utf8'));
let b64='';
for(const chunk of manifest.chunks||[])b64+=fs.readFileSync(path.join(path.dirname(SOURCE),chunk),'utf8').replace(/\s+/g,'');
const source=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(!Array.isArray(source.entries)||source.entries.length!==229)throw new Error(`Catalogue Vérité inattendu: ${source.entries?.length||0}`);

const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const textOf=entry=>[entry.name,entry.section,entry.loreHint,...(entry.tags||[]),...(entry.rows||[]).flat()].map(v=>String(v??'')).join(' ');
const selected=source.entries.filter(entry=>['23','26'].includes(String(entry.chapter))||/(?:\bshi\b|jade|tao|ancrage)/i.test(norm(textOf(entry))));

console.log(`AUDIT VÉRITÉ — ${source.entries.length} entrées · chapitres 23/26 + ancrages associés ${selected.length}`);
for(const entry of selected){
  console.log(`\n=== ${entry.name} ===`);
  console.log(`id=${entry.id} | chapter=${entry.chapter} | section=${entry.section||''} | sourceKind=${entry.sourceKind||''} | status=${entry.status||''}`);
  if(entry.tags?.length)console.log(`tags=${entry.tags.join(' | ')}`);
  if(entry.loreHint)console.log(`loreHint=${entry.loreHint}`);
  for(const row of entry.rows||[])console.log(`ROW | ${String(row?.[0]??'')} | ${String(row?.[1]??'')}`);
}
