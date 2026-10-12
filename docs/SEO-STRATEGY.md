# Stratégie de référencement reviu (SEO + GEO)

> Dernière mise à jour : **12 octobre 2026**. Document de référence de la
> visibilité organique de reviu : diagnostic, benchmark, niche retenue,
> architecture du site, plan éditorial, netlinking, GEO (moteurs IA), mesure et
> actions manuelles. Il remplace la version du 24 juillet 2026. À tenir à jour à
> chaque évolution.

---

## 0. Résumé en une page

**Constat.** Après environ trois mois en ligne, reviu.fr n'a presque aucun
trafic organique. Ce n'est pas un problème de technique (Next.js rend un HTML
complet, JSON-LD partout) mais de **positionnement** et d'**autorité** :

- le site attaquait de front les requêtes les plus disputées (« comment avoir
  des avis Google », « répondre aux avis ») où Guest Suite, Partoo, Custplace ou
  Digifeel publient depuis des années (centaines d'articles chacun) ;
- domaine jeune, quasiment aucun lien entrant, marque ambiguë (« reviu » se
  confond avec Revi.io, Ryviu…) ;
- depuis le **22 juillet 2026**, les aperçus IA et le mode IA de Google sont
  ouverts en France : les requêtes « comment faire » perdent des clics au profit
  des réponses générées.

**Niche retenue : « la boîte à outils de l'avis Google pour les commerces de
proximité ».** Au lieu d'écrire un 386e article générique, reviu devient la
référence française **pratique** : des outils gratuits qui font le travail
(QR code, message de demande d'avis, réponses aux avis, calculateur de note),
des modèles prêts à copier, et des guides sur les sujets que les gros acteurs
n'ont pas encore traités (problèmes nouveaux depuis fin 2025, règles et loi,
métiers non couverts, prix et choix d'une plaque). Trois raisons :

1. **Les SERP de ces requêtes sont faibles** : outils étrangers traduits,
   fiches produit minces, articles anciens (voir §2).
2. **Les outils résistent aux réponses IA** : une IA peut résumer un article,
   pas générer le QR code ni calculer la note du commerçant à sa place. Et les
   assistants recommandent volontiers un outil gratuit précis.
3. **Le public des outils est exactement l'acheteur** : un commerçant qui
   cherche « message pour demander un avis Google » ou « combien d'avis pour
   4,5 » est à un pas du présentoir. Chaque page d'outil pousse vers lui.

**Ce qui a été livré le 12/10/2026** (détail §5) : 3 nouveaux outils + un hub
`/outils`, 20 nouveaux guides (37 au total), un hub « Collecter des avis »,
la suppression du contenu dupliqué sur `app.reviu.fr`, un sitemap aux dates
réelles, `llms.txt`, IndexNow pour Bing (donc Copilot et ChatGPT).

**Ce qui reste à faire hors code** (détail §9), dans l'ordre : Search Console
et Bing Webmaster Tools (soumettre, demander l'indexation), fiche Google
Business Profile de reviu, 10 premiers liens entrants (annuaires, CCI, CMA,
partenaires), vidéos courtes des outils, puis une publication régulière.

---

## 1. Diagnostic (état au 12 octobre 2026)

| Point | État | Impact |
| --- | --- | --- |
| Rendu | Next.js 16, pages publiques en SSG, HTML complet sans JS | ✅ Rien à changer (ne pas migrer) |
| Données structurées | Organization, WebSite, Product, Article, FAQPage, BreadcrumbList, WebApplication, HowTo | ✅ Complet |
| Contenu | 17 guides (avant ce chantier), dont 16 d'environ 550 mots, 1 outil | ⚠️ Pages minces face aux concurrents, et trop centrées sur les requêtes les plus disputées |
| Autorité | Domaine de quelques mois, presque aucun lien entrant | ❌ Frein n°1 au classement |
| Marque | Recherche « reviu » confondue avec Revi.io, Ryviu | ⚠️ Travailler l'entité (fiche Google, profils, mentions) |
| Doublon | `app.reviu.fr/guides/...` servait tout le contenu éditorial (canonical seul) | ✅ Corrigé : 301 vers reviu.fr |
| Sitemap | `lastmod` = date du build pour les pages clés | ✅ Corrigé : dates réelles |
| Bing / IA | Pas d'IndexNow, pas de `llms.txt` | ✅ Ajoutés |
| Google IA | AI Overviews + AI Mode ouverts en France le 22/07/2026 | ⚠️ Moins de clics sur l'informationnel pur |

Rappel de bon sens : un domaine neuf met **3 à 6 mois** à remonter sur ses
premières requêtes, et l'autorité ne vient que des liens et mentions. Le SEO
est un investissement de fond ; il ne remplace pas la prospection et la
publicité pour les premières ventes (voir `docs/PLAN-VENTES.md`).

## 2. Benchmark concurrentiel

Méthode : recherches sur les requêtes cibles (index de recherche web, résultats
google.fr non observables en direct depuis l'environnement), crawl des
sitemaps concurrents. Les positions exactes sont indicatives, la cartographie
des acteurs est fiable.

### 2.1 Vendeurs de plaques et présentoirs

| Acteur | Offre | Stratégie de contenu |
| --- | --- | --- |
| **Digifeel** (concurrent le plus proche) | Plaque/carte 29,90 € HT, « doublez vos avis en 30 j ou remboursé » | ~155 articles, un tous les 2-3 jours, dont ~25 « plaque avis Google + métier » et beaucoup de « problèmes » (avis qui ne s'affiche pas, avis anonyme…). Pas d'outils, pas de comparatif. |
| Swiipx | 29,90 € HT (1), 89,90 € HT (5) | Guide « prix plaque NFC » qui cite des concurrents à abonnement |
| Plaqueo | Plaque + option payante Plaqueo+ | 11 pages métier, une page « vs Digifeel » |
| Viewup | Présentoir, aussi sur Amazon, tableau de bord gratuit | ~44 articles |
| Autres | CollecteAvis (59,90 €), Kipful (69-89 € HT), MyPlaque-NFC (dès 5,99 € HT), MediaPush, Unisign, Izikard, Zecard, Phanion, Nodeflow | Fiches produit surtout |
| business-ereputation.com | Agence | 99 pages métier, 183 pages glossaire, en 4 langues |

**Avantage reviu à faire valoir partout** : 29,90 € **prix final** (TVA non applicable), achat unique,
**sans abonnement**, livraison offerte, lien modifiable et statistiques
**inclus**, satisfait ou remboursé 30 jours. Beaucoup de concurrents affichent
des prix HT ou un abonnement mensuel.

### 2.2 Éditeurs SaaS qui tiennent l'informationnel

Guest Suite (~385 articles, un calculateur, des affiches à télécharger),
Partoo (baromètre annuel repris par la presse : c'est son moteur de liens),
Custplace, Localranker (~255 articles + pages « alternative »), HeyPongo,
Billiv, Arturin, Easiware, et des SaaS étrangers traduits (Tagembed, Taggbox,
EmbedSocial, QR Code Tiger, Localo).

### 2.3 Lecture des SERP

| Requête | Qui sort | Opportunité |
| --- | --- | --- |
| présentoir avis google | Amazon, quelques boutiques | **Forte** (c'est le nom de notre produit) |
| plaque nfc avis google | Petites boutiques, fiches minces | **Forte** |
| prix plaque avis google / sans abonnement | Pages vendeurs seulement | **Forte** |
| comparatif plaque avis google | Des comparatifs… de plaques de cuisson | **Forte** (à traiter avec prudence juridique) |
| générateur qr code avis google gratuit | Générateurs étrangers traduits | Forte |
| calculateur note google | Pages étrangères traduites, Guest Suite | Moyenne, gagnable par la qualité |
| message pour demander un avis google | Résultats fragmentés | Forte |
| sticker / support avis google | E-commerce sans contenu | Forte |
| réponse avis google en attente | Presque rien en français (sujet né fin 2025) | **Très forte** |
| bannière avis suspects / restriction | Peu de contenu français | **Très forte** |
| faux avis google loi / amende | Petits blogs, peu de sources exactes | Forte (et très citée par les IA) |
| comment laisser un avis google | Blogs minces | Volume grand public, exposé aux réponses IA |
| comment avoir des avis google, répondre avis google exemple, supprimer un avis google | SaaS installés | **Faible** : ne pas en faire une priorité |

### 2.4 Changements Google 2025-2026 qui créent de la demande nouvelle

- Réponses du propriétaire **examinées avant publication** : généralement une
  dizaine de minutes, jusqu'à 30 jours selon l'aide Google ; des commerçants
  voient leurs réponses « en attente » ou à modifier.
- **Bannières d'avertissement** et restrictions d'avis sur les fiches
  soupçonnées de faux avis ; Google a annoncé avoir supprimé des centaines de
  millions de faux avis en 2025.
- Avis publiables **sous un pseudo** (novembre 2025).
- Section Questions-réponses retirée des fiches (fin 2025).
- QR code d'avis proposé directement par Google dans le profil, **sur ordinateur
  uniquement** (« Voir les avis » puis « Recevoir plus d'avis »). Notre
  générateur garde l'avantage : mobile, Place ID, affiches prêtes à imprimer.
- **AI Overviews / AI Mode en France** depuis le 22 juillet 2026.

## 3. La niche et le positionnement

> **reviu = la boîte à outils de l'avis Google des commerces de proximité :
> des outils gratuits qui font le travail, des modèles prêts à copier, des
> guides métier concrets, et le présentoir pour passer à l'échelle.**

Quatre cercles, du plus rentable au plus large :

1. **Transactionnel** (vendre) : présentoir avis Google, plaque NFC avis
   Google, support / sticker avis Google, prix d'une plaque, sans abonnement.
2. **Outils et modèles** (capter l'acheteur au moment où il agit) : QR code,
   message de demande d'avis, réponses aux avis, calculateur de note.
3. **Problèmes, règles, métiers** (autorité + longue traîne peu disputée) :
   réponses en attente, bannières, avis disparus, règles de Google, loi sur les
   faux avis, 19 métiers.
4. **Grand public** (impressions, partages, mentions) : comment laisser un avis
   Google, une page que les commerçants envoient à leurs clients.

Ce que l'on **ne fait pas** :

- **Pas de pages par ville** (« plaque avis Google Lyon »…). Le produit est
  livré partout en France : ce seraient des pages satellites au sens des règles
  anti-spam de Google (« doorway »). Aucun concurrent n'en a, et aucune demande
  n'est visible. Exception possible plus tard : une vraie page Nîmes/Gard si
  reviu y a une présence physique (démonstrations, clients, partenaires).
- **Pas de génération de masse** : chaque page métier doit apporter des
  spécificités réelles (moment, emplacement, phrases, objections, réponses
  types). La politique « scaled content abuse » de Google vise précisément les
  pages fabriquées en série sans valeur propre.
- **Pas de comparatif nommant des concurrents** sans relecture juridique
  (publicité comparative, art. L122-1 du Code de la consommation : comparaison
  objective, vérifiable, représentative). Le guide « prix d'une plaque » joue
  ce rôle sans citer de marque.

## 4. Architecture et carte des mots-clés

```
/                               présentoir avis google (accueil = boutique)
/presentoir-avis-google         fiche produit : plaque nfc avis google, présentoir avis google
/outils                         hub : outils avis google gratuits
  /qr-code-avis-google          qr code avis google, générateur, affiche à imprimer
  /message-demande-avis-google  message / sms / e-mail pour demander un avis
  /reponse-avis-google          réponse avis google, modèles, exemples
  /calculateur-note-google      calcul note google, combien d'avis 5 étoiles
/guides                         index
  /collecter-des-avis           hub (5 guides)
  /par-metier                   hub (19 guides)
  /gerer-sa-reputation          hub (8 guides)
  /<guide>                      37 guides au total
/llms.txt                       résumé du site pour les agents IA
```

### 4.1 Pages et requêtes visées

| Page | Requête principale | Intention |
| --- | --- | --- |
| `/` | présentoir avis google, acheter présentoir avis google | Achat |
| `/presentoir-avis-google` | plaque nfc avis google, présentoir avis google | Achat |
| `/outils/qr-code-avis-google` | générateur qr code avis google gratuit | Outil |
| `/outils/message-demande-avis-google` **(nouveau)** | message pour demander un avis google, sms demande d'avis | Outil / modèle |
| `/outils/reponse-avis-google` **(nouveau)** | réponse avis google, modèle réponse avis | Outil / modèle |
| `/outils/calculateur-note-google` **(nouveau)** | calculateur note google, combien d'avis 5 étoiles | Outil |
| `/guides/prix-plaque-avis-google` **(nouveau)** | prix plaque avis google, sans abonnement | Comparaison avant achat |
| `/guides/nfc-ou-qr-code-avis-google` **(nouveau)** | nfc ou qr code avis | Comparaison |
| `/guides/plaque-nfc-avis-google-ne-fonctionne-pas` **(nouveau)** | plaque nfc ne fonctionne pas, iphone | Problème (capte aussi les clients des concurrents) |
| `/guides/lien-avis-google` **(nouveau)** | lien avis google, place id | Pratique |
| `/guides/comment-laisser-avis-google` **(nouveau)** | comment laisser un avis google | Grand public |
| `/guides/reponse-avis-google-en-attente` **(nouveau)** | réponse avis google en attente | Problème récent |
| `/guides/avis-google-restriction-avertissement` **(nouveau)** | avertissement avis suspects fiche google | Problème récent |
| `/guides/avis-google-disparus` **(nouveau)** | avis google disparu, avis non publié | Problème |
| `/guides/regles-avis-google` **(nouveau)** | règles avis google, jeu concours, réduction | Règles |
| `/guides/faux-avis-google-loi` **(nouveau)** | faux avis google loi, acheter des avis google | Juridique |
| 10 guides métier **(nouveaux)** | avis google auto-école, opticien, agence immobilière, artisan, bar, fleuriste, camping, chambre d'hôtes, food truck, barbier | Métier |
| 17 guides existants | voir `src/lib/guides.ts` | |

Chaque guide est un objet TypeScript : sitemap, JSON-LD, image Open Graph,
maillage, hubs et `llms.txt` se génèrent seuls. Les nouveaux guides vivent
dans `src/lib/guides-content/` (un fichier par grappe).

## 5. Ce qui est livré dans le code (12/10/2026)

### 5.1 Outils (aimants à liens et à acheteurs)

| Outil | Fichiers | Ce qu'il fait | Contenu indexable |
| --- | --- | --- | --- |
| Calculateur de note | `src/app/outils/calculateur-note-google/`, `src/lib/rating.ts` | Avis 5★ (ou 4,8 / 4,5 en moyenne) nécessaires pour une note cible, délai selon le rythme, effet d'un avis 1★ | Formule, tableau 6 objectifs × 5 volumes, tableau de compensation, 7 FAQ (chiffres calculés au build) |
| Réponses aux avis | `src/app/outils/reponse-avis-google/`, `src/lib/review-replies.ts` | 6 types d'avis × 8 métiers × 3 variantes, prénom, signature, point soulevé, contact | 18 modèles à compléter + 8 exemples par métier, 7 règles, erreurs, santé, 8 FAQ |
| Message de demande d'avis | `src/app/outils/message-demande-avis-google/`, `src/lib/review-requests.ts` | SMS / WhatsApp / e-mail, vous / tu, 8 métiers, lien vérifié (Place ID accepté), envoi direct | 9 modèles, 5 phrases au comptoir, tableau « quand envoyer », règles, 8 FAQ |
| Hub `/outils` | `src/app/outils/page.tsx`, `src/lib/tools.ts` | Registre unique des outils (menu, pied de page, sitemap, llms.txt) | « Quel outil pour quel besoin », FAQ |

Tous les outils : 100 % navigateur (aucune donnée envoyée), JSON-LD
`WebApplication` + `FAQPage` + `BreadcrumbList`, image Open Graph dédiée,
événements de mesure `tool_use`, `tool_copy`, `tool_send` (avec consentement),
bloc de conversion vers le présentoir et maillage croisé entre outils.

### 5.2 Contenu

- **20 nouveaux guides** (voir §4.1), rédigés avec sources officielles
  vérifiées pour les sujets factuels (aide Google, Code de la consommation).
- **11 guides existants approfondis** (de ~550 à 1 100-1 500 mots) : les 9
  guides métier d'origine, `qr-code-avis-google` et
  `presentoir-plaque-nfc-avis-google`. Section répétitive « Mesurer et
  ajuster » remplacée par un contenu propre à chaque métier.
- Fiche produit : deux questions ajoutées (« différence avec une plaque NFC »,
  « y a-t-il un abonnement ? »).
- **Hub « Collecter des avis »** (`/guides/collecter-des-avis`).
- Guide dentiste : rappel des règles ordinales de communication (art.
  R.4127-215 du Code de la santé publique).

### 5.3 Technique

| Changement | Fichier |
| --- | --- |
| 301 `app.reviu.fr/{guides,outils,presentoir-avis-google,demo,revendeur}` → reviu.fr | `src/proxy.ts` |
| `lastmod` réels (pages, guides, outils, hubs) | `src/app/sitemap.ts` |
| `llms.txt` généré depuis les sources | `src/app/llms.txt/route.ts` |
| IndexNow : clé publique + script d'envoi | `public/8a1bbe5d755ca4082b08939138ac96d9.txt`, `scripts/indexnow.mjs` |
| Vérification de lien d'avis extraite (module pur, sans la librairie QR) | `src/lib/review-link.ts` |
| Menu « Ressources » + colonne « Outils gratuits » dans le pied de page | `src/lib/brand.ts`, `src/components/site/site-footer.tsx` |
| Mise en page commune des outils, carte Open Graph commune | `src/components/site/tool-layout.tsx`, `src/components/seo/og-card.tsx` |

## 6. GEO : être cité par les moteurs IA

Ce qui est établi (sources : documentation Google « AI features and your
website », documentation OpenAI des robots, études Ahrefs 2025) :

1. **Google AI Overviews / AI Mode** : aucune exigence particulière. Une page
   indexée, utile, avec des données structurées fidèles au texte visible,
   suffit. Pas besoin de fichier spécial (le `llms.txt` est un bonus pour les
   agents, Google dit ne pas s'en servir).
2. **ChatGPT** s'appuie sur des moteurs tiers, Bing en tête, et sur son robot
   `OAI-SearchBot` ; **Copilot** sur Bing. Donc : Bing Webmaster Tools +
   IndexNow, et ne jamais bloquer `OAI-SearchBot`, `PerplexityBot`, `Bingbot`
   (aucun n'est bloqué aujourd'hui). Bing Webmaster Tools a un rapport
   « AI Performance » (citations) : à suivre.
3. **Mentions de marque** : la corrélation la plus forte avec la visibilité
   dans les réponses IA (étude Ahrefs, ~75 000 marques), loin devant les liens.
   Les mentions **YouTube** ressortent le plus. D'où le plan vidéo (§7.3).
4. **Données originales, chiffres sourcés, citations** : levier documenté
   (étude GEO, KDD 2024). D'où le « Baromètre Reviu » (§7.2) et les guides
   qui citent leurs sources exactes.
5. **Fraîcheur** : les assistants citent des pages plus récentes que la
   moyenne. Mettre à jour les guides clés chaque trimestre (vraies
   modifications, pas seulement la date).
6. **Format** : chaque guide ouvre sur une réponse directe en 2-3 phrases ;
   FAQ en texte brut ; tableaux et listes ; une entité unique (`@id`
   Organization partagé).

## 7. Autorité : netlinking et mentions

Objectif : **30 domaines référents de qualité en 6 mois**, sans aucun achat de
liens (risque de pénalité et contraire à l'image « dans les règles » de la
marque).

### 7.1 Socle (mois 1)

- Fiches entreprise cohérentes (même nom, adresse, téléphone, description) :
  Google Business Profile reviu (Nîmes), Bing Places, Apple Business Connect,
  PagesJaunes, annuaires CCI du Gard et Chambre de Métiers, French Tech
  locale, LinkedIn entreprise (déjà en `sameAs`).
- Fiches Amazon / Etsy du présentoir : ventes + mentions de marque.
- Profils et fiches d'outils : annuaires d'outils gratuits pour commerçants,
  pages « ressources » de CCI, CMA, unions commerciales.

### 7.2 Contenus qui attirent des liens (mois 2-6)

- **Les outils** : les proposer aux blogs d'agences web locales, aux
  newsletters de réseaux de commerçants, aux formateurs CCI/CMA (« outil
  gratuit à recommander à vos commerçants »).
- **Baromètre Reviu** (dès qu'il y a assez de présentoirs actifs) : données
  anonymisées et agrégées issues de l'espace Reviu, uniques par nature :
  part des scans sans contact vs QR code, heures et jours de scan, écarts par
  métier. Une page `/barometre-avis-google` + un communiqué à la presse
  locale (Midi Libre, Objectif Gard) et professionnelle. C'est ce qui fait
  fonctionner la stratégie de Partoo.
- **Kit de démarrage gratuit** (affiches, scripts, modèles) en échange d'un
  e-mail (Brevo est déjà connecté) : liste de prospects + partages.
- **Partenariats** : éditeurs de caisses, agences web, experts-comptables,
  associations de commerçants : un lien « outil recommandé » contre une
  remise revendeur (programme `/revendeur`).

### 7.3 Mentions et vidéo

- **YouTube Shorts / TikTok / Instagram Reels** (comptes déjà ouverts) : une
  vidéo de 30 s par outil et par métier (« le présentoir chez un fleuriste »),
  description avec lien. Une vidéo de démonstration longue sur YouTube.
- Réponses utiles (sans spam) dans les groupes Facebook de commerçants, les
  forums professionnels et Reddit, en citant l'outil gratuit quand il répond à
  la question.
- Témoignages clients (photos au comptoir) : `src/lib/testimonials.ts`.

## 8. Calendrier éditorial (12 mois)

Rythme cible : **2 contenus par semaine** pendant 6 mois, puis 1.

| Période | Contenus |
| --- | --- |
| Mois 1-2 | Indexation des 20 nouveaux guides et 3 outils ; approfondir les 5 guides encore courts (~550 mots) : `avis-google-commerce-local`, `repondre-avis-google`, `supprimer-faux-avis-google`, `repondre-avis-negatif`, `augmenter-note-google` ; page « Google QR code ou présentoir ? » ; « avis Google sous pseudo » ; « affiche avis Google à imprimer » (modèles PDF depuis l'outil QR). |
| Mois 2-4 | Métiers suivants : tatoueur, toiletteur, caviste, boucherie-charcuterie, primeur, pizzeria, traiteur, photographe, contrôle technique, taxi/VTC, pressing, location de vacances, spa. Professions de santé (pharmacie, kiné, ostéopathe, vétérinaire) **uniquement après vérification des règles ordinales**. |
| Mois 3-6 | Baromètre Reviu ; outil « vérificateur de lien d'avis » ; page comparatif (avec relecture juridique) ; guides problèmes : avis en double, avis traduits, fiche fusionnée, multi-établissements. |
| Mois 6-12 | Mise à jour trimestrielle des 10 pages qui génèrent le plus d'impressions ; nouvelles pages sur les requêtes qui apparaissent dans Search Console ; éventuelle version anglaise des outils si le trafic le justifie. |

Règle d'or : **chaque mois, ouvrir Search Console > Performances > Requêtes**,
repérer les requêtes en position 8-30 avec des impressions, et enrichir la
page correspondante (section, FAQ, exemple). C'est le levier le plus rentable
une fois le site indexé.

## 9. Actions manuelles (hors code), par ordre de priorité

1. **Mettre en production** cette branche (fast-forward de `main`).
2. **Google Search Console** (propriété Domaine `reviu.fr`) : soumettre
   `https://reviu.fr/sitemap.xml`, puis « Inspection de l'URL > Demander une
   indexation » pour `/outils`, les 3 nouveaux outils et les 5 guides les plus
   stratégiques (prix-plaque, réponse en attente, restriction, règles,
   lien-avis). Les autres seront découverts par le sitemap.
3. **Bing Webmaster Tools** : importer depuis Search Console, soumettre le
   sitemap, puis lancer `node scripts/indexnow.mjs --since 2026-10-12`
   (après déploiement). À relancer après chaque mise en ligne de contenu.
4. **Google Business Profile reviu** (Nîmes) : catégorie, description,
   lien vers le site, photos du présentoir, premiers avis (avec le présentoir).
5. **GA4** : vérifier que `NEXT_PUBLIC_GA_MEASUREMENT_ID` est en place ;
   créer les audiences « Utilisateurs des outils » (`tool_use`, `tool_copy`,
   `qr_download`) pour le reciblage Google Ads.
6. **10 premiers liens** (§7.1) dans le mois.
7. **Tester les résultats enrichis** de 3 pages d'outils et 3 guides
   ([test des résultats enrichis](https://search.google.com/test/rich-results)).
8. **Relecture humaine** des 20 nouveaux guides (le client connaît son métier
   et ses clients : ajouter anecdotes et photos réelles renforce l'E-E-A-T).

## 10. Mesure

| Indicateur | Outil | Rythme |
| --- | --- | --- |
| Impressions, clics, position par grappe (outils, métiers, problèmes, produit) | Search Console (filtre par URL) | Mensuel |
| Citations IA | Bing Webmaster Tools > AI Performance ; tests manuels dans ChatGPT / Perplexity / Gemini sur 10 questions types | Mensuel |
| Usage des outils : `tool_use`, `tool_copy`, `tool_send`, `qr_download` | GA4 | Mensuel |
| Passage outil → fiche produit → commande (`begin_checkout`, `purchase`) | GA4 + provenance Stripe | Mensuel |
| Domaines référents | Search Console > Liens, Bing WMT | Mensuel |

Objectifs de pilotage (des cibles, pas des prévisions) : toutes les nouvelles
pages indexées sous 4 semaines ; premières impressions sur les requêtes outils
et problèmes récents sous 6-8 semaines ; 30 domaines référents à 6 mois.

## 11. Règles à conserver

- **Un canonical par page indexable** (`buildMetadata`) ; `app.reviu.fr` et
  `r.reviu.fr` restent hors index (301 + robots).
- Titres < ~60 caractères, descriptions < ~155, un seul `h1`, hiérarchie
  `h2`/`h3` respectée.
- **Contenu conforme Google** : aucune promesse d'avis garantis, pas de tri des
  clients, pas de contrepartie. Vital pour la marque, le SEO et le GEO.
- **Aucune statistique inventée** ; toute donnée chiffrée cite sa source.
- **Jamais de lien dans les réponses FAQ** (elles alimentent le JSON-LD).
- **Aucun tiret cadratin ni demi-cadratin** dans le code et le contenu.
- Professions de santé : vérifier les règles ordinales avant toute page.
- Nouveau guide = un objet dans `src/lib/guides-content/*.ts` ; nouvel outil
  = une entrée dans `src/lib/tools.ts` + sa route `src/app/outils/...`.
