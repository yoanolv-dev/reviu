import { initials } from "@/lib/utils";

export function ScreenShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-5 py-10">
      {children}
    </main>
  );
}

export function Avatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        className="mx-auto h-16 w-16 rounded-2xl object-cover"
      />
    );
  }
  return (
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft font-display text-xl font-semibold text-brand">
      {initials(name)}
    </div>
  );
}

export function PoweredBy() {
  return (
    <a
      href="https://reviu.fr"
      className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink-soft"
    >
      Propulsé par{" "}
      <span className="font-display font-semibold text-ink-soft">reviu</span>
    </a>
  );
}
