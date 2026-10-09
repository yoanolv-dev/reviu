import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion - reviu" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  const { error, email } = await searchParams;
  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connectez-vous à votre espace reviu."
      footer={
        <>
          Nouveau ? Scannez votre présentoir pour l&apos;activer, ou{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            créez un compte
          </Link>
          .
        </>
      }
    >
      {error === "auth" && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Lien de connexion invalide ou expiré. Demandez un nouveau code
          ci-dessous.
        </p>
      )}
      <LoginForm initialEmail={email?.slice(0, 254) ?? ""} />
    </AuthShell>
  );
}
