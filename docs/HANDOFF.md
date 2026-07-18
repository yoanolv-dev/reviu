# reviu — note de reprise

MVP complet sur la branche `claude/saas-avis-nfc-qr-5qsdq7`.

## Ce qui existe

- **Landing** `/` — vitrine (hero, fonctionnement, avantages, preuve sociale, conformité).
- **Parcours client final** `/r/[code]` — page d'avis brandée, redirection traçée `/r/[code]/go`,
  écran d'activation, feedback privé `/r/[code]/feedback`.
- **Dashboard** `/dashboard` — auth, onboarding, config établissement, présentoirs, analytics, avis privés.
- **Admin** `/admin` — générateur de présentoirs (lots de codes + QR), export CSV, feuille QR.
- **Supabase** — projet ref `sudspaqmgqwhyabflyzi` (région eu-central-1).

## `.env.local` à recréer (non versionné)

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DI6x2lBXc9uANe38Jf-M4w_qPq6JbNP
NEXT_PUBLIC_APP_BASE=https://app.reviu.fr
NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr
```

La clé `sb_publishable_...` est **publique** (côté navigateur) — la sécurité repose sur le RLS et
les fonctions SQL `SECURITY DEFINER`. Aucune clé secrète n'est nécessaire côté app.

## Réseau (égress)

L'app doit joindre `*.supabase.co`. Autoriser ce host dans la **politique réseau de l'environnement**
(la modif s'applique au **démarrage** d'une session, pas à chaud).
En dev derrière le proxy : lancer avec `NODE_USE_ENV_PROXY=1` (Node ≥ 22.21), sinon le `fetch`
natif de Node ignore le proxy.

## Lancer

```
pnpm install
NODE_USE_ENV_PROXY=1 pnpm dev   # en environnement web derrière proxy
# ou simplement: pnpm dev       # en local sans proxy
```

## Test end-to-end

Comptes/codes déjà en base : présentoir `demo` (actif → Le Comptoir de Camille), `blank01` (vierge).
Admin : `yoan.oliveira30@gmail.com` (table `app_admins`).

1. `/signup` → créer un compte → onboarding (nom d'établissement + lien Google).
2. `/admin` (connecté en admin) → générer un lot → récupérer un code.
3. `/dashboard/stands` → rattacher ce code (le présentoir passe « actif »).
4. `/r/<code>` → page d'avis ; « Laisser un avis » → `/r/<code>/go` (redirige vers Google).
5. `/dashboard` → scans/clics/conversion ; `/r/<code>/feedback` → retour privé → `/dashboard/feedback`.

## Base de données (migrations appliquées)

`reviu_core_schema`, `reviu_demo_seed`, `reviu_claim_stand`, `reviu_stand_generator`.
Tables : `organizations`, `establishments`, `stands`, `scans`, `feedback`, `profiles`, `app_admins`.
RPC : `resolve_stand`, `record_scan`, `submit_feedback`, `claim_stand`, `generate_stands`,
`admin_list_stands`, `is_admin`.

## Validation e2e (2026-07-18)

Égress `*.supabase.co` **ouvert** dans l'environnement web : le `fetch` natif de Node joint
Supabase **avec comme sans** `NODE_USE_ENV_PROXY=1` (accès direct autorisé + certificats
publics). Le flag reste utile derrière un proxy strict mais n'est pas requis ici, et n'a
aucun effet sur le point d'hydratation ci-dessous.

Parcours client final déroulé de bout en bout sur **build de prod** (app réelle + base Supabase) :

- `/r/demo` → page brandée « Le Comptoir de Camille » (RPC `resolve_stand`) ; scan `view` enregistré (canal nfc/qr).
- `/r/demo/go` → `302` vers l'avis Google ; scan `click` enregistré.
- `/r/demo/feedback` → envoi du retour privé (server action → `submit_feedback`) → ligne `feedback` en base (note + établissement + présentoir).
- `/r/blank01` → écran « présentoir prêt à être activé ».
- Garde d'auth OK : `/dashboard` et `/admin` redirigent vers `/login` ; câblage login vérifié (mauvais identifiants → erreur Supabase remontée).

⚠️ **Dev vs prod dans le sandbox web.** `next dev` (Turbopack) n'hydrate pas les composants
client ici : le handshake WebSocket HMR côté navigateur échoue (`ERR_INVALID_HTTP_RESPONSE`)
alors que le serveur répond bien `101` à un upgrade brut. Les formulaires (étoiles, feedback,
login) restent donc inertes en dev, mais le SSR et les redirections fonctionnent. **Pour tester
l'interactivité dans cet environnement, utiliser un build de prod** : `pnpm build && pnpm start`
(tout hydrate correctement). En local hors sandbox, `next dev` reste OK.

Étapes marchand/admin authentifiées (signup → onboarding → génération de lot → rattachement →
analytics) **non déroulées** : `mailer_autoconfirm=false` et pas de boîte mail ici pour
confirmer le compte. Le câblage auth est vérifié ; reste à les dérouler avec un compte confirmé.

## Modèle SaaS (verrouillé 2026-07-18)

Positionnement : concurrent direct de Digifeel. On fabrique des plaques NFC + QR
**dynamiques** (le QR pointe toujours vers `r.reviu.fr/{code}`, jamais en dur vers Google) ;
le commerçant paramètre son lien et suit ses scans depuis l'app.

Décisions produit/business :

- **Facturation par présentoir** : le suivi coûte **2,99 €/mois par présentoir** (pas par
  compte). Stripe à prévoir en **facturation à la quantité** (un abonnement client, quantité =
  nb de présentoirs suivis) pour limiter les frais fixes sur un si petit montant.
- **Freemium** : une plaque **redirige toujours gratuitement, à vie** (lien posé une fois à
  l'activation). L'abonnement débloque **statistiques + modification du lien** (+ multi-plateforme,
  tunnel d'avis privé). Les plaques « vendues sans service » fonctionnent donc sans compte.
- **Scans enregistrés même en gratuit** → aperçu incitatif + historique déjà présent le jour
  de l'abonnement.
- **Activation** : self-service (le client scanne → saisit le PIN → pose son lien) **et**
  pré-configuration possible par l'admin (vente clé en main).
- **Sécurité claim** : chaque plaque porte un **PIN secret imprimé** (hors QR), requis pour la
  réclamer. PIN stocké **hashé** en base, imprimé en clair sur la plaque.
- **Lien par présentoir** (`stands.target_url`) : destination propre à chaque plaque, initialisée
  depuis l'établissement, surchargeable.
- **Fichier fournisseur** = Excel `code · URL · PIN`, une ligne par présentoir.

### Plan de construction

- **Phase B (faite)** : `plans.ts` + `/tarifs` en freemium 2,99 €/présentoir.
- **Phase A (faite, migration `reviu_billing_and_pins`)** : `stands.target_url`,
  `stands.claim_pin_hash` (bcrypt via pgcrypto), table `subscriptions` (par présentoir, lecture
  seule côté client), `generate_stands` v2 (retourne code+PIN), `claim_stand` v2 (PIN requis,
  rétro-compatible avec la démo sans PIN), `resolve_stand` v2 (lien effectif), `set_stand_target`
  (gated abonnement). Redirection `/r/{code}/go` sur le lien effectif.
- **Phase C (faite, code)** : `lib/stripe.ts`, `lib/supabase/admin.ts` (service_role),
  `lib/billing-actions.ts` (Checkout **1 abonnement par présentoir** + portail), route
  `/api/stripe/webhook` (signature vérifiée, upsert `subscriptions`). `proxy.ts` exclut `/api`.
  Dégrade proprement tant que Stripe n'est pas configuré. **Optimisation à faire** : passer en
  facturation à la quantité (1 abo client, quantité = nb de présentoirs) pour réduire les frais.
- **Phase D (faite)** : page présentoirs — activer/gérer le suivi par présentoir, stats
  verrouillées si non suivi ; admin génère avec PIN + télécharge le fichier fournisseur (CSV).

### Stripe — mise en service (à faire par le fondateur)

1. Compte Stripe (mode test) → créer un **produit « Suivi reviu »** avec un **prix récurrent
   2,99 €/mois** → récupérer l'ID `price_...`.
2. Webhook Stripe → endpoint `https://<domaine>/api/stripe/webhook`, événements
   `checkout.session.completed`, `customer.subscription.updated|deleted` → récupérer `whsec_...`.
3. Variables d'environnement (Vercel + `.env.local`) :
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONITORING`,
   `SUPABASE_SERVICE_ROLE_KEY` (clé secrète Supabase, serveur only).

## Reste à faire

- Mettre en service Stripe (ci-dessus) puis dérouler un paiement test de bout en bout.
- Dérouler les étapes marchand/admin authentifiées avec un compte confirmé (voir « Validation e2e »).
- Durcissement (optionnel) : gate DB des changements de lien / lecture des scans par abonnement.
- Déploiement Vercel + domaines (`reviu.fr`, `app.reviu.fr`, `r.reviu.fr`).
- Roadmap : IA de réponse aux avis, marque blanche.
