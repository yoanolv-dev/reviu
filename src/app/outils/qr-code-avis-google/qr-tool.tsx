"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import {
  IconArrowRight,
  IconDownload,
  IconLink,
  IconNfc,
  IconPrinter,
  IconShield,
} from "@/components/ui/icons";
import {
  checkLink,
  downloadBlob,
  posterSvg,
  qrOnlySvg,
  svgToPng,
} from "@/lib/qr-poster";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--color-brand-soft)]";

const TITLES = [
  "Votre avis compte !",
  "Vous avez aimé ?",
  "Un avis, ça nous aide !",
];

/**
 * Générateur de QR code avis Google : le commerçant colle son lien d'avis,
 * personnalise l'affiche, puis télécharge le QR (PNG / SVG) ou l'affiche
 * (PNG / impression). Tout est calculé dans le navigateur.
 */
export function QrTool({
  standPrice,
  shippingLabel,
}: {
  standPrice: string;
  shippingLabel: string;
}) {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState(TITLES[0]);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const check = useMemo(() => checkLink(link), [link]);
  const url = check.ok ? check.url : null;
  const poster = useMemo(
    () => (url ? posterSvg({ url, title, name }) : null),
    [url, title, name],
  );

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
      downloadBlob(await svgToPng(poster, 2000), "affiche-avis-google.png");
    });

  const downloadQrPng = () =>
    run("png", async () => {
      if (!url) return;
      downloadBlob(await svgToPng(qrOnlySvg(url), 1200), "qr-code-avis-google.png");
    });

  const downloadQrSvg = () =>
    run("svg", () => {
      if (!url) return;
      downloadBlob(
        new Blob([qrOnlySvg(url)], { type: "image/svg+xml" }),
        "qr-code-avis-google.svg",
      );
    });

  const printPoster = () => {
    if (!poster) return;
    const w = window.open("", "_blank", "width=720,height=960");
    if (!w) return;
    w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Affiche avis Google</title>
<style>@page{size:A5;margin:10mm}html,body{margin:0;height:100%}body{display:grid;place-items:center}svg{width:120mm;height:auto}</style>
</head><body>${poster}<script>window.onload=function(){window.focus();window.print();}<\/script></body></html>`);
    w.document.close();
  };

  const showError = touched && !check.ok && link.trim() !== "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      {/* Formulaire */}
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-7">
        <ol className="flex flex-col gap-6">
          <li>
            <label htmlFor="qr-link" className="flex items-center gap-2.5 text-sm font-semibold text-ink">
              <StepDot n={1} />
              Collez le lien de votre page d&apos;avis Google
            </label>
            <div className="relative mt-3">
              <IconLink
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="qr-link"
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="https://g.page/r/.../review"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onBlur={() => setTouched(true)}
                aria-invalid={showError || undefined}
                aria-describedby="qr-link-help"
                className={cn(field, "pl-11")}
              />
            </div>
            <p id="qr-link-help" className="mt-2 text-xs leading-relaxed text-muted">
              Dans votre fiche Google Business Profile : « Demander des avis »,
              puis copiez le lien.{" "}
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
          </li>

          <li>
            <label htmlFor="qr-name" className="flex items-center gap-2.5 text-sm font-semibold text-ink">
              <StepDot n={2} />
              Nom de votre établissement{" "}
              <span className="font-normal text-muted">(facultatif)</span>
            </label>
            <input
              id="qr-name"
              maxLength={40}
              placeholder="Ex. Boulangerie du Marché"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(field, "mt-3")}
            />
          </li>

          <li>
            <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
              <StepDot n={3} />
              Titre de l&apos;affiche
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Titre de l'affiche">
              {TITLES.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={title === t}
                  onClick={() => setTitle(t)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    title === t
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line bg-surface text-ink-soft hover:border-brand/40",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </li>
        </ol>

        <div className="mt-7 border-t border-line pt-6">
          <p className="text-sm font-semibold text-ink">Télécharger</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={downloadPoster}
              disabled={!poster || busy !== null}
              className={buttonClass("primary", "lg", "w-full")}
            >
              <IconDownload size={18} />
              {busy === "poster" ? "Préparation…" : "Affiche (PNG)"}
            </button>
            <button
              type="button"
              onClick={printPoster}
              disabled={!poster}
              className={buttonClass("secondary", "lg", "w-full")}
            >
              <IconPrinter size={18} className="text-brand" />
              Imprimer l&apos;affiche
            </button>
            <button
              type="button"
              onClick={downloadQrPng}
              disabled={!url || busy !== null}
              className={buttonClass("secondary", "lg", "w-full")}
            >
              <IconDownload size={18} className="text-brand" />
              {busy === "png" ? "Préparation…" : "QR code seul (PNG)"}
            </button>
            <button
              type="button"
              onClick={downloadQrSvg}
              disabled={!url || busy !== null}
              className={buttonClass("secondary", "lg", "w-full")}
            >
              <IconDownload size={18} className="text-brand" />
              QR code seul (SVG)
            </button>
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

      {/* Aperçu */}
      <div className="flex flex-col gap-5">
        <div className="relative rounded-3xl border border-line bg-canvas p-5 sm:p-8">
          <span className="absolute left-5 top-5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted shadow-[var(--shadow-soft)]">
            Aperçu
          </span>
          <div className="mx-auto w-full max-w-[320px] pt-6">
            {poster ? (
              <div
                className="screen-in drop-shadow-[0_24px_40px_rgba(17,57,201,0.18)] [&>svg]:h-auto [&>svg]:w-full"
                // Contenu généré localement ; les textes saisis sont échappés.
                dangerouslySetInnerHTML={{ __html: poster }}
              />
            ) : (
              <div className="flex aspect-[1000/1414] w-full flex-col items-center justify-center rounded-[1.1rem] border-2 border-dashed border-line bg-surface px-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <IconLink size={26} />
                </span>
                <p className="mt-4 text-sm font-semibold text-ink">
                  Votre affiche apparaîtra ici
                </p>
                <p className="mt-1 text-xs text-muted">
                  Collez votre lien d&apos;avis Google pour la générer.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Montée en gamme : le présentoir NFC */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-ink p-6 text-white">
          <span
            aria-hidden
            className="absolute -right-12 -top-16 -z-10 h-48 w-48 rounded-full bg-brand opacity-60 blur-3xl"
          />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-white/15">
            <IconNfc size={13} /> Encore plus simple
          </span>
          <p className="mt-3 font-display text-lg font-semibold leading-snug">
            Le présentoir NFC : un simple contact du téléphone, sans ouvrir
            l&apos;appareil photo.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            NFC + QR code, lien modifiable sans réimprimer, statistiques de scans.{" "}
            {standPrice}, {shippingLabel.toLowerCase()}.
          </p>
          <Link
            href="/#produits"
            className={buttonClass("primary", "md", "mt-5 border-transparent")}
          >
            Découvrir le présentoir
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepDot({ n }: { n: number }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white">
      {n}
    </span>
  );
}
