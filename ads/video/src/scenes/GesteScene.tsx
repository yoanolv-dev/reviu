import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, SPRING } from "../theme";
import { mix, pop, prog } from "../lib/anim";
import { Presentoir3D, FACE_RATIO } from "../components/Presentoir3D";
import { Phone, PHONE_RATIO } from "../components/Phone";
import { HomeScreen, LinkBanner } from "../components/PhoneScreens";
import { ReviewScreen } from "../components/ReviewScreen";
import { NfcWaves } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { Mention } from "../components/Legal";
import { SfxTrack } from "../components/Sfx";
import { CounterBackdrop } from "./Backdrops";

/** Reperes de la scene (frames locales), partages avec les compositions. */
export const GESTE = {
  contact: 4,
  bannerAt: 10,
  bannerTap: 30,
  pushFrom: 48,
  sheetAt: 54,
  starsAt: 108,
  starGap: 3,
  textAt: 128,
  publishAt: 154,
  /** Debut de la vague de sortie (la scene suivante commence a end). */
  waveAt: 196,
  end: 225,
} as const;

const PRODUCT_W = 640;
const PRODUCT_LEFT = 220;
const PRODUCT_TOP = 640;
const PHONE_W = 480; // taille finale (gros plan)
const PHONE_SMALL = 0.66; // echelle au moment du geste
const PHONE_FINAL = { x: 540, y: 520 + (PHONE_W * PHONE_RATIO) / 2 };
const PHONE_TAP = { x: 468, y: 1392, rot: -9 };
const PHONE_START = { x: 790, y: 1520, rot: 12 };

type Props = {
  /** Titre d'accroche (frames 0 a ~60). */
  hook?: React.ReactNode;
  /** Masque les supers (pour des variantes qui posent leurs propres textes). */
  supers?: boolean;
  /** Coupe les effets sonores (copie figee pour la boucle de fin). */
  sfx?: boolean;
};

/**
 * Plan-sequence du geste : le telephone touche le presentoir, la banniere
 * apparait et on la touche, la camera plonge dans le telephone, la page
 * d'avis s'ouvre et le client choisit lui-meme ses etoiles.
 */
export const GesteScene: React.FC<Props> = ({ hook, supers = true, sfx = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const G = GESTE;

  // Approche du telephone (deja en mouvement a la frame 0), contact a G.contact.
  const approach = interpolate(frame, [-6, G.contact], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.in,
  });
  // Plongee de la camera vers le telephone.
  const push = pop(frame, fps, G.pushFrom, SPRING.camera);
  const tapSquash = frame >= G.contact && frame < G.contact + 5 ? 0.975 : 1;

  const px = mix(mix(PHONE_START.x, PHONE_TAP.x, approach), PHONE_FINAL.x, push);
  const py = mix(mix(PHONE_START.y, PHONE_TAP.y, approach), PHONE_FINAL.y, push);
  const prot = mix(mix(PHONE_START.rot, PHONE_TAP.rot, approach), 0, push);
  const pscale = mix(PHONE_SMALL, 1, push) * tapSquash;

  const drop = prog(frame, G.pushFrom, 22, EASE.in);
  const productY = drop * 700;
  const horizon = 1290 + drop * 700;
  // Petit a-coup de camera au contact (le geste "claque").
  const bump = 1 + 0.018 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (frame - G.contact) / 8)) * Math.PI));
  // Le gros plan telephone vit : legere inclinaison 3D qui derive.
  const tiltY = interpolate(frame, [G.pushFrom, G.waveAt], [-9, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * push;
  const breathe = 1 + 0.035 * prog(frame, G.pushFrom + 20, G.waveAt - G.pushFrom - 20, EASE.inOut);

  const phoneH = PHONE_W * PHONE_RATIO;
  const screenW = PHONE_W * 0.93;
  const nfc = { x: PRODUCT_LEFT + 0.3 * PRODUCT_W, y: PRODUCT_TOP + 0.76 * PRODUCT_W * FACE_RATIO };

  return (
    <AbsoluteFill style={{ transform: `scale(${bump})` }}>
      <CounterBackdrop horizon={horizon} />
      <div
        style={{
          position: "absolute",
          left: PRODUCT_LEFT,
          top: PRODUCT_TOP + productY,
          perspective: 2400,
          opacity: 1 - drop,
          filter: drop > 0 ? `blur(${drop * 10}px)` : undefined,
        }}
      >
        <Presentoir3D width={PRODUCT_W} rotateY={-12 + frame * 0.05} rotateX={3} thickness={26} shadow={0.55} />
      </div>
      <NfcWaves at={G.contact} size={480} color={C.cobalt} style={{ left: nfc.x - 240, top: nfc.y - 240 + productY }} />

      <div
        style={{
          position: "absolute",
          left: px - PHONE_W / 2,
          top: py - phoneH / 2,
          transform: `perspective(1800px) rotate(${prot}deg) rotateY(${tiltY}deg) rotateX(${3 * push}deg) scale(${pscale * breathe})`,
          transformOrigin: "50% 50%",
        }}
      >
        <Phone width={PHONE_W}>
          <HomeScreen width={screenW} dim={prog(frame, G.bannerAt, 10) * 0.25} />
          <LinkBanner width={screenW} at={G.bannerAt} tapAt={G.bannerTap} goneAt={G.bannerTap + 6} />
          {frame >= G.sheetAt - 2 && (
            <ReviewScreen
              width={screenW}
              sheetAt={G.sheetAt}
              starsAt={G.starsAt}
              starGap={G.starGap}
              textAt={G.textAt}
              publishAt={G.publishAt}
            />
          )}
        </Phone>
      </div>

      {/* Textes */}
      <div style={{ position: "absolute", left: 100, top: 290, right: 150 }}>{hook}</div>
      {supers && (
        <>
          <div style={{ position: "absolute", left: 100, top: 300 }}>
            <KineticTitle text={"Sans appli"} size={120} at={64} out={102} dot accentLast />
          </div>
          <div style={{ position: "absolute", left: 100, top: 300 }}>
            <KineticTitle text={"Le client note\nlibrement"} size={86} at={114} out={G.waveAt} dot accentLast />
          </div>
        </>
      )}
      <Mention from={66} to={G.waveAt + 6} text="Scène reconstituée. Avis fictif." />

      {sfx && <SfxTrack
        cues={[
          ["tap", G.contact],
          ["nfc", G.contact + 1],
          ["whoosh-short", G.bannerAt],
          ["click", G.bannerTap],
          ["swipe-up", G.sheetAt + 4],
          ["star-1", G.starsAt],
          ["star-2", G.starsAt + G.starGap],
          ["star-3", G.starsAt + G.starGap * 2],
          ["star-4", G.starsAt + G.starGap * 3],
          ["star-5", G.starsAt + G.starGap * 4],
          ["click", G.publishAt],
          ["success", G.publishAt + 3],
        ]}
      />}
    </AbsoluteFill>
  );
};
