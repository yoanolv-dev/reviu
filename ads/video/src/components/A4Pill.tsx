import React from "react";
import { interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_DISPLAY, SPRING } from "../theme";
import { clamp01, pop, prog } from "../lib/anim";

/**
 * Copie A4 de CheckPill (Bits.tsx), sur fond clair, avec une mise en avant :
 * `hi` (0 a 1) fait passer la pastille du blanc au cobalt, le texte de l'encre
 * au blanc, et le cercle de la coche du cobalt au blanc (la coche devient
 * cobalt), pour que l'icone reste lisible sur le cobalt.
 * Memes metriques que CheckPill : texte >= 44 px, largeur max 830 px.
 */
export const A4Pill: React.FC<{
  at: number;
  label: string;
  size?: number;
  hi?: number;
  style?: React.CSSProperties;
}> = ({ at, label, size = 64, hi = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.snappy);
  const draw = prog(frame, at + 3, 10);
  if (frame < at) return null;
  const font = Math.max(44, size * 0.72);
  const icon = font * 1.1;
  const h = clamp01(hi);
  const bg = interpolateColors(h, [0, 1], [C.white, C.cobalt]);
  const fg = interpolateColors(h, [0, 1], [C.ink, C.white]);
  const circle = interpolateColors(h, [0, 1], [C.cobalt, C.white]);
  const check = interpolateColors(h, [0, 1], [C.white, C.cobalt]);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: font * 0.42,
        padding: `12px ${font * 0.75}px 12px ${font * 0.34}px`,
        borderRadius: 999,
        maxWidth: 830,
        boxSizing: "border-box",
        background: bg,
        boxShadow: `0 1px 2px rgba(10,13,22,0.06), 0 14px 30px -18px rgba(17,57,201,${0.35 + 0.4 * h})`,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: font,
        letterSpacing: "-0.015em",
        color: fg,
        transform: `translateX(${(1 - s) * -40}px) scale(${0.85 + 0.15 * s})`,
        transformOrigin: "left center",
        opacity: clamp01(s * 1.5),
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <circle cx={12} cy={12} r={12} fill={circle} />
        <path
          d="M7 12.4l3.2 3.1L17 8.8"
          fill="none"
          stroke={check}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={16}
          strokeDashoffset={16 * (1 - draw)}
        />
      </svg>
      {label}
    </div>
  );
};
