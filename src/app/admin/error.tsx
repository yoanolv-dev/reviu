"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Erreur dans une page admin : message clair plutôt que la page d'erreur
 * générique. Cause la plus fréquente : la clé serveur Supabase absente de
 * l'environnement (statistiques, fiches clients et support en ont besoin).
 */
export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      <h1 className="font-display text-xl font-semibold text-ink">
        Cette page n&apos;a pas pu se charger
      </h1>
      <p className="text-sm text-muted">
        Réessayez dans un instant. Si le problème persiste, vérifiez que la clé
        serveur <span className="font-mono text-ink-soft">SUPABASE_SERVICE_ROLE_KEY</span>{" "}
        est bien renseignée dans l&apos;environnement (Vercel).
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="h-10 rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
        >
          Réessayer
        </button>
        <Link
          href="/admin/production"
          className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors hover:bg-line-soft"
        >
          Production
        </Link>
      </div>
    </div>
  );
}
