#!/usr/bin/env python3
"""Build compact, source-grounded SVG reading aids for the rules corpus."""
from html import escape
from pathlib import Path
import json
import textwrap

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'compendium/images/rules'
OUT.mkdir(parents=True, exist_ok=True)

# Each short label comes from the article indicated in the manifest below.
DIAGRAMS = [
 ('resolution', 'Résoudre un test', [('Composer', 'Attribut + Compétence + 1d10e'), ('Comparer', 'Total ≥ Difficulté : réussite'), ('Lire la marge', 'Total − Difficulté : degrés de réussite')], 'Un échec narratif naturel prime sur le total.', 'regles-resolution-des-tests', 'test-standard'),
 ('initiative', 'Initiative et PA', [('Lancer', 'Agilité + Athlétisme + 1d10e'), ('Attribuer les PA', '1–10 : 1 PA · 11–15 : 2 PA · 16+ : 3 PA'), ('Jouer les passes', 'Actions selon les PA disponibles')], 'Sur 1 naturel : 1 PA maximum.', 'regles-initiative-pa-deplacement', 'initiative-et-pa'),
 ('combat', 'Résoudre une attaque', [('Attaquer', 'Mêlée ou Tir : Attribut + Compétence + 1d10e'), ('Défendre', 'Défense passive ou active pour 1 PA'), ('Calculer', 'Si attaque > Défense : marge, puis dégâts − armure')], 'Une égalité n’inflige ni dégât ni effet.', 'regles-combat-defenses', 'defenses'),
 ('sante', 'Blessures et soins', [('PV ≤ 50 %', 'État minimum : Tendu'), ('PV ≤ 25 %', 'État minimum : Paniqué'), ('PV ≤ 0', 'Agonisant ; test en fin de round')], 'Stabiliser : Esprit + Soin contre 15, retour à 0 PV.', 'regles-sante-blessures-soins', 'pv-et-seuils'),
 ('stress', 'Les trois états de Stress', [('Normal', 'Échec narratif : 1 · explosion : 10'), ('Tendu', 'Échec narratif : 1–2 · explosion : 9–10'), ('Paniqué', 'Échec narratif : 1–3 · explosion : 10')], 'Les blessures peuvent imposer un état minimum.', 'regles-stress-etats-psychologiques', 'normal-tendu-panique'),
 ('augmentations', 'Charge et Stress augmentique', [('Mesurer', 'Intégrité = Force Mentale + Humanité'), ('Comparer', 'Charge et Stress à leurs limites respectives'), ('Maîtriser', 'À la limite : 15 ; au-delà : 18, 21 ou 25')], 'Le Stress de base des implants ne disparaît pas au repos.', 'regles-realite-v9-charge-stress-frenesie', 'difficultes'),
 ('intrusion', 'Intrusion Neurodive', [('Choisir le seuil', 'Sécurité : difficulté 12 à 25'), ('Franchir', 'Test de Neurodive contre l’obstacle'), ('Contrôler', 'Une fonction accessible du nœud atteint')], 'Un accès réussi ne donne pas tout le système.', 'regles-realite-v9-neurodive-actions-intrusion', 'intrusion-controle'),
 ('train-de-vie', 'Train de vie et charges fixes', [('Point de départ', 'Train de vie de base'), ('Déduire les charges', 'Logement, véhicule, dettes et autres charges fixes'), ('Recalculer', 'Train de vie effectif, puis reste disponible')], 'Le Train de vie n’est pas le salaire du personnage.', 'regles-realite-v9-economie-compte-train-vie', 'charges-fixes'),
 ('defense-occulte', 'Choisir la Défense', [('Effet évitable', 'Phénomène physique : Défense physique'), ('Imposition directe', 'Esprit, âme, identité ou intérieur du corps : Défense occulte'), ('Réagir', 'Défense active : 1 PA si elle est autorisée')], 'Pour un même effet, on ne cumule pas les deux Défenses.', 'regles-verite-v7-pa-reactions-defense-puissance', '4-defense-occulte-et-puissance-des-effets'),
 ('voile', 'États de Révélation', [('Voilé', 'Forme traduite ; capacités compatibles V'), ('Semi-Révélé', 'Vérité partielle, normalement une scène au plus'), ('Révélé', 'Vérité pleinement exprimée selon la Nature')], 'Transition sous pression : normalement 1 PA.', 'regles-verite-v7-voile-continuite-objets-reseaux-interfaces', '5-hologramme-voile-semi-revelation-et-revelation'),
 ('lancer-sort', 'Construire et lancer un sort', [('Décrire', 'Affinité → Essence → Polarité'), ('Dimensionner', 'Maîtrise → Amplitude → portée'), ('Résoudre', 'Volonté + Maîtrise spirituelle + 1d10e')], 'Amplitude choisie : difficulté, PA et Tension à la libération.', 'regles-verite-v7-mage-maitrise-amplitude-lancement', 'construire-et-lancer-un-sort'),
 ('corruption', 'Exposition et Corruption', [('Identifier', 'Source et voie d’exposition'), ('Résister', 'Test adapté : physique ou mental'), ('Conséquence', 'Succès : 0 · échec : +1 · échec narratif : +2')], 'L’Humanité fixe l’Intégrité ; elle ne s’ajoute pas au test.', 'regles-verite-v7-corruption-integrite-bascule', 'exposition'),
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
        if idx < 2:
            chunks.append(f'<path d="M {bx+316} 177 h 22 m -8 -8 l 8 8 -8 8" fill="none" stroke="#a6d6d6" stroke-width="3"/>')
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
    filename=f'regles-{slug}.svg'
    (OUT / filename).write_text(render(slug,title,cards,note),encoding='utf-8')
    mobile_filename=f'regles-{slug}-mobile.svg'
    (OUT / mobile_filename).write_text(render_mobile(title,cards,note),encoding='utf-8')
    manifest.append(dict(articleId=article,sectionId=section,src='images/rules/'+filename,
                         mobileSrc='images/rules/'+mobile_filename,title=title,
                         alt=title+' : '+' ; '.join(a+' — '+b for a,b in cards),caption=note))
(ROOT/'compendium/source/rules-diagrams-v1.json').write_text(
    json.dumps({'version':1,'diagrams':manifest},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(manifest)} diagrams generated')
