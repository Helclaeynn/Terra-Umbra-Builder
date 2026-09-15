import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function textOf(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])).join(' ')}

const truth=load('verite'),legacy=load('lore');
if(truth.length<84)throw new Error(`Vérité: régression sous le socle 84 (${truth.length})`);
if(legacy.length!==397)throw new Error(`397 pages legacy attendues, ${legacy.length}`);
const batch=truth.filter(page=>page.loreBook?.batch==='khinae-hunters-v1');
if(batch.length!==2)throw new Error(`2 hubs Khinae/Chasseurs attendus, ${batch.length}`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|\bco[uû]t\s*[:—-]|TUC Talent/i;
function need(title){const matches=batch.filter(page=>norm(page.title)===norm(title));if(matches.length!==1)throw new Error(`${title}: ${matches.length} page(s), attendu 1`);const page=matches[0];if((page.sections||[]).length<14)throw new Error(`${title}: hub trop mince`);if(page.source!=='TUC_Verite_V6_LIVRE_JDR_PAO_2026-09-10.docx')throw new Error(`${title}: source V6 absente`);if(forbidden.test(textOf(page)))throw new Error(`${title}: mécanique détectée`);if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${title}: table mécanique interdite`);return page}
const khinae=need('12. Autres descendants de Khinae');
const hunter=need('19. Formation et doctrine de Chasseur');
const khinaeHeadings=new Set((khinae.sections||[]).map(section=>section.title));
for(const heading of ['Une famille beaucoup plus vaste','Canidés errants — vivre sans une civilisation de Pelages','Félins — proximité sans Meute','Renards — lignées de l’entre-deux','Boudas — bandes de survivants','Berserkirs — la mémoire d’un vieux pacte','Crocodiliens — fossiles d’embuscade'])if(!khinaeHeadings.has(heading))throw new Error(`Khinae: section manquante ${heading}`);
const hunterHeadings=new Set((hunter.sections||[]).map(section=>section.title));
for(const heading of ['Du témoin au Chasseur','L’Association des Chasseurs','La Confrérie du Bestiaire','Les grandes traditions','Xenoshield — le spécialiste aveuglé par son préjugé','Chasseurs bouddhistes et Grand Traqueur','Chasser n’est pas haïr une espèce'])if(!hunterHeadings.has(heading))throw new Error(`Chasseurs: section manquante ${heading}`);
const hunterText=textOf(hunter);
for(const phrase of ['Morrighan','Arianwen','Ephraïm','Magdalena','Gu et Shimazu','Néant','Lueurs d’Azménor','Grand Traqueur'])if(!hunterText.includes(phrase))throw new Error(`Chasseurs: repère canonique absent ${phrase}`);
if(!/Shi[^.]{0,180}Néant/s.test(hunterText))throw new Error('Chasseurs: connexion Shi → Néant non conservée');
const khinaeText=textOf(khinae);for(const phrase of ['Coyotes','Tigres','Requins','Boudas','Ulfhednars'])if(!khinaeText.includes(phrase))throw new Error(`Khinae: repère absent ${phrase}`);
const ids=new Set();for(const page of [...truth,...legacy]){if(ids.has(page.id))throw new Error(`ID global dupliqué: ${page.id}`);ids.add(page.id)}
console.log(`LORE KHINAE/CHASSEURS V6 OK — 2 hubs denses · Vérité ${truth.length} · legacy ${legacy.length} · aucune mécanique.`);
