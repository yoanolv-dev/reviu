import React from "react";
import { useCurrentFrame } from "remotion";
import { C, EASE, FONT_UI, SAFE, VIDEO } from "../theme";
import { prog } from "../lib/anim";

/**
 * Mention legale sur bandeau uni, en bas de la zone sure (34 px minimum,
 * 3 s minimum a l'ecran). `from`/`to` en frames de la sequence courante.
 */
export const Mention: React.FC<{
  from: number;
  to: number;
  text: string;
  dark?: boolean;
  /** Decalage vertical depuis le bas de la zone sure (px). */
  lift?: number;
}> = ({ from, to, text, dark = false, lift = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to + 6) return null;
  const inT = prog(frame, from, 6, EASE.enter);
  const outT = prog(frame, to, 6, EASE.exit);
  const o = inT * (1 - outT);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        bottom: VIDEO.height - (VIDEO.height - SAFE.bottom) + lift,
        display: "flex",
        justifyContent: "flex-start",
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: FONT_UI,
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.25,
          letterSpacing: "-0.005em",
          color: dark ? C.white : C.inkSoft,
          background: dark ? C.ink : C.white,
          boxShadow: dark ? "none" : "0 8px 24px -12px rgba(10,13,22,0.35)",
          borderRadius: 14,
          padding: "8px 16px",
          whiteSpace: "pre-line",
          maxWidth: VIDEO.width - SAFE.left - SAFE.right,
        }}
      >
        {text}
      </div>
    </div>
  );
};
