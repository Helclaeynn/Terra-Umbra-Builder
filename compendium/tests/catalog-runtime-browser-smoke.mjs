import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{if(msg.type()==='error')errors.push(`console: ${msg.text()}`);});

async function gotoCategory(category){
  await page.goto(`${base}compendium/#/category/${encodeURIComponent(category)}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.article-card',{timeout:20000});
}
async function visibleCards(){return page.locator('.article-card:visible');}
async function filterCategory(text){
  const input=page.locator('#categoryFilter');
  await input.fill(text);
  await page.waitForTimeout(100);
}
async function assertArticleBasics(label){
  await page.waitForSelector('#main .page-head h1',{timeout:10000});
  const media=page.locator('#main .article-media img');
  if(await media.count()!==1)throw new Error(`${label}: emplacement d’illustration non rendu`);
  const context=page.locator('#main section#contexte .body-p.lore');
  if(await context.count()<2)throw new Error(`${label}: deux paragraphes de lore communs non rendus`);
}

try{
  await gotoCategory('Augmentations');
  const augmentationCount=await visibleCards().count();
  if(!augmentationCount||augmentationCount>=146)throw new Error(`Augmentations: ${augmentationCount} pages visibles pour 146 variantes runtime`);
  await filterCategory('Cybermain');
  const cyberCards=await visibleCards();
  if(await cyberCards.count()!==1)throw new Error(`Cybermain: ${await cyberCards.count()} cartes visibles, attendu 1`);
  await cyberCards.first().click();
  await assertArticleBasics('Cybermain');
  const headings=(await page.locator('#main .section h2').allTextContents()).map(text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase());
  if(!headings.some(text=>text.includes('generation 1'))||!headings.some(text=>text.includes('generation 2')))throw new Error('Cybermain: Gen.1 et Gen.2 ne sont pas rendues sur la même page');
  const generationSections=page.locator('#main .section').filter({has:page.locator('h2')});
  let generationLoreSeen=0;
  let tablesSeen=0;
  for(let i=0;i<await generationSections.count();i++){
    const section=generationSections.nth(i);
    const heading=(await section.locator('h2').textContent()||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(!heading.includes('generation '))continue;
    if(await section.locator('.body-p.lore').count()<1)throw new Error(`Cybermain / ${heading}: lore spécifique non rendu`);
    if(await section.locator('.doc-table').count()<1)throw new Error(`Cybermain / ${heading}: tableau mécanique non rendu`);
    generationLoreSeen++;
    tablesSeen++;
  }
  if(generationLoreSeen<2||tablesSeen<2)throw new Error('Cybermain: sections génération incomplètes');

  await gotoCategory('Équipement');
  await filterCategory('FaceCaster DFL');
  const faceCards=await visibleCards();
  if(await faceCards.count()!==1)throw new Error(`FaceCaster DFL: ${await faceCards.count()} cartes visibles, attendu 1`);
  await faceCards.first().click();
  await assertArticleBasics('FaceCaster DFL');
  if(await page.locator('#main .doc-table').count()<1)throw new Error('FaceCaster DFL: tableau mécanique non rendu');

  await gotoCategory('Équipement');
  await filterCategory('Neuroprogramme');
  const neuroCards=await visibleCards();
  const neuroCount=await neuroCards.count();
  if(neuroCount!==27)throw new Error(`Neuroprogrammes: ${neuroCount} cartes visibles, attendu 27`);
  await neuroCards.first().click();
  await assertArticleBasics('Neuroprogramme');
  if(await page.locator('#main .doc-table').count()<1)throw new Error('Neuroprogramme: tableau mécanique non rendu');

  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log(`Browser smoke OK — ${augmentationCount} pages d’augmentations groupées · Cybermain Gen.1+Gen.2 · FaceCaster unique · ${neuroCount} Neuroprogrammes.`);
}finally{
  await browser.close();
}
