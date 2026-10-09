import { redirect } from "next/navigation";
import { listCustomers } from "@/lib/admin";
import { adminDb, requireAdmin } from "@/lib/admin-server";
import { AccountsAdmin } from "./accounts-admin";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await requireAdmin())) redirect("/dashboard");
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);

  // Recherche par code de présentoir (ou adresse r.reviu.fr/…) : directement
  // la fiche du client qui l'utilise.
  const code = q.toLowerCase().split(/[?#]/)[0].replace(/\/+$/, "").split("/").pop() ?? "";
  if (/^[a-z0-9]{6,8}$/.test(code)) {
    const { data } = (await adminDb()
      ?.from("stands")
      .select("org_id")
      .eq("code", code)
      .maybeSingle<{ org_id: string | null }>()) ?? { data: null };
    if (data?.org_id) redirect(`/admin/accounts/${data.org_id}`);
    // Présentoir vierge ou retiré : pas de client, on l'ouvre dans Présentoirs.
    if (data) redirect(`/admin/stands?q=${code}`);
  }

  const customers = await listCustomers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Clients</h1>
        <p className="mt-2 text-sm text-muted">
          Ouvrez la fiche d&apos;un client pour tout voir et tout modifier :
          commerce, liens, présentoirs, statistiques, support.
        </p>
      </div>
      <AccountsAdmin customers={customers} initialQuery={q} />
    </div>
  );
}
