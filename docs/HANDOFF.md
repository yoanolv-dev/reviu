# reviu — note de reprise

## État : EN PRODUCTION ✅

L'application est **déployée et live** :
- **`app.reviu.fr`** — application SaaS (Next.js 16 / App Router sur Vercel).
- **`r.reviu.fr`** — service de redirection NFC/QR (même app Next, host réécrit par `src/proxy.ts`).
- **Données + Auth → Supabase** (projet ref `sudspaqmgqwhyabflyzi`, région eu-central-1).

Branche par défaut = **`main`** ; Vercel redéploie automatiquement à chaque push.
**Code et base de données sont synchronisés** (migrations dans `supabase/migrations/`).

## Architecture

- **Vitrine / e-commerce → Shopify** (à venir), `reviu.fr`. L'app ne sert plus la vitrine :
  `app.reviu.fr/` → `/login`. Ancienne landing conservée sur `/vitrine` (noindex), supprimable plus tard.
- **App SaaS** `app.reviu.fr` — dashboard, admin, parcours d'avis.
- **Redirection NFC/QR** `https://r.reviu.fr/<code>` (+ `?s=nfc|qr`), URL permanente gravée dans les puces/QR.

## Système de présentoirs (production-ready)

- `code` = **identifiant public permanent** (QR + NFC). **Immuable** (trigger) et **non supprimable**
  après validation/export d'un lot. Écritures directes révoquées pour anon/authenticated → tout passe
  par des RPC `SECURITY DEFINER`.
- **Secret d'activation** dérivé par HMAC-SHA256 d'une clé **Vault** (`stand_activation_key`, permanente
  — ne jamais la faire tourner). Jamais stocké, jamais dans le QR/NFC, mais reproductible pour l'export.
- **Lots** (`stand_batches`) : `draft → validated → exported`. Validation ou export = **verrouillage définitif**.
- **Export fournisseur** : `.xlsx` par lot (`/admin/export?batch=<id>`) — code, URL QR, URL NFC, secret,
  statut, lot, date. L'export verrouille le lot.
- **Statuts** : blank/active/disabled/suspended/defective/lost/replaced/retired.
- **Journal d'audit** (`stand_audit`) : générations, exports, statuts, remplacements, opérations comptes.
- **Garde d'environnement** : génération réelle possible **uniquement en production**
  (ou `REVIU_ALLOW_STAND_GENERATION=true` en local).

## Parcours produit (tous LIVE)

1. **Scan présentoir vierge** `/r/<code>` → config self-service : nom + lien Google + e-mail +
   **secret d'activation** (imprimé sous le présentoir, hors QR/NFC) → présentoir **actif, sans compte**.
2. **Offre d'abonnement 2,99 €/mois** juste après, sans obligation.
3. **Scan présentoir actif** → page d'avis → `/r/<code>/go` trace le clic et redirige (lien propre sinon avis Google).
4. **Retour** via `/login` : mot de passe / lien magique / **mot de passe oublié**. `bind_account()` rattache
   les présentoirs self-service **à la connexion** (plus à chaque page). Stats verrouillées sans abonnement.
5. **Admin** `/admin` (rôle `super_admin`) : lots + secret + QR, export **.xlsx**, gestion présentoirs/comptes, journal.

## Abonnement = SIMULÉ (Stripe à faire)

Table `subscriptions` (1 ligne/présentoir). Entitlement = `status in ('active','trialing')`. Boutons
S'abonner/Se désabonner qui basculent le statut. Stripe (Checkout + webhooks) reste à brancher.

## Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_APP_BASE=https://app.reviu.fr          # http://localhost:3000 en dev
NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr       # http://localhost:3000 en dev
NEXT_PUBLIC_SHOPIFY_PRODUCT_URL=https://reviu.fr/boutique   # page produit Shopify (plus tard)

# Serveur uniquement (secrets — jamais exposés au navigateur) :
SUPABASE_SERVICE_ROLE_KEY=...      # notifications e-mail (lecture e-mail commerçant)
RESEND_API_KEY=...                 # envoi e-mails transactionnels (Resend)
REVIU_EMAIL_FROM=reviu <avis@reviu.fr>
REVIU_ALLOW_STAND_GENERATION=true  # UNIQUEMENT en local si besoin de générer
```

## Actions manuelles

1. **Vercel (production)** : ajouter `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `REVIU_EMAIL_FROM`.
   Ne PAS définir `REVIU_ALLOW_STAND_GENERATION` (la génération s'active seule en prod via `VERCEL_ENV=production`).
2. **Resend** : compte + domaine vérifié + clé API (⚠️ `REVIU_EMAIL_FROM` doit utiliser le domaine vérifié).
3. **Supabase Auth** : activer *Leaked password protection* ; Redirect URLs (`/auth/callback`, `/reset-password`) ;
   modèles d'e-mails → voir `docs/email-templates.md`.
4. **Clé Vault** : `stand_activation_key` déjà créée. **Ne jamais la supprimer/régénérer.**
5. **Shopify** : renseigner `NEXT_PUBLIC_SHOPIFY_PRODUCT_URL` le moment venu.

## Base de données

Tables ajoutées : `stand_batches`, `stand_audit`. Colonnes : `profiles.role`, `organizations.disabled`,
`stands.{batch_id,replaced_by,status_note,status_changed_at,secret_version}`.
Rôles admin : `profiles.role` (`user`/`admin`/`super_admin`), `is_admin()` / `is_super_admin()` serveur ;
`app_admins` conservé comme **secours**.

## Reste à faire / limites

- **Stripe** : abonnement simulé.
- **Google OAuth** : reporté (non prioritaire).
- **Notifications e-mail** : uniquement les retours **Reviu** (`feedback`). Les avis **Google** ne sont pas
  détectés (aucune intégration Google Business Profile) et ne sont pas simulés.
- Suppression de compte admin : retire les données métier + retire les présentoirs (jamais recyclés) ;
  l'utilisateur `auth.users` n'est pas supprimé (nécessite l'API admin auth).
