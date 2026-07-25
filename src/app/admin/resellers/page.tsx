import { listResellers } from "@/lib/reseller";
import { listBatches } from "@/lib/admin";
import { ResellersAdmin } from "./resellers-admin";

export const metadata = { title: "Revendeurs - admin reviu" };

export default async function AdminResellersPage() {
  const [resellers, batches] = await Promise.all([listResellers(), listBatches()]);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Revendeurs</h1>
        <p className="mt-1 text-sm text-muted">
          Créez des revendeurs et attribuez-leur des présentoirs. Chaque
          présentoir attribué et abonné génère une commission mensuelle.
        </p>
      </div>
      <ResellersAdmin
        resellers={resellers}
        batches={batches.map((b) => ({
          id: b.id,
          label: b.label,
          quantity: b.quantity,
          status: b.status,
        }))}
      />
    </div>
  );
}
