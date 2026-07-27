import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { verifyFormationGrant } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Formation - Lance ton business d'avis Google | reviu",
  robots: { index: false, follow: false },
};

/**
 * Espace formation, réservé aux clients.
 *
 * L'accès est déverrouillé par un jeton signé (`?token=`) émis après paiement
 * (page de confirmation + e-mail). Le contenu du programme vit dans `MODULES`
 * ci-dessous : chaque leçon est une suite de blocs (paragraphe, étapes, liste,
 * astuce, script de vente) rendus par `<Block/>`.
 *
 * Modèle enseigné = « marge physique » (cf. docs/HANDOFF.md) : le revendeur
 * gagne la marge à la revente du présentoir (encaissée une fois) ; reviu facture
 * l'abonnement de suivi 2,99 €/mois en direct au commerçant.
 */
export default async function FormationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const unlocked = verifyFormationGrant(token);

  if (!unlocked) return <Locked />;

  const lessonCount = MODULES.reduce((n, m) => n + m.lessons.length, 0);
  const totalMinutes = MODULES.reduce(
    (n, m) => n + m.lessons.reduce((s, l) => s + l.minutes, 0),
    0,
  );

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
              De la première commande de présentoirs à la signature de tes
              clients, en respectant les règles de Google. Suis les modules dans
              l&apos;ordre : chaque étape est actionnable dès aujourd&apos;hui.
            </p>
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
              <div className="flex items-baseline gap-2">
                <dt className="font-mono text-brand">{MODULES.length}</dt>
                <dd>modules</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="font-mono text-brand">{lessonCount}</dt>
                <dd>leçons</dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="font-mono text-brand">
                  ~{Math.round(totalMinutes / 5) * 5} min
                </dt>
                <dd>de lecture</dd>
              </div>
            </dl>

            <nav
              aria-label="Sommaire"
              className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
            >
              {MODULES.map((m, i) => (
                <a
                  key={m.title}
                  href={`#module-${i + 1}`}
                  className="flex items-baseline gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <span className="font-mono text-xs text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m.title}
                </a>
              ))}
            </nav>
          </Container>
        </section>

        <Container className="py-12">
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            {MODULES.map((m, i) => (
              <section
                key={m.title}
                id={`module-${i + 1}`}
                className="scroll-mt-24"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {m.title}
                  </h2>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {m.intro}
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  {m.lessons.map((l, j) => (
                    <details
                      key={l.title}
                      open={i === 0 && j === 0}
                      className="group rounded-3xl border border-line bg-surface open:shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-xs text-muted">
                            {i + 1}.{j + 1}
                          </span>
                          <span className="font-display text-lg font-semibold text-ink">
                            {l.title}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <span className="hidden font-mono text-xs text-muted sm:inline">
                            {l.minutes} min
                          </span>
                          <span
                            aria-hidden
                            className="text-brand transition-transform group-open:rotate-90"
                          >
                            ▸
                          </span>
                        </span>
                      </summary>
                      <div className="flex flex-col gap-4 border-t border-line px-5 pb-6 pt-5 sm:px-6">
                        {l.blocks.map((b, k) => (
                          <Block key={k} block={b} />
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-line bg-surface p-6 text-center sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              Prêt à te lancer ?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              Commande tes présentoirs, active-les depuis ton espace revendeur et
              pose ton premier cette semaine. Une question sur la formation ?
              Écris-nous, on te répond.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/boutique#produits"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white transition-colors hover:bg-brand-strong"
              >
                Commander des présentoirs
              </Link>
              <Link
                href="/dashboard/revendeur"
                className="inline-flex h-11 items-center justify-center rounded-full border border-line px-6 text-[15px] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
              >
                Mon espace revendeur
              </Link>
            </div>
          </div>
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
            Accès réservé aux revendeurs
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            La formation accompagne les revendeurs sélectionnés. Candidatez au
            programme revendeur : après validation, votre lien d&apos;accès vous
            est envoyé par e-mail et s&apos;ouvre en un clic.
          </p>
          <Link
            href="/revendeur"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-[15px] font-medium text-white shadow-[0_8px_20px_-8px_var(--color-brand)] transition-colors hover:bg-brand-strong"
          >
            Devenir revendeur
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Rendu d'un bloc de leçon ─────────────────────────────────────────────────

type Block =
  | { type: "p"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "list"; items: string[] }
  | { type: "tip"; title?: string; text: string }
  | { type: "script"; lines: { who: string; say: string }[] };

function Block({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-[15px] leading-relaxed text-ink-soft">{block.text}</p>
      );
    case "steps":
      return (
        <ol className="flex flex-col gap-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-ink">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[11px] text-brand">
                {i + 1}
              </span>
              <span className="leading-relaxed text-ink-soft">{it}</span>
            </li>
          ))}
        </ol>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-ink">
              <span className="mt-0.5 text-brand">▸</span>
              <span className="leading-relaxed text-ink-soft">{it}</span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div className="rounded-2xl border border-line bg-brand-soft/60 p-4">
          <p className="text-sm leading-relaxed text-ink">
            <span className="font-semibold text-brand">
              {block.title ?? "À retenir"} :{" "}
            </span>
            {block.text}
          </p>
        </div>
      );
    case "script":
      return (
        <div className="rounded-2xl border border-line bg-canvas p-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Script
          </span>
          <dl className="mt-2 flex flex-col gap-2">
            {block.lines.map((l, i) => (
              <div key={i} className="text-[15px] leading-relaxed">
                <dt className="font-mono text-xs text-brand">{l.who}</dt>
                <dd className="text-ink-soft">« {l.say} »</dd>
              </div>
            ))}
          </dl>
        </div>
      );
  }
}

// ── Contenu du programme ─────────────────────────────────────────────────────
// Modèle « marge physique » : le revendeur gagne la marge sur le présentoir,
// reviu garde le récurrent 2,99 €/mois (facturé en direct au commerçant).

type Lesson = { title: string; minutes: number; blocks: Block[] };
type Module = { title: string; intro: string; lessons: Lesson[] };

const MODULES: Module[] = [
  {
    title: "Comprendre le marché et l'opportunité",
    intro:
      "Avant de vendre, il faut comprendre pourquoi les commerçants ont besoin de toi et comment, exactement, tu gagnes de l'argent.",
    lessons: [
      {
        title: "Pourquoi les avis Google décident des ventes locales",
        minutes: 6,
        blocks: [
          {
            type: "p",
            text: "Quand un client cherche un restaurant, un garage ou un salon près de chez lui, Google lui présente une courte liste de fiches locales. Trois signaux dominent le choix : la note moyenne, le nombre d'avis, et leur fraîcheur. À prestation égale, la fiche la mieux notée et la plus commentée récemment attire le clic, l'appel et la visite.",
          },
          {
            type: "p",
            text: "Pour le commerçant, ce n'est pas un sujet d'image : c'est du chiffre d'affaires. Une fiche pauvre en avis, ou avec des avis anciens, part perdante face au voisin. C'est ce manque très concret que ton présentoir vient combler : il transforme des clients satisfaits mais silencieux en avis récents et réguliers.",
          },
          {
            type: "tip",
            title: "Honnêteté",
            text: "Ne promets jamais un chiffre précis (« +40 % d'avis »). Tu ne contrôles ni le nombre ni la note. Ce que tu vends, c'est un geste rendu simple et proposé au bon moment, à tous les clients.",
          },
        ],
      },
      {
        title: "Le vrai problème de ton client",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Le commerçant sait qu'il « devrait avoir plus d'avis ». Trois freins l'en empêchent, et tu les résous tous les trois :",
          },
          {
            type: "list",
            items: [
              "Le geste est trop long : chercher la fiche, se connecter, écrire. Le présentoir ouvre l'avis Google en un scan.",
              "Personne ne pense à demander au bon moment. Le présentoir posé au comptoir demande à sa place, en continu, sans y penser.",
              "La peur de l'avis négatif. reviu propose à tous un canal de retour privé : le client mécontent s'exprime en direct au commerçant plutôt qu'en public.",
            ],
          },
          {
            type: "p",
            text: "Ton argument tient en une phrase : « Vos clients sont contents, mais ils ne le disent jamais à Google. Ce présentoir le leur rend facile, en un geste. »",
          },
        ],
      },
      {
        title: "Comment tu gagnes ta vie (le modèle, sans flou)",
        minutes: 5,
        blocks: [
          {
            type: "p",
            text: "Ta rémunération de revendeur, c'est la marge à la revente du présentoir, encaissée une fois. Tu achètes en pack à prix remisé et tu revends chaque présentoir au commerçant. Exemple avec le Pack Revendeur 10 (199 €, soit environ 19,90 € l'unité) : revendu 29,90 €, tu gardes environ 10 € par présentoir. Le Pack 20 (349 €, environ 17,45 € l'unité) améliore encore ta marge.",
          },
          {
            type: "p",
            text: "L'abonnement de suivi à 2,99 €/mois, lui, est facturé par reviu en direct au commerçant. Ce n'est pas un revenu récurrent pour toi, et c'est une bonne nouvelle : c'est reviu qui gère le paiement, le support et l'outil dans la durée. Toi, tu te concentres sur ce que tu fais de mieux : placer des présentoirs.",
          },
          {
            type: "tip",
            title: "Pourquoi le récurrent te sert quand même",
            text: "Parce qu'un présentoir suivi et mis à jour reste utile et crédible. Un commerçant satisfait rachète pour sa 2ᵉ adresse et te recommande. Ton business, c'est le volume et la recommandation, pas un client vendu une seule fois.",
          },
          {
            type: "p",
            text: "Concrètement, tes leviers de revenu sont donc : vendre plus de présentoirs, les revendre au bon prix (avec éventuellement une prestation de pose facturée à part), et faire tourner la recommandation pour vendre sans prospecter à froid.",
          },
        ],
      },
      {
        title: "Ta cible idéale et les règles à respecter",
        minutes: 5,
        blocks: [
          {
            type: "p",
            text: "Vise les commerces avec du passage et un intérêt clair pour leur visibilité locale :",
          },
          {
            type: "list",
            items: [
              "Restauration : restaurants, cafés, boulangeries, food trucks.",
              "Beauté et bien-être : coiffeurs, barbiers, instituts, ongleries.",
              "Auto et artisanat : garages, carrossiers, plombiers, électriciens.",
              "Santé et services : cabinets, opticiens, pressings, fleuristes.",
            ],
          },
          {
            type: "p",
            text: "Ce qui les rend faciles à convaincre : un flux de clients satisfaits, un patron joignable sur place, et une fiche Google déjà existante (donc rien à créer).",
          },
          {
            type: "tip",
            title: "Règle d'or Google (non négociable)",
            text: "On invite TOUS les clients à laisser un avis, jamais seulement les contents. Filtrer selon la note (le « review gating ») est interdit par Google et peut faire sanctionner la fiche du commerçant. Le retour privé de reviu est un canal de contact en plus, jamais un filtre.",
          },
        ],
      },
    ],
  },
  {
    title: "Préparer ton offre et tes présentoirs",
    intro:
      "Ce que tu reçois, comment l'activer avec reviu, et l'offre chiffrée que tu poseras sur la table du commerçant.",
    lessons: [
      {
        title: "Ce que tu reçois dans ton pack",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Chaque présentoir arrive prêt à poser : la puce NFC et le QR code sont déjà encodés et pointent vers un identifiant public permanent. Tu n'as rien à ré-encoder ni à imprimer.",
          },
          {
            type: "list",
            items: [
              "Le code du présentoir est permanent et gravé : il ne change jamais, même si tu changes la destination de la redirection.",
              "La destination (la fiche Google du commerçant) se règle à distance, dans reviu. C'est ça que tu personnalises, pas la puce.",
              "L'activation est gratuite. L'abonnement de suivi 2,99 €/mois est souscrit à part par le commerçant.",
            ],
          },
          {
            type: "tip",
            text: "Ne tente jamais de ré-encoder toi-même une puce NFC : tu casserais le lien avec reviu et les statistiques. Tout se pilote depuis l'application, jamais sur la puce.",
          },
        ],
      },
      {
        title: "Activer un présentoir avec reviu",
        minutes: 6,
        blocks: [
          {
            type: "p",
            text: "L'activation associe un présentoir physique à un établissement et à sa fiche Google. Le parcours est conçu pour se faire en quelques minutes, idéalement devant le client au moment de la vente.",
          },
          {
            type: "steps",
            items: [
              "Scanne le présentoir (ou saisis son code) pour lancer l'activation.",
              "Renseigne l'établissement : nom du commerce et lien de sa fiche Google (le lien « Demander des avis » depuis son compte Google Business Profile).",
              "Choisis le comportement au scan : « direct » (le scan ouvre l'avis Google immédiatement, idéal comptoir) ou « page » (une page d'accueil reviu avec le bouton Google pour tous et le canal de retour privé).",
              "Valide : le présentoir est actif. Un test au scan doit ouvrir la bonne fiche.",
            ],
          },
          {
            type: "tip",
            text: "Le mode « direct » est le plus fluide pour un comptoir : un scan, un geste, l'avis Google s'ouvre. Le mode « page » convient si le commerçant veut mettre en avant son canal de retour privé.",
          },
        ],
      },
      {
        title: "Ta grille de prix et ta marge",
        minutes: 5,
        blocks: [
          {
            type: "p",
            text: "Garde une grille simple et assumée. Prix de référence conseillé au commerçant : 29,90 € le présentoir (achat unique) + 2,99 €/mois d'abonnement de suivi, sans engagement, souscrit auprès de reviu.",
          },
          {
            type: "list",
            items: [
              "Pack 10 : 199 € (≈ 19,90 €/présentoir). Revendu 29,90 €, environ 10 € de marge par présentoir, soit ~100 € sur le pack.",
              "Pack 20 : 349 € (≈ 17,45 €/présentoir). Meilleure marge du catalogue, idéal quand tu montes en volume.",
              "Option prestation : facture une pose + activation sur place (par ex. 20 à 40 €) si tu installes et formes l'équipe. C'est ton service, à ta main.",
            ],
          },
          {
            type: "tip",
            title: "Positionne, ne brade pas",
            text: "Vendu 29,90 €, ton présentoir coûte au commerçant moins qu'un plein d'essence pour un outil qui travaille tous les jours. Baisser le prix n'accélère pas la vente ; la démonstration, si.",
          },
        ],
      },
      {
        title: "Ton kit de vente",
        minutes: 3,
        blocks: [
          {
            type: "p",
            text: "Voyage léger, mais toujours prêt à faire une démo en direct. Ton kit tient dans une sacoche :",
          },
          {
            type: "list",
            items: [
              "Un présentoir de démonstration déjà activé (sur ta propre fiche de test), pour montrer le scan en vrai.",
              "Ton téléphone chargé, pour faire scanner le commerçant lui-même : c'est le moment qui déclenche la vente.",
              "Deux ou trois présentoirs à laisser sur place le jour même : on ne repart pas chercher le stock.",
              "Une carte simple avec la grille de prix, et de quoi encaisser (le commerçant paie le présentoir, il s'abonne ensuite à reviu en ligne).",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Vendre en local : prospection et closing",
    intro:
      "La partie qui fait la différence. Où trouver tes clients, comment ouvrir la conversation, faire la démo et conclure sur place.",
    lessons: [
      {
        title: "Où trouver tes premiers clients",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Ta zone de chasse est à moins de 15 minutes de chez toi. Commence là où tu peux revenir facilement et te faire connaître.",
          },
          {
            type: "list",
            items: [
              "Ta rue commerçante et les zones à fort passage : tu enchaînes les visites à pied.",
              "Google Maps : repère les commerces avec peu d'avis ou des avis anciens dans ta ville, ce sont tes meilleures cibles.",
              "Ton réseau : les commerçants que tu connais déjà signent plus vite et te recommandent.",
              "Les recommandations : chaque client satisfait connaît d'autres commerçants. Demande-les systématiquement.",
            ],
          },
        ],
      },
      {
        title: "Aborder un commerçant sans le braquer",
        minutes: 5,
        blocks: [
          {
            type: "p",
            text: "Choisis le bon moment (jamais en plein coup de feu) et parle à la bonne personne : le gérant ou le patron, celui qui décide. Sois court, concret, et propose une démo plutôt qu'un discours.",
          },
          {
            type: "script",
            lines: [
              {
                who: "Toi",
                say: "Bonjour, je passe voir les commerçants du quartier. J'aide à récolter plus d'avis Google, en un scan au comptoir. Je vous montre en 30 secondes ?",
              },
              {
                who: "Le gérant",
                say: "On est un peu pris, là…",
              },
              {
                who: "Toi",
                say: "Je comprends, c'est justement l'idée : zéro temps à y passer. Regardez, vous scannez ce présentoir avec votre téléphone…",
              },
            ],
          },
          {
            type: "tip",
            text: "Ton objectif à ce stade n'est pas de vendre, c'est d'obtenir le scan. Une fois qu'il a scanné et vu l'avis Google s'ouvrir, la démo est faite toute seule.",
          },
        ],
      },
      {
        title: "La démo en 2 minutes",
        minutes: 5,
        blocks: [
          {
            type: "steps",
            items: [
              "Pose le présentoir sur le comptoir : « Voilà ce que verront vos clients. »",
              "Fais-le scanner avec son propre téléphone. L'avis Google s'ouvre en un geste : laisse le silence faire son effet.",
              "Explique le retour privé : « Un client déçu ? Il vous écrit en direct plutôt que de le déballer en public. »",
              "Rappelle la règle : « On invite tous vos clients à laisser un avis, jamais un tri. C'est ce que Google demande, et c'est vous qui êtes protégé. »",
              "Montre où ça se pose : à la caisse, sur le comptoir, près de l'addition.",
            ],
          },
          {
            type: "tip",
            text: "Ne survends pas les chiffres. Un scan n'est pas un avis publié : le client reste libre. Ce que tu garantis, c'est la simplicité du geste et le suivi dans l'appli.",
          },
        ],
      },
      {
        title: "Répondre aux objections",
        minutes: 6,
        blocks: [
          {
            type: "p",
            text: "Les objections sont presque toujours les mêmes. Prépare-les, tu ne seras jamais pris de court.",
          },
          {
            type: "script",
            lines: [
              {
                who: "« C'est trop cher »",
                say: "29,90 € une fois, pour un outil qui travaille tous les jours au comptoir. C'est le prix d'un menu. L'abonnement à 2,99 € est sans engagement, vous coupez quand vous voulez.",
              },
              {
                who: "« J'ai déjà des avis »",
                say: "Parfait, ça prouve que ça compte pour vous. Le sujet, c'est la fraîcheur : Google met en avant les fiches actives. Ce présentoir entretient le rythme sans que vous y pensiez.",
              },
              {
                who: "« Je n'ai pas le temps »",
                say: "C'est exactement pour ça : rien à gérer, le présentoir demande à votre place. Je vous l'active en 5 minutes, là, maintenant.",
              },
              {
                who: "« Et si j'ai un avis négatif ? »",
                say: "Le client mécontent a un bouton pour vous écrire en privé. Vous récupérez le problème avant qu'il finisse en public. On n'empêche personne de poster, mais on ouvre une porte de sortie directe.",
              },
              {
                who: "« C'est légal ? »",
                say: "Oui : on invite tous vos clients, sans tri selon la note. C'est précisément ce que Google autorise. reviu est indépendant de Google.",
              },
            ],
          },
        ],
      },
      {
        title: "Conclure sur place",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Ne repars pas « pour réfléchir ». La bonne conclusion, c'est le présentoir posé et activé avant de partir.",
          },
          {
            type: "steps",
            items: [
              "Propose de le poser tout de suite : « Je vous l'installe et je l'active maintenant, comme ça c'est fait. »",
              "Encaisse le présentoir (achat unique).",
              "Active-le devant lui avec le lien de sa fiche Google, puis fais un scan de test ensemble.",
              "Montre-lui comment souscrire l'abonnement de suivi reviu à 2,99 €/mois pour voir ses statistiques, sans engagement.",
              "Demande une recommandation : « Vous connaissez un autre commerçant à qui ça servirait ? »",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Déployer, fidéliser et passer à l'échelle",
    intro:
      "La vente n'est pas la fin. Bien déployé et suivi, chaque présentoir devient une source de réassort et de recommandation.",
    lessons: [
      {
        title: "Poser et faire vivre le présentoir",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Un présentoir rangé dans un tiroir ne sert personne. Place-le où le client a une seconde de disponible : à la caisse, sur le comptoir, à côté de l'addition ou du terminal de paiement.",
          },
          {
            type: "list",
            items: [
              "Brief l'équipe en une phrase : « Au moment de payer, invitez le client à scanner, tout le monde, pas seulement les habitués. »",
              "Rappelle la règle Google : aucun tri selon l'humeur du client. On propose à tous.",
              "Vérifie l'emplacement à ta prochaine visite : visible, propre, à portée de scan.",
            ],
          },
        ],
      },
      {
        title: "Prouver la valeur avec les statistiques",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "L'abonnement de suivi reviu donne au commerçant ses statistiques de scans et de clics, et centralise les retours privés. C'est ton meilleur argument de fidélisation : des chiffres réels, pas des promesses.",
          },
          {
            type: "list",
            items: [
              "Reviens quelques semaines après la pose : ouvre le tableau de bord avec lui.",
              "Montre l'évolution des scans : c'est concret, c'est le sien, il l'a sous les yeux.",
              "Traite ensemble un retour privé : tu démontres que le canal protège sa réputation.",
            ],
          },
          {
            type: "tip",
            text: "Un commerçant qui voit ses stats garde son abonnement et t'ouvre la porte pour une 2ᵉ adresse ou une recommandation. Le suivi n'est pas ton revenu, mais c'est ton meilleur commercial.",
          },
        ],
      },
      {
        title: "Faire tourner la recommandation et le réassort",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Ton coût d'acquisition le plus bas, c'est un client content. Systématise la recommandation et le réassort.",
          },
          {
            type: "list",
            items: [
              "Demande une intro nominative : « Qui, dans votre réseau, devrait avoir ça ? » puis « Je peux dire que vous m'envoyez ? »",
              "Propose un 2ᵉ présentoir pour une 2ᵉ adresse, une terrasse, un deuxième point de vente.",
              "Repère les commerçants multi-établissements : une vente, plusieurs présentoirs.",
              "Tiens à jour ton stock : commande un nouveau pack avant d'être à sec pour ne jamais rater une vente.",
            ],
          },
        ],
      },
      {
        title: "Organiser ta semaine de revendeur",
        minutes: 4,
        blocks: [
          {
            type: "p",
            text: "Un business de terrain tient sur la régularité, pas sur les coups d'éclat. Cadre ta semaine et suis tes présentoirs déployés depuis ton espace revendeur.",
          },
          {
            type: "list",
            items: [
              "Bloque des créneaux de prospection récurrents : mieux vaut 5 visites par jour, régulières, que 30 d'un coup.",
              "Sépare prospection (nouveaux) et suivi (déjà clients) : deux modes, deux moments.",
              "Suis tes présentoirs attribués et déployés dans /dashboard/revendeur : ce qui est placé, ce qui reste à poser.",
              "Fixe-toi un objectif hebdo simple et mesurable : nombre de démos faites, pas seulement de ventes.",
            ],
          },
          {
            type: "tip",
            text: "Ton espace revendeur est informatif : il te montre tes présentoirs attribués, déployés et les commerçants abonnés. Utilise-le comme tableau de bord de ton activité de terrain.",
          },
        ],
      },
    ],
  },
  {
    title: "Ton plan des 7 premiers jours",
    intro:
      "Assez de théorie. Voici exactement quoi faire cette semaine pour poser ton premier présentoir et enclencher la machine.",
    lessons: [
      {
        title: "Le plan d'action, jour par jour",
        minutes: 5,
        blocks: [
          {
            type: "steps",
            items: [
              "Jour 1 : commande ton pack et active un présentoir de démo sur une fiche de test. Entraîne-toi à faire le scan et la démo devant un proche.",
              "Jour 2 : liste 20 commerces cibles dans ta zone (Google Maps) et note ceux avec peu d'avis ou des avis anciens.",
              "Jour 3 : fais tes 5 premières visites. Objectif = obtenir des scans et faire des démos, pas forcément vendre.",
              "Jour 4 : pose ton premier présentoir chez un client. Active-le devant lui, fais le scan de test, montre l'abonnement de suivi.",
              "Jour 5 : reviens vers les indécis avec une preuve (ton premier client) et demande 2 recommandations.",
              "Jour 6 : suis tes présentoirs déployés dans l'espace revendeur, prépare ta semaine suivante.",
              "Jour 7 : fais le bilan : démos faites, présentoirs posés, objections rencontrées. Ajuste ton discours et recommence.",
            ],
          },
          {
            type: "tip",
            title: "La seule règle qui compte",
            text: "Fais des démos tous les jours. La vente est un jeu de volume et de répétition : plus tu montres le scan, plus tu poses de présentoirs. Le reste suit.",
          },
        ],
      },
    ],
  },
];
