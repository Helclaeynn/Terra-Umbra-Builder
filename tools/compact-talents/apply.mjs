import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
const changed=[];
function once(source,from,to){assert.equal(source.split(from).length-1,1,'Expected one reviewed anchor: '+from.slice(0,130));return source.replace(from,to);}
function edit(path,fn){const old=readFileSync(path,'utf8'),next=fn(old);assert.notEqual(old,next,path+' must change');writeFileSync(path,next);changed.push(path);}
const dir='apps/web/src/components/builder/';
edit(dir+'TalentSelector.vue',s=>{
 s=once(s,'import { computed, ref } from "vue";','import { computed, ref } from "vue";\nimport RealityTalentText from "./RealityTalentText.vue";\nimport {shortRealityTalent} from "../../../../api/src/rules/reality-talents-summaries";');
 s=once(s,"{{ talent.effect||talent.description||'Consulter la fiche pour les détails.' }}","{{ shortRealityTalent(talent.id,talent.effect||talent.description||'Consulter la fiche pour les détails.') }}");
 s=once(s,'<em v-if="selectedLore">{{ selectedLore }}</em>\n        <p><b>Effet mécanique :</b> {{ selected.effect || selected.description || "—" }}</p>','<RealityTalentText :talent-id="selected.id" :effect="selected.effect || selected.description" :lore="selectedLore" />');
 return s;
});
edit(dir+'CharacterSummary.vue',s=>{
 s=once(s,'import { computed } from "vue";','import { computed } from "vue";\nimport RealityTalentText from "./RealityTalentText.vue";');
 const original='<p v-if="item.lore" class="sheet-entry-lore">{{ item.lore }}</p><p v-if="item.detail">{{ item.detail }}</p>';
 assert.equal(s.split(original).length-1,2,'Talent and inventory renderers remain distinct');
 s=s.replace(original,'<RealityTalentText v-if="list.id===\'reality\'" :talent-id="item.id" :effect="item.detail" :lore="item.lore" /><template v-else>'+original+'</template>');
 s=once(s,'<dd>{{ skill.value }}</dd>','<dd>{{ skill.value }}</dd><div v-for="context in skill.contexts || []" :key="context.id" class="skill-context-total" :data-skill-context="context.id"><dt>{{ context.label }} · bonus de Talent +{{ context.bonus }}</dt><dd>{{ context.total }}</dd></div>');
 s=once(s,'<style scoped>','<style scoped>\n.skill-context-total{display:flex;justify-content:space-between;gap:12px;grid-column:1/-1;font-size:12px;color:#a5def0;width:100%;margin-top:4px}.skill-context-total dt{overflow-wrap:anywhere}.skill-context-total dd{font-weight:600}\n');
 return s;
});
edit(dir+'ProgressionStep.vue',s=>{
 s=once(s,'<script setup lang="ts">','<script setup lang="ts">\nimport RealityTalentText from "./RealityTalentText.vue";\nimport {contextualSkillBonuses} from "../../../../api/src/rules/reality-conditional-bonuses";');
 s=once(s,'<p>{{ ruleTalentById(id)?.effect }}</p><details v-if="talentLore?.[id]" class="talent-lore"><summary>Contexte et lore</summary><p>{{ talentLore[id] }}</p></details>','<RealityTalentText :talent-id="id" :effect="ruleTalentById(id)?.effect" :lore="talentLore?.[id]" />');
 s=once(s,'<p>{{ talent.effect || "—" }}</p>\n            <details v-if="talentLore?.[talent.id]" class="talent-lore"><summary>Contexte et lore</summary><p>{{ talentLore[talent.id] }}</p></details>','<RealityTalentText :talent-id="talent.id" :effect="talent.effect" :lore="talentLore?.[talent.id]" />');
 s=once(s,'<small>Final {{ currentSkillFinal(skill.id) }} · création {{ skillBases[skill.id] || 0 }}</small>','<small>Final {{ currentSkillFinal(skill.id) }} · création {{ skillBases[skill.id] || 0 }}</small><small v-for="context in contextualSkillBonuses(combinedRealityIds,{...creationTalentChoices,...state.realityTalentChoices},talentChoiceSpecs??{},skillTalentMap,skill.id,currentSkillFinal(skill.id))" :key="context.id" :data-skill-context="context.id">{{ context.label }} : {{ context.total }}</small>');
 return s;
});
edit('apps/web/src/lib/character-sheet.ts',s=>once(s,'base?:number };','base?:number; contexts?:Array<{id:string;label:string;bonus:number;total:number}> };'));
edit('apps/web/src/lib/character-sheet-model.ts',s=>{
 s='import {contextualSkillBonuses} from "../../../api/src/rules/reality-conditional-bonuses";\n'+s;
 return once(s,'bonus:skill(item.id)-rawSkill(item.id)})),','bonus:skill(item.id)-rawSkill(item.id),contexts:contextualSkillBonuses(realityIds,choices,core.talentChoiceSpecs,core.skillTalentMap,item.id,skill(item.id))})),');
});
edit('apps/web/src/lib/reality-benefits.ts',s=>{
 s=once(s,'referencePrice(p,map.get(p.itemId)),0);','(map.has(p.itemId)?(realityPriceSpec(map.get(p.itemId)!).defaultCost??referencePrice(p,map.get(p.itemId))):referencePrice(p)),0);');
 const anchor='/** Add a distinct loan. A paid possession is never silently converted into a refund. */';
 const helper=`/** Same eligibility is used by the selector and the actual grant, including imported records. */
export function loanAvailabilityReason(state:RealityState,pkg:RealityRulesPackage,id:string,item:RealityItem){
 const reason=loanItemReason(item,id);if(reason)return reason;
 if(['armurier_du_milieu','programme_pilote'].includes(id)&&state.equipment.some(p=>p.talentGrant===id))return 'Restituer le prêt actuel avant de changer de matériel.';
 const budget=loanBudget(id),cost=realityPriceSpec(item).defaultCost;
 if(cost===null)return 'Prix catalogue requis.';
 if(budget!==null&&loanSpent(state,pkg,id)+cost>budget)return 'Plafond de dotation dépassé.';
 if(cost>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return 'Accord MJ requis au-delà du seuil du catalogue.';
 return '';
}
`;
 s=once(s,anchor,helper+anchor);
 s=once(s,"const reason=loanItemReason(item,id);if(reason)throw new Error(reason);","const reason=loanAvailabilityReason(state,pkg,id,item);if(reason)throw new Error(reason);");
 s=once(s,"if(!rows.length)errors.push(`${loanLabel(id)} : matériel à choisir.`);","if(!rows.length)errors.push(`${loanLabel(id)} : matériel à choisir.`);\n    for(const row of rows){const item=pkg.equipment.find(i=>i.id===row.itemId);if(!item||loanItemReason(item,id))errors.push(`${loanLabel(id)} : modèle incompatible avec le prêt.`);}");
 return s;
});
edit(dir+'RealityBenefitsPanel.vue',s=>{
 s=once(s,'loanSpent,loanItemReason,','loanSpent,loanItemReason,loanAvailabilityReason,');
 s=once(s,"!loanItemReason(i,id)&&!(i.neuro", "!loanItemReason(i,id)&&(loanBudget(id)===null||(realityPriceSpec(i).defaultCost??Infinity)<=Number(loanBudget(id))-loanSpent(state.value,props.rules,id))&&!(i.neuro");
 s=once(s,'function add(id:string){if(!authorized.value[id])return;',"function blocked(id:string){const item=props.rules.equipment.find(i=>i.id===picks.value[id]);return item?loanAvailabilityReason(state.value,props.rules,id,item):'Choisir un modèle.';}\nfunction add(id:string){if(!authorized.value[id]||blocked(id))return;");
 s=once(s,':disabled="!picks[id]||!authorized[id]"',':disabled="!picks[id]||!authorized[id]||!!blocked(id)"');
 s=once(s,'@click="add(id)">Recevoir le prêt · 0 $</button>','@click="add(id)">Recevoir le prêt · 0 $</button><p v-if="picks[id] && blocked(id)" role="status">{{ blocked(id) }}</p>');
 return s;
});
edit('apps/web/Dockerfile',s=>once(s,'COPY apps/api/src/campaign-preparation.ts','COPY apps/api/src/rules/reality-talents-summaries.ts apps/api/src/rules/reality-conditional-bonuses.ts /app/apps/api/src/rules/\nCOPY apps/api/src/campaign-preparation.ts'));
// Extend the existing real-component harness without removing or weakening any assertions.
let test=readFileSync('apps/web/tests/reality-talents-integration.mjs','utf8');
test=once(test,"import Equipment from './src/components/builder/EquipmentStep.vue';","import Equipment from './src/components/builder/EquipmentStep.vue';\nimport Sheet from './src/components/builder/CharacterSummary.vue';\nimport Text from './src/components/builder/RealityTalentText.vue';\nimport Selector from './src/components/builder/TalentSelector.vue';\nimport {realityTalentSummaries} from '../api/src/rules/reality-talents-summaries';\nimport {contextualSkillBonuses} from '../api/src/rules/reality-conditional-bonuses';");
test=once(test,'window.qa={b,r,p,','window.qa={realityTalentSummaries,contextualSkillBonuses,b,r,p,');
test=once(test,"which==='equipment'?Equipment:Progression","which==='sheet'?Sheet:which==='text'?Text:which==='selector'?Selector:which==='equipment'?Equipment:Progression");
test=once(test,"w.stop();dom.window.close();assert.deepEqual(errors,[],'No runtime errors');",readFileSync('tools/compact-talents/test-additions.mjs','utf8')+"\nw.stop();dom.window.close();assert.deepEqual(errors,[],'No runtime errors');");
writeFileSync('apps/web/tests/reality-talents-compact.mjs',test);changed.push('apps/web/tests/reality-talents-compact.mjs');
writeFileSync('/tmp/compact-talents-paths.json',JSON.stringify(changed));
console.log('COMPACT TALENTS PATCH READY — '+changed.length+' files; complete canonical effects and identifiers unchanged.');
