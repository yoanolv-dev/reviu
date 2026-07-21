"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";

export type GeneratedStand = { code: string; pin: string };
export type GenerateState = {
  error?: string;
  rows?: GeneratedStand[];
} | null;

export async function generateStandsAction(
  _prev: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  const count = Number.parseInt(String(formData.get("count") ?? ""), 10);
  const label = String(formData.get("label") ?? "").trim() || null;
  if (!Number.isFinite(count) || count < 1 || count > 500) {
    return { error: "Indiquez un nombre entre 1 et 500." };
  }
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.rpc("generate_stands", {
    p_count: count,
    p_label: label,
  });
  if (error) {
    if (error.message.includes("not_admin")) {
      return { error: "Accès réservé aux administrateurs." };
    }
    return { error: error.message };
  }
  revalidatePath("/admin");
  return { rows: (data ?? []) as GeneratedStand[] };
}
