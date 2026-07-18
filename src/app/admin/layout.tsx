import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dashboard";
import { getIsAdmin } from "@/lib/admin";
import { signOutAction } from "@/lib/auth-actions";
import { Logo } from "@/components/ui/logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const admin = await getIsAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-white">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-1">
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
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
