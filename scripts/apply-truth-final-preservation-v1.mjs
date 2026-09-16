import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const SOURCE='compendium/source/truth-final-preservation-v1.json';
if(!fs.existsSync(SOURCE))throw new Error(`Source de préservation absente: ${SOURCE}`);
const preservation=JSON.parse(fs.readFileSync(SOURCE,'utf8'));
if(preservation.schemaVersion!==1||preservation.batch!=='truth-final-preservation-v1')throw new Error('Source de préservation Vérité invalide');
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){if(!prefix)return;for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function write(id,pages,prefix){const spec=specFor(id),old=spec.prefix;removePrefix(old);if(prefix!==old)removePrefix(prefix);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');const size=8000,parts=Math.ceil(b64.length/size);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});return spec}
function clone(v){return JSON.parse(JSON.stringify(v))}
function upsertSection(page,section){page.sections=Array.isArray(page.sections)?page.sections:[];const i=page.sections.findIndex(s=>s.id===section.id);if(i>=0)page.sections[i]=clone(section);else page.sections.push(clone(section))}
function upsertPage(pages,page){const i=pages.findIndex(p=>p.id===page.id);if(i>=0)pages[i]=clone(page);else pages.push(clone(page))}

let truth=load('verite'),lore=load('lore'),rules=load('moteur');
const datasets={verite:truth,lore};
for(const record of preservation.pageRecords||[]){const pages=datasets[record.dataset];if(!pages)throw new Error(`Dataset de préservation invalide: ${record.dataset}`);const page=pages.find(p=>p.id===record.targetId);if(!page)throw new Error(`Cible de préservation absente: ${record.dataset}/${record.targetId}`);for(const section of record.sections||[])upsertSection(page,section)}
for(const page of preservation.fullLorePages||[])upsertPage(lore,page);
for(const page of preservation.rulePages||[])upsertPage(rules,page);

const forbidden=/\bPTV\b|\bDGT\b|\b\d+\s*PA\b|\b1d10e\b|\bdifficult[eé]\s*\d+|TUC Talent|\bProfil\s*:/i;
function flat(page){return (page.sections||[]).flatMap(s=>[s.title||'',...(s.blocks||[]).flatMap(b=>b.type==='table'?(b.rows||[]).flat():[b.text||''])]).join(' ')}
for(const record of preservation.pageRecords||[]){const page=datasets[record.dataset].find(p=>p.id===record.targetId);for(const section of record.sections||[]){const actual=(page.sections||[]).find(s=>s.id===section.id);if(!actual)throw new Error(`${record.targetId}: section préservée absente ${section.id}`);if(forbidden.test(flat({sections:[actual]})))throw new Error(`${record.targetId}/${section.id}: mécanique interdite dans le lore préservé`)}}

write('moteur',rules,'v3-regles-v6');
write('verite',truth,'v3-verite-lore-v10');
write('lore',lore,'v3-lore-v7');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`PRESERVATION VÉRITÉ APPLIQUÉE — ${preservation.pageRecords?.length||0} cibles · ${preservation.fullLorePages?.length||0} pages lore · ${preservation.rulePages?.length||0} pages Règles · total ${manifest.expectedTotal}.`);
