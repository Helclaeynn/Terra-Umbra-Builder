import assert from 'node:assert/strict';
import {articleHash} from '../editor/override-engine.js';
import {applyCommittedOverridesToMap} from '../editor/native-overrides.js';

const base={id:'demo-native',title:'Titre brut',category:'Réalité',source:'demo.docx',status:'source_detaillee',tags:['ancien'],sections:[{id:'s1',title:'Texte',level:3,blocks:[{type:'p',text:'Ancien contenu'}]}],dataset:'realite'};
const hash=await articleHash(base);
const map=new Map([[base.id,structuredClone(base)]]);
const payload={version:1,entries:[{articleId:base.id,baseHash:hash,updatedAt:new Date().toISOString(),operations:[
  {op:'replace',path:'/title',value:'Titre édité'},
  {op:'replace',path:'/tags',value:['nouveau','indexable']},
  {op:'replace',path:'/sections',value:[{id:'s1',title:'Texte',level:3,blocks:[{type:'p',text:'Contenu édité et recherchable'}]}]},
]}]};

const summary=await applyCommittedOverridesToMap(map,payload,{strict:true});
assert.equal(summary.applied,1);
assert.equal(summary.conflicts.length,0);
assert.equal(summary.missing.length,0);
const effective=map.get(base.id);
assert.equal(effective.title,'Titre édité');
assert.deepEqual(effective.tags,['nouveau','indexable']);
assert.equal(effective.sections[0].blocks[0].text,'Contenu édité et recherchable');
assert.equal(effective.dataset,'realite');
assert.equal(effective.__editorialOverride,true);
assert.equal(effective.__editorialOverrideCount,1);

const conflictMap=new Map([[base.id,structuredClone(base)]]);
const conflictPayload={version:1,entries:[{...payload.entries[0],baseHash:'0'.repeat(64)}]};
const conflictSummary=await applyCommittedOverridesToMap(conflictMap,conflictPayload);
assert.equal(conflictSummary.applied,0);
assert.equal(conflictSummary.conflicts.length,1);
assert.equal(conflictMap.get(base.id).title,'Titre brut');

const missingMap=new Map();
const missingSummary=await applyCommittedOverridesToMap(missingMap,payload);
assert.deepEqual(missingSummary.missing,[base.id]);

console.log('Native committed override adapter OK.');
