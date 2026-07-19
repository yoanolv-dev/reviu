import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion — reviu" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const signupHref = next
    ? `/signup?next=${encodeURIComponent(next)}`
    : "/signup";
  return (
    <AuthShell
      title="Bon retour"
      subtitle="Connectez-vous à votre espace reviu."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href={signupHref}
            className="font-medium text-brand hover:underline"
          >
            Créer un compte
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
