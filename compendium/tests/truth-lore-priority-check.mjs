import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function load(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function text(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).map(block=>String(block.text||''))).join(' ')}
const truth=load('verite');
const legacy=load('lore');
const visible=[...truth,...legacy.filter(page=>page.category==='Vérité')];
const names=['Elynea','La Guerre céleste','Les anciennes Divinités','Alabor','Astaroth','Belial','Diablo','Lilith','Mammon','Méphisto','Satan','Lucifer','Belzébuth','Abigor','Baal','Morrighan'];
for(const name of names){const found=visible.filter(page=>norm(page.title)===norm(name));if(found.length!==1)throw new Error(`${name}: ${found.length} page(s) visibles, attendu 1`);const page=found[0];if(!(page.tags||[]).includes('Lore V6'))throw new Error(`${name}: tag Lore V6 absent`);if(!String(page.source||'').includes('TUC_Verite_V6'))throw new Error(`${name}: source V6 absente`)}
const deities=visible.filter(page=>(page.tags||[]).includes('Divinité')&&(page.tags||[]).includes('Lore V6'));
if(deities.length!==13)throw new Error(`13 Divinités V6 attendues, ${deities.length}`);
const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\bdifficult[eé]\s*\d+|\b1\s*\/\s*(?:sc[eè]ne|sc[eé]nario)\b|\bD[eé]fense occulte\b/i;
for(const page of visible.filter(page=>(page.tags||[]).includes('Lore V6'))){if(forbidden.test(text(page)))throw new Error(`${page.title}: mécanique détectée`);if((page.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error(`${page.title}: table interdite`)}
function page(name){return visible.find(item=>norm(item.title)===norm(name))}
const baal=text(page('Baal'));if(!/Mars/i.test(baal)||!/Ar[eè]s/i.test(baal))throw new Error('Baal: équivalences Mars/Arès absentes');
const abigor=text(page('Abigor'));if(!/Thor/i.test(abigor))throw new Error('Abigor: équivalence Thor absente');
const elynea=text(page('Elynea'));if(!/D[eé]esse de la Lumi[eè]re/i.test(elynea)||!/Arbre de Vie/i.test(elynea))throw new Error('Elynea: origine/Arbre de Vie incomplets');
const war=text(page('La Guerre céleste'));if(!/(?:figures? infernales?|d[eé]monis|diabolis)/i.test(war)||!/Elynea/i.test(war))throw new Error('Guerre céleste: mémoire religieuse incomplète');
const elyneaPage=page('Elynea');if(elyneaPage.id!=='lore-angelus-elynea')throw new Error(`Elynea: ID legacy non conservé (${elyneaPage.id})`);
console.log(`LORE VÉRITÉ PRIORITAIRE OK — ${names.length} pages · ${deities.length} Divinités · Elynea ID conservé · aucune mécanique.`);
