import fs from 'node:fs';
import zlib from 'node:zlib';
import {classifyNavigation,navigationDisplayTitle} from '../compendium/navigation-schema-v2.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function flat(page){return [page.title||'',page.source||'',...(page.tags||[]),...(page.sections||[]).flatMap(section=>[section.title||'',...(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])])].join(' ').replace(/\s+/g,' ').trim()}
function dataRows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>(block.rows||[]).slice(1))).length}
function tableCount(page){return (page.sections||[]).reduce((n,section)=>n+(section.blocks||[]).filter(block=>block.type==='table').length,0)}
const stop=new Set('le la les un une des de du d et en a au aux pour par sur dans avec sans est sont qui que ce cette ces son sa ses leur leurs plus moins entre comme ou se ne pas il elle ils elles regle regles verite realite'.split(' '));
function tokens(value){return new Set(norm(value).split(/\s+/).filter(w=>w.length>3&&!stop.has(w)))}
function jaccard(a,b){const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let inter=0;for(const x of A)if(B.has(x))inter++;return inter/(A.size+B.size-inter)}
function overlap(page,candidates){let best={score:0,page:null};for(const candidate of candidates){const score=Math.max(jaccard(page.title,candidate.title),jaccard(flat(page),flat(candidate)));if(score>best.score)best={score,page:candidate}}return best}

const rules=load('moteur'),equipment=load('equipement'),augmentations=load('augmentations'),truthCatalog=load('verite-catalogue');
console.log(`RULES SCORIA AUDIT — ${rules.length} pages · corpus ${manifest.expectedTotal}`);

const byTitle=new Map();for(const page of rules){const key=norm(navigationDisplayTitle(page.title));if(!byTitle.has(key))byTitle.set(key,[]);byTitle.get(key).push(page)}
const titleDup=[...byTitle.values()].filter(rows=>rows.length>1);
console.log(`EXACT NORMALIZED TITLE DUPLICATES ${titleDup.length}`);
for(const rows of titleDup)console.log(`  DUP | ${rows.map(p=>`${p.id} :: ${p.title}`).join(' || ')}`);

const bodyMap=new Map();for(const page of rules){const key=norm(flat(page));if(!bodyMap.has(key))bodyMap.set(key,[]);bodyMap.get(key).push(page)}
const bodyDup=[...bodyMap.values()].filter(rows=>rows.length>1);
console.log(`EXACT NORMALIZED CONTENT DUPLICATES ${bodyDup.length}`);
for(const rows of bodyDup)console.log(`  BODY | ${rows.map(p=>`${p.id} :: ${p.title}`).join(' || ')}`);

const obsolete=rules.filter(page=>page.status==='obsolete'||(page.sections||[]).some(s=>s.status==='obsolete'));
console.log(`OBSOLETE STATUS ${obsolete.length}`);for(const page of obsolete)console.log(`  OBSOLETE | ${page.id} | ${page.title}`);
const metaRe=/\b(?:legacy|transitoire|a auditer|à auditer|todo|obsolete|obsolète|ancienne version|ancienne regle|ancienne règle|migration|placeholder|stub)\b/i;
const meta=rules.filter(page=>metaRe.test(flat(page)));
console.log(`EDITORIAL OR LEGACY MARKERS ${meta.length}`);for(const page of meta)console.log(`  META | ${page.id} | ${page.title}`);

const crossCandidates=[];for(const page of rules){const eq=overlap(page,equipment),aug=overlap(page,augmentations),cat=overlap(page,truthCatalog);const best=[['Équipement',eq],['Augmentations',aug],['Catalogue Vérité',cat]].sort((a,b)=>b[1].score-a[1].score)[0];if(best[1].score>=0.72)crossCandidates.push([page,best[0],best[1]])}
console.log(`HIGH CROSS-DATASET OVERLAP ${crossCandidates.length}`);for(const [page,kind,best] of crossCandidates)console.log(`  CROSS | ${page.id} | ${page.title} | ${kind} ${best.score.toFixed(3)} -> ${best.page?.id} :: ${best.page?.title}`);

const sparse=rules.filter(page=>{const text=flat(page);return text.length<450&&tableCount(page)===0&&(page.sections||[]).length<=2});
console.log(`SPARSE RULE PAGES ${sparse.length}`);for(const page of sparse)console.log(`  SPARSE | ${page.id} | ${page.title} | chars=${flat(page).length} sections=${(page.sections||[]).length}`);

const groups=new Map();for(const page of rules){const nav=classifyNavigation(page);const key=nav?`${nav.group} > ${nav.subgroup}`:'UNCLASSIFIED';if(!groups.has(key))groups.set(key,[]);groups.get(key).push({page,nav})}
console.log('NAVIGATION GROUPS');for(const [key,rows] of [...groups.entries()].sort((a,b)=>a[0].localeCompare(b[0],'fr'))){console.log(`  ${key} = ${rows.length}`);for(const {page,nav} of rows.sort((a,b)=>(a.nav?.pageOrder??500)-(b.nav?.pageOrder??500)||a.page.title.localeCompare(b.page.title,'fr',{numeric:true}))){console.log(`    PAGE | ${page.id} | ${page.title} | source=${page.source||'—'} | status=${page.status||'—'} | sections=${(page.sections||[]).length} | tables=${tableCount(page)} | rows=${dataRows(page)} | chars=${flat(page).length} | order=${nav?.pageOrder??'—'}`)}}

const near=[];for(let i=0;i<rules.length;i++)for(let j=i+1;j<rules.length;j++){const a=rules[i],b=rules[j];const sameNav=classifyNavigation(a)?.group===classifyNavigation(b)?.group;if(!sameNav)continue;const titleScore=jaccard(navigationDisplayTitle(a.title),navigationDisplayTitle(b.title));const contentScore=jaccard(flat(a),flat(b));if(titleScore>=0.67||contentScore>=0.82)near.push({a,b,titleScore,contentScore})}
near.sort((x,y)=>Math.max(y.titleScore,y.contentScore)-Math.max(x.titleScore,x.contentScore));
console.log(`NEAR DUPLICATE CANDIDATES ${near.length}`);for(const row of near.slice(0,80))console.log(`  NEAR | title=${row.titleScore.toFixed(3)} content=${row.contentScore.toFixed(3)} | ${row.a.id} :: ${row.a.title} || ${row.b.id} :: ${row.b.title}`);

const suspicious=new Set([...obsolete,...meta,...sparse,...crossCandidates.map(row=>row[0])]);
console.log(`SUSPICIOUS UNIQUE ${suspicious.size}`);for(const page of [...suspicious].sort((a,b)=>a.title.localeCompare(b.title,'fr',{numeric:true})))console.log(`  CANDIDATE | ${page.id} | ${page.title}`);
