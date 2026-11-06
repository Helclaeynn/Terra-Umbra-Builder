<script setup lang="ts">
// Morceau de la table en jeu (CampaignPlayPage.vue) : l'état vient de la page, par useLiveTable().
import { useLiveTable } from "../lib/live-table";
const { hasOlderEvents, olderBusy, loadOlderEvents } = useLiveTable();
const { room, busy, act, feed, filter, feedCollapsed, unreadEvents, latest, latestRevelation, date, forceFeed, openRevelations, toggleFeed } = useLiveTable();
</script>
<template>
<aside class="table-journal" aria-label="Journal de la table">   <section class="live-feed" :class="{collapsed:feedCollapsed}"><header><h2>Jets & révélations</h2><button class="ui-quiet" :aria-expanded="!feedCollapsed" aria-controls="table-feed-content" @click="toggleFeed">{{ feedCollapsed?'Voir le journal':'Replier le journal' }}<span v-if="unreadEvents" class="attention-badge">{{unreadEvents}} nouveau{{unreadEvents>1?'x':''}}</span></button><label v-show="!feedCollapsed">Afficher<select v-model="filter"><option value="all">Tout le fil</option><option value="rolls">Jets de dés</option><option value="messages">Révélations du MJ</option></select></label></header>
    <p v-if="latest" class="latest-result" role="status" aria-live="polite">{{latest.characterName??latest.payload.characterName??'MJ'}} → {{latest.payload.label}} → <strong>{{latest.payload.total}}</strong><span v-if="latest.payload.narrativeFailure"> · Échec narratif</span><span v-else-if="latest.payload.edgeForced"> · Forcer le Destin</span><span v-else-if="latest.payload.exploded"> · Explosion !</span></p>
    <div v-if="latestRevelation" class="latest-revelation"><span><strong>MJ · {{latestRevelation.payload.label??'Révélation'}}</strong><span v-if="latestRevelation.payload.text"> · {{latestRevelation.payload.text}}</span><span v-else-if="latestRevelation.image"> · Image partagée</span><span v-else-if="latestRevelation.payload.link"> · Page partagée</span></span><button class="ui-quiet" @click="openRevelations">Lire la révélation</button></div>
    <div id="table-feed-content" v-show="!feedCollapsed" class="feed-content"><div class="feed-scroll" role="log" aria-label="Journal des jets et révélations" tabindex="0"><article v-for="e in feed" :key="e.id" :class="['feed-event',{'reveal':e.kind==='message','failed':e.payload.narrativeFailure}]"><header><time>{{ date(e.createdAt) }}</time><strong>{{ e.characterName??e.payload.characterName??'MJ' }} → {{ e.payload.label }}<template v-if="e.payload.total!==undefined"> → {{ e.payload.total }}</template></strong></header><small v-if="e.playerName">{{ e.playerName }}</small>
     <p v-if="e.payload.selectedName"><strong>{{ e.payload.selectedName }}</strong> · parmi {{ e.payload.candidateCount }} joueurs</p><template v-if="e.payload.dice"><strong v-if="e.payload.edgeForced">Forcer le Destin · 1 Edge</strong><p class="dice-detail">{{ e.payload.modifier }} + <span v-for="(die,i) in e.payload.dice" :key="i">{{ i?' + ':'' }}<b>{{ die }}</b>{{ i&&e.payload.exploded?' (explosion)':'' }}</span> = <strong>{{ e.payload.total }}</strong></p><button v-if="room.ownCharacterId===(e.characterId??e.payload.characterId)&&!e.payload.edgeForced&&['roll','initiative','defend'].includes(e.kind)" :disabled="busy" @click="forceFeed(e.id)">Forcer ce jet · 1 Edge</button><strong v-if="e.payload.narrativeFailure" class="failure">Échec narratif</strong><details><summary>Détail du jet</summary><p v-if="e.payload.components?.attributeName">{{ e.payload.components.attributeName }} {{ e.payload.components.attribute }} + {{ e.payload.components.skillName }} {{ e.payload.components.rank }} + bonus {{ e.payload.components.bonus }}</p><p v-else-if="e.payload.components?.profileScore!==undefined">{{e.payload.components.profileName}} · score du profil {{e.payload.components.profileScore}} + bonus {{e.payload.components.bonus}}</p><p v-else-if="e.payload.components?.defense!==undefined">Défense {{e.payload.components.defense}} + bonus {{e.payload.components.bonus}} + {{e.payload.defensePowerName??'capacité'}} {{e.payload.components.specialBonus??0}} · {{e.payload.paCost??0}} PA</p><p v-else>Bonus du jet : {{ e.payload.modifier }}</p><p v-if="e.payload.weaponName">Arme / attaque : {{e.payload.weaponName}} · DGT {{e.payload.damage}}</p><p>Dés : {{e.payload.dice.join(' + ')}} · total {{e.payload.total}}</p><ul v-if="e.payload.bonuses?.length"><li v-for="(b,i) in e.payload.bonuses" :key="i">{{ b.label??b.name??b.id }} : {{ b.amount??b.bonus??0 }}</li></ul></details></template>
     <p v-if="e.kind==='resolve'">Attaque {{ e.payload.attackTotal }} contre défense {{ e.payload.defenseTotal }}<template v-if="e.payload.defenseDice?.length"> (dés : {{ e.payload.defenseDice.join(' + ') }})</template> · <strong>{{ e.payload.damage }} dégâts appliqués</strong></p><p v-if="e.kind==='resolve'&&e.payload.alteration">Altération cohérente à déterminer avec le MJ.</p><p v-if="e.kind!=='resolve'&&e.payload.damage!==undefined">Dégâts de base : {{ e.payload.damage }} · à résoudre selon la défense et l’armure.</p><p v-if="e.payload.text" class="message-text">{{ e.payload.text }}</p><a v-if="e.payload.link" :href="e.payload.link" target="_blank" rel="noopener">Ouvrir la page du Compendium ↗</a><a v-if="e.image" :href="e.image" target="_blank" rel="noopener"><img class="reveal-image" :src="e.image" alt="Image révélée par le MJ" loading="lazy" /></a><p v-if="e.payload.before!==undefined">{{ e.payload.before }} → {{ e.payload.after }} PV</p><p v-if="e.payload.reserveBonus">Réserve nanitique : +{{e.payload.reserveBonus}} PV inclus dans ce soin.</p><p v-if="e.payload.recovered!==undefined">+{{ e.payload.recovered }} PV récupérés</p><button v-if="room.canManage&&e.kind==='message'" class="ui-quiet ui-quiet-danger" :disabled="busy" aria-label="Retirer cette révélation" @click="act('withdraw',{eventId:e.id})">Retirer</button>
        </article><p v-if="!feed.length">Les prochains jets et révélations apparaîtront ici.</p><button v-if="hasOlderEvents" type="button" class="ui-quiet feed-older" :disabled="olderBusy" @click="loadOlderEvents">{{ olderBusy ? "Chargement…" : "Afficher les évènements plus anciens" }}</button></div>

    </div>
   </section></aside>
</template>
<style scoped>
.live-feed>header,.feed-event header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.live-page a{color:var(--ui-link)}
.live-feed{padding:20px;background:var(--ui-panel);border:1px solid var(--ui-line);border-radius:10px}
.live-feed{margin-bottom:20px;position:sticky;top:8px;z-index:9;padding:12px;box-shadow:0 8px 20px #0008}
.feed-content{max-height:42dvh;overflow:auto;overscroll-behavior:contain}
.latest-result{margin:8px 0;padding:8px 10px;background:var(--ui-raised);border-radius:5px}
.live-feed h2{font-size:var(--ui-text-lg)}
.live-feed.collapsed .latest-result{max-height:4.5em;overflow:auto}
.live-feed h2{margin:0}
.feed-scroll{height:clamp(130px,24dvh,300px);overflow:auto;overscroll-behavior:contain;margin-top:16px;padding-right:10px}
.feed-event{padding:14px;margin-bottom:12px;background:var(--ui-panel-2);border:1px solid var(--ui-line);border-radius:8px}
.feed-event.reveal{border-left:3px solid var(--ui-reveal)}
.feed-event.failed{border-left:3px solid #ef9c9c}
.feed-event header{justify-content:flex-start}
.feed-event time,.feed-event small{color:var(--ui-ink-soft)}
.dice-detail b{display:inline-block;padding:4px 10px;background:var(--ui-line);border-radius:5px;color:var(--ui-link)}
.failure{color:var(--ui-danger-ink)}
.message-text{white-space:pre-wrap}
.reveal-image{display:block;max-width:100%;max-height:320px;object-fit:contain;margin-top:12px}
.live-page label{display:grid;gap:6px;margin:8px 0;min-width:0}
.live-page input:not([type=checkbox]),.live-page textarea,.live-page select{box-sizing:border-box;width:100%;min-width:0;padding:10px;background:var(--ui-input);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit}
.live-page button{padding:10px 14px;min-height:44px;background:var(--ui-btn);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit;cursor:pointer}
.live-page button:disabled{opacity:.5;cursor:default}
.live-page summary{cursor:pointer;padding:14px 0;min-height:24px}
.live-page fieldset{border:1px solid var(--ui-line);border-radius:8px;min-width:0;margin:14px 0}
.live-page :focus-visible{outline:2px solid var(--ui-link);outline-offset:3px}
@media (max-width:800px){.live-feed{padding:12px}}
@media (max-width:800px){.feed-scroll{height:22dvh;min-height:100px}}
@media (max-width:800px){.feed-content{max-height:33dvh}}
@media (max-width:800px){.live-feed{top:4px}}
@media (max-width:800px){.live-feed>header{gap:6px}}
@media (max-width:800px){.live-feed>header label{margin:0;flex:1}}
@media (max-width:800px){.latest-result{font-size:var(--ui-text-md)}}
.latest-revelation{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;font-size:var(--ui-text-md)}
.latest-revelation>span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.latest-revelation button{flex:none;font-size:var(--ui-text-sm);padding:6px 8px}
@media (max-width:800px){.latest-revelation button{max-width:90px;white-space:normal}}
@media (max-width:800px){.live-feed{max-height:none}}
.table-journal{grid-area:journal;min-width:0;max-height:calc(100dvh - 235px);overflow:auto;border-radius:14px;background:var(--ui-panel)}
.table-journal .live-feed{position:static;margin:0;padding:12px;border:0;background:none;max-height:none}
.live-feed>header{flex-wrap:wrap}
.live-feed>header h2{font-size:var(--ui-text-md)}
.live-feed>header button{font-size:var(--ui-text-xs);padding:6px 8px}
.live-feed>header label{width:100%;font-size:var(--ui-text-xs)}
.feed-scroll{max-height:none;overflow:visible}
.feed-event{padding:12px 8px;border-bottom:1px solid var(--ui-accent-bg);background:none;border-radius:0}
.feed-event>header{display:flex;flex-direction:column;align-items:flex-start;gap:5px}
.feed-event>header time{font-size:var(--ui-text-xs);color:var(--ui-muted)}
.feed-event p,.feed-event small{font-size:var(--ui-text-sm)}
.table-journal .latest-result{font-size:var(--ui-text-sm);padding:10px;background:var(--ui-success-bg)}
@media (max-width:850px){.table-journal{max-height:300px}}
.live-page button.ui-quiet-danger{color:var(--ui-danger-ink);min-height:32px;padding:4px 6px;margin-top:6px;font-size:var(--ui-text-xs)}
.table-journal .feed-content{max-height:none;overflow:visible}
.table-journal .feed-scroll{height:auto}
.feed-event{animation:slide-in .35s ease-out}@keyframes slide-in{from{transform:translateX(16px);opacity:0}to{transform:none;opacity:1}}@media(prefers-reduced-motion:reduce){.feed-event{animation:none}}.feed-older{width:100%;min-height:44px;margin-bottom:8px}
</style>
