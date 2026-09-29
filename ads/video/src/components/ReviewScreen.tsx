import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_UI, SPRING } from "../theme";
import { clamp01, pop, prog } from "../lib/anim";
import { Star } from "./Star";

type Props = {
  /** Largeur de l'ecran (px), pour les unites relatives. */
  width: number;
  /** Frame (dans la sequence) ou les etoiles commencent a se remplir. */
  starsAt: number;
  /** Frame ou le texte se "tape". */
  textAt: number;
  /** Frame ou l'on appuie sur Publier. */
  publishAt: number;
  businessName?: string;
};

/**
 * Ecran "Ecrire un avis" stylise (meme parti pris que la demo du site :
 * generique, sans reproduire l'interface de Google a l'identique).
 */
export const ReviewScreen: React.FC<Props> = ({ width, starsAt, textAt, publishAt, businessName = "Votre commerce" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = width / 100;
  const starGap = 3.2; // frames entre deux etoiles
  const labelIn = prog(frame, starsAt + starGap * 5, 8);
  const typed = prog(frame, textAt, 22);
  const press = pop(frame, fps, publishAt, SPRING.snappy);
  const done = clamp01((frame - publishAt - 4) / 6);
  const btnScale = frame >= publishAt && frame < publishAt + 5 ? 0.94 : 1;

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT_UI, color: C.ink, background: C.white }}>
      {/* En-tete */}
      <div
        style={{
          position: "absolute",
          top: u * 14,
          left: u * 7,
          right: u * 7,
          display: "flex",
          alignItems: "center",
          gap: u * 3.5,
          paddingBottom: u * 4.5,
          borderBottom: `${Math.max(1, u * 0.3)}px solid ${C.line}`,
        }}
      >
        <div
          style={{
            width: u * 12,
            height: u * 12,
            borderRadius: "50%",
            background: C.cobalt,
            color: C.white,
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: u * 5.4,
          }}
        >
          V
        </div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontWeight: 700, fontSize: u * 5 }}>{businessName}</div>
          <div style={{ fontSize: u * 3.8, color: C.ardoise }}>Écrire un avis</div>
        </div>
      </div>

      {/* Etoiles */}
      <div
        style={{
          position: "absolute",
          top: u * 42,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: u * 2.2,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const at = starsAt + i * starGap;
          const s = pop(frame, fps, at, SPRING.pop);
          const on = frame >= at;
          const scale = on ? 0.7 + 0.3 * s + 0.18 * Math.sin(Math.min(1, s) * Math.PI) : 1;
          return (
            <Star
              key={i}
              size={u * 14}
              fill={on ? 1 : 0}
              style={{ transform: `scale(${scale})` }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: u * 61,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: u * 4.2,
          fontWeight: 600,
          color: labelIn > 0 ? C.ink : C.ardoise,
        }}
      >
        <span style={{ opacity: 1 - labelIn, position: "absolute", left: 0, right: 0 }}>Sélectionnez une note</span>
        <span style={{ opacity: labelIn, position: "absolute", left: 0, right: 0, transform: `translateY(${(1 - labelIn) * u * 2}px)` }}>
          Excellent
        </span>
      </div>

      {/* Zone de texte */}
      <div
        style={{
          position: "absolute",
          top: u * 76,
          left: u * 7,
          right: u * 7,
          height: u * 50,
          borderRadius: u * 4,
          border: `${Math.max(1, u * 0.35)}px solid ${typed > 0 ? C.googleBlue : C.line}`,
          padding: u * 4.5,
          boxSizing: "border-box",
        }}
      >
        {typed === 0 ? (
          <span style={{ fontSize: u * 4, color: C.ardoise }}>Partagez votre expérience…</span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: u * 3 }}>
            {[0.92, 0.78, 0.5].map((w, i) => (
              <div
                key={i}
                style={{
                  height: u * 2.6,
                  borderRadius: u * 2,
                  background: "#D5D9E3",
                  width: `${w * clamp01(typed * 3 - i) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bouton Publier */}
      <div
        style={{
          position: "absolute",
          left: u * 7,
          right: u * 7,
          top: u * 136,
          height: u * 14,
          borderRadius: u * 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: u * 2.4,
          fontWeight: 700,
          fontSize: u * 4.8,
          color: C.white,
          background: done > 0 ? C.success : typed >= 1 ? C.googleBlue : "#C9CEDA",
          transform: `scale(${btnScale})`,
        }}
      >
        {done > 0 ? (
          <>
            <svg width={u * 6} height={u * 6} viewBox="0 0 24 24" style={{ transform: `scale(${0.6 + 0.4 * press})` }}>
              <circle cx={12} cy={12} r={12} fill="rgba(255,255,255,0.25)" />
              <path
                d="M7 12.4l3.2 3.1L17 8.8"
                fill="none"
                stroke="#fff"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={16}
                strokeDashoffset={16 * (1 - done)}
              />
            </svg>
            Avis publié
          </>
        ) : (
          "Publier"
        )}
      </div>
    </div>
  );
};
