import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const spec=manifest.datasets.find(dataset=>dataset.id==='moteur');
if(!spec) throw new Error('Dataset moteur absent');
let b64='';for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
const rules=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));

function rows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>(block.rows||[]).slice(1)))}
function pages(prefix){return rules.filter(page=>String(page.id||'').startsWith(prefix))}

const common=rules.find(page=>page.title==='Talents communs de Réalité');
if(!common||rows(common).length!==12) throw new Error('Talents communs: 12 entrées attendues sur une page');

const expertise=pages('regles-realite-talents-expertise-');
const origin=pages('regles-realite-talents-origine-');
const sphere=pages('regles-realite-talents-sphere-');
if(expertise.length!==5) throw new Error(`Expertise: ${expertise.length} pages, attendu 5`);
if(origin.length!==5) throw new Error(`Origine: ${origin.length} pages, attendu 5`);
if(sphere.length!==5) throw new Error(`Sphère: ${sphere.length} pages, attendu 5`);
if(expertise.reduce((sum,page)=>sum+rows(page).length,0)!==25) throw new Error('Expertise: 25 talents attendus');
if(origin.reduce((sum,page)=>sum+rows(page).length,0)!==25) throw new Error('Origine: 25 talents attendus');
if(sphere.reduce((sum,page)=>sum+rows(page).length,0)!==60) throw new Error('Sphère: 60 talents attendus');

const expertiseTypes=['Vigueur','Agilité','Esprit','Volonté','Charisme'];
for(const type of expertiseTypes) if(!expertise.some(page=>page.title===`Talents d’expertise — ${type}`)) throw new Error(`Page Expertise absente: ${type}`);
const sphereTypes=['Crawler','Corporatiste','Gouvernemental','Pègre','Religieux'];
for(const type of sphereTypes) if(!sphere.some(page=>page.title===`Talents de Sphère — ${type}`)) throw new Error(`Page Sphère absente: ${type}`);

if(rules.some(page=>page.title==='Talents d’expertise'||page.title==='Talents d’Origine'||page.title==='Talents de Sphère')) throw new Error('Anciennes pages trop compactes encore présentes');
const hub=rules.find(page=>page.title==='Talents de Réalité — règles générales');
const hubText=JSON.stringify(hub||{});
if(!/une page par type d.Expertise/i.test(hubText)||!/une page par Sphère/i.test(hubText)) throw new Error('Hub Talents non mis à jour');

console.log(`GRANULARITÉ RÉALITÉ OK — 1 commune · ${expertise.length} Expertise · ${origin.length} Origine · ${sphere.length} Sphère.`);
