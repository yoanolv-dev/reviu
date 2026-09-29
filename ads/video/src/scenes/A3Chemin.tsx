import React from "react";
import { AbsoluteFill, Freeze, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, FONT_DISPLAY, SPRING } from "../theme";
import { mix, pop, prog } from "../lib/anim";
import { Presentoir3D, FACE_RATIO } from "../components/Presentoir3D";
import { Phone, PHONE_RATIO } from "../components/Phone";
import { HomeScreen } from "../components/PhoneScreens";
import { KineticTitle } from "../components/KineticTitle";
import { CounterBackdrop } from "./Backdrops";
import { A3PathScreen, A3S } from "./A3Screens";

/**
 * Reperes de l'ouverture de A3 "Le chemin trop long" (frames de la
 * composition). Les etapes tombent sur les temps (120 BPM).
 */
export const A3F = {
  steps: [A3S.search, A3S.typing, A3S.results, A3S.listing, A3S.reviews],
  /** Le telephone s'eteint, puis glisse dans la poche. */
  lockAt: A3S.lockAt,
  pocketAt: 84,
  dropAt: 95,
  dropDur: 14,
  /** La liste grise et se barre. */
  greyAt: 96,
  strikeAt: 98,
  /** « Plus tard… » (pose sur l'arret de la musique, frame 120). */
  laterAt: 112,
  titleOut: 124,
  /** « Ou un geste. » */
  gesteAt: 135,
  gesteOut: 170,
  /** Liste et « Plus tard… » passent au second plan (140 a 148). */
  dimAt: 140,
  /** Point de contact annonce (cobalt), d'ou part le cercle. */
  dotAt: 146,
  /** Cercle qui part du point de contact (10 a 12 frames). */
  revealAt: 150,
  revealDur: 12,
  /** Debut de GesteScene (drop). */
  end: 180,
} as const;

/* Pose de GesteScene a sa frame 0 (raccord exact a la coupe de 180). */
const G_PRODUCT = { left: 300, top: 640, w: 640 };
const G_PHONE_W = 480;
export const CONTACT = { x: G_PRODUCT.left + 0.3 * G_PRODUCT.w, y: G_PRODUCT.top + 0.76 * G_PRODUCT.w * FACE_RATIO };
const G_PHONE_TAP = { x: CONTACT.x, y: 1330, rot: -9 };
const G_PHONE_START = { x: 820, y: 1480, rot: 12 };

/* Liste des etapes. */
const STEPS: string[][] = [
  ["Ouvrir Google"],
  ["Taper le nom", "de votre commerce"],
  ["Trouver la fiche"],
  ["Chercher « Avis »"],
  ["Trouver le bouton…"],
];
const LIST = { left: 100, top: 526, size: 50, line: 52, chip: 62, gap: 22, rowGap: 18 };
const GREY_TEXT = "#9EA4B1";

/* Telephone du chemin (bas vers y 1133 : au-dessus du bandeau de mention). */
const PH = { left: 710, top: 505, w: 300 };
/** Entree stop-motion (frames 0 a 8, une pose toutes les 3 frames). */
const ENTRY = [
  { x: 120, r: 11 },
  { x: 50, r: 8 },
];
/** Pose "posee a la main" a chaque etape (stop-motion). */
const POSES = [
  { r: 5, x: 0, y: 0 },
  { r: 3.6, x: -6, y: 5 },
  { r: 6.2, x: 5, y: -3 },
  { r: 4.2, x: -3, y: 6 },
  { r: 6.6, x: 6, y: 1 },
  { r: 4.6, x: 0, y: 4 },
];
const POCKET = { left: 690, top: 1030, w: 520, h: 960 };

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Une ligne d'etape : titre cinetique + trait qui la barre. */
const StepLine: React.FC<{ text: string; at: number; color: string; strike: number }> = ({ text, at, color, strike }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <KineticTitle text={text} size={LIST.size} at={at} stagger={2} color={color} lineHeight={LIST.line / LIST.size} />
    <div
      style={{
        position: "absolute",
        left: -6,
        right: -6,
        top: "54%",
        height: 6,
        marginTop: -3,
        borderRadius: 3,
        background: C.inkSoft,
        transform: `scaleX(${strike})`,
        transformOrigin: "left center",
      }}
    />
  </div>
);

/** Poche de pantalon stylisee (decor, hors zone de texte). */
const Pocket: React.FC<{ top: number }> = ({ top }) => (
  <svg
    width={POCKET.w}
    height={POCKET.h}
    viewBox={`0 0 ${POCKET.w} ${POCKET.h}`}
    style={{ position: "absolute", left: POCKET.left, top, overflow: "visible" }}
  >
    <path d={`M0 34 Q ${POCKET.w * 0.45} -12 ${POCKET.w} 22 L ${POCKET.w} ${POCKET.h} L 0 ${POCKET.h} Z`} fill="#2B3754" />
    <path d={`M0 34 Q ${POCKET.w * 0.45} -12 ${POCKET.w} 22`} fill="none" stroke="#3A4870" strokeWidth={8} />
    <path
      d={`M0 58 Q ${POCKET.w * 0.45} 12 ${POCKET.w} 46`}
      fill="none"
      stroke="rgba(255,255,255,0.32)"
      strokeWidth={4}
      strokeDasharray="14 10"
    />
    <path
      d={`M0 76 Q ${POCKET.w * 0.45} 30 ${POCKET.w} 64`}
      fill="none"
      stroke="rgba(255,255,255,0.22)"
      strokeWidth={4}
      strokeDasharray="14 10"
    />
    <circle cx={36} cy={54} r={9} fill="#9AA3B8" />
  </svg>
);

/**
 * 0 a 162 : le chemin de recherche (point de vue du commercant). Titre deja pose a la frame 0, les
 * etapes s'empilent sur les temps pendant que le telephone enchaine des
 * ecrans generiques en stop-motion ; puis le telephone repart dans la
 * poche, la liste se grise et se barre, et « Plus tard… » tombe.
 */
export const A3Friction: React.FC = () => {
  const frame = useCurrentFrame();

  // Telephone : pose par etape, petit "grain" stop-motion toutes les 3 frames.
  const stepIdx = A3F.steps.filter((s) => frame >= s).length;
  const pose = POSES[stepIdx];
  const tick = Math.floor(frame / 3);
  const boilX = (hash(tick) - 0.5) * 2.4;
  const boilY = (hash(tick + 17) - 0.5) * 2.4;
  const drop = prog(frame, A3F.dropAt, A3F.dropDur, EASE.in);
  const entry = ENTRY[tick];
  const phoneTop = PH.top + pose.y + boilY + drop * 500;
  const phoneLeft = PH.left + pose.x + boilX + drop * 30 + (entry ? entry.x : 0);
  const phoneRot = (entry ? entry.r : pose.r) + drop * 7;
  const screenW = PH.w * 0.93;

  const pocketT = prog(frame, A3F.pocketAt, 12, EASE.enter);
  const pocketTop = mix(1940, POCKET.top, pocketT);

  // Hauteurs des lignes de la liste.
  let y = LIST.top;
  const rows = STEPS.map((lines, i) => {
    const top = y;
    y += Math.max(LIST.chip, lines.length * LIST.line) + LIST.rowGap;
    return { lines, top, at: A3F.steps[i] };
  });
  const listBottom = y - LIST.rowGap;
  // A partir de 140, la liste et « Plus tard… » passent au second plan :
  // « Ou un geste. » est seul a plein contraste.
  const dim = prog(frame, A3F.dimAt, 8, EASE.inOut);

  return (
    <AbsoluteFill style={{ background: C.white }}>
      {/* Titre (deja pose a la frame 0) */}
      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text={"Pour vous laisser\nun avis Google :"} size={96} at={-30} stagger={2} out={A3F.titleOut} />
      </div>

      {/* Etapes et « Plus tard… » (second plan a partir de 140) */}
      <AbsoluteFill style={{ opacity: 1 - 0.7 * dim, transform: `translateY(${dim * 24}px)` }}>
      {rows.map((r, i) => {
        if (frame < r.at - 1) return null;
        // Pastille de numero : entree sans rebond (element d'interface).
        const chip = prog(frame, r.at, 9, EASE.enter);
        const color = interpolateColors(frame, [A3F.greyAt + i * 2, A3F.greyAt + i * 2 + 8], [C.ink, GREY_TEXT]);
        let wordIdx = 0;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: LIST.left, top: r.top, display: "flex", alignItems: "flex-start", gap: LIST.gap }}
          >
            <div
              style={{
                width: LIST.chip,
                height: LIST.chip,
                marginTop: (LIST.line - LIST.chip) / 2,
                borderRadius: 18,
                background: "#ECEEF3",
                color: C.ardoise,
                display: "grid",
                placeItems: "center",
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 44,
                lineHeight: 1,
                flexShrink: 0,
                transform: `scale(${0.7 + 0.3 * chip})`,
                opacity: chip,
              }}
            >
              {i + 1}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {r.lines.map((l, li) => {
                const at = r.at + wordIdx * 2;
                wordIdx += l.split(" ").length;
                const strike = prog(frame, A3F.strikeAt + i * 3 + li * 2, 8, EASE.out);
                return <StepLine key={li} text={l} at={at} color={color} strike={strike} />;
              })}
            </div>
          </div>
        );
      })}

      {/* « Plus tard… » */}
      <div style={{ position: "absolute", left: 100, top: listBottom + 44 }}>
        <KineticTitle text="Plus tard…" size={100} at={A3F.laterAt} stagger={3} />
      </div>
      </AbsoluteFill>

      {/* Telephone (stop-motion : image figee toutes les 3 frames) */}
      {(
        <div
          style={{
            position: "absolute",
            left: phoneLeft,
            top: phoneTop,
            transform: `rotate(${phoneRot}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          <Phone width={PH.w}>
            <Freeze frame={tick * 3}>
              <A3PathScreen width={screenW} />
            </Freeze>
          </Phone>
        </div>
      )}
      {pocketT > 0 && <Pocket top={pocketTop} />}
    </AbsoluteFill>
  );
};

/**
 * 150 a 180 : le comptoir, cadre exactement comme GesteScene a sa frame 0
 * (produit, fond, telephone qui arrive) : la coupe de 180 est invisible.
 */
export const A3Lead: React.FC = () => {
  const frame = useCurrentFrame(); // 0 = frame 150 de la composition
  const f = frame - (A3F.end - A3F.revealAt); // frame de GesteScene (negative)
  // Leger recul de camera qui se pose sur la frame 0 de GesteScene.
  const cam = 1 + 0.05 * (1 - prog(frame, 0, A3F.end - A3F.revealAt, EASE.move));

  // Telephone : entre par le bas a droite, se pose sur la pose de depart de
  // GesteScene a -6, puis suit exactement son approche.
  const enter = prog(f, -20, 14, EASE.move);
  const approach = interpolate(f, [-6, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.in });
  const px = mix(mix(G_PHONE_START.x + 170, G_PHONE_START.x, enter), G_PHONE_TAP.x, approach);
  const py = mix(mix(G_PHONE_START.y + 800, G_PHONE_START.y, enter), G_PHONE_TAP.y, approach);
  const prot = mix(mix(G_PHONE_START.rot + 14, G_PHONE_START.rot, enter), G_PHONE_TAP.rot, approach);
  const phoneH = G_PHONE_W * PHONE_RATIO;

  return (
    <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: `${CONTACT.x}px ${CONTACT.y}px` }}>
      <CounterBackdrop horizon={1290} />
      <div style={{ position: "absolute", left: G_PRODUCT.left, top: G_PRODUCT.top, perspective: 2400 }}>
        <Presentoir3D width={G_PRODUCT.w} rotateY={-20 + f * 0.05} rotateX={3} thickness={26} shadow={0.55} focusBlur={7} />
      </div>
      {f >= -21 && (
        <div
          style={{
            position: "absolute",
            left: px - G_PHONE_W / 2,
            top: py - phoneH / 2,
            transform: `perspective(1800px) rotate(${prot}deg) rotateY(0deg) rotateX(0deg) scale(0.66)`,
            transformOrigin: "50% 50%",
          }}
        >
          <Phone width={G_PHONE_W}>
            <HomeScreen width={G_PHONE_W * 0.93} dim={0} />
          </Phone>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Revelation circulaire depuis le point de contact, avec un liseré cobalt. */
export const CircleReveal: React.FC<{ at: number; dur: number; children: React.ReactNode }> = ({ at, dur, children }) => {
  const frame = useCurrentFrame();
  // Rayon limite au coin le plus lointain (1297 px) : le cercle reste lisible
  // comme un cercle pendant 6 frames avant de couvrir l'ecran (a +12).
  const t = prog(frame, at, dur, EASE.inOut);
  const r = t * 1320;
  if (frame < at) return null;
  return (
    <>
      <AbsoluteFill style={{ clipPath: `circle(${r.toFixed(1)}px at ${CONTACT.x}px ${CONTACT.y}px)` }}>{children}</AbsoluteFill>
      {t < 1 && (
        <div
          style={{
            position: "absolute",
            left: CONTACT.x - r,
            top: CONTACT.y - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            boxShadow: `0 0 0 ${mix(18, 6, t)}px ${C.cobalt}`,
            opacity: 1 - t * 0.3,
          }}
        />
      )}
    </>
  );
};

/** « Ou un geste. » : passe au-dessus de la revelation, sort avant la coupe. */
export const A3GesteTitle: React.FC = () => (
  <div style={{ position: "absolute", left: 100, top: 292 }}>
    <KineticTitle text="Ou un geste" size={124} at={A3F.gesteAt} out={A3F.gesteOut} stagger={3} accentLast dot />
  </div>
);

/** Point de contact cobalt (146) : annonce l'origine du cercle de 150. */
export const A3ContactDot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, 0, SPRING.pop);
  const o = 1 - prog(frame, 7, 4, EASE.exit);
  const d = 28;
  return (
    <div
      style={{
        position: "absolute",
        left: CONTACT.x - d / 2,
        top: CONTACT.y - d / 2,
        width: d,
        height: d,
        borderRadius: "50%",
        background: C.cobalt,
        transform: `scale(${s})`,
        opacity: o,
      }}
    />
  );
};
