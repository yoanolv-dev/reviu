import { redirect } from "next/navigation";
import { getMyContext, getFeedback } from "@/lib/dashboard";
import { FeedbackItem } from "@/components/dashboard/ui";

export default async function FeedbackPage() {
  const ctx = await getMyContext();
  if (!ctx?.establishment) redirect("/dashboard/onboarding");
  const items = await getFeedback(ctx.establishment.id, 100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Avis privés
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Retours de vos clients
        </h1>
        <p className="mt-2 text-sm text-muted">
          Les retours privés recueillis via votre page d&apos;avis, non publiés
          sur Google.
        </p>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Aucun retour privé pour le moment.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((f) => (
            <FeedbackItem key={f.id} f={f} />
          ))}
        </ul>
      )}
    </div>
  );
}
