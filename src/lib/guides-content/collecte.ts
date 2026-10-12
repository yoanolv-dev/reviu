import type { Guide } from "@/lib/guides";

/**
 * Grappe « collecte » : lien d’avis, pas à pas client, NFC vs QR code,
 * dépannage d’une plaque NFC et prix d’une plaque avis Google.
 * Procédures Google vérifiées sur l’aide officielle (octobre 2026).
 */
export const COLLECT_GUIDES: Guide[] = [
  // ── 1. Lien avis Google ────────────────────────────────────────────────────
  {
    slug: "lien-avis-google",
    metaTitle: "Lien avis Google : le trouver, le créer, le partager · reviu",
    h1: "Lien avis Google : comment le trouver, le créer et le partager",
    description:
      "Où trouver le lien avis Google de votre fiche, comment le créer avec le Place ID, le tester et le partager par QR code, SMS ou e-mail, sans erreur.",
    excerpt:
      "Le lien avis Google ouvre directement la fenêtre de notation de votre fiche. Voici comment l’obtenir, le vérifier et le diffuser partout où vos clients vous croisent.",
    keywords: [
      "lien avis google",
      "lien pour laisser un avis google",
      "créer un lien avis google",
      "trouver lien avis google",
      "place id google avis",
      "partager lien avis google",
    ],
    category: "Collecter des avis",
    readMinutes: 8,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Le lien avis Google est une adresse qui ouvre directement la fenêtre de notation de votre établissement, sans que le client ait à vous chercher. Il s’obtient depuis votre fiche d’établissement (« Voir les avis », puis « Recevoir plus d’avis » et « Copier »), ou se construit à partir de l’identifiant de la fiche, le Place ID. Avant de l’imprimer ou de l’envoyer, testez-le toujours sur un téléphone.",
      },
      { type: "h2", text: "Lien de fiche, lien d’avis, lien d’un avis : ne pas confondre" },
      {
        type: "p",
        text: "Trois liens circulent autour d’une fiche Google, et ils ne mènent pas au même endroit. Les confondre explique une bonne partie des liens « qui ne marchent pas » :",
      },
      {
        type: "ul",
        items: [
          "Le lien de la fiche : obtenu en partageant un lieu depuis Google Maps ou en copiant la barre d’adresse. Il ouvre votre fiche (photos, horaires, itinéraire), et le client doit encore trouver où laisser son avis.",
          "Le lien d’avis : fourni par votre fiche d’établissement pour demander des avis. Il ouvre directement la fenêtre où l’on choisit ses étoiles et où l’on écrit.",
          "Le lien d’un avis précis : il sert à partager un avis existant, par exemple pour le citer sur votre site. Il affiche cet avis, pas le formulaire.",
        ],
      },
      {
        type: "p",
        text: "Seul le deuxième a sa place derrière un QR code, une puce NFC ou un bouton « Laisser un avis » : un client qui doit encore chercher le bouton remet souvent l’avis à plus tard, et plus tard devient jamais.",
      },
      { type: "h2", text: "Méthode 1 : copier le lien depuis votre fiche d’établissement" },
      {
        type: "p",
        text: "C’est la méthode officielle, décrite dans l’aide de Google. Il faut être connecté avec un compte Google qui a accès à la gestion de la fiche.",
      },
      {
        type: "ol",
        items: [
          "Sur un ordinateur, connectez-vous au compte Google qui gère votre établissement et ouvrez votre fiche d’établissement.",
          "Sélectionnez « Voir les avis ».",
          "Cliquez sur l’icône de partage placée à côté de « Recevoir plus d’avis ».",
          "Pour le lien, sélectionnez « Copier » : il est dans votre presse-papiers, prêt à être collé.",
          "Pour le QR code, faites un clic droit sur l’image, puis « Enregistrer l’image sous ».",
        ],
      },
      {
        type: "p",
        text: "La même fenêtre permet aussi d’envoyer la demande par e-mail, message WhatsApp ou publication Facebook. La marche à suivre complète figure sur la page d’aide [Créer un lien ou un QR code pour demander des avis](https://support.google.com/business/answer/16816815?hl=fr).",
      },
      {
        type: "callout",
        title: "Sur téléphone, une limite à connaître",
        text: "Google précise que le QR code d’avis ne peut, pour le moment, être généré que dans un navigateur sur ordinateur. Sans ordinateur, passez par la méthode du Place ID ci-dessous et créez le QR code avec notre [générateur de QR code avis Google gratuit](/outils/qr-code-avis-google).",
      },
      {
        type: "p",
        text: "Les libellés de l’interface Google évoluent régulièrement. Si vous ne voyez pas « Recevoir plus d’avis », cherchez l’option de partage dans la rubrique des avis de votre fiche, et non le bouton de partage général de la fiche.",
      },
      { type: "h2", text: "Méthode 2 : construire le lien à partir du Place ID" },
      {
        type: "p",
        text: "Chaque lieu référencé sur Google Maps possède un identifiant unique, le Place ID, qui commence souvent par « ChIJ ». Google publie un outil de recherche, le « Place ID Finder », dans la documentation de Google Maps Platform : tapez le nom de votre établissement, sélectionnez le bon résultat et l’identifiant s’affiche. Avantage : aucun accès à la gestion de la fiche n’est nécessaire.",
      },
      {
        type: "p",
        text: "Il suffit ensuite d’ajouter l’identifiant complet à la fin de l’adresse https://search.google.com/local/writereview?placeid= pour obtenir le lien d’avis. Plus simple : collez le Place ID seul dans notre générateur de QR code, qui construit le lien et le QR code correspondant.",
      },
      {
        type: "p",
        text: "Deux précautions. Ce format est très répandu, mais il n’est pas décrit dans l’aide de la fiche d’établissement : vérifiez qu’il ouvre bien la fenêtre d’avis. Et la documentation de Google Maps Platform indique qu’un Place ID peut changer avec le temps, par exemple si l’établissement ferme ou déménage. Un lien construit il y a des années mérite un contrôle.",
      },
      { type: "h2", text: "Et depuis Google Maps sur téléphone ?" },
      {
        type: "p",
        text: "Le bouton de partage d’un lieu, dans l’application Google Maps, donne le lien de la fiche, pas celui du formulaire : utile pour indiquer votre adresse, pas pour collecter des avis. Une fiche validée se gère aussi dans Google Maps, mais l’emplacement des options varie selon les versions : pour le bon lien du premier coup, l’ordinateur reste le plus sûr.",
      },
      { type: "h2", text: "Tester le lien avant de le diffuser" },
      {
        type: "p",
        text: "Ce contrôle prend quelques minutes et évite d’imprimer cent cartes inutilisables :",
      },
      {
        type: "ol",
        items: [
          "Ouvrez le lien sur votre téléphone : la fenêtre doit afficher le nom de votre établissement et des étoiles à sélectionner.",
          "Ouvrez-le en navigation privée sur ordinateur : Google doit vous demander de vous connecter, puis afficher la même fenêtre. C’est ce que verra un client.",
          "Essayez-le sur un autre type de téléphone (iPhone et Android), avec et sans l’application Google Maps.",
          "Vérifiez qu’il s’agit bien de votre fiche, et pas d’un homonyme ou d’un ancien doublon.",
          "Notez le lien et la date du test : vous saurez quoi vérifier si un client signale un problème.",
        ],
      },
      {
        type: "p",
        text: "Pendant ces tests, ne publiez aucun avis, ni vous ni vos proches : un propriétaire, un salarié ou un membre de la famille qui note l’établissement relève des conflits d’intérêts interdits par Google.",
      },
      { type: "h2", text: "Où diffuser votre lien d’avis" },
      {
        type: "p",
        text: "Google suggère lui-même les reçus, les e-mails de remerciement, la fin d’une discussion et un QR code affiché en magasin. Canal par canal :",
      },
      {
        type: "ul",
        items: [
          "QR code au comptoir : là où le client attend quelques secondes, pendant qu’il est encore là. Notre guide sur le [QR code avis Google](/guides/qr-code-avis-google) détaille les emplacements qui fonctionnent.",
          "SMS ou WhatsApp, envoyé le jour même : idéal pour les rendez-vous, les prestations à domicile, la vente à emporter. Notre [générateur de message de demande d’avis](/outils/message-demande-avis-google) propose des modèles prêts à l’emploi.",
          "E-mail de suivi et signature e-mail : le lien dans une phrase visible, et une ligne discrète du type « Votre avis nous aide : partagez-le sur Google » qui travaille à chaque échange.",
          "Facture, devis, bon de livraison : des documents que le client relit au calme, où un QR code a toute sa place.",
          "Site internet et réseaux sociaux : un bouton sur la page contact, un lien épinglé plutôt qu’une publication vite noyée dans le fil.",
        ],
      },
      { type: "h2", text: "Faut-il raccourcir le lien ?" },
      {
        type: "p",
        text: "Un lien construit à partir du Place ID est long et peu lisible dans un SMS. Un raccourcisseur dépanne, avec un risque : si le service ferme ou change ses conditions, tous vos liens imprimés cessent de fonctionner. Choisissez un service dont vous gardez le contrôle, idéalement sur votre propre nom de domaine, et retestez le lien raccourci.",
      },
      { type: "h2", text: "Problèmes fréquents et solutions" },
      { type: "h3", text: "Le lien ouvre la fiche, pas la fenêtre d’avis" },
      {
        type: "p",
        text: "Le plus souvent, ce n’est pas le bon lien : lien de partage du lieu, adresse copiée dans le navigateur ou lien d’un avis précis. Reprenez la méthode 1. Si le bon lien affiche malgré tout la fiche chez certains clients, c’est souvent l’application Google Maps qui a pris le relais : l’avis se laisse alors depuis l’onglet « Avis », en touchant les cinq étoiles vides.",
      },
      { type: "h3", text: "Le client doit se connecter ou n’a pas de compte Google" },
      {
        type: "p",
        text: "C’est normal : Google exige un compte Google connecté pour publier un avis, et ce compte peut être créé avec une adresse e-mail autre que Gmail. Pour les clients peu à l’aise, envoyez notre [pas à pas pour laisser un avis Google](/guides/comment-laisser-avis-google), pensé pour être partagé.",
      },
      { type: "h3", text: "Le lien mène à une autre fiche ou ne fonctionne plus" },
      {
        type: "p",
        text: "Après un déménagement, la fusion de fiches en double ou la recréation d’une fiche, un ancien lien peut pointer vers une fiche fermée. Générez un nouveau lien depuis la fiche active et testez-le. Google précise qu’après une fusion, l’affichage des avis des deux profils peut prendre quelques jours : patientez avant de conclure à une perte.",
      },
      { type: "h3", text: "L’avis est publié mais n’apparaît pas" },
      {
        type: "p",
        text: "Le lien n’y est pour rien : Google examine les avis avant de les afficher, ce qui peut prendre quelques jours, et retire ceux qu’il juge contraires à ses règles. Voir notre guide sur les [avis Google qui disparaissent](/guides/avis-google-disparus).",
      },
      { type: "h2", text: "Ce que le lien ne doit jamais servir à faire" },
      {
        type: "p",
        text: "Les règles de Google interdisent de proposer un avantage en échange d’un avis, de solliciter des avis positifs de façon sélective, de presser un client de laisser son avis sur place ou de lui demander un contenu précis. Concrètement : le même lien, avec le même message, pour tous vos clients. Pas de « mettez-nous 5 étoiles », pas de remise contre un avis, pas de lien réservé à ceux qui ont répondu « très satisfait » à un questionnaire préalable.",
      },
      {
        type: "p",
        text: "Dernier conseil : évitez de graver votre lien Google en dur sur un support que vous comptez garder des années. Le [Présentoir Reviu](/presentoir-avis-google) ouvre, sans contact ou par QR code, une adresse fixe dont vous changez la destination depuis votre espace, sans rien réimprimer, et vous voyez combien de clients l’utilisent.",
      },
    ],
    faq: [
      {
        q: "Où trouver le lien pour laisser un avis sur ma fiche Google ?",
        a: "Sur ordinateur, ouvrez votre fiche d’établissement, sélectionnez « Voir les avis », puis l’icône de partage à côté de « Recevoir plus d’avis ». Choisissez « Copier » pour récupérer le lien. La même fenêtre permet de télécharger le QR code correspondant.",
      },
      {
        q: "Peut-on obtenir le lien d’avis Google sans accès à la fiche ?",
        a: "Oui, à partir du Place ID de l’établissement, que l’outil Place ID Finder de Google permet de retrouver. On l’insère dans l’adresse de rédaction d’avis de Google, ou on le colle dans un générateur qui fait la conversion. Testez toujours le lien obtenu avant de le diffuser.",
      },
      {
        q: "Le lien avis Google peut-il changer ?",
        a: "Oui, notamment si la fiche est recréée, fusionnée avec un doublon ou si l’établissement déménage : Google indique que l’identifiant d’un lieu peut évoluer. Retestez votre lien après toute modification importante de la fiche.",
      },
      {
        q: "Pourquoi mon lien d’avis ouvre-t-il la fiche au lieu du formulaire ?",
        a: "Le plus souvent, il s’agit du lien de partage du lieu ou d’une adresse copiée dans le navigateur, et non du lien d’avis fourni par la fiche. Il arrive aussi que l’application Google Maps du client affiche la fiche : l’avis se laisse alors depuis l’onglet Avis, en touchant les étoiles.",
      },
      {
        q: "Mes clients doivent-ils avoir un compte Google pour laisser un avis ?",
        a: "Oui, Google exige d’être connecté à un compte Google pour publier un avis. Ce compte peut être créé gratuitement, y compris avec une adresse e-mail autre que Gmail.",
      },
      {
        q: "Puis-je envoyer mon lien d’avis uniquement aux clients satisfaits ?",
        a: "Non. Les règles de Google interdisent de solliciter des avis positifs de façon sélective. Le même lien doit être proposé à tous vos clients, sans contrepartie et sans leur dicter la note ni le contenu.",
      },
    ],
    related: [
      "qr-code-avis-google",
      "comment-laisser-avis-google",
      "avoir-plus-avis-google",
      "nfc-ou-qr-code-avis-google",
    ],
  },

  // ── 2. Comment laisser un avis Google ─────────────────────────────────────
  {
    slug: "comment-laisser-avis-google",
    metaTitle: "Comment laisser un avis Google : le pas à pas · reviu",
    h1: "Comment laisser un avis Google : le pas à pas (téléphone, ordinateur)",
    description:
      "Laisser un avis Google sur Android, iPhone ou ordinateur, depuis un QR code ou un présentoir : les étapes, le compte requis, modifier ou supprimer son avis.",
    excerpt:
      "Toutes les façons de laisser un avis Google, étape par étape, sur téléphone comme sur ordinateur. Une page claire, à garder pour soi ou à envoyer à ses clients.",
    keywords: [
      "comment laisser un avis google",
      "laisser un avis google",
      "mettre un avis google",
      "écrire un avis google",
      "avis google iphone",
      "modifier un avis google",
      "supprimer un avis google",
    ],
    category: "Collecter des avis",
    readMinutes: 8,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Pour laisser un avis Google, connectez-vous à votre compte Google, ouvrez la fiche de l’établissement (dans Google Maps, dans la recherche Google, ou via le lien, le QR code ou le présentoir du commerce), touchez les étoiles, écrivez quelques lignes et publiez. Le plus rapide reste le raccourci fourni par le commerce, qui ouvre directement la fenêtre de notation. Voici le détail pour chaque appareil.",
      },
      { type: "h2", text: "Avant de commencer : un compte Google" },
      {
        type: "p",
        text: "Google n’accepte que les avis publiés depuis un compte Google connecté. Si vous avez une adresse Gmail, vous avez déjà un compte. Sinon, vous pouvez en créer un avec votre adresse e-mail habituelle, sans ouvrir de boîte Gmail : Google le précise dans son aide. Sur un téléphone Android, vous êtes en général déjà connecté ; sur iPhone, la connexion se fait dans l’application Google Maps ou dans le navigateur, au moment de publier.",
      },
      { type: "h2", text: "Le plus simple : le lien, le QR code ou le présentoir du commerce" },
      {
        type: "p",
        text: "De nombreux commerces mettent à disposition un raccourci qui ouvre directement la bonne fenêtre :",
      },
      {
        type: "ul",
        items: [
          "Un QR code : ouvrez l’appareil photo de votre téléphone, visez le code, puis touchez le lien qui s’affiche à l’écran.",
          "Un présentoir sans contact : téléphone déverrouillé, approchez le haut de votre iPhone, ou le dos de votre téléphone Android, à quelques centimètres de la zone indiquée, comme pour payer sans contact. Sur iPhone, une notification apparaît en haut de l’écran : touchez-la pour ouvrir la page.",
          "Un lien reçu par SMS ou par e-mail : touchez-le, tout simplement.",
        ],
      },
      {
        type: "p",
        text: "La fenêtre d’avis s’ouvre au nom de l’établissement. Si votre téléphone affiche plutôt la fiche dans l’application Google Maps, touchez l’onglet « Avis », puis les cinq étoiles vides : vous êtes au même endroit.",
      },
      { type: "h2", text: "Sur un téléphone Android, avec Google Maps" },
      {
        type: "p",
        text: "Sans lien ni QR code, passez par l’application Google Maps. Les étapes ci-dessous suivent l’aide officielle de Google :",
      },
      {
        type: "ol",
        items: [
          "Ouvrez l’application Google Maps.",
          "Recherchez l’établissement par son nom (ajoutez la ville en cas d’homonymes), ou touchez-le sur la carte.",
          "En bas de l’écran, touchez le nom ou l’adresse du lieu pour ouvrir sa fiche.",
          "En haut de la fiche, touchez l’onglet « Avis ».",
          "Touchez les cinq étoiles vides, puis choisissez votre note.",
          "Écrivez votre commentaire sous « Dites-nous en plus sur votre expérience ». Vous pouvez aussi répondre aux questions proposées et ajouter des photos.",
          "Publiez votre avis.",
        ],
      },
      { type: "h2", text: "Sur iPhone : avec l’application Google Maps ou le navigateur" },
      {
        type: "p",
        text: "Avec l’application Google Maps, disponible sur l’App Store, le parcours est le même que sur Android : rechercher le lieu, toucher son nom en bas de l’écran, ouvrir l’onglet « Avis », toucher les cinq étoiles vides, écrire sous « Dites-nous en plus sur votre expérience », puis publier.",
      },
      { type: "p", text: "Sans l’application, utilisez Safari ou un autre navigateur :" },
      {
        type: "ol",
        items: [
          "Recherchez sur Google le nom de l’établissement suivi de la ville.",
          "Sur la fiche qui s’affiche, ouvrez la partie consacrée aux avis.",
          "Touchez l’option qui propose d’écrire un avis, ou directement les étoiles.",
          "Connectez-vous à votre compte Google si la page vous le demande.",
          "Choisissez votre note, écrivez votre commentaire et publiez.",
        ],
      },
      {
        type: "p",
        text: "Les libellés affichés dans le navigateur varient selon les versions de la recherche Google : cherchez simplement l’option qui mentionne un avis.",
      },
      { type: "h2", text: "Sur ordinateur" },
      {
        type: "ol",
        items: [
          "Ouvrez Google Maps dans votre navigateur et connectez-vous à votre compte Google.",
          "Recherchez l’établissement.",
          "Dans le panneau de gauche, faites défiler la fiche et cliquez sur « Rédiger un avis ».",
          "Cliquez sur les étoiles pour attribuer votre note, puis rédigez votre commentaire.",
          "Ajoutez des photos si vous le souhaitez, puis cliquez sur « Publier ».",
        ],
      },
      {
        type: "p",
        text: "La procédure officielle, détaillée pour chaque appareil, figure dans l’aide Google Maps : [Ajouter, modifier ou supprimer des avis et des notes Google Maps](https://support.google.com/maps/answer/6230175?hl=fr).",
      },
      { type: "h2", text: "Sous quel nom votre avis apparaît-il ?" },
      {
        type: "p",
        text: "Un avis Google est toujours public : Google indique qu’il n’est pas possible de publier un avis anonyme. Les autres utilisateurs voient le nom de votre profil, vos autres avis et les photos que vous avez ajoutées à Google Maps.",
      },
      {
        type: "p",
        text: "Vous pouvez en revanche apparaître sous un nom et une photo personnalisés plutôt que ceux de votre compte Google. Dans l’application Google Maps :",
      },
      {
        type: "ol",
        items: [
          "Touchez « Contribuer », puis « Voir mon profil » et « Modifier mon profil ».",
          "Cochez « Utiliser une photo et un nom personnalisés pour les publications ».",
          "Touchez « Nom à afficher » pour saisir le nom de votre choix ; touchez votre photo de profil pour choisir une illustration ou une photo de l’appareil.",
          "Touchez « Confirmer ».",
        ],
      },
      {
        type: "p",
        text: "Ce nom personnalisé s’affiche sur vos avis, photos et autres contributions publiques dans Google Maps et la recherche Google (aide Google : [choisir la façon dont vous apparaissez publiquement](https://support.google.com/maps/answer/15294714?hl=fr)). Il ne rend pas l’avis anonyme : il reste rattaché à votre compte et soumis aux mêmes règles.",
      },
      { type: "h2", text: "Modifier ou supprimer votre avis" },
      {
        type: "p",
        text: "Vous pouvez revenir sur votre avis à tout moment, par exemple si le commerce a réglé le problème que vous signaliez ou si votre opinion a changé après une deuxième visite.",
      },
      { type: "h3", text: "Sur téléphone (Android ou iPhone)" },
      {
        type: "ol",
        items: [
          "Dans l’application Google Maps, touchez « Contribuer », puis « Voir mon profil ».",
          "Faites défiler l’écran et touchez « Afficher tous les avis ».",
          "À côté de l’avis concerné, touchez l’icône « Plus ».",
          "Choisissez « Modifier l’avis » ou « Supprimer l’avis », puis suivez les instructions.",
        ],
      },
      { type: "h3", text: "Depuis un ordinateur" },
      {
        type: "ol",
        items: [
          "Dans Google Maps, cliquez sur le menu en haut à gauche, puis sur « Vos contributions » et « Avis ».",
          "À côté de l’avis, cliquez sur « Plus », puis sur « Modifier l’avis » ou « Supprimer l’avis ».",
        ],
      },
      {
        type: "p",
        text: "Bon à savoir : après une modification, c’est la date de la dernière modification qui s’affiche comme date de publication de l’avis.",
      },
      { type: "h2", text: "Écrire un avis vraiment utile" },
      {
        type: "p",
        text: "Un bon avis aide les futurs clients à se décider, et aide le commerce à progresser. Quelques repères :",
      },
      {
        type: "ul",
        items: [
          "Dites ce que vous êtes venu chercher : « coupe et couleur », « vidange avant les vacances », « déjeuner en semaine entre collègues ». Le lecteur saura si votre expérience ressemble à la sienne.",
          "Soyez précis sur ce qui vous a plu ou déplu : l’accueil, le délai, le prix, la propreté, un conseil reçu. « Le garagiste a pris le temps de m’expliquer la panne » informe bien davantage que « super ».",
          "Restez factuel et mesuré, même mécontent : décrivez ce qui s’est passé, sans insultes ni attaques personnelles.",
          "Ne parlez que de votre propre expérience, réelle et récente.",
          "Évitez les informations personnelles, les vôtres comme celles d’un membre du personnel.",
          "Ajoutez une photo si elle apporte quelque chose : un plat, une réalisation, la vue depuis la chambre.",
        ],
      },
      {
        type: "p",
        text: "La note vous appartient. Un commerçant peut vous inviter à donner votre avis, mais il ne doit ni vous offrir de contrepartie, ni vous dicter la note ou le contenu, ni vous presser de l’écrire sur place : ces pratiques sont interdites par les règles de Google. Vous pouvez parfaitement publier votre avis plus tard, au calme.",
      },
      { type: "h2", text: "Pourquoi votre avis n’apparaît pas (encore)" },
      {
        type: "p",
        text: "Google vérifie les avis avant de les afficher, et cet examen peut prendre quelques jours. Un avis peut aussi ne jamais s’afficher, ou disparaître, s’il est jugé contraire aux règles : avis rédigé par un employé ou un proche de l’établissement, contrepartie reçue, contenu hors sujet ou injurieux, publications en série. Google précise que les avis supprimés pour non-respect des règles ne sont pas rétablis, et qu’un ancien téléphone ou une ancienne version de l’application peut poser problème : mettez Google Maps à jour. Les autres causes sont détaillées dans notre guide sur les [avis Google qui disparaissent](/guides/avis-google-disparus).",
      },
      { type: "h2", text: "Commerçants : partagez cette page" },
      {
        type: "p",
        text: "Vous êtes commerçant ? Cette page est faite pour être envoyée à vos clients. Beaucoup ont envie de vous laisser un avis mais ne savent pas où cliquer, n’ont pas l’application ou ne se souviennent plus de leur compte Google. Joignez-la à votre lien d’avis, par exemple ainsi :",
      },
      {
        type: "callout",
        title: "Exemple de message",
        text: "« Merci pour votre visite ! Si vous souhaitez partager votre expérience, voici notre page d’avis Google : (votre lien d’avis). C’est votre premier avis ? Ce pas à pas explique tout : reviu.fr/guides/comment-laisser-avis-google »",
      },
      {
        type: "p",
        text: "Envoyez ce message à tous vos clients de la même façon, sans le réserver à ceux qui semblent ravis, sans rien offrir en échange et sans relancer avec insistance. Pour rédiger votre message, servez-vous de nos [modèles de message pour demander un avis](/outils/message-demande-avis-google) par SMS, WhatsApp ou e-mail ; pour récupérer votre lien, suivez notre guide du [lien avis Google](/guides/lien-avis-google).",
      },
      {
        type: "p",
        text: "En boutique, le plus efficace reste de supprimer la recherche : un présentoir avis Google comme le [Présentoir Reviu](/presentoir-avis-google), posé au comptoir, ouvre la fenêtre d’avis en un geste, sans contact ou QR code, pour tous vos clients.",
      },
    ],
    faq: [
      {
        q: "Faut-il un compte Google pour laisser un avis ?",
        a: "Oui. Google n’accepte que les avis publiés depuis un compte Google connecté. Une adresse Gmail n’est pas obligatoire : votre adresse e-mail habituelle suffit pour ouvrir ce compte.",
      },
      {
        q: "Peut-on laisser un avis Google anonyme ?",
        a: "Non, Google indique que tous les avis sont publics et qu’il n’est pas possible d’en publier un de façon anonyme. Vous pouvez toutefois afficher un nom et une photo personnalisés à la place de ceux de votre compte, depuis votre profil Google Maps.",
      },
      {
        q: "Comment modifier ou supprimer un avis Google ?",
        a: "Dans l’application Google Maps, touchez Contribuer, puis Voir mon profil et Afficher tous les avis. À côté de l’avis, touchez l’icône Plus et choisissez Modifier l’avis ou Supprimer l’avis. Sur ordinateur, passez par le menu, puis Vos contributions et Avis.",
      },
      {
        q: "Pourquoi mon avis Google n’apparaît-il pas ?",
        a: "Chaque avis passe par un contrôle de Google, qui peut retarder sa mise en ligne de quelques jours. Un avis jugé contraire aux règles, par exemple écrit par un employé ou en échange d’une contrepartie, peut aussi être supprimé, et il ne sera pas rétabli. Vérifiez enfin que votre application Google Maps est à jour.",
      },
      {
        q: "Comment laisser un avis Google avec un QR code ?",
        a: "Ouvrez l’appareil photo de votre téléphone, visez le QR code, puis touchez le lien qui s’affiche. La fenêtre d’avis de l’établissement s’ouvre : choisissez votre note, écrivez votre commentaire et publiez.",
      },
      {
        q: "Un commerçant peut-il m’offrir quelque chose contre un avis ?",
        a: "Non. Les règles de Google interdisent de proposer un avantage, comme une remise ou un produit gratuit, en échange d’un avis. Un commerçant peut vous inviter à donner votre avis, mais la note et le contenu restent entièrement libres.",
      },
    ],
    related: [
      "lien-avis-google",
      "avoir-plus-avis-google",
      "qr-code-avis-google",
      "repondre-avis-google",
    ],
  },

  // ── 3. NFC ou QR code ─────────────────────────────────────────────────────
  {
    slug: "nfc-ou-qr-code-avis-google",
    metaTitle: "NFC ou QR code pour les avis Google : que choisir ? · reviu",
    h1: "NFC ou QR code pour les avis Google : lequel choisir ?",
    description:
      "NFC ou QR code pour collecter des avis Google : geste client, compatibilité iPhone et Android, coût, durabilité, lien modifiable. Le comparatif honnête.",
    excerpt:
      "Le sans contact est plus rapide, le QR code plus universel. Ce comparatif point par point vous aide à choisir, ou à combiner les deux.",
    keywords: [
      "nfc ou qr code avis google",
      "nfc avis google",
      "qr code avis google",
      "plaque nfc ou qr code",
      "carte nfc avis google",
      "nfc iphone avis google",
    ],
    category: "Collecter des avis",
    readMinutes: 8,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Le QR code est le plus universel : l’appareil photo de presque tous les smartphones récents le lit, de près comme à distance, et il ne coûte que son impression. Le NFC est le plus rapide : on approche le téléphone, comme pour payer sans contact, mais il faut un appareil compatible et se tenir à quelques centimètres. Au comptoir, la meilleure réponse est de combiner les deux ; pour un support éloigné du client, le QR code seul suffit.",
      },
      { type: "h2", text: "Le geste du client, étape par étape" },
      {
        type: "p",
        text: "Sur le papier, les deux technologies « ouvrent la page d’avis ». En pratique, le client ne fait pas les mêmes gestes.",
      },
      { type: "h3", text: "Avec un QR code" },
      {
        type: "ol",
        items: [
          "Le client déverrouille son téléphone et ouvre l’appareil photo.",
          "Il vise le code et attend que le téléphone le détecte.",
          "Il touche le lien qui s’affiche à l’écran.",
          "La fenêtre d’avis s’ouvre.",
        ],
      },
      { type: "h3", text: "Avec le sans contact (NFC)" },
      {
        type: "ol",
        items: [
          "Le client déverrouille son téléphone.",
          "Il approche le haut de son iPhone, ou le dos de son Android, de la zone indiquée.",
          "Sur Android, la page s’ouvre en général directement ; sur iPhone, une notification apparaît et il la touche.",
          "La fenêtre d’avis s’ouvre.",
        ],
      },
      {
        type: "p",
        text: "L’écart tient moins au nombre d’étapes qu’à leur difficulté. Le QR code demande de cadrer, ce qui devient laborieux avec un reflet, une lumière faible ou un code trop petit. Le NFC demande de savoir où se trouve l’antenne : un client qui pose le bas de son iPhone sur le support ne verra rien se passer. Une phrase de l’équipe lève l’hésitation : « approchez le haut du téléphone, comme pour payer ».",
      },
      { type: "h2", text: "Compatibilité : qui peut lire quoi ?" },
      {
        type: "ul",
        items: [
          "QR code : lu nativement par l’appareil photo des iPhone et des Android récents, sans application. C’est l’option la plus universelle.",
          "NFC sur iPhone : la documentation développeurs d’Apple indique que la lecture des tags en arrière-plan, sans application, est prise en charge à partir de l’iPhone XS. L’iPhone doit être en cours d’utilisation, et la lecture est indisponible tant que l’appareil photo ou Apple Pay est ouvert, ou quand le mode avion est activé.",
          "NFC sur Android : la plupart des modèles récents en sont équipés, mais pas tous, et le réglage peut être désactivé. Selon la documentation Android, le téléphone recherche les tags NFC quand l’écran est déverrouillé.",
          "Distance : la même documentation Android décrit le NFC comme une technologie à très courte portée, qui demande en général 4 cm ou moins. Le QR code, lui, se lit à distance s’il est imprimé assez grand.",
        ],
      },
      {
        type: "p",
        text: "Conséquence pratique : un support uniquement NFC laisse de côté une partie de vos clients (téléphone ancien, NFC désactivé, client qui ne connaît pas le geste). Un QR code seul ne laisse presque personne de côté, mais demande un geste un peu plus long.",
      },
      { type: "h2", text: "Coût : du gratuit au support durable" },
      {
        type: "p",
        text: "Un QR code ne coûte que son impression : Google en fournit un depuis votre fiche, et des générateurs gratuits existent, dont notre [générateur de QR code avis Google](/outils/qr-code-avis-google). Le NFC suppose une puce intégrée dans un support (carte, autocollant, plaque ou présentoir), donc un achat, à comparer à ce que rapporte un geste plus court au comptoir pendant des années. Le détail est dans notre guide sur le [prix d’une plaque avis Google](/guides/prix-plaque-avis-google).",
      },
      { type: "h2", text: "Durabilité et usure" },
      {
        type: "p",
        text: "Un QR code imprimé sur papier s’abîme vite sur un comptoir (taches, pliures, soleil) et peut devenir illisible sans que personne ne s’en aperçoive ; plastifié ou imprimé sur un support rigide, il tient beaucoup mieux. Une puce NFC n’a pas de pile à remplacer, mais elle peut être endommagée par un choc, une pliure ou une forte chaleur, et elle se lit mal posée sur du métal. Avoir les deux est la meilleure assurance : si l’un faiblit, l’autre prend le relais.",
      },
      { type: "h2", text: "Modifier le lien après coup" },
      {
        type: "p",
        text: "C’est le critère le plus sous-estimé. Un QR code ou une puce qui contient directement votre lien Google est figé : si le lien change (fiche recréée, fusion de doublons, déménagement), il faut réimprimer le QR code, ou réencoder la puce quand elle n’a pas été verrouillée. La parade est la même pour les deux technologies : encoder une adresse intermédiaire dont vous modifiez la destination à distance. Le principe est détaillé dans notre guide sur les [plaques et présentoirs NFC pour avis Google](/guides/presentoir-plaque-nfc-avis-google).",
      },
      { type: "h2", text: "Statistiques : savoir ce qui fonctionne" },
      {
        type: "p",
        text: "Un lien Google direct, en QR code ou en NFC, ne dit rien de son usage : des avis arrivent, sans que vous sachiez d’où viennent les clients. L’aide de Google sur le QR code de demande d’avis ne mentionne d’ailleurs aucune statistique de scans. Pour mesurer, il faut passer par une adresse intermédiaire qui compte les ouvertures, et distinguer les deux canaux. Vous saurez alors si vos clients préfèrent approcher le téléphone ou scanner, et si un emplacement fonctionne mieux qu’un autre.",
      },
      { type: "h2", text: "Le QR code proposé par Google dans votre fiche" },
      {
        type: "p",
        text: "Google propose lui-même un QR code de demande d’avis. Depuis un navigateur sur ordinateur, ouvrez votre fiche, sélectionnez « Voir les avis », puis l’icône de partage à côté de « Recevoir plus d’avis », et enregistrez l’image du QR code (clic droit, puis « Enregistrer l’image sous »). Seule contrainte signalée par Google : pour l’instant, ce QR code se génère uniquement depuis un navigateur d’ordinateur ([aide Google](https://support.google.com/business/answer/16816815?hl=fr)).",
      },
      {
        type: "ul",
        items: [
          "Ses atouts : gratuit, officiel, il mène directement à vos avis.",
          "Ses limites : c’est une image fixe, à réimprimer si le lien change, sans statistiques mentionnées par Google, et la mise en page reste à faire vous-même (taille, phrase d’invitation, support rigide).",
        ],
      },
      {
        type: "p",
        text: "Pour démarrer sans budget, c’est un excellent choix ; notre guide sur le [QR code avis Google](/guides/qr-code-avis-google) explique où le placer pour qu’il soit scanné.",
      },
      { type: "h2", text: "Carte NFC, autocollant ou présentoir : quel format ?" },
      {
        type: "ul",
        items: [
          "La carte NFC, au format carte bancaire : pratique pour un professionnel itinérant, qui la présente au client en fin d’intervention. Elle passe de main en main, se perd, et n’est visible que lorsqu’on la sort.",
          "L’autocollant NFC ou QR : discret et peu coûteux, il se colle sur une table, une vitrine, un menu. Attention aux surfaces métalliques, qui gênent la lecture NFC, et à l’usure du QR code imprimé.",
          "Le présentoir de comptoir : il reste visible en permanence, au moment du paiement, sans que l’équipe ait à le sortir. Le client l’utilise sans manipuler un objet qu’on lui tend.",
          "La plaque murale : utile en salle d’attente pour le QR code, moins pratique pour le NFC, qui oblige à s’approcher du mur.",
        ],
      },
      { type: "h2", text: "Le comparatif en un coup d’œil" },
      {
        type: "ul",
        items: [
          "Geste client : NFC, approcher le téléphone ; QR code, ouvrir l’appareil photo, viser, toucher le lien.",
          "Compatibilité : NFC, iPhone XS et modèles suivants, Android équipés et réglés ; QR code, presque tous les smartphones récents.",
          "Distance : NFC, quelques centimètres ; QR code, lisible à distance s’il est assez grand.",
          "Coût : NFC, un support à acheter ; QR code, le prix de l’impression.",
          "Durabilité : NFC, pas de pile mais sensible aux chocs et au métal ; QR code, sensible à l’usure et aux reflets.",
          "Lien modifiable : possible pour les deux, à condition de passer par une adresse intermédiaire.",
          "Statistiques : possibles pour les deux, uniquement avec une adresse intermédiaire qui compte les scans.",
          "Usage idéal : NFC, au comptoir, à portée de main ; QR code, partout ailleurs (table, vitrine, ticket, facture, e-mail).",
        ],
      },
      { type: "h2", text: "Pourquoi combiner les deux sur un même support" },
      {
        type: "p",
        text: "Au comptoir, inutile de choisir : un support qui porte à la fois une puce NFC et un QR code couvre tous les clients. Celui qui connaît le geste sans contact l’utilise, celui dont le téléphone n’est pas compatible scanne, et si l’une des deux technologies faiblit, l’autre prend le relais. C’est le principe du [Présentoir Reviu](/presentoir-avis-google) : sans contact ou QR code, vers une même adresse dont vous changez la destination quand vous voulez, avec des statistiques qui distinguent les deux canaux.",
      },
      { type: "h2", text: "Quel choix selon votre commerce" },
      {
        type: "ul",
        items: [
          "Boulangerie, commerce de passage : un présentoir sans contact et QR code au comptoir, puisque le client a déjà le téléphone en main pour payer.",
          "Restaurant : un QR code sur la table ou l’addition, et un présentoir à la caisse pour ceux qui règlent au comptoir.",
          "Artisan ou service à domicile : un QR code sur le devis et la facture, le lien d’avis par SMS après l’intervention, une carte NFC si vous voyez le client en personne.",
          "Hôtel, chambre d’hôtes : un QR code dans la chambre ou le livret d’accueil, un présentoir à la réception pour le départ.",
        ],
      },
      {
        type: "p",
        text: "Quel que soit le support, la règle ne change pas : proposez-le à tous vos clients de la même manière, sans contrepartie, sans réclamer une note précise et sans les presser de laisser l’avis sur place. Le support facilite le geste ; il ne doit jamais devenir un moyen de pression.",
      },
    ],
    faq: [
      {
        q: "Le NFC fonctionne-t-il sur iPhone ?",
        a: "Oui, sur les modèles récents : selon la documentation d’Apple, la lecture des tags NFC en arrière-plan, sans application, est prise en charge à partir de l’iPhone XS. Il suffit d’approcher le haut de l’iPhone déverrouillé, puis de toucher la notification qui s’affiche.",
      },
      {
        q: "Faut-il une application pour scanner un QR code d’avis Google ?",
        a: "Non, l’appareil photo des smartphones récents, iPhone comme Android, détecte les QR codes sans application. Le client vise le code, puis touche le lien qui apparaît à l’écran.",
      },
      {
        q: "Qu’est-ce qui est le plus rapide pour le client, NFC ou QR code ?",
        a: "Le NFC, quand le téléphone est compatible et que le client sait où approcher l’appareil : un seul geste suffit. Le QR code demande d’ouvrir l’appareil photo et de cadrer, mais il fonctionne sur presque tous les smartphones.",
      },
      {
        q: "Le QR code fourni par Google suffit-il ?",
        a: "Pour démarrer, oui : il est gratuit et mène directement à vos avis. Il reste une image fixe, à réimprimer si votre lien change, et Google ne mentionne pas de statistiques de scans. Il se génère uniquement depuis un navigateur sur ordinateur.",
      },
      {
        q: "Peut-on modifier le lien d’une puce NFC ou d’un QR code ?",
        a: "Si la puce ou le QR code contient directement votre lien Google, il faut réencoder la puce, si elle n’est pas verrouillée, ou réimprimer le QR code. Si les deux pointent vers une adresse intermédiaire, vous changez simplement sa destination, sans toucher au support.",
      },
      {
        q: "Faut-il choisir entre NFC et QR code ?",
        a: "Pas au comptoir : un support qui porte les deux couvre tous les clients et sert de secours si l’une des technologies flanche. Pour une vitrine ou un ticket, lus à distance, le QR code seul suffit.",
      },
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "qr-code-avis-google",
      "plaque-nfc-avis-google-ne-fonctionne-pas",
      "prix-plaque-avis-google",
    ],
  },

  // ── 4. Plaque NFC qui ne fonctionne pas ───────────────────────────────────
  {
    slug: "plaque-nfc-avis-google-ne-fonctionne-pas",
    metaTitle: "Plaque NFC avis Google ne fonctionne pas : que faire · reviu",
    h1: "Plaque NFC avis Google qui ne fonctionne pas : 10 vérifications",
    description:
      "Votre plaque NFC avis Google ne réagit pas ? 10 vérifications dans l’ordre : NFC du téléphone, position, coque, métal, lien encodé, puce, QR code de secours.",
    excerpt:
      "Avant de jeter une plaque NFC « en panne », faites ces dix vérifications : le problème vient souvent du téléphone, du geste ou du lien, et pas de la puce.",
    keywords: [
      "plaque nfc avis google ne fonctionne pas",
      "plaque nfc ne marche pas",
      "nfc ne fonctionne pas iphone",
      "activer nfc android",
      "carte nfc avis google problème",
      "tag nfc ne réagit pas",
    ],
    category: "Le présentoir",
    readMinutes: 8,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Quand une plaque NFC avis Google ne réagit pas, la puce n’est souvent pas en cause. Vérifiez d’abord le téléphone (NFC présent et activé, écran déverrouillé), puis le geste (bonne zone, quelques secondes de contact, ni coque épaisse ni métal), puis le lien encodé. Si le QR code de la plaque fonctionne et pas le NFC, le problème est matériel ; si rien ne fonctionne, c’est le lien.",
      },
      {
        type: "p",
        text: "Si vous découvrez ces supports, commencez par notre guide sur le [fonctionnement d’une plaque ou d’un présentoir NFC](/guides/presentoir-plaque-nfc-avis-google).",
      },
      { type: "h2", text: "D’abord, un test croisé" },
      {
        type: "p",
        text: "Essayez la plaque avec deux ou trois téléphones (dont un iPhone récent et un Android), puis scannez son QR code s’il y en a un. Le résultat oriente la suite :",
      },
      {
        type: "ul",
        items: [
          "Un seul téléphone échoue : le problème vient de ce téléphone (vérifications 1 à 5).",
          "Tous échouent en NFC, mais le QR code fonctionne : la puce ou son emplacement sont en cause (vérifications 6 et 7).",
          "Le NFC et le QR code ouvrent une erreur ou la mauvaise page : c’est le lien encodé (vérifications 8 à 10).",
        ],
      },
      { type: "h2", text: "Côté téléphone : les vérifications 1 à 5" },
      { type: "h3", text: "1. Le téléphone est-il équipé du NFC ?" },
      {
        type: "p",
        text: "Côté iPhone, Apple réserve la lecture des tags sans application, en arrière-plan, à l’iPhone XS et aux modèles plus récents. Un modèle plus ancien ne réagira pas à la plaque : le client doit utiliser le QR code. Sur Android, la plupart des modèles récents sont équipés, mais pas tous. Ouvrez les Paramètres et tapez « NFC » dans la barre de recherche : si aucun réglage n’apparaît, le téléphone n’en est probablement pas équipé.",
      },
      { type: "h3", text: "2. Le NFC est-il activé ?" },
      {
        type: "p",
        text: "Sur Android, le NFC est un réglage qui peut être désactivé. D’après l’aide de Google, il se trouve en général dans Paramètres, puis « Appareils connectés », « Préférences de connexion » et « NFC » ([aide Google Wallet](https://support.google.com/pay/answer/7643995?hl=fr&co=GENIE.Platform%3DAndroid)) ; le chemin varie selon les marques, d’où l’intérêt de la recherche « NFC » dans les Paramètres. Sur un iPhone compatible, il n’y a pas d’interrupteur à activer : la lecture se fait d’elle-même.",
      },
      { type: "h3", text: "3. L’écran est-il allumé et déverrouillé ?" },
      {
        type: "p",
        text: "Un téléphone en veille ne lit pas la plaque : d’après la documentation Android, l’appareil recherche en principe les tags quand son écran est déverrouillé. Pour l’iPhone, Apple précise que la lecture n’a lieu que lorsque l’appareil est en cours d’utilisation, et qu’elle est suspendue tant que l’iPhone n’a pas été déverrouillé une première fois après un redémarrage, pendant l’utilisation de l’appareil photo ou d’Apple Pay, et en mode avion. Un client qui vient d’ouvrir l’appareil photo doit donc le refermer.",
      },
      {
        type: "p",
        text: "Sur iPhone, la lecture affiche une notification en haut de l’écran, qu’il faut toucher pour ouvrir la page. Un client qui ne la remarque pas croit que rien ne s’est passé : montrez-lui où regarder.",
      },
      { type: "h3", text: "4. Le téléphone est-il approché au bon endroit ?" },
      {
        type: "p",
        text: "L’antenne NFC n’est pas au même endroit selon les téléphones. Sur iPhone, c’est le haut de l’appareil qu’Apple demande de présenter pour payer sans contact. Sur Android, l’antenne est au dos, et l’aide Google Wallet précise qu’elle peut se trouver en haut ou au milieu. La portée est très courte, en général 4 cm ou moins selon la documentation Android : il faut quasiment toucher la zone et maintenir le téléphone quelques secondes. Si la zone de la puce n’est pas signalée sur la plaque, indiquez-la par un pictogramme ou une phrase (« approchez le haut du téléphone ici »).",
      },
      { type: "h3", text: "5. Une coque ou un accessoire bloque-t-il le signal ?" },
      {
        type: "p",
        text: "L’aide Google Wallet le signale pour le paiement sans contact : une coque épaisse peut interrompre le signal NFC. Les coques métalliques, les porte-cartes fixés au dos et les accessoires aimantés sont aussi des suspects. Retirez la coque et réessayez ; si le client ne peut pas l’enlever, le QR code règle la question.",
      },
      { type: "h2", text: "Côté plaque : les vérifications 6 et 7" },
      { type: "h3", text: "6. La plaque est-elle posée sur du métal ?" },
      {
        type: "p",
        text: "Une surface métallique (comptoir en inox, caisse enregistreuse, vitrine réfrigérée, présentoir en métal) peut fortement perturber la lecture d’une puce NFC qui n’est pas conçue pour cela. Déplacez la plaque sur une surface en bois, en verre ou en plastique, ou surélevez-la, puis refaites le test avec plusieurs téléphones.",
      },
      {
        type: "p",
        text: "Évitez aussi de la coller au terminal de paiement : le client risque de confondre les deux zones. Laissez un écart visible entre les deux.",
      },
      { type: "h3", text: "7. La puce est-elle endommagée ?" },
      {
        type: "p",
        text: "Une puce NFC n’a pas de pile, mais elle reste fragile : antenne pliée sur une carte souple, choc, autocollant décollé puis recollé, forte chaleur prolongée (vitrine en plein soleil, proximité d’un four). Si aucun téléphone compatible ne la lit, même sans coque et bien positionné, alors que le QR code fonctionne, la puce est probablement hors d’usage : faites jouer la garantie du vendeur.",
      },
      { type: "h2", text: "Côté lien : les vérifications 8 à 10" },
      { type: "h3", text: "8. Le lien encodé est-il le bon ?" },
      {
        type: "p",
        text: "Si le téléphone réagit mais ouvre une erreur, votre fiche au lieu de la fenêtre d’avis ou la fiche d’un autre établissement, la puce fonctionne : c’est le lien qui pose problème. Erreurs courantes : lien de partage de la fiche à la place du lien d’avis, faute de frappe à l’encodage, lien raccourci par un service qui a cessé de fonctionner. Une application de lecture NFC affiche le contenu de la puce ; comparez-le au lien fourni par votre fiche, en suivant notre guide pour [trouver et tester votre lien avis Google](/guides/lien-avis-google).",
      },
      { type: "h3", text: "9. Votre fiche Google a-t-elle changé ?" },
      {
        type: "p",
        text: "Un lien qui fonctionnait peut cesser de fonctionner après un changement côté Google : fiche recréée, doublon fusionné, déménagement. La documentation de Google Maps Platform indique d’ailleurs que l’identifiant d’un lieu peut changer, par exemple quand un établissement déménage. Récupérez le lien actuel depuis votre fiche d’établissement et comparez-le à celui de la plaque.",
      },
      { type: "h3", text: "10. Le lien est-il modifiable ou figé ?" },
      {
        type: "p",
        text: "Tout dépend de la façon dont la plaque a été encodée. Une puce NFC peut être verrouillée en lecture seule : son contenu ne se modifie alors plus, et la plaque est à remplacer. Non verrouillée, elle peut être réencodée avec une application d’écriture NFC. Si la plaque pointe vers une adresse intermédiaire gérée par le vendeur, la correction se fait depuis votre espace en ligne, sans toucher à la plaque : c’est tout l’intérêt d’un lien modifiable à distance.",
      },
      { type: "h2", text: "Le QR code de secours, votre meilleure assurance" },
      {
        type: "p",
        text: "Une plaque qui ne porte qu’une puce NFC n’a pas de plan B : téléphone incompatible, coque trop épaisse, puce abîmée, et le client repart sans avoir pu laisser d’avis. Un QR code sur le même support, vers la même adresse, règle tous ces cas. Si votre plaque n’en a pas, imprimez-en un avec notre [générateur de QR code avis Google](/outils/qr-code-avis-google) et posez-le à côté.",
      },
      {
        type: "p",
        text: "Donnez aussi à l’équipe une phrase de repli, simple et sans insistance : « Si ça ne réagit pas, le QR code marche avec l’appareil photo. »",
      },
      { type: "h2", text: "Prévenir plutôt que réparer" },
      {
        type: "ul",
        items: [
          "Choisir un support qui combine puce NFC et QR code, pour ne jamais dépendre d’une seule technologie.",
          "Préférer un lien modifiable à distance, pour corriger une erreur ou suivre un changement de fiche sans racheter de support.",
          "Tester la plaque avec plusieurs téléphones le jour de l’installation, puis de temps en temps.",
          "Suivre les statistiques : si les scans sans contact tombent à zéro alors que les scans QR continuent, la puce ou son emplacement est en cause.",
        ],
      },
      {
        type: "p",
        text: "C’est ce que réunit le [Présentoir Reviu](/presentoir-avis-google) : le sans contact et le QR code pointent vers la même adresse, un lien que vous modifiez depuis votre espace, et des statistiques qui distinguent les deux canaux. Pour comparer les deux technologies avant un achat, voyez aussi [NFC ou QR code : lequel choisir](/guides/nfc-ou-qr-code-avis-google).",
      },
    ],
    faq: [
      {
        q: "Pourquoi ma plaque NFC avis Google ne réagit-elle pas avec mon iPhone ?",
        a: "Vérifiez que l’iPhone est un XS ou un modèle plus récent, qu’il est déverrouillé et que l’appareil photo ou Apple Pay ne sont pas ouverts. Approchez le haut de l’iPhone de la puce, puis touchez la notification qui s’affiche : la page ne s’ouvre pas sans ce geste.",
      },
      {
        q: "Comment activer le NFC sur un téléphone Android ?",
        a: "Ouvrez les Paramètres, tapez NFC dans la barre de recherche et activez le réglage. Sur de nombreux appareils, il se trouve dans Appareils connectés, puis Préférences de connexion. Si aucun réglage NFC n’apparaît, le téléphone n’en est probablement pas équipé.",
      },
      {
        q: "Une plaque NFC fonctionne-t-elle posée sur un comptoir en métal ?",
        a: "Le métal perturbe la lecture des puces NFC qui ne sont pas conçues pour cela. Posez la plaque sur une surface non métallique ou surélevez-la, puis refaites le test. Le QR code, lui, fonctionne sur n’importe quelle surface.",
      },
      {
        q: "Ma plaque NFC ouvre la mauvaise page, que faire ?",
        a: "La puce fonctionne, c’est le lien encodé qui est en cause. Comparez-le avec le lien d’avis fourni par votre fiche d’établissement. Si la plaque passe par un lien modifiable, corrigez la destination depuis votre espace ; sinon, réencodez la puce si elle n’est pas verrouillée, ou remplacez la plaque.",
      },
      {
        q: "Une puce NFC peut-elle tomber en panne ?",
        a: "Elle n’a pas de pile, mais un choc, une pliure ou une chaleur excessive peuvent l’abîmer. Si aucun téléphone compatible ne la lit alors que le QR code fonctionne, elle est probablement hors d’usage et relève de la garantie du vendeur.",
      },
      {
        q: "Faut-il un QR code en plus de la puce NFC ?",
        a: "Oui, c’est la meilleure assurance : il prend le relais quand le téléphone n’a pas de NFC, quand une coque bloque le signal ou quand la puce est abîmée. Il doit pointer vers la même page d’avis que la puce.",
      },
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "nfc-ou-qr-code-avis-google",
      "lien-avis-google",
      "prix-plaque-avis-google",
    ],
  },

  // ── 5. Prix d’une plaque avis Google ──────────────────────────────────────
  {
    slug: "prix-plaque-avis-google",
    metaTitle: "Prix plaque avis Google : ce que vous payez vraiment · reviu",
    h1: "Prix d’une plaque avis Google : ce que vous payez vraiment",
    description:
      "Combien coûte une plaque avis Google ? Matériau, NFC et QR code, lien modifiable, achat unique ou abonnement, coût sur 3 ans, pièges et checklist d’achat.",
    excerpt:
      "Le prix affiché ne dit pas tout : abonnement, lien bloqué, frais annexes. Voici comment comparer les plaques avis Google sur leur vrai coût, sans mauvaise surprise.",
    keywords: [
      "prix plaque avis google",
      "plaque avis google prix",
      "plaque nfc avis google prix",
      "combien coûte une plaque avis google",
      "présentoir avis google prix",
      "plaque avis google sans abonnement",
    ],
    category: "Le présentoir",
    readMinutes: 8,
    datePublished: "2026-10-12",
    blocks: [
      {
        type: "p",
        text: "Le vrai prix d’une plaque avis Google, c’est son coût total sur toute sa durée d’usage : le prix d’achat, plus l’éventuel abonnement mensuel, plus la livraison, la personnalisation et les remplacements. Deux offres au même prix d’entrée peuvent donc coûter des sommes très différentes au bout de trois ans. Ce guide vous donne la méthode de calcul, les pièges à repérer et une checklist avant d’acheter.",
      },
      { type: "h2", text: "Ce que recouvre une « plaque avis Google »" },
      {
        type: "p",
        text: "Le terme désigne des objets très différents, ce qui explique une bonne partie des écarts de prix :",
      },
      {
        type: "ul",
        items: [
          "Le QR code imprimé seul (autocollant, affichette, carte) : le moins cher, souvent à faire soi-même.",
          "La carte NFC au format carte bancaire, avec ou sans QR code au verso.",
          "La plaque ou le présentoir de comptoir, avec puce NFC et QR code, pensé pour rester en place des années.",
          "L’offre « matériel et service » : le support est vendu avec un tableau de bord, parfois avec un abonnement.",
        ],
      },
      {
        type: "p",
        text: "Comparer un autocollant à un présentoir avec tableau de bord n’a pas de sens. Définissez d’abord ce dont vous avez besoin, puis comparez les offres d’une même famille. Notre comparatif [NFC ou QR code pour les avis Google](/guides/nfc-ou-qr-code-avis-google) aide à trancher ce premier point.",
      },
      { type: "h2", text: "Ce qui fait varier le prix" },
      { type: "h3", text: "Le matériau et la finition" },
      {
        type: "p",
        text: "Carton plastifié, PVC, acrylique, bois, métal : le matériau joue sur l’aspect et sur la tenue dans le temps. Méfiance avec le métal, qui peut gêner la lecture de la puce NFC si le support n’est pas conçu en conséquence. Sur un comptoir, la stabilité et la facilité de nettoyage comptent autant que l’esthétique.",
      },
      { type: "h3", text: "NFC et QR code, ou QR code seul" },
      {
        type: "p",
        text: "Une puce NFC ajoute un coût de fabrication et d’encodage. Elle se justifie au comptoir, où le geste sans contact fait gagner du temps. Un support NFC sans QR code est en revanche une fausse économie : chaque téléphone incompatible devient un avis perdu.",
      },
      { type: "h3", text: "La personnalisation" },
      {
        type: "p",
        text: "Logo, couleurs, nom de l’établissement : la personnalisation valorise le support, mais elle ajoute souvent des frais, un délai de fabrication et parfois une quantité minimale. Lisez les conditions de retour : un produit fabriqué sur mesure en est fréquemment exclu.",
      },
      { type: "h3", text: "Lien modifiable ou lien figé" },
      {
        type: "p",
        text: "Un support qui contient directement votre lien Google coûte moins cher à produire, mais il est figé : si le lien change, il faut le racheter ou le réimprimer. Un lien modifiable passe par une adresse intermédiaire, gérée par le vendeur, dont vous changez la destination à distance. Le principe est expliqué dans notre guide sur les [plaques et présentoirs NFC](/guides/presentoir-plaque-nfc-avis-google). C’est un vrai service, qui a une valeur ; reste à savoir comment il est facturé.",
      },
      { type: "h3", text: "Le tableau de bord et les statistiques" },
      {
        type: "p",
        text: "Compter les scans, distinguer le sans contact du QR code, gérer plusieurs supports ou plusieurs établissements : ces fonctions aident vraiment à piloter la collecte. Demandez si elles sont incluses dans le prix ou réservées à une formule payante.",
      },
      { type: "h3", text: "Achat unique ou abonnement" },
      {
        type: "p",
        text: "C’est le facteur qui pèse le plus sur le coût total. Certaines offres se paient une fois ; d’autres associent un support peu cher, voire offert, à un abonnement mensuel, parfois avec engagement. Aucun des deux modèles n’est malhonnête en soi, mais ils ne se comparent qu’en coût total.",
      },
      { type: "h3", text: "HT ou TTC, livraison et garantie" },
      {
        type: "p",
        text: "Les offres destinées aux professionnels affichent souvent leurs prix hors taxes. Si votre entreprise récupère la TVA, comparez les prix HT ; sinon, comparez les prix TTC, puisque c’est ce que vous paierez réellement. Un vendeur qui n’applique pas la TVA (par exemple une micro-entreprise en franchise en base) affiche un prix final, sans TVA à ajouter ni à récupérer. Ajoutez ensuite la livraison, puis regardez la garantie : durée, conditions de retour, prise en charge d’une puce défectueuse.",
      },
      {
        type: "p",
        text: "Un point souvent ignoré : le droit de rétractation de 14 jours protège d’abord les consommateurs, et un achat fait pour votre commerce n’en bénéficie pas toujours. Une garantie commerciale écrite, de type « satisfait ou remboursé », vous protège donc mieux qu’une simple mention du délai légal.",
      },
      { type: "h2", text: "Calculer le coût total sur 3 ans" },
      {
        type: "p",
        text: "La formule tient en une ligne : prix d’achat + (mensualité × nombre de mois) + livraison + personnalisation + remplacements éventuels. Trois ans, c’est un horizon raisonnable pour un support posé sur un comptoir. Voici trois offres fictives, avec des montants purement illustratifs, pour montrer comment le calcul bouleverse le classement :",
      },
      {
        type: "ul",
        items: [
          "Offre A, achat unique : support à 30 €, livraison incluse, sans frais mensuels. Coût sur 36 mois : 30 €.",
          "Offre B, support et abonnement : support à 15 € et 9 € par mois. Coût sur 36 mois : 15 + (9 × 36) = 339 €.",
          "Offre C, support « offert » et abonnement : 0 € à l’achat et 19 € par mois, avec engagement de 12 mois. Coût sur 36 mois : 19 × 36 = 684 €.",
        ],
      },
      {
        type: "callout",
        title: "Des montants hypothétiques",
        text: "Ces chiffres ne décrivent aucune offre réelle : ils illustrent seulement la méthode. Refaites le calcul avec les prix exacts des offres que vous comparez, puis multipliez par le nombre de supports et d’établissements.",
      },
      {
        type: "p",
        text: "L’exemple montre surtout une chose : sur la durée, la mensualité pèse beaucoup plus que le prix du support, et une offre « support offert » peut être la plus chère de toutes. À l’inverse, un abonnement se justifie s’il finance un service que vous utilisez vraiment chaque mois (envoi de SMS, gestion de nombreux établissements, outils de réponse aux avis) : comparez-le alors au temps qu’il vous fait gagner, pas au prix du support.",
      },
      {
        type: "p",
        text: "Posez-vous aussi la question de la sortie : que devient le support si vous arrêtez de payer ? Si la redirection est coupée, la plaque cesse de fonctionner, et le coût réel inclut alors le rachat d’un nouveau support.",
      },
      { type: "h2", text: "Les pièges à éviter" },
      {
        type: "ul",
        items: [
          "L’abonnement discret : prix d’appel mis en avant, mensualité en petits caractères, période d’essai qui se transforme en engagement, résiliation compliquée. Lisez les conditions générales avant de payer.",
          "Le lien bloqué chez le vendeur : le support pointe vers une adresse du vendeur, et seule une formule payante permet de la modifier, ou elle se coupe à la fin de l’abonnement. Demandez par écrit ce qui se passe si vous arrêtez.",
          "Les avis garantis : personne ne peut garantir un nombre d’avis ni une note. Une promesse de « X avis par mois » ou de « 5 étoiles assurées » est intenable, ou repose sur des pratiques interdites.",
          "Le tri des clients mécontents : certaines solutions posent d’abord une question (« Êtes-vous satisfait ? ») et n’envoient vers Google que les clients contents, les autres vers un formulaire privé. Le [règlement Google relatif aux contenus](https://support.google.com/contributionpolicy/answer/7400114?hl=fr) interdit de solliciter des avis positifs de façon sélective : vos avis, voire votre fiche, s’exposent alors à des restrictions.",
          "Les frais annexes : activation, personnalisation, port, résiliation. Additionnez-les avant de comparer.",
          "Le support NFC sans QR code : moins cher à l’achat, il fait perdre tous les clients dont le téléphone ne lit pas la puce. Notre guide de dépannage d’une [plaque NFC qui ne fonctionne pas](/guides/plaque-nfc-avis-google-ne-fonctionne-pas) montre à quel point le QR code de secours compte.",
        ],
      },
      { type: "h2", text: "La checklist avant d’acheter" },
      {
        type: "ul",
        items: [
          "Le support porte-t-il à la fois une puce NFC et un QR code ?",
          "Le lien est-il modifiable après l’achat, sans surcoût et sans limite de durée ?",
          "Que devient le support si je ne souscris aucune formule, ou si j’arrête de payer ?",
          "Y a-t-il un abonnement, un engagement, des frais de résiliation ?",
          "Les statistiques de scans sont-elles incluses ?",
          "Le prix est-il affiché HT ou TTC, livraison comprise ?",
          "Quelle garantie en cas de puce défectueuse, et puis-je renvoyer le support s’il ne me convient pas ?",
          "La solution propose-t-elle le lien Google à tous mes clients, sans tri selon leur satisfaction ?",
          "Le vendeur promet-il un nombre d’avis ? Si oui, méfiance.",
        ],
      },
      { type: "h2", text: "Où se situe le Présentoir Reviu" },
      {
        type: "p",
        text: "Puisque vous lisez ce guide sur notre site, autant être transparents sur notre offre. Le [Présentoir Reviu](/presentoir-avis-google) coûte 29,90 € l’unité (27 € l’unité dès 3 présentoirs, 25 € dès 5), en achat unique et sans abonnement : c’est un prix final (TVA non applicable), livraison offerte. Il combine sans contact et QR code, et l’espace Reviu est inclus : lien modifiable à tout moment, statistiques de scans qui distinguent les deux canaux, gestion de vos présentoirs. Il est garanti satisfait ou remboursé pendant 30 jours.",
      },
      {
        type: "p",
        text: "Ce qu’il ne fait pas : il ne promet aucun nombre d’avis et ne trie pas vos clients. Il rend le geste plus simple pour tous ; votre accueil fait le reste. Et si votre budget est nul pour l’instant, commencez par un QR code imprimé avec notre [générateur de QR code avis Google gratuit](/outils/qr-code-avis-google) : c’est déjà un vrai progrès.",
      },
    ],
    faq: [
      {
        q: "Combien coûte une plaque avis Google ?",
        a: "Cela dépend du type de support et du modèle économique : un QR code imprimé ne coûte presque rien, une plaque ou un présentoir avec puce NFC se paie davantage. Le bon critère n’est pas le prix d’achat mais le coût total sur plusieurs années, abonnement éventuel compris.",
      },
      {
        q: "Vaut-il mieux une plaque avis Google avec ou sans abonnement ?",
        a: "Pour un support qui ouvre simplement votre page d’avis, un achat unique revient en général moins cher sur la durée. Un abonnement ne se justifie que s’il finance des services que vous utilisez réellement chaque mois. Comparez toujours les offres en coût total sur deux ou trois ans.",
      },
      {
        q: "Que se passe-t-il si j’arrête l’abonnement de ma plaque ?",
        a: "Cela dépend du vendeur. Si la plaque pointe vers une adresse qu’il gère, la redirection peut être coupée et la plaque cesser de fonctionner. Demandez la réponse par écrit avant d’acheter.",
      },
      {
        q: "Une plaque avis Google peut-elle garantir des avis ?",
        a: "Non. Un support facilite le geste mais ne garantit ni un nombre d’avis ni une note : la décision appartient au client. Méfiez-vous des offres qui promettent un volume d’avis ou des notes élevées.",
      },
      {
        q: "Le prix d’une plaque avis Google s’entend-il HT ou TTC ?",
        a: "Les deux existent, et les offres pour professionnels sont souvent affichées hors taxes. Si votre entreprise récupère la TVA, comparez les prix HT ; sinon, comparez les prix TTC. Certains vendeurs n’appliquent pas de TVA et affichent directement un prix final.",
      },
      {
        q: "Quels critères vérifier avant d’acheter une plaque avis Google ?",
        a: "Vérifiez la présence d’une puce NFC et d’un QR code, la possibilité de modifier le lien, l’existence d’un abonnement ou d’un engagement, les statistiques incluses, la garantie et les frais de livraison. Assurez-vous enfin que la solution propose le lien Google à tous vos clients, sans tri selon leur satisfaction.",
      },
    ],
    related: [
      "presentoir-plaque-nfc-avis-google",
      "nfc-ou-qr-code-avis-google",
      "plaque-nfc-avis-google-ne-fonctionne-pas",
      "avoir-plus-avis-google",
    ],
  },
];
