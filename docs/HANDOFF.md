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

⚠️ **En session web derrière le proxy, `NODE_USE_ENV_PROXY=1` est OBLIGATOIRE** (Node ≥ 22.21).
Le `fetch` natif de Node ignore `HTTPS_PROXY` sans ce flag → **tous** les appels Supabase côté
serveur (server actions, server components, middleware) échouent silencieusement. Symptômes
observés sans le flag : login qui renvoie « e-mail ou mot de passe incorrect » alors que les
identifiants sont bons, pages `/dashboard`/`/admin` qui rebondissent vers `/login`. Validé en
juillet 2026 : avec le flag, tous les parcours authentifiés fonctionnent. En prod (Vercel) il n'y
a pas de proxy, donc ce flag est **inutile** hors sandbox.

## Lancer

```
pnpm install
NODE_USE_ENV_PROXY=1 pnpm dev   # en environnement web derrière proxy
# ou simplement: pnpm dev       # en local sans proxy
```

> **Sandbox web :** le `pnpm` de corepack (11.15) fait échouer `pnpm dev`/`pnpm build` sur un
> pré-check de dépendances (`ERR_PNPM_IGNORED_BUILDS` sur `sharp`/`unrs-resolver`). Contournement
> sans toucher la config : appeler le binaire directement —
> `NODE_USE_ENV_PROXY=1 ./node_modules/.bin/next dev` (ou `next build` / `next start`).
> `sharp` n'est pas requis au runtime (aucun `next/image` dans le code).

> **Note dev :** en `next dev` (Turbopack) l'hydratation des formulaires peut échouer dans le
> sandbox (HMR WebSocket). Pour tester l'interactivité, préférer un build de prod :
> `./node_modules/.bin/next build && NODE_USE_ENV_PROXY=1 ./node_modules/.bin/next start`.

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

## Validation (juillet 2026)

Parcours **authentifié complet validé de bout en bout** au navigateur (build prod + Supabase live) :
signup/login → onboarding (création org + établissement) → admin (génération de présentoirs) →
rattachement code+PIN → dashboard. Cas négatifs vérifiés : mauvais PIN rejeté, présentoir déjà
actif non re-rattachable.

**Bug corrigé — rattachement des présentoirs (PIN) :** `generate_stands` crée un `claim_pin_hash`
pour chaque présentoir et `claim_stand` exige ce PIN, mais l'ancienne UI ne l'exposait ni ne le
saisissait → tout présentoir généré était **irrattachable**. Corrigé :
- `generateStandsAction` remonte désormais les `{code, pin}` retournés par la RPC ;
  l'admin les voit dans un panneau (« affichés une seule fois ») + **export CSV** (le PIN n'existe
  en clair qu'à la génération, seul le hash est stocké).
- Le formulaire de rattachement a un champ **PIN** ; `claimStandAction` le transmet (`p_pin`),
  normalise la casse (code minuscule, PIN majuscule) et mappe l'erreur `invalid_pin`.

## Reste à faire

- Déploiement Vercel + domaines (`reviu.fr`, `app.reviu.fr`, `r.reviu.fr`).
- Roadmap : multi-plateforme (`target_type` déjà prêt), IA de réponse aux avis, marque blanche.
