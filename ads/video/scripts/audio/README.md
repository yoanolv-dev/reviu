# Audio de la vidéo Reviu

Effets sonores et musique de fond de la pub verticale (TikTok, Reels), générés
par synthèse en Python (numpy + scipy).

## Droits

Tout est de la synthèse originale, calculée à partir d'oscillateurs, de bruit
et de filtres écrits dans ces scripts : aucun échantillon, aucune banque de
sons, aucune musique existante, aucun contenu tiers. Aucun droit de tiers ne
s'applique, les fichiers peuvent être utilisés dans des publicités commerciales.

## Régénérer

Prérequis : `python3`, `numpy`, `scipy`, `pyloudnorm` (`pip install pyloudnorm`),
et `matplotlib` seulement pour le spectrogramme.

```bash
# effets sonores -> public/audio/sfx/*.wav + public/audio/sfx/manifest.json
python3 scripts/audio/sfx.py

# musique pilotée par un JSON d'arrangement
python3 scripts/audio/music.py public/audio/music/arrangement-example.json public/audio/music/example.wav

# contrôle technique (format, crêtes, loudness, offset continu, bords)
python3 scripts/audio/verify.py public/audio/sfx/*.wav public/audio/music/example.wav
```

Les rendus sont déterministes (graines fixes) : relancer donne les mêmes fichiers.
`dsp.py` contient les outils partagés (filtres, réverbe, limiteur, export WAV).

## Effets sonores

Format : WAV PCM 16 bits, stéréo, 48 kHz. Pas de silence de tête (le son
commence à l'échantillon 0), fondus courts, crête à -3 dBFS (impact : -1.5 dBFS,
étoiles alignées en loudness entre elles).

`hit_s` est l'instant perceptif (attaque ou crête d'énergie) à caler sur
l'événement visuel : pour que le hit tombe sur la frame F à 30 i/s, démarrer le
son à la frame `F - hit_s * 30`. Le détail (marqueurs de notes, loudness,
volume conseillé) est dans `public/audio/sfx/manifest.json`.

| Fichier | Durée (s) | hit_s | Usage |
| --- | --- | --- | --- |
| whoosh.wav | 0.448 | 0.190 | transition de scène, passage gauche vers droite |
| whoosh-short.wav | 0.220 | 0.089 | apparition de texte |
| swipe-up.wav | 0.300 | 0.238 | transition vers le haut |
| pop.wav | 0.120 | 0.003 | apparition d'élément, bulle |
| tap.wav | 0.150 | 0.005 | téléphone qui touche le présentoir |
| nfc.wav | 0.600 | 0.006 | confirmation sans contact (2e note à 0.085 s) |
| star-1.wav à star-5.wav | 0.250 | 0.003 à 0.004 | les 5 étoiles qui se remplissent (Do6 Ré6 Fa6 Sol6 La6) |
| success.wav | 0.900 | 0.004 | "Avis publié" (notes à 0, 0.075, 0.15, 0.225 s) |
| notif.wav | 0.500 | 0.004 | notification (2e note à 0.11 s) |
| impact.wav | 1.200 | 0.006 | grande révélation (logo, prix) |
| riser.wav | 1.500 | 1.500 | montée : caler la FIN sur la coupe |
| click.wav | 0.050 | 0.002 | clic de bouton |
| tick.wav | 0.050 | 0.002 | compteurs, coches |

Mixage : la musique est à -16 LUFS. `suggested_volume` du manifeste donne un
volume de départ pour que chaque effet ressorte d'environ 2 LU (nfc : 0.63,
notif : 0.77, les autres : 1). Pour des tics très rapprochés, baisser vers 0.5.
Les notes tonales (nfc, étoiles, success, notif) sont en Fa majeur, comme la
musique : elles ne peuvent pas sonner faux par-dessus.

## Musique

120 BPM fixes : 1 temps = 0.5 s = 15 frames, 1 mesure = 2 s = 60 frames à
30 i/s. Durée du fichier : exactement `bars * 2 + tail_s` secondes.

```json
{"bars": 13,
 "sections": [{"from_bar": 0, "to_bar": 1, "energy": "intro"},
              {"from_bar": 1, "to_bar": 5, "energy": "build"},
              {"from_bar": 5, "to_bar": 10, "energy": "drop"},
              {"from_bar": 10, "to_bar": 11, "energy": "break"},
              {"from_bar": 11, "to_bar": 13, "energy": "outro"}],
 "final_hit_bar": 11, "tail_s": 1.0}
```

- `intro` : accords filtrés et charleston léger.
- `build` : ajoute kick et basse, le filtre s'ouvre, montée de bruit et
  roulement de clap sur la dernière mesure, dernier temps vide avant le drop.
- `drop` : groove complet (kick sur chaque temps, clap sur 2 et 4, charleston
  ouvert à contretemps, basse, stabs et pad pompés par le kick, mélodie pluck
  avec écho), cymbale au début.
- `break` : sans batterie, accords et mélodie filtrés.
- `outro` : groove complet puis fin.
- `final_hit_bar` (optionnel) : gros accord de Fa + impact grave + cymbale au
  début de cette mesure (aspiration de cymbale inversée juste avant, sauf après
  un build).
- `tail_s` (défaut 1.0) : queue après la dernière mesure, avec fondu final.
- `end_button` (optionnel, défaut true) : accord final de tonique sur le temps
  fort qui suit la dernière mesure (à `bars * 2` s).

Harmonie : Fa majeur, grille Fa, Do, Rém, Sib qui repart sur Fa au début de
chaque section ; la mesure avant le hit final (et la dernière mesure si elle
n'ouvre pas sa section) passe sur Do pour résoudre sur Fa. Mélodie en
pentatonique de Fa majeur.

Master : environ -16 LUFS intégrés, crête vraie limitée à -2 dBTP (sous la
limite de -1.5 dBTP), pour rester sous les effets sonores et une voix off.
Avec `MUSIC_DEBUG=1`, le script affiche aussi la loudness par mesure et par
instrument.
