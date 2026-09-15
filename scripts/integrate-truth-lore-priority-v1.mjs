import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE='compendium/source/truth-lore-priority-v1.json';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const source=JSON.parse(fs.readFileSync(SOURCE,'utf8'));

function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return normalize(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function writeDataset(id,pages,prefix){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');return spec;
}
function paragraphSection(section){return {id:slug(section.title),title:section.title,level:3,blocks:(section.paragraphs||[]).map(text=>({type:'p',style:'lore',text:String(text).trim()})).filter(block=>block.text)}
function union(...groups){return [...new Set(groups.flat().filter(Boolean))]}
function mechanicsText(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).map(block=>String(block.text||''))).join(' ')}

if(source.schemaVersion!==1||source.sourceDocument!=='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx')throw new Error('Source lore Vérité V6 prioritaire invalide');
if(!Array.isArray(source.cosmology)||source.cosmology.length!==3)throw new Error(`3 pages cosmologiques attendues, ${source.cosmology?.length||0}`);
if(!Array.isArray(source.deities)||source.deities.length!==13)throw new Error(`13 Divinités attendues, ${source.deities?.length||0}`);

const truth=loadDataset('verite');
const legacy=loadDataset('lore');
const originalTruthCount=truth.length;
const legacyIndex=new Map();
for(const page of legacy){for(const key of [page.title]){const n=normalize(key);if(!legacyIndex.has(n))legacyIndex.set(n,[]);legacyIndex.get(n).push(page)}}

const sourceLabel='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx';
const canonicalPages=[];
for(const item of source.cosmology){
  canonicalPages.push({
    id:item.id,title:item.title,aliases:item.aliases||[],category:'Vérité',source:sourceLabel,status:'canon_recent',tags:item.tags||[],
    nav:{group:'Cosmologie & histoire cachée',groupOrder:10,subgroup:'Guerre céleste & puissances divines',subgroupOrder:10,pageOrder:item.title==='Elynea'?10:item.title==='La Guerre céleste'?20:30},
    loreEvidence:{paragraphs:item.evidence||[]},sections:(item.sections||[]).map(paragraphSection)
  });
}
for(const item of source.deities){
  const identity=[`${item.name} est une ancienne Divinité connue dans le V6 sous le titre « ${item.epithet} ». Son domaine couvre ${item.domains}.`,`Ses trois grandes Facettes sont ${item.facets.join(', ').replace(/, ([^,]*)$/,' et $1')}.`,...(item.notes||[])];
  const sections=[paragraphSection({title:'Identité et domaines',paragraphs:identity})];
  if((item.houses||[]).length)sections.push(paragraphSection({title:'Maisonnées et cultures de service',paragraphs:item.houses.map(([name,focus,culture])=>`${name} — ${focus}. ${culture}`)}));
  canonicalPages.push({
    id:item.id,title:item.name,aliases:item.aliases||[],category:'Vérité',source:sourceLabel,status:'canon_recent',tags:['Vérité','Daemons','Divinité',item.name,'Lore V6'],
    nav:{group:'Natures, peuples & traditions',groupOrder:20,subgroup:'Daemons — Divinités',subgroupOrder:14,pageOrder:100},
    loreEvidence:{chapter:'14. Daemons'},sections
  });
}

const ids=new Set([...truth,...legacy].map(page=>page.id));
const titleIndex=new Map();
for(const page of truth){const n=normalize(page.title);if(!titleIndex.has(n))titleIndex.set(n,[]);titleIndex.get(n).push(page)}
let added=0,updated=0;
for(const canonical of canonicalPages){
  const keys=union([canonical.title],canonical.aliases).map(normalize);
  const legacyMatches=union(...keys.map(key=>(legacyIndex.get(key)||[]).map(page=>page.id)));
  if(legacyMatches.length)throw new Error(`${canonical.title}: page legacy homonyme à migrer explicitement avant intégration (${legacyMatches.join(', ')})`);
  const matches=union(...keys.map(key=>(titleIndex.get(key)||[]).map(page=>page.id))).map(id=>truth.find(page=>page.id===id));
  if(matches.length>1)throw new Error(`${canonical.title}: plusieurs pages Vérité correspondent (${matches.map(page=>page.id).join(', ')})`);
  if(matches.length===1){
    const page=matches[0];
    const replacementTitles=new Set(canonical.sections.map(section=>normalize(section.title)));
    const preserved=(page.sections||[]).filter(section=>!replacementTitles.has(normalize(section.title)));
    page.title=canonical.title;page.category='Vérité';page.source=sourceLabel;page.status='canon_enrichi';page.tags=union(page.tags||[],canonical.tags);page.nav=canonical.nav;page.loreEvidence=canonical.loreEvidence;
    page.sections=[...canonical.sections,...preserved];updated++;
  }else{
    if(ids.has(canonical.id))throw new Error(`${canonical.title}: ID déjà utilisé ${canonical.id}`);
    const page={...canonical};delete page.aliases;truth.push(page);ids.add(page.id);added++;
    const n=normalize(page.title);if(!titleIndex.has(n))titleIndex.set(n,[]);titleIndex.get(n).push(page);
  }
}

const targetTitles=new Set(canonicalPages.map(page=>normalize(page.title)));
for(const title of targetTitles){const matches=truth.filter(page=>normalize(page.title)===title);if(matches.length!==1)throw new Error(`Lore V6: ${title} apparaît ${matches.length} fois dans Vérité`)}
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\bdifficult[eé]\s*\d+|\b1\s*\/\s*(?:sc[eè]ne|sc[eé]nario)\b|\+\d+\s*(?:Armure|Protection|DGT)|\bD[eé]fense occulte\b/i;
for(const page of truth.filter(page=>(page.tags||[]).includes('Lore V6'))){const text=mechanicsText(page);if(forbidden.test(text))throw new Error(`${page.title}: mécanique détectée dans le lore prioritaire`);if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table mécanique interdite dans le lore prioritaire`)}

const written=writeDataset('verite',truth,'v3-verite-lore-v2');
manifest.expectedTotal=manifest.datasets.reduce((sum,dataset)=>sum+Number(dataset.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`LORE VÉRITÉ PRIORITAIRE — ${canonicalPages.length} pages canoniques · ${added} ajoutées · ${updated} enrichies.`);
console.log(`VÉRITÉ — ${originalTruthCount} -> ${truth.length} pages · ${written.parts} fragments · total V3 ${manifest.expectedTotal}.`);
