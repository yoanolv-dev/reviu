import { cn } from "@/lib/utils";

/**
 * Photo produit avec repli neutre et sobre.
 *
 * La vraie photo (déposée dans `public/products/`) est affichée en
 * `background-image` par-dessus le repli. Tant qu'aucune photo n'est déposée, le
 * repli reste visible : un aplat neutre discret avec une icône de photo, jamais
 * un aplat coloré ni une image cassée, et sans JavaScript. Dès que la photo est
 * ajoutée au repo, elle recouvre automatiquement le repli.
 *
 * → Déposer les visuels dans `public/products/` (WebP compressé conseillé).
 */
export function ProductPhoto({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-line-soft",
        className,
      )}
    >
      {/* Repli neutre (visible tant qu'aucune photo n'est déposée) */}
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted"
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-45"
        >
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="M21 16l-5-5L4.5 20" />
        </svg>
        <span className="text-[11px] font-medium opacity-60">Présentoir Reviu</span>
      </div>
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${src}")` }}
      />
    </div>
  );
}
