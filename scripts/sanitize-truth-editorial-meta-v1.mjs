import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){if(!prefix)return;for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function write(id,pages,prefix){const spec=specFor(id),old=spec.prefix;removePrefix(old);if(prefix!==old)removePrefix(prefix);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');const size=8000,parts=Math.ceil(b64.length/size);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});return spec}

function clean(text){
  let s=String(text??'');
  s=s.replace(/Le V6 lui donne deux mères/g,'Elynea a deux mères');
  s=s.replace(/Le V6 décrit les patrons des Daemons comme d’anciennes Divinités polythéistes/g,'Les patrons des Daemons sont d’anciennes Divinités polythéistes');
  s=s.replace(/([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ’'’-]+) est une ancienne Divinité connue dans le V6 sous le titre/g,'$1 est une ancienne Divinité portant le titre');
  s=s.replace(/Lilith ne se réduit pas à l’amour courtois\. Le V6 insiste sur l’étendue de son domaine affectif et charnel, jusqu’à faire du retrait du plaisir ou de l’affect une punition typiquement lilithienne\./g,'Lilith ne se réduit pas à l’amour courtois : son domaine affectif et charnel s’étend jusqu’à faire du retrait du plaisir ou de l’affect une punition typiquement lilithienne.');
  s=s.replace(/Le V6 lie sa chute à sa jalousie et à sa culpabilité envers Elynea/g,'Sa chute est liée à sa jalousie et à sa culpabilité envers Elynea');
  s=s.replace(/Les douze Sangs noirs décrits dans le V6/g,'Les douze Sangs noirs');
  s=s.replace(/Leur développement détaillé moderne doit être lu avec prudence : le V6 distingue explicitement ce qui relève des anciens éléments de corpus et ce qui constitue une extrapolation destinée au jeu\./g,'Leur développement détaillé moderne doit être lu avec prudence : les Crocodiliens restent l’une des lignées les moins documentées par les archives modernes.');
  return s;
}
function sanitizePage(page){let changes=0;for(const section of page.sections||[]){const title=clean(section.title);if(title!==section.title){section.title=title;changes++}for(const block of section.blocks||[]){if(typeof block.text==='string'){const next=clean(block.text);if(next!==block.text){block.text=next;changes++}}if(block.type==='table'&&Array.isArray(block.rows)){block.rows=block.rows.map(row=>row.map(cell=>{const next=clean(cell);if(next!==cell)changes++;return next}))}}}return changes}
function pageText(page){return [page.title||'',...(page.sections||[]).flatMap(s=>[s.title||'',...(s.blocks||[]).flatMap(b=>b.type==='table'?(b.rows||[]).flat():[b.text||''])])].join(' ')}

let truth=load('verite'),lore=load('lore');
let changes=0;for(const page of truth)changes+=sanitizePage(page);for(const page of lore.filter(p=>p.category==='Vérité'))changes+=sanitizePage(page);
const forbiddenMeta=[/\bV6\b/i,/\bContenu du dossier\b/i,/\bINFORMATIONS GENERALES\b/i,/\bInformations Vérité\s*:/i,/\bStatut du contenu\b/i,/\bSurcouche récente\b/i,/\bmatière encyclopédique\b/i,/\barbitrages récents priment\b/i];
for(const page of [...truth,...lore.filter(p=>p.category==='Vérité')])for(const re of forbiddenMeta)if(re.test(pageText(page)))throw new Error(`Bruit éditorial encore visible dans ${page.id} — ${page.title}: ${re}`);
write('verite',truth,'v3-verite-lore-v11');
write('lore',lore,'v3-lore-v8');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`VÉRITÉ ÉDITORIALE — ${changes} remplacement(s) · aucun marqueur méta visible.`);
