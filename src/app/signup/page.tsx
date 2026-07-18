import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Créer un compte — reviu" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Créer votre compte"
      subtitle="Quelques secondes pour piloter vos avis."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
