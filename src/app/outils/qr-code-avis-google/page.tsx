import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroBackground } from "@/components/site/hero-background";
import { ProductPhoto } from "@/components/site/product-photo";
import { buttonClass } from "@/components/ui/button";
import { accentLastWord } from "@/components/ui/accent";
import { IconArrowRight, IconCheck, IconClose, IconShield } from "@/components/ui/icons";
import {
  GUARANTEE,
  PRODUCT_PATH,
  QR_TOOL_PATH,
  SHIPPING,
  STAND_PRICE,
} from "@/lib/brand";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  graph,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { QrTool } from "./qr-tool";

const UPDATED = "2026-09-23";

export const metadata: Metadata = buildMetadata({
  title: "Générateur de QR code avis Google gratuit + affiche à imprimer | reviu",
  description:
    "Créez gratuitement le QR code de votre page d'avis Google : QR en PNG ou SVG, affiche ou autocollant prêts à imprimer, lien à envoyer par SMS. Sans inscription.",
  path: QR_TOOL_PATH,
  image: `${QR_TOOL_PATH}/opengraph-image`,
  keywords: [
    "générateur qr code avis google",
    "qr code avis google gratuit",
    "créer qr code avis google",
    "qr code google avis",
    "qr code pour laisser un avis google",
    "affiche avis google à imprimer",
    "lien avis google",
    "place id google avis",
  ],
});

const STEPS = [
  {
    t: "Récupérez le lien de votre page d'avis",
    d: "Depuis votre fiche Google Business Profile, bouton « Demander des avis » : Google vous donne un lien court qui ouvre directement la fenêtre de rédaction d'avis.",
  },
  {
    t: "Collez-le dans le générateur",
    d: "Le QR code apparaît aussitôt. Ajoutez le nom de votre établissement, choisissez le format (affiche ou carré) et la couleur.",
  },
  {
    t: "Téléchargez, imprimez, affichez",
    d: "PNG haute définition ou SVG vectoriel pour l'imprimeur. Placez-le là où le client attend quelques secondes : comptoir, caisse, addition.",
  },
];

const FIND_LINK = [
  {
    t: "Depuis Google Business Profile (le plus simple)",
    d: "Connectez-vous au compte Google qui gère votre fiche, recherchez le nom de votre établissement sur Google ou ouvrez Google Maps, puis choisissez « Demander des avis » (parfois « Obtenir plus d'avis »). Copiez le lien proposé.",
  },
  {
    t: "Avec votre Place ID",
    d: "Chaque fiche Google possède un identifiant unique, le Place ID, qui commence par « ChIJ ». Retrouvez-le avec l'outil « Place ID Finder » de Google, puis collez-le tel quel dans le générateur : nous construisons le lien de rédaction d'avis pour vous.",
  },
];

const SIZES = [
  { support: "Carte de visite, ticket", size: "2 à 2,5 cm", dist: "jusqu'à 25 cm" },
  { support: "Autocollant, carte de table", size: "4 à 5 cm", dist: "jusqu'à 50 cm" },
  { support: "Affiche A5 au comptoir", size: "8 à 10 cm", dist: "jusqu'à 1 m" },
  { support: "Affiche A4 en vitrine", size: "12 à 15 cm", dist: "jusqu'à 1,5 m" },
];

const PLACEMENT = [
  "Au comptoir ou près de la caisse, là où le client attend quelques secondes.",
  "Sur l'addition, le ticket ou la facture remis en fin de visite.",
  "À l'accueil ou en vitrine, à hauteur des yeux.",
  "Sur vos cartes de visite, flyers, sacs et emballages.",
];

const PHRASES = [
  "« Si vous avez passé un bon moment, un avis Google nous aide énormément : il suffit de scanner ici. »",
  "« Votre avis compte beaucoup pour un commerce comme le nôtre, ça prend dix secondes. »",
  "« On essaie de faire connaître la maison : un petit mot sur Google, si le cœur vous en dit ? »",
];

const COMPARE: { label: string; qr: boolean; stand: boolean }[] = [
  { label: "Ouvre votre page d'avis Google", qr: true, stand: true },
  { label: "Gratuit", qr: true, stand: false },
  { label: "Fonctionne d'un simple contact (NFC)", qr: false, stand: true },
  { label: "Lien modifiable sans réimprimer", qr: false, stand: true },
  { label: "Statistiques de scans", qr: false, stand: true },
];

const FAQ = [
  {
    q: "Le générateur de QR code avis Google est-il vraiment gratuit ?",
    a: "Oui. Le QR code, l'affiche et le format carré sont gratuits et sans inscription. Le QR code seul ne porte aucune mention ; l'affiche indique simplement reviu.fr en petit, en bas. Vous pouvez les imprimer et les utiliser sur tous vos supports.",
  },
  {
    q: "Comment trouver le lien de ma page d'avis Google ?",
    a: "Depuis votre fiche Google Business Profile, choisissez « Demander des avis » (ou « Obtenir plus d'avis ») et copiez le lien proposé. Vous pouvez aussi utiliser votre Place ID, qui commence par ChIJ : le générateur construit alors le lien de rédaction d'avis automatiquement.",
  },
  {
    q: "Mon lien est-il envoyé à reviu ?",
    a: "Non. Le QR code et l'affiche sont générés directement dans votre navigateur : votre lien n'est ni envoyé ni enregistré sur nos serveurs.",
  },
  {
    q: "Le QR code expire-t-il ?",
    a: "Non. C'est un QR code statique : il contient directement votre lien d'avis Google et fonctionne tant que ce lien est valide. Si le lien change, il faudra en revanche réimprimer le QR code.",
  },
  {
    q: "Quelle taille choisir pour imprimer mon QR code ?",
    a: "Comptez environ 1 cm de QR code pour 10 cm de distance de scan. Au minimum 2 cm sur une carte de visite, 4 à 5 cm sur un autocollant et 8 à 10 cm sur une affiche A5 posée au comptoir.",
  },
  {
    q: "Quel format de fichier choisir ?",
    a: "Le SVG est vectoriel : il reste parfaitement net à toutes les tailles, idéal pour un imprimeur. Le PNG haute définition convient pour une impression de bureau ou un usage en ligne.",
  },
  {
    q: "Le QR code fonctionne-t-il sur iPhone et Android ?",
    a: "Oui. Il se scanne avec l'appareil photo de n'importe quel smartphone récent, sans application à installer.",
  },
  {
    q: "Ai-je le droit de demander des avis Google à mes clients ?",
    a: "Oui, à condition de proposer l'avis à tous vos clients de la même façon, sans contrepartie et sans filtrer selon leur satisfaction. C'est la règle de Google, et c'est ce qui rend vos avis crédibles.",
  },
  {
    q: "Quelle différence avec le présentoir NFC reviu ?",
    a: `Le QR code demande d'ouvrir l'appareil photo et de viser. Le présentoir reviu ajoute une puce NFC : le client approche simplement son téléphone. Il reste posé au comptoir, son lien est modifiable sans réimprimer et vous suivez vos scans. ${STAND_PRICE}, sans abonnement.`,
  },
];

export default function QrToolPage() {
  const url = absoluteUrl(QR_TOOL_PATH);
  const schema = graph(
    {
      "@type": "WebApplication",
      "@id": `${url}#app`,
      name: "Générateur de QR code avis Google",
      url,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Générateur de QR code",
      operatingSystem: "Web",
      browserRequirements: "Nécessite un navigateur récent",
      inLanguage: "fr-FR",
      isAccessibleForFree: true,
      description:
        "Outil gratuit pour créer le QR code de sa page d'avis Google, une affiche ou un autocollant prêts à imprimer, et envoyer le lien d'avis à ses clients.",
      featureList: [
        "QR code avis Google en PNG et SVG",
        "Affiche A5 / A6 et format carré à imprimer",
        "Conversion automatique d'un Place ID en lien d'avis",
        "Envoi du lien d'avis par SMS, WhatsApp ou e-mail",
        "Génération locale, sans inscription",
      ],
      screenshot: absoluteUrl(`${QR_TOOL_PATH}/opengraph-image`),
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      provider: { "@id": ORG_ID },
      dateModified: UPDATED,
    },
    {
      "@type": "HowTo",
      name: "Créer un QR code pour recevoir des avis Google",
      totalTime: "PT1M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
      step: STEPS.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.t,
        text: s.d,
        url: `${url}#etapes`,
      })),
    },
    faqSchema(FAQ),
    breadcrumbSchema([
      { name: "Accueil", path: "/" },
      { name: "Générateur de QR code avis Google", path: QR_TOOL_PATH },
    ]),
  );

  return (
    <>
      <JsonLd schema={schema} />
      <SiteHeader />
      <main className="bg-canvas">
        {/* HERO + OUTIL : tout tient dans le premier écran sur ordinateur. */}
        <section className="relative isolate overflow-hidden border-b border-line">
          <HeroBackground />
          <Container className="pb-10 pt-6 sm:pb-12 sm:pt-8">
            <div className="flex flex-col gap-1.5 max-lg:text-center lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <h1 className="mx-auto max-w-[16ch] font-display text-[1.65rem] font-semibold leading-tight tracking-tight text-ink sm:max-w-none sm:text-[2.1rem] lg:mx-0 lg:text-[1.9rem] xl:text-[2.1rem]">
                Générateur de QR code avis Google <span className="text-brand">gratuit</span>
              </h1>
              <p className="text-[15px] text-ink-soft max-xl:hidden xl:pb-1.5">
                QR code et affiche prêts à imprimer, sans inscription.
              </p>
            </div>
            <div className="mt-5 sm:mt-6">
              <QrTool />
            </div>
            <div className="mt-5 flex flex-col gap-4 text-sm max-lg:hidden sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-muted">
                <IconShield size={16} className="shrink-0 text-brand" />
                Votre lien reste dans votre navigateur : rien n&apos;est envoyé à nos serveurs.
              </p>
              <Link
                href={PRODUCT_PATH}
                className="group inline-flex items-center gap-1.5 font-semibold text-brand"
              >
                Plus simple encore : le présentoir NFC à {STAND_PRICE}
                <IconArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Container>
        </section>

        {/* 3 ÉTAPES */}
        <section id="etapes" className="scroll-mt-24 border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {accentLastWord("Créer un QR code avis Google en 3 étapes.")}
            </h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.t} className="rounded-3xl border border-line bg-canvas p-6">
                  <span className="font-display text-4xl font-semibold text-brand/25">{i + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.d}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* TROUVER LE LIEN */}
        <section id="trouver-le-lien" className="scroll-mt-24 border-b border-line">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Trouver le lien de votre page d'avis Google.")}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                Le bon lien ouvre directement la fenêtre de rédaction d&apos;avis,
                sans que le client ait à chercher votre fiche. Deux façons de
                l&apos;obtenir. Plus de détails dans notre{" "}
                <Link href="/guides/qr-code-avis-google" className="font-medium text-brand hover:underline">
                  guide du QR code avis Google
                </Link>
                .
              </p>
            </div>
            <div className="grid gap-4">
              {FIND_LINK.map((m) => (
                <div key={m.t} className="rounded-3xl border border-line bg-surface p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">{m.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{m.d}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* TAILLE D'IMPRESSION */}
        <section className="border-b border-line bg-surface">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Quelle taille pour imprimer votre QR code ?")}
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                La règle simple : environ 1 cm de QR code pour 10 cm de distance
                de scan. Gardez une marge blanche autour du code et imprimez-le
                en noir sur fond clair pour une lecture fiable.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-line bg-canvas">
              <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
                <caption className="sr-only">Taille recommandée d&apos;un QR code selon le support</caption>
                <thead>
                  <tr className="border-b border-line text-[13px] text-muted">
                    <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Support</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Taille du QR code</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Scan</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((r) => (
                    <tr key={r.support} className="border-b border-line last:border-0">
                      <th scope="row" className="px-4 py-3.5 font-medium text-ink sm:px-6">{r.support}</th>
                      <td className="px-3 py-3.5 text-ink-soft">{r.size}</td>
                      <td className="px-3 py-3.5 text-ink-soft">{r.dist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        {/* OÙ LE PLACER + QUOI DIRE */}
        <section className="border-b border-line">
          <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <ProductPhoto
              src="/products/etape-1.webp"
              alt="Client scannant un QR code avis Google au comptoir d'un commerce"
              sizes="(min-width: 1024px) 460px, 90vw"
              framed={false}
              className="order-2 mx-auto aspect-square w-full max-w-[460px] rounded-[2rem] shadow-[var(--shadow-lift)] lg:order-1"
            />
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Où placer votre QR code, et quoi dire.")}
              </h2>
              <ul className="mt-6 grid gap-3">
                {PLACEMENT.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-brand">
                      <IconCheck size={12} strokeWidth={2.6} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 font-display text-lg font-semibold text-ink">
                Trois phrases pour le proposer, sans forcer
              </h3>
              <ul className="mt-3 grid gap-2">
                {PHRASES.map((p) => (
                  <li key={p} className="rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] italic leading-relaxed text-ink-soft">
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                Proposez l&apos;avis à tous vos clients, de la même façon : Google
                interdit de filtrer selon la satisfaction. Pour aller plus loin :{" "}
                <Link href="/guides/avoir-plus-avis-google" className="font-medium text-brand hover:underline">
                  comment avoir plus d&apos;avis Google
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* QR CODE vs PRÉSENTOIR */}
        <section className="border-b border-line bg-surface">
          <Container className="py-16 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {accentLastWord("QR code imprimé ou présentoir NFC ?")}
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft">
                  Le QR code gratuit est un très bon début. Le présentoir reviu
                  enlève un geste de plus et reste modifiable dans le temps.
                </p>
                <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-canvas">
                  <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
                    <caption className="sr-only">Comparatif QR code imprimé et présentoir NFC reviu</caption>
                    <thead>
                      <tr className="border-b border-line text-[13px] text-muted">
                        <th scope="col" className="px-4 py-3 sm:px-6"><span className="sr-only">Critère</span></th>
                        <th scope="col" className="px-2 py-3 text-center font-semibold">QR code imprimé</th>
                        <th scope="col" className="bg-brand-soft px-2 py-3 text-center font-semibold text-brand">Présentoir reviu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE.map((r) => (
                        <tr key={r.label} className="border-b border-line last:border-0">
                          <th scope="row" className="px-4 py-3 font-medium text-ink sm:px-6">{r.label}</th>
                          <td className="px-2 py-3 text-center"><Mark ok={r.qr} /></td>
                          <td className="bg-brand-soft/60 px-2 py-3 text-center"><Mark ok={r.stand} strong /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href={PRODUCT_PATH} className={buttonClass("primary", "lg", "group")}>
                    Découvrir le présentoir - {STAND_PRICE}
                    <IconArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <span className="inline-flex items-center gap-2 text-sm text-muted">
                    <IconShield size={16} className="text-brand" />
                    {SHIPPING.label} · {GUARANTEE.label}
                  </span>
                </div>
              </div>
              <ProductPhoto
                src="/products/etape-3.webp"
                alt="Présentoir NFC et QR code reviu pour avis Google sur un comptoir"
                sizes="(min-width: 1024px) 420px, 90vw"
                framed={false}
                className="mx-auto aspect-square w-full max-w-[420px] rounded-[2rem] shadow-[var(--shadow-lift)]"
              />
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section>
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {accentLastWord("Questions fréquentes sur le QR code avis Google.")}
              </h2>
              <div className="mt-10 grid gap-3">
                {FAQ.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-2xl border border-line bg-surface p-5 transition-shadow open:shadow-[var(--shadow-soft)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                      <h3 className="text-[15px] font-medium">{f.q}</h3>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                ))}
              </div>
              <p className="mt-8 text-center text-xs text-muted">
                Mis à jour le 23 septembre 2026 · Outil gratuit proposé par reviu,
                indépendant de Google.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Mark({ ok, strong = false }: { ok: boolean; strong?: boolean }) {
  return ok ? (
    <span className={"inline-grid h-7 w-7 place-items-center rounded-full " + (strong ? "bg-brand text-white" : "bg-brand-soft text-brand")}>
      <IconCheck size={15} strokeWidth={2.6} />
      <span className="sr-only">Oui</span>
    </span>
  ) : (
    <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-line-soft text-muted">
      <IconClose size={14} />
      <span className="sr-only">Non</span>
    </span>
  );
}
