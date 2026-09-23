import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { accentLastWord } from "@/components/ui/accent";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";

/**
 * « Ils l'ont installé » : témoignages de vrais commerçants, présentés comme des
 * photos tirées et posées sur la table (légère inclinaison qui se redresse au
 * survol), avec la citation dessous. Un seul témoignage : mise en page en deux
 * colonnes ; plusieurs : grille (défilement horizontal sur mobile).
 * Rien n'est rendu tant que la liste est vide.
 */
export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  const single = items.length === 1;

  return (
    <section id="temoignages" aria-labelledby="temoignages-titre" className="scroll-mt-20 border-b border-line">
      <Container className="py-16 sm:py-24">
        <div className={single ? "" : "text-center"}>
          <p className="text-sm font-semibold text-brand">Ils l&apos;ont installé</p>
          <h2
            id="temoignages-titre"
            className={cn(
              "mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl",
              !single && "mx-auto max-w-2xl",
            )}
          >
            {accentLastWord("Au comptoir de nos clients.")}
          </h2>
        </div>

        {single ? (
          <div className="mt-12 grid items-center gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
            <Snapshot t={items[0]} index={0} className="mx-auto w-full max-w-[340px]" />
            <Quote t={items[0]} large />
          </div>
        ) : (
          <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {items.map((t, i) => (
              <li
                key={t.business}
                className="w-[78%] shrink-0 snap-center sm:w-auto"
              >
                <Snapshot t={t} index={i} />
                <div className="mt-6 px-1">
                  <Quote t={t} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

/** Photo « tirage » : bordure blanche, légende, inclinaison alternée. */
function Snapshot({
  t,
  index,
  className,
}: {
  t: Testimonial;
  index: number;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "group rounded-[1.25rem] bg-surface p-2.5 pb-3.5 shadow-[0_2px_4px_rgba(10,13,22,0.05),0_24px_48px_-24px_rgba(10,13,22,0.25)] ring-1 ring-line transition-transform duration-500 hover:rotate-0",
        index % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-line-soft">
        <Image
          src={t.photo}
          alt={t.photoAlt}
          fill
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 78vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-1.5">
        <span className="truncate font-display text-[15px] font-semibold text-ink">
          {t.business}
        </span>
        <span className="shrink-0 text-xs text-muted">{t.city}</span>
      </figcaption>
    </figure>
  );
}

function Quote({ t, large = false }: { t: Testimonial; large?: boolean }) {
  return (
    <blockquote>
      <p
        className={cn(
          "font-display font-medium leading-snug text-ink",
          large ? "text-2xl sm:text-3xl" : "text-[17px]",
        )}
      >
        <span aria-hidden className="mr-1 text-brand">
          «
        </span>
        {t.quote}
        <span aria-hidden className="ml-1 text-brand">
          »
        </span>
      </p>
      <footer className={cn("text-sm text-ink-soft", large ? "mt-6" : "mt-3")}>
        <span className="font-semibold text-ink">{t.name}</span>, {t.role}
        {t.guide && (
          <>
            {" · "}
            <Link href={t.guide} className="text-brand hover:underline">
              Voir le guide du métier
            </Link>
          </>
        )}
      </footer>
    </blockquote>
  );
}
