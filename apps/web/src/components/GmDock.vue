<script setup lang="ts">
// Morceau de la table en jeu (CampaignPlayPage.vue) : l'état vient de la page, par useLiveTable().
import { useLiveTable } from "../lib/live-table";
const { room, busy, act, chosen, inspectActor, toggleGmTools, adjustAmount, text, link, image, imageBusy, recipient, gmLabel, gmBonus, gmStress, gmPublic, gmFaces, gmCount, shortcutsOpen } = useLiveTable();
</script>
<template>
<section v-if="room.canManage" class="gm-dock" aria-label="Panneau du MJ">
    <div class="dock-block"><h3>Cible</h3><template v-if="chosen"><strong>{{ chosen.name }}</strong><span v-if="chosen.hp!==undefined&&chosen.pvMax">{{ chosen.hp }} / {{ chosen.pvMax }} PV<template v-if="room.combat?.active"> · {{ chosen.pa }} PA</template> · {{ chosen.health }}</span><span v-else>{{ chosen.health }}</span><span v-if="chosen.effects?.length" class="dock-effects">{{ chosen.effects.map((e:any)=>e.name).join(' · ') }}</span><div v-if="chosen.hp!==undefined&&chosen.pvMax" class="dock-row dock-hp"><input v-model.number="adjustAmount" type="number" min="1" max="1000" aria-label="PV à retirer ou rendre" /><button type="button" class="ui-danger" :disabled="busy||!(adjustAmount>=1)" :aria-label="`Retirer ${adjustAmount} PV à ${chosen.name}`" @click="act('adjust',{actorId:chosen.id,delta:-adjustAmount,beforeHp:chosen.hp})">− PV</button><button type="button" :disabled="busy||!(adjustAmount>=1)||chosen.hp<=chosen.death||chosen.hp>=chosen.pvMax" :aria-label="`Rendre ${adjustAmount} PV à ${chosen.name}`" @click="act('adjust',{actorId:chosen.id,delta:adjustAmount,beforeHp:chosen.hp})">+ PV</button></div><div class="dock-buttons"><button type="button" @click="inspectActor(chosen.id)">Fiche, jets et soins</button><button v-if="room.combat?.active&&chosen.kind!=='character'&&chosen.initiativePending&&chosen.participating!==false" type="button" :disabled="busy" @click="act('initiative',{combatantId:chosen.id,version:chosen.version})">◈ Initiative</button></div></template><p v-else>Clique sur le nom d’un participant pour le choisir.</p></div>
    <form class="dock-block" @submit.prevent="act('message',{text,link,image,...(recipient?{recipientCharacterId:recipient}:{})})"><h3>Révéler</h3><select v-model="recipient" aria-label="Destinataire de la révélation"><option value="">Tout le groupe</option><option v-for="c in room.characters" :key="c.id" :value="c.id">{{ c.name }} (privé)</option></select><textarea v-model="text" rows="2" maxlength="5000" aria-label="Texte à révéler" placeholder="Ce que les joueurs découvrent…" /><button class="ui-primary" :disabled="busy||imageBusy||(!text.trim()&&!link&&!image)">{{ recipient?'Envoyer en privé':'Révéler' }}</button></form>
    <form class="dock-block" @submit.prevent="act('gm-roll',{label:gmLabel,bonus:gmBonus,stress:gmStress,public:gmPublic,mode:'explosive',faces:gmFaces,count:gmCount})"><h3>Jet rapide</h3><div class="dock-row"><input v-model="gmLabel" maxlength="120" required aria-label="Intitulé du jet rapide" /><input v-model.number="gmBonus" type="number" min="-100" max="100" required aria-label="Modificateur du jet rapide" /></div><label class="check"><input v-model="gmPublic" type="checkbox" /> Visible des joueurs</label><button :disabled="busy||!gmLabel.trim()">◈ Jet d10</button></form>
    <div class="dock-block"><h3>Partie</h3><div class="dock-buttons"><button v-if="!room.combat?.active" type="button" :disabled="busy" @click="act('combat-scene',{version:room.combat.version})">Nouvelle scène</button><button type="button" @click="toggleGmTools">Tous les outils</button></div><small>Participants, effets, récompenses et séances sont dans « Tous les outils ».</small><button type="button" class="ui-quiet" :aria-expanded="shortcutsOpen" @click="shortcutsOpen=!shortcutsOpen">Raccourcis clavier (?)</button></div>
   </section>
   <section v-if="shortcutsOpen" class="shortcuts-help" aria-label="Raccourcis clavier"><h3>Raccourcis clavier</h3><p>Hors des champs de saisie. Échap ferme.</p><dl><dt>J</dt><dd>{{ room.ownCharacterId?'Ouvrir mes jets':'Ouvrir la fiche de la cible' }}</dd><template v-if="room.canManage"><dt>1 à 9</dt><dd>Choisir la cible, dans l’ordre de la colonne des participants</dd><dt>D</dt><dd>Aller au champ des PV de la cible</dd><dt>R</dt><dd>Écrire une révélation</dd><dt>Maj + N</dt><dd>Round suivant (en combat)</dd></template><dt>?</dt><dd>Afficher ou masquer cette aide</dd></dl></section>
</template>
<style scoped>
.live-page a{color:var(--ui-link)}
.live-page label{display:grid;gap:6px;margin:8px 0;min-width:0}
.live-page input:not([type=checkbox]),.live-page textarea,.live-page select{box-sizing:border-box;width:100%;min-width:0;padding:10px;background:var(--ui-input);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit}
.live-page button{padding:10px 14px;min-height:44px;background:var(--ui-btn);color:var(--ui-ink);border:1px solid var(--ui-line-strong);border-radius:5px;font:inherit;cursor:pointer}
.live-page button:disabled{opacity:.5;cursor:default}
.live-page summary{cursor:pointer;padding:14px 0;min-height:24px}
.live-page fieldset{border:1px solid var(--ui-line);border-radius:8px;min-width:0;margin:14px 0}
.live-page :focus-visible{outline:2px solid var(--ui-link);outline-offset:3px}
.shortcuts-help{padding:12px 16px;border:1px solid var(--ui-line);border-radius:12px;background:var(--ui-panel)}
.shortcuts-help h3{margin:0 0 4px;font-size:var(--ui-text-base)}
.shortcuts-help p{margin:0 0 8px;font-size:var(--ui-text-sm);color:var(--ui-muted)}
.shortcuts-help dl{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:0;font-size:var(--ui-text-sm)}
.shortcuts-help dt{font-weight:700;color:var(--ui-link)}
.shortcuts-help dd{margin:0}
.gm-dock{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;padding:10px;border:1px solid var(--ui-line);border-radius:12px;background:var(--ui-panel)}
.dock-block{display:flex;flex-direction:column;gap:6px;min-width:0;padding:8px;border-radius:8px;background:var(--ui-panel-2)}
.dock-block h3{margin:0;font-size:var(--ui-text-xs);text-transform:uppercase;letter-spacing:.08em;color:var(--ui-muted)}
.dock-block>span,.dock-block small,.dock-block p{font-size:var(--ui-text-sm);color:var(--ui-ink-soft);margin:0}
.dock-effects{color:var(--ui-warn-ink)!important}
.dock-buttons{display:flex;flex-wrap:wrap;gap:6px}
.dock-row{display:grid;grid-template-columns:minmax(0,1fr) 70px;gap:6px}
.dock-row.dock-hp{grid-template-columns:70px 1fr 1fr}
.live-page .gm-dock button{min-height:38px;padding:6px 10px;font-size:var(--ui-text-sm)}
.live-page .gm-dock textarea,.live-page .gm-dock input:not([type=checkbox]),.live-page .gm-dock select{padding:7px;font-size:var(--ui-text-sm)}
.gm-dock .check{display:flex;align-items:center;gap:6px;margin:0;font-size:var(--ui-text-sm)}
</style>
