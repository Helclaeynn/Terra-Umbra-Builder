import fs from 'node:fs';
import zlib from 'node:zlib';

const readPackedJson = path => {
  const b64 = fs.readFileSync(path, 'utf8').replace(/\s+/g, '');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
};
const asDataset = (data,file) => Array.isArray(data) ? data : Array.isArray(data?.[file]) ? data[file] : Array.isArray(data?.articles) ? data.articles : null;

const manifest = readPackedJson('compendium/data/manifest.json.gz.b64');
const referenced = [...new Set(Object.values(manifest.sets || {}).flat())];
const mapping = {...(manifest.fileBundles || {})};
const bundleFiles = fs.readdirSync('compendium/data').filter(n=>/^bundle-\d+\.json\.gz\.b64$/.test(n)).sort();
const bundleCache = new Map();
for(const name of bundleFiles){
  const n=Number(name.match(/^bundle-(\d+)/)[1]);
  const data=readPackedJson(`compendium/data/${name}`);bundleCache.set(n,data);
  for(const key of Object.keys(data||{}))if(!mapping[key])mapping[key]=n;
}

const failures=[];let directCount=0,bundledCount=0,articleRows=0,discovered=0;
for(const file of referenced){
  try{
    let dataset;const n=mapping[file];
    if(n){
      bundledCount++;if(!(manifest.fileBundles||{})[file])discovered++;
      dataset=bundleCache.get(Number(n))?.[file];
      if(!Array.isArray(dataset))throw new Error(`absent de bundle-${n}`);
    }else{
      const path=`compendium/data/${file}`;
      if(!fs.existsSync(path))throw new Error('ni pack direct ni clé de bundle');
      directCount++;dataset=asDataset(readPackedJson(path),file);
    }
    if(!Array.isArray(dataset))throw new Error('dataset non tabulaire');
    articleRows+=dataset.length;
  }catch(error){failures.push(`${file}: ${error.message}`)}
}
console.log(`Compendium manifest: ${manifest.articles?.length||0} métadonnées, ${referenced.length} datasets, ${bundleFiles.length} bundles; ${bundledCount} bundlés (${discovered} mappings redécouverts), ${directCount} directs, ${articleRows} lignes chargeables`);
if(failures.length){console.error('Erreurs de structure du Compendium :');for(const f of failures)console.error(` - ${f}`);process.exit(1)}
console.log('Compendium manifest/datasets structure OK');
