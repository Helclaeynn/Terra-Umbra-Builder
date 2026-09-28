<script setup lang="ts">
import {computed,ref,nextTick} from 'vue';
import {appearanceGallery,normalizeAppearances,MAX_APPEARANCES,type CharacterAppearances,type AppearanceLayer} from '../../../api/src/character-appearances';
import {uploadCharacterImage} from '../lib/character-image-upload';
const props=defineProps<{modelValue?:CharacterAppearances;layer:AppearanceLayer;characterId?:string;legacy?:{portraitDataUrl?:string;portraitName?:string};editable?:boolean}>();
const emit=defineEmits<{'update:modelValue':[value:CharacterAppearances];'remove-legacy':[]}>();
const gallery=computed(()=>appearanceGallery(props.modelValue,props.layer,props.legacy));
const title=computed(()=>props.layer==='truth'?'Apparences de Vérité':'Apparences de Réalité');
const busy=ref(false),error=ref(''),input=ref<HTMLInputElement|null>(null),dialog=ref<HTMLDialogElement|null>(null),expanded=ref<{src:string;label:string}|null>(null);
const key=computed(()=>props.layer==='reality'?'primaryReality':'primaryTruth');
function primary(id:string){const a=normalizeAppearances(props.modelValue);a[key.value]=id;emit('update:modelValue',a);}
function rename(id:string,label:string){const a=normalizeAppearances(props.modelValue);const row=a[props.layer].find(r=>r.mediaId===id);if(row){row.label=label.slice(0,100);emit('update:modelValue',a);}}
function remove(id:string){
  if(!window.confirm('Retirer cette image de la fiche actuelle ? Les autres images et les anciennes versions sont conservées.'))return;
  if(id==='legacy'){emit('remove-legacy');return;}
  const a=normalizeAppearances(props.modelValue);a[props.layer]=a[props.layer].filter(r=>r.mediaId!==id);
  if(a[key.value]===id)a[key.value]=a[props.layer][0]?.mediaId??'';emit('update:modelValue',a);
}
async function add(event:Event){
  const files=Array.from((event.target as HTMLInputElement).files??[]);if(!files.length||!props.characterId)return;
  if(gallery.value.rows.length+files.length>MAX_APPEARANCES){error.value=`Maximum ${MAX_APPEARANCES} images par galerie.`;return;}
  busy.value=true;error.value='';
  try{
    for(const file of files){
      const id=await uploadCharacterImage(props.characterId,file);
      const a=normalizeAppearances(props.modelValue);
      if(!a[props.layer].some(r=>r.mediaId===id))a[props.layer].push({mediaId:id,label:file.name.replace(/\.[^.]+$/,'').slice(0,100)});
      if(!a[key.value])a[key.value]=gallery.value.primary?.id??id;
      emit('update:modelValue',a);await nextTick();
    }
  }catch(e){error.value=e instanceof Error?e.message:'Envoi impossible.';}finally{busy.value=false;if(input.value)input.value.value='';}
}
async function open(row:{src:string;label:string}){expanded.value=row;await nextTick();dialog.value?.showModal();}
</script>
<template>
  <details v-if="editable||gallery.rows.length" :open="editable||layer==='truth'" class="character-gallery" :data-gallery="layer" :aria-label="title">
    <summary><strong>{{title}}</strong><span>{{gallery.rows.length}}<template v-if="editable"> / {{MAX_APPEARANCES}}</template> image(s)</span></summary>
    <p v-if="editable">Ajoutez plusieurs looks et choisissez l’image principale. Les images de Vérité restent dans la partie Vérité de la fiche partagée avec votre MJ.</p>
    <p v-if="error" role="alert">{{error}}</p>
    <div class="gallery-grid">
      <figure v-for="row in gallery.rows" :key="row.id">
        <button type="button" class="gallery-image" :aria-label="`Agrandir ${row.label}`" @click="open(row)"><img :src="row.src" :alt="row.label" loading="lazy" /></button>
        <figcaption><strong v-if="!editable||row.id==='legacy'">{{row.label}}</strong><label v-else>Nom de l’apparence<input :value="row.label" maxlength="100" :disabled="busy" @change="rename(row.id,($event.target as HTMLInputElement).value)" /></label><small v-if="gallery.primary?.id===row.id">Image principale</small></figcaption>
        <div v-if="editable" class="gallery-actions"><button type="button" :disabled="busy||gallery.primary?.id===row.id" @click="primary(row.id)">Définir principale</button><button type="button" :disabled="busy" @click="remove(row.id)">Retirer</button></div>
      </figure>
    </div>
    <template v-if="editable"><button type="button" :disabled="busy||!characterId||gallery.rows.length>=MAX_APPEARANCES" @click="input?.click()">{{busy?'Envoi…':'Ajouter des images'}}</button><input ref="input" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden @change="add" /><small>JPEG, PNG ou WebP · compression automatique sans recadrage · enregistrez la fiche pour valider les changements.</small></template>
    <dialog ref="dialog" :aria-label="expanded?.label||title" @click="($event.target===dialog)&&dialog?.close()"><button type="button" @click="dialog?.close()">Fermer</button><img v-if="expanded" :src="expanded.src" :alt="expanded.label" /><p>{{expanded?.label}}</p></dialog>
  </details>
</template>
<style scoped>
.character-gallery{border:1px solid #30485d;border-radius:8px;padding:16px;margin-block:16px;color:#dbe9f7;min-width:0}.character-gallery summary{display:flex;justify-content:space-between;gap:12px;cursor:pointer;min-height:44px;align-items:center}.character-gallery summary:before{content:"▸"}.character-gallery[open]>summary:before{content:"▾"}.character-gallery h3{margin:0}.character-gallery p,.character-gallery small{color:#aac1d4;font-size:13px}.character-gallery>small{display:block;margin-top:8px}.gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:16px;margin-block:16px}.gallery-grid figure{margin:0;min-width:0;max-width:360px}.gallery-image{width:100%;height:230px;padding:0!important;background:#08131f!important}.gallery-image img{width:100%;height:100%;object-fit:contain}.gallery-grid figcaption{display:grid;gap:6px;margin-top:8px;overflow-wrap:anywhere}.gallery-grid label{display:grid;gap:4px}.gallery-grid input{width:100%;box-sizing:border-box;min-width:0;padding:8px;background:#08131f;color:inherit;border:1px solid #3b586e;border-radius:4px}.gallery-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.character-gallery button{font:inherit;font-size:13px;min-height:44px;border:1px solid #3b586e;border-radius:6px;padding:8px 12px;background:#102336;color:inherit;cursor:pointer}.character-gallery button:disabled{opacity:.5;cursor:default}.character-gallery :focus-visible{outline:2px solid #b7efff;outline-offset:3px}.character-gallery dialog{max-width:94vw;max-height:94vh;background:#08131f;color:#dbe9f7;border:1px solid #3b586e;border-radius:8px}.character-gallery dialog::backdrop{background:#000b}.character-gallery dialog>img{display:block;max-width:85vw;max-height:75vh;object-fit:contain;margin:12px auto}.character-gallery dialog>button{display:block;margin-left:auto}
</style>
