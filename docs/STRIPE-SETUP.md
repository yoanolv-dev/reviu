# Configuration Stripe - reviu

Guide pour rendre le paiement fonctionnel sur le site. Le code est deja en place ;
il ne reste que la configuration cote Stripe et Vercel.

> Point cle : pour vendre le **presentoir** (achat unique), **aucun produit n'est a
> creer dans Stripe**. Le montant est calcule par le serveur a partir du catalogue
> (`src/lib/shop.ts`) et envoye en direct a Stripe (`price_data` en ligne). Il te
> faut donc seulement **2 secrets** : la cle secrete et le secret du webhook.

---

## 1. Variables d'environnement

A renseigner dans **Vercel** (Settings -> Environment Variables, scope Production
puis Preview si besoin). Ne jamais les mettre dans le code.

| Variable | Obligatoire | Role | Exemple |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Oui | Cle secrete serveur (checkout, webhook, page merci). | `sk_test_...` puis `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Oui | Verifie la signature des evenements webhook. | `whsec_...` |
| `STRIPE_PRICE_ID` | Non | Uniquement si tu vends l'abonnement 2,99 EUR/mois (LEGACY). Inutile pour le presentoir. | `price_...` |
| `REVIU_SHOP_SECRET` | Non | Signe les acces formation. Par defaut reutilise `SUPABASE_SERVICE_ROLE_KEY`. | chaine aleatoire |

Apres toute modification de variable : **Redeploy** le projet (les variables ne sont
lues qu'au build/boot).

---

## 2. Etapes (commence en MODE TEST)

Garde le bouton **Mode test** active (en haut a droite du dashboard Stripe) pour
tout valider sans argent reel.

### a. Cle secrete
1. [dashboard.stripe.com](https://dashboard.stripe.com) -> **Developpeurs -> Cles API**.
2. Copie la **Cle secrete** (`sk_test_...`).
3. Colle-la dans Vercel sous `STRIPE_SECRET_KEY`.

### b. Webhook
1. **Developpeurs -> Webhooks -> Ajouter un endpoint**.
2. **URL de l'endpoint** :
   ```
   https://app.reviu.fr/api/stripe/webhook
   ```
   (le webhook fonctionne aussi sur `https://reviu.fr/api/stripe/webhook` : mets le
   domaine reellement en ligne.)
3. **Evenements a ecouter** :

   | Evenement | Pourquoi |
   |---|---|
   | `checkout.session.completed` | **Requis** - confirme la commande du presentoir (e-mails, commande). |
   | `checkout.session.async_payment_succeeded` | Recommande - paiements differes (virement, prelevement) encaisses plus tard. |
   | `customer.subscription.created` | Seulement si tu gardes l'abonnement 2,99 EUR. |
   | `customer.subscription.updated` | Idem abonnement. |
   | `customer.subscription.deleted` | Idem abonnement (resiliation). |

4. Valide, puis clique sur l'endpoint pour reveler le **Secret de signature**
   (`whsec_...`).
5. Colle-le dans Vercel sous `STRIPE_WEBHOOK_SECRET`, puis **Redeploy**.

### c. Base de donnees (idempotence)
Une petite table `stripe_events` empeche le double traitement si Stripe redelivre un
evenement (sinon : e-mails de commande en double). La migration est dans le repo :
`supabase/migrations/20260730120000_reviu_stripe_events_idempotency.sql`.

- Elle doit etre **appliquee sur la base de production** (via le MCP Supabase ou la
  CLI Supabase). Tant qu'elle ne l'est pas, le paiement marche quand meme (le code
  degrade proprement), mais la deduplication des redelivrances n'est pas active.

---

## 3. Tester le paiement (mode test)

1. Va sur le site, ajoute un presentoir, clique **Commander**.
2. Sur la page Stripe, paie avec une **carte de test** :
   - Numero : `4242 4242 4242 4242`
   - Date : n'importe quelle date future (ex. `12/34`)
   - CVC : n'importe quels 3 chiffres
   - Code postal : n'importe lequel
3. Tu dois etre redirige vers **`/boutique/merci`** avec le recapitulatif.
4. Verifie :
   - l'e-mail de confirmation client + l'e-mail exploitant (si Resend est configure) ;
   - dans **Stripe -> Developpeurs -> Webhooks**, l'evenement en **200** (succes).

Autres cartes de test utiles :
- Paiement refuse : `4000 0000 0000 0002`
- Authentification 3D Secure : `4000 0025 0000 3155`

---

## 4. Passage en production (LIVE)

1. Bascule le dashboard en **Mode Live**.
2. Refais **une nouvelle cle secrete** (`sk_live_...`) et **un nouveau webhook**
   (nouveau `whsec_...`, les secrets test ne marchent pas en live).
3. Remplace `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` dans Vercel par les
   valeurs live, puis **Redeploy**.
4. Fais un vrai achat de controle (tu peux te rembourser depuis Stripe).

> Le **Customer Portal** (Stripe -> Settings -> Billing -> Customer portal) n'est a
> activer que si tu gardes l'abonnement 2,99 EUR (bouton "Gerer / resilier" du
> dashboard). Inutile pour la vente du presentoir seul.

---

## 5. Tester en local (optionnel)

Avec la [CLI Stripe](https://stripe.com/docs/stripe-cli) :

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La commande affiche un `whsec_...` temporaire : mets-le dans ton `.env.local` sous
`STRIPE_WEBHOOK_SECRET` le temps du test. Declenche un paiement test pour voir les
evenements arriver dans le terminal.

---

## Recapitulatif minimal (vente du presentoir)

- [ ] `STRIPE_SECRET_KEY` (test) dans Vercel
- [ ] Webhook cree avec `checkout.session.completed` (+ `async_payment_succeeded`)
- [ ] `STRIPE_WEBHOOK_SECRET` dans Vercel
- [ ] Migration `stripe_events` appliquee en base
- [ ] Redeploy
- [ ] Achat test avec `4242 4242 4242 4242` -> page merci + webhook 200
- [ ] Bascule en cles LIVE + redeploy
