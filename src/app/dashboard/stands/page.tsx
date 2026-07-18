import { redirect } from "next/navigation";
import { getMyContext, getStands, getScanCounts } from "@/lib/dashboard";
import { REDIRECT_BASE } from "@/lib/brand";
import { StatusBadge } from "@/components/dashboard/ui";
import { ClaimStandForm } from "./claim-stand-form";

export default async function StandsPage() {
  const ctx = await getMyContext();
  if (!ctx?.establishment) redirect("/dashboard/onboarding");
  const [stands, counts] = await Promise.all([getStands(), getScanCounts()]);
  const base = REDIRECT_BASE.replace(/^https?:\/\//, "");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Présentoirs
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Vos présentoirs
        </h1>
        <p className="mt-2 text-sm text-muted">
          Rattachez un présentoir reçu en saisissant son code, puis suivez ses
          scans.
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-base font-semibold text-ink">
          Rattacher un présentoir
        </h2>
        <p className="mt-1 text-sm text-muted">
          Le code figure sous le présentoir (ex.&nbsp;k7Qm2p).
        </p>
        <div className="mt-4">
          <ClaimStandForm establishmentId={ctx.establishment.id} />
        </div>
      </div>

      {stands.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Aucun présentoir rattaché pour l&apos;instant.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {stands.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-medium text-ink">
                    {s.code}
                  </span>
                  <StatusBadge status={s.status} />
                </div>
                <p className="mt-1 truncate font-mono text-xs text-muted">
                  {base}/{s.code}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-semibold text-ink">
                  {counts[s.id] ?? 0}
                </p>
                <p className="text-xs text-muted">scans</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
