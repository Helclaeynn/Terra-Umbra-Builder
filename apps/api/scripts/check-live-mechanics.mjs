import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankPlayState} from '../dist/rules/play-state.js';
import {defenseOptions,consumeUsage,resetLivePeriod,reserveHealing,hourlyRecovery,cycleId,reserveId} from '../dist/rules/live-mechanics.js';
export async function checkLiveMechanics({pool,call,player,character}){
 const original=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const data=structuredClone(original);data.truth={nature:'extral',consciousness:'initie',choices:{species:'homo_superior'},truthTalents:['extral-reflexe-conditionne',cycleId,reserveId]};
 const state={...blankPlayState(),hp:2,pa:0};
 let options=defenseOptions(data,state,{damageType:'physique',surprise:true},true);
 assert.equal(options.length,1);assert.equal(options[0].available,true);assert.equal(options[0].bonus,3);assert.equal(options[0].cost,0);
 assert.equal(defenseOptions(data,state,{damageType:'occulte',surprise:false},true).length,0);
 assert.equal(defenseOptions(data,state,{damageType:'physique',surprise:true},false)[0].available,false);
 consumeUsage(state,'scene',options[0].id);assert.equal(defenseOptions(data,state,{damageType:'physique',surprise:false},true)[0].available,false);
 consumeUsage(state,'scenario',cycleId);resetLivePeriod(state,'scene');assert.equal(state.powerUses['scenario:'+cycleId],1);assert.equal(defenseOptions(data,state,{damageType:'physique',surprise:true},true)[0].available,true);
 resetLivePeriod(state,'scenario');assert.deepEqual(state.powerUses,{});
 assert.equal(reserveHealing(data,state,12,12,0),0);assert.deepEqual(state.powerUses,{});
 assert.equal(reserveHealing(data,state,2,12,2),3);assert.equal(reserveHealing(data,state,2,12,2),0);
 const mosen={...data,truth:{...data.truth,choices:{species:'mosen'},truthTalents:['extral-poussee-hormonale','extral-reflexe-de-chasse']}};
 state.revelation='v';assert.equal(defenseOptions(mosen,state,{damageType:'physique',surprise:false},true).length,0);
 state.revelation='r';assert.equal(defenseOptions(mosen,state,{damageType:'physique',surprise:true},true)[0].available,false);
 assert.equal(defenseOptions(mosen,state,{damageType:'physique',surprise:false},true)[0].available,true);
 const garou={...data,truth:{nature:'garou',consciousness:'initie',choices:{blood:'sang_naturel',pelage:'gris'},truthTalents:[]}};
 assert.equal(hourlyRecovery(garou,{...blankPlayState(),revelation:'v'}),0);
 assert.equal(hourlyRecovery(garou,{...blankPlayState(),revelation:'r'}),1);
 assert.equal(hourlyRecovery(garou,{...blankPlayState(),revelation:'r',form:'hybrid'}),0);
 const id=randomUUID();await pool.query('INSERT INTO characters(id,owner_id,name,data) VALUES($1,$2,$3,$4::jsonb)',[id,player.id,'Mechanical regression',JSON.stringify(data)]);
 const path=`/api/characters/${id}/play`;let live=await call(player,'GET',path);
 const act=async(action,extra={},status=200)=>{const body={requestId:randomUUID(),version:live.version,action,...extra};const r=await call(player,'POST',path,body,status);if(status===200)live=r;return body;};
 try{
  await act('damage',{amount:10});await act('heal',{amount:2});assert.equal(live.event.payload.reserveBonus,3);assert.equal(live.profile.hp,7);
  await act('damage',{amount:4});const request=await act('nanite-cycle');assert.equal(live.profile.hp,9);assert.equal(live.event.payload.recovered,6);assert.equal(live.event.payload.reserveBonus,undefined);
  assert.equal((await call(player,'POST',path,request)).alreadyApplied,true);
  await act('nanite-cycle',{},400);await act('scene');await act('nanite-cycle',{},400);await act('rest',{days:1,prolonged:false});assert.equal(live.state.powerUses['scenario:'+cycleId],1);
  await act('save',{state:{...live.state,powerUses:{}}});assert.equal(live.state.powerUses['scenario:'+cycleId],1);
  await act('scenario');await act('damage',{amount:4});await act('save',{state:{...live.state,unconscious:true}});await act('nanite-cycle',{},400);
  await act('save',{state:{...live.state,unconscious:false,swarmFunctional:false}});await act('nanite-cycle',{},400);
  await act('heal',{amount:1});assert.equal(live.event.payload.reserveBonus,0);
  await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[id,JSON.stringify(garou)]);
  await act('save',{state:{...live.state,revelation:'r'}});await act('damage',{amount:4});const before=live.profile.hp;
  await act('recover-hours',{hours:2,regenerable:false},400);await act('recover-hours',{hours:2,regenerable:true});assert.equal(live.profile.hp,before+2);
  await act('initiative');await act('recover-hours',{hours:1,regenerable:true},400);
 }finally{await pool.query('DELETE FROM characters WHERE id=$1',[id]);}
 console.log('LIVE MECHANICS OK — special defense eligibility, surprise, quotas, actual nanite healing, replay, protected counters, period boundaries and hourly recovery.');
}
