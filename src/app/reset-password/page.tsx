import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/dashboard";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Nouveau mot de passe - reviu" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  // Le lien de récupération a établi une session via /auth/callback.
  const user = await getCurrentUser();

  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle={
        user
          ? "Choisissez un nouveau mot de passe pour votre compte."
          : "Lien invalide ou expiré."
      }
      footer={
        <Link href="/login" className="font-medium text-brand hover:underline">
          Retour à la connexion
        </Link>
      }
    >
      {user ? (
        <ResetForm />
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un
          nouveau depuis{" "}
          <Link href="/forgot-password" className="font-medium underline">
            Mot de passe oublié
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
