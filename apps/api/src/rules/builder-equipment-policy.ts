/** Purchase visibility only. Never filter the canonical catalogue or existing inventory. */
export const lifestyleReferenceIds = new Set<string>([
  "objets-usuels-neurodive-n-sta",
  "objets-usuels-neurodive-holophone",
  "objets-usuels-neurodive-hololentilles",
  "objets-usuels-neurodive-idpass",
  "objets-usuels-neurodive-byron-zippo",
  "equipement-civique-puce-de-sante-citoyenne",
  "equipement-civique-ia-personnelle-du-holophone",
  "equipement-civique-pack-domotique-robots-domestiques",
  "vetements-recuperation-sans-abri",
  "vetements-provocante-rue",
  "vetements-neopunk",
  "vetements-citoyen",
  "vetements-ouvrier",
  "vetements-lingerie",
  "vetements-techfighter-biker",
  "vetements-cadre",
  "vetements-grande-lingerie",
  "vetements-haut-cadre",
  "nourriture-ration-synthetique",
  "nourriture-mick-go-alternative",
  "nourriture-mac-yellow",
  "nourriture-famileat",
  "nourriture-artisan-bon-restaurant",
  "nourriture-oldo",
  "nourriture-luxe-vraie-production",
  "boissons-eau-reconditionnee",
  "boissons-soda",
  "boissons-biere-fermentation-d-algues",
  "boissons-alcool-industriel",
  "boissons-alcool-traditionnel",
  "boissons-cafe-synthetique",
  "boissons-cafe-clone-cellulaire",
  "boissons-vrai-cafe",
  "drogues-kick",
  "drogues-velvet",
  "drogues-prism",
  "drogues-redline",
  "drogues-bloom",
  "drogues-fleshfire",
  "drogues-dreamrush",
  "drogues-crashware",
  "services-medicaux-flashmergencies",
  "services-medicaux-careforce-bronze",
  "services-medicaux-careforce-silver",
  "services-medicaux-careforce-golden",
  "services-medicaux-clinique-courante",
  "services-medicaux-chirurgie-hospitalisation",
  "services-medicaux-black-clinic",
  "services-professionnels-formation-courte-adulte",
  "services-professionnels-expertise-technique-medicale",
  "services-professionnels-reparation-courante",
  "services-professionnels-reparation-lourde-augmentique",
  "services-professionnels-faux-document-identite",
  "services-professionnels-service-juridique",
  "services-professionnels-securite-privee",
  "services-professionnels-stockage-box-atelier",
  "loisirs-bar-club-sortie-populaire",
  "loisirs-concert-spectacle-sport",
  "loisirs-immersion-experience-premium",
  "loisirs-evenement-luxe-vip",
  "loisirs-compagnie-sociale-courte",
  "loisirs-compagnie-intime-prostitution-legale",
  "transports-metro-tram",
  "transports-pass-metro-tram",
  "transports-mas-court-trajet",
  "transports-mas-trajet-long-urbain",
  "transports-bull-basic",
  "transports-bull-standard",
  "transports-bull-premium",
  "transports-bull-executive",
  "munitions-standard-pistolet-leger-pm-raven",
  "munitions-standard-pistolet-leger-pm-phoenix",
  "munitions-standard-pistolet-leger-pm-owl",
  "munitions-standard-pistolet-lourd-raven",
  "munitions-standard-pistolet-lourd-phoenix",
  "munitions-standard-pistolet-lourd-owl",
  "munitions-standard-mitraillette-raven",
  "munitions-standard-mitraillette-phoenix",
  "munitions-standard-mitraillette-owl",
  "munitions-standard-fusil-d-assaut-raven",
  "munitions-standard-fusil-d-assaut-phoenix",
  "munitions-standard-fusil-d-assaut-owl",
  "munitions-standard-precision-raven",
  "munitions-standard-precision-phoenix",
  "munitions-standard-precision-owl",
  "munitions-standard-shotgun-raven",
  "munitions-standard-shotgun-phoenix",
  "munitions-standard-shotgun-owl"
]);
export function builderPurchaseAllowed(item: {id: string}): boolean {
  return !lifestyleReferenceIds.has(item.id);
}
/** Derived possessions: no receipt, resale value, fixed charge, or mutation of saved history. */
export function everydayEquipmentIds(data: {
  disadvantages?: readonly string[]; social?: Record<string, unknown>;
  reality?: Record<string, unknown>;
}, campaign = true): string[] {
  const ids = [
    'objets-usuels-neurodive-holophone',
    'equipement-civique-ia-personnelle-du-holophone',
    'objets-usuels-neurodive-hololentilles'
  ];
  // An explicit non-citizen status must never become a free legal identity.
  const noCivic = data.social?.civicIdentity === false ||
    (data.disadvantages ?? []).some(id => ['sans_identite', 'sans_papiers', 'apatride', 'hors_systeme'].includes(id));
  if (!noCivic) ids.push('objets-usuels-neurodive-idpass', 'equipement-civique-puce-de-sante-citoyenne');
  const augmentations = data.reality?.augmentations;
  if (Array.isArray(augmentations) && augmentations.some(a => a && typeof a === 'object' &&
      (campaign || !a.acquiredInCampaign))) ids.push('objets-usuels-neurodive-n-sta');
  const equipment = data.reality?.equipment;
  const owned = new Set(Array.isArray(equipment) ? equipment.filter(a => a &&
    (campaign || !a.acquiredInCampaign)).map(a => a.itemId) : []);
  return ids.filter(id => !owned.has(id));
}
