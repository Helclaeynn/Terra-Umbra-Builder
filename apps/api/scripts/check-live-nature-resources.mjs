import assert from 'node:assert/strict';
import {truthCoreRules} from '../dist/rules/truth/core-rules.js';
import {applyNatureResourceAction as apply,natureResourceProfile as profile,mageSpellPlan,natureTalentAvailable,naturePowers,blankNatureResources,natureResourceIds,resetNaturePeriod,natureHpCeiling,consumeNatureRollBonus,natureAttributeModifiers,daemonSpectra,daemonSpectrumPlan} from '../dist/rules/live-nature-resources.js';
const state=()=>({revelation:'r',round:1,pa:3,hp:12,initiative:20,unconscious:false,powerUses:{},natureResources:blankNatureResources()});
const mage=(talents=[])=>({truth:{nature:'mage',consciousness:'initie',choices:{mageiusType:'discella',dominantAffinity:'skiamancie'},truthTalents:talents},progression:{truthTalents:[]}});
const angel=(talents=[],choices={})=>({truth:{nature:'angelus',consciousness:'initie',choices:{angelNature:'domination',sephirah:'tiphereth',...choices},truthTalents:talents},progression:{truthTalents:[]}});
const daemon=(talents=[])=>({truth:{nature:'daemon',consciousness:'initie',choices:{divinity:'alabor',function:'oracle'},truthTalents:talents},progression:{truthTalents:[]}});
const ctx={inCombat:true,permanentFortitude:4,hp:12,pvMax:12,death:-4};
const spell=(override={})=>({affinity:'skiamancie',amplitude:'mineure',range:'will',channel:0,opposed:true,urgent:true,contextDifficult:true,forceAmplitude:false,forceMastery:false,note:'Ombre réelle',...override});
const error=(fn,code)=>assert.throws(fn,e=>e.code===code);
// Canonical amplitude/knowledge/portée/canalisation; never lower hostile Defence.
assert.equal(mageSpellPlan(mage(),state(),spell()).difficulty,15);
error(()=>mageSpellPlan(mage(['mage_skiamancie_amplitude_majeure']),state(),spell({amplitude:'majeure'})),'spell_amplitude_unavailable');
assert.equal(mageSpellPlan(mage(),state(),spell({range:'contact'})).difficulty,12);
assert.equal(mageSpellPlan(mage(),state(),spell({range:'sight'})).difficulty,18);
assert.equal(mageSpellPlan(mage(),state(),spell({affinity:'photomancie'})).difficulty,18);
error(()=>mageSpellPlan(mage(),state(),spell({affinity:'photomancie',amplitude:'significative'})),'spell_amplitude_unavailable');
error(()=>mageSpellPlan(mage(),state(),spell({affinity:'photomancie',forceMastery:true})),'force_requires_owned_affinity');
const master=mage(['mage_skiamancie_amplitude_significative','mage_skiamancie_amplitude_majeure','mage_skiamancie_amplitude_cataclysmique']);
let plan=mageSpellPlan(master,state(),spell({amplitude:'cataclysmique',range:'sight',channel:1}));assert.equal(plan.difficulty,25);assert.equal(plan.pa,5);assert.equal(plan.mandatoryChannel,1);
error(()=>mageSpellPlan(master,state(),spell({amplitude:'cataclysmique',range:'sight'})),'mandatory_channel_missing');
plan=mageSpellPlan(master,state(),spell({amplitude:'cataclysmique',channel:2}));assert.equal(plan.difficulty,18);assert.equal(plan.pa,6);assert.equal(plan.tension,4);assert.equal(plan.damage,24);
assert.equal(mageSpellPlan(master,state(),spell({opposed:false,urgent:false,contextDifficult:false})).automatic,true);
assert.equal(mageSpellPlan(master,state(),spell()).automatic,false);
error(()=>mageSpellPlan(master,{...state(),revelation:'sr'},spell({amplitude:'significative'})),'spell_amplitude_unavailable');
// PA payment spans consecutive rounds. Pressure appears only on actual release, incl failures.
let s=state();let out=apply(master,s,{action:'nature-mage-begin',spell:spell({amplitude:'majeure',channel:1}),invest:2},ctx);s=out.state;assert.equal(s.pa,1);assert.equal(s.natureResources.mage.tension,0);assert.equal(out.payload.remaining,2);assert.equal(s.natureResources.mage.preparation.difficulty,15);
error(()=>apply(master,s,{action:'nature-mage-release'},ctx),'spell_not_ready');
s.round=2;s.pa=3;s=apply(master,s,{action:'nature-mage-invest',amount:2},ctx).state;
out=apply(master,s,{action:'nature-mage-release'},{...ctx,rollResult:14});s=out.state;assert.equal(out.payload.success,false);assert.equal(s.natureResources.mage.tension,3);assert.equal(s.natureResources.mage.pendingBacklash,3);assert.equal(s.pa,1);
error(()=>apply(master,s,{action:'nature-mage-begin',spell:spell(),invest:1},ctx),'mageius_unavailable');
out=apply(master,s,{action:'nature-mage-backlash'},{...ctx,rollResult:11});s=out.state;assert.equal(s.hp,9);assert.equal(s.pa,0);assert.equal(s.natureResources.mage.dormant,true);assert.equal(out.payload.dormanceDays,'environ 2');
resetNaturePeriod(s,'scenario');assert.equal(s.natureResources.mage.dormant,true);assert.equal(s.natureResources.mage.tension,3);
error(()=>apply(master,s,{action:'nature-settings',mageDormant:false},ctx),'nature_settings_mj_only');
s=apply(master,s,{action:'nature-settings',mageDormant:false},{...ctx,manager:true}).state;assert.equal(s.natureResources.mage.dormant,false);
// No relief by choosing an affinity or cancelling. Equilibrium first change only.
const m=mage([natureResourceIds.equilibrium,natureResourceIds.discharge,'mage_awaken_photomancie']);s=state();s.natureResources.mage.tension=2;s.natureResources.mage.lastAffinity='photomancie';
s=apply(m,s,{action:'nature-mage-begin',spell:spell(),invest:1},ctx).state;assert.equal(s.natureResources.mage.tension,2);
out=apply(m,s,{action:'nature-mage-release'},{...ctx,rollResult:20});s=out.state;assert.equal(s.natureResources.mage.tension,1);assert.equal(out.payload.affinityReduction,2);assert.equal(s.powerUses['round:'+natureResourceIds.equilibrium],1);
s=apply(m,s,{action:'nature-mage-begin',spell:spell({affinity:'photomancie'}),invest:1},ctx).state;
s=apply(m,s,{action:'nature-mage-cancel'},ctx).state;assert.equal(s.natureResources.mage.tension,1);
// Rest consumes remaining actions, relief once, does not work after Mageius use.
error(()=>apply(m,s,{action:'nature-mage-rest'},ctx),'mage_rest_unavailable');s.round=2;s.pa=3;s.powerUses={};out=apply(m,s,{action:'nature-mage-rest'},ctx);s=out.state;assert.equal(s.pa,0);assert.equal(s.natureResources.mage.tension,0);
error(()=>apply(m,s,{action:'nature-mage-begin',spell:spell(),invest:1},ctx),'mageius_unavailable');
s=state();s.natureResources.mage.tension=2;out=apply(m,s,{action:'nature-mage-discharge'},{...ctx,rollResult:1,narrativeFailure:true});s=out.state;assert.equal(s.natureResources.mage.tension,3);assert.equal(s.pa,2);assert.equal(s.natureResources.mage.pendingBacklash,null);error(()=>apply(m,s,{action:'nature-mage-discharge'},{...ctx,rollResult:30}),'power_already_used');
// Superior Will is not a free advancement and catastrophic backlash cannot be avoided by a good roll.
s=state();s=apply(mage(),s,{action:'nature-mage-begin',spell:spell({amplitude:'significative',forceAmplitude:true}),invest:2},ctx).state;out=apply(mage(),s,{action:'nature-mage-release'},{...ctx,rollResult:100});assert.equal(out.state.hp,5);assert.equal(out.state.unconscious,true);assert.equal(out.state.natureResources.mage.dormant,true);
// Aura uses permanent Fortitude and capacity purchase never fills current reserve.
let a=angel([natureResourceIds.boost,natureResourceIds.egide,natureResourceIds.offering]);s=state();assert.equal(profile(a,s,4).angelus.maximum,7);assert.equal(profile(a,s,4).angelus.aura,0);assert.equal(profile(angel(['nature_commune_pouvoirs_angeliques_talents_communs_reserve_transcendee']),s,30).angelus.maximum,10);
s=apply(a,s,{action:'nature-angelus-open'},ctx).state;assert.equal(s.natureResources.angelus.aura,2);assert.equal(s.pa,2);
s=apply(a,s,{action:'nature-settings',holyPlace:true},{...ctx,manager:true}).state;s=apply(a,s,{action:'nature-angelus-open',boost:true},ctx).state;assert.equal(s.natureResources.angelus.aura,6);assert.equal(s.pa,1);
error(()=>apply(a,s,{action:'nature-angelus-open',boost:true},ctx),'power_already_used');
s=apply(a,s,{action:'nature-settings',connected:false},{...ctx,manager:true}).state;assert.equal(s.natureResources.angelus.aura,6);error(()=>apply(a,s,{action:'nature-angelus-open'},ctx),'aureole_disconnected');
error(()=>apply(a,s,{action:'nature-angelus-egide',amount:1},{...ctx,spiritualDamage:false,damage:5}),'egide_not_applicable');
out=apply(a,s,{action:'nature-angelus-egide',amount:2},{...ctx,spiritualDamage:true,damage:5});s=out.state;assert.equal(out.payload.damageReduction,5);assert.equal(s.natureResources.angelus.aura,4);assert.equal(s.pa,0);
// Sacrifices cannot loop through healing; scene permits healing but never restores the paid PV.
s.pa=3;s=apply(a,s,{action:'nature-angelus-offering'},ctx).state;assert.equal(s.hp,11);assert.equal(s.natureResources.angelus.aura,6);assert.equal(natureHpCeiling(a,s,12),11);error(()=>apply(a,s,{action:'nature-angelus-offering'},ctx),'power_already_used');
s=apply(a,s,{action:'nature-angelus-blade',sacrifice:2},{...ctx,hp:11}).state;assert.equal(s.hp,9);assert.equal(natureHpCeiling(a,s,12),9);error(()=>apply(a,s,{action:'nature-angelus-blade',sacrifice:1},ctx),'blade_already_active');s=apply(a,s,{action:'nature-angelus-dismiss-blade'},ctx).state;assert.equal(s.hp,9);assert.equal(natureHpCeiling(a,s,12),11);resetNaturePeriod(s,'scene');assert.equal(s.hp,9);assert.equal(natureHpCeiling(a,s,12),12);assert.equal(s.natureResources.angelus.connected,false);
s=state();s.natureResources.angelus.aura=4;s=apply(a,s,{action:'nature-angelus-wings'},ctx).state;assert.deepEqual(natureAttributeModifiers(a,s),[{attribute:'agilite',amount:1,label:'Ailes transcendées'}]);assert.equal(s.initiative,20);error(()=>apply(a,s,{action:'nature-angelus-wings'},ctx),'power_already_active');
// Canonical paid power spends Aura on first PA, keeps it lost on interruption, protects quotas.
const power=truthCoreRules.catalogs.angelus.find(p=>p.name==='Rêve rendu réel');a=angel([power.id],{sephirah:'yessod',angelusBuild:{construct:{name:'Mur',kind:'bulwark',purpose:'Abriter',limits:'30 m'}}});s=state();s.natureResources.angelus.aura=7;
assert.equal(natureTalentAvailable(a,power.id),true);out=apply(a,s,{action:'nature-power',id:power.id,invest:1},ctx);s=out.state;assert.equal(s.natureResources.angelus.aura,4);assert.equal(s.pa,2);assert.equal(s.natureResources.powerPreparation.paid,1);
s=apply(a,s,{action:'nature-power-cancel'},ctx).state;assert.equal(s.natureResources.angelus.aura,4);assert.equal(s.powerUses['scene:'+power.id],1);assert.equal(naturePowers(a,s).find(p=>p.id===power.id).available,false);
a.truth.choices.sephirah='kether';assert.equal(natureTalentAvailable(a,power.id),false);
// Descriptive abilities with unspecified action costs are not silently free universal powers.
const unpriced=truthCoreRules.catalogs.daemon.find(p=>p.name==='Écrasement hydrostatique');assert.equal(naturePowers(daemon([unpriced.id]),state()).find(p=>p.id===unpriced.id).pa,null);
// Divine Favour is location-gated, quota-gated, one pending contextual +3, not an automatic new scene reward.
let d=daemon([natureResourceIds.resonance]);s=state();error(()=>apply(d,s,{action:'nature-daemon-favor',note:'Facette Flots',skill:'maitrise_spirituelle'},ctx),'divine_favor_unavailable');s=apply(d,s,{action:'nature-settings',resonancePlace:true},{...ctx,manager:true}).state;
assert.equal(profile(d,s).daemon.favorLimit,2);s=apply(d,s,{action:'nature-daemon-favor',note:'Facette Flots',skill:'maitrise_spirituelle'},ctx).state;assert.equal(profile(d,s).daemon.canFavor,false);assert.equal(consumeNatureRollBonus(d,s,'athletisme'),null);assert.equal(consumeNatureRollBonus(d,s,'maitrise_spirituelle').bonus,3);assert.equal(consumeNatureRollBonus(d,s,'maitrise_spirituelle'),null);
s=apply(d,s,{action:'nature-daemon-favor',note:'Facette Pression',skill:'maitrise_spirituelle'},ctx).state;consumeNatureRollBonus(d,s,'maitrise_spirituelle');error(()=>apply(d,s,{action:'nature-daemon-favor',note:'Facette Flots',skill:'maitrise_spirituelle'},ctx),'divine_favor_unavailable');
assert.equal(profile({...d,truth:{...d.truth,consciousness:'profane'}},s).enabled,false);
// Spectres of Méphisto are independent per affinity, capped and free of Mage Tension/Revers.
d=daemon(['mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_spectre_amplifie','mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_spectre_affine','mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_polyphonie_occulte']);d.truth.choices.divinity='mephisto';d.truth.choices.daemonBuild={spectralAffinity:'skiamancie',secondSpectralAffinity:'telekinesie'};
assert.deepEqual(daemonSpectra(d).map(a=>[a.id,a.mastery,a.amplitude]),[['skiamancie',1,1],['telekinesie',0,0]]);
assert.equal(daemonSpectrumPlan(d,state(),spell()).difficulty,12);assert.equal(daemonSpectrumPlan(d,state(),spell({amplitude:'significative'})).tension,0);
error(()=>daemonSpectrumPlan(d,state(),spell({affinity:'telekinesie',amplitude:'significative'})),'spell_amplitude_unavailable');
error(()=>daemonSpectrumPlan(d,state(),spell({amplitude:'majeure'})),'spell_amplitude_unavailable');
error(()=>daemonSpectrumPlan(d,state(),spell({forceMastery:true})),'spectrum_cannot_force');
s=apply(d,state(),{action:'nature-daemon-spectrum-begin',spell:spell({amplitude:'significative'}),invest:2},ctx).state;s=apply(d,s,{action:'nature-daemon-spectrum-release'},{...ctx,rollResult:1,narrativeFailure:true}).state;assert.equal(s.natureResources.mage.tension,0);assert.equal(s.natureResources.mage.dormant,false);assert.equal(s.natureResources.mage.pendingBacklash,null);
// Changing a patron invalidates the previous Favour; explicit quota/cost tracking remains assistive.
d=daemon();d.truth.choices.patron='vephar';const favor=profile(d,state()).powers.find(p=>p.name.includes('Vephar'));assert.equal(favor.pa,1);assert.equal(favor.limit,'scene');assert.equal(favor.available,true);s=apply(d,state(),{action:'nature-power',id:favor.id,invest:1},ctx).state;d.truth.choices.patron='forneus';error(()=>apply(d,s,{action:'nature-power-release'},ctx),'nature_power_unavailable');
console.log('LIVE NATURE RESOURCES OK — Mage amplitude/portée/canalisation/Tension/Revers/Dormance; Aura/recharge/Égide/sacrifices/quotas; paid preparations, gating and Faveur');
