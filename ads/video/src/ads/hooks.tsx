import React from "react";
import { KineticTitle } from "../components/KineticTitle";

/**
 * Accroches (2 premieres secondes) interchangeables sur le meme corps de
 * video : seules ces frames changent d'une variante a l'autre (test de hooks).
 * Toutes restent dans la zone sure (x 100 a 930, a partir de y 290).
 */
export type HookId = "H1" | "H2" | "H3";

export const HOOK_OUT = 54;

export const Hook: React.FC<{ id: HookId }> = ({ id }) => {
  if (id === "H2") {
    return (
      <>
        <KineticTitle text={"Vos clients\nvous adorent."} size={104} at={4} out={HOOK_OUT} stagger={3} />
        <div style={{ marginTop: 18 }}>
          <KineticTitle text={"Google ne le sait\npas encore"} size={74} at={18} out={HOOK_OUT} accentLast dot />
        </div>
      </>
    );
  }
  if (id === "H3") {
    return (
      <>
        <KineticTitle text={"Nouveau :"} size={74} at={4} out={HOOK_OUT} />
        <div style={{ marginTop: 6 }}>
          <KineticTitle text={"le présentoir\nd'avis sans appli"} size={104} at={10} out={HOOK_OUT} accentLast dot />
        </div>
      </>
    );
  }
  return (
    <>
      <KineticTitle text="Un geste." size={150} at={4} out={HOOK_OUT} />
      <div style={{ marginTop: 14 }}>
        <KineticTitle text={"Votre page d'avis\ns'ouvre"} size={78} at={14} out={HOOK_OUT} accentLast dot />
      </div>
    </>
  );
};
