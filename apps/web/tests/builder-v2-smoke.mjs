import { chromium } from "playwright-core";

const baseUrl=process.env.TUC_V2_SMOKE_BASE_URL||"http://127.0.0.1:4173";
const executablePath=process.env.CHROME_BIN;
if(!executablePath)throw new Error("CHROME_BIN manquant.");

const characterId="11111111-1111-4111-8111-111111111111";
let savedPayload=null;

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
  truth:{nature:"humain",consciousness:"initie",choices:{hunterTradition:"aucune"},truthTalents:[]},
  equipment:[],
  social:{languages:["Anglais"],contacts:["Contact Smoke"],reputation:""},
  spending:{augmentations:0,equipment:0,vehicle:0},
  reality:{augmentations:[],equipment:[],fixedChargeItems:[],sphereSupportDetail:""},
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
  spheres:{crawler:{name:"Crawler",originId:"citadin",support:"Un Contact fiable",fixedSkills:[]}},
  styles:[{
    id:"smoke_style",sphere:"crawler",name:"Smoke Style",skills:[],
    expertiseFamilies:["vigueur","agilite"],lifestyle:"Standard",account:10000,
    augmentationEnvelope:5000,gen2SlotsBase:1,vehicleCapital:0
  }],
  talents:{
    origin:{citadin:[{id:"origin_smoke",name:"Acquis urbain",effect:"+1 test",category:"origin"}]},
    sphere:{crawler:[{id:"sphere_smoke",name:"Réseau Crawler",effect:"Contact",category:"sphere",sphere:"crawler"}]},
    common:[{id:"common_smoke",name:"Brave",effect:"Test commun",category:"common"}],
    expertise:[{id:"expertise_smoke",name:"Athlète",effect:"+1 Athlétisme",category:"expertise",attribute:"vigueur"}]
  }
};

const lore={
  origin:{citadin:"Lore origine"},
  originTalent:{origin_smoke:"Lore talent origine"},
  sphere:{crawler:"Lore sphère"},
  style:{smoke_style:"Lore style"},
  skill:Object.fromEntries(skillIds.map(([id,name])=>[id,"Lore "+name])),
  attribute:{vigueur:"",agilite:"",esprit:"",volonte:"",charisme:""},
  talent:{common_smoke:"Lore commun",expertise_smoke:"Lore expertise"},
  sphereTalent:{sphere_smoke:"Lore sphère talent"}
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
  catalogs:{humain:[]},
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
  id:"eq-smoke",kind:"equipment",name:"Kit Smoke",category:"Matériel",sourceCategory:"Matériel",
  price:100,priceMin:100,priceMax:100,priceLabel:"100 $",generation:null,charge:null,stress:null,slots:null,
  effect:"Équipement de test.",lore:"Un kit destiné au smoke.",data:{},vehicle:false,neuro:false,
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
      smoke_style:{text:"Accès smoke",gen1:["all"],gen2:["all"],bio:["all"],bioCap:20000}
    },
    lifestyle:{
      order:["Survie","Modeste","Standard","Confortable","Aisé","Luxe"],
      monthlyReference:{Survie:200,Modeste:400,Standard:650,Confortable:1200,"Aisé":2500,Luxe:5000},
      lore:{Survie:"",Modeste:"",Standard:"Vie standard smoke.",Confortable:"","Aisé":"",Luxe:""}
    }
  },
  equipment:[equipmentItem],
  augmentations:[augmentationItem],
  recurring:[],
  counts:{equipment:1,augmentations:1,recurring:0,monthly:0,annual:0,vehicles:0,neuroprograms:0}
};

const browser=await chromium.launch({headless:true,executablePath,args:["--no-sandbox"]});
const page=await browser.newPage();
const browserErrors=[];
const failedRequests=[];
page.on("pageerror",error=>browserErrors.push("pageerror: "+String(error)));
page.on("console",message=>{
  if(message.type()==="error")browserErrors.push("console: "+message.text());
});
page.on("requestfailed",request=>failedRequests.push(request.method()+" "+request.url()+" · "+String(request.failure()?.errorText||"")));

await page.route("**/api/**",async route=>{
  const request=route.request();
  const url=new URL(request.url());
  const method=request.method();

  if(url.pathname==="/api/characters/"+characterId&&method==="GET"){
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({character:{id:characterId,name:"V2 Smoke",data:characterData,version:7,createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString()}})
    });
  }
  if(url.pathname==="/api/characters/"+characterId&&method==="PATCH"){
    savedPayload=JSON.parse(request.postData()||"{}");
    return route.fulfill({
      status:200,contentType:"application/json",
      body:JSON.stringify({character:{id:characterId,name:savedPayload.name,data:savedPayload.data,version:8,createdAt:new Date(0).toISOString(),updatedAt:new Date().toISOString()}})
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

const nav=page.locator(".builder-nav button");
if(await nav.count()!==12)throw new Error("Le Builder V2 doit exposer exactement 12 blocs.");
for(let i=0;i<12;i++){
  if(await nav.nth(i).isDisabled())throw new Error("Bloc "+(i+1)+" encore désactivé.");
}

await page.getByRole("button",{name:/Vérité/}).click();
await page.getByRole("heading",{name:"Voile & Révélation"}).waitFor();
for(const label of ["Voilé","Semi-Révélé","Révélé"]){
  if(await page.getByText(label,{exact:true}).count()===0)throw new Error("État de Vérité absent : "+label);
}

await page.getByRole("button",{name:/Équipement/}).click();
await page.getByRole("heading",{name:"Réalité, équipement & augmentations"}).waitFor();
await page.getByText("Kit Smoke",{exact:true}).waitFor();

await page.getByRole("button",{name:/Finalisation/}).click();
await page.getByRole("heading",{name:"Contrôle final de la fiche"}).waitFor();
await page.getByText("Valeurs dérivées",{exact:true}).waitFor();
await page.getByText("PV max",{exact:true}).waitFor();

await page.getByRole("button",{name:/Dépense XP & PTV/}).click();
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
await page.getByText("XP disponibles",{exact:true}).waitFor();
await page.getByText("PTV disponibles",{exact:true}).waitFor();
await page.getByText("Argent & possessions de campagne",{exact:true}).waitFor();

const saveButton=page.getByRole("button",{name:/Enregistrer/}).first();
await saveButton.click();
await page.getByText(/Fiche enregistrée · version 8/).waitFor();
if(!savedPayload)throw new Error("La sauvegarde versionnée n’a pas été envoyée.");
if(savedPayload.version!==7)throw new Error("Version optimiste incorrecte.");
if(savedPayload.data?.schemaVersion!==2)throw new Error("La sauvegarde n’est pas en schema v2.");

if(browserErrors.length)throw new Error("Erreurs navigateur :\n"+browserErrors.join("\n"));

console.log("Builder Web V2 smoke OK — 12 blocs actifs, V/SR/R, Équipement, Finalisation, Progression et sauvegarde validés.");
await browser.close();
