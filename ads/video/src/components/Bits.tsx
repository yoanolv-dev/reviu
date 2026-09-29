import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, FONT_UI, SAFE, SPRING, VIDEO } from "../theme";
import { clamp01, pop, prog } from "../lib/anim";
import { Star } from "./Star";

/** Ondes "sans contact" qui partent du point de contact. */
export const NfcWaves: React.FC<{ at: number; size: number; color?: string; count?: number; style?: React.CSSProperties }> = ({
  at,
  size,
  color = C.cobalt,
  count = 3,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      {Array.from({ length: count }, (_, i) => {
        const t = prog(frame, at + i * 5, 26, EASE.out);
        if (t <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `${size * 0.032}px solid ${color}`,
              transform: `scale(${0.2 + t * 1.1})`,
              opacity: (1 - t) * 0.9,
            }}
          />
        );
      })}
    </div>
  );
};

/** Notification facon smartphone (generique : icone etoile, pas d'application nommee). */
export const Notification: React.FC<{
  at: number;
  title: string;
  body: string;
  width?: number;
  meta?: string;
  style?: React.CSSProperties;
}> = ({ at, title, body, width = 820, meta = "maintenant", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.snappy);
  if (frame < at) return null;
  const u = width / 100;
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        padding: `${u * 3.2}px ${u * 3.6}px`,
        borderRadius: u * 5.2,
        background: "rgba(255,255,255,0.94)",
        boxShadow: "0 1px 2px rgba(10,13,22,0.08), 0 24px 50px -20px rgba(10,13,22,0.35)",
        display: "flex",
        gap: u * 3,
        alignItems: "center",
        fontFamily: FONT_UI,
        transform: `translateY(${(1 - s) * -60}px) scale(${0.9 + 0.1 * s})`,
        opacity: clamp01(s * 1.4),
        ...style,
      }}
    >
      <div
        style={{
          width: u * 11,
          height: u * 11,
          borderRadius: u * 2.8,
          background: C.gold,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Star size={u * 7} color={C.white} empty={C.white} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 700, fontSize: u * 4.2, color: C.ink }}>{title}</span>
          <span style={{ fontSize: u * 3.2, color: C.ardoise }}>{meta}</span>
        </div>
        <div style={{ fontSize: u * 3.9, color: C.inkSoft, marginTop: u * 0.6, display: "flex", alignItems: "center", gap: u * 1.2 }}>
          {body}
        </div>
      </div>
    </div>
  );
};

/** Rangee d'etoiles qui se remplissent une a une. */
export const StarRow: React.FC<{ at: number; size: number; gap?: number; stagger?: number; empty?: string; style?: React.CSSProperties }> = ({
  at,
  size,
  gap = size * 0.14,
  stagger = 3,
  empty = "rgba(255,255,255,0.25)",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap, ...style }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = at + i * stagger;
        const s = pop(frame, fps, a, SPRING.pop);
        const on = frame >= a;
        return (
          <Star
            key={i}
            size={size}
            fill={on ? 1 : 0}
            empty={empty}
            style={{ transform: `scale(${on ? 0.6 + 0.4 * s + 0.2 * Math.sin(Math.min(1, s) * Math.PI) : 1}) rotate(${on ? (1 - s) * -25 : 0}deg)` }}
          />
        );
      })}
    </div>
  );
};

/** Pastille de reassurance avec coche. */
export const CheckPill: React.FC<{
  at: number;
  label: string;
  size?: number;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ at, label, size = 50, dark = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.snappy);
  const draw = prog(frame, at + 3, 10);
  if (frame < at) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.36,
        padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.3}px ${size * 0.34}px`,
        borderRadius: size,
        background: dark ? "rgba(255,255,255,0.12)" : C.white,
        boxShadow: dark ? "inset 0 0 0 2px rgba(255,255,255,0.18)" : "0 1px 2px rgba(10,13,22,0.06), 0 14px 30px -18px rgba(17,57,201,0.35)",
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: size * 0.72,
        letterSpacing: "-0.01em",
        color: dark ? C.white : C.ink,
        transform: `translateX(${(1 - s) * -40}px) scale(${0.85 + 0.15 * s})`,
        opacity: clamp01(s * 1.5),
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx={12} cy={12} r={12} fill={dark ? C.white : C.cobalt} />
        <path
          d="M7 12.4l3.2 3.1L17 8.8"
          fill="none"
          stroke={dark ? C.cobalt : C.white}
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

/** Bouton d'appel a l'action. */
export const CtaButton: React.FC<{ at: number; label: string; width?: number; pulse?: boolean; style?: React.CSSProperties }> = ({
  at,
  label,
  width = 760,
  pulse = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.pop);
  if (frame < at) return null;
  const beat = pulse ? 1 + 0.03 * Math.max(0, Math.sin(((frame - at - 12) / 15) * Math.PI)) * (frame > at + 12 ? 1 : 0) : 1;
  return (
    <div
      style={{
        width,
        height: width * 0.19,
        borderRadius: width * 0.1,
        background: C.gold,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: width * 0.025,
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: width * 0.068,
        letterSpacing: "-0.02em",
        boxShadow: "0 18px 40px -18px rgba(251,188,4,0.8)",
        transform: `scale(${s * beat})`,
        ...style,
      }}
    >
      {label}
      <svg width={width * 0.06} height={width * 0.06} viewBox="0 0 24 24">
        <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Logo Reviu (SVG de la charte). */
export const Logo: React.FC<{ variant?: "blanc" | "couleur"; height: number; style?: React.CSSProperties }> = ({
  variant = "couleur",
  height,
  style,
}) => (
  <Img
    src={staticFile(`img/reviu-logo-horizontal-${variant}.svg`)}
    style={{ height, width: height * (658.81 / 200), ...style }}
  />
);

/** Vague de la charte (celle qui separe le bleu et le blanc sur le presentoir). */
export const WAVE_PATH = (w: number, h: number, amp: number, phase = 0) => {
  const n = 24;
  let d = `M0 ${h} L0 ${amp}`;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * w;
    const y = amp + Math.sin((i / n) * Math.PI * 1.35 + 0.5 + phase) * amp * 0.9;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${w} ${h} Z`;
};

/**
 * Transition "vague" : une nappe de couleur monte avec le bord ondule du
 * presentoir. progress 0 -> 1 couvre l'ecran de bas en haut.
 */
export const WaveWipe: React.FC<{ progress: number; color: string; accent?: string; flip?: boolean }> = ({
  progress,
  color,
  accent = "rgba(237,241,255,0.9)",
  flip = false,
}) => {
  const frame = useCurrentFrame();
  if (progress <= 0) return null;
  const W = VIDEO.width;
  const H = VIDEO.height;
  const amp = 90;
  const top = interpolate(progress, [0, 1], [H + amp * 2, -amp * 2.2]);
  const phase = frame * 0.06;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <g transform={`translate(0 ${top - 26})`}>
        <path d={WAVE_PATH(W, H + amp * 4, amp, phase)} fill={accent} />
      </g>
      <g transform={`translate(0 ${top})`}>
        <path d={WAVE_PATH(W, H + amp * 4, amp, phase)} fill={color} />
      </g>
    </svg>
  );
};

/** Surcouche de controle des zones sures (rendu de verification uniquement). */
export const SafeZones: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: SAFE.top, background: "rgba(255,0,80,0.28)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: SAFE.bottom, background: "rgba(255,0,80,0.28)" }} />
    <div style={{ position: "absolute", right: 0, top: SAFE.top, bottom: SAFE.bottom, width: SAFE.right, background: "rgba(255,120,0,0.25)" }} />
    <div style={{ position: "absolute", left: 0, top: SAFE.top, bottom: SAFE.bottom, width: SAFE.left, background: "rgba(255,120,0,0.25)" }} />
  </div>
);

/** Grain tres leger pour eviter l'aspect "trop numerique" des aplats. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const seed = frame % 4;
  return (
    <svg width={VIDEO.width} height={VIDEO.height} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id={`g${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={seed} stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${seed})`} />
    </svg>
  );
};

export { interpolate };
