import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerCampaignRoutes}=await import('../dist/campaigns.js');
const app=Fastify(),ids=[];await registerCampaignRoutes(app);
async function account(role,name){const r=await pool.query('INSERT INTO users(email,display_name,role) VALUES($1,$2,$3) RETURNING id',[`ci-workspace-${randomBytes(10).toString('hex')}@example.invalid`,name,role]);const id=r.rows[0].id;ids.push(id);const token=randomBytes(32).toString('base64url');await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
async function call(who,method,url,payload,status=200){const r=await app.inject({method,url,headers:who?{cookie:who.cookie}:{},...(payload===undefined?{}:{payload})});assert.equal(r.statusCode,status,`${method} ${url} ${r.body}`);return r.json();}
try{
 const gm=await account('gm','Workspace MJ'),p=await account('player','Workspace joueur'),other=await account('player','Workspace autre'),invitee=await account('player','Workspace invité'),outsider=await account('gm','Workspace extérieur');
 const cid=(await call(gm,'POST','/api/campaigns',{name:'Carnet CI'},201)).campaign.id,base=`/api/campaigns/${cid}`;
 for(const who of [p,other,invitee])await pool.query('INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,$3)',[cid,who.id,who===invitee?'invited':'accepted']);
 const scene={id:'scene-a',title:'Indice privé',notes:'SECRET',done:false,references:[{articleId:'pnj-test',title:'Contact privé',category:'Personnages',quantity:1,notes:'SECRET'}]};
 const initial={title:'Carnet',preparation:'SECRET',scenes:[scene],playedOn:null,status:'planned',report:'BROUILLON',published:false,requestId:randomUUID()};
 const created=await call(gm,'POST',base+'/sessions',initial,201),sid=created.session.id,path=`${base}/sessions/${sid}`;
 const repeated=await call(gm,'POST',base+'/sessions',initial,201);assert.equal(repeated.session.id,sid);assert.equal(repeated.session.version,1);
 assert.equal((await call(gm,'GET',base+'/sessions')).sessions.length,1);
 await call(gm,'POST',base+'/sessions',{...initial,requestId:'bad'},400);
 const prep={title:'Carnet enrichi',preparation:'SECRET modifié',scenes:[scene],version:1};
 for(const who of [p,invitee,outsider]){await call(who,'PATCH',path+'/preparation',prep,404);await call(who,'GET',base+'/preparation-library',undefined,404);}
 const saved=await call(gm,'PATCH',path+'/preparation',prep);assert.equal(saved.session.version,2);
 await call(gm,'PATCH',path+'/preparation',prep,409);
 await call(gm,'PATCH',path+'/preparation',{...prep,version:2,scenes:[{...scene,title:''}]},400);
 let s=(await call(gm,'GET',base+'/sessions')).sessions[0];assert.equal(s.report,'BROUILLON');assert.equal(s.status,'planned');assert.equal(s.playedOn,null);assert.equal(s.published,false);assert.equal(s.preparation,prep.preparation);
 const library=await call(gm,'GET',base+'/preparation-library');assert.equal(library.references[0].id,'pnj-test');assert.equal(library.previous[0].scenes[0].notes,'SECRET');
 s=(await call(p,'GET',base+'/sessions')).sessions[0];assert.equal(s.preparation,undefined);assert.equal(s.scenes,undefined);assert.equal(s.report,'');assert.equal(s.attendance.length,2);assert.ok(s.attendance.every(r=>r.response===null));assert.ok(!JSON.stringify(s).includes('SECRET'));
 const presence=path+'/attendance/';
 await call(null,'PUT',presence+p.id,{response:'present'},401);
 await call(invitee,'PUT',presence+invitee.id,{response:'present'},404);
 await call(outsider,'PUT',presence+p.id,{response:'present'},404);
 await call(p,'PUT',presence+other.id,{response:'absent'},404);
 await call(p,'PUT',presence+p.id,{response:'wrong'},400);
 await call(p,'PUT',presence+p.id,{response:'present'});
 await call(other,'PUT',presence+other.id,{response:'uncertain'});
 s=(await call(gm,'GET',base+'/sessions')).sessions[0];assert.equal(s.version,2);assert.equal(s.attendance.find(a=>a.userId===p.id).response,'present');
 await call(gm,'PUT',presence+p.id,{response:'absent'});
 assert.equal((await call(p,'GET',base+'/sessions')).sessions[0].attendance.find(a=>a.userId===p.id).response,'absent');
 // A session from another campaign must never receive this campaign's attendance.
 const otherCid=(await call(gm,'POST','/api/campaigns',{name:'Autre carnet CI'},201)).campaign.id;
 await call(gm,'PUT',`/api/campaigns/${otherCid}/sessions/${sid}/attendance/${p.id}`,{response:'present'},404);
 await pool.query("UPDATE campaign_sessions SET status='played' WHERE id=$1",[sid]);
 await call(p,'PUT',presence+p.id,{response:'present'},404);await call(gm,'PUT',presence+p.id,{response:'present'});
 await pool.query('DELETE FROM campaign_members WHERE campaign_id=$1 AND user_id=$2',[cid,other.id]);
 assert.equal((await pool.query('SELECT count(*)::int n FROM campaign_session_attendance WHERE user_id=$1',[other.id])).rows[0].n,0);
 // Directory browse, stable pagination, filtering, and no mail addresses exposed.
 const directory=[];for(let i=0;i<23;i++)directory.push(await account('player','Workspace Browse '+String(i).padStart(2,'0')));
 const first=await call(gm,'GET',base+'/accounts?q=Workspace%20Browse');assert.equal(first.accounts.length,20);assert.equal(first.hasMore,true);
 const next=await call(gm,'GET',base+'/accounts?q=Workspace%20Browse&offset=20');assert.equal(next.accounts.length,3);assert.equal(next.hasMore,false);assert.ok(!next.accounts.some(a=>first.accounts.some(b=>a.id===b.id)));
 assert.ok((await call(gm,'GET',base+'/accounts')).accounts.length>0);
 const all=await call(gm,'GET',base+'/accounts?q=Workspace');assert.ok(all.accounts.every(a=>!('email' in a)&&![gm.id,p.id,invitee.id].includes(a.id)));
 await call(p,'GET',base+'/accounts',undefined,404);await call(gm,'GET',base+'/accounts?offset=-1',undefined,400);
 await pool.query('UPDATE campaigns SET archived_at=now() WHERE id=$1',[cid]);
 await call(gm,'PUT',presence+p.id,{response:'present'},404);await call(gm,'PATCH',path+'/preparation',{...prep,version:2},404);
 await pool.query("UPDATE users SET role='player' WHERE id=$1",[gm.id]);await call(gm,'GET',base+'/preparation-library',undefined,404);
 // Deleting a campaign is owner/admin-only, even when archived, and preserves player sheets.
 await call(gm,'DELETE',base,{version:1},404);
 await pool.query("UPDATE users SET role='gm' WHERE id=$1",[gm.id]);
 await call(null,'DELETE',base,{version:1},401);
 for(const who of [p,invitee,outsider])await call(who,'DELETE',base,{version:1},404);
 await call(gm,'DELETE',base,{},400);
 await call(gm,'DELETE',base,{version:2},409);
 const data={progression:{xpEarned:15,ptvEarned:6}},character=(await pool.query("INSERT INTO characters(owner_id,name,data,campaign_id) VALUES($1,'Fiche conservée',$2,$3) RETURNING id",[p.id,data,cid])).rows[0].id;
 await pool.query("INSERT INTO character_revisions(character_id,revision,name,data,created_by) VALUES($1,1,'Fiche conservée',$2,$3)",[character,data,p.id]);
 await pool.query("INSERT INTO character_journal_entries(character_id,title,played_on,content) VALUES($1,'Journal conservé','2026-09-27','Mon aventure')",[character]);
 await pool.query("UPDATE campaign_members SET character_id=$3 WHERE campaign_id=$1 AND user_id=$2",[cid,p.id,character]);
 await pool.query("INSERT INTO campaign_session_rewards(session_id,character_id,character_name,xp,ptv) VALUES($1,$2,'Fiche conservée',3,2)",[sid,character]);
 await pool.query("INSERT INTO campaign_session_effects(id,session_id,character_id,character_name,money,reason,before_state,after_state) VALUES($1,$2,$3,'Fiche conservée',10,'Gain',$4,$4)",[randomUUID(),sid,character,{}]);
 await pool.query("INSERT INTO campaign_calendar_deliveries(session_id,user_id,version,status) VALUES($1,$2,1,'sent')",[sid,p.id]);
 await pool.query("INSERT INTO campaign_admission_messages(campaign_id,user_id,kind,message) VALUES($1,$2,'approved','Acceptée')",[cid,p.id]);
 for(const table of ['campaign_npcs','campaign_bestiary'])await pool.query(`INSERT INTO ${table}(id,campaign_id,data) VALUES($1,$2,'{}')`,[randomUUID(),cid]);
 await call(gm,'DELETE',base,{version:1});
 await call(gm,'GET',base,undefined,404);await call(gm,'DELETE',base,{version:1},404);
 for(const table of ['campaign_members','campaign_sessions','campaign_admission_messages','campaign_npcs','campaign_bestiary'])assert.equal((await pool.query(`SELECT count(*)::int n FROM ${table} WHERE campaign_id=$1`,[cid])).rows[0].n,0,table+' removed');
 for(const table of ['campaign_session_attendance','campaign_calendar_deliveries','campaign_session_rewards','campaign_session_effects'])assert.equal((await pool.query(`SELECT count(*)::int n FROM ${table} WHERE session_id=$1`,[sid])).rows[0].n,0,table+' removed');
 const kept=(await pool.query('SELECT campaign_id,data FROM characters WHERE id=$1',[character])).rows[0];assert.equal(kept.campaign_id,null);assert.deepEqual(kept.data,data);
 for(const table of ['character_revisions','character_journal_entries'])assert.equal((await pool.query(`SELECT count(*)::int n FROM ${table} WHERE character_id=$1`,[character])).rows[0].n,1,table+' preserved');
 const admin=await account('admin','Workspace admin');await call(admin,'DELETE',`/api/campaigns/${otherCid}`,{version:1});
 console.log('CAMPAIGN WORKSPACE OK — idempotent creation, private autosave, stale conflict, unchanged scheduling/report, reusable scenes, self/GM attendance, archive/role/membership isolation, directory browsing and pagination');
 console.log('CAMPAIGN DELETION OK — owner/admin permissions, stale version protection, cascaded campaign records, player sheets/progression/history/journal preserved');
}finally{await app.close();if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-workspace-%@example.invalid'",[ids]);await pool.end();}
