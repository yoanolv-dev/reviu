"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  adminSetStandLinkAction,
  adminUpdateEstablishmentAction,
} from "@/lib/admin-client-actions";
import {
  assignStandAction,
  deleteAccountAction,
  resendActivationAction,
  setAccountDisabledAction,
  type AdminActionState,
} from "@/lib/admin-actions";
import type { EstablishmentRow } from "@/lib/dashboard";
import type { ClientStand } from "@/lib/admin-data";
import { StatusBadge } from "@/components/dashboard/ui";
import { Field, TextArea } from "@/components/ui/field";

const btn =
  "h-9 rounded-full border border-line bg-surface px-4 text-xs font-medium text-ink transition-colors hover:bg-line-soft disabled:opacity-50";
const btnPrimary =
  "h-10 w-fit rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50";
const input =
  "h-9 min-w-0 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-brand";

export function Msg({ state }: { state: AdminActionState }) {
  if (!state) return null;
  if (state.error)
    return (
      <p role="alert" className="text-xs text-red-600">
        {state.error}
      </p>
    );
  if (state.info)
    return (
      <p aria-live="polite" className="text-xs text-emerald-600">
        {state.info}
      </p>
    );
  return null;
}

/** Actions rapides en tête de fiche. */
export function QuickActions({
  orgId,
  email,
  disabled,
}: {
  orgId: string;
  email: string | null;
  disabled: boolean;
}) {
  const [resend, resendAction, resendPending] = useActionState(resendActivationAction, null);
  const [dis, disAction, disPending] = useActionState(setAccountDisabledAction, null);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {email && (
          <form action={resendAction}>
            <input type="hidden" name="email" value={email} />
            <button type="submit" disabled={resendPending} className={btn}>
              {resendPending ? "…" : "Envoyer un code de connexion"}
            </button>
          </form>
        )}
        {email && (
          <a href={`mailto:${email}`} className={`${btn} inline-flex items-center`}>
            Écrire un e-mail
          </a>
        )}
        <form action={disAction}>
          <input type="hidden" name="org_id" value={orgId} />
          <input type="hidden" name="disabled" value={String(!disabled)} />
          <button type="submit" disabled={disPending} className={btn}>
            {disPending ? "…" : disabled ? "Réactiver le compte" : "Suspendre le compte"}
          </button>
        </form>
      </div>
      <Msg state={resend} />
      <Msg state={dis} />
    </div>
  );
}

/** Commerce du client, modifiable à distance. */
export function EstablishmentAdminForm({ est }: { est: EstablishmentRow }) {
  const [state, action, pending] = useActionState(adminUpdateEstablishmentAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={est.id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom du commerce" name="name" required defaultValue={est.name} />
        <Field
          label="Lien d'avis Google"
          name="google_review_url"
          defaultValue={est.google_review_url ?? ""}
          placeholder="https://g.page/r/…"
          hint="Tous les présentoirs sans lien propre redirigent ici."
        />
      </div>
      <TextArea
        label="Message d'accueil (mode « Page reviu »)"
        name="welcome_message"
        rows={2}
        defaultValue={est.welcome_message ?? ""}
      />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="scan_mode"
            value="direct"
            defaultChecked={est.scan_mode !== "page"}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          Accès direct Google
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="scan_mode"
            value="page"
            defaultChecked={est.scan_mode === "page"}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          Page reviu
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="feedback_enabled"
            defaultChecked={est.feedback_enabled}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          Retour privé
        </label>
      </div>
      <Msg state={state} />
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Enregistrement…" : "Enregistrer le commerce"}
      </button>
    </form>
  );
}

/** Un présentoir du client : chiffres + lien propre modifiable. */
export function StandRow({
  stand,
  commerceUrl,
}: {
  stand: ClientStand;
  commerceUrl: string | null;
}) {
  const [state, action, pending] = useActionState(adminSetStandLinkAction, null);
  const [url, setUrl] = useState(stand.target_url ?? "");
  const effective = stand.target_url || commerceUrl;
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-medium text-ink">{stand.code}</span>
          <StatusBadge status={stand.status} />
        </div>
        <p className="text-xs text-muted tabular-nums">
          30 j : {stand.views30} scans · {stand.clicks30} vers Google
        </p>
      </div>
      <p className="mt-1 truncate text-xs text-muted">
        Redirige vers : {effective ? effective : <span className="text-red-600">aucun lien</span>}
        {!stand.target_url && effective ? " (lien du commerce)" : ""}
      </p>
      {stand.status_note && (
        <p className="mt-1 text-xs text-amber-700">Note : {stand.status_note}</p>
      )}
      <form action={action} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input type="hidden" name="stand_id" value={stand.id} />
        <input
          name="target_url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Vide : suit le lien du commerce"
          aria-label={`Lien propre du présentoir ${stand.code}`}
          className={`${input} flex-1`}
        />
        <button type="submit" disabled={pending} className={btn}>
          {pending ? "…" : "Changer le lien"}
        </button>
        <Link
          href={`/admin/stands?q=${encodeURIComponent(stand.code)}`}
          className={`${btn} inline-flex items-center justify-center`}
        >
          Statut, remplacement…
        </Link>
      </form>
      <div className="mt-1">
        <Msg state={state} />
      </div>
    </li>
  );
}

/** Attribuer un présentoir vierge à ce commerce (sans scan). */
export function AssignStandForm({ establishmentId }: { establishmentId: string }) {
  const [state, action, pending] = useActionState(assignStandAction, null);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <div className="flex gap-2">
        <input
          name="code"
          required
          placeholder="Code d'un présentoir vierge"
          aria-label="Code d'un présentoir vierge à attribuer"
          className={`${input} w-64 font-mono`}
        />
        <button type="submit" disabled={pending} className={btn}>
          {pending ? "…" : "Attribuer"}
        </button>
      </div>
      <Msg state={state} />
    </form>
  );
}

/** Suppression du compte (super-admin uniquement). */
export function DeleteAccount({ orgId }: { orgId: string }) {
  const [state, action, pending] = useActionState(deleteAccountAction, null);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            "Supprimer définitivement ce compte ? Ses présentoirs seront retirés (identifiants jamais réutilisés).",
          )
        )
          e.preventDefault();
      }}
      className="flex flex-col gap-1"
    >
      <input type="hidden" name="org_id" value={orgId} />
      <button
        type="submit"
        disabled={pending}
        className="w-fit text-xs font-medium text-red-600 underline-offset-4 hover:underline disabled:opacity-50"
      >
        {pending ? "Suppression…" : "Supprimer le compte"}
      </button>
      <Msg state={state} />
    </form>
  );
}
