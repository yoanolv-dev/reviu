# Paid social 2025-2026 : bonnes pratiques TikTok Ads et Meta (Reels, Stories, Feed) appliquées à la vidéo Reviu

Recherche web du 29/09/2026. Chaque chiffre porte une étiquette :
- **[officiel]** : source primaire de la plateforme.
- **[tiers]** : agence, outil ou presse.
- **[non vérifié]** : chiffre repris d'un extrait de moteur de recherche, ou d'une source qui ne cite pas son origine.
- **[heuristique]** : recommandation de production de ma part, sans source.

---

## 0. Synthèse actionnable

1. **Format de base** : 9:16, 1080x1920, 30 i/s constants, H.264 + AAC stéréo ≥128 kbit/s, MP4. **Le son est obligatoire** : TikTok refuse une pub sans audio.
   - Export Meta en 1440x2560, qui est la résolution recommandée aujourd'hui par le Meta Ads Guide.
   - Export TikTok en 1080x1920.
   - Déclinaison 4:5 (1440x1800) pour les Feeds Facebook et Instagram.
2. **Zone de sécurité commune TikTok + Meta sur 1080x1920 : x 65 à 940, y 269 à 1248, soit 875 x 979 px.**
   - Y placer tout texte, prix, CTA, "reviu.fr", ainsi que le pictogramme NFC du produit au moment clé.
   - Le décor et le produit peuvent déborder.
3. **Le produit et le geste "téléphone collé au présentoir" apparaissent entre 0,0 et 2,0 s**, avec un son de "tap" synchronisé.
   - TikTok demande la proposition de valeur dans les 3 premières secondes.
   - Meta/Nielsen : jusqu'à 47 % de la valeur d'une campagne vidéo est livrée dans les 3 premières secondes.
4. **Compréhensible sans le son, meilleur avec** : sous-titres incrustés, voix off en français, et une musique sous licence "publicité payante" valable sur les deux plateformes.
5. **Deux durées** :
   - 15 s pour les Stories (les vidéos de moins de 16 s y passent en entier).
   - 25-30 s pour TikTok (une ancienne étude TikTok associe la fourchette 21-34 s à +280 % de conversion).
6. **Écran de fin en texte** : "29,90 € · sans abonnement · livraison offerte · satisfait ou remboursé 30 jours · reviu.fr".
   - Il renvoie vers le vrai bouton de la plateforme ("Commander" / "Acheter").
   - Jamais de "Swipe up" ni de curseur de souris (interdits par TikTok).
7. **Aucune promesse de résultat chiffrée** : Reviu n'a pas encore de clients. Tout "avant/après" de note ou de nombre d'avis porte la mention "Simulation", ou disparaît.
8. **Google** :
   - Ne pas ajouter de logo Google en plus de celui imprimé sur le produit.
   - Ne pas modifier, animer ni recolorer le "G", et pas d'étoiles à côté.
   - Jamais "officiel", "partenaire" ou "certifié Google".
   - Mettre en petit la mention d'indépendance vis-à-vis de Google, déjà rédigée dans `/home/user/reviu/src/lib/brand.ts` (ligne 78), en fin de vidéo et sur la page d'arrivée.
9. **QR code sur TikTok France** : la page TikTok "Ad Format and Functionality" range la France parmi les marchés soumis à une restriction sur les QR codes.
   - Rendre le QR du présentoir **non scannable** dans la vidéo (motif stylisé ou flou).
   - TikTok autorise explicitement les "unscannable matrix codes".
10. **Bloquant avant de dépenser le moindre euro sur Meta ou TikTok** : le site n'a que les balises Google (`/home/user/reviu/src/lib/tracking.ts`, `/home/user/reviu/docs/ADS-TRACKING.md`).
    - Il faut Meta Pixel + Conversions API et TikTok Pixel + Events API, chargés après consentement (CNIL).
    - Il faut aussi ajouter `ttclid` à `CLICK_ID_KEYS` dans `/home/user/reviu/src/lib/tracking-config.ts` (ligne 73, qui ne contient que `gclid`, `gbraid`, `wbraid`, `fbclid`).

---

## 1. Spécifications techniques

### 1.1 TikTok (In-Feed)

| Élément | Valeur | Source |
|---|---|---|
| Ratios | 9:16 ≥540x960 (recommandé) ; 16:9 ≥960x540 ; 1:1 ≥640x640 | [officiel] [Auction In-Feed](https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads) |
| Résolution | "au moins 720p" ; 720p+ associé à +312 % de conversion par rapport aux résolutions plus basses | [officiel] [Creative best practices](https://ads.tiktok.com/help/article/creative-best-practices), [Creative that drives conversions](https://ads.tiktok.com/business/en-US/blog/creative-that-drives-conversions) |
| Fichiers | .mp4, .mov, .mpeg, .3gp, .avi ; ≤500 Mo | [officiel] Auction In-Feed |
| Débit | ≥516 kbit/s (enchères) ; ≥2 500 kbit/s (Reservation, TopView) | [officiel] Auction In-Feed, [Reservation](https://ads.tiktok.com/help/article/tiktok-reservation-in-feed-ads-reach-frequency?lang=en), [TopView](https://ads.tiktok.com/help/article/tiktok-reservation-topview) |
| Durée | Page specs enchères : jusqu'à 10 min. Page politique : **5 s minimum, 60 s maximum**. Reservation : 5-60 s, **9-15 s recommandées** | [officiel] Auction In-Feed, [Ad Format and Functionality](https://ads.tiktok.com/resources/help/article/tiktok-ads-policy-ad-format-and-functionality), Reservation |
| Audio | "All video creatives must have sound" ; "Clear audio is required" | [officiel] Reservation, [Ad review checklist](https://ads.tiktok.com/help/article/ad-review-checklist?lang=en) |
| Images fixes | 50 % de la vidéo au maximum ; le contenu doit être "dynamique" | [officiel] Ad Format and Functionality |
| Cadence d'images | 23 à 60 i/s ; H.264 et MP4 recommandés (documentation de l'API de publication organique, pas de la doc Ads) | [officiel] [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide) |
| Nom de compte | 1 ligne, 20 caractères maximum | [officiel] Auction In-Feed |
| Photo de profil | 98x98 px, format 1:1 | [officiel] Auction In-Feed |

Les deux pages officielles se contredisent sur la durée (10 min contre 60 s). Rester sous 60 s, en visant 15 s et 25-30 s, évite tout refus.

### 1.2 Meta (pages Meta Ads Guide consultées le 29/09/2026)

| Placement | Ratio et résolution recommandés | Durée | Poids max | Texte et autres | Source |
|---|---|---|---|---|---|
| Instagram Reels | 9:16, **1440x2560** | 0 s à 15 min | 4 Go | Largeur min 250 px (<30 s) ou 500 px (≥30 s) ; texte principal "44 caractères" | [officiel] [IG Reels](https://www.facebook.com/business/ads-guide/update/video/instagram-reels) |
| Instagram Stories | 9:16, 1440x2560 | 1 s à 60 min ; **<16 s joué en entier**, au-delà découpé en 1 à 3 cartes | 4 Go | Texte principal 125 | [officiel] [IG Stories](https://www.facebook.com/business/ads-guide/update/video/instagram-story) |
| Facebook Stories | 9:16, 1440x2560 | 1 s à 3 min | 4 Go | Texte principal 125 | [officiel] [FB Stories](https://www.facebook.com/business/ads-guide/update/video/facebook-story) |
| Facebook Reels | 9:16, 1440x2560 | Pas de maximum indiqué | 4 Go | Page Meta en 404 lors de la consultation | [non vérifié] [adsuploader](https://adsuploader.com/blog/meta-ads-size) |
| Facebook Feed | **4:5, 1440x1800** | 1 s à 241 min | 4 Go | Texte principal 50-150 ; titre 27 | [officiel] [FB Feed](https://www.facebook.com/business/ads-guide/update/video/facebook-feed) |
| Instagram Feed | La page affiche 9:16, 1080x1920 | 1 s à 60 min | 4 Go | Texte principal 125 ; 30 hashtags max | [officiel] [IG Feed](https://www.facebook.com/business/ads-guide/update/video/instagram-feed) |

Réglages vidéo exigés par Meta sur toutes ces pages ([Video overview](https://www.facebook.com/business/ads-guide/update/video)) :
- "H.264 compression, square pixels, fixed frame rate, progressive scan and stereo AAC audio compression at 128kbps+".
- Pas d'"edit lists" ni de "special boxes" dans le conteneur.
- Son et sous-titres : "optionnels mais recommandés".

Format 1:1 : accepté par TikTok (≥640x640). Je n'ai pas consulté de page Meta dédiée au 1:1. Ce n'est pas un livrable prioritaire, le 4:5 couvre les Feeds.

### 1.3 Réglages d'export Remotion [heuristique, compatible avec les specs ci-dessus]

- Composition 1080x1920 à 30 i/s. Rendu TikTok en 1080x1920 ; rendu Meta avec un facteur d'échelle de 1,333, soit 1440x2560.
- H.264, yuv420p, 8-12 Mbit/s. Un spot de 30 s pèse alors environ 30-45 Mo, très loin des 500 Mo autorisés.
- Audio AAC stéréo, 48 kHz, 192 kbit/s. Pas de démarrage sonore brutal.
- Remuxer le MP4 sans edit list (option ffmpeg `-use_editlist 0`) et avec `faststart`.
- Livrables : `reviu_916_15s`, `reviu_916_28s`, `reviu_45_15s`, `reviu_45_28s`, chacun en 3 à 5 variantes de hook.

---

## 2. Zones de sécurité en pixels (cadre 1080x1920)

### 2.1 Meta : Reels et Stories (Instagram et Facebook)

Consigne officielle, identique sur les pages IG Reels et IG Stories : laisser **"at least 14% of the top, 35% of the bottom, and 6% on each side"** libres de texte, de logos et d'éléments clés.

| Bord | % | Pixels |
|---|---|---|
| Haut | 14 % | **269 px** |
| Bas | 35 % | **672 px** (le contenu important s'arrête à y = 1248) |
| Côtés | 6 % chacun | **65 px** |
| Zone utile | | **950 x 979 px**, de (65 ; 269) à (1015 ; 1248) |

Écart à signaler sur la page Facebook Stories : elle indique encore "14 % (250 px) du haut et 20 % (340 px) du bas" ([FB Stories](https://www.facebook.com/business/ads-guide/update/video/facebook-story)).
- Des sources tierces affirment qu'en mars 2026 Meta a unifié Stories et Reels sur la règle 14/35/6 ([billo](https://billo.app/blog/meta-ads-safe-zones/), [adnabu](https://blog.adnabu.com/meta-ads/meta-safe-zones/)). Je n'ai pas trouvé d'annonce Meta qui le confirme.
- Concevoir sur 14/35/6 couvre les deux cas.

### 2.2 TikTok In-Feed

Ce que dit TikTok [officiel] ([Auction In-Feed](https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads)) :
- La zone de sécurité dépend du format, de la longueur de la légende et des modules interactifs ("the longer the caption, the smaller the safe zone").
- Les gabarits sont des fichiers téléchargeables. Le texte de l'aide ne donne aucune valeur en pixels.

Valeurs relevées chez des tiers :

| Source | Haut | Bas | Gauche | Droite |
|---|---|---|---|---|
| [Cadenus](https://cadenus.io/resources/blog/tiktok-safe-zone/) (dit reprendre les fichiers d'Ads Manager) | 130 | **484** | 44 | **140** |
| [zeely](https://zeely.ai/blog/tiktok-safe-zones/) / [admanage](https://admanage.ai/blog/tiktok-ad-specs) [non vérifié] | 150 | 440 | 60 | 60 |
| [House of Marketers](https://houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories-reels/) | 108 | 384 | - | colonne d'icônes à droite |
| [Adsmurai](https://www.adsmurai.com/en/articles/social-media-ad-design-safe-zones-and-templates) | - | 420 | - | - |

Cas le plus contraignant retenu : haut 150, bas 484, gauche 60, droite 140. Cela donne une zone utile de **880 x 1286 px**, de (60 ; 150) à (940 ; 1436). Garder une légende courte (100 caractères au plus) pour ne pas réduire le bas.

### 2.3 Zone commune pour un seul master

| Bord | Valeur retenue | Contrainte dominante |
|---|---|---|
| Haut | **269** | Meta 14 % |
| Bas | **672** | Meta 35 % |
| Gauche | **65** | Meta 6 % |
| Droite | **140** | Colonne d'icônes TikTok |

**Zone critique : x 65 → 940, y 269 → 1248, soit 875 x 979 px**, centre visuel ≈ (502 ; 758).

Règles de mise en page [heuristique] :
- Centrer les textes sur x ≈ 502 et non 540, car la colonne d'icônes TikTok décale le centre utile.
- Au moment du "tap", la bande "COLLEZ VOTRE TÉLÉPHONE" et le pictogramme NFC passent dans la zone critique.
- Prévoir un calque de repères désactivable dans Remotion.
- En 4:5, garder environ 5 % de marge.

---

## 3. Ce que les plateformes disent de la performance

### 3.1 TikTok [officiel sauf mention]

- **Hook** ([Creative best practices](https://ads.tiktok.com/help/article/creative-best-practices), [blog Creative Codes](https://ads.tiktok.com/business/en-US/blog/creative-best-practices-top-performing-ads)) :
  - "Introduce your content proposition in the first 3 seconds".
  - "Prioritize your hook in the first 6 seconds".
  - "90 % of ad recall impact is captured within the first six seconds" (étude TikTok 2020).
- **Plus de 63 % des vidéos au meilleur CTR** mettent le message ou le produit dans les 3 premières secondes. Chiffre attribué au [PDF TikTok](https://ads.tiktok.com/business/library/Auction_Ads_Creative_Tips.pdf) via [Lebesgue](https://lebesgue.io/tiktok-ads/how-to-increase-tiktok-ctr-9-creative-tips) [non vérifié : PDF illisible par l'outil].
- **Produit et CTA** (même blog Creative Codes) :
  - Produit visible à l'écran : +65 % d'affinité de marque, +25 % de mémorisation (Lumen, 2021).
  - Carte CTA : +45 % de mémorisation, +19 % d'appréciation (2020).
- **Son** ([Creative Codes](https://ads.tiktok.com/business/en/creative-codes)) :
  - Obligatoire (voir 1.1).
  - 88 % des utilisateurs jugent le son "vital" (Kantar, 2022).
  - Selon TikTok, c'est la seule plateforme où le son augmente nettement l'intention d'achat (Kantar, 2021).
- **Texte** : "5-10 words per second when using text" (formulation de la page d'aide).
- **Humains et structure** :
  - Montrer des "creators, employees, or customers".
  - Structure "hook, body, close", avec un montage dynamique.
- **Étude conversion non datée, probablement 2021** ([source](https://ads.tiktok.com/business/en-US/blog/creative-that-drives-conversions)) :
  - Résolution 720p+ : +312 %.
  - 9:16 plein écran : +91 %.
  - **CTA en texte : +152 %**.
  - **Durée 21-34 s : +280 %**.
  - E-commerce : plusieurs scènes +38 % ; texte affichant l'offre ou le CTA +80 % ; voix off + offre +87 %, mais **hors Europe**, donc non démontré pour la France.
- **Spark Ads** : +134 % de complétion et +157 % de vues 6 s (test interne 2022) ([Spark Ads 101](https://ads.tiktok.com/business/en-US/blog/spark-ads-101-make-tiktoks-into-ads)) [chiffre tiré d'un extrait de recherche].
- **Volume** : 3 à 5 créas par groupe d'annonces, 3 à 5 groupes par campagne. Renouveler quand les résultats baissent durablement.

### 3.2 Meta [officiel sauf mention]

- **Premières secondes** (Meta x Nielsen, vers 2015-2016, [source](https://www.facebook.com/business/news/updated-features-for-video-ads)) :
  - Jusqu'à 47 % de la valeur d'une campagne vidéo livrée en 3 s, et 74 % en 10 s.
  - Sous-titres : +12 % de temps de visionnage.
  - 80 % des gens réagissent mal à une pub Feed qui démarre fort sans prévenir.
- **Reels** ([newsroom Meta](https://www.facebook.com/business/news/reels-ads-updates-performance-features-automated-creative-suitability-solutions)) :
  - Vidéo verticale avec son : **-4,8 % de CPA, +5,1 % de CTR, +2,9 % de conversion**.
  - Musique + voix off : +15 points de réponse positive.
- **Musique ou voix off en Reels** : jusqu'à +13 % de conversions incrémentales (déc. 2025, [Social Media Today](https://www.socialmediatoday.com/news/meta-shares-tips-on-reels-hooks-creative-diversification-in-ads-and-threa/808182/)).
- **Types de hooks recommandés par Meta** (même source, déc. 2025) : promesse de valeur ; annonce d'intention ; question ou invitation. Tester les hooks en A/B.
- **"Creative fundamentals"** : 9:16, émotion, humain visible, texte incrusté, plusieurs couches audio, hook dans les 2 premières secondes ([AppsFlyer](https://www.appsflyer.com/resources/reports/creative-optimization/), [House of Marketers](https://houseofmarketers.com/meta-shares-tips-on-best-performing-ad-approaches-ai/)) :
  - Campagnes qui cumulent ces éléments : -16 % de CPA, +29 % de conversion (données internes Meta).
  - Son expressif + humain visible : +8 % de conversions par dollar.
  - Diversité créative : jusqu'à -32 % de CPA.
- **Partnership Ads** (pubs diffusées depuis le compte d'un créateur) : +53 % de CTR, -19 % de CPA (Meta 2022) [non vérifié, [Aspire](https://www.aspire.io/blog/how-to-launch-partnership-ads-that-outperform-brand-ads)].
- **Interdit** : "flashing screens" ([Ad Standards](https://transparency.meta.com/policies/ad-standards/)).

### 3.3 Style natif ou très produit : données agences

Source : [Motion 2026](https://motionapp.com/thumbstop-pulse/creative-benchmarks-2026). Échantillon : +550 000 pubs, +6 000 annonceurs, ~1,3 Md$, septembre 2025 à janvier 2026. Une pub "gagnante" dépense au moins 10 fois la médiane de son compte, et seules ~5 % des pubs y arrivent. Les pourcentages ci-dessous sont les taux de pubs gagnantes par catégorie.

| Dimension | Taux de pubs gagnantes |
|---|---|
| Type d'asset | Texte seul 11,60 % ; image produit + texte 8,75 % ; UGC (contenu façon utilisateur) 7,56 % ; **haute production 6,97 %** |
| Style visuel | Lettre 10,83 % ; texte placé de façon inattendue 9,63 % ; offre en premier 8,68 % ; fondateur 8,57 % ; **démo 8,11 %** |
| Hook | **Nouveauté 11,37 %** ; annonce de promo 11,35 % ; **ancrage prix 10,89 %** ; urgence 9,73 % |

Conséquence pour Reviu :
- Le motion design doit servir une démo réelle (vrai geste, vrai téléphone, vrai son), avec une typographie native : gros texte, placement inattendu.
- Éviter le "film de marque", qui est le format au plus faible taux de réussite.
- Les hooks les plus prometteurs selon ces données : "Nouveau" et "29,90 €, une fois".

### 3.4 Chronologie proposée pour le master 25-30 s [heuristique]

| Temps | Contenu |
|---|---|
| 0,0-0,5 s | Main et téléphone qui se posent sur le présentoir (photo produit exacte), son "tap" à ~0,4 s. Pas d'écran titre. |
| 0,5-2,5 s | Page d'avis générique qui s'ouvre sur le téléphone. Hook de 7 mots au plus, dans la zone critique. |
| 2,5-7 s | Le problème : "Vos clients sont contents... et repartent sans laisser d'avis". |
| 7-16 s | Démo NFC, puis QR ("iPhone et Android, sans appli"). 3 à 5 métiers (restaurant, salon, garage, boulangerie), un plan toutes les ~1,5 s. |
| 16-21 s | Espace Reviu : statistiques NFC vs QR, lien modifiable à tout moment. |
| 21-28 s | Offre et CTA texte ; flèche vers le vrai bouton ; mention d'indépendance vis-à-vis de Google. |

- **Version 15 s** : hook de 0 à 2 s, démo de 2 à 10 s, offre de 10 à 15 s.
- **Rythme du texte** : un carton de 7 mots au plus toutes les 1,5 à 2 s.
- **Taille** : texte d'au moins 56 px de haut.
- **Flashs** : aucun flash répété. Seuil souvent cité : 3 flashs par seconde au maximum ([accessibility.com](https://www.accessibility.com/blog/how-to-limit-seizure-triggers-in-digital-content), [tiers]).

---

## 4. Métriques et benchmarks

### 4.1 Définitions

| Métrique | Formule |
|---|---|
| Hook rate / thumb-stop (Meta) | Lectures 3 s ÷ impressions ([Motion](https://motionapp.com/library/glossary/thumbstop-rate-hook-rate)) |
| Hold rate (Meta) | ThruPlays ÷ lectures 3 s ([Motion](https://motionapp.com/library/glossary/hold-rate)) |
| Équivalents TikTok | Vues 2 s ÷ impressions ; vues 6 s ; temps moyen de lecture ([officiel](https://ads.tiktok.com/help/article/video-play?lang=en)) |
| CPA | CPM ÷ (1000 x CTR x taux de conversion) |

### 4.2 Valeurs de référence

| Indicateur | Valeur | Source |
|---|---|---|
| Hook rate Meta | 20-40 % "généralement solide" | [Motion](https://motionapp.com/library/glossary/thumbstop-rate-hook-rate) |
| Hook rate en prospection | Médiane ~22 % ; bon à partir de 30 % | [non vérifié] [adsights](https://www.adsights.ai/resources/glossary/metrics/thumbstop-rate-tsr) |
| Hold rate | ≥15 % sur Meta, ≥20 % sur TikTok | [non vérifié] [adsights](https://www.adsights.ai/resources/glossary/metrics/hold-rate) |
| CTR Meta (campagnes Trafic) | Moyenne 1,93 % ; services B2B 1,64 % ; restauration 2,68 % ; beauté 2,73 % ; réparation auto 1,51 % | [LocaliQ/WordStream, 23/09/2026](https://localiq.com/blog/facebook-advertising-benchmarks/), données US |
| Meta e-commerce 2025 | CPM 14,19 $ ; CTR 2,19 % ; conversion 1,60 % ; CPA 38,19 $ | [Triple Whale](https://www.triplewhale.com/blog/facebook-ads-benchmarks) [site bloqué (403), extrait de recherche] |
| TikTok e-commerce 2025 | CPM 13,26 $ ; CTR 1,77 % ; conversion 2,01 % ; CPA 32,74 $ | [Triple Whale](https://www.triplewhale.com/blog/tiktok-benchmarks) [site bloqué (403), extrait de recherche] |
| CPM Meta France | Médiane ~8,06 € (sept. 2025 à août 2026), de 4,69 € (février) à 21,74 € (juillet 2026) | [Superads](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/france) ; [Lebesgue](https://lebesgue.io/facebook-ads/facebook-cpm-by-country) donne 6,95 $ |
| CPM TikTok France | 3-8 € ; CPC 0,20-0,80 € | [Adintime](https://adintime.com/en/blog/tiktok-ads-the-complete-guide-to-advertising-on-tiktok-in-2026-n311) [tiers, sans source] |
| Frais Meta en France | **+3 % depuis le 01/07/2026** (taxe sur les services numériques répercutée) | [MediaPost](https://www.mediapost.com/publications/article/413378/meta-passes-eu-digital-services-tax-to-advertisers.html) |

### 4.3 Ce que ça donne pour un produit à 29,90 € [calcul]

- **Scénario moyen** : CPM 8 €, CTR 1,5 %, conversion 1,6 %. Le CPA est d'environ 33 €, au-dessus du prix de vente. Pas rentable.
- **Scénario bon** : CTR 2 %, conversion 3 %. Le CPA est d'environ 13 €.
- **CPA maximum tenable** = (29,90 ÷ 1,2) - coût du présentoir - envoi - frais de paiement. Les coûts réels ne sont pas connus ici.
- **Leviers** :
  - Le hook, pour le CTR.
  - La page `/presentoir-avis-google` alignée sur la vidéo, pour la conversion.
  - Une variante multi-sites (27 € l'unité dès 3, 25 € dès 5), pour le panier moyen.

### 4.4 Seuils de décision [heuristique]

| Situation | Décision |
|---|---|
| Hook rate <20 % après 1 000-2 000 impressions | Refaire les 2 premières secondes |
| Hold rate <15 % | Raccourcir le corps et avancer la démo |
| CTR <1 % après ~3 000 impressions | Changer l'angle |
| Dépense = 2x le CPA cible, sans aucun InitiateCheckout (paiement commencé) | Couper |
| CPA sous la cible sur 3 à 5 achats | Monter le budget par paliers (voir 5.4) et décliner 3 à 5 nouveaux hooks |

---

## 5. Méthode de test à petit budget

### 5.1 Tracking (bloquant)

- **Constat dans le dépôt** : seul le suivi Google est en place. `ttclid` est absent de la liste des identifiants de clic (voir 0.10).
- **À ajouter derrière le bandeau de consentement existant** :
  - Meta Pixel + Conversions API, un des piliers du cadre "Performance 5" de Meta ([Meta](https://www.facebook.com/business/ads/performance-marketing)).
  - TikTok Pixel + Events API ([officiel](https://ads.tiktok.com/help/article/best-practices-for-smart-plus-web-campaigns)).
- **Événements à envoyer** :
  - ViewContent : vue de la page produit.
  - InitiateCheckout : sur `/boutique/commander`, déjà instrumenté côté Google en `begin_checkout`.
  - Purchase : avec montant en EUR, sur `/boutique/merci`.
  - Un même identifiant d'événement côté navigateur et serveur, pour éviter les doublons.

### 5.2 Phase d'apprentissage

- **Meta** : environ 50 événements d'optimisation sur 7 jours glissants par ensemble d'annonces ([tiers](https://adlibrary.com/posts/meta-ads-learning-phase-50-events-guide) ; la page d'aide Meta n'était pas lisible par l'outil).
- **TikTok** : la performance se stabilise "after about 25 campaign results or 7 days". Ne pas mettre en pause ni modifier pendant cette phase ([officiel](https://ads.tiktok.com/help/article/learning-phase)).
- **Budget nécessaire** : 50 achats par semaine à 20-35 € représentent 1 000 à 1 750 € par semaine, hors de portée au lancement.
- **Recommandation** :
  - Meta : optimiser sur Purchase dès le départ, en acceptant un apprentissage limité.
  - TikTok : optimiser sur InitiateCheckout au démarrage.
  - Changer d'événement plus tard relance l'apprentissage ([tiers](https://metricfixer.com/publications/online-advertising/meta-ads-learning-phase-low-volume-limited-time-campaigns)).

### 5.3 Meta (Advantage+ par défaut)

- **Réglages par défaut** : les campagnes Ventes sont Advantage+ par défaut depuis 2025, avec audience, placements et budget automatisés ([PPC Land](https://ppc.land/meta-launches-unified-api-structure-for-advantage-campaigns/)). Meta annonce +22 % de ROAS avec son ciblage piloté par IA ([Meta Engineering](https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/)).
- **Diversité créative** : Andromeda, le moteur qui choisit quelles pubs montrer, favoriserait les créas réellement différentes et regrouperait les quasi-doublons ([Social Media Examiner](https://www.socialmediaexaminer.com/facebook-ad-algorithm-changes-for-2026-what-marketers-need-to-know/)).
- **"Score de similarité"** : des tiers citent des seuils de 60 % et 40 % ([Common Thread](https://commonthreadco.com/blogs/coachs-corner/metas-new-creative-diversity-score-is-live-in-ads-manager-what-ecommerce-brands-must-act-on-now)). Non confirmé par Meta.
- **Plan jour 1 à 14** :
  - 1 campagne Ventes, 1 ensemble d'annonces France métropolitaine.
  - 30-40 € par jour, plus 3 % de frais France.
  - Aucune modification importante pendant 14 jours.
- **6 à 8 concepts vraiment différents** :
  1. Motion design centré sur le "tap".
  2. La même démo filmée au téléphone, style UGC.
  3. Le fondateur face caméra, à Nîmes.
  4. Un visuel fixe "offre d'abord".
  5. Un carrousel par métier.
  6. Un texte seul adressé au commerçant.
  7. Une démo QR pour les téléphones sans NFC.
  8. Une version multi-sites (3 ou 5 présentoirs).
- **Tester les hooks avec l'outil "Creative Testing" d'Ads Manager** [tiers : [Jon Loomer](https://www.jonloomer.com/meta-creative-testing/), [admanage](https://admanage.ai/blog/facebook-ad-creative-testing-framework)] :
  - 2 à 5 pubs, budget réparti à parts égales, chaque personne ne voit qu'une version.
  - Jusqu'à 30 jours, stratégie d'enchère "Highest volume" obligatoire (outil déployé vers le 13/10/2025).
- **Renouvellement** : pour un petit compte, nouvelles créas environ une fois par mois.

### 5.4 TikTok (manuel d'abord)

- **Minimums** ([officiel](https://ads.tiktok.com/help/article/budget?lang=en)) : plus de 20 $ par jour par groupe d'annonces ; plus de 50 $ par jour si le budget est fixé au niveau campagne.
- **Réglages recommandés par TikTok** ([officiel](https://ads.tiktok.com/help/article/budget-best-practices?lang=en)) :
  - Laisser le budget de campagne ouvert.
  - Budget : 50 fois le CPA (ou 100 $) pour un objectif de conversion simple, 10 fois le CPA (ou 200 $) pour un objectif de conversion plus loin dans le tunnel.
  - Attendre 2 jours entre deux changements.
  - Pendant l'apprentissage, pas plus de +40 % de budget à la fois.
- **Smart+ Web**, la campagne automatisée de TikTok ([officiel](https://ads.tiktok.com/help/article/best-practices-for-smart-plus-web-campaigns), [MAJ](https://ads.tiktok.com/help/article/about-updates-to-smart-plus?lang=en)) :
  - Au moins 6 créas.
  - Budget quotidien de **30 fois le CPA historique, au minimum 10 fois**.
  - Au moins 7 jours, sans modification la première semaine.
  - Jusqu'à 50 créas par annonce.
  - Sans historique de CPA, **ce n'est pas adapté au lancement**.
- **Plan de lancement** :
  - 1 campagne conversions web.
  - 1 à 2 groupes d'annonces à 20-30 $ par jour, 3 à 5 créas par groupe.
  - Passer en Spark Ads (vidéo organique promue) dès qu'une vidéo organique fonctionne.

### 5.5 Itération hooks puis corps

1. **Un corps fixe et 3 à 5 hooks** :
   - Question : "Vos clients contents laissent-ils un avis ?"
   - Promesse : "Votre page d'avis s'ouvre en un geste"
   - Nouveauté : "Nouveau : le présentoir d'avis sans appli"
   - Prix : "29,90 €. Une fois. Sans abonnement."
   - Démo pure, sans texte ou presque.
2. **Garder le meilleur hook, puis tester 2 ou 3 corps** : démo par métier, Espace Reviu, garantie 30 jours.
3. **Décliner le gagnant en formats différents** (UGC, fondateur, visuel fixe) plutôt qu'en variantes de couleur.

---

## 6. Ciblage des commerçants en France

- **Taille des audiences** (adultes, octobre 2025, [DataReportal](https://datareportal.com/reports/digital-2026-france)) :
  - Facebook : 31,5 M (58,7 %).
  - Instagram : 28,2 M (53,7 %).
  - TikTok : 23,4 M (43,9 %).
- **Zone de livraison** : France métropolitaine uniquement (`/home/user/reviu/src/app/(legal)/cgv/page.tsx`). Exclure les DROM (départements et régions d'outre-mer) s'ils sont inclus par défaut.
- **Évolution du ciblage Meta** ([Social Media Today](https://www.socialmediatoday.com/news/meta-removes-more-detailed-ad-targeting-options-facebook-instagram/757856/)) :
  - Centres d'intérêt regroupés en 2025.
  - Les ensembles utilisant des intérêts supprimés ont cessé de diffuser le 15/01/2026.
  - Exclusions de ciblage détaillé supprimées ; Meta avance -22,6 % de coût médian par conversion.
  - Avec l'audience Advantage+, les critères détaillés ne sont plus que des suggestions.
- **Suggestions Meta à essayer** (disponibilité à vérifier dans Ads Manager) : "Administrateurs de Page Facebook" et ses sous-catégories, par exemple les administrateurs de pages de restauration, ainsi que les intérêts petites entreprises / entrepreneuriat ([leadsync](https://leadsync.me/blog/facebook-ads-targeting-guide/)) [non vérifié].
- **Audiences propriétaires, plus fiables** :
  - Visiteurs du site.
  - Utilisateurs de l'outil QR gratuit (événement `qr_download`, à envoyer aussi à Meta et TikTok).
  - Personnes ayant vu au moins 50 % d'une vidéo.
  - Exclusion des acheteurs.
  - Audiences similaires (lookalikes) à partir d'environ 100 acheteurs [heuristique].
- **La créa fait le ciblage** : nommer les métiers et montrer de vrais comptoirs. Ciblage large sur la France entière ([Social Media Examiner](https://www.socialmediaexaminer.com/facebook-ad-algorithm-changes-for-2026-what-marketers-need-to-know/)).
- **UE** : depuis janvier 2026, les utilisateurs doivent choisir entre publicité personnalisée et "moins personnalisée", ce qui réduit le signal disponible ([PPC Land](https://ppc.land/metas-2026-dma-report-reveals-whatsapp-ads-a-eu200m-fine-and-a-defiant-stance-on-personalized-advertising/)) [tiers].
- **TikTok** :
  - Ciblage manuel par lieu, langue, âge, intérêts, audiences personnalisées et similaires.
  - Smart+ Web ne garde que lieu, langue, exclusions et un ciblage par genre limité ([officiel](https://ads.tiktok.com/help/article/about-smart-plus-web-campaigns)).
  - Proposition : un groupe large France 25-65 ans et un groupe intérêts business ([benly](https://benly.ai/learn/tiktok-ads/tiktok-ads-b2b-marketing)) [tiers], avec les mêmes créas.

---

## 7. Textes d'annonce

### 7.1 Limites de caractères

| Champ | Limite |
|---|---|
| Meta, texte principal (Feed, Stories) | 125 caractères visibles ; Facebook Feed recommande 50-150 [officiel] |
| Meta, texte principal Instagram Reels | "44 caractères" sur la page Meta [officiel] ; 72 selon des tiers pour les objectifs Trafic et Ventes ([firstpier](https://www.firstpier.com/resources/instagram-ad-text-limit)) |
| Meta, titre | 27 caractères (Feed) [officiel] |
| Meta, bouton | Liste fixe selon l'objectif ("Acheter", "Commander", "En savoir plus"...) ; libellés français à vérifier ([coinis](https://coinis.com/how-to/pick-facebook-ad-cta-button)) |
| TikTok, texte d'annonce | 100 caractères recommandés, 4 lignes, emojis compris ; pas de lien, @ ni hashtag cliquable ; aucune faute [officiel] |
| TikTok, nom affiché | 20 caractères, cohérent avec la page d'arrivée [officiel] |

### 7.2 Exemples (caractères comptés, espaces compris)

- **Meta, texte principal (123)** : `Vos clients sont contents mais oublient de laisser un avis ? Un geste du téléphone sur le présentoir et votre page s'ouvre.`
- **Meta, variante offre (115)** : `Présentoir NFC + QR pour avis Google. 29,90 €, livraison offerte, sans abonnement, satisfait ou remboursé 30 jours.`
- **Meta, titres** :
  - `29,90 €, sans abonnement` (24)
  - `Présentoir avis : 29,90 €` (25)
  - `Livraison offerte, sans abonnement` (34)
- **Instagram Reels (39)** : `Un geste, et votre page d'avis s'ouvre.`
- **TikTok (95)** : `Le client approche son téléphone, votre page d'avis s'ouvre. 29,90 €, sans abonnement ni appli.`
- **TikTok, variante métiers (98)** : `Restaurant, coiffeur, garage : un geste du téléphone et votre page d'avis Google s'ouvre. 29,90 €.`
- **Nom affiché** : `Reviu`

Règles :
- Écrire "avis Google" en texte simple est une référence descriptive admise par Google ([Google](https://about.google/brand-resource-center/guidance/)).
- À bannir : "officiel", "partenaire", "certifié", "note Google".
- Compatibilité : écrire "tous les smartphones (NFC ou QR code)" plutôt que "tous les iPhone". La lecture NFC sur iPhone dépend du modèle [non vérifié ici].

---

## 8. Pièges de conformité

### 8.1 Marque et logo Google (risque principal)

- **Google** ([Brand Resource Center](https://about.google/brand-resource-center/guidance/), [logos](https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/), [avis](https://partnermarketinghub.withgoogle.com/brands/google/use-cases/customer-reviews/)) :
  - Pas d'utilisation qui laisse croire à une affiliation ou un soutien de Google.
  - Pas d'imitation de l'identité visuelle Google.
  - Ne pas modifier le "G", ni sa couleur.
  - "Don't use the Google G in marketing materials for a business" sans accord de co-branding.
  - "Don't add stars by the Google name or logos".
  - Reprendre un avis client dans une pub exige le consentement de son auteur.
- **TikTok** : "We do not allow the use of third-party brands without authorization" ([officiel](https://ads.tiktok.com/help/article/tiktok-ads-policy-intellectual-property-infringement)). La règle vaut pour la pub et pour la page d'arrivée ([checklist](https://ads.tiktok.com/help/article/ad-review-checklist?lang=en)).
- **Meta** :
  - Les atteintes aux marques de tiers peuvent entraîner un retrait sur signalement ([officiel](https://transparency.meta.com/policies/ad-standards/intellectual-property-infringement/third-party-infringement/)).
  - Les "unauthorized endorsements" sont interdits ([officiel](https://transparency.meta.com/policies/ad-standards/deceptive-content/prohibited-commercial-practices/)).
- **Conséquence** : le "G" imprimé sur le présentoir est en lui-même un risque de marque, à faire valider juridiquement (ce rapport n'est pas un avis juridique).
- **Dans la vidéo** :
  - Montrer le produit tel quel, sans que le G devienne l'élément dominant ni fasse l'objet d'un gros plan.
  - Page d'avis stylisée et générique, pas une copie de Google Maps.
  - Mention d'indépendance vis-à-vis de Google à la fin.
  - Prévoir une variante cadrée côté NFC/QR, au cas où une plateforme refuserait la pub.

### 8.2 Règles d'avis Google Maps

Google interdit ([Google](https://support.google.com/contributionpolicy/answer/7400114?hl=en), [MAJ 17/04/2026](https://ppc.land/google-tightens-maps-review-policy-staff-names-and-quotas-now-banned/)) :
- toute contrepartie en échange d'un avis ;
- de solliciter seulement les avis positifs, ou de décourager les négatifs ;
- d'exiger un avis ou de faire pression sur place ;
- d'imposer des quotas d'avis au personnel, ou de demander qu'un employé soit cité.

Solliciter des avis authentiques sans contrepartie reste permis, y compris par QR code.

- **À bannir du script** : "un café offert pour un avis", "que des 5 étoiles", un serveur qui insiste au comptoir.
- **Formulations sûres** : "invitez vos clients", "le client reste libre".

### 8.3 Promesses, "avant/après", témoignages

- **TikTok** ([officiel](https://ads.tiktok.com/help/article/tiktok-ads-policy-misleading-and-false-content)) interdit :
  - de promettre ou d'exagérer des résultats ;
  - les termes absolus ;
  - toute incohérence entre la pub et la page d'arrivée.

  L'avant/après est encadré, et les contenus générés par IA doivent être étiquetés.
- **France** : diffuser de faux avis est une pratique commerciale trompeuse (article L.121-4 du Code de la consommation). Sanction : jusqu'à 2 ans et 300 000 €, ou 10 % du chiffre d'affaires ([Dreyfus](https://www.dreyfus.fr/en/2025/06/30/fake-online-reviews-france-strengthens-legal-oversight/)) [tiers ; page DGCCRF bloquée (403)].
- **Pour Reviu** :
  - Aucun résultat chiffré sans la mention "Simulation".
  - Aucun faux témoin présenté comme un vrai client ; un acteur doit être signalé comme "mise en scène".
  - Garantie, livraison et "sans abonnement" doivent correspondre aux CGV.

### 8.4 Attributs personnels (Meta)

Meta interdit d'affirmer ou de sous-entendre un attribut personnel, dont une "situation financière vulnérable" ou une connaissance d'"organizational financial information" ([officiel](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/)).
- "Vous êtes restaurateur ?" (le métier) est acceptable.
- À éviter : "Votre commerce perd de l'argent ?".

### 8.5 TikTok : fausse interface, gestes et QR codes

- Interdits : faux boutons, "Swipe up", curseur de souris ([officiel](https://ads.tiktok.com/resources/help/article/tiktok-ads-policy-ad-format-and-functionality)).
- QR codes : la **France est dans la liste des marchés concernés**.
  - Exceptions citées : QR imprimé sur l'emballage ou le produit, et codes non scannables.
  - La page ne dit pas clairement s'il s'agit d'une interdiction générale ou limitée aux QR menant vers des sites tiers. Par prudence : QR non scannable.
- Page d'arrivée e-commerce exigée : coordonnées, raison sociale, prix en euros, livraison et retours, CGV, politique de confidentialité, compatibilité mobile.

### 8.6 Musique, IA, clignotements

- **Musique** :
  - Meta exige que les droits de la musique soient acquis ([officiel](https://transparency.meta.com/policies/ad-standards/intellectual-property-infringement/third-party-infringement/)).
  - La bibliothèque musicale commerciale de TikTok ne couvre que TikTok ([CML](https://ads.tiktok.com/help/article/commercial-music-library)).
  - La Meta Sound Collection ne couvre que Facebook et Instagram ([MBW](https://www.musicbusinessworldwide.com/meta-offers-royalty-free-music-library-to-instagram-reels-advertisers/)).
  - Pour un master unique : une licence "publicité payante toutes plateformes", ou une création sonore originale.
- **IA** : étiquette obligatoire sur TikTok si visages, voix ou scènes réalistes sont générés.
- **Clignotements** : interdits sur Meta.

### 8.7 Droit français de la publicité

- **Loi Toubon et ARPP** : le français est obligatoire ([ARPP](https://www.arpp.org/nous-consulter/regles/fiches-de-doctrine/fiche-de-doctrine-langue-francaise/)).
  - Tout terme étranger doit être traduit de façon aussi lisible, avec une taille comparable.
  - À l'écrit, la traduction doit être écrite ; à l'oral, elle peut être orale.
  - Éviter "Boost", "Tap", "Reviews".
  - Doubler "NFC" par "sans contact".
- **Influence commerciale (loi n° 2023-451)** : avec un créateur rémunéré, la mention "Publicité" ou "Collaboration commerciale" doit rester visible pendant toute la vidéo ([Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047663185)).

---

## 9. Limites de cette recherche

- **Pages non lues directement** (site bloqué (403), page en JavaScript ou PDF illisible) : aide Meta sur l'apprentissage et le Creative Testing, Triple Whale, Jon Loomer, DGCCRF, PDF TikTok "Creative Tips" et "B2B Playbook".
- **Safe zone TikTok** : aucune valeur officielle en pixels ; celles de la section 2.2 viennent de tiers.
- **Facebook Reels** : page de specs Meta en 404 au moment de la consultation.
- **Ancienneté des études** : plusieurs études TikTok et Meta datent de 2015 à 2022. Elles donnent une direction, pas une garantie.
- **Benchmarks** : essentiellement américains ; pour la France, seuls des CPM sont disponibles.
- **Libellés** : les noms exacts des boutons et des catégories de ciblage en français restent à vérifier dans les interfaces.