import Link from "next/link";
import { listAllStands } from "@/lib/admin";
import { standUrl } from "@/lib/qr";

export default async function PrintPage() {
  const stands = await listAllStands(300);

  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ink">
          Feuille QR · {stands.length} présentoirs
        </h1>
        <Link href="/admin" className="text-sm text-brand hover:underline">
          ← Retour
        </Link>
      </div>

      {stands.length === 0 ? (
        <p className="text-sm text-muted">Aucun présentoir à imprimer.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {stands.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center gap-2 rounded-xl border border-line p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/admin/qr/${s.code}`} alt={s.code} className="h-28 w-28" />
              <span className="font-mono text-xs font-medium text-ink">
                {s.code}
              </span>
              <span className="font-mono text-[10px] text-muted">
                {standUrl(s.code).replace(/^https?:\/\//, "")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
