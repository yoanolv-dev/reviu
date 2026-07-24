import { Stars } from "@/components/ui/stars";
import { StarMark } from "@/components/ui/logo";

function FinderPattern({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width={7} height={7} rx={1.5} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={1} fill="white" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.6} fill="currentColor" />
    </>
  );
}

/** QR stylisé, purement décoratif (le vrai QR vient du générateur de présentoirs). */
function DecorativeQR() {
  const cells: [number, number][] = [
    [10, 2], [12, 2], [14, 2], [9, 4], [11, 4], [13, 4], [16, 4], [10, 6], [12, 6],
    [2, 10], [4, 10], [6, 10], [2, 12], [5, 12], [2, 14], [4, 14], [6, 14],
    [10, 10], [12, 11], [14, 10], [11, 13], [13, 14], [10, 16], [15, 12],
    [22, 10], [24, 12], [26, 10], [23, 14], [25, 15], [22, 16],
    [10, 22], [12, 24], [14, 22], [11, 25], [13, 26], [10, 24], [16, 23],
  ];
  return (
    <svg viewBox="0 0 29 29" className="h-14 w-14 text-ink" aria-hidden shapeRendering="crispEdges">
      <FinderPattern x={0} y={0} />
      <FinderPattern x={22} y={0} />
      <FinderPattern x={0} y={22} />
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1.5} height={1.5} rx={0.3} fill="currentColor" />
      ))}
    </svg>
  );
}

export function HeroVisual() {
  return (
    <div className="reveal relative mx-auto w-full max-w-[340px]">
      {/* Halo lumineux dégradé derrière le téléphone. */}
      <div
        aria-hidden
        className="absolute inset-2 -z-10 rounded-[3.5rem] bg-gradient-brand opacity-30 blur-3xl"
      />

      {/* Téléphone : aperçu de la page d'avis */}
      <div className="relative rounded-[2.8rem] border border-white/60 bg-ink p-2.5 shadow-[0_40px_80px_-24px_rgba(17,57,201,0.5)]">
        <div className="overflow-hidden rounded-[2.3rem] bg-surface">
          {/* En-tête dégradé */}
          <div className="bg-gradient-brand px-6 pb-8 pt-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/15 font-display text-lg font-semibold text-white backdrop-blur">
              C
            </div>
            <p className="mt-3 font-display text-base font-semibold text-white">
              Le Comptoir de Camille
            </p>
            <p className="mt-1 text-xs text-white/70">
              Comment s&apos;est passée votre visite ?
            </p>
          </div>
          <div className="flex flex-col items-center px-6 pb-7 pt-5 text-center">
            <Stars size={24} className="shimmer" />
            <div className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand text-sm font-medium text-white shadow-[0_10px_24px_-10px_var(--color-brand)]">
              <StarMark className="h-4 w-4" /> Laisser un avis Google
            </div>
            <p className="mt-3 text-[11px] text-muted">J&apos;ai rencontré un souci</p>
          </div>
        </div>
      </div>

      {/* Carte « nouvel avis » flottante (aperçu UI, illustratif). */}
      <div className="float absolute -right-4 top-10 hidden rounded-2xl border border-line bg-surface/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur sm:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft">
            <StarMark className="h-4 w-4 text-accent" />
          </span>
          <div className="text-left">
            <p className="text-[11px] font-semibold text-ink">Nouvel avis Google</p>
            <Stars size={11} className="mt-0.5" />
          </div>
        </div>
      </div>

      {/* Carte présentoir flottante (QR/NFC). */}
      <div className="float-slow absolute -bottom-6 -left-5 hidden -rotate-6 rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-lift)] sm:block">
        <DecorativeQR />
        <p className="mt-1.5 text-center text-[10px] font-medium text-ink-soft">
          Scan · NFC
        </p>
      </div>
    </div>
  );
}
