import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { CONTACT_EMAIL } from "@/lib/brand";

const LEGAL = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cgu", label: "CGU" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted">
            Collectez plus d&apos;avis, sans effort.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm text-brand hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <nav className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Informations légales
          </span>
          {LEGAL.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className="border-t border-line py-5">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} reviu · Conçu en France
        </p>
      </Container>
    </footer>
  );
}
