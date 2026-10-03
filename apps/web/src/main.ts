import { createApp, h } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";
import "./style.css";
import { pageTitle } from "./lib/page-title";
import "./orbital-ui.css";

const router=createRouter({
  history:createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.path === '/decouvrir' && ['#cadre','#milieu','#choisir','#regles','#suite'].includes(to.hash)) return { el: to.hash, top: 24 };
    if (to.path.startsWith('/decouvrir/') && ['#envie','#pression','#regard','#quotidien','#capacites','#regles','#preparer','#approfondir','#corpo','#crawler','#gouvernemental','#religieux','#pegre','#suite','#start-main'].includes(to.hash)) return { el: to.hash, top: 24 };
    if (to.path === '/atlas' && to.hash === '#cartes-classiques') return { el: to.hash, top: 16 };
    if (to.path === '/atlas' && to.query.map !== from.query.map) return { top: 0, left: 0 };
    // The account view scrolls to this section after its asynchronous user data renders.
    if (to.hash === "#characters") return;
    // Compendium query navigation manages article sections and reading positions.
    if (to.path !== from.path) return { top: 0, left: 0 };
  },
  routes:[
    { path:"/decouvrir", component:()=>import("./pages/PlayerStartPage.vue") },
    { path:"/decouvrir/realite/:milieu", component:()=>import("./pages/RealityStartPage.vue") },
    { path:"/decouvrir/realite", component:()=>import("./pages/RealityStartPage.vue") },
    { path:"/decouvrir/:guide", component:()=>import("./pages/PlayerStartPage.vue") },
    { path:"/glossaire", component:()=>import("./pages/GlossaryPage.vue") },
    { path:"/atlas", component:()=>import("./pages/AtlasPage.vue") },
    { path:"/", component:()=>import("./pages/CompendiumPage.vue") },
    { path:"/campaigns", component:()=>import("./pages/CampaignsPage.vue") },
    { path:"/campaigns/:id/play", component:()=>import("./pages/CampaignPlayPage.vue") },
    { path:"/campaigns/:id", component:()=>import("./pages/CampaignsPage.vue") },
    { path:"/account", component:()=>import("./App.vue") },
    { path:"/characters/:id/history", component:()=>import("./pages/CharacterHistoryPage.vue") },
    { path:"/characters/:id/journal", component:()=>import("./pages/CharacterJournalPage.vue") },
    { path:"/characters/:id/play", component:()=>import("./pages/CharacterSheetPage.vue") },
    { path:"/characters/:id/sheet", component:()=>import("./pages/CharacterSheetPage.vue") },
    { path:"/characters/:id/builder", component:()=>import("./pages/CharacterBuilderPage.vue") },
    { path:"/characters/:id/progression", component:()=>import("./pages/CharacterBuilderPage.vue") },
    { path:"/compendium", component:()=>import("./pages/CompendiumPage.vue") },
    { path:"/compendium/new", component:()=>import("./pages/CompendiumEditorPage.vue") },
    { path:"/compendium/edit/:id", component:()=>import("./pages/CompendiumEditorPage.vue") },
    { path:"/admin/quality", component:()=>import("./pages/AdminQualityPage.vue") },
    { path:"/admin/arbitrage", component:()=>import("./pages/CompendiumArbitragePage.vue") },
    { path:"/:pathMatch(.*)*", redirect:"/" }
  ]
});

router.beforeEach((to)=>{
  if (to.path === '/decouvrir/realite' && ['#corpo','#crawler','#gouvernemental','#religieux','#pegre'].includes(to.hash)) return `/decouvrir/realite/${to.hash.slice(1)}`;
  if ((to.path === '/' || to.path === '/compendium') && !to.query.article && (to.query.view === 'guide' || to.query.start === '1')) return '/decouvrir';
  // Stay in the router: a forced document reload also fires beforeunload and
  // asks a second time after an already-approved leave guard.
  document.documentElement.classList.add("route-changing");
});

router.afterEach((to)=>{
  const titles:Record<string,string>={'/':'Compendium','/compendium':'Compendium','/account':'Mon espace','/campaigns':'Campagnes','/atlas':'Atlas','/glossaire':'Glossaire','/decouvrir':'Découvrir','/compendium/new':'Nouvelle page','/admin/quality':'Recette','/admin/arbitrage':'Arbitrage'};
  const section=to.path.endsWith('/builder')?'Création':to.path.endsWith('/progression')?'Progression':to.path.endsWith('/sheet')?'Fiche personnage':to.path.endsWith('/journal')?'Journal':to.path.endsWith('/history')?'Historique':to.path.startsWith('/campaigns/')?'Campagne':to.path.startsWith('/compendium/edit/')?'Édition':to.path.startsWith('/decouvrir/')?'Guide':'Compendium';
  document.title=pageTitle(titles[to.path]??section);
  window.requestAnimationFrame(()=>{
    window.setTimeout(()=>document.documentElement.classList.remove("route-changing"),180);
  });
});

createApp({
  render:()=>h(RouterView,null,{
    default:({Component,route}:any)=>h(Component,{key:route.path === '/' || route.path === '/compendium' ? '/compendium' : route.path})
  })
}).use(router).mount("#app");
