import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { APP_BASE, CONTACT_EMAIL, GOOGLE_DISCLAIMER, SITE } from "@/lib/brand";

const COLS: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Le présentoir", href: "/#produits" },
      { label: "Comment ça marche", href: "/#fonctionnement" },
      { label: "Pour qui ?", href: "/#pour-qui" },
      { label: "Démo", href: "/demo" },
      { label: "Questions fréquentes", href: "/#faq" },
      { label: "Guides", href: "/guides" },
    ],
  },
  {
    title: "Reviu",
    links: [
      { label: "Revendeur", href: "/revendeur" },
      { label: "Contact", href: `mailto:${CONTACT_EMAIL}`, ext: true },
      { label: "Connexion", href: `${APP_BASE}/login`, ext: true },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "CGV", href: "/cgv" },
      { label: "CGU", href: "/cgu" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Cookies", href: "/cookies" },
      { label: "Google Business Profile", href: "/google-business-profile" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-11 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-x-12">
          {/* Marque */}
          <div className="col-span-2 max-w-xs lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {SITE.tagline}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-block text-sm font-medium text-ink-soft underline-offset-4 transition-colors hover:text-brand hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Colonnes de liens */}
          {COLS.map((col) => (
            <nav key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.ext ? (
                      <a
                        href={l.href}
                        className="text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bas de page */}
        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-lg text-xs leading-relaxed text-muted">
            {GOOGLE_DISCLAIMER}
          </p>
          <div className="flex flex-col gap-1 text-xs text-muted sm:items-end">
            <span>© {new Date().getFullYear()} reviu - NEVIFY</span>
            <span>Conçu en France 🇫🇷</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
