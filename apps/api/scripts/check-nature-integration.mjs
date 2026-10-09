import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {blankNatureResources,natureResourceIds} from '../dist/rules/live-nature-resources.js';
import {truthCoreRules} from '../dist/rules/truth/core-rules.js';

/** New accepted characters/campaigns only. All effects and records disappear with those fixtures. */
export async function checkNatureIntegration({pool,call,player,other,manager,character}){
 const template=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const fixtures=[];
 async function fixture(nature,choices,talents=[]){
  const id=randomUUID(),campaign=randomUUID(),data=structuredClone(template);
  data.truth={nature,consciousness:'initie',choices,truthTalents:talents};data.appearances={reality:[],truth:[]};
  data.attributes.vigueur=4;data.attributes.volonte=8;data.skills.constitution={style:4,free:0,edge:0};data.skills.force_mentale={style:4,free:0,edge:0};data.skills.maitrise_spirituelle={style:12,free:0,edge:0};data.creation.sphere='';data.talents={origin:'',sphere:'',expertise:'',common:'',edge:[]};data.reality={equipment:[],augmentations:[]};
  data.progression={...data.progression,truthTalents:[],skillRanks:{},attributeRanks:{},realityTalents:[],realityTalentChoices:{}};
  await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'CI Nature '+nature]);
  await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,player.id,'CI Nature '+nature,JSON.stringify(data),campaign]);
  await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,player.id,id]);
  await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'accepted')",[campaign,other.id]);
  fixtures.push({id,campaign});const path=`/api/characters/${id}/play`,roomPath=`/api/campaigns/${campaign}/play`;let live=await call(player,'GET',path);
  const act=async(action,extra={},status=200,user=player)=>{const body={requestId:randomUUID(),version:live.version,action,...extra};const response=await call(user,'POST',path,body,status);if(status===200&&!response.alreadyApplied)live=response;return {body,response};};
  const read=async()=>live=await call(player,'GET',path);
  const manage=async(action,extra={},status=200)=>{const room=await call(manager,'GET',roomPath);const response=await call(manager,'POST',roomPath+'/actions',{requestId:randomUUID(),version:room.combat.version,action,...extra},status);await read();return response;};
  const combat=async()=>{await manage('combat-start',{mode:'manual'});await act('initiative');await act('save',{state:{...live.state,revelation:'r',pa:3}});};
  const seed=async(mutator)=>{const state=structuredClone(live.state);mutator(state);await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[id,JSON.stringify(state)]);await read();};
  return {id,campaign,data,path,roomPath,act,read,manage,combat,seed,get live(){return live;}};
 }
 try{
  // Mage: a real multi-round preparation; no client result or Tension injection.
  const m=await fixture('mage',{mageiusType:'discella',dominantAffinity:'skiamancie'},['mage_skiamancie_amplitude_significative','mage_skiamancie_amplitude_majeure',natureResourceIds.discharge]);
  await m.act('nature-settings',{clearTension:true},400);await m.act('nature-settings',{clearTension:true},404,other);
  await m.act('nature-settings',{clearTension:true},200,manager);assert.equal(m.live.state.natureResources.mage.tension,0);
  await m.combat();
  const spell={affinity:'skiamancie',amplitude:'majeure',range:'will',channel:2,opposed:true,urgent:true,contextDifficult:true,forceAmplitude:false,forceMastery:false,note:'Ombre hostile'};
  const started=await m.act('nature-mage-begin',{spell,invest:2});assert.equal(m.live.state.pa,1);assert.equal(m.live.state.natureResources.mage.preparation.pa,5);assert.equal(m.live.state.natureResources.mage.preparation.paid,2);assert.equal(m.live.state.natureResources.mage.tension,0);assert.equal(m.live.event.payload.paCost,2);
  assert.equal((await call(player,'POST',m.path,started.body)).alreadyApplied,true);
  const version=m.live.version;await call(player,'POST',m.path,{...started.body,requestId:randomUUID()},409);assert.equal((await m.read()).version,version);
  await m.act('nature-mage-release',{},400);
  await m.act('save',{state:{...m.live.state,natureResources:{...blankNatureResources(),mage:{...blankNatureResources().mage,tension:999}},powerUses:{}}});assert.equal(m.live.state.natureResources.mage.preparation.paid,2);assert.equal(m.live.state.natureResources.mage.tension,0);
  await m.manage('combat-round');await m.act('save',{state:{...m.live.state,pa:3}});await m.act('nature-mage-invest',{amount:3});assert.equal(m.live.state.pa,0);assert.equal(m.live.state.natureResources.mage.preparation.paid,5);
  const released=await m.act('nature-mage-release',{rollResult:999,narrativeFailure:false});assert.equal(m.live.state.natureResources.mage.preparation,null);assert.equal(m.live.state.natureResources.mage.tension,3);assert.equal(m.live.state.natureResources.mage.pendingBacklash,3);assert.equal(m.live.event.payload.spell.difficulty,15);assert.notEqual(m.live.event.payload.total,999);assert.ok(Array.isArray(m.live.event.payload.dice));assert.equal(m.live.event.payload.total,m.live.event.payload.modifier+m.live.event.payload.sum);
  assert.equal((await call(player,'POST',m.path,released.body)).alreadyApplied,true);await m.act('nature-mage-begin',{spell:{...spell,amplitude:'mineure',channel:0},invest:1},400);
  const backlash=await m.act('nature-mage-backlash');assert.equal(m.live.state.natureResources.mage.pendingBacklash,null);assert.equal(m.live.event.payload.difficulty,12);assert.ok(Array.isArray(m.live.event.payload.dice));
  if(m.live.event.payload.success){assert.equal(m.live.state.natureResources.mage.dormant,false);}else{assert.equal(m.live.state.natureResources.mage.dormant,true);assert.equal(m.live.event.payload.irreducibleDamage,m.live.event.payload.narrativeFailure?7:3);}
  assert.equal((await call(player,'POST',m.path,backlash.body)).alreadyApplied,true);
  // Resetting scene/scenario does not fabricate calm or wake a Dormant Mageius.
  await m.seed(s=>{s.natureResources.mage.dormant=true;s.natureResources.mage.tension=4;});await m.manage('combat-stop');await m.manage('combat-scene');assert.equal(m.live.state.natureResources.mage.dormant,true);assert.equal(m.live.state.natureResources.mage.tension,4);
  await m.act('nature-settings',{mageDormant:false,clearTension:true},400);await m.act('nature-settings',{mageDormant:false,clearTension:true},200,manager);assert.equal(m.live.state.natureResources.mage.dormant,false);assert.equal(m.live.state.natureResources.mage.tension,0);
  await m.act('save',{state:{...m.live.state,revelation:'v'}});await m.act('nature-mage-begin',{spell:{...spell,amplitude:'mineure',channel:0}},400);
  // Reusing round 1 in a later combat cannot reuse a paid preparation or forbid that new round's rest.
  await m.act('save',{state:{...m.live.state,revelation:'r',unconscious:false}});await m.act('heal',{amount:1000});await m.combat();
  await m.act('nature-mage-begin',{spell,invest:1});assert.equal(m.live.state.natureResources.mage.usedRound,1);
  await m.seed(s=>{s.natureResources.mage.tension=2;s.natureResources.mage.maintained=['Sort maintenu'];s.natureResources.mage.blockedUntilRound=2;});
  await m.manage('combat-stop');assert.equal(m.live.state.natureResources.mage.preparation,null);assert.deepEqual(m.live.state.natureResources.mage.maintained,[]);assert.equal(m.live.state.natureResources.mage.blockedUntilRound,null);assert.equal(m.live.state.natureResources.mage.tension,2);
  await m.combat();assert.equal(m.live.state.round,1);assert.equal(m.live.state.natureResources.mage.usedRound,null);await m.act('nature-mage-release',{},400);await m.act('nature-mage-rest');assert.equal(m.live.state.natureResources.mage.tension,1);assert.equal(m.live.state.pa,0);
  await m.manage('combat-round');await m.manage('combat-round');await m.manage('combat-round');await m.act('save',{state:{...m.live.state,pa:3}});await m.act('nature-mage-begin',{spell,invest:1});assert.equal(m.live.state.natureResources.mage.preparation.startedRound,4);
  await m.seed(s=>{s.natureResources.mage.pendingBacklash=3;s.natureResources.mage.dormant=true;});await m.manage('combat-stop');await m.manage('combat-start',{mode:'manual'});assert.equal(m.live.state.natureResources.mage.preparation,null);assert.equal(m.live.state.natureResources.mage.pendingBacklash,3);assert.equal(m.live.state.natureResources.mage.dormant,true);assert.equal(m.live.state.natureResources.mage.tension,1);
  // Daemon: one context-specific Faveur, consumed on the exact ordinary or Spectral test.
  const d=await fixture('daemon',{divinity:'mephisto',function:'oracle',daemonBuild:{spectralAffinity:'skiamancie'}},[natureResourceIds.resonance]);
  await d.act('save',{state:{...d.live.state,revelation:'sr'}});await d.act('nature-daemon-favor',{skill:'maitrise_spirituelle',note:'Facette Magie'},400);
  await d.act('nature-settings',{resonancePlace:true},200,manager);const base=d.live.profile.skills.find(s=>s.id==='maitrise_spirituelle').total;
  const favor=await d.act('nature-daemon-favor',{skill:'maitrise_spirituelle',note:'Facette Magie'});assert.equal(d.live.profile.skills.find(s=>s.id==='maitrise_spirituelle').total,base+3);assert.equal(d.live.state.powerUses['scene:daemon-faveur-divine'],1);assert.equal((await call(player,'POST',d.path,favor.body)).alreadyApplied,true);
  await d.act('roll',{skill:'athletisme'});assert.equal(d.live.state.natureResources.daemon.pendingFavor.skill,'maitrise_spirituelle');
  await d.act('roll',{skill:'maitrise_spirituelle'});assert.equal(d.live.event.payload.modifier,base+3);assert.equal(d.live.state.natureResources.daemon.pendingFavor,null);assert.equal(d.live.profile.skills.find(s=>s.id==='maitrise_spirituelle').total,base);
  await d.act('nature-daemon-favor',{skill:'maitrise_spirituelle',note:'Spectre de Mageius'});await d.act('save',{state:{...d.live.state,revelation:'r'}});const spectralBase=d.live.profile.skills.find(s=>s.id==='maitrise_spirituelle').total-3;
  await d.act('nature-daemon-spectrum-begin',{spell:{...spell,amplitude:'mineure',channel:0},invest:1});await d.act('nature-daemon-spectrum-release');assert.equal(d.live.event.payload.modifier,spectralBase+3);assert.equal(d.live.state.natureResources.daemon.pendingFavor,null);assert.equal(d.live.state.natureResources.mage.tension,0);assert.equal(d.live.state.natureResources.mage.pendingBacklash,null);
  await d.act('nature-daemon-favor',{skill:'maitrise_spirituelle',note:'Troisième faveur'},400);await d.manage('combat-scene');assert.equal(d.live.state.powerUses['scene:daemon-faveur-divine'],undefined);
  // Angelus: protected current Aura, replacement recharge, costs, HP ceiling and prepared weapon mode.
  const a=await fixture('angelus',{angelNature:'domination',sephirah:'tiphereth',angelusBuild:{bladeForm:'ranged',bladeSacrifice:2}},[natureResourceIds.boost,natureResourceIds.offering]);
  await a.act('save',{state:{...a.live.state,revelation:'r',natureResources:{...blankNatureResources(),angelus:{...blankNatureResources().angelus,aura:999,holyPlace:true}}}});assert.equal(a.live.state.natureResources,undefined);
  await a.act('nature-settings',{holyPlace:true,connected:true},200,manager);assert.equal(a.live.state.natureResources.angelus.aura,0);
  await a.act('nature-angelus-fill');assert.equal(a.live.state.natureResources.angelus.aura,7);await a.act('nature-angelus-open',{},400);
  await a.combat();await a.act('nature-angelus-fill',{},400);await a.act('nature-angelus-blade',{sacrifice:2});assert.equal(a.live.state.pa,2);assert.equal(a.live.state.natureResources.angelus.aura,6);assert.equal(a.live.state.natureResources.angelus.bladeHp,2);assert.equal(a.live.profile.hp,10);assert.equal(a.live.profile.derived.pvMax,12);assert.equal(a.live.profile.healthMaximum,10);assert.equal(a.live.profile.healingMaximum,10);
  const combat=await call(player,'GET',`/api/campaigns/${a.campaign}/combat`),blade=combat.attackers.find(x=>x.id===a.id).options.find(x=>x.id==='angelus-celestial-blade');assert.ok(blade);assert.equal(blade.attackMode,'ranged');assert.equal(blade.damage,9);assert.equal(blade.modifier,a.live.profile.skills.find(s=>s.id==='tir').total);
  await a.act('damage',{amount:5});assert.equal(a.live.profile.hp,5);assert.equal(a.live.profile.stress,1);assert.equal(a.live.profile.health,'Blessé');await a.act('heal',{amount:1000});assert.equal(a.live.profile.hp,10);await a.act('nature-angelus-blade',{sacrifice:1},400);
  await a.act('nature-angelus-offering');assert.equal(a.live.profile.hp,9);assert.equal(a.live.profile.healthMaximum,10);assert.equal(a.live.profile.healingMaximum,9);assert.equal(a.live.state.natureResources.angelus.aura,7);await a.act('heal',{amount:1000});assert.equal(a.live.profile.hp,9);
  await a.act('nature-angelus-dismiss-blade');assert.equal(a.live.profile.derived.pvMax,12);assert.equal(a.live.profile.healthMaximum,12);assert.equal(a.live.profile.healingMaximum,11);assert.equal(a.live.profile.hp,9);await a.act('heal',{amount:1000});assert.equal(a.live.profile.hp,11);
  await a.act('nature-settings',{aura:0},200,manager);await a.act('save',{state:{...a.live.state,pa:3}});const recharge=await a.act('nature-angelus-open',{boost:true});assert.equal(a.live.state.pa,2);assert.equal(a.live.state.natureResources.angelus.aura,4);assert.equal(a.live.event.payload.recovered,4);assert.equal((await call(player,'POST',a.path,recharge.body)).alreadyApplied,true);await a.act('nature-angelus-open',{boost:true},400);
  await a.act('nature-settings',{connected:false},200,manager);assert.equal(a.live.state.natureResources.angelus.aura,4);await a.act('nature-angelus-open',{},400);await a.act('nature-settings',{connected:true},200,manager);
  await a.manage('combat-stop');await a.manage('combat-start',{mode:'manual'});await a.act('initiative');assert.equal(a.live.state.powerUses['scene:'+natureResourceIds.boost],1);await a.manage('combat-stop');await a.manage('combat-scene');assert.equal(a.live.state.powerUses['scene:'+natureResourceIds.boost],undefined);assert.equal(a.live.state.natureResources.angelus.offeringHp,0);assert.equal(a.live.state.natureResources.angelus.aura,4);
  const peer=await call(other,'GET',a.roomPath);assert.equal(peer.characters[0].data,undefined);assert.equal(peer.characters[0].hp,undefined);assert.equal(peer.events.some(e=>e.kind.startsWith('nature-')),false);
  // A described construct pays all canonical costs before release; interruption refunds neither Aura nor its scene use.
  const dream=truthCoreRules.catalogs.angelus.find(p=>p.name==='Rêve rendu réel');
  const c=await fixture('angelus',{angelNature:'domination',sephirah:'yessod',angelusBuild:{construct:{name:'Rempart',kind:'bulwark',purpose:'Protéger un passage',limits:'Rayon de contrôle 30 m ; aucun vol'}}},[dream.id]);
  await c.act('save',{state:{...c.live.state,revelation:'r'}});await c.act('nature-angelus-fill');await c.combat();
  await c.act('nature-power',{id:dream.id,invest:1});assert.equal(c.live.state.pa,2);assert.equal(c.live.state.natureResources.angelus.aura,4);assert.equal(c.live.state.powerUses['scene:'+dream.id],1);assert.equal(c.live.state.natureResources.powerPreparation.paid,1);
  await c.act('nature-power-release',{},400);await c.act('nature-power-cancel');assert.equal(c.live.state.natureResources.angelus.aura,4);assert.equal(c.live.state.powerUses['scene:'+dream.id],1);await c.act('nature-power',{id:dream.id,invest:1},400);
  await c.manage('combat-stop');await c.manage('combat-scene');await c.act('nature-angelus-fill');await c.combat();await c.act('nature-power',{id:dream.id,invest:1});await c.manage('combat-round');await c.act('nature-power-invest',{amount:1});await c.act('nature-power-release');assert.equal(c.live.state.natureResources.powerPreparation,null);assert.equal(c.live.state.natureResources.angelus.aura,4);assert.equal(c.live.event.payload.paInvested,2);assert.equal(c.live.event.payload.resolution,'assisted');assert.equal(c.live.event.payload.effectApplied,false);
  await c.manage('combat-stop');await c.manage('combat-scene');await c.act('nature-angelus-fill');await c.combat();await c.manage('combat-round');await c.manage('combat-round');await c.manage('combat-round');await c.act('save',{state:{...c.live.state,pa:3}});await c.act('nature-power',{id:dream.id,invest:1});assert.equal(c.live.state.natureResources.powerPreparation.startedRound,4);
  await c.manage('combat-stop');assert.equal(c.live.state.natureResources.powerPreparation,null);assert.equal(c.live.state.natureResources.angelus.aura,4);assert.equal(c.live.state.powerUses['scene:'+dream.id],1);await c.combat();await c.act('nature-power-release',{},400);await c.act('nature-power',{id:dream.id,invest:1},400);assert.equal(c.live.state.natureResources.angelus.aura,4);
 }finally{
  for(const f of fixtures.reverse()){await pool.query('DELETE FROM characters WHERE id=$1',[f.id]);await pool.query('DELETE FROM campaigns WHERE id=$1',[f.campaign]);}
 }
 console.log('NATURE INTEGRATION API OK — Mage paid preparation/server rolls/Tension, MJ conditions/Dormance, skill-specific and Spectral Faveur consumption, Aura/Lame/Offrande ceilings, prepared ranged weapon, paid construct interruption/release, boundaries, private logs and retry safety.');
}
