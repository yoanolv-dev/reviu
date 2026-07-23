import { Container } from "@/components/ui/container";

/** Coquille commune aux pages légales : titre, date de mise à jour, prose lisible. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">Dernière mise à jour : {updated}</p>
      <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </Container>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 font-display text-xl font-semibold text-ink">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="flex list-disc flex-col gap-1.5 pl-5">{children}</ul>;
}

/** Marque un champ à compléter par l'éditeur (visible volontairement). */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-accent-soft px-1 py-0.5 text-ink">
      [{children}]
    </mark>
  );
}
