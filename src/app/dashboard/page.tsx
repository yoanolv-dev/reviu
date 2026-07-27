import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getMyContext,
  getStats,
  getFeedback,
  getSubscriptions,
  isTracked,
} from "@/lib/dashboard";
import { SUBSCRIPTION } from "@/lib/brand";
import { StatCard, FeedbackItem } from "@/components/dashboard/ui";
import { BuyStandButton } from "@/components/dashboard/buy-cta";

export default async function DashboardHome() {
  const ctx = await getMyContext();
  if (!ctx || !ctx.establishment) redirect("/dashboard/onboarding");
  const est = ctx.establishment;
  const [stats, feedback, subs] = await Promise.all([
    getStats(),
    getFeedback(est.id, 5),
    getSubscriptions(),
  ]);
  const tracked = Object.values(subs).some(isTracked);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">
            Vue d&apos;ensemble
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
            {est.name}
          </h1>
        </div>
        <BuyStandButton className="shrink-0" />
      </div>

      {tracked ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Scans" value={stats.views} className="reveal-1" />
          <StatCard label="Clics vers Google" value={stats.clicks} className="reveal-2" />
          <StatCard label="Taux de conversion" value={`${stats.conversion}%`} className="reveal-3" />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-brand opacity-10 blur-3xl"
          />
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white shadow-[var(--shadow-glow)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <h2 className="font-display text-base font-semibold text-ink">
              Suivi et réputation verrouillés
            </h2>
          </div>
          <p className="mt-3 text-sm text-muted">
            Abonnez-vous à {SUBSCRIPTION.priceLabel}/{SUBSCRIPTION.period} pour
            recevoir les retours privés et leurs alertes, un récap hebdomadaire,
            et suivre vos scans, clics et taux de conversion. Sans engagement,
            résiliable à tout moment.
          </p>
          <Link
            href="/dashboard/stands"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-brand px-5 text-sm font-medium text-white shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            Activer le suivi
          </Link>
        </div>
      )}

      {!est.google_review_url && (
        <Link
          href="/dashboard/establishment"
          className="rounded-2xl border border-brand/30 bg-brand-soft p-4 text-sm text-ink transition-colors hover:border-brand/50"
        >
          Ajoutez votre lien d&apos;avis Google pour activer la redirection des
          présentoirs. →
        </Link>
      )}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Derniers avis privés
          </h2>
          <Link
            href="/dashboard/feedback"
            className="text-sm text-brand hover:underline"
          >
            Tout voir
          </Link>
        </div>
        <div className="mt-4">
          {feedback.length === 0 ? (
            <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
              Aucun retour privé pour le moment.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {feedback.map((f) => (
                <FeedbackItem key={f.id} f={f} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
