import { getIsAdmin, listAllStands } from "@/lib/admin";
import { standUrl } from "@/lib/qr";

function cell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET() {
  if (!(await getIsAdmin())) return new Response("Forbidden", { status: 403 });

  const stands = await listAllStands(1000);
  const rows: string[][] = [["code", "status", "nfc_url", "qr_url"]];
  for (const s of stands) {
    rows.push([s.code, s.status, standUrl(s.code, "nfc"), standUrl(s.code, "qr")]);
  }
  const csv = rows.map((r) => r.map(cell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="reviu-presentoirs.csv"',
    },
  });
}
