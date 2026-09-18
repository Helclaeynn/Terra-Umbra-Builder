import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1400,height:900}});
try{
  await page.route('**/compendium/data/*.b64part',async route=>{
    await new Promise(resolve=>setTimeout(resolve,1800));
    await route.continue();
  });
  const start=Date.now();
  await page.goto(`${base}compendium/#/start`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.start-hero',{state:'visible',timeout:3500});
  await page.waitForFunction(()=>window.__TUC_START_READY__===true,null,{timeout:1000});
  const elapsed=Date.now()-start;
  const corpusReady=await page.evaluate(()=>window.__TUC_CORPUS_READY__===true);
  if(corpusReady)throw new Error('Le corpus complet a fini de charger avant le test ralenti : le test ne valide pas le fast-start.');
  const navCategories=await page.locator('#mainNav a[href^="#/category/"]').count();
  if(navCategories!==6)throw new Error(`Navigation onboarding incomplète pendant le chargement: ${navCategories}/6 catégories`);
  console.log(`COMPENDIUM FAST START OK — onboarding visible en ${elapsed} ms alors que les fragments V3 sont encore retardés.`);
}finally{await browser.close()}
