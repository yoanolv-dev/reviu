"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";
import type { FormState } from "./form";

export async function generateStandsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
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
  const generated = (data ?? []) as { code: string; pin: string }[];
  return {
    success: true,
    info: `${generated.length} présentoir(s) généré(s).`,
    generated,
  };
}
