import { createPublicClient } from "./supabase/public";
import type { EventKind, Stand, StandStatus, TargetType } from "./types";

interface ResolveStandRow {
  status: StandStatus;
  target_type: TargetType;
  establishment_id: string | null;
  name: string | null;
  google_review_url: string | null;
  logo_url: string | null;
  brand_color: string | null;
  welcome_message: string | null;
  feedback_enabled: boolean | null;
  target_url: string | null;
}

/** Résout un présentoir par son code (via la fonction RPC sécurisée). */
export async function getStandByCode(code: string): Promise<Stand | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .rpc("resolve_stand", { p_code: code })
    .maybeSingle<ResolveStandRow>();

  if (error || !data) return null;

  const establishment =
    data.establishment_id && data.google_review_url
      ? {
          id: data.establishment_id,
          name: data.name ?? "",
          googleReviewUrl: data.google_review_url,
          logoUrl: data.logo_url,
          brandColor: data.brand_color,
          welcomeMessage: data.welcome_message,
          feedbackEnabled: data.feedback_enabled ?? false,
        }
      : null;

  return {
    code,
    status: data.status,
    targetType: data.target_type,
    targetUrl: data.target_url ?? null,
    establishment,
  };
}

/** Enregistre un évènement (vue de la page / clic vers Google). */
export async function recordEvent(
  code: string,
  kind: Exclude<EventKind, "feedback">,
  opts?: { channel?: string | null; userAgent?: string | null },
): Promise<void> {
  const supabase = createPublicClient();
  await supabase.rpc("record_scan", {
    p_code: code,
    p_kind: kind,
    p_channel: opts?.channel ?? "unknown",
    p_user_agent: opts?.userAgent ?? null,
  });
}

/** Enregistre un retour privé (canal conforme). */
export async function submitFeedback(
  code: string,
  rating: number,
  message: string,
): Promise<void> {
  const supabase = createPublicClient();
  await supabase.rpc("submit_feedback", {
    p_code: code,
    p_rating: rating,
    p_message: message,
  });
}
