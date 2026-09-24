"""Source-checked decision paths for rules that need more than a comparison card."""
from html import escape
import textwrap

# (slug, title, article, section, ordered decisions/actions, important exception)
WORKFLOWS = [
 ('tir','Tir : ordinaire, Rafale ou Suppression ?','regles-tir-portee-tirs-particuliers','rafale',[
  ('1 · Choisir le mode','Tir ordinaire ; Rafale si l’arme porte Rafale ; Suppression si Automatique.'),
  ('2 · Préparer si possible','Viser : 1 PA, +3 au Tir suivant ; incompatible avec Rafale et Suppression.'),
  ('3 · Tir ordinaire','Marge 1–5 : DGT − Armure ; 6–10 : idem + Altération ; 11+ : 2 × DGT − Armure + Altération.'),
  ('4 · Rafale','Un jet : 1 / 2 / 3 impacts pour marges 1–5 / 6–10 / 11+ ; chacun DGT − Armure.'),
  ('5 · Suppression','Valeur du jet jusqu’à fin du round ; cible exposée avec Défense passive plus faible : 1 impact.')],
  'Rafale et Suppression ne produisent pas d’Altération ; Suppression ne permet pas de Défense active.'),
 ('resolution','Résoudre un test et compter les DR','regles-resolution-des-tests','test-standard',[
  ('1 · Fixer le seuil','Facile 12 · Normal 15 · Difficile 18 · Très difficile 21 · Impossible 25.'),
  ('2 · Lancer','Attribut + Compétence + 1d10e ; appliquer les circonstances réellement distinctes.'),
  ('3 · Échec narratif ?','Oui : échec même si le total dépasse le seuil. Normal : 1 naturel.'),
  ('4 · Comparer','Sinon, total sous le seuil : échec ; total égal ou supérieur : réussite.'),
  ('5 · Qualifier','Marge = total − seuil. 0–2 : 0 DR ; 3–5 : 1 DR ; +1 DR tous les 3 points, max 5.')],
  'Exemple : base 7 + dé 9 = 16 contre 15 → marge 1, donc 0 DR.'),
 ('initiative','Une Réaction consomme une passe future','regles-initiative-pa-deplacement','ordre-des-passes',[
  ('1 · Initiative','Agilité + Athlétisme + 1d10e : 1 à 10 = 1 PA ; 11 à 15 = 2 ; 16+ = 3.'),
  ('2 · Passes','Avec 4 PA, agir aux passes 1, 2, 3 et 4 ; la passe 1 est commune à tous.'),
  ('3 · Réagir','Après la passe 1, Défense active : dépenser 1 PA du round.'),
  ('4 · Déduire','Supprimer la plus haute passe future disponible : ici la passe 4.'),
  ('5 · Reprendre','Le personnage agit encore aux passes 2 et 3, puis son round est fini.')],
  'Un 1 naturel à l’Initiative plafonne à 1 PA, quel que soit le total.'),
 ('combat','Résoudre une attaque physique','regles-combat-defenses','defenses',[
  ('1 · Attaque','Mêlée : Vigueur + Mêlée + 1d10e ; Pugilat : Vigueur + Pugilat + 1d10e.'),
  ('2 · Défense possible ?','Passive : Agilité + Esquive. Active : +1d10e en Réaction pour 1 PA, sauf surprise.'),
  ('3 · Comparer','Attaque ≤ Défense : aucun effet. Attaque > Défense : marge positive.'),
  ('4 · Dégâts','Mêlée : marge + DGT de l’arme − Armure ; Pugilat : marge + DGT 1 − Armure.'),
  ('5 · Appliquer','Déduire les dégâts des PV ; l’Armure réduit les dégâts, jamais la Défense.')],
  'En Zone : un jet d’attaque, mais défense, marge et dégâts séparés pour chaque cible.'),
 ('sante','Blessure, Agonie et stabilisation','regles-sante-blessures-soins','agonisant',[
  ('1 · Suivre les PV','PV max = 2 × Vigueur + Constitution ; à 50 % : Tendu minimum ; à 25 % : Paniqué.'),
  ('2 · À 0 PV','Agonisant : 1 PA maximum ; ni attaque ni Défense active.'),
  ('3 · Fin de chaque round','Si non Stabilisé : Vigueur + Constitution + 1d10e contre 15.'),
  ('4 · Test manqué','−1 PV ; échec narratif : −2 PV. Mort à −(Vigueur + Constitution).'),
  ('5 · Stabiliser','Esprit + Soin contre 15 : retour exactement à 0 PV, plus de test d’Agonie.')],
  'Pour agir normalement après stabilisation, récupérer au moins 1 PV.'),
 ('stress','Quel état régit réellement le dé ?','regles-stress-etats-psychologiques','stress-impose-blessures',[
  ('1 · Identifier les sources','Stress subi ou imposé ; blessures ≤ 50 % PV : Tendu minimum ; ≤ 25 % : Paniqué.'),
  ('2 · Retenir l’état','Normal : échec 1 / explosion 10 ; Tendu : échec 1–2 / explosion 9–10.'),
  ('3 · Si Paniqué','Échec narratif 1–3 ; explosion seulement sur 10 naturel.'),
  ('4 · Soigner les blessures','Au-dessus d’un seuil de PV, retirer aussitôt le minimum imposé par ce seuil.'),
  ('5 · Autre cause ?','Si oui, conserver son Stress ; sinon redescendre au minimum encore applicable.')],
  'Le repos ne descend jamais sous le minimum de Stress encore imposé par les blessures.'),
 ('augmentations','Déclencher une crise augmentique','regles-realite-v9-charge-stress-frenesie','difficultes',[
  ('1 · Calculer les limites','Intégrité = Force Mentale + Humanité ; Stress max = Vigueur + Humanité.'),
  ('2 · Chercher le déclencheur','Déclencheur majeur en Saturation/Surcharge ou Stress au moins égal au maximum.'),
  ('3 · Chiffrer chaque dépassement','Au seuil : 15 ; +1 : 18 ; +2 : 21 ; +3 ou plus : 25.'),
  ('4 · Deux jauges ?','Charge et Stress simultanés : un seul test contre la difficulté la plus haute.'),
  ('5 · Résoudre','Volonté + Maîtrise spirituelle ; en échec, suivre la Frénésie et son impulsion.')],
  'N-Sta réduit le Stress effectif de 1, mais ne modifie ni Charge ni Intégrité.'),
 ('intrusion','Intrusion : atteindre une fonction','regles-realite-v9-neurodive-actions-intrusion','intrusion-controle',[
  ('1 · Vérifier la voie','Connexion et protocole compatibles ; nommer le système et le nœud visé.'),
  ('2 · Franchir l’obstacle','Intrusion sur authentification, verrou ou porte logique ; 1 PA sous pression.'),
  ('3 · Échec ?','Aucun accès ; sécurité peut déclencher alerte, verrouillage, IA ou trace.'),
  ('4 · Réussite ?','Seul l’obstacle nommé est franchi ; atteindre la fonction réellement accessible.'),
  ('5 · Agir puis couvrir ses traces','Contrôle de la porte A ; caméra du nœud B = nouvel accès. Masquage si requis.')],
  'Réussir l’objectif n’efface pas automatiquement les traces.'),
 ('train-de-vie','Train de vie : calculer le cran effectif','regles-realite-v9-economie-compte-train-vie','charges-fixes',[
  ('1 · Choisir la base','Prendre la valeur mensuelle de référence du Train de vie de base.'),
  ('2 · Additionner','Compter les Charges fixes durables ; un achat comptant unique n’en est pas une.'),
  ('3 · Diviser','Nombre de crans perdus = tranches complètes de la référence dans les charges.'),
  ('4 · Exemple','Référence 1 200 $ ; charges 2 500 $ → 2 tranches complètes → −2 crans.'),
  ('5 · Dépenser','Quotidien selon le cran effectif ; biens durables ou rares payés par le Compte.')],
  'La référence du calcul reste celle du Train de vie de base après la baisse.'),
 ('defense-occulte','Choisir la Défense contre un effet','regles-verite-v7-pa-reactions-defense-puissance','4-defense-occulte-et-puissance-des-effets',[
  ('1 · Quel effet atteint la cible ?','Imposition directe sur esprit, âme ou intérieur du corps : occultement imposé.'),
  ('2 · Ou phénomène évitable ?','Projectile ou manifestation physiquement évitable : Défense physique.'),
  ('3 · Défense passive','Occulte = Volonté + Force Mentale ; physique = Agilité + Esquive.'),
  ('4 · Réaction permise ?','Dépenser 1 PA : ajouter 1d10e à la Défense du type retenu.'),
  ('5 · Résolution','Comparer l’attaque à cette seule Défense ; égalité = statu quo.')],
  'Une même attaque ne sollicite jamais Défense physique et occulte ensemble.'),
 ('voile','Ce que voit un observateur du Voile','regles-verite-v7-voile-continuite-objets-reseaux-interfaces','5-hologramme-voile-semi-revelation-et-revelation',[
  ('1 · État de la cible : V','Forme traduite par l’Hologramme ; même un observateur R voit la traduction.'),
  ('2 · Cible : SR','Observateur V : traduction ; observateur SR/R : Vérité partielle.'),
  ('3 · Cible : R','Vérité exprimée visible de tous, même d’un observateur V.'),
  ('4 · Transition sous pression','Normalement 1 PA ; jet seulement si opposition ou contrainte significative.'),
  ('5 · Corriger si nécessaire','Le Voile peut corriger le souvenir civil ; un Chasseur reconnu conserve ce qu’il a vu.')],
  'Voir sous le Voile ne Révèle pas automatiquement une cible encore Voilée.'),
 ('vampire-etats','Vampire : ce que change chaque état','regles-verite-v7-vampire-nature-predation-cours','etats',[
  ('1 · Voilé','Corps humain ; aucun bonus de Nature ; vieillissement si l’état dure anormalement.'),
  ('2 · Semi-Révélé','+1 Vigueur et +1 Volonté ; sens surnaturels et pouvoirs subtils.'),
  ('3 · Révélé','+2 Vigueur, +1 Agilité, +1 Volonté ; prédation, stase et régénération.'),
  ('4 · Vérifier le Sang','La majorité des Talents de Sang et l’Empreinte de Cour exigent R.'),
  ('5 · Changer d’allégeance','Cela ne change jamais la Cour d’origine ni son Empreinte gratuite.')],
  'Les bonus de R remplacent ceux de SR : ils ne s’ajoutent pas aux précédents.'),
 ('angelus-aura','Angelus : Aura, Éveil et rang','regles-verite-v7-angelus-nature-revelation-transcendance','aura-aureole-et-arbre-de-vie',[
  ('1 · Éveil','Comprendre ou retrouver sa nature est distinct de passer en SR ou R.'),
  ('2 · Déterminer le rang','Angelus : 1 Nature ; Chérubin : 2 ; Séraphin exceptionnel : 3.'),
  ('3 · Calculer l’Aura max','3 + Force Mentale ; Chérubin +2 ; Séraphin +4, plafonds 8 / 10 / 12.'),
  ('4 · Payer les pouvoirs','Chaque Talent ou Don dépense l’Aura indiquée ; le rang ne rend pas les dons gratuits.'),
  ('5 · Activer les ailes','Un Chérubin paie 1 Aura pour toutes ses ailes ; +1 Agilité au total.')],
  'Séraphin est un rang exceptionnel de campagne, sans achat standard de Talent.'),
 ('corruption','Exposition, profondeur et Bascule','regles-verite-v7-corruption-integrite-bascule','exposition',[
  ('1 · Déterminer le vecteur','Physique : Vigueur + Constitution ; mental : Volonté + Force Mentale.'),
  ('2 · Résister','Ajouter 1d10e contre 12 / 15 / 18 / 21 / 25 selon l’intensité.'),
  ('3 · Reporter le résultat','Réussite : +0 ; échec : +1 ; échec narratif : +2 Corruption de la Source.'),
  ('4 · Comparer à l’Intégrité','Intégrité = Force Mentale + Humanité ; atteindre ce score : Bascule immédiate.'),
  ('5 · Tenter de tenir','Volonté + Maîtrise spirituelle + 1d10e contre 18 ; échec : Rupture.')],
  'Un succès de Bascule laisse la jauge au maximum ; une nouvelle exposition reteste.'),
 ('supports','Augmentations : support, slot et bonus','regles-realite-v9-supports-slots-compatibilites','support-et-module',[
  ('1 · Repérer le support','Une augmentation support ouvre ses slots ; un module doit être compatible.'),
  ('2 · Vérifier l’emplacement','Chaque module occupe ses slots ; un œil est un support séparé de l’autre.'),
  ('3 · Appliquer l’exclusivité','Une peau globale principale ; armure et camouflage dermiques exigent un modèle compatible.'),
  ('4 · Vérifier les bonus','Visée, Viser, Verrouillage : garder le meilleur bonus de ciblage.'),
  ('5 · Reporter le coût','Charge et Stress de chaque élément installé suivent leurs règles propres.')],
  'Un support ne confère pas automatiquement les propriétés de ses modules.'),
 ('equipement-reel','Couches de protection : retenir quoi ?','regles-realite-v9-equipement-proprietes-protections','armure-reductions',[
  ('1 · Identifier le vecteur','L’attaque concerne dégâts matériels, balistiques, choc, feu ou autre type explicite.'),
  ('2 · Armure de base','Meilleure Armure portée + meilleure Armure corporelle applicables ; pas deux de chaque.'),
  ('3 · Réduction typée','Appliquer seulement celles qui correspondent au vecteur et sont réellement compatibles.'),
  ('4 · Perforant X','Ignorer X points de l’Armure matérielle concernée, jamais une Défense.'),
  ('5 · Soustraire les PV','Le reliquat après protections atteint les PV ; vérifier ensuite les seuils de blessure.')],
  'Une protection ne s’ajoute jamais au score de Défense passive ou active.'),
 ('neurocombat','Neurocombat : cible, impact et sacrifice','regles-realite-v9-neurocombat-integrite-logicielle','sacrifice',[
  ('1 · Attaquer','Programme offensif chargé : Volonté + Neurodive + 1d10e contre Défense Neuro.'),
  ('2 · Cible vivante ?','Marge en dégâts sur ses PV ; seule une réduction [Neuro] protège, pas l’Armure.'),
  ('3 · Calculer le reliquat','Après Défense, effet défensif et réductions [Neuro], compter les PV encore à perdre.'),
  ('4 · Sacrifier si souhaité','Chaque programme chargé sacrifié annule 3 PV restants ; l’excédent est perdu.'),
  ('5 · Appliquer','Retrancher les PV non annulés ; programmes sacrifiés grillés et slots indisponibles.')],
  'Contre IA ou programme : marge 1–5 perturbé ; 6–10 désactivé ; 11+ détruit.'),
 ('vehicules','Véhicule attaqué : qui encaisse ?','regles-realite-v9-vehicules-poursuites-reparations','tir-occupants',[
  ('1 · Identifier la cible','Attaque dirigée contre le véhicule ou contre un occupant exposé ?'),
  ('2 · Véhicule','Comparer l’attaque à sa Défense, puis appliquer son Blindage avant la Structure.'),
  ('3 · Occupant','Si ciblé : couvert de carrosserie +3 Défense ; Blindage traversé puis Armure perso.'),
  ('4 · Dommages annexes','Un choc ou accident peut blesser les passagers selon sa règle.'),
  ('5 · Réparer','Les réparations portent sur la Structure et exigent les conditions indiquées.')],
  'Une attaque contre la carrosserie ne retranche pas automatiquement les PV de chaque passager.'),
 ('garou-mue','Mue hybride : quand arrive le +1 PA ?','regles-verite-v7-garou-nature-formes-frenesie-pelages','mue',[
  ('1 · Déclarer la Mue','De V, SR ou humain révélé vers hybride : réserver un round entier.'),
  ('2 · Compter les Mues','Depuis le dernier repos : 1re automatique ; 2e 15 ; 3e 18 ; 4e 21 ; 5e+ 25.'),
  ('3 · Si le test échoue','Forcer : 3 PV irréductibles ; échec narratif : round perdu, plus de Mue cette scène.'),
  ('4 · Round suivant','La forme hybride est achevée au début du round suivant.'),
  ('5 · Rounds ultérieurs','Le +1 PA hybride commence seulement après ce round d’achèvement.')],
  'Passer de l’humain révélé à l’animal coûte 1 PA, sans épuisement hybride normal.'),
 ('corruption-rites','DON, RITE ou FAVEUR : tester la Souillure ?','regles-verite-v7-corruption-integrite-bascule','souillure',[
  ('1 · DON personnel','Aucun test de Souillure à chaque usage, sauf mention explicite.'),
  ('2 · RITE ou FAVEUR','Chaque activation surnaturelle déclenche un test, même si le pouvoir échoue.'),
  ('3 · Fixer la difficulté','Coût 1 PTV : 15 ; 2 PTV : 18 ; 3 PTV : 21 ; exception explicite : 25.'),
  ('4 · Résister','Volonté + Force Mentale ; si explicitement corporel : Vigueur + Constitution.'),
  ('5 · Maintenir','Un maintien ne reteste pas ; nouvelle activation, nouveau test.')],
  'Purifier le porteur à 0 endort ses Dons ; les Rites appris restent connus.'),
]

def render_workflow(title, steps, note, mobile=False):
    """A vertical reading path: one rule decision per row, with distinct result text."""
    w = 540 if mobile else 1060
    row_h = 151 if mobile else 104
    y0 = 104 if mobile else 98
    h = y0 + len(steps) * row_h + (118 if mobile else 92)
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc">',
         f'<title id="title">{escape(title)}</title>',
         f'<desc id="desc">{escape(" ; ".join(a+" : "+b for a,b in steps)+". "+note)}</desc>',
         f'<rect width="{w}" height="{h}" rx="20" fill="#0c1820"/>',
         f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="19" fill="none" stroke="#476775" stroke-width="2"/>']
    def label(x,y,value,size=18,color='#d1e1e3',weight=400):
        out.append(f'<text x="{x}" y="{y}" font-family="system-ui,sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{escape(value)}</text>')
    for j,line in enumerate(textwrap.wrap(title,30 if mobile else 58,break_long_words=False)):
        label(25 if mobile else 32,42+j*30,line,24 if mobile else 27,'#eef7f7',700)
    palette=['#5de0d0','#8ab9ff','#f2bd78','#8fdea7','#ca9bdf']
    for i,(heading,body) in enumerate(steps):
        y=y0+i*row_h
        x=20 if mobile else 31
        boxw=w-2*x
        out.append(f'<rect x="{x}" y="{y}" width="{boxw}" height="{row_h-18}" rx="13" fill="#162a34" stroke="#49606b"/>')
        out.append(f'<rect x="{x}" y="{y}" width="5" height="{row_h-18}" rx="2" fill="{palette[i%5]}"/>')
        label(x+19,y+34,heading,20 if mobile else 19,palette[i%5],700)
        for j,line in enumerate(textwrap.wrap(body,42 if mobile else 84,break_long_words=False)):
            label(x+19,y+(68 if mobile else 69)+j*(26 if mobile else 23),line,17 if mobile else 18)
        if i<len(steps)-1:
            label(w//2-7,y+row_h-2,'↓',18,'#a6d6d6',700)
    y=y0+len(steps)*row_h+18
    for j,line in enumerate(textwrap.wrap(note,46 if mobile else 105,break_long_words=False)):
        label(24 if mobile else 33,y+j*27,line,17 if mobile else 18,'#f1cfa1')
    out.append('</svg>')
    return '\n'.join(out)+'\n'
