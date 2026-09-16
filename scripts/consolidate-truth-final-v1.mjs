import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){if(!prefix)return;for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){const spec=specFor(id),old=spec.prefix;removePrefix(old);if(prefix!==old)removePrefix(prefix);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');const size=8000,parts=Math.ceil(b64.length/size);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});return spec}
function clone(value){return JSON.parse(JSON.stringify(value))}
function blockText(block){if(block?.type==='table')return (block.rows||[]).flat().join(' ');return String(block?.text||'')}
function sectionText(section){return (section?.blocks||[]).map(blockText).join(' ').replace(/\s+/g,' ').trim()}
function pageText(page){return (page?.sections||[]).map(sectionText).join(' ')}
function findPage(pages,title){const page=pages.find(p=>norm(p.title)===norm(title));if(!page)throw new Error(`Page absente: ${title}`);return page}
function findSection(page,title){return (page?.sections||[]).find(s=>norm(s.title)===norm(title))||null}
function appendSection(page,{id,title,blocks,level=3}){if((page.sections||[]).some(s=>s.id===id))return false;page.sections=page.sections||[];page.sections.push({id,title,level,blocks:clone(blocks||[])});return true}
function pBlocks(text){return [{type:'p',style:'lore',text:String(text).trim()}]}
function uniqueId(base,all){let id=base,n=2;while(all.has(id))id=`${base}-${n++}`;all.add(id);return id}

let truth=load('verite');
let lore=load('lore');
let pnj=load('pnj');
let rules=load('moteur');
const catalogue=load('verite-catalogue');
const equipment=load('equipement');
const allIds=new Set([...truth,...lore,...pnj,...rules,...catalogue,...equipment].map(p=>p.id));

const hunterIds=Array.from({length:16},(_,i)=>`lore-${String(167+i).padStart(3,'0')}-verite-les-chasseurs-${String(i+1).padStart(2,'0')}`);
const speciesIds=Array.from({length:9},(_,i)=>`lore-${String(205+i).padStart(3,'0')}-verite-les-especes-fantastiques-${String(i+1).padStart(2,'0')}`);
const meetingIds=Array.from({length:7},(_,i)=>`lore-${String(81+i).padStart(3,'0')}-points-de-rencontre-${String(i+1).padStart(2,'0')}`);
const retiredLoreIds=new Set([
  ...hunterIds,...speciesIds,...meetingIds,
  'lore-extraterrestrial-species-contexte-general',
  'lore-supernatural-species-contexte-general',
  'lore-supernatural-species-atlantes',
]);
const transitoryTruthIds=new Set([
  'verite-058-22-proprietes-communes-des-equipements-de-verite',
  'verite-059-23-equipement-de-chasse',
  'verite-060-24-marche-de-verite-des-exiles',
  'verite-061-25-marche-xeno',
  'verite-062-26-arsenal-aidh-moderne-et-doctrine-terra-umbra',
  'verite-063-27-equipement-corrompu-et-calamitechnologie',
]);

const hunterPages=hunterIds.map(id=>lore.find(p=>p.id===id)).filter(Boolean);
const speciesPages=speciesIds.map(id=>lore.find(p=>p.id===id)).filter(Boolean);
const meetingPages=meetingIds.map(id=>lore.find(p=>p.id===id)).filter(Boolean);
const firstPass=hunterPages.length||speciesPages.length||meetingPages.length||truth.some(p=>transitoryTruthIds.has(p.id));

// 1) Recomposer les sept fragments « Points de rencontre » en une seule page exploitable.
if(meetingPages.length){
  const blocks=[];
  for(const page of meetingPages){for(const section of page.sections||[]){for(const block of section.blocks||[])blocks.push(clone(block))}}
  const replacement={
    id:'verite-lore-points-de-rencontre',title:'Points de rencontre du monde caché',category:'Vérité',source:'Points de rencontre.pdf',status:'source_detaillee',
    tags:['Vérité','Lore détaillé','Points de rencontre','Monde caché'],
    nav:{group:'Entrer dans la Vérité',groupOrder:15,subgroup:'Lieux et réseaux du monde caché',subgroupOrder:30,pageOrder:10},
    legacyConsolidation:{batch:'truth-final-v1',sources:meetingIds},
    sections:[{id:'reseau-des-points-de-rencontre',title:'Le réseau des points de rencontre',level:2,blocks}]
  };
  const existing=lore.findIndex(p=>p.id===replacement.id);if(existing>=0)lore[existing]=replacement;else {lore.push(replacement);allIds.add(replacement.id)}
}

// 2) Sauver le lore institutionnel des Chasseurs dans une page thématique unique.
const hunterArchiveSpec=[
  ['lore-167-verite-les-chasseurs-01','Association des Chasseurs — histoire et portée',['Histoire','Fonctionnement','Portée']],
  ['lore-170-verite-les-chasseurs-04','Xenoshield — histoire',['Histoire']],
  ['lore-172-verite-les-chasseurs-06','Apocalyptistes et chasseurs monastiques',['Contenu du dossier']],
  ['lore-174-verite-les-chasseurs-08','Assassins — accords et réseaux',['Contenu du dossier']],
  ['lore-175-verite-les-chasseurs-09','Traditions hindoues de Chasse',['Portée']],
  ['lore-176-verite-les-chasseurs-10','Shientaïsme et traditions chinoises',['Contenu du dossier','Portée']],
  ['lore-177-verite-les-chasseurs-11','Lignées familiales et Kabbalistes',['Contenu du dossier','Fonctionnement']],
  ['lore-179-verite-les-chasseurs-13','Traditions bibliques de Chasse',['Contenu du dossier','Fonctionnement']],
  ['lore-180-verite-les-chasseurs-14','Chasseurs xénos et réseaux galactiques',['Contenu du dossier']],
  ['lore-181-verite-les-chasseurs-15','Sons of Night et protection des Exilés',['Contenu du dossier']],
  ['lore-182-verite-les-chasseurs-16','Les Lavandières',['Contenu du dossier']],
];
if(hunterPages.length){
  const sections=[];
  for(const [pageId,title,names] of hunterArchiveSpec){const page=hunterPages.find(p=>p.id===pageId);if(!page)continue;const blocks=[];for(const name of names){const section=findSection(page,name);if(section)blocks.push(...clone(section.blocks||[]))}if(blocks.length)sections.push({id:`archive-${slug(title)}`,title,level:3,blocks})}
  const replacement={id:'verite-lore-traditions-chasseurs-detaillees',title:'Traditions et réseaux de Chasseurs',category:'Vérité',source:'TUC_Vérité_ les chasseurs.docx',status:'source_detaillee',tags:['Vérité','Chasseurs','Traditions','Lore détaillé'],nav:{group:'Chasseurs & traditions',groupOrder:30,subgroup:'Traditions et réseaux',subgroupOrder:20,pageOrder:20},legacyConsolidation:{batch:'truth-final-v1',sources:hunterIds},sections};
  const existing=lore.findIndex(p=>p.id===replacement.id);if(existing>=0)lore[existing]=replacement;else {lore.push(replacement);allIds.add(replacement.id)}
}

// 3) Migrer quelques blocs de lore legacy vraiment utiles vers les pages canoniques récentes.
function migrateLegacySection(sourceId,sectionTitle,targetPages,targetTitle,newId,newTitle){const src=lore.find(p=>p.id===sourceId);if(!src)return false;const section=findSection(src,sectionTitle);if(!section)return false;const target=findPage(targetPages,targetTitle);return appendSection(target,{id:newId,title:newTitle,blocks:section.blocks||[]})}
migrateLegacySection('lore-supernatural-species-atlantes','Organisation',truth,'16. Aseryns','legacy-final-aseryn-organisation','Organisation terrestre — héritage détaillé');
migrateLegacySection('lore-supernatural-species-atlantes','Récurrences',truth,'16. Aseryns','legacy-final-aseryn-recurrences','Présence et récurrences dans le monde moderne');
migrateLegacySection('lore-supernatural-species-contexte-general','Khinae',truth,'12. Autres descendants de Khinae','legacy-final-khinae-heritage','Khinae — mémoire des lignées anciennes');
migrateLegacySection('lore-205-verite-les-especes-fantastiques-01','Les grandes organisations',truth,'17. Exilés — peuples, fonctions et traditions','legacy-final-exiles-organisations','Grandes organisations des Exilés sur Terre');
migrateLegacySection('lore-205-verite-les-especes-fantastiques-01','Le conseil des Anciens',truth,'17. Exilés — peuples, fonctions et traditions','legacy-final-exiles-conseil','Le Conseil des Anciens');
const page213=lore.find(p=>p.id==='lore-213-verite-les-especes-fantastiques-09');if(page213){const dossier=findSection(page213,'Contenu du dossier');if(dossier)appendSection(findPage(truth,'17. Exilés — peuples, fonctions et traditions'),{id:'legacy-final-exiles-conseil-2035',title:'Le Conseil des Anciens en 2035',blocks:dossier.blocks||[]})}
const page207=lore.find(p=>p.id==='lore-207-verite-les-especes-fantastiques-03');if(page207){appendSection(findPage(truth,'Whurtens'),{id:'legacy-final-whurtens-nibelungen-duergars',title:'Nibelungen et Duergars sur Terre',blocks:pBlocks('Sur Terre, les descendants des clans Belentrin, Farar et Valik ont longtemps refusé de fusionner avec les Gilordin, Kilmorel et Vonrim. De cette division sont nées les appellations Nibelungen pour les Whurtens vivant à la surface et Duergars pour les lignées troglodytes.')})}
const page212=lore.find(p=>p.id==='lore-212-verite-les-especes-fantastiques-08');if(page212){const dossier=findSection(page212,'Contenu du dossier');if(dossier)appendSection(findPage(lore,'Autres créatures'),{id:'legacy-final-dragons-culture',title:'Dragons — culture contemporaine',blocks:dossier.blocks||[]})}

// 4) Extraire les personnages des anciens dossiers dans le dataset Personnages.
const metaTitles=new Set(['contenu du dossier','chronologie','contexte','histoire','fonctionnement','portee','informations generales','les grandes organisations','le conseil des anciens']);
const genericTitles=new Set(['?','le chevalier','le baron','l homoncule','le porteur de lumiere','hell soldier']);
function explicitName(text){const flat=String(text||'').replace(/\s+/g,' ').trim();for(const re of [/Nom de la Réalité\s*:\s*(.+?)(?=\s+Nom de la Vérité\s*:|\s+Age\s*:|\s+Affiliations\s*:|\s+Nationalité\s*:|\s+Ethnie\s*:|$)/i,/\bNom\s*:\s*(.+?)(?=\s+Age\s*:|\s+Affiliations\s*:|\s+Nationalité\s*:|$)/i]){const m=flat.match(re);if(m&&m[1].trim().length>2&&m[1].trim().length<90)return m[1].trim()}return null}
function upsertPnj(name,sourcePage,blocks,label='Dossier Vérité migré'){
  name=String(name||'').trim();if(!name||name==='?'||metaTitles.has(norm(name)))return null;
  let page=pnj.find(p=>norm(p.title)===norm(name));
  if(!page){const id=uniqueId(`pnj-truth-${slug(name)}`,allIds);page={id,title:name,category:'Personnages',source:sourcePage.source||'Lore Vérité legacy',status:'source_detaillee',tags:['Personnage','Vérité','Lore legacy migré'],sections:[]};pnj.push(page)}
  const id=`truth-legacy-${slug(sourcePage.id)}-${slug(label)}`;
  if(!(page.sections||[]).some(s=>s.id===id))page.sections=(page.sections||[]).concat([{id,title:label,level:3,blocks:clone(blocks||[])}]);
  return page;
}
for(const page of [...hunterPages,...speciesPages]){
  for(const section of page.sections||[]){const title=String(section.title||'').trim(),key=norm(title);if(metaTitles.has(key))continue;const text=sectionText(section);let name=explicitName(text)||title;if(title==='?'&&!explicitName(text))continue;if(genericTitles.has(key)&&!explicitName(text))name=title;upsertPnj(name,page,section.blocks||[],`Dossier Vérité — ${title}`)}
}
const dossierPersonMap=new Map([
  ['lore-169-verite-les-chasseurs-03','Tiamandra VECELLIO'],
  ['lore-170-verite-les-chasseurs-04','Moloch'],
  ['lore-171-verite-les-chasseurs-05','Neera Athren'],
  ['lore-178-verite-les-chasseurs-12','Valle Von Hardenberg'],
  ['lore-206-verite-les-especes-fantastiques-02','Alayna Daewynn'],
  ['lore-207-verite-les-especes-fantastiques-03','Roberrik'],
  ['lore-210-verite-les-especes-fantastiques-06','Kran’rag'],
  ['lore-211-verite-les-especes-fantastiques-07','Sylvia Rose'],
]);
for(const [pageId,name] of dossierPersonMap){const page=[...hunterPages,...speciesPages].find(p=>p.id===pageId);const section=page&&findSection(page,'Contenu du dossier');if(section)upsertPnj(name,page,section.blocks||[],'Contexte détaillé migré')}

// 5) Sortir les chapitres 22–27 de Vérité : règles -> Règles, marchés/doctrine -> lore, objets -> Catalogue.
const transitory=new Map(truth.filter(p=>transitoryTruthIds.has(p.id)).map(p=>[p.id,p]));
const catalogTitles=new Set(catalogue.map(p=>norm(p.title)));
function upsertRule(id,title,sections,pageOrder){let page=rules.find(p=>p.id===id);const body={id,title,category:'Règles',source:'TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx',status:'canon_recent',tags:['Règles','Vérité','Équipement de Vérité'],nav:{group:'Vérité — Règles communes',groupOrder:70,subgroup:'Équipement de Vérité',subgroupOrder:30,pageOrder},truthFinalCleanup:{batch:'truth-final-v1'},sections:clone(sections)};if(page)Object.assign(page,body);else {rules.push(body);allIds.add(id)}return body}
const ch22=transitory.get('verite-058-22-proprietes-communes-des-equipements-de-verite');if(ch22)upsertRule('rules-truth-equipment-properties','Équipement de Vérité — propriétés communes',ch22.sections||[],100);
const ch23=transitory.get('verite-059-23-equipement-de-chasse');if(ch23)upsertRule('rules-truth-hunter-equipment-reference','Équipement de Chasse — références et propriétés',ch23.sections||[],110);
const ch26=transitory.get('verite-062-26-arsenal-aidh-moderne-et-doctrine-terra-umbra');if(ch26){upsertRule('rules-truth-aidh-arsenal-reference','Arsenal AIDH — doctrine matérielle et références',ch26.sections||[],120);appendSection(findPage(lore,'AIDH'),{id:'legacy-final-aidh-doctrine',title:'Doctrine matérielle et dotation',blocks:(ch26.sections||[]).filter(s=>['Préambule','Dotation et accès','Conventions techniques'].includes(s.title)).flatMap(s=>clone(s.blocks||[]))})}
const ch27=transitory.get('verite-063-27-equipement-corrompu-et-calamitechnologie');if(ch27){const tableSections=(ch27.sections||[]).map(s=>({...clone(s),blocks:(s.blocks||[]).filter(b=>b.type==='table').map(clone)})).filter(s=>s.blocks.length);if(tableSections.length)upsertRule('rules-truth-corrupted-equipment-reference','Équipement corrompu et Calamitechnologie — référence',tableSections,130);const loreBlocks=(ch27.sections||[]).flatMap(s=>(s.blocks||[]).filter(b=>b.type!=='table').map(clone));if(loreBlocks.length)appendSection(findPage(truth,'20. Corruption'),{id:'legacy-final-corruption-equipment',title:'Objets corrompus et Calamitechnologie — usages',blocks:loreBlocks})}
const ch24=transitory.get('verite-060-24-marche-de-verite-des-exiles');if(ch24){const market=findSection(ch24,'Où acheter ?');if(market)appendSection(findPage(truth,'17. Exilés — peuples, fonctions et traditions'),{id:'legacy-final-exiles-market',title:'Marchés, Jadecenters et ateliers whurtens',blocks:market.blocks||[]});for(const s of ch24.sections||[]){if(['Utiliser ce catalogue','Où acheter ?'].includes(s.title))continue;if(!catalogTitles.has(norm(s.title)))throw new Error(`Chapitre 24: objet sans fiche Catalogue Vérité: ${s.title}`)}}
const ch25=transitory.get('verite-061-25-marche-xeno');if(ch25){const market=findSection(ch25,'Les marchés');if(market)appendSection(findPage(truth,'18. Extrals, Homo Superior et Ad’rak'),{id:'legacy-final-xeno-market',title:'Marchés xénos en Grande Californie',blocks:market.blocks||[]});for(const s of ch25.sections||[]){if(['Utiliser ce catalogue','Les marchés'].includes(s.title))continue;if(!catalogTitles.has(norm(s.title)))throw new Error(`Chapitre 25: objet sans fiche Catalogue Vérité: ${s.title}`)}}

// Vérifier les références d’armes du chapitre 23 contre Catalogue Vérité ou Équipement Réalité lorsque possible.
if(ch23){const known=new Set([...catalogue,...equipment].map(p=>norm(p.title)));const table=findSection(ch23,'Armes existantes utiles à la Chasse');for(const block of table?.blocks||[]){if(block.type!=='table')continue;for(const row of block.rows||[]){const name=String(row?.[0]||'').trim();if(!name||/^arme$/i.test(name))continue;if(!known.has(norm(name)))console.warn(`Référence d’arme conservée en Règles mais non appariée à un titre de catalogue: ${name}`)}}}

// 6) Retirer définitivement les conteneurs et pages transitoires.
lore=lore.filter(p=>!retiredLoreIds.has(p.id));
truth=truth.filter(p=>!transitoryTruthIds.has(p.id));

// Garde-fous de fermeture.
for(const id of retiredLoreIds)if(lore.some(p=>p.id===id))throw new Error(`Scorie legacy encore présente: ${id}`);
for(const id of transitoryTruthIds)if(truth.some(p=>p.id===id))throw new Error(`Page transitoire encore présente: ${id}`);
for(const title of ['Points de rencontre du monde caché','Traditions et réseaux de Chasseurs'])if(!lore.some(p=>p.title===title))throw new Error(`Page consolidée absente: ${title}`);
for(const title of ['Équipement de Vérité — propriétés communes','Équipement de Chasse — références et propriétés','Arsenal AIDH — doctrine matérielle et références','Équipement corrompu et Calamitechnologie — référence'])if(!rules.some(p=>p.title===title))throw new Error(`Référence Règles absente: ${title}`);
const forbiddenLore=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;
for(const page of [...truth,...lore.filter(p=>p.category==='Vérité')])if(forbiddenLore.test(pageText(page)))throw new Error(`Mécanique résiduelle dans le lore Vérité: ${page.id} — ${page.title}`);

writeDataset('moteur',rules,'v3-regles-v6');
writeDataset('verite',truth,'v3-verite-lore-v10');
writeDataset('lore',lore,'v3-lore-v7');
writeDataset('pnj',pnj,'v3-pnj-v2');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`FINAL VÉRITÉ V1 — ${firstPass?'migration':'revalidation'} · Règles ${rules.length} · Vérité ${truth.length} · Lore ${lore.length} · PNJ ${pnj.length} · total ${manifest.expectedTotal}.`);
console.log(`SCORIES RETIRÉES — Chasseurs ${hunterIds.length} · espèces fantastiques ${speciesIds.length} · contextes 2 · points de rencontre 7→1 · hub Aseryn legacy 1 · pages 22–27 ${transitoryTruthIds.size}.`);
