<template>
  <svg
    class="tu-brand-mark"
    viewBox="0 0 160 160"
    role="img"
    aria-label="Terra Umbra"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="tu-signal" x1="18" y1="18" x2="142" y2="142" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#62e7d0"/>
        <stop offset=".43" stop-color="#34a8ff"/>
        <stop offset="1" stop-color="#aa79e8"/>
      </linearGradient>
      <linearGradient id="tu-earth" x1="52" y1="50" x2="111" y2="112" gradientUnits="userSpaceOnUse">
        <stop stop-color="#baf7ff"/>
        <stop offset=".32" stop-color="#49cbea"/>
        <stop offset=".72" stop-color="#1769ba"/>
        <stop offset="1" stop-color="#172a67"/>
      </linearGradient>
      <radialGradient id="tu-core" cx=".38" cy=".31" r=".7">
        <stop stop-color="#e8fdff" stop-opacity=".96"/>
        <stop offset=".18" stop-color="#6ce0ef" stop-opacity=".9"/>
        <stop offset=".63" stop-color="#2280c5" stop-opacity=".62"/>
        <stop offset="1" stop-color="#111d3c" stop-opacity=".25"/>
      </radialGradient>
      <filter id="tu-glow" x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur stdDeviation="2.4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <clipPath id="tu-globe-clip">
        <circle cx="80" cy="80" r="31"/>
      </clipPath>
    </defs>

    <g class="tu-brand-orbits" fill="none" stroke-linecap="square">
      <circle cx="80" cy="80" r="70" stroke="url(#tu-signal)" stroke-opacity=".2" stroke-width=".9" stroke-dasharray="2 7"/>
      <circle cx="80" cy="80" r="61" stroke="#49cfee" stroke-opacity=".26" stroke-width=".7" stroke-dasharray="18 5 2 6"/>
      <path d="M80 5v18M80 137v18M5 80h18M137 80h18" stroke="#5ee2cf" stroke-opacity=".62" stroke-width="1"/>
      <path d="M18 40h15v-9h14M142 120h-15v9h-14M119 17v11h13M41 143v-11H28" stroke="url(#tu-signal)" stroke-opacity=".55" stroke-width="1.1"/>
      <rect x="12" y="76" width="6" height="6" stroke="#55dac4" stroke-width="1"/>
      <rect x="142" y="76" width="6" height="6" stroke="#a67ce6" stroke-width="1"/>
      <rect x="77" y="12" width="6" height="6" stroke="#58cfff" stroke-width="1"/>
      <rect x="77" y="142" width="6" height="6" stroke="#a67ce6" stroke-width="1"/>
    </g>

    <g class="tu-brand-monogram" fill="none" stroke="url(#tu-signal)" stroke-linejoin="miter" filter="url(#tu-glow)">
      <path
        d="M32 32H128V49H105V111C105 130 95 141 80 141C65 141 55 130 55 111V49H32V32Z"
        stroke-width="7"
        stroke-opacity=".95"
      />
      <path
        d="M58 35H102V49H90V126H70V49H58V35Z"
        stroke-width="5.4"
      />
    </g>

    <g class="tu-brand-globe">
      <circle cx="80" cy="80" r="35" fill="#07141e" stroke="#4cc9ef" stroke-opacity=".72" stroke-width="1"/>
      <circle cx="80" cy="80" r="31" fill="url(#tu-earth)"/>
      <circle cx="80" cy="80" r="31" fill="url(#tu-core)" opacity=".52"/>
      <g clip-path="url(#tu-globe-clip)" fill="none" stroke="#d8fbff" stroke-opacity=".38">
        <path d="M45 80h70M80 49v62" stroke-width=".7"/>
        <ellipse cx="80" cy="80" rx="21" ry="31" stroke-width=".55"/>
        <ellipse cx="80" cy="80" rx="31" ry="13" stroke-width=".55"/>
      </g>
      <g clip-path="url(#tu-globe-clip)" fill="#e9fbff" fill-opacity=".72">
        <path d="M57 61l9-5 9 2 3 7-5 5-7-1-4 6-6-3z"/>
        <path d="M85 57l10 2 6 8-2 7 6 5-2 7-7-1-4-9-8-4-4-7z"/>
        <path d="M69 87l8-5 8 2 3 7-4 5 1 11-6 8-4-4 1-8-6-7z"/>
      </g>
      <circle cx="80" cy="80" r="34" fill="none" stroke="url(#tu-signal)" stroke-opacity=".78" stroke-width="1.4"/>
    </g>

    <g class="tu-brand-signal" fill="none" stroke-width="1">
      <path d="M23 57h13l7-7" stroke="#55dac4" stroke-opacity=".58"/>
      <path d="M137 103h-13l-7 7" stroke="#a67ce6" stroke-opacity=".6"/>
      <path d="M24 108h18l5 5" stroke="#44aef4" stroke-opacity=".5"/>
      <path d="M136 52h-18l-5-5" stroke="#b47be8" stroke-opacity=".52"/>
    </g>
  </svg>
</template>
