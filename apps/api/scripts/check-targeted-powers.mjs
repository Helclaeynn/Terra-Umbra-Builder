import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankCharacterData} from '../dist/character-data.js';
import {blankPlayState,playProfile} from '../dist/rules/play-state.js';
import {targetedOptions,healingTest,interpositionOptions,interpositionCheck,guardianBonus,consumeGuard} from '../dist/rules/targeted-powers.js';
import {createLiveEffect} from '../dist/rules/live-effects.js';
import {applyCharacterEffectTick,applyNpcEffectTick} from '../dist/live-effect-application.js';
const data=(truth={nature:'humain',consciousness:'initie',choices:{},truthTalents:[]})=>{
 const d=blankCharacterData('Targeted test');Object.assign(d.attributes,{vigueur:5,agilite:4,volonte:5});
 for(const [id,rank] of [['constitution',4],['melee',4],['pugilat',4],['esquive',4],['maitrise_spirituelle',5]])d.skills[id]={style:rank,free:0,edge:0};d.creation.sphere='';d.truth=truth;return d;
};
const exile=(network)=>data({nature:'exile',consciousness:'initie',choices:{network},truthTalents:['exile-suture','exile-refection-vitale','exile-rune-de-garde','exile-riposte-d-ashorn']});
const state=()=>({...blankPlayState(),revelation:'r',hp:14,pa:3,initiative:20,paPerRound:3});
assert.deepEqual([17,18,20,21,33,60].map(n=>healingTest(n,false).healing),[0,4,4,5,9,9]);assert.equal(healingTest(100,true).success,false);
assert.equal(targetedOptions(exile('serpentaire_citrine'),state()).some(p=>p.id==='exile-refection-vitale'),true);
assert.equal(targetedOptions(exile('serpentaire_citrine'),{...state(),revelation:'v'}).length,0);
const guard={targeted:{guard:{sourceId:'caster'}}};assert.equal(consumeGuard(guard,false,true),0);assert.equal(consumeGuard(guard,true,false),0);assert.equal(consumeGuard(guard,true,true),6);assert.equal(consumeGuard(guard,true,true),0);
const grey=data({nature:'garou',consciousness:'initie',choices:{pelage:'pelages_gris',blood:'sang_ecarlate'},truthTalents:['riposte_du_gardien']});
const greyState={...state(),targeted:{guardian:{targetId:'enemy',until:2}}};assert.equal(guardianBonus(grey,greyState,'enemy'),3);assert.equal(guardianBonus(grey,greyState,'other'),0);assert.equal(guardianBonus(grey,{...greyState,round:3},'enemy'),0);
const rule=interpositionOptions(grey,state())[0],actor={hp:14,pa:3,state:state(),initiative:20,movement:9},physical={damageType:'melee'},proof={distance:8,contextConfirmed:true,allyConfirmed:true};
assert.doesNotThrow(()=>interpositionCheck(rule,actor,physical,proof));assert.throws(()=>interpositionCheck(rule,actor,physical,{...proof,distance:9}),/reaction_out_of_range/);assert.throws(()=>interpositionCheck(rule,actor,{damageType:'occulte'},proof),/reaction_physical_only/);
const caendisId='aseryn_traditions_des_treize_caendis_le_protecteur_interposition',caendis=data({nature:'aseryn',consciousness:'initie',choices:{},truthTalents:[caendisId]}),caendisRule=interpositionOptions(caendis,state())[0];
assert.equal(caendisRule.id,caendisId);assert.doesNotThrow(()=>interpositionCheck(caendisRule,actor,physical,{...proof,distance:2}));assert.throws(()=>interpositionCheck(caendisRule,actor,physical,{...proof,distance:2.01}),/reaction_out_of_range/);
const periodic=createLiveEffect({name:'Occult fixture',sourceId:'caster',targetId:'victim',kind:'damage',scope:'condition',amount:8,damageType:'occulte',stackKey:'occult',stackMode:'exclusive',duration:{unit:'manual'},period:'round-end',armorMode:'ignore'},{id:randomUUID(),round:1,targetActivation:0});
const warded={...state(),targeted:{guard:{sourceId:'caster'}},effects:[periodic]};applyCharacterEffectTick(data(),warded,{phase:'round-end',round:2});assert.equal(warded.hp,12);assert.equal(warded.targeted.guard,undefined);
const wardedNpc={hp:14,pv_max:14,death:-10,pa:3,data:{targeted:{guard:{sourceId:'caster'}},liveEffects:[periodic]}};applyNpcEffectTick(wardedNpc,{phase:'round-end',round:2});assert.equal(wardedNpc.hp,12);assert.equal(wardedNpc.data.targeted.guard,undefined);
console.log('TARGETED POWERS PURE OK — exact support access, healing DR, one-use guard, target-bound Guardian bonus and strict movement range');

export async function checkTargetedPowers({pool,call,player,other,manager}){
 const campaign=randomUUID(),caster=randomUUID(),beneficiary=randomUUID(),second=randomUUID(),npc=randomUUID(),url=`/api/campaigns/${campaign}/targeted-powers`,combat=`/api/campaigns/${campaign}/combat`;
 const send=(u,b,status=200,path=url)=>call(u,'POST',path,{requestId:randomUUID(),...b},status);
 async function put(id,d,s){await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[id,JSON.stringify(d)]);await pool.query(`INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1) ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=character_play_states.version+1`,[id,JSON.stringify(s)]);}
 const live=(id,u=manager)=>call(u,'GET',`/api/characters/${id}/play`);
 async function request(u,sourceId,targetId,powerId,extra={},status=200){const snapshot=await call(manager,'GET',url),s=snapshot.sources.find(s=>s.id===sourceId),t=snapshot.targets.find(t=>t.id===targetId);return send(u,{action:'request',sourceId,targetId,powerId,sourceVersion:s.version,targetVersion:t.version,contextConfirmed:true,inscriptionConfirmed:true,...extra},status);}
 async function boundary(action){const room=await call(manager,'GET',`/api/campaigns/${campaign}/play`);return call(manager,'POST',`/api/campaigns/${campaign}/play/actions`,{requestId:randomUUID(),action,version:room.combat.version});}
 async function attack(targetId,type='melee',mode='fixed'){const id=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'attack',$4::jsonb,'{}',true)",[id,campaign,manager.id,JSON.stringify({label:'Attack fixture',attackerId:npc,attacker:'Guard',targetId,total:50,damage:1,bonusDamage:0,penetration:0,attackMode:mode,damageType:type,narrativeFailure:false,surprise:false,public:true})]);return id;}
 const defend=(u,id,active=false,extra={})=>send(u,{action:'defend',attackId:id,active,bonus:0,...extra},200,combat);
 const resolve=(u,id,extra={})=>send(u,{action:'resolve',attackId:id,protectionIds:[],material:false,armor:0,extraArmor:0,extraReduction:0,defenseOverride:0,...extra},200,combat);
 const cancel=(id)=>send(manager,{action:'cancel',attackId:id},200,combat);
 try{
  await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'Targeted mechanics isolated']);
  for(const [id,user,d] of [[caster,player,exile('serpentaire_citrine')],[beneficiary,other,data()],[second,manager,exile('serpentaire_citrine')]]){
   await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,user.id,id,JSON.stringify(d),campaign]);
   await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,user.id,id]);await put(id,d,state());
  }
  await pool.query("INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,initiative,pa,visible) VALUES($1,$2,'npc',$3,'Guard',$4::jsonb,20,20,-10,7,20,3,true)",[npc,campaign,randomUUID(),JSON.stringify({attributes:{vigueur:5,agilite:3,volonte:3,esprit:3,charisme:3},skills:{},equipmentIds:[]})]);
  await put(beneficiary,data(),{...state(),hp:5});
  const ownerOptions=await call(player,'GET',url);assert.equal(ownerOptions.sources.length,1);assert.equal(ownerOptions.sources[0].id,caster);assert.equal('hp' in ownerOptions.targets.find(t=>t.id===beneficiary),false);
  await request(other,caster,beneficiary,'exile-refection-vitale',{},404);
  const offerBody={requestId:randomUUID(),action:'request',sourceId:caster,targetId:beneficiary,powerId:'exile-refection-vitale',sourceVersion:(await live(caster)).version,targetVersion:(await live(beneficiary)).version,contextConfirmed:true,edge:true};
  const initialEdge=(await call(player,'GET',url)).sources[0].edge;
  assert.equal((await send(player,offerBody)).pendingAcceptance,true);assert.equal((await send(player,offerBody)).alreadyApplied,true);assert.equal((await live(beneficiary)).profile.hp,5);assert.equal((await call(player,'GET',url)).sources[0].edge,initialEdge);
  const accept={requestId:randomUUID(),action:'accept',offerId:offerBody.requestId};await send(other,accept);await send(other,accept);
  const healed=await live(beneficiary);assert.equal(healed.profile.hp,13);assert.equal(healed.state.powerUses['scenario:received:exile-refection-vitale'],1);assert.equal((await call(player,'GET',url)).sources[0].edge,initialEdge-1);
  const result=(await call(player,'GET',url)).results[0];assert.equal('before' in result,false);assert.equal('after' in result,false);assert.equal(result.edgeForced,true);
  await send(other,{action:'accept',offerId:offerBody.requestId},409);
  await put(beneficiary,data(),{...healed.state,hp:5});await request(manager,second,beneficiary,'exile-refection-vitale',{edge:true},400);
  const forge=await live(beneficiary,other);await call(other,'POST',`/api/characters/${beneficiary}/play`,{requestId:randomUUID(),version:forge.version,action:'save',state:{...forge.state,powerUses:{},targeted:{guard:{sourceId:caster}}}});assert.equal((await live(beneficiary)).state.powerUses['scenario:received:exile-refection-vitale'],1);assert.equal((await live(beneficiary)).state.targeted?.guard,undefined);
  await boundary('combat-scene');await request(manager,second,beneficiary,'exile-refection-vitale',{edge:true},400);
  await boundary('combat-scenario');await request(manager,second,beneficiary,'exile-refection-vitale',{edge:true});assert.equal((await live(beneficiary)).profile.hp,13);
  const bleed=createLiveEffect({name:'Bleeding',sourceId:npc,targetId:beneficiary,ruleId:'maitre_des_lames',kind:'damage',scope:'condition',amount:2,stackKey:'bleed',stackMode:'exclusive',duration:{unit:'manual'},period:'round-end',armorMode:'ignore'},{id:randomUUID(),round:1,targetActivation:0});
  await put(beneficiary,data(),{...state(),hp:-2,effects:[bleed]});await request(manager,caster,beneficiary,'exile-suture');const sutured=await live(beneficiary);assert.equal(sutured.state.stabilized,true);assert.equal(sutured.profile.hp,-2);assert.equal(sutured.state.effects.length,0);
  await put(beneficiary,data(),{...state(),hp:playProfile(data(),state()).derived.death});await request(manager,caster,beneficiary,'exile-suture',{},400);
  await put(beneficiary,data(),state());await put(caster,exile('runes_whurten'),state());
  await request(manager,caster,beneficiary,'exile-rune-de-garde');assert.equal((await live(beneficiary)).state.targeted.guard.sourceId,caster);await request(manager,caster,npc,'exile-rune-de-garde',{},400);
  await boundary('combat-start');for(const id of [caster,beneficiary,second]){const p=await live(id);await put(id,(await pool.query('SELECT data FROM characters WHERE id=$1',[id])).rows[0].data,{...p.state,initiative:20,pa:3,paPerRound:3});}
  let incoming=await attack(beneficiary,'occulte');await defend(other,incoming);await resolve(other,incoming,{extraReduction:100});assert.equal((await live(beneficiary)).state.targeted.guard,undefined);assert.equal((await live(beneficiary)).profile.hp,14);
  await boundary('combat-stop');await put(second,exile('runes_whurten'),state());await request(manager,second,beneficiary,'exile-rune-de-garde',{},400);
  await request(manager,caster,npc,'exile-rune-de-garde');await boundary('combat-scenario');assert.equal((await pool.query('SELECT data FROM campaign_live_combatants WHERE id=$1',[npc])).rows[0].data.targeted.guard,undefined);
  await boundary('combat-start');await put(caster,grey,state());await put(beneficiary,data(),state());await put(second,data(),state());
  incoming=await attack(beneficiary);const reactor=(await call(player,'GET',combat)).reactable.find(r=>r.id===incoming).options[0];
  const reaction={requestId:randomUUID(),action:'react',attackId:incoming,expectedTargetId:beneficiary,actorId:caster,actorVersion:reactor.version,powerId:reactor.id,contextConfirmed:true,allyConfirmed:true,distance:1};
  await send(other,reaction,404,combat);await send(player,{...reaction,requestId:randomUUID(),distance:reactor.movement},400,combat);await send(player,reaction,200,combat);await send(player,reaction,200,combat);
  assert.equal((await live(caster)).state.pa,2);assert.equal((await call(other,'GET',combat)).pending.length,0);assert.equal((await call(player,'GET',combat)).pending[0].target.id,caster);assert.equal((await live(caster)).state.targeted.guardian.targetId,npc);
  await send(other,{action:'defend',attackId:incoming,active:false,bonus:0},404,combat);await defend(player,incoming);await resolve(player,incoming);assert.equal((await live(caster)).profile.hp,13);assert.equal((await live(beneficiary)).profile.hp,14);
  const unrelated={requestId:randomUUID(),action:'launch',attackerId:caster,targetId:beneficiary,optionId:'unarmed',bonus:0,bonusDamage:0,surprise:false};await send(player,unrelated,200,combat);await cancel(unrelated.requestId);assert.equal((await live(caster)).state.targeted.guardian.targetId,npc);
  const retaliation={...unrelated,requestId:randomUUID(),targetId:npc};await send(player,retaliation,200,combat);const retaliationEvent=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[retaliation.requestId])).rows[0].payload;assert.equal(retaliationEvent.guardianBonus,3);assert.equal((await live(caster)).state.targeted.guardian,undefined);await cancel(retaliation.requestId);
  await put(caster,data({nature:'extral',consciousness:'initie',choices:{species:'homo_superior',network:'aidh_intervention'},truthTalents:['extral-interposition-doctrinale']}),state());
  incoming=await attack(beneficiary);const doctrine=(await call(player,'GET',combat)).reactable.find(r=>r.id===incoming).options[0];const doctrinal={requestId:randomUUID(),action:'react',attackId:incoming,expectedTargetId:beneficiary,actorId:caster,actorVersion:doctrine.version,powerId:doctrine.id,contextConfirmed:true,allyConfirmed:true,nearbyConfirmed:true,distance:1,edge:true};await send(player,doctrinal,200,combat);await send(player,doctrinal,200,combat);
  const protectedAttack=(await call(other,'GET',combat)).pending.find(a=>a.id===incoming);assert.equal(protectedAttack.target.id,beneficiary);assert.equal(protectedAttack.reactionDefense,playProfile((await pool.query('SELECT data FROM characters WHERE id=$1',[caster])).rows[0].data,state()).skills.find(s=>s.id==='esquive').total+20);await defend(other,incoming);await resolve(other,incoming,{extraReduction:100});assert.equal((await live(caster)).state.powerUses['round:extral-interposition-doctrinale'],1);
  const tooLate=await attack(beneficiary);await defend(other,tooLate);await send(player,{...doctrinal,requestId:randomUUID(),attackId:tooLate,actorVersion:(await live(caster)).version},409,combat);await cancel(tooLate);
  await put(caster,caendis,state());incoming=await attack(beneficiary);const caendisChoice=(await call(player,'GET',combat)).reactable.find(r=>r.id===incoming).options.find(p=>p.id===caendisId);assert.ok(caendisChoice);
  const caendisReaction={requestId:randomUUID(),action:'react',attackId:incoming,expectedTargetId:beneficiary,actorId:caster,actorVersion:caendisChoice.version,powerId:caendisId,contextConfirmed:true,allyConfirmed:true,distance:2};await send(player,{...caendisReaction,requestId:randomUUID(),distance:2.01},400,combat);await send(player,caendisReaction,200,combat);assert.equal((await call(player,'GET',combat)).pending.find(a=>a.id===incoming).target.id,caster);await cancel(incoming);
  const ashorn=exile('horde_divine');ashorn.attributes.agilite=40;await put(caster,ashorn,{...state(),pa:1});incoming=await attack(caster,'melee','melee');await defend(player,incoming,true,{edge:true});assert.equal((await live(caster)).state.pa,0);
  const available=(await call(player,'GET',combat)).counterAttacks.find(a=>a.attackId===incoming);assert.ok(available);const riposte={requestId:randomUUID(),action:'launch',attackerId:caster,targetId:npc,optionId:'unarmed',riposteAttackId:incoming,inReach:true,bonus:0,bonusDamage:0,surprise:false};
  await send(player,{...riposte,requestId:randomUUID(),inReach:false},400,combat);await send(player,riposte,200,combat);await send(player,riposte,200,combat);assert.equal((await live(caster)).state.pa,0);assert.equal((await live(caster)).state.powerUses['scene:exile-riposte-d-ashorn'],1);await send(player,{...riposte,requestId:randomUUID()},400,combat);await cancel(incoming);await cancel(riposte.requestId);
  console.log('TARGETED POWERS API OK — consent, ownership, Edge/replay, private HP, beneficiary quotas, reset/forgery, Suture/death, Rune caster/beneficiary limits, interception ownership/range/late window, Guardian target bonus, AIDH floor and zero-PA Ashorn');
 }finally{await pool.query('DELETE FROM campaigns WHERE id=$1',[campaign]);await pool.query('DELETE FROM characters WHERE id=ANY($1::uuid[])',[[caster,beneficiary,second]]);}
}
