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

## Modèle freemium (cible)

- **Gratuit** : activation unique du présentoir à réception (scan NFC/QR → `/activate/<code>`),
  redirection figée. Pas de stats, pas d'édition à distance.
- **Abonné** (table `subscriptions`, par présentoir) : stats temps réel + édition à distance
  de la redirection (`stands.target_url`).

## Fait — Phase 0 (activation unique)

- Page `/activate/[code]` : config unique (auth + PIN), crée l'établissement au besoin puis `claim_stand`.
- Deep-link depuis `/r/[code]` (scan d'un présentoir vierge) ; redirection post-auth `next` (anti open-redirect).
- Génération admin : PIN capturés, affichés et exportables en CSV (les PIN en clair ne sont dispo qu'à la génération).
- Rattachement dashboard : champ PIN. Redirection `/r/[code]/go` basée sur `target_url` (repli avis Google).
- Aucune migration : le schéma `reviu_billing_and_pins` (PIN, `target_url`, `subscriptions`) préexistait.

## Fait — Phase 1 (gating abonnement)

- Entitlement = abonnement `active`/`trialing` **par présentoir** (miroir de la garde SQL `set_stand_target`).
- `/dashboard` : stats verrouillées (placeholder + message) si aucun présentoir abonné ; sinon stats sur les stands abonnés.
- `/dashboard/stands` : badge Abonné/Gratuit par présentoir, compteur de scans réservé aux abonnés.
- `/admin` : colonne Abonnement + bascule de simulation (RPC `admin_set_subscription`, admin only) — remplacée par Stripe en Phase 2.
- Migration `reviu_admin_subscription_sim` : `admin_set_subscription`, `admin_list_subscriptions`.

## Reste à faire

- **Phase 2** : Stripe (checkout + webhook → `subscriptions`) — simulé pour l'instant.
- **Phase 3** : édition à distance de `target_url` (dashboard, abonnés).
- Déploiement Vercel + domaines (`reviu.fr`, `app.reviu.fr`, `r.reviu.fr`).
- Roadmap : multi-plateforme (`target_type`/`target_url` prêts), IA de réponse aux avis, marque blanche.
