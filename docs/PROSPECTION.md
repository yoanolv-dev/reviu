# Prospection automatique par e-mail

Système 100 % gratuit, intégré au site : aucune intervention une fois lancé.

1. **Collecte** (chaque lundi, GitHub Actions) : `scripts/prospects-osm.mjs`
   récupère sur OpenStreetMap les commerces des villes ciblées (restaurants,
   cafés, boulangeries, coiffeurs, instituts, fleuristes, garages, hôtels…)
   qui ont **eux-mêmes publié** une adresse e-mail. Pas de scraping de sites,
   pas de liste achetée.
2. **Envoi** (toutes les 15 min, lundi-vendredi 9 h - 18 h) :
   `/api/outreach/send` envoie le lot suivant depuis votre boîte dédiée.
   Séquence de 3 e-mails courts, personnalisés par métier : J0, J+4, J+11.
3. **Préchauffage** : 20 e-mails le 1er jour, +15 par jour, plafond 300/jour
   atteint en ~3 semaines.
4. **Conformité** (RGPD / CNIL, prospection B2B) : lien de désinscription
   dans chaque e-mail + en-tête « désinscription en un clic », origine de
   l'adresse indiquée, désinscription définitive.
5. **Suivi** : `/admin/prospection` (statistiques, arrêter un prospect qui a
   répondu). Les réponses arrivent directement dans la boîte d'envoi.

## Mise en route (une seule fois, ~30 min)

### 1. Une boîte d'envoi dédiée
Ne prospectez **jamais** depuis `reviu.fr` (il porte les e-mails clients).
Achetez un domaine proche (ex. `reviu-commerce.fr`, ~8 €/an chez OVH ou
Ionos : la boîte mail est incluse, c'est le seul coût), créez
`yoan@reviu-commerce.fr`, et configurez SPF, DKIM et DMARC (assistant de
l'hébergeur). Faites rediriger le site de ce domaine vers reviu.fr.

> Gmail perso : techniquement possible mais déconseillé (risque de blocage
> du compte).

### 2. Base de données
Appliquer la migration `supabase/migrations/20261013100000_reviu_outreach.sql`.

### 3. Variables Vercel (Production)
| Variable | Exemple |
|---|---|
| `OUTREACH_SMTP_URL` | `smtps://yoan%40reviu-commerce.fr:MOTDEPASSE@ssl0.ovh.net:465` |
| `OUTREACH_FROM` | `Yoan de Reviu <yoan@reviu-commerce.fr>` |
| `OUTREACH_SENDER_NAME` | `Yoan` |
| `OUTREACH_SECRET` | une longue chaîne aléatoire |
| `OUTREACH_START_DATE` | date du premier envoi, ex. `2026-10-20` |
| `OUTREACH_DAILY_MAX` | `300` (facultatif) |
| `OUTREACH_PAUSED` | `true` pour tout arrêter |

(Le `@` de l'identifiant s'écrit `%40` dans l'URL.)

### 4. GitHub (Settings → Secrets and variables → Actions)
- Secrets : `OUTREACH_SECRET` (le même), `NEXT_PUBLIC_SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`.
- Variable : `OUTREACH_CITIES`, ex. `Nîmes;Montpellier;Avignon;Arles;Alès`.

Puis lancer une première fois *Actions → Prospection → Run workflow* avec
`import`. Ajouter des villes à `OUTREACH_CITIES` quand le stock s'épuise.

## Ce qu'il faut garder en tête
- Répondez vite aux réponses positives, puis marquez-les « A répondu » dans
  l'admin pour couper les relances.
- Si le taux de rebonds ou de plaintes monte, mettez `OUTREACH_PAUSED=true`.
- Le volume dépend des données OSM : comptez quelques dizaines à quelques
  centaines d'adresses par ville moyenne ; il faut cibler beaucoup de villes
  pour tenir 300/jour.
