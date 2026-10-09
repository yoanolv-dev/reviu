"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CustomerRow } from "@/lib/admin";
import { formatDate } from "@/components/dashboard/ui";

/** Une ligne par client : tout se gère depuis sa fiche. */
function AccountCard({ c }: { c: CustomerRow }) {
  return (
    <li>
      <Link
        href={`/admin/accounts/${c.org_id}`}
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-ink">
              {c.establishment_name || c.org_name || "Sans nom"}
            </span>
            {c.disabled && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
                Suspendu
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
        <span className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white">
          Ouvrir la fiche
        </span>
      </Link>
    </li>
  );
}

export function AccountsAdmin({
  customers,
  initialQuery = "",
}: {
  customers: CustomerRow[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return customers;
    return customers.filter(
      (c) =>
        (c.establishment_name ?? "").toLowerCase().includes(n) ||
        (c.org_name ?? "").toLowerCase().includes(n) ||
        (c.full_name ?? "").toLowerCase().includes(n) ||
        (c.email ?? "").toLowerCase().includes(n),
    );
  }, [q, customers]);

  return (
    <div className="flex flex-col gap-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un client (commerce, contact, e-mail)…"
        className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink outline-none placeholder:text-muted focus:border-brand"
      />
      <p className="text-xs text-muted">
        {filtered.length} client{filtered.length > 1 ? "s" : ""}
      </p>
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          Aucun client trouvé. Pour un code de présentoir, cherchez dans{" "}
          <Link href="/admin/stands" className="text-brand hover:underline">
            Présentoirs
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => (
            <AccountCard key={c.org_id} c={c} />
          ))}
        </ul>
      )}
    </div>
  );
}
