# reviu - note de reprise

> Dernière mise à jour : **28 juillet 2026**. **À lire en premier : la section
> « 🟦 Reprise - état au 28/07 » ci-dessous fait foi.** Les parties « historiques »
> plus bas datent d'avant le retrait de l'abonnement payant ; partout où elles
> présentent l'« abonnement de suivi 2,99 €/mois » comme le **modèle courant**,
> c'est **OBSOLÈTE** (le détail technique - présentoirs, Stripe, RLS - reste, lui,
> valable).

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
