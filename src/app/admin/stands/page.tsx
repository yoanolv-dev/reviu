import { listStandsFull } from "@/lib/admin";
import { StandsAdmin } from "./stands-admin";

export const dynamic = "force-dynamic";

export default async function AdminStandsPage() {
  const stands = await listStandsFull(1000);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Admin
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Tous les présentoirs
        </h1>
        <p className="mt-2 text-sm text-muted">
          Recherchez, changez le statut (défectueux, perdu, suspendu…) ou
          remplacez un présentoir. Les identifiants restent permanents et jamais
          réutilisés.
        </p>
      </div>
      <StandsAdmin stands={stands} />
    </div>
  );
}
