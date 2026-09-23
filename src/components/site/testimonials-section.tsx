"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { IconArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";

/**
 * « Ils l'ont installé » : un mur de galerie sombre où chaque témoignage est
 * une pile de tirages photo, posés en vrac. Un clic sur la pile fait passer la
 * photo du dessus derrière ; les autres commerçants sont représentés par leur
 * propre mini-pile. Changer de témoignage « redistribue » la pile.
 * Rien n'est rendu tant que la liste est vide.
 */

// Position de chaque tirage dans la pile (0 = dessus) : légère pagaille maîtrisée.
const LAYOUT = [
  { r: -2.5, x: 0, y: 0 },
  { r: 6, x: 18, y: -8 },
  { r: -8, x: -20, y: 10 },
  { r: 11, x: 26, y: 14 },
];
// Mini-piles des onglets.
const MINI = [
  { r: -9, x: 0 },
  { r: 4, x: 10 },
  { r: 13, x: 20 },
];

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;
  const t = items[active];
  const go = (i: number) => setActive((i + items.length) % items.length);

  return (
    <section
      id="temoignages"
      aria-labelledby="temoignages-titre"
      className="relative isolate scroll-mt-20 overflow-hidden bg-ink text-white"
    >
      <div aria-hidden className="hero-grid absolute inset-0 -z-10 opacity-40" />
      <Container className="py-16 sm:py-24">
        {/* Mobile : titre, pile, citation. Desktop : pile à gauche sur deux rangées. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-20 gap-y-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-y-0">
          <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
            <h2
              id="temoignages-titre"
              className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Au comptoir de nos clients.
            </h2>
          </div>

          {/* La pile de tirages */}
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
            <PhotoStack key={active} t={t} />
          </div>

          {/* Le témoignage */}
          <div className="min-w-0 lg:col-start-2 lg:row-start-2 lg:pt-10">
            <figure key={`q-${active}`} className="screen-in">
              <svg
                aria-hidden
                viewBox="0 0 48 36"
                className="mb-5 h-8 w-auto text-brand sm:h-9"
                fill="currentColor"
              >
                <path d="M0 36V22.4C0 9.9 6.2 2.4 18.6 0l2.2 5.1C14.3 7 10.9 10.9 10.4 17h9.2v19H0Zm27.4 0V22.4C27.4 9.9 33.6 2.4 46 0l2 5.1C41.6 7 38.3 10.9 37.8 17H47v19H27.4Z" />
              </svg>
              <blockquote>
                <p className="font-display text-[1.45rem] font-medium leading-snug sm:text-[1.9rem]">
                  {t.quote}
                </p>
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-white/70">
                <span className="font-semibold text-white">{t.name}</span>, {t.role}
                <span className="block text-white/50">
                  {t.business} · {t.city}
                </span>
              </figcaption>
            </figure>

            {items.length > 1 && (
              <div className="mt-10 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-sm tabular-nums text-white/50">
                    {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(active - 1)}
                      aria-label="Témoignage précédent"
                      className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white/10"
                    >
                      <IconArrowRight size={18} className="rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(active + 1)}
                      aria-label="Témoignage suivant"
                      className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-white/90"
                    >
                      <IconArrowRight size={18} />
                    </button>
                  </div>
                </div>
                {/* Les autres commerçants : une mini-pile chacun */}
                <ul className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 py-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
                  {items.map((it, i) => (
                    <li key={it.business}>
                      <button
                        type="button"
                        onClick={() => go(i)}
                        aria-pressed={i === active}
                        aria-label={`Témoignage de ${it.business}`}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl py-2 pl-3 pr-4 transition-colors",
                          i === active ? "bg-white/10" : "hover:bg-white/5",
                        )}
                      >
                        <MiniStack t={it} active={i === active} />
                        <span
                          className={cn(
                            "whitespace-nowrap text-left text-[13px] font-semibold leading-tight",
                            i === active ? "text-white" : "text-white/60",
                          )}
                        >
                          {it.business}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Pile de tirages d'un témoignage. Clic : la photo du dessus s'envole sur le
 * côté puis se glisse sous la pile. Montée à chaque changement de témoignage
 * (via `key`) pour rejouer la « distribution » des photos.
 */
function PhotoStack({ t }: { t: Testimonial }) {
  const photos = t.photos.slice(0, LAYOUT.length);
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [tossing, setTossing] = useState(false);
  const many = photos.length > 1;

  const next = () => {
    if (!many || tossing) return;
    setTossing(true);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setTossing(false);
    }, 320);
  };

  const Wrapper = many ? "button" : "div";

  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[340px]">
      <Wrapper
        {...(many
          ? { type: "button" as const, onClick: next, "aria-label": "Voir la photo suivante" }
          : {})}
        className={cn("relative block aspect-[4/5] w-full", many && "cursor-pointer")}
      >
        {photos.map((p, i) => {
          const pos = order.indexOf(i);
          const l = LAYOUT[pos];
          const isTop = pos === 0;
          const final = `translate(${l.x}px, ${l.y}px) rotate(${l.r}deg)`;
          const transform =
            isTop && tossing ? "translate(-85%, -8%) rotate(-20deg)" : final;
          return (
            <span
              key={p.src}
              className="deal-in absolute inset-0 block rounded-[14px] bg-[#fbfaf7] p-2.5 pb-11 shadow-[0_2px_6px_rgba(0,0,0,0.25),0_30px_60px_-20px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out"
              style={
                {
                  zIndex: photos.length - pos,
                  transform,
                  "--deal-to": final,
                  animationDelay: `${(photos.length - 1 - pos) * 90}ms`,
                } as CSSProperties
              }
            >
              <span className="relative block h-full w-full overflow-hidden rounded-[6px] bg-line-soft">
                <Image
                  src={p.src}
                  alt={isTop ? p.alt : ""}
                  fill
                  sizes="(min-width: 640px) 340px, 280px"
                  className="object-cover"
                />
              </span>
              <span className="absolute inset-x-3.5 bottom-3 flex items-baseline justify-between gap-2 text-ink">
                <span className="truncate font-display text-[15px] font-semibold italic">
                  {t.business}
                </span>
                <span className="shrink-0 text-[11px] text-muted">{t.city}</span>
              </span>
            </span>
          );
        })}
      </Wrapper>
      {many && (
        <p className="mt-10 text-center text-xs text-white/50">
          Touchez la pile pour feuilleter · {photos.length} photos
        </p>
      )}
    </div>
  );
}

/** Petite pile (jusqu'à 3 vignettes) pour les onglets de témoignages. */
function MiniStack({ t, active }: { t: Testimonial; active: boolean }) {
  const photos = t.photos.slice(0, MINI.length);
  return (
    <span className="relative block h-12" style={{ width: 34 + (photos.length - 1) * 10 }}>
      {photos.map((p, i) => (
        <span
          key={p.src}
          className={cn(
            "absolute top-0 block h-12 w-[34px] rounded-[4px] bg-[#fbfaf7] p-[2px] pb-[6px] shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-transform duration-300",
            !active && "opacity-80",
          )}
          style={{
            left: MINI[i].x,
            zIndex: photos.length - i,
            transform: `rotate(${active ? MINI[i].r : MINI[i].r / 2}deg)`,
          }}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-[2px]">
            <Image src={p.src} alt="" fill sizes="34px" className="object-cover" />
          </span>
        </span>
      ))}
    </span>
  );
}
