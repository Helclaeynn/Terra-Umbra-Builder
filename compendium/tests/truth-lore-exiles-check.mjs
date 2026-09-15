import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function load(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function text(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).map(block=>String(block.text||''))).join(' ')}
const truth=load('verite');
const legacy=load('lore');
const visible=[...truth,...legacy.filter(page=>page.category==='Vérité')];
const names=['17. Exilés — peuples, fonctions et traditions','Elyë','Whurtens','Ashylls','Thulkars','Azménoriens','Silcenters'];
function page(name){const matches=visible.filter(item=>norm(item.title)===norm(name));if(matches.length!==1)throw new Error(`${name}: ${matches.length} page(s), attendu 1`);return matches[0]}
for(const name of names){const item=page(name);if(!(item.tags||[]).includes('Lore V6 Exilés'))throw new Error(`${name}: tag Lore V6 Exilés absent`);if(item?.nav?.subgroup!=='Exilés')throw new Error(`${name}: navigation Exilés absente`);if(!String(item.source||'').includes('TUC_Verite_V6'))throw new Error(`${name}: source V6 absente`)}
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bD[eé]fense occulte\b|\bdifficult[eé]\s*\d+/i;
for(const name of names){const item=page(name);if(forbidden.test(text(item)))throw new Error(`${name}: mécanique détectée`);if((item.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${name}: table mécanique détectée`)}
const hub=text(page(names[0]));if(!/n[eé]s? sur Terre/i.test(hub)||!/Silcenters/i.test(hub))throw new Error('Hub Exilés: diaspora terrestre/Silcenters incomplets');
const elye=text(page('Elyë'));for(const needle of ['Union Elfique','Faucon de Malachite','Serpentaire de Citrine','Aigle de Larvikite','Hibou d’Onyx'])if(!elye.includes(needle))throw new Error(`Elyë: ${needle} absent`);
const whurten=text(page('Whurtens'));for(const needle of ['Ymirin','Elegarin','Iron Law','Atelier des Clans'])if(!whurten.includes(needle))throw new Error(`Whurtens: ${needle} absent`);
const ashyll=text(page('Ashylls'));for(const needle of ['Green Union','Ligue des Quatre Empereurs','Syndicat de Jade'])if(!ashyll.includes(needle))throw new Error(`Ashylls: ${needle} absent`);if(!/pas.*naturellement criminels/i.test(ashyll))throw new Error('Ashylls: distinction peuple/criminalité absente');
const thulkar=text(page('Thulkars'));for(const needle of ['Horde Divine','Horde des Marais','Horde Fantôme','Horde des Cendres','Horde de la Rose'])if(!thulkar.includes(needle))throw new Error(`Thulkars: ${needle} absente`);
const az=text(page('Azménoriens'));for(const needle of ['Servants de Pluton','Néant','Hologramme','Lueurs d’Azménor'])if(!az.includes(needle))throw new Error(`Azménoriens: ${needle} absent`);
const sil=text(page('Silcenters'));for(const needle of ['Conseil des Anciens','Protocoles de Continuité','HDS'])if(!sil.includes(needle))throw new Error(`Silcenters: ${needle} absent`);
console.log(`LORE EXILÉS V6 OK — ${names.length} pages · peuples, diaspora et Silcenters couverts · aucune mécanique.`);
