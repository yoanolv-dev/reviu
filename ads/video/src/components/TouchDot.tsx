import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

/**
 * Indicateur de toucher (comme un enregistrement d'ecran) : un disque
 * translucide qui apparait, se tasse au contact, puis se retire.
 * Utilise uniquement a l'interieur de la maquette de telephone.
 */
export const TouchDot: React.FC<{
  x: number;
  y: number;
  size: number;
  downAt: number;
  upAt: number;
}> = ({ x, y, size, downAt, upAt }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [downAt - 6, downAt - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.enter,
  });
  const leave = interpolate(frame, [upAt, upAt + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.exit,
  });
  const pressed = frame >= downAt && frame < upAt;
  const ring = interpolate(frame, [downAt, downAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.out,
  });
  const scale = (pressed ? 0.86 : 1) * (0.7 + 0.3 * appear) * (1 + 0.25 * leave);
  const opacity = appear * (1 - leave);
  if (opacity <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "rgba(10,13,22,0.22)",
          boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.85), 0 2px 10px rgba(10,13,22,0.25)",
          transform: `scale(${scale})`,
          opacity,
        }}
      />
      {frame >= downAt && ring < 1 && (
        <div
          style={{
            position: "absolute",
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.9)",
            transform: `scale(${1 + ring * 0.8})`,
            opacity: (1 - ring) * 0.8,
          }}
        />
      )}
    </>
  );
};
