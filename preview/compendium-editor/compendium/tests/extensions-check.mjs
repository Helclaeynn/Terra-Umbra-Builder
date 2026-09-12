import fs from 'node:fs';
import zlib from 'node:zlib';

const specs=[
 ['wave2-org',8],['wave3-mini-org',5],['wave4-org',1],['wave5-verite',1],
 ['wave2-pnj',2],['wave3-mini-pnj',1],['wave4-pnj',1]
];
let failed=false,total=0;
for(const [prefix,count] of specs){
  try{
    let b64='';for(let i=0;i<count;i++){const p=`compendium/data/${prefix}-${String(i).padStart(2,'0')}.b64part`;if(!fs.existsSync(p))throw new Error(`part manquante ${p}`);b64+=fs.readFileSync(p,'utf8').replace(/\s+/g,'')}
    const raw=Buffer.from(b64,'base64');const json=JSON.parse(zlib.gunzipSync(raw).toString('utf8'));
    if(!Array.isArray(json))throw new Error('racine JSON non tabulaire');
    total+=json.length;console.log(`${prefix}: OK · ${json.length} entrées`);
  }catch(error){failed=true;console.error(`${prefix}: ÉCHEC · ${error.message}`)}
}
console.log(`Extensions chargeables: ${total} entrées`);if(failed)process.exit(1);
