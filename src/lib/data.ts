import { createPublicClient } from "./supabase/public";
import { createSupabaseAdmin } from "./supabase/admin";
import { normalizeReviewUrl } from "./review-url";
import type {
  Establishment,
  EventKind,
  Stand,
  StandStatus,
  TargetType,
} from "./types";

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
  scan_mode: string | null;
  target_url: string | null;
}

/** Résout un présentoir par son code (via la fonction RPC sécurisée). */
export async function getStandByCode(code: string): Promise<Stand | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .rpc("resolve_stand", { p_code: code })
    .maybeSingle<ResolveStandRow>();

  if (error || !data) return null;

  // Lien effectif : celui du présentoir s'il en a un, sinon celui du commerce
  // (resolve_stand renvoie déjà target_url = coalesce des deux). Un présentoir
  // avec son propre lien fonctionne donc même si le commerce n'en a pas.
  // Revérifié à chaque scan : un lien enregistré avant le filtre actuel (ou
  // par un autre chemin) ne peut jamais rediriger hors des liens Google acceptés.
  const raw = data.target_url ?? data.google_review_url;
  const link = raw && normalizeReviewUrl(raw).ok ? raw : null;
  const establishment: Establishment | null =
    data.establishment_id && link
      ? {
          id: data.establishment_id,
          name: data.name ?? "",
          googleReviewUrl: link,
          logoUrl: data.logo_url,
          brandColor: data.brand_color,
          welcomeMessage: data.welcome_message,
          feedbackEnabled: data.feedback_enabled ?? false,
          scanMode: data.scan_mode === "page" ? "page" : "direct",
        }
      : null;

  return {
    code,
    status: data.status,
    targetType: data.target_type,
    targetUrl: link,
    establishment,
  };
}

/**
 * Client des écritures du parcours public (scans, retours) : service role, pour
 * que les limites du serveur ne puissent pas être contournées en appelant
 * l'API Supabase directement (droits retirés au rôle public par la migration
 * 20261016120000). Clé publique si la clé serveur manque (développement local) :
 * elle ne suffit plus une fois la migration appliquée.
 */
function publicWriteClient() {
  return createSupabaseAdmin() ?? createPublicClient();
}

/** Enregistre un évènement (vue de la page / clic vers Google). */
export async function recordEvent(
  code: string,
  kind: Exclude<EventKind, "feedback">,
  opts?: { channel?: string | null; userAgent?: string | null },
): Promise<void> {
  const supabase = publicWriteClient();
  await supabase.rpc("record_scan", {
    p_code: code,
    p_kind: kind,
    p_channel: opts?.channel ?? "unknown",
    p_user_agent: opts?.userAgent ?? null,
  });
}

/** Enregistre un retour privé (canal conforme). Renvoie l'id créé (ou null). */
export async function submitFeedback(
  code: string,
  rating: number,
  message: string,
): Promise<string | null> {
  const supabase = publicWriteClient();
  const { data } = await supabase.rpc("submit_feedback", {
    p_code: code,
    p_rating: rating,
    p_message: message,
  });
  return (data as string | null) ?? null;
}
