import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {damageCalculation,combatEquipment} from '../dist/campaign-combat.js';
export async function checkCampaignCombat({pool,call,player,other,manager,campaign,character}){
 const url=`/api/campaigns/${campaign}/combat`,send=(u,b,status=200)=>call(u,'POST',url,{requestId:randomUUID(),...b},status);
 assert.equal(damageCalculation({total:19,damage:3,bonusDamage:2,penetration:1},10,4,2).damage,9);
 assert.equal(damageCalculation({total:10,damage:30,bonusDamage:2,penetration:1},10,0,0).damage,0);
 assert.equal(damageCalculation({total:19,damage:3,bonusDamage:2,penetration:1,narrativeFailure:true},10,0,0).damage,0);
 const aug=combatEquipment({reality:{augmentations:[{itemId:'armure_dermique_g1',loaded:true}]}});assert.equal(aug[0].body,2);
 const eventId=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,'{}',true)",[eventId,campaign,manager.id,JSON.stringify({label:'Attaque',characterName:'Garde',total:19,dice:[8],modifier:11,narrativeFailure:false})]);
 const attack={requestId:randomUUID(),action:'attack',eventId,targetId:character,damage:3,bonusDamage:2,penetration:1,damageType:'melee',surprise:false};
 await send(other,attack,403);await send(manager,attack);await send(manager,attack);await send(manager,{...attack,requestId:randomUUID()},409);
 assert.equal((await call(other,'GET',url)).pending.length,0);assert.equal((await call(player,'GET',url)).pending.length,1);
 await send(other,{action:'defend',attackId:attack.requestId,active:true,bonus:0},404);
 const before=(await call(player,'GET',`/api/characters/${character}/play`)).state;
 const defense={requestId:randomUUID(),action:'defend',attackId:attack.requestId,active:true,bonus:0};await send(player,defense);await send(player,defense);
 const after=(await call(player,'GET',`/api/characters/${character}/play`)).state;assert.equal(after.pa,before.pa-1);
 await send(player,{...defense,requestId:randomUUID()},409);
 const resolve={requestId:randomUUID(),action:'resolve',attackId:attack.requestId,protectionIds:[],armor:4,extraArmor:0,extraReduction:2,defenseOverride:10};
 const pending=(await call(manager,'GET',url)).pending[0],expected=damageCalculation(pending,pending.defense.narrativeFailure?10:pending.defense.total,4,2).damage;
 await send(manager,resolve);await send(manager,resolve);await send(manager,{...resolve,requestId:randomUUID()},409);
 const final=await call(player,'GET',`/api/characters/${character}/play`);assert.equal(final.profile.hp,Math.max(final.profile.derived.death,before.hp-expected));assert.equal((await call(player,'GET',url)).pending.length,0);
 const peer=await call(other,'GET',`/api/campaigns/${campaign}/play`),log=peer.events.find(e=>e.id===resolve.requestId);assert.ok(log);for(const key of ['before','after','armor','defense','reduction'])assert.ok(!(key in log.payload));
 const second={...attack,requestId:randomUUID(),eventId:randomUUID(),surprise:true};await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,'{}',true)",[second.eventId,campaign,manager.id,JSON.stringify({label:'Surprise',total:12,narrativeFailure:false})]);await send(manager,second);await send(player,{action:'defend',attackId:second.requestId,active:true,bonus:0},400);await send(player,{action:'defend',attackId:second.requestId,active:false,bonus:0});await send(manager,{action:'cancel',attackId:second.requestId});
 console.log('CAMPAIGN COMBAT OK — attack margin, weapon damage, armor, augmentations, typed reductions, voluntary active defense, PA, ownership, replay, surprise and private HP.');
}
