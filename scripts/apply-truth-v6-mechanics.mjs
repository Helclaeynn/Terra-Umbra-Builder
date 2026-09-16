import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE='compendium/source';
const MANIFEST_SOURCE=`${SOURCE}/truth-mechanics-v6-fixed.manifest.json`;
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return normalize(value).replace(/\s+/g,'-')||'item'}
function clean(value){return value==null?'':String(value).trim()}
function cleanPrice(value){return clean(value).replace(/\s*[—–-]\s*\d+\s*PTV\b.*$/i,'').trim()}
function specFor(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function walkArrays(root){const rows=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&entry.name.endsWith('.json')){const parsed=JSON.parse(fs.readFileSync(full,'utf8'));if(Array.isArray(parsed))for(const item of parsed)if(item&&item.name)rows.push({...item,__file:full.replaceAll('\\','/')})}}}walk(root);return rows}
function asObject(card,columns){if(!Array.isArray(card))return card||{};const out={};for(let i=0;i<card.length;i++)out[String(columns[i]??i)]=card[i];return out}
function mechanicTitle(value){
  let title=clean(value).replace(/\s*[—–-]\s*\d+\s*PTV\b.*$/i,'');
  const markers=[/(?=Acc[eè]s\s*:)/i,/(?=Profil\s*:)/i,/(?=Condition\s*:)/i,/(?=D[eé]finition\s*:)/i,/(?=Aspect\s*:)/i,/(?=Nature\s*:)/i,/(?=Culture de Maisonn[eé]e\s*:)/i,/(?=Bonus de Transcendance\s*:)/i,/(?=Ailes\s*:)/i,/(?=SR\s*:)/i,/(?=Limite\s*:)/i,/(?=Principe\s*:)/i,/(?=Difficult[eé] de base\s*:)/i,/(?=Contrecoup imm[eé]diat\s*:)/i,/(?=Ma[iî]trise min\.\s*:)/i,/(?=Test de r[eé]sistance\s*:)/i];
  let cut=title.length;for(const marker of markers){const match=title.match(marker);if(match&&match.index<cut)cut=match.index}
  return title.slice(0,cut).trim().replace(/[|•—–-]+\s*$/,'').trim();
}
function mechanicBody(rawTitle,title,text){
  const raw=clean(rawTitle),body=clean(text);let remainder=raw;
  if(title&&raw.startsWith(title))remainder=raw.slice(title.length).trim().replace(/^[|•—–-]+\s*/,'').trim();
  const chunks=[];
  if(remainder)chunks.push(remainder);
  if(body&&!chunks.some(chunk=>normalize(chunk)===normalize(body))&&!normalize(remainder).includes(normalize(body)))chunks.push(body);
  return chunks.join('\n').trim()||raw;
}
function truthDomain(row){const file=row.__file;if(file.includes('/vampire/'))return'10';if(file.includes('/garou/'))return'11';if(file.endsWith('/mage.json'))return'13';if(file.endsWith('/daemon.json'))return'14';if(file.endsWith('/angelus.json'))return'15';if(file.includes('/aseryn/'))return'16';if(file.includes('/exile/'))return'17';if(file.includes('/extral/'))return'18';return''}

const sourceManifest=JSON.parse(fs.readFileSync(MANIFEST_SOURCE,'utf8'));let sourceB64='';for(const part of sourceManifest.parts)sourceB64+=fs.readFileSync(`${SOURCE}/${part}`,'utf8').replace(/\s+/g,'');
const sourceHash=crypto.createHash('sha256').update(Buffer.from(sourceB64,'utf8')).digest('hex');if(sourceHash!==sourceManifest.sha256)throw new Error(`SHA Vérité V6 invalide: ${sourceHash}`);
const decoded=JSON.parse(zlib.gunzipSync(Buffer.from(sourceB64,'base64')).toString('utf8'));if(!Array.isArray(decoded.entries)||decoded.entries.length!==882)throw new Error(`Vérité V6: ${decoded.entries?.length||0} cartes, attendu 882`);
const cards=decoded.entries.map((raw,index)=>{const card=asObject(raw,decoded.columns||[]),rawTitle=clean(card.title),title=mechanicTitle(rawTitle);return{index:index+1,chapter:clean(card.chapter),h3:clean(card.heading3),h4:clean(card.heading4),h5:clean(card.heading5),rawTitle,title,text:clean(card.text),body:mechanicBody(rawTitle,title,card.text)}});

const builder=walkArrays('character-builder/rulesets/terra-umbra/truth/talents');if(builder.length!==347)throw new Error(`Builder Vérité: ${builder.length}, attendu 347`);
const builderNamesByChapter=new Map();for(const row of builder){const chapter=truthDomain(row);if(!chapter)continue;if(!builderNamesByChapter.has(chapter))builderNamesByChapter.set(chapter,new Set());builderNamesByChapter.get(chapter).add(normalize(row.name))}
function builderCovered(card){
  if(!['10','11','13','16','17'].includes(card.chapter))return false;
  if(card.chapter==='13'&&!['Capacités et Talents communs','Progression par Points de Vérité'].includes(card.h3))return false;
  return builderNamesByChapter.get(card.chapter)?.has(normalize(card.title))||false;
}

let rules=loadDataset('moteur');
const inserted=new Set(),covered=new Set();
for(const card of cards)if(builderCovered(card))covered.add(card.index);
const pending=cards.filter(card=>!covered.has(card.index));

function findPage(...titles){const wanted=titles.map(normalize);return rules.find(page=>wanted.includes(normalize(page.title)))}
function sourceSectionTitle(card){return [card.h4,card.h5].filter(Boolean).map(cleanPrice).join(' › ')||cleanPrice(card.h3)||'Mécaniques V6'}
function rowFor(card){return[card.title,card.body]}
function appendCards(page,sectionTitle,items){
  if(!page)throw new Error(`Page cible absente pour ${sectionTitle}`);
  if(!items.length)return;
  let section=(page.sections||[]).find(sec=>normalize(sec.title)===normalize(sectionTitle));
  if(!section){section={id:`v6-${slug(sectionTitle)}`,title:sectionTitle,level:3,blocks:[]};page.sections=page.sections||[];page.sections.push(section)}
  let table=(section.blocks||[]).find(block=>block.type==='table'&&Array.isArray(block.rows)&&block.rows[0]?.[0]==='Mécanique V6');
  if(!table){table={type:'table',rows:[['Mécanique V6','Texte mécanique source']]};section.blocks=section.blocks||[];section.blocks.push(table)}
  for(const card of items){if(inserted.has(card.index))throw new Error(`Carte V6 insérée deux fois: ${card.index}`);table.rows.push(rowFor(card));inserted.add(card.index)}
}
function newPage(id,title,tags=['Vérité V6']){const page={id:`regles-verite-v6-${id}`,title,category:'Règles',source:'TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx',status:'canon_recent',tags:['Règles','Vérité','Mécanique',...tags],sections:[]};if(rules.some(existing=>existing.id===page.id))throw new Error(`ID V6 dupliqué: ${page.id}`);rules.push(page);return page}
function group(items,keyFn){const map=new Map();for(const item of items){const key=keyFn(item);if(!map.has(key))map.set(key,[]);map.get(key).push(item)}return map}
function take(predicate){return pending.filter(predicate)}

// 10–11 : propriétés gratuites de Nature, jointes aux pages de Nature existantes.
appendCards(findPage('Vampire — règles de Nature'),'Propriétés gratuites de la Nature Vampire',take(c=>c.chapter==='10'));
appendCards(findPage('Garou — règles de Nature'),'Dons gratuits de la Nature Garou',take(c=>c.chapter==='11'));

// 13 : système Mage et exemples regroupés par Affinité.
const mage=take(c=>c.chapter==='13');
appendCards(findPage('Mage — progression par Points de Vérité'),'Compléments V6 de progression',mage.filter(c=>c.h3==='Progression par Points de Vérité'));
const mageNature=mage.filter(c=>['États de Révélation','Mageius et Roue magique'].includes(c.h3));
if(mageNature.length){const page=newPage('mage-nature-revelation-mageius','Mage — Révélation et Mageius',['Mage']);for(const [h3,items] of group(mageNature,c=>c.h3))appendCards(page,h3,items)}
const mageCasting=mage.filter(c=>['Construire et lancer un sort','Tension, Revers et Dormance'].includes(c.h3));
if(mageCasting.length){const page=newPage('mage-lancement-tension-revers','Mage — lancement, Tension et Revers',['Mage']);for(const [key,items] of group(mageCasting,c=>[c.h3,c.h4].filter(Boolean).join(' › ')))appendCards(page,key,items)}
const mageExamples=mage.filter(c=>/Exemples de sorts/i.test(c.h5));
for(const [affinity,items] of group(mageExamples,c=>c.h4)){const page=newPage(`mage-affinite-${slug(affinity)}`,`Mage — ${affinity}`,['Mage','Affinité']);appendCards(page,'Exemples de sorts V6',items)}
const mageLeft=mage.filter(c=>!inserted.has(c.index));if(mageLeft.length){const page=newPage('mage-autres-mecaniques','Mage — autres mécaniques V6',['Mage']);for(const [key,items] of group(mageLeft,c=>[c.h3,c.h4,c.h5].filter(Boolean).join(' › ')))appendCards(page,key,items)}

// 14 : origine de l'Élu + une page par Patron, avec ses Maisonnées/Faveurs.
const daemon=take(c=>c.chapter==='14');const daemonOrigins=daemon.filter(c=>c.h3==='Origine de l’Élu');if(daemonOrigins.length){const page=newPage('daemon-origine-elu','Daemon — origine de l’Élu',['Daemon']);appendCards(page,'Origine de l’Élu',daemonOrigins)}
for(const [patron,items] of group(daemon.filter(c=>c.h3==='Maisonnées et Faveurs de Patron'),c=>c.h4||'Patron')){const page=newPage(`daemon-patron-${slug(patron)}`,`Daemon — ${patron} : Maisonnées et Faveurs`,['Daemon','Patron']);appendCards(page,patron,items)}
const daemonLeft=daemon.filter(c=>!inserted.has(c.index));if(daemonLeft.length){const page=newPage('daemon-autres-mecaniques','Daemon — autres mécaniques V6',['Daemon']);for(const [key,items] of group(daemonLeft,c=>c.h3||'Mécaniques'))appendCards(page,key,items)}

// 15 : Aura/Arbre de Vie et progression de Transcendance.
const angelus=take(c=>c.chapter==='15');for(const [h3,items] of group(angelus,c=>c.h3||'Angelus')){const page=newPage(`angelus-${slug(h3)}`,`Angelus — ${h3}`,['Angelus']);appendCards(page,h3,items)}

// 16 : enrichir les pages Builder existantes ; créer seulement les sous-ensembles nouveaux.
const aseryn=take(c=>c.chapter==='16');const aserynProfiles=aseryn.filter(c=>c.h3==='Origines jouables'&&!c.h4);appendCards(findPage('Aseryn — règles de Nature'),'Profils d’origines jouables',aserynProfiles);
const aserynRest=aseryn.filter(c=>!inserted.has(c.index));for(const [key,items] of group(aserynRest,c=>[c.h3,c.h4,c.h5].filter(Boolean).join(' › '))){const first=items[0],base=cleanPrice(first.h4||first.h3),special=/Spécialisation de Foudre/i.test(first.h4)&&first.h5?`Dratyn — ${first.h4}`:base;let page=findPage(base,`Aseryn — ${base}`,special,'Conseil de la Foudre','Dratyn — la Maîtresse de la Foudre');if(!page)page=newPage(`aseryn-${slug(base||key)}`,`Aseryn — ${base||key}`,['Aseryn']);appendCards(page,sourceSectionTitle(first),items)}

// 17 : une page par branche/race/organisation principale, heading5 conservé comme sous-section.
const exile=take(c=>c.chapter==='17');for(const [baseKey,items] of group(exile,c=>cleanPrice(c.h4||c.h3)||'Exilés')){const first=items[0],base=baseKey;let page=findPage(base,`Exilé — ${base}`);if(!page)page=newPage(`exile-${slug(base)}`,`Exilé — ${base}`,['Exilé']);for(const [section,sectionItems] of group(items,c=>c.h5?cleanPrice(c.h5):cleanPrice(c.h4||c.h3)||base))appendCards(page,section,sectionItems)}

// 18 : profils Extrals dans la page de Nature commune.
appendCards(findPage('Extral / Humain galactique — règles de Nature'),'Profils Extrals V6',take(c=>c.chapter==='18'));

// 20 : une page Corruption structurée en quatre rubriques.
const corruption=take(c=>c.chapter==='20');if(corruption.length){const page=newPage('corruption','Corruption — règles et progression',['Corruption']);for(const [key,items] of group(corruption,c=>[c.h3,c.h4].filter(Boolean).join(' › ')))appendCards(page,key,items)}

// 21 : cadre commun + une page par Fléau, sous-rubriques conservées.
const scourges=take(c=>c.chapter==='21'),common=scourges.filter(c=>c.h3==='Cadre commun des Fléaux');if(common.length){const page=newPage('fleaux-cadre-commun','Fléaux — cadre commun',['Fléaux']);appendCards(page,'Cadre commun des Fléaux',common)}
for(const [scourge,items] of group(scourges.filter(c=>c.h3!=='Cadre commun des Fléaux'),c=>c.h3)){const page=newPage(`fleau-${slug(scourge)}`,scourge,['Fléaux']);for(const [section,sectionItems] of group(items,c=>[c.h4,c.h5].filter(Boolean).join(' › ')||'Mécaniques'))appendCards(page,section,sectionItems)}

const unclassified=cards.filter(card=>!covered.has(card.index)&&!inserted.has(card.index));if(unclassified.length)throw new Error(`Cartes V6 non classées: ${unclassified.length} — ${unclassified.slice(0,12).map(c=>`${c.index}:${c.chapter}:${c.title}`).join(' | ')}`);
const overlap=[...covered].filter(index=>inserted.has(index));if(overlap.length)throw new Error(`Cartes V6 couvertes ET insérées: ${overlap.join(', ')}`);
if(covered.size+inserted.size!==882)throw new Error(`Couverture V6 invalide: Builder ${covered.size} + Règles ${inserted.size} != 882`);

const allIds=new Set();for(const page of rules){if(!page.id||!page.title||!page.category)throw new Error(`Page Règles invalide`);if(allIds.has(page.id))throw new Error(`ID Règles dupliqué: ${page.id}`);allIds.add(page.id)}
function writeDataset(id,pages,prefix){const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages)),{level:9,mtime:0}).toString('base64'),size=8000,parts=Math.ceil(b64.length/size);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');return spec}
const output=writeDataset('moteur',rules,'v3-regles-v5');manifest.expectedTotal=manifest.datasets.reduce((sum,dataset)=>sum+Number(dataset.count||0),0);fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`VÉRITÉ V6 — 882/882 cartes classées · ${covered.size} couvertes par Builder · ${inserted.size} intégrées explicitement.`);
console.log(`RÈGLES V5 — ${output.count} pages · ${output.parts} fragments · total V3 ${manifest.expectedTotal}.`);
