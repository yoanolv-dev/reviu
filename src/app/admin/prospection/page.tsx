import { redirect } from "next/navigation";
import { requireAdmin, adminDb } from "@/lib/admin-server";
import { dailyCap } from "@/lib/outreach";
import { stopProspectAction } from "@/lib/outreach-actions";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "À contacter",
  active: "Séquence en cours",
  done: "Séquence terminée",
  replied: "Ont répondu",
  not_interested: "Pas intéressés",
  unsubscribed: "Désinscrits",
  bounced: "Adresses invalides",
};

export default async function AdminProspectionPage() {
  if (!(await requireAdmin())) redirect("/dashboard");
  const db = adminDb();
  const counts: Record<string, number> = {};
  let sentToday = 0;
  let sent7 = 0;
  let recent: { email: string; business_name: string | null; city: string | null; status: string; step: number; last_error: string | null }[] = [];
  if (db) {
    await Promise.all(
      Object.keys(STATUS_LABELS).map(async (s) => {
        const { count } = await db.from("outreach_prospects").select("id", { count: "exact", head: true }).eq("status", s);
        counts[s] = count ?? 0;
      }),
    );
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const week = new Date(today);
    week.setUTCDate(week.getUTCDate() - 7);
    const [{ count: c1 }, { count: c7 }, { data }] = await Promise.all([
      db.from("outreach_sends").select("id", { count: "exact", head: true }).eq("ok", true).gte("sent_at", today.toISOString()),
      db.from("outreach_sends").select("id", { count: "exact", head: true }).eq("ok", true).gte("sent_at", week.toISOString()),
      db.from("outreach_prospects").select("email,business_name,city,status,step,last_error").not("last_sent_at", "is", null).order("last_sent_at", { ascending: false }).limit(50),
    ]);
    sentToday = c1 ?? 0;
    sent7 = c7 ?? 0;
    recent = data ?? [];
  }
  const configured = Boolean(process.env.OUTREACH_SMTP_URL && process.env.OUTREACH_FROM && process.env.OUTREACH_SECRET);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Prospection</h1>
        <p className="mt-1 text-sm text-muted">
          Envoi automatique en semaine, 9 h - 18 h. Plafond aujourd&apos;hui : {dailyCap()} e-mails
          {process.env.OUTREACH_PAUSED === "true" ? " (en pause)" : ""}
          {configured ? "" : " - configuration SMTP incomplète, rien ne part"}.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Envoyés aujourd'hui" value={sentToday} />
        <Stat label="Envoyés sur 7 jours" value={sent7} />
        {Object.entries(STATUS_LABELS).map(([k, label]) => (
          <Stat key={k} label={label} value={counts[k] ?? 0} />
        ))}
      </div>
      <form action={stopProspectAction} className="flex flex-wrap items-end gap-2 rounded-2xl border border-line bg-surface p-4">
        <label className="flex min-w-60 flex-1 flex-col gap-1 text-sm text-ink-soft">
          Arrêter la séquence pour
          <input name="email" type="email" required placeholder="contact@commerce.fr" className="rounded-xl border border-line px-3 py-2 text-ink" />
        </label>
        <select name="status" className="rounded-xl border border-line px-3 py-2 text-sm">
          <option value="replied">A répondu</option>
          <option value="not_interested">Pas intéressé</option>
          <option value="unsubscribed">Ne plus jamais contacter</option>
        </select>
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">Arrêter</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr><th className="p-3">Commerce</th><th className="p-3">E-mail</th><th className="p-3">Étape</th><th className="p-3">Statut</th></tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.email} className="border-t border-line">
                <td className="p-3">{p.business_name ?? "-"}{p.city ? `, ${p.city}` : ""}</td>
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.step}/3</td>
                <td className="p-3" title={p.last_error ?? undefined}>{STATUS_LABELS[p.status] ?? p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="text-2xl font-semibold text-ink">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
