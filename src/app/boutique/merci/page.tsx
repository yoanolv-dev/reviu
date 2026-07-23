import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getStripe } from "@/lib/stripe";
import { formationAccessUrl, formatEuros } from "@/lib/shop";
import { APP_BASE } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Merci pour votre commande — reviu",
  robots: { index: false, follow: false },
};

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  let email: string | null = null;
  let amount: number | null = null;
  let productName: string | null = null;
  let grantsFormation = false;
  let physical = false;

  const stripe = getStripe();
  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email ?? null;
      amount = session.amount_total ?? null;
      productName = session.metadata?.product_name ?? null;
      grantsFormation = session.metadata?.grants_formation === "1";
      physical = Number(session.metadata?.stands_included ?? 0) > 0;
    } catch {
      // session introuvable / clé absente : on affiche un message neutre.
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-8 text-center shadow-[var(--shadow-soft)] sm:p-10">
            {paid ? (
              <>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
                  Merci pour votre commande !
                </h1>
                <p className="mt-2 text-[15px] text-ink-soft">
                  {productName ? (
                    <>
                      <strong className="font-medium text-ink">
                        {productName}
                      </strong>
                      {amount != null && <> — {formatEuros(amount)}</>}
                    </>
                  ) : (
                    "Votre paiement a bien été confirmé."
                  )}
                </p>
                {email && (
                  <p className="mt-1 text-sm text-muted">
                    Un e-mail de confirmation vous a été envoyé à {email}.
                  </p>
                )}

                {grantsFormation && sessionId && (
                  <div className="mt-6 rounded-2xl border border-brand/30 bg-brand-soft p-5">
                    <p className="text-sm font-medium text-ink">
                      🎓 Votre formation est débloquée
                    </p>
                    <a
                      href={formationAccessUrl(sessionId)}
                      className="mt-3 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                    >
                      Accéder à la formation
                    </a>
                    <p className="mt-2 text-xs text-muted">
                      Ce lien d&apos;accès figure aussi dans votre e-mail.
                    </p>
                  </div>
                )}

                {physical && (
                  <p className="mt-6 text-sm text-ink-soft">
                    📦 Votre commande est en préparation. Vous recevrez vos
                    présentoirs à l&apos;adresse indiquée lors du paiement.
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href={`${APP_BASE}/signup`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                  >
                    Créer / activer mon compte
                  </a>
                  <Link
                    href="/boutique"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-canvas px-6 text-sm font-medium text-ink transition-colors hover:border-brand/40"
                  >
                    Retour à la boutique
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="font-display text-2xl font-semibold text-ink">
                  Commande en cours de confirmation
                </h1>
                <p className="mt-3 text-[15px] text-ink-soft">
                  Si vous venez de payer, votre confirmation arrive par e-mail
                  dans quelques instants. Sinon, retournez à la boutique pour
                  finaliser votre commande.
                </p>
                <Link
                  href="/boutique"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                >
                  Retour à la boutique
                </Link>
              </>
            )}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
