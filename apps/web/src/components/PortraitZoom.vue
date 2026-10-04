<script setup lang="ts">
import {ref} from 'vue';
defineProps<{src:string;name:string}>();
const dialog=ref<HTMLDialogElement|null>(null);
function close(){dialog.value?.close();}
</script>
<template><button class="portrait-trigger" type="button" :aria-label="`Agrandir le portrait de ${name}`" @click="dialog?.showModal()"><img :src="src" :alt="name" loading="lazy" /></button><Teleport to="body"><dialog ref="dialog" class="portrait-zoom" :aria-label="`Portrait de ${name}`" @click="($event.target===dialog)&&close()"><div class="portrait-content"><button type="button" class="portrait-close" autofocus @click="close">Fermer ×</button><img :src="src" :alt="name" /><p>{{name}}</p></div></dialog></Teleport></template>
<style scoped>
.portrait-trigger{display:block;padding:0!important;border:0!important;background:transparent!important;min-width:44px;flex-shrink:0;cursor:zoom-in!important}.portrait-trigger img{display:block;width:54px;height:70px;object-fit:cover;border-radius:4px}.portrait-zoom{box-sizing:border-box;position:fixed;inset:0;border:0;padding:24px;width:100vw;max-width:none;height:100dvh;max-height:none;background:transparent;color:#e6eef8;overflow:auto}.portrait-zoom::backdrop{background:#030a12eb}.portrait-content{width:fit-content;max-width:100%;margin:auto;display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:auto}.portrait-content img{max-width:100%;max-height:calc(100dvh - 150px);object-fit:contain}.portrait-content p{margin:0}.portrait-close{align-self:flex-end;min-height:44px;padding:8px 16px;border:1px solid #52758b;background:#143247;color:#e6eef8;border-radius:6px;font:inherit;cursor:pointer}.portrait-trigger:focus-visible,.portrait-close:focus-visible{outline:2px solid #b7efff;outline-offset:3px}
</style>
