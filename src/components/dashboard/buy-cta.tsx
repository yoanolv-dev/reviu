import { BOUTIQUE_URL } from "@/lib/brand";

/** Bouton d'achat d'un présentoir (redirige vers la boutique reviu). */
export function BuyStandButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={BOUTIQUE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong " +
        className
      }
    >
      <span aria-hidden>🛍️</span> Acheter un présentoir
    </a>
  );
}

/** Carte d'achat, pour l'état vide (aucun présentoir). */
export function BuyStandCard() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-brand/30 bg-brand-soft p-6 text-center sm:p-8">
      <span className="text-3xl" aria-hidden>
        🛍️
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">
        Aucun présentoir pour l&apos;instant
      </h3>
      <p className="max-w-sm text-sm text-muted">
        Commandez votre présentoir NFC + QR pour commencer à collecter des avis
        Google en un geste.
      </p>
      <BuyStandButton className="mt-1" />
    </div>
  );
}
