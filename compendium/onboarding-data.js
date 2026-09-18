export const PLAYER_START = {
  basics: [
    {
      id: 'guide-realite-nouveau-joueur',
      label: 'Réalité — Guide du nouveau joueur',
      summary: 'Comprendre le monde visible, ce qu’un personnage ordinaire connaît et comment la Réalité rencontre la Vérité.'
    },
    {
      id: 'guide-verite-nouveau-joueur',
      label: 'Vérité — Guide du nouveau joueur',
      summary: 'Comprendre la superposition Réalité/Vérité, la révélation, le Voile et la manière dont le surnaturel agit sur le monde visible.'
    },
    {
      id: 'verite-002-le-voile-et-l-hologramme',
      label: 'Le Voile et l’Hologramme',
      summary: 'Comprendre pourquoi le surnaturel n’apparaît pas de la même manière à tous.'
    },
    {
      id: 'realite-005-4-creation-et-progression',
      label: 'Création et progression',
      summary: 'Passer du cadre de jeu à la construction concrète d’un personnage.'
    }
  ],
  natures: [
    {
      label: 'Humain / Chasseur',
      summary: 'Le point d’entrée humain dans la Vérité, avec les règles et la doctrine propres aux Chasseurs.',
      rulesId: 'regles-verite-nature-humain',
      loreId: 'verite-055-19-formation-et-doctrine-de-chasseur'
    },
    {
      label: 'Vampire',
      summary: 'La Nature vampirique, ses règles communes et les sociétés de Vampires.',
      rulesId: 'regles-verite-nature-vampire',
      loreId: 'verite-046-10-vampires'
    },
    {
      label: 'Garou',
      summary: 'Les loups descendants de Khinae, leurs règles de Nature et leurs Pelages.',
      rulesId: 'regles-verite-nature-garou',
      loreId: 'verite-047-11-garous-loups-descendants-de-khinae'
    },
    {
      label: 'Descendant de Khinae',
      summary: 'Les autres lignées issues de Khinae au-delà des Garous.',
      rulesId: 'regles-verite-nature-khinae',
      loreId: 'verite-048-12-autres-descendants-de-khinae'
    },
    {
      label: 'Mage',
      summary: 'La Nature mage, ses Talents communs et ses différentes affinités magiques.',
      rulesId: 'regles-verite-nature-mage',
      loreId: 'verite-049-13-mages'
    },
    {
      label: 'Daemon',
      summary: 'Une Nature liée aux Divinités daemoniaques, à leurs Maisonnées et à leurs Faveurs.',
      rulesId: 'regles-verite-nature-daemon',
      loreId: 'verite-050-14-daemons'
    },
    {
      label: 'Angelus',
      summary: 'La Nature céleste des Angelus, reliée à l’Arbre de Vie et à la Transcendance.',
      rulesId: 'regles-verite-nature-angelus',
      loreId: 'verite-051-15-angelus'
    },
    {
      label: 'Aseryn',
      summary: 'La Nature aseryne, ses capacités propres et les peuples de la diaspora aseryne.',
      rulesId: 'regles-verite-nature-aseryn',
      loreId: 'verite-052-16-aseryns'
    },
    {
      label: 'Exilé',
      summary: 'Les peuples exilés, leurs traditions et leurs règles de Nature communes ou spécifiques.',
      rulesId: 'regles-verite-nature-exile',
      loreId: 'verite-053-17-exiles-peuples-fonctions-et-traditions'
    },
    {
      label: 'Extral / Humain galactique',
      summary: 'Les origines galactiques regroupées sous les règles Extrals et Humains galactiques.',
      rulesId: 'regles-verite-nature-extral',
      loreId: 'verite-054-18-extrals-homo-superior-et-adrak'
    }
  ],
  restricted: [
    {
      label: 'Ad’rak',
      summary: 'Une origine extrale disposant de sa propre page de lore et d’un accès de création restreint.',
      rulesId: 'regles-verite-extral-ad-rak-origine-restreinte',
      loreId: 'verite-lore-adrak',
      note: 'Origine restreinte'
    }
  ],
  loreHubs: [
    {id:'verite-lore-khinae-originels',label:'Khinae',summary:'Comprendre les superprédateurs originels, les lignées changeformes et la racine ancienne des Vampires.'},
    {id:'verite-056-20-corruption',label:'Corruption',summary:'Souillure, Sources, Fléaux et Rupture : comment une influence extérieure réécrit progressivement un être.'},
    {id:'verite-lore-aer-monde-et-heritages',label:'Aèr',summary:'Relier les passages, les Exilés et plusieurs héritages divins, angéliques et magiques sans confondre Aèr avec toute la Vérité.'},
    {id:'verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele',label:'Cycle & Néant',summary:'Un repère cosmologique pour comprendre ce que la mort révèle et pourquoi certaines lignées n’ont pas le même destin.'}
  ],
  categories: [
    {label: 'Règles', href: '#/category/R%C3%A8gles', summary: 'Création, moteur, combat, progression et règles de Nature.'},
    {label: 'Réalité', href: '#/category/R%C3%A9alit%C3%A9', summary: 'Société, institutions, corporations, technologie et vie quotidienne.'},
    {label: 'Vérité', href: '#/category/V%C3%A9rit%C3%A9', summary: 'Monde caché, peuples, factions, cosmologie et traditions.'},
    {label: 'Équipement & Objets', href: '#/category/%C3%89quipement%20%26%20Objets', summary: 'Équipement de Réalité, augmentations et objets de Vérité.'}
  ]
};

export const WIKI_EXPLICIT_TARGETS = {
  'Réalité': 'guide-realite-nouveau-joueur',
  'Guide de la Réalité': 'guide-realite-nouveau-joueur',
  'Réalité — Guide du nouveau joueur': 'guide-realite-nouveau-joueur',
  'Grande Californie': 'realite-001-chapitre-vivre-en-grande-californie',
  'Vérité': 'guide-verite-nouveau-joueur',
  'Guide de la Vérité': 'guide-verite-nouveau-joueur',
  'Vérité — Guide du nouveau joueur': 'guide-verite-nouveau-joueur',
  'Entrer dans la Vérité': 'guide-verite-nouveau-joueur',
  'se révéler à la Vérité': 'verite-007-se-reveler-n-est-pas-s-eveiller',
  'Se révéler': 'verite-007-se-reveler-n-est-pas-s-eveiller',
  'Éveil': 'verite-007-se-reveler-n-est-pas-s-eveiller',
  'Voir sous le Voile': 'verite-019-voir-n-est-pas-reveler',
  'Voilé': 'verite-006-voile-semi-revele-revele',
  'Semi-Révélé': 'verite-006-voile-semi-revele-revele',
  'Semi-Révélée': 'verite-006-voile-semi-revele-revele',
  'Révélé': 'verite-006-voile-semi-revele-revele',
  'Révélée': 'verite-006-voile-semi-revele-revele',
  'Semi-Révélation': 'verite-006-voile-semi-revele-revele',
  'Révélation': 'verite-006-voile-semi-revele-revele',
  'Révéler sa Nature': 'verite-031-reveler-sa-nature-est-un-acte-personnel',
  'Voile': 'verite-002-le-voile-et-l-hologramme',
  'Hologramme': 'verite-002-le-voile-et-l-hologramme',
  'Divinité': 'verite-lore-anciennes-divinites',
  'Divinités': 'verite-lore-anciennes-divinites',
  'Anciennes Divinités': 'verite-lore-anciennes-divinites',
  'Vampire': 'verite-046-10-vampires',
  'Vampires': 'verite-046-10-vampires',
  'Garou': 'verite-047-11-garous-loups-descendants-de-khinae',
  'Garous': 'verite-047-11-garous-loups-descendants-de-khinae',
  'Loups-garous': 'verite-047-11-garous-loups-descendants-de-khinae',
  'loups garous': 'verite-047-11-garous-loups-descendants-de-khinae',
  'Descendant de Khinae': 'verite-048-12-autres-descendants-de-khinae',
  'Descendants de Khinae': 'verite-048-12-autres-descendants-de-khinae',
  'Khinae': 'verite-lore-khinae-originels',
  'Khinae corrompus': 'verite-lore-khinae-originels',
  'Loups descendants de Khinae': 'verite-047-11-garous-loups-descendants-de-khinae',
  'Autres descendants de Khinae': 'verite-048-12-autres-descendants-de-khinae',
  'Mage': 'verite-049-13-mages',
  'Mages': 'verite-049-13-mages',
  'Daemon': 'verite-050-14-daemons',
  'Daemons': 'verite-050-14-daemons',
  'Angelus': 'verite-051-15-angelus',
  'Aseryn': 'verite-052-16-aseryns',
  'Aseryns': 'verite-052-16-aseryns',
  'Exilé': 'verite-053-17-exiles-peuples-fonctions-et-traditions',
  'Exilés': 'verite-053-17-exiles-peuples-fonctions-et-traditions',
  'Extral': 'verite-054-18-extrals-homo-superior-et-adrak',
  'Extrals': 'verite-054-18-extrals-homo-superior-et-adrak',
  'Homo Superior': 'verite-lore-homo-superior',
  'Aèr': 'verite-lore-aer-monde-et-heritages',
  'Aër': 'verite-lore-aer-monde-et-heritages',
  'AIDH': 'lore-humans-galaxy-aidh',
  'Néant': 'verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele',
  'Neant': 'verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele',
  'Cycle & Néant': 'verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele',
  'Cycle et Néant': 'verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele',
  'Cycle, le Néant': 'verite-033-le-cycle-le-neant-et-ce-que-la-mort-revele',
  'Magitech': 'verite-024-science-magie-et-technologie-sous-le-voile',
  'Calamitechnologie': 'verite-catalogue-229-equipement-corrompu-et-calamitechnologie-principes',
  'Ad’rak': 'verite-lore-adrak',
  "Ad'rak": 'verite-lore-adrak',
  'Chasseur': 'verite-055-19-formation-et-doctrine-de-chasseur',
  'Chasseurs': 'verite-055-19-formation-et-doctrine-de-chasseur',
  'Sang Chasseur': 'regles-verite-garou-sang-chasseur-thorkel',
  'Fléau': 'verite-057-21-les-six-fleaux-et-le-faux-septieme',
  'Fléaux': 'verite-057-21-les-six-fleaux-et-le-faux-septieme',
  'Corruption': 'verite-056-20-corruption',
  'Souillure': 'verite-056-20-corruption',
  'Temples Daemoniaques': 'lore-daemon-temples-temples-daemoniaques',
  'Cours vampiriques': 'lore-vampire-courts-cours-vampiriques',
  'Pelages': 'lore-pelages-pelages-concept',
  'Loges des Mages': 'lore-mage-lodges-loges-organisation',
  'Arbre de Vie': 'lore-angelus-arbre-de-vie',
  'Temples Aseryns': 'lore-aseryn-temples-aseryns-descriptif',
  'Grands Exilés': 'lore-grands-exiles-grands-exiles',
  'Abigor': 'verite-lore-divinite-abigor',
  'Alabor': 'verite-lore-divinite-alabor',
  'Astaroth': 'verite-lore-divinite-astaroth',
  'Baal': 'verite-lore-divinite-baal',
  'Belial': 'verite-lore-divinite-belial',
  'Bélial': 'verite-lore-divinite-belial',
  'Belzébuth': 'verite-lore-divinite-belzebuth',
  'Belzebuth': 'verite-lore-divinite-belzebuth',
  'Beelzebuth': 'verite-lore-divinite-belzebuth',
  'Diablo': 'verite-lore-divinite-diablo',
  'Lilith': 'verite-lore-divinite-lilith',
  'Lucifer': 'verite-lore-divinite-lucifer',
  'Mammon': 'verite-lore-divinite-mammon',
  'Méphisto': 'verite-lore-divinite-mephisto',
  'Mephisto': 'verite-lore-divinite-mephisto',
  'Morrighan': 'verite-lore-divinite-morrighan',
  'Satan': 'verite-lore-divinite-satan',
  'Los Angeles': 'realite-lore-laus-securite',
  'LAUS': 'realite-lore-laus-securite',
  'Pègre': 'realite-lore-pegre',
  'Crawlers': 'realite-lore-crawlers-underlife',
  'Underlife': 'realite-lore-crawlers-underlife',
  'Vladivostokskaïa': 'lore-pegre-vladivostokskaia',
  'Vladivostokskaia': 'lore-pegre-vladivostokskaia',
  'Neurodive': 'realite-016-1-principes-du-neurodive',
  'Ombremonde': 'verite-023-l-ombremonde-le-reste-du-monde',
  "L'Ombremonde": 'verite-023-l-ombremonde-le-reste-du-monde',
  'L’Ombremonde': 'verite-023-l-ombremonde-le-reste-du-monde',
  'GAAC': 'lore-extrals-groups-gaac'
};

export const WIKI_SEARCH_FALLBACKS=['Revenants','Katanja'];

export const WIKI_STRICT_SURFACE_ALIASES=['Réalité','Vérité','Voilé','Semi-Révélé','Semi-Révélée','Révélé','Révélée','Semi-Révélation','Révélation','Corruption'];
export const WIKI_CASE_SENSITIVE_ALIASES=['Réalité','Vérité','Voile','Hologramme','Voilé','Semi-Révélé','Semi-Révélée','Révélé','Révélée','Semi-Révélation','Révélation','Éveil','Corruption','Chasseur','Chasseurs','Fléau','Fléaux'];
