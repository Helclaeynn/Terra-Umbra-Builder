import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data',BATCH='reality-setting-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function flat(page){return [page.title,...(page.sections||[]).flatMap(s=>[s.title,...(s.blocks||[]).flatMap(b=>b.type==='table'?(b.rows||[]).flat():[b.text||''])])].join(' ')}
const stop=new Set('le la les un une des de du d et en a au aux pour par sur dans avec sans est sont qui que ce cette ces son sa ses leur leurs plus moins entre comme ou se ne pas il elle ils elles'.split(' '));
function tokens(s){return new Set(norm(s).split(/\s+/).filter(w=>w.length>3&&!stop.has(w)))}
function jaccard(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let inter=0;for(const x of A)if(B.has(x))inter++;return inter/(A.size+B.size-inter)}
const reality=load('realite'),legacy=load('lore').filter(p=>p.category==='Réalité'),book=reality.filter(p=>p.realityBook?.batch===BATCH);
console.log(`RÉALITÉ LEGACY AUDIT — Réalité ${reality.length} · book-first ${book.length} · lore legacy visible ${legacy.length}`);
const exact=[];for(const l of legacy)for(const b of book)if(norm(l.title)===norm(b.title))exact.push([l,b]);
console.log(`EXACT_TITLE_DUPLICATES ${exact.length}`);for(const [l,b] of exact)console.log(`  EXACT | ${l.id} | ${l.title} -> ${b.id}`);
const ranked=[];for(const l of legacy){let best=null;for(const b of book){const score=jaccard(flat(l),flat(b));if(!best||score>best.score)best={b,score}}ranked.push({l,...best})}
ranked.sort((a,b)=>b.score-a.score);
console.log('LEGACY_OVERLAP');
for(const {l,b,score} of ranked){
  const sections=(l.sections||[]).map(s=>s.title).filter(Boolean).join(' / ');
  const mechanics=(l.sections||[]).some(s=>(s.blocks||[]).some(x=>x.type==='table'))||/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b/i.test(flat(l));
  console.log(`  PAGE | ${score.toFixed(3)} | ${l.id} | ${l.title} -> ${b?.title||'—'} | mechanics=${mechanics?'yes':'none'}`);
  console.log(`    SECTIONS | ${sections||'—'}`);
}
const meta=[];const metaRe=/\b(?:V[0-9]+|version\s+[0-9]+|contenu du dossier|informations? (?:g[eé]n[eé]rales?|r[eé]alit[eé])|source documentaire)\b/i;
for(const p of legacy){if(metaRe.test(flat(p)))meta.push(p)}
console.log(`META_NOISE ${meta.length}`);for(const p of meta)console.log(`  META | ${p.id} | ${p.title}`);
console.log('CANDIDATE_FAMILIES');
const families={daily:legacy.filter(p=>p.id?.startsWith('lore-vie-quotidienne-')).length,other:legacy.filter(p=>!p.id?.startsWith('lore-vie-quotidienne-')).length};
console.log(JSON.stringify(families));
