import { Container } from "@/components/ui/container";
import { ShopScene, type ShopVariant } from "./shop-scene";

/** Attributs produit factuels — aucun résultat chiffré ni témoignage. */
const FACTS = [
  { value: "NFC + QR", label: "sur le même présentoir" },
  { value: "À distance", label: "vous pilotez la destination, sans réimprimer" },
  { value: "2 min", label: "pour activer un présentoir" },
];

const USE_CASES: { variant: ShopVariant; title: string; body: string }[] = [
  {
    variant: "cafe",
    title: "Cafés & bars",
    body: "Un présentoir sur le comptoir, à portée de main au moment de payer.",
  },
  {
    variant: "resto",
    title: "Restaurants",
    body: "Un chevalet présenté en fin de repas, quand le souvenir est frais.",
  },
  {
    variant: "beaute",
    title: "Salons & instituts",
    body: "À l'accueil ou en caisse, pour prolonger la relation après le rendez-vous.",
  },
];

export function Testimonials() {
  return (
    <section id="pour-qui" className="border-t border-line bg-canvas">
      <Container className="py-16 sm:py-20">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand">
            Pour qui
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Pensé pour les commerces de proximité.
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {FACTS.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl border border-line bg-surface p-5 text-center"
            >
              <p className="font-display text-2xl font-semibold text-brand">
                {s.value}
              </p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {USE_CASES.map((t) => (
            <figure
              key={t.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="aspect-[4/3] border-b border-line">
                <ShopScene variant={t.variant} />
              </div>
              <figcaption className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {t.title}
                </h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                  {t.body}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
