"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import {
  IconCheck,
  IconChevronDown as IconChevron,
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
  const [custOpen, setCustOpen] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [canPaste, setCanPaste] = useState(false);

  // Capacités du navigateur (partage natif sur mobile, lecture du presse-papiers).
  useEffect(() => {
    const t = window.setTimeout(() => {
      setCanShare(typeof navigator.share === "function" && window.matchMedia("(max-width: 1023px)").matches);
      setCanPaste(typeof navigator.clipboard?.readText === "function");
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

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

  const pasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setLink(text.trim());
        setTouched(true);
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  const nativeShare = async () => {
    if (!url) return;
    try {
      await navigator.share({ text: message });
    } catch {
      /* partage annulé */
    }
  };
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

  const shareRow = (
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
  );

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-lift)]">
      {/* Mobile : lien, aperçu + télécharger, personnalisation (repliée),
          partage. Desktop : réglages à gauche, aperçu à droite sur 3 rangées. */}
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-[auto_auto_1fr] xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* 1. Le lien */}
        <div className="p-4 max-lg:text-center sm:p-7 sm:pb-4 lg:col-start-1 lg:row-start-1 xl:p-8 xl:pb-4">
          <label htmlFor="qr-link" className="text-[15px] font-semibold text-ink max-lg:sr-only">
            Collez le lien de votre page d&apos;avis Google
          </label>
          <div className="relative lg:mt-3">
            <IconLink
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted max-lg:hidden"
            />
            <input
              ref={inputRef}
              id="qr-link"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="Votre lien d'avis Google"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={showError || undefined}
              aria-describedby="qr-link-help"
              className={cn(field, "h-14 pr-24 text-base max-lg:pl-4 lg:pl-12", url && "border-brand/50 pr-12")}
            />
            {url ? (
              <span className="pointer-events-none absolute right-3.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-brand text-white">
                <IconCheck size={14} strokeWidth={2.6} />
              </span>
            ) : (
              canPaste && (
                <button
                  type="button"
                  onClick={pasteLink}
                  className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
                >
                  Coller
                </button>
              )
            )}
          </div>
          <p id="qr-link-help" className="mt-2.5 text-[13px] text-muted">
            {showError && !check.ok ? (
              <span className="font-medium text-red-600">{check.error}</span>
            ) : check.ok && !check.google ? (
              <span className="text-ink-soft">
                Ce lien ne ressemble pas à un lien Google : vérifiez qu&apos;il
                ouvre bien votre page d&apos;avis.
              </span>
            ) : poster ? (
              <span className="lg:hidden" />
            ) : (
              <>
                <span className="max-lg:hidden">
                  Fiche Google, bouton « Demander des avis ». Place ID accepté.{" "}
                </span>
                <a href="#trouver-le-lien" className="font-medium text-brand hover:underline">
                  <span className="lg:hidden">Où trouver mon lien ?</span>
                  <span className="max-lg:hidden">Où le trouver ?</span>
                </a>
              </>
            )}
          </p>
        </div>

        {/* 2. Aperçu + téléchargement */}
        <div
          className={cn(
            "flex flex-col items-center justify-center border-line bg-canvas p-5 sm:p-7 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:flex lg:border-l xl:p-8",
            // Sur mobile, l'aperçu n'apparaît qu'une fois le lien valide.
            poster ? "max-lg:border-t max-lg:px-4 max-lg:pb-5 max-lg:pt-6" : "max-lg:hidden",
          )}
        >
          <div className={cn("relative w-full", format === "carre" ? "max-w-[250px]" : "max-w-[220px] lg:max-w-[236px]")}>
            <div
              key={`${format}-${Boolean(poster)}`}
              className={cn(
                "screen-in drop-shadow-[0_18px_30px_rgba(17,57,201,0.16)] [&>svg]:h-auto [&>svg]:w-full",
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

          <div className="mt-6 w-full max-w-sm">
            <button
              type="button"
              onClick={downloadPoster}
              disabled={!poster || busy !== null}
              className={buttonClass("primary", "lg", "h-14 w-full text-base lg:h-12 lg:text-[15px]")}
            >
              <IconDownload size={18} />
              {busy === "poster" ? "Préparation…" : (
                <>
                  <span className="lg:hidden">Télécharger</span>
                  <span className="max-lg:hidden">Télécharger (PNG)</span>
                </>
              )}
            </button>
            {canShare && url && (
              <button
                type="button"
                onClick={nativeShare}
                className={buttonClass("secondary", "lg", "mt-2.5 h-14 w-full text-base lg:hidden")}
              >
                <IconMessage size={18} className="text-brand" />
                Envoyer à un client
              </button>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-[13px] max-lg:hidden">
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

        {/* 3. Personnalisation (repliée sur mobile) */}
        <div
          className={cn(
            "px-4 sm:px-7 lg:col-start-1 lg:row-start-2 xl:px-8",
            !poster && "max-lg:hidden",
          )}
        >
          <button
            type="button"
            onClick={() => setCustOpen((v) => !v)}
            aria-expanded={custOpen}
            className="mx-auto flex items-center gap-1.5 py-4 text-sm font-semibold text-brand lg:hidden"
          >
            Personnaliser
            <IconChevron className={cn("transition-transform", custOpen && "rotate-180")} />
          </button>
          <div
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-5 pb-5 max-lg:justify-items-center max-lg:text-center lg:mt-2 lg:border-t lg:border-line lg:pt-5",
              !custOpen && "max-lg:hidden",
            )}
          >
            <div className="col-span-2 w-full">
              <label htmlFor="qr-name" className={labelCls}>
                Nom affiché <span className="font-normal text-muted max-lg:hidden">(facultatif)</span>
              </label>
              <input
                id="qr-name"
                maxLength={40}
                placeholder="Ex. Boulangerie du Marché"
              enterKeyHint="done"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(field, "mt-2 h-11 py-2")}
              />
            </div>
            <fieldset className="max-sm:col-span-2">
              <legend className={cn(labelCls, "max-lg:mx-auto")}>Format</legend>
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
            <fieldset className="max-sm:col-span-2">
              <legend className={cn(labelCls, "max-lg:mx-auto")}>Couleur</legend>
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
            <fieldset className="col-span-2 w-full">
              <legend className={cn(labelCls, "max-lg:mx-auto")}>Titre</legend>
              <div className="mt-2 flex flex-wrap gap-2 max-lg:justify-center">
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
        </div>

        {/* 4. Envoyer à un client (desktop, ou mobile sans partage natif) */}
        <div
          className={cn(
            "px-5 pb-5 sm:px-7 sm:pb-7 lg:col-start-1 lg:row-start-3 lg:flex lg:items-end xl:px-8 xl:pb-8",
            (canShare || !url) && "max-lg:hidden",
          )}
        >
          <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-5 max-lg:justify-center">
            <span className="text-[13px] font-semibold text-ink">Envoyer à un client</span>
            {shareRow}
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
