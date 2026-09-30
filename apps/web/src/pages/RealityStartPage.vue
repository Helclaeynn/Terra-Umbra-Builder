<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PlayerStartFrame from '../components/PlayerStartFrame.vue';
import GuideIllustration from '../components/GuideIllustration.vue';
import reality from '../lib/reality-start.json';
import { articleHref } from '../lib/player-start';
const route=useRoute();
const profile=computed(()=>reality.profiles.find(p=>p.id===route.params.milieu));
</script>
<template>
  <PlayerStartFrame>
    <template v-if="profile">
      <div class="start-breadcrumb"><RouterLink to="/decouvrir#milieu">← Choisir un autre milieu</RouterLink><span>TA VIE DANS LA RÉALITÉ</span></div>
      <header class="start-hero start-hero-small start-guide-cover"><div><p class="start-eyebrow">TON PREMIER PERSONNAGE</p><h1>Jouer {{ profile.playTitle }}</h1><p class="start-lead">{{ profile.hook }}</p><nav class="start-anchors" aria-label="Dans ce guide"><a href="#envie">Est-ce pour moi ?</a><a href="#regard">Regards et stéréotypes</a><a href="#quotidien">Ma vie</a><a href="#capacites">Mes moyens et mes limites</a><a href="#preparer">Avant la partie</a><a href="#approfondir">Pour aller plus loin</a></nav></div><GuideIllustration :image="profile.illustration" eager /></header>
      <div class="start-guide-body" :data-reality-guide="profile.id">
        <section id="envie" class="start-choice"><div><p class="start-eyebrow">L’ENVIE DE JEU</p><h2>Pourquoi le jouer ?</h2><p>{{ profile.appeal }}</p></div><div><p class="start-eyebrow">À ACCEPTER AVEC CE CHOIX</p><h2>Ce que cela implique</h2><p>{{ profile.tradeoff }}</p></div></section>
        <section class="start-prose"><h2>Qui suis-je ?</h2><p>{{ profile.definition }}</p><dl class="guide-quick-terms"><div v-for="term in profile.quickTerms" :key="term.label"><dt><RouterLink :to="articleHref(term.article)">{{ term.label }} ↗</RouterLink></dt><dd>{{ term.text }}</dd></div></dl></section>
        <section class="start-prose"><h2>Pourquoi cette vie ?</h2><p>{{ profile.motivation }}</p></section>
        <section class="start-prose"><h2>Ce qui a façonné mon milieu</h2><p>{{ profile.heritage }}</p></section>
        <section id="regard" class="start-prose"><h2>Quel regard sur le monde ?</h2><p>{{ profile.outlook }}</p><details class="start-stereotypes"><summary>Stéréotypes : ce qu’il pourrait dire des autres <span>{{ profile.stereotypes.length }} regards qui grincent</span></summary><div class="start-stereotypes-content"><p>Des voix de personnage, avec leur mépris, leurs rancunes et leur mauvaise foi. Elles donnent du relief à la coopération, sans dicter les convictions des joueurs.</p><article v-for="stereotype in profile.stereotypes" :key="stereotype.subject" class="start-stereotype"><h3>{{ stereotype.subject }}</h3><blockquote>« {{ stereotype.voice }} »</blockquote></article></div></details></section>
        <section class="start-prose"><h2>Ce que je sais vraiment</h2><p>{{ profile.knowledge }}</p></section>
        <section id="quotidien" class="start-prose"><h2>Comment se passe ma vie ?</h2><p>{{ profile.daily }}</p></section>
        <section v-if="'militant' in profile" class="start-prose"><h2>{{ profile.militantTitle }}</h2><p>{{ profile.militant }}</p><aside class="start-example"><strong>Une mission, plusieurs façons de la servir</strong><p>{{ profile.militantScene }}</p></aside><RouterLink :to="articleHref('realite-v9-chretiente-reunifiee')">Découvrir les ordres et forces de la Chrétienté →</RouterLink></section>
        <section id="capacites" class="start-prose"><h2>Sur quoi puis-je compter ?</h2><p>{{ profile.resources }}</p><h3>Mes limites</h3><p>{{ profile.limits }}</p></section>
        <section class="start-prose"><h2>Quand la pression monte</h2><p>{{ profile.pressure }}</p><h3>Le jouer dans une scène</h3><p>{{ profile.scene }}</p></section>
        <section class="start-prose"><h2>Pourquoi rester avec le groupe ?</h2><p>{{ profile.team }}</p><aside class="start-example"><strong>Piste de personnage à adapter avec le MJ</strong><p>{{ profile.example }}</p></aside></section>
        <section id="preparer" class="start-prose start-prepare"><p class="start-eyebrow">AVANT LA PREMIÈRE PARTIE</p><h2>Trois réponses pour commencer</h2><ol><li v-for="question in profile.choices" :key="question">{{ question }}</li></ol></section>
        <section id="approfondir" class="start-prose"><p class="start-eyebrow">LE COMPENDIUM À TON RYTHME</p><h2>Pour aller plus loin</h2><p>Ces dossiers permettent de choisir une organisation, préciser un métier ou situer tes attaches.</p><div class="start-links"><RouterLink v-for="link in profile.links" :key="link.article" :to="articleHref(link.article)">{{ link.label }} →</RouterLink></div><RouterLink class="start-button" to="/decouvrir#choisir">Choisir aussi ma Nature et ouvrir son guide →</RouterLink><div class="start-links"><RouterLink to="/decouvrir#suite">Le parcours du compte à la première partie →</RouterLink><RouterLink to="/account">Aller à mes personnages →</RouterLink></div><p class="start-caption">Un compte est nécessaire pour créer et sauvegarder tes personnages : inscris-toi sur le site si tu n’en as pas encore, puis connecte-toi.</p></section>
      </div>
    </template>
    <section v-else-if="route.params.milieu" class="start-prose start-not-found"><h1>Ce guide de Réalité n’existe pas</h1><RouterLink class="start-button" to="/decouvrir#milieu">Choisir un milieu →</RouterLink></section>
    <template v-else>
      <div class="start-breadcrumb"><RouterLink to="/decouvrir">← Le parcours pour bien commencer</RouterLink><span>TA VIE EN 2035</span></div>
      <header class="start-hero start-hero-small"><p class="start-eyebrow">LES GUIDES DE LA RÉALITÉ</p><h1>De quoi vis-tu ?<br><em>À qui dois-tu quelque chose ?</em></h1><p class="start-lead">Un contrat, un badge, une communauté, une famille ou la volonté de n’appartenir à personne : choisis le milieu dans lequel tu veux vivre tes aventures. Chacun a son guide.</p></header>
      <section class="start-prose"><h2>Une place sociale, quelle que soit ta Nature</h2><p>Ton milieu décrit ta place dans la société ; ta Nature décrit ce que tu es. Un Vampire peut travailler dans l’administration, un Mage dans une corporation, un Exilé vivre comme Crawler. Commence par le milieu qui te parle, puis donne à ton personnage un métier, une attache et une obligation.</p></section>
      <div class="start-profile-grid reality-profile-grid"><RouterLink v-for="item in reality.profiles" :key="item.id" :to="`/decouvrir/realite/${item.id}`" class="start-profile"><img class="start-profile-image" :src="item.illustration.src" :alt="item.illustration.alt" width="480" height="270" loading="lazy" decoding="async"><span class="start-eyebrow">VIE DANS LA RÉALITÉ</span><h3>{{ item.title }}</h3><p>{{ item.hook }}</p><span class="start-profile-action">Pourquoi le jouer ? →</span></RouterLink></div>
      <section class="start-prose"><RouterLink class="start-button" to="/decouvrir#choisir">Explorer aussi les Natures →</RouterLink></section>
    </template>
  </PlayerStartFrame>
</template>
