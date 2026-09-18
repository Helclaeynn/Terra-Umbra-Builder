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
  const illustrated=[
    ['Riot Control','Raven SG-025 Riot Control','equipement-043-raven-sg-025-riot-control','equipement-043-raven-sg-025-riot-control.webp'],
    ['Croaker','Raven SG-039 Croaker','equipement-044-raven-sg-039-croaker','equipement-044-raven-sg-039-croaker.webp'],
    ['Owl SG-016 Boss','Owl SG-016 Boss','equipement-045-owl-sg-016-boss','equipement-045-owl-sg-016-boss.webp'],
    ['Fire Rain','Phoenix SG-042 Fire Rain','equipement-046-phoenix-sg-042-fire-rain','equipement-046-phoenix-sg-042-fire-rain.webp']
  ];
  for(const [query,name,id,image] of illustrated){
    await search.fill(query);
    const card=selector.locator('.catalog-card').filter({hasText:name}).first();
    await card.waitFor({state:'visible',timeout:15000});
    await page.waitForFunction(id=>document.querySelector(`.catalog-card[data-wiki-id="${id}"]`)!==null,id,{timeout:10000});
    const title=card.locator('a.builder-wiki-equipment-title').first();
    const href=await title.getAttribute('href');
    if(!href?.includes(`../compendium/index.html#/article/${id}`))throw new Error(`${name} pointe vers une mauvaise page: ${href}`);
    await card.hover();
    await page.waitForSelector('.builder-wiki-preview.visible',{timeout:5000});
    await page.waitForFunction(image=>document.querySelector('.builder-wiki-preview.visible img.builder-wiki-image')?.getAttribute('src')?.includes(image),image,{timeout:15000});
    const src=await page.locator('.builder-wiki-preview.visible img.builder-wiki-image').getAttribute('src');
    if(!src?.includes(`../compendium/images/manual/${image}`))throw new Error(`Image ${name} incorrecte: ${src}`);
    const preview=(await page.locator('.builder-wiki-preview.visible').innerText()).trim();
    if(!preview.includes(name)||preview.length<100)throw new Error(`Preview ${name} incomplète: ${preview}`);
    const imgResponse=await page.request.get(new URL(src,page.url()).href);
    if(!imgResponse.ok())throw new Error(`Image ${name} inaccessible: HTTP ${imgResponse.status()}`);
    await page.mouse.move(10,10);await page.waitForTimeout(80);
  }
  await page.goto(`${base}compendium/index.html#/article/equipement-045-owl-sg-016-boss`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.querySelector('#main .page-head h1')?.textContent?.includes('Owl SG-016 Boss'),null,{timeout:30000});
  const bossImage=page.locator('#main figure.article-media img').first();
  await bossImage.waitFor({state:'visible',timeout:10000});
  await page.waitForFunction(()=>{const img=document.querySelector('#main figure.article-media img');return !!img&&img.complete&&img.naturalWidth>0&&img.naturalHeight>0},null,{timeout:10000});
  const bossImageState=await bossImage.evaluate(img=>({src:img.currentSrc||img.src,width:img.naturalWidth,height:img.naturalHeight}));
  if(!bossImageState.src.includes('equipement-045-owl-sg-016-boss.webp'))throw new Error(`Image directe Boss incorrecte: ${JSON.stringify(bossImageState)}`);

  const bossText=(await page.locator('#main').innerText()).trim();
  if(!bossText.includes('Armement — Shotguns'))throw new Error(`Taxonomie Shotguns absente de la fiche Boss:\n${bossText.slice(0,2500)}`);
  if(bossText.includes('Armes — Précision'))throw new Error(`Ancienne catégorie encore visible dans la fiche Boss:\n${bossText.slice(0,2500)}`);
  if(!bossText.includes('capacité de munitions supérieure à la moyenne'))throw new Error(`Précision sur la capacité de munitions absente de la fiche Boss:\n${bossText.slice(0,2500)}`);
  if(bossText.includes('grande réserve'))throw new Error(`Formulation ambiguë « grande réserve » encore visible dans la fiche Boss.`);

  console.log(`EQUIPMENT WIKI OK — 4 shotguns illustrés + fiche Boss directe avec image ${bossImageState.width}×${bossImageState.height}, taxonomie Shotguns et capacité de munitions explicite.`);
}finally{await browser.close()}
