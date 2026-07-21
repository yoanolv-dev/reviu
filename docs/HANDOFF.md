# reviu — note de reprise

Branche courante : `claude/session-yrp3ge`.

## Ce qui existe

- **Landing** `/` — vitrine (hero, fonctionnement, avantages, preuve sociale, conformité).
- **Parcours client final** `/r/[code]` — page d'avis brandée, redirection tracée `/r/[code]/go`
  (vers le **lien propre** du présentoir `target_url`, sinon l'avis Google), feedback privé `/r/[code]/feedback`.
- **Activation self-service** `/r/[code]` (présentoir vierge) — configuration directe depuis le scan :
  nom du commerce + lien Google + **e-mail** (+ PIN), le présentoir devient actif immédiatement **sans compte**.
  L'e-mail entre en **base clients** (`customers`) et le présentoir est relié au client. Puis **offre
  d'abonnement 2,99 €/mois** (suivi des stats + édition illimitée des liens), **sans obligation** (« Plus tard »).
- **Dashboard** `/dashboard` — auth (mot de passe **ou lien magique**), onboarding, config établissement,
  présentoirs, avis privés. Les **statistiques sont verrouillées** tant qu'aucun présentoir n'est suivi.
  Par présentoir : **S'abonner / Se désabonner** (à tout moment) + **édition du lien** (réservée aux abonnés).
  Au retour (lien magique), `bind_account()` rattache automatiquement les présentoirs activés en self-service.
- **Admin** `/admin` — générateur de présentoirs (lots de codes + **PIN** affichés une seule fois + QR), export CSV, feuille QR.
- **Supabase** — projet ref `sudspaqmgqwhyabflyzi` (région eu-central-1).

## Modèle d'abonnement

Abonnement **par présentoir** (2,99 €/mois), table `subscriptions`. Entitlement = `status in ('active','trialing')`
→ débloque le suivi des stats et `set_stand_target` (édition du lien). **Actuellement simulé** (boutons
S'abonner/Se désabonner qui basculent le statut) ; Stripe (Checkout + webhooks) reste à brancher en Phase 2 —
la logique d'entitlement ne changera pas.

## `.env.local` à recréer (non versionné)

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DI6x2lBXc9uANe38Jf-M4w_qPq6JbNP
NEXT_PUBLIC_APP_BASE=https://app.reviu.fr        # http://localhost:3000 en dev
NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr     # http://localhost:3000 en dev
```

La clé `sb_publishable_...` est **publique** (navigateur) — la sécurité repose sur le RLS et les fonctions
SQL `SECURITY DEFINER`. Aucune clé secrète n'est nécessaire côté app.

## Réseau (égress)

L'app doit joindre `*.supabase.co`. Autoriser ce host dans la **politique réseau de l'environnement**
(la modif s'applique au **démarrage** d'une session). En dev derrière le proxy : lancer avec
`NODE_USE_ENV_PROXY=1` (Node ≥ 22.21), sinon le `fetch` natif de Node ignore le proxy.

## Lancer

```
pnpm install
NODE_USE_ENV_PROXY=1 pnpm dev   # en environnement web derrière proxy
# ou simplement: pnpm dev       # en local sans proxy
```

## Test end-to-end (activation + suivi)

Présentoirs en base : `demo` (actif → Le Comptoir de Camille), `blank01` (vierge, **sans PIN**).
Admin : `yoan.oliveira30@gmail.com` (table `app_admins`).

1. `/admin` (connecté en admin) → générer un lot → **noter le code + PIN** (affichés une seule fois).
2. `/r/<code>` (présentoir vierge) → « Configurer » → nom + lien Google + e-mail + PIN → **présentoir actif**.
3. Offre 2,99 €/mois → « S'abonner » (simulé) ou « Plus tard ».
4. `/r/<code>` → page d'avis ; « Laisser un avis » → `/r/<code>/go` (redirige vers le lien du présentoir, trace le clic).
5. `/login` → **lien magique** avec l'e-mail utilisé → `/dashboard` : `bind_account` rattache le présentoir ;
   stats déverrouillées si abonné ; par présentoir, s'abonner/se désabonner + modifier le lien.

## Base de données (migrations appliquées)

`reviu_core_schema`, `reviu_demo_seed`, `reviu_public_rpc`, `reviu_claim_stand`, `reviu_stand_generator`,
`reviu_billing_and_pins` (colonnes `stands.target_url` + `claim_pin_hash`, table `subscriptions`, `set_stand_target`),
`reviu_admin_subscription_sim` (`admin_set_subscription`, `admin_list_subscriptions`),
`reviu_self_service_activation` (table `customers`, `organizations.customer_id`, RPC `activate_stand`,
`self_set_subscription`, `owner_set_subscription`, `bind_account`).

Tables : `organizations`, `establishments`, `stands`, `scans`, `feedback`, `profiles`, `app_admins`,
`subscriptions`, `customers`.

RPC (toutes `SECURITY DEFINER`, gardées en interne) : `resolve_stand`, `record_scan`, `submit_feedback`,
`claim_stand`, `generate_stands`, `admin_list_stands`, `is_admin`, `set_stand_target`,
`admin_set_subscription`, `admin_list_subscriptions`, `activate_stand`, `self_set_subscription`,
`owner_set_subscription`, `bind_account`.

## Reste à faire

- **Stripe (Phase 2)** : remplacer la simulation d'abonnement par Checkout + webhooks (garde d'entitlement inchangée).
- Configurer l'envoi d'e-mails Supabase (lien magique / OTP) et les Redirect URLs autorisées (dont `/dashboard`).
- Déploiement Vercel + domaines (`reviu.fr`, `app.reviu.fr`, `r.reviu.fr`).
- Nettoyer 2 erreurs lint préexistantes dans `src/app/page.tsx` (`<a>` interne → `<Link>`).
- Roadmap : multi-plateforme (`target_type` déjà prêt), IA de réponse aux avis, marque blanche.
