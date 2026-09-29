import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, SPRING } from "../theme";
import { pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { CheckPill } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";

/**
 * A3, apres la demo (90 frames) : le nom du produit (« Présentoir Reviu. »),
 * puis ses trois caracteristiques en coches sur les temps, le presentoir en
 * dessous a droite (G hors de l'axe central, bas vers y 1143 : au-dessus du
 * bandeau TVA pose a 420). L'ordre des coches suit leur temps de lecture
 * (la plus longue d'abord) : chacune reste au moins max(25 ; 2 x caracteres)
 * + 8 frames avant la coupe. Le titre part a 6 : il monte quand la vague
 * cobalt libere le haut de l'ecran.
 */
export const A3C = {
  pills: [15, 30, 45],
  labels: ["Sans contact ou QR code", "Statistiques incluses", "Lien modifiable"],
  dur: 90,
} as const;

export const A3Checks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prod = pop(frame, fps, 0, SPRING.product);
  const float = Math.sin(frame / 16) * 4;
  return (
    <AbsoluteFill style={{ background: C.brume }}>
      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text="Présentoir Reviu" size={100} at={6} stagger={3} accentLast dot />
      </div>
      {A3C.pills.map((at, i) => (
        <div key={i} style={{ position: "absolute", left: 100, top: 446 + i * 96 }}>
          <CheckPill at={at} label={A3C.labels[i]} />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 470,
          top: 736,
          perspective: 2400,
          transform: `translateY(${(1 - prod) * 260 + float}px)`,
        }}
      >
        <Presentoir3D
          width={380}
          rotateY={interpolate(frame, [0, A3C.dur], [-12, -18])}
          rotateX={3}
          thickness={22}
          shadow={0.5}
          glare={prog(frame, 36, 40, EASE.inOut)}
          glareStrength={0.35}
          focusBlur={6}
        />
      </div>
      <SfxTrack cues={A3C.pills.map((at) => ["pop", at + 1] as ["pop", number])} />
    </AbsoluteFill>
  );
};
