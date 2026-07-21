# reviu — note de reprise

Dernière mise à jour : audit complet + durcissement présentoirs, admin, perfs.

## Ce qui existe

- **Landing** `/vitrine`, entrée app `/` → `/login`.
- **Parcours client** `/r/[code]` — page d'avis brandée, redirection tracée
  `/r/[code]/go` (canaux `?s=qr` / `?s=nfc`), retour privé `/r/[code]/feedback`.
- **Activation self-service** `/r/[code]` (présentoir vierge) — nom + lien Google
  + e-mail + **secret d'activation** (imprimé sous le présentoir, jamais dans le
  QR/NFC). Le présentoir devient actif immédiatement, sans compte.
- **Dashboard** `/dashboard` — auth mot de passe / lien magique / **mot de passe
  oublié**, onboarding, établissement, présentoirs, avis privés. CTA **Acheter un
  présentoir** (Shopify). Stats verrouillées tant qu'aucun présentoir suivi.
- **Admin** `/admin` (rôle `super_admin`) — génération de lots, tous les
  présentoirs (statut + remplacement), comptes clients, journal des opérations.
- **Supabase** — projet ref `sudspaqmgqwhyabflyzi` (eu-central-1).

## Système de présentoirs (production)

- `code` = **identifiant public permanent** (QR + NFC). **Immuable** (trigger) et
  **non supprimable** après validation/export d'un lot. Écritures directes
  révoquées pour anon/authenticated → tout passe par des RPC `SECURITY DEFINER`.
- **Secret d'activation** dérivé par HMAC-SHA256 d'une clé **Vault**
  (`stand_activation_key`, permanente — ne pas la faire tourner). Jamais stocké,
  jamais dans le QR/NFC, mais **reproductible** pour l'export fournisseur.
- **Lots** (`stand_batches`) : `draft → validated → exported`. La validation ou
  l'export **verrouille** définitivement le lot.
- **Export fournisseur** : `.xlsx` par lot (`/admin/export?batch=<id>`) —
  code, URL QR, URL NFC, secret, statut, lot, date. L'export verrouille le lot.
- **Statuts** : blank/active/disabled/suspended/defective/lost/replaced/retired.
- **Journal d'audit** (`stand_audit`) : générations, exports, statuts,
  remplacements, opérations comptes — horodaté + acteur.
- **Garde d'environnement** : génération réelle possible **uniquement en
  production** (ou `REVIU_ALLOW_STAND_GENERATION=true` en local).

## `.env.local` (non versionné)

```
NEXT_PUBLIC_SUPABASE_URL=https://sudspaqmgqwhyabflyzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_APP_BASE=https://app.reviu.fr          # http://localhost:3000 en dev
NEXT_PUBLIC_REDIRECT_BASE=https://r.reviu.fr       # http://localhost:3000 en dev
NEXT_PUBLIC_SHOPIFY_PRODUCT_URL=https://reviu.fr/boutique   # page produit Shopify

# Serveur uniquement (secrets — ne jamais exposer au navigateur) :
SUPABASE_SERVICE_ROLE_KEY=...      # notifications e-mail (lecture e-mail commerçant)
RESEND_API_KEY=...                 # envoi e-mails transactionnels (Resend)
REVIU_EMAIL_FROM=reviu <avis@reviu.fr>
REVIU_ALLOW_STAND_GENERATION=true  # UNIQUEMENT en local si besoin de générer
```

## Actions manuelles requises

1. **Vercel (production)** : ajouter `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
   `REVIU_EMAIL_FROM`, `NEXT_PUBLIC_SHOPIFY_PRODUCT_URL`. Ne PAS définir
   `REVIU_ALLOW_STAND_GENERATION` en preview (la génération y reste bloquée) ;
   en production elle est autorisée automatiquement (`VERCEL_ENV=production`).
2. **Resend** : créer un compte, vérifier le domaine d'envoi, générer une clé API.
3. **Supabase Auth** : activer *Leaked password protection* (Auth → Policies) ;
   vérifier les *Redirect URLs* autorisées (dont `/auth/callback`,
   `/reset-password`). Configurer l'envoi d'e-mails (SMTP/branding).
4. **Clé Vault** : `stand_activation_key` est déjà créée. **Ne jamais la
   supprimer ni la régénérer** (sinon les secrets des présentoirs déjà imprimés
   deviennent invalides).
5. **Shopify** : renseigner l'URL réelle de la page produit dans
   `NEXT_PUBLIC_SHOPIFY_PRODUCT_URL`.

## Base de données

Migrations dans `supabase/migrations/` (versionnées). Nouvelles tables :
`stand_batches`, `stand_audit`. Colonnes ajoutées : `profiles.role`,
`organizations.disabled`, `stands.{batch_id,replaced_by,status_note,
status_changed_at,secret_version}`.

Rôles admin : `profiles.role` (`user`/`admin`/`super_admin`), `is_admin()` /
`is_super_admin()` côté serveur. `app_admins` conservé comme **secours**.

## Reste à faire / limites

- **Stripe** : abonnement encore simulé (boutons S'abonner/Se désabonner).
- **Google OAuth** : analysé, **reporté** (config Google Cloud à faire).
- **Notifications e-mail** : couvrent uniquement les retours **Reviu**
  (`feedback`). Les avis **Google** ne sont pas détectés (aucune intégration
  Google Business Profile) et ne sont pas simulés.
- Suppression de compte admin : retire les données métier + retire les
  présentoirs (jamais recyclés) ; l'utilisateur `auth.users` n'est pas supprimé
  (nécessite l'API admin auth).
