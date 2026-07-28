import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo, StarMark } from "@/components/ui/logo";
import {
  APP_BASE,
  CONTACT_EMAIL,
  STAND_PRICE,
  GOOGLE_DISCLAIMER,
  SITE,
  SHIPPING,
} from "@/lib/brand";

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

const TRUST: { icon: React.ReactNode; label: string }[] = [
  { icon: <TruckIcon />, label: `Livraison offerte dès ${SHIPPING.freeFromLabel}` },
  { icon: <TagIcon />, label: "Achat unique, sans frais récurrents" },
  { icon: <PhoneIcon />, label: "Compatible iPhone & Android" },
  { icon: <LockIcon />, label: "Paiement sécurisé" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line bg-surface">
      {/* Bandeau de réassurance — bande cobalt clair qui OUVRE nettement le pied
          de page et le détache des sections (blanches ou grises) au-dessus.
          Barre cobalt pleine en haut pour trancher, pastilles blanches en relief. */}
      <div className="border-b border-line bg-brand-soft">
        <div aria-hidden className="h-1 w-full bg-gradient-brand" />
        <Container className="grid grid-cols-2 gap-x-6 gap-y-5 py-8 sm:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-brand shadow-[var(--shadow-soft)]">
                {t.icon}
              </span>
              <span className="text-[13px] font-medium leading-snug text-ink-soft">
                {t.label}
              </span>
            </div>
          ))}
        </Container>
      </div>

      {/* Corps : marque + colonnes de liens */}
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-14">
        <div className="flex flex-col items-start gap-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {SITE.tagline} {STAND_PRICE} TTC, espace Reviu inclus, sans frais
            supplémentaires.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
          >
            <MailIcon />
            {CONTACT_EMAIL}
          </a>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
            Conçu en France <span aria-hidden>🇫🇷</span>
          </p>
        </div>

        {COLS.map((col) => (
          <nav key={col.title} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                {col.title}
              </span>
              <span
                aria-hidden
                className="h-px w-7 rounded-full bg-gradient-brand opacity-70"
              />
            </div>
            {col.links.map((l) => {
              const cls =
                "group inline-flex w-fit items-center text-sm text-ink-soft transition-colors hover:text-brand";
              const inner = (
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  {l.label}
                </span>
              );
              return l.ext ? (
                <a key={l.label} href={l.href} className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </nav>
        ))}
      </Container>

      {/* Barre légale */}
      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-7">
          <p className="max-w-3xl text-xs leading-relaxed text-muted">
            {GOOGLE_DISCLAIMER}
          </p>
          <div className="flex flex-col gap-3 border-t border-line-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} reviu — NEVIFY. Tous droits réservés.
            </p>
            <p className="inline-flex items-center gap-2 text-xs font-medium text-muted">
              <StarMark className="h-3.5 w-3.5 text-accent" />
              Le présentoir qui fait grandir votre note Google
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

// ── Icônes (traits fins, cohérentes avec le reste du site) ───────────────────
function TruckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 4h13v11H2zM15 8h4l3 3v4h-7" />
      <circle cx="6" cy="18" r="1.9" />
      <circle cx="17.5" cy="18" r="1.9" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-6.2-6.2A2 2 0 0 1 4 13V5a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l6.2 6.2a2 2 0 0 1 0 2.6Z" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
