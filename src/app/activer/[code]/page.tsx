import type { Metadata } from "next";
import Link from "next/link";
import { getStandByCode } from "@/lib/data";
import { getCurrentUser, getMyEstablishments } from "@/lib/dashboard";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CONTACT_EMAIL, CONTACT_PHONE, REDIRECT_BASE } from "@/lib/brand";
import { ScreenShell, PoweredBy } from "@/components/site/screen";
import { LogoBadge } from "@/components/ui/logo";
import { ActivateFlow } from "./activate-flow";

export const metadata: Metadata = {
  title: "Activer votre présentoir - reviu",
  robots: { index: false, follow: false },
};

/**
 * Activation d'un présentoir vierge, servie sur le domaine de l'app
 * (app.reviu.fr/activer/{code}) : la session ouverte pendant l'activation est
 * ainsi directement valable pour l'espace client. Le scan d'un présentoir
 * vierge (r.reviu.fr/{code}) redirige ici.
 */
export default async function ActivatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = raw.trim().toLowerCase();
  const stand = await getStandByCode(code);
  const standAddress = `${REDIRECT_BASE.replace(/^https?:\/\//, "")}/${code}`;

  if (!stand) {
    return (
      <Notice title="Présentoir introuvable">
        Le code <span className="font-mono text-ink-soft">{code}</span> ne
        correspond à aucun présentoir reviu. Scannez à nouveau le QR code de
        votre présentoir.
      </Notice>
    );
  }

  const user = await getCurrentUser();

  if (stand.status !== "blank" && user) {
    // Présentoir activé sur CE compte (RLS : seuls les présentoirs du compte
    // sont lisibles). Cas aussi d'un rafraîchissement de la page juste après
    // l'activation : on affiche la réussite, pas « déjà activé ».
    // Même arbre que le parcours (ScreenShell > ActivateFlow) : si la page se
    // re-rend juste après l'activation, l'écran de réussite reste affiché.
    const supabase = await createSupabaseServer();
    const { data: mine } = await supabase
      .from("stands")
      .select("id, target_url, establishments(name, google_review_url)")
      .eq("code", code)
      .maybeSingle<{
        id: string;
        target_url: string | null;
        establishments: { name: string; google_review_url: string | null } | null;
      }>();
    if (mine) {
      return (
        <ScreenShell>
          <ActivateFlow
            code={code}
            standAddress={standAddress}
            account={user.email ? { email: user.email } : null}
            establishments={[]}
            activated={{
              establishmentName: mine.establishments?.name ?? "",
              hasGoogleLink: Boolean(
                mine.target_url ?? mine.establishments?.google_review_url,
              ),
            }}
          />
          <PoweredBy />
        </ScreenShell>
      );
    }
  }

  if (stand.status !== "blank") {
    return (
      <Notice title="Présentoir déjà activé">
        Ce présentoir est déjà relié à un commerce.
        {user ? (
          <>
            {" "}
            S&apos;il est sur votre compte, vous le retrouvez dans{" "}
            <Link href="/dashboard/stands" className="font-medium text-brand hover:underline">
              vos présentoirs
            </Link>
            .
          </>
        ) : (
          <>
            {" "}
            Pour le gérer,{" "}
            <Link href="/login" className="font-medium text-brand hover:underline">
              connectez-vous
            </Link>
            .
          </>
        )}
        <span className="mt-3 block">
          C&apos;est votre présentoir et vous ne l&apos;avez pas activé
          vous-même ? Contactez-nous :{" "}
          {CONTACT_PHONE && (
            <>
              <a href={CONTACT_PHONE.href} className="font-medium text-ink-soft hover:underline">
                {CONTACT_PHONE.display}
              </a>{" "}
              ou{" "}
            </>
          )}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-ink-soft hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </span>
      </Notice>
    );
  }

  const establishments = user ? await getMyEstablishments() : [];

  return (
    <ScreenShell>
      <ActivateFlow
        code={code}
        standAddress={standAddress}
        account={user?.email ? { email: user.email } : null}
        establishments={establishments}
      />
      <PoweredBy />
    </ScreenShell>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-center shadow-sm sm:p-8">
        <LogoBadge className="mx-auto h-14 w-14" />
        <h1 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">{children}</p>
      </div>
      <PoweredBy />
    </ScreenShell>
  );
}
