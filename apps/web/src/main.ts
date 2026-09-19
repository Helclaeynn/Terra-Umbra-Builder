import { createApp, h, Transition } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";
import App from "./App.vue";
import CharacterBuilderPage from "./pages/CharacterBuilderPage.vue";
import CompendiumPage from "./pages/CompendiumPage.vue";
import CompendiumEditorPage from "./pages/CompendiumEditorPage.vue";
import "./style.css";

const router=createRouter({
  history:createWebHistory(),
  routes:[
    { path:"/", component:App },
    { path:"/characters/:id/builder", component:CharacterBuilderPage },
    { path:"/compendium", component:CompendiumPage },
    { path:"/compendium/new", component:CompendiumEditorPage },
    { path:"/compendium/edit/:id", component:CompendiumEditorPage },
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
