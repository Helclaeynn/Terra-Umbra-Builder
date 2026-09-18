import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1500,height:900}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{const text=msg.text();if(msg.type()==='error'&&!text.startsWith('Failed to load resource:')&&!text.startsWith('Chargement V5 Exilés/Extrals'))errors.push(`console: ${text}`)});
page.on('response',response=>{const url=response.url();const knownLegacy=/\/truth\/talents\/(?:aseryn|extral|exile)\.json(?:\?|$)/i.test(url);if(response.status()>=400&&!knownLegacy&&!/favicon\.ico(?:\?|$)/i.test(url))errors.push(`http ${response.status()}: ${url}`)});

try{
  await page.goto(`${base}compendium/#/start`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.nature-card',{timeout:30000});
  const garou=page.locator('.nature-card').filter({hasText:'Garou'}).first();
  const lore=garou.locator('a').filter({hasText:'Présentation & lore'}).first();
  await lore.scrollIntoViewIfNeeded();
  if(await page.evaluate(()=>scrollY)<100)await page.evaluate(()=>scrollTo(0,700));
  await lore.click();
  await page.waitForFunction(()=>location.hash.includes('verite-047-11-garous-loups-descendants-de-khinae'),null,{timeout:10000});
  await page.waitForSelector('#main .page-head h1',{timeout:10000});
  await page.waitForTimeout(120);
  const y=await page.evaluate(()=>scrollY);
  if(y>40)throw new Error(`Navigation article conserve un scroll intermédiaire: scrollY=${y}`);

  await page.goto(`${base}compendium/#/article/verite-050-14-daemons`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#main .wiki-link[data-wiki-id]',{timeout:30000});
  const direct=page.locator('#main .wiki-link[data-wiki-id]').first();
  await direct.hover();
  await page.waitForSelector('.wiki-hover-preview.visible',{timeout:5000});
  const previewText=(await page.locator('.wiki-hover-preview.visible').innerText()).trim();
  if(previewText.length<80)throw new Error(`Aperçu Compendium trop court: ${previewText}`);

  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#stepNav .step-link',{timeout:30000});
  await page.locator('#stepNav .step-link').filter({hasText:'Vérité'}).first().click();
  await page.waitForSelector('#stepContent',{timeout:10000});
  const garouChoice=page.locator('#stepContent').getByText('Garou',{exact:true}).first();
  await garouChoice.waitFor({state:'visible',timeout:10000});
  await garouChoice.click();
  const khinae=page.locator('#stepContent a.builder-wiki-link[data-wiki-id]').filter({hasText:/Khinae/i}).first();
  await khinae.waitFor({state:'visible',timeout:15000});
  const href=await khinae.getAttribute('href');
  if(!href?.includes('../compendium/index.html#/article/verite-048-12-autres-descendants-de-khinae'))throw new Error(`Khinae ne pointe pas vers le lore attendu: ${href}`);
  await khinae.hover();
  await page.waitForSelector('.builder-wiki-preview.visible',{timeout:5000});
  await page.waitForFunction(()=>{const p=document.querySelector('.builder-wiki-preview.visible p');return p&&p.textContent&&!p.textContent.includes('Chargement')&&p.textContent.trim().length>40},null,{timeout:15000});
  const builderPreview=(await page.locator('.builder-wiki-preview.visible').innerText()).trim();
  if(!/Khinae/i.test(builderPreview)||builderPreview.length<100)throw new Error(`Aperçu Builder invalide: ${builderPreview}`);

  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log('WIKI INTEGRATION OK — scroll article + hover Compendium + Garou→Khinae Builder validés.');
}finally{await browser.close()}
