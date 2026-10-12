/**
 * Modèles de réponses aux avis Google (outil `/outils/reponse-avis-google`).
 *
 * Un seul moteur sert l'outil interactif (composant client) ET les exemples
 * rendus en HTML statique sur la page (modèles avec [champs] à compléter) : le
 * texte affiché aux moteurs de recherche est exactement celui que produit
 * l'outil. Principes de rédaction : remercier, personnaliser, reconnaître sans
 * se justifier à l'excès, proposer un contact hors ligne pour les critiques,
 * signer. Jamais de contrepartie, jamais de détail personnel sur le client.
 */

export type ReplyKind =
  | "positif"
  | "sans-texte"
  | "quatre-etoiles"
  | "mitige"
  | "negatif"
  | "injuste";

export const REPLY_KINDS: { id: ReplyKind; label: string; hint: string }[] = [
  { id: "positif", label: "Avis positif", hint: "5 étoiles avec un commentaire" },
  { id: "sans-texte", label: "Note sans commentaire", hint: "4 ou 5 étoiles, sans texte" },
  { id: "quatre-etoiles", label: "4 étoiles avec réserve", hint: "Content, mais une remarque" },
  { id: "mitige", label: "Avis mitigé", hint: "3 étoiles" },
  { id: "negatif", label: "Avis négatif", hint: "1 ou 2 étoiles, critique précise" },
  { id: "injuste", label: "Avis injuste ou douteux", hint: "Client introuvable, faits inexacts" },
];

export type ReplyTrade = {
  id: string;
  label: string;
  /** L'expérience du client, sujet de « … vous ait plu ». */
  exp: string;
  /** La prochaine venue, complément de « lors de … ». */
  next: string;
  /** Qui reçoit les compliments ou les remarques. */
  team: string;
  /** Phrase de clôture chaleureuse. */
  back: string;
};

export const REPLY_TRADES: ReplyTrade[] = [
  {
    id: "general",
    label: "Tout commerce",
    exp: "votre visite",
    next: "votre prochaine visite",
    team: "toute l'équipe",
    back: "Au plaisir de vous revoir très bientôt.",
  },
  {
    id: "restaurant",
    label: "Restaurant, café, bar",
    exp: "votre repas",
    next: "votre prochain repas chez nous",
    team: "toute l'équipe, en salle comme en cuisine",
    back: "Au plaisir de vous accueillir à nouveau à notre table.",
  },
  {
    id: "coiffure",
    label: "Salon de coiffure, barbier",
    exp: "votre passage au salon",
    next: "votre prochain rendez-vous",
    team: "toute l'équipe du salon",
    back: "À très bientôt au salon.",
  },
  {
    id: "beaute",
    label: "Institut de beauté, spa",
    exp: "votre soin",
    next: "votre prochain soin",
    team: "toute l'équipe de l'institut",
    back: "Au plaisir de vous retrouver pour un prochain moment de détente.",
  },
  {
    id: "hotel",
    label: "Hôtel, chambre d'hôtes, camping",
    exp: "votre séjour",
    next: "votre prochain séjour",
    team: "toute l'équipe",
    back: "Nous serions ravis de vous accueillir pour un prochain séjour.",
  },
  {
    id: "garage",
    label: "Garage, auto-école",
    exp: "votre passage au garage",
    next: "votre prochain passage",
    team: "toute l'équipe de l'atelier",
    back: "Bonne route, et à bientôt.",
  },
  {
    id: "commerce",
    label: "Boutique, boulangerie, fleuriste",
    exp: "votre passage en boutique",
    next: "votre prochain passage",
    team: "toute l'équipe de la boutique",
    back: "Au plaisir de vous revoir en boutique.",
  },
  {
    id: "artisan",
    label: "Artisan, services à domicile",
    exp: "notre intervention",
    next: "votre prochain projet",
    team: "toute l'équipe",
    back: "N'hésitez pas à faire appel à nous pour vos prochains travaux.",
  },
];

export type ReplyInput = {
  kind: ReplyKind;
  trade: ReplyTrade;
  /** Prénom ou pseudo affiché de l'auteur de l'avis. */
  name?: string;
  establishment?: string;
  /** Signature, ex. « Julie, gérante ». */
  signature?: string;
  /** Ce que le client a apprécié (avis positifs). */
  point?: string;
  /** Ce que le client reproche (avis 4 étoiles à négatifs). */
  issue?: string;
  /** E-mail ou téléphone pour reprendre la discussion hors ligne. */
  contact?: string;
  /** Numéro de variante (l'outil propose « une autre version »). */
  variant?: number;
};

/** Nombre de variantes disponibles par type d'avis. */
export const VARIANTS_PER_KIND = 3;

/** « L'équipe de X », avec élision et contraction (du, des, de la, d'). */
export function teamOf(establishment: string): string {
  const e = establishment.trim();
  if (/^le\s/i.test(e)) return `L'équipe du ${e.slice(3)}`;
  if (/^les\s/i.test(e)) return `L'équipe des ${e.slice(4)}`;
  if (/^la\s/i.test(e)) return `L'équipe de la ${e.slice(3)}`;
  if (/^l['’]/i.test(e)) return `L'équipe de l'${e.slice(2)}`;
  if (/^[aeiouyhâàéèêîïôûœ]/i.test(e)) return `L'équipe d'${e}`;
  return `L'équipe de ${e}`;
}

const clean = (s?: string) => (s ?? "").trim();

/** « nous écrire à x@y.fr » ou « nous appeler au 04… » selon le contact saisi. */
function reach(contact: string): string {
  if (contact.includes("@")) return `nous écrire à ${contact}`;
  if (/\d/.test(contact)) return `nous appeler au ${contact}`;
  return `nous contacter au ${contact}`;
}

/**
 * Construit la réponse, en paragraphes. Le dernier paragraphe est la
 * signature. Les champs facultatifs vides sont simplement omis.
 */
export function buildReply(input: ReplyInput): string[] {
  const t = input.trade;
  const name = clean(input.name);
  const est = clean(input.establishment);
  const point = clean(input.point);
  const issue = clean(input.issue);
  const contact = clean(input.contact);
  const v = Math.abs(input.variant ?? 0) % VARIANTS_PER_KIND;
  const hello = name ? `Bonjour ${name},` : "Bonjour,";
  const sign = clean(input.signature) || (est ? teamOf(est) : "L'équipe");
  const chez = est ? ` chez ${est}` : "";

  const contactLine = contact
    ? `Nous aimerions en parler avec vous pour comprendre ce qui s'est passé : pouvez-vous ${reach(contact)} ?`
    : "Nous aimerions en parler avec vous pour comprendre ce qui s'est passé : n'hésitez pas à nous contacter directement.";

  let body: string[];
  switch (input.kind) {
    case "positif":
      body = [
        [
          `Un grand merci pour ce très bel avis ! Nous sommes ravis que ${t.exp} vous ait plu${point ? `, et merci pour votre mot sur ${point}` : ""}. Vos compliments font très plaisir à ${t.team}.`,
          t.back,
        ],
        [
          `Merci d'avoir pris le temps de partager votre expérience${chez}. ${point ? `Nous transmettons vos compliments sur ${point} à ${t.team}` : `Nous transmettons vos compliments à ${t.team}`} : c'est pour des retours comme le vôtre que nous aimons notre métier.`,
          t.back,
        ],
        [
          `Quel plaisir de vous lire ! Merci pour ces 5 étoiles et pour ce message chaleureux.${point ? ` Vos mots sur ${point} vont droit au cœur de ${t.team}.` : ""}`,
          `Merci de votre confiance. ${t.back}`,
        ],
      ][v];
      break;

    case "sans-texte":
      body = [
        [`Merci beaucoup pour votre note ! ${t.back}`],
        [`Merci pour ces étoiles, nous sommes heureux que ${t.exp} vous ait plu. ${t.back}`],
        [`Merci pour votre confiance et pour cette belle note. ${t.back}`],
      ][v];
      break;

    case "quatre-etoiles":
      body = [
        [
          `Merci pour votre avis et pour vos 4 étoiles ! Nous sommes contents que ${t.exp} vous ait plu dans l'ensemble.`,
          issue
            ? `Merci aussi pour votre remarque sur ${issue} : nous la partageons avec ${t.team} pour faire encore mieux.`
            : "Si un détail vous a manqué pour la cinquième étoile, dites-le-nous : nous sommes toujours preneurs.",
          t.back,
        ],
        [
          "Merci pour ce retour positif !",
          issue
            ? `Votre remarque sur ${issue} est très juste, et nous allons y travailler. Nous espérons vous convaincre tout à fait lors de ${t.next}.`
            : `Nous espérons vous convaincre tout à fait lors de ${t.next}.`,
        ],
        [
          `Merci d'avoir pris le temps de nous laisser votre avis. Nous sommes ravis que l'essentiel vous ait plu${issue ? `, et nous prenons bonne note de ce que vous dites sur ${issue}` : ""}.`,
          `Vos retours nous aident à progresser. ${t.back}`,
        ],
      ][v];
      break;

    case "mitige":
      body = [
        [
          `Merci d'avoir pris le temps de nous faire part de votre avis. Nous sommes désolés que ${t.exp} n'ait pas été entièrement à la hauteur de vos attentes${issue ? `, notamment concernant ${issue}` : ""}.`,
          `Vos remarques sont précieuses : nous les avons partagées avec ${t.team}.`,
          contact
            ? `Si vous le souhaitez, vous pouvez ${reach(contact)} : nous serons heureux d'en parler avec vous.`
            : `Nous espérons avoir l'occasion de vous offrir une meilleure expérience lors de ${t.next}.`,
        ],
        [
          "Merci pour votre retour, qui nous aide à progresser.",
          `${issue ? `Ce que vous dites de ${issue} est entendu. ` : ""}Nous voulons que chaque client reparte pleinement satisfait, et nous regrettons de ne pas y être parvenus cette fois-ci.`,
          `Nous espérons vous montrer un meilleur visage lors de ${t.next}.`,
        ],
        [
          "Merci pour votre avis sincère.",
          `${issue ? `Votre remarque sur ${issue} est juste, et nous allons y travailler. ` : ""}Nous visons une expérience sans fausse note et prenons vos impressions très au sérieux.`,
          contact
            ? `N'hésitez pas à ${reach(contact)} pour nous en dire plus.`
            : "N'hésitez pas à nous en dire plus lors de votre prochaine venue.",
        ],
      ][v];
      break;

    case "negatif":
      body = [
        [
          `Merci d'avoir pris le temps de nous écrire, même si nous aurions préféré lire un autre message. Nous sommes sincèrement désolés que ${t.exp} n'ait pas été à la hauteur.${issue ? ` Votre remarque sur ${issue} est entendue.` : ""}`,
          "Ce n'est pas l'expérience que nous voulons offrir à nos clients.",
          contactLine,
        ],
        [
          "Nous vous remercions pour votre retour et vous présentons nos excuses pour cette expérience décevante.",
          issue
            ? `Ce que vous décrivez au sujet de ${issue} ne correspond pas à ce que nous attendons de nous-mêmes. Nous l'avons partagé avec ${t.team} pour que cela ne se reproduise pas.`
            : `Nous avons partagé votre message avec ${t.team} pour en tirer les leçons.`,
          contactLine,
        ],
        [
          `Nous sommes désolés de lire que votre expérience${chez} n'a pas répondu à vos attentes.${issue ? ` Vous avez raison de signaler ${issue} : nous prenons votre remarque au sérieux.` : ""}`,
          contact
            ? `Pour en discuter et trouver une solution, vous pouvez ${reach(contact)}.`
            : "Pour en discuter et trouver une solution, n'hésitez pas à nous contacter directement.",
          "Merci de nous avoir donné l'occasion de nous améliorer.",
        ],
      ][v];
      break;

    case "injuste":
      body = [
        [
          "Merci pour votre message. Nous prenons chaque avis au sérieux, mais nous ne parvenons pas à retrouver la situation que vous décrivez.",
          `Afin de comprendre et, si besoin, de corriger ce qui doit l'être, pourriez-vous ${contact ? reach(contact) : "nous contacter directement"} ? Nous serons heureux d'échanger avec vous.`,
        ],
        [
          `Nous sommes surpris par votre avis, qui ne correspond pas à ce que nous avons pu vérifier de notre côté${issue ? `, notamment au sujet de ${issue}` : ""}.`,
          `Nous restons bien sûr à votre disposition pour en parler${contact ? ` (vous pouvez ${reach(contact)})` : ""} : si une erreur a été commise, nous voulons la corriger.`,
        ],
        [
          "Merci d'avoir pris le temps de nous écrire. Nous ne retrouvons pas trace de ce que vous évoquez, et nous aimerions en savoir davantage.",
          `${contact ? `Pouvez-vous ${reach(contact)} ?` : "Pouvez-vous nous contacter directement ?"} Nous examinerons votre situation avec attention.`,
        ],
      ][v];
      break;
  }

  return [hello, ...body, sign];
}

/** Réponse en texte brut, prête à coller (paragraphes séparés). */
export function replyText(input: ReplyInput): string {
  return buildReply(input).join("\n\n");
}

/** Valeurs « à compléter » utilisées pour les modèles affichés sur la page. */
export const PLACEHOLDERS = {
  name: "[Prénom]",
  establishment: "",
  signature: "[Votre prénom], [votre fonction]",
  point: "[ce qui a plu]",
  issue: "[le point soulevé]",
  contact: "[votre téléphone ou e-mail]",
} as const;
