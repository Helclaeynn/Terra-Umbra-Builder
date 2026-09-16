import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const BOOK_BATCH='reality-setting-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function flat(page){return [page.title||'',...(page.sections||[]).flatMap(s=>[s.title||'',...(s.blocks||[]).flatMap(b=>b.type==='table'?(b.rows||[]).flat():[b.text||''])])].join(' ').replace(/\s+/g,' ').trim()}
const stop=new Set('le la les un une des de du d et en a au aux pour par sur dans avec sans est sont qui que ce cette ces son sa ses leur leurs plus moins entre comme ou se ne pas il elle ils elles'.split(' '));
function tokens(value){return new Set(norm(value).split(/\s+/).filter(w=>w.length>3&&!stop.has(w)))}
function jaccard(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let inter=0;for(const x of A)if(B.has(x))inter++;return inter/(A.size+B.size-inter)}
function bestMatch(page,candidates){let best={score:0,page:null};for(const candidate of candidates){const score=Math.max(jaccard(page.title,candidate.title),jaccard(flat(page),flat(candidate)));if(score>best.score)best={score,page:candidate}}return best}

const reality=load('realite');
const rules=load('moteur');
const augmentations=load('augmentations');
const equipment=load('equipement');
const book=reality.filter(page=>page.realityBook?.batch===BOOK_BATCH);
const residual=reality.filter(page=>page.realityBook?.batch!==BOOK_BATCH);
console.log(`RÉALITÉ DATASET AUDIT — ${reality.length} pages · ${book.length} book-first · ${residual.length} résiduelles`);
const mechanicsRe=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|\bCharge\b|\bStress\b|\bPRIX\b|\bEFFET\b/i;
for(const page of residual){
  const content=flat(page);
  const sections=(page.sections||[]).map(s=>s.title).filter(Boolean);
  const tables=(page.sections||[]).reduce((n,s)=>n+(s.blocks||[]).filter(b=>b.type==='table').length,0);
  const rule=bestMatch(page,rules),aug=bestMatch(page,augmentations),eq=bestMatch(page,equipment);
  const candidates=[['Règles',rule],['Augmentations',aug],['Équipement',eq]].sort((a,b)=>b[1].score-a[1].score);
  const [kind,best]=candidates[0];
  console.log(`PAGE | ${page.id} | ${page.title}`);
  console.log(`  SOURCE | ${page.source||'—'} | STATUS ${page.status||'—'} | NAV ${(page.nav?.group||'—')} > ${(page.nav?.subgroup||'—')}`);
  console.log(`  SHAPE | sections=${sections.length} tables=${tables} chars=${content.length} mechanics=${mechanicsRe.test(content)?'yes':'none'}`);
  console.log(`  SECTIONS | ${sections.join(' / ')||'—'}`);
  console.log(`  BEST | ${kind} ${best.score.toFixed(3)} -> ${best.page?.id||'—'} | ${best.page?.title||'—'}`);
}
const families={};for(const page of residual){const group=page.nav?.group||'sans-navigation';families[group]=(families[group]||0)+1}
console.log(`FAMILIES ${JSON.stringify(families)}`);
