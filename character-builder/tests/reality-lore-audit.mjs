import {chromium} from 'playwright-core';
import {writeFileSync} from 'node:fs';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(`pageerror: ${error.message}`));
page.on('console',message=>{
  const text=message.text();
  const optionalRemoteTruthFailure=text.startsWith('Chargement V5 Exilés/Extrals TypeError: Failed to fetch');
  if(message.type()==='error'&&!text.startsWith('Failed to load resource:')&&!optionalRemoteTruthFailure)errors.push(`console: ${text}`);
});
try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.TUCBuilderSeptFixes?.realityLoreAuditV1!==undefined,null,{timeout:30000});
  await page.waitForTimeout(500);
  if(errors.length)throw new Error(errors.join(' | '));
  const report=await page.evaluate(()=>window.TUCBuilderSeptFixes.realityLoreAuditV1(.60));
  writeFileSync('/tmp/reality-lore-audit.json',JSON.stringify(report,null,2),'utf8');
  console.log(`Reality lore audit — talents=${report.counts.talents}, equipment=${report.counts.equipment}, augmentations=${report.counts.augmentations}`);
  console.log(`Meta — talents=${report.counts.talentMeta}, equipment=${report.counts.equipmentMeta}, augmentations=${report.counts.augmentationMeta}`);
  console.log(`Pairs >=60% — talents=${report.counts.talentPairs}, equipment=${report.counts.equipmentPairs}, augmentations=${report.counts.augmentationPairs}`);
  console.log(`Reviewed equivalents — equipment=${report.counts.equipmentAllowedPairs||0}, augmentations=${report.counts.augmentationAllowedPairs||0}`);
  for(const [label,block] of [['Talent',report.talents],['Equipment',report.equipment],['Augmentation',report.augmentations]]){
    for(const row of block.meta.slice(0,8))console.log(`META ${label}: ${row.name} | ${row.group} | ${row.lore}`);
    for(const pair of block.pairs.slice(0,12))console.log(`PAIR ${label} ${(pair.score*100).toFixed(1)}%: ${pair.a.name} <> ${pair.b.name}`);
  }
  const metaCount=report.counts.talentMeta+report.counts.equipmentMeta+report.counts.augmentationMeta;
  const pairCount=report.counts.talentPairs+report.counts.equipmentPairs+report.counts.augmentationPairs;
  if(metaCount||pairCount)throw new Error(`Reality lore audit failed — ${metaCount} marqueur(s) méta, ${pairCount} paire(s) suspecte(s) >= 60%.`);
  console.log('Reality lore audit OK — aucun marqueur méta et aucune paire suspecte >= 60% hors équivalences revues.');
} finally {await context.close();await browser.close()}
