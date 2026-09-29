# Corrections et compléments

## 0. Périmètre des vérifications

- **Contrôles web faits (11 WebFetch)** : TikTok (format publicitaire, propriété intellectuelle), Meta (spécifications Reels, frais de localisation), Google (règlement des avis, deux pages de marque), Apple Core NFC (lu via le JSON de la documentation), BrightLocal 2026, IFOP x Guest Suite (page d'étude et article de blog).
- **Recherche web** : le quota WebSearch de la session était déjà épuisé (200 sur 200). Je n'ai donc pas pu découvrir de nouvelles sources, seulement ouvrir des URL connues.
- **Contrôles locaux dans le dépôt** :
  - CGV (garantie) ;
  - `tracking-config.ts` ;
  - `r/[code]/page.tsx` ;
  - `installations.ts` et `installations-section.tsx` ;
  - `PLAN-VENTES.md` et `HANDOFF.md` ;
  - la fiche produit (surfaces métalliques) ;
  - la photo produit.
- **Toujours bloqué** : aucun des 6 rapports n'a pu consulter la Meta Ad Library ni la bibliothèque publicitaire TikTok.

---

## 1. Ce qui est désormais vérifié (sources primaires)

| # | Affirmation des rapports | Verdict | Texte exact / source |
|---|---|---|---|
| V1 | Restriction QR code sur TikTok en France (plateformes 0.9 et 8.5) | **Précisé.** Ce n'est pas une interdiction générale | Interdit dans certains marchés, dont la France : "Ad content with QR codes leading to third-party websites, including social media pages". Autorisés : "QR on product packaging or application" et "Unscannable matrix codes including item barcodes". Page mise à jour en avril 2026 ([TikTok](https://ads.tiktok.com/help/article/tiktok-ads-policy-ad-format-and-functionality)) |
| V2 | Durée des pubs TikTok (les pages se contredisaient : 10 min ou 60 s) | **Tranché : 5 à 60 s** | "minimum of 5 seconds, and a maximum of 60 seconds" ; "Static images should not occupy more than 50% of the video" ; "The ad must contain audio" ; exemple de geste interdit : "Swipe up to learn more" (même page) |
| V3 | Marques tierces sur TikTok | **Confirmé, risque élevé** | "We do not allow the use of third-party brands without authorization." et "Display or use of unauthorized third-party names, logos, or brands in a way that could mislead users about your brand affilitation" (sic). Avril 2026. Cette page ne prévoit aucune exception pour un usage descriptif ([TikTok](https://ads.tiktok.com/help/article/tiktok-ads-policy-intellectual-property-infringement)). La tolérance citée par "preuves" (page de février 2025) n'a pas été revérifiée |
| V4 | Logo "G" de Google | **Confirmé, et plus grave que prévu** | "Don't use the Google G in marketing materials for a business or to imply endorsement from Google" ; "Only use the newest version of the Google G (the one with blended gradient colors)" ; "Don't combine your logo with the Google G or modify the Google G in any way, including changing the color". Les usages commerciaux passent par une relation de co-branding ([Google](https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/)). **Constat visuel sur `ads/video/assets-src/presentoir-face.webp`** : le G imprimé est l'ancienne version à aplats de 4 couleurs, sans dégradé (lecture visuelle, non expertisée) |
| V5 | Page Google "avis clients" | **Nuance à connaître** | Elle recommande "Include one of our logos (either the Google G or full Google wordmark)" et "Get consent from reviewers", mais **seulement pour mettre en avant ses propres avis Google**. Elle interdit aussi les étoiles placées à côté du nom ou des éléments de marque Google, et de laisser croire que Google a produit les notes ([Google](https://partnermarketinghub.withgoogle.com/brands/google/use-cases/customer-reviews/)). Elle ne couvre pas la vente d'un produit qui porte le G |
| V6 | Règles d'avis Google Maps | **Confirmé** | Interdits : "Offer incentives..." ; "Discourage or prohibit negative reviews, or selectively solicit positive reviews" ; "require or pressure users to leave ratings or write reviews while on the premises" ; demander au personnel de solliciter "a certain number of reviews" ; demander des avis avec un "content that identifies a staff member". Autorisé : "Solicit or encourage the posting of content that does represent a genuine experience" ([Google](https://support.google.com/contributionpolicy/answer/7400114?hl=en)). **La date du 17/04/2026 reste non vérifiée** : la page ne l'affiche pas |
| V7 | Zone de sécurité Meta 14 / 35 / 6 % | **Officielle.** Le rapport "motion" se trompait | "Consider leaving at least 14% of the top, 35% of the bottom, and 6% on each side of your asset free from text, logos, or other important creative elements" ; 1440x2560 ; texte principal "44 characters" ([Meta IG Reels](https://www.facebook.com/business/ads-guide/update/video/instagram-reels)) |
| V8 | Frais Meta de +3 % en France "depuis le 01/07/2026" | **Confirmé** | Article du 10/03/2026 : 3 % pour la France, "takes effect in May with full billing on July 1" ([MediaPost](https://www.mediapost.com/publications/article/413378/meta-passes-eu-digital-services-tax-to-advertisers.html)) |
| V9 | NFC sur iPhone | **Confirmé, avec deux contraintes absentes des rapports** | "iPhone XS and later support background tag reading" ; "The system displays a pop-up notification... After the user taps the notification" ; "If the iPhone is locked, the system prompts the user to unlock the phone" ; **"the system reads tags in the background only when the user's iPhone is in use"**. Lecture indisponible si l'appareil n'a jamais été déverrouillé, si une session Core NFC est ouverte, si "Apple Pay Wallet is in use", si "The camera is in use" ou en mode avion ([Apple](https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading)) |
| V10 | BrightLocal 2026 | **Confirmé** | Publié le 11/02/2026, 1 002 adultes américains, via SurveyMonkey. Chiffres confirmés : 83 % (parmi ceux à qui on a demandé), 94 %, 69 %, 47 % (moins de 20 avis), 68 % (4 étoiles ou plus, contre 55 % en 2025), 74 % (avis de moins de 3 mois) ([BrightLocal](https://www.brightlocal.com/research/local-consumer-review-survey/)) |
| V11 | IFOP x Guest Suite, 93 % | **Confirmé, mais deux formulations circulent** | Page de l'étude : "93 % des Français consultent les avis clients pour obtenir des informations sur un établissement". Rapport complet derrière un formulaire (nom, e-mail pro, téléphone), sans dates de terrain ([Guest Suite](https://www.guest-suite.com/ifop-guest-suite-2026)). L'article de blog du 15/04/2026 écrit "93% des Français consultent des avis en ligne avant d'acheter". Il donne l'échantillon (1 003) et les autres chiffres (93 % confiance, 83 %, 82 %, 54 %), et contient bien l'incohérence 58 % contre 53 % ([blog](https://www.guest-suite.com/blog/statistiques-avis-clients)). **Utiliser la formulation de la page de l'étude**, la plus prudente |

---

## 2. Erreurs et contradictions entre rapports (corrigées)

**E1. Calcul du CPA maximum faux (rapport "plateformes", 4.3)**
- La formule "(29,90 ÷ 1,2) - coûts" retire une TVA de 20 %. Or Reviu est en franchise ("TVA non applicable, art. 293 B du CGI", mentions légales et CGV) : il n'y a aucune TVA à retirer.
- Formule corrigée : **CPA max = 29,90 - (coût du présentoir + emballage + envoi) - frais de paiement - provision pour remboursements "30 jours"**.
- Côté dépense Meta en France, compter **budget x 1,03** (V8).
- Seuil de rentabilité, avec le CPM de 8 € du rapport : CTR x taux de conversion ≥ 8,24 / (1000 x marge unitaire).
- *Exemple hypothétique* : avec une marge de 15 €, il faut CTR x CVR ≥ 0,055 %, soit par exemple un CTR de 1,5 % et une conversion de 3,7 %.
- **Les coûts réels (achat, envoi) n'apparaissent nulle part : c'est le premier trou à combler.**

**E2. La comparaison des prix "≈ TTC" est trompeuse pour la cible (rapport "concurrents-fr", §2 et §7)**
- La plupart des commerçants visés sont assujettis à la TVA. Pour eux, le coût réel d'un concurrent est son prix **HT**. Le prix Reviu, lui, ne contient aucune TVA récupérable, donc 29,90 € reste leur coût net.
- Coût net comparé pour un commerçant qui récupère la TVA (calcul à partir des prix du rapport) :
  - Viewup : 24,99 € TTC, soit 20,83 € HT ;
  - MediaPush : 20 € HT ;
  - Izikard : 25 € HT ;
  - Digifeel et Swiipx : 29,90 € HT, **à égalité avec Reviu** ;
  - Social Touch 39 € HT, CarteBiz 39,90 € HT, CollecteAvis 59,90 € : plus chers.
- Conséquences :
  - L'argument "prix TTC, plus clair" ne parle qu'aux commerçants eux-mêmes en franchise (micro-entrepreneurs, coiffeurs ou esthéticiennes indépendants).
  - Reviu est **en milieu de marché**, pas "à moitié prix" (sauf face à CollecteAvis).
  - Prudence sur la mention "TTC" alors qu'aucune taxe n'est facturée. Préférer "29,90 €, prix final" suivi de "TVA non applicable, art. 293 B du CGI", comme le recommande "preuves". C'est une analyse, pas un avis juridique.

**E3. "Compatible comptoir métal" est faux (rapport "concurrents-fr", §7, levier "Format présentoir")**
- La fiche produit Reviu dit l'inverse : "Évitez de le poser directement sur une surface métallique, qui peut gêner la lecture NFC" et "Préférez une surface non métallique, ou utilisez le QR code" (`src/app/presentoir-avis-google/page.tsx:73` et `:143`).
- **Retirer cet angle.**

**E4. Unicité de l'Espace Reviu : le rapport "concurrents-fr" se contredit**
- Le §1.4 cite Izikard et Kipful, le §7 dit "seul Izikard".
- Le lien modifiable existe aussi chez Qoov, MediaPush et Plakode (tableau §2 du même rapport).
- **Interdire "le seul", "unique" ou "premier"** (L121-2, vocabulaire ARPP). Dire plutôt "statistiques incluses, sans abonnement".

**E5. Zones de sécurité**
- Le rapport "motion" (2.1 et 7) affirme que 14/35/6 ne figure pas sur la page Meta : c'est faux (V7).
- Valeurs à coder dans `ads/video/src/theme.ts` (actuellement 250/640/72/150) :

  | Bord | Valeur | Contrainte |
  |---|---|---|
  | Haut | 269 | Meta 14 % |
  | Bas | 672 | Meta 35 % |
  | Gauche | 65 minimum, 100 conseillé | Meta 6 % |
  | Droite | 140 | Colonne d'icônes TikTok, valeur tierce |

**E6. QR code visible à l'image (plateformes, motion)**
- Le QR imprimé sur le produit relève de l'exception "QR on product packaging" (V1).
- Mais un présentoir activé renvoie, via `r.reviu.fr`, vers Google, donc un site tiers. S'il s'agit d'un présentoir réel, il renvoie aussi vers la fiche d'un client.
- **Règle** : QR stylisé ou flou dans les plans serrés, ou présentoir de démo pointant vers `reviu.fr/demo`.
- La destination du QR de la photo produit n'a pas pu être décodée (pas d'OpenCV sur ce poste).

**E7. La promesse de chrono est trompeuse (rapport "concurrents-intl", hook 2 et gabarit T1)**
- Un "Un avis Google en 5 secondes. Chrono." avec une "saisie accélérée x2" pendant que le chrono tourne est trompeur (L121-2). Il contredit aussi "preuves" (ne pas dire "en 2 secondes, avis publié").
- La réalité iPhone (V9) : écran allumé et déverrouillé, bannière à toucher, compte Google connecté, puis rédaction.
- Ne chronométrer que **l'ouverture de la page**, filmée en un seul plan, sans accélération. Formulation vérifiable : "Votre page d'avis s'ouvre en un geste."

**E8. Scènes contraires aux règles Google (V6)**
- **T2 "Je le ferai plus tard"** : le commerçant relance le client ("Ça prend 5 secondes : approchez votre téléphone ici"). C'est une pression sur place. À réécrire : le client remarque le présentoir et tape de lui-même, ou garde le lien pour plus tard, sans relance.
- **T3 micro-trottoir** : le patron peut ouvrir sa page d'avis, **jamais publier un avis sur son propre commerce** (conflit d'intérêts).
- **Moments 5 et 6 du rapport "motion"** : étoiles qui se remplissent seules et notification "Nouvel avis 5 étoiles". C'est contraire à "preuves" (étoiles vides, le client choisit) et à la règle Google sur les étoiles à côté du nom ou du logo (V5). À remplacer par "Nouvel avis Google", sans nombre d'étoiles, avec étoiles choisies du doigt dans une maquette générique, et la mention "Scène reconstituée".

**E9. "Comme pour payer sans contact" (site, rapport "reviu-interne", scripts)**
- Sur iPhone, contrairement à Apple Pay, l'étiquette n'est lue que si l'appareil est "in use" et déverrouillé (V9). L'analogie peut produire des gestes ratés chez le vrai client.
- Dans la vidéo : téléphone allumé et déverrouillé, bannière visible puis touchée.
- Dans la FAQ ou la légende : "écran allumé".
- Le comportement Android (NFC activé par défaut ? écran déverrouillé nécessaire ?) reste **non vérifié**.

**E10. Écran Google réel ou maquette : les rapports se contredisent**
- "concurrents-intl" recommande de finir sur le vrai écran Google en français ("Avis publié. Merci !").
- "plateformes" et "preuves" recommandent une maquette générique, car les captures d'écran font partie des éléments de marque Google.
- Arbitrage prudent :
  - en motion : maquette générique, sans G, sans étoiles à côté du nom Google ;
  - en prise de vue réelle : passage bref et non dominant sur l'écran Google, jamais en gros plan final.

**E11. "Liquid Glass" contre la charte (rapport "motion", 3.3 et moment 6)**
- La charte interdit le glassmorphism (`globals.css`, charte p. 12).
- Utiliser une bannière opaque et plate, uniquement à l'intérieur de la maquette de téléphone.

**E12. "Acrylique" (contexte, rapport "concurrents-fr" §8)**
- Le mot n'existe nulle part dans le dépôt, et les constantes SPEC sont vides.
- Ne pas l'écrire ni le dire tant que le fournisseur ne l'a pas confirmé (L121-2, caractéristiques essentielles).

**E13. Musique**
- La Commercial Music Library de TikTok ne couvre que TikTok (rapport "plateformes").
- Utiliser la musique de synthèse originale du dépôt (`ads/video/public/audio/music/`), valable sur les deux plateformes.

**E14. "Plus d'avis, plus de clients"**
- La charte le range dans la colonne "On dit", alors que "preuves" le classe comme promesse de résultat.
- Garder la version objectif : "Récoltez plus facilement vos avis Google".

---

## 3. Risques juridiques et de politique publicitaire (par priorité)

**R1. Logo Google sur le produit (bloquant probable sur TikTok)**
- V3 : TikTok refuse les marques tierces "without authorization".
- V4 : Google interdit le G "in marketing materials for a business" et l'ancienne version du G, qui semble être celle imprimée sur le présentoir.
- Le risque concerne **le produit lui-même**, pas seulement la pub.
- Mesures :
  1. une variante de pub où le G n'est jamais dominant ni en gros plan (angle 3/4, mise au point sur la zone "COLLEZ VOTRE TÉLÉPHONE", le QR ou "propulsé par Reviu.fr") ;
  2. la mention d'indépendance déjà écrite (`brand.ts:77`) ;
  3. à moyen terme, une face sans logo G (texte "Avis Google" seul, usage descriptif défendable selon CPI L713-6, cité par "preuves") ;
  4. une relecture par un avocat en droit des marques.

**R2. Preuve sociale affichée sur la page d'arrivée alors qu'aucune vente n'existe**
- `InstallationsSection` affiche "Déjà sur le comptoir de nos clients." et "photographiés par nos clients" sur `/` et `/presentoir-avis-google`, à partir de 3 photos (`src/lib/installations.ts`).
- Or `docs/PLAN-VENTES.md:3` indique "aucun présentoir vendu".
- Une des photos montre en plus un **ancien visuel imprimé**, différent du produit vendu.
- Risques :
  - pratique trompeuse (L121-2 ; L121-4, faux avis ou fausses recommandations) ;
  - incohérence entre la pub et la page d'arrivée, sanctionnée par TikTok.
- **Avant la première dépense** : établir le statut réel de ces photos (clients payants, testeurs, présentoirs offerts), reformuler ("chez nos premiers commerçants testeurs") ou masquer la section (`INSTALLATIONS = []`), et retirer la photo de l'ancien visuel.

**R3. Identité de l'annonceur**
- `docs/HANDOFF.md:503` : "vérifier l'adresse de Nîmes (mise aléatoirement)" dans les mentions légales, la politique de confidentialité et les CGV.
- Une adresse fictive pose un problème de conformité (L121-3, identité et adresse du professionnel ; obligations d'identification de l'éditeur, texte LCEN non relu ici). Elle bloque aussi la vérification annonceur sur Meta et TikTok.
- **À corriger avant le lancement.**

**R4. Garantie "30 jours"**
- CGV §5 : "retournez-le complet et en bon état", "Les frais de retour restent à votre charge", garantie applicable "aux présentoirs achetés à l'unité sur reviu.fr".
- Dans `shop.ts`, "à l'unité" désigne le canal public, paliers de 3 et 5 compris. Mais un lecteur peut comprendre que les lots sont exclus.
- **Clarifier la phrase des CGV** avant d'afficher "27 € dès 3" à côté de "Satisfait ou remboursé 30 jours".
- À l'écran : "30 jours pour essayer*" avec renvoi "*conditions : reviu.fr/cgv". La publicité engage le garant (L217-21, cité par "preuves").

**R5. Droit à l'image (absent des 6 rapports)**
- Tout commerçant, client ou salarié filmé (T3 à Nîmes, UGC), ainsi que les enseignes et vitrines reconnaissables : il faut une autorisation écrite couvrant la publicité payante, les plateformes, la durée et le territoire (art. 9 du Code civil, non relu en ligne ici).
- Pour un acteur, ajouter la mention "Scène reconstituée".

**R6. Statistiques à l'écran**
- Formulation IFOP à reprendre de la page de l'étude (V11). Mention "États-Unis" obligatoire pour BrightLocal (V10).
- Nom de l'organisme et date à l'écran (ARPP).
- Rapport IFOP complet non consulté (réservé) : demander l'accord de Guest Suite, qui est un acteur concurrent.

**R7. Pratiques de sollicitation dans les scripts (V6)**
- Aucune relance sur place.
- Aucune contrepartie.
- Aucun quota ni prénom de salarié.
- Aucun présentoir tendu seulement aux clients contents.
- Le mode "Page reviu" affiche des étoiles décoratives, sans lien avec l'accès (`<Stars size={26} />`), et un bouton Google ouvert à tous (`r/[code]/page.tsx:73-86`) : ce n'est pas un filtrage par la note. En revanche, le lien optionnel "J'ai rencontré un souci" peut être lu comme un filtrage déguisé : **ne jamais le montrer en pub**.

**R8. Zone de vente**
- Les CGV disent "France métropolitaine", mais le paiement accepte FR, MC, BE et LU (`shop.ts:192`, selon "reviu-interne").
- Cibler la France métropolitaine seulement et aligner le paiement ou les CGV.

---

## 4. Lacunes encore ouvertes qui conditionnent la conversion

1. **Économie unitaire inconnue** : coût du présentoir, envoi, frais Stripe (non vérifiés ici), taux de retour. Sans ces chiffres, pas de CPA cible, donc pas de règle d'arrêt fiable (voir E1). Le lot de 3 (81 €) et le lot de 5 (125 €) relèvent fortement le CPA tolérable : prévoir une créa "plusieurs points de vente".
2. **Pubs concurrentes sur Meta et TikTok** : jamais vérifiées. Contrôle manuel à faire :
   - Meta Ad Library, pays France, requêtes "avis google", "plaque nfc", "présentoir avis", puis les pages Social Touch, Viewup, Digifeel, Swiipx, Qoov, MediaPush, Kipful ;
   - bibliothèque publicitaire TikTok (DSA) et Top Ads du Creative Center, marché France.
3. **Aucune image réelle tournée** : il faut au minimum un vrai geste filmé sur iPhone (XS ou plus récent, écran allumé) et sur Android, avec un présentoir de démo. C'est la base de toutes les créas gagnantes du corpus international.
4. **Objection "Et si Reviu ferme ?"** : la redirection passe par `r.reviu.fr` et aucune réponse n'est écrite. Un engagement public (maintien des redirections, procédure de reprise) serait un argument de confiance. C'est une décision de l'entreprise.
5. **Caractéristiques physiques** (dimensions, matériau, pied fourni ou non) : sans elles, pas d'échelle crédible à l'image, et aucune main ne doit suggérer une taille fausse.
6. **Offre de lancement réelle** : l'annonce de promotion fait partie des hooks les plus performants selon Motion (rapport "plateformes"). Un code Stripe est techniquement prêt mais n'existe pas. Aucune fausse urgence ni prix barré sans prix antérieur réel.
7. **Délai de livraison à afficher** : les CGV disent 3 à 5 jours ouvrés. À afficher seulement si le stock le permet (stock actuel inconnu).
8. **Propriété du visuel imprimé** : CollecteAvis vend un visuel quasi identique. Demander au fournisseur qui détient les droits du gabarit avant de le mettre en gros plan dans une pub payante.

---

## 5. Non vérifié à ce stade

- Comportement NFC sur Android.
- Texte de la LCEN et article 9 du Code civil (non relus).
- Grille tarifaire Stripe.
- Date du 17/04/2026 de la mise à jour Google.
- Exception d'usage descriptif chez TikTok (page de février 2025).
- Étiquetage IA sur Meta.
- Obligation de déclarer payeur et bénéficiaire (DSA) sur Meta.
- Seuils de la franchise de TVA en cas de croissance.
- Destination du QR de la photo produit.
- Version exacte du G imprimé (lecture visuelle seulement).

Fichiers locaux cités : `/home/user/reviu/src/app/(legal)/cgv/page.tsx`, `/home/user/reviu/src/lib/installations.ts`, `/home/user/reviu/src/components/site/installations-section.tsx`, `/home/user/reviu/docs/PLAN-VENTES.md`, `/home/user/reviu/docs/HANDOFF.md`, `/home/user/reviu/src/app/presentoir-avis-google/page.tsx`, `/home/user/reviu/src/app/r/[code]/page.tsx`, `/home/user/reviu/src/lib/tracking-config.ts`, `/home/user/reviu/ads/video/src/theme.ts`, `/home/user/reviu/ads/video/assets-src/presentoir-face.webp`.