import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { FaceVariant } from "../components/Presentoir3D";
import { Grain, SafeZones, WaveWipe } from "../components/Bits";
import { Mention } from "../components/Legal";
import { SfxTrack } from "../components/Sfx";
import { GESTE, GesteScene } from "../scenes/GesteScene";
import { ModesScene } from "../scenes/ModesScene";
import { MetiersScene } from "../scenes/MetiersScene";
import { EspaceScene } from "../scenes/EspaceScene";
import { PriceScene } from "../scenes/PriceScene";
import { EndCard } from "../scenes/EndCard";
import { Hook, HookId } from "./hooks";

export type AdProps = {
  hook: HookId;
  /** Variante de secours : logo Google imprime floute. */
  logoFlou: boolean;
  /** Surcouche de controle des zones sures (jamais dans les exports). */
  safeZones: boolean;
  posterFrame?: number;
};

/** Entree de scene sur le temps : leger zoom qui se pose (6 frames). */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 8, EASE.enter);
  return <AbsoluteFill style={{ transform: `scale(${1.06 - 0.06 * t})` }}>{children}</AbsoluteFill>;
};

export const A1_DURATION = 720;

/**
 * A1 "Un geste" (24 s, 12 mesures a 120 BPM ; coupes sur les temps : 225,
 * 315, 420, 540, 600) : le geste des la frame 0,
 * la page d'avis, sans contact ou QR code, les metiers, l'Espace Reviu,
 * le prix, la fin (le bouton reste lisible jusqu'a la derniere frame).
 */
export const A1Geste: React.FC<AdProps> = ({ hook, logoFlou, safeZones }) => {
  const frame = useCurrentFrame();
  return (
    <FaceVariant.Provider value={logoFlou ? "logoFlou" : "standard"}>
      <AbsoluteFill style={{ background: C.white }}>
        <Sequence durationInFrames={GESTE.end} name="1 Geste">
          <GesteScene hook={<Hook id={hook} />} />
        </Sequence>
        <Sequence from={GESTE.waveAt} durationInFrames={34} name="Vague">
          <WaveWipe progress={prog(frame - GESTE.waveAt, 0, GESTE.end - GESTE.waveAt - 2, EASE.inOut)} color={C.cobalt} />
        </Sequence>
        <Sequence from={225} durationInFrames={90} name="2 Sans contact ou QR">
          <ModesScene />
        </Sequence>
        <Sequence from={315} durationInFrames={105} name="3 Metiers">
          <Punch>
            <MetiersScene />
          </Punch>
        </Sequence>
        <Sequence from={420} durationInFrames={120} name="4 Espace">
          <Punch>
            <EspaceScene />
          </Punch>
        </Sequence>
        <Sequence from={540} durationInFrames={60} name="5 Prix">
          <PriceScene />
        </Sequence>
        <Sequence from={600} durationInFrames={120} name="6 Fin">
          <Punch>
            <EndCard />
          </Punch>
        </Sequence>

        <Mention
          from={542}
          to={632}
          dark={frame < 600}
          text="TVA non applicable, art. 293 B du CGI. Livraison offerte en France métropolitaine."
        />
        <Mention from={636} to={A1_DURATION + 10} text="*Satisfait ou remboursé 30 jours : conditions sur reviu.fr/cgv" />

        <Grain opacity={0.035} />
        {safeZones && <SafeZones />}

        <Audio src={staticFile("audio/music/a1.wav")} volume={0.8} />
        <SfxTrack cues={[["whoosh", GESTE.waveAt + 12], ["whoosh-short", 315], ["whoosh-short", 420]]} />
      </AbsoluteFill>
    </FaceVariant.Provider>
  );
};
