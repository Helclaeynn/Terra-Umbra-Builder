import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const docs = [
  ['armes_Arbalètes arcs et arbalètes sous-marines(3).docx', ['+B Black Arrow','+B Hunter','CB Championship','CB Hunter','ESW Immobilizer','ESW Inabilitor','WSG Tethyssette','WSG Poseidon']],
  ['armes_Prototypes(2).docx', ['P. Flak Cannon','P. Hitman','P. Sheer BlueShell A.','p. Vampire Killer','P. Charm','P. Armcannon','P. Railway to hell','P. Vader']],
  ['armes_armes de jet(2).docx', ['PW Superballs','Pw Cuchulainn','PW Tomahawk','PW Steel feathers','Pw Ravenegg','PW Inferno','PW Dripper','PW heliosII','PW Superchoc','PW frog egg','PW Pokeball','GL Vending Machine','PW Jagi','PW Shadow gift','GL Bomberman','GL Easter Bunny']],
  ['armes_contendants et utilitairess(3).docx', ['CoS Riot force','CoS Sunwukong','BK King fist','Bh Ginette','?? Antoinette','?? Pierrette','Wm Melinette','Cos Stretchy']],
  ['armes_fusils assaut(3).docx', ['AR Mutilator','Ar Sunlight','AR Howling','AR Rampager','AR Sal-in','AR Morissette','AR Aciditicteeth','AR Blastard']],
  ['armes_fusils de précision(3).docx', ['Sr Big Game Hunter','SR Hoot','Sr Deathbringer','SR Phantom','Sr Song-gos','Sr Luzette','sr Abraham Kennedy','SR Hellrails']],
  ['armes_fusils hypodermiques et armédicales(3).docx', ['DGR Pandemic','DGR Savior','DG Disease','DG Savior','DG RedCrush','DG Painkiller','BK Hornetouch','AR Blastard']],
  ['armes_mitraillettes(3).docx', ['LMG Suppressor','LMG Military','LMG Bi','LMG Equalizer','LMG Nebullar','LMG Surge','MG Gladius','MG Urban','MG Executionner','MG Neo-Executionner','MG Bibal','MG Florette']],
  ['armes_pistolets(4).docx', ['PP old colt','PP Defender','HP Deputy','HP pacificateur','HP Gardien','HP Violator','HP Apex','HP Depliant','LP Acceptable','LP Sturdy','LP Jeanette','LP Sunblast','HP Jotkka','HP Pacificateur x','pP Eolgul-e','PP Sunnyroshima']],
  ['armes_pistolets_prototype 2(2).docx', ['HP Reminiscer','HP Oblivion','HP Zeus','LP Dracula']],
  ['armures_protections Spéciales(1).docx', ['SPC No-Fire','SPC Free Fly','SPC Santa cloth','SPC Medicarmor','SPC Muad Dib','SPC Cthulhu killer','sba Ghillie basic','SBA Squid Skin','SBA Dirty Sniper','SBA Zero Guard','SBA Ninja','Spc neuromaster']],
  ['armures_protections basiques(1).docx', ['BPV Bullet Fear','BPV Black Feathers','BPV New Guard','BPV Black Dog','BPV Punk life','BPV SunShield','BPV King Worker','BPV Silver Knight','LBA Night Guard','LBA Gallowglass II','LBA Soldier','LBA Skylord','HBA Moon Guard','HBA Gallowglass V','HBA heavy soldier','HBA Sunking']],
];
const slug=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const entries=[];let index=0;
for(const [source,names] of docs)for(const legacyName of names){index++;const filename=`legacy-${String(index).padStart(3,'0')}-${slug(legacyName)}.webp`;const image=`images/manual/equipment-legacy/${filename}`;const file=path.join('compendium',image);if(!fs.existsSync(file))throw new Error(`Média absent: ${file}`);const data=fs.readFileSync(file);if(data.length<12||data.subarray(0,4).toString('ascii')!=='RIFF'||data.subarray(8,12).toString('ascii')!=='WEBP')throw new Error(`WebP invalide: ${file}`);const row={source,legacyName,image,sha256:crypto.createHash('sha256').update(data).digest('hex'),width:64,height:64,sourceWidth:9999,sourceHeight:9999};if(legacyName==='CB Hunter')Object.assign(row,{install:false,collisionTarget:'Owl LC-014 Chasseur',collisionPolicy:'Prefer +B Hunter for Owl LC-014 Chasseur; CB Hunter is preserved as source provenance only.'});entries.push(row);}
if(index!==124||entries.length!==124)throw new Error(`Corpus média ${entries.length}/124`);const installCount=entries.filter(e=>e.install!==false).length;if(installCount!==123)throw new Error(`Installables ${installCount}/123`);fs.writeFileSync('compendium/source/legacy-equipment-media-v1.json',JSON.stringify({version:2,count:124,installCount,entries},null,2)+'\n');console.log(`Carte média générée: ${entries.length} sources / ${installCount} installables.`);
