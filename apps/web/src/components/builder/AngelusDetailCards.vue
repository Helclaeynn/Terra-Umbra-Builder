<script setup lang="ts">
import type {AngelusSheetEntry} from '../../lib/angelus';
defineProps<{entries:AngelusSheetEntry[];aura?:{rank:string;maximum:number}|null}>();
</script>
<template><section v-if="entries.length||aura" class="angelus-details" aria-label="Transcendance et manifestations de l’Angelus">
 <h3>Transcendance et manifestations de l’Angelus</h3>
 <p v-if="aura" data-angelus-aura>{{aura.rank==='cherub'?'Chérubin':'Angelus'}} · <strong>Aura maximale {{aura.maximum}}</strong> — réserve courante suivie en partie, sans recharge automatique.</p>
 <article v-for="entry in entries" :key="entry.id" :data-angelus-sheet="entry.id"><h4>{{entry.title}}</h4><p>{{entry.body}}</p><dl><div v-for="(parameter,index) in entry.parameters" :key="index"><dt>{{parameter.label}}</dt><dd>{{parameter.value||'À définir'}}</dd></div></dl><p v-if="entry.issues.length" class="angelus-status">{{entry.issues.join(' ')}}</p><small>Préparation de fiche uniquement — aucun pouvoir activé, aucune autorisation MJ déduite du texte.</small></article>
</section></template>
<style scoped>.angelus-details{display:grid;gap:12px;min-width:0}.angelus-details article{padding:16px;border:1px solid #36536b;border-radius:8px;background:#0d1b2d;overflow-wrap:anywhere;min-width:0}.angelus-details h4,.angelus-details p{margin:0 0 8px}.angelus-details p,.angelus-details dd{white-space:pre-line}.angelus-details dl{display:grid;gap:8px}.angelus-details dt{font-weight:600}.angelus-details dd{margin:0;color:#becede}.angelus-status{color:#a5def0;font-size:13px}</style>
