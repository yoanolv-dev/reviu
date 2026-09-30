# Charte graphique reviu

Identité visuelle de reviu : logo, couleurs, typographie, éléments graphiques
et gabarits réseaux sociaux. La version de référence, éditable, est dans Canva
([dossier **Reviu - Charte graphique**](https://www.canva.com/folder/FAHWeHHjrKs)) ; ce dossier en garde les sources.

## Designs Canva

| Design | Contenu |
|---|---|
| [Reviu - Charte graphique](https://www.canva.com/d/TN4D-F3W1HxSqlX) | 15 pages : marque, logo, déclinaisons, protection, interdits, couleurs, typographie, signature des titres, éléments graphiques, photographie, ton, réseaux sociaux |
| [Reviu - Logo](https://www.canva.com/d/jpFBXrE7vv9O9mW) | 6 pages : logo sur blanc, cobalt, encre, version verticale, monogramme, avatar réseaux sociaux |
| [Reviu - Bannière Facebook](https://www.canva.com/d/fYJy6v1AT3OuzJ9) | 1640 × 624 px (texte dans la zone visible sur mobile) |
| [Reviu - Bannière LinkedIn](https://www.canva.com/d/dN1FKNO8QDgC8Wo) | 1584 × 396 px (zone de gauche laissée libre pour la photo de profil) |
| [Reviu - 5 posts Instagram](https://www.canva.com/d/y9Z1JJiWOW7zHD5) | 1080 × 1350 px : produit, fonctionnement, comparatif, offre, métiers |
| [Reviu - 5 stories Instagram](https://www.canva.com/d/nTV5_ccB66Iflad) | 1080 × 1920 px : accroche, démo, sondage, offre, outil QR gratuit |

## L'essentiel

**Logo** : monogramme « r » blanc dans un carré cobalt aux angles arrondis,
wordmark « reviu » en minuscules (Plus Jakarta Sans Bold, vectorisé). Le point
du i est doré : c'est l'étoile de l'avis, seule touche d'or du logo. Seul, le
monogramme porte le point doré (icône, favicon, avatar).

**Couleurs**

| Nom | HEX | Usage |
|---|---|---|
| Cobalt Reviu | `#1B4DFF` | Couleur de marque |
| Encre | `#0A0D16` | Textes, fonds sombres |
| Or des avis | `#FBBC04` | Accent : point final, étoiles |
| Blanc | `#FFFFFF` | Fonds, respiration |
| Cobalt profond | `#1139C9` | Survol, profondeur |
| Brume | `#EDF1FF` | Fonds clairs de marque |
| Perle | `#F5F6F8` | Fonds neutres |
| Ardoise | `#6B7382` | Textes secondaires |

**Nom du produit** : « Présentoir Reviu » (descripteur SEO : « présentoir
avis Google »). Le geste s'explique par « sans contact ou QR code » ; jamais
« présentoir NFC + QR » dans le discours.

**Typographie** : Plus Jakarta Sans pour l'identité (logo, site web, print).
Dans Canva, tout le texte est en **Inter** (gratuite dans Canva ; Plus Jakarta
Sans n'y est pas reconnue à l'import). Titres en ExtraBold, interlettrage -3 %.

**Signature des titres** : le dernier mot passe en cobalt, le point final est
doré. Sur fond cobalt ou sombre, titre en blanc et seul le point reste doré.
Pas de sur-titre, pas de tiret long.

## Fichiers

- `logo/svg`, `logo/png` : toutes les déclinaisons du logo (PNG en 4x).
  `reviu-avatar-reseaux` sert de photo de profil (Instagram, Facebook, LinkedIn).
- `icons/` : pictogrammes, étoiles, coches, spécimens typographiques vectorisés
  et exemples d'usages interdits du logo.
- `photos/` : photos produit utilisées dans les gabarits. Leur QR mène à
  `reviu.fr/demo` (voir `scripts/replace-qr.py`).
- `apercus/` : aperçus JPG des posts et stories (page Réseaux sociaux de la charte).
- `canva/` : pages HTML importées dans Canva (une section = une page Canva).
- `sources/` : scripts Python qui génèrent le logo vectorisé et les pages.

## Régénérer

Les scripts de `sources/` attendent, dans leur dossier de travail, les polices
`ttf/PlusJakartaSans[wght].ttf` et `ttf/Inter.ttf` (Google Fonts) ainsi que
leurs instances statiques dans `static/`. Dépendances : `fonttools`, `brotli`,
`uharfbuzz`, `pillow`, et Playwright pour les rendus.

1. `python glyphs.py` puis `python make_logos.py`, `python variants.py` et `python specimen.py` : logos, pictogrammes et spécimens.
2. `python build.py local` : aperçu local ; `python build.py canva <URL racine des ressources> <dossier>` : pages pour l'import Canva.
3. Pousser les ressources, puis importer chaque page HTML dans Canva
   (import depuis une URL publique qui sert le HTML en `text/html`).
