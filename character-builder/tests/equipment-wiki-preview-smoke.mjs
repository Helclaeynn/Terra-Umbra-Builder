import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1500,height:1000}});

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#stepNav button',{timeout:30000});
  await page.waitForFunction(()=>window.__TUC_LATE_STATE_READY__===true,null,{timeout:30000});

  const sphereNav=page.locator('#stepNav button').filter({hasText:'Sphère & Style'}).first();
  await sphereNav.click();
  const sphere=page.locator('#stepContent .p25-choice-card').first();
  await sphere.waitFor({state:'visible',timeout:10000});await sphere.click();
  const styleHeading=page.locator('#stepContent h3.subhead').filter({hasText:'Choisir le Style'}).first();
  await styleHeading.waitFor({state:'visible',timeout:10000});
  const styleGrid=page.locator('#stepContent .p25-choice-grid').nth(1);
  const style=styleGrid.locator('.p25-choice-card').first();
  await style.waitFor({state:'visible',timeout:10000});await style.click();

  const nav=page.locator('#stepNav button').filter({hasText:'Équipement'}).first();
  await nav.click();

  const selector=page.locator('details.r34-catalog-selector').filter({hasText:'Choisir équipement, services & véhicules'}).first();
  await selector.waitFor({state:'visible',timeout:15000});
  if(!(await selector.getAttribute('open')))await selector.locator('summary').click();

  const search=selector.locator('input[placeholder*="Rechercher équipement"]').first();
  await search.fill('Croaker');
  const card=selector.locator('.catalog-card').filter({hasText:'Raven SG-039 Croaker'}).first();
  await card.waitFor({state:'visible',timeout:15000});
  await page.waitForFunction(()=>document.querySelector('.catalog-card[data-wiki-id="equipement-044-raven-sg-039-croaker"]')!==null,null,{timeout:10000});

  const title=card.locator('a.builder-wiki-equipment-title').first();
  const href=await title.getAttribute('href');
  if(!href?.includes('../compendium/index.html#/article/equipement-044-raven-sg-039-croaker'))throw new Error(`Croaker pointe vers une mauvaise page: ${href}`);

  await card.hover();
  await page.waitForSelector('.builder-wiki-preview.visible',{timeout:5000});
  await page.waitForFunction(()=>document.querySelector('.builder-wiki-preview.visible img.builder-wiki-image')?.getAttribute('src')?.includes('equipement-044-raven-sg-039-croaker.webp'),null,{timeout:15000});
  const src=await page.locator('.builder-wiki-preview.visible img.builder-wiki-image').getAttribute('src');
  if(!src?.includes('../compendium/images/manual/equipement-044-raven-sg-039-croaker.webp'))throw new Error(`Image Croaker incorrecte: ${src}`);
  const preview=(await page.locator('.builder-wiki-preview.visible').innerText()).trim();
  if(!/Raven SG-039 Croaker/.test(preview)||preview.length<100)throw new Error(`Preview Croaker incomplète: ${preview}`);

  const imgResponse=await page.request.get(new URL(src,page.url()).href);
  if(!imgResponse.ok())throw new Error(`Image Croaker inaccessible: HTTP ${imgResponse.status()}`);

  console.log('EQUIPMENT WIKI OK — Croaker: carte Builder → page Compendium + image en premier dans le hover.');
}finally{await browser.close()}
