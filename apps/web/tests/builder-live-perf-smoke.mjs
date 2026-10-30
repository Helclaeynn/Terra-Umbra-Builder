import { chromium } from "playwright-core";

const baseUrl=process.env.TUC_V2_SMOKE_BASE_URL||"https://dev.terra-umbra.fr";
const token=process.env.TUC_SESSION_TOKEN||"";
const characterId=process.env.TUC_CHARACTER_ID||"";
const executablePath=process.env.CHROME_BIN||"";

if(!token)throw new Error("TUC_SESSION_TOKEN manquant");
if(!characterId)throw new Error("TUC_CHARACTER_ID manquant");
if(!executablePath)throw new Error("CHROME_BIN manquant");

const browser=await chromium.launch({
  executablePath,
  headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage"]
});

try{
  const context=await browser.newContext();
  const host=new URL(baseUrl).hostname;
  await context.addCookies([{
    name:"__Host-tuc_session",
    value:token,
    domain:host,
    path:"/",
    secure:true,
    httpOnly:true,
    sameSite:"Lax"
  }]);

  const page=await context.newPage();
  const truthResponse=page.waitForResponse(
    response=>response.url().includes("/api/rulesets/terra-umbra/truth")&&response.ok(),
    {timeout:30000}
  );
  const realityResponse=page.waitForResponse(
    response=>response.url().includes("/api/rulesets/terra-umbra/reality")&&response.ok(),
    {timeout:30000}
  );

  const started=performance.now();
  await page.goto(
    `${baseUrl}/characters/${encodeURIComponent(characterId)}/builder`,
    {waitUntil:"domcontentloaded",timeout:30000}
  );
  await page.locator(".builder-workspace").waitFor({state:"visible",timeout:30000});
  await page.getByRole("heading",{name:"Concept et identité",exact:true}).waitFor({state:"visible",timeout:10000});
  const workspaceMs=Math.round(performance.now()-started);

  await Promise.all([truthResponse,realityResponse]);
  const catalogsMs=Math.round(performance.now()-started);

  const resources=await page.evaluate(()=>performance.getEntriesByType("resource")
    .filter(entry=>entry.name.includes("/api/rulesets/terra-umbra/"))
    .map(entry=>({
      name:entry.name.split("/api/")[1],
      duration:Math.round(entry.duration),
      transferSize:"transferSize" in entry?entry.transferSize:0
    })));

  console.log(
    `BUILDER PERF — fiche visible ${workspaceMs} ms · catalogues avancés ${catalogsMs} ms`
  );
  for(const resource of resources){
    console.log(
      `BUILDER RESOURCE — ${resource.name} · ${resource.duration} ms · ${resource.transferSize} octets transférés`
    );
  }

  // Compare a second visit in the same authenticated browser: static catalogues
  // can reuse the HTTP cache, while the character is still fetched from the server.
  const warmStart=performance.now();
  await page.goto(`${baseUrl}/characters/${encodeURIComponent(characterId)}/progression`,{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByRole("heading",{name:"Progression de campagne",exact:true}).waitFor({state:"visible",timeout:30000});
  const warmMs=Math.round(performance.now()-warmStart);
  const warmResources=await page.evaluate(()=>performance.getEntriesByType("resource")
    .filter(entry=>entry.name.includes("/api/rulesets/terra-umbra/"))
    .map(entry=>({name:entry.name.split("/api/")[1],duration:Math.round(entry.duration),transferSize:entry.transferSize})));
  console.log(`BUILDER WARM PERF — progression prête ${warmMs} ms · ${warmResources.filter(r=>r.transferSize===0).length}/${warmResources.length} catalogues sans retransfert réseau`);
  for(const resource of warmResources)console.log(`BUILDER WARM RESOURCE — ${resource.name} · ${resource.duration} ms · ${resource.transferSize} octets transférés`);

  // Measure actual account navigation and mobile consultation with a disposable account.
  const accountStarted=performance.now();
  await page.goto(`${baseUrl}/account`,{waitUntil:"domcontentloaded"});
  const sheetLink=page.locator(`a[href="/characters/${characterId}/sheet"]`);
  await sheetLink.waitFor({state:"visible",timeout:30000});
  const accountMs=Math.round(performance.now()-accountStarted);
  const listPayload=await page.request.get(`${baseUrl}/api/characters?summary=1`);
  const list=await listPayload.json();
  if(list.characters.some(character=>Object.hasOwn(character,"data")))throw new Error("Compact list still transfers character data");
  await page.setViewportSize({width:390,height:844});
  const sheetStarted=performance.now();
  await sheetLink.click();
  await page.locator('.character-sheet[data-mode="campaign"]').waitFor({state:"visible"});
  const sheetMs=Math.round(performance.now()-sheetStarted);
  if(await page.locator('.builder-sidebar,.progression-step').count())throw new Error("Standalone sheet mounts editing UI");
  if(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1))throw new Error("Mobile sheet overflows");
  const accountLink=page.getByRole('link',{name:'Mon espace',exact:true});
  await accountLink.click();
  const logout=page.getByRole('button',{name:'Déconnexion',exact:true});
  await logout.waitFor();
  const logoutStarted=performance.now();
  await logout.click();
  await logout.waitFor({state:'detached'});
  const logoutMs=Math.round(performance.now()-logoutStarted);
  if((await page.request.get(`${baseUrl}/api/auth/me`)).status()!==401)throw new Error("Logout session still valid");
  console.log(`ACCOUNT PERF — session restored and sheets ready ${accountMs} ms · account link to mobile sheet ${sheetMs} ms · confirmed logout ${logoutMs} ms · compact list ${Buffer.byteLength(JSON.stringify(list))} bytes`);
  await context.close();
}finally{
  await browser.close();
}
