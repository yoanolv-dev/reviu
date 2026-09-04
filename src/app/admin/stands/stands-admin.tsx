"use client";

import { useActionState, useMemo, useState } from "react";
import {
  setStandStatusAction,
  replaceStandAction,
  resetStandAction,
} from "@/lib/admin-actions";
import type { StandFull } from "@/lib/admin";
import { StatusBadge, formatDate } from "@/components/dashboard/ui";
import { REDIRECT_BASE } from "@/lib/brand";

const STATUS_OPTIONS = [
  { value: "active", label: "Actif" },
  { value: "suspended", label: "Suspendu" },
  { value: "disabled", label: "Désactivé" },
  { value: "defective", label: "Défectueux" },
  { value: "lost", label: "Perdu" },
  { value: "retired", label: "Retiré" },
];

function StandCard({ stand }: { stand: StandFull }) {
  const [open, setOpen] = useState(false);
  const [statusState, statusAction, statusPending] = useActionState(
    setStandStatusAction,
    null,
  );
  const [replaceState, replaceAction, replacePending] = useActionState(
    replaceStandAction,
    null,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetStandAction,
    null,
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const canReset = ["active", "suspended", "disabled"].includes(stand.status);
  const base = REDIRECT_BASE.replace(/^https?:\/\//, "");

  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium text-ink">
              {stand.code}
            </span>
            <StatusBadge status={stand.status} />
            {stand.sub_status === "active" && (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
                Suivi
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-muted">
            {stand.establishment_name ? (
              <>
                {stand.establishment_name}
                {stand.owner_email ? ` · ${stand.owner_email}` : ""}
              </>
            ) : (
              <span className="text-muted">Non attribué</span>
            )}
          </p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
            {base}/{stand.code}
            {stand.batch_label ? ` · lot ${stand.batch_label}` : ""}
          </p>
          {stand.status_note && (
            <p className="mt-1 text-xs text-amber-700">Note : {stand.status_note}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-line-soft"
        >
          {open ? "Fermer" : "Gérer"}
        </button>
      </div>

      {open && (
        <div className="mt-4 border-t border-line pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
          <form action={statusAction} className="flex flex-col gap-2">
            <label className="text-xs font-medium text-ink-soft">
              Changer le statut
            </label>
            <input type="hidden" name="stand_id" value={stand.id} />
            <select
              name="status"
              defaultValue={stand.status === "blank" ? "disabled" : stand.status}
              className="h-10 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-brand"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              name="note"
              placeholder="Note (optionnel)"
              className="h-10 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <button
              type="submit"
              disabled={statusPending}
              className="h-9 rounded-full bg-ink px-4 text-xs font-medium text-white transition-colors hover:bg-ink-soft disabled:opacity-50"
            >
              {statusPending ? "…" : "Appliquer"}
            </button>
            {statusState?.error && (
              <p className="text-xs text-red-600">{statusState.error}</p>
            )}
            {statusState?.info && (
              <p className="text-xs text-emerald-600">{statusState.info}</p>
            )}
          </form>

          <form action={replaceAction} className="flex flex-col gap-2">
            <label className="text-xs font-medium text-ink-soft">
              Remplacer (transférer vers un présentoir vierge)
            </label>
            <input type="hidden" name="stand_id" value={stand.id} />
            <input
              name="new_code"
              placeholder="Code du nouveau présentoir"
              className="h-10 rounded-xl border border-line bg-canvas px-3 font-mono text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <input
              name="reason"
              placeholder="Motif (défectueux, perdu…)"
              className="h-10 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <button
              type="submit"
              disabled={replacePending}
              className="h-9 rounded-full border border-line bg-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-line-soft disabled:opacity-50"
            >
              {replacePending ? "…" : "Remplacer"}
            </button>
            {replaceState?.error && (
              <p className="text-xs text-red-600">{replaceState.error}</p>
            )}
            {replaceState?.info && (
              <p className="text-xs text-emerald-600">{replaceState.info}</p>
            )}
          </form>
          </div>

          {canReset && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-xs font-medium text-ink-soft">Réinitialiser</p>
              <p className="mt-1 max-w-xl text-xs text-muted">
                Efface le commerce, le lien Google et les statistiques, et remet
                le présentoir à « vierge » pour un nouveau commerçant. Le code
                QR / NFC et le secret sont conservés.
              </p>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="mt-2 h-9 rounded-full border border-red-200 bg-red-50 px-4 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  Réinitialiser le présentoir
                </button>
              ) : (
                <form
                  action={resetAction}
                  className="mt-2 flex flex-wrap items-center gap-2"
                >
                  <input type="hidden" name="stand_id" value={stand.id} />
                  <span className="text-xs text-ink">
                    Confirmer ? Les infos et les stats seront effacées.
                  </span>
                  <button
                    type="submit"
                    disabled={resetPending}
                    className="h-9 rounded-full bg-red-600 px-4 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {resetPending ? "…" : "Oui, réinitialiser"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="h-9 rounded-full border border-line bg-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-line-soft"
                  >
                    Annuler
                  </button>
                </form>
              )}
              {resetState?.error && (
                <p className="mt-2 text-xs text-red-600">{resetState.error}</p>
              )}
              {resetState?.info && (
                <p className="mt-2 text-xs text-emerald-600">{resetState.info}</p>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export function StandsAdmin({ stands }: { stands: StandFull[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return stands;
    return stands.filter(
      (s) =>
        s.code.toLowerCase().includes(needle) ||
        (s.establishment_name ?? "").toLowerCase().includes(needle) ||
        (s.owner_email ?? "").toLowerCase().includes(needle),
    );
  }, [q, stands]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher par code, établissement ou e-mail…"
        className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
      />
      <p className="text-xs text-muted">
        {filtered.length} présentoir{filtered.length > 1 ? "s" : ""}
        {q ? ` · filtre « ${q} »` : ""}
      </p>
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Aucun présentoir.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((s) => (
            <StandCard key={s.id} stand={s} />
          ))}
        </ul>
      )}
    </div>
  );
}
