import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { pop, prog } from "../lib/anim";

type Props = {
  /** Texte ; "\n" force un retour a la ligne. */
  text: string;
  /** Frame d'entree (dans la sequence). */
  at?: number;
  /** Frame de sortie (optionnelle). */
  out?: number;
  size: number;
  color?: string;
  /** Signature des titres : dernier mot en cobalt (sur fond clair). */
  accentLast?: boolean;
  accentColor?: string;
  /** Point final dore. */
  dot?: boolean;
  /** Index (dans l'ordre des mots) des mots surlignes d'un bandeau. */
  highlight?: number[];
  highlightBg?: string;
  highlightColor?: string;
  stagger?: number;
  align?: "left" | "center";
  weight?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
};

/**
 * Titre cinetique : chaque mot monte depuis un masque, decale dans le temps.
 * Respecte la signature de la charte (dernier mot cobalt, point dore).
 */
export const KineticTitle: React.FC<Props> = ({
  text,
  at = 0,
  out,
  size,
  color = C.ink,
  accentLast = false,
  accentColor = C.cobalt,
  dot = false,
  highlight = [],
  highlightBg = C.cobalt,
  highlightColor = C.white,
  stagger = 3,
  align = "left",
  weight = 800,
  lineHeight = 1.04,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split("\n").map((l) => l.split(" ").filter(Boolean));
  const total = lines.reduce((n, l) => n + l.length, 0);
  let idx = 0;
  const lastAt = at + (total - 1) * stagger;
  const dotPop = pop(frame, fps, lastAt + 8, SPRING.pop);
  const exit = out !== undefined ? prog(frame, out, 10, EASE.in) : 0;

  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.03em",
        color,
        textAlign: align,
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{ display: "block", whiteSpace: "nowrap" }}>
          {words.map((w, wi) => {
            const i = idx++;
            const isLast = i === total - 1;
            const t = prog(frame, at + i * stagger, 14, EASE.out);
            const y = interpolate(t, [0, 1], [105, 0]) - exit * 105;
            const hl = highlight.includes(i);
            const hlT = hl ? prog(frame, at + i * stagger + 6, 10, EASE.out) : 0;
            return (
              <React.Fragment key={wi}>
                <span
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "top",
                    paddingBottom: size * 0.22,
                    marginBottom: -size * 0.22,
                    paddingLeft: hl ? size * 0.14 : 0,
                    paddingRight: hl ? size * 0.14 : 0,
                    position: "relative",
                  }}
                >
                  {hl && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: size * 0.06,
                        bottom: size * 0.02,
                        borderRadius: size * 0.16,
                        background: highlightBg,
                        transform: `scaleX(${hlT})`,
                        transformOrigin: "left center",
                      }}
                    />
                  )}
                  <span
                    style={{
                      display: "inline-block",
                      position: "relative",
                      transform: `translateY(${y}%)`,
                      color: hl && hlT > 0.3 ? highlightColor : isLast && accentLast ? accentColor : color,
                    }}
                  >
                    {w}
                    {isLast && dot && (
                      <span
                        style={{
                          display: "inline-block",
                          color: C.gold,
                          transform: `scale(${dotPop})`,
                          transformOrigin: "30% 80%",
                        }}
                      >
                        .
                      </span>
                    )}
                  </span>
                </span>
                {wi < words.length - 1 && <span> </span>}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
