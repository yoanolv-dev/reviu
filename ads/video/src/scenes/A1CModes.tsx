import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, SPRING } from "../theme";
import { mix, pop, prog } from "../lib/anim";
import { Presentoir3D, FACE_RATIO } from "../components/Presentoir3D";
import { Phone } from "../components/Phone";
import { HomeScreen } from "../components/PhoneScreens";
import { CheckPill, NfcWaves } from "../components/Bits";
import { KineticTitle } from "../components/KineticTitle";
import { SfxTrack } from "../components/Sfx";

/**
 * "Sans contact ou QR code" resserre pour la coupe de 15 s (60 frames,
 * copie de ModesScene). Reperes locaux, tous sur les temps (15 frames) :
 * 0 coupe sur le drop et titre, 15 contact du telephone, 30 le telephone
 * repart, 45 crochets verrouilles sur le QR code.
 * Le presentoir est plus petit que dans le master (364 au lieu de 460) : la
 * mention d’independance est posee au-dessus de la bande TVA (lift 109,
 * y 1038 a 1139) ; presentoir entre y 622 et 1008 (pastille au-dessus jusqu’a
 * y 588), QR code en y 887 a 952. Presentoir decale a droite (LEFT 400) : le
 * logo imprime, flou, n’est pas au centre optique ; la mise au point et la
 * poussee de camera sont sur la zone sans contact et le QR.
 */
export const A1C_MODES = { duration: 60, tap: 15, pill: 18, out: 24, qr: 35 } as const;

const W = 364;
const LEFT = 400;
const TOP = 622;

/** Crochets de scan poses sur le QR code du presentoir (copie de ModesScene). */
const QrBrackets: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.snappy);
  const lockAt = at + 10;
  const pulse = frame >= lockAt && frame < lockAt + 6 ? 1 + 0.08 * Math.sin(((frame - lockAt) / 6) * Math.PI) : 1;
  const scan = prog(frame, at, 10, EASE.inOut);
  if (frame < at) return null;
  // Zone du QR : x 70,3 a 87,6 %, y 68,6 a 85,4 % de la face.
  // Les crochets arrivent depuis le cobalt (pad 14), ou l’encre reste lisible.
  const pad = mix(14, 2.2, s);
  const box = { l: 70.3 - pad, t: 68.6 - pad * 0.94, w: 17.3 + pad * 2, h: 16.8 + pad * 1.88 };
  const corner = (r: number, pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: "26%",
        height: "26%",
        borderTop: `12px solid ${C.ink}`,
        borderLeft: `12px solid ${C.ink}`,
        borderTopLeftRadius: 14,
        transform: `rotate(${r}deg)`,
        ...pos,
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: `${box.l}%`,
        top: `${box.t}%`,
        width: `${box.w}%`,
        height: `${box.h}%`,
        opacity: Math.min(1, s * 2),
        transform: `scale(${pulse})`,
        filter: "drop-shadow(0 0 3px rgba(255,255,255,0.9))",
      }}
    >
      {corner(0, { left: 0, top: 0 })}
      {corner(90, { right: 0, top: 0 })}
      {corner(180, { right: 0, bottom: 0 })}
      {corner(270, { left: 0, bottom: 0 })}
      {scan > 0 && scan < 1 && (
        <div style={{ position: "absolute", left: "8%", right: "8%", top: `${8 + scan * 84}%`, height: 8, borderRadius: 4, background: C.cobalt }} />
      )}
    </div>
  );
};

export const A1CModes: React.FC = () => {
  const frame = useCurrentFrame();
  const M = A1C_MODES;
  const H = W * FACE_RATIO;
  const nfc = { x: LEFT + 0.3 * W, y: TOP + 0.76 * H };

  // Le telephone monte d’un seul geste par le bas (il entre dans le champ
  // vers la frame 12, jamais de lisere fige au bord), touche la zone sans
  // contact pile sur le temps (M.tap), puis repart.
  const approach = interpolate(frame, [5, M.tap], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE.in,
  });
  const outP = prog(frame, M.out, 12, EASE.exit);
  const squash = frame >= M.tap && frame < M.tap + 5 ? 0.975 : 1;
  const phX = mix(nfc.x + 180, nfc.x + 30, approach) - outP * 160;
  const phY = mix(2300, nfc.y + 250, approach) + outP * 1500;
  const phRot = mix(14, -6, approach);

  // Petite poussee de camera continue : l’image ne s’arrete jamais.
  const push = 1 + 0.025 * prog(frame, 0, M.duration, EASE.inOut);
  const bump = 1 + 0.015 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (frame - M.tap) / 8)) * Math.PI));

  return (
    <AbsoluteFill style={{ background: C.cobalt }}>
      <AbsoluteFill style={{ transform: `scale(${push * bump})`, transformOrigin: `${nfc.x}px ${nfc.y}px` }}>
        <div style={{ position: "absolute", left: LEFT, top: TOP, perspective: 2400 }}>
          <Presentoir3D
            width={W}
            rotateY={interpolate(frame, [0, M.duration], [-16, -6])}
            rotateX={2}
            thickness={20}
            shadow={0.35}
            glare={prog(frame, 4, 36, EASE.inOut)}
            glareStrength={0.3}
            focusBlur={5}
          >
            <QrBrackets at={M.qr} />
          </Presentoir3D>
        </div>
        <NfcWaves at={M.tap} size={320} color={C.white} style={{ left: nfc.x - 160, top: nfc.y - 160 }} />
        {outP < 1 && approach > 0 && (
          <div
            style={{
              position: "absolute",
              left: phX - 150,
              top: phY - 307,
              transform: `rotate(${phRot}deg) scale(${squash})`,
            }}
          >
            <Phone width={300} statusBar={false}>
              <HomeScreen width={300 * 0.93} />
            </Phone>
          </div>
        )}
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text={"Sans contact\nou QR code"} size={96} color={C.white} at={0} stagger={2} dot />
      </div>
      <div style={{ position: "absolute", left: 100, top: 512 }}>
        <CheckPill at={M.pill} label="iPhone et Android" dark />
      </div>

      <SfxTrack
        cues={[
          ["tap", M.tap, 0.8],
          ["nfc", M.tap + 1, 0.45],
          ["pop", M.pill],
          ["whoosh-short", M.out + 4, 0.7],
          ["tick", M.qr],
          ["click", M.qr + 10],
        ]}
      />
    </AbsoluteFill>
  );
};
