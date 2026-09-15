import {chromium} from 'playwright-core';
// Revalidate the committed Truth catalogue, including unique artifacts, in the real V3 runtime.
const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(`console: ${m.text()}`);});
page.on('response',r=>{if(r.status()>=400&&r.url().includes('/compendium/')&&!/favicon\.ico/i.test(r.url()))errors.push(`http ${r.status()}: ${r.url()}`);});
async function gotoCategory(){await page.goto(`${base}compendium/#/category/${encodeURIComponent('Catalogue Vérité')}`,{waitUntil:'domcontentloaded'});await page.waitForSelector('.article-card',{timeout:20000});}
async function openByTitle(title,needles=[]){
  const input=page.locator('#categoryFilter');await input.fill(title);await page.waitForTimeout(120);
  const cards=page.locator('.article-card:visible');if(await cards.count()!==1)throw new Error(`${title}: ${await cards.count()} cartes`);
  await cards.first().click();await page.waitForSelector('#main .article-media img',{timeout:10000});
  const lore=page.locator('#main section#contexte .body-p.lore');if(await lore.count()!==2)throw new Error(`${title}: lore ${await lore.count()}`);
  if(await page.locator('#main .doc-table').count()<1)throw new Error(`${title}: tableau absent`);
  const loreText=(await lore.allTextContents()).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  for(const needle of needles){const n=needle.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(!loreText.includes(n))throw new Error(`${title}: détail lore non rendu (${needle})`);}
}
try{
  await gotoCategory();const count=await page.locator('.article-card:visible').count();if(count!==229)throw new Error(`Catalogue Vérité: ${count} cartes, attendu 229`);
  await openByTitle('Defensor',['générateur de projectiles','cartouche-source']);
  await gotoCategory();await openByTitle('Raven Null Cage',['dizaine de minutes','mauvais diagnostic']);
  await gotoCategory();await openByTitle('Grande Orbe',['Bellatheis','Sharith','ascendances']);
  const body=(await page.locator('#main').innerText()).toLowerCase();if(!body.includes('unique'))throw new Error('Grande Orbe: statut unique non rendu');
  if(errors.length)throw new Error(errors.join('\n'));
  console.log(`Browser smoke Vérité OK — ${count} pages · lore source-spécifique rendu sur Defensor, Null Cage et Grande Orbe.`);
}finally{await browser.close();}
