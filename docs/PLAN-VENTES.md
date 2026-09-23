# Plan pour les premières ventes (septembre 2026)

> Constat : plusieurs mois en ligne, pas de trafic, aucun présentoir vendu.
> Diagnostic honnête : le site n'était pas le seul problème. Un domaine neuf,
> sans liens entrants, met 3 à 6 mois à remonter sur Google. Le SEO est un
> investissement de fond ; **les premières ventes viendront d'abord de la
> prospection directe et de la publicité**. Le site doit, lui, convertir chaque
> visiteur que ces canaux envoient.

## 1. Ce qui a été fait dans le code (cette session)

- **Offre plus forte** : livraison offerte dès 1 présentoir, garantie
  « satisfait ou remboursé 30 jours » (CGV mises à jour), zéro abonnement,
  affichés partout (bandeau, hero, module d'achat, barre d'achat mobile).
- **Accueil refondu** : hero vivant (photo en situation, cartes animées),
  démo animée du parcours client, comparatif honnête (oral / QR imprimé /
  Reviu), argument de rentabilité, bloc garantie, bandeau métiers relié aux
  guides, FAQ enrichie. Reviu Pro retiré (accueil, dashboard, démo, CGU/CGV,
  guides).
- **Header** : navigation en pilule, méga-menu « Ressources » avec l'outil
  gratuit mis en avant, lien Revendeur, CTA avec prix, téléphone (dès qu'il
  est renseigné), menu mobile plein écran.
- **Outil gratuit** `/outils/qr-code-avis-google` : QR code (PNG, SVG) et
  affiche prête à imprimer, générés dans le navigateur. Cible la requête
  « générateur QR code avis Google gratuit » et pousse vers le présentoir.
- **Page revendeur** : programme sur sélection, formulaire avec profil,
  plus aucune mention de l'abonnement.
- **SEO technique** : `www.reviu.fr` → 301 → `reviu.fr` ; `/boutique` → 301 →
  `/` ; sitemap complété (`/revendeur`, outil) ; vraies balises `<img>`
  optimisées (indexables par Google Images, meilleur LCP) ; H1 avec
  « présentoir avis Google » ; balises de vérification Search Console / Bing
  via variables d'environnement.

## 2. À faire cette semaine (hors code, par ordre d'impact)

1. **Prospection terrain à Nîmes et alentours** (le levier le plus rapide).
   Objectif : 20 commerces visités par jour pendant 5 jours. Arriver avec un
   présentoir de démo déjà activé sur la fiche Google du commerce visité
   (activation en 2 minutes devant le commerçant) : « approchez votre
   téléphone ». Proposer l'achat sur place (lien `reviu.fr/#produits` en QR sur
   une carte) ou le dépôt à l'essai 30 jours.
2. **Google Search Console + Bing Webmaster Tools** : ajouter la propriété
   *Domaine* `reviu.fr`, renseigner `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` /
   `NEXT_PUBLIC_BING_SITE_VERIFICATION` dans Vercel si besoin, soumettre
   `https://reviu.fr/sitemap.xml`, demander l'indexation de `/`,
   `/outils/qr-code-avis-google` et du guide pilier.
3. **Fiche Google Business Profile de reviu** (Nîmes) : c'est la meilleure
   preuve du produit. Poser un présentoir chez vous et collecter vos propres
   avis.
4. **Google Ads, petit budget test** (10 à 15 €/jour, 2 semaines) sur des
   requêtes d'achat : « présentoir avis google », « plaque nfc avis google »,
   « support avis google ». Page d'atterrissage : l'accueil.
5. **Places de marché** : Amazon et Etsy vendent déjà ce type de présentoir
   (concurrents à 24,99-29,99 €). Une fiche Amazon/Etsy apporte des acheteurs
   qui cherchent déjà le produit.
6. **Premiers témoignages** : dès les 3 premiers clients, demander un avis
   (photo au comptoir + une phrase). À intégrer sur l'accueil : la preuve
   sociale est ce qui manque le plus aujourd'hui.

## 3. À compléter dans le code dès que possible

- **Téléphone** : renseigner `PHONE_NUMBER` (et `PHONE_HAS_WHATSAPP`) dans
  `src/lib/brand.ts`, ou `NEXT_PUBLIC_CONTACT_PHONE` dans Vercel. Il apparaît
  alors dans le header, le menu mobile, la FAQ, la page revendeur, le footer et
  le schéma Organization.
- **Caractéristiques physiques** (dimensions, épaisseur, matériau, poids) :
  constantes `SPEC_*` de `src/app/boutique/page.tsx`.
- **Contenu formation** (`src/app/formation/page.tsx`) : parle encore de
  l'abonnement 2,99 €/mois (page privée, non indexée).

## 4. SEO : la suite (mois 1 à 3)

- Backlinks locaux : annuaires (Pages Jaunes, CCI, annuaires de startups),
  partenariats avec agences web locales, articles invités.
- Promouvoir l'outil gratuit (groupes Facebook de commerçants, LinkedIn) :
  c'est la page la plus « partageable » du site.
- Nouveaux contenus ciblés « achat » : comparatif des présentoirs avis Google,
  « lien avis Google » (trouver son lien), pages métiers supplémentaires
  (pharmacie, fleuriste, opticien, auto-école).
- Suivre dans Search Console les requêtes qui commencent à apparaître et
  enrichir les pages correspondantes.
