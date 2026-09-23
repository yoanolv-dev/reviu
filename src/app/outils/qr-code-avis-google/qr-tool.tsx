"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import {
  IconCheck,
  IconDownload,
  IconLink,
  IconMail,
  IconMessage,
  IconPrinter,
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

const labelCls = "text-[13px] font-semibold text-ink";

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
export function QrTool() {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState(TITLES[0]);
  const [format, setFormat] = useState<PosterFormat>("affiche");
  const [colorId, setColorId] = useState<string>(POSTER_COLORS[0].id);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sur ordinateur, le curseur est déjà dans le champ : il n'y a qu'à coller.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

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
  // Tant qu'aucun lien n'est saisi, on montre un exemple estompé du rendu.
  const preview =
    poster ??
    posterSvg({
      url: "https://reviu.fr",
      title,
      name: name || "Votre établissement",
      format,
      color: color.value,
      soft: color.soft,
    });

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-lift)]">
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Réglages */}
        <div className="flex flex-col p-5 sm:p-7 xl:p-8">
          {/* 1. Le lien : l'action principale, mise en avant */}
          <label htmlFor="qr-link" className="text-[15px] font-semibold text-ink">
            Collez le lien de votre page d&apos;avis Google
          </label>
          <div className="relative mt-3">
            <IconLink
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              ref={inputRef}
              id="qr-link"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://g.page/r/.../review"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showError || undefined}
              aria-describedby="qr-link-help"
              className={cn(
                field,
                "h-14 pl-12 pr-12 text-base",
                url && "border-brand/50",
              )}
            />
            {url && (
              <span className="pointer-events-none absolute right-3.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-brand text-white">
                <IconCheck size={14} strokeWidth={2.6} />
              </span>
            )}
          </div>
          <p id="qr-link-help" className="mt-2 text-[13px] text-muted">
            {showError && !check.ok ? (
              <span className="font-medium text-red-600">{check.error}</span>
            ) : check.ok && !check.google ? (
              <span className="text-ink-soft">
                Ce lien ne ressemble pas à un lien Google : vérifiez qu&apos;il
                ouvre bien votre page d&apos;avis.
              </span>
            ) : (
              <>
                Fiche Google, bouton « Demander des avis ». Place ID accepté.{" "}
                <a href="#trouver-le-lien" className="font-medium text-brand hover:underline">
                  Où le trouver ?
                </a>
              </>
            )}
          </p>

          {/* Mobile : téléchargement direct dès que le lien est valide. */}
          {poster && (
            <button
              type="button"
              onClick={downloadPoster}
              disabled={busy !== null}
              className={buttonClass("primary", "lg", "mt-4 w-full lg:hidden")}
            >
              <IconDownload size={18} />
              {busy === "poster" ? "Préparation…" : "Télécharger l'affiche"}
            </button>
          )}

          {/* 2. Personnalisation, compacte */}
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
            <div className="col-span-2">
              <label htmlFor="qr-name" className={labelCls}>
                Nom affiché <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <input
                id="qr-name"
                maxLength={40}
                placeholder="Ex. Boulangerie du Marché"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(field, "mt-2 h-11 py-2")}
              />
            </div>
            <fieldset>
              <legend className={labelCls}>Format</legend>
              <div className="mt-2 inline-flex rounded-xl bg-canvas p-1 ring-1 ring-line">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={format === f.id}
                    onClick={() => setFormat(f.id)}
                    title={f.hint}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                      format === f.id
                        ? "bg-surface text-ink shadow-[0_1px_3px_rgba(10,13,22,0.12)]"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className={labelCls}>Couleur</legend>
              <div className="mt-2 flex h-[38px] items-center gap-2.5">
                {POSTER_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={colorId === c.id}
                    aria-label={c.label}
                    title={c.label}
                    onClick={() => setColorId(c.id)}
                    className={cn(
                      "h-7 w-7 rounded-full ring-offset-2 ring-offset-surface transition-shadow",
                      colorId === c.id ? "ring-2 ring-ink" : "hover:ring-2 hover:ring-line",
                    )}
                    style={{ background: c.value }}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset className="col-span-2">
              <legend className={labelCls}>Titre</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {TITLES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={title === t}
                    onClick={() => setTitle(t)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-[13px] font-medium ring-1 transition-colors",
                      title === t
                        ? "bg-brand-soft text-brand ring-brand/40"
                        : "text-ink-soft ring-line hover:ring-brand/40",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* 3. Partager le lien (secondaire) */}
          <div className="min-h-6 flex-1" />
          <div className="border-t border-line pt-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-[13px] font-semibold text-ink">Envoyer à un client</span>
              <div className="flex flex-wrap gap-1.5">
                <ShareBtn disabled={!url} onClick={copyLink} label="Copier le lien">
                  {copied ? <IconCheck size={16} /> : <IconLink size={16} />}
                  <span>{copied ? "Copié" : "Copier"}</span>
                </ShareBtn>
                <ShareBtn disabled={!url} href={url ? `sms:?&body=${encodeURIComponent(message)}` : undefined} label="Envoyer par SMS">
                  <IconMessage size={16} /> <span>SMS</span>
                </ShareBtn>
                <ShareBtn disabled={!url} href={url ? `https://wa.me/?text=${encodeURIComponent(message)}` : undefined} label="Envoyer par WhatsApp">
                  <IconWhatsapp size={16} /> <span>WhatsApp</span>
                </ShareBtn>
                <ShareBtn
                  disabled={!url}
                  href={url ? `mailto:?subject=${encodeURIComponent("Votre avis nous intéresse")}&body=${encodeURIComponent(message)}` : undefined}
                  label="Envoyer par e-mail"
                >
                  <IconMail size={16} /> <span>E-mail</span>
                </ShareBtn>
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu + téléchargement, toujours visibles côte à côte */}
        <div className="flex flex-col items-center justify-center border-t border-line bg-canvas p-5 sm:p-7 lg:border-l lg:border-t-0 xl:p-8">
          <div className={cn("relative w-full", format === "carre" ? "max-w-[250px]" : "max-w-[236px]")}>
            <div
              key={`${format}-${Boolean(poster)}`}
              className={cn(
                "screen-in drop-shadow-[0_18px_30px_rgba(17,57,201,0.16)] transition-opacity [&>svg]:h-auto [&>svg]:w-full",
                !poster && "opacity-35 grayscale",
              )}
              aria-hidden={!poster}
              // Contenu généré localement ; les textes saisis sont échappés.
              dangerouslySetInnerHTML={{ __html: preview }}
            />
            {!poster && (
              <span className="absolute inset-0 grid place-items-center">
                <span className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg">
                  Aperçu
                </span>
              </span>
            )}
          </div>

          <div className="mt-6 w-full">
            <button
              type="button"
              onClick={downloadPoster}
              disabled={!poster || busy !== null}
              className={buttonClass("primary", "lg", "w-full")}
            >
              <IconDownload size={18} />
              {busy === "poster" ? "Préparation…" : "Télécharger (PNG)"}
            </button>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-[13px]">
              <DlLink onClick={printPoster} disabled={!poster} icon={<IconPrinter size={14} />}>
                Imprimer
              </DlLink>
              <DlLink onClick={downloadPosterSvg} disabled={!poster || busy !== null}>
                SVG
              </DlLink>
              <span className="inline-flex items-center gap-1.5 text-muted">
                QR seul
                <DlLink onClick={downloadQrPng} disabled={!url || busy !== null} icon={null}>
                  PNG
                </DlLink>
                <DlLink onClick={downloadQrSvg} disabled={!url || busy !== null} icon={null}>
                  SVG
                </DlLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DlLink({
  onClick,
  disabled,
  icon,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 font-medium text-ink-soft transition-colors hover:text-brand disabled:cursor-not-allowed disabled:text-muted/60"
    >
      {icon === undefined ? <IconDownload size={14} /> : icon}
      {children}
    </button>
  );
}

function ShareBtn({
  href,
  onClick,
  disabled,
  label,
  children,
}: {
  href?: string;
  onClick?: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[13px] font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand";
  if (disabled) {
    return (
      <span aria-disabled title={label} className={cn(cls, "cursor-not-allowed opacity-40 hover:border-line hover:text-ink")}>
        {children}
      </span>
    );
  }
  if (href) {
    return (
      <a href={href} title={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} title={label} className={cls}>
      {children}
    </button>
  );
}
