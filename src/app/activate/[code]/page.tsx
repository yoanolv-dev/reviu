import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { buttonClass } from "@/components/ui/button";
import { getStandByCode } from "@/lib/data";
import { getCurrentUser, getMyContext } from "@/lib/dashboard";
import { ActivateForm } from "./activate-form";

export const metadata: Metadata = { title: "Activer un présentoir — reviu" };

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const stand = await getStandByCode(code);

  if (!stand) {
    return (
      <AuthShell
        title="Présentoir introuvable"
        subtitle={`Le code ${code} ne correspond à aucun présentoir reviu.`}
      >
        <Link href="/" className={buttonClass("secondary", "md", "w-full")}>
          Retour à l&apos;accueil
        </Link>
      </AuthShell>
    );
  }

  if (stand.status === "active") {
    return (
      <AuthShell
        title="Présentoir déjà activé"
        subtitle="Ce présentoir est déjà relié à un établissement — l'activation est unique."
      >
        <Link href="/dashboard" className={buttonClass("primary", "md", "w-full")}>
          Ouvrir le tableau de bord
        </Link>
      </AuthShell>
    );
  }

  if (stand.status !== "blank") {
    return (
      <AuthShell
        title="Présentoir indisponible"
        subtitle="Ce présentoir n'est pas activable pour le moment."
      >
        <Link href="/" className={buttonClass("secondary", "md", "w-full")}>
          Retour à l&apos;accueil
        </Link>
      </AuthShell>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/activate/${encodeURIComponent(code)}`);

  const ctx = await getMyContext();
  const hasEstablishment = !!ctx?.establishment;

  return (
    <AuthShell
      title="Activer votre présentoir"
      subtitle={`Configuration unique · code ${code}`}
    >
      <ActivateForm
        code={code}
        needEstablishment={!hasEstablishment}
        establishmentName={ctx?.establishment?.name}
      />
    </AuthShell>
  );
}
