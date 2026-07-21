# reviu — note de reprise

## État : EN PRODUCTION ✅

L'application est **déployée et live** :
- **`app.reviu.fr`** — application SaaS (Next.js sur Vercel).
- **`r.reviu.fr`** — service de redirection NFC/QR (même app Next, host réécrit par le proxy).

Branche par défaut = **`main`** (tout y est mergé). Vercel redéploie automatiquement à chaque push sur `main`.
Vérifié live : `app.reviu.fr/` → 307 `/login` · `/login` 200 · `/vitrine` OK · `r.reviu.fr/demo` (établissement démo) · `r.reviu.fr/demo/go` → 302 avis Google.

> ⚠️ **Code et base de données sont désormais SYNCHRONISÉS.** Piège historique corrigé : une session passée avait
> appliqué des migrations DB (billing/PIN/abonnements) **sans committer le code correspondant**. Ce n'est plus le cas.

## Architecture cible

- **Vitrine / e-commerce → Shopify** (à venir), sur `reviu.fr` / `www.reviu.fr`. **L'app ne sert plus la vitrine** :
  `app.reviu.fr/` redirige vers `/login` (ou `/dashboard` si connecté). L'ancienne landing est **conservée pour
  inspiration** sur **`/vitrine`** (noindex). Supprimable (`src/app/vitrine/`) quand le site Shopify sera prêt.
- **App SaaS → Next.js 16 (App Router) / Vercel**, `app.reviu.fr`.
- **Redirection NFC/QR → même app Next**, host `r.reviu.fr`. URL permanente gravée dans les puces/QR :
  `https://r.reviu.fr/<code>` (+ `?s=nfc|qr`). `src/proxy.ts` réécrit `r.*/<code>` → `/r/<code>`.
- **Données + Auth → Supabase** (projet ref `sudspaqmgqwhyabflyzi`, région eu-central-1).

## Parcours produit (tous LIVE)

1. **Scan présentoir vierge** `/r/<code>` → config self-service (`src/app/r/[code]/activate-flow.tsx`) : nom du
   commerce + lien Google + **e-mail** (+ PIN) → présentoir **ACTIF immédiatement, sans compte**. L'e-mail entre en
   **base clients** (`customers`) et le présentoir lui est relié (org avec `customer_id`, `owner_id` null).
2. **Offre d'abonnement 2,99 €/mois** (suivi des stats + édition illimitée des liens) juste après — **sans obligation**
   (« Plus tard »).
3. **Scan présentoir actif** → page d'avis brandée → `/r/<code>/go` trace le clic et redirige vers le **lien propre**
   du présentoir (`stands.target_url`, sinon avis Google de l'établissement).
4. **Retour** via `/login` : **mot de passe OU lien magique**. Au chargement du dashboard, `bind_account()` rattache
   automatiquement les présentoirs activés en self-service (par e-mail → pose `owner_id`). Stats **verrouillées** tant
   qu'aucun abonnement actif ; par présentoir : **S'abonner / Se désabonner** + **édition du lien** (réservée aux abonnés).
5. **Admin** `/admin` : génère des lots (code + **PIN** affiché une seule fois) + QR vectoriels + export CSV.

## Abonnement = SIMULÉ (Stripe à faire)

Table `subscriptions` (1 ligne par présentoir, 2,99 €/mois). Entitlement = `status in ('active','trialing')` →
débloque le suivi des stats et `set_stand_target` (édition du lien). Aujourd'hui basculé par boutons
(`self_set_subscription` gardé par PIN côté scan ; `owner_set_subscription` gardé par propriété côté dashboard).
**Stripe (Checkout + webhooks) = Phase 2**, la logique d'entitlement ne changera pas.

## Authentification (flux PKCE)

- Lien magique (`signInWithOtp`) **et** confirmation d'inscription passent par **`src/app/auth/callback/route.ts`**
  (`exchangeCodeForSession`) → session cookies → `/dashboard`. **Ne pas retirer `{{ .ConfirmationURL }}`** des templates.
- ⚠️ **Reset password NON câblé dans l'app.** Il manque : (a) un lien « Mot de passe oublié ? » sur `/login`
  déclenchant `resetPasswordForEmail`, (b) une page « définir un nouveau mot de passe » (sinon le lien connecte juste
  au dashboard). Le **changement d'adresse e-mail** n'a pas non plus de déclencheur UI. Les templates existent
  (`docs/email-templates.md`) mais ces 2 flux ne fonctionneront qu'une fois l'UI ajoutée.

## Base de données (Supabase)

Migrations : `reviu_core_schema`, `reviu_demo_seed`, `reviu_public_rpc`, `reviu_claim_stand`, `reviu_stand_generator`,
`reviu_billing_and_pins`, `reviu_admin_subscription_sim`, `reviu_self_service_activation`.

Tables : `organizations`, `establishments`, `stands`, `scans`, `feedback`, `profiles`, `app_admins`,
`subscriptions`, `customers`.

RPC (toutes `SECURITY DEFINER`, **gardées en interne**) : `resolve_stand`, `record_scan`, `submit_feedback`,
`claim_stand`, `generate_stands`, `admin_list_stands`, `is_admin`, `set_stand_target`, `admin_set_subscription`,
`admin_list_subscriptions`, `activate_stand`, `self_set_subscription`, `owner_set_subscription`, `bind_account`.

Sécurité : modèle RLS + fonctions definer (assumé). Gardes internes : **PIN** pour le self-service anonyme,
`auth.uid()` pour owner/bind, `is_admin` pour l'admin. La clé anon est **publique** (navigateur). Les warnings
`security_definer_function_executable` de l'advisor concernent tout le projet et sont attendus. À activer : leaked
password protection (advisor).

## Config plateforme

### Vercel — FAIT
Domaines `app.reviu.fr` + `r.reviu.fr` live. Production branch = `main`. Variables d'env : `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_BASE=https://app.reviu.fr`, `NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr`
(le code a déjà les bons défauts `.fr` dans `src/lib/brand.ts`).

### Supabase — EMAIL : EN COURS (par l'utilisateur)
Pour que le lien magique + la confirmation d'inscription fonctionnent :
1. **SMTP custom** (Resend recommandé) : Authentication → Emails → SMTP Settings.
2. **Vérifier le domaine `reviu.fr`** chez le fournisseur → enregistrements **SPF / DKIM / DMARC dans la zone OVH**.
3. **URL Configuration** : Site URL `https://app.reviu.fr` ; Redirect URLs `https://app.reviu.fr/**`
   (+ `http://localhost:3000/**` en dev). Indispensable pour autoriser `/auth/callback`.
4. **Rate Limits** : augmenter l'envoi d'e-mails (défaut bas).
5. **Templates** : coller ceux de `docs/email-templates.md` (garder `{{ .ConfirmationURL }}`).
Sans SMTP custom, l'e-mail Supabase intégré est plafonné (~2-3/h, tests uniquement).

## `.env.local` (non versionné)

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DI6x2lBXc9uANe38Jf-M4w_qPq6JbNP
NEXT_PUBLIC_APP_BASE=http://localhost:3000        # en prod : https://app.reviu.fr
NEXT_PUBLIC_REDIRECT_BASE=http://localhost:3000   # en prod : https://r.reviu.fr
```

## Lancer en dev

```
pnpm install
NODE_USE_ENV_PROXY=1 pnpm dev     # derrière proxy (env web) ; sinon: pnpm dev
```
⚠️ Pour **lint / build**, appeler les binaires **directement** — `pnpm lint`/`pnpm build` échoue sur le check des
build scripts ignorés (sharp) :
```
./node_modules/.bin/eslint .
./node_modules/.bin/next build
```
L'app doit joindre `*.supabase.co` (politique réseau de l'environnement, appliquée au démarrage de session).

## Données de test

- `demo` : **actif** → « Le Comptoir de Camille ». Alimente `/vitrine` (« Voir la démo ») et `/r/demo`. **Garder actif.**
- `blank01` : **désactivé** (était sans PIN → faille de self-activation anonyme fermée).
- Admin : `yoan.oliveira30@gmail.com` (table `app_admins`). Générer un présentoir avec PIN via `/admin`.

## Reste à faire (priorisé)

1. **Supabase e-mail** — finir SMTP + DNS OVH (SPF/DKIM/DMARC) + Redirect URLs + coller les templates. *(EN COURS)*
2. **Reset password** — lien « Mot de passe oublié ? » sur `/login` (`resetPasswordForEmail`) + page « nouveau mot de
   passe » ; idem UI de changement d'e-mail. Templates déjà prêts (`docs/email-templates.md`).
3. **Stripe (Phase 2)** — remplacer la simulation d'abonnement par Checkout + webhooks (entitlement inchangé).
4. **Shopify** — vitrine/e-commerce ; webhook `orders/create` → provisioning Supabase (e-mail = clé de jointure,
   allocation des codes + PIN) ; pointer les CTA « Commander » de `/vitrine` vers l'URL produit Shopify.
5. **Robustesse redirection** (`r.reviu.fr` = composant le plus critique, URL gravée dans le matériel) : cache edge
   pour `resolve_stand`, log de scan non bloquant, page de repli, éventuellement isoler le service de redirection du
   déploiement de l'app, verrouiller le domaine (auto-renew + registrar-lock, DNSSEC).
6. Activer leaked-password protection ; supprimer `src/app/vitrine/` une fois Shopify en place ; roadmap
   multi-plateforme (`stands.target_type` déjà prêt), IA de réponse aux avis, marque blanche.
