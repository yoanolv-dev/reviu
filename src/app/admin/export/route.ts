import type { NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getIsAdmin, listAllStands } from "@/lib/admin";
import { standUrl } from "@/lib/qr";
import { buildXlsx } from "@/lib/xlsx";
import { formatDate } from "@/components/dashboard/ui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExportRow = {
  code: string;
  status: string;
  secret: string;
  label: string | null;
  created_at: string;
};

/**
 * Supplier export.
 *   /admin/export?batch=<id>  → the .xlsx for one production batch (includes the
 *                               activation secret) and PERMANENTLY LOCKS the batch.
 *   /admin/export             → a global .xlsx overview of all stands (no secret,
 *                               non-locking) for internal reference.
 */
export async function GET(req: NextRequest) {
  if (!(await getIsAdmin())) return new Response("Forbidden", { status: 403 });

  const batchId = req.nextUrl.searchParams.get("batch");
  const supabase = await createSupabaseServer();

  if (batchId) {
    const { data, error } = await supabase.rpc("admin_batch_export_rows", {
      p_batch: batchId,
    });
    if (error) return new Response("Export impossible", { status: 400 });
    const rows = (data ?? []) as ExportRow[];
    if (rows.length === 0) return new Response("Lot vide", { status: 404 });

    const sheet: string[][] = [
      ["Code public", "URL QR", "URL NFC", "Secret activation", "Statut", "Lot", "Date"],
    ];
    for (const r of rows) {
      sheet.push([
        r.code,
        standUrl(r.code, "qr"),
        standUrl(r.code, "nfc"),
        r.secret,
        r.status,
        r.label ?? "",
        formatDate(r.created_at),
      ]);
    }

    // Producing the supplier file locks the batch: identifiers are now physical.
    await supabase.rpc("admin_mark_batch_exported", { p_batch: batchId });

    const label = (rows[0].label ?? batchId).replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 40);
    const xlsx = buildXlsx("Présentoirs", sheet);
    return new Response(new Uint8Array(xlsx), {
      headers: {
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": `attachment; filename="reviu-lot-${label}.xlsx"`,
        "cache-control": "no-store",
      },
    });
  }

  // Global overview (no secret, does not lock anything).
  const stands = await listAllStands(1000);
  const sheet: string[][] = [["Code public", "URL QR", "URL NFC", "Statut", "Activé le"]];
  for (const s of stands) {
    sheet.push([
      s.code,
      standUrl(s.code, "qr"),
      standUrl(s.code, "nfc"),
      s.status,
      s.activated_at ? formatDate(s.activated_at) : "",
    ]);
  }
  const xlsx = buildXlsx("Présentoirs", sheet);
  return new Response(new Uint8Array(xlsx), {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": 'attachment; filename="reviu-presentoirs.xlsx"',
      "cache-control": "no-store",
    },
  });
}
