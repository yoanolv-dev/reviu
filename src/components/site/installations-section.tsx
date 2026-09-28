import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { accentLastWord } from "@/components/ui/accent";
import { cn } from "@/lib/utils";
import type { Installation } from "@/lib/installations";

// Inclinaison de chaque tirage : désordre léger, répété au-delà de 5 photos.
const TILT = [-2.5, 1.8, -1.2, 2.4, -1.8];

/**
 * « Déjà sur le comptoir de nos clients » : les photos envoyées par les
 * commerçants, en tirages légendés. Défilement horizontal sur mobile, rangée
 * complète sur ordinateur. Rien n'est rendu tant que la liste est vide.
 */
export function InstallationsSection({
  items,
  className,
}: {
  items: Installation[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="installations-titre" className={cn("overflow-hidden", className)}>
      <Container className="py-16 sm:py-20">
        <div className="text-center">
          <h2
            id="installations-titre"
            className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {accentLastWord("Déjà sur le comptoir de nos clients.")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
            Quelques présentoirs Reviu en place, photographiés par nos
            clients.
          </p>
        </div>

        <ul className="-mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-2 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:overflow-visible sm:px-0 lg:gap-6">
          {items.map((it, i) => (
            <li
              key={it.src}
              className="w-[62vw] max-w-[230px] shrink-0 snap-center sm:w-auto sm:max-w-[250px] sm:flex-1 sm:shrink sm:basis-0"
            >
              <figure
                className="rotate-[var(--tilt)] rounded-[14px] bg-[#fbfaf7] p-2.5 pb-3 shadow-[0_2px_6px_rgba(10,13,22,0.08),0_24px_48px_-24px_rgba(17,57,201,0.35)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-0"
                style={{ "--tilt": `${TILT[i % TILT.length]}deg` } as CSSProperties}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-line-soft">
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 640px) 250px, 62vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2.5 text-center font-display text-[13.5px] font-medium text-ink-soft">
                  {it.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
