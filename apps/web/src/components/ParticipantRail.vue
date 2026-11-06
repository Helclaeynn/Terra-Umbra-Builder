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
// Soins : éclair vert ; tout changement de PV visible : le chiffre flotte sur la ligne (« −7 », « +3 »).
const healed = ref<Record<string, boolean>>({});
const delta = ref<Record<string, { value: number; key: number }>>({});
const lastHp = new Map<string, number>();
const lastHealth = new Map<string, number>();
const healthOrder = ["Indemne", "Légèrement blessé", "Blessé", "Gravement blessé", "Agonisant", "Mort"];
const { roster: rosterRef } = useLiveTable();
// Carte touchée : un éclair rouge quand ses PV baissent, ou, sans PV visibles, quand son état empire (pas au premier affichage).
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
      if (typeof hp === "number" && typeof before === "number" && hp !== before) {
        const key = Date.now();
        delta.value = { ...delta.value, [cid]: { value: hp - before, key } };
        setTimeout(() => { if (delta.value[cid]?.key === key) { const next = { ...delta.value }; delete next[cid]; delta.value = next; } }, 1500);
        if (hp > before) {
          healed.value = { ...healed.value, [cid]: true };
          setTimeout(() => (healed.value = { ...healed.value, [cid]: false }), 900);
        }
      }
      if (typeof hp === "number") lastHp.set(cid, hp);
    }
  },
  { immediate: true }
);
const { room, roster, selected, busy, act, id, currentPass, passOf, passHeading, sideLabel, hpLevel, hpRatio, paSlots, inspectActor } = useLiveTable();
const isTurn = (c: any) => currentPass.value !== null && c.participating !== false && passOf(c.id) === currentPass.value;
const canInit = (c: any) => room.value.canManage && room.value.combat?.active && c.kind !== "character" && c.initiativePending && c.participating !== false;
const canSpend = (c: any) =>
  room.value.combat?.active &&
  (room.value.canManage || c.id === room.value.ownCharacterId) &&
  (c.id === selected.value || c.id === room.value.ownCharacterId) &&
  c.participating !== false &&
  c.pa > 0;
</script>
<template>
<aside class="initiative-rail" aria-label="Participants par initiative"><h2>Participants</h2><p>{{ room.combat?.active?`Round ${room.combat.round} · ordre par passe`:'Personnages présents à la table' }}</p>
  <TransitionGroup tag="ol" name="rail"><template v-for="(c,index) in roster" :key="c.id"><li v-if="passHeading(index)" class="pass-divider" role="separator">{{ passHeading(index) }}</li>
    <li :class="[{hit:hit[c.id],healed:healed[c.id],selected:c.id===selected,hiddenActor:c.visible===false,outOfTurns:c.participating===false,currentPass:isTurn(c)},`side-${c.side??'neutral'}`]" :title="sideLabel(c.side)">
      <span v-if="delta[c.id]" :key="delta[c.id].key" class="hp-float" :class="delta[c.id].value > 0 ? 'heal' : 'dmg'" aria-hidden="true">{{ delta[c.id].value > 0 ? "+" : "−" }}{{ Math.abs(delta[c.id].value) }}</span>
      <div class="rail-face"><PortraitZoom v-if="c.portrait" :src="c.portrait" :name="c.name" /><span v-else class="rail-monogram" aria-hidden="true">{{ c.name?.[0] }}</span><span v-if="room.combat?.active&&c.initiative!=null" class="init-badge" :aria-label="`Initiative ${c.initiative}`">{{ c.initiative }}</span></div>
      <div class="rail-body">
        <span class="rail-name"><button v-if="room.canManage" type="button" class="card-pick" :aria-pressed="c.id===selected" :title="`Choisir ${c.name} comme cible`" @click="selected=c.id"><strong>{{ c.name }}</strong></button><strong v-else>{{ c.name }}</strong><span v-if="isTurn(c)" class="turn-tag">À jouer</span></span>
        <template v-if="c.hp!==undefined&&c.pvMax"><span class="hp-bar" role="meter" aria-valuemin="0" :aria-valuemax="c.pvMax" :aria-valuenow="c.hp" :aria-label="`Points de vie de ${c.name}`"><span :class="hpLevel(c)" :style="{width:hpRatio(c)*100+'%'}"></span></span><span class="hp-text" :title="`${c.hp} / ${c.pvMax} PV · ${c.health}`">{{ c.hp }} / {{ c.pvMax }} PV · {{ c.health }}</span></template><span v-else class="health">{{ c.health }}</span>
        <span v-if="room.combat?.active&&c.pa!==undefined&&paSlots(c)" class="pa-pips" role="img" :aria-label="`${c.pa} PA restants`"><i v-for="n in paSlots(c)" :key="n" :class="{spent:n>c.pa}"></i></span>
        <span v-if="c.effects?.length" class="effect-chips"><span v-for="e in c.effects.slice(0,3)" :key="e.id" :title="e.name+(effectLeft(e,room.combat?.round??0)?' · encore '+effectLeft(e,room.combat?.round??0):'')">{{ e.name }}<template v-if="effectLeft(e,room.combat?.round??0)"> · {{ effectLeft(e,room.combat?.round??0) }}</template></span><span v-if="c.effects.length>3" :title="c.effects.slice(3).map((e:any)=>e.name).join(', ')">+{{ c.effects.length-3 }}</span></span>
        <small v-if="c.participating===false||(room.combat?.active&&c.initiativePending)" class="rail-note">{{ c.participating===false?'Hors des tours':'Initiative à lancer' }}</small>
        <small v-if="c.visible===false" class="rail-note">Caché aux joueurs</small>
        <span class="sr-only">{{ sideLabel(c.side) }}</span>
      </div>
      <div class="rail-actions"><button @click="inspectActor(c.id)">{{room.canManage||c.id===room.ownCharacterId?'Actions':'Voir'}}</button><a v-if="room.canManage||c.id===room.ownCharacterId" :href="c.kind==='character'?`/characters/${c.id}/play?campaign=${id}`:`/campaigns/${id}/play?actor=${c.id}`" target="_blank" rel="noopener" :aria-label="`Ouvrir ${c.name} dans un nouvel onglet`" title="Nouvel onglet">↗</a></div>
      <div v-if="canInit(c)||canSpend(c)" class="rail-extra"><button v-if="canInit(c)" :disabled="busy" @click="act('initiative',{combatantId:c.id,version:c.version})">◈ Initiative</button><button v-if="canSpend(c)" :disabled="busy" @click="act('spend',{actorId:c.id})">Action hors attaque · 1 PA</button></div>
    </li></template></TransitionGroup><p v-if="!roster.length">Aucun participant visible.</p>
  </aside>
</template>
<style scoped>
/* Une ligne par participant : portrait, nom et santé, actions. */
.initiative-rail{grid-area:roster;min-width:0;max-height:calc(100dvh - 235px);overflow:auto;background:var(--ui-panel);padding:10px;border-radius:14px}
.initiative-rail h2{margin:0;font-size:var(--ui-text-sm)}
.initiative-rail>p{margin:4px 0 0;font-size:var(--ui-text-xs);color:var(--ui-muted)}
.initiative-rail ol{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
.initiative-rail li:not(.pass-divider){position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:6px 10px;padding:7px 8px;border:1px solid var(--ui-line);border-left:3px solid var(--ui-neutral);border-radius:10px;background:var(--ui-panel-2)}
.initiative-rail li.side-ally{border-left-color:var(--ui-ally)}
.initiative-rail li.side-enemy{border-left-color:var(--ui-enemy)}
.initiative-rail li.selected{background:var(--ui-accent-bg);border-top-color:var(--ui-accent);border-right-color:var(--ui-accent);border-bottom-color:var(--ui-accent)}
.initiative-rail li.hiddenActor{border-style:dashed}
.initiative-rail li.outOfTurns{opacity:.7}
.initiative-rail li.currentPass{box-shadow:0 0 0 2px var(--ui-accent)}
.initiative-rail li.pass-divider{padding:6px 2px 0;font-size:var(--ui-text-xs);font-weight:600;color:var(--ui-accent-soft);border-top:1px solid var(--ui-link-soft)}
.rail-face{position:relative;width:44px;height:52px}
.rail-face :deep(.portrait-trigger){min-width:0}
.rail-face :deep(.portrait-trigger img),.rail-monogram{display:grid;place-items:center;width:44px;height:52px;object-fit:cover;border-radius:8px;box-sizing:border-box;border:2px solid var(--ui-neutral);background:var(--ui-input);color:var(--ui-muted);font-weight:700}
.side-ally .rail-face :deep(.portrait-trigger img),.side-ally .rail-monogram{border-color:var(--ui-ally)}
.side-enemy .rail-face :deep(.portrait-trigger img),.side-enemy .rail-monogram{border-color:var(--ui-enemy)}
.init-badge{position:absolute;right:-6px;bottom:-5px;min-width:20px;padding:0 4px;box-sizing:border-box;text-align:center;border-radius:999px;background:var(--ui-raised);border:1px solid var(--ui-line-strong);color:var(--ui-link);font-size:var(--ui-text-xs);font-weight:700;line-height:18px}
.rail-body{display:flex;flex-direction:column;gap:3px;min-width:0}
.rail-name{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px;min-width:0}
.rail-name>strong,.rail-name>.card-pick{flex:1 1 100%;min-width:0}
.rail-name strong{display:block;font-size:var(--ui-text-sm);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.live-page button.card-pick{min-width:0;min-height:0;padding:0;background:none;border:0;color:inherit;font:inherit;text-align:left;overflow:hidden;text-decoration:underline dotted;text-underline-offset:3px}
.live-page button.card-pick[aria-pressed=true]{color:var(--ui-link)}
.turn-tag{flex:none;padding:0 7px;border-radius:999px;background:var(--ui-accent);color:var(--ui-accent-on);font-size:var(--ui-text-xs);font-weight:700}
.hp-bar{display:block;width:100%;height:5px;border-radius:3px;background:var(--ui-input);border:1px solid var(--ui-line);overflow:hidden}
.hp-bar>span{display:block;height:100%;transition:width .5s ease-in-out}
.hp-bar .ok{background:var(--ui-ally)}
.hp-bar .low{background:var(--ui-warn)}
.hp-bar .critical,.hp-bar .down{background:var(--ui-enemy)}
.hp-text,.health,.rail-note{font-size:var(--ui-text-xs);color:var(--ui-ink-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.health{color:var(--ui-link)}
.rail-note{color:var(--ui-muted)}
.pa-pips{display:flex;gap:3px}
.pa-pips i{width:8px;height:8px;border-radius:50%;background:var(--ui-link);border:1px solid var(--ui-link)}
.pa-pips i.spent{background:transparent;border-color:var(--ui-line-strong)}
.effect-chips{display:flex;flex-wrap:wrap;gap:3px;max-width:100%}
.effect-chips>span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 6px;border-radius:999px;background:var(--ui-warn-bg);color:var(--ui-warn-ink);font-size:var(--ui-text-xs)}
.rail-actions{display:flex;flex-direction:column;align-items:stretch;gap:2px}
.live-page .rail-actions button{min-height:36px;padding:4px 8px;font-size:var(--ui-text-xs);white-space:nowrap}
.rail-actions a{display:grid;place-items:center;min-height:44px;min-width:44px;font-size:var(--ui-text-xs);text-decoration:none}
.rail-extra{grid-column:1 / -1;display:flex;flex-wrap:wrap;gap:4px}
.live-page .rail-extra button{flex:1;min-height:36px;padding:4px 8px;font-size:var(--ui-text-xs)}
/* Règles génériques de la page (son style scopé ne descend pas jusqu'ici). */
.live-page a{color:var(--ui-link)}
.live-page button{padding:10px 14px;min-height:44px;background:var(--ui-btn);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit;cursor:pointer}
.live-page button:disabled{opacity:.5;cursor:default}
.live-page :focus-visible{outline:2px solid var(--ui-link);outline-offset:3px}
/* Téléphone : les lignes défilent à l'horizontale au-dessus de la scène. */
@media (max-width:850px){
  .initiative-rail{max-height:none;overflow:visible;padding:8px}
  .initiative-rail h2,.initiative-rail>p{display:none}
  .initiative-rail ol{flex-direction:row;gap:8px;margin:0;overflow-x:auto;scroll-snap-type:x proximity;padding-right:40px;-webkit-mask-image:linear-gradient(to right,#000 82%,transparent);mask-image:linear-gradient(to right,#000 82%,transparent)}
  .initiative-rail li:not(.pass-divider){flex:0 0 210px;scroll-snap-align:start}
  .initiative-rail li.pass-divider{flex:0 0 auto;align-self:center;border-top:0;border-left:1px solid var(--ui-link-soft);padding:6px}
  .hp-text,.rail-note,.rail-actions a{display:none}
}
.initiative-rail li.currentPass{animation:turn-pulse 1.6s ease-out 3}@keyframes turn-pulse{0%{box-shadow:0 0 0 0 var(--c-reality)aa}70%{box-shadow:0 0 0 10px var(--c-reality)00}100%{box-shadow:0 0 0 2px var(--ui-accent)}}
.initiative-rail li.hit{animation:hit-flash .8s ease-out}@keyframes hit-flash{20%{box-shadow:0 0 0 2px var(--ui-enemy),0 0 18px #d58b8488}100%{box-shadow:none}}
.initiative-rail li.healed{animation:heal-flash .9s ease-out}@keyframes heal-flash{20%{box-shadow:0 0 0 2px var(--c-reality),0 0 18px color-mix(in srgb,var(--c-reality) 55%,transparent)}100%{box-shadow:none}}
.hp-float{position:absolute;right:12px;top:4px;z-index:3;font:700 18px/1 var(--font-title);pointer-events:none;animation:hp-float 1.5s ease-out forwards;text-shadow:0 1px 6px #000c}
.hp-float.dmg{color:var(--c-danger)}.hp-float.heal{color:var(--c-reality)}
@keyframes hp-float{0%{opacity:0;transform:translateY(6px) scale(.8)}15%{opacity:1;transform:translateY(0) scale(1.15)}70%{opacity:1}100%{opacity:0;transform:translateY(-18px)}}
/* L'ordre d'initiative se réordonne en douceur. */
.rail-move{transition:transform .4s ease}
.rail-enter-active,.rail-leave-active{transition:opacity .25s ease}
.rail-enter-from,.rail-leave-to{opacity:0}
@media(prefers-reduced-motion:reduce){.initiative-rail li.currentPass,.initiative-rail li.hit,.initiative-rail li.healed{animation:none}.hp-bar>span{transition:none}.rail-move{transition:none}.hp-float{animation:none}}
</style>
