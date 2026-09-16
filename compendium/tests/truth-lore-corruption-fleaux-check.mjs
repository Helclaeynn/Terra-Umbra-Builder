import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const BATCH='corruption-fleaux-v1';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function flat(page){return [page?.title||'',...(page?.sections||[]).flatMap(section=>[section.title||'',...(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])])].join(' ')}
function byId(pages,id){const page=pages.find(item=>item.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function requireText(page,...needles){const text=flat(page);for(const needle of needles)if(!text.includes(needle))throw new Error(`${page.id}: contexte attendu absent (${needle})`)}

const truth=load('verite'),legacy=load('lore');
if(truth.length!==78)throw new Error(`Vérité: ${truth.length} pages, attendu 78`);
const touchedTruth=truth.filter(page=>page.loreBook?.batch===BATCH);
const touchedLegacy=legacy.filter(page=>page.loreBook?.batch===BATCH);
if(touchedTruth.length!==2||touchedLegacy.length!==8)throw new Error(`Lot Corruption/Fléaux incomplet: ${touchedTruth.length}+${touchedLegacy.length}`);

const expectedTruth=['verite-056-20-corruption','verite-057-21-les-six-fleaux-et-le-faux-septieme'];
const expectedLegacy=['lore-plagues-contexte','lore-plagues-vhodhal-nactru','lore-plagues-mloxol-vaagor','lore-plagues-uxsharith-bellatheis','lore-plagues-cthath-vhadhi','lore-plagues-gajh-shaoggith','lore-plagues-kthuhuthlul','lore-plagues-delanial'];
for(const id of expectedTruth)byId(touchedTruth,id);
for(const id of expectedLegacy)byId(touchedLegacy,id);

const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;
for(const page of [...touchedTruth,...touchedLegacy]){
  if(page.category!=='Vérité')throw new Error(`${page.id}: catégorie ${page.category}`);
  if(page.source!=='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx')throw new Error(`${page.id}: source V6 incorrecte`);
  if(forbidden.test(flat(page)))throw new Error(`${page.id}: mécanique résiduelle`);
  if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.id}: table mécanique interdite`);
}

const corruption=byId(truth,'verite-056-20-corruption');
if((corruption.sections||[]).length<14)throw new Error('Corruption: hub trop mince');
requireText(corruption,'Humanité','Intégrité','Une seule Source dominante','La Rupture','Calamitechnologie','hérédité automatique');
const hub=byId(truth,'verite-057-21-les-six-fleaux-et-le-faux-septieme');
if((hub.sections||[]).length<12)throw new Error('Six Fléaux: hub trop mince');
for(const needle of ['Vhodhal','V’Aagor','Ux’Sharith','C’Thath Vhadhi','Gajh’Shaoggith','Thul','Delanial n’est pas un septième Fléau'])requireText(hub,needle);

const six=[
  ['lore-plagues-vhodhal-nactru','Vhodhal — la Famine Blanche',10],
  ['lore-plagues-mloxol-vaagor','V’Aagor — la Sombre-Vérité',20],
  ['lore-plagues-uxsharith-bellatheis','Ux’Sharith Bellatheis — la Division',30],
  ['lore-plagues-cthath-vhadhi','C’Thath Vhadhi — la Métastase',40],
  ['lore-plagues-gajh-shaoggith','Gajh’Shaoggith — la Germination',50],
  ['lore-plagues-kthuhuthlul','Thul — la Fixation',60],
];
for(const [id,title,order] of six){
  const page=byId(legacy,id);
  if(page.title!==title)throw new Error(`${id}: titre ${page.title}`);
  if(page.nav?.group!=='Corruption & Fléaux'||page.nav?.groupOrder!==40||page.nav?.subgroup!=='Les six Fléaux'||page.nav?.pageOrder!==order)throw new Error(`${id}: navigation incohérente`);
  if((page.sections||[]).length<8)throw new Error(`${id}: fiche trop mince`);
}
requireText(byId(legacy,'lore-plagues-vhodhal-nactru'),'Chien de la Reine','Loge d’Écume');
requireText(byId(legacy,'lore-plagues-mloxol-vaagor'),'Fragments et autonomie','Deimonisme');
requireText(byId(legacy,'lore-plagues-uxsharith-bellatheis'),'Le prisme','Nucléomancie');
requireText(byId(legacy,'lore-plagues-cthath-vhadhi'),'L’Éden Gris','La Finalité');
requireText(byId(legacy,'lore-plagues-gajh-shaoggith'),'Mo’sen','collectivement corrompus','Tiamat');
requireText(byId(legacy,'lore-plagues-kthuhuthlul'),'Thul n’est pas libéré','endormi ou emprisonné sous Mû','Telipinu');

const delanial=byId(legacy,'lore-plagues-delanial');
if(delanial.title!=='Delanial — Légionnaire des Puissances')throw new Error(`Delanial: titre incohérent ${delanial.title}`);
if(delanial.nav?.group!=='Corruption & Fléaux'||delanial.nav?.groupOrder!==40||delanial.nav?.subgroup!=='Puissances hors classification')throw new Error('Delanial: navigation incohérente');
requireText(delanial,'Delanial n’est pas un Fléau','Légionnaire des Puissances','Il ne constitue ni une septième Source','Père de l’Ombre','Anahita','Morrighan');
if(/\bsept\s+Fléaux\b/i.test(flat(delanial)))throw new Error('Delanial: formulation à sept Fléaux détectée');

const all=manifest.datasets.flatMap(spec=>load(spec.id));
const ids=new Set();for(const page of all){if(ids.has(page.id))throw new Error(`ID V3 dupliqué: ${page.id}`);ids.add(page.id)}
if(ids.size!==manifest.expectedTotal)throw new Error(`IDs uniques ${ids.size}/${manifest.expectedTotal}`);

console.log(`CORRUPTION/FLÉAUX LORE OK — 2 hubs + 6 Fléaux + contexte + Delanial · ${ids.size} IDs uniques · total V3 ${manifest.expectedTotal}.`);
