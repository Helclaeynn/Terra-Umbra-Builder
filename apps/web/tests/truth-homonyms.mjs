import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:"export * from './src/lib/truth';"},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const {terraUmbraTruthRules:base}=await import('../../api/dist/rules/truth/rules.js');

// Les règles en base portent les Sangs vifs du Garou sous les mêmes identifiants
// que les talents de Sang du Vampire : on reproduit ce cas.
const pkg=structuredClone(base);
const vampire=pkg.catalogs.vampire.find(t=>t.id==='vision_du_sang');
assert.ok(vampire,'vision_du_sang dans le catalogue Vampire');
pkg.catalogs.garou=[...pkg.catalogs.garou.filter(t=>t.id!=='vision_du_sang'),{...vampire,name:'Vision du Sang (Garou)',effect:'Version Garou'}];
const state=nature=>({nature,consciousness:'initie',choices:{blood:'sang_ecarlate',court:'alghul_almalakiu'},truthTalents:['vision_du_sang'],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:''});

const forVampire=m.truthKnownTalents(pkg,state('vampire')).filter(t=>t.id==='vision_du_sang');
assert.equal(forVampire.length,1,'Un seul talent par identifiant');
assert.equal(forVampire[0].effect,vampire.effect,'Le Vampire lit la version Vampire');
const forGarou=m.truthKnownTalents(pkg,state('garou')).filter(t=>t.id==='vision_du_sang');
assert.equal(forGarou.length,1);
assert.equal(forGarou[0].effect,'Version Garou','Le Garou lit la version Garou');
assert.equal(m.truthPtvSpent(pkg,state('vampire')),vampire.cost,'Le coût est compté une fois');
console.log('HOMONYMES OK — un identifiant commun au Vampire et au Garou se lit dans la Nature du personnage, une seule fois');
