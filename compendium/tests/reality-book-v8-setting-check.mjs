import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data',BATCH='reality-setting-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function flat(page){return [page.title,...(page.sections||[]).flatMap(s=>[s.title,...(s.blocks||[]).map(b=>b.text||'')])].join(' ')}
function byId(pages,id){const page=pages.find(p=>p.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function requireText(page,...needles){const text=flat(page);for(const needle of needles)if(!text.includes(needle))throw new Error(`${page.id}: élément V8 absent (${needle})`)}

const reality=load('realite'),batch=reality.filter(p=>p.realityBook?.batch===BATCH);
if(batch.length!==9)throw new Error(`Lot Réalité V8 incomplet: ${batch.length}/9`);
if(reality.length<29)throw new Error(`Réalité: ${reality.length} pages, au moins 29 attendues après le premier lot book-first`);
const hub=byId(batch,'realite-001-chapitre-vivre-en-grande-californie');
requireText(hub,'Quinze années','territoire en strates','mégacorporations','Underlife');
requireText(byId(batch,'realite-lore-gouvernement-institutions'),'Dina Page','Grande Réserve','Cour suprême californienne');
requireText(byId(batch,'realite-lore-laus-securite'),'Catalina de la Caza','Surveillance','Investigation','Intervention','CBAC','CNAD','CBII');
requireText(byId(batch,'realite-lore-corporations'),'Vivre sous contrat','Eversor','Armacorpos','Bankcorpos');
requireText(byId(batch,'realite-lore-pegre'),'Comité général du Crime','Table des Mafias');
requireText(byId(batch,'realite-lore-religions'),'Église chrétienne réunifiée','religions');
requireText(byId(batch,'realite-lore-crawlers-underlife'),'Crawlers','Underlife');
requireText(byId(batch,'realite-lore-vie-materielle-2035'),'Se loger','Manger','Se déplacer','Holonet','Santé','Consommer, s’abonner, s’endetter');
requireText(byId(batch,'realite-lore-identite-culture-information'),'Mode, apparence','Loisirs, culture','Information, publicité','Une génération entre deux mondes','Une journée parfaitement ordinaire');
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b/i;
for(const page of batch){
  if(page.category!=='Réalité'||page.source!=='TUC_Realite_V8_LIVRE_JDR_PAO_RESPIRATION_TOC_2026-09-09.docx')throw new Error(`${page.id}: source/catégorie incohérente`);
  if(forbidden.test(flat(page)))throw new Error(`${page.id}: mécanique résiduelle dans le lore`);
  if((page.sections||[]).some(s=>(s.blocks||[]).some(b=>b.type==='table')))throw new Error(`${page.id}: table interdite dans le lore setting`);
}
const all=manifest.datasets.flatMap(d=>load(d.id));const ids=new Set();for(const page of all){if(ids.has(page.id))throw new Error(`ID dupliqué: ${page.id}`);ids.add(page.id)}
if(ids.size!==manifest.expectedTotal)throw new Error(`IDs uniques ${ids.size}/${manifest.expectedTotal}`);
console.log(`RÉALITÉ V8 SETTING OK — 9 pages book-first · Réalité ${reality.length} · ${ids.size} IDs uniques.`);
