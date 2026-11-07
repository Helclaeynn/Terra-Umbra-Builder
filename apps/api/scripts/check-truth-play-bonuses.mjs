// Cases « ça s'applique ? » des Natures (play-bonuses.ts) : identifiants et Compétences
// existants, et la case d'un Vampire ajoute +3 seulement une fois cochée et en Révélation.
import assert from 'node:assert/strict';
import {truthPlayBonuses} from '../dist/rules/play-bonuses.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {terraUmbraCreationRules as rules} from '../dist/rules/terra-umbra-creation.js';
import {playProfile} from '../dist/rules/play-state.js';
import {blankPlayState} from '../dist/rules/play-state.js';
import {blankCharacterData} from '../dist/character-data.js';
const skillIds=new Set(rules.skills.map(s=>s.id));
for(const [nature,list] of Object.entries(truthPlayBonuses))for(const b of list){
 assert.ok((pkg.catalogs[nature]??[]).some(t=>t.id===b.id),`${nature} : ${b.id} absent du catalogue`);
 for(const s of b.skills)assert.ok(skillIds.has(s),`${b.id} : Compétence ${s} inconnue`);
}
const data=blankCharacterData('Vampire CI');
data.truth={...data.truth,nature:'vampire',consciousness:'initie',choices:{court:'krovni_rytsari',blood:'sang_ecarlate'},truthTalents:['faveur_de_la_nuit']};
const furtivite=state=>playProfile(data,state).skills.find(s=>s.id==='furtivite');
const base={...blankPlayState(),revelation:'r'};
const off=furtivite(base),on=furtivite({...base,contexts:['faveur_de_la_nuit']});
assert.ok(off.prepared.some(b=>b.id==='faveur_de_la_nuit'&&!b.enabled),'Case proposée, décochée');
assert.equal(on.total-off.total,3,'Cochée : +3');
console.log('BONUS DE NATURE OK — '+Object.values(truthPlayBonuses).flat().length+' cases, identifiants et Compétences existants, +3 seulement une fois cochée');
