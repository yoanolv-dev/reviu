import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { FaceVariant } from "../components/Presentoir3D";
import { Grain, SafeZones, WaveWipe } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { Mention } from "../components/Legal";
import { SfxTrack } from "../components/Sfx";
import { GESTE_COURT, GesteScene, GesteTiming } from "../scenes/GesteScene";
import { A1C_MODES, A1CModes } from "../scenes/A1CModes";
import { A1CPrice } from "../scenes/A1CPrice";
import { EndCard } from "../scenes/EndCard";
import { Hook } from "./hooks";
import type { AdProps } from "./A1Geste";

/** Coupe de 15 s de A1 "Un geste" (Stories Instagram et Facebook). */
export const A1C_DURATION = 450;

/**
 * Reperes du geste resserre : ceux de GESTE_COURT, avec la vague decalee de
 * 5 frames pour que la coupe tombe sur un temps (180 = mesure 3 = drop) et
 * que les deux supers tiennent leur temps de lecture.
 */
const G: GesteTiming = { ...GESTE_COURT, waveAt: 165, end: 180 };

/** Sortie de l’accroche H1 : 92 frames a l’ecran (-8 a 84) pour 41 caracteres. */
const HOOK_OUT_C = 74;

/** Coupes (frames absolues), toutes sur les temps. */
const CUT = { modes: G.end, price: G.end + A1C_MODES.duration, end: 300 } as const;

/** Entree de scene sur le temps : leger zoom qui se pose (copie de A1Geste). */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 8, EASE.enter);
  return <AbsoluteFill style={{ transform: `scale(${1.03 - 0.03 * t})` }}>{children}</AbsoluteFill>;
};

/**
 * Poussee lente pendant que la page d’avis s’ouvre au comptoir (36 a 72),
 * absorbee par la plongee de la camera (72 a 88). Origine au coin bas gauche
 * de la zone sure : le bandeau "Scene reconstituee" y reste ancre.
 */
const CounterPush: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const k = 0.03 * prog(f, 36, 36, EASE.inOut) * (1 - prog(f, 72, 16, EASE.inOut));
  return <AbsoluteFill style={{ transform: `scale(${1 + k})`, transformOrigin: "100px 1248px" }}>{children}</AbsoluteFill>;
};

/**
 * Supers de la demo, retimes pour la coupe (ceux de GesteScene sont coupes) :
 * "Sans appli." 84 a 116 (32 frames pour 11 caracteres, des la sortie de
 * l’accroche a 84), puis "Le client note librement." de 116 jusqu’a la
 * vague, qui le recouvre vers 176 (60 frames pour 25 caracteres).
 */
const Supers: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 100, top: 300 }}>
      <KineticTitle text={"Sans appli"} size={120} at={HOOK_OUT_C + 10} out={106} dot accentLast />
    </div>
    <div style={{ position: "absolute", left: 100, top: 300 }}>
      <KineticTitle text={"Le client note\nlibrement"} size={86} at={116} dot accentLast />
    </div>
  </>
);

/**
 * A1C "Un geste", 15 s (7,5 mesures a 120 BPM ; coupes 180, 240, 300) :
 * le geste des la frame 0 et la page d’avis, sans contact ou QR code sur le
 * drop, le prix sur le coup final, puis la carte de fin (5 s).
 */
export const A1Court: React.FC<AdProps> = ({ hook, logoFlou, safeZones }) => {
  const frame = useCurrentFrame();
  const fadeFrom = A1C_DURATION - 12;
  return (
    <FaceVariant.Provider value={logoFlou ? "logoFlou" : "standard"}>
      <AbsoluteFill style={{ background: C.white }}>
        <Sequence durationInFrames={G.end} name="1 Geste">
          <CounterPush>
            <GesteScene hook={null} supers={false} timing={G} />
          </CounterPush>
          {/* Accroche hors de la poussee : elle reste fixe. */}
          <div style={{ position: "absolute", left: 100, top: 292, right: 150 }}>
            <Hook id={hook} out={HOOK_OUT_C} />
          </div>
          <Supers />
        </Sequence>
        <Sequence from={G.waveAt} durationInFrames={G.end - G.waveAt + 2} name="Vague">
          <WaveWipe progress={prog(frame - G.waveAt, 0, G.end - G.waveAt - 2, EASE.inOut)} color={C.cobalt} />
        </Sequence>
        <Sequence from={CUT.modes} durationInFrames={A1C_MODES.duration} name="2 Sans contact ou QR">
          <A1CModes />
        </Sequence>
        <Sequence from={CUT.price} durationInFrames={CUT.end - CUT.price} name="3 Prix">
          <A1CPrice />
        </Sequence>
        <Sequence from={CUT.end} durationInFrames={A1C_DURATION - CUT.end} name="4 Fin">
          <Punch>
            <EndCard />
          </Punch>
        </Sequence>

        {/*
          Mentions. Deux emplacements :
          - bas de la zone sure : "Scene reconstituee" (dans GesteScene, 30 a
            177), puis TVA de 234 a la fin (opaque des 240, frame du prix) ;
          - lift 109 : independance de 170 a 318 (148 frames, 2 lignes), puis
            conditions de 318 a la fin (opaques a 324, avant la pastille
            "30 jours satisfait ou rembourse*" qui s’ouvre a 322).
          Jamais deux bandeaux dans le meme emplacement au meme moment : le
          fondu de sortie de l’un finit la ou commence le fondu d’entree de l’autre.
        */}
        <Mention
          from={G.waveAt + 5}
          to={CUT.end + 12}
          lift={109}
          dark={frame < CUT.end}
          text={"Reviu est un service indépendant de Google.\nGoogle est une marque de Google LLC."}
        />
        <Mention
          from={CUT.price - 6}
          to={A1C_DURATION + 10}
          dark={frame < CUT.end}
          text={"TVA non applicable, art. 293 B du CGI.\nLivraison offerte en France métropolitaine."}
        />
        <Mention from={CUT.end + 18} to={A1C_DURATION + 10} lift={109} text={"*Conditions : reviu.fr/cgv"} />

        <Grain opacity={0.035} />
        {safeZones && <SafeZones />}

        {/* Musique de 8 mesures (16 s) coupee a 15 s : fondu sur les 12 dernieres frames. */}
        <Audio
          src={staticFile("audio/music/a1c.wav")}
          volume={(f) => 0.8 * Math.min(1, Math.max(0, (A1C_DURATION - 1 - f) / (A1C_DURATION - 1 - fadeFrom))) ** 2}
        />
        <SfxTrack cues={[["whoosh", G.waveAt + 11]]} />
      </AbsoluteFill>
    </FaceVariant.Provider>
  );
};
