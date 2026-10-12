/**
 * Modèles de messages pour demander un avis Google (outil
 * `/outils/message-demande-avis-google`).
 *
 * Même logique que les réponses aux avis : un moteur unique sert l'outil
 * interactif et les modèles affichés en HTML statique. Règles intangibles,
 * conformes aux règles de Google : le message est le même pour tous les
 * clients, n'offre aucune contrepartie, ne demande jamais « 5 étoiles » et
 * accueille aussi les retours critiques.
 */

export type Channel = "sms" | "whatsapp" | "email";
export type Formality = "vous" | "tu";

export const CHANNELS: { id: Channel; label: string }[] = [
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "E-mail" },
];

type ByFormality = Record<Formality, string>;

export type RequestTrade = {
  id: string;
  label: string;
  /** Phrase d'espoir sur l'expérience vécue. */
  hope: ByFormality;
};

export const REQUEST_TRADES: RequestTrade[] = [
  {
    id: "general",
    label: "Tout commerce",
    hope: {
      vous: "Nous espérons que tout s'est bien passé.",
      tu: "J'espère que tout s'est bien passé.",
    },
  },
  {
    id: "restaurant",
    label: "Restaurant, café, bar",
    hope: {
      vous: "Nous espérons que votre repas vous a plu.",
      tu: "J'espère que ton repas t'a plu.",
    },
  },
  {
    id: "coiffure",
    label: "Coiffure, beauté, bien-être",
    hope: {
      vous: "Nous espérons que le résultat vous plaît.",
      tu: "J'espère que le résultat te plaît.",
    },
  },
  {
    id: "hotel",
    label: "Hôtel, chambre d'hôtes, camping",
    hope: {
      vous: "Nous espérons que votre séjour vous a plu.",
      tu: "J'espère que ton séjour t'a plu.",
    },
  },
  {
    id: "garage",
    label: "Garage, auto-école",
    hope: {
      vous: "Nous espérons que tout est en ordre de votre côté.",
      tu: "J'espère que tout est en ordre de ton côté.",
    },
  },
  {
    id: "commerce",
    label: "Boutique, commerce de bouche",
    hope: {
      vous: "Nous espérons que votre achat vous donne entière satisfaction.",
      tu: "J'espère que ton achat te plaît.",
    },
  },
  {
    id: "sante",
    label: "Santé, paramédical",
    hope: {
      vous: "Nous espérons que votre rendez-vous s'est bien passé.",
      tu: "J'espère que ton rendez-vous s'est bien passé.",
    },
  },
  {
    id: "artisan",
    label: "Artisan, services à domicile",
    hope: {
      vous: "Nous espérons que notre intervention vous donne entière satisfaction.",
      tu: "J'espère que le travail te donne entière satisfaction.",
    },
  },
];

export type RequestInput = {
  channel: Channel;
  formality: Formality;
  trade: RequestTrade;
  /** Prénom du client (facultatif). */
  name?: string;
  establishment?: string;
  /** Lien d'avis Google (ou un repère « [lien] » dans les modèles). */
  link: string;
  variant?: number;
};

export type RequestMessage = {
  /** Objet, pour l'e-mail uniquement. */
  subject?: string;
  body: string;
};

export const REQUEST_VARIANTS = 3;

const clean = (s?: string) => (s ?? "").trim();

/** Compose le message pour un canal, un registre et une variante. */
export function buildRequest(input: RequestInput): RequestMessage {
  const name = clean(input.name);
  const est = clean(input.establishment);
  const link = clean(input.link) || "[votre lien d'avis]";
  const v = Math.abs(input.variant ?? 0) % REQUEST_VARIANTS;
  const tu = input.formality === "tu";
  const hope = input.trade.hope[input.formality];
  const hi = name ? `Bonjour ${name}` : "Bonjour";
  const chez = est ? ` chez ${est}` : "";
  const sign = est || "L'équipe";

  if (input.channel === "sms") {
    const bodies = tu
      ? [
          `${hi}, merci pour ta visite${chez} ! ${hope} Si tu as un instant, ton avis sur Google nous aiderait beaucoup : ${link}`,
          `${est ? `${est} : m` : "M"}erci pour ta visite ! Ton avis compte pour nous, il ne prend qu'une minute : ${link}`,
          `${hi}, merci pour ta confiance${chez}. Tu veux bien partager ton expérience sur Google ? Ça nous aide énormément : ${link}`,
        ]
      : [
          `${hi}, merci pour votre visite${chez} ! ${hope} Si vous avez un instant, votre avis sur Google nous aiderait beaucoup : ${link}`,
          `${est ? `${est} : m` : "M"}erci pour votre visite ! Votre avis compte pour nous, il ne prend qu'une minute : ${link}`,
          `${hi}, merci pour votre confiance${chez}. Accepteriez-vous de partager votre expérience sur Google ? Cela nous aide énormément : ${link}`,
        ];
    return { body: bodies[v] };
  }

  if (input.channel === "whatsapp") {
    const bodies = tu
      ? [
          `${hi} 👋 Merci pour ta visite${chez} ! ${hope}\n\nSi tu as deux minutes, ton avis sur Google nous ferait vraiment plaisir, qu'il soit enthousiaste ou plein de suggestions :\n${link}\n\nMerci et à bientôt !`,
          `${hi} ! Merci pour ta visite${chez} 🙏 Un petit avis sur Google nous aiderait à nous faire connaître : ${link}`,
          `${hi}, ${hope.charAt(0).toLowerCase()}${hope.slice(1)} Ton avis nous aide à progresser et à être découverts par d'autres clients. C'est par ici : ${link}\n\nMerci beaucoup !`,
        ]
      : [
          `${hi} 👋 Merci pour votre visite${chez} ! ${hope}\n\nSi vous avez deux minutes, votre avis sur Google nous ferait vraiment plaisir, qu'il soit enthousiaste ou plein de suggestions :\n${link}\n\nMerci et à bientôt !`,
          `${hi} ! Merci pour votre visite${chez} 🙏 Un petit avis sur Google nous aiderait à nous faire connaître : ${link}`,
          `${hi}, ${hope.charAt(0).toLowerCase()}${hope.slice(1)} Votre avis nous aide à progresser et à être découverts par d'autres clients. C'est par ici : ${link}\n\nMerci beaucoup !`,
        ];
    return { body: bodies[v] };
  }

  // E-mail : objet + corps en paragraphes.
  const subjects = tu
    ? [
        est ? `Ton avis sur ${est}` : "Ton avis nous intéresse",
        "Merci pour ta visite !",
        "Une minute pour nous aider ?",
      ]
    : [
        est ? `Votre avis sur ${est}` : "Votre avis nous intéresse",
        "Merci pour votre visite !",
        "Une minute pour nous aider ?",
      ];
  const bodies = tu
    ? [
        [
          `${hi},`,
          `Merci pour ta visite${chez}. ${hope}`,
          "Ton avis compte beaucoup pour nous : il aide d'autres clients à nous découvrir et nous permet de progresser. Si tu as une minute, tu peux le laisser directement sur Google :",
          link,
          "Que ton expérience ait été parfaite ou qu'un détail t'ait déplu, tous les retours sont les bienvenus.",
          `Merci et à bientôt,\n${sign}`,
        ],
        [
          `${hi},`,
          `Toute l'équipe${chez} te remercie pour ta confiance.`,
          `Pour une entreprise de proximité comme la nôtre, chaque avis Google compte. Si tu as un instant, partage ton expérience ici : ${link}`,
          `À très bientôt,\n${sign}`,
        ],
        [
          `${hi},`,
          `${hope} Nous avons une petite faveur à te demander : quelques mots sur Google pour raconter ton expérience.`,
          `Il suffit de cliquer sur ce lien, cela prend moins d'une minute : ${link}`,
          `Merci d'avance pour ton aide,\n${sign}`,
        ],
      ]
    : [
        [
          `${hi},`,
          `Merci pour votre visite${chez}. ${hope}`,
          "Votre avis compte beaucoup pour nous : il aide d'autres clients à nous découvrir et nous permet de progresser. Si vous avez une minute, vous pouvez le laisser directement sur Google :",
          link,
          "Que votre expérience ait été parfaite ou qu'un détail vous ait déplu, tous les retours sont les bienvenus.",
          `Merci et à bientôt,\n${sign}`,
        ],
        [
          `${hi},`,
          `Toute l'équipe${chez} vous remercie pour votre confiance.`,
          `Pour une entreprise de proximité comme la nôtre, chaque avis Google compte. Si vous avez un instant, partagez votre expérience ici : ${link}`,
          `À très bientôt,\n${sign}`,
        ],
        [
          `${hi},`,
          `${hope} Nous avons une petite faveur à vous demander : quelques mots sur Google pour raconter votre expérience.`,
          `Il suffit de cliquer sur ce lien, cela prend moins d'une minute : ${link}`,
          `Merci d'avance pour votre aide,\n${sign}`,
        ],
      ];
  return { subject: subjects[v], body: bodies[v].join("\n\n") };
}

/** Phrases à dire au comptoir (contenu statique de la page). */
export const SPOKEN_PHRASES = [
  "« Si vous avez passé un bon moment, un avis Google nous aide énormément : il suffit d'approcher votre téléphone ici. »",
  "« On est un petit commerce, et chaque avis compte. Ça prend dix secondes, c'est juste là. »",
  "« Votre avis nous intéresse, qu'il soit bon ou qu'on ait des choses à améliorer. »",
  "« Si la coupe vous plaît, un petit mot sur Google ferait plaisir à toute l'équipe. »",
  "« Vous pouvez scanner le QR code pendant que je prépare votre ticket. »",
];
