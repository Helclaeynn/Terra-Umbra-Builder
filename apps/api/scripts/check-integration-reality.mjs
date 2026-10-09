import assert from 'node:assert/strict';
import {blankPlayState,playProfile} from '../dist/rules/play-state.js';
import {applyExtendedPlayAction,liveHealingMaximum} from '../dist/character-live-mechanics.js';
import {consumeRegisteredTest} from '../dist/rules/registered-power-state.js';
import {isExtendedPlayAction} from '../dist/rules/extended-actions.js';
import {blankNatureResources} from '../dist/rules/live-nature-resources.js';
const state=()=>({...blankPlayState(),revelation:'r',hp:12,pa:3,paPerRound:3,initiative:20});
const data=(nature,truthTalents=[],choices={})=>({attributes:{vigueur:6,agilite:4,esprit:4,volonte:4,charisme:4},truth:{nature,consciousness:'initie',truthTalents,choices},creation:{sphere:'crawler'},skills:{force_mentale:{style:4}},reality:{equipment:[],augmentations:[]},progression:{truthTalents:[]}});
const ctx={fighting:true,participating:true,manager:false,actorId:'player'};
// A fixed Athlétisme effect cannot be retargeted by the request. Its first actual
// matching test consumes it; an unrelated test does not destroy it.
const talass=data('extral',['extral-rebond-d-appui'],{species:'talass'});
assert.throws(()=>applyExtendedPlayAction(talass,state(),{action:'power-activate',powerId:'extral-rebond-d-appui',contextConfirmed:true,skill:'tir'},ctx),/power_skill_unavailable/);
const before=playProfile(talass,state());
let out=applyExtendedPlayAction(talass,state(),{action:'power-activate',powerId:'extral-rebond-d-appui',contextConfirmed:true},ctx);
assert.equal(out.state.pa,3);assert.equal(out.payload.effects[0].amount,3);assert.equal(playProfile(talass,out.state).skills.find(s=>s.id==='athletisme').total,before.skills.find(s=>s.id==='athletisme').total+3);
consumeRegisteredTest(talass,out.state,'tir');assert.equal(out.state.registeredPowers.length,1);
consumeRegisteredTest(talass,out.state,'athletisme');assert.equal(out.state.registeredPowers.length,0);
// Old checkbox contexts cannot bypass a prepared capability's scene quota.
const exile=data('exile',['exile-lecture-des-etres'],{people:'elye'}),unchecked=state();
unchecked.contexts=['exile-lecture-des-etres'];
assert.equal(playProfile(exile,unchecked).skills.find(s=>s.id==='diplomatie').prepared.some(p=>p.id==='exile-lecture-des-etres'),false);
out=applyExtendedPlayAction(exile,state(),{action:'power-activate',powerId:'exile-lecture-des-etres',contextConfirmed:true,skill:'diplomatie'},ctx);
consumeRegisteredTest(exile,out.state,'diplomatie');
assert.throws(()=>applyExtendedPlayAction(exile,out.state,{action:'power-activate',powerId:'exile-lecture-des-etres',contextConfirmed:true,skill:'diplomatie'},ctx),/power_already_used/);
// Spectre release runs the server roll path as Mage release does; a caller does
// not supply a result or create Mage Tension on a Daemon.
const daemon=data('daemon',[],{divinity:'mephisto',function:'oracle',daemonBuild:{spectralAffinity:'skiamancie'}});
out=applyExtendedPlayAction(daemon,state(),{action:'nature-daemon-spectrum-begin',spell:{affinity:'skiamancie',amplitude:'mineure',range:'will',channel:0,opposed:true,urgent:true,contextDifficult:true}},ctx);
out=applyExtendedPlayAction(daemon,out.state,{action:'nature-daemon-spectrum-release'},ctx);
assert.equal(out.payload.dice.length>=1,true);assert.equal(typeof out.payload.total,'number');assert.equal(out.state.natureResources.mage.tension,0);assert.equal(out.state.natureResources.mage.preparation,null);
// Reduced maximum from an Angelus sacrifice is shared by healing callers.
const angel=data('angelus'),sacrificed=state();sacrificed.natureResources=blankNatureResources();sacrificed.natureResources.angelus.offeringHp=1;sacrificed.natureResources.angelus.bladeHp=2;
assert.equal(liveHealingMaximum(angel,sacrificed,12),9);
for(const action of ['nature-angelus-eyes','nature-angelus-wings','nature-angelus-impulse'])assert.equal(isExtendedPlayAction(action),true,action+' has a reachable action handler');
console.log('REALITY INTEGRATION OK — fixed effect targeting, prepared quotas, legacy context exclusion, server Spectre rolls, sacrifice ceiling and reachable Angelus actions');
