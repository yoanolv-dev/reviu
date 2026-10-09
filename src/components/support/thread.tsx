import { cn } from "@/lib/utils";
import type { TicketMessage, TicketStatus } from "@/lib/admin-data";

const timeFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function formatDateTime(iso: string) {
  return timeFmt.format(new Date(iso));
}

const STATUS: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: "En attente de reviu", className: "bg-amber-50 text-amber-700" },
  answered: { label: "Répondu", className: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Clôturé", className: "bg-line-soft text-muted" },
};

const ADMIN_STATUS: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: "À traiter", className: "bg-amber-50 text-amber-700" },
  answered: { label: "Répondu", className: "bg-emerald-50 text-emerald-700" },
  closed: { label: "Clôturé", className: "bg-line-soft text-muted" },
};

export function TicketStatusBadge({
  status,
  admin = false,
}: {
  status: TicketStatus;
  admin?: boolean;
}) {
  const s = (admin ? ADMIN_STATUS : STATUS)[status] ?? STATUS.open;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

/** Fil de discussion : messages du commerçant à gauche, de reviu à droite. */
export function Thread({
  messages,
  viewer,
}: {
  messages: TicketMessage[];
  viewer: "client" | "admin";
}) {
  return (
    <ol className="flex flex-col gap-3">
      {messages.map((m) => {
        const mine = m.author === viewer;
        return (
          <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                mine ? "bg-brand text-white" : "border border-line bg-surface text-ink",
              )}
            >
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.body}</p>
              <p className={cn("mt-1.5 text-[11px]", mine ? "text-white/75" : "text-muted")}>
                {m.author === "admin" ? "reviu" : (m.author_email ?? "Commerçant")} ·{" "}
                {formatDateTime(m.created_at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
