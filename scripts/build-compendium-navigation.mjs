import fs from 'node:fs';
import zlib from 'node:zlib';
import { classifyNavigation, isHierarchicalCategory, navigationDisplayTitle } from '../compendium/navigation-schema.js';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function loadDataset(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

const rows=[...loadDataset('moteur'),...loadDataset('realite'),...loadDataset('verite')]
  .filter(page=>isHierarchicalCategory(page.category));

const catchAll=/^(?:autre(?:s)?(?:\s+règle(?:s)?)?|divers|misc(?:ellaneous)?)$/i;
const entries=[];
const failures=[];
for(const page of rows){
  const nav=classifyNavigation(page);
  if(!nav?.group||!nav?.subgroup||!Number.isFinite(nav.groupOrder)||!Number.isFinite(nav.subgroupOrder)||!Number.isFinite(nav.pageOrder)){
    failures.push(`${page.category} | ${page.id} | ${page.title}`);
    continue;
  }
  if(catchAll.test(nav.group.trim())||catchAll.test(nav.subgroup.trim())){
    failures.push(`FOURRE-TOUT INTERDIT | ${page.category} | ${page.id} | ${nav.group} > ${nav.subgroup}`);
    continue;
  }
  entries.push({
    id:page.id,
    category:page.category,
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

const output={version:1,categories:['Règles','Réalité','Vérité'],entries};
fs.writeFileSync(`${DATA}/navigation-v1.json`,`${JSON.stringify(output,null,2)}\n`,'utf8');

console.log(`NAVIGATION V1 — ${entries.length}/${rows.length} pages classées.`);
for(const category of output.categories){
  const info=counts[category];
  console.log(`${category.toUpperCase()} — ${info?.pages||0} pages`);
  for(const [group,groupInfo] of Object.entries(info?.groups||{})){
    console.log(`  ${group} — ${groupInfo.pages} pages`);
    for(const [subgroup,count] of Object.entries(groupInfo.subgroups)) console.log(`    ${subgroup} — ${count}`);
  }
}
