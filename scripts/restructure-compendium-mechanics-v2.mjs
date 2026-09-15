import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const REALITY_SOURCE='compendium/source/reality-rules-v1.json.gz.b64';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const realitySource=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync(REALITY_SOURCE,'utf8').replace(/\s+/g,''),'base64')).toString('utf8'));
const truthCore=JSON.parse(fs.readFileSync('character-builder/rulesets/terra-umbra/truth/core.json','utf8'));

function specFor(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  return spec;
}
function loadDataset(id){
  const spec=specFor(id);let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function normalize(value){
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\(provisoire\)/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}
function slug(value){return normalize(value).replace(/\s+/g,'-')||'item'}
function cleanPrice(value){return String(value||'').replace(/\s*[—–-]\s*\d+\s*PTV\b.*$/i,'').trim()}
function uniq(values){return [...new Set(values.filter(Boolean))]}
function walkArrays(root){
  const rows=[];
  function walk(dir){
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const full=path.join(dir,entry.name);
      if(entry.isDirectory()) walk(full);
      else if(entry.isFile()&&entry.name.endsWith('.json')){
        const parsed=JSON.parse(fs.readFileSync(full,'utf8'));
        if(!Array.isArray(parsed)) continue;
        for(const item of parsed) if(item&&item.name) rows.push({...item,__file:full.replaceAll('\\','/')});
      }
    }
  }
  walk(root);return rows;
}
function indexByName(rows){
  const map=new Map();
  for(const row of rows){const key=normalize(row.name);if(!map.has(key))map.set(key,[]);map.get(key).push(row)}
  return map;
}

const realityTalents=walkArrays('character-builder/rulesets/terra-umbra/talents');
const realityDisadvantages=walkArrays('character-builder/rulesets/terra-umbra/disadvantages');
const talentIndex=indexByName(realityTalents);
const disadvantageIndex=indexByName(realityDisadvantages);

function chooseRealityBuilder(entry,index){
  const matches=index.get(normalize(entry.title))||[];
  if(matches.length===1) return matches[0];
  if(matches.length>1){
    const family=normalize(entry.family)==='pegre'?'mafieuse':normalize(entry.family);
    return matches.find(match=>normalize(`${match.__file} ${match.family||''} ${match.sphere||''} ${match.origin||''} ${match.attribute||''}`).includes(family))||null;
  }
  return null;
}
function realityRows(entries,index){
  return entries.map(entry=>{
    const builder=chooseRealityBuilder(entry,index);
    if(!builder) throw new Error(`Entrée Réalité absente du Builder: ${entry.title} [${entry.family}]`);
    return {source:entry,builder,name:String(builder.name||entry.title).replace(/\s*\(provisoire\)\s*/gi,'').trim(),effect:String(builder.effect||entry.effect||'').trim()};
  });
}
const canonicalTalents=realityRows(realitySource.talents.entries,talentIndex);
const canonicalDisadvantages=realityRows(realitySource.disadvantages.entries,disadvantageIndex);
if(canonicalTalents.length!==122) throw new Error(`122 Talents Réalité attendus, ${canonicalTalents.length}`);
if(canonicalDisadvantages.length!==55) throw new Error(`55 Désavantages attendus, ${canonicalDisadvantages.length}`);

function tableSection(title,items,kind='Talent'){
  return {id:slug(title),title,level:3,blocks:[{type:'table',rows:[[kind,'Effet'],...items.map(item=>[item.name,item.effect])]}]};
}
function groupedRealityPage({id,title,tag,items,subgroup,kind='Talent'}){
  const groups=new Map();
  for(const item of items){const key=subgroup(item)||'Catalogue';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item)}
  return {id,title,category:'Règles',source:'Catalogues Builder canoniques · TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx',status:'canon_recent',tags:['Règles','Réalité',kind,tag],sections:[...groups.entries()].map(([group,rows])=>tableSection(group,rows,kind))};
}

const groupedReality=[
  groupedRealityPage({id:'regles-realite-talents-communs',title:'Talents communs de Réalité',tag:'Commun',items:canonicalTalents.filter(x=>x.source.kind==='commun'),subgroup:()=> 'Talents communs'}),
  groupedRealityPage({id:'regles-realite-talents-expertise',title:'Talents d’expertise',tag:'Expertise',items:canonicalTalents.filter(x=>x.source.kind==='expertise'),subgroup:item=>item.source.family}),
  groupedRealityPage({id:'regles-realite-talents-origine',title:'Talents d’Origine',tag:'Origine',items:canonicalTalents.filter(x=>x.source.kind==='origine'),subgroup:item=>item.source.family}),
  groupedRealityPage({id:'regles-realite-talents-sphere',title:'Talents de Sphère',tag:'Sphère',items:canonicalTalents.filter(x=>x.source.kind==='sphere'),subgroup:item=>item.source.family}),
  groupedRealityPage({id:'regles-realite-desavantages-communs',title:'Désavantages communs de Réalité',tag:'Commun',kind:'Désavantage',items:canonicalDisadvantages.filter(x=>x.source.kind==='commun'),subgroup:()=> 'Désavantages communs'}),
  groupedRealityPage({id:'regles-realite-desavantages-attributs',title:'Désavantages liés aux Attributs',tag:'Attribut',kind:'Désavantage',items:canonicalDisadvantages.filter(x=>x.source.kind==='attribut'),subgroup:item=>item.source.family}),
  groupedRealityPage({id:'regles-realite-desavantages-sphere',title:'Désavantages de Sphère',tag:'Sphère',kind:'Désavantage',items:canonicalDisadvantages.filter(x=>x.source.kind==='sphere'),subgroup:item=>item.source.family}),
];

const truthTalents=walkArrays('character-builder/rulesets/terra-umbra/truth/talents');
const truthSeen=new Set();
for(const row of truthTalents){
  const key=`${row.__file}::${row.id||row.name}`;
  if(truthSeen.has(key)) throw new Error(`Entrée Vérité dupliquée dans les sources: ${key}`);
  truthSeen.add(key);
}

function truthDomain(row){
  const file=row.__file;
  if(file.includes('/vampire/')) return 'Vampire';
  if(file.includes('/garou/')) return 'Garou';
  if(file.endsWith('/khinae.json')) return 'Descendants de Khinae';
  if(file.endsWith('/mage.json')) return 'Mage';
  if(file.endsWith('/daemon.json')) return 'Daemon';
  if(file.endsWith('/angelus.json')) return 'Angelus';
  if(file.includes('/aseryn/')) return 'Aseryn';
  if(file.includes('/exile/')) return 'Exilé';
  if(file.includes('/extral/')) return 'Extral';
  if(file.endsWith('/humain.json')) return 'Chasseur';
  return 'Vérité';
}
function rawSegments(row){
  const segs=String(row.group||'').split('›').map(s=>s.trim()).filter(Boolean);
  while(segs.length>1){
    const last=cleanPrice(segs.at(-1));
    const name=normalize(row.name);
    if(normalize(last)===name||normalize(last).startsWith(`${name} `)) segs.pop();
    else break;
  }
  return segs.map(cleanPrice);
}
function semanticTruthGroup(row){
  const domain=truthDomain(row),s=rawSegments(row),first=s[0]||domain,second=s[1]||'';
  if(domain==='Vampire'){
    if(/^Vampire\s+[—-]\s+commun/i.test(first)) return {key:'vampire-commun',title:'Vampire — Talents communs',path:first};
    if(/Talents de Cour/i.test(first)) return {key:`vampire-cour-${slug(first.replace(/\s+[—-]\s+Talents de Cour.*$/i,''))}`,title:first.replace(/\s+[—-]\s+Talents de Cour.*$/i,'').trim(),path:first};
    return {key:`vampire-${slug(first)}`,title:first,path:first};
  }
  if(domain==='Garou') return {key:`garou-${slug(first)}`,title:/Garou\s+[—-]\s+commun/i.test(first)?'Garou — Talents communs':first,path:first};
  if(domain==='Descendants de Khinae') return {key:`khinae-${slug(first)}`,title:first,path:s.join(' › ')};
  if(domain==='Mage'){
    if(/^Progression par Points de Vérité/i.test(first)) return {key:'mage-progression',title:'Mage — progression par Points de Vérité',path:s.join(' › ')};
    if(/^Capacités et Talents communs/i.test(first)) return {key:'mage-communs',title:'Mage — Talents communs',path:s.join(' › ')};
    return {key:`mage-${slug(first)}`,title:`Mage — ${first}`,path:s.join(' › ')};
  }
  if(domain==='Daemon'){
    if(/^Nature daemoniaque/i.test(first)) return {key:'daemon-communs',title:'Daemon — Talents communs',path:s.join(' › ')};
    if(/^Fonctions daemoniaques/i.test(first)&&second) return {key:`daemon-fonction-${slug(second)}`,title:second,path:s.join(' › ')};
    if(/^Divinités et Facettes/i.test(first)&&second){const facet=s[2]?` — ${s[2].replace(/^Facette\s*:\s*/i,'')}`:'';return {key:`daemon-divinite-${slug(second)}-${slug(s[2]||'')}`,title:`${second}${facet}`,path:s.join(' › ')}}
    return {key:`daemon-${slug(first)}`,title:first,path:s.join(' › ')};
  }
  if(domain==='Angelus'){
    if(/^Nature commune/i.test(first)) return {key:'angelus-communs',title:'Angelus — Talents communs',path:s.join(' › ')};
    if(/^Nature\s*:/i.test(first)) return {key:`angelus-${slug(first)}`,title:`Angelus — ${first.replace(/^Nature\s*:\s*/i,'')}`,path:s.join(' › ')};
    if(/^Les dix Sephiroth/i.test(first)&&second) return {key:`angelus-sephirah-${slug(second)}`,title:second,path:s.join(' › ')};
    return {key:`angelus-${slug(first)}`,title:first,path:s.join(' › ')};
  }
  if(domain==='Aseryn'){
    if(/^Routes communes aserynes/i.test(first)&&second) return {key:`aseryn-route-${slug(second)}`,title:`Aseryn — ${second}`,path:s.join(' › ')};
    if(/^Origines jouables/i.test(first)&&second) return {key:`aseryn-origine-${slug(second)}`,title:second,path:s.join(' › ')};
    if(/^Traditions des Treize/i.test(first)&&second) return {key:`aseryn-tradition-${slug(second)}`,title:second,path:s.join(' › ')};
    if(/^Conseil de la Foudre/i.test(first)) return {key:'aseryn-conseil-foudre',title:'Conseil de la Foudre',path:s.join(' › ')};
    if(/^Dratyn/i.test(first)) return {key:'aseryn-dratyn',title:'Dratyn — la Maîtresse de la Foudre',path:s.join(' › ')};
    return {key:`aseryn-${slug(first)}`,title:first,path:s.join(' › ')};
  }
  if(domain==='Exilé'){
    const generic=/^(Héritages whurtens|Héritages azménoriens|Hordes thulkars|Réseaux ashylls|Croix d['’]Emphyrra)/i.test(first);
    const chosen=generic&&second?second:first;
    return {key:`exile-${slug(chosen)}`,title:chosen,path:s.join(' › ')};
  }
  if(domain==='Extral'){
    const generic=/^(Organisations Extrals|Doctrines AIDH)/i.test(first);
    const chosen=generic&&second?second:first;
    return {key:`extral-${slug(chosen)}`,title:chosen,path:s.join(' › ')};
  }
  if(domain==='Chasseur'){
    const chosen=second&&/^Traditions|^Voies|^Doctrines/i.test(first)?second:first;
    return {key:`chasseur-${slug(chosen)}`,title:chosen,path:s.join(' › ')};
  }
  return {key:`verite-${slug(first)}`,title:first,path:s.join(' › ')};
}

const truthGroups=new Map();
for(const row of truthTalents){
  const group=semanticTruthGroup(row);
  if(!truthGroups.has(group.key)) truthGroups.set(group.key,{...group,domain:truthDomain(row),items:[]});
  truthGroups.get(group.key).items.push({...row,__path:group.path});
}

function truthRulePage(group){
  const byPath=new Map();
  for(const item of group.items){const p=item.__path||group.title;if(!byPath.has(p))byPath.set(p,[]);byPath.get(p).push(item)}
  return {
    id:`regles-verite-${group.key}`,
    title:group.title,
    category:'Règles',
    source:'Catalogues Builder canoniques · Vérité V6/V7 cross-audit',
    status:'canon_recent',
    tags:['Règles','Vérité',group.domain,'Talent de Vérité'],
    sections:[...byPath.entries()].map(([sectionTitle,items])=>({
      id:slug(sectionTitle),title:sectionTitle===group.title?'Talents et capacités':sectionTitle,level:3,
      blocks:[{type:'table',rows:[['Talent / capacité','Coût','Accès','Prérequis','Effet'],...items.map(item=>[item.name,item.cost==null?'—':`${item.cost} PTV`,item.access||'—',item.prerequisiteName||'—',item.effect||''])]}]
    }))
  };
}
const groupedTruth=[...truthGroups.values()].sort((a,b)=>a.domain.localeCompare(b.domain,'fr')||a.title.localeCompare(b.title,'fr')).map(truthRulePage);

function coreNaturePage(nature){
  const sections=[];
  if((nature.freeTraits||[]).length) sections.push({id:'traits-gratuits',title:'Traits gratuits de Nature',level:3,blocks:[{type:'table',rows:[['Trait','Accès','Effet'],...(nature.freeTraits||[]).map(t=>[t.name,t.access||'—',t.effect||''])]}]});
  for(const choice of nature.choices||[]){
    sections.push({id:slug(choice.key||choice.label),title:choice.label,level:3,blocks:[{type:'table',rows:[['Option',...((choice.options||[]).map(option=>[option.name]))]]}]});
  }
  if(!sections.length) sections.push({id:'nature',title:'Nature',level:3,blocks:[{type:'p',text:nature.description||'Nature jouable de Vérité.'}]});
  return {id:`regles-verite-nature-${slug(nature.id)}`,title:`${nature.name} — règles de Nature`,category:'Règles',source:'character-builder/rulesets/terra-umbra/truth/core.json',status:'canon_recent',tags:['Règles','Vérité','Nature',nature.name],sections};
}
const corePages=(truthCore.natures||[]).map(coreNaturePage);

let rules=loadDataset('moteur');
const reality=loadDataset('realite');
const truth=loadDataset('verite');

// Idempotence: supprimer uniquement les pages générées par les passes de restructuration précédentes.
rules=rules.filter(page=>!String(page.id||'').startsWith('regles-realite-talent-')&&!String(page.id||'').startsWith('regles-realite-desavantage-')&&!String(page.id||'').startsWith('regles-realite-talents-')&&!String(page.id||'').startsWith('regles-realite-desavantages-')&&!String(page.id||'').startsWith('regles-verite-nature-')&&!String(page.id||'').startsWith('regles-verite-vampire-')&&!String(page.id||'').startsWith('regles-verite-garou-')&&!String(page.id||'').startsWith('regles-verite-khinae-')&&!String(page.id||'').startsWith('regles-verite-mage-')&&!String(page.id||'').startsWith('regles-verite-daemon-')&&!String(page.id||'').startsWith('regles-verite-angelus-')&&!String(page.id||'').startsWith('regles-verite-aseryn-')&&!String(page.id||'').startsWith('regles-verite-exile-')&&!String(page.id||'').startsWith('regles-verite-extral-')&&!String(page.id||'').startsWith('regles-verite-chasseur-'));

// Corriger les hubs créés lors de la première passe: ils décrivent désormais des pages regroupées.
const talentHub=rules.find(page=>page.title==='Talents de Réalité — règles générales');
if(talentHub){
  for(const section of talentHub.sections||[]) for(const block of section.blocks||[]) if(block.type==='p') block.text=block.text.replace('Chaque Talent possède désormais sa propre page de règle.','Les Talents sont regroupés en quatre pages de règles : communs, expertise, Origine et Sphère.');
}
const disHub=rules.find(page=>page.title==='Désavantages de Réalité — règles générales');
if(disHub){
  for(const section of disHub.sections||[]) for(const block of section.blocks||[]) if(block.type==='p') block.text=block.text.replace('Chaque Désavantage possède désormais sa propre page de règle.','Les Désavantages sont regroupés en trois pages de règles : communs, Attributs et Sphère.');
}

rules=[...rules,...groupedReality,...corePages,...groupedTruth];

const allIds=new Set();
for(const page of [...rules,...reality,...truth]){
  if(!page.id||!page.title||!page.category) throw new Error(`Page invalide: ${JSON.stringify(page)}`);
  if(allIds.has(page.id)) throw new Error(`ID dupliqué après regroupement: ${page.id}`);
  allIds.add(page.id);
}

function writeDataset(id,pages,prefix){
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages)),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++) fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
  return {count:pages.length,parts,sha:spec.sha256};
}
const output=writeDataset('moteur',rules,'v3-regles-v3');
manifest.expectedTotal=manifest.datasets.reduce((sum,spec)=>sum+Number(spec.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');

console.log(`MÉCANIQUES V2 — ${groupedReality.length} pages Réalité regroupées.`);
console.log(`VÉRITÉ BUILDER — ${truthTalents.length} capacités regroupées en ${groupedTruth.length} pages + ${corePages.length} pages de Nature.`);
console.log(`RÈGLES — ${output.count} pages · ${output.parts} fragments · SHA ${output.sha.slice(0,12)}…`);
console.log(`TOTAL V3 — ${manifest.expectedTotal}`);
