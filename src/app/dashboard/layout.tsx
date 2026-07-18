import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dashboard";
import { signOutAction } from "@/lib/auth-actions";
import { Logo } from "@/components/ui/logo";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <DashboardNav />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
