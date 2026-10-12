import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  InlineLink,
  MoreTools,
  StandCta,
  ToolFaq,
  ToolHero,
  ToolSection,
} from "@/components/site/tool-layout";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  graph,
} from "@/lib/seo";
import {
  PLACEHOLDERS,
  REPLY_KINDS,
  REPLY_TRADES,
  VARIANTS_PER_KIND,
  buildReply,
  type ReplyInput,
  type ReplyKind,
} from "@/lib/review-replies";
import { REPLY_TOOL_PATH, TOOLS_PATH, getTool } from "@/lib/tools";
import { ReplyTool } from "./reply-tool";

const tool = getTool(REPLY_TOOL_PATH)!;
const UPDATED = tool.updated;

export const metadata: Metadata = buildMetadata({
  title: "Réponse aux avis Google : générateur + 18 modèles gratuits | reviu",
  description:
    "Générez une réponse soignée à un avis Google positif, mitigé ou négatif, adaptée à votre métier. 18 modèles de réponses prêts à copier et les règles à suivre.",
  path: REPLY_TOOL_PATH,
  image: `${REPLY_TOOL_PATH}/opengraph-image`,
  keywords: [
    "réponse avis google",
    "répondre avis google exemple",
    "modèle réponse avis client",
    "réponse avis négatif exemple",
    "réponse avis positif",
    "générateur réponse avis google",
    "comment répondre à un avis google",
  ],
});

const KIND_TITLE: Record<ReplyKind, string> = {
  positif: "Réponse à un avis positif",
  "sans-texte": "Réponse à une note sans commentaire",
  "quatre-etoiles": "Réponse à un avis 4 étoiles avec une réserve",
  mitige: "Réponse à un avis mitigé",
  negatif: "Réponse à un avis négatif",
  injuste: "Réponse à un avis injuste ou douteux",
};

const KIND_INTRO: Record<ReplyKind, string> = {
  positif:
    "Le client a pris le temps d'écrire : remerciez-le, reprenez un détail de son message et donnez envie de revenir.",
  "sans-texte":
    "Quelques étoiles sans un mot : une réponse brève et chaleureuse suffit, elle montre que chaque avis compte.",
  "quatre-etoiles":
    "Un client content qui a relevé un détail. Remerciez, montrez que la remarque est entendue : c'est votre futur avis 5 étoiles.",
  mitige:
    "Ni ravi ni fâché : reconnaissez ce qui n'a pas fonctionné, sans vous justifier, et ouvrez la porte à une nouvelle visite.",
  negatif:
    "Calme, excuses sincères, remarque reconnue, contact direct proposé. La réponse s'adresse autant aux futurs clients qu'à l'auteur.",
  injuste:
    "Client introuvable ou faits inexacts : restez courtois, n'accusez pas, invitez à en parler. Signalez l'avis à Google s'il enfreint ses règles.",
};

/** Modèle à compléter (valeurs entre crochets) pour un type et une variante. */
function model(kind: ReplyKind, variant: number): string[] {
  return buildReply({ kind, trade: REPLY_TRADES[0], variant, ...PLACEHOLDERS });
}

const tradeById = (id: string) => REPLY_TRADES.find((t) => t.id === id)!;

/** Exemples rédigés pour un métier précis (contenu réel, pas de crochets). */
const EXAMPLES: { title: string; input: ReplyInput }[] = [
  {
    title: "Restaurant : réponse à un avis 5 étoiles",
    input: { kind: "positif", trade: tradeById("restaurant"), name: "Camille", establishment: "Le Petit Bistrot", signature: "Julie, gérante", point: "le risotto aux cèpes", variant: 1 },
  },
  {
    title: "Restaurant : réponse à un avis négatif sur l'attente",
    input: { kind: "negatif", trade: tradeById("restaurant"), name: "Marc", establishment: "Le Petit Bistrot", signature: "Julie, gérante", issue: "l'attente entre les plats", contact: "04 66 00 00 00", variant: 1 },
  },
  {
    title: "Hôtel : réponse à un avis positif",
    input: { kind: "positif", trade: tradeById("hotel"), name: "Sophie", establishment: "Hôtel des Arènes", signature: "Antoine, directeur", point: "le petit-déjeuner", variant: 0 },
  },
  {
    title: "Hôtel : réponse à un avis 3 étoiles sur le bruit",
    input: { kind: "mitige", trade: tradeById("hotel"), name: "Pierre", establishment: "Hôtel des Arènes", signature: "Antoine, directeur", issue: "le bruit côté rue", contact: "reception@hotel-exemple.fr", variant: 0 },
  },
  {
    title: "Salon de coiffure : réponse à un avis 5 étoiles",
    input: { kind: "positif", trade: tradeById("coiffure"), name: "Léa", establishment: "Salon Lumière", signature: "Inès, coiffeuse", point: "la coupe et les conseils", variant: 2 },
  },
  {
    title: "Salon de coiffure : réponse à un avis négatif sur un retard",
    input: { kind: "negatif", trade: tradeById("coiffure"), name: "Nadia", establishment: "Salon Lumière", signature: "Inès, gérante", issue: "le retard sur votre rendez-vous", variant: 2 },
  },
  {
    title: "Garage : réponse à un avis 4 étoiles",
    input: { kind: "quatre-etoiles", trade: tradeById("garage"), name: "Julien", establishment: "Garage du Moulin", signature: "Karim, chef d'atelier", issue: "le délai de restitution du véhicule", variant: 1 },
  },
  {
    title: "Boutique : réponse à un avis qui semble ne pas vous concerner",
    input: { kind: "injuste", trade: tradeById("commerce"), name: "", establishment: "La Fleur du Jour", signature: "Claire, fleuriste", contact: "06 00 00 00 00", variant: 0 },
  },
];

const RULES = [
  { t: "Répondre vite", d: "Idéalement dans les jours qui suivent l'avis. Une réponse rapide montre une fiche vivante et un commerce attentif." },
  { t: "Personnaliser", d: "Le prénom, un détail du message, une signature : les clients repèrent immédiatement les réponses copiées-collées." },
  { t: "Remercier, toujours", d: "Même un avis négatif mérite un merci : le client vous signale un problème que d'autres n'ont pas pris la peine de remonter." },
  { t: "Écrire pour les futurs clients", d: "La réponse est publique. Elle est lue par ceux qui hésitent à venir : le ton compte plus que la justification." },
  { t: "Passer hors ligne pour les litiges", d: "Proposez un téléphone ou un e-mail plutôt que de débattre en public. On règle mieux un problème en direct." },
  { t: "Ne rien révéler sur le client", d: "Aucun détail sur sa commande, sa facture ou sa venue : la réponse doit rester générale sur la situation personnelle." },
  { t: "Rester bref", d: "Trois à cinq phrases suffisent. Une réponse fleuve à un avis négatif donne l'impression d'un règlement de comptes." },
];

const FAQ = [
  {
    q: "Faut-il répondre à tous les avis Google ?",
    a: "C'est recommandé. Répondre aux avis positifs valorise les clients qui ont pris le temps d'écrire, et répondre posément aux avis négatifs rassure ceux qui vous découvrent. Une fiche où le commerçant répond donne l'image d'un établissement attentif.",
  },
  {
    q: "Comment répondre à un avis négatif sur Google ?",
    a: "Attendez d'être calme, remerciez pour le retour, présentez des excuses pour l'expérience vécue, reconnaissez le point soulevé sans vous justifier longuement et proposez un contact direct pour trouver une solution. Signez de votre prénom : une réponse incarnée apaise davantage.",
  },
  {
    q: "Comment répondre à un avis Google sans commentaire ?",
    a: "Par un message court et chaleureux : un merci pour la note et une invitation à revenir. Inutile d'en écrire davantage, mais répondre montre aux futurs clients que vous lisez chaque avis.",
  },
  {
    q: "Dans quel délai répondre à un avis Google ?",
    a: "Le plus tôt possible, idéalement dans les jours qui suivent. Pour un avis négatif, prenez tout de même le temps de vérifier les faits et de laisser retomber l'émotion avant de publier.",
  },
  {
    q: "Peut-on modifier ou supprimer sa réponse à un avis ?",
    a: "Oui. Depuis votre fiche d'établissement Google, vous pouvez modifier ou supprimer à tout moment la réponse publiée sous un avis.",
  },
  {
    q: "Pourquoi ma réponse à un avis n'apparaît-elle pas tout de suite ?",
    a: "Google examine les réponses des établissements avant de les publier, pour vérifier qu'elles respectent son règlement relatif au contenu. Selon l'aide Google, l'examen prend généralement une dizaine de minutes, mais peut aller jusqu'à 30 jours. Si la réponse n'est pas approuvée, Google invite à la modifier.",
  },
  {
    q: "Peut-on proposer un geste commercial dans la réponse ?",
    a: "Mieux vaut le proposer en privé, après échange avec le client. Un geste ne doit jamais être conditionné à la modification ou à la suppression de l'avis : ce serait contraire aux règles de Google.",
  },
  {
    q: "Un professionnel de santé peut-il répondre aux avis ?",
    a: "Oui, mais avec une grande prudence : le secret professionnel interdit de confirmer qu'une personne est patiente ou d'évoquer sa situation. La réponse doit rester générale, et il est utile de consulter les recommandations de son ordre professionnel.",
  },
  {
    q: "Les réponses générées sont-elles enregistrées ?",
    a: "Non. Le générateur fonctionne entièrement dans votre navigateur : ce que vous saisissez n'est ni envoyé ni conservé. L'outil est gratuit et sans inscription.",
  },
];

export default function ReplyToolPage() {
  const url = absoluteUrl(REPLY_TOOL_PATH);
  const schema = graph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "Générateur de réponses aux avis Google",
      url,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Générateur de texte",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      description:
        "Rédige une réponse à un avis Google positif, sans commentaire, mitigé, négatif ou douteux, adaptée au métier, avec plusieurs variantes à copier.",
      featureList: [
        "6 types d'avis : positif, sans commentaire, 4 étoiles, mitigé, négatif, douteux",
        "8 familles de métiers",
        "Personnalisation : prénom, établissement, signature, point soulevé, contact",
        "Plusieurs variantes par type d'avis",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@id": ORG_ID },
      dateModified: UPDATED,
    },
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Outils gratuits", path: TOOLS_PATH },
      { name: "Générateur de réponses aux avis", path: REPLY_TOOL_PATH },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        <ToolHero
          title="Générateur de réponses aux avis Google"
          crumb="Réponses aux avis"
          lead="Choisissez le type d'avis et votre activité, ajoutez un prénom ou un détail : votre réponse est prête à copier. Plusieurs versions par situation, du 5 étoiles enthousiaste à l'avis injuste."
        >
          <ReplyTool />
        </ToolHero>

        <ToolSection
          id="modeles"
          title="18 modèles de réponses aux avis Google."
          alt
          intro={
            <p>
              Trois modèles pour chaque situation, à copier puis compléter (les
              passages entre crochets). Le générateur ci-dessus les remplit pour
              vous et les adapte à votre métier.
            </p>
          }
        >
          <div className="grid gap-12">
            {REPLY_KINDS.map((k) => (
              <div key={k.id} id={`modele-${k.id}`} className="scroll-mt-24">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {KIND_TITLE[k.id]}{" "}
                  <span className="font-normal text-muted">({k.hint.toLowerCase()})</span>
                </h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                  {KIND_INTRO[k.id]}
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {Array.from({ length: VARIANTS_PER_KIND }, (_, v) => (
                    <figure key={v} className="rounded-2xl border border-line bg-canvas p-5 text-[14.5px] leading-relaxed text-ink-soft">
                      <figcaption className="text-xs font-semibold text-brand">
                        Modèle {v + 1}
                      </figcaption>
                      <blockquote className="mt-2">
                        {model(k.id, v).map((p, i) => (
                          <p key={i} className={i > 0 ? "mt-2.5" : undefined}>{p}</p>
                        ))}
                      </blockquote>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          id="exemples"
          title="Exemples de réponses par métier."
          intro={
            <p>
              Les mêmes principes, appliqués à des situations concrètes. Pour
              aller plus loin dans votre secteur, consultez nos{" "}
              <InlineLink href="/guides/par-metier">guides par métier</InlineLink>.
            </p>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <figure key={ex.title} className="rounded-2xl border border-line bg-surface p-5 text-[14.5px] leading-relaxed text-ink-soft">
                <figcaption className="font-display text-[15px] font-semibold text-ink">
                  {ex.title}
                </figcaption>
                <blockquote className="mt-3">
                  {buildReply(ex.input).map((p, i) => (
                    <p key={i} className={i > 0 ? "mt-2.5" : undefined}>{p}</p>
                  ))}
                </blockquote>
              </figure>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          id="regles"
          title="Les 7 règles d'une bonne réponse."
          alt
          intro={
            <p>
              Une réponse à un avis s&apos;adresse à deux lecteurs : son auteur, et
              tous les clients qui le liront ensuite. Ces règles valent pour
              chaque situation. Pour les cas difficiles, lisez notre guide pour{" "}
              <InlineLink href="/guides/repondre-avis-negatif">répondre à un avis négatif</InlineLink>.
            </p>
          }
        >
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RULES.map((r, i) => (
              <li key={r.t} className="rounded-3xl border border-line bg-canvas p-6">
                <span className="font-display text-3xl font-semibold text-brand/25">{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{r.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{r.d}</p>
              </li>
            ))}
          </ol>
        </ToolSection>

        <ToolSection
          id="erreurs"
          title="Les erreurs qui coûtent des clients."
          intro={
            <ul className="grid gap-2.5">
              <li><strong className="text-ink">Contre-attaquer.</strong> Même face à un avis injuste, une réponse agressive fait plus de dégâts que l&apos;avis lui-même.</li>
              <li><strong className="text-ink">Accuser de mensonge.</strong> Dites que vous ne retrouvez pas la situation, invitez à en parler, et signalez l&apos;avis s&apos;il enfreint les règles : voir <InlineLink href="/guides/supprimer-faux-avis-google">supprimer un faux avis Google</InlineLink>.</li>
              <li><strong className="text-ink">Donner des détails personnels.</strong> Montant de la note, date de la visite, contenu d&apos;un échange : tout cela reste privé.</li>
              <li><strong className="text-ink">Copier-coller la même phrase partout.</strong> Une fiche où toutes les réponses sont identiques paraît automatique.</li>
              <li><strong className="text-ink">Promettre une contrepartie contre un avis modifié.</strong> C&apos;est interdit par Google et cela se retourne contre vous.</li>
            </ul>
          }
        />

        <ToolSection
          id="sante"
          title="Professions de santé : la réponse reste générale."
          alt
          intro={
            <p>
              Dentistes, kinésithérapeutes, ostéopathes, pharmaciens : le secret
              professionnel interdit de confirmer qu&apos;une personne est
              patiente ou d&apos;évoquer sa situation, même pour se défendre.
              Remerciez de façon générale, invitez à prendre contact avec le
              cabinet, et appuyez-vous sur les recommandations de votre ordre
              professionnel. Notre guide{" "}
              <InlineLink href="/guides/avis-google-dentiste">avis Google pour un cabinet dentaire</InlineLink>{" "}
              détaille cette prudence.
            </p>
          }
        />

        <StandCta
          title="Moins de temps à défendre votre note, plus d'avis à remercier."
          text="Les clients mécontents écrivent spontanément, les clients satisfaits rarement. Le présentoir Reviu rééquilibre la balance : posé au comptoir, il invite chaque client à laisser son avis, d'un geste."
        />

        <ToolFaq
          title="Questions fréquentes sur les réponses aux avis."
          items={FAQ}
          updated={UPDATED}
        />

        <MoreTools current={REPLY_TOOL_PATH} />
      </main>
      <SiteFooter />
    </>
  );
}
