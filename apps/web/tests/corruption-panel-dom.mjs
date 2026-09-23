// Node 24+. Compiles and mounts the actual Vue SFC in jsdom; no browser or server.
// Optional TUC_WEB_TEST_MODULE_ROOT / TUC_DOM_TEST_MODULE_ROOT point to package.json
// files whose node_modules provide Vue/compiler-sfc/esbuild and jsdom respectively.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot=fileURLToPath(new URL("../../../",import.meta.url));
const webRequire=createRequire(process.env.TUC_WEB_TEST_MODULE_ROOT||new URL("../package.json",import.meta.url));
const domRequire=createRequire(process.env.TUC_DOM_TEST_MODULE_ROOT||new URL("../package.json",import.meta.url));
const {build}=webRequire("esbuild");
const {parse,compileScript}=webRequire("@vue/compiler-sfc");
const {JSDOM,VirtualConsole}=domRequire("jsdom");
process.env.TUC_TRUTH_MECHANICS_SOURCE_DIR=path.join(repoRoot,"compendium/source");
const {corruptionSources,corruptionPrecedence,corruptionTalents}=await import("../../api/src/rules/truth/corruption.ts");
const rules={
  structure:{ptvInitial:5,natures:{humain:{choices:[],baseFreeTraits:[],freeTraitRules:[]}}},
  catalogs:{humain:[]},visibility:{needles:{},sharedHunterNatures:[]},
  corruption:{sources:corruptionSources,precedence:corruptionPrecedence,talents:corruptionTalents}
};
const moduleDirectory=path.dirname(path.dirname(webRequire.resolve("vue/package.json")));
const compiled=await build({
  stdin:{
    resolveDir:path.join(repoRoot,"apps/web"),sourcefile:"corruption-panel-dom-entry.ts",loader:"ts",
    contents:`
      import { createApp, h, ref, computed, nextTick } from 'vue';
      import CorruptionPanel from './src/components/builder/CorruptionPanel.vue';
      import { truthPtvSpent } from './src/lib/truth';
      const rules=window.__rules;
      const initial=()=>({nature:'humain',consciousness:'initie',choices:{hunterTradition:'aucune'},truthTalents:[],truthEquipment:[],truthEquipmentMjOverride:false,corruptionMjAuthorized:false,corruption:0,corruptionSource:'',corruptionTalents:[]});
      const state=ref(initial());
      const remaining=computed(()=>rules.structure.ptvInitial-truthPtvSpent(rules,state.value));
      const integrity=ref(6);
      let initiationRequests=0;
      const app=createApp({setup:()=>()=>h(CorruptionPanel,{
        modelValue:state.value,rules,integrity:integrity.value,ptvRemaining:remaining.value,
        'onUpdate:modelValue':value=>{state.value=value;},
        'onRequest-initiation':()=>{initiationRequests++;}
      })});
      app.mount('#app');
      window.corruptionTest={
        state:()=>JSON.parse(JSON.stringify(state.value)),remaining:()=>remaining.value,initiationRequests:()=>initiationRequests,
        set:async patch=>{state.value={...state.value,...patch};await nextTick();},
        reset:async()=>{state.value=initial();integrity.value=6;await nextTick();},
        setIntegrity:async value=>{integrity.value=value;await nextTick();},tick:nextTick,unmount:()=>app.unmount()
      };
    `
  },
  bundle:true,write:false,format:"iife",platform:"browser",nodePaths:[moduleDirectory],
  define:{"process.env.NODE_ENV":"'test'",__VUE_OPTIONS_API__:"true",__VUE_PROD_DEVTOOLS__:"false",__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:"false"},
  plugins:[{name:"vue-sfc",setup(builder){
    builder.onLoad({filter:/\.vue$/},async({path:filename})=>{
      const source=await readFile(filename,"utf8");
      const {descriptor,errors}=parse(source,{filename});
      assert.equal(errors.length,0,filename);
      const script=compileScript(descriptor,{id:"corruption-dom",inlineTemplate:true});
      return{contents:script.content,loader:"ts",resolveDir:path.dirname(filename)};
    });
  }}]
});
const errors=[],virtualConsole=new VirtualConsole();
virtualConsole.on("jsdomError",error=>errors.push(error.message));
const dom=new JSDOM("<!doctype html><div id='app'></div>",{
  url:"https://dom-test.invalid/",runScripts:"outside-only",pretendToBeVisual:true,virtualConsole,
  beforeParse(window){window.__rules=rules;}
});
dom.window.eval(compiled.outputFiles[0].text);
const {document}=dom.window,test=dom.window.corruptionTest;
let checks=0;
const ok=(value,label)=>{assert(value,label);checks++;console.log("OK",label);};
const authorization=()=>document.querySelector('.corruption-authorization input[type="checkbox"]');
const card=name=>[...document.querySelectorAll(".corruption-talent-card")].find(element=>element.querySelector(".corruption-talent-head strong")?.textContent===name);
const buyButton=name=>card(name)?.querySelector(".purchase-button");
const buyReason=name=>card(name)?.querySelector(".buy-reason")?.textContent||"";
const named=name=>corruptionTalents.find(talent=>talent.name===name);
async function click(element){assert(element,"Element exists");element.click();await test.tick();}
async function source(id){const select=document.querySelector(".corruption-state-grid select");select.value=id;select.dispatchEvent(new dom.window.Event("change",{bubbles:true}));await test.tick();}
async function catalog(id){const select=document.querySelector(".catalog-source select");select.value=id;select.dispatchEvent(new dom.window.Event("change",{bubbles:true}));await test.tick();}
async function search(query){const input=document.querySelector(".catalog-search input");input.value=query;input.dispatchEvent(new dom.window.Event("input",{bubbles:true}));await test.tick();}
async function kind(id){await click(document.querySelector(`.kind-filters [data-kind="${id}"]`));}

ok(authorization()&&!authorization().checked,"Commande d’autorisation seule au départ");
ok(document.querySelector(".corruption-authorization strong").textContent==="Autorisation MJ — Corruption & Fléaux","L’autorisation nomme explicitement le bloc concerné");
ok(!document.querySelector(".corruption-panel,h3,.corruption-catalog,.corruption-state-grid"),"Sans MJ : aucun panneau, titre, jauge ou catalogue dans le DOM");
await click(authorization());
ok(document.querySelector(".corruption-panel")&&authorization().checked,"L’accord MJ ouvre le panneau complet");
ok(document.querySelector(".corruption-authorization strong").textContent==="Autorisation MJ — Corruption & Fléaux","Libellé MJ identique quand l’autorisation est active");
await source("vhodhal");
ok(test.state().corruption===1&&test.state().corruptionSource==="vhodhal","La Source active une Corruption de 1");
ok(document.querySelector(".corruption-catalog")&&document.querySelectorAll(".corruption-talent-card").length>0&&!document.querySelector("details.corruption-catalog"),"Choisir une Source expose les capacités sans double repli");
ok(document.querySelector(".ptv-summary strong").textContent==="5"&&document.querySelector(".ptv-summary span").textContent.includes("PTV disponibles"),"Réserve disponible affichée à côté des achats");
ok(authorization().disabled,"Impossible de retirer l’autorisation avec une Corruption active");
ok(!buyButton("Bouche sans fond").disabled,"Don canonique Marqué achetable avec Source, profondeur et PTV");
await click(buyButton("Bouche sans fond"));
ok(test.state().corruptionTalents.includes(named("Bouche sans fond").id)&&test.remaining()===4,"Achat émis au parent et PTV réellement décomptés");
ok(buyButton("Dévorer la matière").disabled&&buyReason("Dévorer la matière").includes("Envahi"),"Profondeur insuffisante bloque le Don concerné");
await test.set({corruption:5});
ok(!buyButton("Dévorer la matière").disabled,"Profondeur atteinte rend le Don achetable");
await source("vaagor");
ok(test.remaining()===4&&document.querySelector(".corruption-owned").textContent.includes("Dormant"),"Changer de Source conserve le Don et sa dépense");
await catalog("vhodhal");
ok(buyButton("Dévorer la matière").disabled&&buyReason("Dévorer la matière").includes("Source dominante"),"Consulter une autre Source n’autorise pas ses Dons");
await source("");
ok(test.state().corruption===0&&test.state().corruptionTalents.length===1&&test.remaining()===4,"Purification : acquisitions et coûts conservés");
ok(!card("Bouche sans fond")&&!card("Dévorer la matière")&&card("Récolter les miettes")&&card("Porteur sain"),"État Sain : Dons absents du catalogue, Rites et Faveurs présents");
ok(document.querySelector(".catalog-heading h4").textContent==="Rites & Faveurs — sans Corruption","Le titre du catalogue indique les capacités proposées à l’état Sain");
ok(authorization().disabled,"Une capacité acquise suffit à maintenir le verrou MJ");
await click(document.querySelector(".corruption-owned-row button"));
ok(test.remaining()===5&&!authorization().disabled,"Retrait volontaire libère la dépense et le verrou");
await click(authorization());
ok(!document.querySelector(".corruption-panel,.corruption-catalog"),"Refermer masque de nouveau tout le bloc");

// An externally loaded inconsistent record must stay intact and reversible.
await test.set({corruptionMjAuthorized:false,corruption:5,corruptionSource:"vhodhal",corruptionTalents:[named("Bouche sans fond").id]});
ok(!document.querySelector(".corruption-panel")&&test.remaining()===4,"Dossier sans accord mais avec acquis : bloc absent, coût conservé");
ok(!authorization().disabled&&document.querySelector(".corruption-authorization").textContent.includes("conservées"),"Données historiques signalées et autorisation réactivable");
await click(authorization());
ok(test.state().corruption===5&&test.state().corruptionTalents.length===1,"Réouvrir ne perd ni jauge ni achat");

await test.reset();
await test.set({corruptionMjAuthorized:true,corruption:5,corruptionSource:"vhodhal",consciousness:"profane"});
ok(buyButton("Bouche sans fond").disabled&&buyReason("Bouche sans fond").includes("Initiation"),"La règle Profane reste explicite et ne libère pas les PTV");
await click(document.querySelector(".corruption-initiation-note button"));
ok(test.initiationRequests()===1&&test.state().consciousness==="profane"&&test.remaining()===5,"Le raccourci Conscience demande la navigation sans modifier règles, Conscience ou PTV");
await test.set({consciousness:"initie"});
ok(!buyButton("Bouche sans fond").disabled,"L’Initiation lève ce verrou sans changer le budget");
const expensive=corruptionTalents.filter(talent=>talent.sourceId==="vhodhal"&&talent.kind==="DON"&&talent.cost===3&&!talent.prerequisiteName);
await click(buyButton(expensive[0].name));
ok(test.remaining()===2&&buyButton(expensive[1].name).disabled&&buyReason(expensive[1].name).includes("PTV insuffisants"),"Le budget partagé bloque les dépenses excédentaires");
await click(buyButton(expensive[1].name));
ok(test.state().corruptionTalents.length===1&&test.remaining()===2,"Cliquer une acquisition désactivée ne dépense rien");

await test.reset();await test.set({corruptionMjAuthorized:true,corruption:5,corruptionSource:"vhodhal"});
ok(buyButton("Écume du Porteur").disabled,"La capacité dépendante attend son prérequis réel");
await click(buyButton("Porteur sain"));await click(buyButton("Écume du Porteur"));
ok(test.state().corruptionTalents.length===2&&test.remaining()===2,"Prérequis + capacité dépendante acquis à leur coût canonique");
await click(buyButton("Porteur sain"));
ok(test.state().corruptionTalents.length===0&&test.remaining()===5,"Retrait du prérequis supprime les dépendances en cascade");

// Uses the API catalog, so this also catches truncated prerequisite extraction.
ok(buyButton("Partage de l’Écume").disabled,"Partage de l’Écume exige Récolter les miettes");
await click(buyButton("Récolter les miettes"));
ok(!buyButton("Partage de l’Écume").disabled,"Le nom canonique complet du prérequis débloque l’achat");
await click(buyButton("Partage de l’Écume"));
ok(test.state().corruptionTalents.includes(named("Partage de l’Écume").id),"Acquisition qui était bloquée par le prérequis tronqué reproduite avec le catalogue API");

await test.reset();await test.set({corruptionMjAuthorized:true});await source("vaagor");
await click(buyButton("Ombre docile"));
ok(buyButton("Noyer la silhouette").disabled&&buyReason("Noyer la silhouette").includes("Au bord de la Rupture"),"Le profil canonique abrégé Au bord reste inaccessible à Corruption 1");
await test.set({corruption:5});
ok(!buyButton("Noyer la silhouette").disabled,"Le même Don devient achetable à Corruption 5 avec prérequis et budget");
await click(buyButton("Noyer la silhouette"));
ok(test.state().corruptionTalents.includes(named("Noyer la silhouette").id),"Achat au bon seuil effectué par le vrai composant");

await test.reset();await test.set({corruptionMjAuthorized:true,corruption:5,corruptionSource:"vhodhal"});
await click(buyButton("Bouche sans fond"));await source("");
ok(document.querySelector(".corruption-owned").textContent.includes("Dormant")&&test.remaining()===4,"Don historique dormant conservé dans l’inventaire à l’état Sain");
await catalog("vaagor");
ok([...document.querySelectorAll(".corruption-talent-head>div>span")].every(element=>!element.textContent.startsWith("DON")),"Changer de catalogue en étant Sain ne réintroduit aucun Don");
await catalog("vhodhal");
ok(!buyButton("Récolter les miettes").disabled&&!buyButton("Porteur sain").disabled,"Rite et Faveur réellement éligibles à Corruption zéro");
await click(buyButton("Récolter les miettes"));await click(buyButton("Porteur sain"));
ok(test.state().corruption===0&&test.state().corruptionTalents.length===3&&test.remaining()===2,"Achat de Rite et Faveur à zéro sans suppression du Don ni remboursement");
await source("vhodhal");
ok(card("Bouche sans fond")&&test.state().corruptionTalents.length===3&&test.remaining()===2,"Retour au Fléau : catalogue des Dons restauré, acquis et dépenses inchangés");
ok(document.querySelector(".catalog-heading h4").textContent==="Catalogue des six Fléaux","Le titre du catalogue complet revient avec la Corruption");
await click(document.querySelector(".stepper button"));
ok(test.state().corruption===0&&!card("Bouche sans fond")&&test.state().corruptionTalents.length===3&&test.remaining()===2,"Baisser la jauge à zéro masque aussi les Dons sans effacer les acquisitions");

await test.reset();await test.set({corruptionMjAuthorized:true,corruption:5,corruptionSource:"vhodhal"});
ok(document.querySelectorAll(".segment").length===6&&document.querySelectorAll(".segment.filled").length===5,"Jauge segmentée : cinq segments sur l’Intégrité réelle de six");
await test.setIntegrity(8);
ok(document.querySelectorAll(".segment").length===8&&document.querySelector('[role="meter"]').getAttribute("aria-valuemax")==="8"&&document.querySelector(".gauge-heading h4").textContent==="Envahi","La jauge et la profondeur suivent une Intégrité de huit, sans constante de démo");
ok([...document.querySelectorAll(".corruption-depths b")].map(element=>element.textContent).join(",")==="01,04,07,08","Seuils recalculés depuis l’Intégrité réelle");
await test.set({corruption:99});
ok(document.querySelector('[role="meter"]').getAttribute("aria-valuenow")==="8"&&document.querySelectorAll(".segment.filled").length===8&&test.state().corruption===99,"Affichage borné sans mutation silencieuse d’une valeur enregistrée invalide");
await click(document.querySelector(".stepper button"));
ok(test.state().corruption===7,"Le contrôle ramène la Corruption dans les bornes réelles");

await test.reset();await test.set({corruptionMjAuthorized:true,corruption:5,corruptionSource:"vhodhal"});
const unfilteredState=JSON.stringify(test.state());
await search("DEVORER");
ok(document.querySelectorAll(".corruption-talent-card").length>0&&card("Dévorer la matière"),"Recherche sans accents ni différence de casse");
await search("zzyyxx-aucune-capacite");
ok(document.querySelector(".catalog-empty")&&!document.querySelector(".corruption-talent-card"),"Recherche sans résultat explicite");
await click(document.querySelector(".catalog-empty button"));
ok(document.querySelectorAll(".corruption-talent-card").length===26&&document.activeElement===document.querySelector(".catalog-search input"),"Réinitialisation des filtres et retour de focus à la recherche");
await catalog("all");
ok(document.querySelectorAll(".corruption-talent-card").length===corruptionTalents.length&&test.state().corruptionSource==="vhodhal","Toutes les Sources affiche le vrai catalogue sans changer la Source dominante");
await kind("DON");
ok(document.querySelectorAll(".corruption-talent-card").length===corruptionTalents.filter(talent=>talent.kind==="DON").length,"Filtre Dons sur toutes les Sources");
await click(document.querySelector(".available-filter input"));
ok([...document.querySelectorAll(".purchase-button")].every(button=>!button.disabled),"Accessibles uniquement reprend les conditions réelles d’achat");
ok(JSON.stringify(test.state())===unfilteredState,"Recherche et filtres ne modifient aucune donnée de personnage");
await click(buyButton("Bouche sans fond"));
ok(!card("Bouche sans fond")&&test.remaining()===4&&document.activeElement===document.querySelector(".catalog-search input"),"Acquisition depuis le filtre accessible : coût réel, résultat retiré et focus préservé");
await source("");
ok(!document.querySelector('.kind-filters [data-kind="DON"]')&&document.querySelector('.kind-filters [data-kind="all"]').getAttribute("aria-pressed")==="true","Sain masque et réinitialise le filtre Don actif");
ok(document.querySelectorAll(".corruption-talent-card").length>0&&[...document.querySelectorAll(".corruption-talent-head span")].every(element=>!element.textContent.startsWith("DON"))&&test.remaining()===4,"Toutes les Sources à Sain : Rites/Faveurs visibles, Don acquis et coût conservés");
await source("vhodhal");
ok(document.querySelector('.kind-filters [data-kind="DON"]')&&test.state().corruptionTalents.includes(named("Bouche sans fond").id)&&test.remaining()===4,"Le filtre Don revient avec la Source sans perdre les acquisitions");
ok(errors.length===0,"Aucune erreur JavaScript DOM");
console.log(`${checks} assertions passed using the actual Vue component and API corruption catalog. No browser layout claim.`);
test.unmount();dom.window.close();
