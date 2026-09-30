<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PlayerStartFrame from '../components/PlayerStartFrame.vue';
import GuideIllustration from '../components/GuideIllustration.vue';
import GuideRulesReminder from '../components/GuideRulesReminder.vue';
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
      <header class="start-hero start-hero-small start-guide-cover"><div>
        <p class="start-eyebrow">TON PREMIER PERSONNAGE</p><h1>Jouer {{ guide.title === 'Autre descendant de Khinae' ? 'un descendant de Khinae' : `un ${guide.title}` }}</h1>
        <p class="start-lead">{{ guide.hook }}</p>
        <nav class="start-anchors" aria-label="Dans ce guide"><a href="#envie">Est-ce pour moi ?</a><a href="#regard">Regards et stéréotypes</a><a href="#quotidien">Ma vie</a><a href="#capacites">Mes capacités</a><a href="#regles">Règle de base</a><a href="#preparer">Avant la partie</a><a href="#approfondir">Pour aller plus loin</a></nav></div><GuideIllustration :image="guide.illustration" eager />
      </header>
      <div class="start-guide-body">
        <section id="envie" class="start-choice" aria-labelledby="appeal-title">
          <div><p class="start-eyebrow">L’ENVIE DE JEU</p><h2 id="appeal-title">Pourquoi le jouer ?</h2><p>{{ guide.appeal }}</p></div>
          <div><p class="start-eyebrow">À ACCEPTER AVEC CE CHOIX</p><h2>Ce que cela implique</h2><p>{{ guide.tradeoff }}</p></div>
        </section>
        <section class="start-prose"><h2>Qui suis-je ?</h2><p>{{ guide.identity }}</p><p v-if="guide.id!=='humain'" class="start-caption">L’illustration montre au lecteur une apparence ou une scène de Vérité. Le Voile peut en donner une apparence ordinaire aux témoins humains.</p><dl class="guide-quick-terms"><div v-for="term in guide.quickTerms" :key="term.id"><dt><RouterLink :to="glossaryHref(term.id)">{{ term.label }} ↗</RouterLink></dt><dd>{{ term.text }}</dd></div></dl></section>
        <section class="start-prose"><h2>Comprendre mon héritage</h2><p>{{ guide.heritage }}</p></section>
        <section id="regard" class="start-prose"><h2>Quel regard sur le monde ?</h2><p>{{ guide.outlook }}</p>
          <p v-if="guide.earthPerspective" class="start-note">{{ guide.earthPerspective }}</p>
          <aside class="start-interpretation"><h3>{{ guide.interpretation.title }}</h3><p>{{ guide.interpretation.text }}</p><blockquote>{{ guide.interpretation.example }}</blockquote><RouterLink :to="glossaryHref(guide.interpretation.term)">{{ termLabel(guide.interpretation.term) }} : la définition courte ↗</RouterLink></aside>
          <p class="start-caption">Des repères culturels, à nuancer par ton éducation et ton parcours. Ils ne décident pas de ta personnalité.</p>
        </section>
        <section class="start-prose" aria-labelledby="knowledge-title"><h2 id="knowledge-title">Ce que je sais des autres</h2><p>{{ guide.knowledge.known }}</p><p class="start-note"><strong>Ce qui reste généralement inconnu</strong><br>{{ guide.knowledge.unknown }}</p>
          <details class="start-stereotypes"><summary>Stéréotypes : ce qu’il pourrait dire des autres <span>{{ guide.stereotypes.length }} regards possibles</span></summary>
            <div class="start-stereotypes-content"><p>{{ playerStart.stereotypesNote }}</p><p class="start-caption">{{ guide.knowledge.rumours }}</p>
              <article v-for="(stereotype,index) in guide.stereotypes" :key="index" class="start-stereotype"><div class="start-stereotype-heading"><h3>{{ stereotype.subject }}</h3><span>{{ stereotype.status }}</span></div><p v-if="stereotype.context" class="stereotype-context">{{ stereotype.context }}</p><blockquote>« {{ stereotype.voice }} »</blockquote><p>{{ stereotype.limit }}</p></article>
            </div>
          </details><p class="start-caption"><strong>À préciser avec le MJ.</strong> {{ guide.knowledge.exceptions }}</p>
        </section>
        <section id="quotidien" class="start-prose"><h2>Comment se passe ma vie ?</h2><p>{{ guide.daily }}</p></section>
        <section id="capacites" class="start-prose"><h2>Qu’est-ce que je peux faire ?</h2><p>{{ guide.abilities }}</p><h3>Mes limites</h3><p>{{ guide.limits }}</p></section>
        <section class="start-prose"><h2>Le jouer dans une scène</h2><p>{{ guide.inScene }}</p></section>
        <section class="start-prose"><h2>Pourquoi rester avec le groupe ?</h2><p>{{ guide.team }}</p>
          <aside class="start-example"><strong>Piste de personnage à adapter avec le MJ</strong><p>{{ guide.example.replace('Piste à adapter avec le MJ : ', '') }}</p></aside>
        </section>
        <GuideRulesReminder /><section id="preparer" class="start-prose start-prepare"><p class="start-eyebrow">AVANT LA PREMIÈRE PARTIE</p><h2>Trois réponses suffisent pour commencer</h2><ol><li v-for="question in guide.choices" :key="question">{{ question }}</li></ol><p>Tu n’as pas à connaître toute l’histoire de ce peuple. Le MJ peut te rappeler ce que ton personnage sait au moment où cela devient utile.</p></section>
        <section class="start-prose"><h2>Les mots utiles</h2><p>Une définition courte, puis un lien vers le dossier si tu en as besoin.</p><div class="start-terms"><RouterLink v-for="term in guide.terms" :key="term" :to="glossaryHref(term)">{{ termLabel(term) }} ↗</RouterLink></div></section>
        <section id="approfondir" class="start-prose"><p class="start-eyebrow">LE COMPENDIUM À TON RYTHME</p><h2>Pour aller plus loin</h2><p>Ces dossiers servent de référence. Tu peux les ouvrir pendant la création ou y revenir après la première séance.</p><div class="start-links"><RouterLink v-for="link in guide.links" :key="link.article" :to="articleHref(link.article)">{{ link.label }} →</RouterLink></div><RouterLink class="start-button" to="/decouvrir/realite">Choisir aussi mon milieu dans la Réalité →</RouterLink><br><RouterLink to="/decouvrir#suite">Comment rejoindre une campagne et faire valider ma fiche →</RouterLink><br><RouterLink to="/account" class="start-button">Aller à mes personnages →</RouterLink><p class="start-caption">Un compte est nécessaire pour créer et sauvegarder tes personnages : inscris-toi sur le site si tu n’en as pas encore, puis connecte-toi.</p></section>
      </div>
    </template>
    <section v-else-if="route.params.guide" class="start-prose start-not-found"><h1>Ce guide n’existe pas</h1><p>Retrouve les profils disponibles dans le guide de découverte.</p><RouterLink class="start-button" to="/decouvrir#choisir">Choisir un personnage →</RouterLink></section>
    <template v-else>
      <header class="start-hero"><p class="start-eyebrow">BIENVENUE EN GRANDE CALIFORNIE</p><h1>Comprendre le monde.<br><em>Trouver sa place.</em></h1><p class="start-lead">Tu n’as pas besoin d’apprendre une encyclopédie pour jouer. Terra Umbra California est un jeu de rôle : autour d’une table, chaque joueur incarne un personnage et le MJ fait vivre le monde. Commence ici, puis lis seulement les guides qui concernent ton envie de jeu.</p><nav class="start-anchors" aria-label="Les étapes de découverte"><a href="#cadre">01 · Comprendre le cadre</a><a href="#milieu">02 · Ma vie dans la Réalité</a><a href="#choisir">03 · Ma Nature</a><a href="#suite">04 · Utiliser le site et rejoindre une partie</a></nav></header>
      <section id="cadre" class="start-section"><p class="start-eyebrow">01 / LES CONCEPTS DE BASE</p><h2>Un monde, deux aspects</h2><p class="start-section-intro">Les joueurs décident ce que leurs personnages tentent ; le Maître du Jeu (MJ) décrit les lieux, incarne les autres habitants et fait réagir le monde. Quand l’issue est incertaine et compte pour la scène, les règles permettent de la résoudre avec les dés. Une campagne est une suite de séances vécues avec le même groupe.</p><div class="start-intro-grid"><article v-for="(item,index) in playerStart.intro" :key="item.title" class="start-intro-card"><span class="start-number">0{{ index+1 }}</span><h3>{{ item.title }}</h3><p>{{ item.text }}</p><p class="start-example">{{ item.example }}</p><div class="start-terms"><RouterLink v-for="term in item.terms" :key="term" :to="glossaryHref(term)">{{ termLabel(term) }} ↗</RouterLink></div></article></div></section>

      <section id="milieu" class="start-section start-reality-entry"><p class="start-eyebrow">02 / MA PLACE DANS LA SOCIÉTÉ</p><h2>Ma vie dans la Réalité</h2><p class="start-section-intro">Qui te paie, qui te protège, à qui dois-tu quelque chose ? Avant les pouvoirs, donne une vie à ton personnage. Tu peux être Corpo, Crawler, Gouvernemental, Religieux ou lié à la Pègre, quelle que soit ta Nature.</p><RouterLink to="/decouvrir/realite" class="start-button">Découvrir les cinq milieux et leurs regards sur les autres →</RouterLink></section>
      <section id="choisir" class="start-section"><p class="start-eyebrow">03 / HUMAIN OU NATURE DE VÉRITÉ</p><h2>Qui as-tu envie d’incarner ?</h2><p class="start-section-intro">Commence par une envie : enquêter, protéger, explorer, inventer… Chaque guide explique pourquoi choisir ce profil, ce qu’il demande et comment lui donner une vie.</p>
        <div class="start-filters" role="group" aria-label="Familles de personnages"><button v-for="item in groups" :key="item" type="button" :aria-pressed="group===item" @click="group=item">{{ item }}</button></div>
        <label class="start-search">Chercher un personnage ou une envie<input v-model="query" type="search" placeholder="Homo Superior, enquête, magie…" autocomplete="off"></label>
        <p class="start-caption" role="status">{{ shown.length }} {{ shown.length > 1 ? 'profils' : 'profil' }}{{ group !== 'Tous' ? ` · ${groupDescriptions[group]}` : '' }}</p>
        <div class="start-profile-grid"><RouterLink v-for="item in shown" :key="item.id" :to="`/decouvrir/${item.id}`" class="start-profile"><img class="start-profile-image" :class="{'is-portrait':item.illustration.portrait}" :src="item.illustration.src" :alt="item.illustration.alt" loading="lazy" decoding="async" width="480" height="270"><span class="start-eyebrow">{{ item.group }}</span><h3>{{ item.title }}</h3><p>{{ item.hook }}</p><span class="start-profile-action">Pourquoi le jouer ? →</span></RouterLink></div>
        <p v-if="!shown.length" class="start-note">Aucun profil trouvé. Essaie un autre mot ou la famille « Tous ».</p>
      </section>
      <div class="start-guide-body"><GuideRulesReminder /></div>
      <section id="suite" class="start-section start-last-step" aria-labelledby="site-journey-title">
        <p class="start-eyebrow">04 / DU COMPTE À LA PREMIÈRE PARTIE</p><h2 id="site-journey-title">Comment utiliser le site ?</h2>
        <p>Les guides, le glossaire, les cartes et les articles publics du Compendium se lisent sans compte. <strong>Pour créer et sauvegarder un personnage ou rejoindre une campagne, inscris-toi puis connecte-toi.</strong></p>
        <ol class="start-site-steps">
          <li><span class="start-eyebrow">MJ ET JOUEURS</span><h3>Créer son compte</h3><p>Ouvre <RouterLink to="/account">Mon espace</RouterLink>, puis « Créer un compte ». Chacun utilise son propre compte. Donne ton nom affiché au MJ pour qu’il puisse te retrouver et t’inviter.</p></li>
          <li><span class="start-eyebrow">MJ</span><h3>Préparer la campagne</h3><p>Si tu souhaites mener la partie, demande l’accès dans « Accès Maître du Jeu », dans Mon espace. Un administrateur doit valider cette demande. Une fois l’accès accordé, ouvre <RouterLink to="/campaigns">Mes campagnes</RouterLink>, clique sur « Créer une campagne » et précise le cadre de la table ainsi que ses conditions d’admission. Invite ensuite les joueurs par leur nom de compte.</p></li>
          <li><span class="start-eyebrow">JOUEUR</span><h3>Recevoir et accepter l’invitation</h3><p>Une invitation est signalée dans « Mes campagnes et invitations » de Mon espace et dans <RouterLink to="/campaigns">Mes campagnes</RouterLink>. Ouvre-la, lis les conditions de la table, puis clique sur « Accepter l’invitation ». Tu peux y choisir un personnage déjà sauvegardé ou sélectionner « Je choisirai plus tard ». Si nécessaire, utilise « Actualiser les invitations ».</p></li>
          <li><span class="start-eyebrow">JOUEUR</span><h3>Créer puis proposer sa fiche</h3><p>Depuis <RouterLink to="/account">Mon espace</RouterLink>, crée ton personnage avec le créateur, aussi appelé builder. Avance étape par étape, ouvre le guide lié à ta Nature si besoin, puis enregistre ta fiche. Dans ta campagne, rubrique « Mon personnage », choisis-la et clique sur « Proposer cette fiche » si tu ne l’as pas déjà proposée en acceptant l’invitation.</p><p class="start-caption">La proposition crée une version indépendante pour cette campagne ; ta fiche source reste intacte. Si elle a déjà reçu des gains, vérifie avec le MJ quelle version convient à sa table.</p></li>
          <li><span class="start-eyebrow">MJ, PUIS JOUEUR SI BESOIN</span><h3>Faire valider le personnage</h3><p>Le MJ examine la proposition dans « Admissions des personnages ». Il peut « Accepter la fiche », « Demander des modifications » ou « Refuser la fiche », avec un retour au joueur. Si des corrections sont demandées, modifie et enregistre la fiche de cette campagne, puis clique sur « Soumettre ma version actuelle ». Tu retrouves la décision et les échanges dans « Ma proposition de personnage ».</p><p class="start-note"><strong>Accepter l’invitation et faire accepter sa fiche sont deux étapes distinctes.</strong> Tu peux avoir rejoint la campagne tout en ayant encore un personnage à choisir ou une fiche à faire valider.</p></li>
          <li><span class="start-eyebrow">TOUTE LA TABLE</span><h3>Jouer et faire progresser la bonne version</h3><p>Quand la fiche est acceptée, ouvre-la depuis la campagne pour jouer. Le MJ peut attribuer les gains de séance aux personnages acceptés. La progression de cette version reste propre à cette campagne : vérifie son nom avant de modifier ton personnage si tu joues à plusieurs tables.</p></li>
        </ol>
        <aside class="start-note"><h3>Où retrouver quoi ?</h3><p><strong>Bien commencer</strong> aide à choisir et comprendre ton personnage. Le <strong>glossaire</strong> explique un mot en quelques lignes. Le <strong>Compendium</strong> contient les dossiers de référence et les règles détaillées ; les liens colorés permettent de passer d’un sujet à l’autre. L’<strong>atlas</strong> situe les lieux. <strong>Mon espace</strong> rassemble tes personnages et tes invitations.</p></aside>
        <div class="start-links"><RouterLink to="/account">M’inscrire ou ouvrir Mon espace →</RouterLink><RouterLink to="/campaigns">Retrouver mes campagnes et invitations →</RouterLink><RouterLink to="/glossaire">Comprendre un mot avec le glossaire →</RouterLink><RouterLink to="/atlas">Situer mon quartier sur les cartes →</RouterLink><RouterLink to="/compendium?view=all">Approfondir dans le Compendium →</RouterLink></div>
        <p class="start-caption">Ce guide explique les points de départ. Les articles de règles donnent les effets et les coûts exacts des capacités.</p>
      </section>
    </template>
  </PlayerStartFrame>
</template>
