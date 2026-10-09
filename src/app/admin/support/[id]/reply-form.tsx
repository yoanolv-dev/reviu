"use client";

import { useActionState, useState } from "react";
import {
  adminReplyTicketAction,
  adminSetTicketStatusAction,
} from "@/lib/support-actions";
import type { AdminActionState } from "@/lib/admin-actions";
import { TextArea } from "@/components/ui/field";
import { Msg } from "../../accounts/[orgId]/client-forms";

export function AdminReplyForm({ ticketId, closed }: { ticketId: string; closed: boolean }) {
  const [message, setMessage] = useState("");
  const [state, action, pending] = useActionState(
    async (prev: AdminActionState, formData: FormData) => {
      const res = await adminReplyTicketAction(prev, formData);
      if (res?.success) setMessage("");
      return res;
    },
    null,
  );
  const [st, stAction, stPending] = useActionState(adminSetTicketStatusAction, null);

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="ticket_id" value={ticketId} />
        <TextArea
          label="Votre réponse"
          name="message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Le commerçant la reçoit aussi par e-mail."
        />
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" name="close" className="h-4 w-4 accent-[var(--color-brand)]" />
          Clôturer la demande après l&apos;envoi
        </label>
        <Msg state={state} />
        <button
          type="submit"
          disabled={pending}
          className="h-10 w-fit rounded-full bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
        >
          {pending ? "Envoi…" : "Envoyer la réponse"}
        </button>
      </form>
      <form action={stAction} className="flex flex-col gap-1 border-t border-line pt-3">
        <input type="hidden" name="ticket_id" value={ticketId} />
        <input type="hidden" name="status" value={closed ? "open" : "closed"} />
        <button
          type="submit"
          disabled={stPending}
          className="w-fit text-sm text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-50"
        >
          {closed ? "Rouvrir la demande" : "Clôturer sans répondre"}
        </button>
        <Msg state={st} />
      </form>
    </div>
  );
}
