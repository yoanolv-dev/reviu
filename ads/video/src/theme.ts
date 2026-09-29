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
  success: "#1E9E5A",
} as const;

export const FONT_DISPLAY = "'Plus Jakarta Sans', 'Inter', sans-serif";
export const FONT_UI = "'Inter', 'Plus Jakarta Sans', sans-serif";

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

/**
 * Zones sures 9:16 (1080 x 1920) : union prudente TikTok + Reels + Stories
 * (Meta : 14 % en haut, 35 % en bas ; colonne d'icones TikTok a droite).
 * Texte, prix, CTA et mentions restent dans x 100 a 930, y 270 a 1248 ;
 * le produit et le decor peuvent en deborder.
 */
export const SAFE = { top: 270, bottom: 672, left: 100, right: 150 } as const;
export const SAFE_BOX = {
  x: SAFE.left,
  y: SAFE.top,
  w: VIDEO.width - SAFE.left - SAFE.right,
  h: VIDEO.height - SAFE.top - SAFE.bottom,
};

/** 1 temps a 120 BPM = 15 frames ; 1 mesure = 60 frames. */
export const BEAT = 15;
export const BAR = 60;

/** Courbes du langage motion : entrees douces, sorties plus courtes. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo out : ondes, compteurs
  enter: Easing.bezier(0.05, 0.7, 0.1, 1), // entrees
  exit: Easing.bezier(0.3, 0, 0.8, 0.15), // sorties
  move: Easing.bezier(0.2, 0, 0, 1), // deplacements
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // vague, reflet
  in: Easing.bezier(0.7, 0, 0.84, 0),
  whip: Easing.bezier(0.87, 0, 0.13, 1),
  snap: Easing.bezier(0.2, 0.9, 0.1, 1),
};

/** Ressorts mesures (frames a 30 fps). Jamais le ressort par defaut de Remotion. */
export const SPRING = {
  word: { damping: 18, stiffness: 220, mass: 0.6 },
  notif: { damping: 22, stiffness: 170, mass: 0.9 },
  tap: { damping: 14, stiffness: 300, mass: 0.5 },
  star: { damping: 12, stiffness: 200, mass: 0.6 },
  pop: { damping: 12, stiffness: 180, mass: 0.7 },
  price: { damping: 15, stiffness: 200, mass: 0.7 },
  stamp: { damping: 14, stiffness: 400, mass: 0.6 },
  product: { damping: 26, stiffness: 70, mass: 1.6 },
  camera: { damping: 30, stiffness: 50, mass: 2 },
  counter: { damping: 40, stiffness: 60, mass: 1 },
  soft: { damping: 20, stiffness: 120, mass: 1 },
  snappy: { damping: 16, stiffness: 260, mass: 0.6 },
} as const;
