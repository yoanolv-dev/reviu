import { Container } from "@/components/ui/container";
import { Stars } from "@/components/ui/stars";
import { initials } from "@/lib/utils";
import { ShopScene, type ShopVariant } from "./shop-scene";

const STATS = [
  { value: "×3", label: "d'avis en moyenne dès le premier mois" },
  { value: "4,8/5", label: "note moyenne sur les établissements équipés" },
  { value: "2 min", label: "pour activer un présentoir à distance" },
];

const ITEMS: {
  variant: ShopVariant;
  quote: string;
  name: string;
  role: string;
}[] = [
  {
    variant: "cafe",
    quote:
      "On est passés de 2 à 8 avis par semaine, sans rien demander à personne. Le présentoir fait le travail tout seul.",
    name: "Camille D.",
    role: "Café · Lyon",
  },
  {
    variant: "resto",
    quote:
      "Mes serveurs présentent le petit chevalet en fin de repas, et nos avis Google ont doublé en un mois.",
    name: "Karim B.",
    role: "Restaurant · Marseille",
  },
  {
    variant: "beaute",
    quote:
      "Simple à installer, joli sur le comptoir, et je vois enfin d'où viennent mes avis. Adopté.",
    name: "Léa M.",
    role: "Institut de beauté · Bordeaux",
  },
];

export function Testimonials() {
  return (
    <section id="temoignages" className="border-t border-line bg-canvas">
      <Container className="py-16 sm:py-20">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand">
            Preuve sociale
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            La preuve, directement sur le comptoir.
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl border border-line bg-surface p-5 text-center"
            >
              <p className="font-display text-3xl font-semibold text-brand">
                {s.value}
              </p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {ITEMS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="aspect-[4/3] border-b border-line">
                <ShopScene variant={t.variant} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Stars size={15} />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft font-display text-xs font-semibold text-brand">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
