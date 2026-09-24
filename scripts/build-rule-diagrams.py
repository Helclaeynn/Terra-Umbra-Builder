#!/usr/bin/env python3
"""Build compact, source-grounded SVG reading aids for the rules corpus."""
from html import escape
from pathlib import Path
import json
import textwrap

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'compendium/images/rules'
OUT.mkdir(parents=True, exist_ok=True)

# Each worked case or comparison is checked against the article indicated below.
DIAGRAMS = [
 ('resolution', 'Quand le total suffit… sauf sur 1 naturel', [('Seuil', 'Difficulté normale : 15'), ('Jet ordinaire', 'Base 16 + dé 2 = 18 : réussite'), ('Même base, dé 1', 'Total 17 ≥ 15, mais échec narratif')], 'Le 1 naturel prime sur une réussite numérique.', 'regles-resolution-des-tests', 'test-standard'),
 ('initiative', 'Un 1 naturel malgré un bon total', [('Profil', 'Agilité + Athlétisme = 16'), ('Jet', 'Dé naturel 1 : total d’Initiative 17'), ('PA accordés', '1 PA maximum, malgré le total ≥ 16')], 'Sans ce 1 naturel, un total de 17 donnerait 3 PA.', 'regles-initiative-pa-deplacement', 'initiative-et-pa'),
 ('combat', 'Une attaque face à deux défenses', [('Attaque', 'Résultat de l’attaque : 16'), ('Passive', 'Agilité + Esquive = 12 : attaque touche'), ('Active', '1 PA ; 12 + dé 4 = 16 : égalité')], 'À égalité, aucun dégât ni effet ; la Réaction exige 1 PA.', 'regles-combat-defenses', 'defenses'),
 ('sante', 'Seuils pour un maximum de 14 PV', [('Calcul', 'Vigueur 5, Constitution 4 : 14 PV'), ('Blessé', '7 PV ou moins : Tendu au minimum'), ('Très blessé', '3 PV ou moins : Paniqué au minimum')], 'À 0 PV, le personnage devient Agonisant.', 'regles-sante-blessures-soins', 'pv-et-seuils'),
 ('stress', 'Que devient un 9 naturel ?', [('Normal', '9 : pas d’explosion'), ('Tendu', '9 : le dé explose'), ('Paniqué', '9 : pas d’explosion')], 'Un 9 change donc de comportement selon l’état.', 'regles-stress-etats-psychologiques', 'normal-tendu-panique'),
 ('augmentations', 'Deux seuils atteints en même temps', [('Charge', 'Intégrité + 2 : difficulté 21'), ('Stress', 'Maximum + 3 : difficulté 25'), ('Crise', 'Un seul test de Maîtrise contre 25')], 'On retient la difficulté la plus élevée, sans doubler le jet.', 'regles-realite-v9-charge-stress-frenesie', 'difficultes'),
 ('intrusion', 'Accès local et fonctions distinctes', [('Obstacle franchi', 'Intrusion réussie sur le nœud A'), ('Fonction atteinte', 'La porte du nœud A peut être contrôlée'), ('Autre nœud', 'Caméra sur B : nouvel accès à obtenir')], 'Franchir une porte logique ne donne pas tout le réseau.', 'regles-realite-v9-neurodive-actions-intrusion', 'intrusion-controle'),
 ('train-de-vie', 'Tranches fixes : base à 1 200 $', [('Charges : 900 $', '0 tranche complète : aucun cran perdu'), ('Charges : 1 300 $', '1 tranche complète : −1 cran'), ('Charges : 2 500 $', '2 tranches complètes : −2 crans')], 'Chaque seuil reste calculé sur 1 200 $, même après la baisse.', 'regles-realite-v9-economie-compte-train-vie', 'charges-fixes'),
 ('defense-occulte', 'Quelle Défense contre la magie ?', [('Pierre projetée', 'Évitable physiquement : Défense physique'), ('Malédiction', 'Imposition directe : Défense occulte'), ('Réaction', 'Si permise : défense active pour 1 PA')], 'Une même attaque n’utilise jamais les deux Défenses.', 'regles-verite-v7-pa-reactions-defense-puissance', '4-defense-occulte-et-puissance-des-effets'),
 ('voile', 'Qui voit la Vérité de la cible ?', [('Cible Voilée', 'Même un observateur R voit la traduction'), ('Cible Semi-Révélée', 'V voit la traduction ; SR/R la Vérité partielle'), ('Cible Révélée', 'La Vérité exprimée est visible par tous')], 'Voir sous le Voile ne Révèle pas la cible.', 'regles-verite-v7-voile-continuite-objets-reseaux-interfaces', '5-hologramme-voile-semi-revelation-et-revelation'),
 ('lancer-sort', 'Construire puis lancer un sort', [('Définir', 'Intention, Affinité, Essence et Polarité'), ('Vérifier', 'Affinité éveillée ou improvisation limitée ; Maîtrise, cible et Amplitude'), ('Résoudre', 'Coût, portée, jet, défense et Tension')], 'Sans Affinité éveillée : effet Initial / Mineur et +1 niveau de difficulté.', 'regles-verite-v7-mage-maitrise-amplitude-lancement', 'construire-et-lancer-un-sort'),
 ('corruption', 'Résister à une exposition forte', [('Vecteur mental', 'Volonté + Force Mentale contre 18'), ('Jet manqué', 'Total 17 : +1 Corruption de la Source'), ('Dé naturel 1', 'Même avec un total ≥ 18 : +2')], 'L’Humanité fixe l’Intégrité, pas le résultat du test.', 'regles-verite-v7-corruption-integrite-bascule', 'exposition'),
]

def lines(text, width=33):
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False)

def render(slug, title, cards, note):
    width, height, x, cardw = 1060, 360, 32, 312
    accents = ['#5de0d0', '#8ab9ff', '#f2bd78']
    chunks = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
              f'<title id="title">{escape(title)}</title>',
              f'<desc id="desc">{escape(" ; ".join(a + " : " + b for a,b in cards) + ". " + note)}</desc>',
              '<rect width="1060" height="360" rx="22" fill="#0c1820"/>',
              '<rect x="1" y="1" width="1058" height="358" rx="21" fill="none" stroke="#476775" stroke-width="2"/>',
              f'<text x="34" y="50" fill="#eef7f7" font-size="28" font-weight="700" font-family="system-ui, sans-serif">{escape(title)}</text>']
    for idx, (heading, body) in enumerate(cards):
        bx = x + idx * 342
        chunks += [f'<rect x="{bx}" y="82" width="{cardw}" height="190" rx="16" fill="#162a34" stroke="#49606b"/>',
                   f'<rect x="{bx}" y="82" width="{cardw}" height="5" rx="2" fill="{accents[idx]}"/>',
                   f'<text x="{bx+20}" y="129" fill="{accents[idx]}" font-size="23" font-weight="700" font-family="system-ui, sans-serif">{idx+1:02d}</text>',
                   f'<text x="{bx+20}" y="164" fill="#f0f7f6" font-size="21" font-weight="700" font-family="system-ui, sans-serif">{escape(heading)}</text>']
        for j, line in enumerate(lines(body)):
            chunks.append(f'<text x="{bx+20}" y="{202+j*27}" fill="#d1e1e3" font-size="17" font-family="system-ui, sans-serif">{escape(line)}</text>')
    chunks += [f'<text x="34" y="322" fill="#f1cfa1" font-size="18" font-family="system-ui, sans-serif">{escape(note)}</text>', '</svg>']
    return '\n'.join(chunks) + '\n'

def render_mobile(title, cards, note):
    chunks = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 780" role="img" aria-labelledby="title desc">',
        f'<title id="title">{escape(title)}</title>',
        f'<desc id="desc">{escape(" ; ".join(a + " : " + b for a,b in cards) + ". " + note)}</desc>',
        '<rect width="540" height="780" rx="20" fill="#0c1820"/>',
        '<rect x="1" y="1" width="538" height="778" rx="19" fill="none" stroke="#476775" stroke-width="2"/>',
    ]
    for j, line in enumerate(lines(title, 31)):
        chunks.append(f'<text x="25" y="{42+j*29}" fill="#eef7f7" font-size="26" font-weight="700" font-family="system-ui, sans-serif">{escape(line)}</text>')
    accents = ['#5de0d0', '#8ab9ff', '#f2bd78']
    for idx, (heading, body) in enumerate(cards):
        y = 95 + idx * 204
        chunks += [
            f'<rect x="22" y="{y}" width="496" height="182" rx="15" fill="#162a34" stroke="#49606b"/>',
            f'<rect x="22" y="{y}" width="496" height="5" rx="2" fill="{accents[idx]}"/>',
            f'<text x="42" y="{y+42}" fill="{accents[idx]}" font-size="22" font-weight="700" font-family="system-ui, sans-serif">{idx+1:02d} · {escape(heading)}</text>',
        ]
        for j, line in enumerate(lines(body, 36)):
            chunks.append(f'<text x="42" y="{y+82+j*29}" fill="#d1e1e3" font-size="21" font-family="system-ui, sans-serif">{escape(line)}</text>')
    for j, line in enumerate(lines(note, 43)):
        chunks.append(f'<text x="25" y="{717+j*27}" fill="#f1cfa1" font-size="19" font-family="system-ui, sans-serif">{escape(line)}</text>')
    chunks.append('</svg>')
    return '\n'.join(chunks) + '\n'

def render_magic_workflow(mobile=False):
    """Reading path with permission gates, costs, resolution and release."""
    width, height = (540, 1190) if mobile else (1060, 790)
    chunks = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        '<title id="title">Construire puis lancer un sort</title>',
        '<desc id="desc">Formuler l’effet et son Affinité ; si elle n’est pas éveillée, limiter à Maîtrise Initiale et Amplitude Mineure avec un niveau de difficulté supplémentaire. Vérifier la cible et l’échelle, déterminer difficulté, PA et Tension, ajuster pour la portée, investir les PA, lancer le jet si nécessaire, appliquer la défense et ajouter la Tension à la libération.</desc>',
        f'<rect width="{width}" height="{height}" rx="22" fill="#0c1820"/>',
        f'<rect x="1" y="1" width="{width-2}" height="{height-2}" rx="21" fill="none" stroke="#476775" stroke-width="2"/>',
    ]
    def text(x, y, content, size=18, color='#d1e1e3', weight='400'):
        chunks.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" font-family="system-ui, sans-serif">{escape(content)}</text>')
    def rect(x, y, w, h, stroke='#49606b', fill='#162a34'):
        chunks.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="15" fill="{fill}" stroke="{stroke}"/>')
    if mobile:
        text(24, 43, 'Du projet de sort à la libération', 24, '#eef7f7', '700')
        y_values = [74, 330, 606, 877]
        heights = [232, 252, 246, 276]
        for y, h, accent in zip(y_values, heights, ['#5de0d0', '#8ab9ff', '#f2bd78', '#8fdea7']):
            rect(20, y, 500, h)
            chunks.append(f'<rect x="20" y="{y}" width="500" height="5" rx="2" fill="{accent}"/>')
        text(40, 113, '1 · Définir l’effet', 22, '#5de0d0', '700')
        text(40, 151, 'Ex. éclairer une pièce :', 19)
        text(40, 183, 'Affinité : Photomancie (lumière)', 18)
        text(40, 215, 'Essence : Créative (produire)', 18)
        text(40, 247, 'Polarité : Stato (la pièce)', 18)
        text(40, 280, 'Une seule fonction principale.', 18, '#f1cfa1')
        text(40, 370, '2 · Vérifier les permissions', 22, '#8ab9ff', '700')
        text(40, 404, 'Affinité éveillée ? Sinon improviser :', 18)
        text(40, 432, 'Initiale / Mineure, +1 difficulté.', 18)
        text(40, 460, 'Maîtrise et cible désignable ?', 18)
        text(40, 488, 'Amplitude : échelle suffisante ?', 18)
        rect(40, 513, 460, 53, '#a66465', '#30252b')
        text(54, 546, 'Si non → revoir effet, cible ou échelle', 16, '#ffcbbe', '700')
        text(40, 647, '3 · Fixer le coût', 22, '#f2bd78', '700')
        text(40, 685, 'Amplitude utilisée → difficulté,', 18)
        text(40, 714, 'PA à payer et Tension à la libération.', 18)
        text(40, 755, 'Ajuster par portée / avance acquise.', 18)
        text(40, 787, 'Au-delà de 25 → Canalisation.', 18, '#f1cfa1')
        text(40, 918, '4 · Libérer et résoudre', 22, '#8fdea7', '700')
        text(40, 956, 'Investir les PA, puis jet si requis :', 18)
        text(40, 986, 'Volonté + Maîtrise spirituelle + 1d10e', 16)
        text(40, 1026, 'Comparer à la difficulté finale ;', 18)
        text(40, 1057, 'défense de la cible si applicable.', 18)
        text(40, 1110, 'Tension à la libération, succès ou échec.', 17, '#f1cfa1')
        for y in [306, 582, 852]:
            chunks.append(f'<path d="M 270 {y+3} v 20 m -8 -8 l 8 8 8 -8" fill="none" stroke="#a6d6d6" stroke-width="3"/>')
    else:
        text(32, 47, 'Du projet de sort à la libération', 28, '#eef7f7', '700')
        y_values = [73, 248, 424, 599]
        for y, accent in zip(y_values, ['#5de0d0', '#8ab9ff', '#f2bd78', '#8fdea7']):
            rect(30, y, 1000, 150)
            chunks.append(f'<rect x="30" y="{y}" width="1000" height="5" rx="2" fill="{accent}"/>')
        text(52, 111, '1 · DÉFINIR', 19, '#5de0d0', '700')
        text(275, 112, 'Exemple : éclairer une pièce.', 20, '#f0f7f6', '700')
        text(275, 151, 'Photomancie (lumière) → Créative (produire) → Stato (la pièce).', 17)
        text(275, 186, 'Une seule fonction principale.', 18, '#f1cfa1')
        text(52, 286, '2 · VÉRIFIER', 19, '#8ab9ff', '700')
        text(275, 288, 'Affinité éveillée ? Sinon Initiale / Mineure, difficulté +1.', 17)
        text(275, 326, 'Maîtrise suffisante ? Cible désignable ? Échelle possible ?', 17)
        rect(738, 347, 270, 52, '#a66465', '#30252b')
        text(754, 380, 'NON → revoir le projet', 17, '#ffcbbe', '700')
        text(52, 461, '3 · CHIFFRER', 19, '#f2bd78', '700')
        text(275, 463, 'Amplitude utilisée → difficulté, PA et Tension.', 18)
        text(275, 501, 'Ajuster la difficulté : portée et avance d’Amplitude.', 18)
        text(275, 539, 'Au-delà de 25 → Canalisation obligatoire avant le jet.', 18, '#f1cfa1')
        text(52, 637, '4 · LIBÉRER', 19, '#8fdea7', '700')
        text(275, 638, 'Investir les PA (sur plusieurs rounds si besoin) ; faire le jet si requis.', 17)
        text(275, 677, 'Volonté + Maîtrise spirituelle + 1d10e contre la difficulté finale.', 17)
        text(275, 714, 'Défense de la cible si applicable ; Tension même en cas d’échec.', 17, '#f1cfa1')
        for y in [223, 398, 574]:
            chunks.append(f'<path d="M 530 {y+1} v 19 m -8 -8 l 8 8 8 -8" fill="none" stroke="#a6d6d6" stroke-width="3"/>')
    chunks.append('</svg>')
    return '\n'.join(chunks) + '\n'

MAGE_GUIDES = [
    ('mage-affinite', 'Affinité : peut-on lancer ?', 'affinites-supplementaires',
     'Une Affinité non éveillée permet une improvisation en Maîtrise Initiale et Amplitude Mineure avec un niveau de difficulté en plus, par exemple 15 devient 18. Pour progresser dans cette Affinité, il faut ensuite l’éveiller par les dépenses et prérequis prévus.'),
    ('mage-amplitude', 'Amplitude : niveau possédé ou utilisé ?', 'difficulte-pa-et-tension-par-amplitude',
     'L’Amplitude utilisée fixe difficulté, PA et Tension. Chaque palier possédé en plus réduit la difficulté d’un niveau sans réduire les PA ni la Tension. Deux paliers d’avance rendent l’effet automatique seulement sans opposition, urgence ni difficulté réelle.'),
    ('mage-portee', 'Portée : modifier la difficulté', 'portee',
     'Endo ou contact réduit la difficulté d’un niveau ; Volonté fois cinq mètres la laisse normale ; à vue ajoute un niveau. Hors vue exige une permission spéciale. Chaque niveau au-dessus de 25 impose au moins un PA de Canalisation.'),
    ('mage-canalisation', 'Canalisation : investir du temps', 'canalisation-concentration',
     'Chaque PA supplémentaire investi avant le jet réduit la difficulté d’un niveau, minimum 12. Un sort Cataclysmique de base coûte 4 PA à difficulté 25 ; deux PA de Canalisation donnent 6 PA à difficulté 18. La Tension reste celle du sort libéré.'),
]

def render_mage_guide(slug, mobile=False):
    width, height = (540, 830) if mobile else (1060, 540)
    chunks = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
        f'<title id="title">{escape(next(item[1] for item in MAGE_GUIDES if item[0] == slug))}</title>',
        f'<desc id="desc">{escape(next(item[3] for item in MAGE_GUIDES if item[0] == slug))}</desc>',
        f'<rect width="{width}" height="{height}" rx="22" fill="#0c1820"/>',
        f'<rect x="1" y="1" width="{width-2}" height="{height-2}" rx="21" fill="none" stroke="#476775" stroke-width="2"/>',
    ]
    def t(x,y,s,size=18,color='#d1e1e3',bold=False):
        chunks.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{700 if bold else 400}" font-family="system-ui, sans-serif">{escape(s)}</text>')
    def box(x,y,w,h,color='#49606b',fill='#162a34'):
        chunks.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="15" fill="{fill}" stroke="{color}"/>')
    def arrow(x1,y1,x2,y2):
        chunks.append(f'<path d="M {x1} {y1} L {x2} {y2} m -8 -8 l 8 8 8 -8" fill="none" stroke="#a6d6d6" stroke-width="3"/>')
    if slug == 'mage-affinite':
        if mobile:
            t(24,43,'Affinité : peut-on lancer ?',24,'#eef7f7',True)
            box(22,70,496,83); t(42,103,'L’Affinité est-elle éveillée ?',20,'#f0f7f6',True)
            t(42,133,'Le Mageius peut aussi improviser.',17)
            box(22,179,496,80,'#83cba1','#18302b'); t(42,211,'OUI → lancement possible',20,'#a8e9b9',True)
            t(42,239,'selon les rangs réellement acquis.',17)
            box(22,278,496,82,'#f2bd78','#30281f'); t(42,311,'NON → improviser Initiale / Mineure',17,'#f2bd78',True)
            t(42,340,'Difficulté +1 niveau (15 → 18).',17)
            t(24,403,'Pour dépasser cette limite :',21,'#f2bd78',True)
            rows=[(431,'2e / 3e native','1 PTV ; progression préalable'),(548,'Type adjacent','3 PTV ; native à Maîtrise Supérieure'),(665,'Type éloigné','Accord intermédiaire + 2 PTV')]
            for y,a,b in rows:
                box(22,y,496,98);t(42,y+34,a,19,'#f0f7f6',True);t(42,y+69,b,17)
            t(25,803,'Éveiller l’Affinité ouvre sa progression.',16,'#f1cfa1')
        else:
            t(32,48,'Affinité : peut-on lancer ?',27,'#eef7f7',True)
            box(30,75,1000,76);t(52,107,'L’Affinité de l’effet est-elle déjà éveillée ?',22,'#f0f7f6',True)
            t(52,135,'Le Mageius peut aussi improviser dans un domaine non appris.',17)
            box(30,179,485,91,'#83cba1','#18302b');t(49,213,'OUI → envisager le lancement',20,'#a8e9b9',True);t(49,244,'Maîtrise et Amplitude restent à vérifier.',17)
            box(545,179,485,91,'#f2bd78','#30281f');t(564,213,'NON → improviser Initiale / Mineure',18,'#f2bd78',True);t(564,244,'Difficulté +1 niveau : 15 → 18.',17)
            t(32,317,'Pour dépasser Initiale / Mineure : éveiller l’Affinité',21,'#f2bd78',True)
            for x,title,body1,body2 in [(30,'2e / 3e native','1 PTV chacune','avec progression préalable'),(372,'Type adjacent','3 PTV pour l’Accord','native à Maîtrise Supérieure'),(714,'Type éloigné','Accord intermédiaire','puis 2 PTV supplémentaires')]:
                box(x,344,316,144);t(x+16,377,title,19,'#f0f7f6',True);t(x+16,416,body1,17);t(x+16,450,body2,16)
            t(32,519,'Un Mageius n’est pas limité à ses Affinités éveillées, mais la progression exige leur apprentissage.',17,'#f1cfa1')
    elif slug == 'mage-amplitude':
        rows=[('Mineure','15','1','+1'),('Significative','18','2','+2'),('Majeure','21','3','+3'),('Cataclysmique','25','4','+4')]
        if mobile:
            t(24,42,'Amplitude : possédée ≠ utilisée',22,'#eef7f7',True)
            t(24,78,'Choisis l’échelle réellement produite.',17)
            for i,(label,diff,pa,tension) in enumerate(rows):
                y=101+i*98;box(22,y,496,82);t(42,y+32,label,20,'#f0f7f6',True)
                t(42,y+65,f'Difficulté {diff}  ·  {pa} PA  ·  Tension {tension}',17)
            box(22,518,496,223,'#8ab9ff','#182735')
            t(42,555,'Exemple : possède Majeure',20,'#8ab9ff',True)
            t(42,590,'mais lance un effet Significatif.',18)
            t(42,630,'Difficulté 18 → 15 (un palier d’avance).',17)
            t(42,666,'PA = 2 ; Tension = +2, inchangés.',17)
            t(26,785,'2 paliers : auto seulement hors opposition,',16,'#f1cfa1')
            t(26,811,'urgence ou difficulté réelle.',16,'#f1cfa1')
        else:
            t(32,48,'Amplitude possédée ≠ Amplitude utilisée',27,'#eef7f7',True)
            t(32,82,'L’effet choisi, et non ton maximum, fixe son coût de base.',18)
            for i,(label,diff,pa,tension) in enumerate(rows):
                y=105+i*66;box(30,y,1000,54);t(52,y+36,label,19,'#f0f7f6',True)
                t(440,y+36,f'Difficulté {diff}',18);t(695,y+36,f'{pa} PA',18);t(845,y+36,f'Tension {tension}',18)
            box(30,389,1000,97,'#8ab9ff','#182735')
            t(52,421,'Exemple : possédée Majeure ; effet utilisé Significatif.',19,'#8ab9ff',True)
            t(52,455,'Difficulté 18 → 15 (un palier d’avance) ; toujours 2 PA et +2 Tension.',18)
            t(32,519,'2 paliers d’avance : automatique seulement sans opposition, urgence ni difficulté réelle.',17,'#f1cfa1')
    elif slug == 'mage-portee':
        rows=[('Sur soi / contact','−1 niveau'),('À Volonté × 5 mètres','aucun changement'),('À vue','+1 niveau'),('Hors vue','permission spéciale exigée')]
        if mobile:
            t(24,43,'Portée : quel effet sur le seuil ?',22,'#eef7f7',True)
            t(24,80,'Partir de la difficulté après Amplitude.',17)
            for i,(name,rule) in enumerate(rows):
                y=107+i*105;box(22,y,496,88);t(42,y+35,name,19,'#f0f7f6',True);t(42,y+69,rule,18,'#f2bd78')
            box(22,555,496,190,'#f2bd78','#30281f')
            t(42,592,'Si le calcul dépasse 25 :',19,'#f2bd78',True)
            t(42,630,'chaque niveau en trop exige au moins',17)
            t(42,658,'1 PA de Canalisation avant le jet.',17)
            t(42,710,'Ex. 25 + « à vue » → 1 PA en plus.',17)
            t(24,796,'La portée ne donne jamais accès hors vue seule.',16,'#f1cfa1')
        else:
            t(32,48,'Portée : ajuster la difficulté après l’Amplitude',27,'#eef7f7',True)
            t(32,84,'Choisir comment le Mage atteint sa cible.',18)
            for i,(name,rule) in enumerate(rows):
                y=111+i*71;box(30,y,1000,60);t(52,y+40,name,20,'#f0f7f6',True);t(565,y+40,rule,19,'#f2bd78')
            box(30,419,1000,75,'#f2bd78','#30281f')
            t(52,450,'Au-delà de 25 → au moins 1 PA de Canalisation par niveau excédentaire.',18,'#f2bd78',True)
            t(52,478,'Exemple : difficulté 25 + portée « à vue » → 1 PA supplémentaire avant le jet.',17)
            t(32,526,'Hors vue : lien, ancrage, rituel, Technique, Écho ou Magie personnelle requis.',17,'#f1cfa1')
    elif slug == 'mage-canalisation':
        if mobile:
            t(24,42,'Canalisation : échanger des PA',22,'#eef7f7',True)
            t(24,74,'contre une difficulté moindre.',18)
            for i,(title,first,second) in enumerate([
                ('Départ','Cataclysmique : difficulté 25,','4 PA de base, +4 Tension.'),
                ('Canaliser','Investir 2 PA supplémentaires','avant la résolution.'),
                ('Libérer','Difficulté 25 → 21 → 18 ;','6 PA investis, +4 Tension.')]):
                y=107+i*205;box(22,y,496,182);t(42,y+42,title,21,['#5de0d0','#8ab9ff','#f2bd78'][i],True);t(42,y+89,first,18);t(42,y+123,second,18)
                if i<2:arrow(270,y+184,270,y+202)
            t(24,758,'Avec 2 PA disponibles par round :',17,'#f1cfa1')
            t(24,786,'3 rounds pour investir les 6 PA.',17,'#f1cfa1')
        else:
            t(32,47,'Canalisation : échanger du temps contre de la fiabilité',26,'#eef7f7',True)
            t(32,83,'Chaque PA investi en plus avant le jet réduit la difficulté d’un niveau, jusqu’à 12.',18)
            for x,color,title,a,b in [
                (30,'#5de0d0','Départ','Cataclysmique : difficulté 25','4 PA de base · +4 Tension'),
                (372,'#8ab9ff','Investir','2 PA de Canalisation','avant de lancer'),
                (714,'#f2bd78','Résoudre','25 → 21 → 18','6 PA au total · +4 Tension')]:
                box(x,142,316,222);t(x+18,190,title,22,color,True);t(x+18,248,a,17);t(x+18,296,b,16)
            t(32,423,'Avec seulement 2 PA disponibles par round, investir 6 PA prend trois rounds.',19,'#f1cfa1')
            t(32,477,'La Canalisation ne diminue ni la Défense d’une cible ni la Tension.',18)
    chunks.append('</svg>')
    return '\n'.join(chunks)+'\n'

manifest=[]
for slug,title,cards,note,article,section in DIAGRAMS:
    version='v3' if slug == 'lancer-sort' else 'v2'
    filename=f'regles-{slug}-{version}.svg'
    (OUT / filename).write_text(render_magic_workflow() if slug == 'lancer-sort' else render(slug,title,cards,note),encoding='utf-8')
    mobile_filename=f'regles-{slug}-{version}-mobile.svg'
    (OUT / mobile_filename).write_text(render_magic_workflow(mobile=True) if slug == 'lancer-sort' else render_mobile(title,cards,note),encoding='utf-8')
    manifest.append(dict(articleId=article,sectionId=section,src='images/rules/'+filename,
                         mobileSrc='images/rules/'+mobile_filename,title=title,
                         alt=title+' : '+' ; '.join(a+' — '+b for a,b in cards)+'. '+note))
for slug,title,section,alt in MAGE_GUIDES:
    filename=f'regles-{slug}-v1.svg'
    mobile_filename=f'regles-{slug}-v1-mobile.svg'
    (OUT/filename).write_text(render_mage_guide(slug),encoding='utf-8')
    (OUT/mobile_filename).write_text(render_mage_guide(slug,mobile=True),encoding='utf-8')
    manifest.append(dict(articleId='regles-verite-v7-mage-maitrise-amplitude-lancement',sectionId=section,
                         src='images/rules/'+filename,mobileSrc='images/rules/'+mobile_filename,
                         title=title,alt=alt))
(ROOT/'compendium/source/rules-diagrams-v1.json').write_text(
    json.dumps({'version':1,'diagrams':manifest},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(manifest)} diagrams generated')
