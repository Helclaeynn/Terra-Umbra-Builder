import type {TruthState,TruthRulesPackage,TruthTalent} from './truth';
import {normalizeExileBuild,normalizeBeneficiaryBenefits,exileNetworks,exileHordes,exileRuneIds,exileTalentIds as ids,isCybermechanicalItem,type ExileOwnedItem,type ExileRune,type ExileTechnique} from '../../../api/src/rules/truth/exile-build';
export * from '../../../api/src/rules/truth/exile-build';
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
export function exileOwnedItems(reality:unknown,campaign:boolean,catalog:readonly {id:string;name:string;category?:string;sourceCategory?:string;data?:Record<string,unknown>;generation?:number|null}[]=[]):ExileOwnedItem[]{
 const r=record(reality),byId=new Map(catalog.map(i=>[i.id,i])),seen=new Set<string>();
 return [...(Array.isArray(r.equipment)?r.equipment:[]),...(Array.isArray(r.augmentations)?r.augmentations:[])].map(record).filter(p=>{
  if(typeof p.uid!=='string'||!p.uid||typeof p.itemId!=='string'||seen.has(p.uid)||(!campaign&&p.acquiredInCampaign))return false;seen.add(p.uid);return true;
 }).map(p=>{const item=byId.get(String(p.itemId));return {uid:String(p.uid),itemId:String(p.itemId),name:item?.name??String(p.itemId),kind:p.kind==='augmentation'?'augmentation':'equipment',installed:p.kind==='augmentation'&&p.loaded!==false,cybermechanical:!!item&&isCybermechanicalItem(item)};});
}
export function exileInventory(pkg:TruthRulesPackage,s:TruthState):ExileOwnedItem[]{
 const stock=[...(s.exileInventory??[])],seen=new Set(stock.map(i=>i.uid));
 for(const id of s.truthEquipment??[]){const uid='truth-'+id,item=pkg.equipment?.find(i=>i.id===id);if(!item||seen.has(uid))continue;seen.add(uid);stock.push({uid,itemId:id,name:item.name,kind:'truth',installed:false,cybermechanical:false});}
 return stock;
}
export function exileLearnedNetworks(pkg:TruthRulesPackage,s:TruthState):Set<string>{
 const result=new Set<string>();if(s.nature!=='exile')return result;
 const choices=pkg.structure.natures.exile?.choices.find(c=>c.key==='network'),people=String(s.choices.people??''),main=String(s.choices.network??'');
 if(choices?.optionsBy?.[people]?.some(o=>o.id===main)&&main!=='aucune')result.add(main);
 for(const t of normalizeExileBuild(s.choices.exileBuild).trainings)if(t.learned&&t.mentor.trim()&&t.conditions.trim()&&exileNetworks.some(n=>n.id===t.network))result.add(t.network);
 if((exileHordes as readonly string[]).some(h=>result.has(h)))result.add('horde_commune');
 return result;
}
export function exileVisibleTalent(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):boolean{
 if(s.nature!=='exile'||!t.id.startsWith('exile-'))return false;
 const when=t.when??{};return Object.entries(when).every(([key,v])=>key==='network'?typeof v==='string'&&exileLearnedNetworks(pkg,s).has(v):Array.isArray(v)?v.includes(String(s.choices[key]??'')):v===s.choices[key]);
}
export function exileAcquisitionIssues(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):string[]|null{
 if(s.nature!=='exile'||!t.id.startsWith('exile-'))return null;
 const out:string[]=[];
 if(s.consciousness==='profane')out.push('Initiation à la Vérité nécessaire.');
 if(!exileVisibleTalent(pkg,s,t))out.push('Peuple ou formation réellement apprise nécessaire.');
 const needed=t.id===ids.brief?2:t.id===ids.phrase?3:0;
 if(needed&&exileRuneIds.filter(id=>s.truthTalents.includes(id)).length<needed)out.push(`${needed} Runes de base distinctes acquises requises.`);
 const required=t.requiredTalentIds??(t.prerequisite?[t.prerequisite]:[]);
 if(required.some(id=>!s.truthTalents.includes(id)))out.push('Prérequis : '+t.prerequisiteName);
 return out;
}
export function exileUsableTalents(pkg:TruthRulesPackage,s:TruthState):Set<string>{
 if(s.nature!=='exile')return new Set();
 let selected=[...new Set(s.truthTalents)];const all=new Map((pkg.catalogs.exile??[]).map(t=>[t.id,t]));
 for(let n=0;n<=s.truthTalents.length;n++){
  const current={...s,truthTalents:selected},next=selected.filter(id=>{const t=all.get(id);return !!t&&(exileAcquisitionIssues(pkg,current,t)?.length??1)===0;});
  if(next.length===selected.length)break;selected=next;
 }
 const active=new Set(selected),stock=exileInventory(pkg,s);
 // Explicit organ replacement records are functional only while their actual implant survives.
 for(const w of normalizeExileBuild(s.choices.exileBuild).works)if(w.talentId===ids.interface&&w.passiveId){const t=all.get(w.passiveId);if(!t?.when?.people||!(t.activation??'').toLowerCase().includes('passif')||!active.has(ids.interface)||!w.working||!stock.some(i=>i.uid===w.itemUid&&i.installed))active.delete(w.passiveId);}
 return active;
}
export function exileCombatProfile(pkg:TruthRulesPackage,s:TruthState,stage:'v'|'sr'|'r'){
 const a=exileUsableTalents(pkg,s);return {armor:stage==='r'&&a.has('exile-peau-epaisse')?1:0,unarmed:stage==='r'&&a.has('exile-mains-de-guerre')?3:1};
}
export function exileRuneIssues(pkg:TruthRulesPackage,s:TruthState,r:ExileRune):string[]{
 const out:string[]=[],a=exileUsableTalents(pkg,s),c=normalizeExileBuild(s.choices.exileBuild);
 if(!r.runeIds.length)out.push('Choisissez une Rune.');
 if(r.runeIds.some(id=>!a.has(id)))out.push('Rune non acquise ou formation indisponible.');
 if(r.runeIds.length===2&&!a.has(ids.phrase))out.push('Phrase runique non acquise.');
 if(r.brief&&!a.has(ids.brief))out.push('Inscription brève non acquise.');
 if(!r.itemUid&&!r.support.trim())out.push('Support réel à préciser.');
 if(r.itemUid&&!exileInventory(pkg,s).some(i=>i.uid===r.itemUid))out.push('Objet absent de l’inventaire.');
 if(r.runeIds.includes('exile-rune-de-fer')&&!r.itemUid&&!r.support.trim())out.push('Arme ou outil possédé ou confié requis.');
 if(!r.author.trim())out.push('Auteur de l’inscription à préciser.');
 if(r.active&&c.runes.some(o=>o.uid!==r.uid&&o.active&&o.runeIds.some(id=>r.runeIds.includes(id))))out.push('Une seule inscription active de chaque type par runiste, Phrase comprise.');
 if(r.runeIds.includes(ids.guard)&&r.consumed)out.push('Rune de Garde consommée : aucune recharge par réinscription.');
 return out;
}
export function exileRuneDuration(r:ExileRune){return r.brief?'Fin de la scène':r.runeIds.length===2?'Durable tant que l’inscription reste intacte':'Fin du scénario';}
export function exileTechniqueCosts(pkg:TruthRulesPackage,s:TruthState,t:ExileTechnique,mode:'none'|'instinct'|'natural'='none',round=1,fulgurant=false){
 const a=exileUsableTalents(pkg,s),defined=!!(t.name.trim()&&t.effect.trim()&&t.learning.trim()&&t.tradition.trim());
 const maintain=defined&&(mode==='instinct'&&a.has('exile-accord-instinctif')||mode==='natural'&&round>=1&&round<=3&&a.has('exile-maintien-naturel'));
 return {defined,activation:t.pa===null?null:Math.max(1,t.pa-(defined&&fulgurant&&a.has('exile-incantation-fulgurante')?1:0)),maintenance:t.maintenance===null?null:Math.max(0,t.maintenance-(maintain?1:0))};
}
export function exileInventoryAnnotation(s:TruthState,uid:string){
 if(s.nature!=='exile')return '';
 const c=normalizeExileBuild(s.choices.exileBuild);
 return [...c.works.filter(w=>w.itemUid===uid).map(w=>`${w.name||'Travail'} — ${w.effect} · ${w.duration||'durée à préciser'}${!w.working?' · support hors service':''}`),...c.runes.filter(r=>r.itemUid===uid).map(r=>`${r.runeIds.map(id=>id.replace('exile-rune-','Rune ').replaceAll('-',' ')).join(' + ')} — ${exileRuneDuration(r)}${r.active?' · active déclarée':' · inactive'}${r.consumed?' · charge consommée':''}`)].join('\n');
}
export function beneficiarySheetDetails(s:TruthState){
 if(!Object.hasOwn(s.choices,'beneficiaryBenefits'))return [];
 const c=normalizeBeneficiaryBenefits(s.choices.beneficiaryBenefits);
 return [{id:'beneficiary-scenario',name:'Suivi reçu — scénario',value:c.scenario||'Scénario en cours',description:'Suivi sur la fiche du bénéficiaire, indépendant du lanceur ; aucune guérison automatique.'},
 {id:'beneficiary-refection',name:'Réfection vitale reçue',value:c.refectionReceived?'Utilisation du scénario consommée':'Pas encore reçue dans ce scénario',description:c.refectionSource},
 {id:'beneficiary-guard',name:'Rune de Garde reçue',value:c.guardReceived?'Protection du scénario déjà reçue':'Pas encore reçue dans ce scénario',description:c.guardSource}];
}
export function exileSheetDetails(pkg:TruthRulesPackage,s:TruthState):Array<{id:string;name:string;value:string;description?:string}>{
 if(s.nature!=='exile')return [];
 const c=normalizeExileBuild(s.choices.exileBuild),active=exileUsableTalents(pkg,s),all=new Map((pkg.catalogs.exile??[]).map(t=>[t.id,t])),stock=exileInventory(pkg,s);
 const rows:Array<{id:string;name:string;value:string;description?:string}>=[];const add=(id:string,name:string,value:string,description='')=>rows.push({id:'exile-'+id,name,value,description});
 const missing=s.truthTalents.filter(id=>all.has(id)&&!active.has(id));if(missing.length)add('unavailable','Acquisitions à régulariser',missing.map(id=>all.get(id)!.name).join(' ; '),'Achats et PTV conservés ; aucune contribution mécanique avant régularisation.');
 for(const t of c.trainings)add('training-'+t.uid,'Formation — '+(exileNetworks.find(n=>n.id===t.network)?.name||'À choisir'),t.learned?'Apprentissage déclaré acquis':'Formation en préparation',`Mentor : ${t.mentor}\nConditions : ${t.conditions}\nDéclaration de parcours à convenir avec le MJ, pas une validation automatique.`);
 const body=exileCombatProfile(pkg,s,'r');if(s.choices.people==='thulkar')add('body','Profil corporel Révélé',`Armure corporelle ${body.armor} · Pugilat DGT ${body.unarmed}`,'Meilleure couche corporelle seulement, plus Armure portée compatible ; aucun effet en V/SR.');
 for(const r of c.runes)add('rune-'+r.uid,r.runeIds.map(id=>all.get(id)?.name||id).join(' + ')||'Rune à définir',`${r.active?'Active déclarée':'Inactive'} · ${exileRuneDuration(r)}${r.consumed?' · consommée':''}`,`Support : ${stock.find(i=>i.uid===r.itemUid)?.name||r.support||'Objet absent'}\nAuteur : ${r.author} · Bénéficiaire : ${r.beneficiary}\nCondition : ${r.condition}\n${exileRuneIssues(pkg,s,r).join(' ')}\nGarde : le bénéficiaire doit aussi noter la protection reçue sur sa propre fiche, quel que soit le lanceur.`);
 for(const t of c.techniques){const normal=exileTechniqueCosts(pkg,s,t);add('tech-'+t.uid,t.name||'Technique à définir',t.effect,`Tradition : ${t.tradition}\nApprentissage : ${t.learning}\nPA : ${normal.activation??'À préciser'} · maintien : ${normal.maintenance??'À préciser'} PA/round\nPortée : ${t.range} · Accès : ${t.access}\nRessources : ${t.resources}\n${normal.defined?'Technique déclarée, coûts conditionnels selon talents activés.':'Définition incomplète : aucune réduction mécanique.'}`);}
 for(const w of c.works)add('work-'+w.uid,w.name||all.get(w.talentId)?.name||'Travail',w.effect,`Talent : ${all.get(w.talentId)?.name||'À associer'}\nObjet : ${stock.find(i=>i.uid===w.itemUid)?.name||'Absent'}\nMatériaux : ${w.materials} · Durée : ${w.duration}\n${w.limits}${w.talentId===ids.interface?'\nPassif soutenu : '+(all.get(w.passiveId)?.name||'À choisir')+' ; '+(w.working?'support déclaré fonctionnel':'hors service'):''}`);
 for(const p of c.projects)add('project-'+p.uid,p.name||'Dossier',p.effect,`Talent : ${all.get(p.talentId)?.name||'À associer'}\nObjet : ${stock.find(i=>i.uid===p.itemUid)?.name||'Non lié'}\nMatériaux : ${p.materials} · Alimentation : ${p.power}\nPrix convenu : ${p.price??'À préciser'} $ · Délai : ${p.delay}\nInterlocuteur : ${p.partner} · Transaction : ${p.transaction} · État : ${p.status}\n${p.limits}\nAucun achat, paiement ou remboursement automatique.`);
 for(const p of c.landmarks)add('landmark-'+p.uid,p.name||'Repère',p.location,'Repère réellement visité ; trois au maximum, pour le scénario.');
 for(const p of c.supplies)add('supply-'+p.uid,p.name||'Lot récupéré',p.consumed?'Consommé':'Disponible',`Provenance : ${p.source} · aucune valeur de revente créée.`);
 return rows;
}
const contextual:ReadonlyArray<{id:string;skills:string[];bonus:number;label:string}>=[
 {id:'exile-pas-leger',skills:['athletisme','furtivite'],bonus:3,label:'SR/R · annulation de malus seulement, jusqu’à 3, sol difficile'},
 {id:'exile-lecture-des-etres',skills:['diplomatie','empathie','manipulation','autorite'],bonus:3,label:'Premier test social exploitant la lecture, 1/scène'},
 {id:'exile-endurance-obstinee',skills:['constitution'],bonus:3,label:'Endurance corporelle : fatigue, froid, privation'},
 {id:'exile-masse-enracinee',skills:['athletisme'],bonus:3,label:'SR/R · résister à une projection ou poussée physique'},
 {id:'exile-volonte-incompressible',skills:['force_mentale'],bonus:3,label:'Résister à une domination, possession ou injonction surnaturelle'},
 {id:'exile-ca-devrait-marcher',skills:['technologie','mecanique','artisanat'],bonus:3,label:'Usage crédible d’un outil improvisé, 1/scène'},
 {id:'exile-diagnostic-sauvage',skills:['technologie','mecanique'],bonus:3,label:'Diagnostic ou première réparation après examen de 1 PA'},
 {id:'exile-impossible-non-mal-prepare',skills:['technologie','mecanique'],bonus:3,label:'Fonction nouvelle réalisable avec matériel réel, 1/scénario'},
 {id:'exile-meme-pas-peur',skills:['force_mentale'],bonus:3,label:'Peur/intimidation reposant sur taille, statut ou menace ordinaire'},
 {id:'exile-poigne-thulkar',skills:['pugilat','athletisme'],bonus:3,label:'R · maintenir une saisie ou résister au désarmement'},
 {id:'exile-douleur-familiere',skills:['constitution','force_mentale'],bonus:3,label:'SR/R · test causé directement par douleur ou blessure'},
 {id:'exile-se-fondre-dans-le-decor',skills:['furtivite'],bonus:3,label:'Immobile dans un couvert naturel réel'},
 {id:'exile-standard',skills:['technologie','mecanique','artisanat'],bonus:3,label:'Recherche d’un vice caché dans un domaine connu'},
 {id:'exile-aucune-reverence',skills:['force_mentale'],bonus:3,label:'Pression fondée sur statut sacré, noblesse ou autorité religieuse'},
 {id:'exile-ancrage-de-realite',skills:['force_mentale'],bonus:3,label:'Transition V/SR/R forcée ou entravée, pas observation par capteur'}
];
export function exileContextualBonuses(pkg:TruthRulesPackage,s:TruthState,skill:string,total:number,active=exileUsableTalents(pkg,s)){
 return contextual.filter(b=>active.has(b.id)&&b.skills.includes(skill)&&b.id!=='exile-pas-leger').map(b=>({id:b.id,label:b.label+' · conditionnel, sans cumul équivalent',bonus:b.bonus,total:total+b.bonus}));
}
