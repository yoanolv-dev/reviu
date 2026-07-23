"use client";

import { useActionState } from "react";
import { startShopCheckout } from "@/lib/stripe-actions";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Bouton « Commander » : poste vers `startShopCheckout` qui redirige vers
 * Stripe Checkout. Si le paiement n'est pas configuré, l'erreur s'affiche sous
 * le bouton (le reste de la boutique reste consultable).
 */
export function BuyButton({
  product,
  label = "Commander",
  variant = "primary",
  className,
}: {
  product: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const [state, action, pending] = useActionState(startShopCheckout, null);
  return (
    <form action={action} className={cn("flex flex-col gap-2", className)}>
      <input type="hidden" name="product" value={product} />
      <button
        type="submit"
        disabled={pending}
        className={buttonClass(variant, "lg", "w-full")}
      >
        {pending ? "Redirection…" : label}
      </button>
      {state?.error && (
        <p className="text-center text-xs text-red-600">{state.error}</p>
      )}
    </form>
  );
}
