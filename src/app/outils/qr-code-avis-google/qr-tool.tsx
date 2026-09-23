"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import {
  IconArrowRight,
  IconCheck,
  IconDownload,
  IconLink,
  IconMail,
  IconMessage,
  IconPrinter,
  IconShield,
  IconWhatsapp,
} from "@/components/ui/icons";
import {
  checkLink,
  downloadBlob,
  posterSvg,
  qrOnlySvg,
  svgToPng,
  POSTER_COLORS,
  type PosterFormat,
} from "@/lib/qr-poster";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--color-brand-soft)]";

const TITLES = ["Votre avis compte !", "Vous avez aimé ?", "Un avis, ça nous aide !"];

const FORMATS: { id: PosterFormat; label: string; hint: string }[] = [
  { id: "affiche", label: "Affiche", hint: "A5 / A6, comptoir ou vitrine" },
  { id: "carre", label: "Carré", hint: "Autocollant, carte de table" },
];

/** Message envoyé aux clients : une invitation, identique pour tous. */
function shareMessage(url: string, name: string): string {
  const who = name.trim() ? ` chez ${name.trim()}` : "";
  return `Merci pour votre visite${who} ! Si vous avez un instant, votre avis sur Google nous aiderait beaucoup : ${url}`;
}

/**
 * Générateur de QR code avis Google : le commerçant colle son lien d'avis (ou
 * son Place ID), choisit le format et la couleur, puis télécharge le QR code
 * (PNG / SVG) ou l'affiche (PNG / impression). Il peut aussi envoyer le lien à
 * un client par SMS, WhatsApp ou e-mail. Tout est calculé dans le navigateur.
 */
export function QrTool({
  standPrice,
  shippingLabel,
  productPath,
}: {
  standPrice: string;
  shippingLabel: string;
  productPath: string;
}) {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState(TITLES[0]);
  const [format, setFormat] = useState<PosterFormat>("affiche");
  const [colorId, setColorId] = useState<string>(POSTER_COLORS[0].id);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const color = POSTER_COLORS.find((c) => c.id === colorId) ?? POSTER_COLORS[0];
  const check = useMemo(() => checkLink(link), [link]);
  const url = check.ok ? check.url : null;
  const poster = useMemo(
    () =>
      url
        ? posterSvg({ url, title, name, format, color: color.value, soft: color.soft })
        : null,
    [url, title, name, format, color],
  );
  const fileBase = format === "carre" ? "qr-avis-google-carre" : "affiche-avis-google";

  const run = async (key: string, job: () => Promise<void> | void) => {
    setBusy(key);
    try {
      await job();
    } finally {
      setBusy(null);
    }
  };

  const downloadPoster = () =>
    run("poster", async () => {
      if (!poster) return;
      downloadBlob(await svgToPng(poster, 2000), `${fileBase}.png`);
    });
  const downloadPosterSvg = () =>
    run("poster-svg", () => {
      if (!poster) return;
      downloadBlob(new Blob([poster], { type: "image/svg+xml" }), `${fileBase}.svg`);
    });
  const downloadQrPng = () =>
    run("png", async () => {
      if (!url) return;
      downloadBlob(await svgToPng(qrOnlySvg(url), 1200), "qr-code-avis-google.png");
    });
  const downloadQrSvg = () =>
    run("svg", () => {
      if (!url) return;
      downloadBlob(new Blob([qrOnlySvg(url)], { type: "image/svg+xml" }), "qr-code-avis-google.svg");
    });

  const printPoster = () => {
    if (!poster) return;
    const w = window.open("", "_blank", "width=720,height=960");
    if (!w) return;
    const width = format === "carre" ? "90mm" : "120mm";
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>QR code avis Google</title>
<style>@page{size:A5;margin:10mm}html,body{margin:0;height:100%}body{display:grid;place-items:center}svg{width:${width};height:auto}</style>
</head><body>${poster}<script>window.onload=function(){window.focus();window.print();}<\/script></body></html>`);
    w.document.close();
  };

  const copyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible : rien à faire */
    }
  };

  const message = url ? shareMessage(url, name) : "";
  const showError = touched && !check.ok && link.trim() !== "";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
      {/* Formulaire */}
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <div>
          <label htmlFor="qr-link" className="text-sm font-semibold text-ink">
            Lien de votre page d&apos;avis Google
          </label>
          <div className="relative mt-2.5">
            <IconLink
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="qr-link"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://g.page/r/.../review ou votre Place ID"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showError || undefined}
              aria-describedby="qr-link-help"
              className={cn(field, "pl-11")}
            />
            {url && (
              <span className="pointer-events-none absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-brand text-white">
                <IconCheck size={14} strokeWidth={2.6} />
              </span>
            )}
          </div>
          <p id="qr-link-help" className="mt-2 text-xs leading-relaxed text-muted">
            Dans votre fiche Google Business Profile : « Demander des avis », puis
            copiez le lien. Un Place ID (ChIJ…) fonctionne aussi.{" "}
            <a href="#trouver-le-lien" className="font-medium text-brand hover:underline">
              Où le trouver ?
            </a>
          </p>
          {showError && !check.ok && (
            <p className="mt-2 text-sm font-medium text-red-600">{check.error}</p>
          )}
          {check.ok && !check.google && (
            <p className="mt-2 rounded-xl bg-accent-soft px-3 py-2 text-xs leading-relaxed text-ink">
              Ce lien ne ressemble pas à un lien Google. Le QR code fonctionnera,
              mais vérifiez qu&apos;il ouvre bien votre page d&apos;avis.
            </p>
          )}
        </div>

        <div className="mt-6">
          <div>
            <label htmlFor="qr-name" className="text-sm font-semibold text-ink">
              Nom de l&apos;établissement <span className="font-normal text-muted">(facultatif)</span>
            </label>
            <input
              id="qr-name"
              maxLength={40}
              placeholder="Ex. Boulangerie du Marché"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(field, "mt-2.5")}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Format</legend>
            <div className="mt-2.5 flex gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={format === f.id}
                  onClick={() => setFormat(f.id)}
                  title={f.hint}
                  className={cn(
                    "rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors",
                    format === f.id
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line bg-surface text-ink-soft hover:border-brand/40",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Couleur</legend>
            <div className="mt-2.5 flex gap-2">
              {POSTER_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={colorId === c.id}
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => setColorId(c.id)}
                  className={cn(
                    "h-9 w-9 rounded-full ring-offset-2 ring-offset-surface transition-shadow",
                    colorId === c.id ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40",
                  )}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6">
          <fieldset>
            <legend className="text-sm font-semibold text-ink">Titre</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {TITLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={title === t}
                  onClick={() => setTitle(t)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                    title === t
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line bg-surface text-ink-soft hover:border-brand/40",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Téléchargements */}
        <div className="mt-7 border-t border-line pt-6">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={downloadPoster}
              disabled={!poster || busy !== null}
              className={buttonClass("primary", "lg", "w-full")}
            >
              <IconDownload size={18} />
              {busy === "poster" ? "Préparation…" : format === "carre" ? "Carré (PNG)" : "Affiche (PNG)"}
            </button>
            <button
              type="button"
              onClick={printPoster}
              disabled={!poster}
              className={buttonClass("secondary", "lg", "w-full")}
            >
              <IconPrinter size={18} className="text-brand" />
              Imprimer
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <DlLink onClick={downloadPosterSvg} disabled={!poster || busy !== null}>
              {format === "carre" ? "Carré" : "Affiche"} en SVG
            </DlLink>
            <DlLink onClick={downloadQrPng} disabled={!url || busy !== null}>
              QR code seul (PNG)
            </DlLink>
            <DlLink onClick={downloadQrSvg} disabled={!url || busy !== null}>
              QR code seul (SVG)
            </DlLink>
          </div>
        </div>

        {/* Envoyer le lien à un client */}
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-sm font-semibold text-ink">Envoyer le lien à un client</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <ShareBtn disabled={!url} onClick={copyLink}>
              {copied ? <IconCheck size={16} /> : <IconLink size={16} />}
              {copied ? "Copié" : "Copier"}
            </ShareBtn>
            <ShareBtn disabled={!url} href={url ? `sms:?&body=${encodeURIComponent(message)}` : undefined}>
              <IconMessage size={16} /> SMS
            </ShareBtn>
            <ShareBtn disabled={!url} href={url ? `https://wa.me/?text=${encodeURIComponent(message)}` : undefined}>
              <IconWhatsapp size={16} /> WhatsApp
            </ShareBtn>
            <ShareBtn
              disabled={!url}
              href={url ? `mailto:?subject=${encodeURIComponent("Votre avis nous intéresse")}&body=${encodeURIComponent(message)}` : undefined}
            >
              <IconMail size={16} /> E-mail
            </ShareBtn>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              Tester mon lien
              <IconArrowRight size={15} />
            </a>
          )}
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <IconShield size={15} className="mt-px shrink-0 text-brand" />
            Gratuit et sans inscription. Votre lien reste dans votre navigateur :
            rien n&apos;est envoyé à nos serveurs.
          </p>
        </div>
      </div>

      {/* Aperçu + montée en gamme */}
      <div className="flex flex-col gap-5">
        <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
          <div className={cn("mx-auto w-full", format === "carre" ? "max-w-[300px]" : "max-w-[300px]")}>
            {poster ? (
              <div
                className="screen-in drop-shadow-[0_24px_40px_rgba(17,57,201,0.18)] [&>svg]:h-auto [&>svg]:w-full"
                // Contenu généré localement ; les textes saisis sont échappés.
                dangerouslySetInnerHTML={{ __html: poster }}
              />
            ) : (
              <div
                className={cn(
                  "flex w-full flex-col items-center justify-center rounded-[1.1rem] border-2 border-dashed border-line bg-surface px-6 text-center",
                  format === "carre" ? "aspect-square" : "aspect-[1000/1414]",
                )}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <IconLink size={26} />
                </span>
                <p className="mt-4 text-sm font-semibold text-ink">Votre aperçu apparaîtra ici</p>
                <p className="mt-1 text-xs text-muted">Collez votre lien d&apos;avis Google pour commencer.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-ink p-6 text-white">
          <p className="font-display text-lg font-semibold leading-snug">
            Encore plus simple : le présentoir NFC. Un contact du téléphone,
            sans ouvrir l&apos;appareil photo.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            NFC + QR code, lien modifiable sans réimprimer, statistiques de
            scans. {standPrice}, {shippingLabel.toLowerCase()}.
          </p>
          <Link href={productPath} className={buttonClass("primary", "md", "mt-5 border-transparent")}>
            Découvrir le présentoir
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function DlLink({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
    >
      <IconDownload size={15} />
      {children}
    </button>
  );
}

function ShareBtn({
  href,
  onClick,
  disabled,
  children,
}: {
  href?: string;
  onClick?: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand";
  if (disabled) {
    return (
      <span aria-disabled className={cn(cls, "cursor-not-allowed opacity-45 hover:border-line hover:text-ink")}>
        {children}
      </span>
    );
  }
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
