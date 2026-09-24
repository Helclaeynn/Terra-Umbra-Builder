// The Truth scale is independent of the NPC's Reality tier. PTV ranges are
// creation guidelines: only actual catalog purchases count toward the total.
export const NPC_TRUTH_TIERS = [
  { id: 'recent', name: 'Éveillé récent', minPtv: 0, maxPtv: 5, guidance: 'Nature et premières capacités acquises.' },
  { id: 'initie', name: 'Initié', minPtv: 6, maxPtv: 12, guidance: 'Une spécialité occulte identifiable.' },
  { id: 'confirme', name: 'Confirmé', minPtv: 13, maxPtv: 24, guidance: 'Plusieurs capacités qui se complètent.' },
  { id: 'majeur', name: 'Majeur', minPtv: 25, maxPtv: 40, guidance: 'Un acteur central du scénario.' },
  { id: 'exceptionnel', name: 'Exceptionnel', minPtv: 41, maxPtv: null, guidance: 'Construction individuelle et validation MJ.' }
] as const;

// Named exceptions require a sourced feat and an explicit MJ-only profile.
// They do not raise the caps of the ordinary eight Reality tiers or the PJ Builder.
export const NPC_EXCEPTIONAL_SKILLS = [
  { range: '16–18', scope: 'Signature d’un ancien souverain, dieu ou être comparable ; justifier la compétence sur sa fiche.' },
  { range: '19+', scope: 'Figure singulière hors étalon ; fixer une règle propre au personnage et la relire avant la partie.' }
] as const;
