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
    expertise:[{id:"expertise_smoke",name:"Athlète",effect:"+1 Athlétisme",category:"expertise",attribute:"vigueur"},
      {id:"expertise_agile_smoke",name:"Acrobate",effect:"Adresse smoke",category:"expertise",attribute:"agilite"},
      {id:"expertise_mind_smoke",name:"Analyste",effect:"Analyse smoke",category:"expertise",attribute:"esprit"},
      {id:"expertise_will_smoke",name:"Discipline",effect:"Volonté smoke",category:"expertise",attribute:"volonte"}]
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
let contactQueryHadLimit=false;
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
  if(url.pathname==="/api/compendium/contact-npcs"){
    contactQueryHadLimit=url.searchParams.has("limit");
    const items=Array.from({length:48},(_,index)=>({
      articleId:`contact-smoke-${index+1}`,
      title:`Contact Smoke ${String(index+1).padStart(2,"0")}`,
      tierId:index%2?"entraine":"elite",
      tierLabel:index%2?"Entraîné":"Élite",
      snippet:`Profil de contact smoke numéro ${index+1}.`
    }));
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({total:items.length,items})});
  }
  if(url.pathname.startsWith("/api/compendium/articles/contact-smoke-")){
    const id=url.pathname.split("/").pop();
    return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({article:{
      id,title:"Contact Smoke",category:"Personnages",
      sections:[{id:"intro",title:"Présentation",level:2,blocks:[{type:"p",text:"PNJ de contact disponible dans le catalogue complet."}]}]
    }})});
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

const {terraUmbraTruthRules:canonical}=await import('../../api/dist/rules/truth/rules.js');
Object.assign(truthRules,canonical);
const absent='.daemon-options,.angelus-options,.extral-options,.exile-options,.beneficiary-benefits,.mage-technique-editor';
try{
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:950});
  for(const nature of Object.values(canonical.structure.natures)){
   const choices={};for(const c of nature.choices){const options=c.optionsBy&&c.dependsOn?c.optionsBy[choices[c.dependsOn]]??c.options:c.options;choices[c.key]=(options.find(o=>o.id==='aucune')??options[0])?.id??'';}
   if(nature.id==='extral'){choices.species='homo_superior';choices.network='aidh_intervention';}
   if(nature.id==='daemon')choices.divinity='morrighan';
   Object.assign(choices,{beneficiaryBenefits:{scenario:'Old',refectionReceived:true,guardReceived:true},extralBuild:{repairUsed:true,reserveUsed:true},daemonBuild:{riteDomain:'corvides',rites:[{name:'Old',effect:'Kept',pa:1}]}});
   characterData.truth={...characterData.truth,nature:nature.id,consciousness:'initie',choices,truthTalents:[]};savedPayload=null;
   await page.goto(baseUrl+'/characters/'+characterId+'/builder',{waitUntil:'networkidle'});await page.locator('.builder-workspace').waitFor();
   if(await page.locator('.builder-mobile-steps').isVisible())await page.locator('.builder-mobile-steps').click();
   await page.locator('.builder-nav').getByRole('button',{name:/Vérité/}).click();
   if(await page.locator(absent).count())throw new Error(nature.id+': rejected creation panels');
   if(nature.id==='extral')await page.getByText(/Formation AIDH au combat en équipe/).waitFor();
   if(await page.locator('.builder-main').evaluate(el=>el.scrollWidth>el.clientWidth+2))throw new Error(nature.id+': overflow '+width);
   if(width===1440){await page.locator('.truth-picker-grid select').nth(1).selectOption('profane');await page.getByRole('button',{name:/Enregistrer/}).first().click();await page.waitForTimeout(150);if(!savedPayload?.data.truth.choices.beneficiaryBenefits.refectionReceived||!savedPayload.data.truth.choices.extralBuild.repairUsed)throw new Error(nature.id+': hidden legacy data lost');}
   await page.goto(baseUrl+'/characters/'+characterId+'/progression',{waitUntil:'networkidle'});await page.locator('.builder-workspace').waitFor();
   if(await page.locator(absent).count())throw new Error(nature.id+': rejected progression panels');
  }
 }
 if(browserErrors.some(e=>e.startsWith('pageerror:')))throw new Error(browserErrors.join('\n'));
 console.log('GUIDED TRUTH BROWSER OK — all Natures, creation/progression at 1440/390/320, no unsolicited panels, explained AIDH and actual save preservation');
}catch(e){console.error((await page.locator('.builder-main').innerText()).slice(0,1500));throw e;}finally{await browser.close();}
