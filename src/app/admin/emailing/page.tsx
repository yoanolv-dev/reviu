import { listUnsubscribedContacts } from "@/lib/emailing";
import { EmailingAdmin } from "./emailing-admin";

export const metadata = { title: "Emailing - admin reviu" };

export default async function AdminEmailingPage() {
  const contacts = await listUnsubscribedContacts();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">
          Emailing d&apos;abonnement
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Relancez les commerçants qui utilisent un présentoir mais n&apos;ont
          pas encore d&apos;abonnement de suivi actif. C&apos;est le levier pour
          convertir le récurrent - le revendeur vend le présentoir, reviu vend le
          suivi.
        </p>
      </div>
      <EmailingAdmin contacts={contacts} />
    </div>
  );
}
