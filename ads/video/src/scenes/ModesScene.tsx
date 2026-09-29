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

const W = 560;
const LEFT = 260;
const TOP = 560;

/** Crochets de scan poses sur le QR code du presentoir (coordonnees de la face). */
const QrBrackets: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, fps, at, SPRING.snappy);
  const lock = frame >= at + 10;
  if (frame < at) return null;
  // Zone du QR : x 70,3 a 87,6 %, y 68,6 a 85,4 % de la face.
  const pad = mix(9, 2.2, s);
  const box = { l: 70.3 - pad, t: 68.6 - pad * 0.94, w: 17.3 + pad * 2, h: 16.8 + pad * 1.88 };
  const col = lock ? C.gold : C.white;
  const corner = (r: number, pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: "26%",
        height: "26%",
        borderTop: `7px solid ${col}`,
        borderLeft: `7px solid ${col}`,
        borderTopLeftRadius: 12,
        transform: `rotate(${r}deg)`,
        ...pos,
      }}
    />
  );
  return (
    <div style={{ position: "absolute", left: `${box.l}%`, top: `${box.t}%`, width: `${box.w}%`, height: `${box.h}%`, opacity: Math.min(1, s * 2) }}>
      {corner(0, { left: 0, top: 0 })}
      {corner(90, { right: 0, top: 0 })}
      {corner(180, { right: 0, bottom: 0 })}
      {corner(270, { left: 0, bottom: 0 })}
    </div>
  );
};

/** "Sans contact ou QR code" : les deux gestes, sur le presentoir exact. */
export const ModesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const H = W * FACE_RATIO;
  const nfc = { x: LEFT + 0.3 * W, y: TOP + 0.76 * H };

  // Telephone qui vient toucher la zone sans contact (frame 15 = le "drop"
  // de la musique) puis redescend.
  const inP = pop(frame, fps, 3, SPRING.tap);
  const outP = prog(frame, 34, 12, EASE.exit);
  const phX = mix(-200, nfc.x + 30, inP) - outP * 160;
  const phY = mix(1900, nfc.y + 250, inP) + outP * 900;

  return (
    <AbsoluteFill style={{ background: C.cobalt }}>
      <div style={{ position: "absolute", left: 100, top: 292 }}>
        <KineticTitle text={"Sans contact\nou QR code"} size={104} color={C.white} at={2} dot />
      </div>
      <div style={{ position: "absolute", left: 100, top: 1170 }}>
        <CheckPill at={58} label="iPhone et Android" dark size={52} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: TOP, perspective: 2400 }}>
        <Presentoir3D
          width={W}
          rotateY={interpolate(frame, [0, 90], [-16, -4])}
          rotateX={2}
          thickness={22}
          shadow={0.35}
          glare={prog(frame, 8, 40, EASE.inOut)}
          glareStrength={0.3}
        >
          <QrBrackets at={44} />
        </Presentoir3D>
      </div>
      <NfcWaves at={15} size={440} color={C.white} style={{ left: nfc.x - 220, top: nfc.y - 220 }} />
      <div style={{ position: "absolute", left: phX - 150, top: phY - 307, transform: `rotate(${mix(24, -6, inP)}deg)` }}>
        <Phone width={300} statusBar={false}>
          <HomeScreen width={300 * 0.93} />
        </Phone>
      </div>
      <SfxTrack
        cues={[
          ["whoosh-short", 2],
          ["tap", 15],
          ["nfc", 16, 0.45],
          ["whoosh-short", 36],
          ["tick", 44],
          ["click", 54],
          ["pop", 58],
        ]}
      />
    </AbsoluteFill>
  );
};
