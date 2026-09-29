# Benchmark concurrentiel France : supports d'avis Google NFC/QR (état au 29/09/2026)

## 0. Méthode, accès aux sources et fiabilité

| Source | Résultat |
|---|---|
| Sites des marques (WebFetch + JSON public Shopify `/products/x.json`) | OK. Prix exacts relevés sur Viewup, CollecteAvis, Unisign, Vizzee, Phanion, TrustAvis |
| **Google Ads Transparency Center** (adstransparency.google.com) | **OK**. Créations, formats et dates de diffusion par domaine. Vidéos YouTube identifiées par oEmbed, images clés lues sur les miniatures |
| **Meta Ad Library** | **Bloqué** : HTTP 403 sur WebFetch et curl ; l'API Graph `ads_archive` exige un jeton. **Je n'ai pas pu vérifier si les concurrents diffusent sur Facebook ou Instagram.** |
| TikTok Creative Center | Non accessible (404, rendu en JavaScript) |
| Pages TikTok « discover » | Le rendu côté serveur ne contient aucune vidéo. En revanche, les statistiques des profils sont lisibles |
| Amazon.fr | Page captcha (fichier de 3,8 Ko). Les données Amazon viennent uniquement des extraits du moteur de recherche, **non vérifiées** |
| Etsy, Metro Marketplace | HTTP 403 |
| Recherche YouTube | OK (ytInitialData). Pages vidéo : HTTP 429 |

Les chiffres de performance cités par les concurrents (« x5 », « +320 % »...) sont **leurs propres affirmations, sans source**, sauf mention contraire.

---

## 1. L'essentiel en 10 points

1. **Le design du présentoir Reviu est aussi vendu par un concurrent.** CollecteAvis vend à **59,90 €** une « Plaque Avis Google » visuellement identique : haut bleu en vague, « LAISSEZ-NOUS VOTRE AVIS SUR GOOGLE », « COLLEZ VOTRE TÉLÉPHONE », « OU SCANNEZ-MOI », « propulsé par CollecteAvis.fr » ([fiche produit](https://collecteavis.fr/products/plaque-avis-google), [photo](https://cdn.shopify.com/s/files/1/0975/7156/9990/files/Design_sans_titre_-_1.webp)). Comparaison faite avec `/home/user/reviu/public/products/presentoir.webp`. Il s'agit très probablement d'un gabarit fournisseur commun. **Le design ne peut donc pas être le différenciateur principal**, mais Reviu vend le même objet à moitié prix.
2. Le marché est saturé de vendeurs « sans abonnement » entre 20 et 40 € HT, presque tous en plaque plate 12x12 cm adhésive. Le **présentoir posé** (format chevalet) est minoritaire : Viewup, le chevalet CollecteAvis, quelques vendeurs Amazon.
3. **Beaucoup de prix sont affichés HT** (Swiipx, Digifeel, Social Touch, CarteBiz, Izikard, MediaPush), souvent avec un **seuil de livraison gratuite entre 50 et 60 €**. Le « 29,90 € TTC, livré, dès 1 » de Reviu est un vrai avantage de clarté. En revanche, **Reviu n'est pas le moins cher**, ni à l'unité (Viewup 24,99 €, MediaPush 24 € TTC) ni en lot.
4. Un **espace client gratuit avec statistiques et lien modifiable** est rare chez les vendeurs sans abonnement : seuls Izikard et Kipful en ont un clairement ; MediaPush et Plakode permettent de changer le lien, sans statistiques mises en avant. Les solutions logicielles le facturent : Aflore 49 €/mois, Viewup+ avec des paliers au prix non affiché.
5. **Deux acteurs vendent un filtrage des avis négatifs**, ce que Google interdit : MediaPush (« Filtre Anti Mauvais Avis +1€ HT/mois ») et Technee (« médiation »). Reviu ne filtre pas. C'est un argument de confiance, à utiliser en réassurance plutôt qu'en accroche.
6. **Google fournit gratuitement un lien et un QR code d'avis** depuis le 4 mars 2025. C'est le vrai substitut, et l'objection n°1 à anticiper.
7. Publicité observée : **Google Ads surtout** (Social Touch depuis 2022, Kipful, Digifeel, Viewup, Izikard). Les vidéos sont peu produites : main qui tient la plaque, écrans texte, histoires au rendu IA, UGC face caméra. **Je n'ai vu aucune pub en motion design haut de gamme** (échantillon : 7 vidéos).
8. Accroches dominantes : **la course aux secondes** (« 3 s », « 5 s », « 10 s »), **« Passez 1er / en tête sur Google »**, **« sans abonnement »**, **« N°1 / leader »**, gros chiffres de clients, multiplicateurs d'avis.
9. **Preuve sociale** : les concurrents s'appuient sur des logos de grandes enseignes (Viewup, Social Touch) et des volumes massifs (Digifeel « +100 000 »). Reviu, sans vente, ne peut pas jouer sur ce terrain. Il doit miser sur la démonstration, le fondateur, le local et la garantie.
10. **Garantie** : celle de Reviu (30 jours) est en dessous de Swiipx (90 jours + garantie à vie) et de Digifeel (« doublez vos avis ou remboursé » + à vie).

---

## 2. Tableau comparatif des offres (prix relevés le 29/09/2026)

| Acteur | Format principal | Prix 1 unité affiché | ≈ TTC 1 unité | Lots | Livraison | Abonnement | Garantie | Stats / lien modifiable |
|---|---|---|---|---|---|---|---|---|
| **Reviu** ([code : FAQ boutique](/home/user/reviu/src/app/boutique/page.tsx)) | Présentoir acrylique | 29,90 € TTC | 29,90 € | 27 € dès 3, 25 € dès 5 | Offerte dès 1 | Non | 30 j remboursé | Oui, inclus (NFC et QR distingués) |
| [CollecteAvis](https://collecteavis.fr/collections/support-avis-google-nfc) | Plaque (design identique à Reviu) + chevalet | 59,90 € / chevalet 39,90 € | idem (HT/TTC non précisé) | - | Expédition 24-48 h ; remise en main propre autour de Lille | Non | 30 j | Non mis en avant ; support WhatsApp |
| [Viewup](https://viewup.fr/products/presentoir-nfc-connecte-avis-google) | Présentoir PVC, plaque, carte, badge | 24,99 € (barré 29,99 €) | 24,99 € | Duo Google + Instagram 44,99 € | Gratuite dès 50 € | Non ; Viewup+ avec paliers payants | Non précisée | Viewup+ (scans, conversions, IA) |
| [Social Touch](https://socialtouch.fr/produit/plaque-connectee-google-avis/) | Plaque plexi 12x12 | 39 € HT | 46,80 € | « 1 achetée = 1 offerte » ; pack 4 : 99 € HT ([page](https://socialtouch.fr/produit/pack-de-4-plaques-nfc/)) ou 129 € HT (texte d'annonce) | Gratuite, 24 h | Non | Non affichée | Non |
| [Digifeel](https://digifeel.fr/products/plaque-avis-google) | Plaque acrylique 12x12, carte | 29,90 € HT (barré 49,90 €) | 35,88 € | - | Gratuite dès 59 € ; 4 à 7 jours | Non | 30 j + « doublez ou remboursé » + à vie | Configuration via application |
| [Swiipx](https://swiipx.fr/) | Plaque acrylique 3 mm | 29,90 € HT | 35,88 € | 2 : 54,90 € HT ; 5 : 89,90 € HT (17,98 € HT/u) | Point relais gratuit, domicile 4,90 € | Non | 90 j + à vie | Non (« lien direct sans intermédiaire ») |
| [Qoov](https://qoov.fr/plaque-avis-google) | Plaque | 29,90 € (barré 49,90 €) | HT/TTC non précisé | 2 : 54,90 € ; 5 : 99,90 € | Incluse | Non | Satisfait ou remboursé | Lien reprogrammable |
| [MediaPush](https://mediapush.fr/plaque-nfc-avis-google) | Plaque plexi 8x8 | 20 € HT | 24 € | Dégressif jusqu'à 14,50 € HT | Gratuite dès 35 € HT | Option filtrage 1 € HT/mois | 2 ans | Lien modifiable (« Mes plaques ») |
| [Izikard](https://izikard.com/produit/plaque-nfc-avis-google/) | Plaque PVC ou bois, 3 tailles | 25 € HT | 30 € | Jusqu'à 12,50 € HT | 2 à 3 jours | Non | 1 an | **Oui : stats par support + lien modifiable** |
| [Kipful](https://www.kipful.com/nos-produits/support-avis-google/) | Plaque, totem LED, carte | Plaque 29,99 à 49 € ; totem 69 à 89 € | - | - | Offerte | Non | « À vie » | Interface de gestion + stats |
| [CarteBiz](https://cartebiz.fr/) | Plaque, carte | 39,90 € HT (barré 49,90 €) | 47,88 € | - | Gratuite | Non | - | Non |
| [Plakode](https://plakode.fr/plaque/google) | Plaque PVC 12x12 | 24 € | - | 3 : 66 € ; 5 : 105 € ; 10 : 190 € | Calculée au panier | Non | - | Lien reprogrammable |
| [Technee](https://www.technee.fr/) | Plaque ou sticker 12x12, présent sur Amazon | Dès 25,95 € | - | - | - | Non | - | « Option intelligente » de médiation (filtrage) |
| [Digi Touch](https://digi-touch.fr/produit/plaque-nfc-avis-google/) | Plaque plexi 12x12 | 33,33 € HT (barré 50 €) | 40 € | - | Gratuite en 48 h « cette semaine » | Non | - | - |
| [Aflore](https://www.aflore.fr/) (logiciel) | Plaque de comptoir offerte + carte NFC | 49 €/mois | - | - | - | **Oui**, sans engagement, 1er mois offert | - | Réponses IA aux avis par SMS |
| [Guest Suite](https://www.guest-suite.com/blog/technologie-nfc-canal-collecte-avis-clients) (logiciel) | Macaron NFC + questionnaire | Non publié | - | - | - | Oui (plateforme) | - | Tableau de bord |

**Autres vendeurs repérés, moins détaillés :**
- [Unisign](https://unisign.fr/products/support-qr-code-personnalise-nfc-avis-google) : dès 13,90 €.
- [Vizzee](https://vizzee.fr/products/cartes-nfc-avis-google) : carte à 31,20 €.
- [Phanion](https://phanion.fr/products/plaque-nfc-qr-code-avis) : 34,90 €.
- [Richard Lourmet](https://richardlourmet.fr/presentoir-nfc-avis-google/) : agence à Pessac, présentoir A5/A6 personnalisé sur devis, délai 10 jours.
- [WEMET](https://www.wemet.fr/) : surtout des cartes de visite NFC, revendique « +30 000 entreprises ».
- [La Poste Boutique](https://www.laposte.fr/boutique/plaque-google-avis-reviews-qr-code-nfc-rfid-sans-contact-adhesive-vitrine-comptoir-table-12x12cm-gg12fr/p/mp-600193990) : marque Expedy, indisponible au moment du relevé.
- Viewup est aussi présent sur [Metro Marketplace](https://www.metro.fr/marketplace/product/dcb2d8f1-3d78-4298-bf77-41a3c84d018b) (page bloquée).
- **Amazon.fr** (extraits de recherche, non vérifiés) :
  - « Présentoir... NFC & QR » blanc à 24,90 €, 4,5/5 sur 36 évaluations ([lien](https://www.amazon.fr/Pr%C3%A9sentoir-%C3%A9cran-panneau-Google-blanc/dp/B0DTHZNV33)) ;
  - version noire à 24,90 €, 4,4/5 sur 49 évaluations ([lien](https://www.amazon.fr/Avis-Pr%C3%A9sentoir-%C3%A9cran-panneau-Google/dp/B0DTHTJ16S)) ;
  - plaque 12x12 à 21,50 €, 4,6/5 sur 217 évaluations ([lien](https://www.amazon.fr/Plaque-Code-pour-Google-Avis/dp/B0CWJF558T)) ;
  - présentoir à 72 € ([lien](https://www.amazon.fr/Pr%C3%A9sentoir-programm%C3%A9-%C3%A9tablissement-Collectez-r%C3%A9f%C3%A9rencement/dp/B0DBLWT3BH)) ;
  - marques présentes : Technee, Taraffice, MESSAGENES, Social-Business.

---

## 3. Fiches concurrents (13)

### 3.1 CollecteAvis : le plus proche de Reviu
- **Offre** : plaque au design identique à Reviu à 59,90 € ; « Booster Avis Google - Chevalet Sans Contact » 7,5x12 cm à 39,90 € (blanc ou noir). Code « GUIDE10 ». Encodage NFC, audit et guide métier inclus, support WhatsApp « humain » ([collection](https://collecteavis.fr/collections/support-avis-google-nfc)).
- **Promesse** : « Vos clients sont satisfaits mais ne laissent pas d'avis ? Ce support avis Google se pose sur votre comptoir en 2 minutes. » / « Dix secondes, un nouvel avis. Paiement unique, sans abonnement. »
- **Preuve sociale** : « 650+ commerçants », « 2 500+ avis générés ». Études de cas locales nommées : Chick'end Café de 3,6 à 4,3 étoiles ; O'Poulet Grillé +47 avis.
- **Pubs** : aucune annonce trouvée sur Google Ads Transparency pour collecteavis.fr.
- **À retenir** : ancrage fort sur Lille et Roubaix, avec des cas clients chiffrés et nommés. C'est le modèle de preuve sociale locale que Reviu peut reproduire à Nîmes.

### 3.2 Viewup : concurrent direct sur le présentoir
- **Offre** : présentoir PVC 15x10,5 cm à 24,99 € (barré 29,99 €), plaque, carte (14,99 €), badge (7,99 €), gamme Instagram et multi-liens ([accueil](https://viewup.fr/), [présentoir](https://viewup.fr/products/presentoir-nfc-connecte-avis-google), prix vérifiés dans le JSON Shopify). Livraison gratuite dès 50 €.
- **Viewup+** : statistiques de scans, alertes, réponses IA, analyse concurrentielle, SMS. Paliers de 20 à 100 SMS par mois, prix non affiché ([guide](https://viewup.fr/blogs/infos/collecter-des-avis-google-en-2026-le-guide-complet-nfc-qr-code-et-sms)).
- **Promesse** : « Des avis en 5 secondes », « Boostez votre e-réputation », « Un outil discret, élégant et redoutablement efficace ».
- **Preuve sociale** : 4,9/5 sur 96 avis ; logos Célio, Optic 2000, Century 21, Audi, BYD, Popeyes, ORPI.
- **Visuel** : blanc ou noir, présentoir en L, citation « Laissez-nous un avis sur Google », marque violet-rose.
- **Pubs** : annonceur Google vérifié (FR). 14 créations entre le 17/09/2025 et le 29/09/2026, dont 2 vidéos, décrites en 4.2 ([Transparency](https://adstransparency.google.com/advertiser/AR15703164096541097985?region=FR)).
- **TikTok** : @viewup_official, 23 abonnés, 9 vidéos.

### 3.3 Social Touch : le « leader » historique
- **Offre** : plaque plexi 12x12, 4 mm, à 39 € HT, livraison gratuite en 24 h. Promo rentrée « 1 Plaque Achetée = 1 Plaque OFFERTE » ([accueil](https://socialtouch.fr/), [produit](https://socialtouch.fr/produit/plaque-connectee-google-avis/)).
- **Promesse** : « La plaque NFC indispensable pour votre entreprise » / « Développez vos avis Google et votre communauté instantanément ».
- **Preuve sociale** : « Plus de 15000 entreprises » ; logos Atol, Franck Provost, KFC, Campanile ; « +25 % d'avis Google ».
- **Trustpilot** : un seul avis, 3,3/5. Plainte : QR code **blanc sur fond noir illisible** sur plusieurs téléphones ([Trustpilot](https://fr.trustpilot.com/review/socialtouch.fr)).
- **Pubs** : annonceur « ML COMPANY », 14 créations, **en diffusion continue du 24/11/2022 au 29/09/2026**. Textes : « Paiement unique, livraison rapide, aucun abonnement requis », « Fabrication Française » ([Transparency](https://adstransparency.google.com/?region=FR&domain=socialtouch.fr)).
- **TikTok** : @socialtouch.fr, **5 406 abonnés, 184 400 j'aime, 112 vidéos**. C'est le seul concurrent avec une vraie présence TikTok.

### 3.4 Digifeel : le plus agressif en marketing
- **Offre** : plaque 29,90 € HT (barré 49,90 €), « 0 frais mensuels », livraison gratuite dès 59 € ([produit](https://digifeel.fr/products/plaque-avis-google), [accueil](https://digifeel.fr/)).
- **Promesse** : « Doublez votre nombre d'avis Google en 30 jours ou nous vous remboursons ! », « Obtenez des avis en seulement 3 secondes ! ». Garantie à vie avec remplacement.
- **Preuve sociale** : « +100,000 Entreprises », « 115+ pays », « 4.8, +700 avis vérifiés » ; presse citée (Capital M6, Ouest-France, Le Télégramme). Étude de cas : Quick, 177 restaurants, « plus de 35 000 avis en 5 mois ».
- **Pubs** : 21 créations depuis le 17/05/2023. Textes et images d'annonce : « N°1 en France », « Made in France - Garantie À Vie », « Passez 1er sur Google », « DOUBLEZ VOS AVIS GOOGLE EN 90 JOURS », « Jusqu'à -65% de remise ».
- **Tests d'accroche** : deux vidéos intitulées « Digifeel FR - YT - Hook 1 » et « Hook 3 ».
- **Constat factuel sur les annonceurs** : les annonces vers digifeel.fr sont diffusées par des comptes nommés « HV CORP », « Phạm Thị Châu », « WESTWIND KCB Limited » et « LilBake Country » ([Transparency](https://adstransparency.google.com/?region=FR&domain=digifeel.fr)). Cela contraste avec le discours « Made in France ». La vidéo affiche aussi « +36 000 business » contre « +100 000 » sur le site. **L'identité réelle de l'exploitant n'a pas été vérifiée.**
- **Réseaux** : TikTok 16 abonnés, 1 vidéo.

### 3.5 Swiipx : jeune marque tournée vers le référencement
- **Offre** : plaque acrylique 3 mm, NTAG215. 1 = 29,90 € HT ; 2 = 54,90 € HT ; 5 = 89,90 € HT. « Garantie à vie + 90 jours satisfait ou remboursé », « fabriquée en France », expédiée sous 24 h. Date de création déclarée dans les données structurées du site : 2026-02 ([accueil](https://swiipx.fr/)).
- **Promesse** : « 10s pour un avis », « 3x plus d'avis en 30 jours », « 0 € d'abonnement ». Argument « lien direct sans intermédiaire ».
- **Preuve sociale** : faible, 4,8/5 sur 4 avis. Revendique « Plus de 500 restaurants » sur [sa page restaurant](https://swiipx.fr/secteur/restaurant).
- **Contenu** : blog très fourni, avec des pages par métier et une page prix qui attaque les modèles à abonnement ([blog prix](https://swiipx.fr/blog/prix-plaque-nfc-avis-google)).
- **Pubs** : aucune trouvée. Le compte TikTok @swiipx n'appartient pas à la marque.

### 3.6 Qoov : une agence qui vend aussi la plaque
- **Offre** : 29,90 € (barré 49,90 €), 5 pour 99,90 €. « Plaque à vie, sans abonnement », lien reprogrammable gratuit ([produit](https://qoov.fr/plaque-avis-google)).
- **Wording** : « Collez-la, et regardez vos avis grimper », « Simple comme bonjour », « moins de 5 secondes ».
- **Preuve sociale** : « 500+ professionnels », « 4.9/5 », « +320 % » d'avis en moyenne.
- **Pubs** : annonceur « Qoo Group », mars et avril 2026. Les pubs vendent **l'agence** (« Dès 59€/mois Sans Engagement. Site pro, SEO local ») avec une mascotte 3D, pas la plaque. **La plaque sert de produit d'appel à l'offre agence.**

### 3.7 MediaPush : prix plancher et filtrage
- **Offre** : 20 € HT, dégressif jusqu'à 14,50 € HT, garantie 2 ans, livraison gratuite dès 35 € HT ([produit](https://mediapush.fr/plaque-nfc-avis-google)).
- **Promesse** : « Multipliez vos avis Google par 5 ».
- **Option « Filtre Anti Mauvais Avis +1€ HT/mois »** : les 4-5 étoiles vont sur Google, les 1-3 étoiles vers un retour privé.
- **Preuve sociale** : « 3000+ clients », « 4.9/5 », « Best-seller 2025 ».
- **Pubs** : 1 création (annonceur DIGITALMOOVE), du 17/06/2023 au 29/09/2026.

### 3.8 Technee : Amazon et « médiation »
- **Offre** : dès 25,95 €. Option « intelligente (recommandée) » : un client mécontent est redirigé vers l'e-mail du gérant plutôt que vers Google ([FAQ](https://www.technee.fr/blog-actualite-technologique/questions-frequentes-plaque-avis-google)).
- **Présence** : Amazon.fr ([fiche](https://www.amazon.fr/TECHNEE-Plaque-Google-Connect%C3%A9e-12x12cm/dp/B0CQRGNLFD)).

### 3.9 Izikard : le plus proche de l'Espace Reviu
- **Offre** : plaque PVC ou bois en 3 tailles, 25 € HT (30 € TTC), dégressif jusqu'à 12,50 € HT, garantie 1 an ([produit](https://izikard.com/produit/plaque-nfc-avis-google/)).
- **Espace** : **lien modifiable à vie depuis l'application web, statistiques de scans par support, suivi multi-sites**.
- **Preuve sociale** : 4,9/5 sur 77 avis.
- **Pubs** : 5 annonces texte orientées B2B (« Devis Pro Sous 24h - Plaques NFC Avis Google », « Made in France »), jusqu'au 29/09/2026.

### 3.10 Kipful
- **Offre** : plaque 29,99 à 49 €, totem LED 69 à 89 €, carte avis 25 à 39 €. Interface de gestion avec statistiques et liens modifiables ([page](https://www.kipful.com/nos-produits/support-avis-google/)). Note Google 4,6/5 sur 45 avis.
- **Pubs** : 56 créations depuis le 22/12/2022, surtout pour la carte de visite NFC.
  - Accroches : « Black Friday = 1 carte offerte », « 100 % Made in France », « Totem Avis Google ».
  - Une annonce **répond à l'objection iPhone** : « Guide Complet : Activer le NFC sur iPhone et Téléphone Android ».

### 3.11 CarteBiz
- **Offre** : plaque 39,90 € HT (barré 49,90 €), carte dès 14,90 € HT, livraison gratuite ([accueil](https://cartebiz.fr/)).
- **Promesse** : « Libérez le Potentiel des Avis Google ». Revendique des avis « multipliés par 7 ».
- **Témoignage** : « Mes clients me demandent tous où je l'ai achetée! ».

### 3.12 Aflore : le logiciel qui offre la plaque
- **Offre** : 49 €/mois pour un « attaché de réputation » IA qui répond aux avis, validation par SMS ([accueil](https://www.aflore.fr/)).
- **Inclus** : « Plaque de comptoir offerte dès l'essai », carte NFC ; « Aucun engagement de durée, aucune reconduction piège ».
- **À retenir** : dans le modèle logiciel, la plaque devient un produit d'appel gratuit. Sur 5 ans, l'écart avec l'achat unique Reviu est énorme.

### 3.13 Guest Suite (logiciel e-réputation)
- Propose un « macaron explicite de demande d'avis doté d'une puce NFC » qui ouvre un questionnaire de satisfaction, dans son offre de plateforme. Prix non publié ([article](https://www.guest-suite.com/blog/technologie-nfc-canal-collecte-avis-clients)).

### Substitut gratuit : Google lui-même
Depuis le **4 mars 2025**, la fiche d'établissement Google génère gratuitement un lien et un QR code d'avis ([Abondance](https://www.abondance.com/20250305-949637-qr-codes-google-business-profile.html), [Aide Google](https://support.google.com/business/answer/16816815?hl=fr)). L'ancien Kit Marketing de Google (affiches, stickers) n'est plus disponible ([Yesweblog](https://yesweblog.fr/en/google-marketing-kit-no-longer-available/)).

---

## 4. Publicités observées

### 4.1 Google Ads Transparency (tous formats, tous pays, relevé du 29/09/2026)

| Domaine | Annonceur(s) | Créations | Texte / image / vidéo | Première et dernière diffusion |
|---|---|---|---|---|
| socialtouch.fr | ML COMPANY | 14 | 11 / 2 / 1 | 24/11/2022 au 29/09/2026 |
| viewup.fr | Viewup | 14 | 4 / 8 / 2 | 17/09/2025 au 29/09/2026 |
| digifeel.fr | HV CORP + 3 autres | 21 | 8 / 11 / 2 | 17/05/2023 au 29/09/2026 |
| kipful.com | KIPFUL | 56 | 51 / 3 / 2 | 22/12/2022 au 10/09/2026 |
| izikard.com | Solutions Digitales Intégrées | 5 | 5 / 0 / 0 | 16/10/2023 au 29/09/2026 |
| qoov.fr | Qoo Group | 5 | 2 / 1 / 2 | 13/03/2026 au 01/04/2026 |
| mediapush.fr | DIGITALMOOVE | 1 | 0 / 1 / 0 | 17/06/2023 au 29/09/2026 |
| swiipx.fr, collecteavis.fr, cartebiz.fr, plakode.fr, technee.fr, aflore.fr | - | 0 | - | Aucune annonce trouvée par domaine. Cela ne prouve pas qu'il n'y en a pas |

### 4.2 Vidéos publicitaires décryptées (images clés lues sur les miniatures YouTube)

| Vidéo | Période | Format | Structure et wording |
|---|---|---|---|
| **Viewup, « Plaque pour avis Google Viewup »** ([YouTube](https://www.youtube.com/watch?v=IVnKMnRy9cQ)) | 07 au 13/12/2025 | 9:16, récit | Personnage de coiffeur, rendu photoréaliste très lisse (probablement IA, impression non vérifiée). « CHARLY N'ARRIVE PAS À RÉCOLTER DES AVIS » puis « C'EST QU'IL SE RETROUVE TOUT EN BAS DU CLASSEMENT » puis « MAINTENANT APRÈS CHAQUE COUPE, CHARLY DEMANDE UN AVIS » puis « ET COMMANDEZ VOTRE PLAQUE SUR VIEWUP.FR ». Sous-titres en majuscules, mot-clé surligné en violet |
| **Viewup, « Plaque avis Google Viewup »** ([YouTube](https://www.youtube.com/watch?v=pXaGtRFPKXA)) | 01 au 27/10/2025 | 9:16, démo d'application | Maquette d'iPhone sur fond dégradé rose-violet. Écran « Objets NFC » avec compteurs (17 / 10 / 59 %), sous-titre « DEPUIS NOTRE SITE » |
| **Digifeel, « Hook 1 »** ([YouTube](https://www.youtube.com/watch?v=SFNdZwy8P9Q)) | 08/06/2025 au 28/07/2026 | 9:16, UGC | « Voici Sarah » (commerçante qui tient la carte), puis « de nouveaux clients entrent chaque semaine ! », puis « +36 000 BUSINESS - Des milliers de commerçants utilisent déjà Digifeel » |
| **Digifeel, « Hook 3 »** ([YouTube](https://www.youtube.com/watch?v=szLOS118Vbg)) | 27/08/2025 au 28/07/2026 | 9:16, UGC | Même corps que Hook 1 avec une accroche différente. Traite une objection : « ❌ Pas besoin d'avoir un site web ». Diffusion longue, ce qui suggère une créa gagnante (non vérifié) |
| **Social Touch, « La plaque NFC Facebook »** ([YouTube](https://www.youtube.com/watch?v=dECG7N40YQY)) | 11/06/2024 au 17/09/2026 | 16:9 | Main qui tient la plaque bleue, cadre rose, écran texte avec faute d'accord : « La plaque NFC permettent aux clients d'approcher leur smartphone pour accéder à votre page » |

**Lecture** : les pubs vidéo concurrentes sont de trois types. Récit IA « problème puis solution », UGC avec tests d'accroches, ou démo statique. **Aucune ne montre en temps réel le geste réel** (le téléphone approché, la notification iOS, la page d'avis qui s'ouvre, l'avis publié), et aucune ne montre l'effet sur Google Maps.

### 4.3 Textes d'annonces Google : motifs récurrents
- **Classement** : « Passez en tête sur Google ! », « Passez 1er sur Google », « passez devant vos concurrents sur Google, sans effort » (Viewup, Digifeel).
- **Vitesse** : « Des avis en 5 secondes » (Viewup), « en 3 secondes » (Digifeel).
- **Modèle économique** : « Paiement unique, livraison rapide, aucun abonnement requis » (Social Touch).
- **Origine** : « Made in France » (Digifeel, Izikard, Kipful), « Fabrication Française » (Social Touch).
- **Promotions** : « -65 % », « 1 acheté = 1 offert », « Black Friday ».
- **Leadership** : « N°1 en France » (Digifeel).

### 4.4 Organique YouTube et TikTok
Recherche YouTube « plaque avis google nfc » ([résultats](https://www.youtube.com/results?search_query=plaque+avis+google+nfc)) :
- La vidéo la plus vue est [WEMET « Plaque NFC Avis Google - Comment ça marche ? »](https://www.youtube.com/watch?v=WUhnJG5Corg), avec 276 106 vues.
- Viennent ensuite des tutoriels de configuration, par exemple [Taraffice](https://www.youtube.com/watch?v=yPhxRv3R8ek) (32 384 vues).
- On trouve aussi des vidéos d'argent facile comme [« Comment gagner de l'argent en vendant des cartes d'avis Google »](https://www.youtube.com/watch?v=A2EGYpu1eaM) (22 173 vues, il y a 4 semaines) ou [« Comment J'ai Gagné 8730€... (SEPTEMBRE 2026) »](https://www.youtube.com/watch?v=cx0FhaEUJcg).
- **Signal** : afflux de revendeurs amateurs, donc risque que les commerçants perçoivent le produit comme un gadget ou une combine.

TikTok : seul Social Touch compte (5,4 k abonnés). Viewup, Digifeel et les autres sont quasi absents en organique.

### 4.5 À vérifier à la main (non fait, accès bloqué)
- [Meta Ad Library](https://www.facebook.com/ads/library/), pays France. Requêtes : « avis google », « plaque nfc », « présentoir avis », « plaque avis google », puis les pages Social Touch, Viewup, Digifeel, Swiipx, Qoov, MediaPush, Kipful.
- TikTok Creative Center (Top Ads, FR), mot-clé « avis google ».

---

## 5. (1) Messages et accroches dominants sur le marché français

1. **La vitesse chiffrée** : 3 s (Digifeel), 5 s (Viewup, Qoov), 10 s (Swiipx, CollecteAvis).
2. **Le classement et la visibilité** : « Passez 1er / en tête sur Google », « Boostez votre visibilité locale ».
3. **« Sans abonnement / paiement unique / à vie »** : universel chez les vendeurs de plaques.
4. **Les multiplicateurs sans source** : x2 (Digifeel), x3 (Swiipx), x5 (MediaPush, WEMET), x7 (CarteBiz), +320 % (Qoov), +25 % (Social Touch).
5. **Les gros chiffres de clients** : 100 000 (Digifeel), 15 000 (Social Touch), 3 000 (MediaPush), 650 (CollecteAvis), 500 (Qoov).
6. **Les logos de grandes enseignes** : KFC, Franck Provost, Audi, Célio, Optic 2000.
7. **Le Made in France**, et la fausse urgence : prix barrés (-40 %, -65 %), « quantités limitées ».
8. **Le récit du commerçant frustré** : le coiffeur « Charly » chez Viewup, « Sarah » chez Digifeel.
9. **Le client content qui oublie de laisser un avis** : « 85% des Clients Disent oublier... » ([Digi Touch](https://digi-touch.fr/produit/plaque-nfc-avis-google/)), « Vos clients sont satisfaits mais ne laissent pas d'avis ? » (CollecteAvis).

## 6. (2) Ce qui est surexploité ou cliché

- **La course aux secondes** : tout le monde a un chiffre, donc plus personne n'en a. Il n'est crédible que s'il est montré en temps réel à l'écran.
- **« N°1 » ou « leader »** revendiqué par deux acteurs à la fois (Digifeel, Social Touch).
- **Multiplicateurs et pourcentages invérifiables** : une start-up sans ventes ne peut pas en afficher. Des chiffres inventés relèvent des pratiques commerciales trompeuses ([DGCCRF](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/pratiques-commerciales-trompeuses-les-cles-pour-les-reconnaitre-et-sen-premunir)).
- **Prix barrés permanents** (29,90 € barré à 49,90 € chez Digifeel, Qoov, CarteBiz) : banalisés.
- **Photo produit type** : plaque blanche, logo G, 5 étoiles, « Approchez votre téléphone / Scannez-moi ». Gabarit générique partagé par Viewup, CollecteAvis, Amazon, et le produit Reviu lui-même.
- **Avatars ou histoires au rendu IA** (Viewup) et sous-titres majuscules à mot surligné : format TikTok standard, faible mémorisation de marque.
- **« 5 étoiles » dans le discours** (« Obtenez les 5 étoiles », « avis 5 étoiles ») : cela promet des avis positifs, à la limite des règles de Google.

## 7. (3) Espaces libres et différenciation pour Reviu

| Levier | Constat concurrentiel | Angle Reviu recommandé |
|---|---|---|
| **Prix final lisible** | Beaucoup affichent en HT, avec un seuil de livraison entre 35 et 60 € | « 29,90 € TTC. Livré. C'est tout. » Prix final, livraison offerte dès 1 présentoir. **Ne pas dire « le moins cher »** : Viewup est à 24,99 €, MediaPush à 24 € TTC, et Swiipx, Qoov et Plakode sont plus bas en lot de 5 |
| **Espace inclus, 0 €/mois** | Les logiciels facturent les statistiques et la gestion (Aflore 49 €/mois, Viewup+ payant). Les vendeurs sans abonnement n'ont souvent aucun tableau de bord | « Les statistiques d'un logiciel, sans l'abonnement » : scans NFC et QR distingués, lien modifiable à tout moment. **Seul Izikard offre l'équivalent**, et il vise surtout le B2B et le volume |
| **Lien modifiable** | Swiipx vante le « lien direct sans intermédiaire ». Digifeel avertit qu'une redirection hébergée peut cesser si le fabricant s'arrête ([Digifeel](https://digifeel.fr/blogs/infos/plaque-avis-google-nfc-est-ce-que-ca-marche-vraiment)) | Transformer ce point en bénéfice : vous déménagez, changez de fiche ou ouvrez un 2e établissement, et vous changez le lien depuis votre espace sans racheter. **Réponse à préparer** sur la pérennité, car Reviu passe par une redirection `/r/[code]` (`/home/user/reviu/src/app/r/[code]`) |
| **Conformité Google** | MediaPush et Technee vendent un filtrage des avis négatifs. Google interdit de « solliciter des avis positifs de façon sélective » et d'« exercer une pression » pour un avis sur place ([règles Google](https://support.google.com/contributionpolicy/answer/7400114?hl=fr)) | « Tous vos clients, aucun filtre : des avis que Google garde. » À placer en réassurance : fin de vidéo, landing, commentaires. Reviu le dit déjà dans sa FAQ (`src/app/boutique/page.tsx`) |
| **Format présentoir** | Majorité de plaques adhésives. Sur comptoir inox, il faut un présentoir, car le métal gêne la puce (extrait de recherche, non vérifié sur source primaire) | « Posez-le, c'est prêt » : aucun collage, déplaçable de la caisse à la table, compatible comptoir métal |
| **Démonstration réelle** | Aucune pub concurrente ne montre la séquence réelle en continu | Plan-séquence en motion : téléphone approché, notification iOS, page d'avis Google, étoiles, avis publié, compteur de l'Espace Reviu qui monte |
| **Humain et local** | Preuve sociale par gros chiffres et logos, parfois incohérents (Digifeel : 36 000 contre 100 000) | Fondateur face caméra, Nîmes, « on active votre présentoir avec vous », premiers commerçants nîmois nommés dès qu'ils existent (modèle CollecteAvis à Lille) |
| **Garantie** | Swiipx 90 j + à vie ; Digifeel « doublez ou remboursé » + à vie | Garder « 30 jours satisfait ou remboursé » visible. **À arbitrer** : passer à 60 ou 90 jours, ou ajouter une garantie de remplacement à vie, pour ne pas être en dessous |
| **Rapport qualité-prix** | Le même visuel est vendu 59,90 € chez CollecteAvis | Justifie un positionnement « qualité identique, prix juste ». **Ne pas nommer le concurrent** : la publicité comparative est encadrée (non vérifié juridiquement ici) |

## 8. (4) Objections des commerçants : réponses des concurrents et réponse Reviu

| Objection | Réponse des concurrents | Réponse Reviu recommandée (vidéo et landing) |
|---|---|---|
| « Google me donne un QR code gratuit » | Digifeel : la plaque est toujours visible, un QR papier s'abîme | « Le QR, Google vous le donne. Le geste d'une seconde, les stats et un support qui dure, c'est Reviu. » Cohérent avec l'outil QR gratuit de reviu.fr |
| « Mes clients ne connaissent pas le NFC » / iPhone | QR de secours, « 90 % des smartphones » (Digifeel) ; guide d'activation iPhone (pub Kipful) | Montrer les deux gestes. Côté iOS, la lecture en arrière-plan fonctionne à partir de l'**iPhone XS**, téléphone déverrouillé, avec une **notification à toucher** ([Apple Developer](https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading)). L'animation doit montrer cette notification pour rester honnête |
| « Ça marche vraiment ? » | Multiplicateurs, « doublez ou remboursé », cas Quick (Digifeel). Digifeel admet qu'il faut présenter la plaque au client | Démonstration plus « 30 jours satisfait ou remboursé ». Conseil d'usage : une phrase neutre au paiement. Aucun chiffre inventé |
| « Encore un abonnement » | « 0 € d'abonnement » partout ; Swiipx chiffre les abonnements de 600 à 1 800 € sur 5 ans (sans source) | « 0 €/mois, espace inclus ». Montrer le prix final à l'écran |
| « Et si vous fermez ? » (redirection hébergée) | Swiipx et Digifeel jouent la carte du lien direct | **Angle mort de Reviu : réponse à écrire** (engagement de maintien du lien, ou reprogrammation de la puce en lien direct Google en cas d'arrêt) |
| « Risque de pénalité Google ou faux avis » | Digifeel rappelle l'interdiction du filtrage et les sanctions (2 ans, 300 000 €, d'après [INC](https://www.inc-conso.fr/content/pratiques-commerciales-trompeuses-et-agressives-la-dgccrf-condamne-deux-entreprises) et [Haas Avocats](https://info.haas-avocats.com/droit-digital/faux-avis-positifs-sur-internet-attention-aux-sanctions)) ; d'autres vendent quand même le filtre | « Conforme aux règles Google : tous vos clients, aucun filtre, aucune contrepartie. » Dans la vidéo : pas de personnel qui insiste auprès du client |
| « C'est compliqué à installer » | « Configurez en 20 secondes » (Digifeel), « installation 30 secondes » (Qoov), « préprogrammé » (Swiipx) | Présentoir livré prêt, activation guidée en 2 minutes (`activate-flow.tsx`) |
| « Le QR ne scanne pas » | Plainte Trustpilot contre un QR blanc sur noir (Social Touch) | Le QR Reviu est noir sur blanc : le montrer scanné net en gros plan |
| « Mes clients n'ont pas de compte Google » | Digifeel : « 93 % » des possesseurs de smartphone en ont un (non sourcé) | Ne pas citer ce chiffre sans source primaire |
| « Gadget, produit de revendeur » | Logos et « Made in France » | Marque et visage (fondateur, Nîmes), qualité acrylique en gros plan, espace client réel à l'écran |
| « Livraison lente » | « Expédié sous 24 h » (Social Touch, Swiipx) | Afficher un délai précis si Reviu peut le tenir (**donnée à confirmer côté Reviu**) |

## 9. Ce que ça implique pour la vidéo 9:16

- **Accroches testables**, non utilisées par les concurrents :
  - la friction : les manipulations nécessaires aujourd'hui pour laisser un avis, contre un seul geste (Swiipx parle de « cinq à sept manipulations » sans source : à montrer plutôt qu'à chiffrer) ;
  - la perte : le client ravi qui repart sans laisser de trace ;
  - le visuel « 0 €/mois » en face d'un abonnement barré.
- **Preuve par la démonstration**, pas par les chiffres : séquence réelle de bout en bout. Ne jamais afficher « 5 étoiles garanties ».
- **Rendre le produit reconnaissable comme Reviu** : le gabarit est partagé avec CollecteAvis. Mettre en avant « propulsé par Reviu.fr », l'interface de l'Espace Reviu et le prix TTC en signature.
- **Réassurance en fin de vidéo** : 29,90 € TTC, livraison offerte, sans abonnement, 30 j remboursé, iPhone et Android, conforme Google.
- **Éviter** : fausse urgence et prix barrés permanents, « N°1 », avatars IA, faute d'accord à l'écran, personnel qui presse le client, chiffres sans source.
- **Risque à valider** : tous les concurrents utilisent le logo « G » de Google en pub. Le risque de refus ou de plainte pour usage de marque sur Meta et TikTok n'a pas été vérifié.

## 10. Non vérifié ou à contrôler

- Toute présence publicitaire sur Meta et TikTok (accès bloqué).
- Les données Amazon (extraits de recherche seulement) et Etsy (bloqué).
- HT ou TTC pour Qoov, CollecteAvis, Viewup, Plakode et Technee : prix relevés tels qu'affichés, sans mention explicite.
- Tarifs de Viewup+, de Guest Suite et de l'« option intelligente » Technee (non publiés).
- Marques citées comme « à abonnement » par Swiipx (Reputaz, Fivvy) : aucune source primaire trouvée.
- Tous les chiffres de clients et d'efficacité des concurrents : déclaratifs.
- Identité réelle de l'exploitant de Digifeel : seuls les noms d'annonceurs de Google Ads Transparency ont été constatés.
- L'effet d'une surface métallique sur la puce NFC vient d'un extrait de recherche, pas d'une source primaire.