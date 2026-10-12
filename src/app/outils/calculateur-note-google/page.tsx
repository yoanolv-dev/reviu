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
  COMPENSATION_RATINGS,
  EXAMPLE_COUNTS,
  EXAMPLE_STEPS,
  averageAfter,
  compensation,
  formatRating,
  reviewsNeeded,
} from "@/lib/rating";
import { RATING_TOOL_PATH, TOOLS_PATH, getTool } from "@/lib/tools";
import { RatingTool } from "./rating-tool";

const tool = getTool(RATING_TOOL_PATH)!;
const UPDATED = tool.updated;

export const metadata: Metadata = buildMetadata({
  title: "Calculateur de note Google : combien d'avis 5 étoiles ? | reviu",
  description:
    "Calculez combien d'avis 5 étoiles il vous faut pour passer à 4,5 ou 4,8 sur Google, en combien de temps, et ce que coûte un avis 1 étoile. Gratuit, instantané.",
  path: RATING_TOOL_PATH,
  image: `${RATING_TOOL_PATH}/opengraph-image`,
  keywords: [
    "calculateur note google",
    "calcul note google",
    "combien d'avis 5 étoiles",
    "remonter sa note google",
    "calcul moyenne avis google",
    "note google 4,5",
    "simulateur note google",
  ],
});

// Chiffres des exemples, calculés au build avec la même fonction que l'outil.
const EX_40 = reviewsNeeded(4.0, 40, 4.5)!;
const EX_47 = reviewsNeeded(4.2, 47, 4.5)!;
const COMP_45 = compensation(4.5)!;
const COMP_48 = compensation(4.8)!;
const AFTER_10 = averageAfter(4.6, 10, 1, 1);
const AFTER_200 = averageAfter(4.6, 200, 1, 1);

const FAQ = [
  {
    q: "Combien d'avis 5 étoiles faut-il pour passer de 4 à 4,5 sur Google ?",
    a: `Autant d'avis 5 étoiles que vous avez déjà d'avis. Avec 40 avis à 4,0, il en faut ${EX_40} de plus, tous à 5 étoiles, pour atteindre 4,5. Le calcul : chaque avis 5 étoiles apporte 0,5 point au-dessus de l'objectif, et il faut combler 0,5 point de retard sur chacun des avis existants.`,
  },
  {
    q: "Comment Google calcule-t-il la note moyenne d'un établissement ?",
    a: "La note affichée correspond à la moyenne des notes laissées par les clients, présentée avec une décimale. Google ne publie pas le détail de son calcul : notre calculateur raisonne sur une moyenne simple, ce qui donne une estimation fiable de l'ordre de grandeur, à quelques avis près.",
  },
  {
    q: "Combien d'avis 5 étoiles pour compenser un avis 1 étoile ?",
    a: `Cela dépend de votre note, pas de votre nombre d'avis. À 4,5, il faut ${COMP_45} avis 5 étoiles pour effacer l'effet d'un avis 1 étoile ; à 4,8, il en faut ${COMP_48}. Plus la note est haute, plus chaque avis négatif coûte cher.`,
  },
  {
    q: "Pourquoi ma note Google ne bouge presque plus ?",
    a: `Parce que chaque nouvel avis pèse de moins en moins lourd à mesure que le total grandit. Un avis 1 étoile fait passer une note de 4,6 à ${formatRating(AFTER_10, 2)} sur 10 avis, mais seulement à ${formatRating(AFTER_200, 2)} sur 200 avis. C'est la même chose dans l'autre sens : une note installée sur beaucoup d'avis monte lentement, mais elle est aussi bien protégée.`,
  },
  {
    q: "Quelle note Google viser pour son commerce ?",
    a: "Il n'existe pas de seuil officiel. Visez une note au moins équivalente à celle de vos concurrents directs sur la carte, portée par des avis nombreux et récents : pour un client, la fraîcheur et le volume des avis comptent autant que la décimale.",
  },
  {
    q: "Peut-on supprimer un avis négatif pour remonter sa note ?",
    a: "Seulement s'il enfreint les règles de Google (faux avis, propos injurieux, hors sujet, conflit d'intérêts) : on le signale alors depuis sa fiche. Un avis négatif sincère reste en ligne. La seule façon durable de remonter sa note est d'obtenir davantage d'avis de vos clients satisfaits, tout en répondant avec soin aux critiques.",
  },
  {
    q: "Le calculateur enregistre-t-il mes chiffres ?",
    a: "Non. Le calcul se fait entièrement dans votre navigateur : rien n'est envoyé ni enregistré sur nos serveurs, et aucune inscription n'est demandée.",
  },
];

export default function RatingToolPage() {
  const url = absoluteUrl(RATING_TOOL_PATH);
  const schema = graph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "Calculateur de note Google",
      url,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Calculateur",
      operatingSystem: "Web",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      description:
        "Calcule le nombre d'avis 5 étoiles nécessaires pour atteindre une note Google cible, le délai selon votre rythme d'avis et l'impact d'un avis 1 étoile.",
      featureList: [
        "Nombre d'avis 5 étoiles pour atteindre une note cible",
        "Hypothèse de nouveaux avis à 4,5 ou 4,8 en moyenne",
        "Délai estimé selon le nombre d'avis par mois",
        "Impact d'un avis 1 étoile et avis nécessaires pour le compenser",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@id": ORG_ID },
      dateModified: UPDATED,
    },
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Outils gratuits", path: TOOLS_PATH },
      { name: "Calculateur de note Google", path: RATING_TOOL_PATH },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        <ToolHero
          title="Calculateur de note Google"
          crumb="Calculateur de note Google"
          lead="Combien d'avis 5 étoiles vous faut-il pour passer à 4,5 ou 4,8 ? Entrez votre note et votre nombre d'avis : le résultat s'affiche aussitôt, avec le délai estimé et le poids réel d'un avis négatif."
        >
          <RatingTool />
        </ToolHero>

        <ToolSection
          id="calcul"
          title="Comment le calcul fonctionne."
          alt
          intro={
            <>
              <p>
                Votre note Google est une moyenne : la somme des étoiles divisée
                par le nombre d&apos;avis. Pour atteindre une note cible, chaque
                nouvel avis 5 étoiles doit compenser l&apos;écart entre vos avis
                actuels et l&apos;objectif. D&apos;où la formule utilisée par le
                calculateur :
              </p>
              <p className="mt-4 rounded-2xl border border-line bg-canvas px-5 py-4 font-medium text-ink">
                Avis nécessaires = nombre d&apos;avis × (note visée - note
                actuelle) ÷ (5 - note visée), arrondi à l&apos;entier supérieur.
              </p>
              <p className="mt-4">
                Exemple : avec 47 avis à 4,2, il faut 47 × 0,3 ÷ 0,5 = 28,2,
                soit {EX_47} avis 5 étoiles pour atteindre 4,5. Google affiche la
                note avec une seule décimale : derrière un « 4,2 » peut se cacher
                une moyenne réelle légèrement différente, d&apos;où un résultat à
                considérer à quelques avis près.
              </p>
            </>
          }
        />

        <ToolSection
          id="tableau"
          title="Combien d'avis 5 étoiles selon votre point de départ."
          intro={
            <p>
              Le nombre d&apos;avis 5 étoiles à obtenir dépend de l&apos;écart à
              combler et du nombre d&apos;avis que vous avez déjà. Repérez votre
              situation dans le tableau ci-dessous.
            </p>
          }
        >
          <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">
                Nombre d&apos;avis 5 étoiles nécessaires pour faire monter une note Google, selon le nombre d&apos;avis actuels
              </caption>
              <thead>
                <tr className="border-b border-line text-[13px] text-muted">
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Objectif</th>
                  {EXAMPLE_COUNTS.map((n) => (
                    <th key={n} scope="col" className="px-3 py-3 text-right font-semibold">
                      {n} avis
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_STEPS.map((s) => (
                  <tr key={`${s.from}-${s.to}`} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3.5 font-medium text-ink sm:px-6">
                      De {formatRating(s.from)} à {formatRating(s.to)}
                    </th>
                    {EXAMPLE_COUNTS.map((n) => (
                      <td key={n} className="px-3 py-3.5 text-right tabular-nums text-ink-soft">
                        {reviewsNeeded(s.from, n, s.to)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            Hypothèse : tous les nouveaux avis sont à 5 étoiles. Avec des avis à
            4,8 en moyenne, il en faut davantage : utilisez le calculateur.
          </p>
        </ToolSection>

        <ToolSection
          id="avis-negatif"
          title="Ce que coûte vraiment un avis 1 étoile."
          alt
          intro={
            <p>
              Le nombre d&apos;avis 5 étoiles nécessaires pour effacer un avis 1
              étoile ne dépend que de votre note : plus elle est haute, plus la
              réparation est longue. C&apos;est pour cela qu&apos;un flux régulier
              d&apos;avis compte davantage qu&apos;un pic ponctuel.
            </p>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COMPENSATION_RATINGS.map((r) => (
              <div key={r} className="rounded-2xl border border-line bg-canvas p-4">
                <p className="text-sm text-muted">Note de {formatRating(r)}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  {compensation(r)} avis 5★
                </p>
                <p className="mt-0.5 text-xs text-muted">pour compenser un avis 1★</p>
              </div>
            ))}
          </div>
        </ToolSection>

        <ToolSection
          id="enseignements"
          title="Trois enseignements à retenir."
        >
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Passer de 4,0 à 4,5 demande de doubler",
                d: "Il faut autant d'avis 5 étoiles que vous en avez déjà. Avec 60 avis, il en faut 60 de plus. Un objectif atteignable, à condition de demander l'avis à chaque client.",
              },
              {
                t: "Chaque dixième coûte plus cher que le précédent",
                d: "De 4,7 à 4,9, il faut deux fois plus d'avis 5 étoiles que vous n'en avez. Au-delà de 4,7, l'enjeu devient surtout de protéger la note.",
              },
              {
                t: "Avec peu d'avis, la note est fragile",
                d: "Sur 10 avis, un seul avis négatif peut faire perdre plusieurs dixièmes. Le volume est votre meilleure assurance contre un client de mauvaise humeur.",
              },
            ].map((s, i) => (
              <li key={s.t} className="rounded-3xl border border-line bg-surface p-6">
                <span className="font-display text-4xl font-semibold text-brand/25">{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </ToolSection>

        <ToolSection
          id="remonter"
          title="Faire monter sa note, dans les règles."
          alt
          intro={
            <>
              <p>
                Le calcul le montre : la note monte avec le volume d&apos;avis de
                clients satisfaits. Il n&apos;y a pas de raccourci honnête, et les
                raccourcis malhonnêtes (faux avis, avis contre réduction, tri des
                clients) sont interdits par Google et sanctionnés par la loi.
                Ce qui marche :
              </p>
              <ul className="mt-4 grid gap-2.5">
                <li>
                  <strong className="text-ink">Demander à chaque client</strong>,
                  au moment où il est le plus satisfait : la méthode complète dans
                  notre guide pour{" "}
                  <InlineLink href="/guides/avoir-plus-avis-google">avoir plus d&apos;avis Google</InlineLink>.
                </li>
                <li>
                  <strong className="text-ink">Réduire le geste à un scan</strong>{" "}
                  avec un QR code ou un support sans contact au comptoir.
                </li>
                <li>
                  <strong className="text-ink">Répondre aux avis négatifs</strong>{" "}
                  avec calme : notre{" "}
                  <InlineLink href="/outils/reponse-avis-google">générateur de réponses</InlineLink>{" "}
                  vous aide à trouver le ton.
                </li>
                <li>
                  <strong className="text-ink">Signaler les faux avis</strong>{" "}
                  qui enfreignent les règles : voir{" "}
                  <InlineLink href="/guides/supprimer-faux-avis-google">supprimer un faux avis Google</InlineLink>.
                </li>
              </ul>
              <p className="mt-4">
                Pour une méthode pas à pas, lisez aussi notre guide pour{" "}
                <InlineLink href="/guides/augmenter-note-google">augmenter sa note Google</InlineLink>.
              </p>
            </>
          }
        />

        <StandCta
          title="Le moyen le plus simple d'obtenir ces avis 5 étoiles."
          text="Le présentoir Reviu se pose au comptoir : vos clients approchent leur téléphone ou scannent le QR code, et votre page d'avis Google s'ouvre. Demander un avis devient un réflexe, pour chaque client."
        />

        <ToolFaq
          title="Questions fréquentes sur la note Google."
          items={FAQ}
          updated={UPDATED}
        />

        <MoreTools current={RATING_TOOL_PATH} />
      </main>
      <SiteFooter />
    </>
  );
}
