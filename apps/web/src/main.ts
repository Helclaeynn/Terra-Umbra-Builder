import { createApp, h, Transition } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";
import "./style.css";
import "./orbital-ui.css";

const router=createRouter({
  history:createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    // Compendium query navigation manages article sections and reading positions.
    if (to.path !== from.path) return { top: 0, left: 0 };
  },
  routes:[
    { path:"/", component:()=>import("./pages/CompendiumPage.vue") },
    { path:"/account", component:()=>import("./App.vue") },
    { path:"/characters/:id/builder", component:()=>import("./pages/CharacterBuilderPage.vue") },
    { path:"/characters/:id/progression", component:()=>import("./pages/CharacterBuilderPage.vue") },
    { path:"/compendium", component:()=>import("./pages/CompendiumPage.vue") },
    { path:"/compendium/new", component:()=>import("./pages/CompendiumEditorPage.vue") },
    { path:"/compendium/edit/:id", component:()=>import("./pages/CompendiumEditorPage.vue") },
    { path:"/admin/quality", component:()=>import("./pages/AdminQualityPage.vue") },
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
