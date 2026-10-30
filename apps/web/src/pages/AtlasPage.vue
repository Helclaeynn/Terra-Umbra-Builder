<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import raw from '../lib/atlas-data.json';
import { compendiumHref } from '../lib/compendium-navigation';
type Place={id:string;name:string;category:string;description:string;rank:number;positions:Record<string,number[]>;articleId:string|null;articleTitle?:string;linkLabel:string};
type View={id:string;title:string;region:string;image:string;aspect:number;crop:number[];poster:string;thumb:string;description:string};
const data=raw as unknown as {views:View[];features:Place[];gallery:{id:string;title:string;image:string;thumb:string;width:number;height:number;region:string}[]};
const route=useRoute(),router=useRouter();
const current=computed(()=>data.views.find(v=>v.id===route.query.map)||data.views[0]);
const viewport=ref<HTMLElement>(),canvas=ref<HTMLCanvasElement>();
const query=ref(''),selected=ref<Place|null>(null),loading=ref(true),error=ref(''),labels=ref<{place:Place;x:number;y:number;showName:boolean}[]>([]);
const categories=computed(()=>Array.from(new Set(data.features.filter(f=>f.positions[current.value.id]).map(f=>f.category))));
const hidden=ref<string[]>([]),showPanel=ref(false);
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const filtered=computed(()=>data.features.filter(f=>f.positions[current.value.id]&&!hidden.value.includes(f.category)&&(!query.value||normalize(f.name+' '+f.description+' '+f.category).includes(normalize(query.value)))).sort((a,b)=>a.rank-b.rank||a.name.localeCompare(b.name,'fr')));
const colors:Record<string,string>={'Enders et fermes':'#246558','Villes':'#193647','Corporations':'#9b631e','Agriculture':'#797028','Friches':'#9b443a','Motards':'#715376','Casinos':'#b07c24','Nature':'#44788c','Institutions':'#167a9e','Cultes':'#7e519d','Pègre':'#a1289b','Quartiers et lieux':'#526b7c'};
let image:HTMLImageElement|null=null,loadGeneration=0,observer:ResizeObserver|undefined,frame=0;
let width=1,height=1,zoom=1,tx=0,ty=0,fitZoom=1;
let drag:{id:number;x:number;y:number;tx:number;ty:number}|null=null;
let pointers=new Map<number,{x:number;y:number}>(),pinch:{distance:number;zoom:number;anchorX:number;anchorY:number}|null=null;
function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);}
function draw(){
 const c=canvas.value,ctx=c?.getContext('2d');if(!c||!ctx)return;
 const dpr=Math.min(devicePixelRatio||1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#102c3b';ctx.fillRect(0,0,width,height);
 if(!image||loading.value){labels.value=[];return;}
 const [x0,y0,x1,y1]=current.value.crop;ctx.drawImage(image,x0*image.width,y0*image.height,(x1-x0)*image.width,(y1-y0)*image.height,tx,ty,zoom,zoom/current.value.aspect);
 const boxes:number[][]=[],out:{place:Place;x:number;y:number;showName:boolean}[]=[];
 const order=[...filtered.value].sort((a,b)=>(a.id===selected.value?.id?-10:a.rank)-(b.id===selected.value?.id?-10:b.rank));
 for(const place of order){
  const p=place.positions[current.value.id];const x=tx+p[0]*zoom,y=ty+p[1]*zoom/current.value.aspect;
  if(x<8||y<8||x>width-8||y>height-8)continue;
  ctx.font=(place.rank===0?'bold ':'')+'15px system-ui';const tw=Math.min(ctx.measureText(place.name).width,260),left=x+10;
  const box=[left-3,y-22,left+tw+10,y+3];
  const showName=box[2]<width-6&&box[1]>6&&!boxes.some(b=>box[0]<b[2]&&box[2]>b[0]&&box[1]<b[3]&&box[3]>b[1]);
  if(showName)boxes.push(box);
  out.push({place,x,y,showName});
 }
 labels.value=out;
}
function resize(){if(!viewport.value||!canvas.value)return;const oldW=width,oldH=height;const initial=width===1;width=viewport.value.clientWidth;height=viewport.value.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.value.width=Math.round(width*dpr);canvas.value.height=Math.round(height*dpr);fitZoom=Math.min(width,height*current.value.aspect)*.95;if(initial)fit();else{tx+=(width-oldW)/2;ty+=(height-oldH)/2;schedule();}}
function fit(){fitZoom=Math.min(width,height*current.value.aspect)*.95;zoom=fitZoom;tx=(width-zoom)/2;ty=(height-zoom/current.value.aspect)/2;schedule();}
function changeZoom(factor:number,x=width/2,y=height/2){const old=zoom;zoom=Math.max(fitZoom*.65,Math.min(16000,zoom*factor));tx=x-(x-tx)*zoom/old;ty=y-(y-ty)*zoom/old;schedule();}
function wheel(e:WheelEvent){const r=viewport.value!.getBoundingClientRect();changeZoom(Math.exp(-Math.max(-300,Math.min(300,e.deltaY))*.0015),e.clientX-r.left,e.clientY-r.top);}
function pointerDown(e:PointerEvent){if(e.target!==canvas.value)return;canvas.value!.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});drag={id:e.pointerId,x:e.clientX,y:e.clientY,tx,ty};if(pointers.size===2){const [a,b]=[...pointers.values()],r=viewport.value!.getBoundingClientRect();const mx=(a.x+b.x)/2-r.left,my=(a.y+b.y)/2-r.top;pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom,anchorX:(mx-tx)/zoom,anchorY:(my-ty)/zoom};}}
function pointerMove(e:PointerEvent){if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&pinch){const [a,b]=[...pointers.values()],r=viewport.value!.getBoundingClientRect();zoom=Math.max(fitZoom*.65,Math.min(16000,pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.distance)));tx=(a.x+b.x)/2-r.left-pinch.anchorX*zoom;ty=(a.y+b.y)/2-r.top-pinch.anchorY*zoom;}else if(drag){tx=drag.tx+e.clientX-drag.x;ty=drag.ty+e.clientY-drag.y;}schedule();}
function pointerUp(e:PointerEvent){pointers.delete(e.pointerId);pinch=null;const next=pointers.entries().next().value as [number,{x:number;y:number}]|undefined;drag=next?{id:next[0],x:next[1].x,y:next[1].y,tx,ty}:null;}
function keyboard(e:KeyboardEvent){const dirs:Record<string,number[]>={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]};if(dirs[e.key]){e.preventDefault();tx+=dirs[e.key][0];ty+=dirs[e.key][1];schedule();}else if(e.key==='+'||e.key==='=')changeZoom(1.4);else if(e.key==='-')changeZoom(1/1.4);else if(e.key==='Home')fit();}
function toggle(category:string){hidden.value=hidden.value.includes(category)?hidden.value.filter(c=>c!==category):[...hidden.value,category];}
function center(place:Place){selected.value=place;const p=place.positions[current.value.id];if(!p)return;zoom=Math.max(fitZoom*3,1200);tx=width/2-p[0]*zoom;ty=height/2-p[1]*zoom/current.value.aspect;schedule();}
function choose(place:Place,notice=false){center(place);showPanel.value=notice;void router.replace({path:'/atlas',query:{map:current.value.id,spot:place.id},hash:route.hash});}
function setView(id:string){selected.value=null;query.value='';hidden.value=[];void router.push({path:'/atlas',query:{map:id}});}
async function load(){
 const generation=++loadGeneration;loading.value=true;error.value='';labels.value=[];await nextTick();resize();
 const next=new Image();next.decoding='async';
 next.onload=()=>{if(generation!==loadGeneration)return;image=next;loading.value=false;fit();const spot=data.features.find(f=>f.id===route.query.spot&&f.positions[current.value.id]);if(spot)center(spot);};
 next.onerror=()=>{if(generation!==loadGeneration)return;image=null;loading.value=false;error.value='Le fond de carte n’a pas pu être chargé.';};next.src=current.value.image;
}
watch(()=>current.value.id,load);watch(filtered,schedule);watch(()=>route.query.spot,()=>{const f=data.features.find(f=>f.id===route.query.spot&&f.positions[current.value.id]);if(f&&!loading.value)center(f);});
onMounted(()=>{observer=new ResizeObserver(resize);if(viewport.value)observer.observe(viewport.value);void load();});
onBeforeUnmount(()=>{loadGeneration++;observer?.disconnect();cancelAnimationFrame(frame);image=null;pointers.clear();});
</script>

<template>
 <div class="atlas-page">
  <header class="atlas-header"><div><span>TERRA UMBRA CALIFORNIA</span><h1>Atlas des territoires</h1></div><nav aria-label="Navigation principale"><RouterLink to="/compendium">Compendium</RouterLink><a href="#cartes-classiques">Cartes classiques</a><RouterLink to="/account">Mon espace</RouterLink></nav></header>
  <div class="atlas-intro"><p>Explorez les territoires, puis cliquez sur un lieu lié pour lire son article. Les repères sans fiche ouvrent une notice.</p><button class="mobile-controls" @click="showPanel=!showPanel" :aria-expanded="showPanel">Lieux et recherche</button></div>
  <section class="atlas-explorer" aria-label="Atlas navigable">
   <aside class="atlas-panel" :class="{expanded:showPanel}">
    <label>Carte<select :value="current.id" @change="setView(($event.target as HTMLSelectElement).value)"><optgroup label="Grande Californie"><option v-for="v in data.views.filter(v=>v.region==='regional')" :key="v.id" :value="v.id">{{v.title}}</option></optgroup><optgroup label="Los Angeles"><option v-for="v in data.views.filter(v=>v.region==='la')" :key="v.id" :value="v.id">{{v.title}}</option></optgroup></select></label>
    <label>Rechercher un lieu<input v-model="query" type="search" placeholder="Fermes Mannan, Raven, LAUS…" /></label>
    <details class="atlas-filters"><summary>Repères affichés</summary><label v-for="cat in categories" :key="cat"><input type="checkbox" :checked="!hidden.includes(cat)" @change="toggle(cat)"/><i :style="{background:colors[cat]}"></i>{{cat}}</label><small>Filtre les repères ; les zones du fond restent visibles.</small></details>
    <div class="atlas-results" aria-label="Lieux de la carte"><p v-if="!filtered.length">Aucun lieu trouvé.</p><div v-for="f in filtered" :key="f.id" class="atlas-result"><button type="button" @click="choose(f)" :aria-label="`Centrer sur ${f.name}`">{{f.name}}</button><RouterLink v-if="f.articleId" :to="compendiumHref(f.articleId)" :aria-label="`Lire ${f.articleTitle}`" :title="f.linkLabel">Lire ↗</RouterLink></div></div>
    <div v-if="selected" class="atlas-detail" aria-live="polite"><strong>{{selected.name}}</strong><p>{{selected.description}}</p><RouterLink v-if="selected.articleId" :to="compendiumHref(selected.articleId)">{{selected.linkLabel}} ↗</RouterLink><small v-else>Pas de fiche dédiée liée à ce repère.</small></div>
    <a :href="current.poster" target="_blank" rel="noopener">Ouvrir la carte imprimable ↗</a>
   </aside>
   <div ref="viewport" class="atlas-viewport" @wheel.prevent="wheel">
    <canvas ref="canvas" tabindex="0" :aria-label="`${current.title}. Déplacement avec les flèches, zoom avec plus et moins. Lieux accessibles dans la liste.`" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="pointerUp" @keydown="keyboard"></canvas>
    <div class="atlas-marker-layer">
     <template v-for="l in labels" :key="l.place.id">
      <RouterLink v-if="l.place.articleId" class="atlas-marker" :class="{named:l.showName}" :to="compendiumHref(l.place.articleId)" :style="{left:`${l.x}px`,top:`${l.y}px`,'--marker':colors[l.place.category]}" :title="l.place.name+' — '+l.place.linkLabel" :aria-label="l.place.name+' — '+l.place.linkLabel"><span class="atlas-dot"></span><span v-if="l.showName" class="atlas-label">{{l.place.name}}</span></RouterLink>
      <button v-else type="button" class="atlas-marker" :class="{named:l.showName}" :style="{left:`${l.x}px`,top:`${l.y}px`,'--marker':colors[l.place.category]}" @click="choose(l.place,true)" :title="l.place.name" :aria-label="`Notice : ${l.place.name}`"><span class="atlas-dot"></span><span v-if="l.showName" class="atlas-label">{{l.place.name}}</span></button>
     </template>
    </div>
    <div class="atlas-zoom"><button type="button" aria-label="Dézoomer" @click="changeZoom(1/1.5)">−</button><button type="button" aria-label="Zoomer" @click="changeZoom(1.5)">+</button><button type="button" @click="fit">Vue entière</button></div>
    <p v-if="loading" class="atlas-state" role="status">Chargement de la carte…</p><div v-else-if="error" class="atlas-state" role="alert">{{error}} <button @click="load">Réessayer</button></div>
    <small class="atlas-map-caption">{{current.title}} · {{filtered.length}} repères · glisser ou pincer pour explorer</small>
   </div>
  </section>
  <p class="atlas-note">{{current.description}} Les implantations proposées ne fixent pas le canon. Les liens mènent aux articles des lieux, communautés ou organisations concernés.</p>
  <section id="cartes-classiques" class="atlas-classic" aria-labelledby="classic-title"><h2 id="classic-title">Cartes classiques et impression</h2><p>Les vues illustrées de Los Angeles et les cartes régionales restent disponibles en grande définition. Les grands fichiers se chargent uniquement à l’ouverture.</p><div class="atlas-gallery"><article v-for="g in data.gallery" :key="g.id"><a :href="g.image" target="_blank" rel="noopener"><img :src="g.thumb" :alt="g.title" loading="lazy" width="350" height="240" /></a><h3>{{g.title}}</h3><p>{{g.width.toLocaleString('fr-FR')}} × {{g.height.toLocaleString('fr-FR')}} pixels</p><a :href="g.image" download> Télécharger le JPEG</a><RouterLink :to="{path:'/atlas',query:{map:g.id}}">Explorer la carte</RouterLink></article></div></section>
  <footer class="atlas-footer"><p>Grande Californie : Esri © 2014, Natural Earth, US Census 2020, US Forest Service. Los Angeles : carte illustrée validée, implantations interprétées. Les agrandissements de LA conservent le détail de l’illustration d’origine.</p><a href="/map-assets/v1/notice-regionale.txt" target="_blank" rel="noopener">Notice régionale</a> · <a href="/map-assets/v1/notice-los-angeles.txt" target="_blank" rel="noopener">Notice de Los Angeles</a></footer>
 </div>
</template>

<style scoped>
.atlas-page{--ink:#edf1e8;--panel:#102c3b;color:var(--ink);background:#091e2a;min-height:100vh;padding:24px clamp(14px,3vw,48px);font-family:Inter,'Segoe UI',sans-serif}.atlas-page a{color:#e8c984}.atlas-header{display:flex;justify-content:space-between;align-items:center;gap:24px;border-bottom:1px solid #405766;padding-bottom:18px}.atlas-header span{font-size:11px;letter-spacing:.17em;color:#aac1c9}.atlas-header h1{font:500 clamp(24px,3vw,38px)/1.2 Georgia,serif;margin:6px 0}.atlas-header nav{display:flex;gap:20px;flex-wrap:wrap}.atlas-intro{display:flex;justify-content:space-between;gap:15px;align-items:center}.atlas-intro p,.atlas-note,.atlas-classic>p,.atlas-footer{color:#b9cbd0;font-size:14px;line-height:1.6}.atlas-explorer{display:flex;height:min(820px,80vh);min-height:520px;border:1px solid #45606d;border-radius:8px;overflow:hidden}.atlas-panel{display:flex;flex-direction:column;gap:13px;padding:18px;width:300px;flex-shrink:0;background:#102c3b;overflow:hidden}.atlas-panel>label{display:grid;gap:6px;font-size:12px;color:#c4d4d6}.atlas-panel select,.atlas-panel input[type=search]{background:#203f4e;border:1px solid #66808a;color:#fff;border-radius:5px;padding:10px;width:100%;font:14px inherit}.atlas-filters{font-size:12px}.atlas-filters summary{cursor:pointer;margin-bottom:8px}.atlas-filters label{display:inline-flex;gap:5px;align-items:center;min-width:48%;margin-bottom:6px}.atlas-filters input{accent-color:#d9ba76}.atlas-filters i{width:9px;height:9px;border-radius:50%}.atlas-filters small{display:block;color:#9db5be}.atlas-results{overflow:auto;min-height:90px;flex:1}.atlas-result{display:flex;align-items:center;border-bottom:1px solid #304b57;gap:8px}.atlas-result button{background:none;border:0;color:#e9efea;font-size:13px;flex:1;text-align:left;padding:11px 0;cursor:pointer;min-width:0}.atlas-result a{font-size:12px;white-space:nowrap}.atlas-detail{background:#203f4e;border-left:3px solid #c2a165;padding:12px;font-size:13px;max-height:185px;overflow:auto;line-height:1.5}.atlas-detail p{margin:8px 0}.atlas-detail small{color:#bcd0d3}.atlas-panel>a{font-size:13px}.atlas-viewport{flex:1;position:relative;min-width:0;background:#102c3b;overflow:hidden}.atlas-viewport canvas{display:block;width:100%;height:100%;touch-action:none;cursor:grab}.atlas-viewport canvas:active{cursor:grabbing}.atlas-marker-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}.atlas-marker{position:absolute;transform:translate(-10px,-10px);height:22px;min-width:22px;padding:0!important;margin:0;border:0;background:none!important;pointer-events:auto;cursor:pointer;z-index:1;color:var(--marker)!important;box-shadow:none!important;border-radius:0;line-height:1;text-decoration:none;outline-offset:4px}.atlas-marker.named{z-index:2}.atlas-dot{position:absolute;left:5px;top:5px;width:10px;height:10px;background:var(--marker);border:1.5px solid #fff0cf;border-radius:50%}.atlas-label{position:absolute;left:20px;top:-10px;white-space:nowrap;max-width:270px;text-overflow:ellipsis;overflow:hidden;background:#fbf5e3ed;color:var(--marker);font:600 15px/22px system-ui;padding:1px 4px;border-radius:2px}.atlas-marker:hover,.atlas-marker:focus{z-index:5}.atlas-marker:focus .atlas-label{outline:2px solid #c5943c}.atlas-zoom{position:absolute;right:12px;top:12px;display:flex;gap:5px;z-index:6}.atlas-zoom button,.atlas-state button,.mobile-controls{background:#142f40;color:#fff;border:1px solid #6b8791;border-radius:5px;padding:8px 12px;cursor:pointer}.atlas-map-caption{position:absolute;bottom:8px;left:8px;background:#102c3bdc;padding:6px 10px;pointer-events:none;font-size:11px;color:#d2dfdf;max-width:calc(100% - 16px)}.atlas-state{position:absolute;top:40%;left:10%;right:10%;background:#102c3b;padding:20px;text-align:center}.atlas-classic{scroll-margin-top:20px;margin-top:40px}.atlas-classic h2{font:500 28px Georgia,serif}.atlas-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px}.atlas-gallery article{background:#102c3b;border:1px solid #35515d;padding:14px;border-radius:6px}.atlas-gallery img{width:100%;height:240px;object-fit:contain;background:#0a2230}.atlas-gallery h3{font-size:17px;margin:12px 0}.atlas-gallery p{font-size:12px;color:#a8c0c8}.atlas-gallery article>a,.atlas-gallery article>.router-link-active{display:block;font-size:13px;margin-top:8px}.atlas-footer{margin-top:32px;padding-top:16px;border-top:1px solid #35515d}.mobile-controls{display:none}.atlas-page :focus-visible{outline:2px solid #f1ce79;outline-offset:3px}@media(max-width:800px){.atlas-header{align-items:flex-start;flex-direction:column;gap:10px}.atlas-header nav{font-size:13px}.atlas-page{padding:14px}.atlas-explorer{position:relative;height:72vh;min-height:480px}.atlas-panel{display:none;position:absolute;inset:0 auto 0 0;z-index:10;width:min(300px,85%)}.atlas-panel.expanded{display:flex}.mobile-controls{display:block;flex-shrink:0}.atlas-intro p{font-size:12px}.atlas-gallery{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.atlas-header h1{font-size:28px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style>
