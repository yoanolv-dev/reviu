"use client";

import { useActionState } from "react";
import { confirmEmailLinkAction } from "@/lib/auth-actions";

export function ConfirmForm({
  tokenHash,
  type,
  next,
  label,
}: {
  tokenHash: string;
  type: string;
  next: string;
  label: string;
}) {
  const [state, action, pending] = useActionState(confirmEmailLinkAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token_hash" value={tokenHash} />
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="next" value={next} />
      {state?.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
      >
        {pending ? "Connexion…" : label}
      </button>
    </form>
  );
}
