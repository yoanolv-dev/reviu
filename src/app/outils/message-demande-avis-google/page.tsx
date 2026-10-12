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
  REQUEST_TRADES,
  REQUEST_VARIANTS,
  SPOKEN_PHRASES,
  buildRequest,
  type Channel,
} from "@/lib/review-requests";
import { QR_TOOL_PATH } from "@/lib/brand";
import { REQUEST_TOOL_PATH, TOOLS_PATH, getTool } from "@/lib/tools";
import { RequestTool } from "./request-tool";

const tool = getTool(REQUEST_TOOL_PATH)!;
const UPDATED = tool.updated;

export const metadata: Metadata = buildMetadata({
  title: "Message pour demander un avis Google : SMS, e-mail, modèles | reviu",
  description:
    "Créez en un clic le SMS, le WhatsApp ou l'e-mail pour demander un avis Google à vos clients, avec votre lien. Modèles gratuits, conformes aux règles de Google.",
  path: REQUEST_TOOL_PATH,
  image: `${REQUEST_TOOL_PATH}/opengraph-image`,
  keywords: [
    "message pour demander un avis google",
    "sms demande d'avis client",
    "modèle email demande d'avis",
    "texte pour demander un avis",
    "demander un avis google à un client",
    "message whatsapp avis google",
  ],
});

const CHANNEL_SECTIONS: { channel: Channel; title: string; intro: string }[] = [
  {
    channel: "sms",
    title: "Modèles de SMS pour demander un avis Google.",
    intro:
      "Le SMS est lu presque immédiatement : envoyez-le le jour même, quelques heures après la visite. Restez court, un seul lien, et signez du nom de votre établissement.",
  },
  {
    channel: "whatsapp",
    title: "Modèles de messages WhatsApp.",
    intro:
      "Plus conversationnel que le SMS : un ton chaleureux et un émoji passent bien, si vous échangez déjà avec vos clients sur WhatsApp (prise de rendez-vous, commandes).",
  },
  {
    channel: "email",
    title: "Modèles d'e-mail de demande d'avis.",
    intro:
      "L'e-mail laisse la place d'expliquer pourquoi l'avis compte. Un objet simple, un lien bien visible, et une phrase qui accueille aussi les remarques : c'est ce qui fait la différence avec une relance automatique.",
  },
];

const PLACEHOLDER_INPUT = {
  formality: "vous" as const,
  trade: REQUEST_TRADES[0],
  name: "[Prénom]",
  establishment: "[Votre établissement]",
  link: "[votre lien d'avis]",
};

const TIMING = [
  { t: "Restaurant, bar", d: "Le soir même ou le lendemain midi, jamais pendant le service." },
  { t: "Coiffure, beauté", d: "Deux à trois heures après le rendez-vous : le résultat est encore frais." },
  { t: "Hôtel, gîte, camping", d: "Le jour du départ ou le lendemain, une fois le client rentré." },
  { t: "Garage, artisan", d: "Dès que le véhicule est rendu ou le chantier terminé, quand tout fonctionne." },
  { t: "Boutique, commerce", d: "Le jour de l'achat ou après la livraison pour une commande." },
];

const FAQ = [
  {
    q: "Comment demander un avis Google à un client par SMS ?",
    a: "Envoyez un message court le jour de la visite : un merci, une phrase sur son expérience, puis votre lien d'avis Google. Le même message pour tous les clients, sans contrepartie, signé du nom de votre établissement. Le générateur prépare ce SMS pour vous.",
  },
  {
    q: "Quel est le meilleur moment pour envoyer une demande d'avis ?",
    a: "Le plus près possible de la visite, quand le souvenir est frais : quelques heures après, ou le lendemain au plus tard. Évitez les envois tardifs le soir et les relances répétées : une seule demande suffit.",
  },
  {
    q: "Peut-on offrir une réduction en échange d'un avis Google ?",
    a: "Non. Google interdit toute contrepartie en échange d'un avis, qu'il s'agisse d'une réduction, d'un cadeau ou d'une participation à un jeu concours. Les avis concernés peuvent être supprimés et la fiche sanctionnée.",
  },
  {
    q: "Peut-on demander un avis uniquement aux clients satisfaits ?",
    a: "Non. Sélectionner les clients satisfaits, ou les orienter vers un questionnaire privé avant Google, est interdit par les règles de Google. Proposez la même demande à tous vos clients.",
  },
  {
    q: "Faut-il demander 5 étoiles dans le message ?",
    a: "Non. Demandez un avis, pas une note. Un message qui réclame 5 étoiles décourage les retours sincères et va à l'encontre de l'esprit des règles de Google. Les clients satisfaits mettent d'eux-mêmes une bonne note.",
  },
  {
    q: "A-t-on le droit d'envoyer un SMS de demande d'avis ?",
    a: "Envoyez-le uniquement à des clients qui vous ont confié leur numéro dans le cadre de leur achat ou de leur rendez-vous, une seule fois, sans y ajouter d'offre promotionnelle, et respectez toute demande d'arrêt. En cas de doute sur vos obligations, les recommandations de la CNIL sur la prospection font référence.",
  },
  {
    q: "Où trouver mon lien d'avis Google ?",
    a: "Dans votre fiche d'établissement Google, avec l'option pour demander des avis : Google fournit un lien court qui ouvre directement le formulaire d'avis. Le générateur accepte aussi un Place ID, qu'il convertit en lien.",
  },
  {
    q: "Le générateur enregistre-t-il mon lien ou mes clients ?",
    a: "Non. Le message est composé dans votre navigateur : rien n'est envoyé à nos serveurs. Le bouton Envoyer ouvre simplement votre application de SMS, WhatsApp ou de messagerie.",
  },
];

export default function RequestToolPage() {
  const url = absoluteUrl(REQUEST_TOOL_PATH);
  const schema = graph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "Générateur de message de demande d'avis Google",
      url,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Générateur de texte",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      description:
        "Compose un SMS, un message WhatsApp ou un e-mail pour demander un avis Google à un client, avec le lien d'avis, en vouvoiement ou tutoiement.",
      featureList: [
        "SMS, WhatsApp et e-mail (objet et corps)",
        "Vouvoiement ou tutoiement",
        "8 familles de métiers",
        "Vérification du lien d'avis et conversion d'un Place ID",
        "Envoi direct depuis le téléphone",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@id": ORG_ID },
      dateModified: UPDATED,
    },
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Outils gratuits", path: TOOLS_PATH },
      { name: "Message de demande d'avis", path: REQUEST_TOOL_PATH },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        <ToolHero
          title="Message pour demander un avis Google"
          crumb="Message de demande d'avis"
          lead="Le SMS, le WhatsApp ou l'e-mail à envoyer à vos clients, avec votre lien d'avis Google. Choisissez le canal et le ton, copiez ou envoyez directement depuis votre téléphone."
        >
          <RequestTool />
        </ToolHero>

        {CHANNEL_SECTIONS.map((s, idx) => (
          <ToolSection
            key={s.channel}
            id={`modeles-${s.channel}`}
            title={s.title}
            alt={idx % 2 === 0}
            intro={<p>{s.intro}</p>}
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {Array.from({ length: REQUEST_VARIANTS }, (_, v) => {
                const m = buildRequest({ ...PLACEHOLDER_INPUT, channel: s.channel, variant: v });
                return (
                  <figure key={v} className="rounded-2xl border border-line bg-canvas p-5 text-[14.5px] leading-relaxed text-ink-soft">
                    <figcaption className="text-xs font-semibold text-brand">Modèle {v + 1}</figcaption>
                    {m.subject && (
                      <p className="mt-2 text-sm">
                        <span className="text-muted">Objet : </span>
                        <strong className="font-semibold text-ink">{m.subject}</strong>
                      </p>
                    )}
                    <blockquote className="mt-2 whitespace-pre-line break-words">{m.body}</blockquote>
                  </figure>
                );
              })}
            </div>
          </ToolSection>
        ))}

        <ToolSection
          id="au-comptoir"
          title="Et de vive voix, au comptoir ?"
          intro={
            <p>
              Le message écrit rattrape ceux qui sont partis. Mais la demande la
              plus efficace reste celle faite en face, au moment où le client est
              content. Cinq phrases simples, à adapter à votre façon de parler :
            </p>
          }
        >
          <ul className="grid gap-3 md:grid-cols-2">
            {SPOKEN_PHRASES.map((p) => (
              <li key={p} className="rounded-2xl border border-line bg-surface px-5 py-4 text-[15px] italic leading-relaxed text-ink-soft">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Pour que la phrase soit suivie d&apos;un geste immédiat, il faut un
            support à portée de main : un{" "}
            <InlineLink href={QR_TOOL_PATH}>QR code imprimé</InlineLink> ou un
            présentoir sans contact. La méthode complète est dans notre guide pour{" "}
            <InlineLink href="/guides/avoir-plus-avis-google">avoir plus d&apos;avis Google</InlineLink>.
          </p>
        </ToolSection>

        <ToolSection
          id="quand"
          title="Quand envoyer votre demande d'avis."
          alt
          intro={
            <p>
              La règle : au plus près de la visite, une seule fois. Selon votre
              activité, le bon créneau varie. Retrouvez des conseils détaillés
              dans nos <InlineLink href="/guides/par-metier">guides par métier</InlineLink>.
            </p>
          }
        >
          <div className="overflow-hidden rounded-3xl border border-line bg-canvas">
            <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">Meilleur moment pour envoyer une demande d&apos;avis selon l&apos;activité</caption>
              <thead>
                <tr className="border-b border-line text-[13px] text-muted">
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Activité</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Quand envoyer</th>
                </tr>
              </thead>
              <tbody>
                {TIMING.map((r) => (
                  <tr key={r.t} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink sm:px-6">{r.t}</th>
                    <td className="px-3 py-3.5 text-ink-soft">{r.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolSection>

        <ToolSection
          id="regles"
          title="Les règles à respecter."
          intro={
            <ul className="grid gap-2.5">
              <li><strong className="text-ink">Le même message pour tous.</strong> Pas de tri entre clients satisfaits et mécontents : Google l&apos;interdit, et vos avis gagnent en crédibilité.</li>
              <li><strong className="text-ink">Aucune contrepartie.</strong> Ni réduction, ni cadeau, ni tirage au sort en échange d&apos;un avis.</li>
              <li><strong className="text-ink">Une note libre.</strong> Ne demandez pas « 5 étoiles » : demandez un avis, la note appartient au client.</li>
              <li><strong className="text-ink">Une seule demande.</strong> Pas de relances en série : un message, au bon moment.</li>
              <li><strong className="text-ink">Des coordonnées confiées par le client.</strong> N&apos;écrivez qu&apos;aux clients qui vous ont donné leur numéro ou leur e-mail, et respectez toute demande d&apos;arrêt.</li>
            </ul>
          }
        />

        <StandCta
          title="Un message rattrape quelques clients. Un présentoir les invite tous."
          text="Le SMS suppose d'avoir le numéro du client. Le présentoir Reviu, posé au comptoir, s'adresse à chaque personne qui passe : un geste du téléphone et la page d'avis Google s'ouvre, sans rien saisir."
        />

        <ToolFaq
          title="Questions fréquentes sur la demande d'avis."
          items={FAQ}
          updated={UPDATED}
        />

        <MoreTools current={REQUEST_TOOL_PATH} />
      </main>
      <SiteFooter />
    </>
  );
}
