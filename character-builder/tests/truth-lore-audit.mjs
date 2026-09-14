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
  await page.waitForFunction(()=>window.TUCBuilderSeptFixes?.truthLoreAuditV2!==undefined&&window.TUCBuilderSeptFixes?.truthLoreSourceDiagnostics!==undefined,null,{timeout:30000});
  await page.waitForTimeout(400);
  if(browserErrors.length)throw new Error(`Erreurs navigateur au chargement: ${browserErrors.join(' | ')}`);

  const report=await page.evaluate(()=>window.TUCBuilderSeptFixes.truthLoreAuditV2(.60));
  const entries=await page.evaluate(()=>window.TUCBuilderSeptFixes.truthLoreEntries());
  report.sourceDiagnostics=await page.evaluate(()=>window.TUCBuilderSeptFixes.truthLoreSourceDiagnostics());
  writeFileSync('/tmp/truth-lore-audit.json',JSON.stringify(report,null,2),'utf8');
  console.log(`Truth lore audit — ${report.counts.entries} entrées · ${report.counts.meta} méta · ${report.counts.semantic} incohérences de Divinité · ${report.counts.pairs} paires >= 60% · ${report.counts.allowedPairs||0} équivalences canoniques autorisées.`);
  console.log(`Champs source Truth: ${JSON.stringify(report.sourceDiagnostics.stringFieldCounts)}`);

  for(const row of report.meta.slice(0,15))annotation(`Lore méta — ${row.name}`,`${row.nature} | ${row.group} | ${row.lore}`);
  for(const row of report.semantic.slice(0,25))annotation(`Divinité incohérente — ${row.name}`,`attendu=${row.expectedGod}; trouvé=${row.wrongGods.join(', ')} | ${row.group} | effet=${row.effect} | lore=${row.lore}`);

  const parole=entries.find(x=>x.nature==='daemon'&&x.name==='Parole fixée');
  const serment=entries.find(x=>x.nature==='daemon'&&x.name==='Serment écrit');
  if(!parole||!serment)annotation('Régression Astaroth','Parole fixée ou Serment écrit est absent du corpus final.');
  const badAstarothPair=report.pairs.find(p=>{
    const names=[p.a.name,p.b.name].map(x=>x.toLowerCase());
    return names.includes('parole fixée')&&names.includes('serment écrit');
  });
  if(badAstarothPair)annotation(`Régression Astaroth ${(badAstarothPair.score*100).toFixed(1)}%`,`Parole fixée et Serment écrit sont redevenus trop similaires.`);
  if(/mammon/i.test(`${parole?.lore||''} ${serment?.lore||''}`))annotation('Régression Astaroth / Mammon','Le lore final de Parole fixée ou Serment écrit mentionne encore Mammon.');
  if(parole&&serment&&!badAstarothPair&&!/mammon/i.test(`${parole.lore} ${serment.lore}`))console.log('Régression Astaroth OK — Parole fixée / Serment écrit distincts et sans Mammon.');

  for(const pair of report.pairs.slice(0,40))annotation(`Similarité ${(pair.score*100).toFixed(1)}% — ${pair.a.name} / ${pair.b.name}`,`${pair.a.nature} | ${pair.a.group} | effet A=${pair.a.effect} | lore A=${pair.a.lore} || ${pair.b.nature} | ${pair.b.group} | effet B=${pair.b.effect} | lore B=${pair.b.lore}`);

  const astarothRegression=!parole||!serment||Boolean(badAstarothPair)||/mammon/i.test(`${parole?.lore||''} ${serment?.lore||''}`);
  if(report.counts.meta||report.counts.semantic||report.counts.pairs||astarothRegression)throw new Error(`Audit lore Vérité en échec: ${JSON.stringify(report.counts)}${astarothRegression?' ; régression Astaroth':''}`);
  console.log('Truth lore audit OK — aucun marqueur méta, aucune incohérence de Divinité et aucune paire suspecte >= 60%.');
} finally {
  await context.close();await browser.close();
}
