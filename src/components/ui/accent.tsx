import type { ReactNode } from "react";

/**
 * Rend un titre avec son dernier mot en bleu de marque - l'accent éditorial
 * repris du hero d'accueil (« … depuis votre comptoir. »). La ponctuation
 * finale (. ! ? …) reste en couleur d'encre, comme dans le hero, pour un rendu
 * net. À réserver aux titres sur fond clair.
 */
export function accentLastWord(text: string): ReactNode {
  const trimmed = text.trimEnd();
  const punct = trimmed.match(/[.!?…]+$/)?.[0] ?? "";
  const core = punct ? trimmed.slice(0, trimmed.length - punct.length) : trimmed;
  const idx = core.lastIndexOf(" ");
  const head = idx === -1 ? "" : core.slice(0, idx + 1);
  const last = idx === -1 ? core : core.slice(idx + 1);
  return (
    <>
      {head}
      <span className="text-brand">{last}</span>
      {punct}
    </>
  );
}
