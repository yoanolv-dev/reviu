/**
 * Hub de contenu SEO / GEO.
 *
 * Chaque guide vise une grappe de mots-clés qui entoure l’acte d’achat de reviu
 * (« avoir plus d’avis Google », « plaque NFC avis », « QR code avis »,
 * « avis Google restaurant »…). L’objectif : capter l’intention de recherche en
 * amont, apporter une vraie réponse utile - donc citable par les moteurs
 * génératifs - et diriger vers la boutique. Contenu volontairement conforme aux
 * règles de Google : on invite TOUS les clients à laisser un avis, jamais de
 * filtrage selon la note, aucune statistique inventée.
 *
 * Le contenu est structuré en blocs (h2/h3/paragraphes/listes/encadrés) pour un
 * HTML sémantique propre et pour générer automatiquement le sommaire et le
 * balisage FAQ (JSON-LD).
 */

import { COLLECT_GUIDES } from "@/lib/guides-content/collecte";
import { RULES_GUIDES } from "@/lib/guides-content/regles";
import { TRADE_GUIDES_2 } from "@/lib/guides-content/metiers";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; text: string };

export type Guide = {
  slug: string;
  /** Balise <title> optimisée. */
  metaTitle: string;
  /** Titre H1 affiché. */
  h1: string;
  /** Meta description (< 160 caractères idéalement). */
  description: string;
  /** Chapô affiché + résumé de la carte d’index. */
  excerpt: string;
  keywords: string[];
  category: string;
  readMinutes: number;
  datePublished: string;
  dateModified?: string;
  blocks: GuideBlock[];
  faq: { q: string; a: string }[];
  related: string[];
};

const UPDATED = "2026-07-24";
// Date de dernière révision des guides « par métier » ajoutés fin juillet 2026.
const UPDATED_METIERS = "2026-07-29";

const BASE_GUIDES: Guide[] = [
  {
    slug: "avoir-plus-avis-google",
    metaTitle:
      "Comment avoir plus d’avis Google : le guide complet (2026) · reviu",
    h1: "Comment avoir plus d’avis Google : le guide complet",
    description:
      "Le guide complet pour obtenir plus d’avis Google en 2026 : pourquoi ils comptent, quand demander, quoi dire et les erreurs à éviter - dans les règles de Google.",
    excerpt:
      "Plus d’avis Google, mieux notés, plus souvent : voici la méthode complète pour transformer vos clients satisfaits en avis, sans forcer et dans les règles.",
    keywords: [
      "avoir plus d’avis google",
      "comment avoir des avis google",
      "obtenir des avis google",
      "augmenter ses avis google",
      "demander un avis google",
      "collecter des avis google",
    ],
    category: "Collecter des avis",
    readMinutes: 13,
    datePublished: "2026-07-24",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "Les avis Google sont devenus la première vitrine d’un commerce de proximité. Ils rassurent avant même la première visite, pèsent lourd dans le référencement local, et font souvent la différence entre deux établissements voisins. Pourtant, la plupart des clients satisfaits ne laissent jamais d’avis - non par mauvaise volonté, mais parce que personne ne le leur a demandé au bon moment, et que le parcours est trop long. Ce guide rassemble ce qui fonctionne vraiment pour obtenir plus d’avis Google, durablement et sans enfreindre les règles.",
      },
      { type: "h2", text: "Pourquoi les avis Google sont décisifs pour un commerce local" },
      {
        type: "p",
        text: "Avant d’investir du temps dans la collecte, il faut mesurer ce qui est en jeu. Les avis Google ne sont pas un simple compteur d’étoiles : ils agissent, en même temps, sur votre visibilité, sur la décision d’achat et sur la confiance. Concrètement, quatre effets se cumulent :",
      },
      {
        type: "ul",
        items: [
          "Référencement local : la note, le nombre d’avis et leur fraîcheur comptent parmi les signaux du « pack local » (les trois fiches affichées sur la carte). Voir notre guide sur les [avis et le référencement local](/guides/avis-google-commerce-local).",
          "Taux de clic : face à plusieurs établissements, l’œil va d’abord à la note et au volume d’avis. Une belle fiche capte le clic avant même la visite.",
          "Conversion et confiance : des avis récents et nombreux rassurent, lèvent le doute et déclenchent l’appel, la réservation ou la visite.",
          "Recherche par IA (GEO) : les assistants (ChatGPT, Perplexity, Gemini, aperçus IA de Google) s’appuient sur les avis pour recommander un commerce. Bien noté et souvent commenté, on a plus de chances d’être cité.",
        ],
      },
      {
        type: "p",
        text: "Autrement dit, chaque avis supplémentaire travaille pour vous en continu, 24 h sur 24, sur tous les points de contact où un futur client vous découvre. C’est l’un des rares leviers marketing gratuits, cumulatifs et durables pour un commerce de proximité.",
      },
      { type: "h2", text: "Pourquoi vos clients satisfaits ne laissent pas d’avis" },
      {
        type: "p",
        text: "Un client mécontent est motivé : il veut être entendu. Un client satisfait, lui, repart heureux… et passe à autre chose. C’est le paradoxe de l’avis en ligne : sans sollicitation, la voix des mécontents est surreprésentée. Trois freins expliquent l’essentiel des avis manquants :",
      },
      {
        type: "ul",
        items: [
          "Le moment : on ne pense à demander l’avis ni pendant, ni juste après la visite, quand la satisfaction est à son maximum.",
          "L’effort : chercher l’établissement sur Google, faire défiler, trouver le bouton « Donner un avis »… chaque étape perd des clients.",
          "L’oubli : « je le ferai ce soir » se transforme presque toujours en avis jamais écrit.",
        ],
      },
      {
        type: "p",
        text: "La bonne nouvelle : ces trois freins se lèvent avec une méthode simple. Demander au bon moment, réduire le geste au minimum, et rendre la demande systématique plutôt qu’exceptionnelle.",
      },
      { type: "h2", text: "Récupérer le lien de votre page d’avis Google" },
      {
        type: "p",
        text: "Avant de collecter, il faut le lien direct qui ouvre la fenêtre de rédaction d’avis - celui que vous placerez derrière un QR code, une puce NFC ou un bouton. Depuis votre fiche d’établissement (Google Business Profile) :",
      },
      {
        type: "ol",
        items: [
          "Connectez-vous à votre profil d’établissement Google, avec le compte qui gère la fiche.",
          "Ouvrez l’option « Demander des avis » (ou « Obtenir plus d’avis »).",
          "Copiez le lien court proposé : c’est votre lien d’avis, à diffuser tel quel.",
          "Testez-le sur votre téléphone : il doit ouvrir directement la fenêtre « Noter et décrire votre expérience ».",
        ],
      },
      {
        type: "callout",
        title: "Transformez ce lien en geste physique",
        text: "Un lien seul ne suffit pas : il faut le mettre sous les yeux du client au bon moment. Encodé dans un QR code et une puce NFC sur un support de comptoir, il devient un simple scan. Notre guide dédié explique comment [créer et utiliser un QR code d’avis Google](/guides/qr-code-avis-google).",
      },
      { type: "h2", text: "Le bon moment pour demander un avis" },
      {
        type: "p",
        text: "Le meilleur moment est le pic de satisfaction : juste après un bon repas, une prestation réussie, un achat qui a plu. C’est là que le client a envie de dire merci. Attendre le lendemain, c’est laisser l’enthousiasme retomber. Concrètement :",
      },
      {
        type: "ul",
        items: [
          "[Restaurant, café](/guides/avis-google-restaurant) : au moment de l’addition, quand le client est encore attablé et détendu.",
          "[Salon de coiffure](/guides/avis-google-coiffeur), [garage](/guides/avis-google-garage), prestation : à la remise des clés ou au paiement, quand le résultat est visible.",
          "Boutique, [boulangerie](/guides/avis-google-boulangerie) : à l’encaissement, avec un mot simple et un support à portée de main.",
        ],
      },
      {
        type: "p",
        text: "Le bon moment varie d’un secteur à l’autre : nous avons décliné la méthode métier par métier dans nos [guides par activité](/guides/par-metier), du restaurant au cabinet dentaire.",
      },
      { type: "h2", text: "Réduire le geste au minimum : le levier le plus efficace" },
      {
        type: "p",
        text: "Chaque étape supprimée entre l’envie et l’avis publié augmente le taux de dépôt. L’idéal : un seul geste. C’est exactement le rôle d’un [présentoir posé sur le comptoir, muni d’une puce NFC et d’un QR code](/guides/presentoir-plaque-nfc-avis-google). Le client approche son téléphone ou scanne, et la page d’avis Google de l’établissement s’ouvre directement - pas de recherche, pas de saisie.",
      },
      {
        type: "callout",
        title: "L’idée clé",
        text: "On ne « convainc » pas un client d’écrire un avis : on lui enlève tous les obstacles au moment où il en a déjà envie. Le support physique sur le comptoir fait les deux - il rappelle, et il raccourcit.",
      },
      {
        type: "p",
        text: "Comparé à un lien envoyé par e-mail ou SMS (souvent ignoré ou noyé), le support physique capte le client tant qu’il est présent, motivé et disponible. C’est la différence entre « je le ferai » et « c’est fait ».",
      },
      { type: "h2", text: "Quoi dire pour demander un avis, sans forcer" },
      {
        type: "p",
        text: "Le support fait la moitié du travail ; le mot de l’équipe fait l’autre. Une phrase courte, sincère et sans pression multiplie les dépôts. L’essentiel : proposer, jamais insister, et s’adresser à tous les clients de la même façon. Quelques formulations qui fonctionnent :",
      },
      {
        type: "ul",
        items: [
          "« Si vous avez passé un bon moment, un avis Google nous aide énormément - c’est juste ici, en un scan. »",
          "« Votre avis compte beaucoup pour un commerce comme le nôtre ; ça prend dix secondes. »",
          "« On essaie de faire connaître la maison : un petit mot sur Google, si le cœur vous en dit ? »",
        ],
      },
      {
        type: "callout",
        title: "Le piège à éviter",
        text: "Ne conditionnez jamais la demande à la satisfaction (« si vous avez aimé, laissez un avis, sinon parlez-nous-en »). Filtrer ainsi les avis positifs est une pratique interdite par Google. On invite tout le monde, la note appartient au client.",
      },
      { type: "h2", text: "Les méthodes qui fonctionnent, classées par efficacité" },
      {
        type: "ol",
        items: [
          "Le présentoir sur le comptoir, sans contact et QR code : demande au bon moment, geste unique, rappel permanent. Le meilleur rapport effort/résultat pour un commerce physique.",
          "La demande orale de l’équipe : un « si vous avez aimé, un avis Google nous aide beaucoup » sincère, appuyé par un support à montrer.",
          "Le QR code sur l’addition, le ticket ou le sac : utile en complément, moins immédiat que le comptoir.",
          "L’e-mail / SMS après visite : pertinent pour les prestations avec coordonnées, mais taux de réponse faible et délai qui refroidit l’enthousiasme.",
        ],
      },
      { type: "h2", text: "Impliquer et former votre équipe" },
      {
        type: "p",
        text: "La collecte devient régulière quand toute l’équipe s’en empare, pas seulement le gérant. Il ne s’agit pas de forcer, mais de créer un réflexe partagé. Quatre points suffisent :",
      },
      {
        type: "ol",
        items: [
          "Une phrase commune, courte, que chacun connaît et adapte à sa manière.",
          "Un geste unique à montrer : approcher le téléphone du présentoir, ou scanner le QR.",
          "Le bon déclencheur : le moment du paiement ou du départ, jamais avant.",
          "Aucune pression : on propose une fois, avec le sourire, et l’on n’insiste pas.",
        ],
      },
      { type: "h2", text: "Répondre aux avis : la seconde moitié du travail" },
      {
        type: "p",
        text: "Collecter ne suffit pas : la façon dont vous [répondez aux avis](/guides/repondre-avis-google) pèse tout autant, aux yeux des clients comme de Google. Une réponse soignée valorise un client satisfait et montre, face à une critique, que vous êtes attentif. Nos guides détaillent comment [répondre à un avis négatif](/guides/repondre-avis-negatif) sans s’enflammer, et quoi faire pour [signaler un faux avis](/guides/supprimer-faux-avis-google). L’ensemble de ce volet est réuni dans le hub [gérer sa réputation](/guides/gerer-sa-reputation).",
      },
      { type: "h2", text: "Les règles de Google à respecter (sous peine de sanction)" },
      {
        type: "p",
        text: "Google interdit certaines pratiques, et le non-respect peut coûter la suppression des avis, voire de la fiche. Trois principes à garder en tête :",
      },
      {
        type: "ul",
        items: [
          "Pas de filtrage selon la note (« review gating ») : on ne peut pas réserver la demande d’avis Google aux seuls clients contents. Le bouton doit être proposé à tous.",
          "Pas d’avis contre récompense : offrir une réduction ou un cadeau en échange d’un avis est interdit.",
          "Pas de faux avis : ni achetés, ni écrits par l’équipe, ni rédigés depuis le point de vente en masse.",
        ],
      },
      {
        type: "callout",
        title: "Conformité by design",
        text: "reviu propose le bouton « Avis Google » à tous les clients, sans tri selon la note. Un canal de contact privé est offert en complément - jamais comme un filtre pour éviter les avis négatifs. C’est la façon saine de collecter : plus d’avis, et des avis qui restent.",
      },
      {
        type: "p",
        text: "Attention, enfin, aux raccourcis qui se retournent contre vous. Acheter des avis ou en faire écrire par ses proches peut sembler tentant pour démarrer, mais Google détecte et sanctionne ces pratiques - et une note gonflée artificiellement finit par coûter plus cher qu’elle ne rapporte. La seule voie durable pour [faire monter sa note](/guides/augmenter-note-google) est le volume d’avis authentiques.",
      },
      { type: "h2", text: "Mesurer pour progresser" },
      {
        type: "p",
        text: "Ce qui se mesure s’améliore. Sans chiffres, on ne sait pas quel emplacement ni quel discours fonctionne. Quelques indicateurs simples suffisent à piloter la collecte :",
      },
      {
        type: "ul",
        items: [
          "Le nombre de scans par semaine, et leur évolution dans le temps.",
          "La répartition entre le canal NFC et le QR code, pour savoir ce que préfèrent vos clients.",
          "Le taux de clic vers Google (combien de scans aboutissent réellement sur la fiche).",
          "Le nombre et la fraîcheur des nouveaux avis, établissement par établissement.",
        ],
      },
      {
        type: "p",
        text: "Un [tableau de bord](/#produits) qui distingue ces canaux transforme la collecte en boucle d’amélioration : on teste un emplacement, on compare, on garde ce qui marche.",
      },
      { type: "h2", text: "Les erreurs fréquentes à éviter" },
      {
        type: "ul",
        items: [
          "Ne demander qu’une fois par an, lors d’une opération ponctuelle, au lieu d’en faire une habitude.",
          "Compter uniquement sur l’e-mail, alors que le comptoir capte le client au meilleur moment.",
          "Réserver la demande aux clients qu’on croit contents : c’est du filtrage, interdit par Google.",
          "Oublier de répondre aux avis, surtout aux négatifs, et laisser la fiche paraître à l’abandon.",
          "Ne rien mesurer, et donc ne jamais savoir ce qui fait vraiment progresser la note.",
        ],
      },
      { type: "h2", text: "Mettre en place une routine durable" },
      {
        type: "p",
        text: "Obtenir des avis n’est pas une opération ponctuelle, c’est une habitude. Les établissements qui progressent le plus sont ceux qui ont intégré la demande dans leur service quotidien : le support est visible en permanence, l’équipe sait quoi dire, et l’on suit les résultats pour ajuster. Un [tableau de bord](/#produits) (scans, clics vers Google, canal NFC ou QR) transforme cette routine en boucle d’amélioration.",
      },
      {
        type: "p",
        text: "En combinant bon moment, geste unique et régularité, un commerce passe de quelques avis par an à un flux régulier - celui qui fait grimper la note, le [classement local](/guides/avis-google-commerce-local), et la confiance des nouveaux clients.",
      },
    ],
    faq: [
      {
        q: "Combien d’avis Google faut-il pour être crédible ?",
        a: "Il n’y a pas de seuil magique, mais un volume régulier et récent compte plus qu’un gros chiffre figé. Un commerce local gagne déjà énormément à dépasser la dizaine d’avis récents : la fraîcheur et la régularité rassurent autant que la quantité.",
      },
      {
        q: "Peut-on demander un avis Google à ses clients ?",
        a: "Oui. Google encourage les établissements à solliciter des avis authentiques auprès de leurs clients. Ce qui est interdit, c’est de filtrer selon la note, de rémunérer un avis, ou de publier de faux avis.",
      },
      {
        q: "Un QR code ou une puce NFC, est-ce vraiment plus efficace qu’un e-mail ?",
        a: "Dans un commerce physique, oui, très largement : le support capte le client au moment où il est satisfait et disponible, sans délai ni recherche. L’e-mail arrive plus tard, quand l’enthousiasme est retombé, et se perd souvent dans la boîte de réception.",
      },
      {
        q: "Comment obtenir le lien pour laisser un avis Google ?",
        a: "Depuis votre fiche d’établissement (Google Business Profile), ouvrez « Demander des avis » : Google vous fournit un lien court qui ouvre directement la fenêtre de rédaction. C’est ce lien que vous placez derrière un QR code, une puce NFC ou un bouton.",
      },
      {
        q: "Est-il légal d’offrir une réduction contre un avis Google ?",
        a: "Non. Offrir une contrepartie (réduction, cadeau, boisson) en échange d’un avis est interdit par Google et peut entraîner la suppression des avis, voire de la fiche. On peut fidéliser un client, jamais rémunérer l’avis lui-même.",
      },
      {
        q: "À quelle fréquence faut-il demander des avis à ses clients ?",
        a: "En continu, plutôt que par vagues : quelques avis chaque semaine valent mieux qu’un pic ponctuel suivi d’un long silence. La régularité et la fraîcheur rassurent les clients et sont appréciées de Google. Un support permanent sur le comptoir rend cette régularité naturelle.",
      },
      {
        q: "Les avis Google améliorent-ils vraiment le référencement local ?",
        a: "Oui : la note, le nombre d’avis et leur fraîcheur comptent parmi les signaux qui influencent le classement dans le « pack local » (les fiches affichées sur la carte). Ils ne font pas tout, mais un flux d’avis récents renforce nettement la visibilité locale.",
      },
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "qr-code-avis-google",
      "avis-google-commerce-local",
      "augmenter-note-google",
    ],
  },

  {
    slug: "presentoir-plaque-nfc-avis-google",
    metaTitle: "Plaque et présentoir NFC avis Google : le guide · reviu",
    h1: "Plaque et présentoir NFC pour avis Google : comment ça marche",
    description:
      "Plaque ou présentoir NFC pour avis Google : fonctionnement de la puce, compatibilité, formats, critères d’une bonne solution et installation en boutique.",
    excerpt:
      "La puce NFC transforme un geste, approcher le téléphone, en avis Google. Voici comment elle fonctionne, quel format choisir, ce qui compte vraiment et comment éviter la carte NFC « morte ».",
    keywords: [
      "plaque nfc avis google",
      "présentoir avis google",
      "carte nfc avis google",
      "présentoir nfc",
      "support avis google",
      "autocollant nfc avis google",
    ],
    category: "Le présentoir",
    readMinutes: 7,
    datePublished: "2026-07-24",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Une plaque ou un présentoir NFC pour avis Google est un support posé en boutique qui contient une puce sans contact : quand le client approche son téléphone, votre page d’avis Google s’ouvre, sans application ni recherche. Un QR code imprimé sur le même support prend le relais pour les téléphones qui ne lisent pas la puce. La qualité d’une solution se juge surtout à ce qu’il y a derrière : un lien modifiable, des statistiques, et pas d’abonnement caché.",
      },
      {
        type: "p",
        text: "Ce guide explique le fonctionnement, les formats, les critères de choix et l’installation. Pour les tarifs pratiqués, voyez notre guide sur le [prix d’une plaque avis Google](/guides/prix-plaque-avis-google).",
      },
      { type: "h2", text: "Comment fonctionne la puce NFC" },
      {
        type: "p",
        text: "La NFC (communication en champ proche) est la famille de technologies utilisée pour le paiement sans contact. La puce intégrée au support est passive : elle n’a ni pile ni batterie, c’est le champ émis par le téléphone qui l’alimente le temps de la lecture. Elle contient une simple adresse web. Quand un smartphone compatible passe à quelques centimètres, il lit cette adresse et propose de l’ouvrir, par une notification ou directement dans le navigateur.",
      },
      {
        type: "p",
        text: "La puce ne collecte rien sur le téléphone du client et ne déclenche aucun paiement : elle transmet un lien, exactement comme un QR code, mais sans avoir à viser.",
      },
      { type: "h2", text: "Quels téléphones lisent une plaque NFC" },
      {
        type: "p",
        text: "La lecture des puces NFC sans application est prise en charge par les iPhone récents (à partir de l’iPhone XS) et par la grande majorité des smartphones Android équipés du NFC. Quelques précautions toutefois :",
      },
      {
        type: "ul",
        items: [
          "Sur iPhone, le téléphone doit être déverrouillé, écran allumé ; la lecture peut être suspendue quand l’appareil photo ou le portefeuille de paiement est ouvert.",
          "Sur Android, le NFC doit être activé dans les réglages : il l’est souvent par défaut, mais pas toujours.",
          "La zone de lecture varie : vers le haut de l’appareil sur iPhone, souvent au centre du dos sur Android.",
          "Une coque épaisse, métallique ou contenant des cartes peut gêner la lecture.",
        ],
      },
      {
        type: "p",
        text: "C’est pour toutes ces raisons qu’un bon support comporte aussi un QR code : le client qui n’obtient rien en approchant son téléphone le scanne, sans chercher plus loin. Pour comparer les deux technologies point par point, voyez notre guide [NFC ou QR code pour les avis Google](/guides/nfc-ou-qr-code-avis-google).",
      },
      { type: "h2", text: "Plaque, présentoir, carte ou autocollant : quel format choisir" },
      {
        type: "ul",
        items: [
          "Le présentoir de comptoir : autoportant, il se pose près de la caisse, côté client, et se déplace facilement. C’est le format le plus polyvalent pour un commerce de proximité.",
          "La plaque murale ou adhésive : fixée au mur ou au comptoir, elle ne bouge plus, d’où l’importance de bien choisir son emplacement, à hauteur de main.",
          "La carte NFC : pratique pour un professionnel itinérant qui la tend au client, mais elle se perd ou s’abîme plus vite.",
          "L’autocollant NFC : discret et peu coûteux, à coller sur une table ou un menu. Évitez de le placer sur le terminal de paiement ou juste à côté, pour ne pas mélanger les deux gestes sans contact.",
        ],
      },
      {
        type: "p",
        text: "Dans tous les cas, le support doit annoncer clairement son usage (« Laissez-nous un avis Google ») et montrer où approcher le téléphone : une puce invisible et sans indication ne sert à rien. Pour l’affichage complémentaire, notre guide du [QR code avis Google](/guides/qr-code-avis-google) précise tailles et emplacements.",
      },
      { type: "h2", text: "Le piège de la carte NFC « morte »" },
      {
        type: "p",
        text: "Beaucoup de cartes NFC vendues en ligne encodent en dur le lien de votre fiche Google. Le jour où vous changez d’enseigne, où le lien évolue ou si vous voulez rediriger ailleurs, la carte devient inutilisable : il faut tout racheter et réimprimer. C’est la carte « morte », figée à jamais.",
      },
      {
        type: "p",
        text: "La solution durable consiste à encoder une adresse intermédiaire dont la destination se pilote à distance. L’objet reste le même, mais vous changez où il pointe quand vous voulez. C’est ce qui distingue un présentoir « intelligent » d’une simple carte imprimée.",
      },
      { type: "h2", text: "Les critères d’une bonne solution" },
      {
        type: "ul",
        items: [
          "Un lien modifiable à distance : vous changez la destination sans réimprimer ni racheter le support.",
          "Un QR code de secours sur le même support, pour les téléphones sans NFC ou dont le NFC est désactivé.",
          "Des statistiques : nombre de scans, distinction entre sans contact et QR code, pour savoir quel emplacement fonctionne.",
          "Pas d’abonnement obligatoire : vérifiez que le lien continue de fonctionner si vous ne payez rien après l’achat.",
          "Une invitation conforme aux règles de Google : le bouton d’avis proposé à tous, sans filtre selon la note.",
          "Un objet robuste et présentable : il vit sur un comptoir, il doit tenir et donner envie.",
        ],
      },
      {
        type: "callout",
        title: "Les questions à poser avant d’acheter",
        text: "« Si je ne paie rien après l’achat, le lien inscrit dans la plaque fonctionne-t-il toujours ? » et « Qui peut modifier sa destination, et comment ? ». Des réponses claires sur ces deux points valent plus que tous les arguments de design.",
      },
      { type: "h2", text: "Installation et emplacement en boutique" },
      {
        type: "ol",
        items: [
          "Activez le support selon la procédure du fabricant : en général, on le scanne, puis on y associe le lien de sa fiche Google.",
          "Testez-le avec plusieurs téléphones, au moins un iPhone et un Android, en sans contact puis en QR code.",
          "Posez-le côté client, à portée de main, près de l’endroit où l’on paie.",
          "Évitez les surfaces métalliques, qui peuvent gêner la lecture de la puce, et les zones de passage.",
          "Expliquez le geste à l’équipe, avec une phrase commune pour inviter tous les clients.",
        ],
      },
      {
        type: "p",
        text: "Si un téléphone ne réagit pas, notre guide [plaque NFC avis Google qui ne fonctionne pas](/guides/plaque-nfc-avis-google-ne-fonctionne-pas) passe en revue les causes et les solutions.",
      },
      { type: "h2", text: "Ce que le présentoir ne fait pas à votre place" },
      {
        type: "p",
        text: "Un support, même bien placé, ne remplace pas l’invitation : les clients le voient, mais une phrase simple au moment de payer reste le meilleur déclencheur. Il ne fait pas non plus disparaître les avis négatifs : il rend votre note plus représentative, en donnant la parole à tous vos clients et pas seulement à ceux qui ont une réclamation. La méthode complète pour [obtenir plus d’avis Google](/guides/avoir-plus-avis-google) détaille les mots et les moments qui fonctionnent.",
      },
      { type: "h2", text: "Un exemple concret : lien permanent et achat unique" },
      {
        type: "p",
        text: "Le [Présentoir Reviu](/presentoir-avis-google) réunit puce NFC et QR code sur une même adresse r.reviu.fr permanente, dont vous changez la destination à distance. Il s’achète une fois (29,90 €), sans abonnement, et l’espace Reviu est inclus : statistiques de scans sans contact et QR distinguées, gestion des présentoirs, modification du lien à tout moment. Vous choisissez aussi le comportement au scan : accès direct à votre page d’avis Google, ou page à votre nom avec le bouton d’avis proposé à tous et, si vous le souhaitez, un canal de contact en complément.",
      },
    ],
    faq: [
      {
        q: "Faut-il une application pour lire un présentoir NFC ?",
        a: "Non. Les iPhone récents et la grande majorité des Android équipés du NFC lisent la puce sans application : le client approche simplement son téléphone. Pour les appareils non compatibles ou dont le NFC est désactivé, le QR code imprimé prend le relais.",
      },
      {
        q: "Quelle différence entre une plaque, un présentoir et une carte NFC ?",
        a: "La technologie est la même, seul le format change. Le présentoir se pose sur le comptoir et se déplace, la plaque se fixe au mur ou au comptoir, la carte se tend au client et convient aux professionnels itinérants. Pour un commerce avec une caisse, le présentoir est le plus polyvalent.",
      },
      {
        q: "Peut-on changer le lien d’une plaque NFC après l’achat ?",
        a: "Cela dépend de la solution. Si la puce contient directement le lien Google, il faut la réencoder ou la remplacer. Si elle pointe vers une adresse de redirection, vous changez la destination à distance, sans toucher au support.",
      },
      {
        q: "Une plaque NFC fonctionne-t-elle posée sur une surface métallique ?",
        a: "Le métal peut perturber la lecture de la puce. Mieux vaut poser le support sur du bois, du verre ou du plastique, ou l’éloigner un peu du métal. Le QR code, lui, n’est pas concerné.",
      },
      {
        q: "Y a-t-il des frais récurrents ?",
        a: "Cela dépend du fournisseur : certaines solutions fonctionnent par abonnement, d’autres par achat unique. Vérifiez avant d’acheter ce que devient le lien si vous ne payez rien après l’achat. Le Présentoir Reviu s’achète une fois, sans abonnement, espace de suivi inclus.",
      },
      {
        q: "La puce NFC peut-elle lire des données du téléphone du client ?",
        a: "Non. La puce d’un présentoir est passive : elle transmet seulement une adresse web au téléphone qui s’en approche, comme le ferait un QR code. Le client voit la page s’ouvrir et reste libre de laisser un avis ou non.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "avis-google-commerce-local",
      "avis-google-restaurant",
    ],
  },

  {
    slug: "qr-code-avis-google",
    metaTitle: "QR code avis Google : le créer et bien le placer · reviu",
    h1: "QR code avis Google : le créer et l’utiliser en boutique",
    description:
      "Créer un QR code d’avis Google pour votre boutique : celui de Google ou un générateur, statique ou dynamique, taille, emplacement et erreurs d’impression.",
    excerpt:
      "Un QR code bien placé transforme une visite en avis en un scan. Voici comment l’obtenir, quelle taille choisir, où l’afficher et quelles erreurs d’impression éviter.",
    keywords: [
      "qr code avis google",
      "générer qr code avis google",
      "qr code avis client",
      "créer qr code avis",
      "qr code fiche google",
      "taille qr code avis google",
    ],
    category: "Collecter des avis",
    readMinutes: 7,
    datePublished: "2026-07-24",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour créer un QR code d’avis Google, récupérez le lien de demande d’avis de votre fiche d’établissement (Google propose aussi son propre QR code, depuis un ordinateur), puis imprimez-le assez grand et placez-le là où le client attend quelques secondes, idéalement près de la caisse. Le reste tient à quelques détails : un contraste net, un message clair et un support qui dure.",
      },
      {
        type: "p",
        text: "Le QR code fait sauter l’obstacle principal du dépôt d’avis : chercher votre établissement sur Google puis le bon bouton. Ce guide porte sur son usage en boutique ; pour produire le fichier lui-même, notre [générateur de QR code avis Google](/outils/qr-code-avis-google) fait le travail gratuitement, sans inscription.",
      },
      { type: "h2", text: "Récupérer le bon lien d’avis" },
      {
        type: "ol",
        items: [
          "Connectez-vous à votre fiche d’établissement Google (business.google.com) avec le compte qui la gère.",
          "Sélectionnez « Voir les avis », puis l’icône de partage associée à « Recevoir plus d’avis » (le libellé peut varier selon l’interface, par exemple « Demander des avis »).",
          "Copiez le lien proposé : il ouvre directement la fenêtre de rédaction d’avis de votre établissement.",
          "Testez-le sur un téléphone qui n’est pas connecté à votre compte, pour voir exactement ce que verra un client.",
        ],
      },
      {
        type: "p",
        text: "Si l’option n’apparaît pas, notre guide pour [trouver son lien d’avis Google](/guides/lien-avis-google) détaille les autres méthodes, dont celle du Place ID.",
      },
      { type: "h2", text: "Le QR code proposé par Google dans votre fiche" },
      {
        type: "p",
        text: "Google permet aussi de générer un QR code de demande d’avis, au même endroit que le lien. Selon sa page d’aide [Créer un lien ou un QR code pour demander des avis](https://support.google.com/business/answer/16816815?hl=fr), ce QR code ne peut pour le moment être généré que depuis un navigateur sur ordinateur : il s’enregistre par un clic droit sur l’image, puis « Enregistrer l’image sous ».",
      },
      {
        type: "p",
        text: "C’est une solution simple et officielle, qui suffit pour un premier affichage. En revanche, vous ne pouvez pas changer la destination de ce QR code, la page d’aide ne mentionne aucune statistique de scan, et l’image seule ne porte aucun message pour le client : il vous reste à la mettre en page.",
      },
      { type: "h2", text: "Créer le QR code avec un générateur" },
      {
        type: "p",
        text: "Un générateur part du même lien d’avis, ou de votre Place ID, et produit un fichier à imprimer. Le nôtre fournit le QR en PNG ou en SVG, ainsi qu’une affiche ou un autocollant prêts à imprimer ; le SVG, vectoriel, reste net à toutes les tailles, ce que préfèrent les imprimeurs. Quel que soit l’outil, vérifiez que le QR ouvre bien la fenêtre d’avis (et non la simple fiche), et qu’il ne porte ni publicité ni filigrane envahissant.",
      },
      { type: "h2", text: "QR statique ou QR dynamique : ne vous trompez pas" },
      {
        type: "p",
        text: "Un générateur gratuit produit le plus souvent un QR statique : le lien est inscrit dans le motif, définitivement. Si votre lien change, si vous déménagez ou changez de nom, le QR imprimé est bon à jeter. Un QR dynamique, lui, pointe vers une adresse intermédiaire : vous modifiez la destination sans réimprimer.",
      },
      {
        type: "ul",
        items: [
          "Statique : gratuit et indépendant de tout service tiers, il fonctionne tant que le lien Google reste valide. Mais il ne se modifie pas et ne compte rien.",
          "Dynamique : la destination se change à distance et les scans peuvent être comptés. En contrepartie, il dépend du service qui gère la redirection : si celui-ci disparaît ou suspend votre compte, le QR imprimé cesse de fonctionner.",
        ],
      },
      {
        type: "callout",
        title: "Le piège du QR dynamique « gratuit »",
        text: "Certains services offrent un QR dynamique pendant une période d’essai, puis le désactivent faute d’abonnement. Avant d’imprimer un support censé durer des années, lisez les conditions : qui détient l’adresse de redirection, et que devient-elle si vous arrêtez de payer ?",
      },
      { type: "h2", text: "Quelle taille et quel emplacement en boutique" },
      {
        type: "p",
        text: "Une règle empirique suffit pour la taille : comptez environ 1 cm de côté pour 10 cm de distance de lecture. Le tableau détaillé par support (ticket, autocollant, affiche A5 ou A4) figure sur la page du générateur citée plus haut. Pour l’emplacement, pensez aux endroits où le client est disponible :",
      },
      {
        type: "ul",
        items: [
          "Près du terminal de paiement : le client a déjà son téléphone en main.",
          "Sur le comptoir, dans un présentoir à hauteur des yeux, tourné vers le client.",
          "Sur le ticket, le sac ou la facture : un rappel pour ceux qui préfèrent laisser leur avis plus tard.",
          "En vitrine : utile pour les habitués, à condition que le QR soit assez grand pour être lu depuis le trottoir.",
          "En restauration, sur la table, la carte ou dans le porte-addition.",
        ],
      },
      {
        type: "p",
        text: "La règle : le QR doit se trouver là où le client est satisfait et a quelques secondes devant lui, pas dans un couloir de passage ni derrière le comptoir.",
      },
      { type: "h2", text: "Les erreurs d’impression qui rendent un QR illisible" },
      {
        type: "ul",
        items: [
          "Un QR trop petit pour la distance de lecture, ou posé trop loin du client.",
          "Un contraste insuffisant : gris clair sur blanc, couleurs pastel, ou motif clair sur fond foncé, que certains lecteurs reconnaissent mal.",
          "Une marge blanche rognée : le QR a besoin d’une zone vide autour de lui pour être détecté.",
          "Un logo trop grand au centre, ou un motif trop stylisé par souci d’esthétique.",
          "Un support brillant ou une plastification qui crée des reflets sous l’éclairage du magasin.",
          "Une image étirée ou pixelisée, faute d’avoir utilisé un fichier vectoriel.",
        ],
      },
      {
        type: "p",
        text: "Avant de lancer un tirage, imprimez un exemplaire, posez-le à l’emplacement prévu et scannez-le avec un iPhone et un Android, à la distance réelle du client. Ce test de quelques minutes évite de jeter une série d’affiches.",
      },
      { type: "h2", text: "Accompagner le QR d’un message clair" },
      {
        type: "p",
        text: "Un QR seul intrigue mais ne suffit pas toujours. Une phrase courte et honnête aide à passer à l’acte : « Votre avis nous aide beaucoup : scannez pour nous laisser un mot sur Google ». Pour les clients moins à l’aise, indiquez aussi le geste : « ouvrez l’appareil photo et visez le code ».",
      },
      {
        type: "p",
        text: "Restez sincère et proposez-le à tout le monde. Pas de « seulement si vous avez aimé » : les [règles de Google](https://support.google.com/contributionpolicy/answer/7400114?hl=fr) interdisent de solliciter des avis positifs de façon sélective, comme de proposer un avantage en échange d’un avis.",
      },
      { type: "h2", text: "QR code et sans contact : combiner les deux" },
      {
        type: "p",
        text: "Le QR code demande d’ouvrir l’appareil photo et de viser ; le sans contact se contente d’approcher le téléphone, comme pour payer. Les deux se complètent : le geste sans contact est plus rapide pour les téléphones qui le permettent, le QR reste la solution universelle. Notre comparatif [NFC ou QR code pour les avis Google](/guides/nfc-ou-qr-code-avis-google) détaille les atouts de chacun, et le guide des [plaques et présentoirs NFC](/guides/presentoir-plaque-nfc-avis-google) explique le fonctionnement de la puce.",
      },
      {
        type: "p",
        text: "Un support qui réunit les deux, comme le [Présentoir Reviu](/presentoir-avis-google), garde la même adresse pour le QR et le sans contact : vous modifiez la destination quand vous voulez, et votre espace distingue les scans de chaque canal.",
      },
    ],
    faq: [
      {
        q: "Comment créer un QR code pour les avis Google gratuitement ?",
        a: "Depuis votre fiche d’établissement, sur un ordinateur : « Voir les avis », puis l’icône de partage de « Recevoir plus d’avis », qui propose un lien et un QR code. Vous pouvez aussi coller ce lien dans un générateur gratuit pour obtenir une affiche prête à imprimer.",
      },
      {
        q: "Google fournit-il lui-même un QR code pour les avis ?",
        a: "Oui. La fiche d’établissement propose un QR code de demande d’avis, au même endroit que le lien à partager. Selon l’aide de Google, il ne peut pour le moment être généré que depuis un navigateur sur ordinateur.",
      },
      {
        q: "Quelle taille doit faire un QR code d’avis ?",
        a: "Comptez environ 1 cm de côté pour 10 cm de distance de lecture : 2 cm sur un ticket ou une carte, 4 à 5 cm sur un autocollant, 8 à 10 cm sur une affiche posée au comptoir. Testez toujours à la distance réelle du client avant d’imprimer en série.",
      },
      {
        q: "Quelle différence entre un QR code statique et dynamique ?",
        a: "Le statique contient directement votre lien : il est gratuit et ne dépend d’aucun service, mais il ne se modifie pas. Le dynamique passe par une adresse intermédiaire : la destination se change sans réimprimer et les scans peuvent être comptés, mais il dépend du service qui gère cette adresse.",
      },
      {
        q: "Le QR code fonctionne-t-il sur tous les téléphones ?",
        a: "Oui. L’appareil photo des iPhone et des Android récents détecte les QR codes sans application dédiée. C’est ce qui en fait un complément universel au geste sans contact.",
      },
      {
        q: "Un QR code d’avis Google peut-il expirer ?",
        a: "Un QR code statique n’expire pas : il fonctionne tant que le lien qu’il contient reste valide. Un QR code dynamique peut en revanche cesser de fonctionner si le service qui gère la redirection s’arrête ou si l’abonnement associé prend fin.",
      },
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "avoir-plus-avis-google",
      "avis-google-commerce-local",
      "avis-google-boutique",
    ],
  },

  {
    slug: "avis-google-commerce-local",
    metaTitle:
      "Avis Google : pourquoi ils comptent pour un commerce · reviu",
    h1: "Pourquoi les avis Google sont décisifs pour un commerce local",
    description:
      "Référencement local, taux de clic, confiance : ce que les avis Google changent concrètement pour un commerce de proximité, et comment en tirer parti.",
    excerpt:
      "Note, nombre et fraîcheur des avis pèsent sur votre visibilité locale et sur la décision d’entrer. Voici pourquoi, et comment en faire un avantage.",
    keywords: [
      "importance des avis google",
      "avis google commerce",
      "référencement local avis google",
      "avis google entreprise",
      "note google commerce",
    ],
    category: "Comprendre",
    readMinutes: 7,
    datePublished: "2026-07-24",
    dateModified: UPDATED,
    blocks: [
      {
        type: "p",
        text: "Pour un commerce de proximité, les avis Google ne sont pas un détail cosmétique : ils influencent à la fois la visibilité dans les résultats locaux et la décision d’entrer. Comprendre ce qu’ils changent, concrètement, aide à en faire une priorité plutôt qu’une corvée. Voici les mécanismes, sans jargon.",
      },
      { type: "h2", text: "Les avis pèsent sur le référencement local" },
      {
        type: "p",
        text: "Quand quelqu’un cherche « restaurant près de moi » ou « garage à Nîmes », Google affiche un « pack local » : trois établissements sur une carte, en tête de page. Le classement dans ce pack dépend de plusieurs signaux, et les avis en font partie. La note moyenne, le nombre d’avis, leur fraîcheur et même les mots qu’ils contiennent alimentent la pertinence perçue de votre fiche.",
      },
      {
        type: "callout",
        title: "Un cercle vertueux",
        text: "Plus d’avis récents → meilleure visibilité locale → plus de visites → plus d’avis. Le point de départ, c’est la collecte régulière. Une fois lancée, la dynamique s’auto-entretient.",
      },
      { type: "h2", text: "Les avis décident du clic - et de la visite" },
      {
        type: "p",
        text: "Être visible ne suffit pas : encore faut-il être choisi. Face à trois établissements côte à côte, l’œil va à la note et au nombre d’avis. Une fiche à 4,7 avec 120 avis récents inspire davantage qu’une fiche à 4,9 avec 6 avis datés. Le client arbitre en quelques secondes, et les avis sont son principal raccourci de confiance.",
      },
      { type: "h2", text: "Fraîcheur et volume comptent autant que la note" },
      {
        type: "ul",
        items: [
          "La note donne le niveau de qualité perçu.",
          "Le volume donne la crédibilité : beaucoup d’avis, c’est beaucoup de clients - donc un risque perçu plus faible.",
          "La fraîcheur prouve que l’établissement est actif et régulier aujourd’hui, pas seulement il y a trois ans.",
        ],
      },
      {
        type: "p",
        text: "C’est pourquoi une collecte continue vaut mieux qu’un pic ponctuel : mieux vaut quelques avis chaque semaine qu’une vague unique suivie d’un long silence.",
      },
      { type: "h2", text: "Les avis nourrissent aussi la recherche par IA (GEO)" },
      {
        type: "p",
        text: "Les assistants de recherche (ChatGPT, Perplexity, Gemini, aperçus IA de Google) s’appuient de plus en plus sur les avis et les fiches d’établissement pour recommander un commerce. Un établissement bien noté, souvent cité et régulièrement commenté a plus de chances d’être proposé dans ces réponses génératives. Soigner ses avis, c’est aussi préparer cette nouvelle vitrine.",
      },
      { type: "h2", text: "Comment transformer ce constat en avantage" },
      {
        type: "ol",
        items: [
          "Rendez la [demande d’avis](/guides/avoir-plus-avis-google) systématique, au moment du paiement.",
          "Réduisez le geste au minimum avec un [présentoir sans contact (NFC) sur le comptoir](/guides/presentoir-plaque-nfc-avis-google).",
          "[Répondez aux avis](/guides/repondre-avis-google), positifs comme négatifs, pour montrer que vous êtes attentif.",
          "Suivez vos chiffres (scans, clics vers Google) pour ajuster ce qui marche.",
        ],
      },
      {
        type: "p",
        text: "Un commerce qui applique ces quatre points ne subit plus ses avis : il les construit. Et cette régularité se voit - dans le classement local, dans le taux de visite, et bientôt dans les recommandations des assistants IA.",
      },
    ],
    faq: [
      {
        q: "Les avis Google améliorent-ils vraiment le référencement local ?",
        a: "Oui, ils font partie des signaux qui alimentent le classement dans le pack local de Google : note, volume, fraîcheur et contenu des avis contribuent à la pertinence perçue de votre fiche. Ils ne remplacent pas les autres facteurs, mais ils pèsent nettement.",
      },
      {
        q: "Vaut-il mieux beaucoup d’avis ou une très bonne note ?",
        a: "Les deux comptent, mais le volume et la fraîcheur crédibilisent la note. Une excellente note sur très peu d’avis anciens rassure moins qu’une très bonne note sur de nombreux avis récents.",
      },
      {
        q: "Faut-il répondre à tous les avis ?",
        a: "Idéalement oui. Répondre montre que vous êtes attentif, valorise les clients satisfaits et désamorce les avis négatifs. C’est aussi un signal d’activité apprécié.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-garage",
      "avis-google-boutique",
    ],
  },

  {
    slug: "repondre-avis-google",
    metaTitle:
      "Répondre aux avis Google : méthode et exemples · reviu",
    h1: "Répondre aux avis Google : positifs et négatifs, avec exemples",
    description:
      "Comment répondre aux avis Google, bons comme mauvais : la méthode, les erreurs à éviter et des modèles de réponses prêts à adapter pour votre commerce.",
    excerpt:
      "Répondre aux avis renforce la confiance et désamorce les critiques. Voici la méthode et des modèles concrets pour les avis positifs comme négatifs.",
    keywords: [
      "répondre aux avis google",
      "répondre à un avis négatif google",
      "exemple réponse avis google",
      "modèle réponse avis",
      "gérer les avis négatifs",
    ],
    category: "Gérer sa réputation",
    readMinutes: 7,
    datePublished: "2026-07-24",
    dateModified: UPDATED,
    blocks: [
      {
        type: "p",
        text: "[Collecter des avis](/guides/avoir-plus-avis-google), c’est la moitié du travail. Y répondre, c’est l’autre moitié - et c’est visible de tous vos futurs clients. Une réponse soignée valorise un client satisfait, transforme une critique en preuve de sérieux, et envoie à Google un signal d’activité. Voici comment répondre efficacement, avec des modèles à adapter.",
      },
      { type: "h2", text: "Pourquoi répondre change tout" },
      {
        type: "ul",
        items: [
          "Vous montrez à vos futurs clients que vous êtes attentif et présent.",
          "Vous valorisez les clients satisfaits, qui se sentent reconnus et reviennent.",
          "Vous désamorcez les avis négatifs : une réponse calme compte souvent plus que le reproche lui-même.",
          "Vous entretenez l’activité de votre fiche, un signal apprécié.",
        ],
      },
      { type: "h2", text: "Répondre à un avis positif" },
      {
        type: "p",
        text: "Ne vous contentez pas d’un « merci ». Personnalisez, rappelez un détail, et invitez à revenir. Restez bref et sincère.",
      },
      {
        type: "callout",
        title: "Modèle - avis positif",
        text: "« Merci beaucoup [Prénom] pour votre retour ! Ravis que [le plat / la prestation / votre visite] vous ait plu. Toute l’équipe sera touchée de le lire. À très bientôt chez [Établissement] ! »",
      },
      { type: "h2", text: "Répondre à un avis négatif" },
      {
        type: "p",
        text: "C’est là que se joue votre réputation. La règle d’or : ne jamais répondre à chaud. Remerciez pour le retour, reconnaissez le ressenti sans vous justifier à l’excès, et proposez de poursuivre en privé. Vous parlez autant au client mécontent qu’aux centaines de personnes qui liront l’échange. Pour aller plus loin, suivez notre méthode dédiée pour [répondre à un avis négatif](/guides/repondre-avis-negatif) ; et si l’avis est manifestement faux, apprenez à [le signaler pour suppression](/guides/supprimer-faux-avis-google).",
      },
      {
        type: "ol",
        items: [
          "Remerciez et restez courtois, quel que soit le ton de l’avis.",
          "Reconnaissez le ressenti : « je comprends votre déception ».",
          "N’entrez pas dans une polémique publique ni dans les détails contestables.",
          "Proposez un contact direct pour régler le problème.",
          "Signez avec un prénom : une vraie personne répond, pas un logo.",
        ],
      },
      {
        type: "callout",
        title: "Modèle - avis négatif",
        text: "« Bonjour [Prénom], merci d’avoir pris le temps de nous écrire, et désolé que votre expérience n’ait pas été à la hauteur. Ce que vous décrivez ne nous ressemble pas et j’aimerais comprendre ce qui s’est passé. Pouvez-vous me contacter à [e-mail] ? Je tiens à trouver une solution. - [Prénom], [Établissement] »",
      },
      { type: "h2", text: "Les erreurs à éviter" },
      {
        type: "ul",
        items: [
          "Répondre sous le coup de l’émotion, de manière défensive ou agressive.",
          "Copier-coller la même réponse partout : ça se voit et ça sonne faux.",
          "Dévoiler des informations personnelles du client dans la réponse publique.",
          "Ignorer les avis négatifs en espérant qu’ils passent inaperçus : c’est l’inverse qui se produit.",
        ],
      },
      { type: "h2", text: "Gagner du temps sans perdre en sincérité" },
      {
        type: "p",
        text: "Répondre à chaque avis prend du temps, surtout à mesure que le volume grandit. Des modèles adaptables (comme ci-dessus) et, demain, des réponses assistées par IA que vous relisez et personnalisez, permettent de tenir le rythme sans tomber dans le copier-coller. L’essentiel reste la sincérité : une réponse humaine, même courte, vaut mieux qu’un paragraphe générique.",
      },
    ],
    faq: [
      {
        q: "Faut-il répondre aux avis négatifs sur Google ?",
        a: "Oui, systématiquement. Une réponse calme et constructive à un avis négatif rassure vos futurs clients bien plus que l’avis lui-même ne les inquiète. L’ignorer, en revanche, laisse la critique seule et non contredite.",
      },
      {
        q: "Peut-on faire supprimer un avis Google injustifié ?",
        a: "Vous pouvez signaler à Google un avis qui enfreint ses règles (propos haineux, spam, hors sujet, conflit d’intérêts). Google décide seul de la suppression. Pour un avis simplement négatif mais réel, la meilleure réponse reste… une bonne réponse publique.",
      },
      {
        q: "En combien de temps faut-il répondre ?",
        a: "Le plus tôt possible, idéalement sous 48 heures. Une réponse rapide montre que vous suivez votre réputation de près. Des alertes à chaque nouvel avis aident à ne rien laisser passer.",
      },
    ],
    related: [
      "repondre-avis-negatif",
      "supprimer-faux-avis-google",
      "avis-google-commerce-local",
      "avoir-plus-avis-google",
    ],
  },

  {
    slug: "avis-google-restaurant",
    metaTitle: "Plus d’avis Google pour un restaurant : la méthode · reviu",
    h1: "Obtenir plus d’avis Google pour un restaurant",
    description:
      "Plus d’avis Google au restaurant : quand demander, quoi dire en salle, où placer le QR code, comment répondre aux critiques, sans gêner le service.",
    excerpt:
      "En restauration, le bon moment et le bon support font tout. Voici comment récolter des avis Google à l’addition, répondre aux critiques propres au métier et éviter les faux pas.",
    keywords: [
      "avis google restaurant",
      "avis clients restaurant",
      "plus d’avis restaurant",
      "qr code avis restaurant",
      "collecter avis restaurant",
      "répondre avis restaurant",
    ],
    category: "Par métier",
    readMinutes: 8,
    datePublished: "2026-07-24",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google dans un restaurant, proposez l’avis à toutes les tables au moment de l’addition, avec un support déjà présent sur la table ou au comptoir qui ouvre votre page d’avis en un geste. Une phrase simple, la même pour tous, suffit : aucune contrepartie, aucun tri des clients contents. Le reste du travail consiste à répondre aux avis et à corriger ce qu’ils révèlent.",
      },
      {
        type: "p",
        text: "Au restaurant, l’avis Google pèse sur une décision prise vite, souvent téléphone en main, au moment de choisir où dîner. Le récolter sans casser le rythme du service demande quelques réflexes, pensés ici pour la salle comme pour la vente à emporter.",
      },
      { type: "h2", text: "Ce que les clients jugent dans un avis de restaurant" },
      {
        type: "p",
        text: "Avant de demander, il est utile de savoir sur quoi vous serez évalué. Sur Google, l’avis d’un restaurant peut comporter des notes séparées pour la cuisine, le service et l’ambiance, et les commentaires reviennent souvent aux mêmes points :",
      },
      {
        type: "ul",
        items: [
          "La cuisine : goût, cuisson, générosité des assiettes, régularité d’une visite à l’autre.",
          "Le service : amabilité, attente entre les plats, attention portée aux demandes particulières (allergies, enfants, régimes).",
          "Le rapport qualité/prix, jugé sur le menu mais aussi sur les boissons et les suppléments.",
          "L’ambiance : bruit, confort, terrasse, propreté de la salle et des toilettes.",
          "L’accueil et la gestion des réservations, surtout quand la salle est pleine.",
        ],
      },
      {
        type: "p",
        text: "Ces critères disent aussi ce que vos futurs clients chercheront en vous lisant. Un commentaire qui cite un plat précis ou le prénom d’un serveur rassure bien davantage qu’un simple « très bien ».",
      },
      { type: "h2", text: "Le moment parfait : l’addition, pas le lendemain" },
      {
        type: "p",
        text: "L’émotion est au sommet quand le repas s’est bien passé et que l’addition arrive. C’est là qu’il faut proposer l’avis, pas par e-mail le lendemain, quand le souvenir s’estompe. Le client est encore attablé, détendu, téléphone à portée de main : tout est réuni. Évitez en revanche de demander avant le dessert ou pendant qu’une table attend encore un plat : vous sollicitez un jugement sur un repas qui n’est pas terminé.",
      },
      {
        type: "callout",
        title: "La règle d’or en restauration",
        text: "Demandez au moment de l’addition, avec un support déjà sur la table ou apporté avec la note. Le geste doit tenir en un scan, sans quitter la table.",
      },
      { type: "h2", text: "Où placer le support en salle et au comptoir" },
      {
        type: "ul",
        items: [
          "Sur la table, dans un petit présentoir : visible tout le repas, il est utilisé à la fin, sans se lever.",
          "Glissé dans le porte-addition : le moment le plus naturel, sans rien changer au dressage des tables.",
          "Sur le comptoir, pour la vente à emporter et le passage rapide.",
          "Sur le menu ou le set de table : un rappel discret pendant l’attente.",
          "En terrasse, un support lesté ou fixé : une affichette posée ne résiste ni au vent ni à la pluie.",
        ],
      },
      { type: "h2", text: "Phrases types pour la salle" },
      {
        type: "p",
        text: "Une phrase commune, que toute l’équipe connaît, évite l’improvisation gênante. Quelques formulations qui passent bien en salle :",
      },
      {
        type: "ul",
        items: [
          "« Un petit mot sur Google nous aide énormément : il suffit d’approcher votre téléphone du support, ou de scanner le code. »",
          "« Le chef lit tous les avis : si vous avez deux minutes, dites-nous ce que vous avez pensé du repas. »",
          "Pour la vente à emporter : « Le code sur le sac ouvre notre page d’avis Google, si vous voulez nous dire ce que vous en avez pensé. »",
          "À un habitué : « Vous venez souvent, votre avis aiderait ceux qui hésitent encore à pousser la porte. »",
        ],
      },
      {
        type: "p",
        text: "Une seule règle : la même invitation pour toutes les tables, y compris celle qui a attendu son plat. Les règles de Google interdisent de solliciter des avis positifs de façon sélective, et c’est aussi ce qui garde votre note crédible.",
      },
      { type: "h2", text: "Situations délicates propres à la restauration" },
      { type: "h3", text: "Le client qui menace d’un mauvais avis" },
      {
        type: "p",
        text: "Certains clients conditionnent leur avis à un geste : un dessert offert, une addition réduite. Traitez la réclamation sur le fond, comme pour n’importe quel client, mais ne négociez jamais l’avis lui-même. Un geste commercial se décide sur ce qui s’est passé, pas sous la menace. Si un avis mensonger est publié ensuite, il peut être signalé à Google.",
      },
      { type: "h3", text: "Le soir de rush" },
      {
        type: "p",
        text: "Un service débordé produit les avis les plus durs, souvent sur l’attente. Prévenez les tables dès que le délai s’allonge : un retard annoncé, avec une estimation honnête, passe beaucoup mieux qu’un retard découvert.",
      },
      { type: "h3", text: "Allergies et régimes particuliers" },
      {
        type: "p",
        text: "Un avis qui évoque une réaction allergique ou une erreur sur ce point se traite en priorité, et d’abord en privé : on ne débat pas publiquement d’un sujet de santé. Dans la réponse, on remercie, on prend la remarque au sérieux et on invite à appeler le restaurant.",
      },
      { type: "h3", text: "La livraison et la vente à emporter" },
      {
        type: "p",
        text: "Un avis peut critiquer un retard qui relève du livreur ou de la plateforme. Répondez sans rejeter la faute en bloc : expliquez ce que vous maîtrisez (préparation, emballage, température) et ce que vous allez vérifier.",
      },
      { type: "h2", text: "Répondre aux critiques typiques d’un restaurant" },
      {
        type: "p",
        text: "Les reproches les plus courants portent sur l’attente, le prix ou un plat décevant. La bonne réponse est courte, signée, sans contre-attaque, et montre ce qui change. Exemple pour un avis sur l’attente :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Marc, merci d’avoir pris le temps de nous écrire. Samedi soir, la salle était complète et nous avons mal anticipé le rythme des commandes : vous avez attendu votre plat bien trop longtemps, et nous en sommes désolés. Nous avons depuis ajouté une personne en cuisine le week-end. Nous serions heureux de vous recevoir à nouveau. Julie, gérante »",
      },
      {
        type: "p",
        text: "Évitez de proposer publiquement un repas offert en échange d’une modification de l’avis : c’est une contrepartie déguisée. Pour d’autres cas (plat froid, addition contestée, note sans commentaire), le [générateur de réponses aux avis](/outils/reponse-avis-google) propose des modèles pour la restauration, à adapter, et notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille la méthode.",
      },
      { type: "h2", text: "Les erreurs qui coûtent cher en restauration" },
      {
        type: "ul",
        items: [
          "Offrir un café, un digestif ou une remise contre un avis : c’est une contrepartie, interdite par Google, et les avis concernés peuvent être supprimés.",
          "Ne tendre le support qu’aux tables qui semblent ravies : c’est la sollicitation sélective que Google proscrit.",
          "Faire écrire des avis par l’équipe, la famille ou des amis : ils relèvent du conflit d’intérêts.",
          "Répondre le soir même, à chaud, à un avis jugé injuste : relisez le lendemain, à froid.",
          "Laisser en ligne une ancienne carte ou d’anciens prix : le client qui découvre l’écart à table le signalera dans son avis.",
        ],
      },
      { type: "h2", text: "Organiser la collecte service après service" },
      {
        type: "p",
        text: "En restauration, la collecte se joue en équipe et dans la durée. Fixez la phrase commune lors du briefing d’avant-service, décidez qui la prononce (souvent la personne qui apporte l’addition) et faites le point chaque semaine sur les nouveaux avis : ce qui revient, ce qui a été corrigé, à qui il reste à répondre.",
      },
      {
        type: "p",
        text: "Plusieurs outils gratuits aident à chaque étape. Le [générateur de QR code avis Google](/outils/qr-code-avis-google) imprime un chevalet de table ou un autocollant pour les sacs de vente à emporter. Le [calculateur de note Google](/outils/calculateur-note-google) indique combien de nouveaux avis il faut pour remonter après un mauvais mois. Pour un repas de groupe ou une privatisation, un [message de demande d’avis](/outils/message-demande-avis-google) envoyé le lendemain à l’organisateur complète la demande faite en salle.",
      },
      {
        type: "p",
        text: "Pour que le geste tienne en quelques secondes sur chaque table ou au comptoir, le [Présentoir Reviu](/presentoir-avis-google) ouvre votre page d’avis sans contact ou par QR code, comme pour payer sans contact, et son lien reste modifiable à tout moment.",
      },
    ],
    faq: [
      {
        q: "Comment demander un avis Google au restaurant sans gêner le client ?",
        a: "Au moment de l’addition, avec une phrase simple et un support déjà présent sur la table ou dans le porte-addition. On propose l’avis à toutes les tables de la même façon, sans insister. Le client le laisse en quelques secondes, sans quitter sa place.",
      },
      {
        q: "Faut-il un QR code sur chaque table ?",
        a: "C’est très efficace : le support reste visible tout le repas et le client scanne à la fin, sans se lever. À défaut, un présentoir au comptoir et un QR code dans le porte-addition font déjà une grande différence.",
      },
      {
        q: "Peut-on offrir un café ou une réduction contre un avis ?",
        a: "Non. Google interdit les avis publiés en échange d’un avantage, et ils peuvent être supprimés. Un geste commercial reste possible pour réparer un problème, mais il ne doit jamais dépendre de l’avis.",
      },
      {
        q: "Comment répondre à un avis négatif sur l’attente ou le service ?",
        a: "Rapidement mais à froid : remerciez, reconnaissez ce qui s’est réellement passé et expliquez ce qui a été corrigé. Évitez de contester les faits en public ou d’accuser un membre de l’équipe. Une réponse courte et signée rassure les futurs clients.",
      },
      {
        q: "Que faire si un client menace de laisser un mauvais avis ?",
        a: "Traitez sa réclamation sur le fond, comme celle de n’importe quel client, mais ne négociez pas l’avis lui-même. Si un avis mensonger ou injurieux est publié, vous pouvez le signaler à Google depuis votre fiche d’établissement.",
      },
      {
        q: "Les avis sur la livraison comptent-ils dans la note du restaurant ?",
        a: "Oui, s’ils sont publiés sur votre fiche Google, ils pèsent dans la note comme les autres. Répondez en distinguant ce qui dépend de vous, comme la préparation et l’emballage, de ce qui relève du livreur, sans rejeter la faute en bloc.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-negatif",
      "qr-code-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-boulangerie",
    ],
  },

  {
    slug: "avis-google-coiffeur",
    metaTitle: "Avis Google coiffeur : obtenir plus d’avis au salon · reviu",
    h1: "Obtenir plus d’avis Google pour un salon de coiffure",
    description:
      "Plus d’avis Google en salon de coiffure : le bon moment après le miroir, phrases types, réponses aux critiques sur une couleur ou un prix, erreurs à éviter.",
    excerpt:
      "En coiffure, la satisfaction se voit dans le miroir. Voici comment transformer ce moment en avis Google, répondre aux critiques sur une couleur ou un tarif, et éviter les faux pas.",
    keywords: [
      "avis google coiffeur",
      "avis google salon de coiffure",
      "avis clients coiffeur",
      "qr code avis coiffeur",
      "plus d’avis coiffure",
      "répondre avis coiffeur",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-26",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google en salon de coiffure, proposez l’avis à chaque client à l’encaissement, juste après la découverte du résultat au miroir, avec un support posé sur le comptoir qui ouvre votre page d’avis en un geste. La même phrase pour tous, aucune remise en échange : c’est la règle de Google, et c’est ce qui rend vos avis crédibles.",
      },
      {
        type: "p",
        text: "On choisit rarement un coiffeur au hasard : on regarde la note, on lit les commentaires, on cherche des photos de coupes et de couleurs. La coiffure a pourtant un atout que peu de métiers possèdent : la satisfaction est immédiate et visible. Les principes généraux pour [récolter plus d’avis Google](/guides/avoir-plus-avis-google) s’appliquent, avec quelques réflexes propres au salon.",
      },
      { type: "h2", text: "Ce que les clients regardent dans les avis d’un coiffeur" },
      {
        type: "ul",
        items: [
          "L’écoute : le coiffeur a-t-il compris la demande, posé des questions, regardé une photo avant de couper ?",
          "Le résultat, surtout en coloration, balayage ou coupe courte, où l’écart avec l’attente se voit tout de suite.",
          "La transparence des prix : un supplément cheveux longs ou un soin ajouté sans prévenir revient souvent dans les critiques.",
          "La ponctualité : un rendez-vous tenu à l’heure, ou un retard annoncé.",
          "Les conseils d’entretien, et l’absence de pression pour vendre des produits.",
          "L’hygiène, le confort au bac et l’ambiance du salon.",
        ],
      },
      {
        type: "p",
        text: "Ces critères disent aussi quoi soigner avant même de demander un avis : un tarif affiché clairement et une question de plus avant les ciseaux évitent bien des commentaires amers.",
      },
      { type: "h2", text: "Le bon moment : le miroir, puis l’encaissement" },
      {
        type: "p",
        text: "Le pic de satisfaction, c’est la découverte du résultat dans le miroir, quand la cliente ou le client est visiblement content. L’enchaînement naturel vers l’avis se joue ensuite, à la caisse : le geste est calme, le téléphone déjà en main pour payer. Attendre un e-mail le lendemain, c’est laisser l’enthousiasme retomber.",
      },
      {
        type: "callout",
        title: "La règle d’or en coiffure",
        text: "Proposez l’avis à l’encaissement, juste après le « ça vous plaît ? » devant le miroir. Un support déjà posé sur le comptoir, un geste, et c’est fait, sans quitter la caisse.",
      },
      { type: "h2", text: "Où placer le support dans le salon" },
      {
        type: "ul",
        items: [
          "Sur le comptoir d’encaissement : l’emplacement le plus naturel, au moment du paiement.",
          "À chaque poste de coiffage, près du miroir : un rappel visible pendant toute la prestation.",
          "Sur le meuble d’accueil, à côté des cartes de rendez-vous : pour l’attente et le départ.",
          "Pas aux bacs à shampoing : mains mouillées et position allongée ne s’y prêtent pas.",
        ],
      },
      { type: "h2", text: "Phrases types pour l’équipe du salon" },
      {
        type: "ul",
        items: [
          "« Si vous avez deux minutes, votre avis sur Google aide le salon à se faire connaître : approchez simplement votre téléphone, ici. »",
          "« Si vous avez un moment, dites sur Google ce que vous pensez de votre couleur, ça aide les clientes qui hésitent à se lancer. »",
          "Pour une première visite : « Votre avis comptera beaucoup pour ceux qui ne nous connaissent pas encore. »",
        ],
      },
      {
        type: "p",
        text: "Ces phrases s’adressent à tout le monde, y compris au client resté silencieux devant le miroir. Ne réservez jamais la demande aux habitués enthousiastes : Google interdit de solliciter des avis positifs de façon sélective.",
      },
      { type: "h2", text: "Situations délicates en salon" },
      { type: "h3", text: "La couleur qui ne correspond pas à l’attente" },
      {
        type: "p",
        text: "C’est la déception la plus sensible, parce qu’elle se voit pendant des semaines. Si la cliente exprime un doute au miroir, réglez d’abord le problème : une retouche immédiate ou un rendez-vous de correction. L’invitation à laisser un avis reste la même que pour tout le monde, et si elle choisit d’écrire, son avis parlera aussi de la façon dont vous avez réagi.",
      },
      { type: "h3", text: "Le client mécontent qui ne dit rien" },
      {
        type: "p",
        text: "Certains clients sourient au miroir puis écrivent un avis sévère le soir. Prenez l’habitude de poser une vraie question avant l’encaissement (« la longueur vous convient ? ») : un problème formulé au salon se règle bien plus facilement qu’un problème découvert sur Google.",
      },
      { type: "h3", text: "Le retard sur le planning" },
      {
        type: "p",
        text: "Une attente non annoncée revient régulièrement dans les avis de salons. Prévenez par SMS ou dès l’arrivée, et proposez un autre créneau si le retard devient important.",
      },
      { type: "h2", text: "Répondre à une critique sur une couleur ou un prix" },
      {
        type: "p",
        text: "Une réponse publique ne se gagne pas sur le terrain technique : elle montre surtout que le salon écoute. Restez bref, reconnaissez le ressenti, proposez d’en parler au salon. Exemple :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Sophie, merci pour votre retour. Nous sommes désolés que la nuance obtenue ne corresponde pas à ce que vous attendiez. Une correction est possible : appelez-nous pour convenir d’un créneau avec Léa, qui prendra le temps de revoir la couleur avec vous. À bientôt, l’équipe du salon »",
      },
      {
        type: "p",
        text: "Pour une critique sur le prix, rappelez calmement la grille affichée et ce qu’elle comprend, sans ton défensif. Pour gagner du temps, notre [générateur de réponses aux avis](/outils/reponse-avis-google) propose une version coiffure et barbier de chaque modèle, à personnaliser avant publication.",
      },
      { type: "h2", text: "Erreurs à éviter en coiffure" },
      {
        type: "ul",
        items: [
          "Offrir une remise sur la prochaine coupe ou un soin contre un avis : c’est une contrepartie interdite par Google.",
          "Demander pendant la prestation, ciseaux en main : le client ne peut pas encore juger le résultat.",
          "Faire publier des avis par l’équipe, un apprenti ou des proches : Google y voit un conflit d’intérêts.",
          "Détailler dans une réponse publique la chevelure ou l’historique du client : restez général, la relation est personnelle.",
          "Négliger les photos de réalisations sur la fiche Google : elles complètent les avis et montrent concrètement votre travail.",
        ],
      },
      { type: "h2", text: "Habitués, réservation en ligne et barbiers" },
      {
        type: "p",
        text: "Un salon vit de ses habitués, qui reviennent toutes les quelques semaines : si un client oublie une fois, l’occasion revient. Inutile de redemander à chaque passage, il suffit de garder le support visible en permanence. Les avis laissés sur une plateforme de réservation ne remplacent pas ceux de Google : ce sont deux vitrines distinctes. Pour les clients qui réservent en ligne, un [message de demande d’avis](/outils/message-demande-avis-google) envoyé après le rendez-vous complète la demande au comptoir, à condition de l’envoyer à tous.",
      },
      {
        type: "p",
        text: "Si vous tenez aussi un espace barbier, les attentes de cette clientèle sont détaillées dans notre guide [avis Google pour un barbier](/guides/avis-google-barbier). Le [générateur de QR code](/outils/qr-code-avis-google) gratuit permet d’imprimer un rappel pour chaque poste, et le [Présentoir Reviu](/presentoir-avis-google), posé au comptoir, ouvre votre page d’avis Google sans contact ou par QR code, sans application.",
      },
    ],
    faq: [
      {
        q: "Comment demander un avis Google à un client en coiffure ?",
        a: "À l’encaissement, juste après avoir montré le résultat au miroir, avec une phrase simple : « votre avis sur Google nous aide beaucoup, c’est ici ». On propose l’avis à tous les clients, sans insister et sans le conditionner à une bonne note.",
      },
      {
        q: "Où placer le QR code dans un salon de coiffure ?",
        a: "Sur le comptoir d’encaissement en priorité, car c’est là que se fait le paiement. Un rappel à chaque poste, près du miroir, garde le support visible pendant toute la prestation.",
      },
      {
        q: "Peut-on offrir une réduction contre un avis ?",
        a: "Non. Google interdit les avis obtenus en échange d’un avantage, et une remise sur la prochaine coupe en est un. Les avis concernés peuvent être supprimés ; on fidélise autrement, sans aucun lien avec l’avis.",
      },
      {
        q: "Comment répondre à un avis négatif sur une couleur ratée ?",
        a: "Reconnaissez la déception sans entrer dans un débat technique, puis proposez d’en parler au salon pour envisager une correction. Restez bref et courtois : la réponse s’adresse aussi aux futurs clients, qui jugent votre façon de réagir.",
      },
      {
        q: "Les avis de ma plateforme de réservation suffisent-ils ?",
        a: "Non, ce sont deux vitrines distinctes. Les avis Google apparaissent dans la recherche et sur Google Maps, là où de nombreux clients découvrent un salon avant de réserver. Il est utile de collecter les deux, en invitant tous les clients de la même façon.",
      },
      {
        q: "Un salon peut-il demander à ses apprentis de laisser un avis ?",
        a: "Non. Les avis rédigés par des salariés, des apprentis ou des proches relèvent du conflit d’intérêts selon les règles de Google et peuvent être supprimés. Seuls les clients doivent donner leur avis.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-institut-beaute",
      "repondre-avis-negatif",
      "avis-google-salle-de-sport",
    ],
  },

  {
    slug: "avis-google-garage",
    metaTitle: "Avis Google garage : obtenir plus d’avis clients · reviu",
    h1: "Obtenir plus d’avis Google pour un garage automobile",
    description:
      "Plus d’avis Google pour un garage : demander à la restitution du véhicule, rassurer sur les prix, répondre à une facture contestée, erreurs à éviter.",
    excerpt:
      "En mécanique auto, la confiance décide de tout. Voici comment collecter des avis Google à la remise des clés, répondre aux critiques sur un devis ou un délai, et éviter les faux pas.",
    keywords: [
      "avis google garage",
      "avis google garagiste",
      "avis clients garage auto",
      "qr code avis garage",
      "plus d’avis garage automobile",
      "répondre avis garage",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-27",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google dans un garage, proposez l’avis à chaque client au moment de la restitution du véhicule, quand il règle la facture et récupère ses clés, avec un support posé sur le comptoir d’accueil. Une invitation identique pour tous, sans remise en échange, puis une réponse posée à chaque avis, y compris aux critiques : c’est ce qui construit la confiance en ligne.",
      },
      {
        type: "p",
        text: "Confier sa voiture demande de la confiance, et cette confiance se lit dans les avis. Avant de choisir un garage, un automobiliste compare les notes et cherche des commentaires récents sur le sérieux, les prix et les délais. Un garage qui [collecte régulièrement des avis](/guides/avoir-plus-avis-google) part avec une longueur d’avance.",
      },
      { type: "h2", text: "Ce qu’un automobiliste cherche dans les avis d’un garage" },
      {
        type: "ul",
        items: [
          "Le respect du devis : pas de mauvaise surprise sur la facture, et un appel avant tout travail supplémentaire.",
          "Les délais : un véhicule rendu le jour annoncé, ou un client prévenu quand une pièce manque.",
          "Des explications claires sur la panne et les travaux, sans jargon ni pression.",
          "L’honnêteté : ne remplacer que ce qui doit l’être, et pouvoir montrer les pièces changées.",
          "L’accueil, le véhicule de prêt ou la navette quand il y en a, et une voiture rendue propre.",
        ],
      },
      {
        type: "p",
        text: "Un avis de garage prend souvent la forme d’un récit, avec un avant et un après : plus le client a été tenu informé, plus ce récit a des chances d’être favorable.",
      },
      { type: "h2", text: "Le bon moment : la restitution du véhicule" },
      {
        type: "p",
        text: "Le moment le plus fort, c’est la remise des clés : la voiture est réparée, le client est soulagé. C’est là qu’il faut proposer l’avis, au comptoir, pendant le règlement de la facture, plutôt que par un e-mail envoyé plus tard et souvent ignoré. Évitez de le faire au dépôt du véhicule : le client n’a encore rien vu de votre travail.",
      },
      {
        type: "callout",
        title: "La règle d’or au garage",
        text: "Proposez l’avis à la restitution, au moment de rendre les clés et de régler. Un support sur le comptoir d’accueil, un geste, et le client repart en ayant déjà donné son avis.",
      },
      { type: "h2", text: "Où placer le support à l’accueil" },
      {
        type: "ul",
        items: [
          "Sur le comptoir d’accueil, là où se règlent les factures : l’emplacement clé.",
          "Dans l’espace d’attente, près de la machine à café : un rappel pendant l’intervention.",
          "Joint à la facture remise : un relais discret pour ceux qui préfèrent laisser leur avis plus tard.",
          "Loin de l’atelier : la graisse et la poussière abîment vite une affichette.",
        ],
      },
      { type: "h2", text: "Phrases types au comptoir" },
      {
        type: "ul",
        items: [
          "« Votre avis sur Google aide beaucoup les automobilistes du coin à nous trouver : c’est ici, en approchant votre téléphone. »",
          "« Si vous avez deux minutes, racontez sur Google comment s’est passée l’intervention, c’est très utile pour nous. »",
          "Après une réparation compliquée : « Votre retour nous intéresse, y compris sur ce qu’on pourrait mieux faire. »",
        ],
      },
      {
        type: "p",
        text: "On propose à tous les clients, y compris à celui qui a trouvé la facture salée, sans trier selon la note attendue et sans jamais offrir de remise en échange : ce sont les règles de Google.",
      },
      { type: "h2", text: "Situations délicates au garage" },
      { type: "h3", text: "La facture plus élevée que le devis" },
      {
        type: "p",
        text: "C’est une source de conflit fréquente. La prévention est simple : aucun travail supplémentaire sans accord du client, idéalement par écrit (SMS ou e-mail). Si l’écart existe quand même, expliquez-le au comptoir, pièces à l’appui, avant que le client ne le découvre seul.",
      },
      { type: "h3", text: "La panne qui revient" },
      {
        type: "p",
        text: "Un client qui revient avec le même symptôme est inquiet et méfiant. Recevez-le vite, expliquez votre diagnostic et dites clairement ce qui relève de l’intervention précédente. Un avis négatif sur ce sujet peut devenir l’un des plus rassurants de la fiche si la réponse montre que le garage a assumé.",
      },
      { type: "h3", text: "Le délai qui s’allonge" },
      {
        type: "p",
        text: "Une pièce en retard n’est pas une faute, le silence en est une. Prévenez le client dès que le délai bouge et proposez une solution de mobilité si vous en avez une.",
      },
      { type: "h2", text: "Répondre à un avis sur un devis ou un délai" },
      {
        type: "p",
        text: "Dans un métier où la confiance est tout, la façon dont un garage répond aux avis en dit long aux futurs clients. Une réponse factuelle, sans détail technique inutile, rassure souvent plus qu’une série de cinq étoiles muettes. Exemple :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour M. Durand, merci pour votre retour. Lors de l’intervention, nous avons constaté l’usure des disques en plus des plaquettes prévues au devis. Nous aurions dû vous appeler avant de les remplacer, et nous le regrettons. Nous avons rappelé cette règle à toute l’équipe. Le chef d’atelier reste à votre disposition pour en parler. Karim, responsable de l’accueil »",
      },
      {
        type: "p",
        text: "Des modèles adaptés aux garages sont disponibles dans le [générateur de réponses aux avis](/outils/reponse-avis-google), et notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille la méthode quand l’avis vous paraît injuste.",
      },
      { type: "h2", text: "Erreurs à éviter pour un garage" },
      {
        type: "ul",
        items: [
          "Offrir une vidange ou une remise contre un avis : c’est une contrepartie, interdite par Google.",
          "Ne proposer l’avis qu’aux clients dont la facture est légère : c’est la sollicitation sélective que Google interdit.",
          "Contester publiquement un diagnostic dans un vocabulaire technique que le lecteur ne comprend pas.",
          "Citer le montant de la facture ou l’immatriculation du client dans la réponse : restez sur les faits utiles.",
          "Faire rédiger des avis par des mécaniciens ou des proches : Google les traite comme un conflit d’intérêts.",
        ],
      },
      { type: "h2", text: "Faire de la facture et du SMS de fin de travaux des relais" },
      {
        type: "p",
        text: "Beaucoup de garages préviennent déjà par SMS que le véhicule est prêt. N’y ajoutez pas encore de lien d’avis : le client n’a pas récupéré sa voiture. En revanche, un [message de demande d’avis](/outils/message-demande-avis-google) envoyé un ou deux jours après la restitution, à tous les clients, touche ceux qui sont repartis pressés. Un QR code imprimé sur la facture, créé avec le [générateur de QR code avis Google](/outils/qr-code-avis-google), joue le même rôle sur papier.",
      },
      {
        type: "p",
        text: "Au comptoir, le [Présentoir Reviu](/presentoir-avis-google) ouvre votre page d’avis sans contact ou par QR code pendant que le client règle, et vous voyez dans votre espace combien de clients l’utilisent.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis Google au garage ?",
        a: "À la restitution du véhicule, quand le client récupère ses clés et règle la facture : il a vu le résultat et il est disponible. On propose l’avis au comptoir, en un geste, plutôt que par un e-mail envoyé plus tard.",
      },
      {
        q: "Comment demander un avis sans paraître insistant ?",
        a: "Avec une phrase honnête et brève, la même pour tous : « votre avis sur Google aide beaucoup les automobilistes du coin ». On ne conditionne jamais à une bonne note et on n’offre aucune contrepartie.",
      },
      {
        q: "Faut-il répondre aux avis négatifs d’un garage ?",
        a: "Oui : une réponse calme et factuelle à un avis critique rassure les futurs clients et montre le sérieux du garage. C’est souvent plus convaincant qu’une note parfaite sans aucune réponse.",
      },
      {
        q: "Comment répondre à un client qui conteste sa facture dans un avis ?",
        a: "Remerciez, expliquez en une ou deux phrases ce qui a justifié l’écart, et reconnaissez ce qui aurait dû être mieux fait, par exemple un appel avant les travaux supplémentaires. Proposez d’en parler de vive voix, sans citer de montant ni de détail personnel.",
      },
      {
        q: "Peut-on mettre un QR code d’avis sur la facture ?",
        a: "Oui, c’est un bon relais pour les clients qui n’ont pas le temps au comptoir. Il doit simplement être présent sur toutes les factures, sans viser seulement les clients satisfaits.",
      },
      {
        q: "Un garage peut-il offrir un lavage contre un avis Google ?",
        a: "Non. Toute contrepartie offerte en échange d’un avis est interdite par Google, et les avis concernés peuvent être supprimés. Un lavage peut faire partie du service, à condition de ne pas dépendre de l’avis.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "repondre-avis-negatif",
      "avis-google-commerce-local",
    ],
  },

  {
    slug: "avis-google-boulangerie",
    metaTitle: "Plus d’avis Google pour une boulangerie-pâtisserie · reviu",
    h1: "Obtenir plus d’avis Google pour une boulangerie",
    description:
      "Plus d’avis Google en boulangerie malgré le flux rapide : support près de la caisse, phrases courtes, réponses aux critiques sur le pain ou l’attente.",
    excerpt:
      "En boulangerie, le passage est rapide mais quotidien et fidèle. Le défi : capter l’avis sans ralentir la file, et répondre aux critiques sur une rupture ou un gâteau raté.",
    keywords: [
      "avis google boulangerie",
      "avis google boulangerie patisserie",
      "avis clients boulangerie",
      "qr code avis boulangerie",
      "plus d’avis boulangerie",
      "répondre avis boulangerie",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-28",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google en boulangerie, misez sur un support visible près du terminal de paiement, que chaque client peut utiliser en un geste quand il le souhaite, plutôt que sur un discours à chaque passage. Gardez la demande orale pour les heures calmes, adressez-la à tous de la même façon et n’offrez jamais une viennoiserie en échange : la fidélité de vos habitués fera le reste.",
      },
      {
        type: "p",
        text: "La boulangerie a un profil unique : un passage de quelques secondes, mais une clientèle qui revient chaque jour. Ce qui ressemble à un frein devient un atout, à condition d’adapter la méthode générale pour [récolter plus d’avis Google](/guides/avoir-plus-avis-google) au rythme du comptoir.",
      },
      { type: "h2", text: "Sur quoi les clients jugent une boulangerie" },
      {
        type: "ul",
        items: [
          "Le pain : croûte, mie, cuisson, et la régularité d’un jour à l’autre.",
          "Les viennoiseries et pâtisseries : fraîcheur, goût du beurre, finition.",
          "La disponibilité : trouver encore sa baguette de tradition en fin de journée.",
          "L’accueil et la rapidité de la file, surtout le matin et le dimanche.",
          "Les commandes : gâteaux d’anniversaire, pièces montées, plateaux pour un repas, prêts à l’heure et conformes.",
          "Des horaires exacts sur Google, y compris les jours fériés et les congés.",
        ],
      },
      {
        type: "p",
        text: "Le dernier point surprend souvent. Pourtant, un client qui trouve porte close alors que Google indiquait la boutique ouverte écrit rarement un avis tendre : c’est une critique qui ne dit rien de votre pain et qu’il est facile d’éviter.",
      },
      { type: "h2", text: "Le défi du passage rapide" },
      {
        type: "p",
        text: "Impossible de tenir un discours à chaque client quand la file s’allonge le matin. La solution n’est pas de demander plus, mais de rendre l’avis possible en autonomie : un support visible que le client utilise quand il le souhaite, sur place ou en repartant. La demande orale se réserve aux moments plus calmes, en milieu de matinée ou d’après-midi.",
      },
      {
        type: "callout",
        title: "La règle d’or en boulangerie",
        text: "Misez sur un support autonome et bien visible près de la caisse, plutôt que sur un discours. Le client laisse son avis quand il veut, et vos habitués finissent par le faire.",
      },
      { type: "h2", text: "Où placer le support au comptoir" },
      {
        type: "ul",
        items: [
          "Près du terminal de paiement : le point de regard naturel pendant le règlement.",
          "Sur le comptoir, à hauteur des yeux : visible sans effort dans la file.",
          "Sur le ticket, le sac à pain ou la boîte à gâteau, en complément : un rappel à utiliser une fois rentré.",
          "Pas au milieu des pâtisseries : le support se perd et gêne le service.",
        ],
      },
      { type: "h2", text: "Phrases types, en quelques mots" },
      {
        type: "ul",
        items: [
          "« Un avis sur Google nous ferait très plaisir : approchez simplement votre téléphone, c’est juste là. »",
          "En remettant un gâteau commandé : « Si vous avez un moment après la fête, dites-nous sur Google comment il a été reçu. »",
          "À un habitué, en heure creuse : « Vous venez tous les matins, votre avis compterait beaucoup pour nous. »",
        ],
      },
      {
        type: "p",
        text: "On s’adresse à tous les clients, sans trier, y compris à celui qui a attendu dans la file. Et l’on n’offre jamais une viennoiserie ou une remise contre un avis : Google l’interdit et les avis concernés peuvent être supprimés.",
      },
      { type: "h2", text: "Situations délicates en boulangerie" },
      { type: "h3", text: "Plus de pain en fin de journée" },
      {
        type: "p",
        text: "La rupture du soir est une critique classique. Si elle se répète, deux réponses existent : ajuster la production des fins de journée, ou proposer la réservation de pain (par téléphone ou la veille), et le faire savoir sur la fiche Google.",
      },
      { type: "h3", text: "Le gâteau commandé qui déçoit" },
      {
        type: "p",
        text: "Un gâteau d’anniversaire raté touche à un moment important pour le client. Notez précisément chaque commande (parfum, inscription, heure de retrait) et faites-la relire au client. En cas de problème, appelez-le avant qu’il ne publie : un échange direct apaise souvent la situation.",
      },
      { type: "h3", text: "L’attente du dimanche matin" },
      {
        type: "p",
        text: "La file du dimanche fait partie du métier. Un renfort au comptoir, une caisse supplémentaire ou des produits pré-emballés pour les commandes simples réduisent l’attente et le nombre d’avis qui en parlent.",
      },
      { type: "h2", text: "Répondre aux critiques sur le pain, l’accueil ou une rupture" },
      {
        type: "p",
        text: "Une boulangerie répond en voisine : simple, chaleureuse, concrète. Exemple de réponse à un avis sur une rupture de baguettes :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Claire, merci pour votre message. Vous avez raison : mardi, nous n’avions plus de tradition dès 18 h, et ce n’est pas normal. Nous avons ajouté une fournée en fin d’après-midi, et vous pouvez aussi réserver votre pain par téléphone le matin. À très vite au comptoir, Thomas »",
      },
      {
        type: "p",
        text: "Si l’inspiration manque, le [générateur de réponses aux avis](/outils/reponse-avis-google) propose une version adaptée aux boulangeries, à reformuler avec vos mots. Pensez aussi à remercier les avis positifs, même brefs : vos habitués les lisent.",
      },
      { type: "h2", text: "Les erreurs à éviter en boulangerie" },
      {
        type: "ul",
        items: [
          "Offrir un croissant, une remise ou un tirage au sort contre un avis : ce sont des contreparties interdites.",
          "Demander un avis en pleine heure de pointe : la file s’impatiente et le client se sent pressé.",
          "Laisser des horaires faux sur la fiche pendant les congés ou les jours fériés.",
          "Répondre sèchement à une critique sur le prix : expliquez plutôt vos farines, votre levain ou votre fabrication maison.",
          "Faire publier des avis par l’équipe de vente, des apprentis ou la famille : Google y voit un conflit d’intérêts.",
        ],
      },
      { type: "h2", text: "Commandes, congés et fiche à jour : les relais propres au métier" },
      {
        type: "p",
        text: "Un client qui passe chaque matin verra le support des dizaines de fois : celui qui n’a pas encore laissé d’avis le fera le jour où il en aura envie. Les commandes de gâteaux offrent un second relais : le client vous a laissé son numéro, et un [message de demande d’avis](/outils/message-demande-avis-google) envoyé après l’événement devient naturel, à condition de l’adresser de la même façon à tous ceux qui ont commandé. Un autocollant sur les boîtes à gâteau, créé avec le [générateur de QR code avis Google](/outils/qr-code-avis-google), fait le même travail sans rien envoyer.",
      },
      {
        type: "p",
        text: "Avant chaque fermeture annuelle, mettez à jour vos horaires exceptionnels sur la fiche Google. Et pour un geste sans contact au comptoir, le [Présentoir Reviu](/presentoir-avis-google) se pose près du terminal de paiement et ouvre votre page d’avis Google en un instant, comme pour payer sans contact.",
      },
    ],
    faq: [
      {
        q: "Comment récolter des avis en boulangerie malgré la file d’attente ?",
        a: "En misant sur un support visible et autonome près de la caisse, que le client utilise quand il le souhaite, plutôt que sur un discours. La demande orale se garde pour les heures calmes, et elle s’adresse à tous les clients de la même façon.",
      },
      {
        q: "Où placer le QR code dans une boulangerie ?",
        a: "Près du terminal de paiement et sur le comptoir à hauteur des yeux : ce sont les points de regard pendant le règlement. Un rappel sur le ticket, le sac ou la boîte à gâteau aide ceux qui préfèrent laisser leur avis en rentrant.",
      },
      {
        q: "Peut-on offrir une viennoiserie contre un avis Google ?",
        a: "Non. Même un petit geste comme une viennoiserie offerte est une contrepartie au sens des règles de Google, et les avis concernés peuvent être supprimés. On remercie la fidélité autrement, jamais l’avis en lui-même.",
      },
      {
        q: "Comment répondre à un avis sur une rupture de pain ?",
        a: "Reconnaissez le problème sans vous justifier longuement, puis expliquez ce qui change : une fournée supplémentaire, la possibilité de réserver son pain. Une réponse courte et chaleureuse rassure les habitués comme les nouveaux clients.",
      },
      {
        q: "Pourquoi des horaires faux font-ils baisser la note ?",
        a: "Parce qu’un client qui trouve la boutique fermée alors que Google l’annonçait ouverte peut exprimer sa frustration dans un avis. Mettre à jour les horaires exceptionnels avant les congés et les jours fériés évite ces critiques.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "avis-google-restaurant",
      "avis-google-commerce-local",
    ],
  },

  {
    slug: "avis-google-institut-beaute",
    metaTitle: "Avis Google institut de beauté : en obtenir plus · reviu",
    h1: "Obtenir plus d’avis Google pour un institut de beauté",
    description:
      "Plus d’avis Google en institut de beauté : le bon moment après le soin, phrases douces, discrétion dans les réponses, critiques typiques et erreurs à éviter.",
    excerpt:
      "Après un soin réussi, la cliente est détendue et satisfaite : c’est le moment idéal pour un avis Google. Voici la méthode, avec la discrétion qu’exige l’institut.",
    keywords: [
      "avis google institut de beaute",
      "avis google estheticienne",
      "avis clients institut beaute",
      "qr code avis institut",
      "plus d’avis esthetique",
      "répondre avis institut de beauté",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-29",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google en institut de beauté, proposez l’avis à chaque cliente à l’encaissement, dans la continuité du soin, avec un support posé sur le comptoir qui ouvre votre page d’avis en un geste. Une invitation douce et identique pour toutes, sans remise en échange, et des réponses qui ne dévoilent jamais le soin reçu : ce sont les trois piliers d’une bonne réputation en esthétique.",
      },
      {
        type: "p",
        text: "On ne confie ni sa peau ni son bien-être au hasard : la note et les avis rassurent avant la prise de rendez-vous. L’esthétique a un atout précieux, puisque la cliente termine son soin détendue et satisfaite. La méthode générale pour [obtenir plus d’avis Google](/guides/avoir-plus-avis-google) s’applique, avec la discrétion propre à l’institut.",
      },
      { type: "h2", text: "Ce que les clientes regardent dans les avis d’un institut" },
      {
        type: "ul",
        items: [
          "L’hygiène : cabine propre, linge changé, matériel désinfecté, une attente de base que les avis vérifient.",
          "Le résultat et sa tenue : une épilation nette, un vernis semi-permanent qui tient, un teint apaisé après un soin visage.",
          "La douceur et l’écoute, surtout pour les soins sensibles ou une première épilation.",
          "Des conseils honnêtes, sans pression pour acheter des produits ou une cure.",
          "La ponctualité et des tarifs clairs, affichés avant le soin.",
          "L’ambiance : calme, musique, chaleur de l’accueil.",
        ],
      },
      {
        type: "p",
        text: "Soigner ces points en amont reste la meilleure préparation : une carte des soins aux prix clairs, une question sur la sensibilité de la peau avant de commencer et quelques conseils à la sortie évitent bien des déceptions. Une cliente qui s’est sentie écoutée le dit volontiers.",
      },
      { type: "h2", text: "Le bon moment : juste après le soin" },
      {
        type: "p",
        text: "Le pic de satisfaction se situe à la fin du soin, quand la cliente découvre le résultat et se sent bien. L’enchaînement se fait à l’encaissement, dans un moment calme et privilégié. C’est bien plus efficace qu’un e-mail envoyé le lendemain, quand la sensation de bien-être est retombée.",
      },
      {
        type: "callout",
        title: "La règle d’or en institut",
        text: "Proposez l’avis à l’encaissement, dans la continuité du soin, avec un support déjà posé sur le comptoir. Un geste, sans rompre le calme de l’institut.",
      },
      { type: "h2", text: "Où placer le support dans l’institut" },
      {
        type: "ul",
        items: [
          "Sur le comptoir d’accueil et d’encaissement : le point de passage final, au calme.",
          "Dans l’espace d’attente, près de la carte des soins : un rappel discret avant le rendez-vous.",
          "À côté du carnet de rendez-vous : au moment de reprogrammer le prochain soin.",
          "Jamais en cabine : c’est un espace d’intimité, pas de sollicitation.",
        ],
      },
      { type: "h2", text: "Phrases types, en douceur" },
      {
        type: "ul",
        items: [
          "« Vous pouvez, si vous le souhaitez, laisser votre avis sur Google : il suffit d’approcher votre téléphone de ce petit support. »",
          "« Si vous avez un instant, dites sur Google comment vous vous êtes sentie aujourd’hui : cela rassure les personnes qui hésitent à venir. »",
          "Pour une première visite : « Vous découvrez l’institut, votre regard neuf nous intéresse beaucoup. »",
        ],
      },
      {
        type: "p",
        text: "On propose à toutes les clientes, sans trier selon la note qu’on imagine, et sans jamais offrir de réduction en échange : ce sont les règles de Google, et c’est ce qui garde vos avis authentiques.",
      },
      { type: "h2", text: "Situations délicates en institut" },
      { type: "h3", text: "La réaction cutanée après un soin" },
      {
        type: "p",
        text: "Une rougeur ou une irritation inquiète légitimement. Prenez des nouvelles, conseillez de consulter un professionnel de santé si nécessaire et notez le produit utilisé dans la fiche cliente. Dans un avis, ne discutez jamais publiquement de la peau d’une cliente.",
      },
      { type: "h3", text: "Le semi-permanent qui ne tient pas" },
      {
        type: "p",
        text: "C’est une critique fréquente en prothésie ongulaire. Fixez une règle claire de retouche (délai, conditions) et affichez-la : une cliente qui connaît la règle avant le soin juge plus sereinement un incident.",
      },
      { type: "h3", text: "Les soins intimes et la discrétion" },
      {
        type: "p",
        text: "Certaines prestations, comme l’épilation intime, sont délicates à évoquer. Une cliente peut hésiter à laisser un avis par pudeur : c’est son choix, et l’invitation doit rester légère. Dans vos réponses, ne nommez jamais le soin reçu si la cliente ne l’a pas fait elle-même.",
      },
      { type: "h2", text: "Répondre aux critiques sans dévoiler la cliente" },
      {
        type: "p",
        text: "Une réponse publique s’adresse aux futures clientes autant qu’à l’autrice de l’avis. Elle reconnaît le ressenti, reste générale sur le soin et invite à poursuivre en privé. Exemple :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Nadia, merci d’avoir pris le temps de nous écrire. Nous regrettons que votre rendez-vous ne vous ait pas apporté le confort que vous attendiez. Chaque retour nous aide à progresser : n’hésitez pas à nous appeler pour en parler directement avec Camille. Belle journée, l’équipe de l’institut »",
      },
      {
        type: "p",
        text: "Le [générateur de réponses aux avis](/outils/reponse-avis-google) propose des modèles pour les instituts et les spas, à relire avant publication pour retirer tout détail personnel.",
      },
      { type: "h2", text: "Erreurs à éviter en esthétique" },
      {
        type: "ul",
        items: [
          "Offrir une remise sur le prochain soin, un échantillon ou un tirage au sort contre un avis : contrepartie interdite par Google.",
          "Demander l’avis en cabine, pendant le soin : la cliente est allongée, détendue, et n’a pas son téléphone.",
          "Ne solliciter que les fidèles enthousiastes : Google interdit la sollicitation sélective d’avis positifs.",
          "Citer dans une réponse le soin, la zone traitée ou un problème de peau.",
          "Publier des avis rédigés par l’équipe ou par des proches : Google y voit un conflit d’intérêts.",
        ],
      },
      { type: "h2", text: "Rendez-vous suivant, cartes cadeaux et forfaits" },
      {
        type: "p",
        text: "En institut, la fidélité passe par le rendez-vous suivant, souvent fixé sur place : la cliente est encore au comptoir, satisfaite et posée. Associer discrètement la demande d’avis à ce moment, sans jamais la conditionner, rend le geste naturel. Les clientes venues avec une carte cadeau découvrent souvent l’institut : leur avis de première visite intéresse beaucoup les futures clientes, invitez-les comme les autres.",
      },
      {
        type: "p",
        text: "Pour celles qui réservent en ligne, un [message de demande d’avis](/outils/message-demande-avis-google) envoyé après le rendez-vous complète la demande au comptoir. Le [générateur de QR code](/outils/qr-code-avis-google) gratuit permet d’imprimer une petite carte pour l’espace d’attente, et le [Présentoir Reviu](/presentoir-avis-google), posé à l’accueil, ouvre votre page d’avis Google sans contact ou par QR code, sans application.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis en institut de beauté ?",
        a: "Juste après le soin, à l’encaissement, quand la cliente découvre le résultat et se sent bien. C’est un moment calme et privilégié, bien plus efficace qu’un e-mail envoyé le lendemain.",
      },
      {
        q: "Comment demander un avis sans casser l’ambiance apaisée du soin ?",
        a: "Avec une phrase douce et sincère, et un support déjà posé sur le comptoir : la cliente laisse son avis en un geste, sans rupture. On propose à toutes, sans insister et sans conditionner à une bonne note.",
      },
      {
        q: "Peut-on offrir une remise sur un prochain soin contre un avis ?",
        a: "Non. Une remise conditionnée à un avis est une contrepartie, interdite par Google, qui peut faire supprimer les avis concernés. Les avantages de fidélité restent possibles, à condition de ne jamais dépendre d’un avis.",
      },
      {
        q: "Comment répondre à un avis négatif sans dévoiler le soin de la cliente ?",
        a: "Restez général : remerciez, reconnaissez le ressenti et proposez d’en parler par téléphone ou à l’institut. Ne nommez jamais le soin, la zone traitée ou un problème de peau si la cliente ne l’a pas fait elle-même.",
      },
      {
        q: "Où placer le QR code dans un institut de beauté ?",
        a: "Sur le comptoir d’accueil, là où la cliente règle et reprend rendez-vous, et éventuellement dans l’espace d’attente. Évitez la cabine : c’est un lieu d’intimité, où la cliente n’a pas son téléphone et ne doit pas se sentir sollicitée.",
      },
      {
        q: "Faut-il inviter les clientes venues avec une carte cadeau ?",
        a: "Oui, comme toutes les autres. Elles découvrent souvent l’institut et leur regard de première visite est utile aux futures clientes. L’invitation reste la même pour tout le monde, sans contrepartie.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-coiffeur",
      "repondre-avis-google",
      "avis-google-dentiste",
    ],
  },

  {
    slug: "supprimer-faux-avis-google",
    metaTitle:
      "Supprimer un faux avis Google : la marche à suivre · reviu",
    h1: "Supprimer un faux avis Google : signaler et réagir",
    description:
      "Que faire face à un faux avis Google : comment le signaler, quand répondre, et comment reprendre la main en le noyant sous de vrais avis - dans les règles.",
    excerpt:
      "Un faux avis, un concurrent malveillant, un client jamais venu : voici comment signaler, répondre, et surtout reprendre la main sur votre note.",
    keywords: [
      "supprimer un faux avis google",
      "signaler un avis google",
      "faux avis google",
      "supprimer avis google",
      "avis google diffamatoire",
    ],
    category: "Gérer sa réputation",
    readMinutes: 7,
    datePublished: "2026-07-29",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "Un faux avis fait mal : il salit une réputation bâtie avec soin et peut faire fuir des clients en un instant. Bonne nouvelle - Google dispose de règles claires et d’une procédure pour signaler les avis qui les enfreignent. Encore faut-il savoir lesquels sont concernés, comment les signaler efficacement, et quoi faire en attendant. Voici la marche à suivre, sans y laisser ses nerfs.",
      },
      { type: "h2", text: "Un avis peut-il vraiment être supprimé ?" },
      {
        type: "p",
        text: "Il faut le dire d’emblée : Google ne supprime pas un avis parce qu’il est négatif ou qu’il déplaît. Un client mécontent mais réel a le droit de s’exprimer. Ce que Google retire, ce sont les avis qui violent ses règles - faux, hors sujet, injurieux, ou déposés dans un conflit d’intérêt. La distinction est capitale : viser la suppression d’un avis légitime est une perte de temps ; mieux vaut alors y [répondre](/guides/repondre-avis-negatif).",
      },
      { type: "h2", text: "Reconnaître un avis qui enfreint les règles" },
      {
        type: "ul",
        items: [
          "Faux avis : d’une personne qui n’a jamais été cliente, ou d’un concurrent.",
          "Hors sujet : sans rapport avec votre établissement ou votre activité.",
          "Contenu interdit : insultes, propos haineux, diffamation, données personnelles.",
          "Spam et doublons : même avis répété, contenu promotionnel, liens.",
          "Conflit d’intérêt : avis d’un ancien employé, d’un concurrent, ou auto-avis.",
        ],
      },
      { type: "h2", text: "Signaler l’avis à Google, étape par étape" },
      {
        type: "ol",
        items: [
          "Ouvrez votre fiche établissement et repérez l’avis concerné.",
          "Cliquez sur les trois points à côté de l’avis, puis sur « Signaler l’avis ».",
          "Choisissez le motif qui correspond le mieux (faux, hors sujet, contenu inapproprié…).",
          "Patientez : la modération prend souvent quelques jours, parfois plus.",
          "Sans réponse, relancez via l’assistance Google My Business en joignant vos éléments.",
        ],
      },
      {
        type: "callout",
        title: "Gardez des preuves",
        text: "Capturez l’avis, sa date, et tout élément montrant qu’il est faux ou abusif (aucune trace de la personne dans vos réservations, propos d’un concurrent identifiable…). Un signalement étayé aboutit bien plus souvent.",
      },
      { type: "h2", text: "Répondre en attendant, sans envenimer" },
      {
        type: "p",
        text: "La suppression n’est jamais garantie ni immédiate. En attendant, une réponse publique calme et factuelle protège votre image auprès de ceux qui liront l’avis : « Nous ne retrouvons aucune trace de votre passage ; contactez-nous pour en discuter. » On ne s’emporte pas, on ne dévoile aucune donnée. Notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille la méthode.",
      },
      { type: "h2", text: "La meilleure défense : une majorité de vrais avis" },
      {
        type: "p",
        text: "Un faux avis pèse lourd sur une fiche qui en compte peu, et disparaît presque dans une fiche qui en collecte régulièrement. Le meilleur bouclier n’est donc pas la bataille de signalements, mais un flux constant d’avis authentiques : ils diluent l’anomalie et rétablissent la vérité. C’est tout l’enjeu d’[obtenir plus d’avis Google](/guides/avoir-plus-avis-google) en continu, avec un [présentoir sur le comptoir](/#produits) qui capte chaque client satisfait.",
      },
      {
        type: "p",
        text: "Signaler ce qui doit l’être, répondre avec sang-froid, et collecter sans relâche : ce trio remet votre note à sa vraie place, et prive les faux avis de leur pouvoir de nuisance.",
      },
    ],
    faq: [
      {
        q: "Google supprime-t-il un avis simplement parce qu’il est négatif ?",
        a: "Non. Un avis négatif d’un vrai client reste en ligne, c’est son droit. Google ne retire que les avis qui enfreignent ses règles : faux, hors sujet, injurieux, spam ou en conflit d’intérêt.",
      },
      {
        q: "Combien de temps prend la suppression d’un faux avis ?",
        a: "Il n’y a pas de délai garanti : la modération prend souvent quelques jours, parfois davantage. Un signalement documenté, au besoin relancé auprès de l’assistance, augmente les chances d’aboutir.",
      },
      {
        q: "Que faire si Google refuse de supprimer l’avis ?",
        a: "Répondez-y publiquement, avec calme et sans dévoiler de données personnelles, puis concentrez-vous sur la collecte de vrais avis : le volume dilue l’anomalie et rétablit une note fidèle à la réalité.",
      },
    ],
    related: [
      "repondre-avis-negatif",
      "repondre-avis-google",
      "avoir-plus-avis-google",
      "augmenter-note-google",
    ],
  },

  {
    slug: "repondre-avis-negatif",
    metaTitle:
      "Répondre à un avis Google négatif : méthode et exemple · reviu",
    h1: "Répondre à un avis Google négatif sans s’enflammer",
    description:
      "La méthode pour répondre à un avis Google négatif : garder son calme, désamorcer, proposer une solution - avec un modèle de réponse prêt à adapter.",
    excerpt:
      "Un avis négatif bien géré rassure plus qu’il n’inquiète. Voici comment répondre, étape par étape, pour transformer une critique en preuve de sérieux.",
    keywords: [
      "répondre à un avis négatif",
      "avis google négatif",
      "répondre avis 1 étoile",
      "gérer un mauvais avis google",
      "réponse avis négatif exemple",
    ],
    category: "Gérer sa réputation",
    readMinutes: 6,
    datePublished: "2026-07-29",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "Un avis négatif n’est pas une catastrophe : c’est un test public de votre professionnalisme. Les futurs clients lisent moins la critique que votre façon d’y répondre. Une réponse posée, humaine et orientée solution peut transformer un mauvais moment en démonstration de sérieux - et parfois faire revenir le client déçu. Voici comment s’y prendre.",
      },
      { type: "h2", text: "Pourquoi répondre change tout" },
      {
        type: "p",
        text: "Un avis négatif sans réponse laisse la critique seule à l’écran. Une réponse, elle, montre que vous écoutez, que vous prenez au sérieux, et que le problème décrit est l’exception, pas la règle. Elle s’adresse d’ailleurs moins à l’auteur qu’aux dizaines de personnes qui liront l’échange avant de choisir. Répondre signale aussi à Google une fiche vivante et entretenue.",
      },
      { type: "h2", text: "Les réflexes à éviter absolument" },
      {
        type: "ul",
        items: [
          "Répondre à chaud : la colère se lit et vous dessert. On laisse retomber avant d’écrire.",
          "Nier en bloc ou traiter le client de menteur : ruineux pour l’image, même si vous avez raison.",
          "Se justifier longuement : une tartine défensive donne du poids à la critique.",
          "Dévoiler des détails privés : jamais de données personnelles ou de montant dans une réponse publique.",
        ],
      },
      { type: "h2", text: "La structure d’une bonne réponse" },
      {
        type: "ol",
        items: [
          "Remerciez pour le retour, sans ironie : « Merci d’avoir pris le temps de nous écrire. »",
          "Montrez de l’empathie : « Nous sommes sincèrement désolés que votre expérience n’ait pas été à la hauteur. »",
          "Répondez au point précis, brièvement et sans vous justifier à l’excès.",
          "Proposez de poursuivre en privé : un e-mail ou un téléphone pour trouver une solution.",
          "Signez avec un prénom : une réponse incarnée vaut mieux qu’un message anonyme.",
        ],
      },
      {
        type: "callout",
        title: "Le délai compte",
        text: "Répondez sous 24 à 48 heures : assez vite pour montrer que vous suivez, assez posément pour ne pas écrire sous le coup de l’émotion. Une réponse tardive donne l’impression d’une fiche laissée à l’abandon.",
      },
      { type: "h2", text: "Un modèle à adapter" },
      {
        type: "p",
        text: "« Bonjour [prénom], merci d’avoir partagé votre ressenti, et navré que votre visite n’ait pas été à la hauteur de nos standards. Ce que vous décrivez ne nous ressemble pas et nous aimerions comprendre ce qui s’est passé. Pouvez-vous nous contacter à [e-mail] ? Nous ferons le nécessaire. Bien à vous, [prénom]. » À personnaliser à chaque fois : une réponse copiée-collée se repère et sonne faux.",
      },
      { type: "h2", text: "Et si l’avis est faux ou abusif ?" },
      {
        type: "p",
        text: "Tous les avis négatifs ne se valent pas. Si celui-ci est manifestement faux, injurieux ou déposé par un concurrent, la réponse ne suffit pas : il faut aussi le signaler. Voyez notre guide dédié pour [supprimer un faux avis Google](/guides/supprimer-faux-avis-google). Pour la posture générale sur l’ensemble de vos avis, le guide [répondre aux avis Google](/guides/repondre-avis-google) complète celui-ci.",
      },
      {
        type: "p",
        text: "Enfin, la meilleure réponse à quelques mauvaises notes reste une majorité de bonnes : en [collectant des avis en continu](/guides/avoir-plus-avis-google), la critique isolée pèse de moins en moins lourd dans votre moyenne.",
      },
    ],
    faq: [
      {
        q: "Faut-il répondre à tous les avis négatifs ?",
        a: "Oui, dès qu’ils sont visibles et argumentés. Une réponse calme et orientée solution rassure les futurs clients et montre le sérieux de l’établissement, bien plus qu’un silence.",
      },
      {
        q: "En combien de temps répondre à un avis négatif ?",
        a: "Idéalement sous 24 à 48 heures : assez vite pour montrer que vous suivez votre fiche, mais après avoir laissé retomber l’émotion pour écrire une réponse posée.",
      },
      {
        q: "Peut-on demander à un client de retirer son avis négatif ?",
        a: "On peut, avec tact, l’inviter à revenir vers vous pour résoudre le problème - mais jamais faire pression ni monnayer le retrait. Souvent, un client satisfait de la solution modifie son avis de lui-même.",
      },
    ],
    related: [
      "repondre-avis-google",
      "supprimer-faux-avis-google",
      "avoir-plus-avis-google",
      "avis-google-commerce-local",
    ],
  },

  {
    slug: "augmenter-note-google",
    metaTitle:
      "Augmenter sa note Google : faire remonter sa moyenne · reviu",
    h1: "Comment augmenter sa note moyenne sur Google",
    description:
      "Comment faire remonter sa note Google durablement : le poids des avis récents, le volume qui dilue les mauvaises notes, la régularité - dans les règles.",
    excerpt:
      "Une étoile de plus change tout pour un commerce. Voici comment faire monter votre note Google, sans jamais tricher, en jouant sur le volume et la fraîcheur.",
    keywords: [
      "augmenter sa note google",
      "améliorer sa note google",
      "note google avis",
      "remonter sa note google",
      "note moyenne google",
    ],
    category: "Gérer sa réputation",
    readMinutes: 6,
    datePublished: "2026-07-29",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "Passer de 4,1 à 4,6 étoiles n’a l’air de rien, et pourtant cela change tout : au-dessus d’un certain seuil, un commerce apparaît mieux, est cliqué plus souvent et inspire davantage confiance. La bonne nouvelle, c’est qu’on fait remonter une note sans jamais tricher - en comprenant comment elle se forme et en agissant sur les bons leviers.",
      },
      { type: "h2", text: "Comment se forme votre note Google" },
      {
        type: "p",
        text: "La note affichée est la moyenne de tous vos avis. Deux réalités en découlent. D’abord, une mauvaise note isolée pèse énormément quand vous avez peu d’avis, et presque plus quand vous en avez beaucoup. Ensuite, Google et les internautes accordent plus d’importance aux avis récents : une fiche vivante rassure davantage qu’une moyenne figée il y a deux ans.",
      },
      { type: "h2", text: "Le volume dilue les mauvaises notes" },
      {
        type: "p",
        text: "Imaginons une fiche avec cinq avis et une note à une étoile parmi eux : la moyenne s’effondre. La même étoile isolée, noyée dans des dizaines d’avis positifs, ne bouge presque plus l’aiguille. On ne « supprime » donc pas une mauvaise note - on la rend insignifiante en collectant, à côté, tous les avis positifs qui n’attendaient qu’une occasion d’exister.",
      },
      { type: "h2", text: "La fraîcheur pèse autant que la moyenne" },
      {
        type: "p",
        text: "Un flux d’avis récents envoie un signal fort : l’établissement est actif, fréquenté, apprécié maintenant. À moyenne égale, une fiche alimentée chaque semaine inspire plus confiance qu’une fiche endormie. Viser la régularité vaut mieux que d’espérer une vague d’avis ponctuelle.",
      },
      { type: "h2", text: "Le vrai levier : plus de vrais avis, en continu" },
      {
        type: "ol",
        items: [
          "Demandez au pic de satisfaction, quand le client est content et disponible.",
          "Réduisez le geste à un scan, avec un [présentoir sans contact (NFC) sur le comptoir](/guides/presentoir-plaque-nfc-avis-google).",
          "Systématisez : la demande fait partie du service, pour tous les clients.",
          "Mesurez les scans et les clics vers Google pour ajuster emplacement et discours.",
        ],
      },
      {
        type: "callout",
        title: "Ce qui ne marche pas (et se retourne contre vous)",
        text: "Acheter des avis, en faire rédiger par l’équipe, ou ne solliciter que les clients contents : Google sanctionne ces pratiques, jusqu’à la suppression des avis ou de la fiche. Une note gonflée artificiellement finit toujours par coûter plus cher qu’elle ne rapporte.",
      },
      { type: "h2", text: "Traiter les mauvaises notes déjà en ligne" },
      {
        type: "p",
        text: "En parallèle de la collecte, occupez-vous des avis négatifs existants : une réponse soignée limite leur impact et montre votre sérieux. Notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) donne la méthode et un modèle ; et si un avis est faux, apprenez à [le signaler](/guides/supprimer-faux-avis-google).",
      },
      {
        type: "p",
        text: "Volume, fraîcheur et bonnes réponses : c’est ce trio, pas un tour de passe-passe, qui fait durablement grimper une note. Avec un [présentoir reviu](/#produits) qui rend la collecte automatique, l’étoile de plus finit par arriver - et elle reste.",
      },
    ],
    faq: [
      {
        q: "Comment augmenter sa note Google rapidement ?",
        a: "En collectant beaucoup de vrais avis positifs sur une courte période : ils font remonter la moyenne et diluent les mauvaises notes. Le plus efficace est de demander au bon moment, avec un support qui réduit le geste à un scan.",
      },
      {
        q: "Une mauvaise note peut-elle disparaître ?",
        a: "Un avis légitime ne se supprime pas, mais son poids devient négligeable à mesure que vous accumulez des avis positifs. Seuls les avis qui enfreignent les règles de Google peuvent être signalés puis retirés.",
      },
      {
        q: "Acheter des avis pour monter sa note, est-ce risqué ?",
        a: "Oui, très : les faux avis sont interdits par Google et peuvent entraîner la suppression de tous vos avis, voire de votre fiche. La seule méthode durable est de collecter de vrais avis auprès de vrais clients.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-negatif",
      "supprimer-faux-avis-google",
      "qr-code-avis-google",
    ],
  },

  {
    slug: "avis-google-hotel",
    metaTitle: "Avis Google hôtel : obtenir plus d’avis en direct · reviu",
    h1: "Obtenir plus d’avis Google pour un hôtel",
    description:
      "Plus d’avis Google pour un hôtel, en plus des plateformes : demander au départ, placer le QR à la réception, répondre aux critiques sur le bruit ou le prix.",
    excerpt:
      "Les plateformes de réservation captent beaucoup d’avis d’hôtel, mais Google pèse dans le choix des voyageurs. Voici comment y récolter des avis au départ et répondre aux critiques du métier.",
    keywords: [
      "avis google hotel",
      "avis google hôtel",
      "avis clients hotel",
      "qr code avis hotel",
      "plus d’avis hotel google",
      "répondre avis hotel",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-29",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google dans un hôtel, proposez l’avis à chaque voyageur au moment du départ, à la réception, avec un support posé sur le comptoir qui ouvre votre page d’avis en un geste, et un rappel discret en chambre. La même invitation pour tous, sans nuit offerte ni réduction en échange, et une réponse soignée à chaque avis : c’est ce qui fait progresser la note sur Google, en complément des plateformes.",
      },
      {
        type: "p",
        text: "Les avis publiés sur les plateformes de réservation ne suffisent plus : de nombreux voyageurs choisissent leur hôtel directement depuis Google Maps ou la recherche locale. Y récolter des avis améliore la visibilité et rassure ceux qui comparent en dernière minute.",
      },
      { type: "h2", text: "Ce que les voyageurs jugent dans un avis d’hôtel" },
      {
        type: "ul",
        items: [
          "La propreté de la chambre et de la salle de bain : le critère qui ne pardonne pas.",
          "La literie et le calme : un bon lit et une nuit sans bruit valent tous les équipements.",
          "L’accueil, à l’arrivée comme au départ, et la réactivité en cas de problème.",
          "Le petit-déjeuner : choix, fraîcheur, horaires.",
          "La conformité aux photos et à la description de la chambre réservée.",
          "Les services pratiques : stationnement, wifi, climatisation, arrivée tardive.",
          "L’emplacement et le rapport qualité/prix au regard du tarif payé.",
        ],
      },
      { type: "h2", text: "Le bon moment : le départ, et pendant le séjour" },
      {
        type: "p",
        text: "Le pic de satisfaction, à l’hôtel, se situe au départ : le client garde en tête une chambre confortable et un accueil soigné. C’est l’instant idéal pour proposer un avis, à la réception, pendant le règlement ou la remise de la note. Un rappel discret en chambre, présent tout le séjour, prépare le terrain sans rien imposer.",
      },
      {
        type: "callout",
        title: "La règle d’or à l’hôtel",
        text: "Proposez l’avis au départ, avec un support déjà posé sur le comptoir de la réception. Un geste, sans allonger le départ, et le voyageur repart en ayant déjà laissé son avis Google.",
      },
      { type: "h2", text: "Où placer le support dans l’hôtel" },
      {
        type: "ul",
        items: [
          "Sur le comptoir de la réception : l’emplacement clé, au moment du départ.",
          "En chambre, sur le bureau ou la table de chevet : un rappel visible pendant tout le séjour.",
          "À l’espace petit-déjeuner : un moment détendu propice au geste.",
          "Sur la note ou la fiche de départ : un relais pour le voyageur pressé.",
        ],
      },
      { type: "h2", text: "Phrases types pour la réception" },
      {
        type: "ul",
        items: [
          "« Avant de partir, vous pouvez donner votre avis sur Google en approchant votre téléphone de ce support : cela nous aide beaucoup. »",
          "« Si vous avez une minute pendant votre trajet, racontez votre séjour sur Google : les prochains voyageurs vous en seront reconnaissants. »",
          "In English, for international guests: « Your review on Google really helps us, it’s right here. »",
        ],
      },
      {
        type: "p",
        text: "L’invitation vaut pour chaque voyageur, y compris celui qui a signalé un souci pendant le séjour, sans réserver la demande à ceux qu’on croit satisfaits. Les règles de Google interdisent de solliciter des avis positifs de façon sélective, comme d’offrir une nuit ou un surclassement en échange.",
      },
      { type: "h2", text: "Situations délicates propres à l’hôtellerie" },
      { type: "h3", text: "La chambre bruyante" },
      {
        type: "p",
        text: "Travaux dans la rue, voisins de chambre, ascenseur : le bruit est l’une des critiques les plus courantes. Si un client se plaint pendant son séjour, proposez un changement de chambre quand c’est possible : un problème réglé sur place devient souvent un compliment sur la réactivité de l’équipe.",
      },
      { type: "h3", text: "Le problème né de la réservation" },
      {
        type: "p",
        text: "Un tarif mal compris, une option non transmise par une plateforme, une chambre différente de l’annonce : le client en veut à l’hôtel, même si l’erreur vient d’ailleurs. Vérifiez régulièrement que vos descriptions et vos photos sont identiques partout, y compris sur votre fiche Google.",
      },
      { type: "h3", text: "L’arrivée tardive" },
      {
        type: "p",
        text: "Un voyageur qui arrive tard et trouve la réception fermée sans instructions claires écrit rarement un avis serein. Envoyez les modalités d’arrivée à l’avance et indiquez-les sur votre fiche.",
      },
      { type: "h2", text: "Répondre aux avis d’hôtel, en français comme en langue étrangère" },
      {
        type: "p",
        text: "À l’hôtel plus qu’ailleurs, la façon de répondre aux avis pèse dans la décision des voyageurs suivants. Répondez dans la langue de l’avis quand vous le pouvez, signez, et ne citez jamais le numéro de chambre ni les dates du séjour. Exemple de réponse à une critique sur le bruit :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Pierre, merci pour votre retour. Nous sommes désolés que les travaux de la rue aient troublé votre nuit. Nous aurions dû vous proposer une chambre côté cour à votre arrivée : c’est désormais ce que fait la réception pendant toute la durée du chantier. Au plaisir de vous accueillir de nouveau, Hélène, directrice »",
      },
      {
        type: "p",
        text: "Notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille la méthode, et le [générateur de réponses aux avis](/outils/reponse-avis-google) propose des modèles pour l’hôtellerie à adapter à chaque cas.",
      },
      { type: "h2", text: "Erreurs à éviter pour un hôtel" },
      {
        type: "ul",
        items: [
          "Offrir le petit-déjeuner, une nuit ou un surclassement contre un avis : contrepartie interdite par Google.",
          "Glisser une carte en chambre qui ne demande l’avis qu’aux clients « ravis de leur séjour » : c’est un tri déguisé.",
          "Répondre en contestant publiquement la propreté d’une chambre, photos à l’appui : on règle les faits en privé.",
          "Laisser des photos anciennes sur la fiche Google : l’écart avec la réalité nourrit les critiques.",
          "Faire rédiger des avis par le personnel ou des proches : Google y voit un conflit d’intérêts.",
        ],
      },
      { type: "h2", text: "Google, plateformes et réservations en direct" },
      {
        type: "p",
        text: "Les avis Google ne remplacent pas ceux des plateformes : ils s’y ajoutent, sur un canal qui nourrit directement votre visibilité sur Maps et dans la recherche « hôtel + ville ». Pour les clients qui ont réservé en direct et vous ont laissé leurs coordonnées, un [message de demande d’avis](/outils/message-demande-avis-google) envoyé le lendemain du départ, à tous, complète la demande faite à la réception. Pour une petite structure, notre guide consacré aux [avis Google pour une chambre d’hôtes](/guides/avis-google-chambre-d-hotes) adapte la méthode.",
      },
      {
        type: "p",
        text: "Le [générateur de QR code avis Google](/outils/qr-code-avis-google) permet d’imprimer gratuitement la carte posée en chambre. À la réception, le [Présentoir Reviu](/presentoir-avis-google) ouvre votre page d’avis Google sans contact ou par QR code, et plusieurs exemplaires (réception, salle du petit-déjeuner) se gèrent depuis le même espace.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis Google à l’hôtel ?",
        a: "Au départ, quand le client règle et repart avec un bon souvenir du séjour. Un support à la réception, utilisé en un geste, est bien plus efficace qu’un e-mail envoyé après le départ.",
      },
      {
        q: "Faut-il demander des avis Google quand on est déjà sur les plateformes de réservation ?",
        a: "Oui : les avis Google s’ajoutent à ceux des plateformes et nourrissent votre visibilité sur Google Maps et dans la recherche locale. Ils aident aussi les voyageurs qui réservent directement auprès de l’hôtel.",
      },
      {
        q: "Peut-on offrir une réduction contre un avis à l’hôtel ?",
        a: "Non. Une nuit, un petit-déjeuner ou une réduction offerts en échange d’un avis sont des contreparties interdites par Google, et les avis obtenus ainsi peuvent être supprimés. On invite tous les clients, sans récompenser l’avis lui-même.",
      },
      {
        q: "Faut-il répondre aux avis rédigés en langue étrangère ?",
        a: "Oui, et idéalement dans la langue de l’avis. Une réponse courte et courtoise montre aux voyageurs étrangers que l’hôtel les accueille avec attention. En cas de doute, une réponse simple en anglais reste préférable à l’absence de réponse.",
      },
      {
        q: "Comment répondre à un avis sur une chambre bruyante ?",
        a: "Remerciez, reconnaissez la gêne sans minimiser, puis expliquez ce que l’hôtel fait désormais, par exemple proposer une chambre plus calme dès l’arrivée. Ne citez ni le numéro de chambre ni les dates du séjour.",
      },
      {
        q: "Peut-on laisser une carte avec un QR code en chambre ?",
        a: "Oui, c’est un bon rappel pendant le séjour, à condition que le message invite tous les clients de la même façon. Évitez les formulations qui ne visent que les clients satisfaits.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-negatif",
      "avis-google-restaurant",
      "presentoir-plaque-nfc-avis-google",
    ],
  },

  {
    slug: "avis-google-boutique",
    metaTitle: "Plus d’avis Google pour une boutique : la méthode · reviu",
    h1: "Obtenir plus d’avis Google pour une boutique",
    description:
      "Plus d’avis Google en boutique : demander à l’encaissement, phrases types, réponses aux critiques sur un échange ou l’accueil, erreurs à éviter.",
    excerpt:
      "En commerce de détail, l’avis se joue à l’encaissement. Voici comment transformer un achat réussi en avis Google, répondre aux critiques sur un échange ou un conseil, et éviter les faux pas.",
    keywords: [
      "avis google boutique",
      "avis google commerce de détail",
      "avis clients boutique",
      "qr code avis boutique",
      "plus d’avis boutique",
      "répondre avis boutique",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-29",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google en boutique, proposez l’avis à chaque client à l’encaissement, avec un support posé sur le comptoir de caisse qui ouvre votre page d’avis en un geste, et un rappel sur le ticket ou le sac. Une phrase identique pour tous, aucune remise en échange : vos avis restent crédibles, et ils font venir de nouveaux clients du quartier.",
      },
      {
        type: "p",
        text: "Un client qui repart content de son achat est dans les meilleures dispositions pour laisser un avis, à condition qu’on le lui propose au bon moment et sans effort. Pour un commerce de détail, ces avis rassurent avant la visite et pèsent dans la [visibilité locale](/guides/avis-google-commerce-local).",
      },
      { type: "h2", text: "Ce que les clients jugent dans une boutique" },
      {
        type: "ul",
        items: [
          "Le conseil : un vendeur qui connaît ses produits, écoute et sait dire quand un article ne convient pas.",
          "L’accueil, sans pression à l’achat : on aime être salué, pas suivi dans les rayons.",
          "Le choix et la disponibilité, notamment des tailles, des coloris ou des références annoncées en ligne.",
          "Les prix, comparés à ceux d’internet ou des grandes enseignes.",
          "La politique d’échange et de remboursement, découverte parfois au pire moment.",
          "Des horaires et un stock affichés en ligne qui correspondent à la réalité.",
        ],
      },
      {
        type: "p",
        text: "En boutique, un avis positif parle souvent d’une personne : « Marie m’a très bien conseillée ». C’est votre meilleur argument face aux achats en ligne, et c’est ce que les futurs clients viennent chercher dans vos avis.",
      },
      { type: "h2", text: "Le bon moment : l’encaissement" },
      {
        type: "p",
        text: "Le moment idéal, c’est le passage en caisse : l’achat est concret, le client satisfait et le téléphone souvent déjà en main pour payer. Attendre un e-mail plus tard, c’est laisser retomber l’enthousiasme. Pour un achat important (un vêtement de cérémonie, un cadeau choisi longuement), la demande peut aussi venir après un essayage réussi, une fois la décision prise.",
      },
      {
        type: "callout",
        title: "La règle d’or en boutique",
        text: "Proposez l’avis à l’encaissement, avec un support déjà posé sur le comptoir. Un geste, et l’avis est laissé avant même que le client ait rangé son sac.",
      },
      { type: "h2", text: "Où placer le support en boutique" },
      {
        type: "ul",
        items: [
          "Sur le comptoir de caisse : le point de contact final, au moment de payer.",
          "Sur le sac, le ticket ou la carte de fidélité : un rappel qui repart avec le client.",
          "Près des cabines d’essayage, de façon discrète : un rappel pendant le choix.",
          "En vitrine : un QR code lisible depuis le trottoir capte aussi les habitués du quartier.",
        ],
      },
      { type: "h2", text: "Phrases types à l’encaissement" },
      {
        type: "ul",
        items: [
          "« Pour une boutique indépendante, chaque avis Google compte : vous pouvez le laisser ici, en approchant votre téléphone. »",
          "« Comment avez-vous trouvé nos conseils ? Vous pouvez le raconter sur Google, c’est précieux pour une boutique de quartier. »",
          "Pour un client de passage : « Vous n’êtes pas du quartier ? Votre avis aidera d’autres visiteurs à nous trouver. »",
        ],
      },
      {
        type: "p",
        text: "La même phrase s’adresse à chaque client, y compris à celui qui a longtemps hésité, sans trier selon la note attendue et sans offrir de remise en échange : ce sont les règles de Google. La méthode générale est détaillée dans notre guide pour [obtenir plus d’avis Google](/guides/avoir-plus-avis-google).",
      },
      { type: "h2", text: "Situations délicates en commerce de détail" },
      { type: "h3", text: "L’échange refusé" },
      {
        type: "p",
        text: "Une règle d’échange découverte au moment du retour est une source classique d’avis mécontents. Affichez votre politique en caisse, imprimez-la sur le ticket et dites-la à voix haute pour les articles sensibles (soldes, sous-vêtements, articles personnalisés).",
      },
      { type: "h3", text: "Le produit en rupture ou introuvable" },
      {
        type: "p",
        text: "Un client venu exprès pour un article affiché en ligne et absent du rayon se sent trompé. Si vous montrez vos produits sur Google ou sur votre site, gardez ces informations à jour, ou précisez que la disponibilité se confirme par téléphone.",
      },
      { type: "h3", text: "Le client qui se sent suivi ou ignoré" },
      {
        type: "p",
        text: "Entre l’insistance et l’indifférence, l’équilibre est délicat. Une règle simple aide l’équipe : saluer chaque client à l’entrée, proposer son aide une fois, puis rester disponible sans suivre.",
      },
      { type: "h2", text: "Répondre aux critiques sur un échange ou un accueil" },
      {
        type: "p",
        text: "La réponse publique sert surtout aux futurs clients : elle montre une boutique qui assume ses règles avec courtoisie. Exemple de réponse à un avis sur un échange refusé :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Lucie, merci pour votre message. Les articles soldés ne sont pas échangés, sauf défaut, et nous aurions dû vous le rappeler clairement en caisse : c’est désormais indiqué sur chaque ticket. Nous restons à votre disposition en boutique pour vous aider à trouver une autre taille. Anne, gérante »",
      },
      {
        type: "p",
        text: "Notre [générateur de réponses aux avis](/outils/reponse-avis-google) décline ses modèles pour les boutiques ; personnalisez-les toujours avant de publier. Remerciez aussi les avis positifs en citant le conseil ou le produit évoqué : c’est une seconde vitrine.",
      },
      { type: "h2", text: "Erreurs à éviter en boutique" },
      {
        type: "ul",
        items: [
          "Offrir une remise, un bon d’achat ou une participation à un jeu concours contre un avis : contreparties interdites par Google.",
          "Ne tendre le support qu’aux clients qui ont beaucoup acheté : c’est un tri, et Google interdit la sollicitation sélective.",
          "Répondre à une critique en rappelant sèchement « les conditions générales » sans un mot d’excuse.",
          "Faire publier des avis par les vendeurs, des amis ou la famille : Google y voit un conflit d’intérêts.",
          "Oublier de mettre à jour les horaires pendant les soldes, les fêtes ou les congés.",
        ],
      },
      { type: "h2", text: "Clientèle de passage, fidèles et périodes de fêtes" },
      {
        type: "p",
        text: "Une boutique mêle des fidèles, qui verront le support à chaque visite, et des clients de passage, touristes ou visiteurs d’un jour, qu’il faut inviter tout de suite car ils ne reviendront peut-être pas. Les périodes de fêtes et de soldes concentrent beaucoup de passages : c’est le moment de vérifier que le support est bien visible malgré la décoration et les présentoirs saisonniers.",
      },
      {
        type: "p",
        text: "Le [générateur de QR code avis Google](/outils/qr-code-avis-google) crée gratuitement un autocollant pour la vitrine ou les sacs, et le [calculateur de note Google](/outils/calculateur-note-google) montre combien d’avis il faut pour passer un cap de note. Côté caisse, le [Présentoir Reviu](/presentoir-avis-google) ouvre votre page d’avis sans contact ou par QR code pendant que le client règle.",
      },
    ],
    faq: [
      {
        q: "Comment demander un avis Google en boutique sans gêner le client ?",
        a: "À l’encaissement, avec une phrase brève et sincère et un support déjà sur le comptoir : le client laisse son avis en un geste. On propose à tous les clients, sans insister ni conditionner à une bonne note.",
      },
      {
        q: "Où placer le QR code dans une boutique ?",
        a: "Sur le comptoir de caisse en priorité, car c’est là que se termine l’achat. Un rappel sur le sac ou le ticket aide ceux qui préfèrent laisser leur avis une fois rentrés, et un QR en vitrine touche les habitués du quartier.",
      },
      {
        q: "Peut-on offrir une réduction contre un avis Google ?",
        a: "Non : une remise, un bon d’achat ou une participation à un jeu concours contre un avis sont interdits par Google, et les avis concernés peuvent être supprimés. Vos avantages de fidélité doivent rester indépendants de tout avis.",
      },
      {
        q: "Comment répondre à un avis sur un échange refusé ?",
        a: "Rappelez la règle avec courtoisie, reconnaissez si elle n’a pas été assez clairement annoncée et expliquez ce qui change, par exemple une mention sur le ticket. Proposez une solution en boutique quand c’est possible, sans polémique.",
      },
      {
        q: "Peut-on demander un avis lors d’un retrait de commande en boutique ?",
        a: "Oui : le retrait d’une commande passée en ligne est un moment de contact comme un autre. Le support au comptoir ou un QR code sur le sac permettent au client de donner son avis, avec la même invitation que pour un achat sur place.",
      },
      {
        q: "Faut-il demander un avis aux touristes et clients de passage ?",
        a: "Oui, et plutôt tout de suite, puisqu’ils ne reviendront peut-être pas. Leur avis aide d’autres visiteurs à trouver la boutique. L’invitation reste la même que pour les habitués.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "avis-google-commerce-local",
      "presentoir-plaque-nfc-avis-google",
    ],
  },

  {
    slug: "avis-google-dentiste",
    metaTitle: "Avis Google dentiste : les recueillir avec tact · reviu",
    h1: "Obtenir plus d’avis Google pour un cabinet dentaire",
    description:
      "Avis Google pour un cabinet dentaire : inviter les patients avec sobriété, respecter la déontologie et le secret professionnel dans les réponses.",
    excerpt:
      "Pour un cabinet dentaire, les avis Google se recueillent avec sobriété : une invitation à l’accueil, sans pression ni contrepartie, et des réponses qui respectent le secret professionnel.",
    keywords: [
      "avis google dentiste",
      "avis google cabinet dentaire",
      "avis patients dentiste",
      "qr code avis cabinet dentaire",
      "plus d’avis dentiste",
      "répondre avis patient dentiste",
    ],
    category: "Par métier",
    readMinutes: 7,
    datePublished: "2026-07-29",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Un cabinet dentaire peut inviter ses patients à laisser un avis Google, à condition de le faire avec sobriété : la même invitation pour tous, proposée à l’accueil après le rendez-vous, sans contrepartie, sans pression et sans tri selon la satisfaction. Les réponses aux avis obéissent ensuite à une règle stricte : ne jamais confirmer qu’une personne est patiente du cabinet ni évoquer un soin.",
      },
      {
        type: "p",
        text: "Un nouveau patient consulte souvent les avis Google avant de prendre rendez-vous. Ce guide ne vise pas à « faire monter une note » : il décrit comment laisser la parole aux patients qui le souhaitent, dans le respect de la relation de soin, et comment répondre sans rien dévoiler.",
      },
      { type: "h2", text: "Déontologie, secret professionnel et règles de Google" },
      {
        type: "p",
        text: "Avant tout, vérifiez les recommandations de l’Ordre national des chirurgiens-dentistes sur la communication : l’exercice ne doit pas être pratiqué comme un commerce (article R.4127-215 du Code de la santé publique), ce qui appelle une invitation sobre, sans mise en avant commerciale. Deux autres garde-fous s’imposent au cabinet. D’abord, on n’offre aucune contrepartie et l’on ne filtre pas selon la satisfaction supposée : c’est une règle Google, et une exigence déontologique. Ensuite, dans les réponses publiques aux avis, on ne confirme jamais qu’une personne est patiente et l’on ne révèle aucune donnée de santé : notre guide pour [répondre aux avis](/guides/repondre-avis-google) rappelle ces réflexes, essentiels dans un cadre médical.",
      },
      {
        type: "p",
        text: "Ce guide ne remplace pas l’avis de votre conseil départemental de l’Ordre : en cas de doute sur une pratique, interrogez-le avant de la mettre en place.",
      },
      { type: "h2", text: "Ce que les patients évoquent dans leurs avis" },
      {
        type: "ul",
        items: [
          "L’écoute et les explications : comprendre le traitement proposé et les alternatives.",
          "La prise en charge de l’appréhension et de la douleur.",
          "Le délai pour obtenir un rendez-vous, et la réponse en cas d’urgence.",
          "La ponctualité et l’attente en salle d’attente.",
          "La clarté des devis et du reste à charge, expliqués avant le soin.",
          "L’accueil du secrétariat, au téléphone comme au comptoir, et l’hygiène perçue du cabinet.",
        ],
      },
      {
        type: "p",
        text: "Une bonne partie de ces sujets relève de l’organisation du cabinet plus que de l’acte de soin. C’est là que les avis sont le plus utiles : ils signalent ce que l’équipe peut améliorer au quotidien.",
      },
      { type: "h2", text: "Le bon moment : à l’accueil, après le rendez-vous" },
      {
        type: "p",
        text: "Le moment juste, c’est le retour à l’accueil après le soin, au moment de régler ou de reprogrammer : la prestation est terminée, le patient a retrouvé ses moyens. C’est là, au comptoir du secrétariat, qu’une invitation discrète trouve sa place, jamais au fauteuil ni pendant le soin.",
      },
      {
        type: "callout",
        title: "La règle d’or au cabinet",
        text: "L’invitation vient de l’accueil, avec un support posé sur le comptoir. On propose, on n’insiste jamais : la relation de soin passe avant tout, l’avis reste un geste libre.",
      },
      { type: "h2", text: "Où placer le support au cabinet" },
      {
        type: "ul",
        items: [
          "Sur le comptoir du secrétariat : au moment de régler ou de reprendre rendez-vous.",
          "En salle d’attente, avec la documentation : un rappel discret et sans pression.",
          "Près de l’agenda du secrétariat : au moment de programmer la prochaine visite.",
          "Jamais en salle de soins : le patient n’y est pas en position de choisir librement.",
        ],
      },
      { type: "h2", text: "Quoi dire, avec tact" },
      {
        type: "ul",
        items: [
          "« Si vous le souhaitez, vous pouvez donner votre avis sur Google : c’est ici, en approchant votre téléphone. »",
          "« Votre avis sur notre accueil et notre organisation peut aider d’autres patients à nous trouver, si vous en avez envie. »",
        ],
      },
      {
        type: "p",
        text: "On propose à tous les patients, sans trier et sans relancer. On ne met pas à disposition une tablette du cabinet pour écrire l’avis sur place, et l’on ne suggère aucun contenu : l’avis doit être rédigé librement, depuis le téléphone du patient, s’il le souhaite.",
      },
      { type: "h2", text: "Situations délicates propres au cabinet dentaire" },
      { type: "h3", text: "Un avis sur un devis ou des honoraires" },
      {
        type: "p",
        text: "La meilleure prévention reste un devis expliqué à l’avance, avec le temps de poser des questions. Si un avis critique les honoraires, on n’en discute ni le montant ni le traitement en public : on propose un échange avec le secrétariat ou le praticien.",
      },
      { type: "h3", text: "Une douleur après un soin" },
      {
        type: "p",
        text: "Une douleur évoquée dans un avis est une question clinique, qui se traite par téléphone ou en consultation, jamais dans les commentaires. La réponse publique se limite à inviter la personne à contacter le cabinet.",
      },
      { type: "h3", text: "Un avis d’une personne que vous ne reconnaissez pas" },
      {
        type: "p",
        text: "Même dans ce cas, la réponse ne doit ni confirmer ni démentir qu’une personne est suivie au cabinet. Restez neutre ; si l’avis enfreint les règles de Google (propos injurieux, contenu sans rapport avec une expérience), il peut être signalé depuis la fiche. Notre guide sur les [faux avis Google](/guides/supprimer-faux-avis-google) détaille la démarche.",
      },
      { type: "h2", text: "Répondre aux avis sans rompre le secret professionnel" },
      {
        type: "p",
        text: "Une réponse de cabinet dentaire est courte, courtoise et générale, que l’avis soit positif ou négatif. Même si le patient décrit lui-même son traitement, la réponse ne le reprend pas. Exemple de réponse à un avis critique :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour, nous vous remercions d’avoir pris le temps d’écrire. Pour des raisons de confidentialité, nous ne pouvons pas évoquer de situation individuelle sur cette page. Le secrétariat se tient à votre disposition par téléphone pour en parler. L’équipe du cabinet »",
      },
      {
        type: "p",
        text: "Pour un avis positif, un simple « Merci pour votre message, nous le transmettons à toute l’équipe » suffit. Le [générateur de réponses aux avis](/outils/reponse-avis-google) peut servir de point de départ, à condition de relire chaque réponse pour en retirer toute mention d’un soin, d’une date ou d’une situation personnelle.",
      },
      { type: "h2", text: "Erreurs à éviter au cabinet" },
      {
        type: "ul",
        items: [
          "Offrir quoi que ce soit en échange d’un avis : c’est interdit par Google et contraire à la déontologie.",
          "Solliciter un avis au fauteuil, pendant ou juste après un acte.",
          "Confirmer dans une réponse qu’une personne est patiente, ou citer un acte, une date, un praticien en lien avec un soin.",
          "Répondre sous le coup de l’émotion, ou entrer dans une polémique publique.",
          "Adopter un ton commercial sur l’affichette ou dans les réponses : promesses, superlatifs, comparaisons.",
          "Faire rédiger des avis par l’équipe ou des proches : Google y voit un conflit d’intérêts.",
        ],
      },
      { type: "h2", text: "Une démarche sobre, dans la durée" },
      {
        type: "p",
        text: "Au cabinet, la régularité compte plus que le volume : une invitation identique, proposée calmement à l’accueil, laisse s’accumuler des avis qui reflètent la réalité de la patientèle. Une petite affichette sobre en salle d’attente, créée avec le [générateur de QR code avis Google](/outils/qr-code-avis-google), peut suffire. L’envoi de demandes d’avis par SMS ou e-mail à partir du fichier patients soulève, lui, des questions de protection des données et de déontologie : renseignez-vous avant d’y recourir.",
      },
      {
        type: "p",
        text: "Si vous souhaitez un support discret au secrétariat, le [Présentoir Reviu](/presentoir-avis-google) ouvre la page d’avis Google sans contact ou par QR code. Il ne remplace ni la sobriété de l’invitation ni la vérification préalable des recommandations de votre Ordre.",
      },
    ],
    faq: [
      {
        q: "Un cabinet dentaire peut-il demander des avis Google à ses patients ?",
        a: "Oui, à condition de proposer l’invitation à tous les patients, sans pression, sans contrepartie et sans filtrer selon la satisfaction, et après avoir vérifié les recommandations de l’Ordre sur la communication. Le moment adapté est l’accueil, après le rendez-vous, jamais pendant le soin.",
      },
      {
        q: "Comment répondre à un avis en respectant le secret professionnel ?",
        a: "Sans jamais confirmer qu’une personne est patiente ni évoquer un soin, même si l’auteur de l’avis l’a fait. On remercie, on indique que l’on ne peut pas aborder de situation individuelle en public et l’on invite à contacter le secrétariat.",
      },
      {
        q: "Peut-on offrir quelque chose contre un avis au cabinet ?",
        a: "Non : c’est interdit par Google et contraire à la déontologie. L’avis doit rester un geste libre du patient, jamais récompensé ni conditionné.",
      },
      {
        q: "Que faire d’un avis négatif sur un devis ou des honoraires ?",
        a: "Ne discutez ni du montant ni du traitement en public. Remerciez, précisez que vous ne pouvez pas évoquer de situation individuelle sur cette page et proposez un échange avec le secrétariat ou le praticien.",
      },
      {
        q: "Peut-on répondre à un avis d’une personne qui n’est pas patiente ?",
        a: "La réponse ne doit ni confirmer ni démentir qu’une personne est suivie au cabinet : une réponse neutre, qui invite à contacter le secrétariat, convient dans tous les cas. Si l’avis enfreint les règles de Google, il peut être signalé depuis la fiche d’établissement.",
      },
      {
        q: "Peut-on envoyer des demandes d’avis par SMS aux patients ?",
        a: "Cela soulève des questions de protection des données et de déontologie, puisque les coordonnées ont été confiées dans le cadre des soins. Avant toute démarche de ce type, renseignez-vous auprès de votre Ordre et consultez les recommandations de la CNIL. L’invitation orale à l’accueil reste la solution la plus simple.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-google",
      "supprimer-faux-avis-google",
      "avis-google-institut-beaute",
      "presentoir-plaque-nfc-avis-google",
    ],
  },

  {
    slug: "avis-google-salle-de-sport",
    metaTitle: "Avis Google salle de sport : obtenir plus d’avis · reviu",
    h1: "Obtenir plus d’avis Google pour une salle de sport",
    description:
      "Plus d’avis Google pour une salle de sport : inviter les adhérents à l’accueil, phrases types, réponses aux critiques sur la résiliation ou l’affluence.",
    excerpt:
      "Une salle de sport vit de ses adhérents fidèles, une mine d’avis Google. Voici comment les inviter à l’accueil, répondre aux critiques sur l’affluence ou la résiliation, et éviter les faux pas.",
    keywords: [
      "avis google salle de sport",
      "avis google club de fitness",
      "avis adhérents salle de sport",
      "qr code avis salle de sport",
      "plus d’avis salle de sport",
      "répondre avis salle de sport",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-29",
    dateModified: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour obtenir plus d’avis Google dans une salle de sport, gardez un support visible à l’accueil, que les adhérents utilisent en un geste à la sortie d’une séance, et veillez à ce que toute l’équipe, coachs compris, les invite tous de la même façon, sans mois offert en échange. Comme vos membres passent plusieurs fois par semaine, la régularité de l’invitation compte davantage que l’insistance.",
      },
      {
        type: "p",
        text: "Un futur adhérent qui hésite entre deux clubs compare les notes et lit les avis récents, en particulier sur l’ambiance, l’affluence et les conditions d’engagement. Une fiche riche en avis réguliers fait pencher la balance, à condition de suivre la méthode générale pour [obtenir plus d’avis Google](/guides/avoir-plus-avis-google) sans forcer.",
      },
      { type: "h2", text: "Ce que les adhérents jugent dans une salle de sport" },
      {
        type: "ul",
        items: [
          "La propreté des vestiaires, des douches et des machines.",
          "L’affluence aux heures de pointe, et l’attente pour accéder à une machine.",
          "L’état et l’entretien du matériel, et le délai de réparation d’un appareil en panne.",
          "L’encadrement : présence des coachs, conseils, sécurité, qualité des cours collectifs.",
          "L’ambiance et le respect entre membres.",
          "La clarté du contrat : engagement, frais, résiliation, gel de l’abonnement.",
        ],
      },
      {
        type: "p",
        text: "Le dernier point mérite une attention particulière : les avis les plus durs portent parfois moins sur le sport que sur une résiliation ou un prélèvement contesté.",
      },
      { type: "h2", text: "Le bon moment : la sortie d’une bonne séance" },
      {
        type: "p",
        text: "Le meilleur moment, c’est juste après un bon entraînement, un cours collectif réussi ou un objectif atteint : la satisfaction est à son sommet. À l’accueil, au passage de la borne ou du comptoir, l’invitation trouve naturellement sa place, à la sortie, quand le membre est content et disponible. Évitez le jour de l’inscription : le nouvel adhérent n’a encore rien vécu dans la salle.",
      },
      {
        type: "callout",
        title: "La règle d’or en salle",
        text: "Misez sur un support visible à l’accueil, que l’adhérent utilise en sortant d’une bonne séance. La régularité des passages fait le reste : celui qui n’a pas encore laissé d’avis finit par le faire.",
      },
      { type: "h2", text: "Où placer le support dans la salle" },
      {
        type: "ul",
        items: [
          "Au comptoir d’accueil, près de la borne de passage : le point de contact de chaque venue.",
          "À la sortie des salles de cours collectifs : juste après l’effort et la satisfaction.",
          "Dans l’espace détente ou au bar à boissons : un moment calme propice au geste.",
          "Pas sur le plateau de musculation : le téléphone y sert au chronomètre et à la musique, pas aux avis.",
        ],
      },
      { type: "h2", text: "Phrases types pour l’accueil et les coachs" },
      {
        type: "ul",
        items: [
          "« Votre avis sur Google aide la salle à se faire connaître dans le quartier : approchez votre téléphone du support de l’accueil, c’est immédiat. »",
          "Après un objectif atteint : « Bravo pour ce résultat ! Si vous avez deux minutes, racontez votre parcours sur Google, ça motive ceux qui hésitent à commencer. »",
          "À un adhérent de longue date : « Vous connaissez la salle mieux que personne, votre avis compterait beaucoup. »",
        ],
      },
      {
        type: "p",
        text: "Si l’usage de la salle est de tutoyer les membres, adaptez simplement ces phrases. On propose à tous les adhérents, sans trier et sans offrir d’avantage en échange : ce sont les règles de Google.",
      },
      { type: "h2", text: "S’appuyer sur les coachs et la communauté" },
      {
        type: "p",
        text: "Dans une salle, le lien avec les coachs et entre membres est fort : c’est un levier précieux. Un coach qui, après un objectif atteint, invite sincèrement à laisser un avis est bien plus écouté qu’un e-mail impersonnel. La règle reste la même pour toute l’équipe : chaque coach invite tous ses adhérents de la même façon, sans objectif chiffré ni classement interne.",
      },
      { type: "h2", text: "Situations délicates en salle de sport" },
      { type: "h3", text: "La résiliation difficile" },
      {
        type: "p",
        text: "Un adhérent qui ne parvient pas à résilier, ou qui découvre un délai qu’il ignorait, peut publier un avis très négatif. La prévention est simple : des conditions expliquées à l’inscription, une procédure de résiliation claire, et une réponse rapide aux demandes.",
      },
      { type: "h3", text: "La machine en panne" },
      {
        type: "p",
        text: "Un appareil hors service pendant des semaines devient un sujet d’avis. Affichez la date de réparation prévue sur la machine : un problème expliqué agace bien moins qu’un problème ignoré.",
      },
      { type: "h3", text: "Les heures de pointe" },
      {
        type: "p",
        text: "L’affluence du soir est inévitable, mais elle se gère : indiquez les créneaux plus calmes à l’accueil ou dans l’application du club, et orientez les nouveaux membres vers ces horaires.",
      },
      { type: "h2", text: "Répondre aux critiques sur la résiliation ou l’affluence" },
      {
        type: "p",
        text: "La réponse publique doit rassurer les futurs adhérents sans débattre du contrat en ligne. Restez factuel, rappelez la procédure en termes généraux et proposez un échange direct. Exemple :",
      },
      {
        type: "callout",
        title: "Exemple de réponse",
        text: "« Bonjour Thomas, merci pour votre message. Nous sommes désolés que votre demande de résiliation ait pris autant de temps. Elle peut se faire à l’accueil ou par courrier, et notre responsable s’engage à vous répondre sous quarante-huit heures. Contactez-nous directement pour que nous fassions le point sur votre dossier. Sarah, responsable du club »",
      },
      {
        type: "p",
        text: "Notre guide pour [répondre à un avis négatif](/guides/repondre-avis-negatif) détaille la méthode, et le [générateur de réponses aux avis](/outils/reponse-avis-google) propose des modèles généraux à adapter au vocabulaire du club.",
      },
      { type: "h2", text: "Erreurs à éviter pour une salle de sport" },
      {
        type: "ul",
        items: [
          "Offrir un mois d’abonnement, une séance de coaching ou une boisson contre un avis : contreparties interdites par Google.",
          "Organiser un « challenge avis » entre coachs : c’est une pression sur les adhérents, qui pousse à solliciter de façon insistante, voire sélective.",
          "Ne demander qu’aux membres les plus assidus, réputés satisfaits : Google interdit la sollicitation sélective.",
          "Évoquer dans une réponse le poids, la santé ou les objectifs physiques d’un adhérent.",
          "Faire publier des avis par les coachs, le personnel ou des proches : Google y voit un conflit d’intérêts.",
        ],
      },
      { type: "h2", text: "Séances d’essai, nouveaux inscrits et adhérents fidèles" },
      {
        type: "p",
        text: "Une salle reçoit trois publics différents. Les personnes en séance d’essai peuvent donner un avis sur leur découverte, mais la séance ne doit jamais être conditionnée à cet avis. Les nouveaux inscrits seront invités après quelques semaines de pratique, quand leur jugement repose sur une vraie expérience. Les fidèles, eux, voient le support à chaque passage : il suffit qu’il reste visible.",
      },
      {
        type: "p",
        text: "Le [calculateur de note Google](/outils/calculateur-note-google) montre combien d’avis il faut pour atteindre une note donnée, ce qui aide à se fixer un rythme réaliste. Le [générateur de QR code avis Google](/outils/qr-code-avis-google) crée gratuitement une affiche pour la sortie des cours, et le [Présentoir Reviu](/presentoir-avis-google), posé près de la borne d’accueil, ouvre votre page d’avis sans contact ou par QR code.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis en salle de sport ?",
        a: "Juste après une bonne séance ou un objectif atteint, à la sortie, quand l’adhérent est satisfait et disponible. Un support à l’accueil, utilisé en un geste, capte ce moment mieux qu’un e-mail.",
      },
      {
        q: "Comment obtenir des avis de mes adhérents fidèles ?",
        a: "En rendant le support visible en permanence à l’accueil et en laissant les coachs inviter sincèrement après un moment fort. La fréquence des passages fait que chaque membre finit par avoir l’occasion de laisser un avis.",
      },
      {
        q: "Peut-on offrir un mois d’abonnement contre un avis ?",
        a: "Non. Un mois offert en échange d’un avis est une contrepartie, interdite par les règles de Google, et peut entraîner la suppression des avis concernés. Les offres de parrainage ou de fidélité doivent rester sans lien avec les avis.",
      },
      {
        q: "Comment répondre à un avis négatif sur la résiliation ?",
        a: "Sans débattre du contrat en public : remerciez, rappelez en termes généraux comment résilier et proposez un échange direct pour régler le dossier. Une réponse rapide et factuelle rassure les futurs adhérents.",
      },
      {
        q: "Faut-il demander un avis le jour de l’inscription ?",
        a: "Non, c’est trop tôt : le nouvel adhérent n’a encore rien vécu dans la salle. Mieux vaut l’inviter après quelques semaines de pratique, comme les autres membres.",
      },
      {
        q: "Les coachs peuvent-ils laisser un avis sur leur propre salle ?",
        a: "Non. Un coach, salarié ou indépendant travaillant dans la salle, est en situation de conflit d’intérêts au sens des règles de Google, tout comme les proches de l’équipe. Leurs avis peuvent être supprimés.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "repondre-avis-negatif",
      "avis-google-coiffeur",
      "augmenter-note-google",
      "presentoir-plaque-nfc-avis-google",
    ],
  },
];

/**
 * Tous les guides publiés. Les guides ajoutés depuis octobre 2026 vivent dans
 * `src/lib/guides-content/` (un fichier par grappe) pour garder des sources
 * lisibles ; l'ordre ci-dessous est l'ordre d'affichage.
 */
export const GUIDES: Guide[] = [
  ...BASE_GUIDES,
  ...COLLECT_GUIDES,
  ...RULES_GUIDES,
  ...TRADE_GUIDES_2,
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}

// ── Pages hub par catégorie ──────────────────────────────────────────────────
// Une page hub regroupe une grappe de guides sous une URL indexable qui capte
// les requêtes de catégorie (« avis Google par métier ») et renforce le
// maillage : le hub pointe vers tous ses guides, et chaque guide pointe vers son
// hub. On ne crée un hub que pour une catégorie assez fournie, avec un vrai
// contenu éditorial - jamais une page mince ou vide, qui nuirait à l'indexation.

export type CategoryHub = {
  /** Segment d'URL sous /guides (ex. `par-metier`). */
  slug: string;
  /** Catégorie des guides regroupés (doit correspondre à `Guide.category`). */
  category: string;
  /** Libellé court (fil d'Ariane, puces de navigation). */
  label: string;
  metaTitle: string;
  h1: string;
  description: string;
  /** Paragraphes d'introduction (contenu unique, pour une page à part entière). */
  intro: string[];
  keywords: string[];
  faq: { q: string; a: string }[];
};

export const CATEGORY_HUBS: CategoryHub[] = [
  {
    slug: "collecter-des-avis",
    category: "Collecter des avis",
    label: "Collecter des avis",
    metaTitle: "Collecter des avis Google : méthodes, lien, QR code · reviu",
    h1: "Collecter des avis Google",
    description:
      "Nos guides pour collecter plus d’avis Google : la méthode complète, le lien d’avis, le QR code, le sans contact et le pas à pas à partager à vos clients.",
    intro: [
      "Un client satisfait laisse rarement un avis de lui-même : il faut le lui proposer, au bon moment, avec le geste le plus court possible. Ces guides couvrent toute la chaîne de la collecte, du lien d’avis Google à récupérer jusqu’au support posé sur le comptoir, en passant par les mots à employer.",
      "Chaque méthode respecte les règles de Google : la même invitation pour tous les clients, sans contrepartie et sans tri selon leur satisfaction. C’est ce qui rend vos avis crédibles, et c’est ce qui les protège dans la durée.",
    ],
    keywords: [
      "collecter des avis google",
      "obtenir des avis google",
      "demander des avis google",
      "lien avis google",
      "qr code avis google",
    ],
    faq: [
      {
        q: "Quelle est la méthode la plus efficace pour collecter des avis Google ?",
        a: "Demander l’avis de vive voix au moment où le client est satisfait, puis lui permettre de le laisser en un geste, avec un QR code ou un support sans contact posé au comptoir. Pour les clients déjà partis, un message avec le lien d’avis prend le relais.",
      },
      {
        q: "A-t-on le droit de demander des avis Google à ses clients ?",
        a: "Oui. Google encourage les établissements à demander des avis, par un lien ou un QR code. Il interdit en revanche les contreparties et le fait de ne solliciter que les clients satisfaits.",
      },
    ],
  },
  {
    slug: "par-metier",
    category: "Par métier",
    label: "Par métier",
    metaTitle: "Avis Google par métier : nos guides par secteur · reviu",
    h1: "Avis Google : nos guides par métier",
    description:
      "Nos guides pour collecter plus d’avis Google, métier par métier : restaurant, coiffeur, garage, hôtel, boutique, dentiste - une méthode par secteur.",
    intro: [
      "Collecter des avis Google ne se joue pas de la même façon selon le métier. Le bon moment, l’endroit où poser le support et les mots à employer changent entre un restaurant, un salon de coiffure, un garage ou un hôtel. C’est pourquoi nous avons décliné notre méthode par secteur : chaque guide part des contraintes réelles du terrain pour vous donner des réflexes directement applicables.",
      "Le principe reste le même partout - demander au pic de satisfaction, réduire le geste à un scan, proposer à tous les clients dans les règles de Google - mais son application se personnalise. Choisissez votre métier ci-dessous pour la version taillée à votre commerce.",
    ],
    keywords: [
      "avis google par métier",
      "avis google secteur",
      "avis google commerce",
      "collecter avis google métier",
      "avis clients par activité",
    ],
    faq: [
      {
        q: "La méthode pour obtenir des avis change-t-elle selon le métier ?",
        a: "Le principe est universel - demander au bon moment, réduire le geste à un scan, proposer à tous les clients - mais son application diffère : le moment, l’emplacement du support et le discours s’adaptent à chaque secteur. Nos guides par métier détaillent ces réglages.",
      },
      {
        q: "Mon métier n’est pas dans la liste, que faire ?",
        a: "Partez du guide général pour obtenir plus d’avis Google : il pose la méthode complète, applicable à tout commerce de proximité. Les guides par métier ne sont que des déclinaisons de ces principes.",
      },
    ],
  },
  {
    slug: "gerer-sa-reputation",
    category: "Gérer sa réputation",
    label: "Gérer sa réputation",
    metaTitle:
      "Gérer sa e-réputation sur Google : répondre, noter, corriger · reviu",
    h1: "Gérer sa réputation sur Google",
    description:
      "Nos guides pour gérer votre e-réputation sur Google : répondre aux avis, faire face à un faux avis, faire remonter votre note - avec des méthodes concrètes.",
    intro: [
      "Collecter des avis ne suffit pas : encore faut-il en prendre soin. La façon dont vous répondez, dont vous réagissez à un avis injuste et dont vous faites vivre votre note pèse autant, aux yeux de Google et des clients, que le volume d’avis lui-même. Une fiche entretenue inspire confiance ; une fiche laissée à l’abandon inquiète.",
      "Ces guides couvrent tout le versant « gestion » de votre réputation en ligne : répondre aux avis positifs comme négatifs, désamorcer une critique, signaler un faux avis, et faire remonter durablement votre note moyenne - toujours dans les règles de Google.",
    ],
    keywords: [
      "gérer sa réputation google",
      "e-réputation commerce",
      "répondre aux avis google",
      "augmenter sa note google",
      "supprimer un faux avis google",
    ],
    faq: [
      {
        q: "Faut-il répondre à tous les avis Google ?",
        a: "Idéalement oui : une réponse, même brève, aux avis positifs valorise le client, et une réponse posée aux avis négatifs rassure les futurs clients. C’est aussi un signal d’activité apprécié de Google.",
      },
      {
        q: "Que faire d’un avis manifestement faux ?",
        a: "On le signale à Google s’il enfreint ses règles (faux, hors sujet, injurieux, conflit d’intérêt), et l’on y répond publiquement avec calme en attendant. Le meilleur bouclier reste un flux régulier de vrais avis, qui dilue l’anomalie.",
      },
    ],
  },
];

export function getCategoryHub(slug: string): CategoryHub | undefined {
  return CATEGORY_HUBS.find((h) => h.slug === slug);
}

/** Slug de la page hub d'une catégorie, s'il en existe une. */
export function hubSlugForCategory(category: string): string | undefined {
  return CATEGORY_HUBS.find((h) => h.category === category)?.slug;
}

/** Guides d'une catégorie donnée, dans l'ordre de la source. */
export function guidesInCategory(category: string): Guide[] {
  return GUIDES.filter((g) => g.category === category);
}

/** Slugifie un titre de section pour les ancres et le sommaire. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
