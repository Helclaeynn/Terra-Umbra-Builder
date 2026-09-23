import {NPC_CATALOG} from './campaign-npc-generator.js';
import {NPC_SEXES,type NpcData,type NpcArticleDraft,type NpcArticleBlock} from './campaign-npc-model.js';
import {characterDerivedStats} from './rules/character-derived-stats.js';
// Free-form NPC fields are prose, not wiki directives. Preserve visible text on
// the editor's structured -> wiki -> structured round-trip, including private fields.
const prose=(value:string)=>value.replace(/\r\n?/g,'\n').split('\n').map(line=>/^\s*(?:={2,4}|\{\{|\{\||\|}|\||!|\*)/.test(line)?'\u200b'+line:line).join('\n');
const cell=(value:string)=>prose(value).replace(/\n/g,' · ').replace(/\|\|/g,'|\u200b|').replace(/!!/g,'!\u200b!');
const paragraph=(text:string):NpcArticleBlock=>({type:'p',text:prose(text)});
const table=(rows:string[][]):NpcArticleBlock=>({type:'table',rows:rows.map(row=>row.map(cell))});
export function canonicalNpcDraft(n:NpcData):NpcArticleDraft{
 const c=NPC_CATALOG,tier=c.tiers.find(t=>t.id===n.tierId)!;
 const derived=characterDerivedStats(id=>n.attributes[id]||0,id=>n.skills[id]||0,[]);
 const sex=NPC_SEXES.find(s=>s.id===(n.sex??'unspecified'))!.name;
 const privateFields=[['Faction ou groupe',n.faction],['Motivation',n.motivation],['Secret ou accroche',n.secret],['Équipement réellement porté',n.equipment],['Vérité et pouvoirs particuliers',n.truthNotes],['Notes',n.notes],['Tags de travail',n.tags.join(', ')]];
 const profile:NpcArticleBlock[]=[
  paragraph(`Palier : ${tier.name}. Budgets : ${tier.attributes} points d’attributs et ${tier.skills} points de compétences ; plafond ordinaire ${tier.cap}.`),
  table([['Attribut',...c.attributes.map(a=>a.name)],['Valeur',...c.attributes.map(a=>String(n.attributes[a.id]))]]),
  table([['Compétence','Rang','Jet'],...c.skills.filter(s=>n.skills[s.id]>0).map(s=>[s.name,String(n.skills[s.id]),`${n.attributes[s.attribute]+n.skills[s.id]} + 1d10e`])]),
  table([['Valeur dérivée','Résultat'],['PV',String(derived.pvMax)],['Seuil de Mort',String(derived.death)],['Initiative',`${derived.initiative} + 1d10e`],['Défense passive / active',`${derived.passiveDefense} / ${derived.passiveDefense} + 1d10e`],['Défense occulte passive / active',`${derived.occultDefense} / ${derived.occultDefense} + 1d10e`],['Déplacement',`${derived.movement} m par PA`],['Intégrité',String(derived.integrity)],['Stress augmentique max',String(derived.augmentStressMax)],['Armure portée',String(n.armor)]]),
  ...n.talentIds.map(id=>{const t=c.talents.find(t=>t.id===id)!;const expertise=id==='Expertise éprouvée'?` Compétence : ${c.skills.find(s=>s.id===n.expertiseSkill)?.name}.`:'';return paragraph(`${t.name} — ${t.prerequisite}.${expertise}\n${t.effect}`);}),
  ...(n.apexSkill?[paragraph(`Apex — ${c.skills.find(s=>s.id===n.apexSkill)?.name} : ${n.apexReason}`)]:[])
 ];
 return {id:'',title:n.name.trim(),category:'Personnages',source:'Création originale',status:'canon_recent',tags:['réalité/PNJ'],pnj:{real_name:n.name.trim(),sexe:sex,protect_truth_metadata:true,...(n.portrait?{portrait:n.portrait,portrait_alt:n.name.trim()}:{}),generator_profile:{tierId:n.tierId,presetId:n.presetId}},sections:[
  {id:'identite-apparente',title:'Identité apparente',level:2,blocks:[table([['Identité','Valeur'],['Nom',n.name],['Rôle',n.role],['Sexe',sex]]),...(n.appearance?[paragraph(n.appearance)]:[]),...(n.personality?[paragraph(n.personality)]:[])]},
  {id:'dossier-mj',title:'Dossier MJ',level:2,audience:'mj',blocks:privateFields.filter(([,value])=>value.trim()).map(([label,value])=>paragraph(`${label} : ${value}`))},
  {id:'profil-statistique',title:'Profil statistique',level:2,audience:'mj',blocks:profile}
 ]};
}
