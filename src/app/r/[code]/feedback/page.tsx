import { notFound } from "next/navigation";
import { getStandByCode } from "@/lib/data";
import { ScreenShell, Avatar, PoweredBy } from "@/components/site/screen";
import { FeedbackForm } from "./feedback-form";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const stand = await getStandByCode(code);
  if (!stand || !stand.establishment) notFound();
  const est = stand.establishment;

  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <Avatar name={est.name} logoUrl={est.logoUrl} />
          <h1 className="mt-5 font-display text-xl font-semibold text-ink">
            Un mot pour {est.name} ?
          </h1>
          <p className="mt-2 text-sm text-muted">
            Votre retour reste privé et nous aide à nous améliorer.
          </p>
        </div>
        <FeedbackForm code={code} />
      </div>
      <PoweredBy />
    </ScreenShell>
  );
}
