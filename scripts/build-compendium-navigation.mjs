import fs from 'node:fs';
import zlib from 'node:zlib';
import { classifyNavigation, isHierarchicalCategory, navigationDisplayTitle } from '../compendium/navigation-schema-v3.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function loadDataset(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
  return rows.map(page=>({...page,dataset:page.dataset||spec.id}));
}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function displayCategory(page,nav){
  if(['Équipement','Augmentations','Catalogue Vérité'].includes(page.category))return 'Équipement & Objets';
  if(page.category==='Organisations'){
    const tags=(page.tags||[]).map(norm);
    if(tags.includes('verite'))return 'Vérité';
    if(tags.includes('realite'))return 'Réalité';
    if(/faction|vampir|garou|mage|daemon|angelus|aseryn|exile|extral|chasseur|fleau/.test(norm(`${nav?.group||''} ${nav?.subgroup||''}`)))return 'Vérité';
    return 'Réalité';
  }
  return page.category;
}
function presentationNavigation(page,nav,targetCategory){
  if(targetCategory!=='Équipement & Objets')return nav;
  const [group,groupOrder]=page.category==='Équipement'
    ?['Équipement de Réalité',10]
    :page.category==='Augmentations'
      ?['Augmentations',20]
      :['Objets de Vérité',30];
  return {
    ...nav,
    group,
    groupOrder,
    subgroup:[nav.group,nav.subgroup].filter(Boolean).join(' — ')||'Références',
    subgroupOrder:(Number(nav.groupOrder)||0)*1000+(Number(nav.subgroupOrder)||0),
  };
}

const rows=manifest.datasets.flatMap(loadDataset).filter(page=>isHierarchicalCategory(page.category));

const catchAll=/^(?:autre(?:s)?(?:\s+règle(?:s)?)?|divers|misc(?:ellaneous)?)$/i;
const entries=[];
const failures=[];
for(const page of rows){
  const classified=classifyNavigation(page);
  if(!classified?.group||!classified?.subgroup||!Number.isFinite(classified.groupOrder)||!Number.isFinite(classified.subgroupOrder)||!Number.isFinite(classified.pageOrder)){
    failures.push(`${page.category} | ${page.dataset} | ${page.id} | ${page.title}`);
    continue;
  }
  if(catchAll.test(classified.group.trim())||catchAll.test(classified.subgroup.trim())){
    failures.push(`FOURRE-TOUT INTERDIT | ${page.category} | ${page.id} | ${classified.group} > ${classified.subgroup}`);
    continue;
  }
  const category=displayCategory(page,classified);
  const nav=presentationNavigation(page,classified,category);
  entries.push({
    id:page.id,
    dataset:page.dataset,
    category,
    group:nav.group,
    groupOrder:nav.groupOrder,
    subgroup:nav.subgroup,
    subgroupOrder:nav.subgroupOrder,
    pageOrder:nav.pageOrder,
    displayTitle:navigationDisplayTitle(page.title),
  });
}

if(failures.length) throw new Error(`Navigation incomplète (${failures.length}):\n${failures.join('\n')}`);
if(entries.length!==rows.length) throw new Error(`Navigation: ${entries.length}/${rows.length} pages classées`);

const seen=new Set();
for(const entry of entries){if(seen.has(entry.id))throw new Error(`Navigation: ID dupliqué ${entry.id}`);seen.add(entry.id)}
entries.sort((a,b)=>
  a.category.localeCompare(b.category,'fr')||
  a.groupOrder-b.groupOrder||
  a.group.localeCompare(b.group,'fr')||
  a.subgroupOrder-b.subgroupOrder||
  a.subgroup.localeCompare(b.subgroup,'fr')||
  a.pageOrder-b.pageOrder||
  a.displayTitle.localeCompare(b.displayTitle,'fr',{numeric:true,sensitivity:'base'})||
  a.id.localeCompare(b.id,'fr')
);

const counts={};
for(const entry of entries){
  counts[entry.category]??={pages:0,groups:{}};
  counts[entry.category].pages++;
  counts[entry.category].groups[entry.group]??={pages:0,subgroups:{}};
  counts[entry.category].groups[entry.group].pages++;
  counts[entry.category].groups[entry.group].subgroups[entry.subgroup]=(counts[entry.category].groups[entry.group].subgroups[entry.subgroup]||0)+1;
}

const categories=['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire'];
const output={version:3,categories,entries};
fs.writeFileSync(`${DATA}/navigation-v1.json`,`${JSON.stringify(output,null,2)}\n`,'utf8');

console.log(`NAVIGATION V3 — ${entries.length}/${rows.length} pages visibles classées.`);
for(const category of output.categories){
  const info=counts[category];
  console.log(`${category.toUpperCase()} — ${info?.pages||0} pages`);
  for(const [group,groupInfo] of Object.entries(info?.groups||{})){
    console.log(`  ${group} — ${groupInfo.pages} pages`);
    for(const [subgroup,count] of Object.entries(groupInfo.subgroups)) console.log(`    ${subgroup} — ${count}`);
  }
}
