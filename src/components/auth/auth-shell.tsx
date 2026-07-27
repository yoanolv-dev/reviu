import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Aurora } from "@/components/site/aurora";
import { SITE_URL } from "@/lib/brand";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-5 py-10">
      <Aurora variant="soft" />
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        )}
        <p className="mt-4 text-center text-sm">
          <a
            href={SITE_URL}
            className="text-muted transition-colors hover:text-ink"
          >
            ← Retour sur reviu.fr
          </a>
        </p>
      </div>
    </main>
  );
}
