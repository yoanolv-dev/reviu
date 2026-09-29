# Publicités vidéo Reviu (TikTok, Instagram, Facebook)

Vidéos publicitaires verticales du Présentoir Reviu, réalisées en motion
design par le code (Remotion) à partir de la photo produit exacte. Ce dossier
réunit la stratégie (benchmark, brief créatif, revue critique), le projet
vidéo et tout ce qu'il faut pour lancer et tester les campagnes.

- `strategie/brief-creatif.md` : **le document de référence** (benchmark,
  cible, promesse, 6 angles, spécifications, langage motion, plan de test,
  textes d'annonce, conformité).
- `strategie/recherche/` : les rapports sources (concurrents France et
  international, plateformes, motion design, preuves et droit, fiche Reviu,
  corrections du critique), avec leurs liens.
- `strategie/revue-critique-a1.md` : la revue de la vidéo principale par 5
  regards (acheteur média, directeur motion, conformité, correcteur,
  commerçant cible) et les arbitrages appliqués.
- `video/` : le projet Remotion (sources, sons, rendu, mastering).

## Les vidéos

Toutes en 9:16, 30 images/s, son original (musique et effets synthétisés,
sans droits tiers : utilisables sur TikTok **et** Meta). Deux fichiers par
vidéo : `_TT` en 1080 x 1920 (TikTok, Reels, Stories) et `_META` en
1440 x 2560 (résolution recommandée par Meta).

| Fichier | Durée | Angle | Accroche (2 premières secondes) | Où la diffuser |
|---|---|---|---|---|
| `REV_A1_H1_24s_916` | 24 s | Démonstration « Un geste » (vidéo principale) | « Un geste. Votre page d'avis Google s'ouvre. » | TikTok, Reels |
| `REV_A1_H2_24s_916` | 24 s | Même vidéo, autre accroche | « Vos clients vous adorent. Google ne le sait pas encore. » | Test d'accroche |
| `REV_A1_H3_24s_916` | 24 s | Même vidéo, autre accroche | « Nouveau : le présentoir d'avis sans appli. » | Test d'accroche (valable moins d'un an après le lancement) |
| `REV_A1_H1_15s_916` | 15 s | Coupe courte de la vidéo principale | « Un geste. Votre page d'avis Google s'ouvre. » | Stories (lues en entier jusqu'à 15 s) |
| `REV_A2_H2_21s_916` | 21 s | Problème : « Vous connaissez la suite » | « « Je vous mets un avis ce soir ! » » | TikTok, Reels |
| `REV_A3_H1_20s_916` | 20 s | Friction : « Le chemin trop long » | « Laisser un avis Google, aujourd'hui : » | TikTok, Reels |
| `REV_A4_H1_15s_916` | 15 s | Offre d'abord : « 29,90 €. Une fois. » | « 29,90 € » | Stories, reciblage |
| `REV_A1_H1_24s_916_LogoFlou` | 24 s | Secours : logo Google imprimé flouté | idem A1 H1 | Seulement si une régie refuse la version normale |

Les vidéos finales ne sont pas versionnées (trop lourdes) : elles sont livrées
à part et se régénèrent à l'identique (voir « Régénérer »). Les images
d'aperçu (`video/renders/*.jpg`) sont dans le dépôt.

### Pourquoi ces vidéos devraient convertir

- **Le geste dès la première seconde.** Le produit et le téléphone sont à
  l'image à la frame 0, le contact a lieu à la frame 4 et la page d'avis
  s'ouvre à 1 s. Aucun concurrent français observé ne montre le parcours
  complet ; les vidéos internationales qui marchent le font toutes avant 3 s.
- **La preuve par le geste, pas par des chiffres.** Aucune promesse de
  résultat (« x2 avis », « 5 étoiles »). Le parcours est honnête : bannière du
  téléphone à toucher, étoiles vides choisies par le client, mentions
  « Scène reconstituée. Avis fictif. ».
- **L'offre complète.** 29,90 €, une seule fois, sans abonnement, livraison
  offerte, 30 jours pour essayer, Espace Reviu inclus (statistiques et lien
  modifiable). C'est ce qui distingue Reviu des plaques vendues seules et des
  logiciels à abonnement.
- **Compréhensible sans le son.** Tout le message est à l'écran ; le son
  (musique à 120 BPM, effets calés à l'image) renforce le geste.
- **Un système testable.** Même corps de vidéo, accroches interchangeables,
  angles vraiment différents (démo, problème, friction, offre), comme le
  recommande la méthode de test ci-dessous.

### Ce qui a été traité dans l'image

- **La photo produit est exactement celle fournie**, détourée au pixel, en
  pseudo-3D (épaisseur, reflet, ombre).
- **QR code.** Le QR code imprimé sur cette photo renvoie vers
  **digifeel.fr, un concurrent**. Dans les vidéos, il est remplacé par un
  motif de QR illisible (vérifié avec deux lecteurs), sans changer l'aspect
  du produit. **Les photos du site et de la charte ont le même problème** :
  à corriger avant de lancer la publicité.
- **Logo Google imprimé.** TikTok refuse les marques tierces non autorisées
  et Google interdit son « G » dans le marketing d'une entreprise. Il n'est
  donc jamais au centre, jamais en gros plan, jamais animé ; une mise au
  point optique le laisse flou quand le produit est grand. Une variante de
  secours, logo flouté, est prête en cas de refus.
- **Mentions** (bandeaux unis, 3 s minimum) :
  - indépendance vis-à-vis de Google ;
  - scène reconstituée ;
  - aperçu et chiffres d'exemple de l'Espace ;
  - TVA non applicable (art. 293 B du CGI) et livraison en France
    métropolitaine ;
  - conditions de la garantie.
- **Zones sûres TikTok et Reels.** Tout le texte tient dans x 100 à 930 et
  y 270 à 1248 : rien n'est caché par l'interface des applis.

## Avant de dépenser le premier euro (bloquant)

1. **QR code concurrent sur les photos du site** (`public/products/*.webp`,
   flux Google Shopping, charte et Canva) : les remplacer. Une tâche dédiée
   est proposée.
2. **Suivi des ventes pour Meta et TikTok.** Il faut :
   - installer les deux pixels, après accord « Publicité » du bandeau
     cookies ;
   - envoyer le même achat côté serveur (API Conversions de Meta, Events
     API de TikTok) ;
   - ajouter `ttclid` aux identifiants de clic
     (`src/lib/tracking-config.ts`).

   Sans cela, les régies ne peuvent pas optimiser sur les achats.
3. **Section « Déjà sur le comptoir de nos clients »**
   (`src/lib/installations.ts`). Elle s'affiche alors qu'aucun présentoir
   n'est vendu : établir le statut réel de ces photos ou la masquer. La
   publicité et la page d'arrivée doivent dire la même chose.
4. **Adresse légale** dans les mentions légales, les CGV et la politique de
   confidentialité : à vérifier. Les régies vérifient l'annonceur.
5. **CGV** : préciser que les lots de 3 et 5 présentoirs sont couverts par la
   garantie de 30 jours.
6. **Coûts unitaires** (présentoir, emballage, envoi, frais de paiement,
   retours) : ils donnent le coût d'acquisition maximum. Formule dans
   `strategie/brief-creatif.md` §8.2.
7. **Logo Google imprimé sur le produit** : demander l'avis d'un avocat en
   droit des marques, et envisager une face « Avis Google » en texte seul.
8. **Vérifier à la main les bibliothèques publicitaires** (Meta Ad Library,
   bibliothèque TikTok) : elles n'étaient pas accessibles pendant l'étude.

## Plan de test (14 premiers jours)

- **Meta.**
  - 1 campagne Ventes (Advantage+), France métropolitaine, optimisation sur
    l'achat.
  - 30 à 40 €/jour, plus 3 % de taxe Meta en France.
  - Aucune modification importante pendant 14 jours.
- **TikTok.**
  - 1 campagne de conversions web, optimisation sur « paiement commencé »
    au départ.
  - Environ 25 €/jour.
  - Au moins 2 jours entre deux changements.
- **Phase 1 : les angles.**
  - A1 H1, A2, A3 et A4 (A4 surtout en Stories sur Meta).
  - Le 15 s en Stories contre le 24 s en Reels.
- **Phase 2 : les accroches.** Sur les 2 meilleurs angles, H1, H2 et H3 : seul
  le début change.
- **Seuils de décision.**
  - Taux d'accroche (lectures de 3 s / impressions) sous 20 % : refaire les
    2 premières secondes.
  - CTR lien sous 1 % après environ 3 000 impressions : changer d'angle.
  - Aucun paiement commencé après 2 fois le coût d'acquisition cible :
    couper la créa.
- **UTM à poser :** `utm_source=tiktok|facebook|instagram&utm_medium=paid_social&utm_campaign=presentoir-video-a1&utm_content=a1-h1-24s`
- **Page d'arrivée :** `https://reviu.fr/` (A4 et reciblage :
  `https://reviu.fr/#produits`).

Le détail (métriques, budgets, phases 3 et 4) est dans le brief, §8.

## Textes d'annonce (prêts à coller)

**TikTok** (100 caractères au plus, sans lien) :
- A1 : « Le client approche son téléphone, votre page d'avis s'ouvre. 29,90 €, sans abonnement ni appli. »
- A2 : « Vos clients vous adorent. Google ne le sait pas encore. Le présentoir Reviu : 29,90 €, une fois. »
- A3 : « Plus besoin de chercher votre fiche : un geste et la page d'avis s'ouvre. Sans appli. 29,90 €. »
- A4 : « 29,90 € une seule fois. Livraison offerte, 30 jours satisfait ou remboursé. Sans abonnement. »

**Meta.**

| Angle | Texte principal (125 caractères visibles) | Titre |
|---|---|---|
| A1 | « Un geste du client et votre page d'avis Google s'ouvre. Sans contact ou QR code, sans appli. 29,90 €, une seule fois. » | « Page d'avis en un geste » |
| A2 | « Vos clients sont contents mais oublient de laisser un avis ? Un geste du téléphone sur le présentoir et votre page s'ouvre. » | « Vos avis Google au comptoir » |
| A3 | « Pour laisser un avis, vos clients doivent d'abord vous trouver sur Google. Avec le présentoir Reviu, un geste suffit. » | « Un geste suffit » |
| A4 | « 29,90 € une seule fois : présentoir sans contact et QR code, Espace Reviu inclus, livraison offerte. Sans abonnement. » | « 29,90 €, sans abonnement » |

À ajouter après les 125 premiers caractères, sur toutes les annonces Meta :

> Sans contact ou QR code, sans appli · Espace Reviu inclus : statistiques et lien modifiable · 29,90 € une seule fois (TVA non applicable, art. 293 B du CGI) · Livraison offerte en France métropolitaine · Satisfait ou remboursé 30 jours, conditions sur reviu.fr/cgv · Sans contact dès l'iPhone XS (écran déverrouillé) et sur les Android avec NFC ; QR code pour les autres. Un compte Google est nécessaire pour publier un avis. Les avis restent libres, sans contrepartie. Reviu est un service indépendant et n'est ni affilié, ni sponsorisé, ni approuvé par Google. Google et le logo Google sont des marques de Google LLC.

Boutons : « Acheter » ou « Commander » (Meta), « Acheter maintenant » (TikTok).

## Voix off (facultative, à enregistrer soi-même)

Les vidéos se comprennent sans voix. Sur TikTok et Reels, une vraie voix
(celle du fondateur, ou d'un comédien avec cession de droits) est un plus.
Une voix de synthèse est déconseillée : TikTok impose alors une étiquette IA.
Texte calé sur la vidéo principale (24 s), ton posé, vouvoiement :

| Temps | Texte |
|---|---|
| 0 à 2,8 s | « Regardez : le client approche son téléphone… et votre page d'avis Google s'ouvre. » |
| 3 à 4 s | « Sans appli. » |
| 4 à 7 s | « Il choisit ses étoiles, librement. » |
| 7,5 à 10,5 s | « Sans contact ou QR code, sur iPhone et Android. » |
| 10,5 à 14 s | « Au comptoir de votre restaurant, de votre salon… sans avoir à demander. » |
| 14 à 18 s | « Et dans votre Espace Reviu, inclus : vos scans, et un lien que vous changez quand vous voulez. » |
| 18 à 20 s | « 29,90 euros. Une seule fois. » |
| 20 à 24 s | « Livraison offerte, et trente jours pour l'essayer. Commandez sur reviu.fr. » |

Pour l'ajouter : déposer le fichier (WAV ou MP3) dans
`video/public/audio/voix/`, l'ajouter en `<Audio>` dans
`video/src/ads/A1Geste.tsx`, baisser la musique à 35 % sous la voix, puis
régénérer.

## Régénérer ou modifier les vidéos

Prérequis : Node 22, Python 3 avec `pip install -r video/scripts/requirements.txt`,
Chromium (le chemin est réglé dans `video/remotion.config.ts` et les scripts ;
à adapter sur un autre poste).

```bash
cd ads/video
npm install
npm run studio                                    # aperçu et réglages en direct
node scripts/render-all.mjs                       # rend toutes les compositions Reviu-* (x2)
node scripts/render-all.mjs Reviu-A1-H1-24s-916   # ou une seule
python3 scripts/master.py                         # exports _TT et _META dans renders/
```

- **Textes et timings.**
  - Les scènes sont dans `video/src/scenes/`, les compositions dans
    `video/src/ads/` et les accroches dans `video/src/ads/hooks.tsx`.
  - Les coupes tombent sur les temps de la musique (1 temps = 15 images).
- **Contrôle des zones sûres.** Les compositions `Check-*` affichent les
  zones cachées par les applis. Elles se contrôlent dans le studio, ou en
  images avec `node scripts/stills.mjs Check-A1 0,60,120 planche.jpg`.
- **Sons.**
  - Les générateurs sont dans `video/scripts/audio/` (voir son README).
  - Une musique se régénère avec
    `python3 scripts/audio/music.py public/audio/music/a1.json public/audio/music/a1.wav`.
- **Photo produit.**
  - `scripts/cutout.py` fait le détourage ;
  - `scripts/neutral_qr.py` remplace le QR ;
  - `scripts/logo_variant.py` produit la variante logo flouté.
- **Licence Remotion.** Gratuite pour les particuliers et les entreprises
  de 3 personnes au plus. Au-delà, une licence entreprise est nécessaire
  (remotion.dev/license).
