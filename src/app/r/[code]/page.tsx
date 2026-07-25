import { after } from "next/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getStandByCode, recordEvent } from "@/lib/data";
import { StarMark } from "@/components/ui/logo";
import { Stars } from "@/components/ui/stars";
import { ScreenShell, Avatar, PoweredBy } from "@/components/site/screen";
import { ActivateFlow } from "./activate-flow";

export default async function RedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const { code } = await params;
  const { s } = await searchParams;
  const stand = await getStandByCode(code);

  if (!stand) return <NotFoundView code={code} />;
  if (stand.status !== "active" || !stand.establishment) {
    return (
      <ScreenShell>
        <ActivateFlow code={code} />
        <PoweredBy />
      </ScreenShell>
    );
  }

  const est = stand.establishment;

  // Canal transmis par l'URL physique, ex. r.reviu.fr/{code}?s=nfc
  const channel = s === "nfc" ? "nfc" : s === "qr" ? "qr" : "unknown";
  const h = await headers();
  const ua = h.get("user-agent");

  // Sur r.reviu.fr le chemin public est /{code} ; en local c'est /r/{code}.
  const onRedirectSub =
    (h.get("host") ?? "").split(":")[0].split(".")[0] === "r";
  const base = onRedirectSub ? `/${code}` : `/r/${code}`;
  const goHref = `${base}/go${s ? `?s=${s}` : ""}`;

  // Mode « Accès direct » (défaut) : redirection immédiate vers l'avis Google.
  // Les écritures (vue + clic - un seul geste en mode direct) partent en
  // arrière-plan via after() : le client n'attend AUCUN aller-retour DB, et on
  // évite le hop intermédiaire /go. Statistiques conservées à l'identique.
  if (est.scanMode === "direct" && stand.targetUrl) {
    after(() => recordEvent(code, "view", { channel, userAgent: ua }));
    after(() => recordEvent(code, "click", { channel, userAgent: ua }));
    redirect(stand.targetUrl);
  }

  // Mode « Page reviu » : page de choix (avis Google + retour privé). L'écriture
  // de la vue se fait en arrière-plan (after garantit l'exécution même après la
  // réponse, contrairement à un simple fire-and-forget).
  after(() => recordEvent(code, "view", { channel, userAgent: ua }));

  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-center shadow-sm sm:p-8">
        <Avatar name={est.name} logoUrl={est.logoUrl} />
        <h1 className="mt-5 font-display text-xl font-semibold text-ink">
          {est.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {est.welcomeMessage ?? "Comment s'est passée votre visite ?"}
        </p>
        <div className="mt-5 flex justify-center">
          <Stars size={26} />
        </div>
        <a
          href={goHref}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-strong"
        >
          <StarMark className="h-4 w-4" /> Laisser un avis sur Google
        </a>
        {est.feedbackEnabled && (
          <Link
            href={`${base}/feedback`}
            className="mt-4 inline-block text-sm text-muted underline-offset-4 hover:text-ink-soft hover:underline"
          >
            J&apos;ai rencontré un souci
          </Link>
        )}
      </div>
      <PoweredBy />
    </ScreenShell>
  );
}

function NotFoundView({ code }: { code: string }) {
  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-center shadow-sm sm:p-8">
        <h1 className="font-display text-xl font-semibold text-ink">
          Présentoir introuvable
        </h1>
        <p className="mt-2 text-sm text-muted">
          Le code{" "}
          <span className="font-mono text-ink-soft">{code}</span> ne correspond à
          aucun présentoir reviu.
        </p>
      </div>
      <PoweredBy />
    </ScreenShell>
  );
}
