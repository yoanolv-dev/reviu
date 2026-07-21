import { redirect } from "next/navigation";
import {
  getMyContext,
  getStands,
  getScanCounts,
  getSubscriptions,
  isTracked,
} from "@/lib/dashboard";
import { REDIRECT_BASE } from "@/lib/brand";
import { StatusBadge } from "@/components/dashboard/ui";
import { ClaimStandForm } from "./claim-stand-form";
import { StandManage } from "./stand-manage";

export default async function StandsPage() {
  const ctx = await getMyContext();
  if (!ctx?.establishment) redirect("/dashboard/onboarding");
  const [stands, counts, subs] = await Promise.all([
    getStands(),
    getScanCounts(),
    getSubscriptions(),
  ]);
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
          Rattachez un présentoir reçu en saisissant son code, puis abonnez-vous
          pour suivre ses scans et modifier ses liens.
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
          {stands.map((s) => {
            const tracked = isTracked(subs[s.id]);
            return (
              <li
                key={s.id}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-medium text-ink">
                        {s.code}
                      </span>
                      <StatusBadge status={s.status} />
                      {tracked && (
                        <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
                          Suivi actif
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate font-mono text-xs text-muted">
                      {base}/{s.code}
                    </p>
                  </div>
                  <div className="text-right">
                    {tracked ? (
                      <>
                        <p className="font-display text-lg font-semibold text-ink">
                          {counts[s.id] ?? 0}
                        </p>
                        <p className="text-xs text-muted">scans</p>
                      </>
                    ) : (
                      <p className="text-xs text-muted">🔒 stats</p>
                    )}
                  </div>
                </div>
                {s.status === "active" && (
                  <StandManage
                    standId={s.id}
                    subscribed={tracked}
                    targetUrl={s.target_url}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
