import { redirect } from "next/navigation";
import Link from "next/link";
import { getMyContext, getStats, getFeedback } from "@/lib/dashboard";
import { REVIU_PRO, CONTACT_EMAIL } from "@/lib/brand";
import { StatCard, FeedbackItem } from "@/components/dashboard/ui";
import { BuyStandButton } from "@/components/dashboard/buy-cta";

export default async function DashboardHome() {
  const ctx = await getMyContext();
  if (!ctx || !ctx.establishment) redirect("/dashboard/onboarding");
  const est = ctx.establishment;
  const [stats, feedback] = await Promise.all([
    getStats(),
    getFeedback(est.id, 5),
  ]);

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

      {/* Statistiques — incluses avec votre plaque, sans frais supplémentaires */}
      <div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Scans" value={stats.views} className="reveal-1" />
          <StatCard label="Clics vers Google" value={stats.clicks} className="reveal-2" />
          <StatCard label="Taux de conversion" value={`${stats.conversion}%`} className="reveal-3" />
        </div>
        <p className="mt-2 text-xs text-muted">
          Espace Reviu inclus avec votre plaque, sans frais supplémentaires.
        </p>
      </div>

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

      {/* Reviu Pro — bientôt disponible : carte discrète, ne bloque rien. */}
      <section className="rounded-3xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-display text-base font-semibold text-ink">
            {REVIU_PRO.name}
          </h2>
          <span className="rounded-full bg-line-soft px-2.5 py-0.5 text-xs font-medium text-muted">
            {REVIU_PRO.status}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Connexion à Google Business Profile, centralisation des avis, réponses
          et alertes, assistance IA et analyses avancées. En option, bientôt —
          vos fonctionnalités actuelles restent inchangées.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(REVIU_PRO.waitlistSubject)}`}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-line bg-canvas px-5 text-sm font-medium text-ink transition-colors hover:border-brand/40"
        >
          {REVIU_PRO.cta}
        </a>
      </section>
    </div>
  );
}
