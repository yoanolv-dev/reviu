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

export const GUIDES: Guide[] = [
  {
    slug: "avoir-plus-avis-google",
    metaTitle:
      "Comment avoir plus d’avis Google : le guide complet (2026) · reviu",
    h1: "Comment avoir plus d’avis Google : le guide complet",
    description:
      "Toutes les méthodes qui marchent pour obtenir plus d’avis Google en 2026 : quand demander, comment faciliter le geste, et les erreurs à éviter - dans les règles de Google.",
    excerpt:
      "Plus d’avis Google, mieux notés, plus souvent : voici la méthode complète pour transformer vos clients satisfaits en avis, sans forcer et dans les règles.",
    keywords: [
      "avoir plus d’avis google",
      "obtenir des avis google",
      "augmenter ses avis google",
      "demander un avis google",
      "collecter des avis google",
    ],
    category: "Collecter des avis",
    readMinutes: 8,
    datePublished: "2026-07-24",
    dateModified: UPDATED,
    blocks: [
      {
        type: "p",
        text: "Les avis Google sont devenus la première vitrine d’un commerce de proximité. Ils rassurent avant même la première visite, pèsent lourd dans le référencement local, et font souvent la différence entre deux établissements voisins. Pourtant, la plupart des clients satisfaits ne laissent jamais d’avis - non par mauvaise volonté, mais parce que personne ne le leur a demandé au bon moment, et que le parcours est trop long. Ce guide rassemble ce qui fonctionne vraiment pour obtenir plus d’avis Google, durablement et sans enfreindre les règles.",
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
      { type: "h2", text: "Le bon moment pour demander un avis" },
      {
        type: "p",
        text: "Le meilleur moment est le pic de satisfaction : juste après un bon repas, une prestation réussie, un achat qui a plu. C’est là que le client a envie de dire merci. Attendre le lendemain, c’est laisser l’enthousiasme retomber. Concrètement :",
      },
      {
        type: "ul",
        items: [
          "Restaurant, café : au moment de l’addition, quand le client est encore attablé et détendu.",
          "Salon, garage, prestation : à la remise des clés ou au paiement, quand le résultat est visible.",
          "Boutique : à l’encaissement, avec un mot simple et un support à portée de main.",
        ],
      },
      { type: "h2", text: "Réduire le geste au minimum : le levier le plus efficace" },
      {
        type: "p",
        text: "Chaque étape supprimée entre l’envie et l’avis publié augmente le taux de dépôt. L’idéal : un seul geste. C’est exactement le rôle d’un présentoir posé sur le comptoir, muni d’une puce NFC et d’un QR code. Le client approche son téléphone ou scanne, et la page d’avis Google de l’établissement s’ouvre directement - pas de recherche, pas de saisie.",
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
      { type: "h2", text: "Les méthodes qui fonctionnent, classées par efficacité" },
      {
        type: "ol",
        items: [
          "Le support NFC + QR sur le comptoir : demande au bon moment, geste unique, rappel permanent. Le meilleur rapport effort/résultat pour un commerce physique.",
          "La demande orale de l’équipe : un « si vous avez aimé, un avis Google nous aide beaucoup » sincère, appuyé par un support à montrer.",
          "Le QR code sur l’addition, le ticket ou le sac : utile en complément, moins immédiat que le comptoir.",
          "L’e-mail / SMS après visite : pertinent pour les prestations avec coordonnées, mais taux de réponse faible et délai qui refroidit l’enthousiasme.",
        ],
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
      { type: "h2", text: "Mettre en place une routine durable" },
      {
        type: "p",
        text: "Obtenir des avis n’est pas une opération ponctuelle, c’est une habitude. Les établissements qui progressent le plus sont ceux qui ont intégré la demande dans leur service quotidien : le support est visible en permanence, l’équipe sait quoi dire, et l’on suit les résultats pour ajuster. Un tableau de bord (scans, clics vers Google, canal NFC ou QR) transforme cette routine en boucle d’amélioration.",
      },
      {
        type: "p",
        text: "En combinant bon moment, geste unique et régularité, un commerce passe de quelques avis par an à un flux régulier - celui qui fait grimper la note, le classement local, et la confiance des nouveaux clients.",
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
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "qr-code-avis-google",
      "avis-google-commerce-local",
    ],
  },

  {
    slug: "presentoir-plaque-nfc-avis-google",
    metaTitle:
      "Plaque et présentoir NFC pour avis Google : le guide 2026 · reviu",
    h1: "Plaque et présentoir NFC pour avis Google : comment ça marche",
    description:
      "Comment fonctionne une plaque ou un présentoir NFC pour avis Google, ce qui distingue une bonne solution d’un gadget, et comment l’installer en boutique en 2 minutes.",
    excerpt:
      "La puce NFC transforme un geste - approcher le téléphone - en avis Google. Voici comment ça marche, ce qui compte vraiment, et comment éviter la carte NFC « morte ».",
    keywords: [
      "plaque nfc avis google",
      "présentoir avis google",
      "carte nfc avis google",
      "présentoir nfc",
      "support avis google",
    ],
    category: "Le présentoir",
    readMinutes: 7,
    datePublished: "2026-07-24",
    dateModified: UPDATED,
    blocks: [
      {
        type: "p",
        text: "Une plaque ou un présentoir NFC pour avis Google, c’est un petit objet posé sur le comptoir qui déclenche l’ouverture de votre page d’avis Google dès qu’un client approche son téléphone. Aucune application à installer, aucune recherche : le geste est immédiat. Mais toutes les solutions ne se valent pas. Ce guide explique le fonctionnement, ce qui sépare un vrai outil d’un gadget, et comment le mettre en place.",
      },
      { type: "h2", text: "Ce qu’est la NFC, en une minute" },
      {
        type: "p",
        text: "La NFC (Near Field Communication) est la même technologie que le paiement sans contact. Une puce sans pile est intégrée dans le présentoir ; quand un smartphone passe à quelques centimètres, il lit l’adresse enregistrée et propose de l’ouvrir. Tous les iPhone récents et la quasi-totalité des Android lisent le NFC nativement, sans réglage particulier.",
      },
      {
        type: "callout",
        title: "NFC et QR : les deux, pas l’un ou l’autre",
        text: "Un bon présentoir combine puce NFC et QR code imprimé. Le NFC pour la rapidité (approcher le téléphone), le QR pour l’universalité (n’importe quel appareil photo). Le client choisit, vous ne perdez personne.",
      },
      { type: "h2", text: "Le piège de la carte NFC « morte »" },
      {
        type: "p",
        text: "Beaucoup de cartes NFC vendues en ligne encodent en dur le lien de votre fiche Google. Le jour où vous changez d’enseigne, où Google modifie le format des liens, ou si vous voulez rediriger ailleurs, la carte devient inutilisable : il faut tout racheter et réimprimer. C’est la carte « morte » - figée à jamais.",
      },
      {
        type: "p",
        text: "La solution durable consiste à encoder une adresse intermédiaire qui vous appartient (par exemple une URL de redirection) et dont vous pilotez la destination à distance. L’objet reste le même, mais vous changez où il pointe quand vous voulez. C’est ce qui distingue un présentoir « intelligent » d’une simple carte imprimée.",
      },
      { type: "h2", text: "Ce qui fait un bon présentoir d’avis" },
      {
        type: "ul",
        items: [
          "Lien modifiable à distance : vous changez la destination sans réimprimer ni racheter.",
          "NFC + QR ensemble : rapidité et compatibilité universelle.",
          "Un vrai service derrière : statistiques de scan, canal de retour privé, suivi - pas juste un bout de plastique.",
          "Conforme aux règles de Google : bouton d’avis proposé à tous, sans filtrage selon la note.",
          "Robuste et présentable : il vit sur un comptoir, il doit tenir et donner envie.",
        ],
      },
      { type: "h2", text: "Installation : de la boîte au comptoir en 2 minutes" },
      {
        type: "ol",
        items: [
          "Vous recevez le présentoir déjà encodé (NFC et QR prêts), rien à configurer côté matériel.",
          "Vous l’activez en le scannant et en collant le lien de votre fiche Google.",
          "Vous le posez sur le comptoir, côté client, bien visible.",
          "Dès le premier client, le geste fonctionne : approcher le téléphone, la page d’avis s’ouvre.",
        ],
      },
      {
        type: "p",
        text: "Avec reviu, chaque présentoir intègre NFC et QR encodés sur une adresse r.reviu.fr unique et permanente, dont vous choisissez la destination à distance. Vous pouvez même décider du comportement au scan : redirection directe vers Google (volume maximal), ou page à votre marque avec un canal de contact en complément.",
      },
      { type: "h2", text: "Combien ça coûte ?" },
      {
        type: "p",
        text: "Un présentoir reviu est un achat unique (29,90 €), sans frais supplémentaires. Votre espace Reviu est inclus : statistiques de scans (QR et NFC distingués), gestion de vos présentoirs et modification de votre lien de redirection à tout moment. Reviu Pro (connexion Google Business Profile, assistance IA, analyses avancées) arrivera plus tard, en option.",
      },
    ],
    faq: [
      {
        q: "Faut-il une application pour lire le présentoir NFC ?",
        a: "Non. La lecture NFC est native sur les iPhone récents et la grande majorité des Android. Le client approche simplement son téléphone. Pour les rares appareils non compatibles, le QR code imprimé prend le relais.",
      },
      {
        q: "Peut-on changer le lien après l’achat ?",
        a: "Avec reviu, oui, autant de fois que vous voulez, à distance et sans réimprimer. C’est justement ce qui évite la carte NFC « morte » : l’objet reste, la destination s’ajuste.",
      },
      {
        q: "Y a-t-il des frais récurrents ?",
        a: "Non. Le présentoir s’achète une fois et votre espace Reviu est inclus, sans frais supplémentaires : statistiques de scans, gestion et modification du lien à tout moment. Reviu Pro (fonctions avancées comme la connexion Google Business Profile) sera proposé plus tard, en option.",
      },
    ],
    related: ["avoir-plus-avis-google", "qr-code-avis-google", "avis-google-restaurant"],
  },

  {
    slug: "qr-code-avis-google",
    metaTitle:
      "QR code avis Google : le créer et l’utiliser en boutique · reviu",
    h1: "QR code avis Google : le créer et l’utiliser en boutique",
    description:
      "Comment créer un QR code qui ouvre votre page d’avis Google, où le placer pour qu’il soit scanné, et pourquoi un QR dynamique vaut mieux qu’un QR figé.",
    excerpt:
      "Un QR code bien placé transforme une visite en avis en un scan. Voici comment le générer, où l’afficher, et l’erreur du QR « statique » à éviter.",
    keywords: [
      "qr code avis google",
      "générer qr code avis google",
      "qr code avis client",
      "créer qr code avis",
      "qr code fiche google",
    ],
    category: "Collecter des avis",
    readMinutes: 6,
    datePublished: "2026-07-24",
    dateModified: UPDATED,
    blocks: [
      {
        type: "p",
        text: "Un QR code avis Google est un code que vos clients scannent avec l’appareil photo de leur téléphone pour ouvrir directement votre page d’avis - sans chercher votre établissement sur Google. Simple à mettre en place, il fait sauter l’obstacle principal du dépôt d’avis : trouver le bon endroit où cliquer. Voici comment le créer correctement et en tirer le maximum.",
      },
      { type: "h2", text: "Comment obtenir le lien de votre fiche Google" },
      {
        type: "ol",
        items: [
          "Connectez-vous à votre profil d’établissement Google (Google Business Profile).",
          "Cherchez l’option « Demander des avis » ou « Obtenir plus d’avis ».",
          "Google vous fournit un lien court dédié aux avis (souvent de la forme g.page/… ou un lien de rédaction d’avis).",
          "C’est ce lien qui doit se cacher derrière votre QR code.",
        ],
      },
      { type: "h2", text: "QR statique ou QR dynamique : ne vous trompez pas" },
      {
        type: "p",
        text: "Un générateur de QR gratuit produit le plus souvent un QR statique : le lien est gravé dans le motif, définitivement. Si votre lien Google change, si vous déménagez ou changez de nom, le QR imprimé est bon à jeter. Un QR dynamique, lui, pointe vers une adresse intermédiaire que vous contrôlez : vous modifiez la destination sans réimprimer.",
      },
      {
        type: "callout",
        title: "Pourquoi c’est décisif",
        text: "Un présentoir posé une fois doit durer des années. Avec un QR dynamique, vous corrigez une faute, changez de fiche ou basculez vers une page à votre marque - sans jamais racheter ni réimprimer le support.",
      },
      { type: "h2", text: "Où placer le QR code pour qu’il soit vraiment scanné" },
      {
        type: "ul",
        items: [
          "Sur le comptoir, dans un présentoir : l’emplacement roi, au moment du paiement.",
          "Sur l’addition, le ticket ou le sac : un rappel qui repart avec le client.",
          "En vitrine ou en salle : capte les clients pendant l’attente.",
          "Sur la carte, le menu, la table : particulièrement efficace en restauration.",
        ],
      },
      {
        type: "p",
        text: "La règle : le QR doit être présent là où le client est satisfait et disponible. Le comptoir au moment de payer reste, de loin, le meilleur emplacement.",
      },
      { type: "h2", text: "Accompagner le QR d’un message clair" },
      {
        type: "p",
        text: "Un QR seul intrigue mais ne suffit pas toujours. Une phrase courte et honnête multiplie les scans : « Votre avis nous aide beaucoup - scannez pour nous laisser un mot sur Google ». Restez sincère et proposez-le à tout le monde : pas de « seulement si vous avez aimé », qui contreviendrait aux règles de Google.",
      },
      { type: "h2", text: "Aller plus loin : mesurer et ajuster" },
      {
        type: "p",
        text: "Un QR statique ne dit rien de son efficacité. Une solution comme reviu compte les scans, distingue le canal NFC du QR, et suit les clics vers Google - établissement par établissement. Vous savez ce qui fonctionne, à quel emplacement, et vous ajustez. Le QR n’est plus un pari, c’est un canal piloté.",
      },
    ],
    faq: [
      {
        q: "Comment créer un QR code pour les avis Google gratuitement ?",
        a: "Récupérez le lien d’avis dans votre Google Business Profile, puis passez-le dans un générateur de QR. Attention : la plupart créent un QR statique, non modifiable. Pour un support durable en boutique, préférez un QR dynamique dont vous pilotez la destination.",
      },
      {
        q: "Le QR code fonctionne-t-il sur tous les téléphones ?",
        a: "Oui. Depuis plusieurs années, l’appareil photo natif des iPhone et Android détecte les QR codes sans application dédiée. C’est ce qui en fait un complément universel à la puce NFC.",
      },
      {
        q: "Quelle différence avec un présentoir NFC ?",
        a: "Le NFC est plus rapide (approcher le téléphone), le QR est plus universel (n’importe quel appareil photo). Le mieux est de combiner les deux sur un même présentoir pour ne perdre aucun client.",
      },
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "avoir-plus-avis-google",
      "avis-google-commerce-local",
    ],
  },

  {
    slug: "avis-google-commerce-local",
    metaTitle:
      "Avis Google : pourquoi ils sont décisifs pour un commerce local · reviu",
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
          "Rendez la demande d’avis systématique, au moment du paiement.",
          "Réduisez le geste au minimum avec un support NFC + QR sur le comptoir.",
          "Répondez aux avis, positifs comme négatifs, pour montrer que vous êtes attentif.",
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
    ],
  },

  {
    slug: "repondre-avis-google",
    metaTitle:
      "Répondre aux avis Google : méthode et exemples (positifs et négatifs) · reviu",
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
        text: "Collecter des avis, c’est la moitié du travail. Y répondre, c’est l’autre moitié - et c’est visible de tous vos futurs clients. Une réponse soignée valorise un client satisfait, transforme une critique en preuve de sérieux, et envoie à Google un signal d’activité. Voici comment répondre efficacement, avec des modèles à adapter.",
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
        text: "C’est là que se joue votre réputation. La règle d’or : ne jamais répondre à chaud. Remerciez pour le retour, reconnaissez le ressenti sans vous justifier à l’excès, et proposez de poursuivre en privé. Vous parlez autant au client mécontent qu’aux centaines de personnes qui liront l’échange.",
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
      "avis-google-commerce-local",
      "avoir-plus-avis-google",
      "avis-google-restaurant",
    ],
  },

  {
    slug: "avis-google-restaurant",
    metaTitle:
      "Plus d’avis Google pour un restaurant : la méthode qui marche · reviu",
    h1: "Obtenir plus d’avis Google pour un restaurant",
    description:
      "La méthode concrète pour collecter plus d’avis Google au restaurant : quand demander, où placer le QR, quoi dire en salle - sans gêner le service.",
    excerpt:
      "En restauration, le bon moment et le bon support font tout. Voici comment récolter des avis Google sans alourdir le service ni forcer la main.",
    keywords: [
      "avis google restaurant",
      "avis clients restaurant",
      "plus d’avis restaurant",
      "qr code avis restaurant",
      "collecter avis restaurant",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-24",
    dateModified: UPDATED,
    blocks: [
      {
        type: "p",
        text: "Au restaurant, les avis Google font venir de nouveaux clients - mais les récolter sans casser le rythme du service est un art. Bonne nouvelle : quelques réflexes simples suffisent à transformer des convives satisfaits en avis, sans gêner ni forcer. Voici la méthode, pensée pour la salle.",
      },
      { type: "h2", text: "Le moment parfait : la fin du repas" },
      {
        type: "p",
        text: "L’émotion est au sommet quand le repas s’est bien passé et que l’addition arrive. C’est là qu’il faut proposer l’avis - pas par e-mail le lendemain, quand le souvenir s’estompe. Le client est encore attablé, détendu, téléphone à portée de main : tout est réuni.",
      },
      {
        type: "callout",
        title: "La règle d’or en restauration",
        text: "Demandez au moment de l’addition, avec un support déjà sur la table ou apporté avec la note. Le geste doit tenir en un scan, sans quitter la table.",
      },
      { type: "h2", text: "Où placer le support pour être scanné" },
      {
        type: "ul",
        items: [
          "Sur la table, dans un petit présentoir : visible tout le repas, scanné à la fin.",
          "Avec l’addition ou le porte-note : le moment le plus naturel.",
          "Sur le comptoir, pour la vente à emporter et le passage rapide.",
          "Sur le menu ou le set de table : un rappel discret pendant l’attente.",
        ],
      },
      { type: "h2", text: "Quoi dire, sans que ça sonne forcé" },
      {
        type: "p",
        text: "Un mot simple du serveur, sincère, fait toute la différence : « Si vous avez passé un bon moment, un avis Google nous aide énormément - c’est juste ici, en un scan. » On propose à tous, on ne conditionne jamais à une bonne note, et on n’offre rien en échange : ce sont les règles de Google, et c’est aussi ce qui garde vos avis crédibles.",
      },
      { type: "h2", text: "Former l’équipe en salle" },
      {
        type: "ol",
        items: [
          "Une phrase commune, courte, que tout le monde connaît.",
          "Un geste unique à montrer : approcher le téléphone du présentoir ou scanner le QR.",
          "La proposition au bon moment : à l’addition, jamais avant le dessert.",
          "Aucune pression : on invite, on n’insiste pas.",
        ],
      },
      { type: "h2", text: "Mesurer pour progresser" },
      {
        type: "p",
        text: "Combien de scans par service ? Quel présentoir marche le mieux, en terrasse ou au comptoir ? Un tableau de bord qui compte les scans et les clics vers Google, par établissement, permet d’ajuster l’emplacement et le discours. En restauration multi-sites, c’est aussi la seule façon de comparer objectivement ce qui fonctionne.",
      },
      {
        type: "p",
        text: "Avec un présentoir reviu sur chaque table ou au comptoir, encodé NFC + QR et modifiable à distance, la collecte devient un réflexe de fin de service - et la note grimpe, semaine après semaine.",
      },
    ],
    faq: [
      {
        q: "Comment demander un avis Google au restaurant sans gêner le client ?",
        a: "Au moment de l’addition, avec un mot sincère et un support déjà sur la table : « si vous avez passé un bon moment, un avis nous aide beaucoup, c’est en un scan ». On propose, on n’insiste pas, et on le fait pour tous les clients.",
      },
      {
        q: "Faut-il un QR code sur chaque table ?",
        a: "C’est très efficace : le support reste visible tout le repas et le client scanne à la fin, sans quitter la table. À défaut, un présentoir au comptoir et un QR sur l’addition font déjà une grande différence.",
      },
      {
        q: "Peut-on offrir un café ou une réduction contre un avis ?",
        a: "Non : offrir une contrepartie contre un avis est interdit par Google et peut entraîner la suppression des avis. On récompense la fidélité autrement, jamais l’avis lui-même.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-boulangerie",
    ],
  },

  {
    slug: "avis-google-coiffeur",
    metaTitle:
      "Plus d’avis Google pour un salon de coiffure : la méthode · reviu",
    h1: "Obtenir plus d’avis Google pour un salon de coiffure",
    description:
      "La méthode concrète pour récolter plus d’avis Google en salon de coiffure : le bon moment à l’encaissement, quoi dire, où poser le support - dans les règles.",
    excerpt:
      "En coiffure, la relation est forte et la satisfaction se voit dans le miroir. Voici comment transformer ce moment en avis Google, sans jamais forcer.",
    keywords: [
      "avis google coiffeur",
      "avis google salon de coiffure",
      "avis clients coiffeur",
      "qr code avis coiffeur",
      "plus d’avis coiffure",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-26",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "Pour un salon de coiffure, les avis Google sont la première vitrine : on choisit rarement un coiffeur au hasard, on regarde d’abord la note et les commentaires. Or la coiffure a un atout que peu de métiers possèdent - la satisfaction est immédiate et visible, dans le miroir, à la fin de la prestation. Il suffit de capter ce moment. Voici comment récolter plus d’avis Google en salon, sans alourdir l’accueil ni forcer la main.",
      },
      { type: "h2", text: "Le bon moment : le miroir, puis l’encaissement" },
      {
        type: "p",
        text: "Le pic de satisfaction, c’est la découverte du résultat dans le miroir, quand la cliente ou le client est visiblement content. L’enchaînement naturel vers l’avis se joue ensuite, à la caisse : le geste est calme, le téléphone déjà en main pour payer. Attendre un e-mail le lendemain, c’est laisser l’enthousiasme retomber.",
      },
      {
        type: "callout",
        title: "La règle d’or en coiffure",
        text: "Proposez l’avis à l’encaissement, juste après le « ça vous plaît ? » devant le miroir. Un support déjà posé sur le comptoir, un scan, et c’est fait - sans quitter la caisse.",
      },
      { type: "h2", text: "Où placer le support dans le salon" },
      {
        type: "ul",
        items: [
          "Sur le comptoir d’encaissement : l’emplacement le plus naturel, au moment du paiement.",
          "À chaque poste de coiffage, près du miroir : un rappel visible pendant toute la prestation.",
          "Sur le meuble d’accueil, à côté des cartes de rendez-vous : pour l’attente et le départ.",
        ],
      },
      { type: "h2", text: "Quoi dire, sans que ça sonne commercial" },
      {
        type: "p",
        text: "Un mot sincère suffit : « Si la coupe vous plaît, un avis Google nous aide énormément - c’est juste ici, en un scan. » On propose à tout le monde, on ne réserve jamais la demande aux clients qu’on croit satisfaits, et on n’offre aucune remise en échange : ce sont les règles de Google, et c’est aussi ce qui garde vos avis crédibles.",
      },
      { type: "h2", text: "Profiter de la clientèle fidèle" },
      {
        type: "p",
        text: "Un salon vit de ses habitués, qui reviennent toutes les quelques semaines. C’est une force pour les avis : même si un client oublie une fois, l’occasion revient. L’idée n’est pas de redemander à chaque passage, mais de rendre le support visible en permanence, pour que celui qui n’a pas encore laissé d’avis le fasse dès qu’il en a envie.",
      },
      { type: "h2", text: "Mesurer et ajuster" },
      {
        type: "p",
        text: "Combien de scans par semaine ? Le poste au miroir marche-t-il mieux que le comptoir ? Un tableau de bord qui compte les scans et les clics vers Google permet de tester les emplacements et le discours de l’équipe. Avec un présentoir reviu encodé NFC + QR au comptoir et modifiable à distance, la demande d’avis devient un réflexe de fin de prestation - et la note du salon monte, rendez-vous après rendez-vous.",
      },
    ],
    faq: [
      {
        q: "Comment demander un avis Google à un client en coiffure ?",
        a: "À l’encaissement, juste après avoir montré le résultat au miroir : « si la coupe vous plaît, un avis Google nous aide beaucoup, c’est en un scan ». On propose à tous les clients, sans insister et sans conditionner à une bonne note.",
      },
      {
        q: "Où placer le QR code dans un salon de coiffure ?",
        a: "Sur le comptoir d’encaissement en priorité, car c’est là que se fait le paiement. Un rappel à chaque poste, près du miroir, renforce l’effet en gardant le support visible pendant toute la prestation.",
      },
      {
        q: "Peut-on offrir une réduction contre un avis ?",
        a: "Non : offrir une contrepartie contre un avis est interdit par Google et peut entraîner la suppression des avis. On fidélise autrement, jamais en échange de l’avis lui-même.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-institut-beaute",
      "repondre-avis-google",
    ],
  },

  {
    slug: "avis-google-garage",
    metaTitle:
      "Plus d’avis Google pour un garage : la méthode qui marche · reviu",
    h1: "Obtenir plus d’avis Google pour un garage automobile",
    description:
      "Comment un garage récolte plus d’avis Google : le bon moment à la restitution du véhicule, quoi dire pour rassurer, où placer le QR - dans les règles.",
    excerpt:
      "En mécanique auto, la confiance décide de tout. Des avis Google nombreux et récents rassurent les nouveaux clients. Voici comment les collecter simplement.",
    keywords: [
      "avis google garage",
      "avis google garagiste",
      "avis clients garage auto",
      "qr code avis garage",
      "plus d’avis garage automobile",
    ],
    category: "Par métier",
    readMinutes: 6,
    datePublished: "2026-07-27",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "Confier sa voiture demande de la confiance, et cette confiance se lit dans les avis Google. Avant de choisir un garage, un automobiliste compare les notes et cherche des commentaires récents sur le sérieux, la transparence des prix et la qualité du travail. Un garage qui collecte régulièrement des avis part avec une longueur d’avance. Voici comment en récolter plus, sans gêner l’atelier ni forcer le client.",
      },
      { type: "h2", text: "Le bon moment : la restitution du véhicule" },
      {
        type: "p",
        text: "Le moment le plus fort, c’est la remise des clés : la voiture est réparée, le client est soulagé et satisfait du service. C’est là qu’il faut proposer l’avis, au comptoir, pendant le règlement de la facture - pas par un e-mail envoyé plus tard, souvent ignoré.",
      },
      {
        type: "callout",
        title: "La règle d’or au garage",
        text: "Proposez l’avis à la restitution, au moment de rendre les clés et de régler. Un support sur le comptoir d’accueil, un scan, et le client repart en ayant déjà donné son avis.",
      },
      { type: "h2", text: "Où placer le support à l’accueil" },
      {
        type: "ul",
        items: [
          "Sur le comptoir d’accueil, là où se règlent les factures : l’emplacement clé.",
          "Dans l’espace d’attente, avec les magazines : un rappel pendant l’intervention.",
          "Agrafé ou joint à la facture remise : un relais discret pour ceux qui préfèrent scanner plus tard.",
        ],
      },
      { type: "h2", text: "Quoi dire pour rassurer, pas pour vendre" },
      {
        type: "p",
        text: "Un mot simple et honnête fonctionne mieux qu’un argumentaire : « Si vous avez été satisfait de l’intervention, un avis Google aide beaucoup les automobilistes du coin à nous trouver - c’est en un scan. » On invite tous les clients, sans trier selon la note attendue, et sans jamais offrir de remise en échange : ce sont les règles de Google.",
      },
      { type: "h2", text: "Répondre aux avis, un réflexe qui compte double" },
      {
        type: "p",
        text: "Dans un métier où la confiance est tout, la façon dont un garage répond aux avis - y compris aux plus critiques - en dit long aux futurs clients. Une réponse posée, factuelle et courtoise à un avis mitigé rassure souvent plus qu’une série de cinq étoiles muettes. Répondre montre aussi à Google que la fiche est active.",
      },
      { type: "h2", text: "Mesurer et progresser" },
      {
        type: "p",
        text: "Combien de scans par semaine, pour combien d’interventions ? Un tableau de bord qui suit les scans et les clics vers Google permet d’ajuster l’emplacement du support et le mot de l’équipe. Avec un présentoir reviu sur le comptoir, encodé NFC + QR et modifiable à distance, la demande d’avis devient un réflexe de restitution - et la réputation du garage se construit, intervention après intervention.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis Google au garage ?",
        a: "À la restitution du véhicule, quand le client récupère ses clés et règle la facture : il est satisfait et disponible. On propose l’avis au comptoir, en un scan, plutôt que par un e-mail envoyé plus tard.",
      },
      {
        q: "Comment demander un avis sans paraître insistant ?",
        a: "Avec un mot honnête et bref : « si vous avez été satisfait, un avis Google nous aide beaucoup ». On propose à tous les clients, on ne conditionne jamais à une bonne note et on n’offre aucune contrepartie.",
      },
      {
        q: "Faut-il répondre aux avis négatifs d’un garage ?",
        a: "Oui : une réponse calme et factuelle à un avis critique rassure les futurs clients et montre le sérieux du garage. C’est souvent plus convaincant qu’une note parfaite sans aucune réponse.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "repondre-avis-google",
      "avis-google-commerce-local",
    ],
  },

  {
    slug: "avis-google-boulangerie",
    metaTitle:
      "Plus d’avis Google pour une boulangerie-pâtisserie · reviu",
    h1: "Obtenir plus d’avis Google pour une boulangerie",
    description:
      "La méthode pour récolter plus d’avis Google en boulangerie malgré le flux rapide : où poser le support au comptoir, quoi dire en un mot - dans les règles.",
    excerpt:
      "En boulangerie, le passage est rapide mais quotidien et fidèle. Le défi : capter l’avis sans ralentir la file. Voici comment, avec un support au bon endroit.",
    keywords: [
      "avis google boulangerie",
      "avis google boulangerie patisserie",
      "avis clients boulangerie",
      "qr code avis boulangerie",
      "plus d’avis boulangerie",
    ],
    category: "Par métier",
    readMinutes: 5,
    datePublished: "2026-07-28",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "La boulangerie a un profil unique pour les avis Google : un flux rapide, mais une clientèle d’habitués qui revient chaque jour. Le passage à la caisse dure quelques secondes, ce qui semble être un frein - mais la fidélité offre mille occasions de récolter un avis. Il suffit d’un support bien placé et d’un mot au bon moment. Voici comment faire, sans jamais ralentir la file.",
      },
      { type: "h2", text: "Le défi du passage rapide" },
      {
        type: "p",
        text: "Impossible de tenir un discours à chaque client quand la file s’allonge le matin. La solution n’est pas de demander plus, mais de rendre l’avis possible en autonomie : un support visible que le client scanne quand il le souhaite, sur place ou en repartant. La demande orale se réserve aux moments plus calmes, en journée.",
      },
      { type: "h2", text: "Où placer le support au comptoir" },
      {
        type: "ul",
        items: [
          "Près du terminal de paiement : le point de regard naturel pendant le règlement.",
          "Sur le comptoir, à hauteur des yeux : visible sans effort dans la file.",
          "Sur le ticket ou le sac, en complément : un rappel à scanner une fois rentré.",
        ],
      },
      {
        type: "callout",
        title: "La règle d’or en boulangerie",
        text: "Misez sur un support autonome et bien visible près de la caisse, plutôt que sur un discours. Le client scanne quand il veut - et vos habitués finissent tous par le faire.",
      },
      { type: "h2", text: "Quoi dire, en un mot" },
      {
        type: "p",
        text: "Aux heures calmes, un mot suffit : « Si vous vous régalez, un petit avis Google nous fait très plaisir - c’est juste là. » On s’adresse à tous les clients, sans trier, et on n’offre jamais une viennoiserie ou une remise contre un avis : c’est interdit par Google et ça fragilise votre fiche.",
      },
      { type: "h2", text: "Transformer la fidélité en avis" },
      {
        type: "p",
        text: "Un client qui passe chaque matin verra le support des dizaines de fois. C’est tout l’intérêt d’un emplacement permanent : celui qui n’a pas encore laissé d’avis le fera le jour où il en aura envie, sans qu’on ait à le relancer. La régularité du passage remplace la relance.",
      },
      { type: "h2", text: "Mesurer ce qui marche" },
      {
        type: "p",
        text: "Combien de scans par jour, aux heures de pointe ou en journée ? Un tableau de bord qui suit les scans et les clics vers Google aide à trouver le meilleur emplacement du support. Avec un présentoir reviu au comptoir, encodé NFC + QR et modifiable à distance, la collecte tourne toute seule - et la note de la boulangerie grimpe, semaine après semaine.",
      },
    ],
    faq: [
      {
        q: "Comment récolter des avis en boulangerie malgré la file d’attente ?",
        a: "En misant sur un support visible et autonome près de la caisse, que le client scanne quand il le souhaite, plutôt que sur un discours. La demande orale se garde pour les heures calmes.",
      },
      {
        q: "Où placer le QR code dans une boulangerie ?",
        a: "Près du terminal de paiement et sur le comptoir à hauteur des yeux : ce sont les points de regard pendant le règlement. Un rappel sur le ticket ou le sac aide ceux qui préfèrent scanner en rentrant.",
      },
      {
        q: "Peut-on offrir une viennoiserie contre un avis Google ?",
        a: "Non : offrir une contrepartie contre un avis est interdit par Google et peut entraîner leur suppression. On remercie la fidélité autrement, jamais l’avis en lui-même.",
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
    metaTitle:
      "Plus d’avis Google pour un institut de beauté / esthétique · reviu",
    h1: "Obtenir plus d’avis Google pour un institut de beauté",
    description:
      "Comment un institut de beauté récolte plus d’avis Google : le bon moment après le soin, quoi dire à l’encaissement, où poser le support - dans les règles.",
    excerpt:
      "Après un soin réussi, la cliente est détendue et satisfaite. C’est le moment idéal pour un avis Google. Voici la méthode, pensée pour l’institut.",
    keywords: [
      "avis google institut de beaute",
      "avis google estheticienne",
      "avis clients institut beaute",
      "qr code avis institut",
      "plus d’avis esthetique",
    ],
    category: "Par métier",
    readMinutes: 5,
    datePublished: "2026-07-29",
    dateModified: UPDATED_METIERS,
    blocks: [
      {
        type: "p",
        text: "En institut de beauté, on ne choisit pas au hasard à qui l’on confie sa peau et son bien-être : la note Google et les avis rassurent avant la prise de rendez-vous. L’esthétique a un atout précieux - la cliente termine son soin détendue, satisfaite, dans un moment de bien-être. C’est l’instant parfait pour un avis. Voici comment le capter, sans casser l’ambiance apaisée de l’institut.",
      },
      { type: "h2", text: "Le bon moment : juste après le soin" },
      {
        type: "p",
        text: "Le pic de satisfaction se situe à la fin du soin, quand la cliente découvre le résultat et se sent bien. L’enchaînement se fait à l’encaissement, dans un moment calme et privilégié. C’est bien plus efficace qu’un e-mail envoyé le lendemain, quand la sensation de bien-être est retombée.",
      },
      {
        type: "callout",
        title: "La règle d’or en institut",
        text: "Proposez l’avis à l’encaissement, dans la continuité du soin, avec un support déjà posé sur le comptoir. Un scan, sans rompre le calme de l’institut.",
      },
      { type: "h2", text: "Où placer le support dans l’institut" },
      {
        type: "ul",
        items: [
          "Sur le comptoir d’accueil et d’encaissement : le point de passage final, au calme.",
          "Dans l’espace d’attente, près des cartes de soin : un rappel discret avant le rendez-vous.",
          "À côté du carnet de rendez-vous : au moment de reprogrammer le prochain soin.",
        ],
      },
      { type: "h2", text: "Quoi dire, en douceur" },
      {
        type: "p",
        text: "Un mot simple et bienveillant : « Si vous êtes satisfaite du soin, un avis Google nous aide beaucoup - c’est juste ici, en un scan. » On propose à toutes les clientes, sans trier selon la note qu’on imagine, et sans jamais offrir de réduction en échange : ce sont les règles de Google, et c’est ce qui garde vos avis authentiques.",
      },
      { type: "h2", text: "Le lien avec la prise de rendez-vous suivante" },
      {
        type: "p",
        text: "En institut, la fidélité passe par le rendez-vous suivant, souvent fixé sur place. C’est un second moment idéal : la cliente est encore au comptoir, satisfaite et posée. Associer discrètement la demande d’avis à la reprogrammation du prochain soin, sans jamais la conditionner, rend le geste naturel.",
      },
      { type: "h2", text: "Mesurer et ajuster" },
      {
        type: "p",
        text: "Combien de scans par semaine, pour combien de soins réalisés ? Un tableau de bord qui suit les scans et les clics vers Google permet de tester l’emplacement du support et le mot de l’équipe. Avec un présentoir reviu au comptoir, encodé NFC + QR et modifiable à distance, la demande d’avis devient un réflexe de fin de soin - et la réputation de l’institut se renforce, rendez-vous après rendez-vous.",
      },
    ],
    faq: [
      {
        q: "Quel est le meilleur moment pour demander un avis en institut de beauté ?",
        a: "Juste après le soin, à l’encaissement, quand la cliente découvre le résultat et se sent bien. C’est un moment calme et privilégié, bien plus efficace qu’un e-mail envoyé le lendemain.",
      },
      {
        q: "Comment demander un avis sans casser l’ambiance apaisée du soin ?",
        a: "Avec un mot doux et sincère, et un support déjà posé sur le comptoir : la cliente scanne en un geste, sans rupture. On propose à toutes, sans insister et sans conditionner à une bonne note.",
      },
      {
        q: "Peut-on offrir une remise sur un prochain soin contre un avis ?",
        a: "Non : offrir une contrepartie contre un avis est interdit par Google et peut entraîner leur suppression. On fidélise la cliente autrement, jamais en échange de l’avis lui-même.",
      },
    ],
    related: [
      "avoir-plus-avis-google",
      "presentoir-plaque-nfc-avis-google",
      "avis-google-coiffeur",
      "repondre-avis-google",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guideSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
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
