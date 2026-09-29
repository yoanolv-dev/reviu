# Plan d'action A1 v3 : « Un geste » (Reviu-A1-H1-24s-916)

## 0. Arbitrages entre relecteurs (vérifiés sur le code et les frames)

| Sujet | Décision | Motif |
|---|---|---|
| Mastering délavé (motion seul) | **P0** | Vérifié : la frame 660 décodée de `renders/` donne un blanc (235,235,235), celle de `out/` donne (255,255,255). Vidéo à 1,97 Mbit/s pour 8 à 12 demandés (6.1). |
| Tempo de l'ouverture : 4 propositions incompatibles (plongée à 26, 48 ou 64 ; feuille à 30, 54 ou 70) | **La page s'ouvre à 32 dans le téléphone resté au comptoir** (mini-plongée 0,66 → 0,85). La plongée caméra part à 82, quand l'accroche sort | C'est la seule option qui réunit trois conditions : accroche tenue ≥ 92 frames, image synchrone avec « s’ouvre », aucune collision titre/téléphone. Avec une plongée avant 80, le haut du téléphone (y 520) passe sous le bas de l'accroche (y 591, même en 120 px). |
| « Sans appli. » en pastille dans Modes (correcteur) | **Refusé**, le super reste dans la démo (avis de 4 relecteurs sur 5) | C'est la preuve visuelle au moment où la page s'ouvre sans rien installer. En pastille à 9 s, il ne toucherait plus que les spectateurs déjà retenus. |
| « Google » dans l'accroche | **Oui, dans le master** | Promesse validée 4.2. Sans voix off, la page générique peut se lire comme une page Reviu. « Google » y figure en texte simple, usage descriptif permis (9.1). |
| Point encre de « Un geste. » : sans point, virgule ou point resserré | **« Un geste » sans ponctuation** | Un seul point par écran, le doré. La majuscule de « Votre » reste correcte (avec une virgule, il faudrait « votre »). |
| « G » central : LogoFlou dès le lancement TikTok (media buyer) ou profondeur de champ (motion, conformité) | **Profondeur de champ optique dans le master**, LogoFlou en secours seulement | Le client exige la photo exacte. Le flou de mise au point sur le haut de la face est prévu par le brief 5.0 (« hors champ ou flou »). LogoFlou seulement en cas de refus, après accord écrit du client. |
| Espace : 4 réglages caméra proposés | **Z lien 1,2, T.y 1130**, dégradé supprimé | Haut du téléphone = T.y - Z × 504. Commerçant (1,3 ; 1060) : y 405, collision. Correcteur (1,42 ; 1100) : y 384, collision. Motion (1,28 ; 1180) : y 535, mais bas du bouton à y 1263, hors zone. Retenu : haut à y 525 (bas du titre à 471), bas du bouton à y 1205. |
| Métiers : 4 mots proposés par tous | **3 métiers** (restaurant, salon, boulangerie), sur les temps | Avec 4 mots de 15 frames, le final n'a que 45 frames pour 52 requises. Boulangerie remplace garage : c'est le comptoir où l'on n'a pas une seconde pour demander (P4), et elle rime avec le final. Garage, boutique et hôtel passent en variantes métier. |
| « Au bon moment. » : garder, passer en minuscule ou remplacer | **« Sans avoir à demander. »** | « Au bon moment. » est abstrait sans voix off et n'est lisible que 24 frames sur 36. La douleur « gêne de demander » (3.3 et 3.5) n'est nommée nulle part. Aucune promesse de résultat. |
| Carte de fin : 4 mises en page différentes | **Nouvelle mise en page en deux colonnes** (P0-5) | Aucune proposition ne tient à la fois les 3 réassurances, des pastilles ≥ 44 px et les 2 mentions empilées. Le produit passe à environ 33 % de la largeur au lieu de 45 à 55 % (FIN standard). Écart assumé : l'offre et les mentions priment, et le produit a déjà été montré en grand dans 4 scènes. |
| TVA : scindée, raccourcie ou prolongée | **Prolongée de 540 à 720**, retour à la ligne après « CGI. » | Le prix reste affiché jusqu'à la fin, et « Livraison offerte » garde sa condition. |
| Texte des pastilles : 44, 45 ou 48 px | **46 px** (44 px pour « 30 jours satisfait ou remboursé* ») | À 48 px, la pastille la plus longue dépasse 830 px. |

## P0 : à faire avant toute diffusion

**P0-1 Mastering (0-719)**
- `scripts/master.py` : remplacer `scale=in_range=pc:out_range=tv,format=yuv420p` par `format=yuv420p`. Avec le rendu x2 de P1-8, utiliser `scale=W:H:flags=lanczos:in_range=tv:out_range=tv,format=yuv420p`.
- Encodage en 2 passes `-b:v 10M -maxrate 12M -bufsize 20M` à la place de `-crf 14`.
- Ajouter `-use_editlist 0` à `+faststart`.
- Nommer les fichiers `REV_A1_H1_24s_916_TT.mp4` et `REV_A1_H1_24s_916_META.mp4`.
- Contrôle : la frame 660 décodée du MP4 final donne un fond (255,255,255).
- Pourquoi : tout le film est délavé (blanc gris, or terne, contraste réduit), et les régies recompressent à partir d'un fichier trop pauvre.

**P0-2 Ouverture 0-225 : accroche lisible, synchro texte/image, G flou**
- `hooks.tsx` (H1) :
  - ligne 1 : `<KineticTitle text="Un geste" size={120} at={-8} out={HOOK_OUT} />`, sans point, déjà posée à la frame 0 (vignette, arrêt du pouce) ;
  - ligne 2 : `text={"Votre page d’avis\nGoogle s’ouvre"} size={78} at={6} stagger={3} accentLast dot` ;
  - `HOOK_OUT` 54 → 82 : affichage de -8 à 92, soit les 92 frames requises pour 42 caractères.
- `GESTE` : `bannerTap` 30 → 26, `sheetAt` 54 → 32, `pushFrom` 48 → 82, `starsAt` 108 → 135, `textAt` 128 → 153, `publishAt` 154 → 165, `waveAt` 196 → 208.
- Téléphone :
  - `PHONE_SMALL` devient animé : `mix(0.66, 0.85, prog(frame, 10, 14, EASE.move))` ;
  - `PHONE_TAP.y` 1392 → 1330, pour que la ligne d'étoiles de la feuille ouverte reste au-dessus du bandeau de mention (y < 1150 à la frame 60).
- Supers :
  - « Sans appli. » : at 64 → 92, out 102 → 118 ;
  - « Le client note librement. » : at 114 → 122, out = `waveAt`.
  - Les étoiles (135 à 147) et « Publier » (165) tombent sur les temps et sous leur super.
  - La plongée remplit 82 à 120 : le formulaire n'est plus jamais inerte.
- Vague : elle couvre l'écran de 208 à 223 (15 frames), donc plus de cobalt vide avant 225. Whoosh à 219 (6 frames avant la coupe).
- G, de 0 à `pushFrom` :
  - superposer au `Presentoir3D` une copie identique en `filter: blur(8px)`, masquée par `mask-image: linear-gradient(to bottom, #000 0%, #000 42%, transparent 58%)`. Le G et le bandeau bleu deviennent flous, la zone « COLLEZ VOTRE TÉLÉPHONE » reste nette ;
  - `rotateY` de départ -12 → -20 et `PRODUCT_LEFT` 220 → 300 : le G passe vers x 620, hors du centre optique (515/759) ;
  - recaler `PHONE_TAP.x` sur `nfc.x` ≈ 492.
- Pourquoi :
  - la promesse n'est entière que 17 à 22 frames, pour 80 à 92 requises (formule 6.4) ;
  - la page s'ouvre 25 frames après « s’ouvre » ;
  - le formulaire reste vide de 66 à 108 ;
  - le G net au centre dès la frame 0 viole 5.0 et 9.1 (risque de refus TikTok).

**P0-3 Mentions légales (durées, textes, bandeaux)**
- `Legal.tsx` :
  - bandeau opaque. Variante `dark` : `C.ink` plein, texte blanc. Variante claire : `#FFFFFF` plein, ombre `0 8px 24px -12px rgba(10,13,22,0.35)` ;
  - ajouter `whiteSpace: "pre-line"`.

| Texte exact | Emplacement | Frames | Style |
|---|---|---|---|
| « Scène reconstituée. Avis fictif. » | GesteScene | 30-214 | dark (posé sur le téléphone) |
| « Reviu est un service indépendant de Google. Google est une marque de Google LLC. » | retirée de MetiersScene, posée dans A1Geste | 226-414 (188 fr) | `dark={frame < 315}` |
| « Aperçu. Chiffres d’exemple. » | EspaceScene (nouvelle) | 424-536 | clair |
| « TVA non applicable, art. 293 B du CGI.\nLivraison offerte en France métropolitaine. » | A1Geste | 540-720 | `dark={frame < 600}` |
| « *Conditions : reviu.fr/cgv » (texte du brief 4.4 et 9.5, espace insécable avant « : ») | A1Geste, `lift={109}` (au-dessus de la TVA) | 612-720 | clair |

- Pourquoi (vérifié dans le code) :
  - les trois mentions de 2 lignes restent moins de 3 s (indépendance 321-415, TVA 542-632, CGV 636-720), alors que 6.4 exige 5 s ;
  - la TVA et la CGV se croisent en fondu de 632 à 642 ;
  - l'astérisque n'a pas de renvoi de 620 à 636 ;
  - après 632, « Livraison offerte » n'a plus sa condition ;
  - les bandeaux translucides laissent voir le produit et le téléphone, alors que le brief demande un « bandeau uni ».

**P0-4 Espace 420-540 : collision et « Aperçu »**
- `EspaceScene` :
  - `Z = mix(1, mix(1.5, 1.2, toLink), zoomIn)` ;
  - cible finale `T.y` 1020 → 1130 ;
  - supprimer le dégradé de 600 px.
- Timing :
  - `swapAt` 58 → 50 : « Espace Reviu inclus. » sort à 42 ;
  - `toLink = prog(frame, 48, 22, EASE.move)` ;
  - `editAt` 86 → 80.
  - « Changez le lien à tout moment. » est ainsi affiché de 470 à 540 : 70 frames pour 68 requises.
- Ajouter la mention « Aperçu. Chiffres d’exemple. » (voir P0-3).
- Pourquoi :
  - de 478 à 540, l'en-tête du téléphone apparaît en fantôme derrière « à tout moment » (on lit « moment.Aperçu » à la frame 510) ;
  - « Aperçu », obligatoire pendant tout le plan (9.5), est masqué ;
  - les chiffres 18 et 7 peuvent passer pour des résultats réels (L121-2).

**P0-5 Carte de fin 600-720 : nouvelle mise en page**
- Ligne 1 : logo à left 100, top 292, h 64.
- Colonne gauche (x 100 à 550 au plus) :
  - « Présentoir Reviu » en Inter 700, 44 px, encre, top 392 ;
  - « 29,90 € » en Plus Jakarta 800, 120 px, encre, top 452 ;
  - « une seule fois. » en 64 px, `accentLast dot`, top 584 ;
  - pastille « Sans abonnement », top 668 ;
  - pastille « Livraison offerte », top 754.
- Colonne droite : `Presentoir3D` width 440 → 358, left 572, top 392, `rotateY` -22 → -12, flottement ±8 → ±4. Garder au moins 20 px d'écart avec la colonne gauche.
- Pastille « 30 jours satisfait ou remboursé* » centrée, top 846, at local 22.
- `CtaButton` : width 650 (texte 44 px), top 1024 → 940, bas ≈ 1064.
- Mentions : CGV en 1080-1139, TVA en 1147-1248.
- Supprimer l'étiquette dorée « 29,90 € » : l'or ne reste que sur le point de « fois. » et sur le CTA.
- Pourquoi :
  - le CTA mord la pastille « 30 jours » et touche la mention (vérifié frame 660) ;
  - l'étiquette sort du cadre sûr, jusqu'à x ≈ 945 ;
  - « Sans abonnement », objection n°1, est absent de l'image de conversion ;
  - le nom « Présentoir Reviu » n'apparaît nulle part ;
  - les pastilles font 35 px ;
  - 3 éléments sont dorés.

## P1 : à faire dans cette itération

**P1-1 Bannière honnête (10-32).** `LinkBanner` :
- top `u*4` → `u*14`, sous l'îlot ;
- tailles de texte `u*5` → `u*6.5` et `u*4.2` → `u*5.5` ;
- TouchDot sur l'icône (x ≈ `u*10`), pas sur le texte ;
- `goneAt` = `bannerTap + 6`.

Pourquoi : à la frame 30, l'îlot masque « r.reviu.fr » et le doigt cache « pour ». Le moment signature n°2 se lit comme un bug.

**P1-2 Modes 225-315.**
- Titre : `at` 2 → 0, size 104 → 96.
- Pastille « iPhone et Android » : top 1170 → 512, at 58 → 36 (80 frames à l'écran).
- Produit : W 560 → 460, TOP 560 → 640, LEFT 260 → 300. Son bas passe à ≈ 1128, au-dessus du bandeau d'indépendance.
- Téléphone : `phY + outP*900` → `+ outP*1500`, et `return null` quand `outP >= 1`.
- QR :
  - crochets 7 → 10 px, verrouillés en blanc (et non en or), avec une pulsation 1 → 1,08 → 1 en 6 frames ;
  - ligne de scan blanche qui balaie le QR de 44 à 54.

Pourquoi : un téléphone reste garé au bord bas (vérifié de 270 à 312). La pastille ne tient que 32 frames pour 42 requises et déborde à y 1253. La moitié « QR code » n'est pas démontrée.

**P1-3 Métiers 315-420.**
- Plus de sur-titre : `KineticTitle text={"Au comptoir\nde votre"} size={96} at={-6} stagger={2}`, puis la ligne métier en 96 px cobalt, suivie d'un point doré.
- `WORDS = ["restaurant", "salon", "boulangerie"]` aux frames locales 0, 15 et 30, soit sur les temps 315, 330 et 345.
- Échange simultané en 6 frames `EASE.whip` : le mot sortant monte de 0 à -100 %, l'entrant arrive de +100 % à 0.
- Ticks aux mêmes frames.
- Pictogramme posé sur le coin haut droit du produit (left ≈ 740, top ≈ 610).
- Final : `KineticTitle text={"Sans avoir\nà demander"} size={110} at={45} dot accentLast`, soit 60 frames à l'écran. Le bloc métier sort de 40 à 48, whoosh-short à 42.
- Produit : width 540 → 460, left 250 → 300, top 620 → 640. C'est la pose exacte de la fin de Modes, ce qui crée un raccord sur la coupe de 315.

Pourquoi :
- chaque mot reste 11 frames, dont environ 5 stables ;
- les ticks sont hors grille (319, 330, 341…) ;
- la mention masque « propulsé par Reviu.fr » ;
- le sur-titre est interdit par le client, et le titre n'a pas de point final.

**P1-4 Prix 540-600.**
- `PriceStamp` : calculer le ressort sur `frame + 2` et lancer l'onde à `at + 2`, pour que « 29,90 € » soit opaque dès 540 (coup final de la musique).
- Présentoir : translateY de départ 500 → 220, top 760 → 720, width 360 → 340.
- Écrire `29<span style={{margin:"0 -0.05em"}}>,</span>90&nbsp;€`.
- Pastille « Sans abonnement » : at 20 → 12.

Pourquoi : la frame 540 est un aplat presque vide, et « 29 ,90 » se lit comme une coquille.

**P1-5 Typographie globale.**
- `KineticTitle` :
  - sur le span du point doré, `marginLeft: "-0.06em"` ;
  - remplacer `<span> </span>` par `<span style={{display:"inline-block", width:"0.28em"}} />`.
- Remplacer `'` par `’` dans KineticTitle, Mention, CheckPill et PhoneScreens (« Chiffres d’exemple », « Votre page d’avis Google », « Page d’avis trouvée »).
- `CtaButton` : `reviu<span style={{margin:"0 -0.04em"}}>.</span>fr`.
- Espaces insécables dans « art. 293 B » et « 30 jours », avant « : » et avant « € ».

Pourquoi : quatre relecteurs lisent « geste . », « appli . », « reviu. fr », « Leclient », « Aucomptoir ». Le défaut touche justement la signature exigée par le client.

**P1-6 Pastilles.** `CheckPill` :
- `fontSize: Math.max(44, size * 0.72)`, soit 46 px partout, sauf 44 px pour « 30 jours satisfait ou remboursé* » ;
- icône à 1,1 fois la taille du texte ;
- padding vertical de 12 px ;
- largeur maximale 830 px.

Pourquoi : les pastilles font aujourd'hui 35 à 40 px, sous le minimum de 44 px, alors que ce sont les réassurances qui font convertir.

**P1-7 Vignette.** `posterFrame` 150 → 60 : accroche complète, page ouverte, étoiles vides. Pourquoi : hors contexte, les 5 étoiles dorées se lisent comme la promesse « 5 étoiles », interdite par 4.5.

**P1-8 Rendu x2 et livrable Meta.** `renderMedia({ scale: 2 })`, puis réduction lanczos dans master.py vers 1080x1920 (TT) et 1440x2560 (META, 6.1). Pourquoi : le bord de l'écran du téléphone et le présentoir incliné sont crénelés, et le master Meta n'existe pas encore.

## P2 : si le temps le permet

- `theme.ts` : `TYPE = { display: 120, title: 96, sub: 78, price: 180 }`, titres ancrés à top 292. `PriceStamp` passe de 210 à 180 (plage 140-180 du brief).
- `Punch` : appliqué au fond seul, 1,06 → 1,03, pour que les titres ne sautent plus aux coupes.
- Raccord à 600 :
  - porter le présentoir dans A1Geste et l'interpoler de la pose prix à la pose fin entre 594 et 608 (`EASE.move`) ;
  - « 29,90 € » passe de 180 à 120 px et glisse à sa place dans la colonne gauche ;
  - le tout sous une `WaveWipe` flip cobalt → blanc.
- Signature sonore : `nfc.wav` sur le point doré du logo à 660 (7.6 n°9), au lieu de la frame 604.
- « reviu.fr » en Inter 700, 44 px, en haut à droite de la ligne du logo (FIN standard).
- DashboardScreen :
  - « Chiffres d’exemple » : top `u*83` → `u*74`, taille `u*5.5`, couleur `C.inkSoft` ;
  - carte du lien : top `u*95` → `u*84`, en mettant à jour `LINK.y` ;
  - « Votre nouvelle fiche » devient « Votre nouvelle fiche Google », en `u*5.8`, avec un soulignement cobalt tracé en 9 frames ;
  - TouchDot : anneau blanc de 3 px sur le bouton encre.
- « Avis publié » :
  - `C.success` → `C.cobalt` ;
  - coche tracée en 8 frames ;
  - éclats sur la 5e étoile seulement (7.6 n°4).
- Sur le cobalt (Modes, Prix) :
  - halo radial blanc derrière le présentoir : `rgba(255,255,255,0.28)` jusqu'à transparent à 60 %, 900 px ;
  - shadow 0,35 → 0,6.
- Garde-fou avant les 18 variantes : mentions centralisées et contrôle dans Check-A1.
  - Erreur si une mention d'une ligne reste moins de 90 frames, une mention de deux lignes moins de 150, si elle fait moins de 34 px ou si son bas dépasse y 1248.
  - Avertissement si un titre reste moins de max(25 ; 2 × car.) + 8 frames.
  - Normalisation typographique dans `copy.ts`.

## Timeline de référence v3

| Frames | Image | Super | Mention |
|---|---|---|---|
| 0-32 | approche, contact 4, mini-plongée 10-24, bannière 10, toucher 26 | « Un geste » / « Votre page d’avis Google s’ouvre. » (-8 → 82) | |
| 32-82 | feuille « Écrire un avis » dans le téléphone au comptoir, G flou | idem | Scène reconstituée 30-214 |
| 82-122 | plongée caméra, le produit tombe | « Sans appli. » 92-118 | |
| 122-208 | étoiles 135-147, texte 153, Publier 165, Avis publié 168 | « Le client note librement. » | |
| 208-223 | vague | | |
| 225-315 | toucher à 240 (drop), pastille à 261, crochets 269-279 | « Sans contact ou QR code. » | Indépendance 226-414 |
| 315-360 | restaurant 315, salon 330, boulangerie 345 | « Au comptoir de votre [métier]. » | |
| 360-420 | présentoir | « Sans avoir à demander. » | |
| 420-470 | Espace, compteurs | « Espace Reviu inclus. » | Aperçu 424-536 |
| 470-540 | lien modifié à 500 | « Changez le lien à tout moment. » | |
| 540-600 | tampon visible dès 540 | « 29,90 € une seule fois. », Sans abonnement 552 | TVA 540-720 |
| 600-720 | carte de fin P0-5 | | CGV 612-720 |

## Variantes à tester (le master reste inchangé)

1. **Accroches**, sur le même corps :
   - H2 « Vos clients vous adorent. / Google ne le sait pas encore. » (déjà codée) ;
   - accroche métier « Vous êtes boulanger ? ». Meta permet cet attribut (9.2), et « Un geste » peut aussi évoquer un « geste commercial » ;
   - H3 seulement en titre unique, « Nouveau : le présentoir d’avis sans appli. », et moins d'un an après le lancement.
2. **Offre d'abord** : ordre Geste, Modes, Prix, Espace, Fin, qui place le tampon vers 10,5 s au lieu de 18 s. Autre option : une pastille « 29,90 €, une seule fois » dès la scène Modes.
3. **Coupe de 15 s** (plan du brief) comme asset principal en Stories, testée contre le 24 s en Reels.
4. **Voix off réelle ou muet** : la voix en priorité sur TikTok et Reels, le muet sur les Feeds ; musique à 35 % sous la voix.
5. **Bénéfice dit en mots** : super « Récoltez plus facilement vos avis Google. » après la démo, ou « Vos avis Google, enfin au comptoir. » à la place de la ligne « Présentoir Reviu ».
6. **Espace orienté objection** :
   - « Prêt en 2 minutes. » avec la pastille « Sans technicien », à la place de « Changez le lien à tout moment. » ;
   - et/ou « Vos statistiques incluses. » à la place de « Espace Reviu inclus. ».
7. **Confiance locale** : « Entreprise de Nîmes » en haut à droite de la fin, à la place de « reviu.fr ».
8. **Boucle** : les 8 dernières frames reviennent au cadrage de la frame 0 (7.6 n°9), mention CGV maintenue. Mesurer le temps de visionnage et le CTR.
9. **Métiers** : versions garage, boutique et hôtel, avec mot fixe et pictogramme.
10. **Preuve QR forte** : second téléphone en mode appareil photo (`ScanScreen`, déjà codé) entre 263 et 300.
11. **Couche réelle** (après le tournage 5.7), de 0 à 1,5 s : vraie main, présentoir de démo `reviu.fr/demo` sur un vrai comptoir, à côté d'un TPE.
12. **Statistique IFOP 2026** avant le prix, avec sa mention source, seulement après l'accord écrit de Guest Suite.
13. **Secours TikTok** : composition `Reviu-A1-H1-24s-916-LogoFlou`, seulement en cas de refus et après accord écrit du client.

## Écartés

- **LogoFlou au lancement** : la face n'est plus la photo exacte, et le flou de mise au point suffit.
- **Timings d'ouverture du commerçant et du motion** : remplacés par P0-2.
- **Quatre métiers** : le final ne serait plus lisible.
- **« Un geste, »** : oblige à écrire « votre » en minuscule.
- **Étiquette prix à left 640 ou 660** : l'étiquette est supprimée.
- **Décor dans le tiers bas** : il serait caché par les 35 % d'interface Meta.
- **Dérive caméra, flou de mouvement, clavier pendant la saisie** : le coût dépasse le gain.
- **Étoiles recolorées** : elles sont déjà dans l'or de la charte (`C.gold` = #FBBC04).
- **Pastilles côte à côte en size 44** : le texte ferait 32 px.
- **Trois pastilles empilées** : incompatible avec les deux mentions empilées.
- **Hors vidéo** (autre tâche) :
  - légendes avec « compte Google requis », « sans contact dès l'iPhone XS » et la mention d'indépendance longue ;
  - QR lisible vers digifeel.fr sur les photos du site et de la charte, à neutraliser.

## Contrôle après rendu (Check-A1 avec zones sûres, puis MP4 final)

| Frame | À vérifier |
|---|---|
| 0 | Texte lisible ; G flou et hors centre. |
| 30 | Bannière entière ; doigt sur l'icône. |
| 60 | Accroche complète ; page ouverte ; étoiles au-dessus du bandeau. |
| 100 | Aucun contact entre titre et téléphone. |
| 140 | Étoiles sous « Le client note librement. ». |
| 222 | Plus de cobalt vide. |
| 290 | Aucun téléphone en bas ; pastille lisible. |
| 320, 335, 350 | Métier avec son point doré. |
| 480, 510, 539 | Haut du téléphone à y ≥ 505 ; « Aperçu » net. |
| 540 | Prix visible. |
| 606, 640, 719 | Aucun chevauchement ; aucun texte au-delà de x 930 ou de y 1248. |
| 660 (MP4 décodé) | Blanc = 255. |

