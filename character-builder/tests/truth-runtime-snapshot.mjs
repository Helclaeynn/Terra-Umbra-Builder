import { chromium } from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
const page=await context.newPage();

try {
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(
    ()=>window.__TUC_APP_READY__===true&&window.__TUC_LATE_STATE_READY__===true&&window.TUCBuilderSeptFixes?.truthLoreMetaProblems!==undefined,
    null,
    {timeout:30000}
  );

  await page.waitForFunction(()=>window.TUCTruthRuntimeAudit?.snapshot!==undefined,null,{timeout:30000});
  const snapshot=await page.evaluate(()=>window.TUCTruthRuntimeAudit.snapshot());

  const summary={
    natures:Object.keys(snapshot.structures),
    structureVariants:Object.fromEntries(Object.entries(snapshot.structures).map(([id,n])=>[id,n.variants.length])),
    catalogCounts:Object.fromEntries(Object.entries(snapshot.catalogs).map(([id,rows])=>[id,rows.length])),
    consciousness:snapshot.consciousness,
    ptvInitial:snapshot.ptvInitial
  };

  console.log('TRUTH_RUNTIME_AUDIT_SUMMARY '+JSON.stringify(summary));
  console.log('TRUTH_RUNTIME_SNAPSHOT_BEGIN'+JSON.stringify(snapshot)+'TRUTH_RUNTIME_SNAPSHOT_END');
} finally {
  await context.close();
  await browser.close();
}
