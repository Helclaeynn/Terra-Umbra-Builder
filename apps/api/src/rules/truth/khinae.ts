import type {TruthState,TruthRulesPackage,TruthTalent} from './types.js';
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’'—–-]/g,' ').replace(/\s+/g,' ').toLowerCase();
export const isKhinae=(s:TruthState)=>s.nature==='garou'||s.nature==='khinae';
export function khinaeAwakening(id:string){const a=id.startsWith('khinae_awaken_')?id.slice(14).split('__'):[];return a.length===2?{from:a[0]!,blood:a[1]!}:null;}
export function khinaeBloodOptions(pkg:TruthRulesPackage,s:TruthState){return pkg.structure.natures[s.nature]?.choices.find(c=>c.key==='blood')?.options??[];}
export function khinaeNativeBlood(s:TruthState){return s.truthTalents.map(khinaeAwakening).find(Boolean)?.from??String(s.choices.blood??'');}
function bloodRows(pkg:TruthRulesPackage,s:TruthState,blood:string){const needles=pkg.visibility.needles.garou?.[blood]??[];return (pkg.catalogs[s.nature]??[]).filter(t=>needles.some(n=>norm(t.group).includes(norm(n))));}
function mastered(pkg:TruthRulesPackage,s:TruthState,blood:string){const advanced=bloodRows(pkg,s,blood).filter(t=>t.prerequisite);return advanced.length===2&&advanced.every(t=>s.truthTalents.includes(t.id)&&!!t.prerequisite&&s.truthTalents.includes(t.prerequisite));}
/** Awakening IDs preserve the native Sang and acquisition order. */
export function khinaeAwakenedBloods(pkg:TruthRulesPackage,s:TruthState){
 if(!isKhinae(s))return [];const native=khinaeNativeBlood(s);if(!khinaeBloodOptions(pkg,s).some(o=>o.id===native))return [];
 const out=[native];for(const id of s.truthTalents){const a=khinaeAwakening(id);if(a&&a.from===out.at(-1)&&!out.includes(a.blood)&&khinaeBloodOptions(pkg,s).some(o=>o.id===a.blood)&&mastered(pkg,s,a.from))out.push(a.blood);}return out;
}
export function khinaeChained(pkg:TruthRulesPackage,s:TruthState){return khinaeAwakenedBloods(pkg,s).includes('sang_enchaine');}
export function khinaeAwakeningTalents(pkg:TruthRulesPackage,s:TruthState,all=false):TruthTalent[]{
 if(!isKhinae(s))return [];const opts=khinaeBloodOptions(pkg,s),bloods=khinaeAwakenedBloods(pkg,s),froms=all?opts.map(o=>o.id):[bloods.at(-1)??''];
 return froms.flatMap(from=>opts.filter(o=>o.id!==from&&(all||!bloods.includes(o.id))).map(o=>({id:'khinae_awaken_'+from+'__'+o.id,name:'Éveiller '+o.name,cost:3,group:'Éveiller un autre Sang',access:'Progression',effect:'Ouvre les deux voies de ce Sang, sans fournir leurs talents. Maîtrisez les deux voies du Sang précédent ; ses achats restent acquis.',effectDetails:o.description,prerequisiteName:'Les deux talents avancés du Sang précédent, avec leurs prérequis.'})));
}
export function khinaeVisibleTalent(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent){
 if(!isKhinae(s))return false;if(khinaeAwakening(t.id))return khinaeAwakeningTalents(pkg,s).some(a=>a.id===t.id);
 const g=norm(t.group),needles=pkg.visibility.needles;
 return s.nature==='garou'&&g.includes('garou commun')||
 (s.nature==='garou'?(needles.garou?.[String(s.choices.pelage??'')]??[]):(needles.khinae?.[String(s.choices.lineage??'')]??[])).some(n=>g.includes(norm(n)))||
 khinaeAwakenedBloods(pkg,s).some(b=>bloodRows(pkg,s,b).some(r=>r.id===t.id));
}
export function khinaeAcquisitionIssues(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):string[]|null{
 if(!isKhinae(s)||!(pkg.catalogs[s.nature]??[]).some(r=>r.id===t.id)&&!khinaeAwakening(t.id))return null;
 const issues:string[]=[];if(s.consciousness==='profane')issues.push('Initiation à la Vérité nécessaire.');
 const a=khinaeAwakening(t.id);if(a){const chain=khinaeAwakenedBloods(pkg,s),position=chain.indexOf(a.blood);if(!(position>0&&chain[position-1]===a.from)&&(!khinaeVisibleTalent(pkg,s,t)||!mastered(pkg,s,a.from)))issues.push('Maîtrisez les deux voies du Sang précédent.');return issues;}
 if(!khinaeVisibleTalent(pkg,s,t))issues.push('Sang, Pelage ou Lignée incompatible ; achat conservé.');
 if(t.prerequisite&&!s.truthTalents.includes(t.prerequisite))issues.push('Prérequis : '+(t.prerequisiteName??t.prerequisite));
 if(khinaeChained(pkg,s)&&['metabolisme_de_khinae','onde_de_mue','mue_cataclysmique'].includes(t.id.replace(/^khinae_blood_/,'')))issues.push('Le Corps Enchaîné interdit la Mue hybride.');
 return issues;
}
export function khinaeUsableTalents(pkg:TruthRulesPackage,s:TruthState){
 let selected=[...s.truthTalents];for(let n=0;n<=s.truthTalents.length;n++){const current={...s,truthTalents:selected},rows=new Map([...(pkg.catalogs[s.nature]??[]),...khinaeAwakeningTalents(pkg,s,true)].map(t=>[t.id,t]));const next=selected.filter(id=>{const t=rows.get(id);return !!t&&(khinaeAcquisitionIssues(pkg,current,t)?.length??1)===0;});if(next.length===selected.length)break;selected=next;}return new Set(selected);
}
export function khinaeUnavailable(pkg:TruthRulesPackage,s:TruthState){if(!isKhinae(s))return [];const active=khinaeUsableTalents(pkg,s);return s.truthTalents.filter(id=>!active.has(id)&&((pkg.catalogs[s.nature]??[]).some(t=>t.id===id)||!!khinaeAwakening(id)));}
export type KhinaeBody={form:string;vigor:number;agility:number;pugilat:number;damage:number;armor:number;regeneration:number;pace:number;recovery:number;constraints:string[];available:boolean};
const base:Record<string,number[]>={garou:[3,2,5,2,0,2,3],canides_errants:[3,2,5,1,0,2,3],renards:[2,3,4,1,0,3,2],grands_felins:[4,2,6,2,2,2,4],chats:[1,4,3,0,0,4,1],rapaces:[2,3,5,1,0,3,3],requins:[4,2,6,2,0,2,4],serpents:[2,3,3,1,0,3,3],boudas:[3,2,6,2,2,2,4],berserkirs:[5,0,6,3,3,0,5],crocodiliens:[5,0,6,4,3,0,5]};
const variants:Record<string,Record<string,number[]>>={grands_felins:{lion:[4,1,6,2],panthere:[3,3,5,1],puma:[3,3,5,1]},chats:{sauvage:[2,3,4,1]},rapaces:{aigle:[3,2,5,1],faucon:[1,4,5,1],hibou:[1,3,5,1],vautour:[2,2,5,1]},requins:{bouledogue:[3,2,5,2],requin_marteau:[3,3,5,1],requin_baleine:[5,1,4,3]},serpents:{cobra:[2,2,3,1],constricteur:[4,1,4,2],furtif:[1,4,2,0]},boudas:{tachetee:[4,1,6,2],rayee:[2,3,6,2]},berserkirs:{ours_noir:[4,1,6,2]},crocodiliens:{alligator:[4,1,6,4],caiman:[4,1,5,3],gavial:[3,0,5,2]}};
/** Reference profiles only: no activation, healing, or resource reset in the Builder. */
export function khinaeBodyProfile(pkg:TruthRulesPackage,s:TruthState,form:'human'|'animal'|'hybrid',inWater=false):KhinaeBody{
 const lineage=s.nature==='garou'?'garou':String(s.choices.lineage??''),variant=String(s.choices.variant??''),b=base[lineage],active=khinaeUsableTalents(pkg,s),chained=khinaeChained(pkg,s);
 const own=(id:string)=>active.has((s.nature==='khinae'?'khinae_blood_':'')+id);
 const out:KhinaeBody={form,vigor:0,agility:0,pugilat:0,damage:1,armor:0,regeneration:0,pace:0,recovery:own('regeneration_acharnee')?2:1,constraints:[],available:!!b&&s.consciousness!=='profane'};
 if(!out.available)return {...out,recovery:0};
 if(chained){if(form==='hybrid')return {...out,available:false,constraints:['Sang Enchaîné : forme hybride interdite.']};if(form==='human')Object.assign(out,{vigor:2,agility:2,pugilat:own('predateur_debout')?3:0,pace:1});}
 if(form==='animal')Object.assign(out,{vigor:b![4]!,agility:b![5]!,damage:lineage==='serpents'&&['constricteur','furtif'].includes(variant)?2:b![6]!,armor:lineage==='berserkirs'?2:lineage==='crocodiliens'?3:0});
 if(form==='hybrid'){const v=variants[lineage]?.[variant]??b!;Object.assign(out,{vigor:v[0]!,agility:v[1]!,damage:v[2]!,armor:v[3]!,pugilat:3,regeneration:own('regeneration_acharnee')?3:2,pace:1});out.constraints.push('Mue : un round complet ; +1 PA à partir du round suivant sa fin. Épuisement selon les Mues depuis le repos.');}
 if(lineage==='requins'&&form!=='human'){if(!inWater)out.agility=0;out.constraints.push(form==='animal'?'Eau nécessaire à la forme animale.':'Sur terre : bonus d’Agilité perdu et locomotion contrainte.');}
 if(lineage==='crocodiliens'&&form!=='human'&&inWater)out.agility=2;
 if(lineage==='rapaces'&&form!=='human')out.constraints.push('Bond ailé : fin sur un support ou une prise ; aucun vol soutenu ou stationnaire.');
 if(lineage==='serpents'&&form!=='human')out.constraints.push(variant==='constricteur'?'Constricteur : aucun venin ; saisie utilisable comme constriction.':variant==='furtif'?'Aucun venin significatif ; gabarit réduit.':variant==='cobra'?'Morsure : venin, Vigueur + Constitution 15 ; échec : maximum 1 PA physique à la prochaine activation. Une exposition/cible/scène.':'Morsure causant au moins 1 PV : Vigueur + Constitution 15 ; échec : 1 PV irréductible au début des deux prochaines activations. Une exposition/cible/scène.');
 if(form==='animal')out.constraints.push('Équipement limité à la morphologie animale ; pas de mains ou de parole humaine implicites.');
 out.constraints.push('Changer de forme ajuste les PV avec la Vigueur, sans guérir de blessure ni renouveler les usages.');return out;
}
export function khinaeProfileText(p:KhinaeBody){return !p.available?p.constraints.join(' ')||'Profil indisponible':'+ '+p.vigor+' Vigueur · + '+p.agility+' Agilité · + '+p.pugilat+' Pugilat · DGT naturels '+p.damage+' · Armure '+p.armor+' · Régénération '+p.regeneration+' PV/round · Récupération hors combat '+p.recovery+' PV/heure · + '+p.pace+' PA'+(p.form==='hybrid'?' dès le round suivant la Mue':'')+'. '+p.constraints.join(' ');}
