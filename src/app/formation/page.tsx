import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { verifyFormationGrant } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Formation — Lance ton business d'avis Google | reviu",
  robots: { index: false, follow: false },
};

/**
 * Espace formation, réservé aux clients.
 *
 * L'accès est déverrouillé par un jeton signé (`?token=`) émis après paiement
 * (page de confirmation + e-mail). La STRUCTURE du programme est en place ;
 * il reste à remplir le contenu de chaque leçon (texte, vidéos intégrées…)
 * ci-dessous, dans `MODULES`.
 */
export default async function FormationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const unlocked = verifyFormationGrant(token);

  if (!unlocked) return <Locked />;

  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        <section className="border-b border-line bg-surface">
          <Container className="py-14">
            <span className="font-mono text-xs uppercase tracking-widest text-brand">
              Formation
            </span>
            <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Lance ton business d&apos;avis Google.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              De la production des présentoirs à la signature de tes premiers
              clients récurrents. Suis les modules dans l&apos;ordre — chaque
              étape est actionnable dès aujourd&apos;hui.
            </p>
          </Container>
        </section>

        <Container className="py-12">
          <div className="mx-auto grid max-w-3xl gap-6">
            {MODULES.map((m, i) => (
              <article
                key={m.title}
                className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {m.title}
                  </h2>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {m.intro}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {m.lessons.map((l) => (
                    <li
                      key={l}
                      className="flex items-start gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink"
                    >
                      <span className="mt-0.5 text-brand">▸</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted">
            Une question sur la formation ? Écrivez-nous, on vous répond.
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

/** Écran affiché sans accès valide : invite à acheter la formation. */
function Locked() {
  return (
    <>
      <SiteHeader />
      <main className="bg-canvas">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-2xl">
            🔒
          </span>
          <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
            Accès réservé aux membres
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            La formation est incluse dans les packs revendeurs et disponible à
            l&apos;unité. Après achat, votre lien d&apos;accès vous est envoyé par
            e-mail et s&apos;ouvre en un clic.
          </p>
          <Link
            href="/boutique#produits"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-8px_var(--color-brand)] transition-colors hover:bg-brand-strong"
          >
            Découvrir la formation
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Contenu du programme (à compléter) ───────────────────────────────────────
// Remplacez les intitulés de leçons par vos contenus (et intégrez des vidéos si
// besoin). La structure ci-dessous est un point de départ éditorial.
const MODULES: { title: string; intro: string; lessons: string[] }[] = [
  {
    title: "Comprendre le marché",
    intro:
      "Pourquoi les avis Google sont devenus vitaux pour les commerces locaux, et où se situe l'opportunité.",
    lessons: [
      "Le poids d'un avis Google dans la décision d'achat locale",
      "Qui sont vos clients cibles (restaurants, salons, garages…)",
      "Positionnement : pourquoi un présentoir SaaS bat une simple carte NFC",
    ],
  },
  {
    title: "Produire vos présentoirs",
    intro:
      "Sourcer, personnaliser et préparer des présentoirs prêts à poser, sans stock inutile.",
    lessons: [
      "Sourcing du support et de la puce NFC",
      "Encodage NFC + génération du QR (avec reviu)",
      "Contrôle qualité et conditionnement",
    ],
  },
  {
    title: "Vendre en local",
    intro:
      "La méthode de prospection qui remplit un agenda de rendez-vous chez les commerçants.",
    lessons: [
      "Argumentaire et démonstration en 2 minutes",
      "Grille tarifaire : achat du présentoir + abonnement de suivi",
      "Gérer les objections et signer sur place",
    ],
  },
  {
    title: "Déployer et fidéliser avec reviu",
    intro:
      "Transformer chaque vente en revenu récurrent grâce au suivi et aux retours privés.",
    lessons: [
      "Activation et personnalisation des liens",
      "Montrer les statistiques pour prouver la valeur",
      "Construire un portefeuille d'abonnements 2,99 €/mois",
    ],
  },
];
