import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getMyContext } from "@/lib/dashboard";
import { getStandByCode } from "@/lib/data";
import { Logo } from "@/components/ui/logo";
import { ActivateForm } from "./activate-form";

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/signup?next=${encodeURIComponent(`/activate/${code}`)}`);
  }
  const [stand, ctx] = await Promise.all([
    getStandByCode(code),
    getMyContext(),
  ]);

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-5 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Link href="/dashboard" aria-label="reviu — tableau de bord">
            <Logo />
          </Link>
        </div>
        <div className="mt-6 rounded-3xl border border-line bg-surface p-8 shadow-sm">
          {!stand ? (
            <Info
              title="Présentoir introuvable"
              body={
                <>
                  Le code{" "}
                  <span className="font-mono text-ink-soft">{code}</span> ne
                  correspond à aucun présentoir reviu.
                </>
              }
            />
          ) : stand.status === "active" ? (
            <Info
              title="Déjà activé"
              body="Ce présentoir est déjà rattaché à un compte."
              cta
            />
          ) : (
            <>
              <h1 className="font-display text-xl font-semibold text-ink">
                Activer votre présentoir
              </h1>
              <p className="mt-1.5 text-sm text-muted">
                Présentoir{" "}
                <span className="font-mono text-ink-soft">{code}</span> — entrez
                son PIN et le lien vers lequel il redirige.
              </p>
              <div className="mt-6">
                <ActivateForm
                  code={code}
                  hasEstablishment={Boolean(ctx?.establishment)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({
  title,
  body,
  cta,
}: {
  title: string;
  body: React.ReactNode;
  cta?: boolean;
}) {
  return (
    <div className="text-center">
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">{body}</p>
      {cta && (
        <Link
          href="/dashboard/stands"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
        >
          Voir mes présentoirs
        </Link>
      )}
    </div>
  );
}
