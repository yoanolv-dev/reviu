import type { Guide } from "@/lib/guides";

/**
 * Guides « Par métier » ajoutés en octobre 2026 : auto-école, opticien,
 * agence immobilière, artisan, bar, fleuriste, camping, chambre d’hôtes,
 * food truck, barbier. Chaque guide part des contraintes réelles du métier
 * (moment de la demande, support, phrases, critiques typiques) et reste
 * conforme aux règles de Google : tous les clients sont invités, sans
 * contrepartie ni tri selon la note.
 */
export const TRADE_GUIDES_2: Guide[] = [
  // ── Auto-école ─────────────────────────────────────────────────────────────
  {
    slug: "avis-google-auto-ecole",
    metaTitle: "Avis Google pour une auto-école : la méthode complète · reviu",
    h1: "Obtenir plus d’avis Google pour une auto-école",
    description:
      "Auto-école : quand demander un avis Google (code, permis), quoi dire aux élèves et aux parents, et comment répondre aux critiques sur les délais d’examen.",
    excerpt:
      "Avant de s’inscrire, élèves et parents comparent les auto-écoles sur Google. Voici comment transformer la réussite au code ou au permis en avis, sans pression.",
    keywords: [
      "avis google auto-école",
      "avis auto-école",
      "avis google école de conduite",
      "demander un avis élève permis",
      "répondre avis auto-école",
      "qr code avis auto-école",
    ],
    category: "Par métier",
    readMinutes: 7,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google, une auto-école doit proposer l’avis à chaque élève quand une étape est franchie : le retour à l’agence après le code, puis l’annonce du permis. La demande tient en une phrase, la même pour tous, appuyée par un support à l’accueil et par un message de félicitations qui contient le lien direct vers votre page d’avis.",
      },
      {
        type: "p",
        text: "Le choix d’une auto-école se fait rarement au hasard : élèves et parents comparent les écoles du quartier et lisent ce que disent les anciens élèves avant d’appeler celle qui inspire confiance.",
      },
      { type: "h2", text: "Ce que les élèves et les parents regardent dans les avis" },
      {
        type: "p",
        text: "Les avis d’auto-école tournent autour de quelques sujets, toujours les mêmes :",
      },
      {
        type: "ul",
        items: [
          "La pédagogie et la patience des enseignants, en particulier avec les élèves stressés ou ceux qui reprennent après un échec.",
          "La facilité à obtenir des heures de conduite : planning, annulations, réservation en ligne.",
          "Le délai avant de passer l’examen pratique, sujet particulièrement sensible.",
          "La transparence du prix : forfait, heures supplémentaires, frais d’accompagnement à l’examen.",
          "L’accueil et le suivi administratif : inscription, livret d’apprentissage numérique, réponses aux questions.",
        ],
      },
      { type: "h2", text: "Les trois moments où proposer l’avis" },
      {
        type: "p",
        text: "Une auto-école suit un élève pendant des mois, mais au milieu de la formation, il n’a pas encore de recul. Trois instants se prêtent à la demande :",
      },
      {
        type: "ol",
        items: [
          "La réussite au code. L’élève repasse à l’agence pour organiser la suite, soulagé : il peut déjà parler de l’accueil et de la préparation théorique.",
          "L’annonce du permis. L’inspecteur ne communique pas le résultat oralement : l’élève le consulte en ligne dès le lendemain de l’examen, comme le précise [la fiche permis B de service-public.fr](https://www.service-public.fr/particuliers/vosdroits/F2828). C’est le moment le plus fort : l’élève vous appelle ou passe annoncer la nouvelle.",
          "La fin d’une formation sans examen immédiat (conduite accompagnée, passage de la boîte automatique à la boîte manuelle) : à la dernière leçon, quand l’enseignant fait le bilan.",
        ],
      },
      {
        type: "callout",
        title: "Et l’élève qui a échoué ?",
        text: "Il reçoit la même invitation que les autres, à la fin de sa formation ou s’il quitte l’école. On ne le sollicite pas le jour de la mauvaise nouvelle, mais on ne l’écarte pas : réserver la demande aux élèves reçus serait un tri selon la satisfaction, ce que Google interdit.",
      },
      { type: "h2", text: "Où placer le support : accueil, salle de code, pas dans la voiture" },
      {
        type: "ul",
        items: [
          "Sur le bureau d’accueil, là où l’élève réserve ses leçons et règle ses heures : c’est le point de passage obligé.",
          "Près de la sortie de la salle de code : un rappel discret pour ceux qui viennent de valider l’épreuve théorique.",
          "Jamais dans la voiture : en tête à tête avec le moniteur, la demande peut être ressentie comme une pression, ce que les règles de Google proscrivent.",
          "Dans le message de félicitations envoyé après le permis : le lien direct vers votre page d’avis, à ouvrir en un geste.",
        ],
      },
      {
        type: "p",
        text: "Pour préparer ce message, commencez par [récupérer votre lien d’avis Google](/guides/lien-avis-google), puis adaptez une formulation avec notre [générateur de messages de demande d’avis](/outils/message-demande-avis-google), qui produit un SMS, un WhatsApp ou un e-mail prêt à envoyer.",
      },
      { type: "h2", text: "Quoi dire à un élève et à ses parents" },
      {
        type: "p",
        text: "Un jeune conducteur répond mieux à une phrase courte ; un parent apprécie qu’on lui demande son regard sur le suivi :",
      },
      {
        type: "ul",
        items: [
          "À l’annonce du permis : « Félicitations, vous l’avez bien mérité ! Si vous avez deux minutes, racontez votre formation sur Google : ça aide les futurs élèves à choisir. »",
          "Au retour après le code : « Première étape validée. Votre avis sur la préparation au code nous intéresse, le support est juste là si vous voulez le laisser. »",
          "À un parent qui a suivi le dossier : « Vous avez accompagné toute l’inscription. Votre avis sur notre suivi est précieux pour les familles qui hésitent. »",
          "Par message, le lendemain de l’examen : « Bravo pour le permis ! Si vous souhaitez partager votre expérience, voici le lien vers notre page d’avis Google. Bonne route ! »",
        ],
      },
      {
        type: "p",
        text: "Deux phrases sont à bannir : « mettez-nous cinq étoiles » et « pensez à citer votre moniteur ». Les [règles des avis Google](/guides/regles-avis-google) interdisent de demander un contenu précis dans un avis, y compris un élément qui identifie un membre de l’équipe. L’élève reste libre de nommer son enseignant s’il en a envie.",
      },
      { type: "h2", text: "Élèves mineurs et conduite accompagnée : les cas particuliers" },
      {
        type: "p",
        text: "Service-public.fr rappelle que l’apprentissage anticipé de la conduite est possible dès 15 ans : une partie de vos élèves est donc mineure. Pour eux, adressez plutôt l’invitation au parent qui a suivi l’inscription : il a vécu les démarches et les échanges avec l’école, et son avis porte sur sa propre expérience. Il n’écrit pas pour autant « à la place » de son enfant, et l’on ne pousse jamais un adolescent à publier sur place.",
      },
      {
        type: "p",
        text: "Autre cas : l’élève qui change d’école en cours de formation après un désaccord (transfert de dossier, heures non consommées). Ne réglez pas le différend dans une réponse publique : proposez un échange direct.",
      },
      { type: "h2", text: "Répondre aux critiques sur les délais d’examen" },
      {
        type: "p",
        text: "C’est une critique récurrente du secteur : « des semaines pour obtenir une date ». Plutôt que de rejeter la faute sur l’administration, expliquez sans vous défausser : les places d’examen pratique sont réservées par l’école sur la plateforme nationale RdvPermis, en fonction des créneaux disponibles, et la date dépend aussi du niveau de l’élève. Reconnaissez l’attente, expliquez en une phrase, proposez un contact.",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Léa, merci d’avoir pris le temps d’écrire. Nous comprenons que l’attente avant l’examen ait été frustrante. Les places sont réservées sur la plateforme nationale selon les créneaux disponibles, et nous les attribuons en fonction du niveau de chaque élève. Nous serions heureux d’en parler avec vous à l’agence ou par téléphone pour faire le point. »",
      },
      {
        type: "p",
        text: "Pour les autres critiques (moniteur jugé brusque, leçons annulées, forfait dépassé), une règle : ne jamais commenter publiquement le niveau de conduite de l’élève (« il lui fallait plus d’heures »). Notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille la méthode.",
      },
      { type: "h2", text: "Les erreurs qui coûtent cher à une auto-école" },
      {
        type: "ul",
        items: [
          "Organiser un challenge entre moniteurs : Google interdit de fixer au personnel un nombre d’avis à solliciter.",
          "Offrir une heure de conduite ou une remise sur le forfait en échange d’un avis : c’est une contrepartie, et les avis obtenus ainsi peuvent être supprimés.",
          "Demander l’avis dans la voiture, juste après un examen blanc : l’élève n’est pas en position de refuser.",
          "Faire écrire des avis par des proches ou d’anciens salariés : conflit d’intérêts.",
          "Ne solliciter que les élèves reçus du premier coup : c’est du tri.",
        ],
      },
      { type: "h2", text: "Ce qui rend l’auto-école différente des autres commerces" },
      {
        type: "p",
        text: "Une auto-école vend un parcours, pas un achat : la satisfaction se construit sur des mois et dépend d’un résultat que vous ne maîtrisez qu’en partie. La demande se lie donc à une étape franchie, pas à une facture. Et chaque élève, permis en poche, quitte définitivement l’école : pas de seconde occasion comme chez un commerçant de quartier.",
      },
      {
        type: "p",
        text: "Un [présentoir avis Google](/presentoir-avis-google) posé sur le bureau d’accueil, comme le Présentoir Reviu, permet à l’élève d’ouvrir votre page d’avis sans contact ou par QR code. Couplé au message de félicitations, il couvre l’élève qui passe à l’agence comme celui qui ne revient pas.",
      },
    ],
    faq: [
      {
        q: "Quand demander un avis Google à un élève d’auto-école ?",
        a: "Quand une étape est franchie : au retour à l’agence après la réussite au code, puis à l’annonce du permis, dont le résultat se consulte en ligne dès le lendemain de l’examen. Les élèves qui ont échoué reçoivent la même invitation à la fin de leur formation.",
      },
      {
        q: "Peut-on offrir une heure de conduite contre un avis Google ?",
        a: "Non. Google interdit toute contrepartie en échange d’un avis, qu’il s’agisse d’une remise, d’une prestation gratuite ou d’un cadeau, et les avis obtenus ainsi peuvent être supprimés.",
      },
      {
        q: "Un parent peut-il laisser un avis sur l’auto-école de son enfant ?",
        a: "Oui, s’il décrit sa propre expérience : l’inscription, le suivi, les échanges avec l’école. Il ne doit pas écrire au nom de l’élève. Pour un élève mineur, c’est souvent la personne la plus indiquée à inviter.",
      },
      {
        q: "Comment répondre à un avis qui se plaint du délai d’examen ?",
        a: "Reconnaissez l’attente, expliquez en une phrase que les places d’examen pratique sont réservées sur la plateforme nationale RdvPermis selon les créneaux disponibles, puis proposez un échange direct. Ne rejetez la faute ni sur l’administration ni sur l’élève.",
      },
      {
        q: "Peut-on demander aux élèves de citer leur moniteur dans l’avis ?",
        a: "Non. Les règles de Google interdisent de demander un contenu précis dans un avis, y compris le nom d’un membre de l’équipe. L’élève reste libre de le citer spontanément.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-negatif",
      "qr-code-avis-google",
      "avis-google-garage",
    ],
  },

  // ── Opticien ───────────────────────────────────────────────────────────────
  {
    slug: "avis-google-opticien",
    metaTitle: "Avis Google pour un opticien : la méthode au comptoir · reviu",
    h1: "Obtenir plus d’avis Google pour un magasin d’optique",
    description:
      "Opticien : proposer l’avis Google au retrait des lunettes, après l’ajustage, et répondre aux critiques sans jamais évoquer d’information de santé.",
    excerpt:
      "Chez l’opticien, le client juge le conseil, le délai et le confort de ses lunettes. Voici comment demander un avis au retrait, et répondre sans indiscrétion.",
    keywords: [
      "avis google opticien",
      "avis opticien",
      "avis clients magasin d’optique",
      "qr code avis opticien",
      "répondre avis opticien",
      "demander un avis opticien",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Le meilleur moment pour demander un avis Google chez un opticien est le retrait des lunettes, juste après l’ajustage, quand le client se regarde dans le miroir et constate qu’il voit net. Proposez-le à chaque client, en une phrase, avec un support posé sur la table d’ajustage. Et dans vos réponses publiques, ne mentionnez jamais rien qui touche à la vue ou à la santé du client.",
      },
      { type: "h2", text: "Ce sur quoi les clients jugent un opticien" },
      {
        type: "p",
        text: "Un magasin d’optique est jugé sur un parcours en deux temps : le choix (essayage, conseil, devis) puis la livraison (délai, ajustage, confort). Les avis parlent surtout de :",
      },
      {
        type: "ul",
        items: [
          "La qualité du conseil sur la monture : honnêteté, patience, capacité à dire qu’un modèle ne met pas le visage en valeur.",
          "La clarté du devis et du reste à charge, et l’aide apportée dans les démarches de tiers payant.",
          "Le délai entre la commande et la mise à disposition des lunettes, et le respect de la date annoncée.",
          "Le confort une fois les lunettes portées, et la disponibilité pour un réglage.",
          "Le service après-vente : vis resserrée, plaquettes changées, monture réparée.",
        ],
      },
      { type: "h2", text: "Le retrait des lunettes, moment à ne pas manquer" },
      {
        type: "p",
        text: "Le jour du retrait concentre tout ce qui fait la satisfaction : le client essaie ses lunettes, vous les ajustez sur son visage, il lit une ligne ou regarde au loin et constate la différence. C’est ce moment, après l’ajustage et avant le départ, qui se prête à la demande. Pas celui de la commande : le client n’a encore rien reçu, et son avis porterait sur une promesse.",
      },
      {
        type: "callout",
        title: "Quand l’équipement demande un temps d’adaptation",
        text: "Certains verres nécessitent quelques jours avant d’être parfaitement confortables. Pour ces équipements, proposez l’avis lors du rendez-vous de réglage qui suit, ou envoyez le lien par message une fois ce délai passé. L’essentiel est d’appliquer la même règle à tous les clients concernés, sans choisir selon l’humeur de chacun.",
      },
      { type: "h2", text: "Où placer le support dans le magasin" },
      {
        type: "ul",
        items: [
          "Sur la table d’ajustage ou le comptoir de retrait : c’est là que le client récupère ses lunettes, et souvent là qu’il règle le reste à charge.",
          "Près de la caisse, à côté des produits d’entretien : un passage fréquent, y compris pour les petits réglages offerts.",
          "Pas dans l’espace de prise de mesures : il est réservé à la prestation, et une sollicitation y serait déplacée.",
          "Sur une carte glissée dans l’étui remis avec les lunettes : utile pour les clients qui préfèrent écrire chez eux.",
        ],
      },
      {
        type: "p",
        text: "Pour imprimer cette carte, notre [générateur de QR code d’avis Google](/outils/qr-code-avis-google) crée gratuitement le code et une affiche prête à l’emploi.",
      },
      { type: "h2", text: "Les phrases à dire au comptoir" },
      {
        type: "p",
        text: "L’opticien a un avantage : le client vient souvent de le remercier pour le confort retrouvé. Il suffit d’enchaîner, sans insister :",
      },
      {
        type: "ul",
        items: [
          "« Vous voyez bien de loin ? Parfait. Si le conseil vous a plu, un avis Google aide beaucoup les gens du quartier qui cherchent un opticien. »",
          "« Nous avons pris le temps de trouver la bonne monture ensemble : si vous voulez le raconter, c’est ici, d’un geste avec votre téléphone. »",
          "Après un réglage offert : « Revenez quand vous voulez pour un ajustement. Et si vous avez une minute un jour, votre avis sur Google nous ferait plaisir. »",
        ],
      },
      {
        type: "p",
        text: "La phrase s’adresse à chaque client qui récupère un équipement, pas seulement à ceux qui sourient. Et l’on n’offre ni étui, ni spray nettoyant en échange : même un petit cadeau est une contrepartie au sens des règles de Google.",
      },
      { type: "h2", text: "Tiers payant, mutuelle, santé : la discrétion dans les réponses" },
      {
        type: "p",
        text: "C’est la spécificité du métier. Vos clients vous confient une ordonnance, des informations sur leur complémentaire santé, parfois leur situation de prise en charge. Rien de cela ne doit apparaître dans une réponse publique, même si le client en parle lui-même dans son avis. Selon la [définition de la CNIL](https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante), une donnée de santé inclut aussi ce qui permet d’en déduire un état de santé : évoquer la correction d’un client ou le type de ses verres revient à exposer une information sensible.",
      },
      {
        type: "ul",
        items: [
          "À éviter : « vos verres progressifs demandaient une adaptation », « votre ordonnance n’était plus valable », « votre mutuelle n’a pas validé le devis ».",
          "À privilégier : « nous comprenons votre déception et voulons trouver une solution avec vous », « passez nous voir, nous referons le point sur votre équipement ».",
        ],
      },
      {
        type: "p",
        text: "Les règles de Google interdisent d’ailleurs de publier sans son autorisation des informations médicales ou financières concernant une personne. La règle pratique est simple : tout ce qui relève du dossier du client se traite en magasin ou par téléphone.",
      },
      { type: "h2", text: "Répondre aux critiques typiques d’un magasin d’optique" },
      {
        type: "p",
        text: "Trois reproches reviennent souvent : un délai de livraison dépassé, un reste à charge plus élevé que prévu, des lunettes jugées inconfortables. Dans chaque cas, la réponse reconnaît le désagrément, reste générale sur le fond et propose un rendez-vous.",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour, merci pour votre retour. Nous sommes désolés que la mise à disposition de votre équipement ait pris plus de temps qu’annoncé, et que cela vous ait compliqué la vie. Nous aimerions en parler directement avec vous : appelez-nous ou passez au magasin, nous ferons le point ensemble. L’équipe »",
      },
      {
        type: "p",
        text: "Remarquez ce qui manque volontairement : aucun détail sur les verres, aucune mention de la mutuelle. Pour d’autres situations, notre [générateur de réponses aux avis](/outils/reponse-avis-google) propose des modèles à adapter.",
      },
      { type: "h2", text: "Erreurs fréquentes en magasin d’optique" },
      {
        type: "ul",
        items: [
          "Demander l’avis à la commande, avant que le client ait porté ses lunettes.",
          "Glisser dans l’étui une carte « laissez-nous cinq étoiles » : on n’oriente jamais la note.",
          "Oublier les clients venus pour une réparation ou un réglage : eux aussi ont vécu une expérience, et elle dit beaucoup de votre service après-vente.",
          "Laisser sans réponse un avis sur le service après-vente, alors que c’est précisément ce qui inquiète un futur client.",
          "Promettre un geste commercial pour qu’un client modifie son avis : Google interdit d’offrir un avantage en échange de la modification ou de la suppression d’un avis négatif.",
        ],
      },
      { type: "h2", text: "Ce qui distingue l’opticien des autres commerces" },
      {
        type: "p",
        text: "L’opticien combine commerce et prestation technique : il vend un objet, mais la satisfaction dépend d’un réglage et d’un délai. Le client revient aussi plusieurs fois (commande, retrait, ajustements), ce qui multiplie les occasions de voir un support sans qu’il faille redemander. Enfin, la confiance prime : un avis qui raconte un conseil honnête rassure là où une publicité ne le peut pas. Pour la méthode générale, voyez notre guide pour [obtenir plus d’avis Google](/guides/avoir-plus-avis-google).",
      },
      {
        type: "p",
        text: "Un [présentoir avis Google](/presentoir-avis-google) sur la table d’ajustage, comme le Présentoir Reviu, ouvre votre page d’avis sans contact ou par QR code : le client n’a pas à chercher votre magasin sur Google, ses lunettes neuves sur le nez.",
      },
    ],
    faq: [
      {
        q: "Quand demander un avis Google chez un opticien ?",
        a: "Au retrait des lunettes, juste après l’ajustage, quand le client constate le résultat. Pour les verres qui demandent quelques jours d’adaptation, on propose l’avis au réglage suivant ou par message une fois ce délai passé, selon la même règle pour tous.",
      },
      {
        q: "Un opticien peut-il parler de l’ordonnance ou des verres d’un client dans une réponse ?",
        a: "Non. La correction, le type de verres, l’ordonnance ou la prise en charge par la complémentaire santé sont des informations sensibles qui n’ont pas leur place dans une réponse publique. On reste général et on propose d’en parler en magasin ou par téléphone.",
      },
      {
        q: "Peut-on offrir un étui ou un produit d’entretien contre un avis ?",
        a: "Non. Même un petit cadeau constitue une contrepartie, interdite par les règles de Google, et les avis obtenus ainsi peuvent être supprimés. On invite tous les clients sans rien offrir en échange.",
      },
      {
        q: "Comment répondre à un client mécontent du délai de livraison de ses lunettes ?",
        a: "Reconnaissez le retard sans vous justifier longuement, présentez des excuses sincères et proposez un échange en magasin ou par téléphone. N’entrez pas dans le détail de l’équipement commandé.",
      },
    ],
    related: [
      "avis-google-boutique",
      "repondre-avis-negatif",
      "qr-code-avis-google",
      "avoir-plus-avis-google",
    ],
  },

  // ── Agence immobilière ─────────────────────────────────────────────────────
  {
    slug: "avis-google-agence-immobiliere",
    metaTitle: "Avis Google pour une agence immobilière : la méthode · reviu",
    h1: "Obtenir plus d’avis Google pour une agence immobilière",
    description:
      "Agence immobilière : demander un avis Google aux vendeurs, acquéreurs, locataires et bailleurs au bon moment, et répondre sans exposer leurs données.",
    excerpt:
      "Un vendeur compare les agences avant de signer un mandat, et les avis pèsent dans son choix. Voici comment les obtenir auprès de chacun de vos publics.",
    keywords: [
      "avis google agence immobilière",
      "avis agence immobilière",
      "avis google agent immobilier",
      "demander un avis client immobilier",
      "répondre avis agence immobilière",
      "avis vendeur acquéreur locataire",
    ],
    category: "Par métier",
    readMinutes: 7,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Une agence immobilière obtient plus d’avis Google en sollicitant chaque client au terme de son projet : à la remise des clés pour un acquéreur ou un locataire, après la signature de l’acte pour un vendeur, à la signature du bail pour un bailleur. Comme ces moments se passent souvent hors de l’agence, la demande combine un support au bureau et un message contenant votre lien d’avis, envoyé à tous les clients sans distinction.",
      },
      {
        type: "p",
        text: "L’enjeu dépasse la simple image. Avant de confier la vente de son bien, un propriétaire compare plusieurs agences du secteur, et la fiche Google fait partie de ce qu’il consulte. Des avis récents de vendeurs satisfaits sont un argument que vous n’avez pas besoin de formuler vous-même lors du rendez-vous d’estimation.",
      },
      { type: "h2", text: "Quatre publics, quatre attentes" },
      {
        type: "p",
        text: "Une agence ne sert pas un client type. Chaque public juge sur ses propres critères, et les connaître aide à choisir le moment de la demande comme le ton des réponses :",
      },
      {
        type: "ul",
        items: [
          "Les vendeurs : la justesse de l’estimation, la qualité des visites, la régularité des comptes rendus, le sérieux jusqu’à l’acte.",
          "Les acquéreurs : la réactivité, l’honnêteté sur les défauts du bien, l’accompagnement jusqu’au financement et à la signature.",
          "Les locataires : la clarté des conditions, l’accueil lors des visites, la rapidité de réponse au dossier, le déroulement de l’état des lieux.",
          "Les bailleurs en gestion : la sélection des locataires, la régularité des versements, la réactivité en cas de travaux ou d’impayé.",
        ],
      },
      { type: "h2", text: "Le bon moment pour chaque type de client" },
      {
        type: "ol",
        items: [
          "Acquéreur : à la remise des clés, souvent le jour de l’acte authentique. C’est l’aboutissement d’une longue recherche ; le client est disponible et reconnaissant.",
          "Vendeur : après la signature définitive, quand la pression retombe. Évitez la période entre le compromis et l’acte : tant que la vente n’est pas conclue, le client n’a pas vécu toute l’expérience.",
          "Locataire : après l’état des lieux d’entrée et la remise des clés, une fois installé.",
          "Bailleur : à la signature du bail avec le locataire trouvé par l’agence, quand la mise en location est effective.",
        ],
      },
      {
        type: "p",
        text: "Un même client cumule parfois deux rôles, par exemple un vendeur qui rachète par votre intermédiaire. Une seule invitation suffit, à la fin du dernier projet.",
      },
      { type: "h2", text: "Bureau, vitrine, rendez-vous extérieurs : où placer le support" },
      {
        type: "p",
        text: "Contrairement à un commerce, l’agence ne voit pas tous ses clients à un comptoir. Une partie des rendez-vous se déroule chez le notaire, dans le bien ou à distance. Il faut donc combiner plusieurs canaux :",
      },
      {
        type: "ul",
        items: [
          "Au bureau d’accueil et sur la table de signature : pour les clients qui viennent signer un mandat, un bail ou récupérer des clés.",
          "Pas en vitrine pour les passants : un avis doit refléter une expérience réelle avec l’agence, et la personne qui regarde les annonces n’en a pas encore.",
          "Par message après la remise des clés : SMS ou e-mail avec le lien direct. Notre [générateur de messages de demande d’avis](/outils/message-demande-avis-google) propose des formulations à adapter.",
          "Dans le dossier remis avec les clés : une carte avec QR code, que le client scannera une fois installé.",
        ],
      },
      {
        type: "p",
        text: "Si vous avez plusieurs agences, chaque support et chaque message doit pointer vers la fiche de l’agence concernée, et non vers une fiche commune.",
      },
      { type: "h2", text: "Phrases à utiliser selon la situation" },
      {
        type: "ul",
        items: [
          "À un acquéreur, clés en main : « Bienvenue chez vous ! Si notre accompagnement vous a aidé, quelques mots sur Google aideront d’autres familles à se lancer. »",
          "À un vendeur, après l’acte : « Merci de nous avoir confié votre bien. Les propriétaires qui hésitent à vendre lisent les avis : le vôtre leur serait précieux. »",
          "À un bailleur : « Votre logement est loué. Votre retour sur notre gestion intéressera les propriétaires qui cherchent une agence, si vous souhaitez le partager. »",
        ],
      },
      {
        type: "p",
        text: "Ne demandez pas de citer le négociateur par son nom : les [règles des avis Google](/guides/regles-avis-google) interdisent de solliciter des avis au contenu imposé, y compris le nom d’un collaborateur. Et aucun geste sur les honoraires en échange d’un avis : ce serait une contrepartie interdite.",
      },
      { type: "h2", text: "Les situations délicates propres à l’immobilier" },
      {
        type: "p",
        text: "Certaines expériences se terminent mal sans que l’agence ait failli : un dossier locatif non retenu, une vente annulée faute de financement, une offre écartée. Ces personnes peuvent laisser un avis, c’est leur droit. Votre rôle est de répondre avec tact, sans jamais révéler d’élément de leur dossier :",
      },
      {
        type: "ul",
        items: [
          "Candidat locataire non retenu : ne mentionnez ni revenus, ni garant, ni pièces manquantes. Rappelez que le choix final revient au propriétaire et que les mêmes critères s’appliquent à tous les candidats.",
          "Vendeur déçu du prix obtenu : ne publiez ni l’estimation, ni le prix de vente, ni les offres reçues.",
          "Acquéreur dont l’achat a échoué : n’évoquez ni son financement, ni sa banque.",
          "Personne qui commente un panneau « à vendre » sans avoir jamais eu affaire à l’agence : son avis ne reflète pas une expérience réelle et peut être signalé à Google.",
        ],
      },
      {
        type: "p",
        text: "Les règles de Google rangent d’ailleurs les informations financières d’une personne parmi les informations personnelles qu’il est interdit de publier sans son autorisation.",
      },
      { type: "h2", text: "Exemple de réponse à un candidat locataire mécontent" },
      {
        type: "p",
        text: "Prenons un avis fréquent : « Agence injoignable, dossier resté sans réponse. » Voici une réponse qui reconnaît le problème sans rien dévoiler :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour, merci pour votre message. Nous regrettons que vous n’ayez pas eu de réponse rapide : ce n’est pas le suivi que nous voulons offrir. Chaque dossier est transmis au propriétaire, qui fait son choix, et nous nous efforçons d’informer chaque candidat dans les meilleurs délais. Nous vous invitons à nous contacter directement pour en parler. »",
      },
      {
        type: "p",
        text: "Le ton est sobre et ne contredit pas l’auteur publiquement. Pour la méthode complète, consultez notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif).",
      },
      { type: "h2", text: "Erreurs à éviter en agence" },
      {
        type: "ul",
        items: [
          "Demander l’avis entre le compromis et l’acte : si la vente échoue, l’invitation arrive au pire moment.",
          "Faire écrire des avis par des négociateurs, des proches ou des partenaires (diagnostiqueur, courtier) : c’est un conflit d’intérêts, interdit par Google.",
          "Fixer à chaque négociateur un objectif chiffré d’avis : Google interdit expressément de demander au personnel de solliciter un certain nombre d’avis.",
          "N’inviter que les vendeurs dont le bien est parti vite : c’est un tri selon la satisfaction, interdit lui aussi.",
          "Créer des fiches supplémentaires dans le seul but de multiplier les avis : les [consignes de Google pour les fiches d’établissement](https://support.google.com/business/answer/3038177?hl=fr) demandent une seule fiche par établissement et interdisent à un professionnel d’en créer une pour chacune de ses spécialités.",
        ],
      },
      { type: "h2", text: "Ce qui rend l’immobilier différent" },
      {
        type: "p",
        text: "Un client achète ou vend rarement un bien : il n’y a pas de seconde chance de lui demander son avis. La fréquence est faible, mais chaque avis pèse lourd, parce qu’il raconte une décision importante. Et l’avis d’un vendeur sert directement votre prochaine prise de mandat : c’est un argument très crédible face à une agence concurrente. Le sujet rejoint plus largement l’[effet des avis sur le référencement local](/guides/avis-google-commerce-local).",
      },
      {
        type: "p",
        text: "Au bureau, un [présentoir avis Google](/presentoir-avis-google) sur la table de signature, comme le Présentoir Reviu, permet au client d’ouvrir votre page d’avis sans contact ou par QR code pendant que vous rassemblez les clés. Pour les clients qui signent ailleurs, le même lien part par message.",
      },
    ],
    faq: [
      {
        q: "Quand demander un avis Google à un client d’agence immobilière ?",
        a: "À la fin de son projet : remise des clés pour un acquéreur ou un locataire, signature de l’acte pour un vendeur, signature du bail pour un bailleur. Évitez la période entre le compromis et l’acte, quand la vente n’est pas encore conclue.",
      },
      {
        q: "Peut-on demander aux clients de citer le nom de leur négociateur ?",
        a: "Non. Google interdit de solliciter des avis au contenu imposé, y compris le nom d’un membre de l’équipe. Le client peut le citer spontanément, mais la demande doit rester ouverte.",
      },
      {
        q: "Comment répondre à un candidat locataire dont le dossier n’a pas été retenu ?",
        a: "Avec courtoisie et sans aucun détail sur son dossier : ni revenus, ni garant, ni pièces. Rappelez que le choix revient au propriétaire selon des critères appliqués à tous, et proposez un échange direct.",
      },
      {
        q: "Une agence peut-elle afficher un QR code d’avis en vitrine ?",
        a: "Ce n’est pas l’endroit idéal, car les passants qui regardent les annonces n’ont pas encore d’expérience avec l’agence. Mieux vaut placer le support à l’intérieur, là où se signent mandats et baux, et envoyer le lien par message aux clients.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-negatif",
      "avis-google-commerce-local",
      "avis-google-artisan",
    ],
  },

  // ── Artisan ────────────────────────────────────────────────────────────────
  {
    slug: "avis-google-artisan",
    metaTitle: "Avis Google pour un artisan du bâtiment : la méthode · reviu",
    h1: "Obtenir plus d’avis Google quand on est artisan",
    description:
      "Plombier, électricien, chauffagiste, paysagiste : comment demander un avis Google en fin de chantier, par SMS, sans comptoir, et répondre aux litiges.",
    excerpt:
      "Pas de comptoir, des clients rencontrés chez eux : l’artisan doit demander l’avis autrement. Voici la méthode, de la réception des travaux au SMS de suivi.",
    keywords: [
      "avis google artisan",
      "avis google plombier",
      "avis google électricien",
      "avis clients artisan bâtiment",
      "demander un avis fin de chantier",
      "sms demande avis google",
    ],
    category: "Par métier",
    readMinutes: 7,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un artisan obtient plus d’avis Google en faisant de la demande une étape de la fin de chantier : au moment où le client constate le travail terminé, on lui propose de laisser un avis, puis on lui envoie le lien direct par SMS le jour même. Faite à chaque client sans exception, cette demande remplace le comptoir que l’artisan n’a pas.",
      },
      {
        type: "p",
        text: "Pour un plombier, un électricien, un chauffagiste, un menuisier ou un paysagiste, les avis jouent un rôle particulier : le client va faire entrer quelqu’un chez lui, souvent dans l’urgence. Il tape « plombier » et le nom de sa ville, compare deux ou trois fiches, et appelle celle qui inspire confiance.",
      },
      { type: "h2", text: "Ce que les particuliers regardent avant d’appeler un artisan" },
      {
        type: "ul",
        items: [
          "La ponctualité et le respect des rendez-vous, reproche classique fait au bâtiment.",
          "La clarté du devis et le respect du prix annoncé.",
          "La propreté : protections posées, gravats évacués, pièce rendue en état.",
          "La qualité du travail et sa tenue dans le temps.",
          "La réactivité en cas d’urgence (fuite, panne de chauffage, coupure de courant) et le suivi après l’intervention.",
        ],
      },
      { type: "h2", text: "La fin de chantier, moment clé de la demande" },
      {
        type: "p",
        text: "Le moment idéal est la réception des travaux, quand vous faites le tour du résultat avec le client : la fuite est réparée, la chaudière redémarre, la terrasse est posée. Il constate, il remercie, il est chez lui et disponible. C’est l’instant de proposer l’avis. Pour un petit dépannage, c’est au moment où vous rangez vos outils et remettez la facture.",
      },
      {
        type: "callout",
        title: "Le réflexe du SMS avant de repartir",
        text: "Le client répond souvent « je le ferai ce soir ». Envoyez-lui le lien avant même de démarrer le véhicule : un message court, avec votre nom et le lien direct. Notre [générateur de message de demande d’avis](/outils/message-demande-avis-google) prépare un SMS, un WhatsApp ou un e-mail à partir de votre lien.",
      },
      { type: "h2", text: "Sans comptoir : les supports qui marchent pour un artisan" },
      {
        type: "p",
        text: "C’est la grande différence avec un commerce : vos clients ne passent jamais devant une caisse. Le support doit donc vous suivre, ou rester chez eux :",
      },
      {
        type: "ul",
        items: [
          "Le SMS ou le WhatsApp de fin d’intervention : le canal principal, puisque vous avez déjà le numéro du client.",
          "Un QR code sur le devis et la facture : le client le retrouve en relisant ses papiers. Vous pouvez le [créer gratuitement avec notre générateur](/outils/qr-code-avis-google).",
          "Un autocollant avec votre numéro et un QR code, laissé près de la chaudière ou du tableau électrique : il sert au prochain dépannage comme à l’avis.",
          "Un support rangé dans le véhicule, posé sur la table du client au moment de signer le procès-verbal ou de régler.",
          "Le lettrage du véhicule, en revanche, n’est pas fait pour l’avis : il est vu par des passants qui ne sont pas vos clients. Mieux vaut y afficher votre numéro.",
        ],
      },
      {
        type: "p",
        text: "Pour ce support nomade, un [présentoir avis Google](/presentoir-avis-google) comme le Présentoir Reviu se pose sur la table, et le client approche simplement son téléphone ou scanne le QR code : la page d’avis s’ouvre sans qu’il ait à chercher votre entreprise.",
      },
      { type: "h2", text: "Les mots à employer sur le chantier" },
      {
        type: "ul",
        items: [
          "À la réception : « Voilà, tout est en ordre. Si vous êtes content du travail, un avis sur Google m’aide beaucoup : je travaille surtout grâce au bouche-à-oreille. »",
          "Après un dépannage urgent : « Je vous envoie la facture et le lien pour laisser un avis par SMS. Ça aide les gens qui ont une fuite un dimanche à savoir sur qui compter. »",
          "Au client qui promet de vous recommander : « Merci ! Le plus utile, c’est un mot sur Google : c’est là que vos voisins chercheront. »",
        ],
      },
      {
        type: "p",
        text: "Le ton est celui de l’artisan indépendant : direct, sans formule commerciale. On ne demande pas cinq étoiles, et l’on ne propose aucune remise sur la prochaine intervention en échange de l’avis, ce qui serait une contrepartie interdite.",
      },
      { type: "h2", text: "Photos avant/après : à vous de les publier" },
      {
        type: "p",
        text: "Le bâtiment se prête aux photos, et un futur client aime voir le résultat. Attention toutefois à la manière : les règles de Google interdisent de demander au client d’inclure un contenu précis dans son avis. On ne lui demande donc pas d’ajouter des photos ni de mentionner tel aspect du chantier. Vous pouvez en revanche publier vous-même vos photos avant/après sur votre fiche, avec l’accord du client et sans rien qui permette de reconnaître son domicile (numéro de rue, façade, plaque d’immatriculation).",
      },
      {
        type: "p",
        text: "Tenez aussi à jour la liste de vos prestations sur la fiche : lorsqu’un client rédige un avis sur un prestataire de services, Google peut l’inviter à choisir le service réalisé, parmi votre liste et des missions courantes du secteur.",
      },
      { type: "h2", text: "Adresse et zone d’intervention : une fiche en règle" },
      {
        type: "p",
        text: "Beaucoup d’artisans travaillent depuis leur domicile. Les [consignes de Google pour les fiches d’établissement](https://support.google.com/business/answer/3038177?hl=fr) sont claires : un établissement qui se déplace chez ses clients sans les recevoir doit masquer son adresse et indiquer une zone desservie, avec une seule fiche. Google cite l’exemple du plombier qui gère son activité depuis chez lui. Si vous avez un atelier ou un showroom où vous accueillez réellement des clients aux horaires indiqués, l’adresse peut figurer avec une zone desservie. Respecter ces consignes évite une suspension de la fiche.",
      },
      { type: "h2", text: "Litiges de chantier : répondre sans s’enfoncer" },
      {
        type: "p",
        text: "Les avis négatifs d’artisans portent souvent sur un retard, un dépassement de devis ou une malfaçon contestée. Certains arrivent en plein désaccord sur le paiement. Trois règles :",
      },
      {
        type: "ol",
        items: [
          "Ne publiez aucun montant, aucune adresse, aucun détail du contrat : ces éléments relèvent de la relation privée.",
          "Restez factuel et bref, sans accuser le client : le futur client lit votre réponse pour juger votre caractère.",
          "Proposez une issue concrète : un passage pour constater, un appel.",
        ],
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour, et merci pour ce message. Je regrette que le chantier ait pris du retard et je comprends votre agacement. Je vous ai proposé de repasser pour vérifier le point que vous signalez, et la proposition tient toujours : appelez-moi quand cela vous arrange. »",
      },
      {
        type: "p",
        text: "Le client reçoit une notification quand vous répondez, et il peut modifier son avis ensuite : une réponse calme laisse cette porte ouverte. Ne proposez jamais un geste en échange de la suppression de l’avis, Google l’interdit. Si l’auteur n’a jamais été client, la démarche est différente : voyez [comment faire supprimer un faux avis](/guides/supprimer-faux-avis-google).",
      },
      { type: "h2", text: "Les erreurs typiques des artisans" },
      {
        type: "ul",
        items: [
          "Attendre le paiement du solde, puis n’envoyer le lien qu’aux clients sans réclamation : c’est un tri selon la satisfaction. Rendez l’envoi systématique, avec la facture.",
          "Demander l’avis avant la fin des travaux, quand le chantier est encore ouvert.",
          "Faire laisser des avis par des sous-traitants, des fournisseurs ou des proches : conflit d’intérêts.",
          "Créer une seconde fiche pour une commune voisine afin d’y récolter des avis : une seule fiche par établissement.",
          "Oublier les clients des petits dépannages : ce sont des clients comme les autres, et ils sont nombreux.",
        ],
      },
    ],
    faq: [
      {
        q: "Quand un artisan doit-il demander un avis Google ?",
        a: "À la fin du chantier ou de l’intervention, quand le client constate le travail terminé. On propose l’avis de vive voix, puis on envoie le lien direct par SMS le jour même, à chaque client sans exception.",
      },
      {
        q: "Comment un artisan sans boutique peut-il recevoir des avis Google ?",
        a: "Avec une fiche d’établissement configurée en zone desservie, l’adresse masquée s’il travaille depuis son domicile, et un lien d’avis diffusé par SMS, sur le devis, sur la facture ou via un QR code. Le client n’a pas besoin de venir dans un local pour laisser un avis.",
      },
      {
        q: "Peut-on demander au client d’ajouter des photos du chantier dans son avis ?",
        a: "Non, les règles de Google interdisent de demander un contenu précis dans un avis. L’artisan peut en revanche publier lui-même ses photos avant/après sur sa fiche, avec l’accord du client et sans élément permettant de reconnaître son domicile.",
      },
      {
        q: "Que faire d’un avis négatif laissé pendant un litige de paiement ?",
        a: "Répondre brièvement, sans montant ni détail du contrat, et proposer un échange direct. Le litige se règle en dehors de Google, et il ne faut jamais proposer d’avantage contre le retrait de l’avis.",
      },
      {
        q: "Faut-il aussi envoyer le lien d’avis aux clients mécontents ?",
        a: "Oui. Le même message part à tous les clients en fin de chantier. Réserver l’envoi aux clients satisfaits est une pratique de tri interdite par Google.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "avis-google-garage",
      "repondre-avis-negatif",
      "qr-code-avis-google",
      "avis-google-agence-immobiliere",
    ],
  },

  // ── Bar ────────────────────────────────────────────────────────────────────
  {
    slug: "avis-google-bar",
    metaTitle: "Avis Google pour un bar : la méthode au comptoir · reviu",
    h1: "Obtenir plus d’avis Google pour un bar ou un café",
    description:
      "Bar, café, bar à cocktails : quand proposer l’avis Google en soirée, où placer le support au comptoir, et comment répondre aux avis sur le bruit ou l’attente.",
    excerpt:
      "Dans un bar, l’avis se joue sur l’ambiance, le service et l’addition. Voici comment le demander sans casser la soirée, et répondre aux critiques classiques.",
    keywords: [
      "avis google bar",
      "avis google café",
      "avis bar à cocktails",
      "qr code avis bar",
      "répondre avis bar bruit",
      "plus d’avis google bar",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un bar obtient plus d’avis Google en proposant l’avis au moment où le client règle, au comptoir ou à table, avec un support visible et utilisable même dans la pénombre. Une phrase courte suffit, la même pour tous, sans verre offert en échange. Le reste se joue dans les réponses, en particulier aux avis sur le bruit, l’attente ou une entrée refusée.",
      },
      { type: "h2", text: "Ce que les clients d’un bar notent vraiment" },
      {
        type: "p",
        text: "On ne juge pas un bar comme un restaurant. L’assiette compte peu ; l’expérience de la soirée, beaucoup :",
      },
      {
        type: "ul",
        items: [
          "L’ambiance : musique, volume, éclairage, type de clientèle.",
          "Le service : rapidité au comptoir, amabilité, attention portée aux groupes.",
          "La carte : qualité des cocktails, choix de bières, boissons sans alcool pour ceux qui n’en boivent pas.",
          "Le rapport qualité-prix et la clarté de l’addition.",
          "Le confort : terrasse, places assises, propreté des toilettes.",
          "Les horaires : un bar affiché ouvert sur Google et trouvé fermé à 23 h récolte rarement un compliment.",
        ],
      },
      { type: "h2", text: "Choisir le moment dans la soirée" },
      {
        type: "p",
        text: "Le meilleur moment est le règlement : le client a vécu sa soirée, il a un avis, et il tient déjà son téléphone pour payer. Selon votre fonctionnement :",
      },
      {
        type: "ul",
        items: [
          "Paiement à la commande, au comptoir : proposez l’avis quand le client revient au bar en fin de soirée ou vous salue en partant, pas à la première commande, avant qu’il ait vécu quoi que ce soit.",
          "Note ouverte ou addition à table : au moment de présenter l’addition, le support posé à côté du terminal.",
          "Café de jour : à l’encaissement du café ou du déjeuner, pour les habitués comme pour les clients de passage.",
        ],
      },
      {
        type: "callout",
        title: "Une règle de bon sens",
        text: "Ne proposez pas l’avis à un client visiblement éméché. Ce n’est respectueux ni pour lui ni pour vous, et ce qu’il écrirait ne refléterait pas sa soirée. Il ne s’agit pas d’un tri selon la satisfaction : le support reste en place, et il le retrouvera lors d’une prochaine visite.",
      },
      { type: "h2", text: "Où poser le support dans un bar" },
      {
        type: "ul",
        items: [
          "Sur le comptoir, à côté du terminal de paiement : l’emplacement principal.",
          "Sur les tables ou les mange-debout, dans un petit chevalet : pour les clients qui ne passent jamais au comptoir.",
          "Près de la sortie ou du vestiaire : un dernier rappel au départ.",
          "En bas de la carte des cocktails : un QR code discret, consulté à chaque commande.",
        ],
      },
      {
        type: "p",
        text: "Dans un bar, l’éclairage est souvent tamisé ou coloré. Un QR code se scanne moins facilement dans ces conditions, alors que le sans contact fonctionne quelle que soit la lumière. Testez votre support aux heures de pointe, avec l’éclairage du soir. Notre comparatif [NFC ou QR code pour les avis Google](/guides/nfc-ou-qr-code-avis-google) détaille les forces de chaque technologie.",
      },
      { type: "h2", text: "Ce que le barman peut dire" },
      {
        type: "ul",
        items: [
          "« Bonne soirée ? Si vous avez une seconde, un avis Google nous aide à faire connaître le bar. C’est juste là, d’un geste avec le téléphone. »",
          "Au client qui complimente un cocktail : « Merci ! Si vous avez envie de l’écrire sur Google, le support est sur le comptoir. »",
          "Pour les touristes : « If you enjoyed your evening, a Google review helps us a lot. Just tap your phone here. »",
        ],
      },
      {
        type: "p",
        text: "Répondre à un compliment est naturel, à condition que la demande ne se limite pas aux clients qui en font : l’invitation au moment du règlement, elle, s’adresse à tout le monde. Et jamais de shot ni de café offert contre un avis. C’est la tentation classique du bar, et c’est exactement ce que Google interdit.",
      },
      { type: "h2", text: "Groupes, touristes, habitués : trois clientèles" },
      {
        type: "ul",
        items: [
          "Les groupes : proposez l’avis à la personne qui règle, sans faire le tour de la table. Les autres peuvent utiliser le support s’ils le souhaitent.",
          "Les touristes : beaucoup choisissent où sortir en regardant la carte de Google Maps. Leurs avis, rédigés dans leur langue, rassurent les visiteurs suivants. Ayez la phrase en anglais en tête.",
          "Les habitués : inutile de leur redemander à chaque passage. Une demande, une fois, et le support visible fait le reste.",
        ],
      },
      { type: "h2", text: "Bruit, attente, entrée refusée : répondre aux avis délicats" },
      { type: "h3", text: "Le bruit" },
      {
        type: "p",
        text: "La plainte peut venir d’un client gêné par le volume ou d’un riverain. Dans les deux cas, répondez en expliquant ce que vous faites concrètement (fenêtres fermées après une certaine heure, son limité, gestion de la terrasse), sans polémique. Un avis de riverain n’enfreint pas forcément les règles : s’il décrit une nuisance réelle et reste respectueux, mieux vaut y répondre que le signaler.",
      },
      { type: "h3", text: "L’attente au comptoir" },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonsoir Thomas, merci pour votre retour. Samedi, nous étions complets et l’attente au comptoir a été trop longue, vous avez raison. Nous renforçons l’équipe derrière le bar les soirs de week-end. Au plaisir de vous servir dans de meilleures conditions. »",
      },
      { type: "h3", text: "L’entrée refusée" },
      {
        type: "p",
        text: "Un refus à la porte, pour cause de salle complète ou de comportement, génère des avis vifs. Ne décrivez jamais la personne ni son attitude, et rappelez simplement que la politique d’accès est la même pour tous. La loi interdit tout refus d’entrée discriminatoire : votre réponse publique doit refléter des règles neutres, appliquées à chacun. Pour une base de rédaction, essayez notre [générateur de réponses aux avis](/outils/reponse-avis-google).",
      },
      { type: "h2", text: "Erreurs de bar à éviter" },
      {
        type: "ul",
        items: [
          "Offrir une consommation contre un avis, même « juste un shot ».",
          "Laisser des horaires faux sur la fiche : soirées privées, fermetures exceptionnelles, horaires d’été. Google permet d’ajouter des horaires exceptionnels pour les jours fériés ou les événements.",
          "Répondre à chaud, en fin de service, à un avis qui vous a piqué : attendez le lendemain.",
          "Faire la promotion de l’alcool dans vos réponses (« revenez pour notre happy hour ») : Google vérifie vos réponses au regard de son règlement, qui exclut les incitations à l’achat d’alcool, et la publicité pour l’alcool est encadrée en France.",
          "Laisser chaque serveur demander aux clients de le citer dans l’avis : solliciter un contenu qui identifie un membre de l’équipe est interdit.",
        ],
      },
      { type: "h2", text: "Ce qui distingue un bar des autres commerces" },
      {
        type: "p",
        text: "Le bar vend une soirée plus qu’un produit, et cette soirée se termine tard, dans un cadre où personne ne pense aux avis. La demande doit donc être légère, presque un rappel. L’autre spécificité : on consulte souvent la fiche pour décider sur le moment (« un bar ouvert près d’ici »), d’où l’importance d’horaires exacts et d’avis récents. Pour la partie restauration, voyez aussi notre guide [avis Google pour un restaurant](/guides/avis-google-restaurant).",
      },
      {
        type: "p",
        text: "Sur un comptoir sombre et encombré, le [Présentoir Reviu](/presentoir-avis-google) a l’avantage du sans contact : le client approche son téléphone, comme pour payer, sans dépendre de l’éclairage, et le QR code reste disponible pour les autres. L’espace Reviu distingue les scans sans contact et QR code, pour voir lequel vos clients utilisent le soir.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis Google dans un bar ?",
        a: "Au règlement, au comptoir ou à l’addition, quand le client a vécu sa soirée et tient déjà son téléphone. La même phrase est proposée à tous les clients, sans insister.",
      },
      {
        q: "Un bar peut-il offrir un verre contre un avis Google ?",
        a: "Non. Une consommation offerte est une contrepartie, interdite par les règles de Google, et les avis obtenus ainsi peuvent être supprimés. On invite tous les clients, sans rien en échange.",
      },
      {
        q: "Comment répondre à un avis qui se plaint du bruit ?",
        a: "Avec calme, en expliquant les mesures prises sur le volume, les fenêtres ou la terrasse, sans contester le ressenti de l’auteur. Si un riverain décrit une nuisance réelle avec respect, mieux vaut répondre que signaler l’avis.",
      },
      {
        q: "QR code ou sans contact : que choisir dans un bar peu éclairé ?",
        a: "Les deux se complètent. Un QR code se scanne moins facilement sous un éclairage tamisé ou coloré, alors que le sans contact fonctionne quelle que soit la lumière. Testez votre support dans les conditions réelles du soir.",
      },
      {
        q: "Comment répondre à une personne à qui l’entrée a été refusée ?",
        a: "Sobrement, sans décrire la personne ni son comportement, en rappelant que la politique d’accès est la même pour tous. Proposez un échange direct si elle souhaite des explications.",
      },
    ],
    related: [
      "avis-google-restaurant",
      "repondre-avis-negatif",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-food-truck",
    ],
  },

  // ── Fleuriste ──────────────────────────────────────────────────────────────
  {
    slug: "avis-google-fleuriste",
    metaTitle: "Avis Google pour un fleuriste : la méthode concrète · reviu",
    h1: "Obtenir plus d’avis Google pour un fleuriste",
    description:
      "Fleuriste : demander un avis Google à la remise du bouquet, gérer achats cadeaux et livraisons, aborder deuils et mariages avec tact, préparer les fêtes.",
    excerpt:
      "Chez le fleuriste, celui qui paie n’est pas toujours celui qui reçoit. Voici comment demander un avis au bon moment, avec le tact qu’exige ce métier.",
    keywords: [
      "avis google fleuriste",
      "avis fleuriste",
      "avis clients fleuriste",
      "qr code avis fleuriste",
      "demander un avis bouquet",
      "répondre avis fleuriste",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un fleuriste obtient plus d’avis Google en proposant l’avis au moment où il remet le bouquet terminé, quand le client le découvre à la caisse ; un support posé à côté du terminal fait le reste. Le métier impose deux réserves : ne jamais solliciter une famille en deuil, et se souvenir que l’acheteur d’un bouquet offert ne le verra pas toujours arriver.",
      },
      { type: "h2", text: "Sur quoi un fleuriste est jugé" },
      {
        type: "ul",
        items: [
          "La fraîcheur et la tenue des fleurs dans le temps : l’avis arrive parfois une semaine après l’achat, quand le bouquet a vécu.",
          "Le conseil : composer selon un budget, une occasion, les goûts de la personne qui recevra les fleurs.",
          "La fidélité entre la commande et le bouquet livré, surtout pour les commandes passées à distance.",
          "La ponctualité des livraisons, décisive pour un anniversaire ou une cérémonie.",
          "Le rapport entre le prix et la générosité du bouquet.",
        ],
      },
      { type: "h2", text: "La remise du bouquet, l’instant à saisir" },
      {
        type: "p",
        text: "En boutique, la satisfaction se produit sous vos yeux : vous terminez la composition, vous l’emballez, le client la découvre. Peu de commerces offrent un moment aussi visible. Proposez l’avis à cet instant, pendant l’encaissement. Le temps de préparation est aussi un temps d’attente : le client regarde autour de lui, et un support bien placé sur la caisse attire son regard avant même que vous en parliez.",
      },
      { type: "h2", text: "Où placer le support en boutique" },
      {
        type: "ul",
        items: [
          "Sur le comptoir de caisse, à côté du terminal : là où le client attend que son bouquet soit prêt.",
          "Sur la table de composition, si elle est visible depuis la boutique : le client vous regarde travailler.",
          "Sur la carte de visite glissée dans l’emballage, pour les bouquets que le client emporte : un QR code discret qu’il scannera chez lui.",
          "Jamais sur les cartes de condoléances ni dans les compositions de deuil.",
        ],
      },
      {
        type: "p",
        text: "Pour imprimer ces cartes, notre [générateur de QR code d’avis Google](/outils/qr-code-avis-google) crée le code et une affiche à poser en boutique.",
      },
      { type: "h2", text: "Achats cadeaux et livraisons : qui invite-t-on ?" },
      {
        type: "p",
        text: "Particularité du métier : l’acheteur et le destinataire sont souvent deux personnes différentes. L’acheteur a vécu la commande et le conseil ; le destinataire a vécu la livraison et la fraîcheur. Chacun peut laisser un avis sur sa propre expérience.",
      },
      {
        type: "ul",
        items: [
          "L’acheteur en boutique : invitez-le au paiement, comme tout client.",
          "L’acheteur à distance (téléphone, site) : envoyez le lien par message une fois le bouquet livré, pour qu’il puisse parler de l’ensemble. Notre [générateur de messages de demande d’avis](/outils/message-demande-avis-google) vous aide à le rédiger.",
          "Le destinataire : une petite mention avec QR code sur la carte d’accompagnement peut convenir pour un anniversaire ou une naissance, avec l’accord de l’acheteur, jamais pour un deuil.",
        ],
      },
      {
        type: "callout",
        title: "Les données du destinataire restent privées",
        text: "Vous connaissez l’adresse du destinataire et parfois le message personnel joint au bouquet. Rien de tout cela ne doit apparaître dans une réponse publique, même pour remercier chaleureusement.",
      },
      { type: "h2", text: "Deuil, mariage : le tact avant tout" },
      { type: "h3", text: "Les compositions de deuil" },
      {
        type: "p",
        text: "La famille qui commande une gerbe traverse un moment douloureux. On ne lui parle pas d’avis, ni à la commande ni à la livraison. Le support reste sur le comptoir, visible de tous, et chacun est libre de s’en servir. Si un proche revient plus tard pour vous remercier, c’est à lui de décider s’il souhaite l’écrire.",
      },
      { type: "h3", text: "Les mariages" },
      {
        type: "p",
        text: "La commande se prépare longtemps à l’avance, avec des échanges, des essais et un devis. Le bon moment n’est pas le jour J, mais quelques jours après, quand les mariés ont vu les photos. Un message personnel suffit : « Nous espérons que les fleurs ont été à la hauteur de votre journée. Si vous souhaitez partager votre expérience, voici notre page d’avis Google. »",
      },
      { type: "h2", text: "Saint-Valentin, fête des mères : tenir le rythme sans oublier la demande" },
      {
        type: "p",
        text: "Les fêtes amènent des clients qui ne viennent qu’une ou deux fois par an, et une file d’attente qui ne laisse pas le temps de parler. C’est là que le support fait la différence : il travaille pendant que vous composez. Trois conseils :",
      },
      {
        type: "ol",
        items: [
          "Placez un second support là où la file patiente, à hauteur des yeux : le client le remarque en attendant et s’en sert une fois servi.",
          "Gardez une phrase très courte, à dire en tendant le bouquet : « Si vous avez une seconde après la fête, votre avis sur Google nous aide beaucoup. C’est ici. »",
          "Après le rush, répondez aux avis de la période, y compris aux critiques sur l’attente : c’est une période où de nouveaux clients découvrent votre fiche.",
        ],
      },
      { type: "h2", text: "Répondre aux critiques sur la fraîcheur ou la livraison" },
      {
        type: "p",
        text: "Les reproches classiques : des fleurs fanées trop vite, un bouquet livré différent de la photo, une livraison en retard. La réponse reste sobre, sans mettre en cause le destinataire (« l’eau n’a sans doute pas été changée ») et sans dévoiler qui a offert quoi à qui.",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour, merci de nous l’avoir signalé. Nous sommes désolés que le bouquet n’ait pas tenu aussi longtemps que prévu : ce n’est pas ce que nous attendons de nos fleurs. Passez nous voir ou appelez-nous, nous voulons comprendre ce qui s’est passé et trouver une solution. »",
      },
      {
        type: "p",
        text: "Si vous proposez un nouveau bouquet pour réparer une erreur, faites-le en privé et sans condition : Google interdit d’offrir quoi que ce soit en échange de la modification ou de la suppression d’un avis. Pour d’autres cas, voyez notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif).",
      },
      { type: "h2", text: "Ce qui rend le fleuriste à part, et les erreurs à éviter" },
      {
        type: "p",
        text: "Le fleuriste vend de l’émotion, souvent pour quelqu’un d’autre, à des moments de vie heureux ou tristes. Le tact y compte autant que la technique, et un avis y raconte souvent une histoire plus qu’un produit. Les erreurs à éviter :",
      },
      {
        type: "ul",
        items: [
          "Demander l’avis à la commande, avant que le client ait vu le bouquet.",
          "Offrir une fleur ou une remise sur le prochain bouquet en échange d’un avis : c’est une contrepartie interdite.",
          "Glisser un QR code d’avis dans une composition de deuil.",
          "Ne penser aux avis que pour les grandes occasions et oublier le client qui achète un bouquet chaque samedi matin.",
        ],
      },
      {
        type: "p",
        text: "Un [présentoir avis Google](/presentoir-avis-google) sur la caisse, comme le Présentoir Reviu, ouvre votre page d’avis sans contact ou par QR code pendant que vous terminez l’emballage : le client n’a qu’à approcher le téléphone qu’il tient déjà pour payer.",
      },
    ],
    faq: [
      {
        q: "Quand demander un avis Google chez un fleuriste ?",
        a: "À la remise du bouquet en boutique, pendant l’encaissement, quand le client découvre la composition. Pour une commande livrée, on envoie le lien à l’acheteur une fois la livraison effectuée.",
      },
      {
        q: "Le destinataire d’un bouquet peut-il laisser un avis ?",
        a: "Oui, à condition de parler de ce qu’il a vécu : la livraison, la fraîcheur, la composition reçue. L’acheteur peut de son côté laisser le sien sur la commande et le conseil.",
      },
      {
        q: "Faut-il demander un avis après une commande pour des obsèques ?",
        a: "Non. On ne sollicite pas une famille en deuil, ni à la commande ni à la livraison. Le support reste visible au comptoir, et chacun demeure libre de s’en servir.",
      },
      {
        q: "Peut-on offrir un bouquet pour faire retirer un avis négatif ?",
        a: "Non. Offrir un avantage en échange de la modification ou de la suppression d’un avis est interdit par Google. Un geste pour réparer une erreur reste possible, mais sans aucune condition liée à l’avis.",
      },
    ],
    related: [
      "avis-google-boutique",
      "avis-google-boulangerie",
      "repondre-avis-negatif",
      "avoir-plus-avis-google",
    ],
  },

  // ── Camping ────────────────────────────────────────────────────────────────
  {
    slug: "avis-google-camping",
    metaTitle: "Avis Google pour un camping : la méthode complète · reviu",
    h1: "Obtenir plus d’avis Google pour un camping",
    description:
      "Camping : quand demander un avis Google pendant un long séjour, où placer le support à la réception, et comment répondre aux campeurs étrangers.",
    excerpt:
      "Séjours longs, clientèle internationale, saison courte : le camping a ses contraintes. Voici comment récolter des avis Google au départ, dans toutes les langues.",
    keywords: [
      "avis google camping",
      "avis camping",
      "avis clients camping",
      "qr code avis camping",
      "répondre avis camping en anglais",
      "avis mobil-home",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un camping obtient plus d’avis Google en proposant l’avis au départ, à la réception, au moment où le client rend les clés du mobil-home ou son badge, puis en rappelant le lien dans un message de fin de séjour. Un support à l’accueil et un QR code dans chaque hébergement couvrent tout le séjour, et les réponses se rédigent dans la langue de l’avis.",
      },
      { type: "h2", text: "Les critères des campeurs, de la piscine aux sanitaires" },
      {
        type: "ul",
        items: [
          "La propreté des sanitaires et des hébergements.",
          "Le calme la nuit, la taille et l’ombrage des emplacements.",
          "L’accueil à la réception et la gestion des imprévus.",
          "Les équipements (piscine, aire de jeux, épicerie, wifi) et leurs horaires réels.",
          "Les animations et le club enfants pour les familles.",
          "L’état du mobil-home : literie, cuisine, terrasse, chauffage en arrière-saison.",
        ],
      },
      { type: "h2", text: "Séjour long : quand proposer l’avis" },
      {
        type: "p",
        text: "Un client qui reste une ou deux semaines vit plusieurs expériences successives. L’arrivée est trop tôt : il n’a encore rien vu. Le milieu du séjour convient rarement, sauf pour un week-end. Le départ, en revanche, cumule tout : le bilan est fait, et le client passe à la réception rendre les clés ou régler le solde. Une routine en trois temps :",
      },
      {
        type: "ol",
        items: [
          "À l’arrivée : remettez le livret d’accueil, où figure le QR code d’avis, sans en parler. Il servira de rappel.",
          "Au départ, à la réception : proposez l’avis de vive voix pendant le règlement ou la remise des clés.",
          "Le lendemain : un message de remerciement avec le lien direct, pour ceux qui sont partis sans repasser à l’accueil.",
        ],
      },
      {
        type: "callout",
        title: "Les départs matinaux",
        text: "Beaucoup de familles partent tôt pour éviter la route chargée. Si elles déposent les clés dans une boîte avant l’ouverture de l’accueil, le QR code dans l’hébergement et le message envoyé après le départ sont vos seules occasions de leur proposer l’avis.",
      },
      { type: "h2", text: "Réception, mobil-homes, espaces communs : où placer les supports" },
      {
        type: "ul",
        items: [
          "Sur le comptoir de la réception : l’emplacement principal, au moment du départ.",
          "Dans chaque mobil-home ou chalet, sur la table ou dans le livret : visible pendant tout le séjour, sans être intrusif.",
          "Au snack, à l’épicerie ou au bar du camping : un moment détendu, en fin de journée.",
          "Pas sur les blocs sanitaires : ni le lieu, ni le moment.",
        ],
      },
      {
        type: "p",
        text: "Si le camping a plusieurs points d’accueil, vérifiez que tous les supports pointent vers la même fiche Google. Pour imprimer un QR code par hébergement, utilisez notre [générateur de QR code d’avis](/outils/qr-code-avis-google).",
      },
      { type: "h2", text: "Les phrases à la réception, en français et en anglais" },
      {
        type: "ul",
        items: [
          "« Merci d’être venus ! Un avis sur Google aide d’autres familles à nous trouver : c’est ici, d’un geste avec le téléphone, ou dans le livret d’accueil. »",
          "Aux habitués qui reviennent chaque été : « Vous connaissez le camping mieux que personne : votre avis compte pour ceux qui hésitent à venir. »",
          "En anglais : « Thank you for staying with us! If you’d like to share your experience, a Google review really helps. You can write it in your own language. »",
        ],
      },
      {
        type: "p",
        text: "Précisez aux campeurs étrangers qu’ils peuvent écrire dans leur langue : c’est plus simple pour eux, et leur avis rassure les voyageurs de leur pays, qui préparent leurs vacances depuis chez eux.",
      },
      { type: "h2", text: "Répondre aux avis en langue étrangère" },
      {
        type: "p",
        text: "Un avis en néerlandais, en allemand ou en anglais mérite une réponse dans la même langue. Le client se sent considéré, et les futurs voyageurs de son pays lisent votre réponse. Si personne dans l’équipe ne maîtrise la langue, rédigez une réponse courte et simple, faites-la traduire, puis retraduisez-la vers le français pour vérifier le sens. Évitez les expressions idiomatiques, qui se traduisent mal.",
      },
      {
        type: "callout",
        title: "Exemple : réponse à un avis en anglais sur la piscine",
        text: "« Thank you for your review and for staying with us this summer. We are sorry the pool was closed for maintenance during part of your stay: we know how much it matters to families. It is fully open again, and we hope to welcome you back. »",
      },
      { type: "h2", text: "Les critiques typiques d’un camping et comment y répondre" },
      {
        type: "ul",
        items: [
          "Le bruit nocturne : rappelez les heures de calme du règlement intérieur et ce que fait l’équipe en cas de nuisance, sans désigner d’autres campeurs.",
          "Les sanitaires : remerciez pour le signalement, indiquez la mesure prise (passage supplémentaire, réparation) plutôt qu’une justification.",
          "La caution retenue : n’exposez pas le détail de l’état des lieux en public, proposez d’en parler par e-mail.",
          "Le wifi ou un équipement fermé : soyez honnête sur ce qui dépend de vous et sur ce qui va changer.",
        ],
      },
      {
        type: "p",
        text: "Pour la méthode générale, consultez notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif), et notre [générateur de réponses](/outils/reponse-avis-google) pour une base à adapter puis à traduire.",
      },
      { type: "h2", text: "Saisonnalité : faire vivre la fiche toute l’année" },
      {
        type: "p",
        text: "Un camping fonctionne souvent sur quelques mois : les avis s’accumulent en été, puis plus rien. Trois réflexes pour garder une fiche vivante :",
      },
      {
        type: "ul",
        items: [
          "Hors saison, les [consignes de Google pour les fiches d’établissement](https://support.google.com/business/answer/3038177?hl=fr) permettent de marquer un établissement saisonnier comme temporairement fermé, puis de le rouvrir à la reprise.",
          "Profitez de l’hiver pour répondre aux avis restés sans réponse : les familles qui réservent tôt lisent votre fiche bien avant l’ouverture.",
          "Mettez à jour photos et équipements avant la saison : un avis qui parle d’une piscine rénovée doit correspondre à ce que montrent vos photos.",
        ],
      },
      { type: "h2", text: "Les erreurs à éviter, et la particularité du camping" },
      {
        type: "ul",
        items: [
          "Offrir une nuit, un apéritif ou une réduction sur le prochain séjour contre un avis : contrepartie interdite.",
          "Demander l’avis à l’arrivée, avant que le client ait découvert son emplacement.",
          "Faire laisser des avis par les saisonniers ou leurs proches : conflit d’intérêts.",
          "Ignorer les avis étrangers faute de parler la langue.",
        ],
      },
      {
        type: "p",
        text: "La particularité du camping, c’est la durée : un client y passe plus de temps que dans la plupart des commerces, et son avis résume des vacances entières. Il mérite d’être demandé au bon moment, une seule fois, avec un support qui ne gâche pas le séjour. Les principes rejoignent ceux de l’[hôtellerie](/guides/avis-google-hotel), avec une clientèle plus familiale et plus internationale.",
      },
      {
        type: "p",
        text: "À la réception, un [présentoir avis Google](/presentoir-avis-google) comme le Présentoir Reviu ouvre votre page d’avis sans contact ou par QR code, sans application, sur les téléphones des campeurs français comme étrangers.",
      },
    ],
    faq: [
      {
        q: "Quand demander un avis Google à un campeur ?",
        a: "Au départ, à la réception, au moment de rendre les clés ou de régler le solde, quand le client a vécu tout son séjour. Pour ceux qui partent avant l’ouverture de l’accueil, le QR code dans l’hébergement et un message envoyé après le départ prennent le relais.",
      },
      {
        q: "Un client étranger peut-il laisser un avis dans sa langue ?",
        a: "Oui, chacun peut rédiger son avis dans la langue de son choix. C’est même préférable : l’avis est plus naturel et rassure les voyageurs du même pays.",
      },
      {
        q: "Faut-il répondre en anglais à un avis rédigé en anglais ?",
        a: "Oui, idéalement dans la langue de l’avis. Une réponse courte et simple, vérifiée en la retraduisant vers le français, suffit. Évitez les expressions idiomatiques.",
      },
      {
        q: "Que faire de la fiche Google d’un camping hors saison ?",
        a: "Les consignes de Google permettent de marquer un établissement saisonnier comme temporairement fermé hors saison, puis de le rouvrir. Profitez de cette période pour répondre aux avis et mettre à jour photos et équipements.",
      },
      {
        q: "Peut-on offrir une réduction sur le prochain séjour contre un avis ?",
        a: "Non. Toute contrepartie en échange d’un avis est interdite par Google. Vous pouvez fidéliser vos clients, mais jamais en lien avec l’avis.",
      },
    ],
    related: [
      "avis-google-hotel",
      "avis-google-chambre-d-hotes",
      "repondre-avis-negatif",
      "qr-code-avis-google",
    ],
  },

  // ── Chambre d’hôtes et gîte ────────────────────────────────────────────────
  {
    slug: "avis-google-chambre-d-hotes",
    metaTitle: "Avis Google pour une chambre d’hôtes ou un gîte · reviu",
    h1: "Obtenir plus d’avis Google pour une chambre d’hôtes ou un gîte",
    description:
      "Chambre d’hôtes et gîte : demander un avis Google au départ ou au petit-déjeuner, avec discrétion, en complément des plateformes de réservation.",
    excerpt:
      "Entre hôtes et voyageurs, la relation est personnelle : demander un avis peut gêner. Voici comment le faire avec tact, et faire exister votre fiche Google.",
    keywords: [
      "avis google chambre d’hôtes",
      "avis google gîte",
      "avis chambre d’hôtes",
      "qr code avis gîte",
      "livret d’accueil avis google",
      "avis google location saisonnière",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Une chambre d’hôtes ou un gîte obtient plus d’avis Google en glissant le lien dans le livret d’accueil, en posant un petit support près du petit-déjeuner ou dans l’entrée, et en proposant l’avis une seule fois, au moment du départ. La relation étant personnelle, la demande doit rester légère : une phrase, sans insister, adressée à tous les voyageurs.",
      },
      { type: "h2", text: "Pourquoi Google compte, à côté des plateformes" },
      {
        type: "p",
        text: "Beaucoup de propriétaires reçoivent déjà des avis sur les plateformes de réservation, qui sollicitent les voyageurs après leur séjour. Ces avis restent sur la plateforme. La fiche Google, elle, apparaît quand un voyageur cherche une chambre d’hôtes dans un village ou regarde la carte autour de son étape, et elle mène vers la réservation en direct. Google peut afficher sur certaines fiches des avis issus d’autres sites, mais vous n’avez pas la main dessus ; les avis Google, vous pouvez les solliciter vous-même.",
      },
      { type: "h2", text: "Ce que les voyageurs mettent en avant" },
      {
        type: "ul",
        items: [
          "L’accueil et la personnalité des hôtes : c’est la raison d’être de la chambre d’hôtes.",
          "Le petit-déjeuner : produits locaux, fait maison, moment d’échange.",
          "La literie, le calme et la propreté.",
          "Les conseils de visite et les bonnes adresses partagées.",
          "Pour un gîte : l’équipement, la conformité aux photos, l’autonomie à l’arrivée (boîte à clés, consignes claires).",
        ],
      },
      { type: "h2", text: "Petit-déjeuner ou départ : choisir le bon moment" },
      {
        type: "p",
        text: "Chambre d’hôtes et gîte ne se gèrent pas tout à fait de la même façon :",
      },
      {
        type: "ul",
        items: [
          "En chambre d’hôtes, le petit-déjeuner du dernier matin est le moment où l’on fait le bilan du séjour, autour d’un café. Une phrase glissée en fin de repas, ou au moment de dire au revoir, suffit.",
          "En gîte, les propriétaires ne croisent pas toujours leurs locataires au départ. Le livret d’accueil et un message de remerciement envoyé après le départ prennent le relais.",
          "Pour une seule nuit sur la route des vacances, le départ est souvent matinal : un support dans l’entrée, visible en passant, reste la meilleure option.",
        ],
      },
      {
        type: "p",
        text: "Évitez la demande dès le premier soir : le voyageur n’a pas encore dormi dans le lit qu’il va juger.",
      },
      { type: "h2", text: "Livret d’accueil et supports : rester discret" },
      {
        type: "p",
        text: "Une chambre d’hôtes est une maison, pas un commerce. Une affiche « laissez-nous un avis » dans chaque pièce gâcherait l’atmosphère que vous avez soignée. Privilégiez :",
      },
      {
        type: "ul",
        items: [
          "Une page dans le livret d’accueil, avec le QR code et un mot personnel.",
          "Un petit support sur la console de l’entrée ou sur le buffet du petit-déjeuner.",
          "Rien de plus dans les chambres que le livret : la chambre est l’espace privé du voyageur.",
        ],
      },
      {
        type: "p",
        text: "Notre [générateur de QR code d’avis Google](/outils/qr-code-avis-google) produit gratuitement un code et une affiche à intégrer au livret. Pour le message envoyé après un séjour en gîte, partez de votre [lien d’avis Google](/guides/lien-avis-google).",
      },
      { type: "h2", text: "Demander sans gêner : les mots justes" },
      {
        type: "p",
        text: "La relation personnelle est une force, mais aussi un risque : un voyageur qui a apprécié vos attentions peut se sentir obligé d’écrire, voire de taire une critique. Les règles de Google interdisent d’exercer une pression pour obtenir un avis. Formulez la demande comme une possibilité, jamais comme un service rendu en retour :",
      },
      {
        type: "ul",
        items: [
          "« Ça nous a fait plaisir de vous recevoir. Si un jour vous avez envie d’en parler sur Google, le lien est dans le livret. Surtout, bonne route ! »",
          "« Nous sommes une petite maison, et les avis Google aident les voyageurs à nous trouver. Libre à vous, bien sûr. »",
          "Par message, après le départ d’un gîte : « Merci d’avoir pris soin de la maison. Si vous souhaitez partager votre séjour, voici notre page d’avis Google. »",
        ],
      },
      {
        type: "p",
        text: "Pas de pot de confiture offert contre un avis, ni de réduction sur une prochaine réservation directe : ce sont des contreparties. Un cadeau d’accueil offert à tous, sans lien avec l’avis, reste bien sûr possible. Et ne restez pas à côté du voyageur pendant qu’il écrit.",
      },
      { type: "h2", text: "Répondre aux avis quand on reçoit chez soi" },
      {
        type: "p",
        text: "Un avis négatif sur une chambre d’hôtes touche la maison et les hôtes eux-mêmes : c’est là qu’il faut le plus de recul. Les critiques typiques portent sur un lit inconfortable, une isolation phonique insuffisante, un accueil jugé trop présent ou pas assez, une arrivée tardive mal vécue. Répondez en signant de votre prénom, comme vous recevez, mais sans entrer dans le détail personnel du séjour (avec qui le voyageur était, à quelle occasion).",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Merci pour votre message. Nous sommes désolés que la nuit ait été moins reposante que prévu : la chambre donne sur la cour, et nous comprenons que les bruits du matin aient pu vous gêner. Nous avons posé des rideaux plus épais et nous signalons désormais ce point à la réservation. Au plaisir, peut-être, de vous recevoir à nouveau. Claire et Marc »",
      },
      {
        type: "p",
        text: "Pour aller plus loin, notre guide pour [répondre aux avis Google](/guides/repondre-avis-google) détaille le ton et la structure d’une bonne réponse.",
      },
      { type: "h2", text: "Les erreurs propres aux hébergements chez l’habitant" },
      {
        type: "ul",
        items: [
          "Demander à des amis ou à la famille de laisser un avis pour lancer la fiche : conflit d’intérêts, interdit par Google.",
          "Relancer le voyageur à plusieurs reprises, en plus des messages de la plateforme : une seule invitation suffit.",
          "Ne pas revendiquer sa fiche Google : sans établissement validé, impossible de répondre aux avis.",
          "Répondre à une critique sur le registre de l’affect (« nous avons été blessés ») plutôt que sur les faits.",
          "Afficher des horaires d’ouverture sur la fiche : les consignes de Google citent les hébergements parmi les établissements qui n’ont pas intérêt à en indiquer.",
        ],
      },
      { type: "h2", text: "Ce qui distingue la chambre d’hôtes de l’hôtel" },
      {
        type: "p",
        text: "À l’hôtel, la demande d’avis est un geste de réception, professionnel. En chambre d’hôtes, elle vient de la personne qui a préparé le petit-déjeuner : elle pèse davantage, et doit donc être plus légère. Le volume d’avis est faible (quelques chambres, parfois une saison), si bien que chaque avis compte. Et les voyageurs cherchent une ambiance, des hôtes, une maison : les avis qui racontent cela sont votre meilleure description. Pour une structure plus grande, voyez notre guide [avis Google pour un hôtel](/guides/avis-google-hotel).",
      },
      {
        type: "p",
        text: "Sur la console de l’entrée, un [Présentoir Reviu](/presentoir-avis-google) reste discret : le voyageur approche son téléphone, comme pour payer sans contact, ou scanne le QR code, et votre page d’avis s’ouvre sans que vous ayez à la lui montrer.",
      },
    ],
    faq: [
      {
        q: "Faut-il demander des avis Google quand on reçoit déjà des avis sur les plateformes ?",
        a: "Oui. Les avis des plateformes restent sur ces sites, alors que la fiche Google apparaît dans les recherches locales et sur la carte, et peut mener à des réservations en direct. Les deux se complètent.",
      },
      {
        q: "Quand demander un avis dans une chambre d’hôtes ?",
        a: "Au dernier petit-déjeuner ou au moment du départ, en une phrase et sans insister. Pour un gîte où l’on ne croise pas les voyageurs, le livret d’accueil et un message après le départ suffisent.",
      },
      {
        q: "Peut-on offrir un produit maison contre un avis ?",
        a: "Non. Un pot de confiture ou une réduction en échange d’un avis est une contrepartie interdite par Google. Un cadeau d’accueil offert à tous, sans lien avec l’avis, reste possible.",
      },
      {
        q: "Comment répondre à un avis négatif quand on reçoit chez soi ?",
        a: "Prenez du recul avant d’écrire, restez sur les faits, remerciez et indiquez ce que vous avez changé. Signer de votre prénom est bienvenu, mais évitez tout détail personnel sur le séjour du voyageur.",
      },
    ],
    related: [
      "avis-google-hotel",
      "avis-google-camping",
      "repondre-avis-google",
      "qr-code-avis-google",
    ],
  },

  // ── Food truck ─────────────────────────────────────────────────────────────
  {
    slug: "avis-google-food-truck",
    metaTitle: "Avis Google pour un food truck : la méthode · reviu",
    h1: "Obtenir plus d’avis Google pour un food truck",
    description:
      "Food truck : configurer sa fiche Google malgré des emplacements qui changent, demander l’avis pendant l’attente au camion, garder horaires et lieux à jour.",
    excerpt:
      "Un food truck change de place selon les jours, et sa fiche Google doit suivre. Voici comment la tenir à jour et transformer la file d’attente en avis.",
    keywords: [
      "avis google food truck",
      "food truck google maps",
      "fiche google food truck",
      "qr code avis food truck",
      "avis clients food truck",
      "camion restaurant avis google",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un food truck obtient plus d’avis Google en profitant de l’attente : pendant que la commande se prépare, le client a son téléphone en main et rien d’autre à faire. Un support sur le comptoir du camion, une phrase au moment de tendre le plat et une fiche Google à jour sur les emplacements et les horaires suffisent à transformer chaque service en avis.",
      },
      { type: "h2", text: "Une fiche Google pour un commerce qui bouge" },
      {
        type: "p",
        text: "Avant de collecter des avis, il faut une fiche qui tienne la route. Selon les [consignes de Google pour les fiches d’établissement](https://support.google.com/business/answer/3038177?hl=fr), une entreprise qui affiche son adresse doit disposer, à cet endroit, d’une enseigne fixe et permanente à son nom. Un camion qui change de place chaque jour n’est généralement pas dans ce cas. Deux situations :",
      },
      {
        type: "ul",
        items: [
          "Les clients viennent vous trouver dans un lieu fixe, signalé en permanence par votre enseigne : l’adresse de ce lieu peut figurer sur la fiche.",
          "Vous tournez d’un emplacement à l’autre : n’affichez pas l’adresse de votre cuisine ou de votre domicile, où aucun client ne vient. Indiquez plutôt une zone desservie et annoncez vos emplacements par d’autres moyens.",
        ],
      },
      {
        type: "p",
        text: "Dans tous les cas, une seule fiche pour le camion. Créer une fiche par emplacement disperserait vos avis et contreviendrait à la règle d’une fiche par établissement.",
      },
      { type: "h2", text: "Horaires et emplacements à jour : éviter les avis de déception" },
      {
        type: "p",
        text: "L’avis le plus rageant pour un food truck ressemble à « indiqué ouvert, personne sur place ». Il ne porte pas sur la cuisine, mais sur l’information, et il est évitable :",
      },
      {
        type: "ul",
        items: [
          "Indiquez sur la fiche les horaires où vous servez réellement, et ajoutez des horaires exceptionnels pour un jour férié, un marché supplémentaire ou une panne.",
          "Publiez chaque semaine votre planning d’emplacements dans un post Google et sur vos réseaux sociaux.",
          "Utilisez la même photo du camion partout : le client doit le reconnaître de loin sur le parking.",
          "En cas d’annulation de dernière minute (météo, panne), prévenez sur vos réseaux et sur la fiche : un client prévenu se fâche rarement.",
        ],
      },
      { type: "h2", text: "La file d’attente, meilleur moment pour l’avis" },
      {
        type: "p",
        text: "Au restaurant, on propose l’avis à l’addition. Au food truck, le client paie à la commande, puis attend quelques minutes devant le camion, téléphone en main. C’est le temps mort idéal pour remarquer un support, mais il n’a pas encore goûté. D’où une méthode en trois temps :",
      },
      {
        type: "ol",
        items: [
          "Pendant l’attente : le support est visible sur le comptoir. Le client le remarque sans qu’on lui demande rien.",
          "En tendant le plat, une phrase courte : « Bon appétit ! Si vous avez une minute après manger, un avis Google nous aide énormément : approchez votre téléphone ici, ou gardez la carte. »",
          "Pour les habitués du midi, qui reviennent chaque semaine au même endroit : une demande suffit, le support fait ensuite le rappel.",
        ],
      },
      {
        type: "callout",
        title: "Penser au client qui mange sur place",
        text: "Beaucoup de clients mangent à côté du camion, debout ou sur une table pliante. Un QR code sur ces tables, sur le sac ou sur l’emballage les rattrape après le repas, au moment où ils ont vraiment un avis. Vous pouvez le [créer gratuitement](/outils/qr-code-avis-google) et le faire imprimer sur un tampon ou une étiquette.",
      },
      { type: "h2", text: "Le comptoir du camion : où placer le support" },
      {
        type: "ul",
        items: [
          "Sur la tablette du passe-plat, côté client, à hauteur de main : là où l’on paie et où l’on récupère sa commande.",
          "Près du terminal de paiement, mais pas collé à lui, pour que le client ne confonde pas les deux.",
          "Sur le menu affiché sur le flanc du camion : un QR code lisible depuis la file.",
          "Fixé solidement : le camion roule, et le vent souffle sur les places de marché.",
        ],
      },
      { type: "h2", text: "Réseaux sociaux et fiche Google : faire travailler les deux" },
      {
        type: "p",
        text: "Les food trucks vivent beaucoup sur les réseaux sociaux, où ils annoncent leurs emplacements, et leurs abonnés sont souvent leurs clients les plus fidèles. Vous pouvez y partager votre lien d’avis de temps en temps, sans en faire une campagne : « Vous mangez chez nous chaque jeudi ? Votre avis sur Google aide les nouveaux à nous trouver. » Le lien se récupère depuis votre fiche : voyez [comment obtenir votre lien d’avis Google](/guides/lien-avis-google).",
      },
      {
        type: "p",
        text: "Ne lancez pas de jeu concours du type « un avis égale une participation » : c’est une contrepartie déguisée, interdite par Google.",
      },
      { type: "h2", text: "Répondre aux critiques propres au food truck" },
      {
        type: "p",
        text: "Les avis négatifs d’un food truck portent souvent sur l’attente, la portion, le prix ou une absence à un emplacement annoncé. Votre réponse sera lue par des gens qui hésitent à faire la queue.",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Karim, merci pour votre retour et désolés pour l’attente jeudi midi : avec le marché, la file était plus longue que d’habitude et nous n’avons pas tenu le rythme. Nous avons revu l’organisation des commandes pour les jours d’affluence. À bientôt au camion ! »",
      },
      {
        type: "p",
        text: "Si l’avis concerne une absence imprévue, excusez-vous et indiquez où trouver le planning à jour. Pour vous aider à rédiger, utilisez le [générateur de réponses aux avis](/outils/reponse-avis-google).",
      },
      { type: "h2", text: "Erreurs fréquentes des food trucks" },
      {
        type: "ul",
        items: [
          "Créer une fiche par emplacement pour récolter plus d’avis.",
          "Afficher l’adresse du domicile ou de la cuisine comme si les clients pouvaient y venir.",
          "Laisser les horaires d’été en plein hiver.",
          "Offrir une boisson ou un dessert à qui montre son avis publié.",
          "Demander l’avis pendant le rush, au risque de ralentir la file : le support suffit, la phrase attendra un moment plus calme.",
        ],
      },
      { type: "h2", text: "Ce qui distingue le food truck d’un restaurant" },
      {
        type: "p",
        text: "Le food truck cumule les contraintes de la restauration rapide et celles du commerce ambulant : un service court, une clientèle d’habitués du midi, un lieu qui change. L’avis Google y sert à rassurer sur la cuisine, mais aussi à prouver que le camion est fiable, c’est-à-dire là quand il le dit. Pour le volet cuisine et service, notre guide [avis Google pour un restaurant](/guides/avis-google-restaurant) donne d’autres pistes.",
      },
      {
        type: "p",
        text: "Le [Présentoir Reviu](/presentoir-avis-google) se pose sur le comptoir du camion et voyage avec vous : son lien ne change pas d’un emplacement à l’autre, puisqu’il ouvre la page d’avis de votre fiche unique, sans contact ou par QR code.",
      },
    ],
    faq: [
      {
        q: "Un food truck peut-il avoir une fiche Google sans adresse fixe ?",
        a: "Oui. Les consignes de Google réservent l’affichage d’une adresse aux lieux signalés par une enseigne permanente. Un camion sans lieu fixe ne met donc pas en avant l’adresse de sa cuisine ou de son domicile : il indique une zone desservie et annonce ses emplacements par ses posts et ses réseaux sociaux.",
      },
      {
        q: "Quel est le meilleur moment pour demander un avis dans un food truck ?",
        a: "Au moment de tendre le plat, après une attente pendant laquelle le client a vu le support sur le comptoir. Pour ceux qui mangent sur place, un QR code sur les tables ou l’emballage les rattrape après le repas.",
      },
      {
        q: "Comment éviter les avis négatifs liés aux emplacements ?",
        a: "En tenant à jour horaires et horaires exceptionnels sur la fiche, en publiant le planning de la semaine et en prévenant de toute annulation. Ces avis viennent d’une information périmée, pas de la cuisine : ils sont évitables.",
      },
      {
        q: "Peut-on organiser un jeu concours pour obtenir des avis ?",
        a: "Non, si la participation dépend du dépôt d’un avis : c’est une contrepartie, interdite par Google. Un jeu concours sans aucun lien avec les avis reste possible.",
      },
    ],
    related: [
      "avis-google-restaurant",
      "avis-google-bar",
      "qr-code-avis-google",
      "avoir-plus-avis-google",
    ],
  },

  // ── Barbier ────────────────────────────────────────────────────────────────
  {
    slug: "avis-google-barbier",
    metaTitle: "Avis Google pour un barbier : la méthode qui marche · reviu",
    h1: "Obtenir plus d’avis Google pour un barbier",
    description:
      "Barbier : demander un avis Google après la coupe ou la taille de barbe, sans lasser une clientèle fidèle, et articuler avis Google et réservation en ligne.",
    excerpt:
      "Clients fidèles, rendez-vous courts et réguliers, réservation en ligne : le barbier a ses propres règles pour les avis Google. Voici la méthode.",
    keywords: [
      "avis google barbier",
      "avis barbershop",
      "avis google barber",
      "qr code avis barbier",
      "avis clients barbier",
      "répondre avis barbier",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un barbier obtient plus d’avis Google en proposant l’avis une seule fois à chaque client, à la fin de la prestation, quand il découvre son dégradé ou sa barbe dans le miroir, puis en laissant un support visible au poste et à l’accueil pour les visites suivantes. Avec une clientèle qui revient toutes les quelques semaines, l’enjeu n’est pas de demander souvent, mais de demander une fois, au bon moment.",
      },
      {
        type: "p",
        text: "Le barbier n’est pas un salon de coiffure comme les autres. Les prestations sont plus courtes, la clientèle est surtout masculine et très régulière, la réservation passe souvent par une application, et le choix du barbier compte autant que celui de la boutique. Si vous gérez un salon mixte, notre guide [avis Google pour un salon de coiffure](/guides/avis-google-coiffeur) complète celui-ci.",
      },
      { type: "h2", text: "Ce que les clients d’un barbier jugent" },
      {
        type: "ul",
        items: [
          "La précision : netteté du dégradé, symétrie de la barbe, propreté des contours.",
          "La ponctualité : un client qui a réservé un créneau ne veut pas attendre.",
          "L’ambiance : musique, discussion, café proposé, propreté des postes.",
          "Le rasage traditionnel : serviette chaude, confort, geste maîtrisé.",
          "La régularité : retrouver la même coupe d’une visite à l’autre, avec le même barbier ou non.",
          "Le prix et la clarté des tarifs (coupe, barbe, formule complète).",
        ],
      },
      { type: "h2", text: "Le miroir, puis l’accueil : le moment de la demande" },
      {
        type: "p",
        text: "Le pic de satisfaction arrive quand le barbier tend le miroir pour montrer la nuque et les contours. C’est le moment où le client dit « nickel ». La demande se fait juste après, en se levant du fauteuil ou en réglant. Une prestation courte ne laisse pas de temps mort : un support déjà visible vaut mieux qu’un long discours.",
      },
      {
        type: "callout",
        title: "Une seule fois par client",
        text: "Un client fidèle revient souvent, et le solliciter à chaque visite deviendrait pesant. Proposez l’avis à la fin de sa première visite, ou à la prochaine pour vos habitués de longue date, puis laissez le support jouer le rôle de rappel. Personne ne doit se sentir relancé.",
      },
      { type: "h2", text: "Où placer le support dans un barbershop" },
      {
        type: "ul",
        items: [
          "À chaque poste, sous le miroir : le client le voit pendant toute la prestation, sans qu’on en parle.",
          "Au comptoir d’accueil : là où l’on règle, et où les clients qui ont payé en ligne saluent en partant.",
          "Dans l’espace d’attente, si vous prenez des clients sans rendez-vous : un rappel pour les habitués qui patientent.",
        ],
      },
      { type: "h2", text: "Les phrases d’un barbier" },
      {
        type: "ul",
        items: [
          "« Ça vous va derrière ? Si vous êtes content, un petit avis sur Google nous aide à faire connaître la boutique. Approchez juste votre téléphone. »",
          "Au nouveau client venu par la réservation en ligne : « Vous nous avez trouvés en ligne ? Alors vous savez que les avis comptent. Si vous voulez laisser le vôtre, c’est ici. »",
          "Au client fidèle qui n’a jamais laissé d’avis : « Ça fait un moment que vous venez : si un jour vous voulez en parler sur Google, ça aiderait les nouveaux à se décider. »",
        ],
      },
      {
        type: "p",
        text: "Ne demandez pas au client de mentionner le nom de son barbier dans l’avis. C’est tentant dans une boutique à plusieurs fauteuils, mais les [règles des avis Google](/guides/regles-avis-google) interdisent de solliciter des avis au contenu imposé, y compris un élément qui identifie un membre de l’équipe.",
      },
      { type: "h2", text: "Plusieurs barbiers, une fiche : éviter la compétition" },
      {
        type: "p",
        text: "Dans un barbershop à plusieurs fauteuils, certains clients suivent un barbier précis. La tentation : afficher un classement interne, ou fixer à chacun un nombre d’avis à obtenir. Google l’interdit expressément : un établissement ne doit pas demander à son personnel de solliciter un certain nombre d’avis. Une compétition pousserait aussi à insister auprès des clients, l’inverse de ce que l’on cherche.",
      },
      {
        type: "p",
        text: "Mieux vaut une phrase commune, la même pour tous les barbiers, et un objectif collectif simple : que chaque nouveau client voie le support et se voie proposer l’avis une fois.",
      },
      { type: "h2", text: "Réservation en ligne et avis Google : ne pas confondre" },
      {
        type: "p",
        text: "Beaucoup de barbiers utilisent une plateforme de réservation qui recueille ses propres avis après chaque rendez-vous. Ces avis vivent sur la plateforme et ne remplacent pas ceux de votre fiche Google, consultée par qui cherche un barbier sur la carte. Trois réflexes :",
      },
      {
        type: "ul",
        items: [
          "Vérifiez que le lien de réservation figure sur votre fiche Google, et que vos horaires y sont identiques à ceux de la plateforme.",
          "Ne doublez pas les sollicitations : si la plateforme envoie déjà un message après le rendez-vous, n’ajoutez pas votre propre SMS le même jour. La demande en boutique, devant le miroir, suffit.",
          "Si un client se plaint sur Google d’un créneau annulé, répondez en indiquant comment vous joindre directement.",
        ],
      },
      { type: "h2", text: "Répondre aux critiques d’un barbier" },
      {
        type: "p",
        text: "Les critiques typiques : un dégradé raté, un retard malgré la réservation, un prix jugé élevé, une musique trop forte. Pour la coupe ratée, la meilleure réponse propose une retouche, sans débat technique en public. Gardez dans vos réponses le ton de la boutique, détendu mais respectueux.",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Yanis, merci pour votre retour. Désolés que le dégradé ne vous ait pas convenu cette fois. Passez à la boutique quand vous voulez cette semaine, sans rendez-vous : on reprend ça ensemble. L’équipe »",
      },
      {
        type: "p",
        text: "La retouche est proposée sans condition : ne demandez jamais au client de modifier son avis en échange, c’est interdit. Pour un retard, reconnaissez-le sans le mettre sur le dos du client précédent ; pour le prix, expliquez ce que comprend la prestation. Notre [générateur de réponses aux avis](/outils/reponse-avis-google) propose des modèles à adapter.",
      },
      { type: "h2", text: "Erreurs fréquentes en barbershop" },
      {
        type: "ul",
        items: [
          "Redemander l’avis à chaque passage d’un habitué.",
          "Offrir la taille de barbe ou un produit coiffant contre un avis : contrepartie interdite.",
          "Faire laisser des avis par les barbiers eux-mêmes, leurs amis ou d’anciens employés : conflit d’intérêts.",
          "Afficher sur la fiche des horaires différents de ceux de la réservation en ligne.",
          "Rester planté derrière le client pendant qu’il écrit : Google interdit d’exercer une pression pour qu’un avis soit rédigé sur place.",
        ],
      },
      {
        type: "p",
        text: "Un [présentoir avis Google](/presentoir-avis-google) comme le Présentoir Reviu, posé sous le miroir ou à l’accueil, permet au client d’ouvrir votre page d’avis sans contact ou par QR code, le temps de remettre sa veste.",
      },
    ],
    faq: [
      {
        q: "Quand demander un avis Google chez un barbier ?",
        a: "Juste après la prestation, quand le client a vu le résultat dans le miroir, en se levant du fauteuil ou en réglant. Une seule fois par client : ensuite, le support visible au poste sert de rappel.",
      },
      {
        q: "Peut-on demander aux clients de citer le nom de leur barbier dans l’avis ?",
        a: "Non. Les règles de Google interdisent de solliciter des avis au contenu imposé, y compris un élément qui identifie un membre de l’équipe. Le client reste libre de le citer de lui-même.",
      },
      {
        q: "Les avis de la plateforme de réservation suffisent-ils ?",
        a: "Non. Ils restent sur la plateforme et ne remplacent pas les avis de votre fiche Google, qui s’affiche quand on cherche un barbier sur la carte. Les deux se complètent, sans multiplier les sollicitations.",
      },
      {
        q: "Peut-on organiser un concours d’avis entre barbiers ?",
        a: "Non. Google interdit aux établissements de demander à leur personnel de solliciter un nombre défini d’avis. Mieux vaut une phrase commune et un support visible à chaque poste.",
      },
      {
        q: "Comment répondre à un client mécontent de sa coupe ?",
        a: "Remerciez, excusez-vous sans débat technique et proposez une retouche sans condition. Ne demandez jamais de modifier l’avis en échange.",
      },
    ],
    related: [
      "avis-google-coiffeur",
      "avis-google-institut-beaute",
      "repondre-avis-negatif",
      "presentoir-plaque-nfc-avis-google",
    ],
  },
];
