import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { mix, prog } from "../lib/anim";
import { FACE_RATIO, Presentoir3D } from "../components/Presentoir3D";
import { Phone, PHONE_RATIO } from "../components/Phone";
import { HomeScreen, LinkBanner } from "../components/PhoneScreens";
import { ReviewScreen } from "../components/ReviewScreen";
import { NfcWaves } from "../components/Bits";
import { TouchDot } from "../components/TouchDot";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";
import { CounterBackdrop } from "./Backdrops";

/**
 * Mini-demo A4 (105 frames), construite avec les pieces de GesteScene.
 * Reperes locaux (global = local + 60) :
 *   2 le telephone monte du bas du cadre en accelerant, 30 contact (sur le temps, global 90),
 *   34 banniere, 32 a 46 il se releve en pose de lecture (banniere lue a plat
 *   de ~42 a 60), 60 le doigt touche l'icone (sur le temps, global 120),
 *   66 la page d’avis monte (posee vers 80), maintien vivant jusqu'a 105.
 * Un seul bandeau passe sur la scene (emplacement bas, y 1147 a 1248) : le
 * telephone est cadre pour que son bas (y <= ~1241, respiration comprise) reste
 * cache derriere, sans jamais ressortir dessous ; "Publier" est vers y 920 a 960.
 * Aucun avis n'est ecrit : les etoiles restent vides, "Publier" reste grise.
 */
export const A4_DEMO = { duration: 105, contact: 30, bannerAt: 34, bannerTap: 60, sheetAt: 66 } as const;

/** Jamais atteint dans la scene : etoiles vides, pas de texte, pas de publication. */
const NEVER = 100000;

const PROD = { w: 430, left: 130, top: 520 };
const PROD_H = PROD.w * FACE_RATIO;
const NFC = { x: PROD.left + 0.3 * PROD.w, y: PROD.top + 0.76 * PROD_H };
const HORIZON = PROD.top + PROD_H - 32;

const PW = 360;
const PH = PW * PHONE_RATIO;
const TAP_SCALE = 0.55;
/** Pose de lecture : haut du telephone a y 490 (titre au-dessus, fini vers y 452). */
const READ = { x: 740, y: 490 + PH / 2, rot: 0 };
/** Au contact, le haut du telephone se pose sur la zone sans contact ; son bas reste derriere le bandeau. */
const TAP = { x: NFC.x + 24, y: NFC.y - 60 + (PH * TAP_SCALE) / 2, rot: -8 };
/** Depart hors cadre (haut du telephone sous y 1920) : il n'est jamais gare au bord bas. */
const START = { x: 960, y: 2140, rot: 16 };

export const A4Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const D = A4_DEMO;

  // Le telephone arrive en accelerant.
  const approach = interpolate(frame, [2, D.contact], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    // Quadratique : visible des ~6, vitesse maximale au contact.
    easing: Easing.in(Easing.quad),
  });
  // Puis il se releve vers la pose de lecture pendant que la banniere arrive.
  const lift = prog(frame, D.contact + 2, 14, EASE.move);
  const squash = frame >= D.contact && frame < D.contact + 5 ? 0.975 : 1;
  // Respiration lineaire : encore en mouvement sur la coupe.
  const breathe = 1 + 0.03 * interpolate(frame, [48, D.duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const px = mix(mix(START.x, TAP.x, approach), READ.x, lift);
  const py = mix(mix(START.y, TAP.y, approach), READ.y, lift);
  const rot = mix(mix(START.rot, TAP.rot, approach), READ.rot, lift);
  const scale = mix(TAP_SCALE, 1, lift) * squash * breathe;
  const tiltY = interpolate(frame, [D.contact + 3, D.duration], [-8, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lift;

  // A-coup de camera au contact (le geste "claque"), sur le decor seulement.
  const bump = 1 + 0.018 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (frame - D.contact) / 8)) * Math.PI));
  // La mise au point passe du presentoir au telephone, puis le presentoir continue de glisser.
  const shift = prog(frame, D.contact + 3, 22, EASE.move);
  const slide = prog(frame, D.contact + 16, D.duration - D.contact - 16, EASE.inOut);

  const screenW = PW * 0.93;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${bump})`, transformOrigin: `${NFC.x}px ${NFC.y}px` }}>
        <CounterBackdrop horizon={HORIZON} />
        <div
          style={{
            position: "absolute",
            left: PROD.left,
            top: PROD.top,
            perspective: 2400,
            transform: `translateX(${-46 * shift - 40 * slide}px) scale(${1 - 0.05 * shift})`,
            transformOrigin: "50% 100%",
            filter: shift > 0 ? `blur(${shift * 2.2}px)` : undefined,
          }}
        >
          <Presentoir3D
            width={PROD.w}
            rotateY={-22 + frame * 0.06}
            rotateX={3}
            thickness={24}
            shadow={0.55}
            focusBlur={7}
          />
        </div>
        <NfcWaves at={D.contact} size={400} color={C.cobalt} style={{ left: NFC.x - 200, top: NFC.y - 200 }} />

        <div
          style={{
            position: "absolute",
            left: px - PW / 2,
            top: py - PH / 2,
            transform: `perspective(1800px) rotate(${rot}deg) rotateY(${tiltY}deg) scale(${scale})`,
            transformOrigin: "50% 50%",
          }}
        >
          <Phone width={PW}>
            <HomeScreen width={screenW} dim={prog(frame, D.bannerAt, 10) * 0.25} />
            <LinkBanner width={screenW} at={D.bannerAt} tapAt={D.bannerTap} goneAt={D.bannerTap + 6} />
            {/* Doigt bien visible sur l'icone de la banniere (double le repere de LinkBanner). */}
            <TouchDot x={0.145 * screenW} y={0.24 * screenW} size={44} downAt={D.bannerTap} upAt={D.bannerTap + 5} />
            {frame >= D.sheetAt - 2 && (
              <ReviewScreen width={screenW} sheetAt={D.sheetAt} starsAt={NEVER} textAt={NEVER} publishAt={NEVER} />
            )}
          </Phone>
        </div>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text={"Un geste, votre page\nd’avis Google s’ouvre"} size={76} at={2} stagger={3} accentLast dot />
      </div>

      <SfxTrack
        cues={[
          ["tap", D.contact, 0.8],
          ["nfc", D.contact + 1],
          ["whoosh-short", D.bannerAt, 0.55],
          ["click", D.bannerTap],
          ["swipe-up", D.sheetAt + 4],
        ]}
      />
    </AbsoluteFill>
  );
};
