# Publicité et mesure des ventes (Google Ads, Analytics, Shopping)

> Mis en place le 28 septembre 2026. Tant que les variables ci-dessous ne sont
> pas renseignées dans Vercel, **rien ne change sur le site** : pas de bandeau
> cookies, aucun script Google, aucune donnée de provenance.

## 1. Ce qui est dans le code

| Élément | Fichier | Rôle |
| --- | --- | --- |
| Configuration | `src/lib/tracking-config.ts` | Identifiants Google (variables d'env), liste blanche des données de provenance. |
| Suivi navigateur | `src/lib/tracking.ts` | Consentement, chargement de gtag.js, événements, cookie de provenance. |
| Bandeau cookies | `src/components/site/cookie-consent.tsx` | « Tout refuser » / « Tout accepter » / « Personnaliser », monté par le pied de page (pages vitrine uniquement). Lien « Gérer les cookies » dans le pied de page. |
| Événements e-commerce | `src/components/site/ecommerce-events.tsx` | `begin_checkout` sur `/boutique/commander`, `purchase` + conversion Google Ads sur `/boutique/merci` (avec le montant, une seule fois par commande). |
| Outil QR | `src/app/outils/qr-code-avis-google/qr-tool.tsx` | Événement `qr_download` : audience de reciblage « utilisateurs de l'outil ». |
| Provenance des ventes | `src/lib/attribution.ts`, `src/lib/stripe-checkout.ts` | Campagne, mot-clé, identifiant de clic, site d'origine et page d'arrivée copiés dans les **métadonnées Stripe** de la session et du paiement. |
| E-mail interne | `src/app/api/stripe/webhook/route.ts` | Ligne « Provenance : google / cpc / … » dans l'e-mail de nouvelle commande. |
| Flux Shopping | `src/app/google-shopping.xml/route.ts` | Flux produit Merchant Center : `https://reviu.fr/google-shopping.xml`. |
| Pages légales | `src/app/(legal)/cookies`, `confidentialite` | Décrivent automatiquement les outils actifs (et eux seuls). |

**Consentement (CNIL)** : mode « basique ». Aucun script Google n'est chargé
avant un choix ; le choix est gardé 6 mois ; retirer son accord recharge la
page et supprime les cookies concernés. Cookies Analytics limités à 13 mois.
La provenance (`reviu_attr`, 30 jours) n'est enregistrée qu'avec un accord, et
l'identifiant de clic (gclid) seulement avec l'accord « Publicité ».

## 2. Mise en route (à faire une fois)

### Google Analytics 4
1. [analytics.google.com](https://analytics.google.com) → Créer une propriété
   « reviu » (France, EUR) → flux Web `https://reviu.fr`.
2. Copier l'**ID de mesure** (`G-XXXXXXX`).
3. Administration → Conservation des données → **14 mois**.
4. L'événement `purchase` est un événement clé par défaut : rien à faire.
5. Créer une audience « Utilisateurs de l'outil QR » (événement `qr_download`)
   pour le reciblage.

### Google Ads
1. Objectifs → Conversions → Nouvelle action → **Site Web** → configuration
   manuelle : catégorie **Achat**, valeur « utiliser des valeurs différentes
   pour chaque conversion » (repli 29,90 €), comptabilisation **Toutes**.
2. Option « Installer la balise vous-même » : dans l'extrait d'événement, relever
   `send_to: 'AW-123456789/AbCdEfGh'` → ID = `AW-123456789`, libellé =
   `AbCdEfGh`.
3. Associer Google Ads à Analytics (Administration GA4 → Association Google Ads)
   pour importer l'audience « Utilisateurs de l'outil QR ».

### Vercel (Production)
Settings → Environment Variables, puis **redéployer** (variables injectées au build) :

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-123456789
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL=AbCdEfGh
```

### Vérifier
1. Ouvrir `https://reviu.fr/?utm_source=test&utm_medium=test&utm_campaign=verif`,
   « Tout accepter ».
2. GA4 → Rapports → Temps réel : la visite apparaît.
3. Google Ads → la conversion « Achat » passe à « Enregistrement des
   conversions » après la première vente (ou via Google Tag Assistant).
4. Après une commande : métadonnées `utm_*` visibles sur le paiement dans
   Stripe, et ligne « Provenance » dans l'e-mail de commande.

### Google Merchant Center (onglet Shopping)
1. [merchants.google.com](https://merchants.google.com) → valider et revendiquer
   `reviu.fr` (via Search Console, déjà en place).
2. Livraison : France, **gratuite**, 0 à 1 jour de préparation, 2 à 5 jours de
   transport. Retours : 30 jours, frais à la charge du client (cf. CGV).
3. Produits → Ajouter une source → **Fichier planifié** → URL
   `https://reviu.fr/google-shopping.xml`, récupération quotidienne.
4. Activer les **fiches gratuites**, puis associer Merchant Center à Google Ads
   pour lancer une campagne Shopping.

Le flux reprend le prix réellement facturé à l'unité (`STAND_TIERS` dans
`src/lib/shop.ts`) et les photos de `src/lib/photos.ts` : il reste aligné sur
la fiche produit, ce que Google vérifie.

## 3. Première campagne (test de 3 semaines)

- **Réseau de Recherche**, France, 10 à 15 €/jour, stratégie « Maximiser les
  clics » avec CPC max ~1 € au départ, puis « Maximiser les conversions » après
  une quinzaine de ventes.
- **Mots-clés** (exact et expression) : présentoir avis google, plaque nfc avis
  google, plaque avis google, support avis google, présentoir nfc avis google.
- **Mots-clés négatifs** : gratuit, générer, générateur, créer, comment,
  exemple, répondre, modèle, canva, pdf.
- **Page d'arrivée** : `https://reviu.fr/presentoir-avis-google`.
- **Suffixe de l'URL finale** (niveau campagne), pour lire la source dans Stripe :
  `utm_source=google&utm_medium=cpc&utm_campaign=presentoir-search&utm_term={keyword}`
  (garder aussi le marquage automatique : gclid).
- **Lecture après ~300 clics** :
  - taux de clic < 3 % → annonces ou mots-clés à revoir ;
  - clics mais peu de `begin_checkout` → la page ou l'offre ne convainc pas ;
  - `begin_checkout` sans `purchase` → confiance ou paiement ;
  - coût par vente inférieur à la marge par commande → augmenter le budget.
