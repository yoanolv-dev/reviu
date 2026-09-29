import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { pop, prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";
import { CounterBackdrop } from "./Backdrops";

/** Pictogrammes au trait (meme esprit que celui imprime sur le presentoir). */
export const METIER_ICONS: Record<string, React.ReactNode> = {
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

const WORDS = ["restaurant", "salon", "boulangerie"] as const;
const STEP = 15; // 1 temps a 120 BPM
const FINALE = 45;

/**
 * "Au comptoir de votre [metier]." (un metier par temps) puis
 * "Sans avoir a demander." Le presentoir reprend la pose de fin de la scene
 * precedente pour un raccord sur la coupe.
 */
export const MetiersScene: React.FC<{ words?: readonly string[] }> = ({ words = WORDS }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(words.length - 1, Math.max(0, Math.floor(frame / STEP)));
  const local = frame - idx * STEP;
  const swapIn = idx === 0 ? 0 : interpolate(local, [0, 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.whip });
  const blockOut = prog(frame, FINALE - 5, 8, EASE.exit);
  const badge = pop(frame, fps, idx * STEP, SPRING.pop);
  const firstIn = prog(frame, -6, 12, EASE.enter);
  const prev = idx > 0 ? words[idx - 1] : null;

  const wordStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    fontFamily: FONT_DISPLAY,
    fontWeight: 800,
    fontSize: 96,
    letterSpacing: "-0.03em",
    color: C.cobalt,
    whiteSpace: "nowrap",
  };
  const Word: React.FC<{ w: string; y: number }> = ({ w, y }) => (
    <div style={{ ...wordStyle, transform: `translateY(${y}%)` }}>
      {w}
      <span style={{ color: C.gold, marginLeft: "-0.06em" }}>.</span>
    </div>
  );

  return (
    <AbsoluteFill>
      <CounterBackdrop horizon={1190} wall={C.white} />
      <div style={{ position: "absolute", left: 100, top: 292, opacity: 1 - blockOut, transform: `translateY(${-blockOut * 40}px)` }}>
        <KineticTitle text={"Au comptoir\nde votre"} size={96} at={-6} stagger={2} />
        <div style={{ position: "relative", height: 124, overflow: "hidden", marginTop: 2 }}>
          {prev && swapIn > 0 && <Word w={prev} y={-(1 - swapIn) * 110} />}
          <Word w={words[idx]} y={idx === 0 ? (1 - firstIn) * 110 : swapIn * 110} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 300 }}>
        <KineticTitle text={"Sans avoir\nà demander"} size={110} at={FINALE} dot accentLast />
      </div>

      <div style={{ position: "absolute", left: 300, top: 640, perspective: 2400 }}>
        <Presentoir3D
          width={460}
          rotateY={interpolate(frame, [0, 105], [-4, 8])}
          rotateX={2}
          thickness={22}
          glare={prog(frame, 50, 40, EASE.inOut)}
          glareStrength={0.3}
        />
      </div>
      {blockOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: 690,
            top: 580,
            width: 150,
            height: 150,
            borderRadius: 46,
            background: C.cobalt,
            display: "grid",
            placeItems: "center",
            transform: `scale(${(0.6 + 0.4 * badge) * (1 - blockOut)}) rotate(${(1 - badge) * -12}deg)`,
            boxShadow: "0 20px 40px -20px rgba(17,57,201,0.6)",
          }}
        >
          <svg width={90} height={90} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
            {METIER_ICONS[words[idx]]}
          </svg>
        </div>
      )}
      <SfxTrack
        cues={[
          ...words.map((_, i) => ["tick", i * STEP] as ["tick", number]),
          ["whoosh-short", FINALE - 3],
        ]}
      />
    </AbsoluteFill>
  );
};
