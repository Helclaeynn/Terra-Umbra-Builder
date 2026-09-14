import {chromium} from 'playwright-core';
import {writeFileSync} from 'node:fs';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1500,height:1100}});
const page=await context.newPage();
const browserErrors=[];
page.on('pageerror',error=>browserErrors.push(`pageerror: ${error.message}`));
page.on('console',message=>{
  const text=message.text();
  const optionalRemoteTruthFailure=text.startsWith('Chargement V5 Exilés/Extrals TypeError: Failed to fetch');
  if(message.type()==='error'&&!text.startsWith('Failed to load resource:')&&!optionalRemoteTruthFailure)browserErrors.push(`console: ${text}`);
});

const oneLine=value=>String(value||'').replace(/[\r\n]+/g,' ').replace(/%/g,'%25').slice(0,3800);
const annotation=(title,message)=>console.log(`::error title=${oneLine(title)}::${oneLine(message)}`);

try{
  await page.goto(`${base}character-builder/`,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.TUCBuilderSeptFixes?.truthLoreAuditV2!==undefined,null,{timeout:30000});
  await page.waitForTimeout(400);
  if(browserErrors.length)throw new Error(`Erreurs navigateur au chargement: ${browserErrors.join(' | ')}`);

  const report=await page.evaluate(()=>window.TUCBuilderSeptFixes.truthLoreAuditV2(.60));
  report.sourceDiagnostics=await page.evaluate(()=>{
    const out={keyCounts:{},stringFieldCounts:{},samples:[]};
    for(const [nature,rows] of Object.entries(truthCatalog||{})){
      if(!Array.isArray(rows))continue;
      for(const t of rows){
        for(const k of Object.keys(t||{}))out.keyCounts[k]=(out.keyCounts[k]||0)+1;
        for(const [k,v] of Object.entries(t||{}))if(typeof v==='string'&&v.trim())out.stringFieldCounts[k]=(out.stringFieldCounts[k]||0)+1;
        if(['parole fixée','serment écrit','convergence des savoirs','eaux nourricières'].includes(String(t?.name||'').toLowerCase()))out.samples.push({nature,...t});
      }
    }
    return out;
  });
  writeFileSync('/tmp/truth-lore-audit.json',JSON.stringify(report,null,2),'utf8');
  console.log(`Truth lore audit — ${report.counts.entries} entrées · ${report.counts.meta} méta · ${report.counts.semantic} incohérences de Divinité · ${report.counts.pairs} paires >= 60%.`);
  console.log(`Champs source Truth: ${JSON.stringify(report.sourceDiagnostics.stringFieldCounts)}`);

  for(const row of report.meta.slice(0,15))annotation(`Lore méta — ${row.name}`,`${row.nature} | ${row.group} | ${row.lore}`);
  for(const row of report.semantic.slice(0,25))annotation(`Divinité incohérente — ${row.name}`,`attendu=${row.expectedGod}; trouvé=${row.wrongGods.join(', ')} | ${row.group} | effet=${row.effect} | lore=${row.lore}`);

  const known=report.pairs.find(p=>{
    const names=[p.a.name,p.b.name].map(x=>x.toLowerCase());
    return names.includes('parole fixée')&&names.includes('serment écrit');
  });
  if(known)annotation(`Similarité connue ${(known.score*100).toFixed(1)}% — Parole fixée / Serment écrit`,`${known.a.group} | effet A=${known.a.effect} | lore A=${known.a.lore} || ${known.b.group} | effet B=${known.b.effect} | lore B=${known.b.lore}`);
  else annotation('Audit lore — paire témoin absente','Parole fixée ↔ Serment écrit n’a pas été détectée >= 60% : la métrique ou le corpus chargé doit être vérifié.');

  for(const pair of report.pairs.slice(0,40)){
    if(known&&pair.a.id===known.a.id&&pair.b.id===known.b.id)continue;
    annotation(`Similarité ${(pair.score*100).toFixed(1)}% — ${pair.a.name} / ${pair.b.name}`,`${pair.a.nature} | ${pair.a.group} | effet A=${pair.a.effect} | lore A=${pair.a.lore} || ${pair.b.nature} | ${pair.b.group} | effet B=${pair.b.effect} | lore B=${pair.b.lore}`);
  }

  if(report.counts.meta||report.counts.semantic||report.counts.pairs||!known){
    throw new Error(`Audit lore Vérité en échec: ${JSON.stringify(report.counts)}${known?'':' ; paire témoin Parole fixée/Serment écrit non détectée'}`);
  }
  console.log('Truth lore audit OK — aucun marqueur méta, aucune incohérence de Divinité et aucune paire >= 60%.');
} finally {
  await context.close();await browser.close();
}
