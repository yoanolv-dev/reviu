import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Presentoir3D } from "./components/Presentoir3D";
import { Phone } from "./components/Phone";
import { ReviewScreen } from "./components/ReviewScreen";
import { KineticTitle } from "./components/KineticTitle";

/** Banc d'essai des composants (non exporte en pub). */
export const Lab: React.FC = () => {
  const f = useCurrentFrame();
  const ry = interpolate(f, [0, 90], [-28, 18]);
  return (
    <AbsoluteFill style={{ background: C.brume }}>
      <div style={{ position: "absolute", top: 260, left: 72 }}>
        <KineticTitle text={"Vos clients\nvous adorent"} size={120} accentLast dot at={0} />
      </div>
      <div style={{ position: "absolute", top: 620, left: 90, perspective: 2200 }}>
        <Presentoir3D width={560} rotateY={ry} rotateX={6} glare={f / 90} thickness={24} />
      </div>
      <div style={{ position: "absolute", top: 1040, left: 640, transform: "rotate(-6deg)" }}>
        <Phone width={360}>
          <ReviewScreen width={360 - 360 * 0.07} starsAt={20} textAt={45} publishAt={70} />
        </Phone>
      </div>
    </AbsoluteFill>
  );
};
