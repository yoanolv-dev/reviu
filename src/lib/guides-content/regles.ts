import type { Guide } from "@/lib/guides";

/**
 * Grappe « règles et problèmes » : ce que Google autorise, le cadre légal des
 * faux avis, et les situations de blocage (avis disparus, réponse en attente,
 * restriction de la fiche). Chaque affirmation factuelle s’appuie sur une page
 * officielle consultée lors de la rédaction (aide Google, Code de la
 * consommation, communications de la DGCCRF et du gouvernement).
 */
export const RULES_GUIDES: Guide[] = [
  // ── 1. Règles Google pour obtenir des avis ─────────────────────────────────
  {
    slug: "regles-avis-google",
    metaTitle: "Avis Google : ce que Google autorise et interdit · reviu",
    h1: "Ce que Google autorise (et interdit) pour obtenir des avis",
    description:
      "Demander un avis Google à tous vos clients est permis ; remise, jeu concours, tri des clients ou avis de salariés sont interdits. Règles et cas concrets.",
    excerpt:
      "Google encourage les commerçants à demander des avis, à condition de le faire pour tous et sans contrepartie. Voici la frontière exacte entre ce qui est permis et ce qui expose votre fiche.",
    keywords: [
      "règles avis google",
      "avis google autorisé",
      "avis google interdit",
      "contrepartie avis google",
      "jeu concours avis google",
      "review gating",
      "politique avis google",
    ],
    category: "Comprendre",
    readMinutes: 10,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Google autorise, et même encourage, les commerçants à demander des avis : à l’oral, par un lien ou par un QR code affiché en boutique. Ce qu’il interdit, c’est d’influencer le résultat : offrir une contrepartie (remise, cadeau, participation à un jeu concours), ne solliciter que les clients satisfaits, décourager les avis négatifs, faire noter l’établissement par des salariés ou des proches, imposer des quotas à l’équipe ou écrire l’avis à la place du client. La règle tient en une phrase : tout le monde est invité de la même façon, et chacun écrit librement ce qu’il pense.",
      },
      {
        type: "p",
        text: "Ces principes figurent dans le [règlement de Google sur les contenus publiés dans Maps](https://support.google.com/contributionpolicy/answer/7400114?hl=fr), aux rubriques « Engagement artificiel » et « Manipulation des notes ». Voici ce qu’ils disent précisément, puis comment les appliquer au quotidien.",
      },
      { type: "h2", text: "Ce que Google autorise noir sur blanc" },
      {
        type: "p",
        text: "Le règlement contient une phrase que peu de commerçants connaissent : Google autorise les marchands à « demander ou encourager la publication de contenus qui représentent une véritable expérience, sans proposer d’avantages en échange, ni tenter d’influencer la note ou le contenu de l’avis ». Demander un avis n’a donc rien de suspect. C’est la manière de le faire qui compte.",
      },
      {
        type: "ul",
        items: [
          "Rappeler à vos clients qu’ils peuvent laisser un avis : c’est le premier conseil de la page d’aide Google « [Conseils pour obtenir plus d’avis](https://support.google.com/business/answer/3474122?hl=fr) ».",
          "Partager un lien ou un QR code : sur sa page « [Créer un lien ou un QR code pour demander des avis](https://support.google.com/business/answer/16816815?hl=fr) », Google suggère de l’indiquer sur vos reçus, dans vos e-mails de remerciement, ou d’imprimer le QR code pour l’afficher en magasin.",
          "Envoyer une demande par e-mail, WhatsApp ou message, à condition que le texte soit le même pour tous et ne promette rien.",
          "Répondre aux avis, positifs comme négatifs, et proposer à un client mécontent de vous contacter pour régler le problème.",
        ],
      },
      {
        type: "p",
        text: "Bon à savoir : il faut un compte Google pour publier un avis, mais Google précise qu’on peut en créer un avec une adresse e-mail autre que Gmail.",
      },
      { type: "h2", text: "Ce que Google interdit, règle par règle" },
      { type: "h3", text: "Offrir une contrepartie, quelle qu’elle soit" },
      {
        type: "p",
        text: "Google interdit de « proposer des avantages (comme un paiement, des remises, des produits et/ou services gratuits) en échange de la publication d’un avis, ou de la modification ou suppression d’un avis négatif ». Café offert, tampon bonus sur la carte de fidélité, remise, tirage au sort : tout avantage lié à l’avis entre dans cette catégorie. Peu importe qu’il soit modeste ou accordé quelle que soit la note : c’est l’échange lui-même qui est interdit.",
      },
      { type: "h3", text: "Ne solliciter que les clients contents" },
      {
        type: "p",
        text: "Le règlement interdit de « solliciter des avis positifs de façon sélective ». C’est ce qu’on appelle en anglais le review gating : on demande d’abord au client s’il est satisfait, et l’on n’envoie vers Google que ceux qui répondent oui. Que le tri soit fait par l’équipe ou par un formulaire automatique, la note obtenue ne reflète plus la réalité.",
      },
      { type: "h3", text: "Décourager les avis négatifs" },
      {
        type: "p",
        text: "Il est également interdit de « déconseiller ou interdire de publier des avis négatifs ». Proposer à un client mécontent de vous parler est une excellente pratique. Lui suggérer de ne pas publier son avis, ou subordonner un geste commercial à son silence, ne l’est pas.",
      },
      { type: "h3", text: "Les avis en conflit d’intérêts" },
      {
        type: "p",
        text: "Google supprime les contenus fondés sur un conflit d’intérêts, qui peut inclure, selon ses termes, « un emploi actuel ou ancien, une relation contractuelle ou de conseil », ou d’autres affiliations « comme des concurrents du secteur, des liens familiaux ». Vos salariés, vos anciens salariés, votre famille, votre comptable ou votre fournisseur ne doivent donc pas noter votre établissement. Et publier sur la fiche d’un concurrent pour lui nuire est explicitement interdit.",
      },
      { type: "h3", text: "Imposer des quotas ou un contenu à l’équipe" },
      {
        type: "p",
        text: "C’est le point le plus méconnu. Google cite comme pratiques interdites les « marchands demandant à leur personnel de solliciter un certain nombre d’avis », et ceux qui demandent à leur personnel de solliciter des avis incluant « un contenu spécifique, y compris des éléments qui identifient un membre du personnel ». Un objectif de vingt avis par mois assorti d’une prime, ou la consigne « demandez aux clients de citer mon prénom », tombent sous le coup de cette règle. Votre équipe peut inviter les clients ; elle ne doit pas courir après un chiffre.",
      },
      { type: "h3", text: "Forcer l’avis, orienter la note ou l’écrire soi-même" },
      {
        type: "p",
        text: "Le règlement interdit d’« obliger les utilisateurs, lorsqu’ils sollicitent des avis, à laisser une note ou rédiger un avis sur place, ou exercer une pression en ce sens, ni leur demander d’inclure un contenu spécifique ». Proposer de scanner le QR code tout de suite est permis ; rester penché au-dessus du client jusqu’à ce qu’il valide, ou prendre son téléphone pour taper l’avis à sa place, ne l’est pas. Demander « 5 étoiles » revient à tenter d’influencer la note. Quant à un avis rédigé par vous, même avec l’accord du client, il décrit votre point de vue, pas « une expérience réellement vécue » par lui, ce que Google exige de chaque contribution.",
      },
      { type: "h2", text: "Ce qu’un présentoir ou un QR code a le droit de faire" },
      {
        type: "p",
        text: "Un support de comptoir n’est ni conforme ni interdit par nature : tout dépend de l’endroit où il envoie le client et du message qui l’accompagne. Il reste dans les règles lorsque :",
      },
      {
        type: "ul",
        items: [
          "il ouvre directement la page d’avis Google de votre fiche, pour tous les clients, sans question préalable ;",
          "son message invite à donner un avis (« Votre avis nous aide »), jamais une note précise ;",
          "il est visible de la même façon pour tout le monde, quel que soit le déroulé de la visite.",
        ],
      },
      {
        type: "p",
        text: "À l’inverse, certains dispositifs enfreignent les règles même s’ils affichent le logo Google :",
      },
      {
        type: "ul",
        items: [
          "un écran intermédiaire « Êtes-vous satisfait ? » qui envoie les clients contents vers Google et les mécontents vers un formulaire privé : c’est exactement la sollicitation sélective que le règlement interdit ;",
          "une affiche « Laissez-nous 5 étoiles », qui cherche à orienter la note ;",
          "un QR code associé à une remise, un cadeau ou un tirage au sort.",
        ],
      },
      {
        type: "p",
        text: "Le [Présentoir Reviu](/presentoir-avis-google) repose sur ce principe : un geste sans contact ou QR code qui ouvre la page d’avis Google de votre fiche pour chaque client, sans filtre ni question préalable. Si vous préférez fabriquer votre propre support, notre [générateur de QR code et d’affiche](/outils/qr-code-avis-google) crée un lien direct vers votre fiche.",
      },
      { type: "h2", text: "Cas pratiques : autorisé ou pas ?" },
      { type: "h3", text: "Un jeu concours réservé aux clients qui laissent un avis" },
      {
        type: "p",
        text: "Interdit. La chance de gagner est un avantage, et la participation dépend de l’avis. Si vous voulez animer votre clientèle avec un concours, organisez-le sans aucun lien avec Google : ni condition d’avis, ni QR code d’avis sur l’affiche du concours.",
      },
      { type: "h3", text: "Une remise sur la prochaine visite « pour vous remercier »" },
      {
        type: "p",
        text: "Interdit, même présentée comme un simple merci : les remises sont citées en toutes lettres. Votre programme de fidélité peut exister, mais il ne doit jamais récompenser le dépôt d’un avis.",
      },
      { type: "h3", text: "Demander à ses amis et à sa famille" },
      {
        type: "p",
        text: "À éviter. Les liens familiaux sont cités comme source de conflit d’intérêts, et la notion d’« affiliation personnelle » laisse peu de marge pour les amis proches. Un ami qui n’a jamais été client n’a aucune expérience à raconter. Et un message groupé à tout votre répertoire au lancement produit le genre de pic que le règlement désigne comme indice de manipulation : des « volumes ou schémas de contributions d’avis inhabituels ».",
      },
      { type: "h3", text: "Les avis de vos salariés" },
      {
        type: "p",
        text: "Interdits, y compris ceux de leur entourage. Un salarié peut en revanche inviter les clients à donner leur avis, avec les mêmes mots que vous, sans objectif chiffré et sans leur demander de citer son nom.",
      },
      { type: "h3", text: "Un geste commercial pour un client mécontent" },
      {
        type: "p",
        text: "Autorisé, tant qu’il n’est pas conditionné à l’avis : réparer une erreur ou rembourser, c’est du service client. Dire « je vous rembourse si vous retirez votre avis » est en revanche interdit, puisque le règlement vise aussi les avantages offerts pour modifier ou supprimer un avis négatif. Google observe d’ailleurs qu’une réponse positive et un suivi peuvent encourager le client à modifier son avis de lui-même. Notre méthode pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille comment s’y prendre.",
      },
      { type: "h2", text: "Ce que vous risquez en cas d’infraction" },
      {
        type: "p",
        text: "Les avis non conformes sont supprimés, et Google peut restreindre la fiche : blocage des nouveaux avis pendant une période donnée, dépublication temporaire des avis existants, ou avertissement affiché aux internautes pour signaler que des avis factices ont été supprimés. Nous détaillons ces mesures dans notre guide sur [l’avertissement et la restriction des avis](/guides/avis-google-restriction-avertissement). Le règlement prévoit aussi des mesures visant le compte lui-même, « allant de la suspension des droits du compte à sa clôture ».",
      },
      {
        type: "p",
        text: "La loi française ajoute son propre volet : publier ou faire publier de faux avis est une pratique commerciale trompeuse, passible de sanctions pénales. Nous l’expliquons dans [faux avis et avis achetés : ce que dit la loi](/guides/faux-avis-google-loi).",
      },
      { type: "h2", text: "La méthode conforme qui fonctionne" },
      {
        type: "ol",
        items: [
          "Demandez à chaque client, avec la même phrase, tant qu’il est encore là : à l’encaissement, à la remise des clés, à la fin du soin.",
          "Rendez le geste immédiat : un support sans contact ou QR code sur le comptoir, qui ouvre directement la page d’avis.",
          "Pour les clients partis trop vite, envoyez un message identique pour tous ; notre [générateur de messages de demande d’avis](/outils/message-demande-avis-google) propose des formulations prêtes à l’emploi.",
          "Répondez aux avis, critiques comprises : une fiche vivante donne envie aux clients suivants d’écrire à leur tour.",
        ],
      },
      {
        type: "p",
        text: "Respecter ces règles n’empêche pas d’obtenir beaucoup d’avis : notre guide pour [avoir plus d’avis Google](/guides/avoir-plus-avis-google) détaille le discours et le bon moment selon votre activité.",
      },
    ],
    faq: [
      {
        q: "Google autorise-t-il à demander des avis à ses clients ?",
        a: "Oui. Le règlement de Google autorise explicitement les commerçants à demander ou encourager des avis qui reflètent une véritable expérience, à condition de ne proposer aucun avantage en échange et de ne pas chercher à influencer la note ou le contenu. Une demande orale, un lien ou un QR code sont donc permis.",
      },
      {
        q: "Peut-on offrir une réduction ou un cadeau en échange d’un avis Google ?",
        a: "Non. Google interdit de proposer un avantage, comme un paiement, une remise ou un produit gratuit, en échange de la publication d’un avis. C’est vrai même si l’avantage est accordé quelle que soit la note, et même pour une petite attention.",
      },
      {
        q: "Un jeu concours pour les clients qui laissent un avis est-il autorisé ?",
        a: "Non. La participation à un tirage au sort est un avantage lié à l’avis, ce que Google range dans l’engagement artificiel interdit. Un concours peut exister, mais sans aucune condition liée au dépôt d’un avis.",
      },
      {
        q: "Mes salariés peuvent-ils laisser un avis sur mon commerce ?",
        a: "Non. Google classe l’emploi actuel ou ancien parmi les conflits d’intérêts, au même titre que les liens familiaux ou la concurrence, et supprime ces avis. Vos salariés peuvent en revanche inviter les clients à donner leur avis, sans quota et sans leur demander de citer un nom.",
      },
      {
        q: "Peut-on ne demander un avis qu’aux clients satisfaits ?",
        a: "Non. Solliciter des avis positifs de façon sélective est interdit par le règlement de Google. Cela vise aussi les outils qui posent d’abord une question de satisfaction et n’envoient vers Google que les clients contents.",
      },
      {
        q: "Un QR code d’avis Google affiché en boutique est-il conforme ?",
        a: "Oui, Google suggère lui-même d’imprimer et d’afficher le QR code en magasin. Il reste conforme tant qu’il ouvre la page d’avis pour tous les clients, sans filtre de satisfaction, sans contrepartie et sans demander une note précise.",
      },
      {
        q: "Que risque un commerce qui ne respecte pas ces règles ?",
        a: "Les avis concernés sont supprimés, et Google peut restreindre la fiche : nouveaux avis bloqués pendant une période donnée, avis existants dépubliés ou avertissement visible par les internautes. En France, les faux avis relèvent aussi des pratiques commerciales trompeuses, sanctionnées par la loi.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "faux-avis-google-loi",
      "avis-google-restriction-avertissement",
      "qr-code-avis-google",
      "presentoir-plaque-nfc-avis-google",
    ],
  },

  // ── 2. Faux avis : la loi ──────────────────────────────────────────────────
  {
    slug: "faux-avis-google-loi",
    metaTitle: "Faux avis et avis achetés : ce que dit la loi · reviu",
    h1: "Faux avis et avis achetés : ce que dit la loi et ce que vous risquez",
    description:
      "Acheter des avis Google ou publier de faux avis est puni en France : jusqu’à 5 ans de prison et 750 000 € en ligne. Ce que dit la loi, et ce que fait Google.",
    excerpt:
      "Acheter des avis Google peut ressembler à un raccourci. C’est surtout un délit, une cible des contrôles de la DGCCRF et un motif de sanction sur votre fiche. Le point complet, textes à l’appui.",
    keywords: [
      "faux avis google loi",
      "acheter des avis google",
      "avis google achetés",
      "faux avis sanction",
      "faux avis pratique commerciale trompeuse",
      "dgccrf faux avis",
      "faux avis amende",
    ],
    category: "Comprendre",
    readMinutes: 10,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Oui, c’est illégal. En France, diffuser ou faire diffuser de faux avis de consommateurs figure parmi les pratiques commerciales réputées trompeuses du Code de la consommation (article L. 121-4, 28°). Ce délit est puni de deux ans d’emprisonnement et de 300 000 € d’amende, peines portées à cinq ans et 750 000 € lorsque l’infraction est commise en ligne. Acheter des avis Google à un prestataire entre dans ce cadre, puisque le texte vise aussi le fait de « faire diffuser » de faux avis par une autre personne. Et, indépendamment de la loi, Google supprime ces avis et peut restreindre la fiche.",
      },
      { type: "h2", text: "Ce que dit le Code de la consommation" },
      {
        type: "p",
        text: "Depuis le 28 mai 2022, date d’entrée en vigueur de l’ordonnance n° 2021-1734 du 22 décembre 2021 (qui transpose une directive européenne de 2019 sur la protection des consommateurs), deux pratiques liées aux avis figurent dans la liste de l’article L. 121-4 du Code de la consommation :",
      },
      {
        type: "ul",
        items: [
          "27° : le fait « d’affirmer que des avis sur un produit sont diffusés par des consommateurs qui ont effectivement utilisé ou acheté le produit sans avoir pris les mesures nécessaires pour le vérifier » ;",
          "28° : le fait « de diffuser ou faire diffuser par une autre personne morale ou physique des faux avis ou de fausses recommandations de consommateurs ou modifier des avis de consommateurs ou des recommandations afin de promouvoir des produits ».",
        ],
      },
      {
        type: "p",
        text: "Le gouvernement qualifie ces pratiques de « réputées trompeuses en toutes circonstances » : elles appartiennent à une liste noire, sans qu’il soit nécessaire d’analyser au cas par cas leur effet sur le consommateur. Le 28° couvre trois comportements distincts : écrire soi-même de faux avis, les faire écrire par un tiers (une agence, un site qui vend des « packs » d’avis, des particuliers rémunérés), et modifier de vrais avis pour les rendre plus flatteurs.",
      },
      {
        type: "p",
        text: "Une nuance mérite d’être connue : le texte vise les « produits ». Une proposition de loi déposée au Sénat en mars 2025 propose d’y ajouter expressément les services. N’y voyez pas une tolérance pour les restaurants ou les salons de coiffure : la définition générale de l’article L. 121-2 rend trompeuse toute pratique reposant sur des présentations fausses ou de nature à induire en erreur sur les caractéristiques d’un bien ou d’un service, et le gouvernement présente la lutte contre les faux avis comme une priorité de la DGCCRF, sans distinguer les secteurs.",
      },
      { type: "h3", text: "Si vous affichez des avis sur votre propre site" },
      {
        type: "p",
        text: "L’article L. 111-7-2 s’applique à toute personne dont l’activité consiste, « à titre principal ou accessoire », à collecter, modérer ou diffuser des avis en ligne. Elle doit délivrer une information « loyale, claire et transparente » : préciser si les avis sont contrôlés, afficher leur date, indiquer à l’auteur les raisons d’un rejet, et permettre au professionnel concerné de signaler un doute sur l’authenticité d’un avis. Les articles D. 111-9 à D. 111-12 (anciennement D. 111-16 à D. 111-19) détaillent ces mentions, dont l’existence ou non d’une contrepartie et le délai de publication et de conservation. Un manquement est passible d’une amende administrative pouvant atteindre 75 000 € pour une personne physique et 375 000 € pour une personne morale (article L. 131-4).",
      },
      {
        type: "p",
        text: "Enfin, si vous affirmez que vos avis sont « vérifiés », vous devez pouvoir le justifier : c’est l’objet du 27°, et l’article L. 121-3 considère comme substantielle l’information permettant de savoir si et comment le professionnel garantit que les avis émanent de vrais clients.",
      },
      { type: "h2", text: "Les sanctions prévues" },
      {
        type: "p",
        text: "Les pratiques commerciales trompeuses sont des délits. L’article L. 132-2 du Code de la consommation prévoit :",
      },
      {
        type: "ul",
        items: [
          "deux ans d’emprisonnement et 300 000 € d’amende ;",
          "une amende pouvant être portée, « de manière proportionnée aux avantages tirés du délit », à 10 % du chiffre d’affaires moyen annuel (calculé sur les trois derniers chiffres d’affaires annuels connus) ou à 50 % des dépenses engagées pour la pratique en cause ;",
          "cinq ans d’emprisonnement et 750 000 € d’amende lorsque l’infraction a été commise au moyen d’un service de communication au public en ligne ou d’un support numérique ou électronique. Ce durcissement provient de la loi n° 2024-420 du 10 mai 2024, dont l’objet principal est pourtant la lutte contre les dérives sectaires.",
        ],
      },
      {
        type: "p",
        text: "S’y ajoutent des peines complémentaires : interdiction d’exercer l’activité concernée pendant cinq ans au plus (article L. 132-3) et, en cas de condamnation, affichage ou diffusion de la décision ordonnés par le tribunal (article L. 132-4). Pour un commerce de quartier, voir sa condamnation pour faux avis rendue publique peut coûter bien plus cher que l’amende.",
      },
      { type: "h2", text: "Les contrôles de la DGCCRF" },
      {
        type: "p",
        text: "La Direction générale de la concurrence, de la consommation et de la répression des fraudes (DGCCRF) recherche ces pratiques. Dans une réponse publiée au Journal officiel du Sénat le 26 juin 2025, le gouvernement indiquait que plus de 1 200 établissements avaient été contrôlés sur ce sujet depuis le 1er juillet 2023. Il précisait qu’un outil baptisé « Polygraphe », développé par la cellule numérique de la DGCCRF et déployé en septembre 2023, analyse les avis en ligne publiés sur les plateformes pour mettre en évidence les avis suspects et cibler les enquêtes.",
      },
      {
        type: "p",
        text: "Les résultats ne sont pas anecdotiques : dans la [présentation de son bilan 2024](https://presse.economie.gouv.fr/presentation-du-bilan-2024-de-la-dgccrf/), la DGCCRF indique que près d’un tiers des 397 établissements contrôlés en 2024 sur les faux avis en ligne présentaient des anomalies. Une réponse ministérielle antérieure (Journal officiel de l’Assemblée nationale, 1er août 2023) décrivait les pratiques relevées au fil des enquêtes : faux avis rédigés par les professionnels eux-mêmes ou par des sociétés d’e-réputation, consommateurs rémunérés pour publier, suppression ou publication tardive des avis négatifs. Les suites vont de l’avertissement et de l’injonction de mise en conformité jusqu’à l’amende administrative et au procès-verbal pénal.",
      },
      { type: "h2", text: "Ce que fait Google de son côté" },
      {
        type: "p",
        text: "Indépendamment de la loi, le [règlement de Google relatif aux contenus](https://support.google.com/contributionpolicy/answer/7400114?hl=fr) interdit les « avis ou notes qui ont été payés, directement ou en nature » et le contenu publié à partir de plusieurs comptes par une même personne « ou à sa demande ». Concrètement :",
      },
      {
        type: "ul",
        items: [
          "les avis jugés factices ou incités sont supprimés, et Google précise que les avis supprimés pour non-respect des règles ne sont pas restaurés ;",
          "la fiche peut être restreinte : nouveaux avis bloqués pendant une période donnée, avis existants dépubliés, ou avertissement informant les internautes que des avis factices ont été supprimés (voir notre guide sur [la restriction des avis et l’avertissement](/guides/avis-google-restriction-avertissement)) ;",
          "le compte peut faire l’objet de mesures « allant de la suspension des droits du compte à sa clôture ».",
        ],
      },
      {
        type: "p",
        text: "Pour évaluer un contenu ou un compte, Google indique tenir compte du contenu lui-même, des informations sur le compte, des actions des utilisateurs, des signalements reçus et de ses propres examens. Ce n’est donc pas seulement le texte de l’avis qui est regardé.",
      },
      { type: "h2", text: "Pourquoi c’est aussi une mauvaise affaire" },
      {
        type: "p",
        text: "Même en laissant de côté le risque pénal, acheter des avis est un mauvais calcul :",
      },
      {
        type: "ul",
        items: [
          "vous payez pour des avis qui peuvent être supprimés à tout moment, sans retour possible ;",
          "la sanction se voit : un avertissement sur votre fiche dit à chaque visiteur que des avis factices y ont été supprimés, l’effet exactement inverse de celui recherché ;",
          "une note gonflée crée une attente que la réalité ne tient pas, et les vrais clients déçus le disent dans leurs propres avis ;",
          "un faux avis n’apporte aucun détail vécu, alors que ce sont justement les détails concrets (un plat, un délai, un conseil reçu) qui convainquent un futur client ;",
          "vous restez exposé à tout moment : un concurrent peut signaler les avis à Google, et un consommateur peut signaler la pratique à la répression des fraudes via SignalConso.",
        ],
      },
      { type: "h2", text: "Les alternatives légales qui marchent" },
      {
        type: "p",
        text: "Un client satisfait pense rarement à Google une fois sorti de chez vous : c’est l’invitation, au bon moment, qui fait la différence. Tout ce qui suit est autorisé, et rapporte des avis qui restent.",
      },
      {
        type: "ol",
        items: [
          "Demandez à chaque client, avec la même phrase, avant qu’il parte. C’est permis, et c’est le premier conseil de Google.",
          "Supprimez la friction : un support sans contact ou QR code posé sur le comptoir ouvre directement la page d’avis. Le [Présentoir Reviu](/presentoir-avis-google) fonctionne ainsi, pour tous les clients, sans aucun tri.",
          "Relancez par écrit ceux qui sont partis trop vite, avec notre [générateur de messages de demande d’avis](/outils/message-demande-avis-google).",
          "Répondez à tous les avis, surtout aux critiques : une réponse posée inspire plus confiance qu’une note parfaite.",
          "Fixez-vous un objectif réaliste avec le [calculateur de note Google](/outils/calculateur-note-google), qui indique combien de nouveaux avis 5 étoiles il faut pour atteindre la note visée.",
        ],
      },
      {
        type: "p",
        text: "Les règles précises à respecter sont détaillées dans [ce que Google autorise et interdit pour obtenir des avis](/guides/regles-avis-google), et la méthode pour progresser durablement dans [comment augmenter sa note Google](/guides/augmenter-note-google).",
      },
      { type: "h2", text: "Et si vous êtes victime de faux avis ?" },
      {
        type: "p",
        text: "La loi joue aussi en votre faveur. Un faux avis négatif, déposé par une personne qui n’a jamais été cliente ou par un concurrent, enfreint les règles de Google et peut être signalé depuis votre fiche. Notre guide pour [supprimer un faux avis Google](/guides/supprimer-faux-avis-google) explique la marche à suivre et la réponse à publier en attendant.",
      },
      {
        type: "p",
        text: "Ce guide est fourni à titre informatif, sur la base des textes en vigueur à sa date de publication ; il ne remplace pas un conseil juridique adapté à votre situation.",
      },
    ],
    faq: [
      {
        q: "Acheter des avis Google est-il illégal ?",
        a: "Oui. Diffuser ou faire diffuser de faux avis par une autre personne est une pratique commerciale réputée trompeuse au sens de l’article L. 121-4 du Code de la consommation. C’est un délit puni de deux ans d’emprisonnement et 300 000 € d’amende, portés à cinq ans et 750 000 € lorsque l’infraction est commise en ligne.",
      },
      {
        q: "Quelle amende pour de faux avis en ligne ?",
        a: "L’article L. 132-2 du Code de la consommation prévoit 300 000 € d’amende, montant qui peut être porté à 10 % du chiffre d’affaires moyen annuel ou à 50 % des dépenses engagées pour la pratique. Depuis la loi du 10 mai 2024, les peines passent à cinq ans d’emprisonnement et 750 000 € d’amende lorsque l’infraction est commise en ligne.",
      },
      {
        q: "Depuis quand les faux avis sont-ils expressément interdits par la loi ?",
        a: "Les pratiques commerciales trompeuses étaient déjà sanctionnées, mais deux cas visant explicitement les avis ont été ajoutés au Code de la consommation par une ordonnance du 22 décembre 2021, entrée en vigueur le 28 mai 2022. Ils visent le fait d’affirmer sans vérification que des avis viennent de vrais clients, et celui de diffuser ou faire diffuser de faux avis.",
      },
      {
        q: "Que fait Google des avis achetés ?",
        a: "Google interdit les avis payés directement ou en nature et les supprime sans les restaurer. Il peut aussi restreindre la fiche, par exemple en bloquant temporairement les nouveaux avis ou en affichant un avertissement aux internautes, et prendre des mesures pouvant aller jusqu’à la clôture du compte.",
      },
      {
        q: "La DGCCRF contrôle-t-elle vraiment les faux avis ?",
        a: "Oui. Selon une réponse du gouvernement publiée en juin 2025, plus de 1 200 établissements avaient été contrôlés sur ce sujet depuis juillet 2023, avec l’aide d’un outil d’analyse des avis en ligne nommé Polygraphe. Dans son bilan 2024, la DGCCRF indique que près d’un tiers des 397 établissements contrôlés cette année-là présentaient des anomalies.",
      },
      {
        q: "Faire laisser des avis par des proches, est-ce un faux avis ?",
        a: "Si la personne n’a jamais été cliente, son avis ne repose sur aucune expérience réelle, ce que Google considère comme un contenu factice. Même pour un proche réellement client, Google range les liens familiaux parmi les conflits d’intérêts. Mieux vaut s’en abstenir.",
      },
      {
        q: "Afficher des avis clients sur mon site impose-t-il des obligations ?",
        a: "Oui. Toute personne qui collecte, modère ou diffuse des avis en ligne, même à titre accessoire, doit informer clairement sur leur traitement : existence ou non d’un contrôle, date de l’avis, motifs de rejet, existence d’une contrepartie. Un manquement est passible d’une amende administrative.",
      },
    ],
    related: [
      "regles-avis-google",
      "avis-google-restriction-avertissement",
      "supprimer-faux-avis-google",
      "augmenter-note-google",
      "avoir-plus-avis-google",
    ],
  },

  // ── 3. Avis disparus ou non publiés ────────────────────────────────────────
  {
    slug: "avis-google-disparus",
    metaTitle: "Avis Google disparus : pourquoi et que faire · reviu",
    h1: "Avis Google disparus ou non publiés : pourquoi, et que faire",
    description:
      "Un avis Google n’apparaît pas ou a disparu de votre fiche ? Les causes documentées par Google (examen, filtre anti-spam, fusion) et les démarches utiles.",
    excerpt:
      "Un client affirme avoir laissé un avis que vous ne voyez pas, ou votre compteur a baissé ? Voici les causes réelles, côté commerçant comme côté client, et ce qui peut être fait.",
    keywords: [
      "avis google disparu",
      "avis google non publié",
      "avis google supprimé",
      "avis google n’apparaît pas",
      "avis google manquant",
      "avis google en attente",
    ],
    category: "Gérer sa réputation",
    readMinutes: 7,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un avis Google peut être retardé, filtré ou supprimé. Google indique qu’en général, les avis absents ont été retirés parce qu’ils enfreignaient ses règles (spam ou contenu inapproprié), mais d’autres causes existent : un examen qui peut durer quelques jours, une fusion de fiches, une application trop ancienne chez le client ou une désactivation temporaire. Avant d’agir, identifiez votre cas : un avis supprimé pour non-respect des règles n’est pas rétabli, alors qu’une suppression par erreur peut être contestée.",
      },
      { type: "h2", text: "Les causes documentées par Google" },
      {
        type: "p",
        text: "La page d’aide « [À propos des avis manquants ou retardés](https://support.google.com/business/answer/10313341?hl=fr) » et les pages voisines de l’aide Google listent plusieurs explications :",
      },
      {
        type: "ul",
        items: [
          "Un examen en cours : Google vérifie les avis pour s’assurer qu’ils respectent ses règles, et cet examen peut prendre quelques jours dans certains cas.",
          "Une suppression pour non-respect des règles : faux avis, avis obtenu contre une contrepartie, conflit d’intérêts, contenu hors sujet, injurieux ou répétitif. Google précise que ces avis ne seront pas restaurés.",
          "Un lien ou des coordonnées dans l’avis : le règlement interdit aux utilisateurs d’y publier des adresses e-mail, des numéros de téléphone ou des liens vers des réseaux sociaux ou d’autres sites.",
          "Le filtre anti-spam automatique : sur sa [page consacrée au signalement des avis](https://support.google.com/business/answer/4596773?hl=fr), Google reconnaît qu’il peut arriver que le système supprime par erreur des avis légitimes.",
          "Une fusion de fiches récente : l’affichage des avis des deux fiches dans la recherche et sur Maps peut prendre quelques jours.",
          "Une fiche rétablie après suspension : il arrive que des avis soient supprimés à cette occasion.",
          "Un problème technique chez le client : les anciens téléphones ou anciennes versions de l’application peuvent empêcher de publier.",
          "Une désactivation temporaire décidée par Google pour certaines fiches ou catégories d’activité. Les établissements d’enseignement accueillant des élèves de 6 à 18 ans, par exemple, n’acceptent plus d’avis du tout.",
          "Une restriction de la fiche pour engagement artificiel : avis existants dépubliés ou nouveaux avis bloqués pendant une période donnée.",
          "Une cause liée à l’auteur : il a pu supprimer son avis, supprimer son compte Google (il perd alors l’ensemble des contenus du compte), ou voir son compte restreint, auquel cas ses autres contenus peuvent aussi être retirés.",
        ],
      },
      {
        type: "p",
        text: "Google ne publie pas la liste des signaux utilisés par ses filtres. Son règlement cite toutefois les « volumes ou schémas de contributions d’avis inhabituels » comme indice de manipulation : un afflux soudain d’avis après une opération ponctuelle peut donc attirer l’attention. Les explications qui circulent sur le même réseau Wi-Fi ou le même appareil ne figurent pas dans la documentation officielle : prenez-les comme des hypothèses, pas comme des règles établies.",
      },
      { type: "h2", text: "Côté commerçant : diagnostiquer avant d’agir" },
      {
        type: "ol",
        items: [
          "Vérifiez que l’avis a été déposé sur la bonne fiche. Un client peut avoir noté un homonyme, une ancienne fiche ou un autre établissement de la rue. Testez aussi votre propre [lien d’avis Google](/guides/lien-avis-google) : un lien ou un QR code qui pointe vers la mauvaise fiche envoie tous vos avis ailleurs.",
          "Laissez passer quelques jours si l’avis est récent : il peut être en cours d’examen.",
          "Repérez un événement récent sur la fiche : fusion avec une autre fiche, suspension puis rétablissement.",
          "Relisez vos pratiques des derniers mois. Une remise contre un avis, un concours, des avis de salariés ou une campagne auprès de vos proches sont des motifs de suppression. Dans ce cas, aucune démarche ne fera revenir ces avis.",
          "Consultez la messagerie associée à la fiche : Google indique prévenir le propriétaire par e-mail lorsqu’il prévoit d’appliquer une restriction. Si c’est le cas, voyez notre guide sur [l’avertissement et la restriction des avis](/guides/avis-google-restriction-avertissement).",
        ],
      },
      { type: "h2", text: "Côté client : votre avis n’apparaît pas" },
      {
        type: "p",
        text: "Si vous avez laissé un avis qui ne s’affiche pas sur la fiche de l’établissement :",
      },
      {
        type: "ol",
        items: [
          "Vérifiez que vous étiez connecté au bon compte Google au moment de publier.",
          "Dans Google Maps, ouvrez « Vos contributions » puis « Avis » : un avis retiré peut y rester visible avec une mention comme « Non publié », « Privé » ou « Refusé ».",
          "Relisez-le : pas de lien, d’adresse e-mail ni de numéro de téléphone, pas de propos insultants, pas d’informations personnelles sur un tiers, et un contenu fondé sur votre propre visite.",
          "Si vous pensez à une erreur, vous pouvez modifier l’avis puis le republier, ou [faire appel depuis votre profil Maps](https://support.google.com/contributionpolicy/answer/12648169?hl=fr). Google précise qu’on ne peut faire appel d’une suppression qu’une seule fois, et que modifier ou supprimer le contenu pendant l’appel annule la procédure.",
          "Mettez à jour l’application Google Maps si votre téléphone ou votre version sont anciens.",
        ],
      },
      {
        type: "p",
        text: "Évitez en revanche de recopier le même texte dans plusieurs avis : le règlement interdit le contenu répétitif, qu’il vienne d’un seul compte ou de plusieurs.",
      },
      { type: "h2", text: "Les démarches qui peuvent aboutir" },
      {
        type: "ul",
        items: [
          "Contacter l’assistance de la fiche d’établissement si des avis légitimes ont disparu : c’est ce que Google recommande lorsque le filtre anti-spam a supprimé des avis par erreur, ou lorsque des avis ont été perdus au rétablissement d’une fiche.",
          "Inviter le client concerné à vérifier le statut de son avis et, s’il le juge utile, à faire appel : la procédure se lance depuis le profil Maps de l’auteur, pas depuis votre fiche.",
          "Faire appel d’une restriction appliquée à votre fiche par la procédure indiquée par Google, en expliquant ce qui a été corrigé.",
        ],
      },
      {
        type: "p",
        text: "Si votre problème est inverse, c’est-à-dire un avis malveillant que vous voulez voir disparaître, la démarche est différente : voyez notre guide pour [supprimer un faux avis Google](/guides/supprimer-faux-avis-google).",
      },
      { type: "h2", text: "Ce qui aggrave la situation" },
      {
        type: "ul",
        items: [
          "Demander à tous vos clients de republier leur avis le même jour : vous créez précisément le type de pic inhabituel que le règlement associe à la manipulation.",
          "Republier vous-même, ou faire republier par des proches, des avis « pour remplacer » ceux qui ont disparu : ce seraient de faux avis, au sens des règles de Google comme de la loi.",
          "Créer une nouvelle fiche pour repartir de zéro : Google demande de ne pas créer d’autre fiche pour le même établissement pendant l’examen d’un appel.",
          "Multiplier les appels : Google demande de ne pas en envoyer plusieurs pour le même problème avant d’avoir reçu une décision.",
        ],
      },
      { type: "h2", text: "Le meilleur remède : un flux régulier d’avis conformes" },
      {
        type: "p",
        text: "La perte de quelques avis pèse peu quand de nouveaux arrivent chaque semaine. Une collecte régulière, auprès de tous les clients et sans contrepartie, évite les pics brusques et ne donne aucune prise au soupçon. Un présentoir avis Google posé sur le comptoir, comme le [Présentoir Reviu](/presentoir-avis-google) qui ouvre la page d’avis pour chaque client sans contact ou QR code, permet justement cette régularité. Les règles à connaître sont détaillées dans [ce que Google autorise et interdit](/guides/regles-avis-google).",
      },
    ],
    faq: [
      {
        q: "Pourquoi un avis Google n’apparaît-il pas sur ma fiche ?",
        a: "Selon Google, les avis absents ont en général été retirés parce qu’ils enfreignaient ses règles, par exemple pour spam ou contenu inapproprié. Un avis peut aussi être en cours d’examen pendant quelques jours, être retardé par une fusion de fiches, ou ne jamais avoir été publié à cause d’un problème technique chez le client.",
      },
      {
        q: "Un avis Google supprimé peut-il être rétabli ?",
        a: "Un avis supprimé pour non-respect des règles n’est pas restauré. Si la suppression est une erreur, l’auteur peut faire appel une fois depuis son profil Google Maps, et le commerçant peut contacter l’assistance de la fiche d’établissement, notamment après une suppression par le filtre anti-spam.",
      },
      {
        q: "Combien de temps faut-il pour qu’un avis Google soit publié ?",
        a: "Google n’annonce pas de délai fixe, mais indique que l’examen d’un avis peut prendre quelques jours dans certains cas. Au-delà, l’auteur peut vérifier le statut de son avis dans la rubrique Vos contributions de Google Maps.",
      },
      {
        q: "Pourquoi le nombre d’avis de ma fiche a-t-il baissé d’un coup ?",
        a: "Une baisse brutale peut venir d’une vague de suppressions d’avis jugés non conformes, d’une fusion ou d’un rétablissement de fiche, ou d’une restriction qui dépublie temporairement les avis existants. Vérifiez la messagerie associée à la fiche : Google prévient le propriétaire lorsqu’il prévoit d’appliquer une restriction.",
      },
      {
        q: "Faut-il demander aux clients de republier leur avis ?",
        a: "Pas en masse. Faire republier de nombreux avis le même jour crée un pic inhabituel, que le règlement de Google cite comme indice de manipulation. Un client isolé peut en revanche corriger son avis pour le rendre conforme, ou faire appel s’il pense à une erreur.",
      },
      {
        q: "Un lien dans un avis Google peut-il le faire supprimer ?",
        a: "Oui. Le règlement de Google interdit aux utilisateurs de publier dans leurs avis des adresses e-mail, des numéros de téléphone, des liens vers des réseaux sociaux ou vers d’autres sites. Un avis qui en contient peut être refusé ou supprimé.",
      },
    ],
    related: [
      "supprimer-faux-avis-google",
      "regles-avis-google",
      "avis-google-restriction-avertissement",
      "avoir-plus-avis-google",
      "qr-code-avis-google",
    ],
  },

  // ── 4. Réponse à un avis en attente ou refusée ─────────────────────────────
  {
    slug: "reponse-avis-google-en-attente",
    metaTitle: "Réponse à un avis Google en attente ou refusée · reviu",
    h1: "Réponse à un avis Google en attente ou refusée : pourquoi et que faire",
    description:
      "Google examine vos réponses aux avis avant de les publier : en général une dizaine de minutes, parfois jusqu’à 30 jours. Motifs de refus et bonnes pratiques.",
    excerpt:
      "Votre réponse à un avis reste en attente ou n’apparaît pas ? Google modère les réponses des propriétaires. Voici ce qu’il examine et comment écrire des réponses qui passent.",
    keywords: [
      "réponse avis google en attente",
      "réponse avis google refusée",
      "réponse avis google ne s’affiche pas",
      "réponse avis google non approuvée",
      "modération réponse avis google",
      "répondre avis google",
    ],
    category: "Gérer sa réputation",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Si votre réponse à un avis Google n’apparaît pas, la première explication est l’examen : Google vérifie les réponses des propriétaires avant de les publier. Selon son aide, cet examen prend généralement une dizaine de minutes, mais peut parfois durer jusqu’à 30 jours. Si la réponse n’est pas approuvée, Google vous invite à la modifier avant qu’elle puisse être publiée.",
      },
      { type: "h2", text: "Ce que dit Google sur l’examen des réponses" },
      {
        type: "p",
        text: "La page d’aide « [Gérer les avis client](https://support.google.com/business/answer/3474050?hl=fr) » décrit ce qui arrive à une réponse :",
      },
      {
        type: "ul",
        items: [
          "Google l’examine pour s’assurer qu’elle respecte son règlement relatif au contenu. Une réponse non approuvée doit être modifiée avant de pouvoir être publiée.",
          "Une fois approuvée, elle est publiée sous l’avis du client, au nom de l’établissement : votre nom personnel n’apparaît pas.",
          "Le client reçoit une notification. Il peut ensuite modifier son avis ; la date affichée devient alors celle de la dernière modification.",
        ],
      },
      {
        type: "p",
        text: "La documentation technique de l’API Google Business Profile, utilisée par les logiciels de gestion d’avis, confirme ce fonctionnement : chaque réponse y porte un état de modération (en attente, approuvée ou refusée) et, en cas de refus, un motif standardisé, par exemple contenu répétitif, publicitaire, hors sujet, offensant ou contenant des informations personnelles.",
      },
      { type: "h2", text: "Pourquoi une réponse peut être refusée" },
      {
        type: "p",
        text: "Google rappelle que les réponses, comme les avis, doivent respecter ses règles. Celles qui concernent le plus directement une réponse de commerçant :",
      },
      {
        type: "ul",
        items: [
          "Les informations personnelles du client. Google demande de ne jamais partager les informations privées de l’auteur d’un avis négatif. Pas de nom complet, de détail de commande, de date de rendez-vous ni de montant.",
          "Le contenu promotionnel. Le [règlement relatif au contenu](https://support.google.com/contributionpolicy/answer/7400114?hl=fr) interdit aux marchands le « contenu promotionnel ou commercial incluant des promotions limitées dans le temps, des tarifs ou des incitations à l’action directes ». Dans ses [conseils pour rédiger de meilleures réponses](https://support.google.com/business/answer/3474122?hl=fr), Google recommande d’ailleurs un ton amical sans arguments vendeurs : les auteurs d’avis sont déjà vos clients, inutile de leur proposer offres ou promotions.",
          "Les attaques personnelles. Google demande de ne pas attaquer l’auteur d’un avis. Une réponse ironique, accusatrice ou insultante s’expose à un refus, et dessert votre image de toute façon.",
          "Le contenu répétitif. Le règlement interdit de publier le même contenu plusieurs fois. Coller la même réponse sous des dizaines d’avis est donc risqué.",
          "Le hors-sujet. Une réponse qui parle de politique, d’un litige avec un concurrent ou de tout autre chose que l’expérience du client sort du cadre.",
        ],
      },
      {
        type: "p",
        text: "Les coordonnées de l’établissement, elles, sont admises : le règlement autorise les marchands à publier leurs coordonnées professionnelles (téléphone, e-mail, réseaux sociaux), et Google suggère lui-même de proposer à un client mécontent de vous contacter par e-mail ou par téléphone. Restez sobre : un seul moyen de contact, professionnel, sans message commercial autour.",
      },
      { type: "h2", text: "Les autres raisons pour lesquelles une réponse ne s’affiche pas" },
      {
        type: "ul",
        items: [
          "La fiche n’est pas validée : Google exige la validation de l’établissement avant de pouvoir répondre, et indique que le contenu d’une fiche non validée peut ne pas s’afficher.",
          "La fiche ou le compte fait l’objet d’une restriction : la documentation de l’API prévoit des cas où les modifications liées à un compte restreint sont refusées.",
          "L’avis a disparu : une réponse s’affiche sous un avis, et si celui-ci est supprimé, par Google ou par son auteur, la réponse disparaît avec lui. Voyez notre guide sur les [avis Google disparus](/guides/avis-google-disparus).",
          "Un simple décalage d’affichage : vérifiez depuis un autre appareil ou une fenêtre de navigation privée avant de republier quoi que ce soit.",
        ],
      },
      { type: "h2", text: "Écrire des réponses qui passent la modération" },
      {
        type: "ol",
        items: [
          "Personnalisez chaque réponse : reprenez un détail précis de l’avis (le plat, la prestation, le délai) plutôt qu’une formule passe-partout.",
          "Restez bref et poli : Google recommande des réponses claires, utiles et polies, et note que les réponses trop longues peuvent lasser.",
          "Ne citez aucune donnée privée du client, même pour prouver votre bonne foi.",
          "N’ajoutez ni offre, ni prix, ni code promo, ni appel à l’achat.",
          "Signez de votre prénom ou de vos initiales, comme Google le conseille, pour une réponse plus authentique.",
          "Face à une critique, proposez un contact professionnel plutôt que d’argumenter en public.",
        ],
      },
      {
        type: "p",
        text: "Notre [générateur de réponses aux avis Google](/outils/reponse-avis-google) propose des modèles pour les situations courantes : servez-vous-en comme point de départ, puis adaptez chaque réponse à l’avis concerné pour ne jamais publier deux fois le même texte. Pour la posture générale, voyez [répondre aux avis Google](/guides/repondre-avis-google) et, pour les critiques, [répondre à un avis négatif](/guides/repondre-avis-negatif).",
      },
      { type: "h2", text: "Que faire si votre réponse est refusée" },
      {
        type: "ol",
        items: [
          "Relisez-la à la lumière des règles ci-dessus : donnée personnelle, mention commerciale, ton agressif, texte déjà publié ailleurs.",
          "Modifiez-la comme Google vous y invite, en corrigeant le point litigieux plutôt qu’en changeant trois mots.",
          "Laissez le temps à l’examen : il peut durer jusqu’à 30 jours selon Google. Republier la même réponse en boucle n’accélère rien et crée du contenu répétitif.",
          "Si une réponse manifestement conforme reste bloquée, contactez l’assistance de la fiche d’établissement en exposant le contexte : c’est la voie que Google indique pour contester les décisions sur les contenus qui n’ont pas d’outil d’appel dédié.",
        ],
      },
      {
        type: "p",
        text: "Répondre devient aussi plus simple quand les avis arrivent à un rythme régulier plutôt que par vagues : c’est l’un des effets d’un présentoir avis Google posé sur le comptoir, comme le [Présentoir Reviu](/presentoir-avis-google), qui invite chaque client de la même façon.",
      },
    ],
    faq: [
      {
        q: "Combien de temps une réponse à un avis Google reste-t-elle en attente ?",
        a: "Google indique que l’examen d’une réponse prend généralement une dizaine de minutes, mais qu’il peut parfois durer jusqu’à 30 jours. La réponse n’est publiée sous l’avis qu’une fois approuvée.",
      },
      {
        q: "Pourquoi Google a-t-il refusé ma réponse à un avis ?",
        a: "Parce qu’elle ne respecte pas, selon Google, son règlement relatif au contenu. Les informations personnelles sur le client, le contenu promotionnel, les propos offensants, les textes répétitifs ou hors sujet font partie des motifs prévus. Google vous invite alors à modifier la réponse avant de pouvoir la publier.",
      },
      {
        q: "Peut-on indiquer son numéro de téléphone dans une réponse à un avis Google ?",
        a: "Oui. Le règlement autorise les marchands à publier les coordonnées de leur entreprise, et Google suggère d’inviter un client mécontent à vous contacter par e-mail ou par téléphone. Indiquez un seul contact professionnel, sans offre ni message commercial.",
      },
      {
        q: "Peut-on utiliser la même réponse pour plusieurs avis ?",
        a: "C’est déconseillé. Le règlement de Google interdit de publier le même contenu plusieurs fois, et le contenu répétitif figure parmi les motifs de refus des réponses. Partez d’un modèle si besoin, mais personnalisez chaque réponse avec un détail de l’avis.",
      },
      {
        q: "Ma réponse a été publiée puis a disparu, pourquoi ?",
        a: "Vérifiez d’abord que l’avis existe toujours : s’il a été supprimé, par Google ou par son auteur, la réponse disparaît avec lui. Une restriction appliquée à la fiche ou au compte peut aussi expliquer qu’un contenu ne s’affiche plus.",
      },
    ],
    related: [
      "repondre-avis-google",
      "repondre-avis-negatif",
      "avis-google-disparus",
      "regles-avis-google",
      "avis-google-restriction-avertissement",
    ],
  },

  // ── 5. Avertissement et restriction des avis ───────────────────────────────
  {
    slug: "avis-google-restriction-avertissement",
    metaTitle: "Avertissement et restriction des avis Google · reviu",
    h1: "Avertissement sur une fiche Google (avis suspects, restriction des avis) : comprendre et réagir",
    description:
      "Google peut bloquer les nouveaux avis d’une fiche, masquer les avis existants ou afficher un avertissement sur les faux avis. Pourquoi, et comment réagir.",
    excerpt:
      "Plus aucun avis ne peut être publié, ou un avertissement apparaît sur votre fiche ? Voici ce que Google applique en cas d’engagement artificiel, ce que voient vos clients et comment faire appel.",
    keywords: [
      "avertissement fiche google",
      "restriction avis google",
      "avis google bloqués",
      "avertissement faux avis google",
      "fiche google restreinte",
      "avis suspects google",
    ],
    category: "Gérer sa réputation",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Lorsque Google estime qu’une fiche a bénéficié de faux avis ou d’avis obtenus contre un avantage, il supprime ces avis et peut aussi restreindre la fiche : blocage des nouveaux avis pendant une période donnée, dépublication temporaire des avis existants, ou avertissement affiché aux internautes pour signaler que des avis factices ont été supprimés. Le propriétaire est prévenu par e-mail et peut faire appel de la décision.",
      },
      { type: "h2", text: "Les restrictions que Google peut appliquer" },
      {
        type: "p",
        text: "La page d’aide « [Restrictions appliquées aux fiches d’établissement pour non-respect des règles](https://support.google.com/business/answer/14114287?hl=fr) » cite trois exemples, en précisant que la liste n’est pas exhaustive :",
      },
      {
        type: "ul",
        items: [
          "la fiche ne peut plus recevoir de nouvelles notes ni de nouveaux avis pendant une période donnée ;",
          "les notes et avis existants ne sont plus publiés pendant une période donnée ;",
          "la fiche affiche un avertissement pour informer les consommateurs que des avis factices ont été supprimés.",
        ],
      },
      {
        type: "p",
        text: "Ces mesures s’ajoutent à la suppression des avis non conformes. Google précise qu’il envoie un e-mail au propriétaire lorsqu’il prévoit d’appliquer une restriction : surveillez la boîte de réception associée à la fiche, y compris le dossier des courriers indésirables.",
      },
      { type: "h2", text: "Ce que voient vos clients" },
      {
        type: "ul",
        items: [
          "Avec un avertissement, chaque internaute qui consulte la fiche apprend que des avis factices y ont été supprimés. La page d’aide en français ne reproduit pas le texte exact du message.",
          "Avec un blocage des nouveaux avis, vos clients ne peuvent plus noter l’établissement : votre lien ou votre QR code continue d’ouvrir la fiche, mais la publication n’est plus possible pendant la période concernée.",
          "Avec une dépublication, vos avis et votre note cessent d’être affichés pour un temps, même si votre commerce est installé depuis des années.",
        ],
      },
      {
        type: "p",
        text: "Au Royaume-Uni, Google s’est engagé en janvier 2025 auprès de l’autorité de la concurrence britannique (CMA) à appliquer ce type de sanctions aux entreprises qui gonflent leur note avec de faux avis : alerte placée là où s’affiche la note, fonction d’avis désactivée et, pour les récidivistes, suppression de tous les avis pendant six mois ou plus. La page d’aide en français décrit le même type de mesures, sans durée chiffrée.",
      },
      { type: "h2", text: "Pourquoi Google applique ces mesures" },
      {
        type: "p",
        text: "Ces restrictions visent les établissements qui enfreignent le règlement de Google sur l’engagement artificiel. Sont notamment en cause :",
      },
      {
        type: "ul",
        items: [
          "les avis ou notes payés, directement ou en nature, y compris achetés auprès d’un prestataire ;",
          "les avis obtenus contre une remise, un cadeau, un produit gratuit ou toute autre contrepartie ;",
          "les avis en conflit d’intérêts : salariés, anciens salariés, famille, concurrents ;",
          "les volumes ou schémas d’avis inhabituels, qui témoignent selon Google d’une tentative de manipulation de la note.",
        ],
      },
      {
        type: "p",
        text: "Si vous avez confié votre fiche à une agence ou acheté un « pack visibilité », demandez précisément ce qui a été fait : la restriction s’applique à votre fiche, quelle que soit l’origine des avis. Le détail des règles figure dans [ce que Google autorise et interdit pour obtenir des avis](/guides/regles-avis-google), et le volet légal dans [faux avis et avis achetés : ce que dit la loi](/guides/faux-avis-google-loi).",
      },
      { type: "h2", text: "Combien de temps dure une restriction" },
      {
        type: "p",
        text: "Google ne donne pas de durée dans sa page d’aide en français : il parle d’une « période donnée ». La seule durée chiffrée publiée par une autorité concerne le Royaume-Uni, avec six mois ou plus de suppression des avis pour les récidivistes. Le levier dont vous disposez est l’appel, accompagné de la preuve que les pratiques en cause ont cessé.",
      },
      { type: "h2", text: "Que faire si votre fiche est concernée" },
      {
        type: "ol",
        items: [
          "Lisez l’e-mail de Google et identifiez la ou les restrictions appliquées.",
          "Faites un état des lieux honnête des derniers mois : remises ou cadeaux liés aux avis, concours, avis de salariés ou de proches, achat d’avis, campagne qui a fait arriver beaucoup d’avis en peu de temps.",
          "Arrêtez immédiatement toute pratique non conforme et retirez les supports qui la mentionnent (affiche « un café offert contre un avis », message automatique qui filtre les clients selon leur satisfaction…).",
          "Faites appel depuis le lien proposé sur la page d’aide consacrée aux restrictions. Google réexamine alors la fiche et le contexte que vous fournissez, puis vous communique l’état de son examen. Expliquez factuellement ce qui s’est passé et ce que vous avez corrigé.",
          "N’envoyez pas plusieurs appels pour le même problème et ne créez pas de nouvelle fiche pour contourner la restriction : la [page d’aide sur les appels](https://support.google.com/business/answer/13597551?hl=fr) le déconseille expressément pendant l’examen d’un appel.",
          "Continuez à soigner l’accueil et à répondre aux avis visibles : une fois la restriction levée, ce sont vos vrais clients qui permettront de [faire remonter votre note](/guides/augmenter-note-google).",
        ],
      },
      { type: "h2", text: "Éviter d’en arriver là" },
      {
        type: "p",
        text: "Ces restrictions visent l’engagement artificiel. Une collecte honnête vous en tient éloigné :",
      },
      {
        type: "ul",
        items: [
          "invitez tous vos clients de la même façon, sans tri préalable ;",
          "ne liez jamais un avantage, même symbolique, au dépôt d’un avis ;",
          "n’achetez pas d’avis et refusez les offres pour « booster » votre note, quelle que soit leur présentation ;",
          "préférez un flux régulier à une opération ponctuelle qui fait arriver des dizaines d’avis en quelques jours.",
        ],
      },
      {
        type: "p",
        text: "Un présentoir avis Google sur le comptoir, comme le [Présentoir Reviu](/presentoir-avis-google) qui ouvre la page d’avis pour chaque client sans contact ou QR code, s’inscrit dans cette logique : la même invitation pour tous, tous les jours. Et si votre fiche subit au contraire des avis malveillants, la démarche est celle décrite dans [supprimer un faux avis Google](/guides/supprimer-faux-avis-google).",
      },
    ],
    faq: [
      {
        q: "Que signifie l’avertissement affiché sur une fiche Google ?",
        a: "Il informe les internautes que Google a supprimé des avis factices sur cette fiche. Google peut l’appliquer lorsqu’il estime que l’établissement a enfreint son règlement sur l’engagement artificiel, par exemple avec des avis achetés ou obtenus contre un avantage.",
      },
      {
        q: "Pourquoi ma fiche Google ne peut-elle plus recevoir d’avis ?",
        a: "Google peut empêcher une fiche de recevoir de nouvelles notes et de nouveaux avis pendant une période donnée lorsqu’il constate des avis factices ou incités. D’autres causes existent : certaines catégories d’établissements, comme les écoles accueillant des élèves de 6 à 18 ans, n’acceptent pas d’avis.",
      },
      {
        q: "Combien de temps dure une restriction des avis Google ?",
        a: "Google parle d’une période donnée sans publier de durée dans son aide en français. Au Royaume-Uni, les engagements pris auprès de l’autorité de la concurrence prévoient la suppression de tous les avis pendant six mois ou plus pour les entreprises récidivistes.",
      },
      {
        q: "Peut-on faire appel d’une restriction sur sa fiche Google ?",
        a: "Oui. Google permet de faire appel de sa décision : il réexamine la fiche et le contexte fourni par l’établissement, puis communique le résultat. Expliquez ce qui a été corrigé et évitez d’envoyer plusieurs appels pour le même problème.",
      },
      {
        q: "Comment éviter une restriction des avis Google ?",
        a: "En invitant tous les clients de la même façon, sans contrepartie ni tri des clients satisfaits, sans avis de salariés ou de proches et sans achat d’avis. Une collecte régulière évite aussi les pics d’avis inhabituels que Google associe aux tentatives de manipulation.",
      },
    ],
    related: [
      "regles-avis-google",
      "faux-avis-google-loi",
      "avis-google-disparus",
      "augmenter-note-google",
      "supprimer-faux-avis-google",
    ],
  },
];
