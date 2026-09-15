import fs from 'node:fs';
import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const navigation=JSON.parse(fs.readFileSync('compendium/data/navigation-v1.json','utf8'));
const expectedByCategory=new Map(['Règles','Réalité','Vérité'].map(category=>[
  category,
  navigation.entries.filter(entry=>entry.category===category).length,
]));
for(const [category,count] of expectedByCategory)if(!count)throw new Error(`${category}: aucune entrée dans navigation-v1.json`);

const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1500,height:1000}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:'))errors.push(`console: ${msg.text()}`)});
page.on('response',response=>{if(response.status()>=400&&response.url().includes('/compendium/')&&!/favicon\.ico(?:\?|$)/i.test(response.url()))errors.push(`http ${response.status()}: ${response.url()}`)});

async function openCategory(category,minGroups){
  const expectedCards=expectedByCategory.get(category);
  await page.goto(`${base}compendium/#/category/${encodeURIComponent(category)}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:20000});
  const cards=page.locator('.hierarchical-category-list .article-card');
  const count=await cards.count();
  if(count!==expectedCards)throw new Error(`${category}: ${count} cartes hiérarchiques, attendu ${expectedCards} selon navigation-v1.json`);
  const groups=await page.locator('.hierarchical-category-list > .nav-group').count();
  if(groups<minGroups)throw new Error(`${category}: ${groups} groupes, minimum ${minGroups}`);
  const href=await cards.first().getAttribute('href');
  if(!href?.startsWith('#/article/'))throw new Error(`${category}: première carte non cliquable (${href})`);
  const visibleText=(await cards.first().innerText()).trim();
  if(!visibleText)throw new Error(`${category}: première carte vide`);
  return {count,groups,href};
}

try{
  const rules=await openCategory('Règles',9);
  const first=page.locator('.hierarchical-category-list .article-card').first();
  await first.click();
  await page.waitForFunction(()=>location.hash.startsWith('#/article/'),null,{timeout:10000});
  await page.waitForSelector('#main .page-head h1',{timeout:10000});
  if((await page.locator('#main .page-head h1').innerText()).trim()==='Règles')throw new Error('Règles: le clic n’a pas ouvert l’article');

  const reality=await openCategory('Réalité',5);
  const filter=page.locator('#categoryFilter');
  await filter.fill('Neurodive');await page.waitForTimeout(120);
  const filtered=await page.locator('.hierarchical-category-list .article-card:visible').count();
  if(filtered<1||filtered>=reality.count)throw new Error(`Réalité: filtre Neurodive incohérent (${filtered})`);

  const truth=await openCategory('Vérité',7);
  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log(`CATEGORY NAV BROWSER OK — Règles ${rules.count}/${rules.groups} groupes · Réalité ${reality.count}/${reality.groups} groupes · Vérité ${truth.count}/${truth.groups} groupes · clic article + filtre validés.`);
}finally{
  await browser.close();
}
