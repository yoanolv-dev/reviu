import { headers } from "next/headers";
import Link from "next/link";
import { getStandByCode, recordEvent } from "@/lib/data";
import { StarMark } from "@/components/ui/logo";
import { Stars } from "@/components/ui/stars";
import { ScreenShell, Avatar, PoweredBy } from "@/components/site/screen";
import { APP_BASE } from "@/lib/brand";

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

  const h = await headers();
  // Sur r.reviu.fr le chemin public est /{code} ; en local c'est /r/{code}.
  const onRedirectSub =
    (h.get("host") ?? "").split(":")[0].split(".")[0] === "r";
  // La page d'activation vit sur l'app : lien absolu depuis le sous-domaine r.
  const activateHref = onRedirectSub
    ? `${APP_BASE}/activate/${code}`
    : `/activate/${code}`;

  if (stand.status !== "active" || !stand.establishment) {
    return <ActivationView code={code} activateHref={activateHref} />;
  }

  const est = stand.establishment;

  // Canal transmis par l'URL physique, ex. r.reviu.fr/{code}?s=nfc
  const channel = s === "nfc" ? "nfc" : s === "qr" ? "qr" : "unknown";
  void recordEvent(code, "view", { channel, userAgent: h.get("user-agent") });

  const base = onRedirectSub ? `/${code}` : `/r/${code}`;
  const goHref = `${base}/go${s ? `?s=${s}` : ""}`;

  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
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

function ActivationView({
  code,
  activateHref,
}: {
  code: string;
  activateHref: string;
}) {
  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <StarMark className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold text-ink">
          Présentoir prêt à être activé
        </h1>
        <p className="mt-2 text-sm text-muted">
          Ce présentoir n&apos;est pas encore relié à un établissement.
        </p>
        <div className="mt-5 rounded-xl border border-line bg-canvas px-4 py-3">
          <p className="text-xs text-muted">Code du présentoir</p>
          <p className="mt-0.5 font-mono text-lg font-medium tracking-wider text-ink">
            {code}
          </p>
        </div>
        <a
          href={activateHref}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-strong"
        >
          Activer sur reviu
        </a>
        <p className="mt-3 text-xs text-muted">
          Vous êtes le commerçant ? Connectez-vous pour l&apos;activer.
        </p>
      </div>
      <PoweredBy />
    </ScreenShell>
  );
}

function NotFoundView({ code }: { code: string }) {
  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 text-center shadow-sm">
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
