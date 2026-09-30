import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:"export * from './src/lib/truth';export * from './src/lib/khinae';export * from './src/lib/truth-sheet-details';export * from '../api/src/character-data';"},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const {terraUmbraTruthRules:pkg}=await import('../../api/dist/rules/truth/rules.js');
const blank=(nature='garou',blood='sang_naturel')=>({nature,consciousness:'initie',choices:{blood,pelage:'pelages_gris',lineage:'canides_errants',variant:'coyote'},truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:''});
const eligible=(s,id)=>{const t=m.truthAvailableTalents(pkg,s).find(t=>t.id===id);return !!t&&m.truthPrerequisiteSatisfied(pkg,s,t);};
const add=(s,id)=>{assert.ok(eligible(s,id),'Accessible '+id);s.truthTalents.push(id);assert.ok(m.truthSanitizeTalents(pkg,s).includes(id));};
for(const nature of ['garou','khinae']){
 assert.equal(pkg.catalogs[nature].length,68);const pre=nature==='khinae'?'khinae_blood_':'';
 for(const blood of m.khinaeBloodOptions(pkg,blank(nature))){
  const s=blank(nature,blood.id),rows=m.truthAvailableTalents(pkg,s).filter(t=>t.group.startsWith('Sang '));assert.equal(rows.length,4,blood.id);
  for(let round=0;round<4;round++)for(const t of rows)if(!s.truthTalents.includes(t.id)&&eligible(s,t.id))add(s,t.id);
  assert.equal(s.truthTalents.length,4);if(nature==='khinae')for(const t of rows)if(t.prerequisite)assert.ok(t.prerequisite.startsWith('khinae_blood_'));
 }
 const s=blank(nature),wake='khinae_awaken_sang_naturel__sang_alpha';assert.equal(eligible(s,wake),false);
 for(const id of ['appel_elementaire','dechainement_elementaire','marque_tellurique'])add(s,pre+id);
 assert.equal(eligible(s,wake),false,'One advanced voie is insufficient');add(s,pre+'domaine_primordial');add(s,wake);
 assert.equal(m.truthPtvSpent(pkg,s),9,'6 PTV mastery + 3 PTV awakening');assert.deepEqual(m.khinaeAwakenedBloods(pkg,s),['sang_naturel','sang_alpha']);
 const jay='khinae_awaken_sang_alpha__sang_enchaine';assert.equal(eligible(s,jay),false);
 for(const id of ['regard_d_alpha','autorite_absolue','ralliement_de_meute','hurlement_d_alpha'])add(s,pre+id);add(s,jay);assert.equal(m.truthPtvSpent(pkg,s),18);
 assert.equal(m.khinaeBodyProfile(pkg,s,'hybrid').available,false,'Secondary Jayanti forbids hybrid');let body=m.khinaeBodyProfile(pkg,s,'human');assert.equal(body.pugilat,0);assert.equal(body.armor,0);assert.equal(body.damage,1);assert.equal(body.regeneration,0);
 add(s,pre+'predateur_debout');assert.equal(m.khinaeBodyProfile(pkg,s,'human').pugilat,3);
 s.choices.blood='sang_funeste';assert.equal(m.khinaeNativeBlood(s),'sang_naturel','Dropdown cannot substitute a paid chain');assert.equal(m.khinaeBodyProfile(pkg,s,'hybrid').available,false);
 const cost=m.truthPtvSpent(pkg,s),paid=[...s.truthTalents];s.consciousness='profane';s.choices.pelage='pelages_dores';s.choices.lineage='chats';
 assert.deepEqual(m.truthSanitizeTalents(pkg,s),paid);assert.equal(m.truthPtvSpent(pkg,s),cost);assert.equal(m.khinaeUsableTalents(pkg,s).size,0);
 const data=m.blankCharacterData('Test');data.truth=s;data.progression.ptvEarned=40;assert.deepEqual(m.normalizeCharacterData(JSON.parse(JSON.stringify(data))).truth.truthTalents,paid,'Server roundtrip retains order');
}
const chained=blank('garou','sang_enchaine');chained.truthTalents=['metabolisme_de_khinae'];assert.equal(m.khinaeUsableTalents(pkg,chained).has('metabolisme_de_khinae'),false);assert.equal(m.truthPtvSpent(pkg,chained),1);
const s=blank('khinae');s.choices.lineage='grands_felins';s.choices.variant='panthere';let p=m.khinaeBodyProfile(pkg,s,'hybrid');assert.deepEqual([p.vigor,p.agility,p.damage,p.armor],[3,3,5,1],'Variant replaces base');
s.choices.lineage='requins';s.choices.variant='requin_marteau';assert.equal(m.khinaeBodyProfile(pkg,s,'hybrid').agility,0);assert.equal(m.khinaeBodyProfile(pkg,s,'hybrid',true).agility,3);
s.choices.lineage='serpents';s.choices.variant='constricteur';p=m.khinaeBodyProfile(pkg,s,'hybrid');assert.equal(p.damage,4);assert.match(p.constraints.join(' '),/aucun venin/);
s.choices.lineage='berserkirs';s.choices.variant='brun';p=m.khinaeBodyProfile(pkg,s,'hybrid');assert.deepEqual([p.vigor,p.damage,p.armor],[5,6,3]);
s.choices.lineage='crocodiliens';s.choices.variant='nil';p=m.khinaeBodyProfile(pkg,s,'hybrid');assert.deepEqual([p.damage,p.armor,p.agility],[6,4,0]);assert.equal(m.khinaeBodyProfile(pkg,s,'hybrid',true).agility,2);
console.log('KHINAE WEB OK — 136 stable entries, exact dependencies, ordered 3 PTV awakenings, both advanced voies, secondary Jayanti, retained purchases and replace-only variants');

for(const nature of Object.keys(pkg.structure.natures).filter(n=>!['garou','khinae'].includes(n))){
 const state={...blank(nature),truthTalents:(pkg.catalogs[nature]??[]).slice(0,3).map(t=>t.id)};
 assert.deepEqual(m.khinaeUnavailable(pkg,state),[],nature+' must never receive Khinae warnings');
}
