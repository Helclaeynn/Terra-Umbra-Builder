/** Editorial entry points only. Article bodies and search results remain API-owned. */
export type DiscoveryBrowse = { category?: string; query?: string };
export type DiscoveryResume = { id: string; title: string; sectionId: string; sectionTitle: string };
export type DiscoveryArticle = {
  id: string;
  title: string;
  category: "Réalité" | "Vérité";
  summary: string;
};
export type DiscoveryJourney = {
  id: string;
  title: string;
  description: string;
  articles: DiscoveryArticle[];
};

const california: DiscoveryArticle = {
  id: "realite-v9-grande-californie-2035", title: "Grande Californie en 2035", category: "Réalité",
  summary: "Prendre ses repères dans le territoire, la société et les pouvoirs du monde visible."
};
const executive: DiscoveryArticle = {
  id: "realite-v9-executif-grande-californie", title: "Exécutif de Grande Californie", category: "Réalité",
  summary: "Poursuivre le panorama avec les institutions qui gouvernent la Grande Californie."
};
const neurodivers: DiscoveryArticle = {
  id: "realite-v9-crawlers-neurodivers", title: "Neurodivers — les Cafards", category: "Réalité",
  summary: "Découvrir les spécialistes de l’Holonet et une autre manière de parcourir les réseaux."
};
const truth: DiscoveryArticle = {
  id: "verite-v7-derriere-le-voile", title: "Derrière le Voile", category: "Vérité",
  summary: "Comprendre comment Réalité et Vérité se superposent dans un même monde."
};
const veil: DiscoveryArticle = {
  id: "verite-v7-voile-hologramme", title: "Le Voile & l’Hologramme", category: "Vérité",
  summary: "Approfondir la perception, les souvenirs et les traces du monde caché."
};
const vampires: DiscoveryArticle = {
  id: "verite-v7-vampires-civilisation-cours-sangs", title: "Vampires — civilisation, Cours & Sangs", category: "Vérité",
  summary: "Prolonger la découverte des lignées avec les sociétés et les héritages vampiriques."
};
const khinae: DiscoveryArticle = {
  id: "verite-v7-descendants-khinae", title: "Descendants de Khinae", category: "Vérité",
  summary: "Entrer dans l’histoire des lignées changeformes et de leurs racines communes."
};
const mages: DiscoveryArticle = {
  id: "verite-v7-mages-mageius-roue-loges", title: "Mages — Mageius, Roue & Loges", category: "Vérité",
  summary: "Rencontrer les traditions des Mages, leurs communautés et la transmission de leurs savoirs."
};

export const discoveryFeatured = [california, veil, vampires];
export const discoveryVeilArticle = veil;
export const discoveryTruthArticle = truth;

// The API matches all query tokens. A single, visible term searches the whole
// accessible corpus; these entries must never filter a local sample of IDs.
export const discoveryThemes: Array<{ id: string; title: string; description: string; browse: DiscoveryBrowse }> = [
  { id: "territoires-pouvoirs", title: "Territoires & pouvoirs", description: "Lieux, institutions et communautés.", browse: { query: "territoire" } },
  { id: "reseaux-technologies", title: "Réseaux & technologies", description: "Société connectée et univers de l’Holonet.", browse: { query: "Holonet" } },
  { id: "voile-perception", title: "Voile & perception", description: "Les différentes lectures du même monde.", browse: { query: "Voile" } },
  { id: "origines-lignees", title: "Origines & lignées", description: "Peuples, descendances et héritages.", browse: { query: "lignée" } },
  { id: "magie-transmission", title: "Magie & transmission", description: "Traditions, pratiques et savoirs partagés.", browse: { query: "magie" } }
];

export const discoveryJourneys: DiscoveryJourney[] = [
  {
    id: "reperes-en-2035", title: "Prendre ses repères en 2035",
    description: "Commencer par la Grande Californie, consulter son exécutif, puis découvrir les Neurodivers.",
    articles: [california, executive, neurodivers]
  },
  {
    id: "decouvrir-la-verite", title: "Découvrir la Vérité",
    description: "Lire l’introduction à la Vérité, explorer le Voile, puis ouvrir le dossier des Mages.",
    articles: [truth, veil, mages]
  },
  {
    id: "suivre-les-lignees", title: "Suivre les lignées",
    description: "Parcourir les descendants de Khinae, puis prolonger la lecture avec les Cours et les Sangs des Vampires.",
    articles: [khinae, vampires]
  }
];

export const discoveryGuide = {
  title: "Entrer dans Terra Umbra",
  intro: "Tu peux commencer par une simple curiosité : à quoi ressemble la vie en 2035, qui dirige la Grande Californie, ou que cache le Voile ? Ce guide ouvre plusieurs portes sur le Compendium. Suis le chemin qui t’attire, prends quelques repères, puis explore à ton rythme. Tu n’as pas besoin de tout retenir pour trouver ce qui te donne envie de jouer.",
  sections: [
    {
      id: "commencer-par-la-realite", title: "Prendre pied dans la Réalité", layer: "Réalité",
      body: "Pour découvrir le quotidien, commence par Grande Californie en 2035 : ce panorama présente le territoire, ses transformations et les pouvoirs qui s’y côtoient. Poursuis avec l’Exécutif si tu t’intéresses aux institutions, ou avec les Neurodivers si l’Holonet éveille ta curiosité. La Réalité donne déjà de quoi imaginer des lieux, des relations et des tensions, avant même d’aborder le monde caché.",
      articles: [california, executive, neurodivers],
      image: "/brand/orbital/guide-realite-2035.webp",
      alt: "Illustration des beaux quartiers gouvernementaux de Grande Californie : rue animée, cafés éclairés, palmiers et tours au crépuscule.",
      caption: "Les beaux quartiers gouvernementaux, côté Réalité."
    },
    {
      id: "decouvrir-la-verite", title: "Regarder derrière le Voile", layer: "Vérité",
      body: "Si le monde caché t’attire, ouvre d’abord Derrière le Voile. Tu y trouveras un repère essentiel : Réalité et Vérité occupent le même monde. Le Voile & l’Hologramme permet ensuite d’approfondir la perception, les souvenirs et les traces. Ces deux lectures donnent du contexte aux êtres et aux communautés que tu rencontreras dans les autres dossiers.",
      articles: [truth, veil],
      image: "/brand/orbital/guide-verite-voile.webp",
      alt: "Même vue des beaux quartiers gouvernementaux derrière le Voile : ombres sur les façades, brume et reflets violets.",
      caption: "Les mêmes quartiers gouvernementaux, derrière le Voile."
    },
    {
      id: "suivre-sa-curiosite", title: "Suivre une histoire qui t’intrigue", layer: "Vérité",
      body: "Tu préfères entrer par des êtres et leurs histoires ? Les descendants de Khinae ouvrent sur plusieurs lignées. Les Vampires présentent leur civilisation, leurs Cours et leurs Sangs. Les Mages explorent le Mageius, la Roue et les Loges. Choisis un premier dossier selon ta curiosité, puis prolonge ta découverte parmi les peuples et les traditions du Compendium.",
      articles: [khinae, vampires, mages]
    },
    {
      id: "du-lore-au-personnage", title: "Laisser naître une idée de personnage", layer: "Réalité",
      body: "Le lore aide à imaginer des attaches, des envies et une manière de regarder le monde. Pour construire ton personnage, poursuis avec les règles de création. Note ce qui t’inspire et les questions à partager avec ta table. Distingue aussi tes lectures de ce que ton personnage connaît ou comprend de la Vérité.",
      articles: [], browse: { category: "Règles" } as DiscoveryBrowse
    }
  ]
};

export function discoveryBrowseHref(target: DiscoveryBrowse): string {
  const params = new URLSearchParams();
  if (target.category) params.set("category", target.category);
  if (target.query) params.set("q", target.query);
  return `/compendium?${params.size ? params : "view=all"}`;
}

/** Preserve native new-tab, new-window, download and middle-click behavior. */
export function isDiscoveryNavigationClick(event: Pick<MouseEvent, "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "defaultPrevented">): boolean {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
