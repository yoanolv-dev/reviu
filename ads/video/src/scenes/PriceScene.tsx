import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { mix, pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { CheckPill } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";

/** Tampon du prix (une seule fois par video), avec onde de choc. */
export const PriceStamp: React.FC<{ at: number; size?: number; color?: string }> = ({ at, size = 200, color = C.white }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.stamp);
  const wave = prog(frame, at + 2, 18, EASE.out);
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
          transform: `scale(${mix(2.3, 1, s)}) rotate(${mix(-10, -2, s)}deg)`,
          transformOrigin: "30% 60%",
          opacity: Math.min(1, s * 3),
        }}
      >
        29,90&nbsp;€
      </div>
    </div>
  );
};

/** "29,90 €, une seule fois." + sans abonnement, sur fond cobalt. */
export const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.cobalt }}>
      <div style={{ position: "absolute", left: 100, top: 330 }}>
        <PriceStamp at={0} size={210} />
      </div>
      <div style={{ position: "absolute", left: 104, top: 570 }}>
        <KineticTitle text="une seule fois" size={92} color={C.white} at={8} dot />
      </div>
      <div style={{ position: "absolute", left: 100, top: 720 }}>
        <CheckPill at={20} label="Sans abonnement" dark size={56} />
      </div>
      <div style={{ position: "absolute", left: 590, top: 760, perspective: 2400 }}>
        <Presentoir3D
          width={360}
          rotateY={interpolate(frame, [0, 60], [-26, -18])}
          rotateZ={4}
          thickness={22}
          shadow={0}
          style={{ transform: `translateY(${(1 - prog(frame, 0, 14, EASE.enter)) * 500}px)` }}
        />
      </div>
      <SfxTrack
        cues={[
          ["impact", 2],
          ["whoosh-short", 8],
          ["pop", 20],
        ]}
      />
    </AbsoluteFill>
  );
};
