import React from "react";
import { C } from "../theme";

/** Etoile de la charte (brand/icons/star-gold.svg), contour optionnel. */
export const STAR_PATH =
  "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z";

export const Star: React.FC<{
  size: number;
  /** 0 = vide, 1 = pleine (dore). */
  fill?: number;
  empty?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size, fill = 1, empty = C.line, color = C.gold, style }) => {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="2 1.5 20 20" style={{ overflow: "visible", ...style }}>
      <defs>
        <clipPath id={`s${id}`}>
          <rect x={0} y={0} width={24 * Math.max(0, Math.min(1, fill))} height={24} />
        </clipPath>
      </defs>
      <path d={STAR_PATH} fill={empty} stroke={empty} strokeWidth={1.4} strokeLinejoin="round" />
      <path d={STAR_PATH} fill={color} stroke={color} strokeWidth={1.4} strokeLinejoin="round" clipPath={`url(#s${id})`} />
    </svg>
  );
};
