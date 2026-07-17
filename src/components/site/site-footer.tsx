import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted">
            Collectez plus d&apos;avis, sans effort.
          </p>
        </div>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} reviu · Conçu en France
        </p>
      </Container>
    </footer>
  );
}
