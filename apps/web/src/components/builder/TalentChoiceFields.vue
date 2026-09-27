<script setup lang="ts">
import {computed} from 'vue';
import type {ChoiceSpec} from '../../lib/reality-benefits';
const props=defineProps<{talents:{id:string;name:string}[];specs:Record<string,ChoiceSpec>;choices:Record<string,unknown>;skills:{id:string;name:string;attribute:string}[];styleSkills?:readonly string[]}>();
const emit=defineEmits<{'update:choices':[value:Record<string,unknown>]}>();
const rows=computed(()=>props.talents.filter(t=>!!props.specs[t.id]));
function value(id:string){return typeof props.choices[id]==='string'?props.choices[id] as string:'';}
function options(s:ChoiceSpec){return s.kind==='enum'?s.options??[]:props.skills.filter(k=>(!s.skills||s.skills.includes(k.id))&&(!s.skillAttribute||s.skillAttribute===k.attribute)&&(!s.styleSkills||props.styleSkills?.includes(k.id)));}
function change(id:string,v:string){emit('update:choices',{...props.choices,[id]:v});}
</script>
<template><div v-if="rows.length" class="talent-choice-fields"><label v-for="row in rows" :key="row.id" :data-talent-choice="row.id"><strong>{{ row.name }} · {{ specs[row.id].label }}</strong><select v-if="['skill','enum'].includes(specs[row.id].kind)" :value="value(row.id)" @change="change(row.id,($event.target as HTMLSelectElement).value)"><option value="">— Choisir —</option><option v-if="value(row.id)&&!options(specs[row.id]).some(o=>o.id===value(row.id))" :value="value(row.id)" disabled>{{ value(row.id) }} · ancien choix à vérifier</option><option v-for="o in options(specs[row.id])" :key="o.id" :value="o.id">{{ o.name }}</option></select><input v-else :value="value(row.id)" :placeholder="specs[row.id].placeholder||''" @input="change(row.id,($event.target as HTMLInputElement).value)" /><small>{{ specs[row.id].help }}</small><small v-if="!value(row.id).trim()">Choix à préciser ; les anciennes données sont conservées.</small></label></div></template>
<style scoped>.talent-choice-fields{display:grid;gap:14px;min-width:0}.talent-choice-fields label{display:grid;gap:8px;min-width:0;margin:12px 0}.talent-choice-fields input,.talent-choice-fields select{box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:10px;border:1px solid #36536b;border-radius:6px;background:#08131f;color:#edf4ff;font:inherit}.talent-choice-fields small{color:#b3c5d9;line-height:1.5}</style>
