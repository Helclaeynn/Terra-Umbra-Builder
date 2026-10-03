import {extralPlayBonuses as bonuses} from '../../../api/src/rules/play-bonuses';
import type {TruthState,TruthRulesPackage,TruthTalent} from './truth';
import {normalizeExtralBuild,extralTalentIds as ids,extralNetworkAccess,extralAccessLabels,type ExtralOwnedItem} from '../../../api/src/rules/truth/extral-build';
export * from '../../../api/src/rules/truth/extral-build';
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const norm=(v:unknown)=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').toLowerCase();
const list=(v:unknown)=>Array.isArray(v)?v:[];
export function extralOwnedItems(reality:unknown,campaign:boolean,catalog:readonly {id:string;name:string;category?:string;sourceCategory?:string;data?:Record<string,unknown>}[]=[]):ExtralOwnedItem[]{
 const r=record(reality),byId=new Map(catalog.map(i=>[i.id,i])),seen=new Set<string>();
 return [...list(r.equipment),...list(r.augmentations)].map(record).filter(p=>{
  if(typeof p.uid!=='string'||!p.uid||typeof p.itemId!=='string'||seen.has(p.uid)||(!campaign&&p.acquiredInCampaign))return false;seen.add(p.uid);return true;
 }).map(p=>{const item=byId.get(String(p.itemId));return {uid:String(p.uid),itemId:String(p.itemId),name:item?.name??String(p.itemId),kind:p.kind==='augmentation'?'augmentation':'equipment',biological:p.kind==='augmentation'&&p.loaded!==false&&!!item&&/bio|orgien|greff|genet/.test(norm(`${item.category} ${item.sourceCategory} ${JSON.stringify(item.data??{})}`))};});
}
export function extralInventory(pkg:TruthRulesPackage,s:TruthState):ExtralOwnedItem[]{
 const stock=[...(s.extralInventory??[])];const seen=new Set(stock.map(i=>i.uid));
 for(const id of s.truthEquipment??[]){const uid='truth-'+id,item=pkg.equipment?.find(i=>i.id===id);if(!item||seen.has(uid))continue;seen.add(uid);stock.push({uid,itemId:id,name:item.name,kind:'truth',biological:false});}
 return stock;
}
function recombinationTarget(pkg:TruthRulesPackage,s:TruthState):TruthTalent|undefined{
 const g=normalizeExtralBuild(s.choices.extralBuild).recombination;
 if(!g.architecture.trim()||!extralInventory(pkg,s).some(i=>i.uid===g.graftUid&&i.biological))return;
 const t=(pkg.catalogs.extral??[]).find(t=>t.id===g.talentId),species=t?.when?.species;
 if(typeof species!=='string'||species==='homo_superior'||species===s.choices.species)return;
 return t;
}
export function extralVisibleTalent(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):boolean{
 if(s.nature!=='extral')return false;
 if(t.when?.species===s.choices.species)return true;
 if(typeof t.when?.network==='string'&&t.when.network===s.choices.network)return !!extralNetworkAccess(String(s.choices.species??''),t.when.network);
 return s.truthTalents.includes(ids.recombine)&&recombinationTarget(pkg,s)?.id===t.id;
}
function dependenciesMet(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):boolean{
 if(t.prerequisite&&s.truthTalents.includes(t.prerequisite))return true;
 const raw=norm(t.prerequisiteName);if(!raw)return !t.prerequisite;
 const candidates=(pkg.catalogs.extral??[]).filter(o=>o.id!==t.id&&raw.includes(norm(o.name)));
 if(!candidates.length)return false;
 const owned=candidates.filter(o=>s.truthTalents.includes(o.id)).length;
 return raw.includes('deux talents parmi')?owned>=2:raw.includes(' ou ')&&!raw.includes(' et ')?owned>=1:owned===candidates.length;
}
export function extralAcquisitionIssues(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):string[]|null{
 if(s.nature!=='extral'||!t.id.startsWith('extral-'))return null;
 const c=normalizeExtralBuild(s.choices.extralBuild),out:string[]=[];
 if(s.consciousness==='profane')out.push('Initiation à la Vérité nécessaire.');
 if(!extralVisibleTalent(pkg,s,t))out.push('Profil, réseau ou greffe justificative indisponible.');
 if(typeof t.when?.network==='string'){
  const access=extralNetworkAccess(String(s.choices.species??''),t.when.network);
  if((access==='O'||access==='R')&&(!c.training.trim()||c.trainingNetwork!==t.when.network))out.push(extralAccessLabels[access]+' : précisez le parcours à convenir avec le MJ.');
 }
 if(t.id===ids.recombine&&!recombinationTarget(pkg,s))out.push('Choisissez une greffe biologique réellement possédée, un talent racial précis et son architecture justificative.');
 if(!dependenciesMet(pkg,s,t))out.push('Prérequis : '+(t.prerequisiteName||t.prerequisite));
 return out;
}
/** Fixed-point access validation: a stale paid acquisition is retained but gives no mechanical bonus. */
export function extralUsableTalents(pkg:TruthRulesPackage,s:TruthState):Set<string>{
 if(s.nature!=='extral')return new Set();
 let selected=[...new Set(s.truthTalents)];const all=new Map((pkg.catalogs.extral??[]).map(t=>[t.id,t]));
 for(let n=0;n<=s.truthTalents.length;n++){
  const current={...s,truthTalents:selected};const next=selected.filter(id=>{const t=all.get(id);return !!t&&(extralAcquisitionIssues(pkg,current,t)?.length??1)===0;});
  if(next.length===selected.length)break;selected=next;
 }
 return new Set(selected);
}
export function extralCombatProfile(pkg:TruthRulesPackage,s:TruthState,stage:'v'|'sr'|'r'){
 const active=extralUsableTalents(pkg,s),species=s.choices.species;
 let armor=0,unarmed=1;
 if(species==='adrak')unarmed=stage==='r'?3:stage==='sr'?2:1;
 if(stage==='r'){
  if(species==='mosen') {armor=1;unarmed=2;}
  if(active.has('extral-osteodermes-renforces'))armor=Math.max(armor,2);
  if(active.has('extral-densification-osseuse'))armor=Math.max(armor,1);
  if(active.has('extral-vieux-cuir'))armor=Math.max(armor,3);
  if(active.has('extral-muscle-tasse'))unarmed=Math.max(unarmed,4);
 }
 return {armor,unarmed};
}
export function extralNaturalRecoveryMultiplier(pkg:TruthRulesPackage,s:TruthState){
 // Only the all-states permanent nanitic recovery modifies the ordinary resting totals.
 return s.nature==='extral'&&extralUsableTalents(pkg,s).has(ids.repair)?2:1;
}
export function extralInventoryAnnotation(s:TruthState,uid:string){
 if(s.nature!=='extral'||s.choices.species!=='homo_superior'||!s.truthTalents.includes(ids.phase)||s.consciousness==='profane')return '';
 const p=normalizeExtralBuild(s.choices.extralBuild).patches.find(p=>p.uid===uid);
 return p?`Patch tatoué AIDH — ${p.state==='phased'?'déphasé : indisponible avant matérialisation':'matérialisé'}. 1 PA par élément, 2 PA pour tenue/armure/lot, dans les deux sens ; aucun objet créé.`:'';
}
export function extralContextualBonuses(pkg:TruthRulesPackage,s:TruthState,skill:string,total:number,active=extralUsableTalents(pkg,s)){
 if(s.nature!=='extral')return [];
 return bonuses.filter(r=>active.has('extral-'+r.id)&&r.skills.includes(skill)).map(r=>({id:'extral-'+r.id,label:r.label+' · bonus conditionnel non cumulable avec un équivalent',bonus:r.bonus,total:total+r.bonus}));
}
export function extralSheetDetails(pkg:TruthRulesPackage,s:TruthState):Array<{id:string;name:string;value:string;description?:string}>{
 if(s.nature!=='extral')return [];
 const c=normalizeExtralBuild(s.choices.extralBuild),active=extralUsableTalents(pkg,s),all=new Map((pkg.catalogs.extral??[]).map(t=>[t.id,t]));
 const rows:Array<{id:string;name:string;value:string;description?:string}>=[];
 const add=(id:string,name:string,value:string,description='')=>rows.push({id:'extral-'+id,name,value,description});
 const access=extralNetworkAccess(String(s.choices.species??''),String(s.choices.network??''));if(access)add('training','Accès au réseau',extralAccessLabels[access],(c.trainingNetwork===s.choices.network?c.training:'')||'Formation à convenir avec le MJ ; aucun accord déduit de cette description.');
 const unavailable=s.truthTalents.filter(id=>all.has(id)&&!active.has(id));if(unavailable.length)add('unavailable','Acquisitions à régulariser',unavailable.map(id=>all.get(id)!.name).join(' ; '),'Achats et PTV conservés ; ces talents ne contribuent pas aux statistiques tant que leurs conditions manquent.');
 const profile=extralCombatProfile(pkg,s,'r');add('body','Profil corporel Révélé',`Armure corporelle ${profile.armor} · Pugilat DGT ${profile.unarmed}`,'Hors pouvoirs temporaires ; Armure portée seulement si réellement compatible.');
 if(s.choices.species==='baseanh'||c.preparations.length){const capacity=active.has(ids.bank)?4:2;add('tardollas','Préparations Tardollas',`${c.preparations.filter(p=>p.remaining>0).length} / ${capacity} préparations actives`,'Stocks de suivi ; aucune recharge automatique à la sauvegarde ou au changement de forme.');for(const p of c.preparations)add('prep-'+p.uid,p.name||'Préparation sans nom',`${p.remaining} dose(s) · ${p.kind}`,`${p.effect}\nRésistance : ${p.resistance}\nDurée : ${p.duration}`);}
 for(const [id,name,used] of [[ids.reserve,'Réserve nanitique',c.reserveUsed],[ids.repair,'Cycle de réparation',c.repairUsed]] as const)if(s.truthTalents.includes(id))add(id,name,used?'Utilisation du scénario consommée':'Une utilisation disponible pour le scénario',all.get(id)?.effectDetails||all.get(id)?.effect||'');
 for(const p of c.patches){const item=extralInventory(pkg,s).find(i=>i.uid===p.uid);add('patch-'+p.uid,'Patch AIDH — '+(item?.name||'Ancien objet absent'),item?extralInventoryAnnotation(s,p.uid)||'Talent de Phasage non utilisable':'Référence conservée, aucun objet créé.');}
 if(c.recombination.talentId)add('recombination','Héritage recombiné',all.get(c.recombination.talentId)?.name||c.recombination.talentId,`Greffe : ${extralInventory(pkg,s).find(i=>i.uid===c.recombination.graftUid)?.name||'Absente'}\n${c.recombination.architecture}\nLa justification biologique doit être validée en partie avec le MJ ; le texte n’accorde pas une autorisation.`);
 if(c.hydrated&&s.choices.species==='rocreen')add('hydration','Hydratation du Noyau','Hydratation complète indiquée',active.has('extral-cicatrisation-humide')?'En R, récupération naturelle hors combat doublée dans ces conditions ; aucun soin immédiat créé.':'Indication de fiche uniquement.');
 for(const p of c.projects)add('project-'+p.uid,p.name||'Configuration',p.effect,`Talent : ${all.get(p.talentId)?.name||'À associer'}\nMatériaux réels : ${p.materials}\nPA : ${p.pa??'À préciser'} · Durée : ${p.duration}\nLimites : ${p.limits}\nPréparation descriptive à convenir avec le MJ ; pas un objet gratuit.`);
 return rows;
}
