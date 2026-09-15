import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function textOf(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).flatMap(block=>block.type==='table'?(block.rows||[]).flat():[block.text||''])).join(' ')}

const truth=load('verite'),legacy=load('lore');
if(truth.length!==82)throw new Error(`Vérité: ${truth.length} pages, attendu 82`);
if(legacy.length!==397)throw new Error(`Lore legacy: ${legacy.length}, attendu 397`);
const touched=truth.filter(page=>page.loreBook?.batch==='predators-v1');
if(touched.length!==9)throw new Error(`9 pages prédateurs attendues, ${touched.length}`);
const byTitle=new Map(truth.map(page=>[norm(page.title),page]));
function need(title,minSections){const page=byTitle.get(norm(title));if(!page)throw new Error(`Page absente: ${title}`);if((page.sections||[]).length<minSections)throw new Error(`${title}: ${(page.sections||[]).length} sections, attendu >= ${minSections}`);return page}
need('10. Vampires',12);
const sangs=need('Sangs noirs vampiriques',14);
for(const name of ['Sang Écarlate — Anya','Sang Primal — Lyssa','Sang Hypocrite — Briaerus','Sang Venimeux — Huitzitia','Sang Masqué — Kazuo','Sang Aveugle — Ashream','Sang Traqueur — Go’Ndai','Sang Glacial — Vjärmod','Sang Ardent — Larisha','Sang Orageux — Branimir','Sang Révélateur — Zhi Xia','Sang Condamné — Ashelia'])if(!(sangs.sections||[]).some(section=>section.title===name))throw new Error(`Sang noir absent: ${name}`);
need('11. Garous — Loups descendants de Khinae',12);
for(const title of ['Pelage Gris','Pelage Noir','Pelage Blanc','Pelage Roux','Pelage Brun','Pelage Doré']){const page=need(title,3);if(page.nav?.subgroup!=='Garous — Pelages')throw new Error(`${title}: mauvais sous-groupe ${page.nav?.subgroup}`)}
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bDéfense occulte\b|\bdifficult[eé]\s*\d+|TUC Talent/i;
for(const page of touched){if(forbidden.test(textOf(page)))throw new Error(`${page.title}: mécanique résiduelle`);if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table mécanique`)}
for(const title of ['Elynea','Elyë','Baal','Abigor'])if(![...truth,...legacy].some(page=>norm(page.title)===norm(title)))throw new Error(`Lore précédent perdu: ${title}`);
const all=[...truth,...legacy.filter(page=>page.category==='Vérité')];for(const title of ['Sangs noirs vampiriques','Pelage Gris','Pelage Noir','Pelage Blanc','Pelage Roux','Pelage Brun','Pelage Doré']){const matches=all.filter(page=>norm(page.title)===norm(title));if(matches.length!==1)throw new Error(`${title}: ${matches.length} pages visibles`)}
const ids=new Set();for(const page of truth){if(ids.has(page.id))throw new Error(`ID Vérité dupliqué: ${page.id}`);ids.add(page.id)}
console.log('LORE PRÉDATEURS V6 OK — 82 pages Vérité · hubs Vampire/Garou reconstruits · Sangs noirs + 6 Pelages book-first · legacy inchangé.');
