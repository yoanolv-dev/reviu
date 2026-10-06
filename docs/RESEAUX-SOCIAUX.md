# Réseaux sociaux : textes de profil

Textes prêts à coller pour chaque profil reviu. Ils suivent la charte
(`brand/README.md`, page « Le ton et le vocabulaire ») : on vouvoie, on parle
de « Présentoir Reviu » et de « sans contact ou QR code », jamais de « NFC »,
« plaque » ou « borne », pas de superlatifs (« n°1 », « révolutionnaire »).
Chaque chiffre vient de `src/lib/brand.ts` : si le prix, la garantie ou la
livraison changent, mettre ces textes à jour.

Photo de profil partout : `brand/logo/png/reviu-avatar-reseaux.png`.
Bannières : designs Canva listés dans `brand/README.md`.

| Réseau | Lien |
|---|---|
| Instagram | https://www.instagram.com/reviu.fr/ |
| LinkedIn | https://www.linkedin.com/company/reviu-fr/ |
| TikTok | https://www.tiktok.com/@reviufr |
| Facebook | https://www.facebook.com/profile.php?id=61595054728197 |

---

## Instagram

Public : commerçants qui découvrent la marque en scrollant. La bio doit dire en
une seconde ce que c'est, ce que ça coûte, et donner un lien.

**Nom** (30 car. max, il est pris en compte par la recherche Instagram) :

```
reviu · Avis Google commerces
```

**Catégorie** : Produit/service

**Bio** (150 car. max) :

```
Le présentoir qui fait laisser un avis Google en 1 geste ⭐
Sans contact ou QR code, iPhone et Android
29,90 € une fois, livraison offerte 👇
```

**Lien** : `https://reviu.fr/?utm_source=instagram&utm_medium=social&utm_campaign=bio`

**Bouton de contact** : e-mail `contact@reviu.fr`.

**Stories à la une** (titres courts, sous les icônes) : `Le geste` ·
`Clients` · `Avis` · `Offre` · `QR gratuit` · `FAQ`.

---

## LinkedIn (page entreprise)

Public : gérants, réseaux de franchises, agences, futurs revendeurs. Ton un peu
plus posé, le texte « À propos » est indexé par Google : il reprend les mots
« avis Google », « commerces de proximité », « présentoir ».

**Slogan** (120 car. max) :

```
Plus d'avis Google, directement depuis votre comptoir. Le Présentoir Reviu, 29,90 € une fois, sans abonnement.
```

**Secteur** : Logiciels et services informatiques (ou Commerce de détail)
**Taille** : 2-10 employés · **Type** : Société privée
**Siège** : France · **Site web** :
`https://reviu.fr/?utm_source=linkedin&utm_medium=social&utm_campaign=page`

**À propos** (2 000 car. max) :

```
Un client satisfait laisse rarement un avis Google. Pas par manque d'envie : parce qu'il faut chercher l'établissement, trouver le bon bouton, et qu'il est déjà reparti. Pendant ce temps, la note affichée sur Google Maps décide de plus en plus du choix de vos futurs clients.

reviu règle ce problème au comptoir.

Le Présentoir Reviu se pose près de la caisse. Votre client approche son téléphone, sans contact, ou scanne le QR code : votre page d'avis Google s'ouvre directement, prête à être remplie. Aucune application à installer, compatible iPhone et Android.

Ce qui est inclus :
• Le présentoir, configuré sur votre établissement
• L'espace Reviu : statistiques de scans (sans contact et QR code distingués), gestion de vos présentoirs, modification du lien à tout moment
• Livraison offerte en 3 à 5 jours ouvrés
• Satisfait ou remboursé 30 jours

29,90 € une seule fois. Sans abonnement, sans engagement.

Pour qui : restaurants, cafés, boulangeries, coiffeurs, instituts, garages, hôtels, boutiques, professions de santé… tous les commerces de proximité où le client passe au comptoir.

Une conviction : Reviu ne filtre pas les avis. Chaque client est envoyé vers la même page Google, qu'il soit ravi ou déçu. C'est ce qui rend votre note crédible, et c'est conforme aux règles de Google.

Vous êtes une agence, un réseau ou une franchise ? Notre programme revendeur est fait pour vous : reviu.fr/revendeur

Conçu en France par NEVIFY.
Contact : contact@reviu.fr

reviu est un service indépendant, non affilié à Google.
```

**Spécialités** (une par ligne dans LinkedIn) : Avis Google · Réputation en
ligne · Commerce de proximité · Fiche Google Business Profile · Marketing local ·
QR code · Sans contact · Expérience client

**Bouton personnalisé** : « Visiter le site web » vers le lien ci-dessus.

---

## TikTok

Public : jeunes commerçants, gérants de restaurants et salons, et leurs
équipes. La bio est très courte : promesse + preuve de simplicité, le reste se
dit en vidéo.

**Nom** (30 car. max) :

```
reviu · Avis Google
```

**Bio** (80 car. max) :

```
Vos clients laissent un avis Google en 1 geste ⭐ 29,90 €, sans abonnement
```

**Lien** (disponible avec un compte Business) :
`https://reviu.fr/?utm_source=tiktok&utm_medium=social&utm_campaign=bio`

**Catégorie du compte Business** : Services aux entreprises.

---

## Facebook (page)

Public : commerçants locaux, souvent plus âgés, qui comparent et posent des
questions en message privé. Texte rassurant, concret, avec les garanties.

**Nom de la page** :

```
reviu
```

**Nom d'utilisateur** (à réserver pour une URL propre, remplace
`profile.php?id=…`) : `reviu.fr` (ou `reviufr` si pris). Penser à mettre à jour
le lien dans `SOCIAL_LINKS` (`src/lib/brand.ts`) une fois réservé.

**Catégories** : Service aux entreprises · Agence de marketing ·
Site web de produits/services

**Intro / Bio** (101 car. max) :

```
Le présentoir qui fait laisser un avis Google en 1 geste. 29,90 € une fois, livraison offerte.
```

**Détails de la page** (description longue, 255 car. max) :

```
Le Présentoir Reviu se pose près de votre caisse : vos clients ouvrent votre page d'avis Google sans contact ou par QR code, sans application. 29,90 € une seule fois, sans abonnement. Livraison offerte, satisfait ou remboursé 30 jours.
```

**Coordonnées** : site `https://reviu.fr/?utm_source=facebook&utm_medium=social&utm_campaign=page`
· e-mail `contact@reviu.fr` · téléphone `07 81 98 30 42`.

**Bouton d'action** : « Acheter » (ou « En savoir plus ») vers le lien ci-dessus.

**Réponse automatique Messenger** (message d'accueil) :

```
Bonjour et merci pour votre message ! 👋 Nous vous répondons rapidement. En attendant, vous trouverez le présentoir, son fonctionnement et les questions fréquentes sur reviu.fr
```
