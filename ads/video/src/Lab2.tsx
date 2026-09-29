import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./theme";
import { prog } from "./lib/anim";
import { CheckPill, CtaButton, Logo, NfcWaves, Notification, SafeZones, StarRow, WaveWipe } from "./components/Bits";
import { KineticTitle } from "./components/KineticTitle";

export const Lab2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <WaveWipe progress={prog(f, 0, 30)} color={C.cobalt} />
      <div style={{ position: "absolute", top: 280, left: 72 }}>
        <KineticTitle text={"Un geste\nsuffit"} size={130} color={C.white} dot at={10} />
      </div>
      <StarRow at={20} size={110} style={{ position: "absolute", top: 600, left: 80 }} />
      <div style={{ position: "absolute", top: 780, left: 80, display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
        <CheckPill at={25} label="Sans abonnement" dark />
        <CheckPill at={29} label="Livraison offerte" dark />
        <CheckPill at={33} label="Satisfait ou remboursé 30 jours" dark />
      </div>
      <Notification at={30} title="Nouvel avis" body="★★★★★ sur votre fiche Google" style={{ position: "absolute", top: 1100, left: 90 }} width={800} />
      <NfcWaves at={30} size={300} color={C.white} style={{ left: 700, top: 560 }} />
      <CtaButton at={40} label="Commander sur reviu.fr" style={{ position: "absolute", top: 1250, left: 80 }} />
      <Logo variant="blanc" height={70} style={{ position: "absolute", top: 1450, left: 80 }} />
      <SafeZones />
    </AbsoluteFill>
  );
};
