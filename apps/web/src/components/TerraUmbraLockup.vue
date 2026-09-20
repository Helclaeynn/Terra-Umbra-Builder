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
  filter:
    drop-shadow(0 0 14px rgba(36,165,255,.18))
    drop-shadow(0 0 22px rgba(221,40,255,.10));
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
