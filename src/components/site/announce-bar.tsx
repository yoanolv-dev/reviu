import { SHIPPING } from "@/lib/brand";

/**
 * Bandeau d'annonce au-dessus du header : un seul message, centré, en bleu
 * plein — la livraison offerte dès un seuil. Non-sticky (défile), le header
 * reste épinglé.
 */
export function AnnounceBar() {
  return (
    <div className="bg-brand text-white">
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-center gap-2 px-5 text-center text-[13px] font-semibold tracking-wide">
        <TruckIcon />
        Livraison gratuite à partir de {SHIPPING.freeFromLabel}
      </div>
    </div>
  );
}

function TruckIcon() {
  return (
    <svg
      width="16"
      height="16"
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
