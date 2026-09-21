import { createApp, h, Transition } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";
import "./style.css";

const router=createRouter({
  history:createWebHistory(),
  routes:[
    { path:"/", component:()=>import("./pages/CompendiumPage.vue") },
    { path:"/account", component:()=>import("./App.vue") },
    { path:"/characters/:id/builder", component:()=>import("./pages/CharacterBuilderPage.vue") },
    { path:"/characters/:id/progression", component:()=>import("./pages/CharacterBuilderPage.vue") },
    { path:"/compendium", component:()=>import("./pages/CompendiumPage.vue") },
    { path:"/compendium/new", component:()=>import("./pages/CompendiumEditorPage.vue") },
    { path:"/compendium/edit/:id", component:()=>import("./pages/CompendiumEditorPage.vue") },
    { path:"/admin/quality", component:()=>import("./pages/AdminQualityPage.vue") },
    { path:"/style-lab", redirect:"/style-lab/interface-2035/builder" },
    { path:"/style-lab/:theme/:view?", component:()=>import("./pages/StyleLabPage.vue") },
    { path:"/:pathMatch(.*)*", redirect:"/" }
  ]
});

router.beforeEach(()=>{
  document.documentElement.classList.add("route-changing");
});

router.afterEach(()=>{
  window.requestAnimationFrame(()=>{
    window.setTimeout(()=>document.documentElement.classList.remove("route-changing"),180);
  });
});

createApp({
  render:()=>h(RouterView,null,{
    default:({Component,route}:any)=>h(
      Transition,
      {name:"route",mode:"out-in"},
      ()=>h(Component,{key:route.path})
    )
  })
}).use(router).mount("#app");
