import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { mix, pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { CheckPill } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";

/**
 * Tampon du prix pour la coupe de 15 s (copie de PriceStamp) : 180 px (plage
 * 140 a 180 du brief), echelle de depart 1,6 au lieu de 2,3 et origine au bord
 * gauche, pour que le prix reste dans la zone sure (x 100 a 930) des la frame
 * du coup final.
 */
export const A1CPriceStamp: React.FC<{ at: number; size?: number; color?: string }> = ({ at, size = 180, color = C.white }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Ressort avance de 2 frames : le prix est deja lisible sur le coup final.
  const s = pop(frame + 2, fps, at, SPRING.stamp);
  const wave = prog(frame, at, 18, EASE.out);
  if (frame < at) return null;
  return (
    <div style={{ position: "relative" }}>
      {wave < 1 && (
        <div
          style={{
            position: "absolute",
            left: size * 1.2 - size,
            top: size * 0.55 - size,
            width: size * 2,
            height: size * 2,
            borderRadius: "50%",
            border: `${size * 0.05}px solid rgba(255,255,255,0.5)`,
            transform: `scale(${0.3 + wave * 1.6})`,
            opacity: 1 - wave,
          }}
        />
      )}
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color,
          whiteSpace: "nowrap",
          transform: `scale(${mix(1.6, 1, s)}) rotate(${mix(-10, -2, s)}deg)`,
          transformOrigin: "0% 60%",
          opacity: Math.min(1, s * 3),
        }}
      >
        29<span style={{ margin: "0 -0.05em" }}>,</span>90&nbsp;€
      </div>
    </div>
  );
};

/**
 * Copie de PriceScene pour la coupe de 15 s. Pendant toute la scene, deux
 * bandeaux sont empiles en bas de la zone sure (independance en lift 109,
 * y 1038 a 1139, jusqu’a 312 ; TVA en bas des 234) : tout reste au-dessus
 * de y 1018. Le presentoir entre par la droite (il ne passe jamais sous les
 * bandeaux), tourne, flotte et recoit un reflet ; les textes vivent sur un
 * calque a part, pousse lentement depuis leur coin haut gauche (x 100).
 */
export const A1CPrice: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = prog(frame, 0, 14, EASE.enter);
  const float = -8 * Math.sin((frame / 60) * Math.PI);
  const push = 1 + 0.03 * prog(frame, 14, 46, EASE.inOut);
  return (
    <AbsoluteFill style={{ background: C.cobalt }}>
      <div style={{ position: "absolute", left: 648, top: 690, perspective: 2400 }}>
        <Presentoir3D
          width={300}
          rotateY={interpolate(frame, [0, 60], [-30, -12])}
          rotateZ={4}
          thickness={20}
          shadow={0}
          glare={prog(frame, 22, 30, EASE.inOut)}
          glareStrength={0.3}
          style={{ transform: `translateX(${(1 - enter) * 420}px) translateY(${float}px)` }}
        />
      </div>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "100px 330px" }}>
        <div style={{ position: "absolute", left: 108, top: 330 }}>
          <A1CPriceStamp at={0} size={180} />
        </div>
        <div style={{ position: "absolute", left: 104, top: 545 }}>
          <KineticTitle text="une seule fois" size={92} color={C.white} at={8} dot />
        </div>
        <div style={{ position: "absolute", left: 100, top: 695 }}>
          <CheckPill at={12} label="Sans abonnement" dark />
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          // Plus bas que dans le master : le coup final de la musique tombe
          // deja sur la frame 0 de la scene (240).
          ["impact", 2, 0.65],
          ["whoosh-short", 8, 0.6],
          ["pop", 12],
        ]}
      />
    </AbsoluteFill>
  );
};
