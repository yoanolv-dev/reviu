import { createSupabaseServer } from "./supabase/server";

/** Commerçant ayant des présentoirs mais aucun abonnement de suivi actif. */
export interface UnsubscribedContact {
  org_id: string;
  org_name: string;
  email: string;
  full_name: string | null;
  stand_count: number;
}

/** Cibles de relance (admin) : commerçants non-abonnés joignables par e-mail. */
export async function listUnsubscribedContacts(): Promise<UnsubscribedContact[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.rpc("admin_unsubscribed_contacts");
  return (data ?? []) as UnsubscribedContact[];
}
