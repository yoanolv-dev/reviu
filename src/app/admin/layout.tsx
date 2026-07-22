import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dashboard";
import { getIsAdmin } from "@/lib/admin";
import { signOutAction } from "@/lib/auth-actions";
import { currentEnvLabel, standGenerationAllowed } from "@/lib/env";
import { Logo } from "@/components/ui/logo";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const admin = await getIsAdmin();
  if (!admin) redirect("/dashboard");

  const env = currentEnvLabel();
  const genOn = standGenerationAllowed();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <Logo />
            <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-white">
              Admin
            </span>
            <span
              className={`hidden rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline ${
                genOn
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
              title={
                genOn
                  ? "Génération réelle autorisée"
                  : "Génération désactivée (hors production)"
              }
            >
              {env}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              Dashboard
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">{children}</main>
    </div>
  );
}
