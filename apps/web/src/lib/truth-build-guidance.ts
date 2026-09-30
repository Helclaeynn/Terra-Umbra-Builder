import type {TruthState} from './truth';
import {daemonTalentIds as d} from '../../../api/src/rules/truth/daemon-build';
import {angelusTalentIds as a} from '../../../api/src/rules/truth/angelus-build';
import {extralTalentIds as x} from '../../../api/src/rules/truth/extral-build';
import {exileTalentIds as e} from '../../../api/src/rules/truth/exile-build';
import {mageTechniqueKind} from '../../../api/src/rules/truth/mage-techniques';
/** Only permanent character choices belong in the builder. Never return game-session controls. */
export function truthBuildChoiceLabel(state:TruthState,id:string):string {
 if(state.nature==='vampire'){const labels:Record<string,string>={forme_animale:'Choisir la forme animale',menagerie:'Compléter le répertoire animal',arme_hematique:'Consulter les trois armes hématiques',lien_du_deimon:'Référencer le Deimon lié',sang_preserve:'Consigner l’ancrage de Sang'};return labels[id]??'';}
 if(state.nature==='daemon'){
  if(id===d.form)return 'Choisir le répertoire de formes';
  if(id===d.formation)return 'Choisir la seconde Fonction';
  if(id===d.polyphony&&state.choices.divinity==='mephisto')return 'Choisir la seconde Affinité';
 }
 if(state.nature==='angelus'&&id===a.construct)return 'Choisir le profil de l’auxiliaire';
 if(state.nature==='angelus'&&id===a.cherub)return 'Choisir la seconde Nature';
 if(state.nature==='extral'&&id===x.recombine)return 'Choisir la greffe et le talent associé';
 if(state.nature==='exile'&&id===e.interface)return 'Choisir l’implant qui soutient le talent';
 const kind=mageTechniqueKind(id);if(state.nature==='mage'&&kind&&(state.choices.mageTechniques as any)?.[kind]?.name)return 'Consulter la technique transmise';
 return '';
}
export function truthHasInnateBuildChoice(state:TruthState){return state.nature==='daemon'&&state.choices.divinity==='mephisto';}
