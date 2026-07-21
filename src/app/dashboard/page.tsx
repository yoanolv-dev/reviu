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
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Vue d&apos;ensemble
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          {est.name}
        </h1>
      </div>

      {tracked ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Scans" value={stats.views} />
          <StatCard label="Clics vers Google" value={stats.clicks} />
          <StatCard label="Taux de conversion" value={`${stats.conversion}%`} />
        </div>
      ) : (
        <div className="rounded-3xl border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <h2 className="font-display text-base font-semibold text-ink">
              Suivi des statistiques verrouillé
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            Abonnez-vous à {SUBSCRIPTION.priceLabel}/{SUBSCRIPTION.period} pour
            suivre vos scans, clics et taux de conversion. Sans engagement,
            résiliable à tout moment.
          </p>
          <Link
            href="/dashboard/stands"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
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
