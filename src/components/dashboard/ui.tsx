import { Stars } from "@/components/ui/stars";
import { cn } from "@/lib/utils";
import type { FeedbackRow } from "@/lib/dashboard";

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}

export function FeedbackItem({ f }: { f: FeedbackRow }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        {f.rating ? (
          <Stars count={f.rating} size={15} />
        ) : (
          <span className="text-xs text-muted">Sans note</span>
        )}
        <span className="shrink-0 text-xs text-muted">
          {formatDate(f.created_at)}
        </span>
      </div>
      {f.message && (
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{f.message}</p>
      )}
    </li>
  );
}

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: "Actif", className: "bg-emerald-50 text-emerald-700" },
  blank: { label: "Vierge", className: "bg-line-soft text-ink-soft" },
  disabled: { label: "Désactivé", className: "bg-amber-50 text-amber-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.blank;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}
