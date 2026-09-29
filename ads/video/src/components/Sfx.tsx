import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

/**
 * Instant perceptif (frames a 30 fps) de chaque son, d'apres
 * public/audio/sfx/manifest.json : le son demarre `hit` frames avant
 * l'evenement pour que l'impact tombe pile sur la frame visee.
 */
const HIT: Record<string, number> = {
  whoosh: 5.7,
  "whoosh-short": 2.66,
  "swipe-up": 7.13,
  pop: 0.1,
  tap: 0.15,
  nfc: 0.2,
  "star-1": 0.1,
  "star-2": 0.1,
  "star-3": 0.1,
  "star-4": 0.1,
  "star-5": 0.1,
  success: 0.1,
  notif: 0.1,
  impact: 0.2,
  riser: 45,
  click: 0.06,
  tick: 0.06,
};

/** Volumes de depart au-dessus de la musique (manifest : suggested_volume). */
const VOL: Record<string, number> = { nfc: 0.63, notif: 0.77, impact: 0.9, riser: 0.7, tick: 0.55, click: 0.8 };

export type SfxName = keyof typeof HIT;

export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({ name, at, volume }) => {
  const start = Math.round(at - HIT[name]);
  return (
    <Sequence from={start} layout="none" name={`sfx ${name}`}>
      <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume ?? VOL[name] ?? 1} />
    </Sequence>
  );
};

/** Plusieurs sons d'un coup : [nom, frame, volume?]. */
export const SfxTrack: React.FC<{ cues: Array<[SfxName, number, number?]> }> = ({ cues }) => (
  <>
    {cues.map(([n, f, v], i) => (
      <Sfx key={`${n}-${f}-${i}`} name={n} at={f} volume={v} />
    ))}
  </>
);
