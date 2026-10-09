import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { safeNext } from "@/lib/auth-code";
import { ConfirmForm } from "./confirm-form";

export const metadata: Metadata = {
  title: "Connexion - reviu",
  robots: { index: false, follow: false },
};

/**
 * Lien reçu par e-mail (code de connexion ou réinitialisation). Contrairement à
 * l'ancien lien magique, il fonctionne sur n'importe quel appareil : aucune
 * donnée n'est attendue dans le navigateur qui a fait la demande.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>;
}) {
  const { token_hash, type, next: rawNext } = await searchParams;
  const valid = Boolean(token_hash) && (type === "email" || type === "recovery");
  const next = safeNext(rawNext);
  const activation = type === "email" && next.startsWith("/activer/");

  return (
    <AuthShell
      title={
        type === "recovery"
          ? "Nouveau mot de passe"
          : activation
            ? "Activation de votre présentoir"
            : "Connexion à votre espace"
      }
      subtitle={
        valid
          ? type === "recovery"
            ? "Confirmez pour choisir un nouveau mot de passe."
            : activation
              ? "Confirmez pour continuer l'activation sur cet appareil."
              : "Confirmez pour ouvrir votre espace reviu sur cet appareil."
          : undefined
      }
      footer={
        activation ? (
          <Link href={next} className="font-medium text-brand hover:underline">
            Retour à l&apos;activation
          </Link>
        ) : (
          <Link href="/login" className="font-medium text-brand hover:underline">
            Retour à la connexion
          </Link>
        )
      }
    >
      {valid ? (
        <ConfirmForm
          tokenHash={token_hash!}
          type={type!}
          next={next}
          label={
            type === "recovery"
              ? "Continuer"
              : activation
                ? "Continuer l'activation"
                : "Ouvrir mon espace"
          }
        />
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Ce lien est incomplet. Demandez un nouveau code depuis la{" "}
          <Link href="/login" className="font-medium underline">
            page de connexion
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
