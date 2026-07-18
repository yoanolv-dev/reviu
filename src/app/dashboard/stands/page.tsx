import { redirect } from "next/navigation";
import {
  getMyContext,
  getStands,
  getScanCounts,
  getSubscriptionMap,
  isMonitored,
} from "@/lib/dashboard";
import { REDIRECT_BASE } from "@/lib/brand";
import { MONITORING_PRICE_EUR } from "@/lib/plans";
import { StatusBadge } from "@/components/dashboard/ui";
import { ClaimStandForm } from "./claim-stand-form";
import {
  startMonitoringAction,
  billingPortalAction,
} from "@/lib/billing-actions";

const priceLabel = `${MONITORING_PRICE_EUR.toLocaleString("fr-FR", {
  minimumFractionDigits: 2,
})} €/mois`;

export default async function StandsPage({
  searchParams,
}: {
  searchParams: Promise<{ suivi?: string; billing?: string }>;
}) {
  const ctx = await getMyContext();
  if (!ctx?.establishment) redirect("/dashboard/onboarding");
  const [stands, counts, subs] = await Promise.all([
    getStands(),
    getScanCounts(),
    getSubscriptionMap(),
  ]);
  const base = REDIRECT_BASE.replace(/^https?:\/\//, "");
  const { suivi, billing } = await searchParams;

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
          Rattachez un présentoir reçu avec son code et son PIN, puis activez le
          suivi pour mesurer ses scans et changer son lien à distance.
        </p>
      </div>

      {suivi === "ok" && (
        <Notice tone="ok">Suivi activé — merci&nbsp;! Vos scans sont maintenant détaillés.</Notice>
      )}
      {suivi === "deja" && (
        <Notice tone="muted">Ce présentoir est déjà suivi.</Notice>
      )}
      {suivi === "annule" && (
        <Notice tone="muted">Paiement annulé, aucun changement.</Notice>
      )}
      {billing === "unconfigured" && (
        <Notice tone="warn">
          La facturation n&apos;est pas encore active (Stripe en cours de
          configuration). Réessayez bientôt.
        </Notice>
      )}
      {billing === "none" && (
        <Notice tone="muted">Aucun abonnement à gérer pour l&apos;instant.</Notice>
      )}

      <div className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-base font-semibold text-ink">
          Rattacher un présentoir
        </h2>
        <p className="mt-1 text-sm text-muted">
          Le code et le PIN figurent sous le présentoir.
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
            const monitored = isMonitored(subs[s.id]);
            return (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-medium text-ink">
                      {s.code}
                    </span>
                    <StatusBadge status={s.status} />
                    {monitored && (
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
                        Suivi actif
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-muted">
                    {base}/{s.code}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {monitored ? (
                      <>
                        <p className="font-display text-lg font-semibold text-ink">
                          {counts[s.id] ?? 0}
                        </p>
                        <p className="text-xs text-muted">scans</p>
                      </>
                    ) : (
                      <>
                        <p
                          className="select-none font-display text-lg font-semibold text-line"
                          aria-hidden
                        >
                          ••
                        </p>
                        <p className="text-xs text-muted">verrouillé</p>
                      </>
                    )}
                  </div>

                  {monitored ? (
                    <form action={billingPortalAction}>
                      <button
                        type="submit"
                        className="h-10 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-line-soft"
                      >
                        Gérer
                      </button>
                    </form>
                  ) : (
                    <form action={startMonitoringAction}>
                      <input type="hidden" name="stand_id" value={s.id} />
                      <button
                        type="submit"
                        className="h-10 rounded-full bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                      >
                        Activer le suivi · {priceLabel}
                      </button>
                    </form>
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

function Notice({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "muted";
  children: React.ReactNode;
}) {
  const cls =
    tone === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-line bg-canvas text-ink-soft";
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${cls}`}>{children}</div>
  );
}
