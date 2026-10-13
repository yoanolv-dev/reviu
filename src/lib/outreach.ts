import { createHmac, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { createSupabaseAdmin } from "./supabase/admin";
import { CONTACT_EMAIL, PRODUCT_PATH, SITE_URL, STAND_PRICE } from "./brand";

/**
 * Prospection par e-mail des commerces de proximité.
 *
 * Envoi par SMTP depuis une boîte DÉDIÉE (idéalement un domaine secondaire,
 * jamais reviu.fr qui porte les e-mails transactionnels Resend). Variables :
 *   OUTREACH_SMTP_URL     - ex. smtps://user:motdepasse@smtp.exemple.fr:465
 *   OUTREACH_FROM         - ex. "Yoan de Reviu <yoan@reviu-commerce.fr>"
 *   OUTREACH_SENDER_NAME  - prénom signé en bas des e-mails (défaut : Yoan)
 *   OUTREACH_SECRET       - secret des liens de désinscription et du cron
 *   OUTREACH_START_DATE   - début du préchauffage, AAAA-MM-JJ
 *   OUTREACH_DAILY_MAX    - plafond quotidien une fois chauffé (défaut 300)
 *   OUTREACH_PAUSED       - "true" pour tout arrêter sans redéployer
 */

const DAY = 86_400_000;
/** Délai (jours) avant chaque relance, indexé par l'étape qui vient d'être envoyée. */
const FOLLOW_UP_DAYS = [4, 7];
const PER_RUN_MAX = 12;

export function outreachSecret(): string | null {
  return process.env.OUTREACH_SECRET || null;
}

/**
 * Plafond du jour : on démarre à 20 e-mails/jour et on monte de 15 par jour
 * jusqu'au plafond (300 atteint au bout de ~3 semaines). Envoyer 300 e-mails
 * dès le premier jour depuis une boîte neuve l'enverrait en spam.
 */
export function dailyCap(now = new Date()): number {
  const max = Number(process.env.OUTREACH_DAILY_MAX ?? 300);
  const start = Date.parse(process.env.OUTREACH_START_DATE ?? "");
  if (Number.isNaN(start)) return 0;
  const days = Math.floor((now.getTime() - start) / DAY);
  if (days < 0) return 0;
  return Math.min(max, 20 + 15 * days);
}

/** Heure de Paris : envoi du lundi au vendredi, 9 h - 18 h. */
export function inSendingWindow(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  return !/^(sam|dim)/.test(wd) && hour >= 9 && hour < 18;
}

// ---------------------------------------------------------------------------
// Désinscription
// ---------------------------------------------------------------------------

function sign(email: string, secret: string): string {
  return createHmac("sha256", secret).update(email).digest("base64url").slice(0, 22);
}

export function unsubscribeUrl(email: string): string {
  const secret = outreachSecret() ?? "";
  const e = Buffer.from(email).toString("base64url");
  return `${SITE_URL}/api/outreach/unsubscribe?e=${e}&t=${sign(email, secret)}`;
}

export function verifyUnsubscribe(e: string, t: string): string | null {
  const secret = outreachSecret();
  if (!secret || !e || !t) return null;
  const email = Buffer.from(e, "base64url").toString("utf8").toLowerCase();
  const expected = Buffer.from(sign(email, secret));
  const got = Buffer.from(t);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  return email;
}

export async function unsubscribe(email: string): Promise<boolean> {
  const db = createSupabaseAdmin();
  if (!db) return false;
  await db.from("outreach_optouts").upsert({ email });
  await db
    .from("outreach_prospects")
    .update({ status: "unsubscribed", next_send_at: null, updated_at: new Date().toISOString() })
    .eq("email", email);
  return true;
}

// ---------------------------------------------------------------------------
// Contenu
// ---------------------------------------------------------------------------

export type Prospect = {
  id: string;
  email: string;
  business_name: string | null;
  category: string | null;
  city: string | null;
  step: number;
};

/** Accroche par métier (catégories issues de `scripts/prospects-osm.mjs`). */
const HOOKS: Record<string, string> = {
  restaurant: "vos clients sortent souvent ravis de table, mais très peu pensent à laisser un avis",
  cafe: "vos habitués vous adorent, mais rares sont ceux qui le disent sur Google",
  bar: "l'ambiance plaît, mais elle se voit rarement dans vos avis Google",
  boulangerie: "des dizaines de clients passent chaque jour, mais presque aucun ne laisse d'avis",
  coiffeur: "vos clients repartent contents de leur coupe, mais l'oublient sur Google",
  beaute: "vos clientes sont satisfaites, mais les avis Google ne suivent pas toujours",
  fleuriste: "vos bouquets font plaisir, mais vos avis Google ne le montrent pas assez",
  boucherie: "vos clients fidèles vous recommandent de vive voix, rarement sur Google",
  garage: "un client bien dépanné est prêt à vous recommander, si on lui facilite la tâche",
  hotel: "vos voyageurs sont contents, mais beaucoup partent sans laisser d'avis",
  commerce: "vos clients sont satisfaits, mais très peu pensent à laisser un avis Google",
};

export function renderEmail(p: Prospect): { subject: string; text: string } {
  const name = p.business_name?.trim() || "votre commerce";
  const hook = HOOKS[p.category ?? ""] ?? HOOKS.commerce;
  const sender = process.env.OUTREACH_SENDER_NAME || "Yoan";
  const productUrl = `${SITE_URL}${PRODUCT_PATH}`;
  const footer = [
    "",
    `${sender} - reviu.fr`,
    "",
    "--",
    "Vous recevez ce message car l'adresse de votre établissement est publiée",
    "sur sa fiche publique OpenStreetMap. Pour ne plus rien recevoir :",
    unsubscribeUrl(p.email),
    `Contact : ${CONTACT_EMAIL}`,
  ].join("\n");

  if (p.step === 0) {
    return {
      subject: `Plus d'avis Google pour ${name} ?`,
      text: [
        "Bonjour,",
        "",
        `Je me permets de vous écrire au sujet de ${name}${p.city ? ` à ${p.city}` : ""} : ${hook}.`,
        "",
        "Nous avons conçu un petit présentoir à poser sur le comptoir : le client approche son téléphone (ou scanne le QR code) et arrive directement sur la page pour laisser un avis Google. 10 secondes, sans application.",
        "",
        `${STAND_PRICE}, sans abonnement, livraison offerte et satisfait ou remboursé 30 jours.`,
        "",
        `Ça vous intéresserait d'en voir un ? ${productUrl}`,
        "",
        "Bonne journée,",
        footer,
      ].join("\n"),
    };
  }
  if (p.step === 1) {
    return {
      subject: `Re: Plus d'avis Google pour ${name} ?`,
      text: [
        "Bonjour,",
        "",
        "Je reviens vers vous rapidement : les commerces qui demandent un avis au bon moment en récoltent souvent 3 à 5 fois plus. Le présentoir fait la demande à votre place, au comptoir.",
        "",
        `Il suffit de répondre « oui » à ce message et je vous envoie le lien de commande, ou tout est ici : ${productUrl}`,
        "",
        "Merci,",
        footer,
      ].join("\n"),
    };
  }
  return {
    subject: `Re: Plus d'avis Google pour ${name} ?`,
    text: [
      "Bonjour,",
      "",
      "Dernier message de ma part, promis. Si ce n'est pas le bon moment, aucun souci.",
      "",
      `Et si vous voulez simplement tester gratuitement, notre générateur de QR code avis Google est en accès libre : ${SITE_URL}/outils/qr-code-avis-google`,
      "",
      "Belle continuation,",
      footer,
    ].join("\n"),
  };
}

// ---------------------------------------------------------------------------
// Envoi
// ---------------------------------------------------------------------------

export type RunResult = {
  skipped?: string;
  cap?: number;
  sentToday?: number;
  sent: number;
  failed: number;
};

export async function runOutreachBatch(now = new Date()): Promise<RunResult> {
  if (process.env.OUTREACH_PAUSED === "true") return { skipped: "paused", sent: 0, failed: 0 };
  if (!inSendingWindow(now)) return { skipped: "outside_window", sent: 0, failed: 0 };
  const smtpUrl = process.env.OUTREACH_SMTP_URL;
  const from = process.env.OUTREACH_FROM;
  const db = createSupabaseAdmin();
  if (!smtpUrl || !from || !db || !outreachSecret()) {
    return { skipped: "not_configured", sent: 0, failed: 0 };
  }

  const cap = dailyCap(now);
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  const { count } = await db
    .from("outreach_sends")
    .select("id", { count: "exact", head: true })
    .gte("sent_at", dayStart.toISOString());
  const sentToday = count ?? 0;
  const budget = Math.min(PER_RUN_MAX, cap - sentToday);
  if (budget <= 0) return { skipped: "daily_cap", cap, sentToday, sent: 0, failed: 0 };

  // Les relances dues passent avant les premiers contacts.
  const { data: due } = await db
    .from("outreach_prospects")
    .select("id,email,business_name,category,city,step")
    .eq("status", "active")
    .lte("next_send_at", now.toISOString())
    .order("next_send_at")
    .limit(budget);
  const queue: Prospect[] = [...(due ?? [])];
  if (queue.length < budget) {
    const { data: fresh } = await db
      .from("outreach_prospects")
      .select("id,email,business_name,category,city,step")
      .eq("status", "new")
      .order("created_at")
      .limit(budget - queue.length);
    queue.push(...(fresh ?? []));
  }
  if (queue.length === 0) return { skipped: "empty_queue", cap, sentToday, sent: 0, failed: 0 };

  const { data: optouts } = await db
    .from("outreach_optouts")
    .select("email")
    .in("email", queue.map((p) => p.email));
  const blocked = new Set((optouts ?? []).map((o) => o.email));

  const transport = nodemailer.createTransport(smtpUrl);
  let sent = 0;
  let failed = 0;
  for (const p of queue) {
    const stamp = new Date().toISOString();
    if (blocked.has(p.email)) {
      await db.from("outreach_prospects").update({ status: "unsubscribed", next_send_at: null, updated_at: stamp }).eq("id", p.id);
      continue;
    }
    const { subject, text } = renderEmail(p);
    const unsub = unsubscribeUrl(p.email);
    try {
      await transport.sendMail({
        from,
        to: p.email,
        subject,
        text,
        headers: {
          "List-Unsubscribe": `<${unsub}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      const nextStep = p.step + 1;
      const delay = FOLLOW_UP_DAYS[p.step];
      await db
        .from("outreach_prospects")
        .update({
          status: delay === undefined ? "done" : "active",
          step: nextStep,
          last_sent_at: stamp,
          next_send_at: delay === undefined ? null : new Date(Date.now() + delay * DAY).toISOString(),
          last_error: null,
          updated_at: stamp,
        })
        .eq("id", p.id);
      await db.from("outreach_sends").insert({ prospect_id: p.id, step: p.step, ok: true });
      sent++;
    } catch (err) {
      const msg = err instanceof Error ? err.message.slice(0, 500) : String(err);
      // 5xx SMTP = adresse refusée : on ne réessaie pas.
      const permanent = /^5\d\d/.test(String((err as { responseCode?: number }).responseCode ?? ""));
      await db
        .from("outreach_prospects")
        .update({ last_error: msg, updated_at: stamp, ...(permanent ? { status: "bounced", next_send_at: null } : {}) })
        .eq("id", p.id);
      await db.from("outreach_sends").insert({ prospect_id: p.id, step: p.step, ok: false, error: msg });
      failed++;
    }
    // Rythme humain entre deux envois.
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2500));
  }
  transport.close();
  return { cap, sentToday: sentToday + sent, sent, failed };
}
