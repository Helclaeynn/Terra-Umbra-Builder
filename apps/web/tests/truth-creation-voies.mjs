import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:"export * from './src/lib/truth';export * from './src/lib/catalog-order';"},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));

// Talents de création comme dans les règles en base : voie, palier, porte.
const voie=(title,palier,porte,position)=>({id:'v:'+title,title,couche:'Sang noir',forme:porte?'deux_portes':'simple',palier,porte,position});
const talents=[
  {id:'b2',name:'Surrégime',cost:2,group:'Sang Écarlate',voie:voie('Sang Écarlate','II','B',4)},
  {id:'eveil',name:'Éveiller Sang Primal',cost:3,group:'Éveiller un autre Sang',access:'Progression'},
  {id:'a1',name:'Vision du Sang',cost:1,group:'Sang Écarlate',voie:voie('Sang Écarlate','I','A',1)},
  {id:'libre',name:'Talent sans voie',cost:1,group:'Famille ancienne'},
  {id:'a2',name:'Traque hématique',cost:2,group:'Sang Écarlate',voie:voie('Sang Écarlate','II','A',2)},
  {id:'b1',name:'Déferlement écarlate',cost:1,group:'Sang Écarlate',voie:voie('Sang Écarlate','I','B',3)},
  {id:'c1',name:'Présence du Conquérant',cost:1,group:'Krovni Rytsari',voie:voie('Krovni Rytsari','I',null,1)}
];
const groups=m.truthCreationGroups(talents).map(g=>({...g,items:[...g.items].sort(m.compareTruthTalents)}));
assert.deepEqual(groups.map(g=>g.name),['Voie Krovni Rytsari','Voie Sang Écarlate','Famille ancienne','Éveiller un autre Sang'],'Voies, puis familles, éveils en dernier');
assert.equal(groups[1].couche,'Sang noir');
assert.deepEqual(groups[1].items.map(t=>t.id),['a1','a2','b1','b2'],'Porte A puis B, paliers dans l’ordre');
assert.equal(m.truthVoieStep(talents[2].voie),'Palier I · Porte A');
assert.equal(m.truthVoieStep(voie('X','entree',null,1)),'Entrée');
assert.equal(m.truthVoieStep(voie('X',null,'sommet',1)),'Sommet');
console.log('VOIES À LA CRÉATION OK — un groupe par voie, paliers et portes dans l’ordre, éveils en fin de liste');
