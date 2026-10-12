"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import {
  IconCheck,
  IconLink,
  IconMail,
  IconMessage,
  IconRefresh,
  IconWhatsapp,
} from "@/components/ui/icons";
import { checkLink } from "@/lib/review-link";
import {
  CHANNELS,
  REQUEST_TRADES,
  REQUEST_VARIANTS,
  buildRequest,
  type Channel,
  type Formality,
} from "@/lib/review-requests";
import { QR_TOOL_PATH } from "@/lib/brand";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--color-brand-soft)]";
const labelCls = "text-[13px] font-semibold text-ink";

/**
 * Générateur de message de demande d'avis : canal (SMS, WhatsApp, e-mail),
 * vouvoiement ou tutoiement, activité, nom et lien d'avis. Le message se
 * compose en direct ; on peut le copier ou l'ouvrir dans l'application
 * correspondante. Tout reste dans le navigateur.
 */
export function RequestTool() {
  const [channel, setChannel] = useState<Channel>("sms");
  const [formality, setFormality] = useState<Formality>("vous");
  const [tradeId, setTradeId] = useState(REQUEST_TRADES[0].id);
  const [establishment, setEstablishment] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);
  const tracked = useRef(false);

  const check = useMemo(() => checkLink(link), [link]);
  const url = check.ok ? check.url : "";
  const trade = REQUEST_TRADES.find((t) => t.id === tradeId) ?? REQUEST_TRADES[0];
  const msg = buildRequest({ channel, formality, trade, name, establishment, link: url, variant });
  const full = msg.subject ? `Objet : ${msg.subject}\n\n${msg.body}` : msg.body;

  const touch = () => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("tool_use", { tool: "review_request" });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      trackEvent("tool_copy", { tool: "review_request", channel });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible : le texte reste sélectionnable */
    }
  };

  const sendHref =
    channel === "sms"
      ? `sms:?&body=${encodeURIComponent(msg.body)}`
      : channel === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(msg.body)}`
        : `mailto:?subject=${encodeURIComponent(msg.subject ?? "")}&body=${encodeURIComponent(msg.body)}`;
  const SendIcon = channel === "sms" ? IconMessage : channel === "whatsapp" ? IconWhatsapp : IconMail;
  const linkError = link.trim() !== "" && !check.ok ? check.error : null;
  const notGoogle = check.ok && !check.google;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-lift)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Réglages */}
        <div className="grid content-start gap-5 p-5 sm:p-8">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
            <fieldset>
              <legend className={labelCls}>Canal</legend>
              <Segmented
                options={CHANNELS}
                value={channel}
                onChange={(v) => {
                  setChannel(v);
                  setVariant(0);
                  touch();
                }}
              />
            </fieldset>
            <fieldset>
              <legend className={labelCls}>Ton</legend>
              <Segmented
                options={[
                  { id: "vous" as const, label: "Vouvoiement" },
                  { id: "tu" as const, label: "Tutoiement" },
                ]}
                value={formality}
                onChange={(v) => {
                  setFormality(v);
                  touch();
                }}
              />
            </fieldset>
          </div>

          <div>
            <label htmlFor="rq-link" className={labelCls}>
              Votre lien d&apos;avis Google
            </label>
            <div className="relative mt-2">
              <IconLink size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="rq-link"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder="Collez le lien ou le Place ID"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  touch();
                }}
                aria-invalid={Boolean(linkError) || undefined}
                aria-describedby="rq-link-help"
                className={cn(field, "h-11 pl-10", url && "border-brand/50")}
              />
            </div>
            <p id="rq-link-help" className="mt-1.5 text-xs text-muted">
              {linkError ? (
                <span className="font-medium text-red-600">{linkError}</span>
              ) : notGoogle ? (
                "Ce lien ne ressemble pas à un lien Google : vérifiez qu'il ouvre bien votre page d'avis."
              ) : (
                <>
                  Fiche Google, « Recevoir plus d&apos;avis ».{" "}
                  <Link href="/guides/lien-avis-google" className="font-medium text-brand hover:underline">
                    Où le trouver ?
                  </Link>
                </>
              )}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rq-trade" className={labelCls}>Votre activité</label>
              <select
                id="rq-trade"
                value={tradeId}
                onChange={(e) => {
                  setTradeId(e.target.value);
                  touch();
                }}
                className={cn(field, "mt-2 h-11 py-0")}
              >
                {REQUEST_TRADES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rq-est" className={labelCls}>Nom de l&apos;établissement</label>
              <input
                id="rq-est"
                maxLength={60}
                autoComplete="off"
                placeholder="Ex. Boulangerie du Marché"
                value={establishment}
                onChange={(e) => {
                  setEstablishment(e.target.value);
                  touch();
                }}
                className={cn(field, "mt-2 h-11")}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="rq-name" className={labelCls}>
                Prénom du client <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <input
                id="rq-name"
                maxLength={40}
                autoComplete="off"
                placeholder="Ex. Camille"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  touch();
                }}
                className={cn(field, "mt-2 h-11")}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col border-line bg-canvas p-5 max-lg:border-t sm:p-8 lg:border-l">
          <div className="flex items-baseline justify-between gap-3">
            <p className={labelCls}>Votre message</p>
            {channel === "sms" && (
              <p className={cn("text-xs", msg.body.length > 160 ? "text-ink-soft" : "text-muted")}>
                {msg.body.length} caractères{msg.body.length > 160 ? " (2 SMS)" : ""}
              </p>
            )}
          </div>
          <div className="mt-3 flex-1 rounded-2xl border border-line bg-surface p-5 text-[15px] leading-relaxed text-ink" aria-live="polite">
            {msg.subject && (
              <p className="mb-3 border-b border-line pb-3 text-sm">
                <span className="text-muted">Objet : </span>
                <strong className="font-semibold">{msg.subject}</strong>
              </p>
            )}
            <p className="whitespace-pre-line break-words">{msg.body}</p>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-[1fr_auto_auto]">
            <button type="button" onClick={copy} className={buttonClass("primary", "lg")}>
              {copied ? <IconCheck size={18} /> : null}
              {copied ? "Copié" : "Copier"}
            </button>
            <a
              href={sendHref}
              target={channel === "whatsapp" ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => trackEvent("tool_send", { tool: "review_request", channel })}
              className={buttonClass("secondary", "lg")}
            >
              <SendIcon size={17} className="text-brand" />
              Envoyer
            </a>
            <button
              type="button"
              onClick={() => {
                setVariant((v) => (v + 1) % REQUEST_VARIANTS);
                touch();
              }}
              className={buttonClass("secondary", "lg")}
              aria-label="Autre version du message"
            >
              <IconRefresh size={17} className="text-brand" />
              <span className="sm:sr-only lg:not-sr-only">Autre version</span>
            </button>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Le même message pour tous vos clients, sans contrepartie : c&apos;est
            la règle de Google. Besoin d&apos;un support au comptoir ?{" "}
            <Link href={QR_TOOL_PATH} className="font-medium text-brand hover:underline">
              Créez votre QR code
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-2 inline-flex rounded-xl bg-canvas p-1 ring-1 ring-line">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === o.id
              ? "bg-surface text-ink shadow-[0_1px_3px_rgba(10,13,22,0.12)]"
              : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
