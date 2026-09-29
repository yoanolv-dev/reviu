import React from "react";
import { KineticTitle } from "../components/KineticTitle";

/**
 * Accroches (3 premieres secondes) interchangeables sur le meme corps de
 * video : seules ces frames changent d'une variante a l'autre (test de hooks).
 * La 1re ligne est deja posee a la frame 0 (vignette, arret du pouce).
 * Toutes restent dans la zone sure (x 100 a 930, a partir de y 292) et au-dessus
 * du presentoir (y 640).
 */
export type HookId = "H1" | "H2" | "H3";

/** Sortie des accroches (la plongee camera commence juste apres). */
export const HOOK_OUT = 82;

export const Hook: React.FC<{ id: HookId }> = ({ id }) => {
  if (id === "H2") {
    return (
      <>
        <KineticTitle text={"Vos clients\nvous adorent"} size={104} at={-8} out={HOOK_OUT} stagger={2} />
        <div style={{ marginTop: 14 }}>
          <KineticTitle text={"Google ne le sait\npas encore"} size={70} at={10} out={HOOK_OUT} stagger={3} accentLast dot />
        </div>
      </>
    );
  }
  if (id === "H3") {
    return (
      <>
        <KineticTitle text={"Nouveau :"} size={70} at={-8} out={HOOK_OUT} />
        <div style={{ marginTop: 6 }}>
          <KineticTitle text={"le présentoir\nd’avis sans appli"} size={100} at={-2} out={HOOK_OUT} stagger={2} accentLast dot />
        </div>
      </>
    );
  }
  return (
    <>
      <KineticTitle text="Un geste" size={120} at={-8} out={HOOK_OUT} stagger={2} />
      <div style={{ marginTop: 10 }}>
        <KineticTitle text={"Votre page d’avis\nGoogle s’ouvre"} size={78} at={6} out={HOOK_OUT} stagger={3} accentLast dot />
      </div>
    </>
  );
};
