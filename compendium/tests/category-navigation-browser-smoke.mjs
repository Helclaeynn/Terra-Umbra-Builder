import fs from 'node:fs';
import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const navigation=JSON.parse(fs.readFileSync('compendium/data/navigation-v1.json','utf8'));
const categories=['Règles','Réalité','Équipement','Augmentations','Vérité','Catalogue Vérité','Organisations','Personnages','Bestiaire'];
const expectedByCategory=new Map(categories.map(category=>[
  category,
  navigation.entries.filter(entry=>entry.category===category).length,
]));
const expectedGroups=new Map(categories.map(category=>[
  category,
  new Set(navigation.entries.filter(entry=>entry.category===category).map(entry=>entry.group)).size,
]));
for(const [category,count] of expectedByCategory)if(!count)throw new Error(`${category}: aucune entrée dans navigation-v1.json`);

const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1500,height:1000}});
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().startsWith('Failed to load resource:'))errors.push(`console: ${msg.text()}`)});
page.on('response',response=>{if(response.status()>=400&&response.url().includes('/compendium/')&&!/favicon\.ico(?:\?|$)/i.test(response.url()))errors.push(`http ${response.status()}: ${response.url()}`)});

async function openCategory(category){
  const expectedCards=expectedByCategory.get(category),expectedGroupCount=expectedGroups.get(category);
  await page.goto(`${base}compendium/#/category/${encodeURIComponent(category)}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:20000});
  const cards=page.locator('.hierarchical-category-list .article-card');
  const count=await cards.count();
  if(count!==expectedCards)throw new Error(`${category}: ${count} cartes hiérarchiques, attendu ${expectedCards} selon navigation-v1.json`);
  const groupNodes=page.locator('.hierarchical-category-list > .nav-group');
  const groups=await groupNodes.count();
  if(groups!==expectedGroupCount)throw new Error(`${category}: ${groups} groupes, attendu ${expectedGroupCount} selon navigation-v1.json`);
  const renderedTitles=(await groupNodes.locator(':scope > .nav-group-title span').allTextContents()).map(value=>value.trim()).filter(Boolean);
  if(new Set(renderedTitles).size!==renderedTitles.length)throw new Error(`${category}: titre de groupe rendu plusieurs fois (${renderedTitles.join(' · ')})`);
  const href=await cards.first().getAttribute('href');
  if(!href?.startsWith('#/article/'))throw new Error(`${category}: première carte non cliquable (${href})`);
  const visibleText=(await cards.first().innerText()).trim();
  if(!visibleText)throw new Error(`${category}: première carte vide`);
  return {count,groups,href};
}

try{
  const results=new Map();
  for(const category of categories)results.set(category,await openCategory(category));

  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Règles')}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:20000});
  const first=page.locator('.hierarchical-category-list .article-card').first();
  await first.click();
  await page.waitForFunction(()=>location.hash.startsWith('#/article/'),null,{timeout:10000});
  await page.waitForSelector('#main .page-head h1',{timeout:10000});
  if((await page.locator('#main .page-head h1').innerText()).trim()==='Règles')throw new Error('Règles: le clic n’a pas ouvert l’article');

  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Équipement')}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:20000});
  const filter=page.locator('#categoryFilter');
  await filter.fill('couteau');await page.waitForTimeout(120);
  const filtered=await page.locator('.hierarchical-category-list .article-card:visible').count();
  if(filtered<1||filtered>=results.get('Équipement').count)throw new Error(`Équipement: filtre couteau incohérent (${filtered})`);

  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Organisations')}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:20000});
  const orgFilter=page.locator('#categoryFilter');
  await orgFilter.fill('corporation');await page.waitForTimeout(120);
  const orgFiltered=await page.locator('.hierarchical-category-list .article-card:visible').count();
  if(orgFiltered<1||orgFiltered>=results.get('Organisations').count)throw new Error(`Organisations: filtre corporation incohérent (${orgFiltered})`);

  await page.goto(`${base}compendium/#/category/${encodeURIComponent('Personnages')}`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.hierarchical-category-list .article-card',{timeout:20000});
  const pnjFilter=page.locator('#categoryFilter');
  await pnjFilter.fill('Alessandra');await page.waitForTimeout(120);
  const pnjFiltered=await page.locator('.hierarchical-category-list .article-card:visible').count();
  if(pnjFiltered<1||pnjFiltered>=results.get('Personnages').count)throw new Error(`Personnages: filtre Alessandra incohérent (${pnjFiltered})`);

  if(errors.length)throw new Error(`Erreurs navigateur:\n${errors.join('\n')}`);
  console.log(`CATEGORY NAV BROWSER OK — ${categories.map(category=>`${category} ${results.get(category).count}/${results.get(category).groups} groupes`).join(' · ')} · groupes uniques + clic article + filtres validés.`);
}finally{
  await browser.close();
}
