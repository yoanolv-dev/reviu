"use client";

import { useActionState, useState } from "react";
import { createTicketAction, replyTicketAction } from "@/lib/support-actions";
import type { FormState } from "@/lib/form";
import { Field, TextArea } from "@/components/ui/field";

const primaryBtn =
  "flex h-11 w-fit items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50";

export function NewTicketForm({ standCodes }: { standCodes: string[] }) {
  const [state, action, pending] = useActionState(createTicketAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        label="Sujet (facultatif)"
        name="subject"
        maxLength={200}
        placeholder="Ex. Changer le lien de mon présentoir"
      />
      <TextArea
        label="Votre message"
        name="message"
        required
        rows={5}
        maxLength={5000}
        placeholder="Décrivez votre demande. Nous vous répondons par e-mail et ici."
      />
      {standCodes.length > 0 && (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">
            Présentoir concerné (facultatif)
          </span>
          <select
            name="stand_code"
            defaultValue=""
            className="h-11 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-brand"
          >
            <option value="">Aucun en particulier</option>
            {standCodes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={primaryBtn}>
        {pending ? "Envoi…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const [message, setMessage] = useState("");
  const [state, action, pending] = useActionState(
    async (prev: FormState, formData: FormData) => {
      const res = await replyTicketAction(prev, formData);
      if (res?.success) setMessage("");
      return res;
    },
    null,
  );
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="ticket_id" value={ticketId} />
      <TextArea
        label="Votre réponse"
        name="message"
        required
        rows={4}
        maxLength={5000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p aria-live="polite" className="text-sm text-emerald-600">
          Message envoyé. Nous vous répondons au plus vite.
        </p>
      )}
      <button type="submit" disabled={pending} className={primaryBtn}>
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
