<script setup lang="ts">
import {normalizeDaemonDefinition,type DaemonDefinition} from '../../lib/daemon';
const props=defineProps<{value:DaemonDefinition;prefix:string;sourceLabel?:string}>();
const emit=defineEmits<{change:[value:DaemonDefinition]}>();
const fields=[['name','Nom',160],['effect','Effet concret',2000],['source','Origine / enseignement',400],['range','Portée',300],['frequency','Cadence',300],['duration','Durée',300],['resistance','Résistance ou absence d’opposition',800],['limits','Conditions et limites',1000]] as const;
function edit(key:string,event:Event){const v=(event.target as HTMLInputElement).value;emit('change',normalizeDaemonDefinition({...props.value,[key]:key==='pa'?(v===''?null:Number(v)):v}));}
</script>
<template><div class="daemon-definition">
 <label v-for="[key,label,max] in fields" :key="key">{{key==='source'&&sourceLabel?sourceLabel:label}}
  <textarea v-if="['effect','limits','resistance'].includes(key)" :data-daemon-field="`${prefix}-${key}`" :value="value[key]" :maxlength="max" rows="2" @input="edit(key,$event)" />
  <input v-else :data-daemon-field="`${prefix}-${key}`" :value="value[key]" :maxlength="max" @input="edit(key,$event)" />
 </label>
 <label>Coût en PA<input :data-daemon-field="`${prefix}-pa`" type="number" min="0" max="100" step="1" :value="value.pa??''" @input="edit('pa',$event)" /></label>
</div></template>
<style scoped>.daemon-definition{display:grid;gap:12px;min-width:0}.daemon-definition label{display:grid;gap:6px;min-width:0}.daemon-definition :is(input,textarea){box-sizing:border-box;width:100%;min-width:0;min-height:44px;border:1px solid #36536b;background:#08131f;color:#edf4ff;border-radius:6px;padding:9px;font:inherit}.daemon-definition textarea{resize:vertical}.daemon-definition :is(input,textarea):focus-visible{outline:2px solid #a5eafa;outline-offset:2px}</style>
