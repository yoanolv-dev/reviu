import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { clamp01, pop, prog } from "../lib/anim";
import { Phone, PHONE_RATIO } from "../components/Phone";
import { HomeScreen } from "../components/PhoneScreens";
import { KineticTitle } from "../components/KineticTitle";
import { CounterBackdrop } from "./Backdrops";

/**
 * Reperes de la scene "probleme" de A2 (frames locales = frames de la
 * composition). La bulle est lisible des la frame 0 (arret du pouce).
 */
export const A2P = {
  lockAt: 15,
  /** Le telephone part dans la poche (whoosh sur le temps fort 45). */
  pocketFrom: 34,
  pocketDur: 14,
  /** 25 car. : 58 frames de lecture (38 a 96), sortie finie avant "Souvent" (105). */
  suiteAt: 38,
  suiteOut: 96,
  bubblePop: 83,
  shopOut: 84,
  /** "Souvent, ils oublient." sur le temps fort 105 (22 car. : 52 frames). */
  lineB: 105,
  clockAt: 112,
  /** Pas de l'horloge, sur les temps. */
  steps: [120, 135, 150],
  /** Debut de la vague vers le cobalt (la revelation commence a end). */
  waveAt: 150,
  end: 165,
};

/** Decor de boutique flou (etageres, bocaux) : suggere le commerce sans le nommer. */
const ShopBokeh: React.FC<{ opacity: number }> = ({ opacity }) => {
  const tones = [C.white, "#FFE9B3", C.perle, C.white, C.brume, C.perle];
  const shelves = [
    { y: 250, items: [60, 170, 250, 380, 470, 620, 720, 860, 960] },
    { y: 560, items: [20, 140, 230, 360, 500, 590, 700, 820, 930, 1030] },
    { y: 880, items: [70, 190, 300, 420, 560, 680, 780, 900, 1000] },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity, filter: "blur(16px)" }}>
      {shelves.map((s, si) => (
        <React.Fragment key={si}>
          <div style={{ position: "absolute", left: -40, right: -40, top: s.y + 170, height: 22, background: "#D9DEEC", borderRadius: 8 }} />
          {s.items.map((x, i) => {
            const h = 110 + ((i * 37 + si * 23) % 60);
            const w = 70 + ((i * 29 + si * 11) % 40);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x,
                  top: s.y + 170 - h,
                  width: w,
                  height: h,
                  borderRadius: 18,
                  background: tones[(i + si * 2) % tones.length],
                }}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Bulle de parole (blanche, arrondie, avec queue et ombre douce). */
const SpeechBubble: React.FC<{ lines: string[]; size: number; style?: React.CSSProperties }> = ({ lines, size, style }) => {
  const pad = size * 0.55;
  return (
    <div style={{ position: "relative", display: "inline-block", filter: "drop-shadow(0 26px 34px rgba(10,13,22,0.16)) drop-shadow(0 2px 4px rgba(10,13,22,0.06))", ...style }}>
      <div
        style={{
          position: "relative",
          background: C.white,
          borderRadius: size * 0.62,
          padding: `${pad * 0.8}px ${pad}px ${pad * 0.9}px`,
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          color: C.ink,
          whiteSpace: "nowrap",
        }}
      >
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {/* Queue : part du bas de la bulle, vers le client (en bas a droite). */}
      <svg
        width={size * 1.5}
        height={size * 1.2}
        viewBox="0 0 120 96"
        style={{ position: "absolute", right: size * 1.4, bottom: -size * 1.05 }}
      >
        <path d="M6 0 L72 0 C74 34 92 70 118 94 C76 86 34 60 6 0 Z" fill={C.white} />
      </svg>
    </div>
  );
};

/** Horloge au trait de la charte : les aiguilles avancent sur les temps (le temps passe). */
const Clock: React.FC<{ at: number; steps: number[]; size: number }> = ({ at, steps, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.pop);
  if (frame < at) return null;
  // Chaque pas (8 frames) : 1 h 40 d'horloge, la grande aiguille fait 1,67 tour.
  const done = steps.reduce((n, st) => n + prog(frame, st - 4, 8, EASE.whip), 0);
  const minute = done * 600;
  const hour = 180 + done * 50; // de 18 h vers 23 h en 3 pas : "ce soir" passe
  const r = 140;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-160 -160 320 320"
      style={{ transform: `scale(${0.6 + 0.4 * s})`, opacity: clamp01(s * 1.6), overflow: "visible" }}
    >
      <circle r={r} fill={C.white} stroke={C.cobalt} strokeWidth={14} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const major = i % 3 === 0;
        const r1 = major ? 98 : 106;
        return (
          <line
            key={i}
            x1={Math.sin(a) * r1}
            y1={-Math.cos(a) * r1}
            x2={Math.sin(a) * 118}
            y2={-Math.cos(a) * 118}
            stroke={major ? C.cobalt : C.ardoise}
            strokeOpacity={major ? 1 : 0.55}
            strokeWidth={major ? 10 : 6}
            strokeLinecap="round"
          />
        );
      })}
      <line x1={0} y1={0} x2={0} y2={-66} stroke={C.ink} strokeWidth={16} strokeLinecap="round" transform={`rotate(${hour})`} />
      <line x1={0} y1={14} x2={0} y2={-100} stroke={C.cobalt} strokeWidth={10} strokeLinecap="round" transform={`rotate(${minute})`} />
      <circle r={13} fill={C.ink} />
    </svg>
  );
};

/** Placement du titre et de l'horloge (horloge sur l'axe de la zone sure, x 515). */
const CLOCK = { titleTop: 440, top: 790, size: 300 };

/**
 * A2, ouverture "probleme" : la promesse du client (bulle), le telephone
 * se verrouille et repart dans la poche, "Vous connaissez la suite.",
 * puis la typographie sur brume : ils oublient.
 */
export const A2Probleme: React.FC = () => {
  const frame = useCurrentFrame();
  const P = A2P;

  // Boutique : poussee camera visible, puis le comptoir tombe et laisse la brume.
  const push = 1 + 0.08 * prog(frame, 0, P.shopOut, EASE.inOut);
  const shopOut = prog(frame, P.shopOut, 20, EASE.in);
  const horizon = 1290 + shopOut * 820;

  // Bulle : posee a 0 (petit tasse), flotte, s'eloigne, puis eclate vers l'exterieur.
  const settle = prog(frame, 0, 10, EASE.enter);
  const burst = prog(frame, P.bubblePop, 5, EASE.out);
  // La promesse s'eloigne (le telephone est parti) puis eclate.
  const drift = prog(frame, 48, 35, EASE.inOut);
  const fadeOut = prog(frame, 70, 13, EASE.inOut);
  const bubbleScale = (1.025 - 0.025 * settle) * (1 - 0.14 * drift) * (1 + 0.12 * burst);
  const bubbleFloat = Math.sin(frame / 14) * 5 - 60 * drift;

  // Telephone du client : tenu (leger balancement), verrouille, puis dans la poche.
  const PHONE_W = 360;
  const phoneH = PHONE_W * PHONE_RATIO;
  const pocket = prog(frame, P.pocketFrom, P.pocketDur, EASE.exit);
  const sway = Math.sin(frame / 9) * 5;
  const phoneX = 700 + pocket * 40;
  const phoneY = 1320 + sway + pocket * 1300;
  const phoneRot = 8 + Math.sin(frame / 13) * 0.8 + pocket * 14;
  const lock = prog(frame, P.lockAt, 4, EASE.out);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 40%" }}>
        <CounterBackdrop horizon={horizon} />
        {/* Lumiere chaude de boutique */}
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 75% 45% at 78% 6%, rgba(255,222,168,0.35), rgba(255,222,168,0) 70%)",
            opacity: 1 - shopOut,
          }}
        />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${-90 * prog(frame, 0, P.shopOut + 20, EASE.inOut)}px)` }}>
          <ShopBokeh opacity={0.55 * (1 - shopOut)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: horizon, height: 3, background: "rgba(17,57,201,0.08)" }} />

        {pocket < 1 && (
          <div
            style={{
              position: "absolute",
              left: phoneX - PHONE_W / 2,
              top: phoneY - phoneH / 2,
              transform: `rotate(${phoneRot}deg)`,
            }}
          >
            <Phone width={PHONE_W}>
              <HomeScreen width={PHONE_W * 0.93} dim={lock * 0.92} />
            </Phone>
          </div>
        )}
      </AbsoluteFill>

      {burst < 1 && (
        <div
          style={{
            position: "absolute",
            left: 115,
            top: 300 + bubbleFloat,
            transform: `scale(${bubbleScale})`,
            transformOrigin: "70% 100%",
            opacity: (1 - 0.2 * fadeOut) * (1 - burst),
          }}
        >
          <SpeechBubble lines={["«\u00a0Je vous mets", "un avis ce soir\u00a0!\u00a0»"]} size={80} />
        </div>
      )}

      <div style={{ position: "absolute", left: 100, top: 790 }}>
        <KineticTitle text={"Vous connaissez\nla suite"} size={96} at={P.suiteAt} out={P.suiteOut} stagger={3} accentLast dot />
      </div>

      {/* Typographie sur brume : une seule idee, "oublient" surligne. */}
      <div style={{ position: "absolute", left: 100, top: CLOCK.titleTop }}>
        <KineticTitle
          text={"Souvent,\nils oublient"}
          size={108}
          at={P.lineB}
          stagger={3}
          accentLast
          dot
          highlight={[2]}
        />
      </div>
      <div style={{ position: "absolute", left: 515 - CLOCK.size / 2, top: CLOCK.top }}>
        <Clock at={P.clockAt} steps={P.steps} size={CLOCK.size} />
      </div>
    </AbsoluteFill>
  );
};

