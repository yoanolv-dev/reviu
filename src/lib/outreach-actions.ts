"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, adminDb } from "./admin-server";

const STOP_STATUSES = ["replied", "not_interested", "unsubscribed"] as const;

/** Arrête la séquence d'un prospect (il a répondu, n'est pas intéressé…). */
export async function stopProspectAction(formData: FormData) {
  if (!(await requireAdmin())) return;
  const db = adminDb();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const status = String(formData.get("status") ?? "");
  if (!db || !email || !STOP_STATUSES.includes(status as (typeof STOP_STATUSES)[number])) return;
  if (status === "unsubscribed") await db.from("outreach_optouts").upsert({ email });
  await db
    .from("outreach_prospects")
    .update({ status, next_send_at: null, updated_at: new Date().toISOString() })
    .eq("email", email);
  revalidatePath("/admin/prospection");
}
