import { redirect } from "next/navigation";
import { listStandsFull } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin-server";
import { StandsAdmin } from "./stands-admin";

export const dynamic = "force-dynamic";

export default async function AdminStandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  const stands = await listStandsFull(1000);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Présentoirs</h1>
        <p className="mt-2 text-sm text-muted">
          Recherchez, changez le statut (défectueux, perdu, suspendu…),
          remplacez ou réinitialisez un présentoir. Pour changer son lien,
          ouvrez la fiche du client. Les identifiants restent permanents et
          jamais réutilisés.
        </p>
      </div>
      <StandsAdmin stands={stands} initialQuery={q} />
    </div>
  );
}
