# reviu - note de reprise

> Dernière mise à jour : **9 octobre 2026**. **À lire en premier : la section
> « 🟥 Activation vérifiée - 09/10 » ci-dessous**, puis « 🟪 Reprise - état au 23/09 » (fait foi), puis « 🟩 état au 29/07 », puis « 🟦 état au 28/07 »
> pour le contexte « offre incluse ». Les parties « historiques » plus bas datent
> d'avant le retrait de l'abonnement payant ; partout où elles présentent
> l'« abonnement de suivi 2,99 €/mois » comme le **modèle courant**, c'est
> **OBSOLÈTE** (le détail technique - présentoirs, Stripe, RLS - reste valable).

## 🟥 Activation vérifiée et connexion sans mot de passe - 09/10/2026

Branche `claude/optimistic-noether-m6o1ge` (**pas encore en prod**).

### Pourquoi
- Après l'activation, le commerçant n'avait **aucun compte de connexion**
  (l'ancien `activate_stand` n'écrivait que dans `customers`) : « Mot de passe
  oublié » n'envoyait rien, seul le lien magique (caché, et cassé s'il était
  ouvert sur un autre appareil) fonctionnait.
- Le **code secret est imprimé sur le présentoir** : n'importe quel client au
  comptoir peut le photographier. L'ancien parcours permettait d'activer un
  présentoir vierge avec n'importe quelle adresse, sans la vérifier.
- Chaque activation par scan créait un **nouvel établissement**, même pour le
  même commerce (l'espace n'en affiche qu'un).

### Nouveau parcours
- Scan d'un présentoir **vierge** (`r.reviu.fr/{code}`) -> redirection vers
  **`app.reviu.fr/activer/{code}`** (la session ouverte vaut pour l'espace).
- 1) code secret + e-mail -> 2) **code à 6 chiffres** reçu par e-mail -> 3)
  choix du commerce (existant pré-sélectionné, ou nouveau) -> activé, **connecté**.
  Déjà connecté sur le téléphone : code secret + commerce seulement.
- **Connexion** (`/login`) : code par e-mail par défaut, mot de passe en option
  (« Mot de passe » dans l'en-tête de l'espace pour en définir un).
- Les codes sont générés par Supabase (`auth.admin.generateLink`, qui crée le
  compte au besoin) et envoyés par **notre** e-mail Resend
  (`src/lib/auth-code.ts`, `src/lib/email-templates.ts`) : **aucun modèle
  Supabase à modifier**. Le lien de l'e-mail mène à `/auth/confirm` (bouton à
  cliquer : les antivirus de messagerie qui ouvrent les liens ne le consomment
  pas), valable sur **n'importe quel appareil**.
- « Mot de passe oublié » : lien de réinitialisation si le compte existe, sinon
  code de connexion pour un commerçant de l'ancien parcours.
- **E-mails après chaque activation** (`src/lib/activation-notify.ts`) : au
  commerçant (confirmation + accès) et à `ADMIN_NOTIFY_EMAIL` (code, commerce,
  lien, e-mail vérifié, nombre de présentoirs du compte).

### Sécurité (le secret est visible sur le présentoir)
- Le secret **ne sert qu'une fois** : il n'est accepté que tant que le
  présentoir est vierge. Une fois activé, il ne permet plus rien.
- Activation **uniquement par le serveur** (`activate_stand_verified`, service
  role) pour l'utilisateur de la session : e-mail vérifié, impossible de
  rattacher un présentoir au compte d'un autre.
- **Limites** (table `rate_events`, `src/lib/rate-limit.ts` ; IP et e-mails
  stockés sous forme d'empreinte, purge après 2 jours) : secret faux 15/h par IP,
  10/h par couple présentoir + IP, 100/h par présentoir ; envoi de code 15/h par
  IP, puis 1/50 s et 6/h par adresse (comptés seulement quand un e-mail part) ;
  saisie de code 40/15 min par IP, 8/15 min par couple adresse + IP, 30/15 min
  par adresse. Un tiers ne peut pas bloquer seul un commerçant.
- **Écran neutre** : un client qui scanne un présentoir pas encore activé voit
  « Présentoir bientôt prêt. Merci de votre visite ! » et non un formulaire ;
  le commerçant touche « Vous êtes le commerçant ? Activer mon présentoir ».
- **Liens de fiche Google uniquement** (`src/lib/review-url.ts` + SQL
  `is_allowed_review_url`, mêmes règles) : g.page, maps.app.goo.gl,
  share.google, goo.gl/maps, g.co/kgs, search.google.com/local,
  [www.|maps.]google.<pays>/maps ou /search. Refusés : sites.google.com,
  docs.google.com, script.google.com, redirecteurs (/url, /amp, btnI),
  google.<n'importe quoi>, segments « .. » et barres encodées. Un présentoir
  détourné ne peut pas renvoyer vers du phishing.
- **Compte pré-créé par un tiers** (adresse du commerçant + mot de passe choisi
  par le tiers) : avant chaque envoi de code, le mot de passe d'un compte jamais
  confirmé est remplacé par une valeur aléatoire (`auth_unconfirmed_user_id`).
  `/signup` crée désormais le compte par code (plus de mot de passe à
  l'inscription).
- Redirection après connexion (`next`) limitée à `/dashboard…`,
  `/activer/{code}`, `/reset-password`.
- Saisie du secret tolérante (minuscules, espaces, tirets, O/0, I/L/1).
- Un présentoir **sans secret** (anciens modèles) ne s'active plus en
  libre-service : passer par l'admin.
- Détournement constaté (un tiers a activé un présentoir avant le commerçant) :
  l'admin le voit dans l'e-mail de notification. **Ne pas laisser le présentoir
  vierge** : le secret imprimé (qui ne change jamais) permettrait au tiers de le
  réactiver. Faire créer son espace au vrai commerçant (connexion par code),
  puis réinitialiser le présentoir et l'**attribuer aussitôt** à son
  établissement (Admin > Comptes > attribuer). Même prudence pour le cycle
  « démo prospect » : un prospect qui a vu le secret pourrait réactiver un
  présentoir remis à zéro.
- **Corrigé au passage (bug prod)** : sur `r.reviu.fr`, un code commençant par
  « r » (4 présentoirs imprimés sur 102) n'était pas réécrit par `proxy.ts` et
  donnait une 404.
- **Fournisseur** (prochaines séries) : imprimer le secret sur un autocollant
  amovible ou sur la notice dans la boîte plutôt que sur la face visible, et
  **verrouiller les puces NFC en lecture seule** (sinon une appli comme NFC
  Tools peut réécrire l'adresse de la puce).

### Admin : la main complète, sans toucher à la base (09/10)
- **Accueil** (`/admin`) : chiffres clés (clients, présentoirs actifs, scans et
  clics vers Google sur 7 et 30 jours) et **ce qui est à traiter** : demandes de
  support en attente, présentoirs actifs sans lien d'avis, dernières
  activations. Recherche : nom, e-mail ou **code présentoir** (ouvre
  directement la fiche du client).
- **Clients** (`/admin/accounts`) -> **fiche client** (`/admin/accounts/[id]`) :
  tout sur une page et modifiable à distance : commerce (nom, **lien d'avis**,
  mode de scan, message, retour privé), **lien propre de chaque présentoir**
  (vide = suit le lien du commerce), statistiques 30 jours + graphique par
  jour, présentoirs (statut, scans), attribution d'un présentoir vierge,
  retours privés, demandes de support, envoi d'un code de connexion,
  suspension, suppression (super-admin).
- **Présentoirs** (`/admin/stands`) : statut, remplacement, réinitialisation,
  lien vers la fiche client. **Production** (`/admin/production`) : lots et
  génération (ancienne page d'accueil de l'admin).
- **Support** (`/admin/support`) : le commerçant écrit depuis son espace
  (**Aide**, `/dashboard/aide`), l'admin répond ; chaque message part aussi par
  e-mail (admin -> `ADMIN_NOTIFY_EMAIL`, réponse -> commerçant). Statuts : à
  traiter, répondu, clôturé.
- Technique : les écrans admin lisent et écrivent via le **service role**,
  toujours après `requireAdmin()` (`src/lib/admin-server.ts`), dans chaque page
  ET chaque action. Modifications tracées dans le Journal (`stand_audit`).
- **Liens des présentoirs** : depuis le 09/10, un présentoir activé **suit le
  lien du commerce** (plus de copie dans `stands.target_url`). Changer le lien
  du commerce (espace ou admin) met aussi à jour les présentoirs qui gardaient
  une copie de l'ancien lien. Un lien propre à un présentoir reste possible.
- **Clients** : la liste ne sert qu'à trouver un client (commerce, contact,
  e-mail) ; toutes les actions sont sur la fiche. Un code de présentoir vierge
  ou retiré ouvre la page Présentoirs. « Suspendre le compte » demande une
  confirmation (tous ses présentoirs cessent de rediriger).
- **Lien propre d'un présentoir** : il fonctionne même si le commerce n'a pas
  encore de lien (`getStandByCode` utilise le lien effectif). Bouton « Suivre
  le lien du commerce » pour revenir au lien du commerce.
- Les pages admin affichent un message clair (`src/app/admin/error.tsx`) si la
  clé `SUPABASE_SERVICE_ROLE_KEY` manque, au lieu de la page d'erreur générique.
- Migration **`20261009130000_reviu_support_tickets.sql`** (tables
  `support_tickets`, `support_messages`, accès serveur uniquement) :
  **appliquée en prod le 09/10**. Les limites d'envoi du support (10 demandes
  par jour et par commerçant, 60 e-mails par heure vers l'admin) passent par
  `rl_allow` (migration `20261009120000`) et sont **bloquantes** : tant que
  cette migration n'est pas appliquée, la création de demande répond « Trop de
  demandes pour le moment ».

### Un commerce par compte (limite actuelle de l'espace)
- L'espace ne gère qu'un établissement par compte : `getMyContext` affiche
  celui qui porte le plus de présentoirs. À l'activation, un compte qui a déjà
  un commerce ne se voit donc PAS proposer « un autre commerce » (il serait
  introuvable ensuite). Présentoir pour un 2e commerce : le rattacher au
  commerce existant puis changer son lien dans « Présentoirs ». Un vrai mode
  multi-commerces reste à construire.
- Démo prospect par l'admin : utiliser une adresse alias (ex.
  `prenom+prospect@gmail.com`) pour créer un compte de démo séparé, au lieu de
  rattacher le présentoir à son propre commerce.

### Base de données
- `20261009115000_reviu_lock_roles.sql` : **appliquée en prod le 09/10
  (correctif de sécurité urgent)**. Avant, tout utilisateur connecté pouvait
  modifier son propre `profiles.role` (devenir administrateur) ou lever la
  suspension de son organisation via l'API publique. Les utilisateurs ne
  peuvent plus écrire que leur nom et le nom de leur organisation. Vérifié :
  seul yoan.oliveira30@gmail.com a un rôle admin.
- `20261009120000_reviu_verified_activation.sql` : **ajouts uniquement**
  (`rate_events`, `rl_*`, `is_allowed_review_url`, `stand_secret_matches`,
  `check_stand_secret`, `activate_stand_verified`, `auth_unconfirmed_user_id`),
  service role seulement, plus `admin_assign_stand` / `admin_transfer_stand`
  qui ne copient plus le lien du commerce dans le présentoir.
  Sans effet sur le parcours actuel ; **nécessaire pour tester la branche et
  pour le support** (limites d'envoi). **Pas encore appliquée** : le connecteur
  Supabase demande une confirmation manuelle pour cette migration (elle
  contient un `delete` de purge). À appliquer dans Supabase > SQL Editor en
  collant le fichier, ou en acceptant la demande du connecteur.
- `20261009121000_reviu_activation_lockdown.sql` : **à appliquer AU MOMENT de la
  mise en prod** (juste après le déploiement) : retire l'accès public à
  `activate_stand`, `claim_stand` et `self_set_subscription` (cette dernière
  permettait à n'importe qui de modifier le statut d'abonnement d'un présentoir
  avec son seul code public), et ajoute les triggers « liens Google
  uniquement ».
- Variables requises (déjà utilisées ailleurs) : `SUPABASE_SERVICE_ROLE_KEY` et
  `RESEND_API_KEY` (+ `REVIU_EMAIL_FROM`), **y compris sur l'environnement
  Preview** de Vercel pour tester la branche.
- Limite connue : les appels `verifyOtp` partent du serveur, donc la limite
  Supabase « vérifications par IP » s'applique à l'IP de Vercel ; sans effet au
  volume actuel.

### Réglages Supabase recommandés (tableau de bord, Authentication)
- **Désactiver les inscriptions publiques** (« Allow new users to sign up ») :
  l'app crée les comptes elle-même via l'API admin (`generateLink`). Sinon un
  tiers peut encore créer un compte avec l'adresse d'un commerçant en appelant
  directement l'API Supabase. **Tester juste après** avec une adresse jamais
  utilisée sur `/login` : si le code n'arrive plus (la documentation Supabase ne
  précise pas si l'API admin est concernée), réactiver le réglage ; le mot de
  passe d'un compte non confirmé est de toute façon neutralisé par l'app.
- **Code e-mail sur 8 chiffres** et **expiration 15 min** (Email OTP length /
  expiration) : l'écran s'adapte tout seul à la longueur, et les e-mails disent
  « expire rapidement ». L'API `/auth/v1/verify` de Supabase est appelable
  directement avec la clé publique : ses limites à elle s'appliquent.
- Le bouton admin « Envoyer un code de connexion » (Admin > Comptes) remplace
  l'ancien « Renvoyer l'activation » (lien magique qui ne fonctionnait pas).

## 🟪 Reprise - état au 23 septembre 2026 (fait foi, lire en premier)

### Mise à jour du 28/09 - publicité et mesure des ventes
- **Google Analytics 4 + Google Ads + bandeau cookies CNIL** (mode basique :
  rien n'est chargé avant le choix), conversion « Achat » avec montant sur
  `/boutique/merci`, `begin_checkout` sur `/boutique/commander`, `qr_download`
  sur l'outil. **Inactif tant que `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  (`G-NJK6DK30ZJ`) n'est pas dans Vercel.** Conversion Google Ads = événement
  GA4 `purchase` importé (choix du 28/09) : `NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL`
  reste VIDE (sinon double comptage) et `NEXT_PUBLIC_GOOGLE_ADS_ID` est
  facultatif (l'accord « Publicité » est demandé dès qu'Analytics est actif).
- **Provenance de chaque vente** (utm, gclid, site d'origine) dans les
  métadonnées Stripe et dans l'e-mail interne de commande.
- **Flux Google Shopping** : `https://reviu.fr/google-shopping.xml`.
- Pages cookies / confidentialité : décrivent automatiquement les outils actifs.
- Mode d'emploi, réglages Google et plan de la première campagne :
  **`docs/ADS-TRACKING.md`**.
- **Photos de clients** : section « Déjà sur le comptoir de nos clients »
  (`installations-section.tsx`) sur l'accueil et la fiche produit, alimentée
  par `src/lib/installations.ts` (liste vide = masquée). Préparer chaque photo
  avec `node scripts/prepare-photo.mjs` (4/5, amélioration, **floutage du QR
  code et du code imprimé**), fichiers dans `public/installations/`. Légende =
  métier ou emplacement, jamais de citation inventée (les citations vont dans
  `testimonials.ts`).

### Mise à jour du 28/09 - vocabulaire produit (décision client)
- Le produit s'appelle **« Présentoir Reviu »** : plus jamais « présentoir NFC + QR »
  dans le discours (titres, boutique, facture Stripe, visuels). Descripteur SEO :
  **« présentoir avis Google »**. Pour expliquer le geste : **« sans contact ou
  QR code »** (« comme pour payer sans contact »). « Puce NFC » reste réservé aux
  caractéristiques, à la compatibilité, aux mentions légales et au guide
  `presentoir-plaque-nfc-avis-google`. Règle documentée dans `src/lib/brand.ts`.
- Charte graphique complète dans `brand/` (voir `brand/README.md`) et dans Canva
  (dossier « Reviu - Charte graphique ») : logo, bannières, 5 posts, 5 stories.

### Mise à jour du 23/09 (soir) - retours client
- **Aucun sur-titre** au-dessus des titres (demande explicite du client) : ne
  pas en réintroduire (ni pastille, ni texte mono en majuscules).
- **Accueil allégé** : phrase éditoriale des métiers (liens vers les guides) à
  la place du bandeau défilant ; commande express `#produits`
  (`boutique/quick-order.tsx`) ; lien `/r/demo` retiré.
- **Fiche produit** `/presentoir-avis-google` (`PRODUCT_PATH`) : galerie,
  paliers, caractéristiques, mise en route, lieux, FAQ, schéma Product (déplacé
  depuis l'accueil). Menu « Le présentoir » pointe dessus.
- **Header** : grille 3 colonnes (nav réellement centrée, logo aligné sur le
  contenu) ; téléphone déplacé dans le bandeau bleu (desktop) et le menu mobile.
- **Outil QR** : Place ID accepté, formats affiche / carré, 4 couleurs, envoi du
  lien par SMS / WhatsApp / e-mail, contenu SEO (étapes, trouver le lien,
  tailles d'impression, phrases, comparatif, 9 FAQ), JSON-LD WebApplication +
  HowTo + FAQPage, image OG dédiée, lien depuis chaque guide.
- **Outil QR, UI « un seul écran »** : un panneau unique (réglages à gauche,
  aperçu + « Télécharger » à droite) qui tient sans défiler dès 1024×768 ;
  champ lien focalisé d'office sur ordinateur ; aperçu d'exemple estompé avant
  saisie. **Mobile** : bouton « Coller » (presse-papiers), aperçu + « Télécharger »
  qui n'apparaissent qu'une fois le lien valide, personnalisation repliée,
  « Envoyer le lien à un client » via le partage natif du téléphone
  (`navigator.share`), boutons SMS/WhatsApp/e-mail en repli.
- **Guides** : index compact (articles visibles dès l'arrivée, filtres par
  thème, carte outil). **Connexion** : grand logo, fond sans halo.



Session **refonte UI/UX + conversion + SEO**. Branche : `claude/lucid-hypatia-t76ab7`
(fusionnée sur `main` le 23/09). Plan commercial détaillé :
`docs/PLAN-VENTES.md`.

- **Offre** : livraison **offerte dès 1 présentoir** (`FREE_SHIPPING_THRESHOLD_CENTS = 0`
  dans `shop.ts`, libellés `SHIPPING` dans `brand.ts`) + garantie **satisfait ou
  remboursé 30 jours** (`GUARANTEE` dans `brand.ts`, CGV §5, `merchantReturnDays`
  du schéma Product). Frais de retour à la charge du client.
- **Reviu Pro supprimé** partout (constante `REVIU_PRO` retirée, accueil,
  dashboard, démo, CGU/CGV, guides). `SUBSCRIPTION` (legacy inutilisé) retiré.
- **Header** (`site-header.tsx`) : nav en pilule, méga-menu « Ressources »
  (`NAV[].children` + `featured`), lien Revendeur, CTA avec prix, menu mobile
  plein écran. Bandeau `announce-bar.tsx` : rotation des messages sur mobile.
- **Téléphone** : `PHONE_NUMBER = "+33781983042"` (07 81 98 30 42) dans
  `brand.ts`, `PHONE_HAS_WHATSAPP` à passer à `true` si le numéro est sur
  WhatsApp. Affiché : header (icône), menu mobile, FAQ, revendeur, footer, JSON-LD.
- **Témoignages** : bloc prêt (`testimonials-section.tsx`) : fond sombre,
  chaque témoignage = une pile de tirages (1 à 4 photos, champ `photos`) que
  l'on feuillette au clic ; les autres commerçants apparaissent en mini-piles.
  Données dans `src/lib/testimonials.ts` (liste vide = section masquée),
  photos dans `public/temoignages/` (4/5, voir README).
  Uniquement de vrais clients. Pas de schéma Review (avis sur son propre produit
  non éligibles aux résultats enrichis).
- **Style « moins IA »** : sur-titres en police normale (plus de mono
  majuscule), halos flous retirés des blocs sombres, hero allégé.
- **Mis en prod le 23/09** (fast-forward de `main`).
- **Accueil** (`boutique/page.tsx`) : hero vivant, `scan-demo.tsx` (parcours
  client animé), comparatif, bloc garantie, `sticky-buy-bar.tsx` (mobile).
- **Outil gratuit** `/outils/qr-code-avis-google` (`qr-tool.tsx` +
  `src/lib/qr-poster.ts`, génération 100 % navigateur). Chemin : `QR_TOOL_PATH`.
- **Revendeur** : programme **sur sélection / contact** (décision client : pas
  de grille de gros publique pour l'instant). Champ « profil » ajouté au
  formulaire et à l'e-mail de candidature.
- **SEO technique** : `www.reviu.fr` → 301 → `reviu.fr` et `/boutique` → 301 →
  `/` dans `src/proxy.ts` (⚠️ ne jamais configurer reviu.fr → www côté Vercel :
  boucle) ; sitemap (+ `/revendeur`, outil) ; photos en `next/image` (prop
  `preload` en Next 16, pas `priority`) ; vérification Search Console / Bing via
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
- **Reste** : caractéristiques physiques `SPEC_*` à compléter ; insérer les
  témoignages dès réception. `formation/page.tsx` (abonnement 2,99 €) : mis de
  côté à la demande du client.

## 🟩 Reprise - état au 29 juillet 2026 (fait foi)

**Session 100 % SEO/contenu + UI. Tout est sur `main`, déployé (Vercel).** Branche
de dev de la session : `claude/seo-delivery-time-field-fn9xx2` (fast-forwardée sur
`main`, donc à parité). **Aucune CI** dans le repo - la vérif de build se fait à la
main (voir « Vérif »).

### ⚠️ Conventions imposées par le client (à respecter absolument)
- **AUCUN tiret cadratin (U+2014) ni demi-cadratin (U+2013)** nulle part (code,
  contenu, commentaires, commits). Utiliser **essentiellement `-`**. Vérifier avant
  commit : `grep -rln $'\u2014' --exclude-dir=node_modules --exclude-dir=.git .`
  doit être vide (adapter pour U+2013 au besoin).
- Le client valide chaque étape et aime les **aperçus visuels** (fichiers HTML
  rendus) avant/après pour les changements de design.
- **Mise en prod = sur demande explicite** (« mets en prod ») → fast-forward `main`.

### Hub de contenu SEO (le gros du travail) - `src/lib/guides.ts`
- **17 guides** (contre 6), tous SSG, avec `Article` + `FAQPage` + `BreadcrumbList`
  (JSON-LD), sommaire, fil d'Ariane. Data + helpers centralisés dans `guides.ts` :
  `GUIDES`, `CATEGORY_HUBS`, `getGuide`, `guideSlugs`, `getCategoryHub`,
  `hubSlugForCategory`, `guidesInCategory`, `headingId`.
- **Cluster « Par métier » (9)** : restaurant, coiffeur, garage, boulangerie,
  institut-beaute, hotel, boutique, dentiste, salle-de-sport.
- **Cluster « Gérer sa réputation » (4)** : repondre-avis-google,
  supprimer-faux-avis-google, repondre-avis-negatif, augmenter-note-google.
- **Pilier `avoir-plus-avis-google`** enrichi : ~2100 mots, 13 sections H2, 7 FAQ.
- **2 pages hub indexables** : `/guides/par-metier`, `/guides/gerer-sa-reputation`
  (routes statiques `src/app/guides/<slug>/page.tsx`, vue partagée
  `src/components/site/category-hub.tsx`, définies dans `CATEGORY_HUBS`). Ajoutées
  au sitemap automatiquement. Pour créer un hub : ajouter une entrée `CATEGORY_HUBS`
  + une route statique fine (wrapper). Ne créer un hub que si la catégorie a assez
  de guides (>= 3-4) - sinon page mince = risque d'indexation.
- **Maillage** : `related[]` par guide (validé sans orphelin) + **liens contextuels
  in-body** via une syntaxe `[libellé](/chemin)` parsée par `richText()` dans
  `src/app/guides/[slug]/page.tsx`. ⚠️ **JAMAIS de lien dans les réponses FAQ**
  (elles alimentent le JSON-LD `FAQPage` et doivent rester en texte brut).
- **Image OG par guide** : route `src/app/guides/[slug]/opengraph-image.tsx`
  (`next/og`, texte = catégorie + titre). `buildMetadata` accepte un param `image`.
- **Cover illustrée par article** : `src/components/site/guide-cover.tsx` - SVG
  généré, **déterministe par slug** (dégradé cobalt par catégorie + étoiles dorées +
  monogramme). Affichée sur les cartes (index + hubs) et en bannière d'article.
- **Index `/guides`** : section « Parcourir par thème » (cartes de catégorie) au-
  dessus de la grille.

### Navigation & UI
- **Menu « Option B »** (`NAV` dans `src/lib/brand.ts`, type `NavItem` avec
  `children`) : « Le présentoir » (`/#produits`), **« Guides » avec sous-menu**
  (Tous les guides, Par métier, Gérer sa réputation), « Démo ». Sous-menu déroulant
  accessible survol + focus clavier (`src/components/site/site-header.tsx`), version
  mobile indentée. Ancres redondantes retirées ; texte du menu à 15 px.
- **Titres accentués** : dernier mot en bleu de marque via
  `accentLastWord()` (`src/components/ui/accent.tsx`), appliqué aux héros + titres
  de section des pages vitrine (boutique, revendeur, demo, hubs, h1 des guides).
  **Exclus** : corps d'articles, FAQ, cartes, titres sur fond sombre, titres techos.
- **Bandeau** (`announce-bar.tsx`) : « Livraison offerte dès 50 € » sur **tous les
  formats** ; réassurances secondaires en `lg:` seulement.
- **Étapes d'activation** (boutique `STEPS`) réécrites (QR imprimé sur le présentoir /
  code secret + lien fiche Google / installation comptoir).
- **Module d'achat** (`stand-order.tsx`) : paliers dégressifs en **cartes cliquables**
  (tranche, prix unitaire, économie/unité) ; **mention revendeur retirée**.
- **Pages d'activation** (depuis le 09/10 : `src/app/activer/[code]/activate-flow.tsx`) : logo de marque
  (`LogoBadge`, nouvel export de `logo.tsx`) à la place de l'étoile ; écran de
  confirmation avec pastille verte de succès.

### Fiche produit & divers
- `deliveryTime` ajouté dans `offers.shippingDetails` du `productSchema` (`seo.ts`)
  - handlingTime 0-1 j, transitTime 2-5 j (aligné sur `delivery_estimate` Stripe).
- **Page `/revendeur`** enrichie SEO : JSON-LD `BreadcrumbList` + `FAQPage`, section
  FAQ (5 Q), liens internes vers produit + pilier. Toujours liée depuis le **footer**
  (pas dans le menu principal - audience B2B distincte).

### Décisions / questions en attente
- **« Blog » vs « Guides »** : le client a demandé pourquoi pas « blog ». Reco donnée
  et retenue = **garder « Guides »** (meilleure intention SEO, evergreen ; renommer
  imposerait des 301 sur `/guides/*`). Rester sur « Guides ».
- ⚠️ **Incohérence non résolue** : `/revendeur` (page + FAQ) référence encore
  l'**abonnement 2,99 €/mois** (« reviu garde le récurrent »), ce qui contredit le
  repositionnement « offre incluse, sans abonnement » du 28/07. Décision produit
  toujours **en attente** (quel modèle récurrent ?). Ne pas oublier avant refonte.

### Vérif (dépendances installées cette session)
- `pnpm install` puis **`npx tsc --noEmit`**, **`pnpm build`** (70/70 pages),
  **`pnpm lint`** : tous verts (seul warning pré-existant : `formatDate` inutilisé
  dans `admin/stands/stands-admin.tsx`).
- Mise en prod : `git checkout main && git reset --hard origin/main &&
  git merge --ff-only <branche> && git push origin main`.

---


## 🟦 Reprise - état au 28 juillet 2026 (fait foi)

### ⚠️ Le point qui a changé : plus d'abonnement payant
- Le présentoir est un **achat unique 29,90 €**. L'**espace Reviu est INCLUS,
  sans abonnement ni frais récurrents** (statistiques de scans, gestion des
  présentoirs, **modification du lien**). Les mots « abonnement » / « /mois » ont
  disparu du **parcours commerçant** (boutique, dashboard, activation, légal, SEO).
- **Reviu Pro** = offre avancée **« bientôt disponible »** (liste d'attente, aucun
  achat) : connexion Google Business Profile, centralisation/réponses aux avis,
  alertes, IA, analyses. Constantes `INCLUDED_SPACE` et `REVIU_PRO` dans
  `src/lib/brand.ts`. La constante `SUBSCRIPTION` (2,99 €) est **conservée en
  LEGACY** (anciens abonnés + portail Stripe de résiliation), à ne PAS réutiliser
  côté commerçant.
- **Base de données** : le verrou `subscription_required` a été retiré du RPC
  `set_stand_target` (migration `20260728120000_reviu_included_unlock_set_stand_target.sql`,
  appliquée en prod). La modification du lien est donc **réellement gratuite**.
  L'adresse encodée QR/NFC (`code`) reste immuable.

### Domaines & SEO technique
- **Domaine canonique = `https://reviu.fr` (NON-www).** Tout le code (canonical,
  sitemap, robots) est non-www. Vercel a été réglé pour que `reviu.fr` serve 200.
- ⚠️ **Reliquat** : au 28/07, `https://www.reviu.fr/` répond **encore 200** (au lieu
  de 301 → reviu.fr). Non bloquant (les canonical consolident vers reviu.fr), mais
  **à forcer côté Vercel** : `www.reviu.fr` → *Redirect to* `reviu.fr`.
- **`www` et `reviu.fr` = le MÊME site** (même code/contenu), pas deux versions.
- **Rendu** : Next.js 16 (App Router + Turbopack). **Toutes les pages publiques sont
  SSG/statiques** - HTML complet (titres, H1/H2, liens, JSON-LD) **sans JS client**.
  → **NE PAS migrer** vers Astro/autre.

### Livré cette session (tout est sur `main`, déployé)
- **Repositionnement « offre incluse »** : commit `ede387c` (parcours commerçant,
  légal, SEO, bloc Reviu Pro) + complétion (verrou DB retiré ; purge de l'upsell
  d'abonnement : e-mail auto à l'activation supprimé, page `admin/emailing` +
  helpers supprimés, actions mortes retirées).
- **Hero pleine hauteur** sur `/boutique` : `min-h-[calc(100svh-104px)]` (104px =
  bandeau 36 + header 68), `svh`, contenu centré, mobile texte-d'abord.
- **Description SEO** de l'accueil renforcée (mène par la marque + le produit).
- **Footer refondu épuré** (typo + blanc + air, sans bandeau/pastilles/icônes) -
  `src/components/site/site-footer.tsx`.

### Chantiers ouverts (un AUDIT SEO complet a été produit en artefact)
- **P0** : forcer `www → 301 → reviu.fr` (Vercel) ; `/boutique → 301 → /`
  (`src/proxy.ts`) ; ajouter `/revendeur` au `sitemap.ts` ; côté Search Console :
  « Valider la correction » + demander l'indexation de `/` et `/guides` + ajouter
  une propriété **Domaine**.
- **P1** : **images crawlables** - `ProductPhoto`/`ProductGallery` utilisent des
  `background-image` CSS (0 `<img>`) → non indexables par Google Images + risque
  LCP ; passer en `<img>`/`next/image` (alt, dimensions, `priority` sur le hero).
  Fichiers : `src/components/site/product-photo.tsx`, `product-gallery.tsx`,
  `src/app/boutique/page.tsx`. Intégrer « présentoir/plaque NFC avis Google » dans
  le H1/H2 de l'accueil. Créer des **pages sectorielles** (restaurant, coiffeur,
  hôtel, garage…).
- **P2** : **pages locales programmatiques** (Nîmes, Occitanie, villes) - c'est LE
  levier pour l'objectif « top SERP local » ; `aggregateRating` sur Product (avec
  de VRAIS avis uniquement) ; schémas affinés.
- **⚠️ Décision produit en attente** : le contenu **revendeur & formation**
  (`src/app/formation/page.tsx`, `src/app/revendeur/page.tsx`,
  `src/lib/shop.ts`, `src/lib/reseller.ts`) **vend encore l'abonnement 2,99 €/mois**
  → incohérent avec l'offre incluse. À trancher AVANT réécriture : quel modèle
  récurrent pour reviu maintenant (aucun ? Reviu Pro plus tard ?).
- **SANS OBJET** : le « digest hebdomadaire » mentionné dans l'historique visait
  l'abonnement 2,99 € qui n'existe plus - à ne pas construire en l'état.

### Repères dev & vérification
- Build/dev exigent les variables `NEXT_PUBLIC_*` (placeholders OK en local).
- Déploiement de la session : **push direct sur `main`** en fast-forward (Vercel
  déploie `main`). Branche de dev : `claude/reprise-projet-0epbog` (= `main`).
- Captures visuelles : `playwright-core` + Chromium pré-installé
  (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`). Détail : `pkill` renvoie
  un code 144 sans conséquence ; les sections en `Reveal` s'agrandissent au scroll
  (scroller par paliers avant de capturer le bas de page).

---

> _Ci-dessous : note de reprise **historique (≤ 23/07)**, conservée pour le détail
> technique encore valable (système de présentoirs, Stripe, RLS, e-mails…).
> **Ignorer tout ce qui présente l'abonnement 2,99 €/mois comme le modèle courant.**_

> Dernière mise à jour : 23 juillet 2026. Ce document est la **source de reprise** :
> il reflète l'état réel du code sur `main`.

## État : EN PRODUCTION ✅

- **`app.reviu.fr`** - application SaaS (Next.js 16 / App Router sur Vercel).
- **`r.reviu.fr`** - redirection NFC/QR (même app Next, host réécrit par `src/proxy.ts`).
- **`reviu.fr`** - **site vitrine public servi par la même app** (landing + pages légales).
  ⚠️ **Domaine pas encore branché sur Vercel** - voir « Actions manuelles ».
- **Données + Auth → Supabase** (projet ref `sudspaqmgqwhyabflyzi`, région eu-central-1).

Branche par défaut = **`main`** ; Vercel redéploie à chaque push. Développement sur branche +
PR vers `main`. **Code et base synchronisés** (migrations dans `supabase/migrations/`, mais
certaines fonctions/tables vivent directement dans la base - voir « Base de données »).

## Mises à jour récentes (à connaître pour la reprise)

- **Repositionnement boutique (juillet 2026)** : le site est recentré sur la
  vente d'**un seul présentoir** et sur l'**abonnement de suivi** (le récurrent).
  - Catalogue public = **le présentoir uniquement**, à l'unité, **tarif dégressif**
    modéré (1=29,90 € · 3+=27 € · 5+=25 €). Paliers dans `src/lib/shop.ts`
    (`STAND_TIERS`, `standUnitCents`) ; sélecteur de quantité `StandOrder`. Le
    serveur recalcule le prix par palier au checkout (source de vérité).
  - **Packs & formation retirés du shop public** (toujours vendables aux
    revendeurs validés ; `getProduct` les connaît encore pour la CGV).
  - Nouvelle section **Abonnement** présentée comme une offre de **services**
    (réputation/alertes, récap hebdo, accompagnement humain) - `SUBSCRIPTION`
    enrichi dans `brand.ts`.
  - **Livraison** : offerte dès **50 €**, sinon **3,90 €** de port
    (`FREE_SHIPPING_THRESHOLD_CENTS`, `SHIPPING_FEE_CENTS`, `shippingFeeCents`
    → `shipping_options` Stripe). **Bandeau d'annonce** `AnnounceBar` au-dessus
    du header.
  - Nouvelle page **`/revendeur`** : conditions de revente + **formulaire de
    candidature envoyé par e-mail** au propriétaire (`submitResellerApplication`
    dans `src/lib/reseller-application-actions.ts` - à ne pas confondre avec
    `reseller-actions.ts`, l'admin des revendeurs validés). La formation devient
    **accompagnée sur demande** (écran verrouillé `/formation` → `/revendeur`).
  - **Reste à faire (Phase 2 abonnement, choisi mais non développé)** : **digest
    hebdomadaire** par e-mail + **alertes** retour privé, pour donner une vraie
    valeur récurrente aux 2,99 €. (L'alerte e-mail à chaque retour privé existe
    déjà ; le récap hebdo est à construire, probablement via un cron.)

- **Accueil = boutique** : `reviu.fr/` sert `/boutique`, enrichie des sections « Comment ça
  marche », preuve sociale (`Testimonials`) et conformité Google. `/home` = page « Comment ça
  marche » (canonical `/home`). Nav recentrée ; logo → racine.
- **Responsive** : `SiteHeader` est un composant client avec **menu déroulant mobile**
  (hamburger) à la place de la CTA ; hero ajusté (tailles fluides, photo capée/centrée mobile).
  `ProductPhoto` = `background-image` CSS sur dégradé de marque (repli fiable, sans JS ; plus
  jamais d'image cassée). **Photos à déposer** dans `public/products/` (voir son README) - de
  préférence en **WebP compressé** (~1000 px, < 120 Ko) pour le LCP.
- **Perf** : parcours de scan non bloquant (écritures via `after()`, redirection immédiate ; le
  mode « direct » va droit vers Google sans passer par `/go`). Dashboard : `getCurrentUser`
  mémoïsé (`cache`), `getMyContext` en une requête (embedding). RLS `resellers` en
  `(select auth.uid())`. Migration `20260724100000_reviu_resellers_rls_perf.sql`.

## Routage par domaine (`src/proxy.ts`)

- `r.reviu.fr/<code>` → `/r/<code>` (redirection présentoir).
- `reviu.fr` et `www.reviu.fr` → la racine `/` est réécrite vers **`/boutique`** (page d'accueil
  orientée commerce). L'ancienne landing explicative reste servie sur `/home` (« Comment ça
  marche »). Les pages légales et `/demo` sont servies telles quelles.
- `app.reviu.fr/` → `/login` (ou `/dashboard` si connecté). Session Supabase rafraîchie sur
  `/dashboard` et `/admin` uniquement.

## Site vitrine public (nouveau)

- **`/home`** - landing. Positionnement **« avis public ou retour privé, au choix du client »**.
- **`/demo`** - page démo produit (QR réel généré au build, maquettes dashboard/parcours, tarifs à
  2 offres : Essentiel 2,99 € dispo / Pro « bientôt »). Bande de commerces = **exemples illustratifs**
  à remplacer par de vrais clients.
- **Pages légales** (route group `src/app/(legal)/`, layout avec header/footer) :
  `/mentions-legales`, `/confidentialite`, `/cgu`, `/cgv`, `/cookies`, `/google-business-profile`.
- `/vitrine` **redirige** désormais vers `/home` (ancienne landing supprimée).
- En-tête/pied partagés : `src/components/site/{site-header,site-footer}.tsx`.

### Conformité Google (fait - ne pas réintroduire)
- **Aucun review gating** : le bouton « Avis Google » est proposé à **tous** les clients ; le retour
  privé est présenté comme un **canal de contact complémentaire**, jamais comme un filtre.
- **Pas de promesses invérifiables** : aucun témoignage/stat fictif ; un clic ≠ un avis publié.
- **Mention d'indépendance Google** dans footer + mentions légales + page GBP (`GOOGLE_DISCLAIMER`).
- Constantes de discours dans `src/lib/brand.ts` (`SUBSCRIPTION`, `STAND_PRICE`, `GOOGLE_DISCLAIMER`).

## Identité visuelle

- **Logo** : monogramme « r » cobalt + point doré des étoiles Google `#FBBC04`
  (`src/components/ui/logo.tsx`, `REVIEW_GOLD`). Favicon = `src/app/icon.svg`.
- Design tokens dans `src/app/globals.css` : cobalt `--color-brand`, accent doré `--color-accent`,
  ombres, micro-animations (`.reveal`, `.pop`, `.elev` ; respect de `prefers-reduced-motion`).

## Système de présentoirs (production-ready) - NE PAS CASSER

- `code` = **identifiant public permanent** (QR + NFC), immuable (trigger), non supprimable après
  validation/export. Écritures directes révoquées → tout passe par des RPC `SECURITY DEFINER`.
- **Secret d'activation** = HMAC-SHA256 d'une clé **Vault** (`stand_activation_key`, permanente -
  **ne jamais régénérer**). Jamais stocké, reproductible pour l'export.
- **Lots** (`stand_batches`) : `draft → validated → exported` (verrouillage définitif).
- **Export fournisseur** `.xlsx` par lot (`/admin/export?batch=<id>`, avec secret) - verrouille le lot.
  Export global `/admin/export` = **sans** secret.
- ⚠️ **100 présentoirs commandés** : leurs codes/URL/secrets sont **physiques et figés**. Toute
  évolution doit rester compatible (le comportement est côté serveur, jamais dans l'URL gravée).

## Comportement au scan (nouveau - `establishments.scan_mode`)

Réglable par établissement dans le dashboard (Établissement) :
- **`direct`** (défaut) : le scan enregistre la vue puis **redirige immédiatement** vers l'avis Google
  (via `/r/<code>/go`, qui trace le clic). Un seul geste, stats conservées.
- **`page`** : affiche la page reviu (accueil + bouton Google **pour tous** + canal de contact privé).

Migration `supabase/migrations/20260723120000_reviu_establishment_scan_mode.sql` (appliquée en prod).
`resolve_stand` renvoie désormais `scan_mode`. Logique dans `src/app/r/[code]/page.tsx`.

## Abonnement Stripe - RÉEL (code fait, config à finir)

Remplace l'ancienne simulation. **La table `subscriptions` avait déjà les colonnes Stripe** - aucune
migration nécessaire.
- `src/lib/stripe.ts` - client Stripe serveur + helpers.
- `src/lib/stripe-actions.ts` - `startCheckoutAction` (dashboard), `openBillingPortalAction`
  (gérer/résilier), `startSelfCheckout` (parcours scan, gardé par le secret d'activation).
- `src/app/api/stripe/webhook/route.ts` - **source de vérité** : met à jour `subscriptions` via le
  service role après vérification de signature (`checkout.session.completed`,
  `customer.subscription.created/updated/deleted`).
- Entitlement = `status in ('active','trialing')` → `isTracked()`.
- ⚠️ Tant que les variables Stripe ne sont pas dans Vercel + webhook créé, les boutons affichent
  « paiement indisponible » (le reste marche).

**Tarifs** : présentoir **29,90 €** (achat unique, `STAND_PRICE`) + activation gratuite +
abonnement **2,99 €/mois** par présentoir. Les boutons « Commander » pointent vers la
**boutique interne** `/boutique` (`BOUTIQUE_URL`, plus de dépendance Shopify).

## Boutique e-commerce interne (nouveau)

Vraie boutique servie par la même app, sur `reviu.fr/boutique` (routes non réécrites par
`proxy.ts`, servies telles quelles). Remplace toute idée de site Shopify externe.

- **Catalogue** - source de vérité unique des prix : `src/lib/shop.ts` (`CATALOG`, montants en
  centimes, surchargeables par `SHOP_PRICE_*`). 4 produits : `stand` (29,90 €), `formation`
  (49 €, numérique), `pack10` (199 €) et `pack20` (349 €) = formation + 10/20 présentoirs.
- **Pages** : `/boutique` (vitrine + cartes produit), `/boutique/merci` (confirmation, vérifie
  la session Stripe côté serveur), `/formation` (espace formation protégé).
- **Checkout** : `startShopCheckout` (`src/lib/stripe-actions.ts`) - Stripe Checkout
  `mode: 'payment'`, `price_data` en ligne (aucun produit Stripe à créer), collecte d'adresse
  pour le physique, `invoice_creation`, `allow_promotion_codes`. Bouton client : `buy-button.tsx`.
- **Webhook** (`api/stripe/webhook`) : le cas `checkout.session.completed` branche sur `mode`.
  `payment` + `shop_product` → `handleShopOrder` : e-mail commerçant (préparation + adresse) +
  e-mail client (confirmation + accès formation). Le flux abonnement est inchangé.
- **Accès formation** : produit numérique livré par **page protégée** `/formation?token=…`.
  Le jeton est un HMAC signé de la session Stripe (`formationGrantToken`), vérifié sans état.
  Secret : `REVIU_SHOP_SECRET` (à défaut, réutilise `SUPABASE_SERVICE_ROLE_KEY`). Contenu du
  cours **rédigé** dans `formation/page.tsx` (`MODULES`) : 5 modules, 18 leçons (blocs
  paragraphe/étapes/liste/astuce/script, lecture en accordéons). Modèle enseigné = « marge
  physique » (revendeur = marge à la revente ; reviu garde le récurrent 2,99 €/mois).
- **Programme revendeur** = packs remisés (achat groupé) pour cette V1. La **commission
  récurrente** sur les abonnements (attribution revendeur→présentoir→abo) est une **phase 2**.
- **Photos produit** : `public/products/{presentoir,presentoir-angle,presentoir-comptoir}.png`
  (voir `public/products/README.md`). Repli de marque automatique si absentes (`ProductPhoto`).

## Programme revendeur & emailing d'abonnement (phase 2)

**Modèle retenu : « marge physique ».** Le revendeur achète les présentoirs en
pack remisé et les revend : sa rémunération = la **marge à la revente**, encaissée
une fois. **reviu garde 100 % du récurrent** (abonnement 2,99 €/mois), vendu en
direct au commerçant - notamment par e-mail. Pas de commission récurrente.

- **Attribution** : `stands.reseller_id` (nullable) relie un présentoir à un
  `resellers`. Écritures via RPC `SECURITY DEFINER` (comme les stands).
- **Espace revendeur** `/dashboard/revendeur` (lien de nav affiché si `getIsReseller()`)
  - **informatif** : présentoirs attribués / déployés / commerçants abonnés + code
  revendeur. Aucune notion d'argent. RPC `reseller_overview`, `reseller_stands`.
- **Admin** `/admin/resellers` : créer un revendeur (à partir de l'e-mail d'un
  compte existant) et lui attribuer des présentoirs (par codes ou par lot).
  RPC `admin_create_reseller`, `admin_assign_stands`, `admin_assign_batch`,
  `admin_list_resellers`. ⚠️ `resellers.commission_cents` existe mais est **dormant**
  (réservé si un programme de commission était réactivé un jour).
- **Emailing d'abonnement** (le levier de conversion du récurrent) :
  - **Auto** à l'activation d'un présentoir → offre d'abonnement au commerçant
    (`sendSubscriptionOffer`, branché dans `activation-actions.ts`).
  - **À la demande** `/admin/emailing` : « Relancer les non-abonnés » envoie l'offre
    à tous les commerçants sans abonnement actif (RPC `admin_unsubscribed_contacts`,
    action `relanceUnsubscribedAction`, dédupliqué, best-effort).
  - Dépend de `RESEND_API_KEY` + `REVIU_EMAIL_FROM` (comme les autres e-mails).
- **Migrations** : `20260723160000_reviu_resellers_phase2.sql`,
  `20260723170000_reviu_unsubscribed_contacts.sql` (dans le repo **et** appliquées en prod).

## Notifications e-mail

- **Retour client** (`feedback`) → e-mail au commerçant (`src/app/r/[code]/feedback/actions.ts`).
- **Nouvelle inscription** → e-mail à `yoan.oliveira30@gmail.com` (`ADMIN_NOTIFY_EMAIL` dans `brand.ts`,
  envoi dans `signUpAction`). Best-effort : ne bloque jamais l'inscription.
- Les deux dépendent de `RESEND_API_KEY` + `REVIU_EMAIL_FROM` (domaine vérifié Resend).

## Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_APP_BASE=https://app.reviu.fr           # http://localhost:3000 en dev
NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr        # http://localhost:3000 en dev
NEXT_PUBLIC_SITE_URL=https://reviu.fr               # site vitrine (canonical)
# NEXT_PUBLIC_BOUTIQUE_URL=https://reviu.fr/boutique  # optionnel (défaut = SITE_URL + /boutique)

# Serveur uniquement (secrets) :
SUPABASE_SERVICE_ROLE_KEY=...       # webhook Stripe, notifs e-mail, dérivation secret
RESEND_API_KEY=...                  # envoi e-mails (Resend, domaine reviu.fr vérifié)
REVIU_EMAIL_FROM=reviu <avis@reviu.fr>
STRIPE_SECRET_KEY=sk_live_...       # ⚠️ jamais dans le code - Vercel uniquement
STRIPE_PRICE_ID=price_...           # tarif récurrent 2,99 €/mois
STRIPE_WEBHOOK_SECRET=whsec_...     # créé à l'ajout du endpoint webhook
# REVIU_SHOP_SECRET=...             # signe les accès formation (défaut : SERVICE_ROLE_KEY)
# SHOP_PRICE_STAND=2990 SHOP_PRICE_FORMATION=4900 SHOP_PRICE_PACK10=19900 SHOP_PRICE_PACK20=34900
# REVIU_ALLOW_STAND_GENERATION=true # UNIQUEMENT en local si besoin de générer
```

## Actions manuelles restantes (par ordre de priorité)

1. **Domaine `reviu.fr`** : Vercel → Domains → ajouter `reviu.fr` + `www.reviu.fr` + DNS chez le
   registrar. Sans ça, le site vitrine n'est pas accessible sur `reviu.fr`.
2. **Stripe** (mode test d'abord) : clé secrète, Price ID, **activer le Customer Portal**, créer le
   **webhook** `https://app.reviu.fr/api/stripe/webhook` (events checkout.session.completed +
   customer.subscription.created/updated/deleted) → récupérer `whsec_`. Mettre les 3 variables dans
   Vercel + **redeploy**. Puis passer en live.
3. **Champs légaux à compléter** : `/cgv` → **nom du médiateur de la consommation** (`[à compléter]`) ;
   vérifier l'**adresse de Nîmes** (mise aléatoirement) dans `/mentions-legales`, `/confidentialite`, `/cgv`.
4. **Demande Google Business Profile API** : projet Google Cloud, formulaire d'accès, écran de
   consentement OAuth (scope `business.manage`). URLs à fournir : `https://reviu.fr/confidentialite`
   et `https://reviu.fr/google-business-profile`. **L'intégration GBP côté code n'est PAS développée**
   (seule la page publique de divulgation existe).
5. **Supabase Auth** : *Leaked password protection* activé ; Redirect URLs (`/auth/callback`,
   `/reset-password`).
6. **Boutique** : déposer les **photos produit** dans `public/products/` (voir son README) ;
   ajuster les prix si besoin dans `src/lib/shop.ts`. Le **contenu de la formation** est désormais
   rédigé (`src/app/formation/page.tsx`, `MODULES`) - relire/affiner le discours au besoin. La
   boutique fonctionne dès que Stripe est configuré (§2).
7. **Clé Vault** `stand_activation_key` : déjà créée, **ne jamais supprimer/régénérer**.

## Base de données (objets hors repo)

Plusieurs objets vivent **directement dans la base** (pas dans les migrations du repo) :
`subscriptions` (déjà colonnes Stripe), `resolve_stand`, `record_scan`, `my_stats`,
`self_set_subscription`, `owner_set_subscription`, `set_stand_target`, `derive_stand_secret`, etc.
→ Pour les inspecter/modifier, passer par le **MCP Supabase** (`execute_sql`, `apply_migration`).
`establishments.scan_mode` a été ajouté par migration (dans le repo **et** appliqué en prod).

## Reste à faire / limites

- **Intégration GBP** (lire/répondre aux avis + stats de fiche) : à développer après l'accès API Google.
- **Offre Pro** : présentée « bientôt » sur `/demo` (alertes, réponses IA, GBP, multi-établissements) -
  pas encore de 2ᵉ prix Stripe ni de fonctionnalités.
- **Quick wins possibles** (sans dépendre de Google) : alertes nouveaux avis, réponses IA, digest hebdo.
- **Avis Google** non détectés (aucune intégration GBP) ; seuls les retours privés `feedback` sont gérés.
- Suppression de compte admin : retire les données métier, ne supprime pas l'utilisateur `auth.users`.
```
