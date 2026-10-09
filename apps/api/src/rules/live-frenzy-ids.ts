/** Independent identifiers: play-truth imports this file without a mechanics cycle. */
export const frenzyPowerIds=new Set(['fureur_croissante','khinae_blood_fureur_croissante','morrighan_la_corneille_etrangere_facette_guerre_frenesie_fureur_de_la_corneille']);
export const frenzyDedicatedIds=new Set([...frenzyPowerIds,'rage_lucide','khinae_blood_rage_lucide','furie_de_survie']);
export const frenzyActions=['frenzy-enter','frenzy-augmentic-resist','frenzy-exit','frenzy-obstacle','fear-set'] as const;
