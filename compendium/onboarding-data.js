export const PLAYER_START = {
  basics: [
    {
      id: 'realite-001-chapitre-vivre-en-grande-californie',
      label: 'La Réalité',
      summary: 'Découvrir la Grande Californie, son quotidien et le cadre visible dans lequel les personnages vivent.'
    },
    {
      id: 'verite-001-la-verite-n-est-pas-un-second-monde',
      label: 'La Vérité',
      summary: 'Comprendre le monde caché et sa relation avec la Réalité.'
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
      rulesId: 'regles-verite-nature-humain',
      loreId: 'verite-055-19-formation-et-doctrine-de-chasseur'
    },
    {
      label: 'Vampire',
      rulesId: 'regles-verite-nature-vampire',
      loreId: 'verite-046-10-vampires'
    },
    {
      label: 'Garou',
      rulesId: 'regles-verite-nature-garou',
      loreId: 'verite-047-11-garous-loups-descendants-de-khinae'
    },
    {
      label: 'Descendant de Khinae',
      rulesId: 'regles-verite-nature-khinae',
      loreId: 'verite-048-12-autres-descendants-de-khinae'
    },
    {
      label: 'Mage',
      rulesId: 'regles-verite-nature-mage',
      loreId: 'verite-049-13-mages'
    },
    {
      label: 'Daemon',
      rulesId: 'regles-verite-nature-daemon',
      loreId: 'verite-050-14-daemons'
    },
    {
      label: 'Angelus',
      rulesId: 'regles-verite-nature-angelus',
      loreId: 'verite-051-15-angelus'
    },
    {
      label: 'Aseryn',
      rulesId: 'regles-verite-nature-aseryn',
      loreId: 'verite-052-16-aseryns'
    },
    {
      label: 'Exilé',
      rulesId: 'regles-verite-nature-exile',
      loreId: 'verite-053-17-exiles-peuples-fonctions-et-traditions'
    },
    {
      label: 'Extral / Humain galactique',
      rulesId: 'regles-verite-nature-extral',
      loreId: 'verite-054-18-extrals-homo-superior-et-adrak'
    }
  ],
  restricted: [
    {
      label: 'Ad’rak',
      rulesId: 'regles-verite-extral-ad-rak-origine-restreinte',
      loreId: 'verite-lore-adrak',
      note: 'Origine restreinte'
    }
  ],
  categories: [
    {label: 'Règles', href: '#/category/R%C3%A8gles', summary: 'Création, moteur, combat, progression et règles de Nature.'},
    {label: 'Réalité', href: '#/category/R%C3%A9alit%C3%A9', summary: 'Société, institutions, corporations, technologie et vie quotidienne.'},
    {label: 'Vérité', href: '#/category/V%C3%A9rit%C3%A9', summary: 'Monde caché, peuples, factions, cosmologie et traditions.'},
    {label: 'Équipement & Objets', href: '#/category/%C3%89quipement%20%26%20Objets', summary: 'Équipement de Réalité, augmentations et objets de Vérité.'}
  ]
};

export const WIKI_EXPLICIT_TARGETS = {
  'Réalité': 'realite-001-chapitre-vivre-en-grande-californie',
  'Grande Californie': 'realite-001-chapitre-vivre-en-grande-californie',
  'Vérité': 'verite-001-la-verite-n-est-pas-un-second-monde',
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
  'Descendant de Khinae': 'verite-048-12-autres-descendants-de-khinae',
  'Descendants de Khinae': 'verite-048-12-autres-descendants-de-khinae',
  'Khinae': 'verite-048-12-autres-descendants-de-khinae',
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
  'Ad’rak': 'verite-lore-adrak',
  "Ad'rak": 'verite-lore-adrak',
  'Chasseur': 'verite-055-19-formation-et-doctrine-de-chasseur',
  'Chasseurs': 'verite-055-19-formation-et-doctrine-de-chasseur',
  'Fléau': 'verite-057-21-les-six-fleaux-et-le-faux-septieme',
  'Fléaux': 'verite-057-21-les-six-fleaux-et-le-faux-septieme',
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
  'Neurodive': 'realite-016-1-principes-du-neurodive',
  'Ombremonde': 'verite-023-l-ombremonde-le-reste-du-monde',
  'GAAC': 'lore-extrals-groups-gaac'
};

export const WIKI_SEARCH_FALLBACKS=['Revenants','Katanja'];
