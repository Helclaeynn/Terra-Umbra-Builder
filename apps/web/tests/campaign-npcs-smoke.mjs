import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {NPC_CATALOG,generateNpc} from '../../api/dist/campaign-npc-generator.js';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
const cid='11111111-1111-4111-8111-111111111111',gid='22222222-2222-4222-8222-222222222222',sid='33333333-3333-4333-8333-333333333333';
const base=process.env.TUC_V2_SMOKE_BASE_URL||'http://127.0.0.1:4173';let role='gm',session=null,saves=0;const records=new Map();
const summary=n=>({id:n.id,name:n.data.name,tierId:n.data.tierId,role:n.data.role,faction:n.data.faction,tags:n.data.tags,hasPortrait:!!n.data.portrait,version:n.version,archived:n.archived});
await page.route('**/api/**',async route=>{
 const req=route.request(),url=new URL(req.url()),path=url.pathname,method=req.method();let body={},status=200;
 if(path===`/api/campaigns/${cid}`)body={campaign:{id:cid,name:'Table des PNJ',description:'',gmName:'Morgan',ownerId:gid,canManage:role==='gm',membershipStatus:role==='gm'?null:'accepted',memberCount:0,archivedAt:null,version:1,gmNotes:''},members:[],userId:gid};
 else if(path==='/api/characters')body={characters:[]};
 else if(path.endsWith('/admissions'))body={canManage:role==='gm',rules:'',admissions:[]};
 else if(path.endsWith('/sessions')&&method==='GET')body={sessions:session?[session]:[],hasMore:false,calendarMailAvailable:false};
 else if(path.endsWith('/sessions')&&method==='POST'){session={...req.postDataJSON(),id:sid,version:1,rewards:[],effects:[],attendance:[]};body={session:{id:sid,version:1}};status=201;}
 else if(path.endsWith('/preparation')&&method==='PATCH'){const b=req.postDataJSON();assert.equal(b.version,session.version);session={...session,...b,version:session.version+1};body={session:{id:sid,version:session.version}};}
 else if(path.endsWith('/preparation-library'))body={references:[],previous:[]};
 else if(path==='/api/compendium/library')body={favoriteItems:[],recentItems:[]};
 else if(path==='/api/compendium/search')body={items:[],total:0};
 else if(path.endsWith('/npcs/catalog'))body=NPC_CATALOG;
 else if(path.endsWith('/npcs/generate')){const b=req.postDataJSON();body={npcs:Array.from({length:b.count},(_,i)=>generateNpc(b.tierId,b.presetId,b.seed+i,b.faction,b.sex))};}
 else if(path.endsWith('/npcs')&&method==='POST'){for(const n of req.postDataJSON().npcs){records.set(n.id,{...n,version:1,archived:false});saves++;}status=201;body={ok:true};}
 else if(path.endsWith('/npcs')){const q=(url.searchParams.get('q')||'').toLowerCase();body={npcs:[...records.values()].filter(n=>n.archived===(url.searchParams.get('archived')==='true')&&JSON.stringify(n.data).toLowerCase().includes(q)).map(summary),hasMore:false};}
 else if(path.includes('/npcs/')){const id=path.split('/npcs/')[1].split('/')[0],n=records.get(id);assert.ok(n,path);if(path.endsWith('/portrait')){const [head,data]=n.data.portrait.split(',');await route.fulfill({contentType:head.slice(5).split(';')[0],body:Buffer.from(data,'base64')});return;}if(method==='PATCH'){const b=req.postDataJSON();assert.equal(b.version,n.version);records.set(id,{id,data:b.data,version:n.version+1,archived:b.archived});body={ok:true};}else body={npc:{...summary(n),data:n.data}};}
 else throw Error('Unexpected API '+method+' '+path);
 await route.fulfill({status,json:body});
});
const click=name=>page.getByRole('button',{name,exact:true}).click();
try{
 await page.goto(base+'/campaigns/'+cid);await page.getByText('Mes PNJ de campagne · générateur et fiches',{exact:true}).click();
 await click('Créer un PNJ');assert.equal(await page.getByLabel('Palier du PNJ',{exact:true}).locator('option').count(),8);
 await page.getByLabel('Palier du PNJ',{exact:true}).selectOption('elite');await page.getByLabel('Prétiré',{exact:true}).selectOption('enqueteur');await page.getByLabel('Sexe à la génération',{exact:true}).selectOption('female');await click('Ouvrir la fiche personnalisée');assert.equal(await page.getByLabel('Sexe du PNJ',{exact:true}).inputValue(),'female');
 await page.getByLabel('Nom affiché / alias',{exact:true}).fill('Morgan · témoin');assert.equal(saves,0);
 await page.getByLabel('Tags du PNJ',{exact:true}).fill('port, témoin');await page.getByLabel('Secret ou accroche MJ',{exact:true}).fill('Secret de test');
 // Real decoding and canvas compression, then database-shaped persistence and reload.
 const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=1200;c.height=800;const x=c.getContext('2d');x.fillStyle='#267eb1';x.fillRect(0,0,1200,800);return c.toDataURL('image/png').split(',')[1];});
 await page.getByLabel('Ajouter ou remplacer l’image',{exact:true}).setInputFiles({name:'portrait.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
 await page.locator('.portrait > img').waitFor();await click('Enregistrer le PNJ');await page.getByRole('status').filter({hasText:'1 PNJ enregistré'}).waitFor();assert.equal(saves,1);
 let record=[...records.values()][0];assert.equal(record.data.sex,'female');assert.match(record.data.portrait,/^data:image\/(webp|jpeg);base64,/);assert.ok(record.data.portrait.length<700000);assert.deepEqual(record.data.tags,['port','témoin']);
 await click('Consulter Morgan · témoin');assert.equal(await page.locator('.preview .portrait img').evaluate(img=>img.naturalWidth),640);await click('Fermer la fiche PNJ');
 await click('Modifier Morgan · témoin');await page.getByLabel('Nom affiché / alias',{exact:true}).fill('Morgan · contact');await click('Enregistrer les modifications');await page.getByRole('button',{name:'Consulter Morgan · contact',exact:true}).waitFor();
 await click('Consulter Morgan · contact');
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'NPC layout '+width);}
 await click('Fermer la fiche PNJ');await page.getByText('Mes PNJ de campagne · générateur et fiches',{exact:true}).click();
 await click('Préparer une séance');await page.getByLabel('Titre de la séance',{exact:true}).fill('La rencontre');await click('Ajouter une scène');await click('Ajouter une référence');await click('Mes PNJ de campagne');
 await click('Ajouter Morgan · contact à la scène');await page.getByRole('status').filter({hasText:'Morgan · contact ajouté'}).waitFor();
 await page.getByRole('button',{name:'Morgan · contact · Ouvrir la fiche',exact:true}).click();await page.locator('.reference .npc-sheet').waitFor();assert.match(await page.locator('.reference').textContent(),/Secret de test/);
 await click('Fermer la préparation');await page.locator('.notebook').waitFor({state:'detached'});assert.equal(session.scenes[0].references[0].npcId,record.id);
 await page.reload();await page.locator('.session > summary').click();await page.locator('details.private > summary').click();await page.getByRole('button',{name:'Morgan · contact · Ouvrir la fiche',exact:true}).click();await page.locator('.reference .npc-sheet').waitFor();
 await page.getByText('Mes PNJ de campagne · générateur et fiches',{exact:true}).click();await click('Modifier Morgan · contact');await click('Retirer l’image');await click('Enregistrer les modifications');await page.getByRole('status').filter({hasText:'1 PNJ enregistré'}).waitFor();assert.equal(records.get(record.id).data.portrait,'');
 role='player';await page.reload();await page.getByRole('heading',{name:'Le groupe',exact:true}).waitFor();assert.equal(await page.getByText('Mes PNJ de campagne · générateur et fiches',{exact:true}).count(),0);
 assert.deepEqual(errors,[]);console.log('NPC BROWSER OK — tiers, custom editable sheet, image compression/persistence/removal, tags, scene selection and saved sheet, private manager, 1440/390/320px reflow');
}finally{await browser.close();}
