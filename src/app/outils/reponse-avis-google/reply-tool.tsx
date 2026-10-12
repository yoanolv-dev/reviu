"use client";

import { useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { IconCheck, IconRefresh } from "@/components/ui/icons";
import {
  REPLY_KINDS,
  REPLY_TRADES,
  VARIANTS_PER_KIND,
  buildReply,
  type ReplyKind,
} from "@/lib/review-replies";
import { trackEvent } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-brand focus:shadow-[0_0_0_4px_var(--color-brand-soft)]";
const labelCls = "text-[13px] font-semibold text-ink";

const TIPS: Record<ReplyKind, string> = {
  positif:
    "Personnalisez au moins un détail (un plat, un soin, un prénom de l'équipe) : une réponse copiée-collée se repère tout de suite.",
  "sans-texte":
    "Une réponse courte suffit. Elle montre aux futurs clients que vous lisez chaque avis.",
  "quatre-etoiles":
    "Remerciez d'abord, puis montrez que la remarque est entendue : c'est souvent ce client qui reviendra mettre 5 étoiles.",
  mitige:
    "Restez factuel et ouvert. Évitez de contester point par point : proposez plutôt d'en parler.",
  negatif:
    "Laissez passer la colère avant de publier, ne vous justifiez pas en public et ne donnez aucun détail sur le client. Proposez un contact direct.",
  injuste:
    "Ne l'accusez pas de mentir. Si l'avis enfreint les règles de Google (faux, injurieux, conflit d'intérêts), signalez-le aussi depuis votre fiche.",
};

const NEEDS_POINT: ReplyKind[] = ["positif"];
const NEEDS_ISSUE: ReplyKind[] = ["quatre-etoiles", "mitige", "negatif", "injuste"];
const NEEDS_CONTACT: ReplyKind[] = ["mitige", "negatif", "injuste"];

/**
 * Générateur de réponses aux avis Google : type d'avis, métier, quelques
 * détails facultatifs, et la réponse se compose en direct. « Autre version »
 * fait tourner les variantes. Rien ne quitte le navigateur.
 */
export function ReplyTool() {
  const [kind, setKind] = useState<ReplyKind>("positif");
  const [tradeId, setTradeId] = useState(REPLY_TRADES[0].id);
  const [name, setName] = useState("");
  const [establishment, setEstablishment] = useState("");
  const [signature, setSignature] = useState("");
  const [point, setPoint] = useState("");
  const [issue, setIssue] = useState("");
  const [contact, setContact] = useState("");
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);
  const tracked = useRef(false);

  const trade = REPLY_TRADES.find((t) => t.id === tradeId) ?? REPLY_TRADES[0];
  const paragraphs = buildReply({
    kind,
    trade,
    name,
    establishment,
    signature,
    point: NEEDS_POINT.includes(kind) ? point : "",
    issue: NEEDS_ISSUE.includes(kind) ? issue : "",
    contact: NEEDS_CONTACT.includes(kind) ? contact : "",
    variant,
  });
  const text = paragraphs.join("\n\n");

  const touch = () => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("tool_use", { tool: "review_reply" });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackEvent("tool_copy", { tool: "review_reply", kind });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible : le texte reste sélectionnable */
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[var(--shadow-lift)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Réglages */}
        <div className="grid content-start gap-5 p-5 sm:p-8">
          <fieldset>
            <legend className={labelCls}>Type d&apos;avis</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {REPLY_KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  aria-pressed={kind === k.id}
                  onClick={() => {
                    setKind(k.id);
                    setVariant(0);
                    touch();
                  }}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-left ring-1 transition-colors",
                    kind === k.id
                      ? "bg-brand-soft ring-brand/40"
                      : "ring-line hover:ring-brand/40",
                  )}
                >
                  <span className={cn("block text-[13px] font-semibold", kind === k.id ? "text-brand" : "text-ink")}>
                    {k.label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{k.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rp-trade" className={labelCls}>Votre activité</label>
              <select
                id="rp-trade"
                value={tradeId}
                onChange={(e) => {
                  setTradeId(e.target.value);
                  touch();
                }}
                className={cn(field, "mt-2 h-11 py-0")}
              >
                {REPLY_TRADES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Input id="rp-name" label="Prénom du client" value={name} onChange={setName} placeholder="Ex. Camille" onTouch={touch} />
            <Input id="rp-est" label="Nom de l'établissement" value={establishment} onChange={setEstablishment} placeholder="Ex. Le Petit Bistrot" onTouch={touch} />
            <Input id="rp-sign" label="Signature" value={signature} onChange={setSignature} placeholder="Ex. Julie, gérante" onTouch={touch} />
            {NEEDS_POINT.includes(kind) && (
              <Input id="rp-point" label="Ce qui a plu" value={point} onChange={setPoint} placeholder="Ex. l'accueil, le risotto" onTouch={touch} wide />
            )}
            {NEEDS_ISSUE.includes(kind) && (
              <Input id="rp-issue" label="Le point soulevé" value={issue} onChange={setIssue} placeholder="Ex. l'attente au moment du service" onTouch={touch} wide />
            )}
            {NEEDS_CONTACT.includes(kind) && (
              <Input id="rp-contact" label="Téléphone ou e-mail de contact" value={contact} onChange={setContact} placeholder="Ex. 04 66 00 00 00" onTouch={touch} wide />
            )}
          </div>
          <p className="text-xs text-muted">Tous les champs sont facultatifs.</p>
        </div>

        {/* Réponse */}
        <div className="flex flex-col border-line bg-canvas p-5 max-lg:border-t sm:p-8 lg:border-l">
          <p className={labelCls}>Votre réponse</p>
          <div
            className="mt-3 flex-1 rounded-2xl border border-line bg-surface p-5 text-[15px] leading-relaxed text-ink"
            aria-live="polite"
          >
            {paragraphs.map((p, i) => (
              <p key={i} className={cn(i > 0 && "mt-3")}>{p}</p>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button type="button" onClick={copy} className={buttonClass("primary", "lg", "flex-1")}>
              {copied ? <IconCheck size={18} /> : null}
              {copied ? "Copiée" : "Copier la réponse"}
            </button>
            <button
              type="button"
              onClick={() => {
                setVariant((v) => (v + 1) % VARIANTS_PER_KIND);
                touch();
              }}
              className={buttonClass("secondary", "lg")}
            >
              <IconRefresh size={17} className="text-brand" />
              Autre version
            </button>
          </div>
          <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-[13px] leading-relaxed text-ink-soft ring-1 ring-line">
            <strong className="text-ink">Conseil : </strong>
            {TIPS[kind]}
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  onTouch,
  wide = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onTouch: () => void;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <input
        id={id}
        value={value}
        maxLength={80}
        autoComplete="off"
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          onTouch();
        }}
        className={cn(field, "mt-2 h-11")}
      />
    </div>
  );
}
