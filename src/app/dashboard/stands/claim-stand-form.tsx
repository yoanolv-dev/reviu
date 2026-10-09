"use client";

import { useActionState, useState } from "react";
import { claimStandAction } from "@/lib/activation-actions";
import type { FormState } from "@/lib/form";

const inputBase =
  "h-11 rounded-xl border border-line bg-canvas px-3.5 font-mono text-sm text-ink outline-none transition-colors placeholder:font-sans placeholder:text-muted focus:border-brand";

export function ClaimStandForm({
  establishmentId,
}: {
  establishmentId: string;
}) {
  // Champs contrôlés : une erreur (ex. secret mal tapé) ne vide pas la saisie ;
  // ils sont vidés seulement après un rattachement réussi.
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [state, action, pending] = useActionState(
    async (prev: FormState, formData: FormData) => {
      const res = await claimStandAction(prev, formData);
      if (res?.success) {
        setCode("");
        setPin("");
      }
      return res;
    },
    null,
  );
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="establishment_id" value={establishmentId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">Code du présentoir</span>
          <input
            name="code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="k7qm2pa"
            autoCapitalize="none"
            autoComplete="off"
            className={inputBase}
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:w-36">
          <span className="text-xs font-medium text-ink-soft">Code secret</span>
          <input
            name="pin"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ABCD1234"
            autoCapitalize="characters"
            autoComplete="off"
            className={`${inputBase} uppercase tracking-wider`}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
        >
          {pending ? "…" : "Rattacher"}
        </button>
      </div>
      <p className="text-xs text-muted">
        Code du présentoir : les 7 caractères à la fin de son adresse
        r.reviu.fr/… (vous pouvez coller l&apos;adresse entière). Code secret :
        8 caractères imprimés à côté du QR code. Plus simple : scannez le
        présentoir avec votre téléphone connecté à cet espace.
      </p>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p aria-live="polite" className="text-sm text-emerald-600">
          Présentoir rattaché et activé. Une confirmation vous a été envoyée
          par e-mail.
        </p>
      )}
    </form>
  );
}
