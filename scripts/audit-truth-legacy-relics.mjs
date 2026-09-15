import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function load(id){
  const spec=manifest.datasets.find(d=>d.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/^\s*\d+\.?\s*/,'').replace(/[^a-z0-9]+/g,' ').trim()}
function text(page){return [page.title||'',...(page.sections||[]).flatMap(section=>[section.title||'',...(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])])].join(' ')}
function tokens(value){return new Set(norm(value).split(/\s+/).filter(token=>token.length>3))}
function jaccard(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let common=0;for(const token of A)if(B.has(token))common++;return common/(A.size+B.size-common)}
function isBookFirst(page){return Boolean(page.loreBook)||Boolean((page.tags||[]).some(tag=>/^Lore V6/i.test(tag)))}
function sectionTitles(page){return (page.sections||[]).map(section=>section.title).filter(Boolean)}

const truth=load('verite');
const lore=load('lore');
const current=[...truth,...lore.filter(page=>page.category==='Vérité'&&isBookFirst(page))];
const legacy=lore.filter(page=>page.category==='Vérité'&&!isBookFirst(page));
const transitory=truth.filter(page=>/^verite-0(58|59|60|61|62|63)-/.test(page.id));

const exact=[];
const near=[];
for(const old of legacy){
  const oldTitle=norm(old.title);
  for(const modern of current){
    if(old.id===modern.id)continue;
    const modernTitle=norm(modern.title);
    if(oldTitle&&oldTitle===modernTitle){
      exact.push({legacyId:old.id,legacyTitle:old.title,legacySections:sectionTitles(old),modernId:modern.id,modernTitle:modern.title,contentScore:+jaccard(text(old),text(modern)).toFixed(2)});
      continue;
    }
    const titleScore=jaccard(old.title,modern.title);
    if(titleScore<0.45)continue;
    const contentScore=jaccard(text(old),text(modern));
    if(contentScore>=0.12)near.push({legacyId:old.id,legacyTitle:old.title,legacySections:sectionTitles(old),modernId:modern.id,modernTitle:modern.title,titleScore:+titleScore.toFixed(2),contentScore:+contentScore.toFixed(2)});
  }
}

const suspicious=legacy.filter(page=>{
  const title=norm(page.title);
  return /^(vampires|loups garous|mages|daemons|angelus|atlantes aseryns)$/.test(title)
    || /^verite les chasseurs/.test(title)
    || /^verite les especes fantastiques/.test(title)
    || /^contexte general/.test(title);
}).map(page=>({id:page.id,title:page.title,sections:sectionTitles(page)}));

console.log(`TRUTH LEGACY AUDIT — Vérité ${truth.length} · lore Vérité legacy ${legacy.length} · book-first visibles ${current.length}`);
console.log(`TRANSITORY_TRUTH_PAGES ${transitory.length}`);
for(const page of transitory) console.log(`  TRANSITORY | ${page.id} | ${page.title}`);
console.log(`EXACT_TITLE_DUPLICATES ${exact.length}`);
for(const item of exact){
  console.log(`  EXACT | c=${item.contentScore} | ${item.legacyId} | ${item.legacyTitle} -> ${item.modernId} | ${item.modernTitle}`);
  console.log(`    SECTIONS | ${item.legacySections.join(' || ')||'—'}`);
}
console.log(`NEAR_DUPLICATES ${near.length}`);
for(const item of near.sort((a,b)=>b.contentScore-a.contentScore||b.titleScore-a.titleScore).slice(0,40)){
  console.log(`  NEAR | t=${item.titleScore} c=${item.contentScore} | ${item.legacyId} | ${item.legacyTitle} -> ${item.modernId} | ${item.modernTitle}`);
  console.log(`    SECTIONS | ${item.legacySections.join(' || ')||'—'}`);
}
console.log(`SUSPICIOUS_LEGACY ${suspicious.length}`);
for(const item of suspicious){
  console.log(`  SUSPICIOUS | sections=${item.sections.length} | ${item.id} | ${item.title}`);
  console.log(`    SECTIONS | ${item.sections.join(' || ')||'—'}`);
}
