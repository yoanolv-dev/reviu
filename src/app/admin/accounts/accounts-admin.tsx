"use client";

import { useActionState, useMemo, useState } from "react";
import {
  updateAccountAction,
  setAccountDisabledAction,
  deleteAccountAction,
  assignStandAction,
  resendActivationAction,
  type AdminActionState,
} from "@/lib/admin-actions";
import type { CustomerRow } from "@/lib/admin";
import { formatDate } from "@/components/dashboard/ui";

function Msg({ state }: { state: AdminActionState }) {
  if (!state) return null;
  if (state.error) return <p className="text-xs text-red-600">{state.error}</p>;
  if (state.info) return <p className="text-xs text-emerald-600">{state.info}</p>;
  return null;
}

const btnGhost =
  "h-9 rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-line-soft disabled:opacity-50";
const input =
  "h-9 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-brand";

function AccountCard({
  c,
  isSuperAdmin,
}: {
  c: CustomerRow;
  isSuperAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [edit, editAction, editPending] = useActionState(updateAccountAction, null);
  const [dis, disAction, disPending] = useActionState(setAccountDisabledAction, null);
  const [del, delAction, delPending] = useActionState(deleteAccountAction, null);
  const [assign, assignAction, assignPending] = useActionState(assignStandAction, null);
  const [resend, resendAction, resendPending] = useActionState(resendActivationAction, null);

  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-ink">
              {c.establishment_name || c.org_name || "Sans nom"}
            </span>
            {c.disabled && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                Désactivé
              </span>
            )}
            {c.tracked_count > 0 && (
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
                {c.tracked_count} suivi{c.tracked_count > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-muted">
            {c.email ?? "e-mail inconnu"}
            {c.full_name ? ` · ${c.full_name}` : ""}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            {c.stand_count} présentoir{c.stand_count > 1 ? "s" : ""} ·{" "}
            {c.active_count} actif{c.active_count > 1 ? "s" : ""} · inscrit le{" "}
            {formatDate(c.created_at)}
          </p>
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
        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4">
          <form action={editAction} className="grid gap-2 sm:grid-cols-3">
            <input type="hidden" name="org_id" value={c.org_id} />
            <input
              name="est_name"
              defaultValue={c.establishment_name ?? ""}
              placeholder="Nom établissement"
              className={input}
            />
            <input
              name="full_name"
              defaultValue={c.full_name ?? ""}
              placeholder="Nom du contact"
              className={input}
            />
            <input type="hidden" name="org_name" value={c.org_name} />
            <button type="submit" disabled={editPending} className={btnGhost}>
              {editPending ? "…" : "Enregistrer"}
            </button>
            <div className="sm:col-span-3">
              <Msg state={edit} />
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <form action={disAction}>
              <input type="hidden" name="org_id" value={c.org_id} />
              <input type="hidden" name="disabled" value={String(!c.disabled)} />
              <button type="submit" disabled={disPending} className={btnGhost}>
                {disPending ? "…" : c.disabled ? "Réactiver" : "Désactiver"}
              </button>
            </form>

            {c.email && (
              <form action={resendAction}>
                <input type="hidden" name="email" value={c.email} />
                <button type="submit" disabled={resendPending} className={btnGhost}>
                  {resendPending ? "…" : "Renvoyer l'activation"}
                </button>
              </form>
            )}

            <form action={assignAction} className="flex items-center gap-2">
              <input type="hidden" name="establishment_id" value={c.establishment_id ?? ""} />
              <input
                name="code"
                placeholder="Attribuer un code vierge"
                className={`${input} w-48`}
                disabled={!c.establishment_id}
              />
              <button
                type="submit"
                disabled={assignPending || !c.establishment_id}
                className={btnGhost}
              >
                {assignPending ? "…" : "Attribuer"}
              </button>
            </form>
          </div>
          <div className="flex flex-wrap gap-4">
            <Msg state={dis} />
            <Msg state={assign} />
            <Msg state={resend} />
          </div>

          {isSuperAdmin && (
            <form
              action={delAction}
              onSubmit={(e) => {
                if (
                  !confirm(
                    "Supprimer définitivement ce compte ? Les présentoirs seront retirés (identifiants jamais réutilisés).",
                  )
                )
                  e.preventDefault();
              }}
              className="border-t border-line pt-3"
            >
              <input type="hidden" name="org_id" value={c.org_id} />
              <button
                type="submit"
                disabled={delPending}
                className="text-xs font-medium text-red-600 underline-offset-4 hover:underline disabled:opacity-50"
              >
                {delPending ? "Suppression…" : "Supprimer le compte"}
              </button>
              <Msg state={del} />
            </form>
          )}
        </div>
      )}
    </li>
  );
}

export function AccountsAdmin({
  customers,
  isSuperAdmin,
}: {
  customers: CustomerRow[];
  isSuperAdmin: boolean;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return customers;
    return customers.filter(
      (c) =>
        (c.establishment_name ?? "").toLowerCase().includes(n) ||
        (c.org_name ?? "").toLowerCase().includes(n) ||
        (c.email ?? "").toLowerCase().includes(n),
    );
  }, [q, customers]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un compte (nom, e-mail)…"
        className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
      />
      <p className="text-xs text-muted">
        {filtered.length} compte{filtered.length > 1 ? "s" : ""}
      </p>
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Aucun compte.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => (
            <AccountCard key={c.org_id} c={c} isSuperAdmin={isSuperAdmin} />
          ))}
        </ul>
      )}
    </div>
  );
}
