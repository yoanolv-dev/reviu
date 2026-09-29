import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { Presentoir3D } from "../components/Presentoir3D";
import { A4Pill } from "../components/A4Pill";
import { SfxTrack, SfxName } from "../components/Sfx";

/**
 * "Tout est inclus" en 5 pastilles, une par temps (reperes locaux 0, 15,
 * 30, 45, 60 ; global 165 a 225), sur brume, avec le presentoir en decor a droite.
 * La derniere pastille (33 caracteres) reste 75 frames (74 requises).
 * Pas de titre : il retarderait la 5e pastille au-dela de la coupe.
 * Apres la 5e pastille, l'image suit la montee de la musique vers le coup final (300) :
 *   75 a 135 poussee de camera qui accelere (x 1,05, origine x 100 / y 640 : le bord
 *     gauche reste a x 100, la 5e pastille finit vers x 904 et y 925) ;
 *   78, 81, 84, 87 vague de rappel sur les pastilles 1 a 4 (ticks) ;
 *   90 (temps, global 255) la garantie passe en cobalt avec une impulsion (tick) ;
 *   96 a 126 reflet sur le presentoir, a droite du logo imprime ; rotation continue.
 * Colonne de pastilles de y 356 a 911 (925 poussee comprise) : au-dessus des
 * bandeaux conditions (lift 109, y >= 1080) et TVA (y >= 1147).
 * Presentoir x >= 700, y ~460 a ~794 (flottement et poussee compris) : ~40 px sous
 * la pastille 1, ~50 px au-dessus de la pastille 5, ~60 px a droite de la pastille 2.
 */
export const A4_INCLUS = { duration: 135, first: 0, step: 15, wave: 78, accent: 90 } as const;

export const A4_PILLS: Array<{ label: string; size?: number }> = [
  { label: "Sans contact et QR code" },
  { label: "Espace Reviu inclus" },
  { label: "Lien modifiable" },
  { label: "Livraison offerte" },
  { label: "30\u00a0jours satisfait ou remboursé*", size: 61 },
];

const TOP = 356;
const ROW = 120;
const PW = 290;

export const A4Inclus: React.FC = () => {
  const frame = useCurrentFrame();
  const I = A4_INCLUS;
  const float = Math.sin(frame / 18) * 5;
  // Acceleration quadratique : deja visible des 255, maximale sur la coupe.
  const push = 1 + 0.05 * prog(frame, 75, I.duration - 75, Easing.in(Easing.quad));
  const last = A4_PILLS.length - 1;
  // Mise en avant de la garantie sur le temps 90.
  const accent = prog(frame, I.accent, 8, EASE.out);
  const pulse = 1 + 0.05 * Math.sin(Math.PI * prog(frame, I.accent, 10, EASE.inOut));

  const cues: Array<[SfxName, number, number?]> = [
    ...A4_PILLS.map((_, i) => ["pop", I.first + i * I.step, i === 0 ? 0.6 : 0.7] as [SfxName, number, number?]),
    ...[0, 1, 2, 3].map((i) => ["tick", I.wave + 3 * i, 0.3] as [SfxName, number, number]),
    ["tick", I.accent, 0.55],
  ];

  return (
    <AbsoluteFill style={{ background: C.brume }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "100px 640px" }}>
        {/* Decor : le presentoir de 3/4, entre la 1re et la 5e pastille. */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 474,
            perspective: 2400,
            transform: `translateY(${float + (1 - prog(frame, 0, 16, EASE.enter)) * 60}px)`,
          }}
        >
          <Presentoir3D
            width={PW}
            rotateY={interpolate(frame, [0, I.duration], [-28, -8])}
            rotateX={3}
            thickness={22}
            shadow={0.4}
            // Reflet a droite du logo imprime (centre de 0,82 a 1,3 de la largeur).
            glare={0.7 + 0.3 * prog(frame, 96, 30, EASE.inOut)}
            glareStrength={0.3}
            focusBlur={5}
          />
        </div>

        {A4_PILLS.map((p, i) => {
          const r = i < last ? Math.sin(Math.PI * prog(frame, I.wave + 3 * i, 10, EASE.inOut)) : 0;
          const k = i === last ? pulse : 1 + 0.04 * r;
          return (
            <div
              key={p.label}
              style={{
                position: "absolute",
                left: 100,
                top: TOP + i * ROW,
                transform: `scale(${k})`,
                transformOrigin: "left center",
              }}
            >
              <A4Pill at={I.first + i * I.step} label={p.label} size={p.size} hi={i === last ? accent : 0} />
            </div>
          );
        })}
      </AbsoluteFill>

      <SfxTrack cues={cues} />
    </AbsoluteFill>
  );
};
