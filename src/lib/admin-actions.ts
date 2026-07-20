"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./supabase/server";

export interface GeneratedStand {
  code: string;
  pin: string;
}

export type GenerateResult =
  | {
      error?: string;
      success?: boolean;
      info?: string;
      /** Lot fraîchement généré : les PIN en clair ne sont disponibles qu'ici. */
      batch?: GeneratedStand[];
    }
  | null;

export async function generateStandsAction(
  _prev: GenerateResult,
  formData: FormData,
): Promise<GenerateResult> {
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
  const batch = (data ?? []) as GeneratedStand[];
  revalidatePath("/admin");
  return {
    success: true,
    info: `${batch.length} présentoir(s) généré(s).`,
    batch,
  };
}
