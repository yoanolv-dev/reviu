# reviu — note de reprise

**Branche de travail active : `claude/handoff-setup-e2e-test-pabqr9`** (Pull Request **#1**).
Pousser sur cette branche met à jour la PR #1. Déploiement auto Vercel (dernier build : vert).

Positionnement : concurrent direct de **Digifeel**. Plaques **NFC + QR dynamiques** (le QR pointe
toujours vers `r.reviu.fr/{code}`, jamais en dur vers Google) ; le commerçant paramètre son lien et
suit ses scans depuis l'app. Monétisation : **suivi à 2,99 €/mois par présentoir** (freemium).

---

## État actuel (tout est commité + poussé + build Vercel vert)

**Fait et en place :**
- **Landing** `/` + **page tarifs** `/tarifs` (freemium : « Plaque active » 0 € vs « Suivi reviu » 2,99 €/présentoir/mois).
- **Parcours client final** `/r/[code]` → page brandée, redirection tracée `/r/[code]/go` (utilise le **lien effectif** du présentoir), feedback privé `/r/[code]/feedback`. **Vérifié de bout en bout** (build prod + DB).
- **Activation self-service** `/activate/[code]` : un écran (nom établissement + lien + **PIN**) qui crée/réutilise l'établissement et rattache la plaque. Auth avec paramètre `next` (le scan revient au bon endroit après signup/login). La vue « plaque vierge » de `/r/[code]` pointe vers `/activate/[code]`.
- **Dashboard** `/dashboard/stands` : suivi **par présentoir** (Activer / Gérer / Désactiver), **stats verrouillées** si non suivi (aperçu incitatif), **édition du lien** d'un présentoir suivi (RPC `set_stand_target`, gated abonnement).
- **Admin** `/admin` : génération d'un lot **avec PIN**, **téléchargement du fichier fournisseur en `.xlsx`** (SheetJS ; colonnes `code · url_qr · url_nfc · pin`, une ligne par présentoir).
- **Stripe (code complet, facturation à la quantité)** : un abonnement Stripe par marchand, quantité = nb de présentoirs suivis. 1er présentoir → Checkout ; suivants → quantité +1 ; désactivation → quantité −1 (ou annulation si dernier). Webhook signé synchronise toutes les lignes d'un même abonnement. **Dégrade proprement** tant que Stripe n'est pas configuré.

**Pas encore fait / à valider :** voir « Reste à faire ».

---

## `.env.local` à recréer (non versionné)

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DI6x2lBXc9uANe38Jf-M4w_qPq6JbNP
NEXT_PUBLIC_APP_BASE=https://app.reviu.fr
NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr
```

La clé `sb_publishable_...` est **publique** — la sécurité repose sur le RLS + les fonctions
`SECURITY DEFINER`. Le **parcours public et le dashboard fonctionnent sans autre clé**. Seule la
**facturation Stripe** exige des secrets serveur (voir « Stripe — mise en service »).

## Lancer / tester

```
pnpm install
pnpm build && pnpm start   # tester l'INTERACTIVITÉ (voir note dev/prod ci-dessous)
# NODE_USE_ENV_PROXY=1 pnpm dev  # dev derrière proxy (Node >= 22.21) ; l'égress marche aussi sans
```

⚠️ **Dev vs prod dans le sandbox web.** `next dev` (Turbopack) **n'hydrate pas** les composants
client ici (le handshake WebSocket HMR du navigateur échoue : `ERR_INVALID_HTTP_RESPONSE` ; le
serveur répond bien `101` à un upgrade brut). Les formulaires restent inertes en dev. **Pour tester
l'interactivité, utiliser un build de prod** (`pnpm build && pnpm start`) — tout hydrate. En local
hors sandbox, `next dev` est OK. Égress `*.supabase.co` : ouvert, le `fetch` Node marche avec comme
sans `NODE_USE_ENV_PROXY=1`.

---

## Base de données (Supabase ref `sudspaqmgqwhyabflyzi`, eu-central-1)

Migrations appliquées : `reviu_core_schema`, `reviu_demo_seed`, `reviu_public_rpc`,
`reviu_claim_stand`, `reviu_stand_generator`, **`reviu_billing_and_pins`**.

Tables : `organizations`, `establishments`, `stands` (**+ `target_url`, `claim_pin_hash`**),
`scans`, `feedback`, `profiles`, `app_admins`, **`subscriptions`**.

- `subscriptions` : 1 ligne / présentoir suivi (`stand_id` PK, `status`, `stripe_customer_id`,
  `stripe_subscription_id`, `current_period_end`). RLS : **lecture seule** par le propriétaire ;
  écriture réservée au **service_role** (webhook / actions de facturation).

RPC : `resolve_stand` (v2, renvoie le lien effectif), `record_scan`, `submit_feedback`,
`claim_stand` (v2, `p_pin` requis si la plaque a un PIN ; rétro-compatible avec la démo sans PIN),
`generate_stands` (v2, renvoie `code`+`pin`, stocke le hash bcrypt), `admin_list_stands`,
`is_admin`, **`set_stand_target`** (change le lien, exige un abonnement actif).

Données de démo : présentoir `demo` (actif → « Le Comptoir de Camille ») et `blank01` (vierge, **sans
PIN** → activable sans PIN). Admin : `yoan.oliveira30@gmail.com` (table `app_admins` ; `is_admin()`
compare l'email du JWT). **Aucun compte `auth.users` n'existe encore** (`mailer_autoconfirm=false`).

---

## Modèle SaaS (verrouillé)

- **Facturation par présentoir**, 2,99 €/mois. Stripe **à la quantité** (implémenté).
- **Freemium** : la plaque **redirige toujours gratuitement, à vie** (lien posé à l'activation).
  L'abonnement débloque **stats + modification du lien**. Les plaques « vendues sans service »
  fonctionnent sans compte.
- **Scans enregistrés même en gratuit** (aperçu incitatif + historique dès l'abonnement).
- **Activation** : self-service (scan → PIN → lien) **et** pré-configuration admin possible.
- **Sécurité claim** : PIN secret **imprimé sur la plaque** (hors QR), stocké **hashé**.
- **Lien par présentoir** (`stands.target_url`), initialisé depuis l'établissement, surchargeable.
- **Fichier fournisseur** = `.xlsx` `code · url_qr · url_nfc · pin`.

## Fichiers clés (côté code)

- `src/lib/plans.ts` — offres (constante `MONITORING_PRICE_EUR = 2.99`).
- `src/lib/stripe.ts` — client Stripe + `isStripeConfigured()` + `subscriptionPeriodEnd()`.
- `src/lib/supabase/admin.ts` — client **service_role** (serveur only).
- `src/lib/billing-actions.ts` — `startMonitoringAction`, `stopMonitoringAction`, `billingPortalAction` (quantité).
- `src/app/api/stripe/webhook/route.ts` — webhook signé (runtime nodejs ; `proxy.ts` exclut `/api`).
- `src/lib/dashboard-actions.ts` — `activateStandAction`, `claimStandAction`, `setStandTargetAction`, etc.
- `src/app/activate/[code]/` — parcours d'activation self-service.
- `src/app/dashboard/stands/` — présentoirs + suivi + édition de lien.

---

## Stripe — mise en service (à faire par le fondateur, ~2 min)

1. Compte Stripe (mode **test**) → produit **« Suivi reviu »** + prix **récurrent 2,99 €/mois** → ID `price_...`.
2. Webhook Stripe → endpoint `https://<domaine>/api/stripe/webhook`, événements
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` → `whsec_...`.
3. Variables (Vercel **et** `.env.local`) :
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONITORING`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## Reste à faire (pour la reprise)

1. **Brancher Stripe** (ci-dessus) puis **valider un paiement test de bout en bout** : la logique
   quantité (checkout → webhook → +1/−1) **n'a pas encore été testée contre le vrai Stripe** (pas de
   clés dans cette session). À exercer avant prod.
2. **Vérifier les écrans marchands authentifiés** (activation, dashboard, suivi, édition de lien) :
   non déroulés en interactif ici car (a) `mailer_autoconfirm=false` et (b) redémarrages fréquents du
   conteneur. Méthode conseillée : créer un `auth.users` de test **confirmé** (signup GoTrue puis
   `update auth.users set email_confirmed_at=now()`), se connecter sur un **build de prod**, dérouler
   `/activate/<code>` → dashboard. Pour tester la gate « suivi », insérer une ligne `subscriptions`
   `status='active'` (simulation) tant que Stripe n'est pas branché.
3. **Nettoyage** : vérifier qu'aucune donnée de test ne traîne (`stands` code `e2etest`/`e2e_tmp`,
   user `test-merchant@reviu.fr`) — des tentatives de test ont été **interrompues par des redémarrages**
   et n'ont probablement rien persisté (les harness SQL font un rollback), mais à confirmer :
   `select code from stands where code in ('e2etest','e2e_tmp');`
   `select email from auth.users where email='test-merchant@reviu.fr';`
4. **Durcissement (optionnel)** : gate DB (privilèges colonne) des changements de lien / lecture des
   scans par abonnement — aujourd'hui la gate « suivi » est appliquée côté app/RPC (garde produit,
   pas frontière dure : un propriétaire peut lire ses propres scans via l'API).
5. **Déploiement** : domaines `reviu.fr`, `app.reviu.fr`, `r.reviu.fr` (le rewrite `r.` et
   `NEXT_PUBLIC_APP_BASE`/`REDIRECT_BASE` ne comptent qu'une fois les domaines rattachés ; sur
   l'URL `*.vercel.app` utiliser les chemins directs `/r/<code>`, `/activate/<code>`).
6. **Roadmap** : IA de réponse aux avis, marque blanche.
