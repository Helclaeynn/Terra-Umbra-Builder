import assert from 'node:assert/strict';
import {readFile,writeFile,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'esbuild';
const temporary=new URL('./.evolution-model.mjs',import.meta.url);
await build({stdin:{resolveDir:resolve('.'),loader:'ts',contents:`
export * from '../api/src/rules/builder-equipment-policy';
export * from '../api/src/character-appearances';
export * from '../api/src/character-data';
export * from './src/lib/character-sheet-model';
export * from './src/lib/truth-sheet-details';
export * from './src/lib/truth';
`},bundle:true,platform:'node',format:'esm',outfile:temporary.pathname});
try{
 const p=await import(temporary.href);
 const {terraUmbraTruthRules:truth}=await import('../../api/dist/rules/truth/rules.js');
 const {getRealityRules}=await import('../../api/dist/rules/reality.js');
 const real=getRealityRules();
 const {terraUmbraCreationRules:rules}=await import('../../api/dist/rules/terra-umbra-creation.js');
 const {terraUmbraCreationLore:lore,terraUmbraTalentChoiceSpecs:specs}=await import('../../api/dist/rules/terra-umbra-creation-lore.js');
 const catalogue=JSON.parse(await readFile('../../compendium/source/current-equipment-catalog-v1.json','utf8')).catalog.entries;
 assert.equal(p.lifestyleReferenceIds.size,88);
 assert.equal(catalogue.filter(i=>!p.builderPurchaseAllowed(i)).length,88);
 for(const id of ['objets-usuels-neurodive-cyberconsole-neurodive','objets-usuels-neurodive-kit-hardline','equipement-civique-robot-drone-de-securite','vetements-meditech','vetements-cyber-expert'])assert.ok(p.builderPurchaseAllowed({id}));
 assert.ok(p.builderPurchaseAllowed({id:'new-unreviewed-item'}),'Never blanket-remove a future mixed-category item');
 const base=p.blankCharacterData('Évolution');const before=JSON.stringify(base);
 assert.equal(p.everydayEquipmentIds(base).length,5);assert.equal(JSON.stringify(base),before);
 base.social.civicIdentity=false;assert.equal(p.everydayEquipmentIds(base).length,3);
 base.social.civicIdentity=true;base.reality.augmentations=[{uid:'aug',itemId:'aug',kind:'augmentation',acquiredInCampaign:true}];
 assert.equal(p.everydayEquipmentIds(base).length,6);assert.equal(p.everydayEquipmentIds(base,false).length,5);
 base.reality.equipment=[{uid:'old',itemId:'objets-usuels-neurodive-holophone'}];assert.equal(p.everydayEquipmentIds(base).length,5);
 assert.deepEqual(p.everydayEquipmentIds(p.normalizeCharacterData(base,'Évolution')),p.everydayEquipmentIds(base),'Reload does not duplicate default gear');
 const id='11111111-1111-4111-8111-111111111111',id2='22222222-2222-4222-8222-222222222222';
 base.appearances={reality:[{mediaId:id,label:'Au travail'}],truth:[{mediaId:id2,label:'Vraie apparence'}],primaryReality:id,primaryTruth:id2};
 const reloaded=p.normalizeCharacterData(base,'Évolution');assert.deepEqual(reloaded.appearances,base.appearances);
 assert.equal(p.appearanceGallery(reloaded.appearances,'truth').primary.src,`/api/character-media/${id2}`);
 assert.equal(p.normalizeAppearances({truth:[{mediaId:'javascript:alert(1)',label:'no'}]}).truth.length,0);
 assert.equal(p.appearanceGallery(undefined,'reality',{portraitDataUrl:'data:image/png;base64,old'}).primary.id,'legacy');
 assert.equal(p.normalizeAppearances({reality:[{mediaId:id,label:'1'},{mediaId:id,label:'2'}]}).reality.length,1);
 let choicesChecked=0;
 for(const [nature,spec] of Object.entries(truth.structure.natures)){
   const choices={};
   for(const c of spec.choices){const option=p.truthChoiceOptions(c,choices).find(o=>o.id!=='aucune');if(option)choices[c.key]=option.id;}
   const state={nature,consciousness:'initie',choices,truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:'',truthEquipmentMjOverride:false,corruptionMjAuthorized:false};
   const snapshot=JSON.stringify(state), rows=p.truthSheetDetails(truth,state,3);
   for(const c of spec.choices)if(choices[c.key]){assert.ok(rows.some(r=>r.id===c.key&&r.name===c.label&&r.value),`${nature}: ${c.label} missing`);choicesChecked++;}
   assert.equal(JSON.stringify(state),snapshot,'Truth projection is read-only');
   assert.equal(p.truthFreeTraitDetails(truth,state).length,p.truthSelectedFreeTraits(truth,state).length);
 }
 const vampire={nature:'vampire',choices:{court:'draugr',blood:'sang_ardent'},truthTalents:[]};
 const rows=p.truthSheetDetails(truth,vampire,3);assert.ok(rows.some(r=>r.id==='court'));assert.ok(rows.some(r=>r.id==='blood'&&/Ardent/.test(r.value)));
 const mage={nature:'mage',choices:{mageiusType:'elinaeth',dominantAffinity:'telekinesie'},truthTalents:['mage_telekinesie_mastery_affinee']};
 assert.ok(p.truthSheetDetails(truth,mage,3).some(r=>r.id==='affinity-telekinesie'&&r.value.includes('Affinée')));
 assert.ok(p.truthSheetDetails(truth,{nature:'angelus',choices:{},truthTalents:[]},3).some(r=>r.id==='angelus-aura'&&r.value==='6'));
 const {campaignRewardViolation}=await import('../../api/dist/campaign-reward-guard.js');
 const original=p.blankCharacterData('Copie');original.progression.cashBase=100;
 const after=structuredClone(original);after.appearances=base.appearances;
 assert.equal(campaignRewardViolation(original,after,false,{base:100,items:[]}),null,'Portrait edits never count as rewards');
 // The full canonical catalogue remains usable for old possessions and Compendium links.
 assert.equal(real.equipment.filter(i=>p.lifestyleReferenceIds.has(i.id)).length,88);
 const hidden=real.equipment.find(i=>i.id==='objets-usuels-neurodive-holophone');
 const purchased=structuredClone(original);purchased.progression.cashBase=1000;
 const tx={uid:'new-tx',amount:-250,label:'Achat',type:'purchase',at:'2026-09-29T00:00:00Z',trade:{uid:'new-asset',itemId:hidden.id,reference:250,degree:0,supplier:false}};
 const denied=structuredClone(purchased);denied.progression.cashTransactions=[tx];
 denied.reality.equipment=[{uid:'new-asset',itemId:hidden.id,kind:'equipment',selectedPrice:250,cataloguePrice:250,acquiredInCampaign:true}];
 assert.equal(campaignRewardViolation(purchased,denied,false,{base:1000,items:real.equipment}),'purchase_asset');
 const old=structuredClone(purchased);old.reality.equipment=[{uid:'old-paid',itemId:hidden.id,kind:'equipment',selectedPrice:250}];
 assert.equal(campaignRewardViolation(old,structuredClone(old),false,{base:1000,items:real.equipment}),null,'Old paid possessions preserved');
 const sale=structuredClone(old);sale.reality.equipment=[];sale.progression.cashTransactions=[{uid:'sell-old',amount:125,label:'Vente',type:'sale',at:'2026-09-29T00:00:00Z',trade:{uid:'old-paid',degree:0}}];
 assert.equal(campaignRewardViolation(old,sale,false,{base:1000,items:real.equipment}),null,'Legitimate resale of an old paid item remains valid');
 const fakeSale=structuredClone(sale);fakeSale.progression.cashTransactions[0].trade.uid='daily-'+hidden.id;
 assert.equal(campaignRewardViolation(purchased,fakeSale,false,{base:1000,items:real.equipment}),'sale_asset','Default gear cannot generate cash');
 after.progression.xpEarned=100;assert.equal(campaignRewardViolation(original,after,false,{base:100,items:[]}),'xp');
 console.log(`CHARACTER EVOLUTION MODEL OK — 88 references hidden only for purchases; default gear and conditional N-Sta, reload/dedup, private gallery metadata, ${choicesChecked} structural fields across ten Natures, all free traits, Mage and Angelus, campaign reward isolation`);
}finally{await unlink(temporary);}
