import Link from "next/link";
import { getResellerOverview, getResellerStands } from "@/lib/reseller";
import { StatCard, StatusBadge, formatDate } from "@/components/dashboard/ui";
import { SITE_URL } from "@/lib/brand";

export const metadata = { title: "Espace revendeur — reviu" };

export default async function ResellerPage() {
  const overview = await getResellerOverview();

  if (!overview) return <NotReseller />;

  const stands = await getResellerStands();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Espace revendeur
        </h1>
        <p className="mt-1 text-sm text-muted">
          Le suivi de vos présentoirs placés sur le terrain.
        </p>
      </div>

      {/* KPIs — impact, sans notion de commission */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Présentoirs attribués" value={overview.total_stands} />
        <StatCard label="Déployés (activés)" value={overview.deployed_stands} />
        <StatCard label="Commerçants abonnés" value={overview.active_subs} />
      </div>

      {/* Rappel du modèle + code revendeur */}
      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Votre gain, c&apos;est votre <strong className="font-medium text-ink">marge à la
          revente</strong> du présentoir (acheté remisé en pack). Le suivi reviu
          (abonnement) est ensuite proposé au commerçant par reviu — vous n&apos;avez
          rien à gérer de ce côté. Ce tableau vous montre simplement l&apos;impact de
          votre activité.
        </p>
        <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-center">
          <p className="text-xs text-muted">Votre code revendeur</p>
          <p className="font-mono text-lg font-semibold tracking-widest text-brand">
            {overview.code}
          </p>
        </div>
      </div>

      {/* Liste des présentoirs */}
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">
          Vos présentoirs
        </h2>
        {stands.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            Aucun présentoir attribué pour l&apos;instant. Dès qu&apos;un lot
            vous est attribué, vos présentoirs apparaissent ici.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-sm">
              <thead className="bg-line-soft text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Déployé</th>
                  <th className="px-4 py-3 font-medium">Abonné au suivi</th>
                  <th className="px-4 py-3 font-medium">Activé le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface">
                {stands.map((s) => (
                  <tr key={s.code}>
                    <td className="px-4 py-3 font-mono text-ink">{s.code}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {s.deployed ? "Oui" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {s.sub_active ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          Abonné
                        </span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {s.activated_at ? formatDate(s.activated_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/** Affiché aux comptes qui ne sont pas (encore) revendeurs. */
function NotReseller() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-line bg-surface p-8 text-center">
      <span className="grid mx-auto h-14 w-14 place-items-center rounded-full bg-brand-soft text-2xl">
        🤝
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
        Devenez revendeur reviu
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Achetez des présentoirs en pack remisé, revendez-les aux commerçants de
        votre région et gardez la marge. Un produit facile à vendre : il est
        soutenu par un vrai service (stats, avis, retours privés), pas une simple
        carte NFC.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href={`${SITE_URL}/boutique#produits`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
        >
          Voir les packs revendeurs
        </a>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-canvas px-6 text-sm font-medium text-ink transition-colors hover:border-brand/40"
        >
          Retour au tableau de bord
        </Link>
      </div>
      <p className="mt-5 text-xs text-muted">
        Déjà un pack ? Votre espace s&apos;active dès que vos présentoirs vous
        sont attribués.
      </p>
    </div>
  );
}
