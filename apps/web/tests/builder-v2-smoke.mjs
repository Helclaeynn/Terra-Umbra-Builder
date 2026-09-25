import { chromium } from "playwright-core";

const baseUrl=process.env.TUC_V2_SMOKE_BASE_URL||"http://127.0.0.1:4173";
const executablePath=process.env.CHROME_BIN;
if(!executablePath)throw new Error("CHROME_BIN manquant.");

const characterId="11111111-1111-4111-8111-111111111111";
let savedPayload=null;
let sheetOwner=true;
let readerGrant=null;
const readerId="33333333-3333-4333-8333-333333333333";

const skillIds=[
  ["constitution","Constitution","vigueur"],
  ["athletisme","Athlétisme","agilite"],
  ["esquive","Esquive","agilite"],
  ["force_mentale","Force mentale","volonte"],
  ["humanite","Humanité","volonte"],
  ["melee","Mêlée","vigueur"],
  ["pugilat","Pugilat","vigueur"],
  ["tir","Tir","agilite"],
  ["neurodive","Neurodive","volonte"],
  ["langages_argot","Langages & Argot","esprit"]
];

const characterData={
  schemaVersion:2,
  rulesetId:"terra-umbra",
  identity:{
    name:"Smoke",firstName:"V2",alias:"",occupation:"Test",age:"31",sex:"",
    height:"",weight:"",concept:"Test des douze blocs",objective:"",notes:"",
    portraitDataUrl:"",portraitName:""
  },
  creation:{origin:"citadin",sphere:"crawler",style:"smoke_style"},
  attributes:{vigueur:3,agilite:3,esprit:3,volonte:3,charisme:3},
  skills:Object.fromEntries(skillIds.map(([id])=>[id,{style:0,free:0,edge:0}])),
  talents:{origin:"origin_smoke",sphere:"sphere_smoke",expertise:"expertise_smoke",common:"common_smoke",edge:[]},
  talentChoices:{},
  disadvantages:[],
  edge:{attributePack:0,skillPacks:0,talentPacks:0,cashPacks:0,lifestylePack:0,augmentationPacks:0,renownPack:0},
  edgeAttributes:{},
  truth:{
    nature:"humain",consciousness:"initie",choices:{hunterTradition:"aucune"},truthTalents:[],
    truthEquipment:[],truthEquipmentMjOverride:false,
    corruptionMjAuthorized:false,corruption:0,corruptionSource:"",corruptionTalents:[]
  },
  equipment:[],
  social:{languages:["Anglais"],contacts:["Contact Smoke"],reputation:""},
  spending:{augmentations:0,equipment:0,vehicle:0},
  reality:{
    augmentations:[],equipment:[],fixedChargeItems:[],
    mjAdvancedOverride:false,mjAccessOverride:false,
    sphereSupportType:"",sphereSupportItemId:""
  },
  progression:{},
  meta:{}
};

const rules={
  id:"terra-umbra",
  name:"Terra Umbra California",
  sourceVersion:"smoke",
  attributes:[
    {id:"vigueur",name:"Vigueur"},{id:"agilite",name:"Agilité"},{id:"esprit",name:"Esprit"},
    {id:"volonte",name:"Volonté"},{id:"charisme",name:"Charisme"}
  ],
  skills:skillIds.map(([id,name,attribute])=>({id,name,attribute})),
  creation:{
    attributes:{baseTotal:15,min:1,max:5,edgePackPoints:2,edgePackMax:1},
    skills:{sphereFixedPoints:5,stylePoints:5,stylePerSkillMax:2,freePoints:0,rawMax:5,edgePackPoints:4,edgePackMax:1}
  },
  origins:{citadin:{name:"Citadin"}},
  spheres:{
    crawler:{name:"Crawler",originId:"citadin",support:"Un Contact fiable",fixedSkills:[]},
    corporatiste:{name:"Corporatiste",originId:"citadin",support:"Avantage contractuel",fixedSkills:[]}
  },
  styles:[
    {
      id:"smoke_style",sphere:"crawler",name:"Smoke Style",skills:[],
      expertiseFamilies:["vigueur","agilite"],lifestyle:"Standard",account:10000,
      augmentationEnvelope:5000,gen2SlotsBase:1,vehicleCapital:0
    },
    {
      id:"smoke_style_alt",sphere:"crawler",name:"Smoke Style Alt",skills:[],
      expertiseFamilies:["esprit","volonte"],lifestyle:"Confortable",account:12000,
      augmentationEnvelope:8000,gen2SlotsBase:1,vehicleCapital:0
    },
    {
      id:"corp_smoke",sphere:"corporatiste",name:"Corpo Smoke",skills:[],
      expertiseFamilies:["esprit","charisme"],lifestyle:"Confortable",account:10000,
      augmentationEnvelope:5000,gen2SlotsBase:1,vehicleCapital:0
    }
  ],
  talents:{
    origin:{citadin:[{id:"origin_smoke",name:"Acquis urbain",effect:"+1 test",category:"origin"}]},
    sphere:{
      crawler:[{id:"sphere_smoke",name:"Réseau Crawler",effect:"Contact",category:"sphere",sphere:"crawler"}],
      corporatiste:[{id:"sphere_corp_smoke",name:"Dotation smoke",effect:"Support",category:"sphere",sphere:"corporatiste"}]
    },
    common:[{id:"common_smoke",name:"Brave",compendiumId:"wiki-brave",effect:"Test commun",category:"common"},
      {id:"zulu_smoke",name:"Zèle Smoke",effect:"Effet Zèle",category:"common",compendiumId:"removed-zulu"},
      {id:"aube_smoke",name:"Aube Smoke",effect:"Effet Aube",category:"common",compendiumId:"removed-aube"}],
    expertise:[{id:"expertise_smoke",name:"Athlète",effect:"+1 Athlétisme",category:"expertise",attribute:"vigueur"}]
  }
};

const lore={
  origin:{citadin:"Lore origine"},
  originTalent:{origin_smoke:"Lore talent origine"},
  sphere:{crawler:"Lore sphère",corporatiste:"Lore corporatiste"},
  style:{smoke_style:"Lore style",smoke_style_alt:"Lore style alternatif",corp_smoke:"Lore corpo"},
  skill:Object.fromEntries(skillIds.map(([id,name])=>[id,"Lore "+name])),
  attribute:{vigueur:"",agilite:"",esprit:"",volonte:"",charisme:""},
  talent:{common_smoke:"Lore commun",expertise_smoke:"Lore expertise"},
  sphereTalent:{sphere_smoke:"Lore sphère talent",sphere_corp_smoke:"Lore corpo talent"}
};

const edgeKeys=["attributePack","skillPacks","talentPacks","cashPacks","lifestylePack","augmentationPacks","renownPack"];
const edgeRules={
  base:5,maxHeld:10,
  options:Object.fromEntries(edgeKeys.map(key=>[key,{max:1,points:key==="attributePack"?2:key==="skillPacks"?4:undefined,amount:5000,steps:1,gen2Windows:1}])),
  lore:Object.fromEntries(edgeKeys.map(key=>[key,{lore:"Lore "+key,mechanic:"Mécanique "+key}]))
};

const truthRules={
  structure:{
    ptvInitial:5,
    consciousness:[{id:"profane",name:"Profane"},{id:"initie",name:"Initié"}],
    natures:{
      humain:{
        id:"humain",name:"Humain",description:"Humain de California",
        choices:[{
          key:"hunterTradition",label:"Tradition de Chasse",optional:true,
          options:[{id:"aucune",name:"Aucune"}]
        }],
        baseFreeTraits:[{name:"Mémoire humaine",access:"V/SR/R",effect:"Trait gratuit smoke"}],
        freeTraitRules:[]
      }
    }
  },
  catalogs:{humain:[
    {id:"truth-expensive",name:"Aube supérieure",group:"Groupe Smoke",cost:3,effect:"Effet supérieur",when:{hunterTradition:"aucune"},runtimeLore:"Lore supérieur"},
    {id:"truth-zulu",name:"Zèle occulte",group:"Groupe Smoke",cost:1,effect:"Effet Zèle occulte",when:{hunterTradition:"aucune"},runtimeLore:"Lore Zèle occulte"},
    {id:"truth-aube",name:"Aube occulte",group:"Groupe Smoke",cost:1,effect:"Effet Aube occulte",when:{hunterTradition:"aucune"},runtimeLore:"Lore Aube occulte"}
  ]},
  equipment:[
    {
      id:"truth-ref-smoke",name:"Propriété Smoke",chapter:"22",section:"Propriétés communes",
      status:"reference",sourceKind:"property",tags:[],lore:"Règle commune de référence.",
      properties:[{label:"Règle",value:"Référence uniquement"}],
      compendiumId:"wiki-truth-ref-smoke",referenceOnly:true,requiresMj:false
    },
    {
      id:"truth-hunt-smoke",name:"Arme de Chasse Smoke",chapter:"23",section:"Équipement de Chasse",
      status:"catalogue",sourceKind:"equipment",tags:[],lore:"Matériel réservé à une vraie tradition de Chasse.",
      properties:[{label:"Profil",value:"DGT smoke"}],
      compendiumId:"wiki-truth-hunt-smoke",referenceOnly:false,requiresMj:false
    },
    {
      id:"truth-exile-smoke",name:"Objet d’Aèr Smoke",chapter:"24",section:"Marché des Exilés",
      status:"catalogue",sourceKind:"equipment",tags:[],lore:"Matériel des réseaux d’Aèr.",
      properties:[{label:"Accès",value:"Exilé"}],
      compendiumId:"wiki-truth-exile-smoke",referenceOnly:false,requiresMj:false
    },
    {
      id:"truth-corrupt-smoke",name:"Relique corrompue Smoke",chapter:"27",section:"Calamitechnologie",
      status:"hors_catalogue",sourceKind:"artifact",tags:[],lore:"Objet corrompu exceptionnel.",
      properties:[{label:"Souillure",value:"MJ"}],
      compendiumId:"wiki-truth-corrupt-smoke",referenceOnly:false,requiresMj:true
    }
  ],
  corruption:{
    sources:[{id:"vhodhal",name:"Vhodhal",corruption:"Faim",principle:"Dévoration",compendiumId:"wiki-vhodhal-smoke"}],
    precedence:["vhodhal"],
    talents:[
      {id:"don-smoke",name:"Don de Faim Smoke",cost:2,kind:"DON",depth:"Marqué",sourceId:"vhodhal",sourceName:"Vhodhal",family:"Test",access:"",prerequisiteName:"",effect:"Le porteur ressent la faim.",group:"Test"},
      {id:"rite-smoke",name:"Rite Smoke",cost:1,kind:"RITE",depth:"",sourceId:"vhodhal",sourceName:"Vhodhal",family:"Test",access:"",prerequisiteName:"",effect:"Ce rite laisse une trace.",group:"Test"}
    ]
  },
  visibility:{needles:{humain:{}},sharedHunterNatures:[]},
  revelation:{
    stages:{v:{code:"V",name:"Voilé"},sr:{code:"SR",name:"Semi-Révélé"},r:{code:"R",name:"Révélé"}},
    rules:{revealedReplacesSemiRevealed:true,vigorPvMultiplier:2,vigorShapeChangeDoesNotHeal:true},
    bodies:{
      humain:{
        v:"Le personnage reste humain sous le Voile.",
        sr:"Aucune seconde physiologie humaine.",
        r:"Aucun corps Révélé humain distinct."
      }
    },
    daemonStats:{},angelusStats:{},aserynStats:{},exileStats:{},extralStats:{},khinaeBase:{},khinaeVariant:{}
  }
};

const equipmentItem={
  id:"eq-smoke",compendiumId:"wiki-kit-smoke",kind:"equipment",name:"Kit Smoke",category:"Matériel",sourceCategory:"Matériel",
  price:100,priceMin:100,priceMax:100,priceLabel:"100 $",generation:null,charge:null,stress:null,slots:null,
  effect:"Équipement de test.",lore:"Un kit destiné au smoke.",data:{},vehicle:false,neuro:false,
  recurring:"durable_purchase",monthlyCost:0,families:[]
};
const housingItem={
  id:"housing-smoke",kind:"equipment",name:"Appartement Smoke",category:"Logement",sourceCategory:"Logement",
  price:1200,priceMin:1200,priceMax:1200,priceLabel:"1 200 $/mois",generation:null,charge:null,stress:null,slots:null,
  effect:"Logement de test.",lore:"Appartement smoke.",data:{},vehicle:false,neuro:false,
  recurring:"monthly",monthlyCost:1200,families:[]
};
const vehicleItem={
  id:"vehicle-smoke",kind:"equipment",name:"CityPod Smoke",category:"Véhicules",sourceCategory:"Véhicules",
  price:6000,priceMin:6000,priceMax:6000,priceLabel:"6 000 $",generation:null,charge:null,stress:null,slots:null,
  effect:"Véhicule de test.",lore:"Véhicule smoke.",data:{"Entretien/mois":200},vehicle:true,neuro:false,
  recurring:"durable_purchase",monthlyCost:0,families:[]
};
const augmentationItem={
  id:"aug-smoke",kind:"augmentation",name:"Cyberœil Smoke",category:"Optique",sourceCategory:"Optique",
  price:500,priceMin:500,priceMax:500,priceLabel:"500 $",generation:1,charge:1,stress:1,slots:null,
  effect:"Augmentation de test.",lore:"Un cyberœil destiné au smoke.",data:{Type:"Support"},
  vehicle:false,neuro:false,recurring:"durable_purchase",monthlyCost:0,families:["optical"]
};
const realityRules={
  source:{equipment:"smoke",version:"1",mergedLoreFiles:1},
  economy:{
    advancedPurchaseThreshold:20000,unusedEnvelopeRefundRate:.5,
    styleAugAccess:{
      smoke_style:{text:"Accès smoke",gen1:["all"],gen2:["all"],bio:["all"],bioCap:20000},
      smoke_style_alt:{text:"Accès smoke alt",gen1:["all"],gen2:["all"],bio:["all"],bioCap:20000},
      corp_smoke:{text:"Accès corpo",gen1:["all"],gen2:["all"],bio:["all"],bioCap:20000}
    },
    lifestyle:{
      order:["Survie","Modeste","Standard","Confortable","Aisé","Luxe"],
      monthlyReference:{Survie:200,Modeste:400,Standard:650,Confortable:1200,"Aisé":2500,Luxe:5000},
      lore:{Survie:"",Modeste:"",Standard:"Vie standard smoke.",Confortable:"","Aisé":"",Luxe:""}
    }
  },
  equipment:[equipmentItem,vehicleItem],
  augmentations:[augmentationItem],
  recurring:[housingItem],
  counts:{equipment:2,augmentations:1,recurring:1,monthly:1,annual:0,vehicles:1,neuroprograms:0}
};

const browser=await chromium.launch({headless:true,executablePath,args:["--no-sandbox"]});
const page=await browser.newPage();
const browserErrors=[];
const failedRequests=[];
let journalEntries=[];
page.on("pageerror",error=>browserErrors.push("pageerror: "+String(error)));
page.on("console",message=>{
  if(message.type()==="error")browserErrors.push("console: "+message.text());
});
page.on("requestfailed",request=>failedRequests.push(request.method()+" "+request.url()+" · "+String(request.failure()?.errorText||"")));

await page.route("**/api/**",async route=>{
  const request=route.request();
  const url=new URL(request.url());
  const method=request.method();

  if(url.pathname===`/api/characters/${characterId}/sheet`){
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
      character:{id:characterId,name:savedPayload?.name||"V2 Smoke",data:savedPayload?.data||characterData,version:9,createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString()},
      canEdit:sheetOwner,ownerName:"Joueur Smoke"
    })});
  }
  if(url.pathname===`/api/characters/${characterId}/reader-search`){
    const q=url.searchParams.get('q')||'';
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({accounts:q.toLowerCase().includes('alex')?[
      {id:readerId,displayName:"Alex",role:"gm",shared:Boolean(readerGrant)},
      {id:"44444444-4444-4444-8444-444444444444",displayName:"Alex",role:"gm",shared:false}
    ]:[]})});
  }
  if(url.pathname===`/api/characters/${characterId}/history`){
    const initial={...characterData,progression:{}};
    const progressed={...characterData,progression:{xpEarned:100,ptvEarned:4,attributeRanks:{vigueur:1}}};
    const row=(revision,snapshot)=>({revision,snapshot,reason:revision===1?'created':'saved',createdAt:'2026-09-23T12:00:00Z'});
    const older=url.searchParams.has('before');
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({character:{id:characterId,name:"Smoke",version:2},revisions:older?[row(1,initial)]:[row(2,progressed)],predecessor:older?null:row(1,initial),nextBefore:older?null:2})});
  }
  if(url.pathname.startsWith(`/api/characters/${characterId}/journal`)){
    if(method==="POST")journalEntries=[{id:"55555555-5555-4555-8555-555555555555",...JSON.parse(request.postData()),version:1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}];
    if(method==="PATCH")journalEntries=[{...journalEntries[0],...JSON.parse(request.postData()),version:journalEntries[0].version+1}];
    if(method==="DELETE")journalEntries=[];
    return route.fulfill({status:method==="POST"?201:200,contentType:"application/json",body:JSON.stringify(method==="GET"?{character:{id:characterId,name:"Smoke"},entries:journalEntries,hasMore:false}:{entry:journalEntries[0],ok:true})});
  }
  if(url.pathname===`/api/characters/${characterId}/readers`){
    if(method==="POST")readerGrant=JSON.parse(request.postData()||"{}");
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({readers:readerGrant?[{id:readerId,displayName:"Alex",role:"gm",active:true}]:[]})});
  }
  if(url.pathname==="/api/characters/"+characterId&&method==="GET"){
    const currentVersion=savedPayload?Number(savedPayload.version||7)+1:7;
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({character:{id:characterId,name:savedPayload?.name||"V2 Smoke",data:savedPayload?.data||characterData,version:currentVersion,createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString()}})
    });
  }
  if(url.pathname==="/api/characters/"+characterId&&method==="PATCH"){
    savedPayload=JSON.parse(request.postData()||"{}");
    const nextVersion=Number(savedPayload.version||7)+1;
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({character:{id:characterId,name:savedPayload.name,data:savedPayload.data,version:nextVersion,createdAt:new Date(0).toISOString(),updatedAt:new Date().toISOString()}})
    });
  }
  if(url.pathname==="/api/rulesets/terra-umbra/creation"){
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({
        rules,lore,talentChoiceSpecs:{},skillTalentMap:{expertise_smoke:"athletisme"},
        disadvantages:{common:[],attribute:[],sphere:{crawler:[]}},
        disadvantageLore:{},edgeRules
      })
    });
  }
  if(url.pathname==="/api/rulesets/terra-umbra/truth"){
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(truthRules)});
  }
  if(url.pathname==="/api/rulesets/terra-umbra/reality"){
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(realityRules)});
  }
  if(url.pathname==="/api/compendium/search"){
    const q=(url.searchParams.get("q")||"").trim();
    const known={
      "Kit Smoke":{id:"wiki-kit-smoke",title:"Kit Smoke",category:"Équipement & Objets",snippet:"Équipement de référence du smoke Builder."},
      "Brave":{id:"wiki-brave",title:"Brave",category:"Règles",snippet:"Talent de référence du smoke Builder."}
    };
    const item=known[q];
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({q,total:item?1:0,offset:0,limit:12,items:item?[item]:[]})
    });
  }
  if(url.pathname.startsWith('/api/compendium/wiki-preview/')){
    const id=decodeURIComponent(url.pathname.split('/').pop()||'');
    const cover=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#267eb1"/></svg>').toString('base64');
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({media:['wiki-kit-smoke','wiki-brave'].includes(id)?`data:image/svg+xml;base64,${cover}`:null})});
  }
  if(url.pathname==="/api/compendium/articles/wiki-kit-smoke"){
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({article:{
        id:"wiki-kit-smoke",title:"Kit Smoke",category:"Équipement & Objets",
        sections:[{id:"intro",title:"Présentation",level:2,blocks:[{type:"p",text:"Équipement de référence du smoke Builder, centralisé dans le Compendium."}]}]
      }})
    });
  }
  if(url.pathname==="/api/compendium/articles/wiki-brave"){
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({article:{
        id:"wiki-brave",title:"Brave",category:"Règles",
        sections:[{id:"intro",title:"Présentation",level:2,blocks:[{type:"p",text:"Talent Brave documenté dans le Compendium."}]}]
      }})
    });
  }
  return route.fulfill({status:404,contentType:"application/json",body:JSON.stringify({error:"smoke_unhandled_route",path:url.pathname})});
});

await page.goto(baseUrl+"/characters/"+characterId+"/builder",{waitUntil:"networkidle"});
try{
  await page.locator(".builder-workspace").waitFor({state:"visible",timeout:12000});
}catch(error){
  console.error("=== BUILDER BODY ===");
  console.error(await page.locator("body").innerText().catch(()=>"(body indisponible)"));
  console.error("=== BROWSER ERRORS ===");
  console.error(browserErrors.join("\n")||"(aucune)");
  console.error("=== FAILED REQUESTS ===");
  console.error(failedRequests.join("\n")||"(aucune)");
  throw error;
}
await page.getByRole("heading",{name:/V2 Smoke|Smoke/}).first().waitFor();

const referencesButton=page.getByRole("button",{name:/Références/});
await referencesButton.waitFor({state:"visible",timeout:5000});
await referencesButton.click();
await page.getByRole("heading",{name:"Comprendre mes choix"}).waitFor({state:"visible",timeout:5000});
await page.keyboard.press("Escape");
await page.waitForFunction(()=>document.activeElement?.classList.contains("references-button"));
if(await page.locator(".knowledge-drawer").isVisible())throw new Error("Le tiroir Références reste visible après Échap.");

await page.locator(".builder-nav").getByRole("button",{name:/Sphère & Style/}).click();
const styleAlt=page.getByRole("button",{name:/Smoke Style Alt/});
await styleAlt.waitFor();
await styleAlt.click();
await page.waitForFunction(()=>{
  const buttons=[...document.querySelectorAll(".choice-card.style-card")];
  return buttons.some(button=>button.textContent?.includes("Smoke Style Alt")&&button.classList.contains("selected"));
},{timeout:5000});
if(browserErrors.length)throw new Error("Erreur lors du changement de Style :\n"+browserErrors.join("\n"));

async function assertBuilderReflow(context) {
  const layout=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    width:document.documentElement.scrollWidth,
    overflow:[...document.querySelectorAll(".builder-card, .builder-sidebar, .builder-topbar, input, select, textarea")]
      .filter(el=>el.getClientRects().length && getComputedStyle(el).visibility!=="hidden" && el.getBoundingClientRect().width>2 && (el.getBoundingClientRect().right>document.documentElement.clientWidth+1 || el.getBoundingClientRect().left < -1))
      .map(el=>el.className || el.tagName).slice(0,8)
  }));
  if(layout.width>layout.viewport+1 || layout.overflow.length) throw new Error(context+" déborde : "+JSON.stringify(layout));
}

const nav=page.locator(".builder-nav button");
if(await nav.count()!==11)throw new Error("Le Builder V2 doit exposer exactement 11 étapes de création.");
for(let i=0;i<11;i++){
  if(await nav.nth(i).isDisabled())throw new Error("Étape "+(i+1)+" encore désactivée.");
}

// Exercise every creation screen at both desktop and phone widths, before purchases.
for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  for(let index=0;index<11;index++){
    if(width<=900){
      const stepMenu=page.locator("button.builder-mobile-steps");
      if(await stepMenu.getAttribute("aria-expanded")==="false") await stepMenu.click();
    }
    await nav.nth(index).click();
    await page.waitForFunction(i=>document.querySelectorAll(".builder-nav button")[i]?.classList.contains("active"),index);
    await assertBuilderReflow(`Création, étape ${index+1}, ${width}px`);
  }
}
await page.setViewportSize({width:1440,height:1000});
await page.locator(".builder-nav").getByRole("button",{name:/Talents/}).click();
await page.locator('.talent-detail').filter({hasText:'Brave'}).waitFor();
if (await page.locator('.talent-detail a').count()) throw new Error('Les talents ne doivent plus proposer de lien d’article');
await page.locator('.talent-detail').filter({hasText:'Brave'}).getByText('Test commun',{exact:false}).waitFor();

await page.locator(".builder-nav").getByRole("button",{name:/Vérité/}).click();
const revealDisclosure=page.locator("summary.truth-disclosure-summary").filter({hasText:"Voile & Révélation"});
await revealDisclosure.waitFor({state:"visible",timeout:5000});
await revealDisclosure.click();
for(const label of ["Voilé","Semi-Révélé","Révélé"]){
  await page.getByText(label,{exact:true}).waitFor({state:"attached",timeout:5000});
}

// Truth equipment is scoped by the character's actual access. A Human with no
// hunter tradition only sees the common reference layer.
await page.getByRole("heading",{name:"Objets de Vérité"}).waitFor({state:"visible",timeout:5000});
const truthCatalog=page.locator("summary.truth-disclosure-summary").filter({hasText:"Catalogue de Vérité"});
await truthCatalog.click();
await page.getByRole("button",{name:"Règles et références",exact:true}).click();
await page.locator('.truth-equipment-toolbar').getByLabel('Chapitre').selectOption('22');
await page.getByText("Propriété Smoke",{exact:true}).waitFor({state:"attached",timeout:5000});
if(await page.getByText("Arme de Chasse Smoke",{exact:true}).count())throw new Error("Équipement de Chasse visible sans tradition de Chasse.");
if(await page.getByText("Objet d’Aèr Smoke",{exact:true}).count())throw new Error("Objet d’Aèr visible pour un non-Exilé.");
if(await page.getByText("Relique corrompue Smoke",{exact:true}).count())throw new Error("Équipement corrompu visible sans autorisation MJ.");

await page.locator(".catalog-help>summary").click();
const truthEquipmentMj=page.getByLabel(/Autorisation MJ d’accès exceptionnel aux objets de Vérité/);
const approvalLayout=await truthEquipmentMj.evaluate(input=>{
  const hit=input.closest("label").getBoundingClientRect();
  const control=input.getBoundingClientRect();
  return {hitHeight:hit.height,controlWidth:control.width,controlHeight:control.height};
});
if(approvalLayout.hitHeight<44 || approvalLayout.controlWidth>48 || approvalLayout.controlHeight>28){
  throw new Error("Autorisation Objets de Vérité disproportionnée : "+JSON.stringify(approvalLayout));
}
await truthEquipmentMj.focus();
await truthEquipmentMj.press("Space");
if(!await truthEquipmentMj.isChecked())throw new Error("Autorisation Objets de Vérité inaccessible au clavier.");
await page.getByRole("button",{name:"Objets à acquérir",exact:true}).click();
if(await page.locator('.truth-equipment-toolbar select option[value="22"]').count())throw new Error('Propriétés communes proposées dans les achats');
for(const [chapter,label] of [["23","Arme de Chasse Smoke"],["24","Objet d’Aèr Smoke"],["27","Relique corrompue Smoke"]]){
  await page.locator('.truth-equipment-toolbar').getByLabel('Chapitre').selectOption(chapter);
  await page.getByText(label,{exact:true}).waitFor({state:"attached",timeout:5000});
}
await page.setViewportSize({width:390,height:1000});
await assertBuilderReflow("Catalogue de Vérité ouvert avec autorisation, 390px");
await page.setViewportSize({width:1440,height:1000});
await truthEquipmentMj.uncheck();
await page.getByText("Objet d’Aèr Smoke",{exact:true}).waitFor({state:"detached",timeout:5000});

// Corruption is not a normal creation choice: it stays closed until explicit GM approval.
const corruptionApproval=page.getByRole("checkbox",{name:"Autorisation MJ — Corruption & Fléaux",exact:true});
await corruptionApproval.waitFor({state:"visible",timeout:5000});
if(await page.locator(".corruption-panel").count())throw new Error("Corruption ouverte sans autorisation MJ.");
await corruptionApproval.check();
await page.getByText("Source dominante",{exact:true}).waitFor({state:"visible",timeout:5000});
await page.locator(".corruption-source-card").getByRole("option",{name:/Vhodhal/}).waitFor({state:"attached",timeout:5000});
await corruptionApproval.uncheck();
await page.locator(".corruption-panel").waitFor({state:"detached",timeout:5000});
await corruptionApproval.waitFor({state:"visible",timeout:5000});

await page.locator(".builder-nav").getByRole("button",{name:/Équipement/}).click();
await page.getByRole("heading",{name:"Réalité, équipement & augmentations"}).waitFor();
await page.locator('summary.section-summary').filter({hasText:'Train de vie & Charges fixes'}).click();
await page.locator('summary.section-summary').filter({hasText:'Équipement & véhicules possédés'}).click();
const catalogDisclosure=page.locator("summary.catalog-summary").filter({hasText:"Choisir équipement, services & véhicules"});
await catalogDisclosure.waitFor({state:"visible",timeout:5000});
await catalogDisclosure.click();
await catalogDisclosure.locator('..').getByLabel('Famille').selectOption('Matériel');
const kitWiki=page.getByRole("link",{name:/Kit Smoke/}).first();
await kitWiki.waitFor({state:"visible",timeout:5000});
await kitWiki.hover();
await catalogDisclosure.locator('..').locator('.catalog-card').filter({hasText:'Kit Smoke'}).locator('.catalog-art img').waitFor({state:'visible'});
await page.getByText("Équipement de référence du smoke Builder, centralisé dans le Compendium.",{exact:false}).waitFor({state:"visible",timeout:5000});
const kitHref=await kitWiki.getAttribute("href");
if(!kitHref?.includes("article=wiki-kit-smoke"))throw new Error("Équipement Kit Smoke non résolu vers le Compendium: "+kitHref);
await page.getByText("Confortable → Confortable",{exact:true}).waitFor();
await page.getByLabel("Charge personnalisée").fill("Loyer test");
await page.getByLabel("Montant / mois").fill("1300");
await page.locator('.charge-add-grid.custom').getByRole("button",{name:"Ajouter"}).click();
await page.getByText("Confortable → Standard",{exact:true}).waitFor();

await page.locator(".builder-nav").getByRole("button",{name:/Sphère & Style/}).click();
await page.getByRole("button",{name:/Corporatiste/}).click();
await page.getByRole("button",{name:/Corpo Smoke/}).click();
await page.locator(".builder-nav").getByRole("button",{name:/Équipement/}).click();
await page.locator('summary.section-summary').filter({hasText:'Train de vie & Charges fixes'}).click();
await page.getByRole("heading",{name:"Appui Corporatiste"}).waitFor();

await page.getByLabel("Type de prestation").selectOption("housing");
await page.getByLabel("Logement pris en charge").selectOption("housing-smoke");
await page.getByText(/Appartement Smoke.*pris en charge par la corporation/).waitFor();

await page.getByLabel("Type de prestation").selectOption("vehicle");
await page.getByLabel("Véhicule fourni").selectOption("vehicle-smoke");
await page.locator('summary.section-summary').filter({hasText:'Équipement & véhicules possédés'}).click();
await page.getByText(/CityPod Smoke.*véhicule de fonction/).waitFor();

for(const removedLabel of ["Réseaux","Statuts","Patrimoine","Dettes"]){
  if(await page.getByText(removedLabel,{exact:true}).count())throw new Error("Ancien champ encore visible : "+removedLabel);
}

await page.locator(".builder-nav").getByRole("button",{name:/Finalisation/}).click();
await page.getByRole("heading",{name:"Contrôle final de la fiche"}).waitFor();
await page.locator('.character-sheet[data-mode="creation"] [data-stat="pvMax"] strong').waitFor();
const attributeRows = await page.locator('.sheet-attributes>div').evaluateAll(nodes=>nodes.map(node=>Math.round(node.getBoundingClientRect().top)));
if (attributeRows.length!==5 || attributeRows[0]!==attributeRows[2] || attributeRows[3]!==attributeRows[4] || attributeRows[0]===attributeRows[3]) throw new Error('La fiche doit présenter les Attributs sur deux rangées 3 + 2');
const creationPv = Number(await page.locator('[data-stat="pvMax"] strong').innerText());
for (const width of [1440,390]) {
  await page.setViewportSize({width,height:1000});
  await assertBuilderReflow(`Fiche création, ${width}px`);
}
await page.setViewportSize({width:1440,height:1000});
await page.getByRole('button',{name:'Fiche du personnage',exact:true}).click();
await page.locator('.character-sheet[data-mode="creation"]').waitFor();
await page.getByRole('button',{name:'Revenir à la création',exact:true}).click();
await page.getByRole('heading',{name:'Contrôle final de la fiche'}).waitFor();

if(await page.locator(".builder-nav").getByRole("button",{name:/Dépense XP & PTV/}).count()){
  throw new Error("La progression ne doit plus être une étape du Builder de création.");
}

const creationSaveButton=page.getByRole("button",{name:/Enregistrer/}).first();
await creationSaveButton.click();
await page.getByText(/Fiche enregistrée · version 8/).waitFor();
if(!savedPayload)throw new Error("La sauvegarde de fin de création n’a pas été envoyée.");
if(savedPayload.version!==7)throw new Error("Version optimiste de création incorrecte.");
if(savedPayload.data?.reality?.sphereSupportType!=="vehicle")throw new Error("Appui Corporatiste non persisté à la fin de création.");
if(savedPayload.data?.reality?.sphereSupportItemId!=="vehicle-smoke")throw new Error("Véhicule de fonction non persisté à la fin de création.");

await page.goto(`${baseUrl}/characters/${characterId}/progression`,{waitUntil:"domcontentloaded"});
try{
  await page.getByRole("heading",{name:"Progression de campagne"}).waitFor({timeout:12000});
}catch(error){
  console.error("=== PROGRESSION BODY ===");
  console.error(await page.locator("body").innerText({timeout:3000}).catch(()=>"(body indisponible)"));
  console.error("=== BROWSER ERRORS ===");
  console.error(browserErrors.join("\n")||"(aucune)");
  console.error("=== FAILED REQUESTS ===");
  console.error(failedRequests.join("\n")||"(aucune)");
  throw error;
}
for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  await assertBuilderReflow(`Progression, ${width}px`);
}
await page.setViewportSize({width:1440,height:1000});
console.log("BUILDER UI OK — 11 étapes + progression à1440/390px · autorisation Vérité au clavier et zone tactile44px");
await page.getByText("XP disponibles",{exact:true}).waitFor();
await page.getByText("PTV disponibles",{exact:true}).waitFor();
await page.getByText("Argent & possessions de campagne",{exact:true}).waitFor();
await page.getByRole("link",{name:"Builder"}).waitFor();
if(await page.locator(".builder-nav").count()){
  throw new Error("La route Progression ne doit pas réafficher la navigation de création.");
}
// Both talent catalogues use full-width rows, retain local details and no article links.
for (const name of ['Apprendre un Talent de Réalité','Dépenser des PTV']) {
  const block = page.locator('details.progress-panel').filter({has:page.locator('summary>strong').filter({hasText:new RegExp('^'+name+'$')})});
  if ((await block.getAttribute('open'))===null) await block.locator(':scope>summary').click();
  if(name==='Dépenser des PTV'){
    if(await block.getByRole('switch').count())throw new Error('Accord MJ inutile pour les talents de sa Nature');
    await block.getByLabel('Catégorie de Talents de Vérité').selectOption('Groupe Smoke');
  }else{
    await block.getByLabel('Catégorie de Talents de Réalité').selectOption('Talents communs');
  }
  const names = await (name==='Dépenser des PTV' ? block : block.locator('.talent-group').filter({has:page.getByRole('heading',{name:'Talents communs',exact:true})})).locator('.talent-list .progress-card-title>strong').allTextContents();
  const expected = name==='Dépenser des PTV' ? ['Aube occulte','Zèle occulte','Aube supérieure'] : ['Aube Smoke','Zèle Smoke'];
  if(JSON.stringify(names)!==JSON.stringify(expected))throw new Error('Tri des talents incorrect : '+JSON.stringify(names));
  if (await block.locator('.talent-list a').count()) throw new Error('Lien Compendium résiduel dans les talents');
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:1000});
    await assertBuilderReflow(`Liste ${name}, ${width}px`);
    const rows=await block.locator('.talent-list>article').evaluateAll(nodes=>nodes.map(node=>({top:node.getBoundingClientRect().top,left:node.getBoundingClientRect().left})));
    if(rows.some((row,i)=>i && (row.top<=rows[i-1].top || Math.abs(row.left-rows[i-1].left)>1)))throw new Error('Les talents doivent être en liste verticale');
  }
}
await page.setViewportSize({width:1440,height:1000});
await page.getByRole("button",{name:/Normale.*\+3 XP/}).click();
await page.getByText("3",{exact:true}).first().waitFor();
await page.getByRole('button',{name:'Consulter la fiche complète',exact:true}).click();
await page.locator('.character-sheet[data-mode="campaign"]').waitFor();
if (Number(await page.locator('[data-stat="pvMax"] strong').innerText()) !== creationPv) throw new Error('La consultation modifie les PV sans achat de progression');
await page.locator('.sheet-resources dl>div').filter({hasText:'XP disponibles'}).getByText('3',{exact:true}).waitFor();
for (const width of [1440,390]) {
  await page.setViewportSize({width,height:1000});
  await assertBuilderReflow(`Fiche campagne, ${width}px`);
}
await page.setViewportSize({width:1440,height:1000});
await page.getByRole('button',{name:'Revenir à la progression',exact:true}).click();
await page.getByRole('heading',{name:'Progression de campagne'}).waitFor();

// A real campaign purchase must update the shared sheet without changing creation data.
const xpInput = page.getByLabel('XP reçus depuis la création',{exact:true});
await xpInput.fill('100'); await xpInput.blur();
await page.locator('summary').filter({hasText:'Augmenter les Attributs'}).click();
const vigorCard = page.locator('.progress-grid article').filter({has:page.locator('.card-head strong').filter({hasText:/^Vigueur$/})});
await vigorCard.getByRole('button',{name:/Passer à/}).click();
await page.getByRole('button',{name:'Consulter la fiche complète',exact:true}).click();
await page.locator('.character-sheet[data-mode="campaign"]').waitFor();
if (Number(await page.locator('[data-stat="pvMax"] strong').innerText()) !== creationPv+2) throw new Error('Les gains de Vigueur ne mettent pas à jour les PV de campagne');
await page.getByRole('button',{name:'Revenir à la progression',exact:true}).click();
// Campaign corruption spends the same PTV reserve, keeps creation purchases separate and survives Sain.
const campaignCorruption=page.locator('.campaign-corruption');
await campaignCorruption.locator(':scope>summary').click();
await campaignCorruption.getByRole('checkbox',{name:'Autorisation MJ — Corruption & Fléaux',exact:true}).check();
await campaignCorruption.getByLabel('Choisir la Source dominante').selectOption('vhodhal');
await campaignCorruption.locator('.capacity-disclosure>summary').filter({hasText:'Don de Faim Smoke'}).click();
await campaignCorruption.getByRole('button',{name:'Acquérir Don de Faim Smoke pour 2 PTV',exact:true}).click();
await campaignCorruption.getByLabel('Choisir la Source dominante').selectOption('');
await campaignCorruption.locator('.corruption-owned-row').filter({hasText:'Don de Faim Smoke'}).getByText('Dormant',{exact:true}).waitFor();
await campaignCorruption.locator('.capacity-disclosure>summary').filter({hasText:'Rite Smoke'}).click();
await campaignCorruption.getByRole('button',{name:'Acquérir Rite Smoke pour 1 PTV',exact:true}).click();
const campaignObjects=page.locator('.campaign-truth-equipment');
const objectSection=campaignObjects.locator('details.truth-equipment-panel');
await objectSection.locator(':scope>summary').click();
if(await objectSection.getAttribute('open')!==null)throw new Error('Le bloc objets ne se replie pas');
await objectSection.locator(':scope>summary').click();
const moneySection=page.locator('details.campaign-money');
await moneySection.locator(':scope>summary').click();
if(await moneySection.getAttribute('open')!==null)throw new Error('Le bloc argent ne se replie pas');
await moneySection.locator(':scope>summary').click();
if(await campaignObjects.getByRole('switch',{includeHidden:true}).count()!==1)throw new Error('Une seule autorisation MJ attendue pour les objets');
await campaignObjects.locator('.truth-equipment-catalog>summary').click();
await campaignObjects.locator('.catalog-help>summary').click();
await campaignObjects.getByLabel(/Autorisation MJ d’accès exceptionnel aux objets de Vérité/).check();
await campaignObjects.locator('.truth-equipment-toolbar').getByLabel('Chapitre').selectOption('27');
await campaignObjects.locator('.truth-equipment-group>summary').filter({hasText:'Calamitechnologie'}).click();
await campaignObjects.locator('.truth-equipment-card').filter({hasText:'Relique corrompue Smoke'}).getByRole('button',{name:'Ajouter',exact:true}).click();
for(const width of [1440,390,320]){
 await page.setViewportSize({width,height:1000});await assertBuilderReflow(`Corruption et Objets en campagne ${width}px`);
}
await page.setViewportSize({width:1440,height:1000});
const saveButton=page.getByRole("button",{name:/Enregistrer/}).first();
await saveButton.click();
await page.getByText(/Fiche enregistrée · version 9/).waitFor();
if(!savedPayload)throw new Error("La sauvegarde versionnée n’a pas été envoyée.");
if(savedPayload.version!==8)throw new Error("Version optimiste de progression incorrecte.");
if(savedPayload.data?.progression?.attributeRanks?.vigueur!==1) throw new Error('Gain de Vigueur perdu après consultation de la fiche');
if(savedPayload.data?.attributes?.vigueur!==characterData.attributes.vigueur) throw new Error('La consultation a modifié la création');
if(JSON.stringify(savedPayload.data.progression.corruptionTalents)!==JSON.stringify(['don-smoke','rite-smoke']))throw new Error('Capacités de campagne perdues');
if(savedPayload.data.truth.corruptionTalents.length||savedPayload.data.truth.corruption!==0)throw new Error('Budget de création changé ou retour Sain perdu');
if(!savedPayload.data.truth.truthEquipment.includes('truth-corrupt-smoke'))throw new Error('Objet de campagne non sauvegardé');
if(savedPayload.data?.schemaVersion!==2)throw new Error("La sauvegarde n’est pas en schema v2.");
if(savedPayload.data?.reality?.sphereSupportType!=="vehicle")throw new Error("Appui Corporatiste non persisté.");
if(savedPayload.data?.reality?.sphereSupportItemId!=="vehicle-smoke")throw new Error("Véhicule de fonction non persisté.");
for(const legacyKey of ["sphereSupportDetail","possessionsNotes","networks","statuses","patrimony","debts"]){
  if(Object.prototype.hasOwnProperty.call(savedPayload.data?.reality||{},legacyKey)){
    throw new Error("Champ Réalité legacy encore sauvegardé : "+legacyKey);
  }
}

// Standalone route must display the very same saved campaign values without mounting editing tools.
const savedBeforeSheet=JSON.stringify(savedPayload);
await page.goto(`${baseUrl}/characters/${characterId}/sheet`);
await page.locator('.character-sheet[data-mode="campaign"]').waitFor();
if(Number(await page.locator('[data-stat="pvMax"] strong').innerText())!==creationPv+2)throw new Error('Fiche autonome différente de la progression');
await page.getByText('Don de Faim Smoke',{exact:true}).waitFor({state:'attached'});
if(!await page.locator('.sheet-resources').getByText('2',{exact:true}).count())throw new Error('PTV de Corruption non déduits sur la fiche');
if(await page.locator('.builder-sidebar,.progression-step,input,textarea,select').filter({visible:true}).count())throw new Error('Outils de modification visibles sur la fiche autonome');
await page.getByRole('link',{name:'Talents',exact:true}).click();
if(!await page.locator('#sheet-reality').evaluate(node=>node.open))throw new Error('Le raccourci doit ouvrir les Talents');
for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  await assertBuilderReflow(`Fiche autonome ${width}px`);
}
await page.locator('.sheet-sharing summary').click();
const accountSearch=page.getByLabel('Rechercher un compte MJ par son nom');
await accountSearch.fill('Alex');
await page.getByRole('list',{name:'Comptes MJ trouvés'}).waitFor();
if(await page.locator('.reader-option').count()!==2)throw new Error('Homonymes manquants');
await page.locator('.reader-option').first().focus();
await page.keyboard.press('Enter');
await page.getByText('Compte sélectionné :',{exact:false}).waitFor();
await accountSearch.fill('Introuvable');
await page.getByText('Aucun compte MJ correspondant.',{exact:false}).waitFor();
if(!await page.getByRole('button',{name:'Accorder l’accès',exact:true}).isDisabled())throw new Error('Une recherche modifiée doit annuler la sélection');
await accountSearch.fill('Alex');
await page.locator('.reader-option').first().click();
await page.getByRole('button',{name:'Accorder l’accès',exact:true}).click();
await page.getByText('Accès accordé.',{exact:false}).waitFor();
if(readerGrant?.readerId!==readerId || 'email' in readerGrant)throw new Error('Le partage doit utiliser le compte sélectionné');
await assertBuilderReflow('Partage MJ sur téléphone');
sheetOwner=false;
await page.reload();
await page.locator('.character-sheet').waitFor();
if(await page.locator('.sheet-sharing,input,textarea,select').count())throw new Error('Le MJ ne doit voir aucun outil de modification ou partage');
if(JSON.stringify(savedPayload)!==savedBeforeSheet)throw new Error('La consultation a changé la sauvegarde');
console.log('Standalone sheet browser OK — same campaign values, direct route, anchors, 320/390/1440px, owner sharing, MJ read-only and no mutation');

await page.goto(`${baseUrl}/characters/${characterId}/journal`);
await page.getByRole('button',{name:'Nouvelle note',exact:true}).click();
await page.getByLabel('Titre',{exact:true}).fill('Séance à California');
await page.getByLabel('Date de la séance').fill('2026-09-23');
await page.getByLabel('Notes d’aventure',{exact:true}).fill('Piste personnelle <script>alert(1)</script>');
for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  await assertBuilderReflow(`Journal mobile ${width}px`);
}
await page.getByRole('button',{name:'Enregistrer la note',exact:true}).click();
await page.getByText('Note enregistrée.',{exact:true}).waitFor();
await page.locator('.journal-content').getByText('Piste personnelle <script>alert(1)</script>',{exact:true}).waitFor();
await page.getByRole('button',{name:'Modifier Séance à California',exact:true}).click();
await page.getByLabel('Titre',{exact:true}).fill('Une nouvelle piste');
await page.getByRole('button',{name:'Enregistrer la note',exact:true}).click();
await page.getByRole('heading',{name:'Une nouvelle piste',exact:true}).waitFor();
page.once('dialog',dialog=>dialog.accept());
await page.getByRole('button',{name:'Supprimer Une nouvelle piste',exact:true}).click();
await page.getByText('Note supprimée.',{exact:true}).waitFor();
if(journalEntries.length)throw new Error('Note non supprimée');
console.log('Private adventure journal browser OK — creation, escaped text, edition, deletion and 320/390/1440px');

await page.goto(`${baseUrl}/characters/${characterId}/history`);
await page.locator('.history-changes').waitFor();
await page.getByText('XP reçus depuis la création',{exact:true}).waitFor();
for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  await assertBuilderReflow(`Historique ${width}px`);
}
await page.getByRole('button',{name:'Voir les versions précédentes',exact:true}).click();
await page.getByText('Point de départ enregistré.',{exact:false}).waitFor();
if(await page.locator('.history-entry').count()!==2)throw new Error('Pagination de l’historique incorrecte');
if(await page.locator('input,textarea,select').count())throw new Error('L’historique doit rester en lecture seule');
console.log('Progression history browser OK — saved values, pagination, read-only and 320/390/1440px');

if(browserErrors.length)throw new Error("Erreurs navigateur :\n"+browserErrors.join("\n"));

console.log("Builder Web V2 smoke OK — 11 étapes de création, progression séparée, tiroir Références, Talents locaux triés, wiki Équipement, V/SR/R, Finalisation et sauvegarde validés.");
await browser.close();
