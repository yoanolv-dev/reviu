import React from "react";
import { C, FONT_UI } from "../theme";

type Props = {
  width: number;
  children?: React.ReactNode;
  /** Fond de l'ecran. */
  screen?: string;
  /** Barre d'etat (heure, reseau, batterie). */
  statusBar?: boolean;
  style?: React.CSSProperties;
};

export const PHONE_RATIO = 2.05;

/** Smartphone generique (proportions d'un telephone recent, sans marque). */
export const Phone: React.FC<Props> = ({ width, children, screen = C.white, statusBar = true, style }) => {
  const height = width * PHONE_RATIO;
  const bezel = width * 0.035;
  const radius = width * 0.165;
  const u = width / 100; // unite relative
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background: "linear-gradient(145deg, #3B404C 0%, #14171F 38%, #0A0D16 60%, #2A2F3A 100%)",
        padding: bezel,
        boxSizing: "border-box",
        boxShadow:
          "inset 0 0 0 1.5px rgba(255,255,255,0.14), 0 2px 4px rgba(10,13,22,0.2), 0 40px 80px -30px rgba(10,13,22,0.55)",
        ...style,
      }}
    >
      {/* Boutons lateraux */}
      <div style={{ position: "absolute", left: -u * 0.7, top: height * 0.2, width: u * 0.8, height: height * 0.06, borderRadius: u, background: "#20242D" }} />
      <div style={{ position: "absolute", left: -u * 0.7, top: height * 0.29, width: u * 0.8, height: height * 0.09, borderRadius: u, background: "#20242D" }} />
      <div style={{ position: "absolute", right: -u * 0.7, top: height * 0.25, width: u * 0.8, height: height * 0.12, borderRadius: u, background: "#20242D" }} />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: radius - bezel,
          overflow: "hidden",
          background: screen,
        }}
      >
        {children}
        {statusBar && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: u * 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${u * 8}px`,
              fontFamily: FONT_UI,
              fontWeight: 600,
              fontSize: u * 4.2,
              color: C.ink,
              pointerEvents: "none",
            }}
          >
            <span>9:41</span>
            <span style={{ display: "flex", gap: u * 1.4, alignItems: "center" }}>
              <SignalIcon u={u} />
              <BatteryIcon u={u} />
            </span>
          </div>
        )}
        {/* Ilot de la camera */}
        <div
          style={{
            position: "absolute",
            top: u * 3.2,
            left: "50%",
            transform: "translateX(-50%)",
            width: u * 30,
            height: u * 8.4,
            borderRadius: u * 5,
            background: "#05070B",
          }}
        />
      </div>
    </div>
  );
};

const SignalIcon: React.FC<{ u: number }> = ({ u }) => (
  <svg width={u * 5} height={u * 3.4} viewBox="0 0 17 12">
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 4.5} y={9 - i * 3} width={3} height={3 + i * 3} rx={1} fill={C.ink} />
    ))}
  </svg>
);

const BatteryIcon: React.FC<{ u: number }> = ({ u }) => (
  <svg width={u * 7.4} height={u * 3.6} viewBox="0 0 26 12">
    <rect x={0.5} y={0.5} width={22} height={11} rx={3.2} fill="none" stroke={C.ink} strokeOpacity={0.45} />
    <rect x={2.2} y={2.2} width={16} height={7.6} rx={1.8} fill={C.ink} />
    <rect x={23.6} y={4} width={1.8} height={4} rx={0.9} fill={C.ink} fillOpacity={0.45} />
  </svg>
);
