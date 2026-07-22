import { listCustomers, getIsSuperAdmin } from "@/lib/admin";
import { AccountsAdmin } from "./accounts-admin";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  const [customers, isSuperAdmin] = await Promise.all([
    listCustomers(),
    getIsSuperAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-brand">
          Admin
        </p>
        <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
          Comptes clients
        </h1>
        <p className="mt-2 text-sm text-muted">
          Recherchez, modifiez, désactivez ou supprimez un compte, attribuez un
          présentoir et renvoyez un e-mail d&apos;activation.
        </p>
      </div>
      <AccountsAdmin customers={customers} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
