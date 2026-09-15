import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/^\s*\d+\.?\s*/,'').replace(/[^a-z0-9]+/g,' ').trim()}
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function textOfBlock(block){if(!block)return '';if(block.type==='table')return (block.rows||[]).flat().join(' | ');return String(block.text||'')}
function textOfSection(section){return (section?.blocks||[]).map(textOfBlock).join(' ').replace(/\s+/g,' ').trim()}
function pageText(page){return (page.sections||[]).map(textOfSection).join(' ')}
function isBookFirst(page){return Boolean(page.loreBook)||Boolean((page.tags||[]).some(tag=>/^Lore V6/i.test(tag)))}
function snippet(value,n=280){const s=String(value||'').replace(/\s+/g,' ').trim();return s.length>n?`${s.slice(0,n)}…`:s}

const truth=load('verite');
const lore=load('lore');
const pnj=load('pnj');
const catalogue=load('verite-catalogue');
const pnjByTitle=new Map(pnj.map(page=>[norm(page.title),page]));
const catalogueTitles=new Set(catalogue.map(page=>norm(page.title)));
const legacy=lore.filter(page=>page.category==='Vérité'&&!isBookFirst(page));

const mechPatterns=[
  ['PTV',/\bPTV\b/ig],['DGT',/\bDGT\b/ig],['PA',/\b\d+\s*PA\b/ig],['1d10e',/\b1d10e\b/ig],['difficulté',/difficult[eé]\s*[:=]?\s*\d+/ig],['bonus',/\+\s*\d+/g],['profil',/\bprofil\s*:/ig],['table',/./g]
];
function mechanics(page){const txt=pageText(page);const found=[];for(const [name,re] of mechPatterns){if(name==='table'){if((page.sections||[]).some(s=>(s.blocks||[]).some(b=>b.type==='table')))found.push('table');continue;}re.lastIndex=0;if(re.test(txt))found.push(name)}return found}
function family(page){const t=norm(page.title);if(/^verite les chasseurs/.test(t))return 'hunters-container';if(/^verite les especes fantastiques/.test(t))return 'species-container';if(/^contexte general/.test(t))return 'context-general';if(/^atlantes aseryns$/.test(t))return 'aseryn-hub';if(/points de rencontre/.test(t))return 'meeting-points';return 'other';}

console.log(`FINAL TRUTH CLEANUP AUDIT — legacy Vérité ${legacy.length} · PNJ ${pnj.length} · catalogue ${catalogue.length}`);
const counts={};
for(const page of legacy)counts[family(page)]=(counts[family(page)]||0)+1;
console.log('FAMILIES',JSON.stringify(counts));

for(const page of legacy){
  const fam=family(page);const marks=mechanics(page);
  console.log(`PAGE | ${fam} | ${page.id} | ${page.title} | source=${page.source||'—'} | mechanics=${marks.join(',')||'none'}`);
  for(const section of page.sections||[]){
    const title=section.title||'—';const p=pnjByTitle.get(norm(title));
    console.log(`  SECTION | ${title} | pnj=${p?p.id:'—'} | ${snippet(textOfSection(section))}`);
  }
}

const transitory=truth.filter(page=>/^verite-0(58|59|60|61|62|63)-/.test(page.id));
console.log(`TRANSITORY DETAIL ${transitory.length}`);
for(const page of transitory){
  console.log(`TRANSITORY | ${page.id} | ${page.title}`);
  for(const section of page.sections||[]){
    const title=String(section.title||'').trim();
    const n=norm(title);const catMatch=n&&catalogueTitles.has(n);
    const tableRows=(section.blocks||[]).filter(b=>b.type==='table').reduce((sum,b)=>sum+(b.rows||[]).length,0);
    console.log(`  SECTION | ${title||'—'} | catalogueTitle=${catMatch?'yes':'no'} | tableRows=${tableRows} | ${snippet(textOfSection(section),220)}`);
  }
}
