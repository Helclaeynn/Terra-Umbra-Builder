<template>
  <span class="tu-orbital-brand">
    <img class="tu-brand-lockup" src="/brand/terra-umbra-logo-approved.webp" width="74" height="54" alt="Terra Umbra" />
    <span class="tu-orbital-wordmark" aria-hidden="true">
      <strong>TERRA UMBRA</strong>
      <small>CALIFORNIA <span>•</span> BUILDER V2</small>
    </span>
  </span>
</template>

<style scoped>
.tu-orbital-brand{display:inline-flex;align-items:center;gap:13px;min-width:0;text-align:left;color:#edf4ff}
.tu-orbital-brand .tu-brand-lockup{display:block;width:74px;height:54px;max-width:none;object-fit:contain;mix-blend-mode:screen;flex:none}
.tu-orbital-wordmark{display:grid;gap:7px;white-space:nowrap}
.tu-orbital-wordmark strong{font:550 18px/1.1 Inter,"Segoe UI",sans-serif;letter-spacing:.17em}
.tu-orbital-wordmark small{color:#a7bed4;font:8px/1.4 Consolas,monospace;letter-spacing:.19em}
.tu-orbital-wordmark small span{color:#64def5;margin:0 5px}
@media(max-width:650px){.tu-orbital-brand{gap:8px}.tu-orbital-brand .tu-brand-lockup{width:56px;height:44px}.tu-orbital-wordmark strong{font-size:12px;letter-spacing:.12em}.tu-orbital-wordmark small{font-size:6px;letter-spacing:.1em}}
@media(max-width:380px){.tu-orbital-wordmark{display:none}}
</style>
