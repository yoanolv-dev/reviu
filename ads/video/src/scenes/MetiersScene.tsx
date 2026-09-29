import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";
import { Mention } from "../components/Legal";
import { CounterBackdrop } from "./Backdrops";

/** Pictogrammes au trait (meme esprit que celui imprime sur le presentoir). */
const ICONS: Record<string, React.ReactNode> = {
  restaurant: (
    <g>
      <path d="M16 8v12a4 4 0 0 0 8 0V8M20 8v32" />
      <path d="M33 40V8c-4 3-5 9-5 14h5" />
    </g>
  ),
  salon: (
    <g>
      <circle cx="15" cy="34" r="5.5" />
      <circle cx="33" cy="34" r="5.5" />
      <path d="M19 30 34 8M29 30 14 8" />
    </g>
  ),
  garage: <path d="M30 9a8 8 0 0 0-7.6 10.4L10 31.8a3.5 3.5 0 1 0 5 5l12.4-12.4A8 8 0 0 0 38 17l-5 1-3-3 1-5z" />,
  boulangerie: (
    <g>
      <path d="M9 30c0-9 7-16 15-16s15 7 15 16c0 3-2 5-5 5H14c-3 0-5-2-5-5z" />
      <path d="M18 18l3 8M26 16l2 9M33 20l-1 7" />
    </g>
  ),
  boutique: (
    <g>
      <path d="M11 16h26l-2 24H13z" />
      <path d="M18 20v-6a6 6 0 0 1 12 0v6" />
    </g>
  ),
  hôtel: (
    <g>
      <path d="M7 36V14M7 28h34v8M41 28v-5a5 5 0 0 0-5-5H22v10" />
      <circle cx="14.5" cy="22" r="3.5" />
    </g>
  ),
};

const WORDS = ["restaurant", "salon", "garage", "boulangerie", "boutique", "hôtel"] as const;
const STEP = 11;

/** "Au comptoir de votre [metier]" puis "Au bon moment." */
export const MetiersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(WORDS.length - 1, Math.max(0, Math.floor((frame - 4) / STEP)));
  const local = frame - 4 - idx * STEP;
  const wordIn = interpolate(local, [0, 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.enter });
  const finale = 72;
  const firstOut = prog(frame, finale - 6, 8, EASE.exit);
  const badge = pop(frame, fps, 4 + idx * STEP, SPRING.pop);
  const badgeOut = prog(frame, finale - 4, 8, EASE.exit);

  return (
    <AbsoluteFill>
      <CounterBackdrop horizon={1190} wall={C.white} />
      <div style={{ position: "absolute", left: 100, top: 300, opacity: 1 - firstOut, transform: `translateY(${-firstOut * 40}px)` }}>
        <KineticTitle text="Au comptoir de votre" size={66} at={0} />
        <div
          style={{
            height: 150,
            overflow: "hidden",
            marginTop: 4,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 124,
            letterSpacing: "-0.03em",
            color: C.cobalt,
            lineHeight: 1.15,
          }}
        >
          {frame >= 4 && (
            <div style={{ transform: `translateY(${wordIn * 100}%)` }}>{WORDS[idx]}</div>
          )}
        </div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 330 }}>
        <KineticTitle text={"Au bon\nmoment"} size={124} at={finale} dot accentLast />
      </div>

      <div style={{ position: "absolute", left: 250, top: 620, perspective: 2400 }}>
        <Presentoir3D width={540} rotateY={interpolate(frame, [0, 105], [-20, -8])} rotateX={2} thickness={24} glare={prog(frame, 70, 34, EASE.inOut)} glareStrength={0.3} />
      </div>
      {frame >= 4 && badgeOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 540,
            width: 170,
            height: 170,
            borderRadius: 52,
            background: C.cobalt,
            display: "grid",
            placeItems: "center",
            transform: `scale(${(0.6 + 0.4 * badge) * (1 - badgeOut)}) rotate(${(1 - badge) * -12}deg)`,
            boxShadow: "0 20px 40px -20px rgba(17,57,201,0.6)",
          }}
        >
          <svg width={100} height={100} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
            {ICONS[WORDS[idx]]}
          </svg>
        </div>
      )}
      <Mention from={6} to={100} text="Reviu est un service indépendant de Google. Google est une marque de Google LLC." />
      <SfxTrack
        cues={[
          ...WORDS.map((_, i) => ["tick", 4 + i * STEP] as ["tick", number]),
          ["whoosh-short", finale],
        ]}
      />
    </AbsoluteFill>
  );
};
