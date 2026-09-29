# Fiche faits Reviu pour l'équipe publicité vidéo (angle : connaissance interne)

**Sources** : dépôt `/home/user/reviu` (dernier commit `e51e54b`, 29/09/2026) et site public vérifié le 29/09/2026 sur https://reviu.fr/ et https://reviu.fr/presentoir-avis-google. Le contenu en ligne est conforme au code : H1, prix, paliers, réassurances, photos clients, mention Google. Les références `fichier:ligne` renvoient au dépôt. **[NON VÉRIFIÉ]** signale une affirmation interne sans source externe. **[QUESTION OUVERTE]** signale un point à trancher avant le tournage ou la diffusion.

---

## 1. Le produit

### 1.1 Nom et définition
- **Nom commercial unique** : « Présentoir Reviu » (`src/lib/brand.ts:18`).
  - Descripteur SEO : « présentoir avis Google ».
  - Descriptif long : « Présentoir avis Google, sans contact et QR code ».
- **Définition officielle** (hero de l'accueil, `src/app/boutique/page.tsx:143`, identique en ligne) : « Le présentoir Reviu : vos clients approchent leur téléphone ou scannent le QR code, et votre page d'avis Google s'ouvre instantanément. Sans application, sans abonnement. »
- **Signature de marque** (`brand.ts:3`, charte p. 02) : « Plus d'avis Google, directement depuis votre comptoir. »
- **Mission** (charte) : « Donner à chaque commerce de proximité un moyen simple de transformer ses clients satisfaits en avis Google. »
- **Promesse** (charte) : « Un présentoir posé sur le comptoir, un geste du client, et les avis arrivent. Sans application, sans abonnement. »

### 1.2 L'objet physique (photo produit exacte)
**Photo de référence fournie** : `ads/video/assets-src/presentoir-face.webp` (1254 x 1254).
- Elle est quasi identique à `public/products/presentoir.webp` et à `brand/photos/presentoir.jpg` (écart moyen inférieur à 1 niveau sur 255).
- Elle est déjà détourée avec un masque vectoriel (`ads/video/scripts/cutout.py`) :
  - `ads/video/public/img/presentoir-face.png` (852 x 904) ;
  - `presentoir-face-2x.png` (1704 x 1808).

**Description de la face :**
- **Forme** : carré à peine plus haut que large (ratio 852/904 = 0,94). Angles très arrondis : rayon mesuré de 95 px pour 850 px de large, soit environ 11 % du côté.
- **Moitié haute bleue** : logo Google « G » multicolore dans une pastille blanche ronde. En dessous, en capitales blanches : « **LAISSEZ-NOUS** VOTRE AVIS SUR **GOOGLE** » (« votre avis sur » en graisse légère).
- **Séparation en vague**, avec un liseré bleu clair entre le bleu et le blanc.
- **Moitié basse blanche** :
  - à gauche, « **COLLEZ** VOTRE TÉLÉPHONE » (texte en arc) au-dessus d'un pictogramme main et téléphone marqué « NFC », posé contre un cercle à ondes sans contact ;
  - à droite, « OU » / « **SCANNEZ-MOI** » au-dessus d'un QR code, dans un carré gris très clair arrondi ;
  - en bas au centre, « propulsé par **Reviu.fr** ».

**Couleurs mesurées sur la photo** (lumière studio, valeurs indicatives) :

| Zone | Couleur |
|---|---|
| Bleu du produit | environ `#014AD0` (de `#0045CD` à `#0148D2`) |
| Liseré de la vague | `#D7E0F4` |
| Blanc éclairé | `#F0EFF2` |
| Texte | `#2D2D2F` |
| Fond studio | de `#BEBDC2` à `#E8E7EC` |

- **Le bleu du produit n'est pas le Cobalt Reviu `#1B4DFF`.** Ne jamais recolorer la photo ; réserver le cobalt aux éléments de marque autour.

**Autres présentations visibles dans les visuels existants :**
- bloc acrylique transparent épais, tranche visible (`etape-1`, `etape-2`) ;
- debout sur un petit pied transparent (`etape-3`) ;
- à plat sur un comptoir ou une table, et debout sur une étagère (photos clients dans `public/installations/`).

**Code secret d'activation** : il est « imprimé à côté du QR code, sur le présentoir » (`src/app/presentoir-avis-google/page.tsx:63`).
- Il n'apparaît pas sur les photos studio.
- Sur les photos clients, le QR et le code sont floutés exprès (`src/lib/installations.ts`).
- Ne jamais montrer un QR ou un code actif appartenant à un client.

### 1.3 Ce qui se passe au geste (fonctionnement réel)
1. Le client approche son téléphone, « comme pour payer sans contact », ou scanne le QR code. Aucune application, ni pour le client ni pour le commerçant.
2. La puce NFC et le QR code pointent vers une adresse permanente `r.reviu.fr/<code>`. Un paramètre `?s=nfc` ou `?s=qr` sert à compter le canal (`src/app/r/[code]/page.tsx` ; page `/demo` : « Un objet, deux technologies, un lien permanent. »).
3. **Mode par défaut « Accès direct »** : la vue et le clic sont enregistrés en arrière-plan, puis le client est **redirigé immédiatement** vers le lien d'avis Google du commerce. Texte du site : « Directement sur la fenêtre de notation de votre fiche : plus besoin de vous chercher sur Google. » (`src/app/boutique/scan-demo.tsx:9`).
4. **Mode optionnel « Page reviu »** (réglage du commerçant) : une page intermédiaire s'affiche avec :
   - le logo ou les initiales et le nom du commerce ;
   - « Comment s'est passée votre visite ? » et 5 étoiles ;
   - le bouton « Laisser un avis sur Google », proposé à tous ;
   - un lien facultatif « J'ai rencontré un souci » ;
   - « Propulsé par reviu ».
5. Le client note et publie **dans l'interface de Google**, pas dans Reviu. Le site recrée cet écran en maquette générique (voir §9).

### 1.4 Compatibilité (textes validés)
- « Le QR code fonctionne sur tous les smartphones. La lecture sans contact (NFC) est prise en charge sans application par les iPhone récents (XS et plus) et la grande majorité des Android équipés du NFC. » (FAQ de l'accueil, `boutique/page.tsx:90`).
- Limite : « Évitez de le poser directement sur une surface métallique, qui peut gêner la lecture NFC. » (FAQ de la fiche produit).
- Formules courtes : « Compatible iPhone et Android », « Aucune application à télécharger », « iPhone et Android ».

### 1.5 Activation (étapes, écrans, durée)
**Livré prêt** : « Vous recevez le présentoir déjà encodé (NFC et QR prêts), rien à configurer côté matériel. » (`src/lib/guides.ts`, guide `presentoir-plaque-nfc-avis-google`).

**Trois étapes publiques** (fiche produit, `presentoir-avis-google/page.tsx:76`, section « Prêt en 2 minutes, sans technicien. ») :
1. « Scannez le QR code » : « À réception, scannez le QR code imprimé sur le présentoir. »
2. « Reliez votre fiche Google » : « Entrez le code secret situé à côté du QR code, puis collez le lien de votre fiche Google. »
3. « Posez-le au comptoir » : « C'est prêt. Invitez simplement vos clients à partager leur expérience. »

**Écran réel d'activation** (`src/app/r/[code]/activate-flow.tsx`) :
- En-tête : logo, « Configurez votre présentoir », « Reliez ce présentoir à votre commerce en une minute. »
- Champs :
  - « Nom du commerce » (exemple : « Le Comptoir de Camille ») ;
  - « Lien de votre page d'avis Google » (« https://g.page/r/… ») ;
  - « Votre e-mail » ;
  - « Secret d'activation » (« ABCD1234 »).
- Bouton : « Activer mon présentoir ».
- Écran de confirmation : pastille verte cochée, « Présentoir activé ! », « Votre présentoir redirige déjà vos clients. », adresse `r.reviu.fr/<code>`, bouton « Accéder à mon espace ».

**Durée à annoncer : « 2 minutes ».** On la trouve dans le H2 de la fiche produit, dans le titre Google Ads « Prêt en 2 minutes » et dans le guide (« de la boîte au comptoir en 2 minutes »). L'écran d'activation dit « en une minute » : incohérence mineure, garder « 2 minutes ».

**Sécurité** : « Le code secret est un mécanisme de sécurité : il garantit que vous seul pouvez relier ce présentoir à votre établissement. »

### 1.6 Caractéristiques connues et inconnues
**Connues** (tableau en ligne, `presentoir-avis-google/page.tsx:63`) :
- « Puce NFC (sans contact) et QR code, prêts à l'emploi » ;
- QR code : « En façade du présentoir » ;
- puce : « Intégrée au présentoir, zone de contact indiquée » ;
- code secret : « Imprimé à côté du QR code » ;
- « À poser (autoportant), sans fixation ni perçage » ;
- « Préférez une surface non métallique, ou utilisez le QR code » ;
- entretien : « chiffon doux, sans produit abrasif ».

**Inconnues [QUESTION OUVERTE]** :
- Dimensions, épaisseur, matériau et poids ne sont pas renseignés : les constantes `SPEC_*` sont vides, avec le commentaire « jamais d'info inventée ».
- Le mot « acrylique » n'apparaît nulle part dans le dépôt : ne pas l'utiliser à l'écran tant qu'il n'est pas confirmé.
- On ignore si le pied transparent visible sur `etape-3` est fourni.

---

## 2. L'offre

| Élément | Valeur exacte | Source |
|---|---|---|
| Prix | **29,90 €** l'unité, achat unique | `shop.ts:133`, `brand.ts:24` |
| Tarif dégressif | **27 € l'unité dès 3**, **25 € l'unité dès 5**, remise automatique (économie de 2,90 € et de 4,90 € par unité) | `shop.ts:133`, FAQ de la fiche produit, en ligne |
| Quantité maximale en ligne | 20 (au-delà : page revendeur) | `shop.ts:140` |
| Livraison | **Offerte dès 1 présentoir**, France métropolitaine, **3 à 5 jours ouvrés** | `brand.ts:71`, CGV §3 |
| Garantie | **« Satisfait ou remboursé 30 jours »** : « Essayez le présentoir pendant 30 jours. S'il ne vous convient pas, renvoyez-le : on vous rembourse le prix du présentoir, sans justification. » Frais de retour à la charge du client. S'ajoute à la rétractation de 14 jours et à la garantie légale de conformité de 2 ans | `brand.ts:43`, CGV §4 et §5 |
| Abonnement | Aucun : « 0 € d'abonnement » | charte p. 03 |
| Paiement | Carte bancaire via Stripe intégré : « Paiement sécurisé, directement sur reviu.fr. Aucune redirection. » Facture automatique | `boutique/commander/page.tsx:85` |
| Code promo | Champ actif côté Stripe (`allow_promotion_codes: true`), **aucun code défini** | `src/lib/stripe-checkout.ts:90` |
| TVA | Le site affiche « 29,90 € TTC ». L'éditeur est en franchise de TVA (« TVA non applicable, article 293 B du CGI ») : 29,90 € est le prix final payé | mentions légales |

**Chiffres clés prêts à l'emploi** (charte p. 03) : « 29,90 € achat unique · 0 € d'abonnement · 30 jours satisfait ou remboursé · 1 geste sans contact ou QR code ».

**OBSOLÈTE, ne jamais utiliser** (sections historiques de `docs/HANDOFF.md`) :
- l'abonnement à 2,99 €/mois ;
- « Reviu Pro » ;
- « livraison offerte dès 50 € » et les frais de port de 3,90 €.

La page privée `/formation` parle encore de 2,99 €/mois : elle est hors du périmètre de la pub.

---

## 3. Espace Reviu inclus
- **Libellés** : « Espace Reviu inclus », « sans abonnement, dès l'activation », « Votre présentoir, piloté depuis votre espace. »
- **Trois fonctionnalités officielles** (`brand.ts:56`) :
  1. « Statistiques de scans, sans contact et QR code distingués »
  2. « Gestion de vos présentoirs »
  3. « Modification de votre lien de redirection à tout moment »
- **Bénéfice** : « Le présentoir garde toujours la même adresse (QR et NFC) : vous changez seulement sa destination, sans rien réimprimer. »
- **Fonctions présentes dans le tableau de bord mais absentes du discours public** : le choix du comportement au scan (direct ou page) et un canal de retour privé optionnel avec alerte e-mail.
  - **Ne pas les mettre en avant en pub** : risque de lecture « filtrage des avis négatifs » (review gating), exclu par la charte et par la ligne de conformité (`docs/HANDOFF.md`, section « Conformité Google »).
- **Attention au vocabulaire** : `INCLUDED_SPACE.tagline` (« Inclus avec votre plaque ») et les écrans du tableau de bord emploient encore « plaque ». Ne pas les filmer ni les copier tels quels.

---

## 4. Cibles
- **9 métiers officiels** (accueil `boutique/page.tsx:68`, post 5 « Pensé pour tous les comptoirs. ») : restaurant, salon de coiffure, garage, boulangerie, institut de beauté, hôtel, boutique, cabinet dentaire, salle de sport. S'y ajoute la pastille « Et le vôtre ». Chaque métier a un guide `/guides/avis-google-<métier>`.
- **Moments d'usage** (fiche produit, section « Au comptoir, au bon moment. ») :
  - Restaurants et cafés : « Près de l'encaissement, au moment où le repas vient de se terminer. »
  - Salons et instituts : « À l'accueil, pour prolonger la relation juste après la prestation. »
  - Garages automobiles : « À la remise des clés, quand la satisfaction du client est au plus haut. »
- **Où le poser** : « Là où le client attend quelques secondes à la fin de sa visite : près de la caisse, à l'accueil, sur le comptoir. »
- **Métiers prévus en contenu** : pharmacie, fleuriste, opticien, auto-école (`docs/PLAN-VENTES.md` §4).
- **Hors pub grand public** : le programme revendeur (B2B, « sur sélection »).
- **Géographie** : France. Siège à Nîmes, avec prospection terrain à Nîmes et alentours (`PLAN-VENTES.md` §2).

---

## 5. Différenciateurs déjà validés (avec la phrase du site)
1. **Un geste, sans application** : « Le présentoir supprime tout ce qui fait renoncer un client satisfait : chercher votre fiche, trouver le bouton, remettre à plus tard. »
2. **Sans contact et QR code** : « Le NFC pour la rapidité (approcher le téléphone), le QR pour l'universalité (n'importe quel appareil photo). Le client choisit, vous ne perdez personne. » (guide). En pub, dire « sans contact », pas « NFC ».
3. **Lien modifiable, objet permanent** : l'opposé de la « carte NFC morte » dont le lien est figé (guide). « L'objet reste, la destination s'ajuste. »
4. **Statistiques incluses**, sans contact et QR code distingués.
5. **Achat unique et rentabilité** : « 29,90 €, une seule fois. Un seul nouveau client qui vous choisit grâce à vos avis, et le présentoir est rentabilisé. » (`boutique/page.tsx:317`)
6. **Zéro risque** : livraison offerte dès 1 présentoir, satisfait ou remboursé 30 jours.
7. **Conforme aux règles de Google** : « Reviu ne filtre pas les clients selon leur satisfaction : tous peuvent accéder à votre page d'avis Google, de la même manière. C'est la règle de Google, et c'est aussi ce qui rend vos avis crédibles. »
8. **Entreprise française, support humain** : « Entreprise française. Un support humain, qui répond vraiment. » (`boutique/page.tsx:373`), avec le téléphone affiché.
9. **Comparatif honnête** (tableau de l'accueil `boutique/page.tsx:81`, post 3) :

| Critère | À l'oral | QR code imprimé | Reviu |
|---|---|---|---|
| Le client trouve votre fiche sans chercher | non | oui | oui |
| Il suffit d'approcher le téléphone | non | non | oui |
| Visible en permanence au comptoir | non | selon le support | oui |
| Lien modifiable sans rien réimprimer | non | non | oui |
| Statistiques de scans | non | non | oui |
| Coût | Gratuit | Gratuit | « 29,90 € une fois » |

**Concurrence citée en interne** : « Amazon et Etsy vendent déjà ce type de présentoir (concurrents à 24,99-29,99 €) » (`PLAN-VENTES.md` §2.5) **[NON VÉRIFIÉ, aucune source]**. Conséquence : pas d'argument « moins cher ». Se battre sur le lien modifiable, les statistiques incluses, la garantie et le support français.

---

## 6. Identité de marque

### 6.1 Couleurs (`brand/README.md`, charte p. 08)
| Nom | HEX | Usage |
|---|---|---|
| Cobalt Reviu | `#1B4DFF` | Couleur de marque (RVB 27 77 255) |
| Encre | `#0A0D16` | Textes, fonds sombres |
| Or des avis | `#FBBC04` | Accent : point final, étoiles |
| Blanc | `#FFFFFF` | Fonds, respiration |
| Cobalt profond | `#1139C9` | Survol, profondeur |
| Brume | `#EDF1FF` | Fonds clairs de marque |
| Perle | `#F5F6F8` | Fonds neutres |
| Ardoise | `#6B7382` | Textes secondaires |

- **Répartition conseillée** : blanc, brume et perle 50 % ; cobalt 28 % ; encre 17 % ; or 5 %.
- **Couleurs complémentaires du site** (`src/app/globals.css`) :
  - encre douce `#333A49` ;
  - filet `#E6E8EF` et filet clair `#EEF0F5` ;
  - or clair `#FFF5D6` ;
  - dégradé toléré : `linear-gradient(120deg, #1B4DFF 0%, #1139C9 100%)` ;
  - bleu Google des maquettes : `#1A73E8` (bouton « Publier »).
- **Interdits** : violet, fonds violets, dégradés marqués, effet verre dépoli (glassmorphism), filtres saturés. Sources : charte p. 12 et en-tête de `globals.css` (« pas de dégradés, pas de glassmorphism, pas de violet »).

### 6.2 Typographie
- **Police d'identité** : Plus Jakarta Sans (logo, site, print).
  - Sur le site, les titres sont en Plus Jakarta Sans **SemiBold 600**, interlettrage serré (`tracking-tight`), interligne de 1,03 à 1,06.
  - Le texte d'interface est en Geist, les badges chiffrés en Geist Mono.
- **Réseaux sociaux** (charte p. 09, gabarits Canva) : tout en **Inter**.

| Rôle | Graisse | Réglage |
|---|---|---|
| Titre | ExtraBold 800 | interlettrage -3 % |
| Sous-titre | Bold 700 | interlettrage -2 % |
| Texte | Medium 500 | interligne 1,4 |
| Étiquettes et boutons | SemiBold 600 | |

- **Projet vidéo** : Plus Jakarta Sans et Inter en versions variables (graisses 200 à 800) sont déjà embarquées hors ligne (`ads/video/public/fonts/`, `ads/video/src/fonts.ts`).
- **[QUESTION OUVERTE]** Titres vidéo en Inter 800 (cohérence avec les posts et stories existants) ou en Plus Jakarta Sans 800 (police d'identité) : choisir une seule famille pour les titres.

### 6.3 Signature des titres (charte p. 10)
1. Le **dernier mot** du titre passe en **cobalt**.
2. Le **point final est doré** `#FBBC04` : « c'est la signature Reviu ». Les aperçus montrent aussi le « ? » final en or (« Comment ça marche ? »).
3. **Aucun sur-titre** au-dessus du titre.
4. Des phrases courtes, lisibles d'un coup d'œil.
5. Pas de tiret long : un tiret simple ou deux-points.

- **Sur fond cobalt ou sombre** : titre en blanc, **seul le point reste doré**.
- **Exemples de la charte** : « Vos avis Google, enfin au **comptoir**. » ; « Google ne le sait pas **encore**. »
- **Règle du point doré** : « Une seule fois par visuel, jamais en décoration. »
- **Écart à connaître** : sur le site, `accentLastWord()` (`src/components/ui/accent.tsx`) laisse la ponctuation en couleur encre. Pour la vidéo, suivre la charte (point doré), comme les posts et les stories.

### 6.4 Logo
- **Monogramme** : « r » blanc dans un carré cobalt aux angles arrondis (rayon 13/40, soit 32,5 %). Utilisé seul (icône, favicon, avatar), il porte le point doré en haut à droite.
- **Wordmark** « reviu » : toujours en minuscules, Plus Jakarta Sans Bold vectorisé, en encre `#0A0D16` ou en blanc. Le point du i est doré : « C'est la seule touche d'or du logo, elle ne se retire pas. »
- **Déclinaisons** : principale sur blanc ou fond clair, sur cobalt, sur fond sombre, monochrome noir, monochrome blanc (sur photo, dans une zone calme), verticale (formats carrés et étroits).
- **Zone de protection** : x = la moitié de la hauteur du monogramme.
- **Tailles minimales à l'écran** : 24 px de haut pour le logo horizontal, 16 px pour le monogramme.
- **Interdits** (charte p. 07, pictogrammes `brand/icons/interdit-*.svg`) :
  - déformer ou étirer ;
  - changer les couleurs ;
  - **incliner** : donc pas de rotation ni de basculement 3D du logo en motion design ;
  - ajouter un contour ou un effet ;
  - recomposer les éléments ;
  - poser le logo sur un fond peu contrasté.
- **Placement sur les réseaux** : logo en haut à gauche, « reviu.fr » en haut à droite.
- **Casse** : logo et marque en minuscules (« reviu ») ; dans les phrases, « Présentoir Reviu » et « Espace Reviu » prennent une majuscule.

### 6.5 Éléments graphiques (charte p. 11)
- **Cinq étoiles** : réservées à l'univers de l'avis, **toujours en or**.
- **Angles arrondis partout** : 32 % du côté pour les pictogrammes, 40 à 48 px pour les cartes et les photos.
- **Pictogrammes** blancs dans un carré cobalt. **Réassurances** en pastilles blanches avec coche cobalt.
- **Motifs animés du site** : ondes sans contact concentriques et vague (reprise de la vague imprimée sur le produit).

### 6.6 Photographie (charte p. 12)
- **À faire** : situations réelles (comptoir, accueil, téléphone en main), lumière naturelle, tons chauds et neutres, présentoir net et lisible, QR code visible.
- **À éviter** : images de banque génériques et trop mises en scène, filtres saturés, fonds violets, dégradés, produit flou, coupé ou illisible.

### 6.7 Gabarits réseaux sociaux existants
**Règles de mise en page :**
- stories 1080 x 1920 : « rien d'important dans les 250 px du haut et du bas » ;
- posts 1080 x 1350, marges de 80 px ;
- alterner les fonds blanc, brume, cobalt et encre ;
- « Une photo réelle du présentoir dans un visuel sur deux ».

**Zones sûres déjà codées pour la vidéo** (`ads/video/src/theme.ts`) : 250 px en haut, 640 px en bas, 72 px à gauche, 150 px à droite. C'est une union prudente des contraintes TikTok, Reels et Stories.

**5 stories** (`brand/apercus/story-1..5.jpg`, source `brand/canva/stories-instagram.html`) :
1. Fond encre, 5 étoiles or, « Vos clients vous adorent. » (en gris) puis « Google ne le sait pas encore. » (en blanc, point or). Texte : « Le présentoir Reviu transforme vos clients satisfaits en avis Google, directement depuis votre comptoir. »
2. Fond brume, « Un geste **suffit**. », « Le client approche son téléphone du présentoir : votre page d'avis Google s'ouvre, sans application. » Photo `etape-1`, pastilles « Sans contact » et « QR code ».
3. Fond cobalt, « Combien d'avis Google avez-vous aujourd'hui ? », avec un emplacement de sondage « Moins de 20 · 20 à 100 · Plus de 100 ».
4. Fond blanc, photo en angle, « 29,90 €. », « une seule fois, livraison offerte », 3 coches et le bouton « Commandez sur reviu.fr ».
5. Fond encre, « Votre QR code d'avis Google, **gratuit**. » (pour l'outil gratuit).

**5 posts** (`brand/apercus/post-1..5.jpg`) :
1. Accroche, photo `etape-3` et badge rond « 29,90 € une seule fois ».
2. « Comment ça marche ? » en 3 étapes.
3. Comparatif sur fond encre.
4. « 29,90 €, une seule fois. » sur fond cobalt.
5. « Pensé pour tous les comptoirs. » avec des pastilles métiers.

**Designs Canva éditables** : dossier https://www.canva.com/folder/FAHWeHHjrKs (liens détaillés dans `brand/README.md`).

### 6.8 Ton de voix (charte p. 13)
- **Clair** : une idée par phrase, des mots de tous les jours.
- **Concret** : des gestes, des prix, des résultats.
- **Honnête** : Reviu ne filtre pas les avis, et le dit.
- **Proche** : on vouvoie, on reste chaleureux et direct.
- **Personnalité** : « Simple, direct, fiable et chaleureux. Reviu parle comme un bon commerçant parle à ses clients. »

**Phrases réelles réutilisables** (site et gabarits) :
- « Obtenez plus d'avis Google, directement depuis votre comptoir. » (H1 de l'accueil)
- « Vos clients vous adorent. Google ne le sait pas encore. »
- « Un geste suffit. » / « Un geste, et votre page d'avis s'ouvre. »
- « Le client approche son téléphone, comme pour payer sans contact, ou scanne le QR code : votre page d'avis Google s'ouvre instantanément. Aucune application à installer. »
- « Il note et publie en quelques secondes. » / « Le geste est si court que l'avis se laisse sur place, au moment où l'expérience est encore fraîche. »
- « Au comptoir [...] : vos clients satisfaits deviennent des avis Google. »
- « Transformez chaque passage client en avis Google. »
- « Plus simple qu'une demande à l'oral, plus complet qu'un QR code imprimé. »
- « 29,90 €, une seule fois. » / « Un seul nouveau client qui vous choisit grâce à vos avis, et le présentoir est rentabilisé. »
- « Essayez-le 30 jours. Satisfait ou remboursé. » / « Vous le testez en conditions réelles, à votre comptoir, sans engagement. »
- « Prêt en 2 minutes, sans technicien. »
- « Au comptoir, au bon moment. »
- « Pensé pour tous les comptoirs. » / « Du restaurant au cabinet dentaire, un geste suffit pour que vos clients laissent leur avis. »
- « Votre présentoir, piloté depuis votre espace. »
- « Combien d'avis Google avez-vous aujourd'hui ? »

**Boutons existants** : « Commander - 29,90 € », « Commander mon présentoir », « Commander · 29,90 € », « Commandez sur reviu.fr », « Commander sur reviu.fr », « Voir comment ça marche », « Voir la démo ».

---

## 7. Règles de vocabulaire et de conformité

| On dit | On évite | Source |
|---|---|---|
| Le Présentoir Reviu | présentoir NFC + QR, plaque, borne, carte, support, hub | charte p. 13, `brand.ts:5` |
| Sans contact ou QR code ; « comme pour payer sans contact » ; « approchez votre téléphone » | puce NFC, encodage, redirection (termes réservés aux caractéristiques, à la compatibilité et aux mentions légales) | charte p. 13, `HANDOFF.md` 28/09 |
| 29,90 € une seule fois | offre exceptionnelle, prix choc | charte p. 13 |
| Vous | tu | charte p. 13 |
| Plus d'avis, plus de clients | révolutionnaire, n°1, magique | charte p. 13 |

**Règles supplémentaires :**
- **Aucun sur-titre** : ni pastille, ni texte mono en majuscules au-dessus d'un titre. C'est une demande explicite du client (`HANDOFF.md`, 23/09).
- **Aucun tiret cadratin (U+2014) ni demi-cadratin (U+2013)**, nulle part : textes à l'écran, sous-titres, légendes, métadonnées, noms de fichiers, commits. Séparateurs admis : « · », tiret simple, deux-points.
- **Aucun témoignage, citation, nombre de clients, nombre d'avis ou statistique inventés.**
  - `TESTIMONIALS = []` (`src/lib/testimonials.ts`) : aucun témoignage réel à ce jour.
  - La citation d'exemple placée en commentaire (« Les clients le touchent en payant, sans qu'on ait besoin d'insister. », attribuée à « Camille Martin, Boulangerie Martin ») est **fictive** : interdite en pub.
  - Les guides n'emploient volontairement aucune statistique (`guides.ts:10`).
- **Pas de promesse d'avis garantis** : « un clic ≠ un avis publié » (`HANDOFF.md`, conformité). Pas de « +X avis en Y jours ».
- **Pas de filtrage selon la note, pas de contrepartie contre un avis** (« sans jamais offrir de remise en échange »).
- **Mention d'indépendance** (`brand.ts:77`, affichée en ligne dans le pied de page) : « Reviu est un service indépendant et n'est ni affilié, ni sponsorisé, ni approuvé par Google. Google et le logo Google sont des marques de Google LLC. »
- **Maquettes** : les noms fictifs déjà utilisés sont « Le Comptoir de Camille » et « Votre commerce » ; les données de démonstration sont étiquetées « Aperçu ».

---

## 8. Assets réutilisables

| Chemin | Contenu | Qualité et usage vidéo |
|---|---|---|
| `ads/video/assets-src/presentoir-face.webp` | Photo produit exacte, vue de face, fond gris studio | 1254 x 1254, nette : **référence absolue** |
| `ads/video/public/img/presentoir-face.png`, `-2x.png`, `-edge.png`, `-mask.png` | Face détourée, version agrandie x2 renforcée, tranche assombrie, masque de forme | 852 x 904 et 1704 x 1808 avec transparence (RGBA), prêts pour la pseudo-3D |
| `brand/photos/presentoir.jpg` (= `public/products/presentoir.webp`) | Vue de face, studio | 1254 x 1254 |
| `brand/photos/presentoir-angle.jpg` | Vue 3/4 sur fond gris, tranche fine visible | 1254 x 1254, nette |
| `brand/photos/presentoir-comptoir.jpg` | Présentoir **fixé sur la façade** d'un comptoir, salon beige | Nette, mais **contredit** « À poser, sans fixation » : à éviter |
| `brand/photos/etape-1.jpg` | iPhone « Scanner le QR code » (QR dans le viseur) devant le présentoir en bloc acrylique épais | Nette ; bonne image pour « QR code » |
| `brand/photos/etape-2.jpg` | iPhone « Activez votre plaque », bouton « Activer ma plaque », URL reviu.fr, logo « R. » | Nette, mais **vocabulaire interdit** (« plaque ») et logo non conforme : ne pas utiliser sans retouche |
| `brand/photos/etape-3.jpg` | Main tenant un iPhone « Écrire un avis Google », 5 étoiles, bouton « Publier » ; présentoir debout sur pied transparent, comptoir en bois, plante | La plus proche de la vie réelle ; image du hero et du post 1 |
| `public/installations/presentoir-comptoir-accueil.webp` | Photo client : présentoir à plat sur un comptoir d'accueil sombre | 1000 x 1250, **floue, faible définition**, QR flouté |
| `public/installations/presentoir-debout-etagere.webp` | Photo client : debout sur une étagère en verre, près de brochures | Mêmes limites ; imprimé « propulsé par www.reviu.fr » |
| `public/installations/presentoir-table.webp` | Photo client : à plat sur une table en bois | Mêmes limites ; **ancien visuel imprimé** (« Laissez votre avis sur Google », « Approchez votre téléphone »), différent de la photo produit |
| `brand/logo/svg/*.svg` (14 fichiers) | Horizontal (couleur, noir, blanc, blanc sur cobalt, blanc sur encre), vertical (couleur, blanc sur cobalt), monogramme (cobalt, encre, blanc), wordmark (couleur, noir, blanc), avatar | Vectoriel ; copies dans `ads/video/public/img/` |
| `brand/logo/png/*.png` | Mêmes déclinaisons en PNG x4 (horizontal 2636 x 800, monogramme 1600 x 1600, avatar 1080 x 1080) | Fond transparent, sauf l'avatar |
| `brand/icons/*.svg` | `nfc-cobalt`, `qr-cobalt`, `phone-cobalt`, `star-gold`, `stars-5-gold`, `star-badge-cobalt`, `check-cobalt/gold/white`, `cross-muted`, `dot-gold`, `interdit-*` (6 fichiers), spécimens typographiques | Vectoriel, dans le style de la charte |
| `brand/apercus/*.jpg` | Aperçus des 5 posts (540 x 675) et des 5 stories (540 x 960) | Demi-résolution : références de mise en page, pas des sources |
| `brand/canva/*.html` | Sources HTML de la charte, du logo, des posts, des stories et des bannières | Textes et mises en page exacts |
| `ads/video/public/audio/sfx/*.wav` | whoosh, whoosh-short, swipe-up, pop, tap, nfc, star-1 à star-5, success, notif, impact, riser, click, tick ; `manifest.json` (instant d'impact, volume conseillé) | Synthèse originale, libre de droits (`ads/video/scripts/audio/README.md`) |
| `ads/video/public/audio/music/example.wav` et `arrangement-example.json` | Musique de synthèse d'exemple (13 mesures, montée puis outro), -16 LUFS | Libre de droits, régénérable |
| `ads/video/src/components/*` | `Presentoir3D`, `Phone`, `ReviewScreen`, `KineticTitle`, `Star`, `NfcWaves`, `Notification`, `StarRow`, `CheckPill`, `CtaButton`, `Logo`, `WaveWipe`, `SafeZones`, `Grain` | Projet Remotion 4.0.530 en cours (compositions `Lab` et `Lab2`, pas encore de scènes finales) |

**Ne pas réutiliser** : `src/components/site/shop-scene.tsx` (illustrations de commerce provisoires) et `public/temoignages/` (dossier vide).

---

## 9. Parcours client animé du site (à recréer)

### 9.1 `ScanDemo` (section « Un geste, et votre page d'avis s'ouvre. », `src/app/boutique/scan-demo.tsx`)
**Principe** : boucle automatique de **3 écrans de 3,2 s chacun** (`STEP_MS = 3200`), synchronisée avec une liste d'étapes numérotées. Chaque étape a une pastille de 40 px, cobalt quand elle est active, et une barre de progression de 2 px en bas de la carte active.

**Textes des étapes :**
1. « Le client approche son téléphone » : « Il approche son téléphone du présentoir, comme pour payer sans contact, ou scanne le QR code. Aucune application. »
2. « Votre page d'avis Google s'ouvre » : « Directement sur la fenêtre de notation de votre fiche : plus besoin de vous chercher sur Google. »
3. « Il note et publie en quelques secondes » : « Le geste est si court que l'avis se laisse sur place, au moment où l'expérience est encore fraîche. »

**Téléphone :**
- largeur 268 px (220 px sur mobile) ;
- cadre encre `#0A0D16`, marge de 10 px, rayon extérieur 46 px ;
- écran blanc, rayon 38 px, ratio 9:19 ;
- barre haute de 36 px avec une pilule encre de 76 x 18 px ;
- ombre `0 40px 80px -40px rgba(17,57,201,0.55)`.

**Transition entre écrans** : 0,45 s, courbe `cubic-bezier(0.22, 1, 0.36, 1)`. Départ à opacité 0, `translateY(10px)`, échelle 0,98.

**Écran 1 « tap » :**
- cercle cobalt de 80 px, icône sans contact blanche de 34 px, lueur `0 24px 70px -24px rgba(27,77,255,0.5)` ;
- trois ondes concentriques : anneau cobalt de 2 px, cycle de 2,4 s, décalage de 0,8 s entre elles, échelle de 0,6 à 1,9, opacité de 0,55 à 0 ;
- « Approchez votre téléphone » (17 px, SemiBold, encre) ;
- « du présentoir, au comptoir » (13 px, ardoise) ;
- pastille « ou scannez le QR code » avec icône QR, fond `#EEF0F5`.

**Écran 2 « page d'avis » :**
- en-tête : avatar rond cobalt de 36 px marqué « V », « Votre commerce » (13 px SemiBold), « Écrire un avis » (11 px), puis un filet ;
- 5 étoiles de 30 px, grises `#E6E8EF` ;
- « Sélectionnez une note » ;
- zone de texte bordée « Partagez votre expérience… » ;
- bouton gris de 44 px de haut, « Publier ».

**Écran 3 « publié » :**
- les étoiles passent à l'or `#FBBC04` une par une (90 ms d'écart, transition de 300 ms) ;
- « Excellent » ;
- 3 lignes grises simulent le texte (85 %, 70 %, 40 % de largeur) ;
- bouton bleu Google `#1A73E8` avec une coche, « Avis publié ».

### 9.2 Visuel du hero (accueil, `boutique/page.tsx:474`)
- Photo `etape-3` carrée, rayon 32 px, halo cobalt flou derrière (opacité 20 %).
- Carte flottante blanche en haut à gauche, animation `float` (7 s, montée de 10 px) : carré cobalt avec icône sans contact et ondes, « Page d'avis ouverte » / « en un seul geste ».
- Pastille en bas à gauche, fond encre à 85 % : icône QR et « 29,90 € · Livraison offerte ».

### 9.3 Autres maquettes utiles
- **Espace Reviu** (`DashboardMock`, `boutique/page.tsx:517`) :
  - en-tête « Espace Reviu » avec la pastille « Aperçu » ;
  - tuiles « Scans sans contact » et « Scans QR » avec des barres grises, **sans aucun chiffre** ;
  - histogramme « Scans par jour » de 7 barres cobalt (38, 52, 44, 68, 58, 76 et 64 %) ;
  - ligne « Lien de redirection » `g.page/r/votre-commerce/review` avec un bouton cobalt « Modifier ».
- **Page `/demo`** : téléphone avec « Le Comptoir de Camille », « Café · Nîmes », « Notez votre expérience », étoiles, « Publier », « via reviu · r.reviu.fr/demo ». Tableau de bord étiqueté « Aperçu avec données de démonstration ».
- **Ancien hero non utilisé** (`src/components/site/hero-visual.tsx`) :
  - écran « page reviu » : en-tête cobalt, « Le Comptoir de Camille », « Comment s'est passée votre visite ? », étoiles scintillantes, bouton « Laisser un avis Google » ;
  - carte flottante « Nouvel avis Google » avec étoiles ;
  - carte QR « Sans contact · QR ».
  - Il contient « J'ai rencontré un souci » : à retirer en pub.
- **Barre d'achat mobile** (`sticky-buy-bar.tsx`) : vignette de 44 px, « Présentoir Reviu », « 29,90 € · Livraison offerte », bouton « Commander ». Bon modèle pour la carte de fin.
- **Bannière Facebook** : carte « Nouvel avis » (`brand/canva/banniere-facebook.html`).

---

## 10. Tracking, page d'arrivée et UTM

### 10.1 État réel au 29/09/2026
- **GA4 est actif en production.** L'ID `G-NJK6DK30ZJ` et le bandeau cookies (« Tout accepter ») figurent dans le JavaScript servi par https://reviu.fr/. Vérifié en téléchargeant les fichiers JS ; 4 fichiers sur 11 n'ont pas pu être récupérés (connexion coupée).
- **Événements mesurés** (`docs/ADS-TRACKING.md` §1) :
  - `begin_checkout` sur `/boutique/commander` ;
  - `purchase` avec le montant sur `/boutique/merci` ;
  - `qr_download` sur l'outil gratuit.
- **Consentement CNIL en mode « basique »** :
  - aucun script avant le choix du visiteur ;
  - la provenance (cookie `reviu_attr`, 30 jours) n'est enregistrée qu'avec son accord ;
  - les identifiants de clic ne sont enregistrés qu'avec l'accord « Publicité ».
- **Paramètres capturés**, copiés dans les métadonnées Stripe et dans l'e-mail interne de commande (`src/lib/tracking-config.ts`) : `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `fbclid`, page d'arrivée, site d'origine.
- **Bloquant pour Meta et TikTok :**
  - aucun Pixel Meta, aucune API Conversions, aucun Pixel TikTok, aucune Events API dans le code (aucune occurrence) ;
  - `ttclid` n'est pas capturé.
  - Conséquence : Meta et TikTok ne voient pas les achats. Impossible d'optimiser une campagne sur « Achat » ou de recibler les visiteurs du site.
  - **[QUESTION OUVERTE]** À régler avant d'acheter des conversions : ajouter les pixels sous consentement, envoyer l'achat côté serveur depuis le webhook Stripe, et capturer `ttclid`.

### 10.2 Pages d'arrivée possibles
- **`https://reviu.fr/`** : H1, démo animée identique au message de la vidéo, commande express `#produits`, comparatif, garantie, FAQ et **barre d'achat collante sur mobile**. C'est la plus cohérente pour une vidéo vue par une audience froide.
- **`https://reviu.fr/presentoir-avis-google`** : fiche produit (galerie, paliers cliquables, caractéristiques, activation, FAQ), **sans barre collante**. C'est la page choisie pour Google Search (`ADS-TRACKING.md` §3).
- **Paiement direct** : `https://reviu.fr/boutique/commander?product=stand&quantity=1` (étape « Finaliser votre commande »). À réserver au reciblage.
- **Redirections** : `/boutique` redirige (301) vers `/`, et `www.reviu.fr` vers `reviu.fr` (`src/proxy.ts`).

### 10.3 UTM proposés (format aligné sur la campagne Google)
- Paramètres : `?utm_source=tiktok|facebook|instagram&utm_medium=paid_social&utm_campaign=presentoir-video-<angle>&utm_content=<id-accroche>`.
- Avec une ancre : `https://reviu.fr/?utm_source=...#produits`.
- Les macros dynamiques des plateformes ne sont pas vérifiées ici.

### 10.4 Contact et éditeur
- **Téléphone** : **07 81 98 30 42** (`tel:+33781983042`, `brand.ts:99`), affiché dans le bandeau, la FAQ et le pied de page.
  - **WhatsApp n'est pas activé** (`PHONE_HAS_WHATSAPP = false`).
- **E-mail** : contact@reviu.fr.
- **Carte de fin de la charte** : « reviu.fr · contact@reviu.fr · 07 81 98 30 42 ».
- **Éditeur** : NEVIFY, entreprise individuelle, Yoan Oliveira, SIREN 992 266 197, 14 rue de la République, 30000 Nîmes (mentions légales).

---

## 11. Contraintes et questions ouvertes (par priorité)
1. **Pixels Meta et TikTok absents** (voir §10.1). Sans eux, pas d'optimisation sur l'achat ni de reciblage. Et le trafic qui refuse les cookies restera sans provenance dans Stripe.
2. **Logo et marque Google** : le produit porte le « G » et le mot « GOOGLE » ; le site affiche la mention d'indépendance.
   - Les règles de Meta et TikTok sur l'usage d'une marque tierce ne sont pas vérifiées ici **[NON VÉRIFIÉ]**.
   - Prévoir la mention d'indépendance en fin de vidéo ou dans le texte de l'annonce.
   - Recréer l'écran d'avis en maquette générique plutôt que copier l'interface Google.
3. **Aucune preuve sociale réelle** : aucun témoignage, et « aucun présentoir vendu » selon `PLAN-VENTES.md` (septembre 2026).
   - Pourtant, la section « Déjà sur le comptoir de nos clients » affiche 3 photos présentées comme « photographiées par nos clients ».
   - **[QUESTION OUVERTE]** Quel est le statut exact de ces clients, et ont-ils donné leur accord pour la pub ?
   - Ne jamais afficher de nombre de clients ou d'avis.
4. **Visuel imprimé réellement livré** : les photos clients portent « propulsé par www.reviu.fr » (et l'une d'elles un ancien texte : « Laissez votre avis sur Google », « Approchez votre téléphone »), alors que la photo produit porte « propulsé par Reviu.fr ».
   - **[QUESTION OUVERTE]** Confirmer que la photo `presentoir-face.webp` correspond bien à ce que reçoit le client.
5. **Caractéristiques physiques inconnues** (dimensions, matériau, épaisseur, poids, pied fourni ou non) :
   - pas de mention « acrylique » ;
   - pas d'échelle trompeuse ;
   - éviter la mise en scène murale (`presentoir-comptoir.jpg`) tant que le produit est vendu « à poser, sans fixation ».
6. **Stock** : 100 présentoirs commandés à l'origine (`HANDOFF.md`, partie historique). **[QUESTION OUVERTE]** Stock actuel inconnu : à vérifier avant d'augmenter les budgets.
7. **Mentions légales à fiabiliser** avant la vérification de l'annonceur :
   - l'adresse de Nîmes était signalée « mise aléatoirement », à vérifier (`HANDOFF.md`, actions manuelles) ;
   - les CGV ne nomment pas de médiateur de la consommation (« communiquées sur simple demande »).
8. **Zone de livraison** : les CGV disent « France métropolitaine », mais le paiement accepte FR, MC, BE et LU (`shop.ts:192`). Cibler la France uniquement.
9. **Durée d'activation** : « 2 minutes » est retenu, contre « en une minute » sur l'écran d'activation.
10. **Point final doré** : la charte le veut en or, le site l'affiche en encre. La vidéo suit la charte.
11. **Police des titres vidéo** : Inter 800 ou Plus Jakarta Sans 800, à trancher.
12. **Code promo dédié** : techniquement possible (`allow_promotion_codes`), mais aucun n'existe. C'est une décision commerciale : rien à inventer à l'écran.
13. **Vocabulaire des écrans existants** : `etape-2.jpg` et le tableau de bord disent « plaque ». Ne pas les montrer tels quels.