import assert from 'node:assert/strict';
import {BESTIARY_CATALOG,generateBestiary,generateBestiaryBatch} from '../dist/campaign-bestiary-generator.js';
import {bestiaryIssues} from '../dist/campaign-bestiary-model.js';
import {validScenes,cleanScenes} from '../dist/campaign-preparation.js';
const c=BESTIARY_CATALOG;
assert.equal(c.weapons.length,54);
for(const difficulty of c.difficulties)for(const archetype of c.archetypes){const group=archetype.realm==='realite'?'Pistolet léger':'Aucune';const variations=new Set();for(let i=0;i<60;i++){
 const n=generateBestiary(difficulty.id,archetype.id,group,'seed-'+i);assert.deepEqual(bestiaryIssues(n),[]);assert.equal(n.realm,archetype.realm);
 if(n.realm==='verite'){assert.ok(n.abilities.length>=2,'A Truth creature needs a power and a tactic');assert.ok(n.weaknesses.length,'A Truth creature needs a playable limit');}
 const range=c.ranges[`${difficulty.id}:${archetype.id}`];for(const [key,value] of Object.entries(n.stats))assert.ok(value>=range[key].min&&value<=range[key].max,`${difficulty.id} ${archetype.id} ${key}`);
 variations.add(JSON.stringify(n.stats));assert.deepEqual(n,generateBestiary(difficulty.id,archetype.id,group,'seed-'+i));
 }assert.ok(variations.size>45,`${difficulty.id}:${archetype.id}`);}
for(const group of [...new Set(c.weapons.map(w=>w.group))]){const pool=c.weapons.filter(w=>w.group===group),picked=new Set();for(let i=0;i<80;i++){const n=generateBestiary('standard','tireur',group,'weapon-'+i),attack=n.attacks[0],weapon=pool.find(w=>w.id===attack.weaponId);assert.ok(weapon,group);assert.equal(attack.name,weapon.name);assert.equal(attack.damage,weapon.damage);assert.equal(attack.range,weapon.range);assert.deepEqual(bestiaryIssues(n),[]);picked.add(weapon.id);}
 if(pool.length>1)assert.ok(picked.size>1,`random ${group}`);
}
const gun=generateBestiary('standard','tireur','Fusil d’assaut','a');assert.ok(c.weapons.find(w=>w.id===gun.attacks[0].weaponId)?.group==='Fusil d’assaut');assert.ok(bestiaryIssues({...gun,attacks:[{...gun.attacks[0],damage:999}]}).length);assert.ok(bestiaryIssues({...gun,realm:'verite'}).length);
assert.ok(bestiaryIssues({...gun,image:'data:image/png;base64,YQ=='}).length,'A generated creature cannot take an illustration');assert.deepEqual(bestiaryIssues({...gun,source:'custom',image:'data:image/png;base64,YQ=='}),[],'The custom sheet can carry an image, with its bytes checked by the API');
assert.equal(generateBestiaryBatch({seed:'a',count:2,difficultyId:'standard',archetypeId:'spectre',weaponGroup:'Fusil d’assaut'}),null);
const batch=generateBestiaryBatch({seed:'a',count:10,difficultyId:'standard',archetypeId:'combattant',weaponGroup:'Pistolet lourd'});assert.equal(batch?.length,10);
const id='11111111-1111-4111-8111-111111111111';const scenes=[{id:'scene',title:'Rencontre',notes:'',done:false,references:[{creatureId:id,difficultyId:'dangereux',articleId:'campaign-creature:'+id,title:'Créature',category:'Bestiaire de campagne',quantity:2,notes:''}]}];assert.ok(validScenes(scenes));assert.equal(cleanScenes(scenes)[0].references[0].creatureId,id);assert.equal(cleanScenes(scenes)[0].references[0].difficultyId,'dangereux');assert.ok(!validScenes([{...scenes[0],references:[{...scenes[0].references[0],articleId:'campaign-creature:wrong'}]}]));
console.log('CAMPAIGN BESTIARY OK — reduced stats, variable ranges, exact weapon classes and properties, private scene references');
