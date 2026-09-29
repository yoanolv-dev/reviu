import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

/** Fond "comptoir" : mur brume, plan de comptoir clair avec son arete. */
export const CounterBackdrop: React.FC<{ horizon: number; wall?: string; top?: string }> = ({
  horizon,
  wall = C.brume,
  top = "#F7F8FB",
}) => (
  <AbsoluteFill style={{ background: wall }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: horizon,
        bottom: -400,
        background: `linear-gradient(180deg, ${top} 0%, #E8EBF3 100%)`,
        boxShadow: "0 -1px 0 rgba(255,255,255,0.9), 0 -14px 30px -18px rgba(17,57,201,0.18)",
      }}
    />
    <div style={{ position: "absolute", left: 0, right: 0, top: horizon, height: 3, background: "rgba(17,57,201,0.08)" }} />
  </AbsoluteFill>
);

export const Flat: React.FC<{ color: string }> = ({ color }) => <AbsoluteFill style={{ background: color }} />;
