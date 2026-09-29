import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { CheckPill } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";
import { PriceStamp } from "./PriceScene";

/**
 * Accroche A4 "29,90 €. Une fois." sur cobalt, 60 frames (1 mesure), reperes locaux :
 * 0 l'offre entiere est deja sur la 1re image ("29,90 €" tamponne, "Une fois"
 * presque pose, point dore vers 2), 15 pastille "Sans abonnement" (sur le temps),
 * 60 coupe sur le 1er temps de la mesure 2.
 * Mise en page (y) : prix 330 a 560, "Une fois." 590 a 715, pastille 752 a 834
 * (x 108 a ~650 avec la poussee de 3 %). Presentoir de 3/4 a droite, x >= ~683,
 * y ~622 a ~1008 (flottement et poussee compris) : au moins 30 px d'air avec la
 * pastille et avec les deux bandeaux empiles de la composition (y >= 1038).
 * Mouvement continu jusqu'a la coupe : poussee lineaire, rotation, reflet de 26 a 60.
 */
export const A4_HOOK = { duration: 60, fois: -8, pill: 15 } as const;

const PW = 340;
const PLEFT = 690;
const PTOP = 636;

export const A4Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const H = A4_HOOK;
  // Le presentoir vit : rotation lente, flottement, reflet qui passe.
  const float = Math.sin(frame / 16) * 5;
  // Poussee lineaire : encore en mouvement sur la coupe.
  const drift = interpolate(frame, [0, H.duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.cobalt }}>
      {/* Halo doux derriere le produit (le detache du cobalt). */}
      <div
        style={{
          position: "absolute",
          left: PLEFT + PW / 2 - 420,
          top: PTOP + 180 - 420,
          width: 840,
          height: 840,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(255,255,255,0.26), rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PLEFT,
          top: PTOP,
          perspective: 2400,
          transform: `translateY(${float}px) scale(${1 + 0.04 * drift})`,
          transformOrigin: "50% 60%",
        }}
      >
        <Presentoir3D
          width={PW}
          rotateY={interpolate(frame, [0, H.duration], [-26, -10])}
          rotateX={3}
          rotateZ={3}
          thickness={22}
          shadow={0}
          // Reflet a droite du logo imprime (centre de 0,82 a 1,3 de la largeur).
          glare={0.7 + 0.3 * prog(frame, 26, 34, EASE.inOut)}
          glareStrength={0.32}
          focusBlur={8}
        />
      </div>

      {/* Bloc texte ancre en haut a gauche (x 108, y 330) : lente poussee
          de camera (+3 %) ; le bord gauche ne bouge pas, et le rebond du
          tampon a la frame 0 reste dans la zone sure. */}
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 330,
          transform: `scale(${1 + 0.03 * drift})`,
          transformOrigin: "0px 0px",
        }}
      >
        <PriceStamp at={-6} size={216} />
        <div style={{ position: "absolute", left: 4, top: 260 }}>
          <KineticTitle text="Une fois" size={120} color={C.white} at={H.fois} stagger={2} dot />
        </div>
        <div style={{ position: "absolute", left: 0, top: 422 }}>
          <CheckPill at={H.pill} label="Sans abonnement" dark />
        </div>
      </div>

      <SfxTrack
        cues={[
          ["impact", 0, 0.75],
          ["pop", H.pill, 0.7],
        ]}
      />
    </AbsoluteFill>
  );
};
