import assert from 'node:assert/strict';
import {applyOperations,articleHash,applyOverrideEntries,buildArticleOperations} from '../editor/override-engine.js';

const base={id:'demo-1',title:'Ancien titre',source:'source.docx',status:'source_detaillee',tags:['A'],sections:[{id:'s1',title:'Section',level:3,blocks:[{type:'p',text:'Texte'}]}],pnj:{age:'42',origine:'LA',relations:['Alice']}};
const hash=await articleHash(base);
assert.match(hash,/^[a-f0-9]{64}$/);

const operations=[
  {op:'replace',path:'/title',value:'Nouveau titre'},
  {op:'add',path:'/pnj/portrait',value:'images/demo.webp'},
  {op:'replace',path:'/tags',value:['A','B']},
];
const patched=applyOperations(base,operations);
assert.equal(patched.title,'Nouveau titre');
assert.equal(patched.pnj.portrait,'images/demo.webp');
assert.deepEqual(patched.tags,['A','B']);
assert.equal(base.title,'Ancien titre');

const merged=await applyOverrideEntries(base,[{articleId:'demo-1',baseHash:hash,updatedAt:new Date().toISOString(),operations}]);
assert.equal(merged.conflicts.length,0);
assert.equal(merged.applied.length,1);
assert.equal(merged.article.title,'Nouveau titre');

const conflict=await applyOverrideEntries(base,[{articleId:'demo-1',baseHash:'0'.repeat(64),updatedAt:new Date().toISOString(),operations}]);
assert.equal(conflict.applied.length,0);
assert.equal(conflict.conflicts.length,1);
assert.equal(conflict.article.title,'Ancien titre');

const edited=structuredClone(base);
edited.title='Édité';
edited.sections.push({id:'s2',title:'Ajout',level:3,blocks:[{type:'p',text:'Nouveau'}]});
edited.pnj={...edited.pnj,age:'43',nom_verite:'Secret',race:'Angelus',relations:['Alice','Bob'],portrait:'images/demo.webp',portrait_alt:'Portrait test',portrait_caption:'Légende'};
const diff=buildArticleOperations(base,edited);
const rebuilt=applyOperations(base,diff);
assert.equal(rebuilt.title,'Édité');
assert.equal(rebuilt.sections.length,2);
assert.equal(rebuilt.pnj.age,'43');
assert.equal(rebuilt.pnj.nom_verite,'Secret');
assert.deepEqual(rebuilt.pnj.relations,['Alice','Bob']);
assert.equal(rebuilt.pnj.portrait,'images/demo.webp');

const mediaBase={id:'media-1',title:'Créature',source:'bestiaire.docx',status:'canon_recent',tags:[],sections:[],illustration:'images/old.webp'};
const mediaEdited=structuredClone(mediaBase);
delete mediaEdited.illustration;
mediaEdited.image={src:'images/new.webp',alt:'Nouvelle image',caption:'Une légende'};
const mediaDiff=buildArticleOperations(mediaBase,mediaEdited);
const mediaRebuilt=applyOperations(mediaBase,mediaDiff);
assert.equal(mediaRebuilt.illustration,undefined);
assert.deepEqual(mediaRebuilt.image,{src:'images/new.webp',alt:'Nouvelle image',caption:'Une légende'});

console.log(`Editor override engine OK: ${diff.length} opérations PNJ, ${mediaDiff.length} opérations média.`);
