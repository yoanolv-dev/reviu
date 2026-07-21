import { redirect } from "next/navigation";
import {
  getMyContext,
  getStands,
  getScanCounts,
  getSubscriptionMap,
} from "@/lib/dashboard";
import { isEntitled } from "@/lib/subscription";
import { REDIRECT_BASE } from "@/lib/brand";
import { StatusBadge } from "@/components/dashboard/ui";
import { ClaimStandForm } from "./claim-stand-form";

export default async function StandsPage() {
  const ctx = await getMyContext();
  if (!ctx?.establishment) redirect("/dashboard/onboarding");
  const [stands, counts, subs] = await Promise.all([
    getStands(),
    getScanCounts(),
    getSubscriptionMap(),
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
          {stands.map((s) => {
            const entitled = isEntitled(subs[s.id]);
            return (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-medium text-ink">
                      {s.code}
                    </span>
                    <StatusBadge status={s.status} />
                    <SubBadge entitled={entitled} />
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-muted">
                    {base}/{s.code}
                  </p>
                </div>
                <div className="text-right">
                  {entitled ? (
                    <>
                      <p className="font-display text-lg font-semibold text-ink">
                        {counts[s.id] ?? 0}
                      </p>
                      <p className="text-xs text-muted">scans</p>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <LockIcon className="h-3.5 w-3.5" />
                      Stats sur abonnement
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SubBadge({ entitled }: { entitled: boolean }) {
  return entitled ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      Abonné
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-line-soft px-2.5 py-0.5 text-xs font-medium text-ink-soft">
      Gratuit
    </span>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
