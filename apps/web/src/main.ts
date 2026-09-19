import { createApp, h } from "vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";
import App from "./App.vue";
import CharacterBuilderPage from "./pages/CharacterBuilderPage.vue";
import CompendiumPage from "./pages/CompendiumPage.vue";
import "./style.css";

const router=createRouter({
  history:createWebHistory(),
  routes:[
    { path:"/", component:App },
    { path:"/characters/:id/builder", component:CharacterBuilderPage },
    { path:"/compendium", component:CompendiumPage },
    { path:"/:pathMatch(.*)*", redirect:"/" }
  ]
});

createApp({
  render:()=>h(RouterView)
}).use(router).mount("#app");
