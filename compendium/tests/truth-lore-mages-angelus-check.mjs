import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function textOf(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])).join(' ')}

const truth=loadDataset('verite');
const legacy=loadDataset('lore');
if(truth.length!==78)throw new Error(`Vérité: ${truth.length}, attendu 78`);
const pages=truth.filter(page=>page.loreBook?.batch==='mages-angelus-v1');
if(pages.length!==2)throw new Error(`2 hubs Mages/Angelus book-first attendus, ${pages.length}`);
const expected=new Map([['13. Mages',10],['15. Angelus',10]]);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|\bco[uû]t\s*[:—-]|TUC Talent/i;
for(const [title,minSections] of expected){
  const matches=pages.filter(page=>page.title===title);
  if(matches.length!==1)throw new Error(`${title}: ${matches.length} page(s), attendu 1`);
  const page=matches[0];
  if((page.sections||[]).length<minSections)throw new Error(`${title}: ${(page.sections||[]).length} sections, minimum ${minSections}`);
  if(page.source!=='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx')throw new Error(`${title}: source V6 absente`);
  if(page.status!=='canon_recent')throw new Error(`${title}: statut canon récent attendu`);
  if(!page.nav?.group||!page.nav?.subgroup)throw new Error(`${title}: navigation explicite absente`);
  if(forbidden.test(textOf(page)))throw new Error(`${title}: mécanique détectée`);
  if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${title}: table mécanique interdite`);
}
const mage=pages.find(page=>page.title==='13. Mages');
for(const heading of ['Le Mageius','La Guerre de la Magie','La Roue magique et ses cinq portes','Les Loges','La technologie comme nouvel alphabet magique'])if(!(mage.sections||[]).some(section=>section.title===heading))throw new Error(`Mage: section manquante ${heading}`);
const angelus=pages.find(page=>page.title==='15. Angelus');
for(const heading of ['Des créations d’Aèr','La Guerre céleste et la religion humaine','L’Arbre de Vie','Les dix Sephiroth','Archanges, Séraphins et dissidences'])if(!(angelus.sections||[]).some(section=>section.title===heading))throw new Error(`Angelus: section manquante ${heading}`);
console.log(`LORE MAGES/ANGELUS V6 OK — 2 hubs denses · corpus Vérité ${truth.length} · lore consolidé ${legacy.length} · aucune mécanique.`);
