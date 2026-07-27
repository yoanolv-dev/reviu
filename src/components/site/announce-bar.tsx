import { STAND_PRICE } from "@/lib/brand";

/**
 * Bandeau d'annonce au-dessus du header (réassurance commerciale).
 * Non-sticky : il défile hors de l'écran, le header reste épinglé.
 * Message principal : le présentoir à prix fixe, sans abonnement obligatoire ;
 * les réassurances complémentaires sont masquées sur mobile.
 */
export function AnnounceBar() {
  return (
    <div className="bg-brand text-white">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-center gap-3 px-5 text-center text-[13px] font-medium sm:gap-5">
        <span className="inline-flex items-center gap-1.5">
          <TruckIcon />
          Présentoir NFC + QR à {STAND_PRICE} · sans abonnement obligatoire
        </span>
        <span aria-hidden className="hidden text-white/40 sm:inline">
          •
        </span>
        <span className="hidden sm:inline">Paiement sécurisé</span>
        <span aria-hidden className="hidden text-white/40 md:inline">
          •
        </span>
        <span className="hidden md:inline">Compatible iPhone et Android</span>
      </div>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 3h13v13H1zM14 8h4l3 3v5h-7" />
      <circle cx="5.5" cy="18.5" r="1.8" />
      <circle cx="17.5" cy="18.5" r="1.8" />
    </svg>
  );
}
