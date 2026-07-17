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
    <svg viewBox="0 0 29 29" className="h-16 w-16 text-ink" aria-hidden shapeRendering="crispEdges">
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
    <div className="relative mx-auto w-full max-w-[320px]">
      <div
        className="absolute inset-4 -z-10 rounded-[3rem] bg-brand-soft blur-2xl"
        aria-hidden
      />

      {/* Téléphone : aperçu de la page d'avis */}
      <div className="relative rounded-[2.6rem] border border-line bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgba(10,13,22,0.35)]">
        <div className="rounded-[2.1rem] bg-surface p-6">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft font-display text-lg font-semibold text-brand">
              C
            </div>
            <p className="mt-4 font-display text-base font-semibold text-ink">
              Le Comptoir de Camille
            </p>
            <p className="mt-1 text-xs text-muted">
              Comment s&apos;est passée votre visite ?
            </p>
            <Stars size={22} className="mt-4" />
            <div className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-medium text-white">
              <StarMark className="h-4 w-4" /> Laisser un avis
            </div>
            <p className="mt-3 text-[11px] text-muted">J&apos;ai rencontré un souci</p>
          </div>
        </div>
      </div>

      {/* Carte présentoir flottante */}
      <div className="absolute -bottom-5 -left-5 hidden -rotate-6 rounded-2xl border border-line bg-surface p-3 shadow-lg sm:block">
        <DecorativeQR />
        <p className="mt-1.5 text-center text-[10px] font-medium text-ink-soft">
          Scan · NFC
        </p>
      </div>
    </div>
  );
}
