import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, FONT_UI, SPRING } from "../theme";
import { clamp01, pop, prog } from "../lib/anim";
import { TouchDot } from "./TouchDot";

/** Ecran d'accueil generique (telephone deverrouille, aucune marque). */
export const HomeScreen: React.FC<{ width: number; dim?: number }> = ({ width, dim = 0 }) => {
  const u = width / 100;
  const tones = ["#DCE4FF", "#FFE9B3", "#D6F2E3", "#FFD9D6", "#E6E0FF", "#D5EEFF", "#F4E1D2", "#E3E7EE"];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(170deg, #3F66FF 0%, #1B4DFF 38%, #1139C9 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: u * 22,
          left: u * 8,
          right: u * 8,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          rowGap: u * 7,
          columnGap: u * 6,
        }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: u * 4.6,
              background: tones[(i * 3) % tones.length],
              opacity: 0.92,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: u * 6,
          left: u * 6,
          right: u * 6,
          height: u * 22,
          borderRadius: u * 8,
          background: "rgba(255,255,255,0.18)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          alignItems: "center",
          padding: `0 ${u * 5}px`,
          columnGap: u * 6,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: u * 4.6, background: tones[(i * 5 + 1) % tones.length] }} />
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, background: `rgba(10,13,22,${dim})` }} />
    </div>
  );
};

/**
 * Banniere systeme generique qui apparait quand le telephone lit le
 * presentoir (sur iPhone, il faut la toucher pour ouvrir la page).
 */
export const LinkBanner: React.FC<{ width: number; at: number; tapAt: number; goneAt: number }> = ({
  width,
  at,
  tapAt,
  goneAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = width / 100;
  const s = pop(frame, fps, at, SPRING.notif);
  const out = prog(frame, goneAt, 8, EASE.exit);
  if (frame < at || out >= 1) return null;
  const pressed = frame >= tapAt && frame < tapAt + 4;
  return (
    <div
      style={{
        position: "absolute",
        top: u * 14,
        left: u * 4,
        right: u * 4,
        transform: `translateY(${(1 - s) * -u * 40 - out * u * 40}px) scale(${pressed ? 0.97 : 1})`,
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          borderRadius: u * 6,
          background: C.white,
          boxShadow: "0 10px 30px -12px rgba(10,13,22,0.45)",
          padding: `${u * 4}px ${u * 4.5}px`,
          display: "flex",
          alignItems: "center",
          gap: u * 3.6,
          fontFamily: FONT_UI,
        }}
      >
        <div
          style={{
            width: u * 12,
            height: u * 12,
            borderRadius: u * 3.2,
            background: C.cobalt,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <svg width={u * 7.2} height={u * 7.2} viewBox="0 0 48 48">
            <g fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round">
              <path d="M15 17.5c2.6 3.8 2.6 9.2 0 13" />
              <path d="M22.5 12.5c4.4 6.4 4.4 16.6 0 23" />
              <path d="M30 7.5c6.2 8.9 6.2 24.1 0 33" />
            </g>
          </svg>
        </div>
        <div style={{ lineHeight: 1.25, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: u * 6.5, color: C.ink }}>r.reviu.fr</div>
          <div style={{ fontSize: u * 5.5, color: C.inkSoft }}>Touchez pour ouvrir</div>
        </div>
      </div>
      <TouchDot x={u * 10.5} y={u * 10} size={u * 13} downAt={tapAt} upAt={tapAt + 4} />
    </div>
  );
};

/** Compteur qui roule jusqu'a sa valeur (ressort "counter"). */
const Counter: React.FC<{ to: number; at: number; size: number; color?: string }> = ({ to, at, size, color = C.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.counter);
  return (
    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", color, fontVariantNumeric: "tabular-nums" }}>
      {Math.round(to * clamp01(s))}
    </span>
  );
};

/**
 * Apercu de l'Espace Reviu : scans du mois (sans contact / QR code) et lien
 * du presentoir modifiable. Chiffres d’exemple, etiquetes comme tels.
 */
export const DashboardScreen: React.FC<{ width: number; countAt: number; editAt: number; newLinkAt: number }> = ({
  width,
  countAt,
  editAt,
  newLinkAt,
}) => {
  const frame = useCurrentFrame();
  const u = width / 100;
  const swap = prog(frame, newLinkAt, 10, EASE.move);
  const bar = (v: number, max: number, at: number) => interpolate(frame, [at, at + 24], [0, v / max], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.out });
  return (
    <div style={{ position: "absolute", inset: 0, background: C.perle, fontFamily: FONT_UI, color: C.ink }}>
      <div style={{ position: "absolute", top: u * 15, left: u * 7, right: u * 7, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: u * 7, letterSpacing: "-0.03em" }}>Espace Reviu</div>
        <div style={{ fontSize: u * 3.6, fontWeight: 700, color: C.cobalt, background: C.brume, borderRadius: u * 3, padding: `${u * 1.2}px ${u * 2.6}px` }}>
          Aperçu
        </div>
      </div>
      <div style={{ position: "absolute", top: u * 28, left: u * 7, right: u * 7, fontSize: u * 4.2, color: C.ardoise, fontWeight: 600 }}>
        Scans ce mois-ci
      </div>
      <div style={{ position: "absolute", top: u * 36, left: u * 7, right: u * 7, display: "grid", gridTemplateColumns: "1fr 1fr", gap: u * 4 }}>
        {[
          { label: "Sans contact", v: 18, at: countAt },
          { label: "QR code", v: 7, at: countAt + 4 },
        ].map((t) => (
          <div key={t.label} style={{ background: C.white, borderRadius: u * 5, padding: u * 4.5, boxShadow: "0 1px 2px rgba(10,13,22,0.05)" }}>
            <div style={{ fontSize: u * 4, color: C.ardoise, fontWeight: 600 }}>{t.label}</div>
            <Counter to={t.v} at={t.at} size={u * 13} />
            <div style={{ height: u * 2, borderRadius: u, background: C.line, marginTop: u * 1.5 }}>
              <div style={{ height: "100%", borderRadius: u, background: C.cobalt, width: `${bar(t.v, 20, t.at) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: u * 83, left: u * 7, right: u * 7, fontSize: u * 4.4, fontWeight: 600, color: C.inkSoft }}>
        Chiffres d’exemple
      </div>
      <div style={{ position: "absolute", top: u * 95, left: u * 7, right: u * 7, background: C.white, borderRadius: u * 5, padding: u * 4.5 }}>
        <div style={{ fontSize: u * 4, color: C.ardoise, fontWeight: 600 }}>Lien du présentoir</div>
        <div style={{ position: "relative", height: u * 8, marginTop: u * 2, overflow: "hidden" }}>
          <div style={{ position: "absolute", fontSize: u * 4.6, fontWeight: 600, transform: `translateY(${-swap * 100}%)`, opacity: 1 - swap }}>
            Votre page d’avis Google
          </div>
          <div style={{ position: "absolute", fontSize: u * 4.6, fontWeight: 600, color: C.cobalt, transform: `translateY(${(1 - swap) * 100}%)`, opacity: swap }}>
            Votre nouvelle fiche Google
          </div>
        </div>
        <div
          style={{
            marginTop: u * 3,
            height: u * 12,
            borderRadius: u * 6,
            background: C.ink,
            color: C.white,
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: u * 4.6,
            transform: `scale(${frame >= editAt && frame < editAt + 4 ? 0.95 : 1})`,
          }}
        >
          {swap >= 1 ? "Lien mis à jour" : "Modifier le lien"}
        </div>
      </div>
      {frame >= editAt - 8 && frame <= editAt + 10 && (
        <TouchDot x={50 * u} y={(95 + 4.5 + 4 + 2 + 8 + 3 + 6) * u} size={u * 13} downAt={editAt} upAt={editAt + 4} />
      )}
    </div>
  );
};

/** Vue appareil photo qui cadre un QR code (scan). */
export const ScanScreen: React.FC<{ width: number; at: number; children?: React.ReactNode }> = ({ width, at, children }) => {
  const frame = useCurrentFrame();
  const u = width / 100;
  const lock = prog(frame, at + 14, 8, EASE.out);
  const line = ((frame - at) % 30) / 30;
  const bracket = (rot: number, pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: u * 12,
        height: u * 12,
        borderTop: `${u * 1.4}px solid ${lock > 0 ? C.gold : C.white}`,
        borderLeft: `${u * 1.4}px solid ${lock > 0 ? C.gold : C.white}`,
        borderTopLeftRadius: u * 4,
        transform: `rotate(${rot}deg)`,
        ...pos,
      }}
    />
  );
  const inset = 18 + (1 - lock) * 4;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#1D2230", overflow: "hidden" }}>
      {children}
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,13,22,0.25)" }} />
      <div style={{ position: "absolute", left: `${inset}%`, right: `${inset}%`, top: `calc(50% - ${(50 - inset) * u}px)`, height: (100 - inset * 2) * u }}>
        {bracket(0, { left: 0, top: 0 })}
        {bracket(90, { right: 0, top: 0 })}
        {bracket(180, { right: 0, bottom: 0 })}
        {bracket(270, { left: 0, bottom: 0 })}
        {lock === 0 && (
          <div style={{ position: "absolute", left: "6%", right: "6%", top: `${line * 100}%`, height: u * 0.8, background: "rgba(251,188,4,0.9)", borderRadius: u }} />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: u * 12,
          left: u * 8,
          right: u * 8,
          textAlign: "center",
          color: C.white,
          fontFamily: FONT_UI,
          fontWeight: 600,
          fontSize: u * 4.4,
          opacity: 0.9,
        }}
      >
        {lock > 0 ? "Page d’avis trouvée" : "Cadrez le QR code"}
      </div>
    </div>
  );
};
