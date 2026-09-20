<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean;
  }>(),
  {
    compact: false
  }
);
</script>

<template>
  <img
    class="tu-brand-lockup"
    :class="{ compact }"
    src="/brand/terra-umbra-logo-approved.webp"
    alt="Terra Umbra"
  />
</template>

<style scoped>
.tu-brand-lockup{
  display:block;
  width:min(420px,100%);
  max-width:100%;
  height:auto;
  aspect-ratio:360 / 264;
  object-fit:contain;
  object-position:center;
  opacity:.78;
  mix-blend-mode:screen;
  filter:
    saturate(.58)
    brightness(.82)
    contrast(.92)
    drop-shadow(0 0 9px rgba(36,165,255,.10))
    drop-shadow(0 0 14px rgba(221,40,255,.055));
}
.tu-brand-lockup.compact{
  width:104px;
  max-height:72px;
}
@media(max-width:620px){
  .tu-brand-lockup.compact{
    width:86px;
    max-height:62px;
  }
}
</style>
