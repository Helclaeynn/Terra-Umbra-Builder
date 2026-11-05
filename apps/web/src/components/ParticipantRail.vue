<script setup lang="ts">
// Morceau de la table en jeu (CampaignPlayPage.vue) : l'état vient de la page, par useLiveTable().
import PortraitZoom from "./PortraitZoom.vue";
import { ref, watch } from "vue";
import { useLiveTable } from "../lib/live-table";
// Durée restante d'un effet, en clair et en court.
const effectLeft = (e: any, round: number) =>
  e.expires?.unit === "round" && e.expires.at != null
    ? `${Math.max(1, e.expires.at - round + 1)} t.`
    : e.expires?.unit === "scene"
      ? "scène"
      : "";
const hit = ref<Record<string, boolean>>({});
const lastHp = new Map<string, number>();
const lastHealth = new Map<string, number>();
const healthOrder = ["Indemne", "Légèrement blessé", "Blessé", "Gravement blessé", "Agonisant", "Mort"];
const { roster: rosterRef } = useLiveTable();
// Carte touchée : un éclair rouge quand ses PV baissent (pas au premier affichage).
watch(
  () => rosterRef.value.map((c: any) => [c.id, c.hp, healthOrder.indexOf(c.health)] as const),
  (rows) => {
    for (const [cid, hp, level] of rows) {
      const before = lastHp.get(cid),
        beforeLevel = lastHealth.get(cid);
      if (level >= 0) lastHealth.set(cid, level);
      if (
        (typeof hp === "number" && typeof before === "number" && hp < before) ||
        (typeof hp !== "number" && level >= 0 && beforeLevel !== undefined && level > beforeLevel)
      ) {
        hit.value = { ...hit.value, [cid]: true };
        setTimeout(() => (hit.value = { ...hit.value, [cid]: false }), 800);
      }
      if (typeof hp === "number") lastHp.set(cid, hp);
    }
  },
  { immediate: true }
);
const { room, roster, selected, busy, act, id, currentPass, passOf, passHeading, sideLabel, hpLevel, hpRatio, paSlots, inspectActor } = useLiveTable();
</script>
<template>
<aside class="initiative-rail" aria-label="Participants par initiative"><h2>Participants</h2><p>{{ room.combat?.active?`Round ${room.combat.round} · ordre par passe`:'Personnages présents à la table' }}</p>
   <ol><template v-for="(c,index) in roster" :key="c.id"><li v-if="passHeading(index)" class="pass-divider" role="separator">{{ passHeading(index) }}</li><li :class="[{hit:hit[c.id],selected:c.id===selected,hiddenActor:c.visible===false,outOfTurns:c.participating===false,currentPass:currentPass!==null&&c.participating!==false&&passOf(c.id)===currentPass},`side-${c.side??'neutral'}`]"><PortraitZoom v-if="c.portrait" :src="c.portrait" :name="c.name" /><div><span v-if="room.combat?.active&&c.initiative!=null" class="init-badge" :aria-label="`Initiative ${c.initiative}`">{{ c.initiative }}</span><span v-if="currentPass!==null&&c.participating!==false&&passOf(c.id)===currentPass" class="turn-tag">À jouer</span><button v-if="room.canManage" type="button" class="card-pick" :aria-pressed="c.id===selected" :title="`Choisir ${c.name} comme cible`" @click="selected=c.id"><strong>{{ c.name }}</strong></button><strong v-else>{{ c.name }}</strong><small v-if="c.id===selected">{{ c.kind==='character'?[c.occupation,c.sphere].filter(Boolean).join(' · '):c.kind==='npc'?'PNJ':'Créature' }}</small><template v-if="c.hp!==undefined&&c.pvMax"><span class="hp-bar" role="meter" aria-valuemin="0" :aria-valuemax="c.pvMax" :aria-valuenow="c.hp" :aria-label="`Points de vie de ${c.name}`"><span :class="hpLevel(c)" :style="{width:hpRatio(c)*100+'%'}"></span></span><span class="hp-text">{{ c.hp }} / {{ c.pvMax }} PV · {{ c.health }}</span></template><span v-else class="health">{{ c.health }}</span><span v-if="room.combat?.active&&c.pa!==undefined&&paSlots(c)" class="pa-pips" role="img" :aria-label="`${c.pa} PA restants`"><i v-for="n in paSlots(c)" :key="n" :class="{spent:n>c.pa}"></i></span><span v-if="c.effects?.length" class="effect-chips"><span v-for="e in c.effects.slice(0,3)" :key="e.id" :title="e.name+(effectLeft(e,room.combat?.round??0)?' · encore '+effectLeft(e,room.combat?.round??0):'')">{{ e.name }}<template v-if="effectLeft(e,room.combat?.round??0)"> · {{ effectLeft(e,room.combat?.round??0) }}</template></span><span v-if="c.effects.length>3" :title="c.effects.slice(3).map((e:any)=>e.name).join(', ')">+{{ c.effects.length-3 }}</span></span><small>{{sideLabel(c.side)}}<template v-if="c.participating===false"> · Hors des tours</template><template v-else-if="room.combat?.active&&c.initiativePending"> · Initiative à lancer</template></small><small v-if="c.visible===false">Caché aux joueurs</small></div><div class="rail-actions"><button @click="inspectActor(c.id)">{{room.canManage||c.id===room.ownCharacterId?'Actions':'Voir'}}</button><a v-if="room.canManage||c.id===room.ownCharacterId" :href="c.kind==='character'?`/characters/${c.id}/play?campaign=${id}`:`/campaigns/${id}/play?actor=${c.id}`" target="_blank" rel="noopener" :aria-label="`Ouvrir ${c.name} dans un nouvel onglet`">↗</a><button v-if="room.canManage&&room.combat?.active&&c.kind!=='character'&&c.initiativePending&&c.participating!==false" :disabled="busy" @click="act('initiative',{combatantId:c.id,version:c.version})">◈ Initiative</button><button v-if="room.combat?.active&&(room.canManage||c.id===room.ownCharacterId)&&(c.id===selected||c.id===room.ownCharacterId)&&c.participating!==false&&c.pa>0" :disabled="busy" @click="act('spend',{actorId:c.id})">Action hors attaque · 1 PA</button></div></li></template></ol><p v-if="!roster.length">Aucun participant visible.</p>

  </aside>
</template>
<style scoped>
.side-ally :deep(.portrait-trigger){border-color:var(--ui-ally)}
.side-enemy :deep(.portrait-trigger){border-color:var(--ui-enemy)}
.side-neutral :deep(.portrait-trigger){border-color:var(--ui-neutral)}
.initiative-rail li.side-ally{border-left:3px solid var(--ui-ally)}
.initiative-rail li.side-enemy{border-left:3px solid var(--ui-enemy)}
.initiative-rail li.side-neutral{border-left:3px solid var(--ui-neutral)}
.initiative-rail li.outOfTurns{opacity:.7}
.live-page a{color:var(--ui-link)}
.initiative-rail{position:sticky;top:16px;max-height:calc(100vh - 32px);overflow:auto;background:var(--ui-panel);border:1px solid var(--ui-line);border-radius:10px;padding:16px}
.initiative-rail h2{margin:0}
.initiative-rail ol{padding:0;list-style:none}
.initiative-rail li{display:flex;gap:12px;flex-wrap:wrap;border:1px solid var(--ui-line);padding:12px;margin:12px 0;border-radius:8px}
.initiative-rail li.selected{border-color:var(--ui-link);background:var(--ui-raised)}
.initiative-rail li.hiddenActor{border-style:dashed}
.initiative-rail img{width:54px;height:70px;object-fit:cover;border-radius:4px}
.initiative-rail li>div{flex:1;min-width:0}
.initiative-rail small,.health{display:block;margin-top:5px}
.health{color:var(--ui-link)}
.rail-actions{display:grid;grid-template-columns:minmax(0,1fr) 44px;gap:6px;flex-basis:100%!important}
.live-page .rail-actions button{min-height:44px;padding:6px 8px;font-size:var(--ui-text-sm);line-height:1.2;white-space:nowrap;overflow-wrap:normal}
.rail-actions button:last-child:not(:first-child){grid-column:1 / -1}
.rail-actions a{display:grid;place-items:center;min-height:44px;padding:0;box-sizing:border-box}
.initiative-rail li.pass-divider{border:0;border-top:2px solid var(--ui-link-soft);border-radius:0;padding:10px 0 0;font-weight:600}
.live-page label{display:grid;gap:6px;margin:8px 0;min-width:0}
.live-page input:not([type=checkbox]),.live-page textarea,.live-page select{box-sizing:border-box;width:100%;min-width:0;padding:10px;background:var(--ui-input);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit}
.live-page button{padding:10px 14px;min-height:44px;background:var(--ui-btn);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit;cursor:pointer}
.live-page button:disabled{opacity:.5;cursor:default}
.live-page summary{cursor:pointer;padding:14px 0;min-height:24px}
.live-page fieldset{border:1px solid var(--ui-line);border-radius:8px;min-width:0;margin:14px 0}
.live-page :focus-visible{outline:2px solid var(--ui-link);outline-offset:3px}
@media (max-width:800px){.initiative-rail{position:static;max-height:none}}
@media (max-width:800px){.initiative-rail ol{display:flex;gap:12px;overflow-x:auto}}
@media (max-width:800px){.initiative-rail li{min-width:210px;flex:0 0 230px;box-sizing:border-box}}
@media (max-width:800px){.initiative-rail li.pass-divider{min-width:80px;flex-basis:80px;border-top:0;border-left:2px solid var(--ui-link-soft);padding:10px}}
.initiative-rail li{padding:10px;margin:8px 0;gap:8px}
.initiative-rail small,.health{margin-top:3px}
.initiative-rail .rail-actions{gap:4px}
@media (max-width:800px){.initiative-rail{padding:10px}}
@media (max-width:800px){.initiative-rail h2{font-size:var(--ui-text-base)}}
@media (max-width:800px){.initiative-rail>p{font-size:var(--ui-text-sm);margin:5px 0}}
@media (max-width:800px){.initiative-rail ol{margin:4px 0}}
@media (max-width:800px){.initiative-rail li{flex-basis:205px;min-width:190px}}
@media (max-width:800px){.initiative-rail li.pass-divider{flex-basis:70px;min-width:70px}}
.initiative-rail{grid-area:roster;position:static;max-height:calc(100dvh - 235px);overflow:auto;border:0;background:var(--ui-panel);padding:10px;border-radius:14px}
.initiative-rail h2{font-size:var(--ui-text-sm)}
.initiative-rail>p{font-size:var(--ui-text-xs);color:var(--ui-muted)}
.initiative-rail li{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 6px;border:1px solid var(--ui-line);border-left:3px solid #a99d77;border-radius:10px;text-align:center;background:var(--ui-panel-2)}
.initiative-rail li.side-ally{border-left-color:var(--ui-ally)}
.initiative-rail li.side-enemy{border-left-color:var(--ui-enemy)}
.initiative-rail li.selected{background:var(--ui-accent-bg);border-top-color:var(--ui-accent);border-bottom-color:var(--ui-accent)}
.initiative-rail li strong{font-size:var(--ui-text-sm)}
.initiative-rail li small,.initiative-rail .health{font-size:var(--ui-text-xs);color:var(--ui-accent-soft)}
.initiative-rail .rail-actions{justify-content:center}
.initiative-rail .rail-actions button{font-size:var(--ui-text-xs);padding:6px 9px}
.initiative-rail li.pass-divider{display:block;padding:5px 0;background:none;border:0;font-size:var(--ui-text-xs)}
@media (max-width:1100px){.initiative-rail{padding:7px}}
@media (max-width:850px){.initiative-rail{max-height:none;overflow:visible;padding:8px}}
@media (max-width:850px){.initiative-rail h2,.initiative-rail>p{display:none}}
@media (max-width:850px){.initiative-rail ol{display:flex;gap:8px;overflow-x:auto;margin:0;align-items:stretch}}
@media (max-width:850px){.initiative-rail li{flex:0 0 100px;min-width:100px;margin:0;padding:7px}}
@media (max-width:850px){.initiative-rail li.pass-divider{flex-basis:50px;min-width:50px;align-self:center}}
@media (max-width:850px){.initiative-rail li small{display:none}}
@media (max-width:850px){.initiative-rail .rail-actions a{display:none}}
@media (max-width:850px){.initiative-rail ol{scroll-snap-type:x proximity;-webkit-mask-image:linear-gradient(to right,#000 82%,transparent);mask-image:linear-gradient(to right,#000 82%,transparent);padding-right:40px}}
@media (max-width:850px){.initiative-rail li{scroll-snap-align:start}}
.initiative-rail li{position:relative}
.initiative-rail li>div:not(.rail-actions){display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}
.init-badge{position:absolute;top:6px;right:6px;min-width:24px;padding:1px 5px;border-radius:999px;background:var(--ui-raised);border:1px solid var(--ui-line-strong);color:var(--ui-link);font-size:var(--ui-text-xs);font-weight:700}
.turn-tag{align-self:center;padding:1px 8px;border-radius:999px;background:var(--ui-accent);color:var(--ui-accent-on);font-size:var(--ui-text-xs);font-weight:700}
.initiative-rail li.currentPass{box-shadow:0 0 0 2px var(--ui-accent)}
.hp-bar{display:block;width:100%;height:6px;margin-top:4px;border-radius:3px;background:var(--ui-input);border:1px solid var(--ui-line);overflow:hidden}
.hp-bar>span{display:block;height:100%;transition:width .3s}
.hp-bar .ok{background:var(--ui-ally)}
.hp-bar .low{background:var(--ui-warn)}
.hp-bar .critical,.hp-bar .down{background:var(--ui-enemy)}
.hp-text{font-size:var(--ui-text-xs);color:var(--ui-ink-soft)}
.pa-pips{display:flex;gap:3px;justify-content:center}
.pa-pips i{width:9px;height:9px;border-radius:50%;background:var(--ui-link);border:1px solid var(--ui-link)}
.pa-pips i.spent{background:transparent;border-color:var(--ui-line-strong)}
.effect-chips{display:flex;flex-wrap:wrap;gap:3px;justify-content:center;max-width:100%}
.effect-chips>span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 6px;border-radius:999px;background:var(--ui-warn-bg);color:var(--ui-warn-ink);font-size:var(--ui-text-xs)}
@media (max-width:850px){.init-badge{top:3px;right:3px}}
@media (max-width:850px){.hp-text{display:none}}
.live-page button.card-pick{min-height:0;padding:0;background:none;border:0;color:inherit;font:inherit;text-decoration:underline dotted;text-underline-offset:3px}
.live-page button.card-pick[aria-pressed=true]{color:var(--ui-link)}
.initiative-rail li{flex-wrap:nowrap}
.initiative-rail li>div{width:100%;flex:0 0 auto}
.initiative-rail .rail-actions{display:flex;flex-wrap:wrap;flex-basis:auto!important;gap:4px;width:100%;justify-content:center}
.initiative-rail .rail-actions button{max-width:100%;white-space:normal}
.initiative-rail .rail-actions a{width:30px;min-width:30px}
.initiative-rail li.currentPass{animation:turn-pulse 1.6s ease-out 3}@keyframes turn-pulse{0%{box-shadow:0 0 0 0 #81cbbbaa}70%{box-shadow:0 0 0 10px #81cbbb00}100%{box-shadow:0 0 0 2px var(--ui-accent)}}.initiative-rail li.hit{animation:hit-flash .8s ease-out}@keyframes hit-flash{20%{box-shadow:0 0 0 2px var(--ui-enemy),0 0 18px #d58b8488}100%{box-shadow:none}}.hp-bar>span{transition:width .5s ease-in-out}@media(prefers-reduced-motion:reduce){.initiative-rail li.currentPass,.initiative-rail li.hit{animation:none}.hp-bar>span{transition:none}}</style>
