import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dashboard";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion - reviu" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; email?: string }>;
}) {
  const { error, email } = await searchParams;
  // Déjà connecté (ex. bouton « Accéder à mon espace » de l'e-mail de
  // confirmation, ouvert sur le même téléphone) : directement dans l'espace.
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connectez-vous à votre espace reviu."
      footer={
        <>
          Nouveau ? Scannez votre présentoir pour l&apos;activer : votre
          espace est créé au passage.
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
