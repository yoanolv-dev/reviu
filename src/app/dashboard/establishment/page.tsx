import { redirect } from "next/navigation";
import { getMyContext } from "@/lib/dashboard";
import { EstablishmentForm } from "./establishment-form";

export default async function EstablishmentPage() {
  const ctx = await getMyContext();
  if (!ctx?.establishment) redirect("/dashboard/onboarding");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Établissement
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Configuration
        </h1>
        <p className="mt-2 text-sm text-muted">
          Ce que voient vos clients sur la page d&apos;avis.
        </p>
      </div>
      <EstablishmentForm est={ctx.establishment} />
    </div>
  );
}
