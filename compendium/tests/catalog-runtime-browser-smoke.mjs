import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
const oldRealityFiller=[
  /dans les vitrines, ateliers et réseaux spécialisés/i,
  /il est surtout recherché par/i,
  /sa présence dit autant du niveau de risque/i,
  /du milieu dans lequel son porteur évolue/i,
  /l’investissement devient suffisamment important pour être réfléchi/i
];
page.on('request',request=>{
  try{
    const url=new URL(request.url());
    if(url.hostname==='cdn.jsdelivr.net')errors.push(`asset CDN interdit: ${request.url()}`);
  }catch{}
});
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{
  if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:'))errors.push(`console: ${msg.text()}`);
});
page.on('response',response=>{
  if(response.status()<400)return;
  const url=response.url();
  if(url.includes('/compendium/')&&!/favicon\.ico(?:\?|$)/i.test(url))errors.push(`http ${response.status()}: ${url}`);
});

async function gotoCategory(category){
  await page.goto(`${base}compendium/#/category/${encodeURIComponent(category)}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.article-card',{timeout:20000});
}
function visibleCards(){return page.locator('.article-card:visible');}
async function filterCategory(text){
  const input=page.locator('#categoryFilter');
  await input.fill(text);
  await page.waitForTimeout(100);
}
async function assertArticleBasics(label){
  await page.waitForSelector('#main .article-media img',{timeout:10000});
  const media=page.locator('#main .article-media img');
  if(await media.count()!==1)throw new Error(`${label}: emplacement d’illustration principal non rendu`);
  const context=page.locator('#main section#contexte .body-p.lore');
  await context.first().waitFor({state:'visible',timeout:10000});
  if(await context.count()<2)throw new Error(`${label}: deux paragraphes de lore communs non rendus`);
}

try{
  await gotoCategory('Augmentations');
  const augmentationCount=await visibleCards().count();
  if(!augmentationCount||augmentationCount>=146)throw new Error(`Augmentations: ${augmentationCount} pages visibles pour 146 variantes runtime`);
  await filterCategory('Cybermain');
  const cyberCards=visibleCards();
  if(await cyberCards.count()!==1)throw new Error(`Cybermain: ${await cyberCards.count()} cartes visibles, attendu 1`);
  await cyberCards.first().click();
  await assertArticleBasics('Cybermain');
  const headings=(await page.locator('#main .section h2').allTextContents()).map(text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase());
  if(!headings.some(text=>text.includes('generation 1'))||!headings.some(text=>text.includes('generation 2')))throw new Error('Cybermain: Gen.1 et Gen.2 ne sont pas rendues sur la même page');
  const generationSections=page.locator('#main .section').filter({has:page.locator('h2')});
  let generationLoreSeen=0;
  let tablesSeen=0;
  let illustrationSlotsSeen=0;
  for(let i=0;i<await generationSections.count();i++){
    const section=generationSections.nth(i);
    const heading=(await section.locator('h2').textContent()||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(!heading.includes('generation '))continue;
    if(await section.locator('.body-p.lore').count()<1)throw new Error(`Cybermain / ${heading}: lore spécifique non rendu`);
    if(await section.locator('.doc-table').count()<1)throw new Error(`Cybermain / ${heading}: tableau mécanique non rendu`);
    const illustration=section.locator('.body-p.callout').filter({hasText:'Illustration à venir'});
    if(await illustration.count()<1)throw new Error(`Cybermain / ${heading}: emplacement d’illustration de génération non rendu`);
    generationLoreSeen++;
    tablesSeen++;
    illustrationSlotsSeen++;
  }
  if(generationLoreSeen<2||tablesSeen<2||illustrationSlotsSeen<2)throw new Error('Cybermain: sections génération incomplètes');

  await gotoCategory('Équipement');
  await filterCategory('FaceCaster DFL');
  const faceCards=visibleCards();
  if(await faceCards.count()!==1)throw new Error(`FaceCaster DFL: ${await faceCards.count()} cartes visibles, attendu 1`);
  await faceCards.first().click();
  await assertArticleBasics('FaceCaster DFL');
  if(await page.locator('#main .doc-table').count()<1)throw new Error('FaceCaster DFL: tableau mécanique non rendu');

  await gotoCategory('Équipement');
  await filterCategory('Bastion');
  const bastionCards=visibleCards();
  if(await bastionCards.count()!==1)throw new Error(`Bastion: ${await bastionCards.count()} cartes visibles, attendu 1`);
  await bastionCards.first().click();
  await assertArticleBasics('Bastion');
  if(await page.locator('#main .doc-table').count()<1)throw new Error('Bastion: tableau mécanique non rendu');
  const bastionText=(await page.locator('#main section#contexte .body-p.lore').allTextContents()).join(' ');
  for(const re of oldRealityFiller)if(re.test(bastionText))throw new Error(`Bastion: ancien remplissage générique encore rendu (${re})`);
  if(bastionText.length<100)throw new Error(`Bastion: contexte trop pauvre (${bastionText.length} caractères)`);

  await gotoCategory('Équipement');
  await filterCategory('Neuroprogramme');
  const neuroCards=visibleCards();
  const neuroCount=await neuroCards.count();
  if(neuroCount!==27)throw new Error(`Neuroprogrammes: ${neuroCount} cartes visibles, attendu 27`);
  await neuroCards.first().click();
  await assertArticleBasics('Neuroprogramme');
  if(await page.locator('#main .doc-table').count()<1)throw new Error('Neuroprogramme: tableau mécanique non rendu');

  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log(`Browser smoke OK — ${augmentationCount} pages d’augmentations groupées · Cybermain Gen.1+Gen.2 · FaceCaster unique · Bastion sans remplissage générique · ${neuroCount} Neuroprogrammes · aucun asset jsDelivr.`);
}finally{
  await browser.close();
}
