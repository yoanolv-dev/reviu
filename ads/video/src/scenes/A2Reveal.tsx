import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { Presentoir3D, FACE_RATIO } from "../components/Presentoir3D";
import { KineticTitle } from "../components/KineticTitle";

const W = 500;
/** Produit decale a droite : le "G" imprime tombe vers x 620, jamais au centre. */
const LEFT = 370;
const TOP = 592;

/**
 * A2, revelation sur cobalt (75 frames) : le presentoir (photo exacte)
 * monte dans le champ en tournant de -28 a -8 deg, un reflet balaie la face,
 * titre "Le Presentoir Reviu." en blanc avec le point dore.
 */
export const A2Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const H = W * FACE_RATIO;
  const rise = prog(frame, -5, 24, EASE.enter);
  // Rotation lineaire sur toute la scene (le produit ne se fige jamais).
  const rotY = interpolate(frame, [0, 75], [-28, -8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(frame / 13) * 10 * prog(frame, 16, 20, EASE.inOut);
  // Poussee continue qui accelere dans la coupe (vers la zone de contact, pas vers le logo).
  const pushIn = 1 + 0.08 * prog(frame, 16, 59, (t) => t) + 0.08 * prog(frame, 40, 35, EASE.in);
  const ring = prog(frame, 0, 20, EASE.out);
  const halo = prog(frame, 0, 18, EASE.enter);
  return (
    <AbsoluteFill style={{ background: C.cobalt }}>
      {/* Halo blanc doux derriere le produit (detache le bleu imprime du cobalt). */}
      <div
        style={{
          position: "absolute",
          left: LEFT + W / 2 - 520,
          top: TOP + H / 2 - 520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,255,255,0.30), rgba(255,255,255,0.10) 55%, rgba(255,255,255,0) 100%)",
          opacity: halo,
          transform: `scale(${0.8 + 0.2 * halo})`,
        }}
      />
      {ring < 1 && (
        <div
          style={{
            position: "absolute",
            left: LEFT + W / 2 - 400,
            top: TOP + H / 2 - 400,
            width: 800,
            height: 800,
            borderRadius: "50%",
            border: "14px solid rgba(255,255,255,0.55)",
            transform: `scale(${0.35 + ring * 1.1})`,
            opacity: 1 - ring,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: TOP,
          perspective: 2400,
          transform: `translateY(${(1 - rise) * 420 + float}px) scale(${(0.92 + 0.08 * rise) * pushIn})`,
          transformOrigin: "30% 70%",
        }}
      >
        <Presentoir3D
          width={W}
          rotateY={rotY}
          rotateX={3}
          thickness={24}
          shadow={0.6}
          focusBlur={8}
          glare={prog(frame, 8, 66, (t) => t)}
          glareStrength={0.4}
        />
      </div>
      <div style={{ position: "absolute", left: 100, top: 300 }}>
        <KineticTitle text={"Le Présentoir\nReviu"} size={108} color={C.white} at={2} stagger={3} dot />
      </div>
    </AbsoluteFill>
  );
};
