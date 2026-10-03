import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.env.TUC_V2_SMOKE_BASE_URL||'http://127.0.0.1:4173',id='11111111-1111-4111-8111-111111111111';let manager=true;
const events=[{id:'jet',kind:'initiative',characterName:'Thomas Petit',playerName:'Thomas',createdAt:'2026-10-03T15:00:00Z',payload:{label:'Initiative',modifier:7,dice:[10,2],total:19,exploded:true,narrativeFailure:false}}];
await page.route('**/api/**',async route=>{
 const url=new URL(route.request().url()),path=url.pathname,b=route.request().postDataJSON();
 if(path===`/api/campaigns/${id}/play`)return route.fulfill({json:{campaignName:'La Loge de Los Angeles',canManage:manager,ownCharacterId:null,characters:[{id:'pc',kind:'character',name:'Thomas Petit',occupation:'Enquêteur',sphere:'Gouvernemental',health:'Indemne',...(manager?{hp:12,pvMax:12,pa:2,initiative:19,canReadSheet:true}:{})}],combatants:[{id:'wolf',kind:'creature',name:'Loup gris',health:'Blessé',...(manager?{hp:10,pvMax:20,pa:2,initiative:20,visible:true,version:1}:{})}],order:['wolf','pc'],events}});
 if(path===`/api/campaigns/${id}/play/actions`){assert.ok(manager);assert.equal(b.action,'message');events.unshift({id:b.requestId,kind:'message',createdAt:new Date().toISOString(),payload:{label:'Révélation du MJ',text:b.text,link:b.link}});return route.fulfill({json:{ok:true}});}
 throw Error('Unexpected live page request '+path);
});
try{
 await page.goto(base+`/campaigns/${id}/play`);await page.getByRole('heading',{name:'La Loge de Los Angeles'}).waitFor();assert.match(await page.title(),/En jeu/);
 assert.equal(await page.locator('.initiative-rail li').first().locator('strong').textContent(),'Loup gris');await page.getByText('Thomas Petit → Initiative → 19',{exact:true}).waitFor();
 await page.getByText('Détail du jet',{exact:true}).click();await page.getByText('Bonus du jet : 7',{exact:true}).waitFor();
 await page.getByText('Révéler quelque chose au groupe',{exact:true}).click();await page.getByLabel('Message ou information révélée',{exact:true}).fill('Le rendez-vous est fixé au port.');await page.getByRole('button',{name:'Révéler au groupe',exact:true}).click();await page.getByText('Le rendez-vous est fixé au port.',{exact:true}).waitFor();
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow at '+width);await page.screenshot({path:`/tmp/campaign-live-${width}.png`,fullPage:true});}
 manager=false;await page.reload();await page.getByRole('heading',{name:'La Loge de Los Angeles'}).waitFor();assert.equal(await page.getByText('Révéler quelque chose au groupe',{exact:true}).count(),0);assert.equal(await page.getByText('10 / 20 PV',{exact:false}).count(),0);assert.equal(await page.locator('.rail-actions').count(),0);await page.getByText('Le rendez-vous est fixé au port.',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('CAMPAIGN LIVE BROWSER OK — initiative roster, detailed roll log, MJ revelation, player restrictions and 1440/390/320px reflow.');
}finally{await browser.close();}
