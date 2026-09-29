import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, FONT_UI, SPRING } from "../theme";
import { pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { CheckPill, CtaButton, Logo } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";

/**
 * Carte de fin (image de conversion), en deux colonnes :
 * a gauche le nom, le prix et les reassurances ; a droite le presentoir
 * (photo exacte). Dessous, la garantie et le bouton. Les mentions (conditions,
 * TVA) sont posees par la composition sous le bouton.
 * Tout le texte reste dans x 100 a 930 et y 292 a 1064.
 */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, fps, 0, SPRING.pop);
  const prod = pop(frame, fps, 2, SPRING.product);
  const price = pop(frame, fps, 4, SPRING.price);
  const name = prog(frame, 2, 10, EASE.enter);
  const float = Math.sin(frame / 18) * 4;
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

      {/* Colonne gauche */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 392,
          fontFamily: FONT_UI,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: "-0.01em",
          color: C.ink,
          opacity: name,
          transform: `translateY(${(1 - name) * 16}px)`,
        }}
      >
        Présentoir Reviu
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 446,
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: C.ink,
          whiteSpace: "nowrap",
          transform: `scale(${0.8 + 0.2 * price})`,
          transformOrigin: "left center",
          opacity: Math.min(1, price * 2),
        }}
      >
        29<span style={{ margin: "0 -0.05em" }}>,</span>90&nbsp;€
      </div>
      <div style={{ position: "absolute", left: 100, top: 584 }}>
        <KineticTitle text="une seule fois" size={64} at={8} stagger={2} accentLast dot />
      </div>
      <div style={{ position: "absolute", left: 100, top: 674 }}>
        <CheckPill at={14} label="Sans abonnement" />
      </div>
      <div style={{ position: "absolute", left: 100, top: 760 }}>
        <CheckPill at={18} label="Livraison offerte" />
      </div>

      {/* Colonne droite : le presentoir */}
      <div
        style={{
          position: "absolute",
          left: 612,
          top: 396,
          perspective: 2400,
          transform: `translateY(${(1 - prod) * 220 + float}px) scale(${0.9 + 0.1 * prod})`,
        }}
      >
        <Presentoir3D
          width={318}
          rotateY={interpolate(frame, [0, 120], [-18, -8])}
          rotateX={3}
          thickness={20}
          shadow={0.45}
          glare={prog(frame, 40, 40, EASE.inOut)}
          glareStrength={0.35}
        />
      </div>

      <div style={{ position: "absolute", left: 100, right: 150, top: 852, display: "flex", justifyContent: "center" }}>
        <CheckPill at={22} label="30 jours satisfait ou remboursé*" size={61} />
      </div>
      <div style={{ position: "absolute", left: 540 - 20 - 325, top: 942 }}>
        <CtaButton at={28} label="Commander sur reviu.fr" width={650} />
      </div>
      <SfxTrack
        cues={[
          ["nfc", 4, 0.5],
          ["pop", 14],
          ["pop", 18],
          ["pop", 22],
          ["whoosh-short", 28],
        ]}
      />
    </AbsoluteFill>
  );
};
