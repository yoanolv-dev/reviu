import { Easing } from "remotion";

/** Palette de la charte Reviu (brand/README.md). */
export const C = {
  cobalt: "#1B4DFF",
  cobaltDeep: "#1139C9",
  ink: "#0A0D16",
  inkSoft: "#333A49",
  gold: "#FBBC04",
  white: "#FFFFFF",
  brume: "#EDF1FF",
  perle: "#F5F6F8",
  ardoise: "#6B7382",
  line: "#E6E8EF",
  googleBlue: "#1A73E8",
  success: "#1E9E5A",
} as const;

export const FONT_DISPLAY = "'Plus Jakarta Sans', 'Inter', sans-serif";
export const FONT_UI = "'Inter', 'Plus Jakarta Sans', sans-serif";

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

/**
 * Zones sures 9:16 (1080 x 1920) : union prudente TikTok + Reels + Stories.
 * Le texte important reste dans ce cadre ; les visuels peuvent en deborder.
 */
export const SAFE = { top: 250, bottom: 640, left: 72, right: 150 } as const;
export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  w: VIDEO.width - SAFE.left - SAFE.right,
  h: VIDEO.height - SAFE.top - SAFE.bottom,
};

/** Courbes du langage motion : sorties franches, arrivees douces. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo out
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.2, 0.9, 0.1, 1),
};

/** Ressorts (frames a 30 fps). */
export const SPRING = {
  pop: { damping: 12, stiffness: 180, mass: 0.7 },
  soft: { damping: 20, stiffness: 120, mass: 1 },
  snappy: { damping: 16, stiffness: 260, mass: 0.6 },
  heavy: { damping: 15, stiffness: 90, mass: 1.4 },
} as const;
