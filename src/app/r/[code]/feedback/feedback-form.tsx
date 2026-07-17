"use client";

import { useState, useTransition } from "react";
import { StarMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { submitFeedbackAction } from "./actions";

export function FeedbackForm({ code }: { code: string }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  if (sent) {
    return (
      <div className="mt-6 rounded-2xl bg-brand-soft p-6 text-center">
        <p className="font-display text-base font-semibold text-ink">
          Merci pour votre retour
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Nous en tenons compte pour nous améliorer.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-6 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await submitFeedbackAction(code, rating, message);
          setSent(true);
        });
      }}
    >
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            className={cn(
              "transition-colors",
              n <= rating ? "text-star" : "text-line hover:text-star/50",
            )}
          >
            <StarMark className="h-8 w-8" />
          </button>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Qu'est-ce qui n'a pas été ?"
        className="w-full resize-none rounded-2xl border border-line bg-canvas p-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand"
      />
      <button
        type="submit"
        disabled={!message.trim() || pending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-brand text-[15px] font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-40"
      >
        {pending ? "Envoi…" : "Envoyer mon retour"}
      </button>
    </form>
  );
}
