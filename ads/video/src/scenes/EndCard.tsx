import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { CheckPill, CtaButton, Logo } from "../components/Bits";
import { SfxTrack } from "../components/Sfx";

/**
 * Carte de fin standard : logo, presentoir (photo exacte), reassurances,
 * bouton "Commander sur reviu.fr". Identique pour toutes les variantes.
 */
export const EndCard: React.FC<{ pills?: string[] }> = ({
  pills = ["Livraison offerte", "30 jours satisfait ou remboursé*"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, fps, 0, SPRING.pop);
  const prod = pop(frame, fps, 2, SPRING.product);
  const tag = pop(frame, fps, 10, SPRING.stamp);
  const float = Math.sin(frame / 18) * 8;
  return (
    <AbsoluteFill style={{ background: C.white }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 292,
          transform: `translateY(${(1 - logo) * -30}px)`,
          opacity: Math.min(1, logo * 2),
        }}
      >
        <Logo height={64} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 220,
          top: 380,
          perspective: 2400,
          transform: `translateY(${(1 - prod) * 260 + float}px) scale(${0.9 + 0.1 * prod})`,
        }}
      >
        <Presentoir3D
          width={440}
          rotateY={interpolate(frame, [0, 120], [-22, -8])}
          rotateX={3}
          thickness={24}
          shadow={0.45}
          glare={prog(frame, 40, 40, EASE.inOut)}
          glareStrength={0.35}
        />
      </div>
      {frame >= 10 && (
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 350 + float * 0.6,
            padding: "14px 26px",
            borderRadius: 999,
            background: C.gold,
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 54,
            letterSpacing: "-0.03em",
            transform: `rotate(${-8 + (1 - tag) * -20}deg) scale(${tag})`,
            boxShadow: "0 14px 30px -14px rgba(10,13,22,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          29,90&nbsp;€
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 150,
          top: 872,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {pills.map((p, i) => (
          <CheckPill key={p} at={14 + i * 6} label={p} size={48} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 540 - 20 - 330, top: 1024 }}>
        <CtaButton at={28} label="Commander sur reviu.fr" width={660} />
      </div>
      <SfxTrack
        cues={[
          ["nfc", 4, 0.5],
          ["pop", 10],
          ["pop", 14],
          ["pop", 20],
          ["whoosh-short", 28],
        ]}
      />
    </AbsoluteFill>
  );
};
