import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import {
  APP_BASE,
  CONTACT_EMAIL,
  SUBSCRIPTION,
  GOOGLE_DISCLAIMER,
} from "@/lib/brand";

const COLS: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Boutique", href: "/" },
      { label: "Comment ça marche", href: "/home" },
      { label: "Guides", href: "/guides" },
      { label: "Démo", href: "/demo" },
      { label: "Tarifs", href: "/#produits" },
      { label: "Google Business Profile", href: "/google-business-profile" },
    ],
  },
  {
    title: "Compte",
    links: [
      { label: "Se connecter", href: `${APP_BASE}/login`, ext: true },
      { label: "Créer un compte", href: `${APP_BASE}/signup`, ext: true },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "CGU", href: "/cgu" },
      { label: "CGV", href: "/cgv" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-surface">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-60"
      />
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Des présentoirs NFC + QR pour faciliter le dépôt d&apos;avis Google
            de vos clients, à partir de {SUBSCRIPTION.priceLabel}/
            {SUBSCRIPTION.period} par présentoir.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="w-fit text-sm font-medium text-brand hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {COLS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {col.title}
            </span>
            {col.links.map((l) =>
              l.ext ? (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
        ))}
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6">
          <p className="max-w-3xl text-xs leading-relaxed text-muted">
            {GOOGLE_DISCLAIMER}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} reviu — NEVIFY. Tous droits réservés.
            </p>
            <p className="text-sm text-muted">Conçu en France 🇫🇷</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
