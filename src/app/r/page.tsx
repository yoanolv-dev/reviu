import { ScreenShell, PoweredBy } from "@/components/site/screen";
import { StarMark } from "@/components/ui/logo";

export default function RedirectRoot() {
  return (
    <ScreenShell>
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white">
          <StarMark className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold text-ink">reviu</h1>
        <p className="mt-2 text-sm text-muted">
          Approchez votre téléphone d&apos;un présentoir ou scannez son QR code
          pour laisser un avis.
        </p>
      </div>
      <PoweredBy />
    </ScreenShell>
  );
}
