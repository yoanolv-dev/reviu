import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/dashboard";
import { LoginForm } from "../login/login-form";

export const metadata: Metadata = { title: "Créer un compte - reviu" };

/**
 * Création de compte = même parcours que la connexion : e-mail, puis code reçu
 * par e-mail. Plus de mot de passe à l'inscription (il reste facultatif, à
 * définir depuis l'espace) : personne ne peut créer de compte avec l'adresse
 * d'un commerçant et un mot de passe de son choix.
 */
export default async function SignupPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <AuthShell
      title="Créer votre espace"
      subtitle="Votre e-mail suffit : vous recevez un code, sans mot de passe."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <LoginForm allowPassword={false} />
    </AuthShell>
  );
}
