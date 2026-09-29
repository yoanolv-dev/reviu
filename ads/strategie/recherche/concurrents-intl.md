# Benchmark international des vidéos "tap-to-review" (avis Google par NFC) : hooks, structures et leçons pour la pub Reviu

## 0. Méthode et limites

- **Corpus.** 30 vidéos TikTok analysées une par une : statistiques publiques, sous-titres automatiques et planches d'images extraites toutes les 0,5 s sur les 3 premières secondes, puis sur toute la durée. S'y ajoutent une trentaine de Shorts YouTube, pour lesquels je n'ai que le titre, la chaîne et les vues, les pages de 12 marques et les recommandations publiées par TikTok et Meta. Toutes les stats ont été relevées le **29/09/2026**.
- **Ce qui a bloqué :**
  - Bibliothèque publicitaire Meta : erreur HTTP 403.
  - Top Ads du TikTok Creative Center : l'API répond `"no permission"`.
  - Bibliothèque publicitaire TikTok (DSA) : l'API répond `"system busy"`.
  - YouTube : captcha "Sign in to confirm you're not a bot". Pour YouTube, je n'ai donc que titre, vues et chaîne (via la recherche et l'oEmbed), jamais le contenu des vidéos.
  - Instagram et les données dynamiques d'Amazon (ventes, classement) : pas accessibles.
  - Pages "discover" de TikTok : elles ne s'affichent pas sans JavaScript.
- **Organique ou payant ?** On ne peut pas savoir si une vidéo a été sponsorisée (Spark Ads ou Promote). J'utilise un indice : le **taux de likes**. En dessous de 0,3 %, c'est très probablement une diffusion payée. Entre 2,5 et 6 %, c'est un succès organique. C'est une inférence de ma part, pas une donnée.

---

## 1. Les acteurs du marché (hors France) et leur présence vidéo

| Marque (pays) | Offre et prix vérifiés | Promesse principale | Présence vidéo observée |
|---|---|---|---|
| **ZappyCards** (US) | Présentoir 40 $ ; 30 $ l'unité par 2 ; 25 $ par 5 ; 20 $ par 10. Garantie 90 jours "More Reviews" ([page produit](https://zappycards.com/products/nfc-google-review-stand)) | "Tap. Review. Done." / "Turn every job into a 5-star review" ; "If your review count hasn't gone up in 90 days we refund the order. Your count is public: nothing to argue over" (ponctuation adaptée) ([site](https://zappycards.com/)) | Compte TikTok : 91 abonnés pour 99 vidéos ; vidéos récentes entre 235 et 888 vues ([embed profil](https://www.tiktok.com/embed/@zappycards)). Les avis clients affichés sur la page produit sont des captures de commentaires Facebook, ce qui laisse penser que la marque fait de la pub Meta (non vérifiable). Landing dédiée au trafic payant : "increase your google reviews on autopilot", pack à 197,99 $ ([LP](https://zappycards.com/pages/bundle-offer-lp)). Les chiffres de preuve sociale se contredisent selon les pages : 100 000+, 55 000+ et 10 000+ entreprises. |
| **Popcard** (popcard.io, origine non vérifiée) | PopStand 49,90 $ (prix barré 99,90 $), carte 39,90 $ ; "Double your Google reviews in 30 days" ([site](https://www.popcard.io/)) | Chiffre obtenu en une journée | **Le plus gros volume du niche** : 5,0 M, 1,4 M et 1,2 M de vues sur un même gabarit (voir §2). Les vidéos ont été tournées en francophonie : l'écran Google final affiche "Avis publié. Merci !" (vu sur les images de [cette vidéo](https://www.tiktok.com/@popcard.uk/video/7232024833159122203)). |
| **Reviews Card** (UK) | Présentoir 36 £ (prix barré 60 £), "One Time Payment - No Monthly Fees", "12,500+ Orders" ([page produit](https://www.reviewscard.com/products/review-stand-nfc-qr-code)) | "Collect More Reviews In Seconds" | 266 abonnés TikTok ; meilleure vidéo à 89,2 K vues ([embed](https://www.tiktok.com/embed/@reviewscarduk)) |
| **TAPro** (US/CA) | Présentoirs 30 à 50 $, "15,500+ BUSINESSES SERVED", "READY IN 30 SECONDS" ([site](https://taprocard.com/)) | Rapidité et compatibilité | Tutoriels YouTube de 5 min (26,9 K vues) ([recherche YouTube](https://www.youtube.com/results?search_query=tap+to+review+google+card)) |
| **TapFive** (US/AU) | Bio TikTok : "75,000+ businesses \| 7M+ reviews \| 0 fees" | Volume | 7 abonnés TikTok ([profil](https://www.tiktok.com/@tapfivestars)) |
| **Capture Card** (US) | Carte 58 $ (prix barré 116 $) ([site](https://www.capturecard.co/products/the-capture-card-google-review-card)) | "One Touch Google Reviews" | Short YouTube de 16 s à **284 753 vues** ([LadSbggHO7g](https://www.youtube.com/shorts/LadSbggHO7g)) |
| **Tapstar** (ES) | "Sin suscripciones y con 30 días para probarlo sin compromiso" (sans abonnement, 30 jours pour tester sans engagement, [description TikTok](https://www.tiktok.com/embed/@tapstar.es)) ; 34,90 € selon un extrait de moteur de recherche, prix non vérifié sur la page ([tapstar.es](https://tapstar.es/en/products/expositor-resenas-google)) | "Reseñas de 5 estrellas en segundos" (avis 5 étoiles en quelques secondes) | Sketch à **396,1 K vues** (voir §2) |
| **BiiCards** (MX) | Kit de 5 cartes | "Un solo toque. Sin apps." (un seul geste, sans appli) | 30,5 K vues avec 5,8 % de likes |
| **AvisTap** (Suisse romande) | Cartes NFC | "Un simple TAP. Un avis Google. C'est fait." | 15,7 K abonnés pour seulement 2 vidéos ([embed](https://www.tiktok.com/embed/@avistap1)) |
| **TAPiTAG** (IE) | Présentoirs et cartes | Gêne de demander un avis | 1 296 abonnés, vidéos sous les 1 K vues |
| DE / IT / AU / CA | DE : bewertungstools.de dès 29,99 €, nfc-tag-shop.de dès 52,90 €. IT : RecensioniOK 69 €, Basta Un Tap et Golden Graphic entre 23 et 45 €. Tous ces prix viennent d'extraits de moteur de recherche, non vérifiés ([DE](https://www.nfc-tag-shop.de/NFC-Smart/Google-Bewertung-einfach-mit-NFC/), [IT](https://taprecensioni.it/)). AU : reviewstand.com.au, reviewup, tapforreview ([AU](https://www.reviewstand.com.au/)). CA : CAN-TAP, One Tap Only ([CA](https://can-tap-verified.com/)). | Même promesse partout | Aucune vidéo notable trouvée |

**Constat structurant.** Les comptes de marques ont une audience organique quasi nulle : 7 abonnés pour TapFive, 91 pour Zappy, 266 pour Reviews Card. La viralité organique de la catégorie vient des **revendeurs "side hustle"** qui filment leurs démarchages de commerçants :

- scanpraise : 6 774 abonnés, 276,3 K likes ;
- rivley_digital : 2,2 M de vues avec seulement 3 vidéos ;
- realdealvendors_ : 64,8 K abonnés.

Sources : [scanpraise](https://www.tiktok.com/embed/@scanpraise), [rivley_digital](https://www.tiktok.com/embed/@rivley_digital).

Deux conséquences pour Reviu :
1. **La conversion passera par la pub payante**, avec des créas qui ont l'air natives.
2. **Les commerçants voient déjà des cartes NFC à 0,42 €** sur le TikTok francophone. La vidéo [skyvod31](https://www.tiktok.com/@skyvod31/video/7278554029234375969) (24,2 K vues) montre une capture Amazon "50 pièces NFC Cartes... 20,99 € (0,42 €/unité)". C'est un ancrage prix à neutraliser.

TikTok Shop reste marginal dans cette niche : l'annonce "NFC Google Review Card" de Review Zaps n'affiche que 48 ventes ([pdp](https://www.tiktok.com/shop/pdp/nfc-google-review-card-by-zappy-cards-for-fast-customer-feedback/1729534516304450510)).

---

## 2. Les vidéos analysées (stats au 29/09/2026)

### 2.1 Vidéos de la niche

| # | Vidéo | Date / durée | Vues / likes (taux) | Partages / enregistrements | Format observé image par image | Hook (verbatim) |
|---|---|---|---|---|---|---|
| A1 | [popcard.uk](https://www.tiktok.com/@popcard.uk/video/7232024833159122203) | 11/05/23, 18 s | **5,0 M** / 8 646 (0,17 %, probablement payé) | 4 690 / 232 | Vue subjective : une main tient la carte dans un bureau, texte natif en haut, **tap à 2,5 s**, étoiles, saisie, écran "Avis publié. Merci !", "Get yours now!" | "Here's how this business owner collected 14 positive reviews in one day!" |
| A2 | [popcard.uk](https://www.tiktok.com/@popcard.uk/video/7245219149016845594) | 16/06/23, 18 s | **1,4 M** / 1 637 | 700 / 69 | Même gabarit, tourné en terrasse | "Here's how a business owner can collect positive feedback everyday." |
| A3 | [popcard.reviews](https://www.tiktok.com/@popcard.reviews/video/7238149423061126427) | 28/05/23, 23 s | **1,2 M** / 2 402 | 1 485 / 219 | Même gabarit, tourné en restaurant | "Here's how a restaurant owner collected 26 positive reviews in one day!" |
| A4 | [popcard.uk](https://www.tiktok.com/@popcard.uk/video/7232023763712281882) | 11/05/23, 23 s | 419,4 K / 704 | 1 036 / 193 | Même voix off que A3 | Légende : "Tired of negative reviews? Take control of your business's online image today!" |
| A5 | [popcard.reviews](https://www.tiktok.com/@popcard.reviews/video/7233718840012655898) | 16/05/23, 19 s | 306,1 K / 883 | 452 / 39 | Même gabarit | "...collected 16 positive reviews in one day." |
| A6 | [popcard.reviews](https://www.tiktok.com/@popcard.reviews/video/7289357781583318304) | 13/10/23, 54 s | 206,1 K / 194 | 103 / 14 | Plans d'illustration et voix off longue | "Here's the secret of this business owner. For thousands of amazing reviews." |
| A7 | [popcard.reviews](https://www.tiktok.com/@popcard.reviews/video/7275036406857092385) | 04/09/23, 40 s | 204,4 K / 224 | 144 / 9 | Gros sous-titres façon Hormozi, capture d'écran du tunnel "Search your Business here" | "Here's how I boosted my customers reviews in two weeks." |
| A8 | [popcard.reviews](https://www.tiktok.com/@popcard.reviews/video/7238992528266087706) | 30/05/23, 44 s | 128,9 K / 233 | 204 / 20 | Acteur UGC, bandeau avant/après **"1.3 (18 reviews)" puis "4.7 (497 reviews)"** | "If you're looking to improve the online reviews of your business, this is for you." |
| B1 | [scanpraise](https://www.tiktok.com/@scanpraise/video/7671306977703693590) | 07/08/26, 90 s | **2,4 M** / 110,2 K (4,6 %) | 9 375 / 13 350 | Démarchage filmé en vue subjective dans un barbier, sous-titres jaunes mot à mot | Texte à l'écran : "Day 2 of turning 80p into a business." ; voix : "Hello. I was wondering, are you guys one of the managers or the owners of the shop?" |
| B2 | [scanpraise](https://www.tiktok.com/@scanpraise/video/7687661622864743702) | 20/09/26, 59 s | **2,3 M** / 89,9 K (3,9 %) | 4 985 / 7 074 | Série "Day X" | "Day 17 of selling 0.80 Google review cards to local bsuiensss" (sic) |
| B3 | [rivley_digital](https://www.tiktok.com/@rivley_digital/video/7675806289179479316) | 19/08/26, 32 s | **2,2 M** / 113,4 K (5,2 %) | 9 257 / 12 709 ; 768 commentaires | Démarchage en restaurant, réaction du patron, vente | Texte : "How I sell my $1 Google Review Cards" ; voix : "Hello, I just started these Google review cards here. Customers just tap their phone..." ; appel à l'action (CTA) : "Comment 'how'" |
| B4 | [tapitreviews](https://www.tiktok.com/@tapitreviews/video/7658398817003343125) | 03/07/26, 64 s | 8,1 K / 120 | 6 / 14 | Démarchage dans un salon d'ongles, suspense | "I scared the sh\*t out of her, but let's see if I can still make the sale..." |
| C1 | [tapstar.es](https://www.tiktok.com/@tapstar.es/video/7630810987918118166) | 20/04/26, 25 s | **396,1 K** / 10,6 K (2,7 %) | 1 507 / 2 904 | **Sketch en vue subjective du commerçant** : pose de la plaque sur la vitrine, client pressé, tap, étonnement | "Buah, por fin tengo mi placa Tapstar" (enfin j'ai ma plaque), puis "¿podrías dejarme una reseña?" (tu me laisses un avis ?) / "luego, luego" (plus tard, plus tard) |
| C2 | [reviewscarduk](https://www.tiktok.com/@reviewscarduk/video/7595587473217015062) | 15/01/26, 58 s | 89,2 K / 1 150 (1,3 %) | 287 / 676 | Présentatrice UGC, produit en main dès l'image 1, puis empilement d'objections | "These are our brand new Google review plates available in blue and black." |
| C3 | [biicards](https://www.tiktok.com/@biicards/video/7498596602882395410) | 29/04/25, 59 s | 30,5 K / 1 757 (5,8 %) | 156 / 221 | Déballage ASMR filmé du dessus (emballage "así inicia el crecimiento de tu negocio en Google Maps"), écran du formulaire 5 étoiles, résultats Google Maps, tap et QR | Légende : "¿Poquitas reseñas? Este kit NFC te va a salvar" (peu d'avis ? ce kit va te sauver) |
| C4 | [avistap1](https://www.tiktok.com/@avistap1/video/7680210006314208545) | 31/08/26, 12 s | 27,8 K / 273 | 71 / 57 | Démo muette : plaque bleue et blanche (proche du visuel Reviu), écran verrouillé, notification, étoiles, écran "+1 point" | "Plus d'avis. Plus de confiance. Plus de clients. Un simple TAP. Un avis Google. C'est fait." |
| C5 | [salamashopdaily](https://www.tiktok.com/@salamashopdaily/video/7499524998919490838) | 01/05/25, 85 s | 27,1 K / 655 | 122 / 224 | Face caméra sur fond incrusté, puis démo Android (affilié Tapstar) | "NFC Y QR pRa Reseñas de google" |
| C6 | [reviewboost](https://www.tiktok.com/@reviewboost/video/7283138969334729986) | 26/09/23, 57 s | 43,1 K / **4 (0,01 %)** | 4 / 1 | Banque d'images, voix de synthèse, sous-titres animés | "Introducing Review Boost, the Google review card that will transform the way you collect reviews." |
| C7 | [reviewscarduk](https://www.tiktok.com/@reviewscarduk/video/7381078143953587488) | 16/06/24, 14 s | 9,4 K / 40 | 65 / 38 | Démo réelle dans un café, **aucun texte**, musique "Good Days", tap à environ 1 s | Pas de hook textuel |
| C8 | [reviewscarduk](https://www.tiktok.com/@reviewscarduk/video/7324358713467211041) | 15/01/24, 43 s | 2,8 K / 17 | 4 / 12 | Présentatrice en studio, écran du site, fond de fin | "Business owners, you're missing out reviews if you're not using this" |
| C9 | [theburgerreviews](https://www.tiktok.com/@theburgerreviews/video/7342090807253470496) | 03/03/24, 38 s | 4,5 K / 141 | 5 / 11 | Influenceur food : plans burgers, présentoir en situation, patron | "Business owners listen up" |
| C10 | [walkerdailyfinds](https://www.tiktok.com/@walkerdailyfinds/video/7628145836911775007) | 13/04/26, 19 s | 762 / 5 | 1 / 2 | Affilié face caméra, sous-titres mot à mot en couleur | "These days with everything being online, everybody checks out the Google reviews." |
| C11 | [skyvod31](https://www.tiktok.com/@skyvod31/video/7278554029234375969) (FR) | 14/09/23, 62 s | 24,2 K / 1 005 | 194 / 781 | Side hustle : billet de 20 €, capture Amazon à 0,42 € la carte | "Avec seulement €20, tu peux gagner €1.000." |
| C12 | [oskar_z_marketingu](https://www.tiktok.com/@oskar_z_marketingu/video/7293545107125538080) (PL) | 24/10/23, 58 s | 11,7 K / 117 | 20 / 20 | Discours à contre-courant | Texte "Nie kupuj tego!" (n'achetez pas ça !) ; voix : les cartes, c'est "totalna lipa" (un fiasco total), à acheter "na aliexpress za piątaka" (sur AliExpress pour 5 zł) |

**YouTube** (titre, vues et chaîne uniquement, contenu non visionné) :
- Capture Card, "🚀 Want to Boost Your Google Review Ranking Effortlessly?" : 284 753 vues, 16 s ;
- Tap It Reviews, "Selling my Google review cards to a master negotiator…" : 184 K ;
- Foodwithsabina, "...I ordered for my pizza business" : 159 K ;
- Alex Hormozi, "The Hack to Getting 5 Star Reviews" : 185 K ;
- Tap It Reviews, "It's much easier to tap my Google review card than to scan a QR code" : 3 K ;
- Konrad Lawaetz, "Don't Buy the Viral Google Review Cards. Do This Instead" : 90 vues.

Sources : [recherche YouTube](https://www.youtube.com/results?search_query=google+review+nfc+stand), [oEmbed Tap It Reviews](https://www.youtube.com/shorts/KBeoVJJZQbM), [Hormozi](https://www.youtube.com/shorts/pqtm0F7BmJQ).

### 2.2 Outils voisins pour commerçants (paiement sans contact, TPE, réservation)

| Vidéo | Stats | Ce qui marche |
|---|---|---|
| [square.au](https://www.tiktok.com/@square.au/video/7301115279491222791) (21 s, 14/11/23) | **1,0 M** vues / 14,1 K likes / 7 102 enregistrements | Hook texte et voix "Take payments with just your iPhone. Let me show you how." ; créateur incrusté dans un coin de l'écran pendant la démo ; **chute finale : une patte de chien tend la carte bancaire contre le téléphone** |
| [square.au](https://www.tiktok.com/@square.au/video/7236808463945452802) (17 s) | 224,8 K / 6 783 likes | "Unboxing the Square Reader (2nd generation)", déballage ASMR sans voix |
| [pyahik](https://www.tiktok.com/@pyahik/video/7451790002276584735) (10 s, porte-clés NFC pour barbiers) | **750,8 K** / 12,4 K likes / 3 484 partages / 4 750 enregistrements | Texte "Tag the best barber you know 💈" ; fabrication en impression 3D avec pose de la puce ; tap sur un iPhone qui ouvre le profil Instagram |
| Popl (carte de visite NFC) | "been viewed over 80 million times" ; réaction du destinataire : "what? what? Whoa! What? How'd you do that?!" ([TechCrunch](https://techcrunch.com/2021/04/19/popl-tops-2-7m-in-sales-for-its-technology-that-replaces-business-cards/)) | L'effet "waouh" du tap filmé sur un tiers |
| SumUp / Adyen sur YouTube | SumUp "Tap to Pay on iPhone and SumUp... Zero activation costs." : 661 474 vues, 0:32 ; "Meet SumUp Solo Card Reader" : 555 155 vues, 0:39 ; Adyen "Tap to Pay on iPhone, F&B and Cosmetics" : 1 404 861 vues, 0:30 ([recherche YouTube](https://www.youtube.com/results?search_query=Square+tap+to+pay+on+iPhone+ad)) | Films de marque de 30 à 40 s. Les vues viennent probablement de la pub (non vérifiable). |

---

## 3. Ce qui fait performer dans cette catégorie

1. **Le tap intervient avant 3 s.** Popcard A1 : 2,5 s. Reviews Card C7 : environ 1 s. Tapstar : tap vers 10 s, mais tension installée dès 4 s. TikTok recommande d'"Introduce your content proposition in the first 3 seconds" et de "Prioritize your hook in the first 6 seconds" ([TikTok Help](https://ads.tiktok.com/help/article/creative-best-practices)).
2. **Du vrai partout : mains, téléphone, commerce, écran Google.** Dans ce corpus, aucun gagnant n'utilise la 3D ni la banque d'images. Le seul exemple en banque d'images avec voix de synthèse (C6) fait **4 likes pour 43,1 K vues**.
3. **La preuve finale est l'écran Google lui-même** : étoiles, puis "Avis publié. Merci !". Popcard l'affiche sur ses trois plus grosses vidéos.
4. **Un gabarit gagnant se décline, on ne le remplace pas.** Popcard a décliné "Here's how [persona] collected [N] positive reviews in one day" avec N = 14, 16 et 26, et plusieurs décors (bureau, terrasse, restaurant), sur deux comptes, entre mai et juin 2023. Les variantes ultérieures en "secret" ou "hack" plafonnent entre 76 et 206 K vues.
5. **La réaction d'un tiers vend mieux que le vendeur.** Le patron qui dit "That's pretty good" (B3), le client qui demande "¿dónde lo has conseguido?" (C1, où tu l'as trouvé ?), la réaction "How'd you do that?!" (Popl).
6. **La mise en scène d'une objection.** "Luego, luego" devient "es superrápido" (C1, 2,7 % de likes, 2 904 enregistrements).
7. **Les séries et les appels à commenter font monter les commentaires.** B3 obtient 768 commentaires avec "Comment 'how'" ; la série "Day X" de scanpraise dépasse 2 M de vues à deux reprises.
8. **Le son d'origine domine** : dialogue réel ou voix de synthèse TikTok. Chez Meta, "Reels ads with both music and voice-over show a +15-point higher positive response score" et, en conversion, la vidéo verticale avec son obtient "4.8% lower cost per action, 5.1% higher click-through rate and 2.9% higher conversion rate" ([Meta, 10/10/2023](https://www.facebook.com/business/news/reels-ads-updates-performance-features-automated-creative-suitability-solutions)).
9. **Le texte reste court, en haut de l'écran, dans la police native.** TikTok conseille "5-10 words per second" ([TikTok Help](https://ads.tiktok.com/help/article/creative-best-practices)).

---

## 4. Catalogue de 26 hooks et patterns, adaptés pour Reviu

Chaque entrée donne : la formule adaptée en français, l'original, la source et ses stats, et la transposition pour Reviu.

1. **"Voici comment [métier + ville] a récolté [N] avis Google en 1 journée."**
   - Original : "Here's how a restaurant owner collected 26 positive reviews in one day!"
   - Source : [A3](https://www.tiktok.com/@popcard.reviews/video/7238149423061126427), 1,2 M ; [A1](https://www.tiktok.com/@popcard.uk/video/7232024833159122203), 5,0 M.
   - Pour Reviu : **N doit être réel et documenté.** Tant qu'il n'y a pas de client, voir le hook 2.
2. **Le chrono : "Un avis Google en 5 secondes. Chrono."** Un chronomètre en motion design, le tap à 1 s, "Avis publié" à 5 s.
   - Démonstration vérifiable à l'écran, qui remplace un chiffre qu'on n'a pas encore.
   - Inspiré de "reviews in 3 seconds" (Popcard [A7](https://www.tiktok.com/@popcard.reviews/video/7275036406857092385), 204 K) et de la bio "review in 3 seconds" de TapFive ([profil](https://www.tiktok.com/@tapfivestars)).
3. **Le "Je le ferai plus tard".** Le client promet un avis "ce soir", le commerçant répond "Ça prend 5 secondes".
   - Original : "¿podrías dejarme una reseña?" / "luego, luego" / "es superrápido".
   - Source : [C1](https://www.tiktok.com/@tapstar.es/video/7630810987918118166), 396 K vues, 2,7 % de likes.
4. **"Enfin reçu !" : ouverture de colis du point de vue du commerçant.**
   - Original : "Buah, por fin tengo mi placa Tapstar" ([C1](https://www.tiktok.com/@tapstar.es/video/7630810987918118166)).
   - Pour Reviu : le présentoir posé à côté de la caisse dans la première seconde.
5. **"Ils sont repartis contents... et ils n'ont laissé aucun avis."**
   - Original : "¿Sabes cuántos clientes felices se van de tu restaurante… y no dejan ni una reseña?" (tu sais combien de clients contents quittent ton restaurant sans laisser d'avis ?)
   - Source : [BiiCards](https://www.tiktok.com/embed/@biicards), 11,8 K.
6. **"Peu d'avis ? Ce petit présentoir va vous sauver."**
   - Original : "¿Poquitas reseñas? Este kit NFC te va a salvar" ([C3](https://www.tiktok.com/@biicards/video/7498596602882395410), 5,8 % de likes).
7. **"C'est gênant de demander un avis. Alors ne demandez plus : posez-le."**
   - Original : "It's such an awkward question to ask! Will you leave me a review? So don't ask it..." ([TAPiTAG](https://www.tiktok.com/embed/@tapitag), 535 vues : faible performance, mais la vraie douleur est bien identifiée).
8. **"Ce n'est pas la faute de vos clients. C'est la faute du parcours."**
   - Original : "Struggling to get Google reviews? It might not be your customers… It might be your process... If leaving a review takes more than 10 seconds…" ([Reviews Card](https://www.tiktok.com/embed/@reviewscarduk), 1,6 K).
9. **Le produit comme hook : "Voici le présentoir qui..."**
   - Original : "These are our brand new Google review plates available in blue and black." ([C2](https://www.tiktok.com/@reviewscarduk/video/7595587473217015062), 89,2 K, 676 enregistrements).
   - Pour Reviu : le visuel bleu avec le "G" fait office de hook visuel.
10. **"Des avis Google avec juste le téléphone de vos clients. Je vous montre."**
    - Original : "Take payments with just your iPhone. Let me show you how." ([Square AU](https://www.tiktok.com/@square.au/video/7301115279491222791), 1,0 M).
11. **La chute du "même lui y arrive".** On termine sur un utilisateur inattendu qui fait le tap : un senior, un enfant, un animal.
    - Source : la patte de chien de [Square AU](https://www.tiktok.com/@square.au/video/7301115279491222791), 7 102 enregistrements.
12. **La réaction "Attendez... c'est quoi ce truc ?"** : on filme la surprise du client.
    - Original : "what? what? Whoa! What? How'd you do that?!" (80 M de vues, [TechCrunch](https://techcrunch.com/2021/04/19/popl-tops-2-7m-in-sales-for-its-technology-that-replaces-business-cards/)) ; "pero esto dónde..." ([C1](https://www.tiktok.com/@tapstar.es/video/7630810987918118166)).
13. **Le micro-trottoir chez les commerçants : "Jour 1 : je fais tester Reviu aux commerçants de Nîmes."**
    - Original : "Day 2 of turning 80p into a business." / "Day 17 of selling..." ([B1](https://www.tiktok.com/@scanpraise/video/7671306977703693590), 2,4 M ; [B2](https://www.tiktok.com/@scanpraise/video/7687661622864743702), 2,3 M).
    - Pour Reviu : **garder le format sans l'angle "gagner de l'argent"**, qui attire des revendeurs et pas des commerçants.
14. **La première réplique au patron : "Bonjour, vous êtes le gérant ? J'ai un truc à vous montrer."**
    - Original : "Hello. I was wondering, are you guys one of the managers or the owners of the shop?" ([B1](https://www.tiktok.com/@scanpraise/video/7671306977703693590)) ; "Hello, I just started these Google review cards here." ([B3](https://www.tiktok.com/@rivley_digital/video/7675806289179479316)).
15. **Le suspense de la vente ratée : "J'ai failli rater la démo..."**
    - Original : "I scared the sh\*t out of her, but let's see if I can still make the sale..." ([B4](https://www.tiktok.com/@tapitreviews/video/7658398817003343125), 8,1 K).
    - À utiliser en boucle d'ouverture (open loop).
16. **"Identifiez un commerçant qui mérite plus d'avis."** C'est la mécanique du partage.
    - Original : "Tag the best barber you know 💈" ([pyahik](https://www.tiktok.com/@pyahik/video/7451790002276584735), 3 484 partages).
17. **Le "secret" : "Le truc des commerçants qui ont des centaines d'avis."**
    - Original : "There's a secret that business owners use to collect thousands of Google reviews." ([A6](https://www.tiktok.com/@popcard.reviews/video/7289357781583318304), 206 K).
    - Performance nettement inférieure au gabarit chiffré (hook 1).
18. **Avant/après de la note : "18 avis, puis ..."**
    - Original : bandeau "1.3 (18 reviews)" puis "4.7 (497 reviews)" ([A8](https://www.tiktok.com/@popcard.reviews/video/7238992528266087706), 128,9 K).
    - **À n'utiliser qu'avec une fiche réelle et l'accord du commerçant.** Jamais de note inventée.
19. **Le témoignage "X avis en N ans, puis X en 1 jour".**
    - Original : "I went from 8 reviews in 4 years to 8 in one day" (témoignage sur la [page Zappy](https://zappycards.com/products/nfc-google-review-stand)).
    - Pour Reviu : format réservé aux premiers clients réels.
20. **Le rythme ternaire en texte seul : "Plus d'avis. Plus de confiance. Plus de clients."**
    - Source : [AvisTap](https://www.tiktok.com/@avistap1/video/7680210006314208545), 27,8 K. Déjà utilisé en francophonie : **reprendre le rythme, pas les mots.**
21. **Le "Pas d'appli, pas de compte, pas de galère."**
    - Original : "No apps, no logins and no faff." ([C2](https://www.tiktok.com/@reviewscarduk/video/7595587473217015062)).
22. **NFC contre QR code : "Taper, c'est plus rapide que scanner."**
    - Original : "It's much easier to tap my Google review card than to scan a QR code" ([YouTube](https://www.youtube.com/results?search_query=tap+to+review+google+card), 3 K).
    - Pour Reviu : montrer les deux, puisque le présentoir porte aussi un QR code.
23. **Le "Business owners, listen up" traduit en appel direct au métier : "Coiffeurs, restaurateurs : 10 secondes."**
    - Original : "Business owners listen up" ([C9](https://www.tiktok.com/@theburgerreviews/video/7342090807253470496), 4,5 K) ; "Business owners, you're missing out reviews if you're not using this" ([C8](https://www.tiktok.com/@reviewscarduk/video/7324358713467211041), 2,8 K).
    - Faible seul, efficace s'il est collé au tap.
24. **La question-bénéfice sur le classement : "Et si votre commerce passait devant sur Google Maps ?"**
    - Original : "🚀 Want to Boost Your Google Review Ranking Effortlessly?" ([Capture Card](https://www.youtube.com/shorts/LadSbggHO7g), 284 753 vues, 16 s).
25. **L'objection prise de front : "Une puce NFC coûte 40 centimes. Alors pourquoi 29,90 € ?"**
    - Réponse à l'ancrage prix de [skyvod31](https://www.tiktok.com/@skyvod31/video/7278554029234375969) (capture Amazon à 0,42 €) et au "Nie kupuj tego!" de [C12](https://www.tiktok.com/@oskar_z_marketingu/video/7293545107125538080).
    - Réponse : déjà configuré, Espace Reviu (stats NFC/QR, lien modifiable), design, garantie 30 jours.
26. **Le déballage ASMR : "Ce qu'il y a dans la boîte Reviu."**
    - Original : "Unboxing the Square Reader (2nd generation)" ([Square AU](https://www.tiktok.com/@square.au/video/7236808463945452802), 224,8 K) ; texte sur l'emballage BiiCards "así inicia el crecimiento de tu negocio en Google Maps" (ainsi commence la croissance de ton commerce sur Google Maps) ([C3](https://www.tiktok.com/@biicards/video/7498596602882395410)).

---

## 5. Huit gabarits seconde par seconde (9:16, adaptés à Reviu)

Les minutages sont relevés sur les vidéos sources. Le motion design Remotion sert à **imiter l'interface native** : bannière NFC iOS, feuille d'avis Google, "Avis publié. Merci !", sous-titres façon TikTok. Il ne remplace pas les vraies images.

**T1. Preuve en vue subjective (d'après Popcard A1/A3 : 5,0 M et 1,2 M), 18 à 20 s**
- 0-0,5 s : main qui tient le présentoir Reviu devant un vrai comptoir. Texte en haut : "Un avis Google en 5 secondes. Chrono." (ou N avis réels).
- 0,5-2,5 s : léger mouvement de caméra portée, le chrono démarre.
- 2,5-3,5 s : le téléphone du client entre dans le champ. **TAP** : onde en motion design, son "tick".
- 3,5-5 s : bannière iOS "Google", puis la feuille d'avis s'ouvre.
- 5-10 s : 5 étoiles qui se remplissent et saisie accélérée ×2.
- 10-12 s : écran "Avis publié. Merci !", chrono arrêté.
- 12-15 s : superposition "Sans appli · iPhone et Android · NFC ou QR code".
- 15-18/20 s : photo produit, "29,90 € · Livraison offerte · Satisfait ou remboursé 30 j", CTA "Commander sur reviu.fr".

**T2. Sketch "Je le ferai plus tard" (d'après Tapstar C1 : 396 K), 22 à 25 s**
- 0-1,5 s : le commerçant, en vue subjective, pose le présentoir : "Enfin reçu !"
- 1,5-4 s : un client paie et s'en va. "Vous me laisseriez un avis Google ?" / "Oui oui, ce soir..." Texte : "Spoiler : il ne le fera pas".
- 4-6 s : "Ça prend 5 secondes : approchez votre téléphone ici."
- 6-8 s : tap avec l'onde en motion design.
- 8-14 s : étoiles, "Publier", "Avis publié. Merci !"
- 14-17 s : le client : "Attendez, c'est quoi ce truc ?"
- 17-20 s : "Reviu. 29,90 €, sans abonnement."
- 20-25 s : photo produit et CTA.

**T3. Micro-trottoir des commerçants de Nîmes (d'après B1 à B3 : 2,2 à 2,4 M), 30 à 45 s, pour l'organique puis la pub en Spark Ads**
- 0-1 s : on entre dans une boutique, texte "Jour 1 : je fais tester Reviu aux commerçants de Nîmes".
- 1-4 s : "Bonjour, vous êtes le gérant ? 10 secondes pour vous montrer un truc."
- 4-10 s : **le patron tape avec son propre téléphone**, sa page d'avis s'ouvre.
- 10-20 s : réaction brute, sous-titres jaunes mot à mot.
- 20-30 s : objection ("et si je change de fiche ?") et réponse : "le lien se modifie dans l'Espace Reviu".
- 30-40 s : conclusion, CTA "Commente AVIS" en organique ou "reviu.fr" en pub.
- Pas d'angle revente ni argent facile.

**T4. Démo muette en boucle (d'après Reviews Card C7 et AvisTap C4), 8 à 12 s, pour les Stories et les déclinaisons courtes**
- 0-1 s : le présentoir sur une table dans un vrai décor.
- 1-2 s : tap.
- 2-3 s : notification.
- 3-7 s : étoiles et publication.
- 7-9 s : "Avis publié. Merci !"
- 9-12 s : texte "29,90 € · reviu.fr". La boucle se raccorde sur l'image 1.

**T5. Déballage, démo, preuve Maps (d'après BiiCards C3 et Square AU), 20 à 30 s**
- 0-3 s : colis ou boîte filmé du dessus, mains, son ASMR.
- 3-7 s : présentoir sorti de la boîte, "Déjà configuré".
- 7-12 s : tap et page d'avis.
- 12-18 s : écran de l'Espace Reviu (scans NFC contre QR, changement du lien).
- 18-25 s : résultats Google Maps avec compteur d'avis animé, **fiche réelle uniquement**.
- 25-30 s : prix, garantie, CTA.

**T6. Créateur "je vous montre" avec chute (d'après Square AU : 1,0 M), 20 s**
- 0-2 s : face caméra, présentoir en main : "Des avis Google avec juste le téléphone de vos clients."
- 2-3 s : "Je vous montre."
- 3-12 s : créateur incrusté dans un coin, démo plein écran du tap et de la page d'avis.
- 12-17 s : **chute**, un utilisateur inattendu réussit le tap (par exemple un client senior).
- 17-20 s : CTA.

**T7. Préparation satisfaisante et identification (d'après pyahik : 750 K), 10 s**
- 0-3 s : préparation réelle des présentoirs (test de chaque puce, mise en carton à Nîmes), **seulement si c'est vrai**. Texte "Identifie un commerçant qui mérite plus d'avis".
- 3-6 s : rangée de présentoirs.
- 6-8 s : tap sur un iPhone, Google s'ouvre.
- 8-10 s : présentoir posé dans la main.

**T8. Problème, mécanisme, pluie d'objections (d'après Reviews Card C2 : 89 K et la LP Zappy), 30 à 40 s, présentateur UGC**
- 0-3 s : produit en main : "Voici le présentoir qui fait laisser des avis à vos clients."
- 3-8 s : douleur : "Les clients contents oublient. Les mécontents, jamais."
- 8-14 s : tap et page d'avis.
- 14-26 s : objections en surimpression rapide : "Sans appli · iPhone et Android · déjà configuré · lien modifiable · stats NFC/QR · paiement unique".
- 26-32 s : "Une puce NFC, ça coûte 40 centimes ? Oui. Reviu, c'est l'outil complet."
- 32-40 s : offre (29,90 €, 27 € dès 3, 25 € dès 5), garantie, CTA.

---

## 6. Ce qu'il ne faut pas faire

- **Banque d'images, voix de synthèse et sous-titres "corporate"** : [C6](https://www.tiktok.com/@reviewboost/video/7283138969334729986) fait 43,1 K vues pour 4 likes.
- **Présentatrice en studio avec un script de pub lisse** : [C8](https://www.tiktok.com/@reviewscarduk/video/7324358713467211041) fait 2,8 K vues.
- **Hooks génériques sans produit ni bénéfice.** Zappy ("Try this NOW!", "Ditch the tip jar and try this!") reste entre 235 et 888 vues ([embed](https://www.tiktok.com/embed/@zappycards)).
- **Statistique de peur trop large.** Tapstar, "En 2025 cerraron más de 13.000 negocios locales en España..." (plus de 13 000 commerces locaux ont fermé en Espagne en 2025) : 954 vues, contre 396 K pour son sketch ([embed](https://www.tiktok.com/embed/@tapstar.es)).
- **Promesses de "contrôle" des avis** : "take control... managing your customers reviews", "ask your most satisfied customers" (Popcard [A4](https://www.tiktok.com/@popcard.uk/video/7232023763712281882) et [A8](https://www.tiktok.com/@popcard.reviews/video/7238992528266087706)). C'est contraire aux règles Google (voir §7).

---

## 7. Leçons à transposer au marché français sans copier

1. **Miser sur la pub payante dès le départ, avec des créas qui ressemblent à de l'organique.** L'organique des marques ne décolle pas (§1). Lancer 3 à 5 créas très différentes par groupe d'annonces, comme le recommande TikTok ("Between 3-5 different creatives per ad group", "Use creatives with big differences", [TikTok Help](https://ads.tiktok.com/help/article/creative-best-practices)). Premier lot conseillé : T1, T2, T4, T6, T8.
2. **Le tap est la scène qui arrête le défilement.** Il doit arriver avant 3 s, sur un vrai téléphone, dans un vrai commerce. Le motion design Remotion sert aux surimpressions : onde, chrono, étoiles, "Avis publié. Merci !". Pas à un rendu 3D.
3. **Montrer l'écran Google en français.** Popcard, qui a tourné en francophonie, finit sur "Avis publié. Merci !". Pour Reviu, c'est une preuve locale qu'aucune créa anglophone ne peut copier.
4. **Aucun chiffre sans preuve.** Reviu n'a pas encore de ventes. Pas de "X avis en 1 jour", pas de "X commerces nous font confiance", pas d'avant/après inventé. À la place : le chrono (hook 2), la démo filmée chez un commerçant de Nîmes avec son accord (T3), la garantie. Dès qu'un client réel existe, décliner le gabarit chiffré en faisant varier le métier, N et le décor, comme Popcard.
5. **Parler de la vraie douleur.** Clients contents qui oublient, "je le ferai plus tard", gêne à demander. **Éviter l'angle "avis négatifs"** et toute idée de filtre.
6. **Conformité Google.** La politique interdit :
   - d'"Offer incentives... in exchange for posting any review" ;
   - de "Discourage or prohibit negative reviews, or selectively solicit positive reviews" ;
   - et précise que les commerçants "should not require or pressure users to leave ratings or write reviews while on the premises" ([Google](https://support.google.com/contributionpolicy/answer/7400114?hl=en)).

   Google autorise en revanche : "you can ask customers to visit a Google link or scan a QR code" ([Aide Google Business](https://support.google.com/business/answer/3474122?hl=en)). Dans les sketchs, le client doit rester libre : pas de "que des 5 étoiles", pas d'avis exigé avant de partir.
7. **Neutraliser l'ancrage prix.** Les commerçants français peuvent tomber sur des cartes NFC à 0,42 € ([C11](https://www.tiktok.com/@skyvod31/video/7278554029234375969)) ou sur un discours du type "achetez sur AliExpress pour 5 zł" ([C12](https://www.tiktok.com/@oskar_z_marketingu/video/7293545107125538080)). On vend le résultat et le service :
   - aucune configuration à faire ;
   - Espace Reviu (stats NFC/QR, lien modifiable) ;
   - un objet de comptoir soigné ;
   - pas d'abonnement ;
   - satisfait ou remboursé 30 jours.

   À 29,90 €, Reviu est au niveau ou en dessous du marché : Zappy 40 $, Reviews Card 36 £, Popcard 49,90 $, TAPro 30 à 50 $.
8. **La garantie comme argument.** Zappy la cadre avec "Your count is public: nothing to argue over". Reviu peut dire simplement "30 jours pour tester, remboursé sinon", sans promettre un nombre d'avis.
9. **Durées.** Déclinaison principale de 15 à 25 s (les gagnants produit font entre 10 et 25 s), coupes de 6 à 10 s pour les Stories, formats de 30 à 60 s réservés au micro-trottoir en Spark Ads.
10. **Son et texte.**
    - Son d'origine, dialogue réel ou voix off, plus une musique discrète (Meta : +15 points pour musique et voix off).
    - Texte natif en haut, 5 à 10 mots par seconde, dans les zones sûres.
    - CTA précis ("29,90 € · livré gratuitement · reviu.fr") plutôt que "Get yours now!".
11. **Un ancrage local que les étrangers ne peuvent pas avoir.** "Commerçants de Nîmes", l'accent, les rues, les vrais commerces. C'est ce qui donne la crédibilité du format de B1 à B3, mais au profit du marchand et pas du revendeur.
12. **Chiffres de contexte (données US, à ne pas présenter comme françaises).** BrightLocal 2026, 1 002 adultes américains :
    - "83% of people asked to leave a review went on to leave one this year" ;
    - "94% of consumers are open to writing reviews" ;
    - "68% will only use a business with four or more stars".

    Source : [BrightLocal](https://www.brightlocal.com/research/local-consumer-review-survey/). Utilisables en surimpression si la source est citée.

---

## Sources principales

- Vidéos TikTok : liens dans les tableaux du §2. Profils via embed : [scanpraise](https://www.tiktok.com/embed/@scanpraise), [popcard.uk](https://www.tiktok.com/embed/@popcard.uk), [popcard.reviews](https://www.tiktok.com/embed/@popcard.reviews), [tapstar.es](https://www.tiktok.com/embed/@tapstar.es), [reviewscarduk](https://www.tiktok.com/embed/@reviewscarduk), [zappycards](https://www.tiktok.com/embed/@zappycards), [tapitag](https://www.tiktok.com/embed/@tapitag), [biicards](https://www.tiktok.com/embed/@biicards), [avistap1](https://www.tiktok.com/embed/@avistap1).
- Marques : [ZappyCards](https://zappycards.com/), [LP Zappy](https://zappycards.com/pages/bundle-offer-lp), [Reviews Card](https://www.reviewscard.com/products/review-stand-nfc-qr-code), [TAPro](https://taprocard.com/), [Popcard](https://www.popcard.io/), [Capture Card](https://www.capturecard.co/products/the-capture-card-google-review-card).
- Plateformes : [TikTok creative best practices](https://ads.tiktok.com/help/article/creative-best-practices), [TikTok Top Ads one-pager](https://ads.tiktok.com/business/library/NA_Creative_Center_Top_Ads_One_Pager.pdf) ("Top Ads are real TikTok ads that meet performance thresholds and advertiser authorization"), [Meta Reels ads](https://www.facebook.com/business/news/reels-ads-updates-performance-features-automated-creative-suitability-solutions).
- Règles Google : [politique Maps](https://support.google.com/contributionpolicy/answer/7400114?hl=en), [Google Business](https://support.google.com/business/answer/3474122?hl=en).
- Contexte : [BrightLocal LCRS 2026](https://www.brightlocal.com/research/local-consumer-review-survey/), [TechCrunch Popl](https://techcrunch.com/2021/04/19/popl-tops-2-7m-in-sales-for-its-technology-that-replaces-business-cards/).
