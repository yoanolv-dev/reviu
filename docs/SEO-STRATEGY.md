# Stratégie de référencement reviu (SEO + GEO)

> Dernière mise à jour : 24 juillet 2026.
> Document de référence de la stratégie de visibilité de reviu : le diagnostic,
> ce qui est implémenté dans le code, la carte de mots-clés, et les actions
> manuelles à réaliser (Search Console, etc.). À tenir à jour à chaque évolution.

## 1. Le diagnostic : « React/Next ne se référence pas » - vrai ou faux ?

C'est une idée reçue. Une SPA React classique (rendu 100 % côté client) est
effectivement mauvaise pour le SEO. **Mais reviu n'est pas dans ce cas** : le
site tourne sur **Next.js 16 (App Router, Server Components)**, qui rend le HTML
**côté serveur**. Le contenu est donc déjà entièrement lisible par Google et par
les moteurs génératifs, sans JavaScript.

Le problème n'était donc pas le rendu, mais **l'absence de signaux SEO** :

- ❌ Pas de `robots.txt`, pas de `sitemap.xml`.
- ❌ Aucune donnée structurée (JSON-LD) : les moteurs ne « comprenaient » ni
  l'entreprise, ni le produit, ni le contenu.
- ❌ Métadonnées pauvres : pas d'Open Graph, pas de Twitter Card, pas d'image de
  partage, peu de mots-clés travaillés.
- ❌ **Aucun contenu** ciblant les requêtes qui précèdent l'achat (« avoir plus
  d'avis Google », « plaque NFC avis », « QR code avis »…). Le site ne
  proposait que des pages transactionnelles.

Cette stratégie corrige les quatre points.

## 2. Ce qui est implémenté (dans le code)

### Fondation technique

| Élément | Fichier | Rôle |
| --- | --- | --- |
| robots.txt | `src/app/robots.ts` | Ouvre le site vitrine, ferme l'app/API/redirections, pointe le sitemap. |
| sitemap.xml | `src/app/sitemap.ts` | Liste toutes les pages indexables (généré depuis le contenu). |
| Image Open Graph | `src/app/opengraph-image.tsx` | Image de partage de marque (1200×630), générée à la volée, par défaut sur tout le site. |
| Boîte à outils SEO | `src/lib/seo.ts` | `buildMetadata()` (canonical + OG + Twitter) et tous les schémas JSON-LD. |
| Composant JSON-LD | `src/components/seo/json-ld.tsx` | Injecte les données structurées, échappées contre l'XSS. |
| Logo (asset stable) | `public/logo.svg` | Référencé par le schéma Organization. |

### Métadonnées & données structurées par page

- **Layout racine** (`src/app/layout.tsx`) : métadonnées par défaut complètes
  (OG, Twitter, robots, keywords) + graphe **Organization + WebSite** présent
  sur toutes les pages (identité de marque cohérente).
- **Boutique / accueil** (`/boutique`) : **Product + Offer** (présentoir 29,90 €)
  + **FAQPage** (éligible aux résultats enrichis Google).
- **Comment ça marche** (`/home`) : **SoftwareApplication** + **BreadcrumbList**.
- **Démo** (`/demo`) : métadonnées enrichies + **BreadcrumbList**.
- **Guides** (`/guides` + `/guides/[slug]`) : **Article + FAQPage +
  BreadcrumbList** sur chaque article, + **CollectionPage** sur l'index.

### Hub de contenu (le cœur de l'acquisition)

Source unique : `src/lib/guides.ts`. Pages : `src/app/guides/`.
6 articles piliers **générés en statique** (SSG), chacun ciblant une grappe de
mots-clés vendeurs, maillés entre eux et vers la boutique. Contenu **conforme
Google** : on invite tous les clients à laisser un avis, jamais de filtrage
selon la note, aucune statistique inventée.

## 3. Carte de mots-clés (topic cluster)

Le produit se vend sur l'écosystème « avis Google pour commerce local ». On
attaque toute la chaîne d'intention, de l'information à l'achat.

| Guide (`/guides/…`) | Intention | Mots-clés principaux |
| --- | --- | --- |
| `avoir-plus-avis-google` **(pilier)** | Commerciale haute | avoir plus d'avis Google, obtenir des avis Google, augmenter ses avis, demander un avis Google |
| `presentoir-plaque-nfc-avis-google` | Produit / catégorie | plaque NFC avis Google, présentoir avis Google, carte NFC avis Google, support avis |
| `qr-code-avis-google` | Produit / catégorie | QR code avis Google, générer QR code avis, QR code avis client, QR code fiche Google |
| `avis-google-commerce-local` | Informationnelle → commerciale | importance des avis Google, avis Google commerce, référencement local avis, avis Google entreprise |
| `repondre-avis-google` | Informationnelle (confiance) | répondre aux avis Google, répondre à un avis négatif, exemple réponse avis, gérer les avis négatifs |
| `avis-google-restaurant` | Verticale / locale | avis Google restaurant, avis clients restaurant, QR code avis restaurant |

**Pages transactionnelles** (déjà en place, désormais optimisées) :
`/` (boutique, « présentoir avis Google », « acheter présentoir avis »),
`/home` (« logiciel avis clients », « plateforme avis Google »),
`/demo` (« démo présentoir avis Google »).

### Prochaines grappes à créer (roadmap contenu)

Ajouter un objet dans `GUIDES` (`src/lib/guides.ts`) suffit : sitemap, JSON-LD,
maillage et page se génèrent automatiquement. Cibles à fort potentiel :

- `avis-google-salon-coiffure`, `avis-google-garage`, `avis-google-hotel`,
  `avis-google-boulangerie` (déclinaisons par métier - fort intérêt local).
- `augmenter-note-google` (« améliorer sa note Google »).
- `lien-avis-google` (« créer un lien avis Google », « obtenir le lien de sa
  fiche »).
- `avis-google-faux` / `supprimer-avis-google` (défense de e-réputation).
- `nfc-vs-qr-avis` (comparatif, capte les requêtes de comparaison).

## 4. GEO - se référencer dans les moteurs génératifs

Les assistants (ChatGPT, Perplexity, Gemini, aperçus IA de Google) recommandent
de plus en plus les produits. Pour être **cité** :

1. **Répondre clairement à une vraie question** en tête d'article (chaque guide
   ouvre par une définition/réponse directe - format « extractible »).
2. **Données structurées** : Organization, Product, FAQPage, Article aident les
   modèles à identifier l'entité et à citer des réponses.
3. **FAQ explicites** : les blocs question/réponse sont le format le plus repris
   par les moteurs génératifs (et éligibles aux résultats enrichis).
4. **Cohérence de l'entité** : un seul graphe Organization (`@id` partagé) sur
   tout le site.
5. **Contenu honnête et vérifiable** : les modèles pénalisent le contenu
   trompeur ; la ligne « conformité Google » sert aussi le GEO.

## 5. Actions manuelles à réaliser (hors code)

Par ordre de priorité :

1. **Brancher `reviu.fr` sur Vercel** (prérequis absolu - voir `HANDOFF.md`).
   Sans le domaine en ligne, rien n'est indexable.
2. **Google Search Console** : ajouter et vérifier la propriété `reviu.fr`,
   puis **soumettre `https://reviu.fr/sitemap.xml`**. Suivre la couverture et
   les requêtes. (Un code de vérification peut être ajouté via
   `metadata.verification.google` dans `src/app/layout.tsx` si besoin.)
3. **Bing Webmaster Tools** : même chose (Bing alimente aussi ChatGPT).
4. **Google Business Profile** : la fiche d'établissement reviu (marque) + aider
   les clients à optimiser la leur (c'est le cœur de la promesse produit).
5. **Vérifier les résultats enrichis** : tester quelques URL avec le
   [test des résultats enrichis](https://search.google.com/test/rich-results)
   et le [validateur schema.org](https://validator.schema.org/) (Product, FAQ,
   Article doivent ressortir sans erreur).
6. **Vérifier le rendu Open Graph** avec le partage sur les réseaux (LinkedIn
   Post Inspector, etc.) : l'image `/opengraph-image` doit s'afficher.
7. **Photos produit** dans `public/products/` (voir son README) : le LCP et les
   images sociales gagnent à avoir de vrais visuels compressés (WebP < 120 Ko).
8. **Backlinks & citations locales** : annuaires (Pages Jaunes, Google, Bing),
   partenariats, presse locale. Le SEO on-page est posé ; l'autorité se construit
   par les liens entrants.

## 6. Bonnes pratiques à conserver

- **Un `canonical` par page indexable** (géré par `buildMetadata`). Ne jamais
  laisser deux URL servir le même contenu sans canonical (rappel : `reviu.fr/`
  et `reviu.fr/boutique` servent la même page → canonical sur la racine `/`).
- **Ne pas indexer l'app** : `app.reviu.fr` et `r.reviu.fr` restent hors index
  (géré par `robots.ts` + zones dynamiques).
- **Titres < ~60 caractères**, **descriptions < ~155 caractères**, un seul `h1`
  par page, hiérarchie `h2`/`h3` respectée (déjà le cas dans les guides).
- **Contenu conforme Google** : aucune promesse d'avis garanti, pas de gating,
  pas de contrepartie contre avis. C'est vital pour la marque **et** pour le SEO.
- **Chaque nouveau guide** = un objet dans `GUIDES` ; tout le reste est
  automatique.
