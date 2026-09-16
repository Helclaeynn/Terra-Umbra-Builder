import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function flat(page){return [page.title||'',...(page.sections||[]).flatMap(s=>[s.title||'',...(s.blocks||[]).flatMap(b=>b.type==='table'?(b.rows||[]).flat():[b.text||''])])].join(' ')}
function need(pages,title){const page=pages.find(p=>norm(p.title)===norm(title));if(!page)throw new Error(`Page absente: ${title}`);return page}

const rules=load('moteur'),truth=load('verite'),lore=load('lore'),pnj=load('pnj'),catalogue=load('verite-catalogue');
const hunterIds=Array.from({length:16},(_,i)=>`lore-${String(167+i).padStart(3,'0')}-verite-les-chasseurs-${String(i+1).padStart(2,'0')}`);
const speciesIds=Array.from({length:9},(_,i)=>`lore-${String(205+i).padStart(3,'0')}-verite-les-especes-fantastiques-${String(i+1).padStart(2,'0')}`);
const meetingIds=Array.from({length:7},(_,i)=>`lore-${String(81+i).padStart(3,'0')}-points-de-rencontre-${String(i+1).padStart(2,'0')}`);
const retired=[...hunterIds,...speciesIds,...meetingIds,'lore-extraterrestrial-species-contexte-general','lore-supernatural-species-contexte-general','lore-supernatural-species-atlantes'];
const transitory=['verite-058-22-proprietes-communes-des-equipements-de-verite','verite-059-23-equipement-de-chasse','verite-060-24-marche-de-verite-des-exiles','verite-061-25-marche-xeno','verite-062-26-arsenal-aidh-moderne-et-doctrine-terra-umbra','verite-063-27-equipement-corrompu-et-calamitechnologie'];
for(const id of retired)if(lore.some(p=>p.id===id))throw new Error(`Scorie legacy encore présente: ${id}`);
for(const id of transitory)if(truth.some(p=>p.id===id))throw new Error(`Page transitoire encore présente: ${id}`);
need(lore,'Points de rencontre du monde caché');
const hunter=need(lore,'Traditions et réseaux de Chasseurs');if((hunter.sections||[]).length<8)throw new Error('Traditions de Chasseurs: consolidation trop mince');
for(const title of ['Équipement de Vérité — propriétés communes','Équipement de Chasse — références et propriétés','Arsenal AIDH — doctrine matérielle et références','Équipement corrompu et Calamitechnologie — référence'])need(rules,title);
for(const title of ['Whurtens','17. Exilés — peuples, fonctions et traditions','18. Extrals, Homo Superior et Ad’rak','20. Corruption','16. Aseryns'])need(truth,title);
const whurten=flat(need(truth,'Whurtens'));if(!/Nibelungen/i.test(whurten)||!/Duergars/i.test(whurten))throw new Error('Whurtens: Nibelungen/Duergars non migrés');
const exiles=flat(need(truth,'17. Exilés — peuples, fonctions et traditions'));for(const n of ['Conseil des Anciens','Jadecenters','ateliers whurtens'])if(!exiles.includes(n))throw new Error(`Exilés: lore migré absent (${n})`);
const extrals=flat(need(truth,'18. Extrals, Homo Superior et Ad’rak'));if(!/marchés xénos/i.test(extrals))throw new Error('Extrals: marchés xénos non migrés');
for(const name of ['Roberrik','Kran’rag','Sylvia Rose','Alayna Daewynn','Neera Athren','Valle Von Hardenberg'])need(pnj,name);
if(catalogue.length!==229)throw new Error(`Catalogue Vérité: ${catalogue.length}, attendu 229`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;
for(const page of [...truth,...lore.filter(p=>p.category==='Vérité')])if(forbidden.test(flat(page)))throw new Error(`Mécanique résiduelle dans le lore Vérité: ${page.id}`);
const all=manifest.datasets.flatMap(d=>load(d.id));const ids=new Set();for(const page of all){if(ids.has(page.id))throw new Error(`ID dupliqué: ${page.id}`);ids.add(page.id)}if(ids.size!==manifest.expectedTotal)throw new Error(`IDs uniques ${ids.size}/${manifest.expectedTotal}`);
console.log(`FINAL VÉRITÉ OK — scories Chasseurs/espèces/contextes retirées · points de rencontre 7→1 · pages 22–27 sorties · ${pnj.length} PNJ · ${ids.size} IDs uniques.`);
