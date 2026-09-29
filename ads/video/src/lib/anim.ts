import { interpolate, spring } from "remotion";
import { EASE, SPRING } from "../theme";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Progression 0 -> 1 entre deux frames, avec une courbe. */
export const prog = (frame: number, from: number, dur: number, easing = EASE.out) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Ressort qui demarre a `from`. */
export const pop = (
  frame: number,
  fps: number,
  from: number,
  config: { damping: number; stiffness: number; mass: number } = SPRING.pop,
) => spring({ frame: frame - from, fps, config });

/** Melange lineaire. */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
