import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const LINKS = [
  { label: "Tarifs", href: "/tarifs" },
  { label: "Démo", href: "/r/demo" },
  { label: "Se connecter", href: "/login" },
];

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
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} reviu · Conçu en France
        </p>
      </Container>
    </footer>
  );
}
