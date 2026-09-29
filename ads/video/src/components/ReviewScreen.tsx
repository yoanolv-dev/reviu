import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_UI, SPRING } from "../theme";
import { clamp01, pop, prog } from "../lib/anim";
import { Star } from "./Star";
import { TouchDot } from "./TouchDot";

type Props = {
  /** Largeur de l'ecran (px), pour les unites relatives. */
  width: number;
  /** Frame ou la feuille "Ecrire un avis" monte. */
  sheetAt: number;
  /** Frame ou le doigt se pose sur la 1re etoile. */
  starsAt: number;
  /** Frames entre deux etoiles (le doigt glisse). */
  starGap?: number;
  /** Frame ou le texte se "tape". */
  textAt: number;
  /** Frame ou l'on appuie sur Publier. */
  publishAt: number;
  businessName?: string;
};

/** Geometrie partagee (unites de 1 % de largeur d'ecran). */
const STAR_TOP = 44;
const STAR_SIZE = 14.5;
const STAR_GAP = 2.2;
const BTN_TOP = 124;

/** Centre (en unites) de l'etoile i, pour le doigt. */
const starCenter = (i: number) => {
  const total = STAR_SIZE * 5 + STAR_GAP * 4;
  const x0 = 50 - total / 2;
  return { x: x0 + i * (STAR_SIZE + STAR_GAP) + STAR_SIZE / 2, y: STAR_TOP + STAR_SIZE / 2 };
};

/**
 * Ecran "Ecrire un avis" stylise, generique (pas l'interface de Google a
 * l'identique, aucun logo) : les etoiles, vides au depart, s'allument au
 * passage du doigt du client, qui note librement.
 */
export const ReviewScreen: React.FC<Props> = ({
  width,
  sheetAt,
  starsAt,
  starGap = 3,
  textAt,
  publishAt,
  businessName = "Votre commerce",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = width / 100;
  const sheet = pop(frame, fps, sheetAt, SPRING.notif);
  const lastStar = starsAt + starGap * 4;
  const labelIn = prog(frame, lastStar + 2, 8);
  const typed = prog(frame, textAt, 20, EASE.move);
  const press = pop(frame, fps, publishAt, SPRING.snappy);
  const done = clamp01((frame - publishAt - 3) / 6);
  const btnScale = frame >= publishAt - 1 && frame < publishAt + 4 ? 0.95 : 1;

  // Doigt : glisse de l'etoile 1 a 5, puis vient appuyer sur Publier.
  const slide = interpolate(frame, [starsAt, lastStar], [0, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const a = starCenter(Math.floor(slide));
  const b = starCenter(Math.min(4, Math.floor(slide) + 1));
  const f = slide - Math.floor(slide);
  const starFinger = { x: a.x + (b.x - a.x) * f, y: a.y };
  const onStars = frame >= starsAt - 6 && frame <= lastStar + 8;
  const onButton = frame >= publishAt - 9 && frame <= publishAt + 8;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        fontFamily: FONT_UI,
        color: C.ink,
        background: C.white,
        transform: `translateY(${(1 - sheet) * 100}%)`,
        borderRadius: sheet < 1 ? u * 6 : 0,
      }}
    >
      {/* En-tete */}
      <div
        style={{
          position: "absolute",
          top: u * 15,
          left: u * 7,
          right: u * 7,
          display: "flex",
          alignItems: "center",
          gap: u * 3.5,
          paddingBottom: u * 4.5,
          borderBottom: `${Math.max(1.5, u * 0.35)}px solid ${C.line}`,
        }}
      >
        <div
          style={{
            width: u * 12.5,
            height: u * 12.5,
            borderRadius: "50%",
            background: C.cobalt,
            color: C.white,
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: u * 5.6,
          }}
        >
          V
        </div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontWeight: 700, fontSize: u * 5.4 }}>{businessName}</div>
          <div style={{ fontSize: u * 4.2, color: C.ardoise }}>Écrire un avis</div>
        </div>
      </div>

      {/* Etoiles, vides tant que le doigt n'est pas passe */}
      <div
        style={{
          position: "absolute",
          top: u * STAR_TOP,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: u * STAR_GAP,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const at = starsAt + i * starGap;
          const s = pop(frame, fps, at, SPRING.star);
          const on = frame >= at;
          const scale = on ? 0.72 + 0.28 * s + 0.16 * Math.sin(Math.min(1, s) * Math.PI) : 1;
          return (
            <Star
              key={i}
              size={u * STAR_SIZE}
              fill={on ? 1 : 0}
              empty="#D9DDE6"
              style={{ transform: `scale(${scale})` }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: u * 63,
          left: 0,
          right: 0,
          height: u * 6,
          textAlign: "center",
          fontSize: u * 4.4,
          fontWeight: 600,
        }}
      >
        <span style={{ opacity: 1 - labelIn, position: "absolute", left: 0, right: 0, color: C.ardoise }}>
          Touchez pour noter
        </span>
        <span
          style={{
            opacity: labelIn,
            position: "absolute",
            left: 0,
            right: 0,
            transform: `translateY(${(1 - labelIn) * u * 2}px)`,
          }}
        >
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
          height: u * 40,
          borderRadius: u * 4,
          border: `${Math.max(1.5, u * 0.4)}px solid ${typed > 0 ? C.cobalt : C.line}`,
          padding: u * 4.5,
          boxSizing: "border-box",
        }}
      >
        {typed === 0 ? (
          <span style={{ fontSize: u * 4.2, color: C.ardoise }}>Partagez votre expérience…</span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: u * 3 }}>
            {[0.92, 0.8, 0.46].map((w, i) => (
              <div
                key={i}
                style={{
                  height: u * 2.8,
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
          top: u * BTN_TOP,
          height: u * 15,
          borderRadius: u * 7.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: u * 2.4,
          fontWeight: 700,
          fontSize: u * 5.2,
          color: C.white,
          background: done > 0 ? C.cobaltDeep : typed >= 1 ? C.cobalt : "#C9CEDA",
          transform: `scale(${btnScale})`,
        }}
      >
        {done > 0 ? (
          <>
            <svg width={u * 6.4} height={u * 6.4} viewBox="0 0 24 24" style={{ transform: `scale(${0.6 + 0.4 * press})` }}>
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

      {onStars && (
        <TouchDot
          x={starFinger.x * u}
          y={starFinger.y * u}
          size={u * 13}
          downAt={starsAt}
          upAt={lastStar + 2}
        />
      )}
      {onButton && <TouchDot x={50 * u} y={(BTN_TOP + 7.5) * u} size={u * 13} downAt={publishAt - 1} upAt={publishAt + 3} />}
    </div>
  );
};
