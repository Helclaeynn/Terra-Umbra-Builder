<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PlayerStartFrame from '../components/PlayerStartFrame.vue';
import { playerStart, playerGuides, normalizeTerm, termLabel, glossaryHref, articleHref } from '../lib/player-start';
const route=useRoute();
const guide=computed(()=>playerGuides.find(g=>g.id===route.params.guide));
const group=ref('Tous');
const query=ref('');
const groups=['Tous',...new Set(playerGuides.map(g=>g.group))];
const shown=computed(()=>playerGuides.filter(g=>(group.value==='Tous'||g.group===group.value)&&normalizeTerm(`${g.title} ${g.hook} ${g.appeal}`).includes(normalizeTerm(query.value))));
const groupDescriptions: Record<string,string>={
  'Vie humaine':'Des compétences, un métier et des attaches. Le Chasseur est un humain reconnu et formé face au surnaturel.',
  'Traditions de Vérité':'Des héritages et des pouvoirs cachés au cœur de la vie terrestre.',
  'Peuples exilés':'Cinq peuples originaires d’un autre monde, installés sur Terre parfois depuis des générations.',
  'Peuples galactiques':'Des espèces extraterrestres et, à part, l’Homo Superior : un humain de l’AIDH transformé par la science.'
};
</script>
<template>
  <PlayerStartFrame>
    <template v-if="guide">
      <div class="start-breadcrumb"><RouterLink to="/decouvrir#choisir">← Choisir un autre personnage</RouterLink><span>{{ guide.group }}</span></div>
      <header class="start-hero start-hero-small">
        <p class="start-eyebrow">TON PREMIER PERSONNAGE</p><h1>Jouer {{ guide.title === 'Autre descendant de Khinae' ? 'un descendant de Khinae' : `un ${guide.title}` }}</h1>
        <p class="start-lead">{{ guide.hook }}</p>
        <nav class="start-anchors" aria-label="Dans ce guide"><a href="#envie">Est-ce pour moi ?</a><a href="#quotidien">Ma vie</a><a href="#capacites">Mes capacités</a><a href="#preparer">Avant la partie</a></nav>
      </header>
      <div class="start-guide-body">
        <section id="envie" class="start-choice" aria-labelledby="appeal-title">
          <div><p class="start-eyebrow">L’ENVIE DE JEU</p><h2 id="appeal-title">Pourquoi le jouer ?</h2><p>{{ guide.appeal }}</p></div>
          <div><p class="start-eyebrow">À ACCEPTER AVEC CE CHOIX</p><h2>Ce que cela implique</h2><p>{{ guide.tradeoff }}</p></div>
        </section>
        <section class="start-prose"><h2>Qui suis-je ?</h2><p>{{ guide.identity }}</p></section>
        <section class="start-prose"><h2>Comprendre mon héritage</h2><p>{{ guide.heritage }}</p></section>
        <section class="start-prose"><h2>Quel regard sur le monde ?</h2><p>{{ guide.outlook }}</p>
          <p v-if="guide.earthPerspective" class="start-note">{{ guide.earthPerspective }}</p>
          <aside class="start-interpretation"><h3>{{ guide.interpretation.title }}</h3><p>{{ guide.interpretation.text }}</p><blockquote>{{ guide.interpretation.example }}</blockquote><RouterLink :to="glossaryHref(guide.interpretation.term)">{{ termLabel(guide.interpretation.term) }} : la définition courte ↗</RouterLink></aside>
          <p class="start-caption">Des repères culturels, à nuancer par ton éducation et ton parcours. Ils ne décident pas de ta personnalité.</p>
        </section>
        <section class="start-prose" aria-labelledby="knowledge-title"><h2 id="knowledge-title">Ce que je sais des autres</h2><p>{{ guide.knowledge.known }}</p><p class="start-note"><strong>Ce qui reste généralement inconnu</strong><br>{{ guide.knowledge.unknown }}</p>
          <details class="start-stereotypes"><summary>Stéréotypes : ce qu’il pourrait dire des autres <span>{{ guide.stereotypes.length }} regards possibles</span></summary>
            <div class="start-stereotypes-content"><p>{{ playerStart.stereotypesNote }}</p><p class="start-caption">{{ guide.knowledge.rumours }}</p>
              <article v-for="(stereotype,index) in guide.stereotypes" :key="index" class="start-stereotype"><div class="start-stereotype-heading"><h3>{{ stereotype.subject }}</h3><span>{{ stereotype.status }}</span></div><blockquote>« {{ stereotype.voice }} »</blockquote><p>{{ stereotype.limit }}</p></article>
            </div>
          </details><p class="start-caption"><strong>À préciser avec le MJ.</strong> {{ guide.knowledge.exceptions }}</p>
        </section>
        <section id="quotidien" class="start-prose"><h2>Comment se passe ma vie ?</h2><p>{{ guide.daily }}</p></section>
        <section id="capacites" class="start-prose"><h2>Qu’est-ce que je peux faire ?</h2><p>{{ guide.abilities }}</p><h3>Mes limites</h3><p>{{ guide.limits }}</p></section>
        <section class="start-prose"><h2>Le jouer dans une scène</h2><p>{{ guide.inScene }}</p></section>
        <section class="start-prose"><h2>Pourquoi rester avec le groupe ?</h2><p>{{ guide.team }}</p>
          <aside class="start-example"><strong>Piste de personnage à adapter avec le MJ</strong><p>{{ guide.example.replace('Piste à adapter avec le MJ : ', '') }}</p></aside>
        </section>
        <section id="preparer" class="start-prose start-prepare"><p class="start-eyebrow">AVANT LA PREMIÈRE PARTIE</p><h2>Trois réponses suffisent pour commencer</h2><ol><li v-for="question in guide.choices" :key="question">{{ question }}</li></ol><p>Tu n’as pas à connaître toute l’histoire de ce peuple. Le MJ peut te rappeler ce que ton personnage sait au moment où cela devient utile.</p></section>
        <section class="start-prose"><h2>Les mots utiles</h2><p>Une définition courte, puis un lien vers le dossier si tu en as besoin.</p><div class="start-terms"><RouterLink v-for="term in guide.terms" :key="term" :to="glossaryHref(term)">{{ termLabel(term) }} ↗</RouterLink></div></section>
        <section class="start-prose"><p class="start-eyebrow">POUR ALLER PLUS LOIN</p><h2>Lire selon ton besoin</h2><p>Ces dossiers servent de référence. Tu peux les ouvrir pendant la création ou y revenir après la première séance.</p><div class="start-links"><RouterLink v-for="link in guide.links" :key="link.article" :to="articleHref(link.article)">{{ link.label }} →</RouterLink></div><RouterLink to="/account" class="start-button">Aller à mes personnages →</RouterLink><p class="start-caption">Un compte est nécessaire pour créer et sauvegarder tes personnages : inscris-toi sur le site si tu n’en as pas encore, puis connecte-toi.</p></section>
      </div>
    </template>
    <section v-else-if="route.params.guide" class="start-prose start-not-found"><h1>Ce guide n’existe pas</h1><p>Retrouve les profils disponibles dans le guide de découverte.</p><RouterLink class="start-button" to="/decouvrir#choisir">Choisir un personnage →</RouterLink></section>
    <template v-else>
      <header class="start-hero"><p class="start-eyebrow">BIENVENUE EN GRANDE CALIFORNIE</p><h1>Comprendre le monde.<br><em>Trouver sa place.</em></h1><p class="start-lead">Tu n’as pas besoin d’apprendre une encyclopédie pour jouer. Voici le cadre, quelques vies possibles et les questions à te poser pour ta première partie.</p><nav class="start-anchors" aria-label="Les étapes de découverte"><a href="#cadre">01 · Comprendre le cadre</a><a href="#choisir">02 · Choisir un personnage</a><a href="#suite">03 · Préparer la partie</a></nav></header>
      <section id="cadre" class="start-section"><p class="start-eyebrow">01 / QUATRE REPÈRES</p><h2>La vie en 2035</h2><div class="start-intro-grid"><article v-for="(item,index) in playerStart.intro" :key="item.title" class="start-intro-card"><span class="start-number">0{{ index+1 }}</span><h3>{{ item.title }}</h3><p>{{ item.text }}</p><p class="start-example">{{ item.example }}</p><div class="start-terms"><RouterLink v-for="term in item.terms" :key="term" :to="glossaryHref(term)">{{ termLabel(term) }} ↗</RouterLink></div></article></div></section>

      <section id="choisir" class="start-section"><p class="start-eyebrow">02 / TON ENVIE DE JEU</p><h2>Qui as-tu envie d’incarner ?</h2><p class="start-section-intro">Commence par une envie : enquêter, protéger, explorer, inventer… Chaque guide explique pourquoi choisir ce profil, ce qu’il demande et comment lui donner une vie.</p>
        <div class="start-filters" role="group" aria-label="Familles de personnages"><button v-for="item in groups" :key="item" type="button" :aria-pressed="group===item" @click="group=item">{{ item }}</button></div>
        <label class="start-search">Chercher un personnage ou une envie<input v-model="query" type="search" placeholder="Homo Superior, enquête, magie…" autocomplete="off"></label>
        <p class="start-caption" role="status">{{ shown.length }} {{ shown.length > 1 ? 'profils' : 'profil' }}{{ group !== 'Tous' ? ` · ${groupDescriptions[group]}` : '' }}</p>
        <div class="start-profile-grid"><RouterLink v-for="item in shown" :key="item.id" :to="`/decouvrir/${item.id}`" class="start-profile"><span class="start-eyebrow">{{ item.group }}</span><h3>{{ item.title }}</h3><p>{{ item.hook }}</p><span class="start-profile-action">Pourquoi le jouer ? →</span></RouterLink></div>
        <p v-if="!shown.length" class="start-note">Aucun profil trouvé. Essaie un autre mot ou la famille « Tous ».</p>
      </section>
      <section id="suite" class="start-section start-last-step"><p class="start-eyebrow">03 / PASSER À LA PARTIE</p><h2>Une personne, une attache, une raison d’agir.</h2><p>Lis le guide de ton personnage, puis discute de tes trois premiers choix avec le MJ. Les règles et les dossiers détaillés restent disponibles quand une question précise se pose.</p><div class="start-links"><RouterLink to="/glossaire">Un mot inconnu ? Ouvrir le glossaire →</RouterLink><RouterLink to="/atlas">Situer mon quartier sur les cartes →</RouterLink><RouterLink to="/compendium?view=all">Approfondir dans le Compendium →</RouterLink><RouterLink to="/account">Retrouver ou créer mon personnage · compte requis →</RouterLink></div><p class="start-caption"><strong>Pour utiliser le créateur et sauvegarder tes personnages, il faut un compte.</strong> Inscris-toi sur le site si tu n’en as pas encore, puis connecte-toi. Les guides et le glossaire se lisent sans inscription.</p><p class="start-caption">Ce guide explique les points de départ. Les articles de règles donnent les effets et les coûts exacts des capacités.</p></section>
    </template>
  </PlayerStartFrame>
</template>
