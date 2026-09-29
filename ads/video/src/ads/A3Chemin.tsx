import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { FaceVariant } from "../components/Presentoir3D";
import { Grain, SafeZones, WaveWipe } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { Mention } from "../components/Legal";
import { SfxTrack } from "../components/Sfx";
import { GESTE, GesteScene, GesteTiming } from "../scenes/GesteScene";
import { EndCard } from "../scenes/EndCard";
import { A3ContactDot, A3F, A3Friction, A3GesteTitle, A3Lead, CircleReveal } from "../scenes/A3Chemin";
import { A3Checks } from "../scenes/A3Checks";
import type { AdProps } from "./A1Geste";

/** A3 Le chemin trop long (20 s, 10 mesures a 120 BPM). */
export const A3_DURATION = 600;

/**
 * Geste raccourci d'un temps a la fin (la vague part a 197 au lieu de 208,
 * « Avis publié » tient 29 frames) : les trois coches gardent leur temps de
 * lecture avant la carte de fin.
 */
const GESTE_A3: GesteTiming = { ...GESTE, waveAt: 197, end: 210 };

/** Coupes (frames de la composition), toutes sur les temps. */
const T = {
  reveal: A3F.revealAt, // 150
  geste: A3F.end, // 180 : drop
  checks: A3F.end + GESTE_A3.end, // 390
  end: 480, // coup final
};
/**
 * Vague cobalt : monte de 377 a 390, puis se retire vers le haut de 390 a 402
 * (depart rapide) : environ 3 frames d'aplat plein, aucune frame vide.
 */
const WAVE_IN = T.geste + GESTE_A3.waveAt; // 377
const WAVE_OUT_DUR = 12;
/** Mention TVA (2 lignes, 81 caracteres) : 180 frames, 13,5 car/s. */
const TVA_FROM = 420;

/** Entree de scene sur le temps : leger zoom qui se pose. */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 8, EASE.enter);
  return <AbsoluteFill style={{ transform: `scale(${1.03 - 0.03 * t})` }}>{children}</AbsoluteFill>;
};

/**
 * A3 "Le chemin trop long" (friction) : le parcours d'aujourd'hui pour
 * laisser un avis, etape par etape, abandonne (« Plus tard… ») ; puis
 * « Ou un geste. » : cercle depuis le point de contact, la demo, le nom du
 * produit et ses trois coches, la carte de fin.
 * Musique : build 0-120, arret sur « Plus tard… » (quasi-silence 120-132),
 * drop a 180 (geste), coup final a 480 (carte de fin).
 */
export const A3Chemin: React.FC<AdProps> = ({ logoFlou, safeZones }) => {
  const frame = useCurrentFrame();
  return (
    <FaceVariant.Provider value={logoFlou ? "logoFlou" : "standard"}>
      <AbsoluteFill style={{ background: C.white }}>
        <Sequence durationInFrames={T.reveal + A3F.revealDur + 2} name="1 Le chemin">
          <A3Friction />
        </Sequence>
        <Sequence from={T.reveal} durationInFrames={T.geste - T.reveal} name="2 Ou un geste">
          <CircleReveal at={0} dur={A3F.revealDur}>
            <A3Lead />
          </CircleReveal>
        </Sequence>
        <Sequence from={A3F.dotAt} durationInFrames={14} name="Point de contact">
          <A3ContactDot />
        </Sequence>
        <Sequence durationInFrames={T.geste} name="Titre Ou un geste">
          <A3GesteTitle />
        </Sequence>
        <Sequence from={T.geste} durationInFrames={GESTE_A3.end} name="3 Geste">
          <GesteScene
            timing={GESTE_A3}
            hook={<KineticTitle text={"Directement sur\nvotre page d’avis"} size={80} at={0} out={82} accentLast dot />}
          />
        </Sequence>
        <Sequence from={WAVE_IN} durationInFrames={T.checks - WAVE_IN} name="Vague">
          <WaveWipe progress={prog(frame - WAVE_IN, 0, T.checks - WAVE_IN, EASE.inOut)} color={C.cobalt} />
        </Sequence>
        <Sequence from={T.checks} durationInFrames={T.end - T.checks} name="4 Coches">
          <A3Checks />
        </Sequence>
        <Sequence from={T.checks} durationInFrames={WAVE_OUT_DUR + 2} name="Vague sortie">
          <WaveWipe
            progress={1 - prog(frame - T.checks, 0, WAVE_OUT_DUR, EASE.move)}
            color={C.cobalt}
            accent={C.white}
            flip
          />
        </Sequence>
        {/* Carte de fin decalee de 6 frames : a 480 (coup final) le logo et le
            nom sont poses et le prix est en plein pop. */}
        <Sequence from={T.end} durationInFrames={A3_DURATION - T.end} name="5 Fin">
          <Punch>
            <Sequence from={-6} layout="none">
              <EndCard />
            </Sequence>
          </Punch>
        </Sequence>

        {/* Mentions : une seule par emplacement a la fois. */}
        <Mention
          from={2}
          to={A3F.dotAt - 8}
          text={"Reviu est un service indépendant de Google.\nGoogle est une marque de Google LLC."}
        />
        {/* « Scène reconstituée. Avis fictif. » : posee par GesteScene (210 a 383). */}
        <Mention
          from={TVA_FROM}
          to={A3_DURATION + 10}
          text={"TVA non applicable, art. 293 B du CGI.\nLivraison offerte en France métropolitaine."}
        />
        <Mention from={T.end + 12} to={A3_DURATION + 10} lift={109} text={"*Conditions : reviu.fr/cgv"} />

        <Grain opacity={0.035} />
        {safeZones && <SafeZones />}

        {/* Quasi-silence sur « Plus tard… » (120 a 132), relance vers le drop. */}
        <Audio
          src={staticFile("audio/music/a3.wav")}
          volume={(f) =>
            0.8 * interpolate(f, [117, 120, 132, 135], [1, 0.15, 0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          }
        />
        <SfxTrack
          cues={[
            ...A3F.steps.map((s) => ["tick", s] as ["tick", number]),
            ["click", A3F.lockAt, 0.5],
            ["whoosh", A3F.dropAt + 9, 0.45],
            ["whoosh-short", A3F.laterAt],
            ["whoosh-short", A3F.gesteAt, 0.6],
            ["riser", T.geste, 0.45],
            ["tap", A3F.dotAt, 0.5],
            ["whoosh", T.reveal + 3, 0.7],
            ["whoosh", WAVE_IN + 11],
            ["whoosh-short", T.checks + 4, 0.4],
            ["impact", T.end, 0.5],
          ]}
        />
        {/* Coches : les 3 pop sont poses par A3Checks, sur les temps. */}
      </AbsoluteFill>
    </FaceVariant.Provider>
  );
};
