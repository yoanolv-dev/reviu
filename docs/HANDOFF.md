# reviu — note de reprise

> Dernière mise à jour : 23 juillet 2026. Ce document est la **source de reprise** :
> il reflète l'état réel du code sur `main`.

## État : EN PRODUCTION ✅

- **`app.reviu.fr`** — application SaaS (Next.js 16 / App Router sur Vercel).
- **`r.reviu.fr`** — redirection NFC/QR (même app Next, host réécrit par `src/proxy.ts`).
- **`reviu.fr`** — **site vitrine public servi par la même app** (landing + pages légales).
  ⚠️ **Domaine pas encore branché sur Vercel** — voir « Actions manuelles ».
- **Données + Auth → Supabase** (projet ref `sudspaqmgqwhyabflyzi`, région eu-central-1).

Branche par défaut = **`main`** ; Vercel redéploie à chaque push. Développement sur branche +
PR vers `main`. **Code et base synchronisés** (migrations dans `supabase/migrations/`, mais
certaines fonctions/tables vivent directement dans la base — voir « Base de données »).

## Routage par domaine (`src/proxy.ts`)

- `r.reviu.fr/<code>` → `/r/<code>` (redirection présentoir).
- `reviu.fr` et `www.reviu.fr` → la racine `/` est réécrite vers `/home` (landing). Les pages
  légales et `/demo` sont servies telles quelles.
- `app.reviu.fr/` → `/login` (ou `/dashboard` si connecté). Session Supabase rafraîchie sur
  `/dashboard` et `/admin` uniquement.

## Site vitrine public (nouveau)

- **`/home`** — landing. Positionnement **« avis public ou retour privé, au choix du client »**.
- **`/demo`** — page démo produit (QR réel généré au build, maquettes dashboard/parcours, tarifs à
  2 offres : Essentiel 2,99 € dispo / Pro « bientôt »). Bande de commerces = **exemples illustratifs**
  à remplacer par de vrais clients.
- **Pages légales** (route group `src/app/(legal)/`, layout avec header/footer) :
  `/mentions-legales`, `/confidentialite`, `/cgu`, `/cgv`, `/cookies`, `/google-business-profile`.
- `/vitrine` **redirige** désormais vers `/home` (ancienne landing supprimée).
- En-tête/pied partagés : `src/components/site/{site-header,site-footer}.tsx`.

### Conformité Google (fait — ne pas réintroduire)
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

## Système de présentoirs (production-ready) — NE PAS CASSER

- `code` = **identifiant public permanent** (QR + NFC), immuable (trigger), non supprimable après
  validation/export. Écritures directes révoquées → tout passe par des RPC `SECURITY DEFINER`.
- **Secret d'activation** = HMAC-SHA256 d'une clé **Vault** (`stand_activation_key`, permanente —
  **ne jamais régénérer**). Jamais stocké, reproductible pour l'export.
- **Lots** (`stand_batches`) : `draft → validated → exported` (verrouillage définitif).
- **Export fournisseur** `.xlsx` par lot (`/admin/export?batch=<id>`, avec secret) — verrouille le lot.
  Export global `/admin/export` = **sans** secret.
- ⚠️ **100 présentoirs commandés** : leurs codes/URL/secrets sont **physiques et figés**. Toute
  évolution doit rester compatible (le comportement est côté serveur, jamais dans l'URL gravée).

## Comportement au scan (nouveau — `establishments.scan_mode`)

Réglable par établissement dans le dashboard (Établissement) :
- **`direct`** (défaut) : le scan enregistre la vue puis **redirige immédiatement** vers l'avis Google
  (via `/r/<code>/go`, qui trace le clic). Un seul geste, stats conservées.
- **`page`** : affiche la page reviu (accueil + bouton Google **pour tous** + canal de contact privé).

Migration `supabase/migrations/20260723120000_reviu_establishment_scan_mode.sql` (appliquée en prod).
`resolve_stand` renvoie désormais `scan_mode`. Logique dans `src/app/r/[code]/page.tsx`.

## Abonnement Stripe — RÉEL (code fait, config à finir)

Remplace l'ancienne simulation. **La table `subscriptions` avait déjà les colonnes Stripe** — aucune
migration nécessaire.
- `src/lib/stripe.ts` — client Stripe serveur + helpers.
- `src/lib/stripe-actions.ts` — `startCheckoutAction` (dashboard), `openBillingPortalAction`
  (gérer/résilier), `startSelfCheckout` (parcours scan, gardé par le secret d'activation).
- `src/app/api/stripe/webhook/route.ts` — **source de vérité** : met à jour `subscriptions` via le
  service role après vérification de signature (`checkout.session.completed`,
  `customer.subscription.created/updated/deleted`).
- Entitlement = `status in ('active','trialing')` → `isTracked()`.
- ⚠️ Tant que les variables Stripe ne sont pas dans Vercel + webhook créé, les boutons affichent
  « paiement indisponible » (le reste marche).

**Tarifs** : présentoir **29,90 €** (achat unique, `STAND_PRICE`) + activation gratuite +
abonnement **2,99 €/mois** par présentoir. Lien boutique = `NEXT_PUBLIC_SHOPIFY_PRODUCT_URL`.

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
NEXT_PUBLIC_SHOPIFY_PRODUCT_URL=https://reviu.fr/boutique   # page produit (à définir)

# Serveur uniquement (secrets) :
SUPABASE_SERVICE_ROLE_KEY=...       # webhook Stripe, notifs e-mail, dérivation secret
RESEND_API_KEY=...                  # envoi e-mails (Resend, domaine reviu.fr vérifié)
REVIU_EMAIL_FROM=reviu <avis@reviu.fr>
STRIPE_SECRET_KEY=sk_live_...       # ⚠️ jamais dans le code — Vercel uniquement
STRIPE_PRICE_ID=price_...           # tarif récurrent 2,99 €/mois
STRIPE_WEBHOOK_SECRET=whsec_...     # créé à l'ajout du endpoint webhook
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
6. **Shopify** : renseigner `NEXT_PUBLIC_SHOPIFY_PRODUCT_URL` (boutique de vente du présentoir).
7. **Clé Vault** `stand_activation_key` : déjà créée, **ne jamais supprimer/régénérer**.

## Base de données (objets hors repo)

Plusieurs objets vivent **directement dans la base** (pas dans les migrations du repo) :
`subscriptions` (déjà colonnes Stripe), `resolve_stand`, `record_scan`, `my_stats`,
`self_set_subscription`, `owner_set_subscription`, `set_stand_target`, `derive_stand_secret`, etc.
→ Pour les inspecter/modifier, passer par le **MCP Supabase** (`execute_sql`, `apply_migration`).
`establishments.scan_mode` a été ajouté par migration (dans le repo **et** appliqué en prod).

## Reste à faire / limites

- **Intégration GBP** (lire/répondre aux avis + stats de fiche) : à développer après l'accès API Google.
- **Offre Pro** : présentée « bientôt » sur `/demo` (alertes, réponses IA, GBP, multi-établissements) —
  pas encore de 2ᵉ prix Stripe ni de fonctionnalités.
- **Quick wins possibles** (sans dépendre de Google) : alertes nouveaux avis, réponses IA, digest hebdo.
- **Avis Google** non détectés (aucune intégration GBP) ; seuls les retours privés `feedback` sont gérés.
- Suppression de compte admin : retire les données métier, ne supprime pas l'utilisateur `auth.users`.
```
