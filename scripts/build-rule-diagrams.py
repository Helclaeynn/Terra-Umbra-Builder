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
 ('lancer-sort', 'Exemple : Amplitude et portée d’un sort', [('Amplitude', 'Possédée Majeure ; utilisée Significative'), ('Difficulté', 'Base 18 → 15 (avance) → 18 (à vue)'), ('Libération', 'Difficulté 18 ; 2 PA ; +2 Tension')], 'La portée annule ici le cran de difficulté gagné.', 'regles-verite-v7-mage-maitrise-amplitude-lancement', 'construire-et-lancer-un-sort'),
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

manifest=[]
for slug,title,cards,note,article,section in DIAGRAMS:
    filename=f'regles-{slug}-v2.svg'
    (OUT / filename).write_text(render(slug,title,cards,note),encoding='utf-8')
    mobile_filename=f'regles-{slug}-v2-mobile.svg'
    (OUT / mobile_filename).write_text(render_mobile(title,cards,note),encoding='utf-8')
    manifest.append(dict(articleId=article,sectionId=section,src='images/rules/'+filename,
                         mobileSrc='images/rules/'+mobile_filename,title=title,
                         alt=title+' : '+' ; '.join(a+' — '+b for a,b in cards)+'. '+note))
(ROOT/'compendium/source/rules-diagrams-v1.json').write_text(
    json.dumps({'version':1,'diagrams':manifest},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(manifest)} diagrams generated')
