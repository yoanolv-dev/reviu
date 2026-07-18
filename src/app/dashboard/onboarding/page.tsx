import { redirect } from "next/navigation";
import { getMyContext } from "@/lib/dashboard";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const ctx = await getMyContext();
  if (ctx?.establishment) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md">
      <p className="font-mono text-xs uppercase tracking-widest text-brand">
        Bienvenue
      </p>
      <h1 className="mt-1.5 font-display text-2xl font-semibold text-ink">
        Créons votre établissement
      </h1>
      <p className="mt-2 text-sm text-muted">
        Ces informations alimentent votre page d&apos;avis. Vous pourrez tout
        modifier ensuite.
      </p>
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
        <OnboardingForm />
      </div>
    </div>
  );
}
