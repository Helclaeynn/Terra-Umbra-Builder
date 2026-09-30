<script setup lang="ts">
import { RouterLink } from 'vue-router';
import PlayerStartFrame from '../components/PlayerStartFrame.vue';
import GuideIllustration from '../components/GuideIllustration.vue';
import GuideRulesReminder from '../components/GuideRulesReminder.vue';
import reality from '../lib/reality-start.json';
import { articleHref } from '../lib/player-start';
</script>
<template>
  <PlayerStartFrame>
    <div class="start-breadcrumb"><RouterLink to="/decouvrir">← Le parcours pour bien commencer</RouterLink><span>TA VIE EN 2035</span></div>
    <header class="start-hero start-hero-small"><p class="start-eyebrow">GUIDE DE LA RÉALITÉ</p><h1>De quoi vis-tu ?<br><em>Sur qui peux-tu compter ?</em></h1><p class="start-lead">Corpo, Crawler, Gouvernemental, Religieux ou Pègre : cinq milieux pour donner à ton personnage un quotidien, des ressources et des obligations.</p><nav class="start-anchors" aria-label="Milieux de la Réalité"><a v-for="profile in reality.profiles" :key="profile.id" :href="`#${profile.id}`">{{ profile.title }}</a><a href="#regles">Règle de base</a><a href="#suite">La suite</a></nav></header>
    <section class="start-prose"><h2>Une vie publique, quelle que soit ta Nature</h2><p>La <strong>Réalité</strong> est le monde publiquement connu en 2035. La <strong>Vérité</strong> désigne sa part cachée : peuples surnaturels, extraterrestres et pouvoirs. Ce sont deux aspects du même monde. Ton milieu décrit ta place sociale ; ta Nature décrit ce que tu es.</p><p>Un Vampire peut travailler dans l’administration, un Mage dans une corporation, un Exilé vivre comme Crawler. Inversement, appartenir à un culte ou à une agence ne donne pas automatiquement de pouvoirs ni accès aux secrets du monde.</p><p class="start-note">Commence par le milieu qui te parle. Choisis un métier, une personne de confiance et une obligation. Tu peux avoir des liens avec plusieurs milieux : ces portraits servent à situer ta vie, pas à enfermer ton personnage.</p></section>
    <div class="reality-compare"><RouterLink v-for="profile in reality.profiles" :key="profile.id" :to="`/decouvrir/realite#${profile.id}`"><strong>{{ profile.title }}</strong><span>{{ profile.hook }}</span></RouterLink></div>
    <section v-for="profile in reality.profiles" :id="profile.id" :key="profile.id" class="start-section reality-profile">
      <header><p class="start-eyebrow">UN MILIEU, PLUSIEURS VIES POSSIBLES</p><h2>{{ profile.title }}</h2><p class="start-lead">{{ profile.hook }}</p></header>
      <GuideIllustration :image="profile.illustration" />
      <div class="start-guide-body"><section class="start-prose"><h3>Ce que cela veut dire</h3><p>{{ profile.definition }}</p></section>
        <div class="start-choice"><div><h3>Pourquoi le jouer ?</h3><p>{{ profile.appeal }}</p></div><div><h3>Ce que cela implique</h3><p>{{ profile.tradeoff }}</p></div></div>
        <section class="start-prose"><h3>Mon quotidien</h3><p>{{ profile.daily }}</p><h3>Ce que je sais vraiment</h3><p>{{ profile.knowledge }}</p></section>
        <details class="start-stereotypes"><summary>Regard sur les autres : quatre stéréotypes possibles</summary><div class="start-stereotypes-content"><p>Des paroles possibles de personnage, ni des vérités objectives ni une personnalité imposée. Le métier, les expériences et les personnes rencontrées peuvent changer ce regard.</p><article v-for="stereotype in profile.stereotypes" :key="stereotype.subject" class="start-stereotype"><h3>{{ stereotype.subject }}</h3><blockquote>« {{ stereotype.voice }} »</blockquote><p>{{ stereotype.limit }}</p></article></div></details>
        <section class="start-prose"><h3>Le jouer dans une scène</h3><p>{{ profile.scene }}</p></section>
        <section class="start-prose start-prepare"><h3>Trois questions avant de jouer</h3><ol><li v-for="question in profile.choices" :key="question">{{ question }}</li></ol></section>
        <section class="start-prose"><h3>Pour aller plus loin</h3><p>Ouvre ces dossiers pour préciser une organisation, un métier ou un engagement.</p><div class="start-links"><RouterLink v-for="link in profile.links" :key="link.article" :to="articleHref(link.article)">{{ link.label }} →</RouterLink></div><a class="reality-back" href="#start-main">↑ Revenir aux cinq milieux</a></section>
      </div>
    </section>
    <div class="start-guide-body"><GuideRulesReminder /><section id="suite" class="start-section"><h2>Ta vie est posée. Et ta Nature ?</h2><p class="start-section-intro">Tu peux jouer un humain sans origine surnaturelle ou explorer un des profils de Vérité. Le guide correspondant explique ses capacités, sa culture et ce qu’il sait des autres.</p><div class="start-links"><RouterLink to="/decouvrir#choisir">Choisir ma Nature et ouvrir son guide →</RouterLink><RouterLink to="/glossaire">Comprendre un mot avec le glossaire →</RouterLink><RouterLink to="/account">Créer mon personnage · compte requis →</RouterLink></div><p class="start-caption">Les guides sont publics. Pour créer et sauvegarder ton personnage, inscris-toi sur le site, puis connecte-toi.</p></section></div>
  </PlayerStartFrame>
</template>
