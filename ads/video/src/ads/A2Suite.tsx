import React from "react";
import { AbsoluteFill, Audio, interpolate, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, EASE, FONT_UI, SAFE, VIDEO } from "../theme";
import { prog } from "../lib/anim";
import { FaceVariant } from "../components/Presentoir3D";
import { Grain, SafeZones, WaveWipe } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { Mention } from "../components/Legal";
import { SfxTrack } from "../components/Sfx";
import { GESTE, GesteScene } from "../scenes/GesteScene";
import { PriceScene } from "../scenes/PriceScene";
import { EndCard } from "../scenes/EndCard";
import { A2P, A2Probleme } from "../scenes/A2Probleme";
import { A2Reveal } from "../scenes/A2Reveal";
import { CounterBackdrop } from "../scenes/Backdrops";
import type { AdProps } from "./A1Geste";

/** A2 "Vous connaissez la suite" (21 s = 630 frames). */
export const A2_DURATION = 630;

/** Coupes (frames de la composition), toutes sur les temps. */
const T = {
  reveal: A2P.end, // 165
  geste: 240,
  price: 240 + GESTE.end, // 465
  end: 525,
};

/**
 * Musique : 11 mesures generees (22 s), lues a partir de 0,5 s (1 temps)
 * pour que les temps forts tombent sur 45, 105, 165 (drop, revelation),
 * 465 (coup final, tampon prix) et 525 (fin). Fondu sur les 12 dernieres frames.
 */
const MUSIC_OFFSET = 15;

/**
 * Mention de A2 au style de Legal/Mention, avec un fond qui passe du clair
 * au sombre (`darkness` 0 a 1) quand la vague cobalt passe derriere elle.
 */
const A2Mention: React.FC<{ from: number; to: number; text: string; darkness: number }> = ({ from, to, text, darkness }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to + 6) return null;
  const o = prog(frame, from, 6, EASE.enter) * (1 - prog(frame, to, 6, EASE.exit));
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        bottom: SAFE.bottom,
        display: "flex",
        justifyContent: "flex-start",
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: FONT_UI,
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.25,
          letterSpacing: "-0.005em",
          color: interpolateColors(darkness, [0, 1], [C.inkSoft, C.white]),
          background: interpolateColors(darkness, [0, 1], [C.white, C.ink]),
          boxShadow: `0 8px 24px -12px rgba(10,13,22,${0.35 * (1 - darkness)})`,
          borderRadius: 14,
          padding: "8px 16px",
          whiteSpace: "pre-line",
          maxWidth: VIDEO.width - SAFE.left - SAFE.right,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Entree de scene sur le temps : leger zoom qui se pose. */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 8, EASE.enter);
  return <AbsoluteFill style={{ transform: `scale(${1.03 - 0.03 * t})` }}>{children}</AbsoluteFill>;
};

/**
 * A2 "Vous connaissez la suite" (probleme d'abord) : la promesse du client
 * qui repart, l'oubli, puis la revelation du Presentoir Reviu, le geste au
 * bon moment, le prix et la fin.
 */
export const A2Suite: React.FC<AdProps> = ({ logoFlou, safeZones }) => {
  const frame = useCurrentFrame();
  const lg = frame - T.geste;
  const lp = frame - T.price;
  // Derive camera du geste : 1) page ouverte au comptoir (30 a 82), defaite pendant la
  // plongee ; 2) gros plan apres la publication (160 a 225, sinon quasi fige).
  const cam =
    prog(lg, 30, 52, (t) => t) * (1 - prog(lg, GESTE.pushFrom, 20, EASE.inOut)) + 1.25 * prog(lg, 160, 65, (t) => t);
  return (
    <FaceVariant.Provider value={logoFlou ? "logoFlou" : "standard"}>
      <AbsoluteFill style={{ background: C.white }}>
        <Sequence durationInFrames={A2P.end} name="1 Probleme">
          <A2Probleme />
        </Sequence>
        <Sequence from={A2P.waveAt} durationInFrames={A2P.end - A2P.waveAt + 2} name="Vague 1">
          <WaveWipe progress={prog(frame - A2P.waveAt, 0, A2P.end - A2P.waveAt - 1, EASE.inOut)} color={C.cobalt} />
        </Sequence>
        <Sequence from={T.reveal} durationInFrames={T.geste - T.reveal} name="2 Revelation">
          <A2Reveal />
        </Sequence>
        <Sequence from={T.geste} durationInFrames={GESTE.end} name="3 Geste">
          {/*
            Camera qui glisse (voir cam) : poussee de 2 a 2,5 % et glissement de 16 a
            20 px, lineaires. Origine = coin bas gauche du bandeau (100 ; 1248), les
            titres restent sous y 270. Le decor derriere comble la bande de gauche.
          */}
          <CounterBackdrop horizon={1290 + prog(lg, GESTE.pushFrom, 22, EASE.in) * 700} />
          <AbsoluteFill style={{ transform: `translateX(${16 * cam}px) scale(${1 + 0.02 * cam})`, transformOrigin: "9.26% 65%" }}>
            <GesteScene
              hook={<KineticTitle text={"Leur avis Google,\nsur le moment"} size={76} at={-12} out={82} stagger={3} accentLast dot />}
            />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={T.geste + GESTE.waveAt} durationInFrames={GESTE.end - GESTE.waveAt + 2} name="Vague 2">
          <WaveWipe progress={prog(frame - T.geste - GESTE.waveAt, 0, GESTE.end - GESTE.waveAt - 2, EASE.inOut)} color={C.cobalt} />
        </Sequence>
        <Sequence from={T.price} durationInFrames={T.end - T.price} name="4 Prix">
          {/* Poussee lente jusqu'a la coupe (sinon plan fige de 31 a 59). */}
          <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * prog(lp, 16, 44, (t) => t)})`, transformOrigin: "9% 30%" }}>
            <PriceScene />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={T.end} durationInFrames={A2_DURATION - T.end} name="5 Fin">
          <Punch>
            <EndCard />
          </Punch>
        </Sequence>

        {/* Mentions : une seule par emplacement a la fois. */}
        <Mention from={-6} to={90} text="Scène reconstituée." />
        {/* Claire sur la brume, sombre quand la vague cobalt passe derriere (156 a 160). */}
        <A2Mention
          from={97}
          to={263}
          darkness={prog(frame, A2P.waveAt + 6, 4, EASE.inOut)}
          text={"Reviu est un service indépendant de Google.\nGoogle est une marque de Google LLC."}
        />
        <Mention
          from={T.price - 5}
          to={A2_DURATION + 10}
          dark={frame < T.end}
          text={"TVA non applicable, art. 293 B du CGI.\nLivraison offerte en France métropolitaine."}
        />
        <Mention from={T.end} to={A2_DURATION + 10} lift={109} text={"*Conditions : reviu.fr/cgv"} />

        <Grain opacity={0.035} />
        {safeZones && <SafeZones />}

        <Audio
          src={staticFile("audio/music/a2.wav")}
          trimBefore={MUSIC_OFFSET}
          volume={(f) =>
            interpolate(f, [A2_DURATION - 13, A2_DURATION - 1], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          }
        />
        <SfxTrack
          cues={[
            ["pop", 0, 0.5],
            ["click", A2P.lockAt, 0.6],
            ["whoosh", A2P.pocketFrom + 11],
            ["pop", A2P.suiteAt + 17, 0.4],
            ["pop", A2P.bubblePop],
            ["whoosh-short", A2P.lineB + 2, 0.7],
            ["pop", A2P.clockAt, 0.3],
            ["tick", A2P.steps[0]],
            ["tick", A2P.steps[1]],
            ["tick", A2P.steps[2]],
            ["riser", T.reveal, 0.5],
            ["whoosh", A2P.end - 4],
            ["impact", T.reveal],
            ["whoosh-short", T.reveal + 6, 0.6],
            ["whoosh", T.geste + GESTE.waveAt + 11],
          ]}
        />
      </AbsoluteFill>
    </FaceVariant.Provider>
  );
};
