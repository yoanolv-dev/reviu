import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/dashboard";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Mot de passe - reviu" };
export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  // Session ouverte par le lien de réinitialisation (/auth/confirm), ou
  // commerçant connecté qui souhaite définir un mot de passe (facultatif).
  const user = await getCurrentUser();

  return (
    <AuthShell
      title="Mot de passe"
      subtitle={
        user
          ? "Facultatif : vous pouvez toujours vous connecter avec un code reçu par e-mail."
          : "Lien invalide ou expiré."
      }
      footer={
        user ? (
          <Link href="/dashboard" className="font-medium text-brand hover:underline">
            Retour à mon espace
          </Link>
        ) : (
          <Link href="/login" className="font-medium text-brand hover:underline">
            Retour à la connexion
          </Link>
        )
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
