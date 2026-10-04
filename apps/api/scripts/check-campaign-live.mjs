import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
export async function checkCampaignLive({app,pool,call,player,other,manager,stranger,campaign,character}){
 const endpoint=`/api/campaigns/${campaign}/play`,actions=endpoint+'/actions';
 const snapshot=u=>call(u,'GET',endpoint);
 const action=(u,b,status=200)=>call(u,'POST',actions,{requestId:randomUUID(),...b},status);
 const latest=async id=>(await snapshot(manager)).combatants.find(c=>c.id===id);
 const peer=await snapshot(other);assert.equal(peer.ownCharacterId,null);assert.equal(peer.canManage,false);
 assert.ok(peer.events.some(e=>e.kind==='roll'));assert.ok(peer.events.every(e=>['roll','initiative'].includes(e.kind)));
 assert.ok(peer.events.every(e=>!('bonuses' in e.payload)&&!('components' in e.payload)&&!('before' in e.payload)));
 const gmLog=(await snapshot(manager)).events.find(e=>e.kind==='roll');assert.equal(gmLog.characterName,'CI Play');assert.equal(gmLog.playerName,'CI Play');assert.equal(gmLog.payload.components.attribute,4);
 const portrait='data:image/png;base64,'+Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]).toString('base64');
 const npcId=randomUUID(),creatureId=randomUUID();
 await pool.query('INSERT INTO campaign_npcs(id,campaign_id,data) VALUES($1,$2,$3::jsonb)',[npcId,campaign,JSON.stringify({name:'Secret identity',secret:'SECRET NEVER PUBLIC',attributes:{vigueur:4,agilite:3},skills:{constitution:4,athletisme:3,pugilat:6},portrait})]);
 await pool.query('INSERT INTO campaign_bestiary(id,campaign_id,data) VALUES($1,$2,$3::jsonb)',[creatureId,campaign,JSON.stringify({name:'Loup',stats:{pv:20,initiative:7,actions:2,attack:8},attacks:[{name:"Morsure",score:9,damage:3}],image:portrait,weaknesses:['SECRET WEAKNESS']})]);
 const add={requestId:randomUUID(),action:'add',kind:'npc',sourceId:npcId,name:'Garde du portail',visible:false};
 await action(other,add,404);await action(stranger,add,404);await action(manager,{...add,sourceId:randomUUID()},404);
 await action(manager,add);assert.equal((await action(manager,add)).alreadyApplied,true);
 assert.equal((await snapshot(manager)).combatants.length,1);assert.equal((await snapshot(other)).combatants.length,0);
 const portraitPath=`${endpoint}/combatants/${add.requestId}/image`;
 assert.equal((await app.inject({url:portraitPath,headers:{cookie:other.cookie}})).statusCode,404);
 let actor=await latest(add.requestId);assert.equal(actor.pvMax,12);
 await action(manager,{action:'settings',combatantId:actor.id,version:actor.version,name:actor.name,visible:true,pa:0});
 actor=await latest(actor.id);const wound={requestId:randomUUID(),action:'damage',combatantId:actor.id,version:actor.version,amount:6};
 await action(manager,wound);await action(manager,wound);await action(manager,{...wound,requestId:randomUUID()},409);
 let publicActor=(await snapshot(other)).combatants[0];assert.equal(publicActor.health,'Blessé');assert.equal(publicActor.name,'Garde du portail');
 for(const key of ['hp','pvMax','pa','initiative','data','sourceId','death','version'])assert.equal(key in publicActor,false,key);
 assert.equal(JSON.stringify(await snapshot(other)).includes('SECRET'),false);
 assert.equal((await app.inject({url:portraitPath,headers:{cookie:other.cookie}})).statusCode,200);
 actor=await latest(actor.id);await action(manager,{action:'initiative',combatantId:actor.id,version:actor.version});actor=await latest(actor.id);const initiative=actor.initiative;
 await action(manager,{action:'round',combatantId:actor.id,version:actor.version});actor=await latest(actor.id);assert.equal(actor.initiative,initiative);assert.equal(actor.round,2);assert.equal(actor.pa,actor.paPerRound);
 const creature={requestId:randomUUID(),action:'add',kind:'creature',sourceId:creatureId,name:'Loup gris',visible:true};await action(manager,creature);
 let wolf=await latest(creature.requestId);await action(manager,{action:'initiative',combatantId:wolf.id,version:wolf.version});wolf=await latest(wolf.id);assert.equal(wolf.paPerRound,2);

 // Public/private dice, authoritative scores, PA spending, retry and injury restrictions.
 const free={action:'gm-roll',label:'Écouter derrière la porte',bonus:5,stress:0,public:false};
 await action(other,free,404);await action(manager,{...free,bonus:1.5},400);
 const diceId=randomUUID();await action(manager,{...free,requestId:diceId,mode:'dice',faces:6,count:3,public:true});const diceLog=(await snapshot(other)).events.find(e=>e.id===diceId).payload;assert.equal(diceLog.dice.length,3);assert.ok(diceLog.dice.every(d=>d>=1&&d<=6));assert.equal(diceLog.exploded,false);
 await action(manager,{...free,mode:'dice',faces:1,count:1},400);
 const choiceId=randomUUID();await action(manager,{action:'random-player',public:true,requestId:choiceId});assert.equal((await snapshot(other)).events.find(e=>e.id===choiceId).payload.candidateCount,2);
 const privateId=randomUUID();await action(manager,{...free,requestId:privateId});assert.ok(!(await snapshot(other)).events.some(e=>e.id===privateId));
 const publicId=randomUUID();await action(manager,{...free,public:true,requestId:publicId});assert.equal((await snapshot(other)).events.find(e=>e.id===publicId).payload.modifier,5);
 assert.equal(wolf.rolls.find(r=>r.id==='attack:0').modifier,9);
 const bite={requestId:randomUUID(),action:'roll',combatantId:wolf.id,version:wolf.version,rollId:'attack:0',label:'Morsure',bonus:2,stress:0,public:true,paCost:1};
 await action(manager,{...bite,rollId:'unknown'},400);await action(manager,{...bite,paCost:3},400);
 await action(manager,bite);await action(manager,bite);wolf=await latest(wolf.id);assert.equal(wolf.pa,1);
 const biteLog=(await snapshot(other)).events.find(e=>e.id===bite.requestId);assert.equal(biteLog.payload.modifier,11);assert.equal(biteLog.payload.damage,3);assert.equal(biteLog.payload.total,11+biteLog.payload.dice.reduce((a,b)=>a+b,0));
 await action(manager,{...bite,requestId:randomUUID()},409);
 actor=await latest(actor.id);const punch={action:'roll',combatantId:actor.id,version:actor.version,rollId:'reality:pugilat',label:'Pugilat',bonus:1,stress:0,public:true,paCost:0};
 const punchId=randomUUID();await action(manager,{...punch,requestId:punchId});const punchLog=(await snapshot(manager)).events.find(e=>e.id===punchId);assert.equal(punchLog.payload.modifier,11);assert.equal(punchLog.payload.components.rank,6);assert.equal(punchLog.payload.stress,1);assert.ok(!('components' in (await snapshot(other)).events.find(e=>e.id===punchId).payload));
 actor=await latest(actor.id);await action(manager,{action:'settings',combatantId:actor.id,version:actor.version,name:actor.name,visible:false,pa:actor.pa});actor=await latest(actor.id);
 const hiddenId=randomUUID();await action(manager,{...punch,version:actor.version,requestId:hiddenId});assert.ok(!(await snapshot(other)).events.some(e=>e.id===hiddenId));
 actor=await latest(actor.id);await action(manager,{action:'damage',combatantId:actor.id,version:actor.version,amount:6});actor=await latest(actor.id);await action(manager,{...punch,version:actor.version},400);
 const gm=await snapshot(manager),ordered=gm.order.map(id=>[...gm.characters,...gm.combatants].find(c=>c.id===id)?.initiative??-Infinity);assert.deepEqual(ordered,[...ordered].sort((a,b)=>b-a));
 await action(manager,{action:'damage',combatantId:wolf.id,version:wolf.version,amount:20});assert.equal((await snapshot(other)).combatants.find(c=>c.id===wolf.id).health,'Mort');wolf=await latest(wolf.id);await action(manager,{...bite,requestId:randomUUID(),version:wolf.version},400);
 const message={requestId:randomUUID(),action:'message',text:'Voici le lieu de rendez-vous.',link:'/compendium?article=regles-sante-blessures-soins',image:portrait};
 await action(player,message,404);await action(manager,{...message,link:'javascript:alert(1)'},400);
 await action(manager,message);await action(manager,message);
 let feed=await snapshot(other);assert.equal(feed.events.filter(e=>e.id===message.requestId).length,1);assert.equal(feed.events.find(e=>e.id===message.requestId).payload.text,message.text);
 const imageUrl=`${endpoint}/messages/${message.requestId}/image`;assert.equal((await app.inject({url:imageUrl,headers:{cookie:other.cookie}})).statusCode,200);assert.equal((await app.inject({url:imageUrl,headers:{cookie:stranger.cookie}})).statusCode,404);
 await action(manager,{action:'withdraw',eventId:message.requestId});assert.ok(!(await snapshot(other)).events.some(e=>e.id===message.requestId));assert.equal((await app.inject({url:imageUrl,headers:{cookie:other.cookie}})).statusCode,404);
 // Revocation must also invalidate previously revealed images.
 await pool.query("UPDATE campaign_members SET status='invited' WHERE campaign_id=$1 AND user_id=$2",[campaign,other.id]);await call(other,'GET',endpoint,undefined,404);assert.equal((await app.inject({url:portraitPath,headers:{cookie:other.cookie}})).statusCode,404);
 await pool.query("UPDATE campaign_members SET status='accepted' WHERE campaign_id=$1 AND user_id=$2",[campaign,other.id]);
 actor=await latest(actor.id);await action(manager,{action:'remove',combatantId:actor.id,version:actor.version});assert.ok(!(await snapshot(manager)).combatants.some(c=>c.id===actor.id));assert.equal((await app.inject({url:portraitPath,headers:{cookie:other.cookie}})).statusCode,404);
 await call(other,'GET',endpoint+'/catalog',undefined,404);
 const catalog=await call(manager,'GET',endpoint+'/catalog');const canonical=catalog.entries.find(e=>e.articleId==='bestiaire-v15-soldato');assert.ok(canonical);assert.ok(catalog.entries.every(e=>!e.data));
 const canonicalId=randomUUID();await action(manager,{requestId:canonicalId,action:'add',catalog:'compendium',kind:'creature',sourceId:canonical.id,name:'Homme de main',visible:true});
 const imported=await latest(canonicalId);assert.equal(imported.initiativeBonus,8);assert.equal(imported.rolls.find(r=>r.id==='attack:0').damage,11);
 const publicImported=(await snapshot(other)).combatants.find(c=>c.id===canonicalId);assert.ok(!('sourceArticle' in publicImported));assert.ok(!('rolls' in publicImported));assert.ok(!('reference' in publicImported));assert.ok(imported.reference);
 const diveId=randomUUID();await action(manager,{requestId:diveId,action:'add',catalog:'compendium',kind:'creature',sourceId:'bestiaire-v16-dive::creature',name:'Dive ancien',visible:true});
 await pool.query("UPDATE campaign_live_combatants SET data=$2::jsonb,hp=17,pa=1,initiative=23 WHERE id=$1",[diveId,JSON.stringify({sourceArticle:'bestiaire-v16-dive',combatProfileVersion:2,stats:{attack:0},attacks:[]})]);
 const dive=await latest(diveId);assert.equal(dive.hp,17);assert.equal(dive.pa,1);assert.equal(dive.initiative,23);assert.equal(dive.rolls.filter(r=>r.attack).length,2);assert.match(dive.reference.abilities.join(' '),/Mageius/);assert.equal((await app.inject({url:dive.portrait,headers:{cookie:other.cookie}})).statusCode,200);assert.ok(!JSON.stringify(await snapshot(other)).includes('Lien au Mageius'));

 const uploadDir=await mkdtemp(join(tmpdir(),'tuc-live-upload-')),previousUploadDir=process.env.COMPENDIUM_UPLOAD_DIR;process.env.COMPENDIUM_UPLOAD_DIR=uploadDir;
 try{
  const filename='bestiaire-v16-dive--page-1790930055570-3183bf3262.png',bytes=Buffer.from(portrait.split(',')[1],'base64');await writeFile(join(uploadDir,filename),bytes);
  await pool.query("UPDATE campaign_live_combatants SET data=jsonb_set(jsonb_set(data,'{combatProfileVersion}','4'),'{sourcePortrait}',to_jsonb($2::text)) WHERE id=$1",[diveId,'/api/compendium/uploads/'+filename]);
  for(const user of [manager,other]){const response=await app.inject({url:dive.portrait,headers:{cookie:user.cookie}});assert.equal(response.statusCode,200);assert.equal(response.headers['content-type'],'image/png');assert.deepEqual(response.rawPayload,bytes);}
  assert.equal((await app.inject({url:dive.portrait,headers:{cookie:stranger.cookie}})).statusCode,404);
  await pool.query('UPDATE campaign_live_combatants SET visible=false WHERE id=$1',[diveId]);assert.equal((await app.inject({url:dive.portrait,headers:{cookie:other.cookie}})).statusCode,404);
  await pool.query("UPDATE campaign_live_combatants SET data=jsonb_set(data,'{sourcePortrait}',to_jsonb($2::text)) WHERE id=$1",[diveId,'/api/compendium/uploads/../secret.png']);assert.equal((await app.inject({url:dive.portrait,headers:{cookie:manager.cookie}})).statusCode,404);
 }finally{if(previousUploadDir===undefined)delete process.env.COMPENDIUM_UPLOAD_DIR;else process.env.COMPENDIUM_UPLOAD_DIR=previousUploadDir;await rm(uploadDir,{recursive:true,force:true});}
 console.log('UPLOADED PORTRAIT ROUTE OK — real bytes, MIME, participant visibility and path traversal');
 console.log('CAMPAIGN LIVE OK — public dice, detailed MJ log, hidden combatants, strict projections, initiative order, HP, creature PA, idempotence, image permissions, withdrawal and revocation.');
}
