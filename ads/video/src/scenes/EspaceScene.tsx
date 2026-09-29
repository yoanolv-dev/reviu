import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, SPRING } from "../theme";
import { mix, pop, prog } from "../lib/anim";
import { Phone } from "../components/Phone";
import { DashboardScreen } from "../components/PhoneScreens";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";

const W = 460;
const LEFT = 540 - W / 2;
const TOP = 560;
// Points d'interet dans le telephone (px, repere du telephone) : tuiles de
// scans et carte "Lien du presentoir" (voir DashboardScreen).
const STATS = { x: W / 2, y: 238 };
const LINK = { x: W / 2, y: 504 };

/**
 * Espace Reviu inclus : la camera plonge sur les scans (chiffres d'exemple),
 * glisse vers le lien du presentoir, puis on le modifie.
 */
export const EspaceScene: React.FC<{ duration?: number }> = ({ duration = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = pop(frame, fps, 0, SPRING.notif);
  const swapAt = 58;
  const editAt = 86;

  const zoomIn = pop(frame, fps, 18, SPRING.camera);
  const toLink = prog(frame, 56, 22, EASE.move);
  const Z = mix(1, mix(1.5, 1.42, toLink), zoomIn);
  const F = { x: mix(STATS.x, LINK.x, toLink), y: mix(STATS.y, LINK.y, toLink) };
  const T = { x: 540, y: mix(mix(TOP + STATS.y, 900, zoomIn), 1020, toLink) };
  const dx = T.x - (LEFT + F.x);
  const dy = T.y - (TOP + F.y);
  const tilt = interpolate(frame, [0, duration], [-6, 5]);

  return (
    <AbsoluteFill style={{ background: C.brume }}>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: TOP,
          transformOrigin: `${F.x}px ${F.y}px`,
          transform: `translate(${dx}px, ${dy + (1 - inP) * 1000}px) scale(${Z}) perspective(1800px) rotateY(${tilt}deg)`,
        }}
      >
        <Phone width={W}>
          <DashboardScreen width={W * 0.93} countAt={16} editAt={editAt} newLinkAt={editAt + 5} />
        </Phone>
      </div>
      {/* Degrade qui degage la zone de titre quand la camera remonte. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 600,
          background: `linear-gradient(180deg, ${C.brume} 0%, ${C.brume} 72%, rgba(237,241,255,0) 100%)`,
          opacity: toLink,
        }}
      />
      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text={"Espace Reviu\ninclus"} size={100} at={2} out={swapAt - 8} dot accentLast />
      </div>
      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text={"Changez le lien\nà tout moment"} size={86} at={swapAt} out={duration + 2} dot accentLast />
      </div>
      <SfxTrack
        cues={[
          ["swipe-up", 4],
          ...[16, 19, 22, 25, 28, 31, 34, 37].map((f) => ["tick", f] as ["tick", number]),
          ["whoosh-short", swapAt],
          ["click", editAt],
          ["pop", editAt + 6],
        ]}
      />
    </AbsoluteFill>
  );
};
