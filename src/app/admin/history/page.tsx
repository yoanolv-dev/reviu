import Link from "next/link";
import { listAudit } from "@/lib/admin";
import { formatDate } from "@/components/dashboard/ui";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  generated: "Lot généré",
  batch_validated: "Lot validé",
  batch_exported: "Lot exporté",
  status_changed: "Statut modifié",
  replaced: "Présentoir remplacé",
  activated: "Présentoir activé",
  assigned: "Présentoir attribué (admin)",
  reset: "Présentoir réinitialisé",
  transferred: "Présentoir transféré",
  admin_set_link: "Lien du présentoir modifié (admin)",
  admin_edit_establishment: "Commerce modifié (admin)",
  account_edit: "Compte modifié",
  account_disabled: "Compte suspendu",
  account_enabled: "Compte réactivé",
  account_deleted: "Compte supprimé",
  reseller_assigned: "Attribué à un revendeur",
};

const STATUS_LABELS: Record<string, string> = {
  blank: "vierge",
  active: "actif",
  suspended: "suspendu",
  lost: "perdu",
  replaced: "remplacé",
  disabled: "désactivé",
};

const status = (v: unknown) => STATUS_LABELS[String(v)] ?? String(v ?? "?");

const VIA: Record<string, string> = {
  scan: "par scan",
  dashboard: "depuis l'espace client",
  tiers: "par un revendeur (code du commerçant)",
  self_service: "par scan (ancien parcours)",
  dashboard_claim: "depuis l'espace client (ancien parcours)",
};

function summarize(action: string, detail: Record<string, unknown> | null): string {
  if (!detail) return "";
  if (action === "generated") return `${detail.count ?? "?"} présentoir(s)`;
  if (action === "status_changed") return `${status(detail.from)} → ${status(detail.to)}`;
  if (action === "replaced") return `→ ${detail.new_code}`;
  if (action === "activated") return VIA[String(detail.via ?? "")] ?? String(detail.via ?? "");
  if (action === "admin_set_link") return `${detail.to ?? "suit le lien du commerce"}`;
  if (action === "reseller_assigned") return `${detail.assigned ?? "?"} présentoir(s)`;
  if (action === "admin_edit_establishment") return `${detail.name ?? ""} · ${detail.to_url ?? "sans lien"}`;
  return "";
}

/** Client concerné (lien vers sa fiche) quand l'action le précise. */
function orgOf(detail: Record<string, unknown> | null): string | null {
  const org = detail?.org;
  return typeof org === "string" && /^[0-9a-f-]{36}$/i.test(org) ? org : null;
}

export default async function AdminHistoryPage() {
  const rows = await listAudit(300);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Journal des opérations
        </h1>
        <p className="mt-2 text-sm text-muted">
          Activations, changements de lien, de statut et de compte :
          historique complet et horodaté.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Aucune opération enregistrée.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="font-medium text-ink">
                  {ACTION_LABELS[r.action] ?? r.action}
                </span>
                {r.code && (
                  <span className="font-mono text-xs text-muted">{r.code}</span>
                )}
                <span className="text-xs text-muted">
                  {summarize(r.action, r.detail)}
                </span>
                {orgOf(r.detail) && r.action !== "account_deleted" && (
                  <Link
                    href={`/admin/accounts/${orgOf(r.detail)}`}
                    className="text-xs text-brand hover:underline"
                  >
                    Fiche client
                  </Link>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
                {r.actor_email && <span className="truncate">{r.actor_email}</span>}
                <span>{formatDate(r.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
