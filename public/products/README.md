# Photos produit - présentoir reviu

Déposez ici les visuels du présentoir. Le site les affiche automatiquement dès
qu'ils sont présents ; en leur absence, un visuel de marque de repli s'affiche
(aucune image cassée).

## Fichiers attendus (noms exacts)

| Fichier | Usage sur le site | Visuel conseillé |
|---|---|---|
| `presentoir.webp` | Carte produit boutique + carte tarifaire (home) | Face avant, fond clair/studio |
| `presentoir-angle.webp` | Hero boutique + section « Le présentoir » (démo) | Vue 3/4, dynamique |
| `presentoir-comptoir.webp` | Section « Programme revendeur » (boutique) | Mise en situation (comptoir / accueil) |
| `etape-1.webp` | Section « Comment ça marche » - étape 1 | Smartphone qui scanne le QR du présentoir |
| `etape-2.webp` | Section « Comment ça marche » - étape 2 | Écran d'activation / espace client |
| `etape-3.webp` | Section « Comment ça marche » - étape 3 | Présentoir en situation, un client laisse un avis |

les trois `etape-*.webp` sont affichées en **4/3** côte à côte : cadrez-les de
façon homogène (même fond / même échelle) pour un rendu propre.

Format : WebP (conseillé), idéalement carré ou 4/3, ~1200 px de côté, < 500 Ko
(compressez si besoin). Les fichiers de ce dossier sont servis publiquement.

Après ajout : `git add public/products/*.webp && git commit && git push`.
