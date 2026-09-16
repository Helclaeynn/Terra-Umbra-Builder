import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT='character-builder/rulesets/terra-umbra/reality/safe';
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'equipment.manifest.json'),'utf8'));
const b64=manifest.chunks.map(f=>fs.readFileSync(path.join(ROOT,f),'utf8').replace(/^\uFEFF/,'').replace(/\s+/g,'')).join('');
const raw=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const rows=Array.isArray(raw?.entries)?raw.entries:[];
const legacy=[
'+B Black Arrow','+B Hunter','CB Championship','CB Hunter','ESW Immobilizer','ESW Inabilitor','WSG Tethyssette','WSG Poseidon',
'PW Superballs','PW Cuchulainn','PW Tomahawk','PW Steel feathers','PW Ravenegg','PW Inferno','PW Dripper','PW heliosII','PW Superchoc','PW frog egg','PW Pokeball','GL Vending Machine','PW Jagi','PW Shadow gift','GL Bomberman','GL Easter Bunny',
'CoS Riot force','CoS Sunwukong','BK King fist','Bh Ginette','Antoinette','Pierrette','Wm Melinette','Cos Stretchy',
'AR Mutilator','AR Sunlight','AR Howling','AR Rampager','AR Sal-in','AR Morissette','AR Aciditicteeth','AR Blastard',
'SR Big Game Hunter','SR Hoot','SR Deathbringer','SR Phantom','SR Song-gos','SR Luzette','SR Abraham Kennedy','SR Hellrails',
'DGR Pandemic','DGR Savior','DG Disease','DG Savior','DG RedCrush','DG Painkiller','BK Hornetouch',
'SG Riotcontrol','SG Croaker','SG Boss','LMG Equalizer','SG Pal','SG Cosette','SG Stooge','SG FireStarter',
'LMG Suppressor','LMG Military','LMG Bi','LMG Nebullar','LMG Surge','MG Gladius','MG Urban','MG Executionner','MG Neo-Executionner','MG Bibal','MG Florette',
'PP old colt','PP Defender','HP Deputy','HP Pacificateur','HP Gardien','HP Violator','HP Apex','HP Depliant','LP Acceptable','LP Sturdy','LP Jeanette','LP Sunblast','HP Jotkka','HP Pacificateur x','PP Eolgul-e','PP Sunnyroshima',
'HP Reminiscer','HP Oblivion','HP Zeus','LP Dracula',
'P. Flak Cannon','P. Hitman','P. Sheer BlueShell A','P. Vampire Killer','P. Charm','P. Armcannon','P. Railway to hell','P. Vader',
'BPV Bullet Fear','BPV Black Feathers','BPV New Guard','BPV Black Dog','BPV Punk life','BPV SunShield','BPV King Worker','BPV Silver Knight','LBA Night Guard','LBA Gallowglass II','LBA Soldier','LBA Skylord','HBA Moon Guard','HBA Gallowglass V','HBA heavy soldier','HBA Sunking',
'SPC No-Fire','SPC Free Fly','SPC Santa cloth','SPC Medicarmor','SPC Muad Dib','SPC Cthulhu killer','SBA Ghillie basic','SBA Squid Skin','SBA Dirty Sniper','SBA Zero Guard','SBA Ninja','Spc neuromaster'
];
const aliases=new Map([
 ['+b hunter','Owl LC-014 Chasseur'],['esw immobilizer','Raven HT-014 Immobilisateur'],['esw inabilitor','Owl LT-015 Incapaciteur'],['wsg poseidon','SeaWares HL-02 Poseidon'],
 ['pw superballs','Owl MB-014 Bolas monofilament'],['pw cuchulainn','Raven JL-014 Cuchulainn'],['pw tomahawk','Tala TH-029 Tomahawk'],['pw steel feathers','Phoenix PCK-08 Feather'],
 ['cos riot force','Raven TM-028 Riot Control'],['cos sunwukong','Owl TS-009 Sun Wukong'],['sg riotcontrol','Raven SG-025 Riot Control'],['sg croaker','Raven SG-039 Croaker'],['sg boss','Owl SG-016 Boss'],['sg firestarter','Phoenix SG-042 Fire Rain'],
 ['sr big game hunter','Owl SR-017 Big Game Hunter'],['sr hoot','Owl SR-029 Hoot'],['sr deathbringer','Raven SR-029 Deathbringer'],['sr phantom','Phoenix SR-034 Phantom'],
 ['pp old colt','Owl PP-014 Old Colt'],['pp defender','Raven PP-012 Defender'],['hp deputy','Owl HP-104 Deputy'],['hp pacificateur','Raven HP-014 Pacificateur'],['hp gardien','Raven HP-067 Gardien'],['hp violator','Phoenix HP-028 Violator'],['hp depliant','Phoenix HP-092 Depliant'],['lp acceptable','Owl LP-019 Acceptable'],['lp sturdy','Raven LP-004 Sturdy'],['lp sunblast','Phoenix LP-028 Sun Blast'],['bpv black feathers','Raven Black Feathers']
]);
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function toks(v){return new Set(norm(v).split(/\s+/).filter(x=>x.length>1&&!['ar','sr','sg','mg','lmg','hp','lp','pp','pw','bpv','spc','sba','lba','hba','dg','dgr','cb','esw','wsg','cos','bk','bh','wm','gl'].includes(x)));}
function score(a,b){const A=toks(a),B=toks(b);if(!A.size||!B.size)return 0;let inter=0;for(const x of A)if(B.has(x))inter++;return inter/Math.max(A.size,B.size);}
for(const old of legacy){
  const canonical=aliases.get(norm(old));
  let exact=canonical?rows.find(r=>norm(r.name)===norm(canonical)):rows.find(r=>norm(r.name)===norm(old));
  const ranked=rows.map(r=>({id:r.id,name:r.name,category:r.category,score:score(old,r.name)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,4);
  console.log(JSON.stringify({legacy:old,canonical:canonical||null,exact:exact?{id:exact.id,name:exact.name,category:exact.category,price:exact.price??null,data:exact.data??{}}:null,candidates:ranked},null,0));
}
console.error(`AUDIT ${legacy.length} legacy labels against ${rows.length} current Builder entries.`);
